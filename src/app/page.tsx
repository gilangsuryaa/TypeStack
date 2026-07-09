import Link from "next/link";
import {
  ArrowRight,
  Gauge,
  Code2,
  Trophy,
  Palette,
  Timer,
  Keyboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/shared/reveal";
import { projects } from "@/data/projects";
import { APP_NAME } from "@/constants";

const FEATURES = [
  {
    icon: Code2,
    title: "Real production code",
    description:
      "Type actual TypeScript, React, CSS and JSON from five complete projects — not random words.",
  },
  {
    icon: Gauge,
    title: "Live metrics",
    description:
      "WPM, CPM, accuracy, mistakes and progress recalculated on every keystroke.",
  },
  {
    icon: Keyboard,
    title: "Editor-grade engine",
    description:
      "Syntax highlighting, smart indentation, Tab & Enter support and a smooth caret.",
  },
  {
    icon: Timer,
    title: "Flexible timers",
    description: "Sprint for 30s, 60s, 120s, or go unlimited until the file is done.",
  },
  {
    icon: Trophy,
    title: "Grades & history",
    description:
      "Earn a grade from S to D and keep a local history of every run you complete.",
  },
  {
    icon: Palette,
    title: "Light, dark & system",
    description: "A minimal, responsive UI that looks sharp on every device and theme.",
  },
];

const totalFiles = projects.reduce((sum, p) => sum + p.files.length, 0);

export default function HomePage() {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 -z-10 grid-bg [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)] opacity-40" />

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pt-20 pb-16 text-center sm:px-6 sm:pt-28">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="flex h-1.5 w-1.5 rounded-full bg-primary" />
            Monkeytype, but for real code
          </span>
        </Reveal>

        <Reveal delay={0.05}>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
            Type the code you actually{" "}
            <span className="text-primary">ship</span>.
          </h1>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            {APP_NAME} trains your typing speed on syntax, structure and patterns
            from real projects — so your fingers keep up with your ideas.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/projects">
                Start practicing
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/about">How it works</Link>
            </Button>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <dl className="mx-auto mt-16 grid max-w-lg grid-cols-3 gap-8">
            <div>
              <dt className="text-3xl font-bold">{projects.length}</dt>
              <dd className="mt-1 text-sm text-muted-foreground">Projects</dd>
            </div>
            <div>
              <dt className="text-3xl font-bold">{totalFiles}</dt>
              <dd className="mt-1 text-sm text-muted-foreground">Code files</dd>
            </div>
            <div>
              <dt className="text-3xl font-bold">7</dt>
              <dd className="mt-1 text-sm text-muted-foreground">Languages</dd>
            </div>
          </dl>
        </Reveal>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <Reveal key={feature.title} delay={index * 0.05}>
              <div className="h-full rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/40">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <Reveal>
          <div className="overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-card to-card px-6 py-16 text-center sm:px-12">
            <h2 className="text-3xl font-bold tracking-tight">
              Ready to level up your keystrokes?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-muted-foreground">
              Pick a project, choose your difficulty, and start typing real code.
            </p>
            <Button asChild size="lg" className="mt-8">
              <Link href="/projects">
                Browse projects
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
