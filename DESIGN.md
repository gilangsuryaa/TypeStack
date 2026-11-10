# DESIGN.md: TypeStack

Style direction for TypeStack, a code-typing trainer. This is the source of
truth the antislop filter applies on top of. Approved by the owner on 2026-11-10.

## Identity

A focused developer utility. The product is the typing surface: real source code
you reproduce character by character. The chrome stays quiet so the code and the
cursor are the only things competing for attention. Not a marketing site, not a
"tech" showcase.

## Logo

The mark is a keyboard glyph: an outlined keyboard inside a rounded square in
`--primary`, with the "TypeStack" wordmark beside it. The favicon
(`app/icon.svg`) uses the same keyboard glyph. No mascot, no lettering-only mark.

## Design Read

Reading this as: developer-tool web app for programmers, in a calm
editor-inspired language, dial **ENERGY 1 / RHYTHM 2 / MOTION 2**.

## Dials

| Dial | Value | Why |
| --- | --- | --- |
| ENERGY | 1 | A daily-use tool. It should feel calm and legible, not loud. |
| RHYTHM | 2 | Mostly predictable; the hero, feature grid and CTA vary enough to avoid a flat wall. |
| MOTION | 2 | Scroll-reveal and state transitions only, to guide attention to progress and the caret. No parallax, no choreography. |

## Palette (reasons)

- `--primary` blue-violet: the single accent. Carries active state, progress,
  focus ring, the caret. One accent, used sparingly (R-01, R-29).
- `--success` / `--warning` / `--destructive`: reserved for **semantic status
  only** (correct/incorrect, difficulty, grade, errors). Never decorative.
- Neutrals carry the layout. The light background is near-white, dark is a deep
  near-black tinted toward the primary hue so the two themes share a temperature.
- Syntax colors are a fixed, AA-safe token set. Pending characters are a muted
  neutral; typed characters take their syntax color; incorrect characters take
  `--destructive`. State is told by color identity, not by transparency.
- Confirmed: the blue-violet is brand intent, the single product accent.

## Typography (reasons)

- **Inter** for UI: a neutral, highly legible sans built for dense interfaces and
  screen reading. Chosen for readability at small sizes, not for trend.
- **JetBrains Mono** for all code: designed for source code, distinguishable
  glyphs (`0/O`, `1/l`), so the typed target reads cleanly.
- Confirmed as the final pair.

## Layout & rhythm

- Section composition follows content: home = hero, capability grid, one closing
  CTA. The about page is a linear explainer, not a card wall.
- Radius scale comes from `--radius` (0.75rem): inputs/buttons smaller, cards
  larger. Pills are reserved for badges and status, not for every control.
- Shadows mark elevation only (cards, dialogs), never every element.

## Motion

- Reveal-on-scroll on the home sections, a route fade in `PageTransition`, and
  spring transitions on the nav pill, segmented control, progress bar and caret.
- Purpose: direct attention to what changed (active tab, progress, caret).
- Honors `prefers-reduced-motion`; no motion runs longer than 5 seconds.

## Direction conflicts to resolve

- Home previously carried an eyebrow pill reading "Monkeytype, but for real
  code". Removed under R-09 and R-30. Do not reintroduce a competitor name.

## Technique reasons (Purpose-Gate)

- **Gradient CTA wash (R-01)**: the closing CTA uses `from-primary/10 via-card
  to-card` to lift the final action off the page as one emphasis surface. It is a
  hierarchy wash, not a page background, and it stays on one hue.
- **Icons (R-04)**: every feature icon maps to its own content. Code2 = real
  source files, Gauge = live metrics, Keyboard = the engine, Timer = timers,
  Trophy = grades/history, Palette = themes. No sparkle/star/orb. Lucide is used
  for stroke consistency with the mono UI, not for its library look.
- **Motion (R-19)**: reveal-on-scroll stages the hero copy, then the capability
  grid, then the closing CTA, in reading order. It is one gesture (fade plus a
  small rise), not a stack, and `MotionConfig reducedMotion="user"` disables it
  when the user asks. Matches MOTION 2.
- **Featured feature card (R-14)**: the first capability ("Real production
  code") spans two columns with a horizontal layout and a tinted surface. The
  hierarchy is content-driven: that capability is the product's differentiator,
  the other five are supporting.
- **Glass (R-10)**: blur is capped at one element, the sticky navbar. Dialog and
  focus overlays use solid translucency, no blur.
- **Background (R-07)**: no grid, blueprint, or dot pattern. The background is
  the neutral token only.

## Palette core vs semantic (R-29)

Core palette = **one accent** (`--primary`, blue-violet) plus neutrals. That is
the whole brand palette.
`--success`, `--warning`, `--destructive` are **semantic status only** (grade,
difficulty, correct/incorrect, errors), never decoration. `--accent` is an
interaction surface for hover/active, not a brand color.

## Identity motif (R-20, R-30)

The repeating gesture is a **lowercase monospace label**: small `font-mono`
labels mark sections ("capabilities", "how a run works") and step indices
(`01` to `04`) read like code paths. It ties the UI to the product, which is a
place to type code, without adding a logo or decoration. Keep it lowercase, no
wide tracking, no uppercase headers.

Deliberate deviations from a stock shadcn/Tailwind look: one featured capability
card instead of a uniform grid, a neutral timeline on About instead of three
round icon steps, and a single accent hue. Do not drift back to a uniform card
wall, and never reintroduce a competitor product name (R-30).
