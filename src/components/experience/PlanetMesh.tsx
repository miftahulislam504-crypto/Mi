"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { PlanetType } from "@/data/galaxy";
import {
  crystalVertexShader, crystalFragmentShader,
  gasGiantVertexShader, gasGiantFragmentShader,
  rockyVertexShader, rockyFragmentShader,
  goldenVertexShader, goldenFragmentShader,
  moonSystemVertexShader, moonSystemFragmentShader,
  saturnRingVertexShader, saturnRingFragmentShader,
} from "@/shaders/planets";

interface PlanetMeshProps {
  type: PlanetType;
  color: string;
  size: number;
  timeOffset?: number;
}

// ─── Saturn ──────────────────────────────────────────────────────────────────
function SaturnPlanet({ color, size, timeOffset = 0 }: Omit<PlanetMeshProps, "type">) {
  const ringRef = useRef<THREE.Mesh>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const t = useRef(timeOffset);
  const col = useMemo(() => new THREE.Color(color), [color]);

  useFrame((_, delta) => {
    t.current += delta;
    if (ringRef.current) {
      (ringRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value = t.current;
    }
    if (bodyRef.current) bodyRef.current.rotation.y += delta * 0.2;
  });

  return (
    <group>
      {/* Body */}
      <mesh ref={bodyRef}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial color={color} roughness={0.6} metalness={0.1} />
      </mesh>
      {/* Ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 3, 0, 0]}>
        <ringGeometry args={[size * 1.35, size * 2.2, 64]} />
        <shaderMaterial
          vertexShader={saturnRingVertexShader}
          fragmentShader={saturnRingFragmentShader}
          uniforms={{ uTime: { value: t.current }, uColor: { value: col }, uOpacity: { value: 0.75 } }}
          transparent depthWrite={false} side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

// ─── Hexagonal (Structural) ───────────────────────────────────────────────────
function HexagonalPlanet({ color, size }: Omit<PlanetMeshProps, "type">) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.18;
      ref.current.rotation.x += delta * 0.06;
    }
  });

  // Icosahedron gives a faceted geometric feel
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[size, 1]} />
      <meshStandardMaterial
        color={color}
        roughness={0.2}
        metalness={0.8}
        wireframe={false}
        flatShading
      />
    </mesh>
  );
}

// ─── Crystal (BOQ) ───────────────────────────────────────────────────────────
function CrystalPlanet({ color, size, timeOffset = 0 }: Omit<PlanetMeshProps, "type">) {
  const ref = useRef<THREE.Mesh>(null);
  const t = useRef(timeOffset);
  const col = useMemo(() => new THREE.Color(color), [color]);

  useFrame((_, delta) => {
    t.current += delta;
    if (ref.current) {
      ref.current.rotation.y += delta * 0.12;
      ref.current.rotation.z += delta * 0.05;
      (ref.current.material as THREE.ShaderMaterial).uniforms.uTime.value = t.current;
    }
  });

  return (
    <mesh ref={ref}>
      <octahedronGeometry args={[size, 0]} />
      <shaderMaterial
        vertexShader={crystalVertexShader}
        fragmentShader={crystalFragmentShader}
        uniforms={{ uTime: { value: t.current }, uColor: { value: col } }}
      />
    </mesh>
  );
}

// ─── Golden (Cost Estimation) ─────────────────────────────────────────────────
function GoldenPlanet({ color, size, timeOffset = 0 }: Omit<PlanetMeshProps, "type">) {
  const ref = useRef<THREE.Mesh>(null);
  const t = useRef(timeOffset);
  const col = useMemo(() => new THREE.Color(color), [color]);

  useFrame((_, delta) => {
    t.current += delta;
    if (ref.current) {
      ref.current.rotation.y += delta * 0.14;
      (ref.current.material as THREE.ShaderMaterial).uniforms.uTime.value = t.current;
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[size, 32, 32]} />
      <shaderMaterial
        vertexShader={goldenVertexShader}
        fragmentShader={goldenFragmentShader}
        uniforms={{ uTime: { value: t.current }, uColor: { value: col } }}
      />
    </mesh>
  );
}

// ─── Gas Giant (Project Management) ──────────────────────────────────────────
function GasGiantPlanet({ color, size, timeOffset = 0 }: Omit<PlanetMeshProps, "type">) {
  const ref = useRef<THREE.Mesh>(null);
  const t = useRef(timeOffset);
  const col = useMemo(() => new THREE.Color(color), [color]);

  useFrame((_, delta) => {
    t.current += delta;
    if (ref.current) {
      ref.current.rotation.y += delta * 0.1;
      (ref.current.material as THREE.ShaderMaterial).uniforms.uTime.value = t.current;
    }
  });

  return (
    <group>
      <mesh ref={ref}>
        <sphereGeometry args={[size, 48, 48]} />
        <shaderMaterial
          vertexShader={gasGiantVertexShader}
          fragmentShader={gasGiantFragmentShader}
          uniforms={{ uTime: { value: t.current }, uColor: { value: col } }}
        />
      </mesh>
      {/* Subtle atmosphere haze */}
      <mesh>
        <sphereGeometry args={[size * 1.08, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent opacity={0.06}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// ─── Rocky (Analysis) ─────────────────────────────────────────────────────────
function RockyPlanet({ color, size, timeOffset = 0 }: Omit<PlanetMeshProps, "type">) {
  const ref = useRef<THREE.Mesh>(null);
  const t = useRef(timeOffset);
  const col = useMemo(() => new THREE.Color(color), [color]);

  useFrame((_, delta) => {
    t.current += delta;
    if (ref.current) {
      ref.current.rotation.y += delta * 0.08;
      (ref.current.material as THREE.ShaderMaterial).uniforms.uTime.value = t.current;
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[size, 32, 32]} />
      <shaderMaterial
        vertexShader={rockyVertexShader}
        fragmentShader={rockyFragmentShader}
        uniforms={{ uTime: { value: t.current }, uColor: { value: col } }}
      />
    </mesh>
  );
}

// ─── Moon System (Documentation) ─────────────────────────────────────────────
function MoonSystemPlanet({ color, size, timeOffset = 0 }: Omit<PlanetMeshProps, "type">) {
  const bodyRef = useRef<THREE.Mesh>(null);
  const moon1Ref = useRef<THREE.Group>(null);
  const moon2Ref = useRef<THREE.Group>(null);
  const t = useRef(timeOffset);
  const col = useMemo(() => new THREE.Color(color), [color]);

  useFrame((_, delta) => {
    t.current += delta;
    if (bodyRef.current) {
      bodyRef.current.rotation.y += delta * 0.09;
      (bodyRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value = t.current;
    }
    // Moon 1 orbits fast
    if (moon1Ref.current) moon1Ref.current.rotation.y += delta * 0.9;
    // Moon 2 orbits slower, tilted
    if (moon2Ref.current) moon2Ref.current.rotation.y += delta * 0.45;
  });

  return (
    <group>
      {/* Main body */}
      <mesh ref={bodyRef}>
        <sphereGeometry args={[size, 32, 32]} />
        <shaderMaterial
          vertexShader={moonSystemVertexShader}
          fragmentShader={moonSystemFragmentShader}
          uniforms={{ uTime: { value: t.current }, uColor: { value: col } }}
        />
      </mesh>
      {/* Moon 1 */}
      <group ref={moon1Ref}>
        <mesh position={[size * 1.8, 0, 0]}>
          <sphereGeometry args={[size * 0.22, 12, 12]} />
          <meshStandardMaterial color="#aaaaaa" roughness={0.9} />
        </mesh>
      </group>
      {/* Moon 2 — tilted orbit */}
      <group ref={moon2Ref} rotation={[0.6, 0, 0]}>
        <mesh position={[size * 2.5, 0, 0]}>
          <sphereGeometry args={[size * 0.16, 10, 10]} />
          <meshStandardMaterial color="#888888" roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
}

// ─── Dispatcher ───────────────────────────────────────────────────────────────
export default function PlanetMesh({ type, color, size, timeOffset = 0 }: PlanetMeshProps) {
  switch (type) {
    case "saturn":      return <SaturnPlanet color={color} size={size} timeOffset={timeOffset} />;
    case "hexagonal":   return <HexagonalPlanet color={color} size={size} />;
    case "crystal":     return <CrystalPlanet color={color} size={size} timeOffset={timeOffset} />;
    case "golden":      return <GoldenPlanet color={color} size={size} timeOffset={timeOffset} />;
    case "gas-giant":   return <GasGiantPlanet color={color} size={size} timeOffset={timeOffset} />;
    case "rocky":       return <RockyPlanet color={color} size={size} timeOffset={timeOffset} />;
    case "moon-system": return <MoonSystemPlanet color={color} size={size} timeOffset={timeOffset} />;
    default:            return <SaturnPlanet color={color} size={size} timeOffset={timeOffset} />;
  }
}
