"use client";

import { logoutAction } from "@/server/actions/logout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { initials } from "@/lib/utils";
import { useT } from "@/i18n/context";

export function UserMenu({
  name,
  email,
  image,
}: {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}) {
  const t = useT();
  return (
    <div className="flex items-center gap-3">
      <Avatar>
        {image ? <AvatarImage src={image} alt={name ?? ""} /> : null}
        <AvatarFallback>{initials(name, email)}</AvatarFallback>
      </Avatar>
      <div className="hidden min-w-0 leading-tight sm:block">
        <p className="truncate text-sm font-medium">{name ?? "—"}</p>
        <p className="truncate text-xs text-muted-foreground">{email}</p>
      </div>
      <form action={logoutAction}>
        <Button
          type="submit"
          variant="ghost"
          size="icon"
          title={t.app.logout}
          aria-label={t.app.logout}
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
