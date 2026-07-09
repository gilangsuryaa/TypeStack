"use client";

import { motion } from "framer-motion";
import type { TimerMode, TypingStats } from "@/types";
import { formatClock, formatDuration } from "@/lib/format";
import { StatItem } from "./stat-item";

interface StatsBarProps {
  stats: TypingStats;
  timerMode: TimerMode;
  timeLeft: number | null;
}

export function StatsBar({ stats, timerMode, timeLeft }: StatsBarProps) {
  const timeValue =
    timerMode === "unlimited"
      ? formatDuration(stats.elapsedMs)
      : formatClock(timeLeft ?? 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatItem label="WPM" value={stats.wpm} />
        <StatItem label="Accuracy" value={`${stats.accuracy}%`} />
        <StatItem
          label={timerMode === "unlimited" ? "Time" : "Time left"}
          value={timeValue}
        />
        <StatItem label="Mistakes" value={stats.mistakes} />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Progress</span>
          <span className="tabular-nums">{stats.progress.toFixed(0)}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={false}
            animate={{ width: `${stats.progress}%` }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
        <span>
          CPM <span className="font-medium text-foreground">{stats.cpm}</span>
        </span>
        <span>
          Correct{" "}
          <span className="font-medium text-success">{stats.correctChars}</span>
        </span>
        <span>
          Incorrect{" "}
          <span className="font-medium text-destructive">
            {stats.incorrectChars}
          </span>
        </span>
        <span>
          Remaining{" "}
          <span className="font-medium text-foreground">
            {stats.remainingChars}
          </span>
        </span>
        <span>
          Peak <span className="font-medium text-foreground">{stats.peakWpm}</span>{" "}
          wpm
        </span>
      </div>
    </div>
  );
}
