import type { Metadata } from "next";
import Link from "next/link";
import { Clock, FileText, PlusCircle } from "lucide-react";

import { requireUserId } from "@/lib/session";
import { prisma } from "@/server/db";
import { formatDate, formatDuration } from "@/lib/utils";
import { getServerDictionary, getLocale } from "@/i18n/server";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookCover } from "@/components/app/book-cover";
import { EmptyState } from "@/components/app/empty-state";

export const metadata: Metadata = { title: "Istoric" };

export default async function HistoryPage() {
  const userId = await requireUserId();
  const t = await getServerDictionary();
  const locale = await getLocale();

  const books = await prisma.book.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      summaries: {
        orderBy: { createdAt: "desc" },
        include: { quiz: true },
      },
    },
  });

  const hasHistory = books.length > 0;

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title={t.history.title}
        description={t.history.subtitle}
        action={
          <Button asChild variant="gradient">
            <Link href="/books/new">
              <PlusCircle className="h-4 w-4" />
              {t.app.newBook}
            </Link>
          </Button>
        }
      />

      {!hasHistory ? (
        <EmptyState
          title={t.history.emptyTitle}
          description={t.history.emptyDesc}
          actionHref="/books/new"
          actionLabel={t.history.addBook}
        />
      ) : (
        <div className="space-y-4">
          {books.map((book) => (
            <div
              key={book.id}
              className="rounded-2xl border bg-card p-5 shadow-soft"
            >
              <div className="flex gap-4">
                <Link href={`/books/${book.id}`} className="w-16 shrink-0">
                  <BookCover url={book.coverUrl} title={book.title} sizes="64px" />
                </Link>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <Link
                        href={`/books/${book.id}`}
                        className="truncate font-semibold hover:text-primary"
                      >
                        {book.title}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {book.authors || t.common.unknownAuthor}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {formatDate(book.createdAt, locale)}
                    </span>
                  </div>

                  {book.summaries.length === 0 ? (
                    <p className="mt-3 text-sm text-muted-foreground">
                      {t.history.noSummaryYet}{" "}
                      <Link
                        href={`/books/${book.id}`}
                        className="text-primary hover:underline"
                      >
                        {t.history.generateOne}
                      </Link>
                    </p>
                  ) : (
                    <div className="mt-3 space-y-2">
                      {book.summaries.map((s) => (
                        <Link
                          key={s.id}
                          href={
                            s.quiz?.completed
                              ? `/books/quiz/${s.quiz.id}/results`
                              : `/books/summary/${s.id}`
                          }
                          className="flex items-center justify-between rounded-xl border bg-secondary/30 px-3 py-2 transition-colors hover:border-primary/40"
                        >
                          <div className="flex min-w-0 items-center gap-2">
                            <FileText className="h-4 w-4 shrink-0 text-primary" />
                            <span className="truncate text-sm">
                              {s.type === "CHAPTER"
                                ? (s.chapterLabel ?? t.common.chapter)
                                : t.common.fullSummary}
                            </span>
                          </div>
                          <div className="flex shrink-0 items-center gap-2">
                            {s.quiz?.completed ? (
                              <>
                                {s.quiz.timeSpentMs != null && (
                                  <span className="hidden items-center gap-1 text-xs text-muted-foreground sm:flex">
                                    <Clock className="h-3 w-3" />
                                    {formatDuration(s.quiz.timeSpentMs)}
                                  </span>
                                )}
                                <Badge variant="emerald">
                                  {s.quiz.score}/{s.quiz.total} ·{" "}
                                  {s.quiz.percentage}%
                                </Badge>
                              </>
                            ) : s.markedRead ? (
                              <Badge variant="sky">{t.history.testAvailable}</Badge>
                            ) : (
                              <Badge variant="amber">{t.common.toRead}</Badge>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
