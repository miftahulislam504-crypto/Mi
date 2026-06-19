"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { useGalaxyStore } from "@/store/galaxyStore";

const HIDDEN_PLANETS = [
  {
    id: "shadow-world",
    position: [-45, -12, -15] as [number, number, number],
    color: "#330033",
    glowColor: "#ff00ff",
    size: 0.6,
    label: "Shadow World",
    secret: "You found the Shadow World! Built with pure curiosity.",
  },
  {
    id: "void-station",
    position: [50, 15, -20] as [number, number, number],
    color: "#001133",
    glowColor: "#00ffff",
    size: 0.5,
    label: "Void Station",
    secret: "Void Station — where all future ideas are born.",
  },
  {
    id: "genesis-core",
    position: [0, -30, -30] as [number, number, number],
    color: "#1a0000",
    glowColor: "#ff3300",
    size: 0.7,
    label: "Genesis Core",
    secret: "The Genesis Core — origin of the CivilOS universe.",
  },
];

function HiddenPlanet({
  planet,
}: {
  planet: typeof HIDDEN_PLANETS[0];
}) {
  const { findHiddenPlanet, hiddenPlanetsFound, setAstronautMessage } =
    useGalaxyStore();

  const isFound = hiddenPlanetsFound.includes(planet.id);
  const [showLabel, setShowLabel] = useState(false);

  const meshRef  = useRef<THREE.Mesh>(null);
  const glowRef  = useRef<THREE.Mesh>(null);
  const ringRef  = useRef<THREE.Mesh>(null);
  const timeRef  = useRef(Math.random() * Math.PI * 2);

  useFrame((_, delta) => {
    timeRef.current += delta;

    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.08;
      // Very subtle pulse — hard to notice unless you're looking
      const pulse = 0.92 + Math.sin(timeRef.current * 0.6) * 0.08;
      meshRef.current.scale.setScalar(pulse);
    }

    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = isFound
        ? 0.18 + Math.sin(timeRef.current * 1.2) * 0.08
        : 0.04 + Math.sin(timeRef.current * 0.4) * 0.03; // barely visible until found
    }

    if (ringRef.current) {
      ringRef.current.rotation.y += delta * 0.15;
    }
  });

  const handleClick = () => {
    if (!isFound) {
      findHiddenPlanet(planet.id);
      setAstronautMessage(`🪐 ${planet.secret}`);
    }
    setShowLabel((v) => !v);
  };

  return (
    <group position={planet.position}>
      {/* Tiny dim planet — barely visible */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[planet.size, 16, 16]} />
        <meshStandardMaterial
          color={planet.color}
          roughness={0.8}
          metalness={0.2}
          emissive={planet.glowColor}
          emissiveIntensity={isFound ? 0.3 : 0.05}
        />
      </mesh>

      {/* Outer glow — very faint, brightens when found */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[planet.size * 2, 12, 12]} />
        <meshBasicMaterial
          color={planet.glowColor}
          transparent
          opacity={0.04}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Mystery ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 3, 0, 0]}>
        <ringGeometry args={[planet.size * 1.4, planet.size * 1.6, 32]} />
        <meshBasicMaterial
          color={planet.glowColor}
          transparent
          opacity={isFound ? 0.3 : 0.04}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Point light — dim */}
      <pointLight
        color={planet.glowColor}
        intensity={isFound ? 2.0 : 0.3}
        distance={8}
        decay={2}
      />

      {/* Click zone */}
      <mesh
        onClick={(e) => { e.stopPropagation(); handleClick(); }}
        onPointerOver={() => { document.body.style.cursor = "pointer"; }}
        onPointerOut={() => { document.body.style.cursor = "default"; }}
      >
        <sphereGeometry args={[planet.size * 1.5, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Label — only if found */}
      {isFound && showLabel && (
        <Html
          position={[0, planet.size * 2.5, 0]}
          center
          distanceFactor={20}
          style={{ pointerEvents: "none" }}
        >
          <div
            style={{
              fontFamily: "Space Mono, monospace",
              fontSize: "10px",
              letterSpacing: "0.2em",
              color: planet.glowColor,
              textShadow: `0 0 10px ${planet.glowColor}`,
              textAlign: "center",
              userSelect: "none",
              whiteSpace: "nowrap",
            }}
          >
            {planet.label}
          </div>
          <div
            style={{
              fontFamily: "Space Mono, monospace",
              fontSize: "8px",
              color: "rgba(232,240,255,0.4)",
              textAlign: "center",
              marginTop: "3px",
              letterSpacing: "0.1em",
            }}
          >
            SECRET FOUND
          </div>
        </Html>
      )}
    </group>
  );
}

interface HiddenPlanetsProps {
  visible: boolean;
}

export default function HiddenPlanets({ visible }: HiddenPlanetsProps) {
  const { phase } = useGalaxyStore();

  // Always present in galaxy and universe views — they're hidden by being dim
  const isActive = visible || phase === "galaxy" || phase === "universe" || phase === "orbit";
  if (!isActive) return null;

  return (
    <group>
      {HIDDEN_PLANETS.map((p) => (
        <HiddenPlanet key={p.id} planet={p} />
      ))}
    </group>
  );
}
