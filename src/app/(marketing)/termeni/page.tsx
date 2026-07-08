import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { getServerDictionary } from "@/i18n/server";

export const metadata: Metadata = { title: "Termeni și condiții" };

export default async function TermsPage() {
  const t = await getServerDictionary();
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="mb-10 flex items-center justify-between">
        <Logo />
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
          {t.legal.backHome}
        </Link>
      </div>
      <h1 className="text-3xl font-bold tracking-tight">{t.legal.termsTitle}</h1>
      <div className="prose mt-6 max-w-none space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p>{t.legal.termsP1}</p>
        <p>{t.legal.termsP2}</p>
        <p>{t.legal.termsP3}</p>
      </div>
    </div>
  );
}
