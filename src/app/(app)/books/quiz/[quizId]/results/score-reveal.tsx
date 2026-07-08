"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { performanceLevel } from "@/lib/utils";
import { useT } from "@/i18n/context";

export function ScoreReveal({
  score,
  total,
  percentage,
}: {
  score: number;
  total: number;
  percentage: number;
}) {
  const t = useT();
  const level = performanceLevel(percentage);
  const perfLabel = {
    excellent: t.perf.excellentLabel,
    veryGood: t.perf.veryGoodLabel,
    good: t.perf.goodLabel,
    poor: t.perf.poorLabel,
  }[level.key];
  const perfMsg = {
    excellent: t.perf.excellentMsg,
    veryGood: t.perf.veryGoodMsg,
    good: t.perf.goodMsg,
    poor: t.perf.poorMsg,
  }[level.key];
  const [displayPct, setDisplayPct] = useState(0);
  const [barValue, setBarValue] = useState(0);

  useEffect(() => {
    // Animate the bar and the counter.
    const barTimer = setTimeout(() => setBarValue(percentage), 200);
    const duration = 900;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      setDisplayPct(Math.round(t * percentage));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    const counterTimer = setTimeout(
      () => (raf = requestAnimationFrame(tick)),
      200,
    );
    return () => {
      clearTimeout(barTimer);
      clearTimeout(counterTimer);
      cancelAnimationFrame(raf);
    };
  }, [percentage]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/10 via-card to-card p-8 shadow-glass"
    >
      <div className="flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
          className="mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-primary to-sky-500 text-white shadow-glow"
        >
          <Trophy className="h-8 w-8" />
        </motion.div>

        <p className="text-sm text-muted-foreground">{t.results.yourScore}</p>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-5xl font-bold tracking-tight">
            {score}/{total}
          </span>
          <span className="text-2xl font-semibold text-primary">
            {displayPct}%
          </span>
        </div>

        <Badge variant={level.tone} className="mt-4 px-3 py-1 text-sm">
          {perfLabel}
        </Badge>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          {perfMsg}
        </p>

        <div className="mt-6 w-full max-w-md">
          <Progress value={barValue} className="h-4" />
        </div>
      </div>
    </motion.div>
  );
}
