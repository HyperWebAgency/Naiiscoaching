# About this website

Marketing site for **Anaïs** — a *diététicienne* and remote coach based in
Montpellier, France. The brand is presented as **MINDSET**, a wordmark the
navigation bar is built into: the pill of nav links sits between `MIND` and
`SET` so the whole thing reads as one word.

The site is written in **French** (`<html lang="fr">`). All interface copy,
headings and image alt text are French.

---

## Stack

| | |
|---|---|
| Framework | Next.js 16.2 (App Router, Turbopack) |
| UI | React 19.2, TypeScript 5 |
| Styling | Tailwind CSS v4 (via `@tailwindcss/postcss`) |
| Smooth scrolling | Lenis 1.3 |
| Fonts | `next/font/google` |

There is no CSS-in-JS and no component library. Styling is Tailwind utilities
plus a small amount of hand-written CSS in `app/globals.css` for keyframes.

---

## Colours

The palette is deliberately **two colours**, used at full strength and inverted
against each other. A third colour appears exactly once, as a status signal.

| Swatch | Hex | Name | Where it's used |
|---|---|---|---|
| ⬛ | `#2d2a49` | **Navy / purple** — primary | Hero CTA button, "Qui je suis" section background, headline text on beige, navbar pill on beige, silhouette artwork, wordmark contour on beige |
| ⬜ | `#f5eee8` | **Beige / cream** — secondary | Hero background, text on navy, navbar pill on navy, wordmark fill on beige, beige silhouette artwork |
| 🟢 | `#3a9e63` | **Green** — status only | The single availability dot beside "Places limitées" |

### How the two main colours are used

They are never mixed into a gradient or tinted — every surface is one or the
other, and elements **swap** the two depending on what they sit on:

- **Hero** (beige ground): navy text, navy button, beige button label.
- **Qui je suis** (navy ground): beige text, beige silhouette.
- **Navbar wordmark**: beige fill + navy contour on the hero; the pair inverts
  to navy fill + beige contour once it scrolls over the navy section.
- **Navbar pill**: navy with beige links on the hero; beige with navy links
  over the navy section.

The two figure silhouettes exist as two files for exactly this reason —
`hero-silhouette.png` is navy for the beige hero, `hero-silhouette-beige.png`
is the same artwork recoloured for the navy section, where navy would be
invisible.

### Opacity steps

Rather than introducing more colours, softer text and hover states are the same
two hex values at reduced alpha:

`/75` body copy · `/70` nav links and secondary text · `/20` pill ring ·
`/10` hover backgrounds

### Colour that arrives inside images

The four before/after result cards in "Qui je suis" are supplied as finished
artwork and carry their own periwinkle accent (**`#9796fb`**) on their borders
and badges, plus the *Naiis Coaching* roundel. That colour is **not part of the
site palette** — it lives inside the images only, and nothing in the CSS
references it. Worth knowing if the brand colours are ever revised: those cards
would need re-exporting to match.

### Semantic colour

`#3a9e63` is intentionally outside the brand palette. It marks availability
("Places limitées") and should stay reserved for status — if more states are
needed later (warning, error), they belong in the same semantic family, not the
navy/beige pair.

---

## Fonts

### Geist — the entire site

**Geist Sans**, loaded through `next/font/google` in `app/layout.tsx` and
exposed as `--font-geist-sans`. It is applied to `body` in `app/globals.css`
and is the **only typeface on the site** — headings, body copy, navigation and
the MINDSET wordmark are all Geist at different weights and sizes.

A display face was trialled for a single word and removed; the site
deliberately carries its personality through weight, scale and colour rather
than through a second typeface.

### Type scale

Sizes are set as explicit `rem` values per breakpoint rather than a fluid
`clamp()`, because several of them had to be tuned to keep the hero inside
`100vh` on small screens.

| Role | Size range | Weight |
|---|---|---|
| Hero H1 | 2rem → 3.5rem | 700 |
| Hero H2 (sub-headline) | 0.95rem → 1.1rem | 400 |
| Section H2 | 1.75rem → 2.4rem | 700 |
| MINDSET wordmark | 1.5rem → 2.9rem | 800, uppercase |
| Nav links | 0.58rem → 0.76rem | 500 |
| "Places limitées" | 0.8rem | 500 |

Headlines use tight tracking (`-0.02em`) and leading (`1.1`); the wordmark adds
a beige or navy contour via `-webkit-text-stroke` with
`paint-order: stroke fill`, so the stroke is drawn *behind* the fill and the
letterforms keep their true weight.

### Geist Mono — loaded but unused

`Geist_Mono` is imported in `app/layout.tsx` and its `--font-geist-mono`
variable is set on `<html>`, but **nothing on the site references it**. It is a
leftover from the `create-next-app` template and is currently downloading a
font file for no reason. Safe to delete unless monospace type is planned.

---

## Structure

```
app/
  layout.tsx     fonts, <html lang="fr">, Lenis wrapper
  page.tsx       Navbar + Hero + WhoAmI + RevealBlur
  globals.css    base layer, keyframes, site-wide cursor
components/
  Navbar.tsx     MIND [nav pill] SET wordmark; inverts over dark sections
  Hero.tsx       full-height hero, headline, CTA, figure
  WhoAmI.tsx     navy "Qui je suis" section
  BlobButton.tsx cursor-tracking liquid blob CTA
  ScrollFigure.tsx  scroll-linked horizontal travel
  RevealBlur.tsx    blur veil at the viewport's bottom edge
  SmoothScroll.tsx  Lenis provider
```

### Motion

- **Wordmark reveal** — `MIND` and `SET` slide out from behind the nav pill on
  load, 1.25s, expo-out easing. Pure CSS.
- **Travelling figure** — Anaïs exits right as the hero scrolls away and
  re-enters from the left in the section below, landing in front of the
  silhouette. Scroll-linked, not time-based.
- **Reveal blur** — a masked `backdrop-filter` band pinned to the bottom of the
  viewport, fading in and out on a bell curve as the second section rises.
- **Blob button** — spring-damper physics tracking the cursor, with a dwell
  droplet and a click shatter, merged through an SVG goo filter.
- **Smooth scrolling** — Lenis, with `anchors: true` for in-page links and
  native momentum left alone on touch.

The wordmark reveal, travelling figure, reveal blur and Lenis smooth scrolling
all check `prefers-reduced-motion: reduce` and stand down.

**The blob button is the exception.** Only its CSS shape-morph is disabled
under reduced motion — the spring-based cursor tracking, the dwell droplet and
the click shatter are driven from JavaScript and still run. Worth closing if
accessibility is being audited.

### Cursor

The site replaces the pointer everywhere with `public/cursor-hand.svg`, a
hand-drawn pointing hand in navy with a beige outline — the outline is what
keeps it visible when it passes over the dark button and navy section.

---

## Known leftovers

Things inherited from the starter template that are still present:

- `--background` / `--foreground` tokens in `globals.css` (`#ffffff`,
  `#171717`, and dark-mode `#0a0a0a`, `#ededed`). Every section sets its own
  background, so these never show.
- `Geist_Mono`, loaded and unused (see above).
- Template SVGs in `public/`: `file.svg`, `globe.svg`, `next.svg`,
  `vercel.svg`, `window.svg`.
- Page metadata in `app/layout.tsx` is still `"Create Next App"` /
  `"Generated by create next app"` — this should be replaced before the site
  goes public.
- `public/anais.png` is 1.4 MB. Next's image optimiser serves resized WebP so
  delivery is fine, but the source is heavier than it needs to be.
