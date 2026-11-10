import type { Metadata } from "next";
import Link from "next/link";
import {
  Keyboard,
  Cpu,
  Palette,
  Database,
  Gauge,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/constants";

export const metadata: Metadata = {
  title: "About",
  description:
    "How TypeStack works: a code-focused typing trainer built with Next.js 16, React 19 and a custom typing engine.",
};

const FLOW = [
  {
    title: "Pick a project and file",
    description:
      "Five projects run from a landing page to a SaaS AI dashboard. Every file is real, production-style source, ordered easy to extreme.",
  },
  {
    title: "Set the timer",
    description:
      "Pick 30s, 60s, 120s or unlimited, and change it mid-run without losing your place.",
  },
  {
    title: "Type the code exactly",
    description:
      "Tab and Enter handle indentation, syntax highlights as you go, and every keystroke is checked against the source.",
  },
  {
    title: "Review and continue",
    description:
      "Finish to get a grade from S to D with WPM, accuracy and mistakes, saved to a local history, then jump to the next file.",
  },
];

const STACK = [
  { icon: Cpu, label: "Next.js 16 · React 19 · TypeScript" },
  { icon: Palette, label: "Tailwind CSS v4 · Framer Motion · Lucide" },
  { icon: Database, label: "Zustand · TanStack Query · Local Storage" },
  { icon: Gauge, label: "Custom synchronous tokenizer & typing engine" },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <Keyboard className="h-6 w-6" />
      </div>
      <h1 className="mt-6 text-4xl font-bold tracking-tight">
        About {APP_NAME}
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Most typing tests train you on random prose. But developers spend the
        day typing brackets, generics, JSX and imports. {APP_NAME} closes that
        gap by having you type the code you actually write, so your muscle
        memory matches your work.
      </p>

      <div className="mt-12">
        <h2 className="font-mono text-xs text-muted-foreground">
          how a run works
        </h2>
        <ol className="mt-6 space-y-8 border-l border-border pl-6">
          {FLOW.map((step, index) => (
            <li key={step.title} className="relative">
              <span
                aria-hidden
                className="absolute -left-[31px] top-1.5 h-2.5 w-2.5 rounded-full border border-border bg-background"
              />
              <span className="font-mono text-xs text-primary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-1 font-semibold">{step.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-semibold">Built with</h2>
        <ul className="mt-4 space-y-2">
          {STACK.map((item) => (
            <li
              key={item.label}
              className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm"
            >
              <item.icon className="h-4 w-4 text-primary" />
              {item.label}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-12 rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-card to-card p-8 text-center">
        <h2 className="text-2xl font-bold">Start typing real code</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          No sign-up required. Your progress lives in your browser.
        </p>
        <Button asChild className="mt-6">
          <Link href="/projects">Browse projects</Link>
        </Button>
      </div>
    </div>
  );
}
