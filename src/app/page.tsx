"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { useGalaxyStore } from "@/store/galaxyStore";
import { MuteButton, ScrollHint, PhaseIndicator, LoadingOverlay, BackButton, UniverseLabel, DiscoveryCounter, WarpOverlay } from "@/components/ui/HUD";
import AudioSystem from "@/components/experience/AudioSystem";
import { useGalaxyScroll, useKonami } from "@/hooks/useGalaxyScroll";
import ProjectPanel from "@/components/panels/ProjectPanel";

const GalaxyScene = dynamic(
  () => import("@/components/experience/GalaxyScene"),
  { ssr: false }
);

function GalaxyApp() {
  // Activate scroll + konami listeners
  useGalaxyScroll();
  useKonami();
  return null;
}

export default function Home() {
  const { setPhase } = useGalaxyStore();

  useEffect(() => {
    const timer = setTimeout(() => setPhase("genesis"), 2000);
    return () => clearTimeout(timer);
  }, [setPhase]);

  return (
    <main className="relative w-screen h-screen overflow-hidden">
      <GalaxyScene />
      <AudioSystem />
      <GalaxyApp />
      <LoadingOverlay />
      <PhaseIndicator />
      <UniverseLabel />
      <BackButton />
      <MuteButton />
      <ScrollHint />
      <ProjectPanel />
      <DiscoveryCounter />
      <WarpOverlay />
    </main>
  );
}
