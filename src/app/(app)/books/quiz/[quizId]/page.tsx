import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";

import { requireUserId } from "@/lib/session";
import { prisma } from "@/server/db";
import { PageHeader } from "@/components/app/page-header";
import { getServerDictionary } from "@/i18n/server";
import { QuizRunner, type RunnerCard } from "./quiz-runner";

export const metadata: Metadata = { title: "Test" };

const optionsSchema = z.array(z.string()).nullable().catch(null);

export default async function QuizPage({
  params,
}: {
  params: Promise<{ quizId: string }>;
}) {
  const { quizId } = await params;
  const userId = await requireUserId();
  const t = await getServerDictionary();

  const quiz = await prisma.quiz.findFirst({
    where: { id: quizId, userId },
    include: {
      flashcards: { orderBy: { order: "asc" } },
      summary: { include: { book: true } },
    },
  });

  if (!quiz) notFound();
  if (quiz.completed) redirect(`/books/quiz/${quiz.id}/results`);

  const cards: RunnerCard[] = quiz.flashcards.map((f) => ({
    id: f.id,
    type: f.type as RunnerCard["type"],
    question: f.question,
    options: optionsSchema.parse(f.options),
  }));

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title={t.quiz.title}
        description={`${quiz.summary.book.title} · ${t.quiz.cards15}`}
      />
      <QuizRunner quizId={quiz.id} cards={cards} />
    </div>
  );
}
