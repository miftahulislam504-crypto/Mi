"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Stars, Text } from "@react-three/drei";
import * as THREE from "three";
import { useGalaxyStore } from "@/store/galaxyStore";
import { nebulaVertexShader, nebulaFragmentShader } from "@/shaders";
import BlackHole from "./BlackHole";

// Steps & their start times (seconds)
const GENESIS_STEPS = {
  STARS: 1.0,
  NEBULA: 3.0,
  DUST: 5.0,
  AUDIO: 5.0,
  BLACKHOLE: 6.0,
  PARALLAX: 9.0,
  TEXT: 10.0,
  SCROLL_UNLOCK: 12.0,
};

export default function GenesisScene() {
  const { genesisProgress, setGenesisProgress, phase, setPhase } =
    useGalaxyStore();

  const elapsed = useRef(0);
  const starsOpacity = useRef(0);
  const nebulaOpacity = useRef(0);
  const dustOpacity = useRef(0);
  const blackholeScale = useRef(0);
  const textOpacity = useRef(0);

  const nebulaRef = useRef<THREE.Mesh>(null);
  const dustRef = useRef<THREE.Points>(null);

  // Space dust particles
  const dustGeometry = useRef<THREE.BufferGeometry>(null);
  useEffect(() => {
    const count = 1500;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 80;
    }
    if (dustRef.current) {
      dustRef.current.geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
    }
  }, []);

  useFrame((_, delta) => {
    if (phase !== "genesis") return;
    elapsed.current += delta;
    const t = elapsed.current;

    // Stars fade in (1s → 3s)
    if (t >= GENESIS_STEPS.STARS) {
      starsOpacity.current = Math.min(
        1,
        (t - GENESIS_STEPS.STARS) / 2.0
      );
    }

    // Nebula emerge (3s → 5s)
    if (t >= GENESIS_STEPS.NEBULA) {
      nebulaOpacity.current = Math.min(
        0.7,
        ((t - GENESIS_STEPS.NEBULA) / 2.0) * 0.7
      );
      if (nebulaRef.current) {
        (nebulaRef.current.material as THREE.ShaderMaterial).uniforms.uOpacity.value =
          nebulaOpacity.current;
        (nebulaRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value =
          t;
      }
    }

    // Space dust (5s → 6.5s)
    if (t >= GENESIS_STEPS.DUST && dustRef.current) {
      dustOpacity.current = Math.min(
        0.5,
        ((t - GENESIS_STEPS.DUST) / 1.5) * 0.5
      );
      (dustRef.current.material as THREE.PointsMaterial).opacity =
        dustOpacity.current;
    }

    // Black hole reveal (6s → 9s)
    if (t >= GENESIS_STEPS.BLACKHOLE) {
      blackholeScale.current = Math.min(
        1,
        (t - GENESIS_STEPS.BLACKHOLE) / 3.0
      );
    }

    // Text fade (10s → 11.5s)
    if (t >= GENESIS_STEPS.TEXT) {
      textOpacity.current = Math.min(
        1,
        (t - GENESIS_STEPS.TEXT) / 1.5
      );
    }

    // Scroll unlock (12s)
    if (t >= GENESIS_STEPS.SCROLL_UNLOCK) {
      setPhase("galaxy");
    }

    // Overall progress for external use
    setGenesisProgress(Math.min(1, t / GENESIS_STEPS.SCROLL_UNLOCK));
  });

  return (
    <group>
      {/* Stars — background starfield */}
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0.3}
        fade
        speed={0.5}
      />

      {/* Nebula cloud */}
      <mesh ref={nebulaRef} position={[0, 0, -10]}>
        <planeGeometry args={[60, 60, 1, 1]} />
        <shaderMaterial
          vertexShader={nebulaVertexShader}
          fragmentShader={nebulaFragmentShader}
          uniforms={{
            uTime: { value: 0 },
            uOpacity: { value: 0 },
          }}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Space dust particles */}
      <points ref={dustRef}>
        <bufferGeometry ref={dustGeometry} />
        <pointsMaterial
          color="#8888ff"
          size={0.08}
          transparent
          opacity={0}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      {/* Black hole */}
      <group scale={blackholeScale.current}>
        <BlackHole />
      </group>

      {/* "Welcome Explorer" text */}
      {textOpacity.current > 0 && (
        <Text
          position={[0, -3, -5]}
          fontSize={0.6}
          color="#e8f0ff"
          anchorX="center"
          anchorY="middle"
          fillOpacity={textOpacity.current}
          font="/fonts/SpaceMono-Regular.ttf"
        >
          Welcome Explorer
        </Text>
      )}
    </group>
  );
}
