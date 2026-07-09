import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORAGE_KEYS, FONT_SIZE } from "@/constants";
import type { TimerMode } from "@/types";

export interface SettingsState {
  fontSize: number;
  timerMode: TimerMode;
  typingSound: boolean;
  cursorAnimation: boolean;
  showLineNumbers: boolean;
  showIndentGuides: boolean;
  autoScroll: boolean;
  smoothCaret: boolean;
  setFontSize: (size: number) => void;
  setTimerMode: (mode: TimerMode) => void;
  toggle: (
    key:
      | "typingSound"
      | "cursorAnimation"
      | "showLineNumbers"
      | "showIndentGuides"
      | "autoScroll"
      | "smoothCaret",
  ) => void;
  reset: () => void;
}

const DEFAULTS = {
  fontSize: FONT_SIZE.default,
  timerMode: "unlimited" as TimerMode,
  typingSound: false,
  cursorAnimation: true,
  showLineNumbers: true,
  showIndentGuides: true,
  autoScroll: true,
  smoothCaret: true,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULTS,
      setFontSize: (fontSize) =>
        set({
          fontSize: Math.min(FONT_SIZE.max, Math.max(FONT_SIZE.min, fontSize)),
        }),
      setTimerMode: (timerMode) => set({ timerMode }),
      toggle: (key) => set((state) => ({ [key]: !state[key] })),
      reset: () => set({ ...DEFAULTS }),
    }),
    {
      name: STORAGE_KEYS.settings,
      version: 1,
    },
  ),
);
