"use client";

import Link from "next/link";
import { Check, Crown, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { UpgradeButton } from "@/components/upgrade-button";
import { useT } from "@/i18n/context";
import { cn } from "@/lib/utils";

export function Pricing({ isAuthenticated = false }: { isAuthenticated?: boolean }) {
  const t = useT();

  const freeFeatures = [t.billing.freeF1, t.billing.freeF2, t.billing.freeF3];
  const proFeatures = [t.billing.proF1, t.billing.proF2, t.billing.proF3];

  return (
    <section id="preturi" className="mx-auto max-w-5xl px-6 py-24">
      <div className="text-center">
        <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
          {t.billing.pricingTitle}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground">
          {t.billing.pricingSubtitle}
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {/* Free */}
        <div className="flex flex-col rounded-3xl border bg-card p-8 shadow-soft">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">{t.billing.freeName}</h3>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{t.billing.freeTagline}</p>
          <div className="mt-5 flex items-baseline gap-1">
            <span className="text-4xl font-bold">0€</span>
          </div>
          <ul className="mt-6 space-y-3 text-sm">
            {freeFeatures.map((f) => (
              <li key={f} className="flex items-start gap-2.5">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 pt-2">
            <Button asChild variant="outline" size="lg" className="w-full">
              <Link href={isAuthenticated ? "/dashboard" : "/register"}>
                {isAuthenticated ? t.billing.goIntoApp : t.nav.startFree}
              </Link>
            </Button>
          </div>
        </div>

        {/* Pro */}
        <div
          className={cn(
            "relative flex flex-col rounded-3xl border-2 border-primary bg-gradient-to-br from-primary/5 to-sky-500/5 p-8 shadow-glass",
          )}
        >
          <span className="absolute -top-3 right-6 rounded-full bg-gradient-to-r from-primary to-sky-500 px-3 py-1 text-xs font-semibold text-white shadow-soft">
            {t.billing.recommended}
          </span>
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-amber-500" />
            <h3 className="text-lg font-semibold">{t.billing.proName}</h3>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{t.billing.proTagline}</p>
          <div className="mt-5 flex items-baseline gap-1">
            <span className="text-4xl font-bold">{t.billing.priceEur}</span>
            <span className="text-muted-foreground">{t.billing.perMonth}</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{t.billing.priceNote}</p>
          <ul className="mt-6 space-y-3 text-sm">
            {proFeatures.map((f) => (
              <li key={f} className="flex items-start gap-2.5">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 pt-2">
            {isAuthenticated ? (
              <UpgradeButton className="w-full" label={t.billing.upgrade} />
            ) : (
              <Button asChild variant="gradient" size="lg" className="w-full">
                <Link href="/register">{t.billing.upgrade}</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
