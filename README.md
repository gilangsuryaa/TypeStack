# TypeStack — Coding Typing Practice

Practice typing with **real production code** instead of random words. TypeStack
trains your speed on the syntax, structure and patterns you actually write —
TypeScript, React/JSX, CSS, HTML and JSON — across five complete projects that
scale from a simple landing page to a full SaaS AI dashboard.

Think **Monkeytype, but for code.**

## ✨ Features

- **Editor-grade typing engine** — real-time per-character highlighting, a smooth
  blinking caret, correct/incorrect states, auto-scroll, and smart `Tab`/`Enter`
  indentation so it feels like typing in VS Code.
- **Live syntax highlighting** via a custom synchronous tokenizer (no async
  highlighter in the keystroke path) for TS, TSX, JSX, JS, HTML, CSS and JSON.
- **Real-time stats** — WPM, CPM, accuracy, mistakes, correct/incorrect/remaining
  characters, elapsed time, progress and completion %.
- **Results & grading** — final WPM, peak WPM, accuracy, mistakes, time and a
  grade from **S → D**, with a locally-saved session history.
- **Timers** — 30s, 60s, 120s or unlimited.
- **Themes** — light, dark and system (via `next-themes`).
- **Difficulty levels** — easy, medium, hard and extreme, filterable per file.
- **Fully responsive** and **animated** with Framer Motion.

## 🧱 Tech stack

| Area      | Choice                                                        |
| --------- | ------------------------------------------------------------- |
| Framework | Next.js 15 (App Router), React 19, TypeScript                 |
| Styling   | Tailwind CSS v4, shadcn-style primitives, Lucide icons        |
| Animation | Framer Motion                                                 |
| State     | Zustand (settings + progress persisted to Local Storage)      |
| Data      | TanStack Query (wired for a future backend), Local Storage    |
| Tooling   | ESLint, Prettier, pnpm, Turbopack                             |

No backend is required — all progress lives in the browser. The architecture
(`services/`, TanStack Query provider, typed data layer) is ready to drop a real
API in later.

## 🚀 Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

```bash
pnpm dev        # start the dev server (Turbopack)
pnpm build      # production build
pnpm start      # run the production build
pnpm lint       # eslint
pnpm typecheck  # tsc --noEmit
pnpm format     # prettier --write
```

## 📁 Project structure

```
src/
├── app/                      # App Router pages (home, projects, practice, result, settings, about)
├── components/
│   ├── layout/               # navbar, footer, page transition
│   ├── providers/            # theme + query providers
│   ├── shared/               # small reusable pieces
│   └── ui/                   # shadcn-style primitives (button, card, switch, ...)
├── constants/                # app-wide constants & metadata
├── data/
│   └── projects/             # the five real coding projects (dataset)
├── features/
│   └── typing/               # the typing engine (hooks, lib, components)
│       ├── components/       # typing area, caret, stats bar, modal, header
│       ├── hooks/            # use-typing-engine, use-typing-sound
│       └── lib/              # tokenizer, render-model, compute-stats, grade
├── lib/                      # generic utils (cn, formatting)
├── stores/                   # zustand stores (settings, session, progress)
└── types/                    # shared domain types
```

## 🗂 The dataset

Five projects, ordered from easy to complex, each made of realistic files:

1. **Marketing Landing Page** — hero, navbar, features, CTA, footer.
2. **Todo App** — components, a custom hook, CRUD, localStorage.
3. **Admin Dashboard** — sidebar, table, chart, modal, typed fetch layer.
4. **E-commerce Storefront** — product card, filters, Zustand cart, checkout.
5. **SaaS AI Dashboard** — auth UI, API client, TanStack Query, chat layout, settings.

Each file is tagged with a difficulty (`easy → extreme`) so you can ramp up.

## ☁️ Deployment

Deploys to **Vercel** with zero configuration — import the repo and go. A
`netlify.toml` is included for **Netlify** (uses `@netlify/plugin-nextjs`).

## ⌨️ Shortcuts

| Key        | Action                          |
| ---------- | ------------------------------- |
| `Ctrl + R` | Restart the current session     |
| `Esc`      | Exit to the project list        |
| `Tab`      | Auto-insert next indentation    |
| `Enter`    | New line with automatic indent  |
