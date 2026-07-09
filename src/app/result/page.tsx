"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, RotateCcw, Trophy, Target, History } from "lucide-react";
import { useSessionStore } from "@/stores/session-store";
import { useProgressStore } from "@/stores/progress-store";
import { getFile } from "@/data/projects";
import { GRADE_META } from "@/features/typing";
import { StatItem } from "@/features/typing/components/stat-item";
import { Button } from "@/components/ui/button";
import { DifficultyBadge } from "@/components/shared/difficulty-badge";
import { formatDuration, timeAgo } from "@/lib/format";

export default function ResultPage() {
  const router = useRouter();
  const lastResult = useSessionStore((s) => s.lastResult);
  const select = useSessionStore((s) => s.select);
  const results = useProgressStore((s) => s.results);
  const bestWpm = useProgressStore((s) => s.bestWpm());
  const avgAccuracy = useProgressStore((s) => s.averageAccuracy());
  const clear = useProgressStore((s) => s.clear);

  function retry() {
    if (!lastResult) return;
    const found = getFile(lastResult.projectId, lastResult.fileId);
    if (found) {
      select(found.project, found.file);
      router.push("/practice");
    }
  }

  if (!lastResult && results.length === 0) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary">
          <History className="h-6 w-6 text-muted-foreground" />
        </div>
        <h1 className="mt-6 text-2xl font-bold">No results yet</h1>
        <p className="mt-2 text-muted-foreground">
          Complete a typing session and your grade, speed and history will show
          up here.
        </p>
        <Button asChild className="mt-6">
          <Link href="/projects">
            Start practicing
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    );
  }

  const meta = lastResult ? GRADE_META[lastResult.grade] : null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      {lastResult && meta && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border bg-card p-6 sm:p-8"
        >
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-5">
              <div className={`text-6xl font-bold ${meta.className}`}>
                {meta.label}
              </div>
              <div>
                <p className="font-mono text-sm text-muted-foreground">
                  {lastResult.projectTitle} / {lastResult.filePath}
                </p>
                <div className="mt-2">
                  <DifficultyBadge difficulty={lastResult.difficulty} />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {meta.blurb}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={retry}>
                <RotateCcw className="h-4 w-4" />
                Retry
              </Button>
              <Button asChild>
                <Link href="/projects">
                  New file
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-6 border-t border-border pt-8 sm:grid-cols-4">
            <StatItem label="WPM" value={lastResult.wpm} />
            <StatItem label="Peak WPM" value={lastResult.peakWpm} />
            <StatItem label="Accuracy" value={`${lastResult.accuracy}%`} />
            <StatItem
              label="Time"
              value={formatDuration(lastResult.durationMs)}
            />
            <StatItem label="CPM" value={lastResult.cpm} />
            <StatItem label="Mistakes" value={lastResult.mistakes} />
            <StatItem label="Characters" value={lastResult.totalChars} />
            <StatItem label="Grade" value={lastResult.grade} />
          </div>
        </motion.div>
      )}

      {/* Aggregates */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Trophy className="h-4 w-4 text-primary" /> Best WPM
          </div>
          <p className="mt-2 text-3xl font-bold">{bestWpm}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Target className="h-4 w-4 text-success" /> Avg accuracy
          </div>
          <p className="mt-2 text-3xl font-bold">{avgAccuracy}%</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <History className="h-4 w-4" /> Sessions
          </div>
          <p className="mt-2 text-3xl font-bold">{results.length}</p>
        </div>
      </div>

      {/* History */}
      {results.length > 0 && (
        <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="font-semibold">Recent sessions</h2>
            <button
              type="button"
              onClick={clear}
              className="text-xs text-muted-foreground hover:text-destructive"
            >
              Clear history
            </button>
          </div>
          <ul className="divide-y divide-border">
            {results.slice(0, 12).map((result) => (
              <li
                key={result.id}
                className="flex items-center gap-3 px-5 py-3 text-sm"
              >
                <span
                  className={`w-10 font-bold ${GRADE_META[result.grade].className}`}
                >
                  {result.grade}
                </span>
                <span className="min-w-0 flex-1 truncate font-mono text-muted-foreground">
                  {result.filePath}
                </span>
                <span className="w-16 text-right tabular-nums">
                  {result.wpm} wpm
                </span>
                <span className="hidden w-16 text-right tabular-nums text-muted-foreground sm:block">
                  {result.accuracy}%
                </span>
                <span className="hidden w-20 text-right text-xs text-muted-foreground sm:block">
                  {timeAgo(result.completedAt)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
