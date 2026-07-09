"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Keyboard } from "lucide-react";
import type { CodeFile, Project, SessionResult, TypingStats } from "@/types";
import { useSettingsStore } from "@/stores/settings-store";
import { useProgressStore } from "@/stores/progress-store";
import { useSessionStore } from "@/stores/session-store";
import { buildRenderModel } from "../lib/render-model";
import { computeGrade } from "../lib/grade";
import { useTypingEngine } from "../hooks/use-typing-engine";
import { useTypingSound } from "../hooks/use-typing-sound";
import { TypingArea } from "./typing-area";
import { StatsBar } from "./stats-bar";
import { SessionHeader } from "./session-header";
import { CompletionModal } from "./completion-modal";

interface TypingSessionProps {
  project: Project;
  file: CodeFile;
}

export function TypingSession({ project, file }: TypingSessionProps) {
  const router = useRouter();
  const settings = useSettingsStore();
  const addResult = useProgressStore((s) => s.addResult);
  const setLastResult = useSessionStore((s) => s.setLastResult);
  const select = useSessionStore((s) => s.select);

  const captureRef = useRef<HTMLTextAreaElement | null>(null);
  const [focused, setFocused] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  const lines = useMemo(
    () => buildRenderModel(file.code, file.language),
    [file.code, file.language],
  );

  const playSound = useTypingSound(settings.typingSound);

  const fileIndex = project.files.findIndex((f) => f.id === file.id);
  const nextFile = project.files[fileIndex + 1];

  const handleComplete = useCallback(
    (stats: TypingStats) => {
      const grade = computeGrade(stats.accuracy, stats.wpm);
      const result: SessionResult = {
        id: `${file.id}-${Date.now()}`,
        projectId: project.id,
        projectTitle: project.title,
        fileId: file.id,
        filePath: file.path,
        language: file.language,
        difficulty: file.difficulty,
        wpm: stats.wpm,
        peakWpm: stats.peakWpm,
        cpm: stats.cpm,
        accuracy: stats.accuracy,
        mistakes: stats.mistakes,
        totalChars: stats.totalChars,
        durationMs: stats.elapsedMs,
        grade,
        completedAt: Date.now(),
      };
      addResult(result);
      setLastResult(result);
    },
    [file, project, addResult, setLastResult],
  );

  const { status, typed, cursor, stats, timeLeft, handleKeyDown, restart } =
    useTypingEngine({
      target: file.code,
      timerMode: settings.timerMode,
      onComplete: handleComplete,
      onType: playSound,
    });

  const focus = useCallback(() => captureRef.current?.focus(), []);

  const doRestart = useCallback(() => {
    restart();
    setDismissed(false);
    requestAnimationFrame(focus);
  }, [restart, focus]);

  // Global shortcuts: Ctrl/Cmd+R restart, Esc exit.
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "r") {
        event.preventDefault();
        doRestart();
      } else if (event.key === "Escape") {
        event.preventDefault();
        router.push("/projects");
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [doRestart, router]);

  useEffect(() => {
    focus();
  }, [focus]);

  const grade = computeGrade(stats.accuracy, stats.wpm);
  const modalOpen = status === "complete" && !dismissed;

  const goNext = useCallback(() => {
    if (nextFile) {
      select(project, nextFile);
    } else {
      router.push("/projects");
    }
  }, [nextFile, project, select, router]);

  return (
    <div className="space-y-6">
      <SessionHeader
        project={project}
        file={file}
        timerMode={settings.timerMode}
        fontSize={settings.fontSize}
        onTimerChange={(mode) => {
          settings.setTimerMode(mode);
          doRestart();
        }}
        onFontSize={(delta) => settings.setFontSize(settings.fontSize + delta)}
        onRestart={doRestart}
        onExit={() => router.push("/projects")}
      />

      <StatsBar stats={stats} timerMode={settings.timerMode} timeLeft={timeLeft} />

      <div
        className="relative rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6"
        onClick={focus}
      >
        <textarea
          ref={captureRef}
          value=""
          onChange={() => {}}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          aria-label="Typing input"
          className="absolute inset-0 z-10 h-full w-full cursor-text resize-none rounded-2xl bg-transparent p-0 text-transparent caret-transparent outline-none"
        />

        <TypingArea
          lines={lines}
          typed={typed}
          cursor={cursor}
          status={status}
          fontSize={settings.fontSize}
          showLineNumbers={settings.showLineNumbers}
          showIndentGuides={settings.showIndentGuides}
          autoScroll={settings.autoScroll}
          smoothCaret={settings.cursorAnimation}
        />

        {!focused && status !== "complete" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-card/70 backdrop-blur-[2px]"
          >
            <span className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium shadow-sm">
              <Keyboard className="h-4 w-4" />
              Click or press any key to focus
            </span>
          </motion.div>
        )}
      </div>

      <p className="text-center text-xs text-muted-foreground">
        <kbd className="rounded border border-border px-1.5 py-0.5">Tab</kbd> and{" "}
        <kbd className="rounded border border-border px-1.5 py-0.5">Enter</kbd>{" "}
        auto-handle indentation ·{" "}
        <kbd className="rounded border border-border px-1.5 py-0.5">Ctrl+R</kbd>{" "}
        restart ·{" "}
        <kbd className="rounded border border-border px-1.5 py-0.5">Esc</kbd> exit
      </p>

      <CompletionModal
        open={modalOpen}
        stats={stats}
        grade={grade}
        hasNext={Boolean(nextFile)}
        onRetry={doRestart}
        onNext={goNext}
        onClose={() => {
          setDismissed(true);
          router.push("/result");
        }}
      />
    </div>
  );
}
