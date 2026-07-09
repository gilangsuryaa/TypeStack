import { create } from "zustand";
import type { CodeFile, Project, SessionResult } from "@/types";

/**
 * Ephemeral selection + last-result bridge between pages. Not persisted:
 * refreshing the practice page without a selection sends the user back to the
 * project list, which is the desired UX.
 */
interface SessionState {
  project: Project | null;
  file: CodeFile | null;
  lastResult: SessionResult | null;
  select: (project: Project, file: CodeFile) => void;
  setLastResult: (result: SessionResult) => void;
  clear: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  project: null,
  file: null,
  lastResult: null,
  select: (project, file) => set({ project, file }),
  setLastResult: (lastResult) => set({ lastResult }),
  clear: () => set({ project: null, file: null }),
}));
