"use client";

import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useGalaxyStore } from "@/store/galaxyStore";
import { UNIVERSES } from "@/data/galaxy";

// Camera sits further back in galaxy view to see all 4 clusters
// In universe view, it moves toward the active universe
const PHASE_BASE_POSITIONS: Record<string, [number, number, number]> = {
  loading:  [0,  0,  12],
  genesis:  [0,  0,  12],
  galaxy:   [0,  6,  60],  // zoomed out — see all 4 universes
  universe: [0,  2,  28],  // closer — inside one universe
  orbit:    [0,  4,  20],
  landing:  [0,  0,   8],
};

// Lerp speed per phase — landing is snappy, galaxy is slow/cinematic
const LERP_SPEED: Record<string, number> = {
  loading:  3.0,
  genesis:  2.0,
  galaxy:   1.2,  // slow cinematic zoom-out
  universe: 2.0,
  orbit:    2.5,
  landing:  3.5,
};

export default function CameraRig() {
  const { camera } = useThree();
  const { phase, activeUniverseId } = useGalaxyStore();

  const mousePos = useRef({ x: 0, y: 0 });
  const targetPos = useRef(new THREE.Vector3(0, 0, 12));
  const currentPos = useRef(new THREE.Vector3(0, 0, 12));
  const lookTarget = useRef(new THREE.Vector3(0, 0, 0));
  const currentLook = useRef(new THREE.Vector3(0, 0, 0));

  // Mouse move — throttled via ref
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mousePos.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((_, delta) => {
    const base = PHASE_BASE_POSITIONS[phase] || [0, 0, 12];
    const speed = LERP_SPEED[phase] || 2.0;

    // In universe phase, offset camera toward active universe
    let offsetX = 0;
    let offsetY = 0;
    if (phase === "universe" && activeUniverseId) {
      const uni = UNIVERSES.find((u) => u.id === activeUniverseId);
      if (uni) {
        // Move camera x/y toward the universe, but not all the way
        offsetX = uni.position[0] * 0.45;
        offsetY = uni.position[1] * 0.3;
        // Update look target to the universe center
        lookTarget.current.set(uni.position[0], uni.position[1], uni.position[2]);
      }
    } else {
      lookTarget.current.set(0, 0, 0);
    }

    // Final target position
    targetPos.current.set(
      base[0] + offsetX,
      base[1] + offsetY,
      base[2]
    );

    // Mouse parallax in genesis & galaxy phases
    if (phase === "genesis" || phase === "galaxy") {
      targetPos.current.x += mousePos.current.x * 2.5;
      targetPos.current.y += mousePos.current.y * 1.2;
    }

    // Smooth lerp to target
    currentPos.current.lerp(targetPos.current, delta * speed);
    camera.position.copy(currentPos.current);

    // Smooth look-at
    currentLook.current.lerp(lookTarget.current, delta * speed * 0.8);
    camera.lookAt(currentLook.current);
  });

  return null;
}
