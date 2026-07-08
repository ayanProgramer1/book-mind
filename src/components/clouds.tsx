"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

function Cloud({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 120"
      className={cn("cloud", className)}
      fill="currentColor"
      aria-hidden
    >
      <path d="M50 90a30 30 0 0 1 4-59 40 40 0 0 1 76 8 26 26 0 0 1 20 51H50Z" />
    </svg>
  );
}

/**
 * Soft, slowly drifting clouds used behind the hero and auth screens.
 * Purely decorative — hidden from assistive tech.
 */
export function Clouds({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
      aria-hidden
    >
      <motion.div
        className="absolute left-[6%] top-[12%] text-white/70 dark:text-white/[0.04]"
        animate={{ x: [0, 40, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      >
        <Cloud className="h-24 w-40" />
      </motion.div>
      <motion.div
        className="absolute right-[8%] top-[22%] text-white/60 dark:text-white/[0.03]"
        animate={{ x: [0, -50, 0] }}
        transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
      >
        <Cloud className="h-32 w-52" />
      </motion.div>
      <motion.div
        className="absolute left-[38%] top-[6%] text-white/50 dark:text-white/[0.03]"
        animate={{ x: [0, 30, 0], y: [0, 10, 0] }}
        transition={{ duration: 40, repeat: Infinity, ease: "easeInOut" }}
      >
        <Cloud className="h-20 w-32" />
      </motion.div>
      <motion.div
        className="absolute bottom-[14%] left-[14%] text-white/50 dark:text-white/[0.02]"
        animate={{ x: [0, 60, 0] }}
        transition={{ duration: 46, repeat: Infinity, ease: "easeInOut" }}
      >
        <Cloud className="h-28 w-44" />
      </motion.div>
    </div>
  );
}
