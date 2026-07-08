"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, PlusCircle, History, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/i18n/context";
import type { Dictionary } from "@/i18n/dictionaries";

const LINKS = [
  { href: "/dashboard", key: "dashboard", icon: LayoutDashboard },
  { href: "/books/new", key: "newBook", icon: PlusCircle },
  { href: "/history", key: "history", icon: History },
  { href: "/profile", key: "profile", icon: User },
] as const satisfies ReadonlyArray<{
  href: string;
  key: keyof Dictionary["app"];
  icon: typeof LayoutDashboard;
}>;

export function SidebarNav({ className }: { className?: string }) {
  const t = useT();
  const pathname = usePathname();

  return (
    <nav className={cn("flex flex-col gap-1", className)}>
      {LINKS.map((link) => {
        const active =
          pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            <link.icon className="h-4.5 w-4.5" />
            {t.app[link.key]}
          </Link>
        );
      })}
    </nav>
  );
}

/** Compact horizontal nav for mobile (bottom bar). */
export function MobileNav() {
  const t = useT();
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t bg-card/90 px-2 py-2 backdrop-blur-xl md:hidden">
      {LINKS.map((link) => {
        const active =
          pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 rounded-lg py-1 text-[11px] font-medium transition-colors",
              active ? "text-primary" : "text-muted-foreground",
            )}
          >
            <link.icon className="h-5 w-5" />
            {t.app[link.key]}
          </Link>
        );
      })}
    </nav>
  );
}
