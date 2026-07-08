import type { Metadata } from "next";
import {
  BookOpen,
  Brain,
  TrendingUp,
  Trophy,
  Mail,
  User,
  ShieldCheck,
} from "lucide-react";

import { requireUserId, getCurrentUser } from "@/lib/session";
import { getUserStats } from "@/server/stats";
import {
  getSubscription,
  countUserSummaries,
  FREE_SUMMARY_LIMIT,
} from "@/server/subscription";
import { isStripeConfigured } from "@/lib/stripe";
import { initials, formatDate } from "@/lib/utils";
import { getServerDictionary, getLocale } from "@/i18n/server";
import { fmt } from "@/i18n/config";
import { PageHeader } from "@/components/app/page-header";
import { StatCard } from "@/components/app/stat-card";
import { SubscriptionCard } from "@/components/app/subscription-card";
import { ChangePasswordForm } from "@/components/app/change-password-form";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const metadata: Metadata = { title: "Profil" };

export default async function ProfilePage() {
  const userId = await requireUserId();
  const user = await getCurrentUser();
  const stats = await getUserStats(userId);
  const t = await getServerDictionary();
  const locale = await getLocale();
  const sub = await getSubscription(userId);
  const summariesUsed = await countUserSummaries(userId);
  const renewsOn = sub.currentPeriodEnd
    ? formatDate(sub.currentPeriodEnd, locale)
    : null;
  const paymentsEnabled = isStripeConfigured();

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title={t.profile.title} description={t.profile.subtitle} />

      <Card className="mb-6 overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-primary to-sky-500" />
        <CardContent className="-mt-10 pb-6">
          <Avatar className="h-20 w-20 border-4 border-card shadow-soft">
            {user?.image ? (
              <AvatarImage src={user.image} alt={user.name ?? ""} />
            ) : null}
            <AvatarFallback className="text-xl">
              {initials(user?.name, user?.email)}
            </AvatarFallback>
          </Avatar>
          <h2 className="mt-4 text-xl font-bold">
            {user?.name ?? t.profile.fallbackName}
          </h2>
          <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {user?.name ?? "—"}
            </p>
            <p className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              {user?.email}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={BookOpen}
          label={t.profile.statBooks}
          value={stats.booksCount}
        />
        <StatCard
          icon={Brain}
          label={t.profile.statSummaries}
          value={stats.summariesCount}
          accent="text-sky-500"
        />
        <StatCard
          icon={TrendingUp}
          label={t.profile.statTests}
          value={stats.testsCompleted}
          accent="text-cyan-500"
        />
        <StatCard
          icon={Trophy}
          label={t.profile.statAvg}
          value={`${stats.averageScore}%`}
          accent="text-amber-500"
        />
      </div>

      <Card className="mt-6">
        <CardContent className="p-6">
          <div className="mb-2 flex items-center justify-between">
            <p className="font-medium">{t.profile.overallProgress}</p>
            <span className="text-sm font-semibold text-primary">
              {stats.averageScore}%
            </span>
          </div>
          <Progress value={stats.averageScore} className="h-4" />
          <p className="mt-3 text-sm text-muted-foreground">
            {fmt(t.profile.progressDesc, { n: stats.bestScore })}
          </p>
        </CardContent>
      </Card>

      {paymentsEnabled && (
        <div className="mt-6">
          <SubscriptionCard
            isPro={sub.isPro}
            renewsOn={renewsOn}
            summariesUsed={summariesUsed}
            limit={FREE_SUMMARY_LIMIT}
          />
        </div>
      )}

      <Card className="mt-6">
        <CardContent className="p-6">
          <div className="mb-1 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <p className="font-semibold">{t.password.sectionTitle}</p>
          </div>
          <p className="mb-4 text-sm text-muted-foreground">
            {t.password.desc}
          </p>
          <ChangePasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}
