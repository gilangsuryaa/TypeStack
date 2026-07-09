import type { Language, TokenType } from "@/types";
import { tokenize } from "./tokenizer";

export interface RenderChar {
  char: string;
  /** Absolute index of this char in the target string. */
  index: number;
  type: TokenType;
}

export interface RenderLine {
  /** 1-based line number. */
  number: number;
  chars: RenderChar[];
  /** Absolute index of the trailing newline (or end-of-string) of this line. */
  breakIndex: number;
}

/**
 * Tokenize the source and lay it out as lines of characters. Newlines are not
 * emitted as visible characters; instead each line records the index of its
 * break so the caret can sit at the end of a line.
 */
export function buildRenderModel(
  code: string,
  language: Language,
): RenderLine[] {
  const tokens = tokenize(code, language);
  const lines: RenderLine[] = [];
  let current: RenderChar[] = [];
  let index = 0;
  let lineNumber = 1;

  const pushLine = (breakIndex: number) => {
    lines.push({ number: lineNumber, chars: current, breakIndex });
    lineNumber += 1;
    current = [];
  };

  for (const token of tokens) {
    for (const char of token.value) {
      if (char === "\n") {
        pushLine(index);
        index += 1;
        continue;
      }
      current.push({ char, index, type: token.type });
      index += 1;
    }
  }
  // Final line (no trailing newline consumed).
  pushLine(index);

  return lines;
}
