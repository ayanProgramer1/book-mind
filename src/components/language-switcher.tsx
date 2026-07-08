"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Globe } from "lucide-react";

import { LOCALES, LOCALE_META, type Locale } from "@/i18n/config";
import { useLanguage } from "@/i18n/context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale, t } = useLanguage();
  const [open, setOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => setMounted(true), []);

  // Close on outside click / Escape.
  React.useEffect(() => {
    if (!open) return;
    function onPointer(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function choose(next: Locale) {
    setLocale(next);
    setOpen(false);
  }

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen((v) => !v)}
        aria-label={t.language.change}
        title={t.language.change}
        aria-haspopup="menu"
        aria-expanded={open}
        className="relative gap-1.5"
      >
        <Globe className="h-5 w-5" />
        <span className="text-xs font-semibold uppercase">
          {mounted ? locale : ""}
        </span>
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-xl border bg-background p-1 shadow-glass"
          >
            <p className="px-3 py-2 text-xs font-medium text-muted-foreground">
              {t.language.label}
            </p>
            {LOCALES.map((code) => {
              const meta = LOCALE_META[code];
              const active = code === locale;
              return (
                <button
                  key={code}
                  role="menuitemradio"
                  aria-checked={active}
                  onClick={() => choose(code)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent",
                    active && "bg-accent/60 font-medium",
                  )}
                >
                  <span className="text-base leading-none">{meta.flag}</span>
                  <span className="flex-1 text-left">{meta.label}</span>
                  {active && <Check className="h-4 w-4 text-primary" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
