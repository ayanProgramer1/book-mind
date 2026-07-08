import type { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen,
  Brain,
  TrendingUp,
  Trophy,
  PlusCircle,
  ArrowRight,
  Clock,
} from "lucide-react";

import { CheckCircle2, Crown } from "lucide-react";

import { requireUserId } from "@/lib/session";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/server/db";
import { getUserStats } from "@/server/stats";
import { getSubscription } from "@/server/subscription";
import { isStripeConfigured } from "@/lib/stripe";
import { formatDate, performanceLevel } from "@/lib/utils";
import { getServerDictionary, getLocale } from "@/i18n/server";
import { fmt } from "@/i18n/config";
import { PageHeader } from "@/components/app/page-header";
import { StatCard } from "@/components/app/stat-card";
import { UpgradeButton } from "@/components/upgrade-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/app/empty-state";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ upgraded?: string; welcome?: string }>;
}) {
  const userId = await requireUserId();
  const user = await getCurrentUser();
  const stats = await getUserStats(userId);
  const t = await getServerDictionary();
  const locale = await getLocale();
  const sub = await getSubscription(userId);
  const { upgraded, welcome } = await searchParams;
  const paymentsEnabled = isStripeConfigured();

  const [recentSummaries, recentTests] = await Promise.all([
    prisma.summary.findMany({
      where: { book: { userId } },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { book: true, quiz: true },
    }),
    prisma.quiz.findMany({
      where: { userId, completed: true },
      orderBy: { completedAt: "desc" },
      take: 5,
      include: { summary: { include: { book: true } } },
    }),
  ]);

  const firstName = user?.name?.split(" ")[0] ?? t.dashboard.fallbackName;

  return (
    <div>
      <PageHeader
        title={fmt(t.dashboard.greeting, { name: firstName })}
        description={t.dashboard.overview}
        action={
          <Button asChild variant="gradient">
            <Link href="/books/new">
              <PlusCircle className="h-4 w-4" />
              {t.app.newBook}
            </Link>
          </Button>
        }
      />

      {paymentsEnabled && upgraded && sub.isPro && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-4">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
          <p className="text-sm font-medium">{t.billing.upgradedToast}</p>
        </div>
      )}

      {paymentsEnabled && !sub.isPro && (
        <div className="mb-6 flex flex-col items-start justify-between gap-4 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/5 to-sky-500/5 px-5 py-4 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <Crown className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
            <div>
              <p className="font-semibold">
                {welcome ? t.billing.welcomeTitle : t.billing.upgradeBannerTitle}
              </p>
              <p className="text-sm text-muted-foreground">
                {welcome ? t.billing.welcomeDesc : t.billing.upgradeBannerDesc}
              </p>
            </div>
          </div>
          <UpgradeButton size="default" className="w-full shrink-0 sm:w-auto" />
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={BookOpen}
          label={t.dashboard.statBooks}
          value={stats.booksCount}
          accent="text-primary"
        />
        <StatCard
          icon={Brain}
          label={t.dashboard.statSummaries}
          value={stats.summariesCount}
          accent="text-sky-500"
        />
        <StatCard
          icon={TrendingUp}
          label={t.dashboard.statTests}
          value={stats.testsCompleted}
          accent="text-cyan-500"
        />
        <StatCard
          icon={Trophy}
          label={t.dashboard.statAvg}
          value={`${stats.averageScore}%`}
          hint={fmt(t.dashboard.best, { n: stats.bestScore })}
          accent="text-amber-500"
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>{t.dashboard.recentSummaries}</CardTitle>
            <Link
              href="/history"
              className="text-sm text-primary hover:underline"
            >
              {t.common.seeAll}
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentSummaries.length === 0 ? (
              <EmptyState
                compact
                title={t.dashboard.noSummaries}
                description={t.dashboard.noSummariesDesc}
                actionHref="/books/new"
                actionLabel={t.app.newBook}
              />
            ) : (
              recentSummaries.map((s) => (
                <Link
                  key={s.id}
                  href={`/books/summary/${s.id}`}
                  className="flex items-center justify-between rounded-xl border bg-card/60 px-4 py-3 transition-colors hover:border-primary/40 hover:bg-secondary/50"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {s.book.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {s.type === "CHAPTER"
                        ? (s.chapterLabel ?? t.common.chapter)
                        : t.common.fullSummary}{" "}
                      · {formatDate(s.createdAt, locale)}
                    </p>
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
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>{t.dashboard.latestTests}</CardTitle>
            <Link
              href="/history"
              className="text-sm text-primary hover:underline"
            >
              {t.common.seeAll}
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentTests.length === 0 ? (
              <EmptyState
                compact
                title={t.dashboard.noTests}
                description={t.dashboard.noTestsDesc}
              />
            ) : (
              recentTests.map((q) => {
                const level = performanceLevel(q.percentage ?? 0);
                return (
                  <Link
                    key={q.id}
                    href={`/books/quiz/${q.id}/results`}
                    className="flex items-center justify-between rounded-xl border bg-card/60 px-4 py-3 transition-colors hover:border-primary/40 hover:bg-secondary/50"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {q.summary.book.title}
                      </p>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {q.completedAt ? formatDate(q.completedAt, locale) : ""}
                      </p>
                    </div>
                    <Badge variant={level.tone}>
                      {q.score}/{q.total} · {q.percentage}%
                    </Badge>
                  </Link>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
