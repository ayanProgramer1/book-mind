"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { useT } from "@/i18n/context";

export function Testimonials() {
  const t = useT();
  const TESTIMONIALS = [
    { name: "Andrei M.", role: t.testimonials.role1, quote: t.testimonials.quote1 },
    { name: "Ioana R.", role: t.testimonials.role2, quote: t.testimonials.quote2 },
    { name: "Vlad P.", role: t.testimonials.role3, quote: t.testimonials.quote3 },
    { name: "Maria D.", role: t.testimonials.role4, quote: t.testimonials.quote4 },
  ];

  return (
    <section id="testimoniale" className="mx-auto max-w-6xl px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {t.testimonials.title}
        </h2>
        <p className="mt-4 text-muted-foreground">{t.testimonials.subtitle}</p>
      </div>

      <div className="mt-14 grid gap-5 sm:grid-cols-2">
        {TESTIMONIALS.map((item, i) => (
          <motion.figure
            key={item.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: i * 0.08 }}
            className="rounded-2xl border bg-card p-6 shadow-soft"
          >
            <div className="mb-3 flex gap-0.5 text-amber-400">
              {Array.from({ length: 5 }).map((_, s) => (
                <Star key={s} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <blockquote className="text-pretty text-sm leading-relaxed text-foreground/90">
              „{item.quote}”
            </blockquote>
            <figcaption className="mt-5 flex items-center gap-3">
              <Avatar>
                <AvatarFallback>
                  {item.name
                    .split(" ")
                    .map((p) => p[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.role}</p>
              </div>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}
