import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORAGE_KEYS } from "@/constants";
import type { SessionResult } from "@/types";

interface ProgressState {
  results: SessionResult[];
  addResult: (result: SessionResult) => void;
  clear: () => void;
  bestWpm: () => number;
  averageAccuracy: () => number;
  completedFileIds: () => Set<string>;
}

const MAX_HISTORY = 100;

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      results: [],
      addResult: (result) =>
        set((state) => ({
          results: [result, ...state.results].slice(0, MAX_HISTORY),
        })),
      clear: () => set({ results: [] }),
      bestWpm: () =>
        get().results.reduce((max, r) => Math.max(max, r.wpm), 0),
      averageAccuracy: () => {
        const { results } = get();
        if (results.length === 0) return 0;
        const sum = results.reduce((acc, r) => acc + r.accuracy, 0);
        return Math.round((sum / results.length) * 10) / 10;
      },
      completedFileIds: () => new Set(get().results.map((r) => r.fileId)),
    }),
    {
      name: STORAGE_KEYS.progress,
      version: 1,
    },
  ),
);
