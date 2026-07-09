/**
 * Core domain types for the Coding Typing Practice application.
 * Keeping every shared shape here makes the data layer and the typing engine
 * strongly typed and lets a future backend reuse the same contracts.
 */

export type Language = "tsx" | "ts" | "jsx" | "js" | "html" | "css" | "json";

export type Difficulty = "easy" | "medium" | "hard" | "extreme";

export type TimerMode = 30 | 60 | 120 | "unlimited";

export type ThemePreference = "light" | "dark" | "system";

export type Grade = "S" | "A+" | "A" | "B" | "C" | "D";

/** A single source file that can be typed. */
export interface CodeFile {
  id: string;
  /** Relative path shown in the file tree, e.g. `app/page.tsx`. */
  path: string;
  language: Language;
  difficulty: Difficulty;
  /** The exact source code the user must reproduce. */
  code: string;
}

/** A realistic project made up of several source files. */
export interface Project {
  id: string;
  title: string;
  description: string;
  /** Overall difficulty used for sorting the project list. */
  difficulty: Difficulty;
  /** Short tech-tags rendered as badges. */
  tags: string[];
  /** Emoji or short accent used on the project card. */
  accent: string;
  files: CodeFile[];
}

/** Per-character typing state used by the rendering layer. */
export type CharState = "pending" | "correct" | "incorrect" | "current";

/** Live statistics recomputed on every keystroke. */
export interface TypingStats {
  wpm: number;
  cpm: number;
  accuracy: number;
  mistakes: number;
  correctChars: number;
  incorrectChars: number;
  remainingChars: number;
  totalChars: number;
  typedChars: number;
  elapsedMs: number;
  progress: number;
  peakWpm: number;
}

/** Immutable snapshot persisted after a session completes. */
export interface SessionResult {
  id: string;
  projectId: string;
  projectTitle: string;
  fileId: string;
  filePath: string;
  language: Language;
  difficulty: Difficulty;
  wpm: number;
  peakWpm: number;
  cpm: number;
  accuracy: number;
  mistakes: number;
  totalChars: number;
  durationMs: number;
  grade: Grade;
  completedAt: number;
}

/** A single syntax token produced by the tokenizer. */
export type TokenType =
  | "keyword"
  | "string"
  | "number"
  | "comment"
  | "function"
  | "tag"
  | "attr"
  | "property"
  | "boolean"
  | "punctuation"
  | "plain";

export interface Token {
  value: string;
  type: TokenType;
}
