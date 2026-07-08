"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  Brain,
  CheckCircle2,
  Clock,
  Lightbulb,
  type LucideIcon,
} from "lucide-react";

import { useT } from "@/i18n/context";

type Benefit = {
  icon: LucideIcon;
  title: string;
  description: string;
  accent: string;
};

export function Benefits() {
  const t = useT();
  const BENEFITS: Benefit[] = [
    {
      icon: BookOpen,
      title: t.benefits.aiTitle,
      description: t.benefits.aiDesc,
      accent: "from-blue-500/15 to-blue-500/0 text-blue-600",
    },
    {
      icon: Brain,
      title: t.benefits.flashTitle,
      description: t.benefits.flashDesc,
      accent: "from-sky-500/15 to-sky-500/0 text-sky-600",
    },
    {
      icon: CheckCircle2,
      title: t.benefits.testTitle,
      description: t.benefits.testDesc,
      accent: "from-cyan-500/15 to-cyan-500/0 text-cyan-600",
    },
    {
      icon: Clock,
      title: t.benefits.timeTitle,
      description: t.benefits.timeDesc,
      accent: "from-indigo-500/15 to-indigo-500/0 text-indigo-600",
    },
    {
      icon: Lightbulb,
      title: t.benefits.learnTitle,
      description: t.benefits.learnDesc,
      accent: "from-teal-500/15 to-teal-500/0 text-teal-600",
    },
  ];

  return (
    <section id="beneficii" className="mx-auto max-w-6xl px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {t.benefits.title}
        </h2>
        <p className="mt-4 text-muted-foreground">{t.benefits.subtitle}</p>
      </div>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {BENEFITS.map((benefit, i) => (
          <motion.div
            key={benefit.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            whileHover={{ y: -6 }}
            className="group relative overflow-hidden rounded-2xl border bg-card p-6 shadow-soft transition-shadow hover:shadow-glass"
          >
            <div
              className={`mb-4 inline-grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${benefit.accent}`}
            >
              <benefit.icon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold">{benefit.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {benefit.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
