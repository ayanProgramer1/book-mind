"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useT } from "@/i18n/context";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useT();
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-destructive/10 text-destructive">
        <AlertTriangle className="h-7 w-7" />
      </div>
      <h1 className="text-xl font-bold">{t.error.title}</h1>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{t.error.desc}</p>
      <Button onClick={reset} variant="gradient" className="mt-6">
        <RotateCcw className="h-4 w-4" />
        {t.error.retry}
      </Button>
    </div>
  );
}
