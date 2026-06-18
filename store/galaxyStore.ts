import { create } from "zustand";

export type GalaxyPhase =
  | "loading"
  | "genesis"
  | "galaxy"
  | "universe"
  | "orbit"
  | "landing";

interface GalaxyStore {
  // Phase control
  phase: GalaxyPhase;
  setPhase: (phase: GalaxyPhase) => void;

  // Universe & Planet selection
  activeUniverseId: string | null;
  activePlanetId: string | null;
  setActiveUniverse: (id: string | null) => void;
  setActivePlanet: (id: string | null) => void;

  // Audio
  audioEnabled: boolean;
  toggleAudio: () => void;

  // Genesis sequence progress (0-1)
  genesisProgress: number;
  setGenesisProgress: (progress: number) => void;

  // Camera target (for smooth transitions)
  cameraTarget: [number, number, number];
  setCameraTarget: (target: [number, number, number]) => void;

  // Panel open state
  isPanelOpen: boolean;
  setPanelOpen: (open: boolean) => void;

  // Astronaut message
  astronautMessage: string;
  setAstronautMessage: (msg: string) => void;

  // Easter eggs
  warpMode: boolean;
  setWarpMode: (active: boolean) => void;
  konami: number; // index in konami sequence
  incrementKonami: () => void;
  resetKonami: () => void;
}

export const useGalaxyStore = create<GalaxyStore>((set) => ({
  phase: "loading",
  setPhase: (phase) => set({ phase }),

  activeUniverseId: null,
  activePlanetId: null,
  setActiveUniverse: (id) =>
    set({ activeUniverseId: id, activePlanetId: null }),
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
  setAstronautMessage: (msg) => set({ astronautMessage: msg }),

  warpMode: false,
  setWarpMode: (active) => set({ warpMode: active }),
  konami: 0,
  incrementKonami: () => set((s) => ({ konami: s.konami + 1 })),
  resetKonami: () => set({ konami: 0 }),
}));
