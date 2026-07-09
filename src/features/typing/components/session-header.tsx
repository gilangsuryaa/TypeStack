"use client";

import { RotateCcw, LogOut, Minus, Plus, FileCode2 } from "lucide-react";
import type { CodeFile, Project, TimerMode } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SegmentedControl } from "@/components/ui/segmented";
import {
  DIFFICULTY_META,
  LANGUAGE_LABEL,
  TIMER_OPTIONS,
  FONT_SIZE,
} from "@/constants";

interface SessionHeaderProps {
  project: Project;
  file: CodeFile;
  timerMode: TimerMode;
  fontSize: number;
  onTimerChange: (mode: TimerMode) => void;
  onFontSize: (delta: number) => void;
  onRestart: () => void;
  onExit: () => void;
}

export function SessionHeader({
  project,
  file,
  timerMode,
  fontSize,
  onTimerChange,
  onFontSize,
  onRestart,
  onExit,
}: SessionHeaderProps) {
  const difficulty = DIFFICULTY_META[file.difficulty];

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="min-w-0">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FileCode2 className="h-4 w-4 shrink-0" />
          <span className="truncate font-mono">
            {project.title} / {file.path}
          </span>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Badge className={difficulty.className}>{difficulty.label}</Badge>
          <Badge variant="outline">{LANGUAGE_LABEL[file.language]}</Badge>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <SegmentedControl
          layoutId="timer-mode"
          size="sm"
          options={TIMER_OPTIONS.map((o) => ({
            label: o.label,
            value: o.value,
          }))}
          value={timerMode}
          onChange={onTimerChange}
        />

        <div className="flex items-center gap-1 rounded-lg border border-border p-1">
          <button
            type="button"
            aria-label="Decrease font size"
            onClick={() => onFontSize(-FONT_SIZE.step)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="w-8 text-center text-xs tabular-nums text-muted-foreground">
            {fontSize}
          </span>
          <button
            type="button"
            aria-label="Increase font size"
            onClick={() => onFontSize(FONT_SIZE.step)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        <Button size="icon" variant="outline" onClick={onRestart} title="Restart (Ctrl+R)">
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" onClick={onExit} title="Exit (Esc)">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
