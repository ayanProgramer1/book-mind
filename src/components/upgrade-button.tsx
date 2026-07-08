"use client";

import { useTransition } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { createCheckoutSession } from "@/server/actions/billing";
import { Button, type ButtonProps } from "@/components/ui/button";
import { useT } from "@/i18n/context";
import { cn } from "@/lib/utils";

/**
 * Starts Stripe Checkout for the Pro plan and redirects to the hosted page.
 * Reusable across the app (summary limit, dashboard banner, profile) and the
 * marketing pricing section.
 */
export function UpgradeButton({
  label,
  className,
  variant = "gradient",
  size = "lg",
  showIcon = true,
}: {
  label?: string;
  className?: string;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  showIcon?: boolean;
}) {
  const t = useT();
  const [isPending, startTransition] = useTransition();

  function upgrade() {
    startTransition(async () => {
      const res = await createCheckoutSession();
      if (res.ok) {
        window.location.href = res.url;
      } else {
        toast.error(res.error);
      }
    });
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={cn(className)}
      disabled={isPending}
      onClick={upgrade}
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : showIcon ? (
        <Sparkles className="h-4 w-4" />
      ) : null}
      {label ?? t.billing.upgrade}
    </Button>
  );
}
