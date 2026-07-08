"use client";

import { motion } from "framer-motion";

import { useT } from "@/i18n/context";

export function HowItWorks() {
  const t = useT();
  const STEPS = [
    { n: "01", title: t.howItWorks.s1Title, body: t.howItWorks.s1Body },
    { n: "02", title: t.howItWorks.s2Title, body: t.howItWorks.s2Body },
    { n: "03", title: t.howItWorks.s3Title, body: t.howItWorks.s3Body },
    { n: "04", title: t.howItWorks.s4Title, body: t.howItWorks.s4Body },
    { n: "05", title: t.howItWorks.s5Title, body: t.howItWorks.s5Body },
    { n: "06", title: t.howItWorks.s6Title, body: t.howItWorks.s6Body },
  ];

  return (
    <section
      id="cum-functioneaza"
      className="relative overflow-hidden bg-secondary/40 py-24"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t.howItWorks.title}
          </h2>
          <p className="mt-4 text-muted-foreground">{t.howItWorks.subtitle}</p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="relative rounded-2xl border bg-card p-6 shadow-soft"
            >
              <span className="text-4xl font-bold text-primary/15">
                {step.n}
              </span>
              <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
