"use client";

import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useGalaxyStore } from "@/store/galaxyStore";
import { UNIVERSES } from "@/data/galaxy";

const PHASE_BASE: Record<string, [number, number, number]> = {
  loading:  [0,  0,  12],
  genesis:  [0,  0,  12],
  galaxy:   [0,  6,  60],
  universe: [0,  4,  30],
  orbit:    [0,  4,  30],
  landing:  [0,  2,  14],
};

const LERP_SPEED: Record<string, number> = {
  loading:  3.0,
  genesis:  2.0,
  galaxy:   1.0,
  universe: 1.8,
  orbit:    2.0,
  landing:  2.5,
};

export default function CameraRig() {
  const { camera } = useThree();
  const { phase, activeUniverseId, activePlanetId } = useGalaxyStore();

  const mousePos   = useRef({ x: 0, y: 0 });
  const targetPos  = useRef(new THREE.Vector3(0, 0, 12));
  const currentPos = useRef(new THREE.Vector3(0, 0, 12));
  const lookTarget = useRef(new THREE.Vector3(0, 0, 0));
  const currentLook= useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mousePos.current.x = (e.clientX / window.innerWidth  - 0.5) * 2;
      mousePos.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame((_, delta) => {
    const base  = PHASE_BASE[phase] || [0, 0, 12];
    const speed = LERP_SPEED[phase] || 2.0;

    let offsetX = 0;
    let offsetY = 0;
    lookTarget.current.set(0, 0, 0);

    if ((phase === "universe" || phase === "orbit" || phase === "landing") && activeUniverseId) {
      const uni = UNIVERSES.find((u) => u.id === activeUniverseId);
      if (uni) {
        offsetX = uni.position[0] * 0.42;
        offsetY = uni.position[1] * 0.28;
        lookTarget.current.set(uni.position[0], uni.position[1] * 0.5, uni.position[2]);

        // Landing: zoom even closer toward the active planet
        if (phase === "landing" && activePlanetId) {
          const planet = uni.planets.find((p) => p.id === activePlanetId);
          if (planet) {
            // Bias look further toward universe centre for dramatic feel
            lookTarget.current.set(
              uni.position[0],
              uni.position[1],
              uni.position[2]
            );
          }
        }
      }
    }

    targetPos.current.set(base[0] + offsetX, base[1] + offsetY, base[2]);

    // Mouse parallax in genesis + galaxy
    if (phase === "genesis" || phase === "galaxy") {
      targetPos.current.x += mousePos.current.x * 2.5;
      targetPos.current.y += mousePos.current.y * 1.2;
    }

    currentPos.current.lerp(targetPos.current, delta * speed);
    camera.position.copy(currentPos.current);

    currentLook.current.lerp(lookTarget.current, delta * speed * 0.7);
    camera.lookAt(currentLook.current);
  });

  return null;
}
