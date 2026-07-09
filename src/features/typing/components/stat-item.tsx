import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatItemProps {
  label: string;
  value: ReactNode;
  hint?: string;
  className?: string;
}

export function StatItem({ label, value, hint, className }: StatItemProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="mt-0.5 text-xl font-semibold tabular-nums sm:text-2xl">
        {value}
        {hint && (
          <span className="ml-1 text-xs font-normal text-muted-foreground">
            {hint}
          </span>
        )}
      </span>
    </div>
  );
}
