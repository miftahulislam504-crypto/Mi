"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGalaxyStore } from "@/store/galaxyStore";

const STREAK_COUNT = 300;

export default function WarpEffect() {
  const { warpMode } = useGalaxyStore();
  const ref = useRef<THREE.Points>(null);
  const timeRef = useRef(0);
  const intensityRef = useRef(0);

  // Each streak: [x, y, z, length, speed]
  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(STREAK_COUNT * 3);
    const velocities = new Float32Array(STREAK_COUNT);
    for (let i = 0; i < STREAK_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100 - 20;
      velocities[i] = 0.3 + Math.random() * 1.2;
    }
    return { positions, velocities };
  }, []);

  const posAttr = useRef<THREE.BufferAttribute>(
    new THREE.BufferAttribute(positions.slice(), 3)
  );

  useFrame((_, delta) => {
    timeRef.current += delta;

    // Fade in/out
    if (warpMode) {
      intensityRef.current = Math.min(1, intensityRef.current + delta * 2);
    } else {
      intensityRef.current = Math.max(0, intensityRef.current - delta * 1.5);
    }

    if (intensityRef.current <= 0) return;
    if (!ref.current) return;

    const pos = posAttr.current.array as Float32Array;
    const speed = intensityRef.current * 3;

    for (let i = 0; i < STREAK_COUNT; i++) {
      // Move toward camera (z increases toward viewer)
      pos[i * 3 + 2] += velocities[i] * speed;

      // Reset when past camera
      if (pos[i * 3 + 2] > 15) {
        pos[i * 3] = (Math.random() - 0.5) * 60;
        pos[i * 3 + 1] = (Math.random() - 0.5) * 40;
        pos[i * 3 + 2] = -80;
      }
    }

    posAttr.current.needsUpdate = true;

    // Update material opacity
    const mat = ref.current.material as THREE.PointsMaterial;
    mat.opacity = intensityRef.current * 0.8;
    mat.size = 0.05 + intensityRef.current * 0.15;
  });

  if (intensityRef.current <= 0 && !warpMode) return null;

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          ref={posAttr}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#aaccff"
        size={0.08}
        transparent
        opacity={0}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
