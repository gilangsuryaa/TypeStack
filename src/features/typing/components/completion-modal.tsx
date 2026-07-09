"use client";

import { AnimatePresence, motion } from "framer-motion";
import { RotateCcw, ArrowRight, X } from "lucide-react";
import type { Grade, TypingStats } from "@/types";
import { GRADE_META } from "../lib/grade";
import { formatDuration } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { StatItem } from "./stat-item";

interface CompletionModalProps {
  open: boolean;
  stats: TypingStats;
  grade: Grade;
  onRetry: () => void;
  onNext: () => void;
  onClose: () => void;
  hasNext: boolean;
}

export function CompletionModal({
  open,
  stats,
  grade,
  onRetry,
  onNext,
  onClose,
  hasNext,
}: CompletionModalProps) {
  const meta = GRADE_META[grade];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl sm:p-8"
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex flex-col items-center text-center">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 260 }}
                className={`text-6xl font-bold tracking-tight ${meta.className}`}
              >
                {meta.label}
              </motion.div>
              <p className="mt-2 text-sm text-muted-foreground">{meta.blurb}</p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
              <StatItem label="WPM" value={stats.wpm} />
              <StatItem label="Peak" value={stats.peakWpm} />
              <StatItem label="Accuracy" value={`${stats.accuracy}%`} />
              <StatItem label="Time" value={formatDuration(stats.elapsedMs)} />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-6 border-t border-border pt-6 sm:grid-cols-4">
              <StatItem label="CPM" value={stats.cpm} />
              <StatItem label="Mistakes" value={stats.mistakes} />
              <StatItem label="Correct" value={stats.correctChars} />
              <StatItem label="Chars" value={stats.totalChars} />
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button onClick={onRetry} variant="outline" className="flex-1">
                <RotateCcw className="h-4 w-4" />
                Retry
              </Button>
              <Button onClick={onNext} className="flex-1">
                {hasNext ? "Next file" : "Back to projects"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
