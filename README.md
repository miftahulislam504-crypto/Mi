# 🌌 CivilOS Galaxy

> Explore the ecosystem. Discover worlds. Enter projects.

An interactive 3D galaxy portfolio — not a website, a **digital universe**.

## Tech Stack

- **Next.js 15** + TypeScript
- **React Three Fiber** + Three.js
- **Drei** (helpers), **Postprocessing** (Bloom, Vignette)
- **GSAP** (animations), **Framer Motion** (UI)
- **Zustand** (state), **Howler.js** (audio)
- **Tailwind CSS**

## Experience Phases

| Phase | Description |
|---|---|
| Genesis | Dramatic dark reveal — stars, nebula, black hole |
| Galaxy | 4 universe clusters appear |
| Universe | Fly into a cluster, see planets |
| Orbit | Planets orbit, moons, asteroids |
| Landing | Click planet → project detail panel |

## Getting Started

```bash
npm install
npm run dev
```

## Project Structure

```
src/
├── app/              # Next.js pages
├── components/
│   ├── experience/   # 3D scene components
│   ├── ui/           # HUD overlays
│   └── panels/       # Project detail panels
├── data/             # Galaxy data (planets, universes)
├── shaders/          # GLSL shaders
├── store/            # Zustand global state
└── hooks/            # Custom hooks
```

## Audio

Place `space-ambient.mp3` in `/public/audio/` for ambient sound.
App works silently if file is missing.

## Deploy

Connected to Vercel — auto-deploys on push to `main`.
