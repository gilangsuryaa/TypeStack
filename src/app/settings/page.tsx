"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  Volume2,
  MousePointer2,
  Hash,
  AlignLeft,
  ArrowDownUp,
  Type,
  RotateCcw,
} from "lucide-react";
import { useSettingsStore } from "@/stores/settings-store";
import { ModeToggle } from "@/components/mode-toggle";
import { Switch } from "@/components/ui/switch";
import { SegmentedControl } from "@/components/ui/segmented";
import { Button } from "@/components/ui/button";
import { TIMER_OPTIONS, FONT_SIZE } from "@/constants";

function Row({
  icon,
  title,
  description,
  control,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  control: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
          {icon}
        </span>
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="shrink-0">{control}</div>
    </div>
  );
}

const SHORTCUTS = [
  { keys: "Ctrl + R", action: "Restart the current session" },
  { keys: "Esc", action: "Exit and return to projects" },
  { keys: "Tab", action: "Auto-insert the next indentation" },
  { keys: "Enter", action: "New line with automatic indent" },
];

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false);
  const settings = useSettingsStore();

  useEffect(() => setMounted(true), []);

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      <p className="mt-2 text-muted-foreground">
        Tune the editor and typing experience. Everything is saved locally in
        your browser.
      </p>

      {!mounted ? (
        <div className="mt-8 h-96 animate-pulse rounded-2xl border border-border bg-card" />
      ) : (
        <div className="mt-8 space-y-6">
          <section className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="border-b border-border px-5 py-4 sm:px-6">
              <h2 className="font-semibold">Appearance</h2>
            </div>
            <div className="divide-y divide-border">
              <Row
                icon={<Type className="h-4 w-4" />}
                title="Theme"
                description="Light, dark or follow your system."
                control={<ModeToggle />}
              />
              <Row
                icon={<Type className="h-4 w-4" />}
                title="Font size"
                description={`Editor text size (${settings.fontSize}px).`}
                control={
                  <input
                    type="range"
                    min={FONT_SIZE.min}
                    max={FONT_SIZE.max}
                    step={FONT_SIZE.step}
                    value={settings.fontSize}
                    onChange={(e) => settings.setFontSize(Number(e.target.value))}
                    className="w-32 accent-[var(--primary)]"
                  />
                }
              />
              <Row
                icon={<Hash className="h-4 w-4" />}
                title="Line numbers"
                description="Show a gutter with line numbers."
                control={
                  <Switch
                    checked={settings.showLineNumbers}
                    onCheckedChange={() => settings.toggle("showLineNumbers")}
                  />
                }
              />
              <Row
                icon={<AlignLeft className="h-4 w-4" />}
                title="Indentation guides"
                description="Faint vertical guides for nested code."
                control={
                  <Switch
                    checked={settings.showIndentGuides}
                    onCheckedChange={() => settings.toggle("showIndentGuides")}
                  />
                }
              />
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="border-b border-border px-5 py-4 sm:px-6">
              <h2 className="font-semibold">Typing</h2>
            </div>
            <div className="divide-y divide-border">
              <Row
                icon={<RotateCcw className="h-4 w-4" />}
                title="Default timer"
                description="Time limit used when a session starts."
                control={
                  <SegmentedControl
                    layoutId="settings-timer"
                    size="sm"
                    options={TIMER_OPTIONS.map((o) => ({
                      label: o.label,
                      value: o.value,
                    }))}
                    value={settings.timerMode}
                    onChange={settings.setTimerMode}
                  />
                }
              />
              <Row
                icon={<Volume2 className="h-4 w-4" />}
                title="Typing sound"
                description="A subtle click on each keystroke."
                control={
                  <Switch
                    checked={settings.typingSound}
                    onCheckedChange={() => settings.toggle("typingSound")}
                  />
                }
              />
              <Row
                icon={<MousePointer2 className="h-4 w-4" />}
                title="Cursor animation"
                description="Smoothly glide the caret between characters."
                control={
                  <Switch
                    checked={settings.cursorAnimation}
                    onCheckedChange={() => settings.toggle("cursorAnimation")}
                  />
                }
              />
              <Row
                icon={<ArrowDownUp className="h-4 w-4" />}
                title="Auto scroll"
                description="Keep the current line centered as you type."
                control={
                  <Switch
                    checked={settings.autoScroll}
                    onCheckedChange={() => settings.toggle("autoScroll")}
                  />
                }
              />
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="border-b border-border px-5 py-4 sm:px-6">
              <h2 className="font-semibold">Keyboard shortcuts</h2>
            </div>
            <ul className="divide-y divide-border">
              {SHORTCUTS.map((shortcut) => (
                <li
                  key={shortcut.keys}
                  className="flex items-center justify-between px-5 py-3 text-sm sm:px-6"
                >
                  <span className="text-muted-foreground">
                    {shortcut.action}
                  </span>
                  <kbd className="rounded-md border border-border bg-secondary px-2 py-1 font-mono text-xs">
                    {shortcut.keys}
                  </kbd>
                </li>
              ))}
            </ul>
          </section>

          <div className="flex justify-end">
            <Button variant="ghost" onClick={settings.reset}>
              <RotateCcw className="h-4 w-4" />
              Reset to defaults
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
