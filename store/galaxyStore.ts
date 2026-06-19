import { create } from "zustand";

export type GalaxyPhase =
  | "loading"
  | "genesis"
  | "galaxy"
  | "universe"
  | "orbit"
  | "landing"
  | "constellation"
  | "timeline";

interface GalaxyStore {
  phase: GalaxyPhase;
  setPhase: (phase: GalaxyPhase) => void;

  activeUniverseId: string | null;
  activePlanetId: string | null;
  setActiveUniverse: (id: string | null) => void;
  setActivePlanet: (id: string | null) => void;

  audioEnabled: boolean;
  toggleAudio: () => void;

  genesisProgress: number;
  setGenesisProgress: (progress: number) => void;

  cameraTarget: [number, number, number];
  setCameraTarget: (target: [number, number, number]) => void;

  isPanelOpen: boolean;
  setPanelOpen: (open: boolean) => void;

  // Astronaut
  astronautMessage: string;
  astronautVisible: boolean;
  setAstronautMessage: (msg: string) => void;
  setAstronautVisible: (v: boolean) => void;

  // Constellation
  hoveredConstellationId: string | null;
  setHoveredConstellation: (id: string | null) => void;
  unlockedConstellations: string[];
  unlockConstellation: (id: string) => void;

  // Timeline
  activeTimelineYear: number | null;
  setActiveTimelineYear: (year: number | null) => void;

  // Easter eggs
  warpMode: boolean;
  setWarpMode: (active: boolean) => void;
  konami: number;
  incrementKonami: () => void;
  resetKonami: () => void;
  hiddenPlanetsFound: string[];
  findHiddenPlanet: (id: string) => void;
  secretConstellationUnlocked: boolean;
  setSecretConstellation: (v: boolean) => void;
}

export const useGalaxyStore = create<GalaxyStore>((set) => ({
  phase: "loading",
  setPhase: (phase) => set({ phase }),

  activeUniverseId: null,
  activePlanetId: null,
  setActiveUniverse: (id) => set({ activeUniverseId: id, activePlanetId: null }),
  setActivePlanet: (id) => set({ activePlanetId: id }),

  audioEnabled: true,
  toggleAudio: () => set((s) => ({ audioEnabled: !s.audioEnabled })),

  genesisProgress: 0,
  setGenesisProgress: (progress) => set({ genesisProgress: progress }),

  cameraTarget: [0, 0, 0],
  setCameraTarget: (target) => set({ cameraTarget: target }),

  isPanelOpen: false,
  setPanelOpen: (open) => set({ isPanelOpen: open }),

  astronautMessage: "Welcome Explorer. The universe awaits.",
  astronautVisible: false,
  setAstronautMessage: (msg) => set({ astronautMessage: msg }),
  setAstronautVisible: (v) => set({ astronautVisible: v }),

  hoveredConstellationId: null,
  setHoveredConstellation: (id) => set({ hoveredConstellationId: id }),
  unlockedConstellations: [],
  unlockConstellation: (id) =>
    set((s) => ({
      unlockedConstellations: s.unlockedConstellations.includes(id)
        ? s.unlockedConstellations
        : [...s.unlockedConstellations, id],
    })),

  activeTimelineYear: null,
  setActiveTimelineYear: (year) => set({ activeTimelineYear: year }),

  warpMode: false,
  setWarpMode: (active) => set({ warpMode: active }),
  konami: 0,
  incrementKonami: () => set((s) => ({ konami: s.konami + 1 })),
  resetKonami: () => set({ konami: 0 }),
  hiddenPlanetsFound: [],
  findHiddenPlanet: (id) =>
    set((s) => ({
      hiddenPlanetsFound: s.hiddenPlanetsFound.includes(id)
        ? s.hiddenPlanetsFound
        : [...s.hiddenPlanetsFound, id],
    })),
  secretConstellationUnlocked: false,
  setSecretConstellation: (v) => set({ secretConstellationUnlocked: v }),
}));
