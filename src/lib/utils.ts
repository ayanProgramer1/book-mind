import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import type { Locale } from "@/i18n/config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const INTL_LOCALE: Record<Locale, string> = {
  ro: "ro-RO",
  en: "en-GB",
  es: "es-ES",
  fr: "fr-FR",
  de: "de-DE",
  it: "it-IT",
  zh: "zh-CN",
  ja: "ja-JP",
};

export function formatDate(date: Date | string, locale: Locale = "ro") {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(INTL_LOCALE[locale], {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

export function formatDuration(ms: number | null | undefined) {
  if (!ms || ms < 0) return "—";
  const totalSeconds = Math.round(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes === 0) return `${seconds}s`;
  return `${minutes}m ${seconds}s`;
}

export type PerfKey = "excellent" | "veryGood" | "good" | "poor";

export type PerformanceLevel = {
  key: PerfKey;
  tone: "emerald" | "sky" | "amber" | "rose";
};

/**
 * Maps a percentage to a performance tier. The user-facing label/message live in
 * the i18n dictionary (`perf.<key>`), so this stays language-agnostic.
 */
export function performanceLevel(percentage: number): PerformanceLevel {
  if (percentage >= 90) return { key: "excellent", tone: "emerald" };
  if (percentage >= 75) return { key: "veryGood", tone: "sky" };
  if (percentage >= 50) return { key: "good", tone: "amber" };
  return { key: "poor", tone: "rose" };
}

export function initials(name?: string | null, email?: string | null) {
  if (name) {
    return name
      .split(" ")
      .map((p) => p[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }
  if (email) return email[0]?.toUpperCase() ?? "?";
  return "?";
}
