"use client";

import { useRef, useMemo, useState, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { UniverseData } from "@/data/galaxy";
import { useGalaxyStore } from "@/store/galaxyStore";
import {
  universeVertexShader,
  universeFragmentShader,
} from "@/shaders/universe";

interface UniverseClusterProps {
  universe: UniverseData;
  visible: boolean;
  index: number;
}

function OrbitDot({
  radius, speed, offset, color, size = 0.12,
}: {
  radius: number; speed: number; offset: number; color: string; size?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const angleRef = useRef(offset);

  useFrame((_, delta) => {
    angleRef.current += delta * speed;
    if (ref.current) {
      ref.current.position.x = Math.cos(angleRef.current) * radius;
      ref.current.position.z = Math.sin(angleRef.current) * radius;
      ref.current.position.y = Math.sin(angleRef.current * 0.7) * radius * 0.3;
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[size, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.85} />
    </mesh>
  );
}

export default function UniverseCluster({ universe, visible, index }: UniverseClusterProps) {
  const { phase, setActiveUniverse, setPhase, setCameraTarget } = useGalaxyStore();
  const [hovered, setHovered] = useState(false);
  const { camera, gl } = useThree();

  const groupRef  = useRef<THREE.Group>(null);
  const coreRef   = useRef<THREE.Mesh>(null);
  const glowRef   = useRef<THREE.Mesh>(null);
  const timeRef   = useRef(0);
  const scaleRef  = useRef(0);
  const opacityRef = useRef(0);

  const color = useMemo(() => new THREE.Color(universe.color), [universe.color]);

  const orbitDots = useMemo(() => {
    const count = Math.min(universe.planets.length, 6);
    return Array.from({ length: count }, (_, i) => ({
      radius: 3.5 + (i % 3) * 0.8,
      speed:  0.25 + i * 0.07,
      offset: (i / count) * Math.PI * 2,
      size:   0.08 + (i % 2) * 0.06,
    }));
  }, [universe.planets.length]);

  const entranceDelay = index * 0.4;
  const entranceRef   = useRef(0);

  useFrame((_, delta) => {
    if (!visible) return;
    timeRef.current += delta;

    entranceRef.current += delta;
    const t = Math.max(0, entranceRef.current - entranceDelay);
    scaleRef.current = Math.min(1, t / 0.8);

    if (groupRef.current) groupRef.current.scale.setScalar(scaleRef.current);

    opacityRef.current = Math.min(1, scaleRef.current * 1.5);

    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.12;
      coreRef.current.rotation.z += delta * 0.04;
      const mat = coreRef.current.material as THREE.ShaderMaterial;
      mat.uniforms.uTime.value    = timeRef.current;
      mat.uniforms.uOpacity.value = opacityRef.current * (hovered ? 1.0 : 0.85);
      mat.uniforms.uPulse.value   = hovered
        ? 0.5 + Math.sin(timeRef.current * 3) * 0.5
        : Math.sin(timeRef.current * 1.2) * 0.15;
    }

    if (glowRef.current) {
      const s = 1 + Math.sin(timeRef.current * 0.8 + index) * 0.06;
      glowRef.current.scale.setScalar(s);
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity =
        opacityRef.current * (hovered ? 0.18 : 0.08);
    }
  });

  const doNavigate = useCallback(() => {
    if (phase !== "galaxy") return;
    setActiveUniverse(universe.id);
    setCameraTarget(universe.position);
    setPhase("universe");
  }, [phase, setActiveUniverse, setCameraTarget, setPhase, universe]);

  // Three.js onClick (works for mouse + touch via fiber's pointer events)
  const handleClick = useCallback(() => {
    doNavigate();
  }, [doNavigate]);

  // Extra: manual touch tap detection via raycasting
  // Catches cases where fiber's synthetic pointer events miss on mobile
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handlePointerDown = useCallback((e: { clientX?: number; clientY?: number }) => {
    touchStartRef.current = { x: e.clientX ?? 0, y: e.clientY ?? 0 };
  }, []);

  const handlePointerUp = useCallback((e: { clientX?: number; clientY?: number }) => {
    if (!touchStartRef.current) return;
    const dx = Math.abs((e.clientX ?? 0) - touchStartRef.current.x);
    const dy = Math.abs((e.clientY ?? 0) - touchStartRef.current.y);
    touchStartRef.current = null;
    // Only treat as tap if barely moved (not a drag)
    if (dx < 10 && dy < 10) doNavigate();
  }, [doNavigate]);

  return (
    <group
      ref={groupRef}
      position={universe.position}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={0}
    >
      {/* Core nebula sphere */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[2.8, 32, 32]} />
        <shaderMaterial
          vertexShader={universeVertexShader}
          fragmentShader={universeFragmentShader}
          uniforms={{
            uTime:    { value: 0 },
            uColor:   { value: color },
            uOpacity: { value: 0 },
            uPulse:   { value: 0 },
          }}
          transparent
          depthWrite={false}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Outer haze */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[4.5, 16, 16]} />
        <meshBasicMaterial
          color={universe.color}
          transparent
          opacity={0}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      <pointLight
        color={universe.color}
        intensity={hovered ? 3.0 : 1.5}
        distance={18}
        decay={2}
      />

      {visible && orbitDots.map((dot, i) => (
        <OrbitDot
          key={i}
          radius={dot.radius}
          speed={dot.speed}
          offset={dot.offset}
          color={universe.color}
          size={dot.size}
        />
      ))}

      {visible && (
        <Html
          center
          position={[0, -3.8, 0]}
          style={{ pointerEvents: "none" }}
          distanceFactor={12}
        >
          <div style={{
            fontFamily: "Space Mono, monospace",
            fontSize: "11px",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: hovered ? universe.color : "rgba(232,240,255,0.6)",
            textAlign: "center",
            whiteSpace: "nowrap",
            transition: "color 0.3s ease",
            textShadow: hovered ? `0 0 12px ${universe.color}` : "none",
            userSelect: "none",
          }}>
            {universe.name}
          </div>
          {hovered && (
            <div style={{
              fontFamily: "Space Mono, monospace",
              fontSize: "9px",
              letterSpacing: "0.15em",
              color: "rgba(232,240,255,0.4)",
              textAlign: "center",
              marginTop: "4px",
              userSelect: "none",
            }}>
              {universe.planets.length} planets · tap to explore
            </div>
          )}
        </Html>
      )}
    </group>
  );
}
