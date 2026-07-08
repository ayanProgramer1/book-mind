"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch: render a neutral placeholder until mounted.
  React.useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  function toggle() {
    setTheme(isDark ? "light" : "dark");
  }

  // The label depends on the resolved theme, which is only known on the client.
  // Keep it neutral until mounted so the server and client markup match (avoids
  // a hydration mismatch on the aria-label/title attributes).
  const label = !mounted
    ? "Comută tema"
    : isDark
      ? "Comută pe modul luminos"
      : "Comută pe modul întunecat";
  const titleText = !mounted ? "Comută tema" : isDark ? "Mod luminos" : "Mod întunecat";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label={label}
      title={titleText}
      className={cn("relative overflow-hidden", className)}
    >
      {mounted ? (
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isDark ? "moon" : "sun"}
            initial={{ y: -18, opacity: 0, rotate: -90 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: 18, opacity: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
            className="grid place-items-center"
          >
            {isDark ? (
              <Sun className="h-5 w-5 text-amber-400" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </motion.span>
        </AnimatePresence>
      ) : (
        <span className="h-5 w-5" />
      )}
    </Button>
  );
}
