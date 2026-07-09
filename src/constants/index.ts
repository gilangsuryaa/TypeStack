import type { Difficulty, Language, TimerMode } from "@/types";

export const APP_NAME = "TypeStack";
export const APP_TAGLINE = "Practice typing with real production code.";

export const STORAGE_KEYS = {
  settings: "typestack:settings",
  progress: "typestack:progress",
} as const;

export const TIMER_OPTIONS: { label: string; value: TimerMode }[] = [
  { label: "30s", value: 30 },
  { label: "60s", value: 60 },
  { label: "120s", value: 120 },
  { label: "∞", value: "unlimited" },
];

export const DIFFICULTY_ORDER: Difficulty[] = [
  "easy",
  "medium",
  "hard",
  "extreme",
];

export const DIFFICULTY_META: Record<
  Difficulty,
  { label: string; className: string }
> = {
  easy: {
    label: "Easy",
    className:
      "bg-success/12 text-success border-success/25 dark:bg-success/15",
  },
  medium: {
    label: "Medium",
    className:
      "bg-warning/12 text-warning border-warning/25 dark:bg-warning/15",
  },
  hard: {
    label: "Hard",
    className:
      "bg-primary/12 text-primary border-primary/25 dark:bg-primary/15",
  },
  extreme: {
    label: "Extreme",
    className:
      "bg-destructive/12 text-destructive border-destructive/25 dark:bg-destructive/15",
  },
};

export const LANGUAGE_LABEL: Record<Language, string> = {
  tsx: "TSX",
  ts: "TypeScript",
  jsx: "JSX",
  js: "JavaScript",
  html: "HTML",
  css: "CSS",
  json: "JSON",
};

export const FONT_SIZE = {
  min: 12,
  max: 24,
  default: 16,
  step: 1,
} as const;
