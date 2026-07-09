"use client";

import { Fragment, memo, useEffect, useRef } from "react";
import type { TokenType } from "@/types";
import type { RenderLine } from "../lib/render-model";
import type { EngineStatus } from "../hooks/use-typing-engine";
import { cn } from "@/lib/utils";
import { Caret } from "./caret";

const TOKEN_COLOR: Record<TokenType, string> = {
  keyword: "var(--syntax-keyword)",
  string: "var(--syntax-string)",
  number: "var(--syntax-number)",
  comment: "var(--syntax-comment)",
  function: "var(--syntax-function)",
  tag: "var(--syntax-tag)",
  attr: "var(--syntax-attr)",
  property: "var(--syntax-property)",
  boolean: "var(--syntax-boolean)",
  punctuation: "var(--syntax-punct)",
  plain: "var(--syntax-plain)",
};

interface TypingLineProps {
  line: RenderLine;
  /** Typed characters overlapping this line (aligned to its first char). */
  typedSlice: string;
  /** Caret position within the line (0..chars.length), or null if elsewhere. */
  caretRel: number | null;
  gutterWidth: number;
  showLineNumbers: boolean;
  showIndentGuides: boolean;
  smoothCaret: boolean;
  blink: boolean;
}

function leadingSpaceCount(line: RenderLine): number {
  let count = 0;
  for (const char of line.chars) {
    if (char.char === " ") count += 1;
    else break;
  }
  return count;
}

const TypingLine = memo(function TypingLine({
  line,
  typedSlice,
  caretRel,
  gutterWidth,
  showLineNumbers,
  showIndentGuides,
  smoothCaret,
  blink,
}: TypingLineProps) {
  const indent = leadingSpaceCount(line);

  return (
    <div className={cn("flex whitespace-pre", caretRel !== null && "bg-muted/40")}>
      {showLineNumbers && (
        <span
          className="mr-4 shrink-0 select-none text-right text-muted-foreground/50 tabular-nums"
          style={{ width: `${gutterWidth}ch` }}
        >
          {line.number}
        </span>
      )}

      <code className="flex-1">
        {line.chars.map((rc, position) => {
          const isTyped = position < typedSlice.length;
          const correct = isTyped && typedSlice[position] === rc.char;
          const incorrect = isTyped && !correct;
          const guide =
            showIndentGuides &&
            rc.char === " " &&
            position < indent &&
            position % 2 === 0;

          return (
            <Fragment key={rc.index}>
              {caretRel === position && (
                <Caret smooth={smoothCaret} blink={blink} />
              )}
              <span
                className={cn(
                  guide && "border-l border-border/60",
                  incorrect && "rounded-[2px] bg-[var(--type-incorrect-bg)]",
                )}
                style={{
                  color: incorrect
                    ? "var(--type-incorrect)"
                    : TOKEN_COLOR[rc.type],
                  opacity: isTyped ? 1 : 0.4,
                }}
              >
                {rc.char}
              </span>
            </Fragment>
          );
        })}

        {caretRel === line.chars.length && (
          <Caret smooth={smoothCaret} blink={blink} />
        )}
        {line.chars.length === 0 && "​"}
      </code>
    </div>
  );
});

interface TypingAreaProps {
  lines: RenderLine[];
  typed: string;
  cursor: number;
  status: EngineStatus;
  fontSize: number;
  showLineNumbers: boolean;
  showIndentGuides: boolean;
  autoScroll: boolean;
  smoothCaret: boolean;
}

function TypingAreaImpl({
  lines,
  typed,
  cursor,
  status,
  fontSize,
  showLineNumbers,
  showIndentGuides,
  autoScroll,
  smoothCaret,
}: TypingAreaProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const blink = status !== "running";
  const gutterWidth = String(lines.length).length + 1;

  // Track which line the caret sits on so we can keep it in view.
  let activeLineIndex = 0;

  const rendered = lines.map((line, index) => {
    const start = line.chars[0]?.index ?? line.breakIndex;
    const caretRel =
      cursor >= start && cursor <= line.breakIndex ? cursor - start : null;
    if (caretRel !== null) activeLineIndex = index;

    const typedSlice =
      typed.length <= start
        ? ""
        : typed.slice(start, Math.min(typed.length, line.breakIndex));

    return (
      <TypingLine
        key={line.number}
        line={line}
        typedSlice={typedSlice}
        caretRel={caretRel}
        gutterWidth={gutterWidth}
        showLineNumbers={showLineNumbers}
        showIndentGuides={showIndentGuides}
        smoothCaret={smoothCaret}
        blink={blink}
      />
    );
  });

  useEffect(() => {
    if (!autoScroll) return;
    const container = scrollRef.current;
    if (!container) return;
    const active = container.children[activeLineIndex] as
      | HTMLElement
      | undefined;
    active?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [cursor, autoScroll, activeLineIndex]);

  return (
    <div
      className="no-scrollbar max-h-[52vh] overflow-auto font-mono leading-relaxed"
      style={{ fontSize }}
    >
      <div ref={scrollRef} className="min-w-full">
        {rendered}
      </div>
    </div>
  );
}

export const TypingArea = memo(TypingAreaImpl);
