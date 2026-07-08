"use client";

import { useT } from "@/i18n/context";

export function SidebarTip() {
  const t = useT();
  return (
    <div className="mt-auto rounded-xl bg-secondary/60 p-4 text-xs text-muted-foreground">
      <p className="font-medium text-foreground">{t.app.tipTitle}</p>
      <p className="mt-1">{t.app.tipBody}</p>
    </div>
  );
}
