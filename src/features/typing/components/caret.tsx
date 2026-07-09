"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Caret({
  smooth,
  blink,
}: {
  smooth: boolean;
  blink: boolean;
}) {
  const className = cn(
    "pointer-events-none inline-block h-[1.15em] w-[2px] -translate-x-[1px] translate-y-[0.16em] rounded-full bg-[var(--type-cursor)]",
    blink && "caret-blink",
  );

  if (smooth) {
    return (
      <motion.span
        layoutId="type-caret"
        layout="position"
        transition={{ type: "spring", stiffness: 700, damping: 42 }}
        className={className}
        aria-hidden
      />
    );
  }

  return <span className={className} aria-hidden />;
}
