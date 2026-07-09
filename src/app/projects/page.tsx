"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, ChevronRight, FileCode2 } from "lucide-react";
import type { CodeFile, Difficulty, Project } from "@/types";
import { projects } from "@/data/projects";
import { useSessionStore } from "@/stores/session-store";
import { useProgressStore } from "@/stores/progress-store";
import { DifficultyBadge } from "@/components/shared/difficulty-badge";
import { Badge } from "@/components/ui/badge";
import { SegmentedControl } from "@/components/ui/segmented";
import { LANGUAGE_LABEL } from "@/constants";
import { cn } from "@/lib/utils";

type Filter = Difficulty | "all";

const FILTERS: { label: string; value: Filter }[] = [
  { label: "All", value: "all" },
  { label: "Easy", value: "easy" },
  { label: "Medium", value: "medium" },
  { label: "Hard", value: "hard" },
  { label: "Extreme", value: "extreme" },
];

function fileMeta(file: CodeFile) {
  const lines = file.code.split("\n").length;
  return { lines, chars: file.code.length };
}

export default function ProjectsPage() {
  const router = useRouter();
  const select = useSessionStore((s) => s.select);
  const results = useProgressStore((s) => s.results);
  const completed = useMemo(
    () => new Set(results.map((r) => r.fileId)),
    [results],
  );
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(() => {
    return projects
      .map((project) => ({
        project,
        files:
          filter === "all"
            ? project.files
            : project.files.filter((f) => f.difficulty === filter),
      }))
      .filter((group) => group.files.length > 0);
  }, [filter]);

  function startFile(project: Project, file: CodeFile) {
    select(project, file);
    router.push("/practice");
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="mt-2 text-muted-foreground">
            Five real projects, ordered from a simple landing page to a full SaaS
            dashboard. Pick a file to start typing.
          </p>
        </div>
      </div>

      <div className="mt-8 overflow-x-auto no-scrollbar">
        <SegmentedControl
          layoutId="difficulty-filter"
          options={FILTERS}
          value={filter}
          onChange={setFilter}
        />
      </div>

      <div className="mt-8 space-y-6">
        {filtered.map(({ project, files }, groupIndex) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: groupIndex * 0.05 }}
            className="overflow-hidden rounded-2xl border border-border bg-card"
          >
            <div className="flex items-start gap-4 border-b border-border p-5 sm:p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-2xl">
                {project.accent}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-semibold">{project.title}</h2>
                  <DifficultyBadge difficulty={project.difficulty} />
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {project.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <ul className="divide-y divide-border">
              {files.map((file) => {
                const meta = fileMeta(file);
                const done = completed.has(file.id);
                return (
                  <li key={file.id}>
                    <button
                      type="button"
                      onClick={() => startFile(project, file)}
                      className="group flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors hover:bg-accent/50 sm:px-6"
                    >
                      <span
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border",
                          done
                            ? "border-success/30 bg-success/10 text-success"
                            : "border-border text-muted-foreground",
                        )}
                      >
                        {done ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <FileCode2 className="h-4 w-4" />
                        )}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-mono text-sm">
                          {file.path}
                        </span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          {LANGUAGE_LABEL[file.language]} · {meta.lines} lines ·{" "}
                          {meta.chars} chars
                        </span>
                      </span>

                      <DifficultyBadge difficulty={file.difficulty} />
                      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
