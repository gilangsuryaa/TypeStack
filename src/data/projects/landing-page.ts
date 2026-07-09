import type { Project } from "@/types";

export const landingPage: Project = {
  id: "landing-page",
  title: "Marketing Landing Page",
  description:
    "A clean SaaS landing page: navbar, hero, feature grid, CTA and footer. Great warm-up for JSX structure and Tailwind classes.",
  difficulty: "easy",
  accent: "🚀",
  tags: ["Next.js", "React", "Tailwind"],
  files: [
    {
      id: "landing-app-page",
      path: "app/page.tsx",
      language: "tsx",
      difficulty: "easy",
      code: `import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Features } from "@/components/features";
import { CallToAction } from "@/components/cta";
import { Footer } from "@/components/footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Navbar />
      <Hero />
      <Features />
      <CallToAction />
      <Footer />
    </main>
  );
}
`,
    },
    {
      id: "landing-navbar",
      path: "components/navbar.tsx",
      language: "tsx",
      difficulty: "easy",
      code: `"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const links = [
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#about", label: "About" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="text-lg font-bold">
          Nimbus
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <button
          type="button"
          className="md:hidden"
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>
    </header>
  );
}
`,
    },
    {
      id: "landing-hero",
      path: "components/hero.tsx",
      language: "tsx",
      difficulty: "medium",
      code: `import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24 text-center">
      <span className="inline-flex rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600">
        Now in public beta
      </span>

      <h1 className="mx-auto mt-6 max-w-3xl text-5xl font-bold tracking-tight">
        Ship your product faster with Nimbus
      </h1>

      <p className="mx-auto mt-6 max-w-xl text-lg text-slate-600">
        The all-in-one platform to build, deploy, and scale modern web apps
        without the operational overhead.
      </p>

      <div className="mt-10 flex items-center justify-center gap-4">
        <Link
          href="/signup"
          className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-6 py-3 text-sm font-medium text-white"
        >
          Get started
          <ArrowRight size={16} />
        </Link>
        <Link
          href="/docs"
          className="rounded-lg px-6 py-3 text-sm font-medium text-slate-700"
        >
          Read the docs
        </Link>
      </div>
    </section>
  );
}
`,
    },
    {
      id: "landing-features",
      path: "components/features.tsx",
      language: "tsx",
      difficulty: "medium",
      code: `import { Zap, Shield, Globe } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Blazing fast",
    description: "Edge-rendered pages that load in milliseconds worldwide.",
  },
  {
    icon: Shield,
    title: "Secure by default",
    description: "Automatic HTTPS, DDoS protection, and secret management.",
  },
  {
    icon: Globe,
    title: "Global scale",
    description: "Deploy to 30+ regions with a single git push.",
  },
];

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-24">
      <h2 className="text-center text-3xl font-bold">
        Everything you need to scale
      </h2>

      <div className="mt-16 grid gap-8 md:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="rounded-2xl border border-slate-200 p-8"
          >
            <feature.icon className="h-8 w-8 text-slate-900" />
            <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
`,
    },
    {
      id: "landing-cta",
      path: "components/cta.tsx",
      language: "tsx",
      difficulty: "easy",
      code: `import Link from "next/link";

export function CallToAction() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-24">
      <div className="rounded-3xl bg-slate-900 px-8 py-16 text-center text-white">
        <h2 className="text-3xl font-bold">Ready to get started?</h2>
        <p className="mx-auto mt-4 max-w-md text-slate-300">
          Join thousands of teams building the future on Nimbus.
        </p>
        <Link
          href="/signup"
          className="mt-8 inline-block rounded-lg bg-white px-6 py-3 text-sm font-medium text-slate-900"
        >
          Start for free
        </Link>
      </div>
    </section>
  );
}
`,
    },
    {
      id: "landing-footer",
      path: "components/footer.tsx",
      language: "tsx",
      difficulty: "easy",
      code: `const sections = [
  { title: "Product", links: ["Features", "Pricing", "Changelog"] },
  { title: "Company", links: ["About", "Blog", "Careers"] },
  { title: "Legal", links: ["Privacy", "Terms", "Security"] },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-200">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-16 md:grid-cols-4">
        <div>
          <p className="text-lg font-bold">Nimbus</p>
          <p className="mt-2 text-sm text-slate-500">Build without limits.</p>
        </div>

        {sections.map((section) => (
          <div key={section.title}>
            <p className="text-sm font-semibold">{section.title}</p>
            <ul className="mt-4 space-y-2">
              {section.links.map((link) => (
                <li key={link} className="text-sm text-slate-500">
                  {link}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  );
}
`,
    },
  ],
};
