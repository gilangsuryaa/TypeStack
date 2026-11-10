# TypeStack

TypeStack is a typing trainer for code. Instead of random words, you type real
source files from five small projects, starting at a marketing landing page and
ending at a SaaS dashboard. Speed and accuracy update on every keystroke, and a
finished run gets graded.

It runs entirely in the browser. There is no account and no backend, and your
history stays in local storage.

## What it does

- Checks each keystroke against the source file and marks correct and incorrect
  characters as you type.
- Highlights TypeScript, TSX, JSX, JS, CSS, HTML and JSON with a small
  synchronous tokenizer, so highlighting never falls behind the caret.
- Handles indentation. `Tab` inserts the next run of spaces, and `Enter` starts a
  new line at the right depth.
- Tracks WPM, CPM, accuracy, mistakes, remaining characters and progress during a
  session.
- Grades a finished run from S to D and keeps a local history of past runs.
- Offers 30s, 60s, 120s or unlimited timers.
- Ships in light, dark and system themes.

## Stack

| Area      | Choice                                                    |
| --------- | --------------------------------------------------------- |
| Framework | Next.js 16 (App Router), React 19, TypeScript             |
| Styling   | Tailwind CSS v4, shadcn-style primitives, Lucide icons    |
| Animation | Framer Motion                                             |
| State     | Zustand, with settings and progress persisted to storage  |
| Data      | TanStack Query (wired for a later backend)                |
| Tooling   | ESLint, Prettier, pnpm, Turbopack                         |

The typing engine, tokenizer and stats math are plain TypeScript in
`src/features/typing`. Nothing in that folder needs a server.

## Getting started

```bash
pnpm install
pnpm dev
```

Then open [http://localhost:3000](http://localhost:3000).

### Scripts

```bash
pnpm dev        # start the dev server (Turbopack)
pnpm build      # production build
pnpm start      # run the production build
pnpm lint       # eslint
pnpm typecheck  # tsc --noEmit
pnpm format     # prettier --write
```

## Project structure

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
│   └── projects/             # the five coding projects (dataset)
├── features/
│   └── typing/               # the typing engine (hooks, lib, components)
│       ├── components/       # typing area, caret, stats bar, modal, header
│       ├── hooks/            # use-typing-engine, use-typing-sound
│       └── lib/              # tokenizer, render-model, compute-stats, grade
├── lib/                      # generic utils (cn, formatting)
├── stores/                   # zustand stores (settings, session, progress)
└── types/                    # shared domain types
```

## The dataset

The five projects are ordered from easy to complex. Each one is a set of files
you type through:

1. Marketing Landing Page: hero, navbar, features, CTA, footer.
2. Todo App: components, a custom hook, CRUD, localStorage.
3. Admin Dashboard: sidebar, table, chart, modal, typed fetch layer.
4. E-commerce Storefront: product card, filters, Zustand cart, checkout.
5. SaaS AI Dashboard: auth UI, API client, TanStack Query, chat layout, settings.

Every file carries its own difficulty (`easy` to `extreme`), and the projects
page can filter by it.

## Deployment

This is a standard Next.js app, so it builds on Vercel as is. A `netlify.toml`
with the Next.js plugin is included if you deploy on Netlify instead.

## Shortcuts

| Key        | Action                         |
| ---------- | ------------------------------ |
| `Ctrl + R` | Restart the current session    |
| `Esc`      | Exit to the project list       |
| `Tab`      | Insert the next indentation    |
| `Enter`    | New line with automatic indent |