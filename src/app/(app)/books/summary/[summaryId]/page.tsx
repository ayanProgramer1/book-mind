import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { requireUserId } from "@/lib/session";
import { prisma } from "@/server/db";
import { summaryContentSchema } from "@/lib/validations/ai";
import type { SummaryContent } from "@/types";
import { SummaryView } from "@/components/app/summary-view";
import { Badge } from "@/components/ui/badge";
import { getServerDictionary } from "@/i18n/server";
import { ReadConfirm } from "./read-confirm";

export const metadata: Metadata = { title: "Rezumat" };

export default async function SummaryPage({
  params,
}: {
  params: Promise<{ summaryId: string }>;
}) {
  const { summaryId } = await params;
  const userId = await requireUserId();
  const t = await getServerDictionary();

  const summary = await prisma.summary.findFirst({
    where: { id: summaryId, book: { userId } },
    include: { book: true, quiz: true },
  });

  if (!summary) notFound();

  const parsed = summaryContentSchema.safeParse(summary.content);
  if (!parsed.success) notFound();
  const content = parsed.data as SummaryContent;

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href={`/books/${summary.bookId}`}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {t.summaryPage.backToBook}
      </Link>

      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={summary.type === "CHAPTER" ? "sky" : "default"}>
            {summary.type === "CHAPTER"
              ? (summary.chapterLabel ?? t.common.chapter)
              : t.common.fullSummary}
          </Badge>
          {summary.markedRead && <Badge variant="emerald">{t.common.read}</Badge>}
        </div>
        <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
          {summary.book.title}
        </h1>
        {summary.book.authors && (
          <p className="mt-1 text-muted-foreground">{summary.book.authors}</p>
        )}
      </div>

      <SummaryView content={content} />

      <ReadConfirm
        summaryId={summary.id}
        initialRead={summary.markedRead}
        quizCompleted={summary.quiz?.completed ?? false}
      />
    </div>
  );
}
