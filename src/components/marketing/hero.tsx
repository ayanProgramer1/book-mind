"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, PlayCircle, Sparkles, BookOpen, Brain } from "lucide-react";

import { Clouds } from "@/components/clouds";
import { Button } from "@/components/ui/button";
import { useT } from "@/i18n/context";

export function Hero({ isAuthenticated = false }: { isAuthenticated?: boolean }) {
  const t = useT();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  // Discrete parallax on the decorative layers.
  const yClouds = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const yCard = useTransform(scrollYProgress, [0, 1], [0, -40]);

  return (
    <section ref={ref} className="sky-gradient relative overflow-hidden pb-24 pt-16">
      <motion.div style={{ y: yClouds }}>
        <Clouds />
      </motion.div>

      {/* soft glows */}
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-cyan-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 top-40 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 pt-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/60 px-4 py-1.5 text-sm font-medium text-primary shadow-soft backdrop-blur"
        >
          <Sparkles className="h-4 w-4" />
          {t.hero.badge}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="text-balance text-4xl font-bold tracking-tight sm:text-6xl"
        >
          {t.hero.titleA}{" "}
          <span className="text-gradient">{t.hero.titleB}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground"
        >
          {t.hero.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Button asChild variant="gradient" size="lg" className="w-full sm:w-auto">
            <Link href={isAuthenticated ? "/dashboard" : "/register"}>
              {isAuthenticated ? t.billing.goIntoApp : t.hero.ctaPrimary}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
            <Link href="#cum-functioneaza">
              <PlayCircle className="h-4 w-4" />
              {t.hero.ctaSecondary}
            </Link>
          </Button>
        </motion.div>
      </div>

      {/* floating preview card */}
      <motion.div
        style={{ y: yCard }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.35 }}
        className="relative z-10 mx-auto mt-16 max-w-3xl px-6"
      >
        <div className="glass rounded-3xl p-6 shadow-glass">
          <div className="mb-4 flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-rose-400/80" />
            <span className="h-3 w-3 rounded-full bg-amber-400/80" />
            <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border bg-card/70 p-4 text-left">
              <BookOpen className="mb-2 h-5 w-5 text-primary" />
              <p className="text-sm font-semibold">{t.hero.cardSummaryTitle}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {t.hero.cardSummaryDesc}
              </p>
            </div>
            <div className="rounded-2xl border bg-card/70 p-4 text-left">
              <Brain className="mb-2 h-5 w-5 text-sky-500" />
              <p className="text-sm font-semibold">{t.hero.cardFlashTitle}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {t.hero.cardFlashDesc}
              </p>
            </div>
            <div className="rounded-2xl border bg-card/70 p-4 text-left">
              <Sparkles className="mb-2 h-5 w-5 text-cyan-500" />
              <p className="text-sm font-semibold">{t.hero.cardScoreTitle}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {t.hero.cardScoreDesc}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
