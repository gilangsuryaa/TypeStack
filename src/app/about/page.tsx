import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
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

const STEPS = [
  {
    title: "Pick a project & file",
    description:
      "Choose from five projects ordered easy to extreme. Every file is real, production-style source code.",
  },
  {
    title: "Type it exactly",
    description:
      "Reproduce the code character-for-character. Tab and Enter handle indentation automatically, just like your editor.",
  },
  {
    title: "Track your run",
    description:
      "WPM, accuracy, mistakes and progress update live. Finish to get a grade and save the run to your history.",
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
        gap by having you type the code you actually write — so your muscle
        memory matches your work.
      </p>

      <div className="mt-12 space-y-4">
        {STEPS.map((step, index) => (
          <div
            key={step.title}
            className="flex gap-4 rounded-2xl border border-border bg-card p-5"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {index + 1}
            </span>
            <div>
              <h2 className="font-semibold">{step.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {step.description}
              </p>
            </div>
          </div>
        ))}
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
          <Link href="/projects">
            Browse projects
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
