"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import GenesisScene from "./GenesisScene";
import GalaxyView from "./GalaxyView";
import CameraRig from "./CameraRig";
import WarpEffect from "./WarpEffect";
import WeatherEffects from "./WeatherEffects";
import { useGalaxyStore } from "@/store/galaxyStore";

function SceneContent() {
  const { phase } = useGalaxyStore();

  // Which scenes are visible
  const showGenesis = phase === "loading" || phase === "genesis";
  const showGalaxy =
    phase === "galaxy" ||
    phase === "universe" ||
    phase === "orbit" ||
    phase === "landing";

  return (
    <>
      <CameraRig />

      {/* Ambient base light — very dim */}
      <ambientLight intensity={0.04} color="#1a1a3a" />

      {/* Genesis scene */}
      {showGenesis && <GenesisScene />}

      {/* Galaxy view — clusters + connections */}
      <GalaxyView visible={showGalaxy} />

      {/* Warp mode easter egg (always mounted, self-manages visibility) */}
      <WarpEffect />

      {/* Weather effects — meteors, comet, aurora */}
      <WeatherEffects visible={showGalaxy} />

      {/* Post-processing */}
      <EffectComposer>
        <Bloom
          intensity={phase === "galaxy" ? 2.0 : 1.5}
          luminanceThreshold={0.15}
          luminanceSmoothing={0.9}
          height={300}
        />
        <Vignette
          eskil={false}
          offset={0.12}
          darkness={phase === "genesis" ? 1.0 : 0.75}
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
      dpr={[1, 1.5]} // cap at 1.5 for performance
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
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
