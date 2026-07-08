"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Clouds } from "@/components/clouds";
import { Button } from "@/components/ui/button";
import { useT } from "@/i18n/context";

export function Cta({ isAuthenticated = false }: { isAuthenticated?: boolean }) {
  const t = useT();
  return (
    <section className="mx-auto max-w-6xl px-6 pb-24">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-sky-600 px-8 py-16 text-center shadow-glass">
        <Clouds className="opacity-40" />
        <div className="relative z-10">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {t.cta.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-white/85">
            {t.cta.subtitle}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {isAuthenticated ? (
              <Button
                asChild
                size="lg"
                className="w-full bg-white text-primary hover:bg-white/90 sm:w-auto"
              >
                <Link href="/dashboard">
                  {t.billing.goIntoApp}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <>
                <Button
                  asChild
                  size="lg"
                  className="w-full bg-white text-primary hover:bg-white/90 sm:w-auto"
                >
                  <Link href="/register">
                    {t.cta.primary}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="w-full border-white/40 bg-white/10 text-white hover:bg-white/20 sm:w-auto"
                >
                  <Link href="/login">{t.cta.haveAccount}</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
