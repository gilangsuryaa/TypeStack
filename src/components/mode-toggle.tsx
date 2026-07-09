"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";
import { SegmentedControl } from "@/components/ui/segmented";

type Mode = "light" | "dark" | "system";

const OPTIONS = [
  { label: "Light", value: "light" as const, icon: Sun },
  { label: "Dark", value: "dark" as const, icon: Moon },
  { label: "System", value: "system" as const, icon: Monitor },
];

export function ModeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="h-8 w-[132px] rounded-lg bg-secondary/60" />;
  }

  if (compact) {
    const order: Mode[] = ["light", "dark", "system"];
    const current = (theme as Mode) ?? "system";
    const Icon =
      OPTIONS.find((o) => o.value === current)?.icon ?? Monitor;
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        onClick={() => {
          const idx = order.indexOf(current);
          setTheme(order[(idx + 1) % order.length]!);
        }}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        <Icon className="h-4 w-4" />
      </button>
    );
  }

  return (
    <SegmentedControl
      layoutId="theme-toggle"
      size="sm"
      options={OPTIONS.map(({ label, value }) => ({ label, value }))}
      value={(theme as Mode) ?? "system"}
      onChange={(value) => setTheme(value)}
    />
  );
}
