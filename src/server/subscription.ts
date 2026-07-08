import "server-only";
import { prisma } from "@/server/db";

/** Free users may create at most this many summaries in total. */
export const FREE_SUMMARY_LIMIT = 2;

export type Plan = "FREE" | "PRO";

export type SubscriptionInfo = {
  plan: Plan;
  isPro: boolean;
  status: string | null;
  currentPeriodEnd: Date | null;
  hasCustomer: boolean;
};

const ACTIVE_STATUSES = new Set(["active", "trialing"]);

/** Reads the user's Stripe mirror fields and derives the current plan. */
export async function getSubscription(userId: string): Promise<SubscriptionInfo> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      stripeCustomerId: true,
      stripeSubscriptionStatus: true,
      stripeCurrentPeriodEnd: true,
    },
  });

  const status = user?.stripeSubscriptionStatus ?? null;
  const currentPeriodEnd = user?.stripeCurrentPeriodEnd ?? null;
  const notExpired =
    !currentPeriodEnd || currentPeriodEnd.getTime() > Date.now();
  const isPro = Boolean(status && ACTIVE_STATUSES.has(status) && notExpired);

  return {
    plan: isPro ? "PRO" : "FREE",
    isPro,
    status,
    currentPeriodEnd,
    hasCustomer: Boolean(user?.stripeCustomerId),
  };
}

/** Convenience boolean — is the user on an active Pro subscription? */
export async function isProUser(userId: string): Promise<boolean> {
  return (await getSubscription(userId)).isPro;
}

/** Total number of summaries the user has generated (across all their books). */
export function countUserSummaries(userId: string): Promise<number> {
  return prisma.summary.count({ where: { book: { userId } } });
}

/** How many free summaries remain (0 for Pro handled by caller). */
export async function freeSummariesRemaining(userId: string): Promise<number> {
  const used = await countUserSummaries(userId);
  return Math.max(0, FREE_SUMMARY_LIMIT - used);
}
