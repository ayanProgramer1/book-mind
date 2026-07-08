"use client";

import { Sparkles, KeyRound, Users, Flag } from "lucide-react";
import type { SummaryContent } from "@/types";
import { Badge } from "@/components/ui/badge";
import { useT } from "@/i18n/context";

function KeyPoints({ points }: { points: string[] }) {
  if (points.length === 0) return null;
  return (
    <ul className="mt-3 space-y-2">
      {points.map((point, i) => (
        <li key={i} className="flex items-start gap-2 text-sm">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
          <span>{point}</span>
        </li>
      ))}
    </ul>
  );
}

export function SummaryView({ content }: { content: SummaryContent }) {
  const t = useT();
  return (
    <article className="space-y-8">
      {/* Intro */}
      <div className="rounded-2xl border bg-gradient-to-br from-accent/60 to-transparent p-6">
        <div className="mb-2 flex items-center gap-2 text-primary">
          <Sparkles className="h-4 w-4" />
          <span className="text-xs font-semibold uppercase tracking-wide">
            {t.summaryView.intro}
          </span>
        </div>
        <p className="leading-relaxed">{content.intro}</p>
      </div>

      {/* Characters */}
      {content.characters && content.characters.length > 0 && (
        <div className="rounded-2xl border bg-card p-6">
          <div className="mb-3 flex items-center gap-2">
            <Users className="h-4 w-4 text-sky-500" />
            <h3 className="font-semibold">{t.summaryView.characters}</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {content.characters.map((c, i) => (
              <Badge key={i} variant="sky">
                {c}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Sections */}
      <div className="space-y-6">
        {content.sections.map((section, i) => (
          <section
            key={i}
            className="rounded-2xl border bg-card p-6 shadow-soft"
          >
            <div className="flex items-baseline gap-3">
              <span className="text-sm font-bold text-primary/40">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-lg font-semibold">{section.heading}</h3>
            </div>
            <p className="mt-3 leading-relaxed text-foreground/90">
              {section.body}
            </p>
            {section.keyPoints.length > 0 && (
              <div className="mt-4 rounded-xl bg-secondary/50 p-4">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <KeyRound className="h-3.5 w-3.5" />
                  {t.summaryView.keyPoints}
                </p>
                <KeyPoints points={section.keyPoints} />
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Conclusion */}
      <div className="rounded-2xl border bg-card p-6">
        <div className="mb-2 flex items-center gap-2 text-cyan-600">
          <Flag className="h-4 w-4" />
          <span className="text-xs font-semibold uppercase tracking-wide">
            {t.summaryView.conclusions}
          </span>
        </div>
        <p className="leading-relaxed">{content.conclusion}</p>
      </div>

      {/* Overall key points */}
      {content.keyPoints.length > 0 && (
        <div className="rounded-2xl border bg-gradient-to-br from-primary/5 to-transparent p-6">
          <h3 className="flex items-center gap-2 font-semibold">
            <KeyRound className="h-4 w-4 text-primary" />
            {t.summaryView.essentials}
          </h3>
          <KeyPoints points={content.keyPoints} />
        </div>
      )}
    </article>
  );
}
