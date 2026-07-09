"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import type { TimerMode, TypingStats } from "@/types";
import { computeStats, initialStats } from "../lib/compute-stats";

export type EngineStatus = "idle" | "running" | "complete";

interface UseTypingEngineOptions {
  target: string;
  timerMode: TimerMode;
  onComplete?: (stats: TypingStats) => void;
  /** Fired once per committed keystroke (used for the typing sound). */
  onType?: (correct: boolean) => void;
}

interface UseTypingEngineResult {
  status: EngineStatus;
  typed: string;
  cursor: number;
  stats: TypingStats;
  timeLeft: number | null;
  handleKeyDown: (event: KeyboardEvent) => void;
  restart: () => void;
}

const isPrintable = (key: string) => key.length === 1;

/** Collect the indentation run (spaces/tabs) that follows `index`. */
function readIndent(target: string, index: number): string {
  let indent = "";
  let i = index;
  while (i < target.length && (target[i] === " " || target[i] === "\t")) {
    indent += target[i];
    i += 1;
  }
  return indent;
}

export function useTypingEngine({
  target,
  timerMode,
  onComplete,
  onType,
}: UseTypingEngineOptions): UseTypingEngineResult {
  const [status, setStatus] = useState<EngineStatus>("idle");
  const [typed, setTyped] = useState("");
  const [mistakes, setMistakes] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);

  const startTimeRef = useRef<number | null>(null);
  const peakWpmRef = useRef(0);
  const finishedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  const onTypeRef = useRef(onType);

  onCompleteRef.current = onComplete;
  onTypeRef.current = onType;

  const limitMs = typeof timerMode === "number" ? timerMode * 1000 : null;

  const correctChars = useMemo(() => {
    let count = 0;
    const len = typed.length;
    for (let i = 0; i < len; i += 1) {
      if (typed[i] === target[i]) count += 1;
    }
    return count;
  }, [typed, target]);

  const stats = useMemo<TypingStats>(() => {
    if (status === "idle" && typed.length === 0) {
      return initialStats(target);
    }
    const next = computeStats({
      target,
      typed,
      totalMistakes: mistakes,
      correctChars,
      elapsedMs,
      peakWpm: peakWpmRef.current,
    });
    peakWpmRef.current = next.peakWpm;
    return next;
  }, [status, typed, target, mistakes, correctChars, elapsedMs]);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setStatus("complete");
    onCompleteRef.current?.(
      computeStats({
        target,
        typed,
        totalMistakes: mistakes,
        correctChars,
        elapsedMs,
        peakWpm: peakWpmRef.current,
      }),
    );
  }, [target, typed, mistakes, correctChars, elapsedMs]);

  const finishRef = useRef(finish);
  finishRef.current = finish;

  // Drive the clock while a session is running.
  useEffect(() => {
    if (status !== "running") return;
    const id = window.setInterval(() => {
      const start = startTimeRef.current;
      if (start == null) return;
      const next = Date.now() - start;
      setElapsedMs(next);
      if (limitMs != null && next >= limitMs) {
        setElapsedMs(limitMs);
        finishRef.current();
      }
    }, 100);
    return () => window.clearInterval(id);
  }, [status, limitMs]);

  const restart = useCallback(() => {
    startTimeRef.current = null;
    peakWpmRef.current = 0;
    finishedRef.current = false;
    setStatus("idle");
    setTyped("");
    setMistakes(0);
    setElapsedMs(0);
  }, []);

  const beginIfNeeded = useCallback(() => {
    if (startTimeRef.current == null) {
      startTimeRef.current = Date.now();
      setStatus("running");
    }
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (status === "complete") return;
      const { key, ctrlKey, metaKey, altKey } = event;

      // Let global shortcuts (Ctrl+R restart, Esc exit) bubble up.
      if (ctrlKey || metaKey || altKey) return;

      if (key === "Backspace") {
        event.preventDefault();
        setTyped((prev) => prev.slice(0, -1));
        return;
      }

      if (key === "Enter") {
        event.preventDefault();
        beginIfNeeded();
        setTyped((prev) => {
          const pos = prev.length;
          if (target[pos] === "\n") {
            const indent = readIndent(target, pos + 1);
            const next = prev + "\n" + indent;
            onTypeRef.current?.(true);
            if (next.length >= target.length) queueMicrotask(finishRef.current);
            return next;
          }
          setMistakes((m) => m + 1);
          onTypeRef.current?.(false);
          return prev;
        });
        return;
      }

      if (key === "Tab") {
        event.preventDefault();
        beginIfNeeded();
        setTyped((prev) => {
          const pos = prev.length;
          const ch = target[pos];
          if (ch === "\t") {
            onTypeRef.current?.(true);
            const next = prev + "\t";
            if (next.length >= target.length) queueMicrotask(finishRef.current);
            return next;
          }
          if (ch === " ") {
            const indent = readIndent(target, pos);
            const next = prev + indent;
            onTypeRef.current?.(true);
            if (next.length >= target.length) queueMicrotask(finishRef.current);
            return next;
          }
          setMistakes((m) => m + 1);
          onTypeRef.current?.(false);
          return prev;
        });
        return;
      }

      if (!isPrintable(key)) return;

      event.preventDefault();
      beginIfNeeded();
      setTyped((prev) => {
        const pos = prev.length;
        if (pos >= target.length) return prev;
        const correct = key === target[pos];
        if (!correct) setMistakes((m) => m + 1);
        onTypeRef.current?.(correct);
        const next = prev + key;
        if (next.length >= target.length) queueMicrotask(finishRef.current);
        return next;
      });
    },
    [status, target, beginIfNeeded],
  );

  const timeLeft =
    limitMs != null ? Math.max(0, (limitMs - elapsedMs) / 1000) : null;

  return {
    status,
    typed,
    cursor: typed.length,
    stats,
    timeLeft,
    handleKeyDown,
    restart,
  };
}
