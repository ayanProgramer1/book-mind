"use client";

import Link from "next/link";
import { Logo } from "@/components/logo";
import { useT } from "@/i18n/context";

export function Footer() {
  const t = useT();
  return (
    <footer className="border-t bg-secondary/30">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 text-sm text-muted-foreground">{t.footer.tagline}</p>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <div>
              <p className="text-sm font-semibold">{t.footer.product}</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#beneficii" className="hover:text-foreground">
                    {t.nav.benefits}
                  </Link>
                </li>
                <li>
                  <Link href="#cum-functioneaza" className="hover:text-foreground">
                    {t.nav.howItWorks}
                  </Link>
                </li>
                <li>
                  <Link href="#faq" className="hover:text-foreground">
                    {t.nav.faq}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold">{t.footer.legal}</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/termeni" className="hover:text-foreground">
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link href="/confidentialitate" className="hover:text-foreground">
                    {t.footer.privacy}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold">{t.footer.contact}</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="mailto:contact@bookmind.app"
                    className="hover:text-foreground"
                  >
                    contact@bookmind.app
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} BookMind. {t.footer.rights}</p>
          <p>{t.footer.builtWith}</p>
        </div>
      </div>
    </footer>
  );
}
