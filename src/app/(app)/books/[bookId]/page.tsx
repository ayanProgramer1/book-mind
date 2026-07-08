import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, FileText } from "lucide-react";

import { requireUserId } from "@/lib/session";
import { prisma } from "@/server/db";
import { formatDate } from "@/lib/utils";
import { getServerDictionary, getLocale } from "@/i18n/server";
import { BookCover } from "@/components/app/book-cover";
import { Badge } from "@/components/ui/badge";
import { SummaryGenerator } from "./summary-generator";

export const metadata: Metadata = { title: "Carte" };

export default async function BookPage({
  params,
}: {
  params: Promise<{ bookId: string }>;
}) {
  const { bookId } = await params;
  const userId = await requireUserId();
  const t = await getServerDictionary();
  const locale = await getLocale();

  const book = await prisma.book.findFirst({
    where: { id: bookId, userId },
    include: {
      summaries: {
        orderBy: { createdAt: "desc" },
        include: { quiz: true },
      },
    },
  });

  if (!book) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 flex gap-5">
        <div className="w-28 shrink-0 sm:w-32">
          <BookCover url={book.coverUrl} title={book.title} sizes="128px" />
        </div>
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight">{book.title}</h1>
          <p className="mt-1 text-muted-foreground">
            {book.authors || t.common.unknownAuthor}
            {book.publishedYear ? ` · ${book.publishedYear}` : ""}
          </p>
          {book.description && (
            <p className="mt-3 line-clamp-4 text-sm text-muted-foreground">
              {book.description}
            </p>
          )}
        </div>
      </div>

      {book.summaries.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
            {t.bookPage.existingSummaries}
          </h2>
          <div className="space-y-2">
            {book.summaries.map((s) => (
              <Link
                key={s.id}
                href={`/books/summary/${s.id}`}
                className="flex items-center justify-between rounded-xl border bg-card/60 px-4 py-3 transition-colors hover:border-primary/40 hover:bg-secondary/50"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">
                      {s.type === "CHAPTER"
                        ? (s.chapterLabel ?? t.common.chapter)
                        : t.common.fullSummary}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(s.createdAt, locale)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {s.quiz?.completed ? (
                    <Badge variant="emerald">{s.quiz.percentage}%</Badge>
                  ) : s.markedRead ? (
                    <Badge variant="sky">{t.common.read}</Badge>
                  ) : (
                    <Badge variant="amber">{t.common.toRead}</Badge>
                  )}
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
        {t.bookPage.generateNew}
      </h2>
      <SummaryGenerator bookId={book.id} />
    </div>
  );
}
