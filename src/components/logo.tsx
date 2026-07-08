import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Brand logo. The wordmark is baked into the image, so there is no HTML text.
 * Two theme variants are rendered and toggled purely with CSS (`dark:`), which
 * means the switch is instant, flash-free and never causes a hydration mismatch
 * (no client JS reads the theme here).
 *
 * `withText={false}` → icon-only asset (brain + book, no "BookMind" wordmark),
 * used in tight spots such as the mobile app header.
 */

const ASSETS = {
  full: {
    light: { src: "/logo-light.png", w: 322, h: 315 },
    dark: { src: "/logo-dark.png", w: 360, h: 340 },
  },
  icon: {
    light: { src: "/logo-icon-light.png", w: 293, h: 240 },
    dark: { src: "/logo-icon-dark.png", w: 318, h: 257 },
  },
} as const;

export function Logo({
  className,
  href = "/",
  withText = true,
}: {
  className?: string;
  href?: string | null;
  withText?: boolean;
}) {
  const set = withText ? ASSETS.full : ASSETS.icon;
  const heightClass = withText ? "h-10" : "h-9";

  const mark = (
    <span className={cn("relative inline-flex items-center", heightClass)}>
      {/* Light theme variant */}
      <Image
        src={set.light.src}
        width={set.light.w}
        height={set.light.h}
        alt="BookMind"
        className="block h-full w-auto select-none dark:hidden"
      />
      {/* Dark theme variant */}
      <Image
        src={set.dark.src}
        width={set.dark.w}
        height={set.dark.h}
        alt="BookMind"
        aria-hidden
        className="hidden h-full w-auto select-none dark:block"
      />
    </span>
  );

  if (href === null) {
    return <div className={cn("inline-flex", className)}>{mark}</div>;
  }

  return (
    <Link href={href} className={cn("inline-flex", className)}>
      {mark}
    </Link>
  );
}
