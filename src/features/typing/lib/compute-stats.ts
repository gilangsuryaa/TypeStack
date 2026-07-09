import type { TypingStats } from "@/types";

const EMPTY_STATS: TypingStats = {
  wpm: 0,
  cpm: 0,
  accuracy: 100,
  mistakes: 0,
  correctChars: 0,
  incorrectChars: 0,
  remainingChars: 0,
  totalChars: 0,
  typedChars: 0,
  elapsedMs: 0,
  progress: 0,
  peakWpm: 0,
};

export interface StatsInput {
  /** The target source string. */
  target: string;
  /** The user's typed string (up to their current position). */
  typed: string;
  /** Cumulative number of incorrect keystrokes ever pressed. */
  totalMistakes: number;
  /** Number of characters currently correct at their position. */
  correctChars: number;
  /** Milliseconds elapsed since the first keystroke. */
  elapsedMs: number;
  /** Highest WPM observed so far this session. */
  peakWpm: number;
}

export function initialStats(target: string): TypingStats {
  return {
    ...EMPTY_STATS,
    remainingChars: target.length,
    totalChars: target.length,
  };
}

/**
 * Standard typing math: a "word" is 5 characters. WPM uses only correctly
 * typed characters so hammering wrong keys never inflates the score.
 */
export function computeStats(input: StatsInput): TypingStats {
  const { target, typed, totalMistakes, correctChars, elapsedMs, peakWpm } =
    input;

  const totalChars = target.length;
  const typedChars = typed.length;
  const incorrectChars = Math.max(0, typedChars - correctChars);
  const remainingChars = Math.max(0, totalChars - typedChars);

  const minutes = elapsedMs / 60000;
  const grossKeystrokes = correctChars + totalMistakes;

  const wpm = minutes > 0 ? Math.round(correctChars / 5 / minutes) : 0;
  const cpm = minutes > 0 ? Math.round(correctChars / minutes) : 0;

  const accuracy =
    grossKeystrokes > 0
      ? Math.max(0, (correctChars / grossKeystrokes) * 100)
      : 100;

  const progress = totalChars > 0 ? (typedChars / totalChars) * 100 : 0;

  return {
    wpm,
    cpm,
    accuracy: Math.round(accuracy * 10) / 10,
    mistakes: totalMistakes,
    correctChars,
    incorrectChars,
    remainingChars,
    totalChars,
    typedChars,
    elapsedMs,
    progress: Math.min(100, Math.round(progress * 10) / 10),
    peakWpm: Math.max(peakWpm, wpm),
  };
}
