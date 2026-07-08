import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { getServerDictionary } from "@/i18n/server";

export default async function NotFound() {
  const t = await getServerDictionary();
  return (
    <div className="sky-gradient flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <Logo href="/" className="mb-8" />
      <p className="text-7xl font-bold text-primary/30">404</p>
      <h1 className="mt-4 text-2xl font-bold tracking-tight">
        {t.notFound.title}
      </h1>
      <p className="mt-2 max-w-sm text-muted-foreground">{t.notFound.desc}</p>
      <div className="mt-6 flex gap-3">
        <Button asChild variant="gradient">
          <Link href="/dashboard">{t.notFound.toDashboard}</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">{t.notFound.home}</Link>
        </Button>
      </div>
    </div>
  );
}
