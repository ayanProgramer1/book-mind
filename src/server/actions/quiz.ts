"use server";

import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";

import { requireUserId } from "@/lib/session";
import { prisma } from "@/server/db";
import { generateFlashcards, explainWrongAnswers } from "@/server/ai/generate";
import { getLocale } from "@/i18n/server";
import { submitQuizSchema } from "@/lib/validations/book";
import { summaryContentSchema } from "@/lib/validations/ai";
import type { SummaryContent } from "@/types";

/** Create (or reuse) the quiz for a summary and generate its flashcards. */
export async function createQuizAction(
  summaryId: string,
): Promise<{ ok: true; quizId: string } | { ok: false; error: string }> {
  const userId = await requireUserId();

  const summary = await prisma.summary.findFirst({
    where: { id: summaryId, book: { userId } },
    include: { quiz: true },
  });
  if (!summary) return { ok: false, error: "Rezumatul nu a fost găsit." };
  if (!summary.markedRead) {
    return { ok: false, error: "Confirmă mai întâi că ai citit rezumatul." };
  }

  // A quiz already exists (and hasn't been completed) — reuse it.
  if (summary.quiz && !summary.quiz.completed) {
    return { ok: true, quizId: summary.quiz.id };
  }
  if (summary.quiz?.completed) {
    return { ok: true, quizId: summary.quiz.id };
  }

  try {
    const content = summaryContentSchema.parse(summary.content);
    const cards = await generateFlashcards(content, await getLocale());

    const quiz = await prisma.quiz.create({
      data: {
        summaryId: summary.id,
        userId,
        total: cards.length,
        flashcards: {
          create: cards.map((card, index) => ({
            order: index,
            type: card.type,
            question: card.question,
            options: (card.options ?? undefined) as
              | Prisma.InputJsonValue
              | undefined,
            correctAnswer: card.correctAnswer,
            reference: card.reference ?? null,
          })),
        },
      },
    });

    return { ok: true, quizId: quiz.id };
  } catch (error) {
    console.error("createQuizAction failed", error);
    return {
      ok: false,
      error: "Generarea flashcard-urilor a eșuat. Încearcă din nou.",
    };
  }
}

function normalize(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function isCorrect(
  type: string,
  userAnswer: string,
  correctAnswer: string,
): boolean {
  const u = normalize(userAnswer);
  const c = normalize(correctAnswer);
  if (!u) return false;
  if (type === "SHORT_ANSWER") {
    // Lenient: exact normalized match, or meaningful overlap either way.
    if (u === c) return true;
    if (c.length > 4 && (u.includes(c) || c.includes(u))) return true;
    return false;
  }
  return u === c;
}

export async function submitQuizAction(
  input: unknown,
): Promise<{ ok: true; quizId: string } | { ok: false; error: string }> {
  const userId = await requireUserId();
  const parsed = submitQuizSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Răspunsuri invalide." };
  }
  const { quizId, answers, timeSpentMs } = parsed.data;

  const quiz = await prisma.quiz.findFirst({
    where: { id: quizId, userId },
    include: { flashcards: true, summary: true },
  });
  if (!quiz) return { ok: false, error: "Testul nu a fost găsit." };
  if (quiz.completed) return { ok: true, quizId: quiz.id };

  const answerMap = new Map(answers.map((a) => [a.flashcardId, a.answer]));

  const graded = quiz.flashcards.map((card) => {
    const userAnswer = answerMap.get(card.id) ?? "";
    const correct = isCorrect(card.type, userAnswer, card.correctAnswer);
    return { card, userAnswer, correct };
  });

  const score = graded.filter((g) => g.correct).length;
  const total = quiz.flashcards.length;
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  // Generate AI explanations for the wrong answers.
  let explanations: Array<{
    flashcardId: string;
    explanation: string;
    reference?: string;
  }> = [];
  const wrong = graded.filter((g) => !g.correct);
  if (wrong.length > 0) {
    try {
      const content = summaryContentSchema.parse(
        quiz.summary.content,
      ) as SummaryContent;
      explanations = await explainWrongAnswers(
        content,
        wrong.map((g) => ({
          flashcardId: g.card.id,
          question: g.card.question,
          userAnswer: g.userAnswer,
          correctAnswer: g.card.correctAnswer,
          reference: g.card.reference,
        })),
        await getLocale(),
      );
    } catch (error) {
      console.error("explainWrongAnswers failed", error);
    }
  }
  const explanationMap = new Map(
    explanations.map((e) => [e.flashcardId, e]),
  );

  // Persist everything in a transaction.
  await prisma.$transaction(async (tx) => {
    await tx.answer.deleteMany({ where: { quizId: quiz.id } });
    await tx.answer.createMany({
      data: graded.map((g) => ({
        quizId: quiz.id,
        flashcardId: g.card.id,
        userAnswer: g.userAnswer,
        isCorrect: g.correct,
        explanation: g.correct
          ? null
          : (explanationMap.get(g.card.id)?.explanation ?? null),
      })),
    });

    await tx.quiz.update({
      where: { id: quiz.id },
      data: {
        score,
        total,
        percentage,
        completed: true,
        completedAt: new Date(),
        timeSpentMs: timeSpentMs ?? null,
      },
    });

    await tx.progress.upsert({
      where: { quizId: quiz.id },
      create: {
        userId,
        quizId: quiz.id,
        score,
        total,
        percentage,
        timeSpentMs: timeSpentMs ?? null,
      },
      update: { score, total, percentage, timeSpentMs: timeSpentMs ?? null },
    });
  });

  revalidatePath("/dashboard");
  revalidatePath("/history");
  return { ok: true, quizId: quiz.id };
}
