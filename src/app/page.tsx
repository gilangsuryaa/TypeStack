import Link from "next/link";
import { Gauge, Code2, Trophy, Palette, Timer, Keyboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/shared/reveal";
import { projects } from "@/data/projects";
import { APP_NAME } from "@/constants";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    icon: Code2,
    title: "Real production code",
    description:
      "Type actual TypeScript, React, CSS and JSON from five complete projects, not random words.",
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
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pt-20 pb-16 text-center sm:px-6 sm:pt-28">
        <Reveal>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
            Type the code you actually{" "}
            <span className="text-primary">ship</span>.
          </h1>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            {APP_NAME} trains your typing speed on syntax, structure and patterns
            from real projects, so your fingers keep up with your ideas.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/projects">Start practicing</Link>
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
        <p className="font-mono text-xs text-muted-foreground">capabilities</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, index) => {
            const featured = index === 0;
            return (
              <Reveal
                key={feature.title}
                delay={index * 0.05}
                className={featured ? "sm:col-span-2" : undefined}
              >
                <div
                  className={cn(
                    "h-full rounded-2xl border border-border p-6 transition-colors hover:border-primary/40",
                    featured
                      ? "flex flex-col gap-4 bg-primary/5 sm:flex-row sm:items-center"
                      : "bg-card",
                  )}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-semibold">{feature.title}</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
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
              <Link href="/projects">Browse projects</Link>
            </Button>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
