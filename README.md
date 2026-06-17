# Miftahul Islam — 3D Portfolio

A cinematic, dark, space-themed portfolio for **Miftahul Islam** — Civil
Engineer & Full-Stack Developer, creator of the **CivilOS / EnginEx**
ecosystem. Built with Next.js 14 (App Router), TypeScript, Tailwind CSS,
Three.js / React Three Fiber, Framer Motion, GSAP and Lenis smooth scroll.

This is **Phase 1**: the full project foundation, design system, and a
complete cinematic Hero section with a custom-shader black hole. The other
six sections are live on the page as informative "Phase X — In Development"
teasers (built from the real project/skills/experience data) so the site is
fully navigable today.

---

## Quick start

```bash
npm install
cp .env.local.example .env.local   # optional, see "Firebase" below
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # ESLint
```

> **Termux / mobile note:** run these commands from your project's home
> directory (e.g. `~/miftahul-portfolio`) to avoid Android storage
> permission issues, matching your existing CivilOS workflow.

---

## What's in Phase 1

- **Hero** — full-screen Canvas with a custom GLSL accretion-disk shader
  (animated FBM noise swirl), layered Fresnel glow halos, a starfield,
  an ambient particle field, and four drifting wireframe "engineering
  objects" (a structural lattice, a truss, a foundation grid). Mouse
  parallax smoothly nudges the camera.
- **Typing headline** + **role cycler** ("Civil Engineer" → "Full-Stack
  Developer" → ...).
- **Engineering HUD overlays** — small mono-font readouts showing your
  coordinates/location and a live "SIGNAL #" visitor pulse (see Firebase
  below).
- **Navbar** — glassy on scroll, active-section highlighting, mobile menu.
- **Custom cursor** (desktop only), **loading screen**, **smooth scroll**
  (Lenis + GSAP ScrollTrigger, ready for Phase 2+ scroll animations).
- **Six placeholder sections** (Universe, About, Skills, Ecosystem,
  Experience, Contact) — each shows a real description and a chip grid
  pulled straight from `src/lib/data.ts` (your 11 projects, skills,
  timeline, and live contact links).
- Accessibility: full headline text is available to screen readers even
  during the typing animation, focus-visible rings, and a
  `prefers-reduced-motion` fallback that swaps the 3D scene for a static
  gradient.

---

## Design system

All tokens live in `tailwind.config.ts`:

| Token | Value | Use |
|---|---|---|
| `void` | `#04050D` | Page background |
| `cosmic-purple` | `#8B5CF6` | Primary accent |
| `cosmic-blue` | `#3B82F6` | Secondary accent |
| `cosmic-cyan` | `#22D3EE` | Tertiary accent / HUD |
| `ink` / `ink-muted` / `ink-dim` | `#F3F5FA` / `#8B93A7` / `#525B72` | Text |

Fonts (via `next/font/google`, no external requests):

- **Space Grotesk** — `font-display`, headings
- **Inter** — `font-sans`, body text
- **JetBrains Mono** — `font-mono`, HUD labels and data readouts

Reusable classes: `.glass`, `.glass-strong`, `.text-gradient`, `.hud-label`.

---

## Editing your content

Everything personal — bio, the 11 projects, skills, experience timeline,
nav links, and the placeholder section copy/chips — lives in one file:

```
src/lib/data.ts
```

Update `profile`, `projects`, `skills`, `experience`, or `sections` there
and it flows through to the Hero stats, nav, and every placeholder section
automatically.

---

## Firebase (optional)

The Hero HUD includes a live "SIGNAL #1284" visitor-pulse readout backed by
Firestore. **The site works perfectly without it** — if no Firebase env vars
are set, that HUD line just shows "STATUS: ONLINE" instead.

To enable it:

1. Copy `.env.local.example` to `.env.local` and fill in your Firebase web
   app config (use a project of your choice — a new lightweight one is
   recommended, or a dedicated collection in an existing project).
2. Add this **additive** rule to your Firestore rules (it only touches the
   `portfolioMeta` collection and won't affect your existing CivilOS rules):

   ```
   match /portfolioMeta/{docId} {
     allow read: if true;
     allow write: if request.resource.data.keys().hasOnly(['count'])
                   && request.resource.data.count is int;
   }
   ```

   This permits anyone to read the counter and to write only a single
   integer `count` field — no other data can be touched. For stricter
   production hardening you could move the increment into a Cloud
   Function, but this is a common, low-risk pattern for a public visitor
   counter.

The hook (`src/hooks/useVisitorPulse.ts`) increments the counter once per
browser session (via `sessionStorage`) and live-subscribes to its value.

---

## Roadmap

| Phase | Section | Highlights |
|---|---|---|
| 1 ✅ | Foundation + Hero | Black hole shader, design system, smooth scroll |
| 2 | 3D Engineering Universe | Orbital system — each of the 11 projects as a clickable planet |
| 3 | About | Holographic profile card, animated stats, career timeline |
| 4 | Skills Galaxy | Rotating galaxy of frontend/backend/engineering tech |
| 5 | CivilOS Ecosystem | Live map of the shared-Firestore app network with data-flow lines |
| 6 | Experience + Contact | Scroll-triggered timeline + command-center contact section |
| Final | Polish | Performance, SEO, accessibility pass; Lighthouse 90+ |

---

## Project structure

```
src/
  app/                  Root layout, page, global CSS, favicon
  components/
    providers/          Lenis + GSAP smooth-scroll provider
    ui/                 TypingText, RoleCycler, GlowButton, HUD elements
    layout/             Navbar, Footer, CustomCursor, LoadingScreen
    three/              BlackHole, ParticleField, FloatingObjects, CameraRig, HeroScene
    sections/           Hero, PlaceholderSection
  hooks/                useMediaQuery, usePointerTracker, useVisitorPulse
  lib/                  data.ts (all content), utils.ts, firebase.ts
```

---

## Tech stack

Next.js 14 · TypeScript · Tailwind CSS · Framer Motion · Three.js ·
React Three Fiber · @react-three/drei · GSAP · Lenis · Firebase
(optional) · Lucide icons
