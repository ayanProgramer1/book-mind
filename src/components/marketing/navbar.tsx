"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useT } from "@/i18n/context";

export function Navbar({ isAuthenticated = false }: { isAuthenticated?: boolean }) {
  const t = useT();
  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="mx-auto mt-4 flex w-[95%] max-w-6xl items-center justify-between rounded-2xl border border-white/40 bg-white/70 px-4 py-2.5 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
        <Logo />
        <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
          <Link href="#beneficii" className="transition-colors hover:text-foreground">
            {t.nav.benefits}
          </Link>
          <Link href="#cum-functioneaza" className="transition-colors hover:text-foreground">
            {t.nav.howItWorks}
          </Link>
          <Link href="#testimoniale" className="transition-colors hover:text-foreground">
            {t.nav.testimonials}
          </Link>
          <Link href="#faq" className="transition-colors hover:text-foreground">
            {t.nav.faq}
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
          {isAuthenticated ? (
            <Button asChild variant="gradient" size="sm">
              <Link href="/dashboard">
                {t.billing.goIntoApp}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                <Link href="/login">{t.nav.login}</Link>
              </Button>
              <Button asChild variant="gradient" size="sm">
                <Link href="/register">{t.nav.startFree}</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
