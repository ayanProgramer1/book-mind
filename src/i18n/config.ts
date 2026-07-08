// BookMind — internationalization config.
// Supported UI languages. `ro` is the source-of-truth locale.

export const LOCALES = ["ro", "en", "es", "fr", "de", "it", "zh", "ja"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "ro";

/** Cookie that persists the user's language across sessions (client + server). */
export const LOCALE_COOKIE = "bookmind_locale";

/** Display metadata for the language switcher. */
export const LOCALE_META: Record<Locale, { label: string; flag: string; english: string }> = {
  ro: { label: "Română", flag: "🇷🇴", english: "Romanian" },
  en: { label: "English", flag: "🇬🇧", english: "English" },
  es: { label: "Español", flag: "🇪🇸", english: "Spanish" },
  fr: { label: "Français", flag: "🇫🇷", english: "French" },
  de: { label: "Deutsch", flag: "🇩🇪", english: "German" },
  it: { label: "Italiano", flag: "🇮🇹", english: "Italian" },
  zh: { label: "中文", flag: "🇨🇳", english: "Chinese" },
  ja: { label: "日本語", flag: "🇯🇵", english: "Japanese" },
};

/** Human-readable language name used to instruct Claude which language to write in. */
export const LOCALE_LANGUAGE_NAME: Record<Locale, string> = {
  ro: "română (Romanian)",
  en: "English",
  es: "español (Spanish)",
  fr: "français (French)",
  de: "Deutsch (German)",
  it: "italiano (Italian)",
  zh: "中文 (Simplified Chinese)",
  ja: "日本語 (Japanese)",
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

/** Normalizes any incoming string (cookie, header) to a supported locale. */
export function resolveLocale(value: unknown): Locale {
  if (isLocale(value)) return value;
  return DEFAULT_LOCALE;
}

/** Replaces `{key}` placeholders in a template string. */
export function fmt(
  template: string,
  vars: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, k: string) =>
    k in vars ? String(vars[k]) : `{${k}}`,
  );
}
