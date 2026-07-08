"use client";

import Link from "next/link";
import { useT } from "@/i18n/context";

export function BackHomeLink() {
  const t = useT();
  return (
    <Link
      href="/"
      className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
      {t.auth.backHome}
    </Link>
  );
}
