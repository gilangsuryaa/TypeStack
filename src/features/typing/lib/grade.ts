import type { Grade } from "@/types";

/**
 * Derive a letter grade from accuracy and speed. Accuracy is weighted the
 * most because on real code precision matters more than raw speed.
 */
export function computeGrade(accuracy: number, wpm: number): Grade {
  if (accuracy >= 99 && wpm >= 70) return "S";
  if (accuracy >= 97 && wpm >= 55) return "A+";
  if (accuracy >= 94 && wpm >= 40) return "A";
  if (accuracy >= 88 && wpm >= 28) return "B";
  if (accuracy >= 78) return "C";
  return "D";
}

export const GRADE_META: Record<
  Grade,
  { label: string; className: string; blurb: string }
> = {
  S: {
    label: "S",
    className: "text-primary",
    blurb: "Flawless. You type code like you wrote it.",
  },
  "A+": {
    label: "A+",
    className: "text-primary",
    blurb: "Elite precision and pace.",
  },
  A: {
    label: "A",
    className: "text-success",
    blurb: "Sharp and consistent — great run.",
  },
  B: {
    label: "B",
    className: "text-warning",
    blurb: "Solid. Tighten accuracy to level up.",
  },
  C: {
    label: "C",
    className: "text-warning",
    blurb: "Getting there. Slow down for accuracy.",
  },
  D: {
    label: "D",
    className: "text-destructive",
    blurb: "Focus on correctness before speed.",
  },
};
