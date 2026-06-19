"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import GenesisScene       from "./GenesisScene";
import GalaxyView         from "./GalaxyView";
import UniverseScene      from "./UniverseScene";
import CameraRig          from "./CameraRig";
import WarpEffect         from "./WarpEffect";
import WeatherEffects     from "./WeatherEffects";
import ConstellationSkills from "./ConstellationSkills";
import TimelineNebula     from "./TimelineNebula";
import AIAstronaut        from "./AIAstronaut";
import HiddenPlanets      from "./HiddenPlanets";
import { useGalaxyStore } from "@/store/galaxyStore";

function SceneContent() {
  const { phase } = useGalaxyStore();

  const showGenesis      = phase === "loading" || phase === "genesis";
  const showGalaxy       = ["galaxy","universe","orbit","landing","constellation","timeline"].includes(phase);
  const showUniverse     = ["universe","orbit","landing"].includes(phase);
  const showConstellation= ["galaxy","constellation"].includes(phase);
  const showTimeline     = ["galaxy","timeline"].includes(phase);

  return (
    <>
      <CameraRig />
      <ambientLight intensity={0.04} color="#1a1a3a" />

      {showGenesis       && <GenesisScene />}
      <GalaxyView         visible={showGalaxy} />
      <UniverseScene      visible={showUniverse} />
      <ConstellationSkills visible={showConstellation} />
      <TimelineNebula     visible={showTimeline} />
      <HiddenPlanets      visible={showGalaxy} />
      <WeatherEffects     visible={showGalaxy} />
      <WarpEffect />
      <AIAstronaut />

      <EffectComposer>
        <Bloom
          intensity={phase === "landing" ? 2.5 : phase === "galaxy" ? 2.2 : 1.6}
          luminanceThreshold={0.15}
          luminanceSmoothing={0.9}
          height={300}
        />
        <Vignette
          eskil={false}
          offset={0.12}
          darkness={phase === "genesis" ? 1.0 : phase === "landing" ? 0.85 : 0.7}
        />
      </EffectComposer>
    </>
  );
}

export default function GalaxyScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 12], fov: 60, near: 0.1, far: 1000 }}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      dpr={[1, 1.5]}
      style={{
        position: "fixed",
        top: 0, left: 0,
        width: "100vw", height: "100vh",
        background: "#00000f",
      }}
    >
      <color attach="background" args={["#00000f"]} />
      <fog attach="fog" args={["#00000f", 90, 250]} />
      <Suspense fallback={null}>
        <SceneContent />
      </Suspense>
    </Canvas>
  );
}
