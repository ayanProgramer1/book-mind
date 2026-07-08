import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  BookOpen,
  Home,
  RotateCcw,
  Lightbulb,
} from "lucide-react";

import { requireUserId } from "@/lib/session";
import { prisma } from "@/server/db";
import { formatDuration } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getServerDictionary } from "@/i18n/server";
import { fmt } from "@/i18n/config";
import { ScoreReveal } from "./score-reveal";

export const metadata: Metadata = { title: "Rezultate" };

export default async function ResultsPage({
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
      summary: { include: { book: true } },
      flashcards: { orderBy: { order: "asc" } },
      answers: true,
    },
  });

  if (!quiz) notFound();
  if (!quiz.completed) redirect(`/books/quiz/${quiz.id}`);

  const answerByCard = new Map(quiz.answers.map((a) => [a.flashcardId, a]));
  const wrong = quiz.flashcards.filter(
    (f) => answerByCard.get(f.id)?.isCorrect === false,
  );

  return (
    <div className="mx-auto max-w-2xl">
      <ScoreReveal
        score={quiz.score ?? 0}
        total={quiz.total}
        percentage={quiz.percentage ?? 0}
      />

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground">
        <BookOpen className="h-4 w-4" />
        {quiz.summary.book.title}
        {quiz.timeSpentMs != null && (
          <span>· {fmt(t.results.time, { t: formatDuration(quiz.timeSpentMs) })}</span>
        )}
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        <Button asChild variant="outline">
          <Link href={`/books/summary/${quiz.summaryId}`}>
            <RotateCcw className="h-4 w-4" />
            {t.results.rereadSummary}
          </Link>
        </Button>
        <Button asChild variant="gradient">
          <Link href="/dashboard">
            <Home className="h-4 w-4" />
            {t.results.backDashboard}
          </Link>
        </Button>
      </div>

      {/* Explanations for wrong answers */}
      {wrong.length > 0 ? (
        <div className="mt-10">
          <h2 className="mb-1 flex items-center gap-2 text-lg font-semibold">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            {fmt(t.results.learnFromMistakes, { n: wrong.length })}
          </h2>
          <p className="mb-5 text-sm text-muted-foreground">
            {t.results.learnDesc}
          </p>
          <div className="space-y-4">
            {wrong.map((card, i) => {
              const answer = answerByCard.get(card.id);
              return (
                <div
                  key={card.id}
                  className="rounded-2xl border bg-card p-5 shadow-soft"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-rose-500/10 text-xs font-bold text-rose-600">
                      {i + 1}
                    </span>
                    <p className="font-medium leading-snug">{card.question}</p>
                  </div>

                  <div className="mt-4 space-y-2 pl-9">
                    <div className="flex items-start gap-2 rounded-lg bg-rose-500/5 px-3 py-2">
                      <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                      <p className="text-sm">
                        <span className="text-muted-foreground">
                          {t.results.yourAnswer}
                        </span>
                        {answer?.userAnswer?.trim() || t.results.noAnswer}
                      </p>
                    </div>
                    <div className="flex items-start gap-2 rounded-lg bg-emerald-500/5 px-3 py-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      <p className="text-sm">
                        <span className="text-muted-foreground">
                          {t.results.correctAnswer}
                        </span>
                        <span className="font-medium">{card.correctAnswer}</span>
                      </p>
                    </div>
                    {answer?.explanation && (
                      <div className="rounded-lg bg-secondary/60 px-3 py-2.5">
                        <p className="text-sm leading-relaxed">
                          {answer.explanation}
                        </p>
                      </div>
                    )}
                    {card.reference && (
                      <Badge variant="secondary" className="mt-1">
                        <BookOpen className="h-3 w-3" />
                        {card.reference}
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="mt-10 rounded-2xl border border-emerald-200 bg-emerald-500/5 p-6 text-center">
          <CheckCircle2 className="mx-auto mb-2 h-8 w-8 text-emerald-500" />
          <p className="font-semibold">{t.results.perfect}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {t.results.perfectDesc}
          </p>
        </div>
      )}
    </div>
  );
}
