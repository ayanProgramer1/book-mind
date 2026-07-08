"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  resolveLocale,
  type Locale,
} from "./config";
import { dictionaries, type Dictionary } from "./dictionaries";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Dictionary;
};

const LanguageContext = React.createContext<LanguageContextValue | null>(null);

function persistLocale(locale: Locale): void {
  // 1 year, site-wide. Server components/actions read this same cookie.
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
  try {
    window.localStorage.setItem(LOCALE_COOKIE, locale);
  } catch {
    // ignore storage errors (private mode etc.)
  }
}

export function LanguageProvider({
  initialLocale,
  children,
}: {
  initialLocale?: Locale;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [locale, setLocaleState] = React.useState<Locale>(
    initialLocale ?? DEFAULT_LOCALE,
  );

  const setLocale = React.useCallback(
    (next: Locale) => {
      const resolved = resolveLocale(next);
      setLocaleState(resolved);
      persistLocale(resolved);
      // Keep <html lang> in sync for accessibility / SEO.
      document.documentElement.lang = resolved;
      // Re-render server components with the new cookie so pages rendered on
      // the server (dashboard, history, etc.) also switch language.
      router.refresh();
    },
    [router],
  );

  const value = React.useMemo<LanguageContextValue>(
    () => ({ locale, setLocale, t: dictionaries[locale] }),
    [locale, setLocale],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = React.useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}

/** Convenience hook: returns the active dictionary directly. */
export function useT(): Dictionary {
  return useLanguage().t;
}
