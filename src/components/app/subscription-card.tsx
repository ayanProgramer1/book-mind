"use client";

import { useTransition } from "react";
import { Loader2, Crown, Settings, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { createBillingPortalSession } from "@/server/actions/billing";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UpgradeButton } from "@/components/upgrade-button";
import { fmt } from "@/i18n/config";
import { useT } from "@/i18n/context";

export function SubscriptionCard({
  isPro,
  renewsOn,
  summariesUsed,
  limit,
}: {
  isPro: boolean;
  renewsOn: string | null;
  summariesUsed: number;
  limit: number;
}) {
  const t = useT();
  const [isPending, startTransition] = useTransition();

  function manage() {
    startTransition(async () => {
      const res = await createBillingPortalSession();
      if (res.ok) window.location.href = res.url;
      else toast.error(res.error);
    });
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              {isPro ? (
                <Crown className="h-5 w-5 text-amber-500" />
              ) : (
                <Sparkles className="h-5 w-5 text-primary" />
              )}
              <p className="font-semibold">
                {t.billing.yourPlan}:{" "}
                <span className={isPro ? "text-amber-500" : "text-primary"}>
                  {isPro ? t.billing.pro : t.billing.free}
                </span>
              </p>
            </div>
            {isPro ? (
              <p className="mt-2 text-sm text-muted-foreground">
                {t.billing.proActive}
                {renewsOn ? ` · ${fmt(t.billing.renewsOn, { date: renewsOn })}` : ""}
              </p>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">
                {fmt(t.billing.summariesUsed, { used: summariesUsed, limit })}
              </p>
            )}
          </div>
          {!isPro && (
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {t.billing.priceEur}
              {t.billing.perMonth}
            </span>
          )}
        </div>

        <div className="mt-5">
          {isPro ? (
            <Button variant="outline" onClick={manage} disabled={isPending}>
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Settings className="h-4 w-4" />
              )}
              {t.billing.manage}
            </Button>
          ) : (
            <UpgradeButton size="default" />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
