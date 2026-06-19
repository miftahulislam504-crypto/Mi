"use client";

import { useRef, useState, useCallback, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { PlanetData } from "@/data/galaxy";
import { useGalaxyStore } from "@/store/galaxyStore";
import PlanetMesh from "./PlanetMesh";
import OrbitTrail from "./OrbitTrail";

interface PlanetProps {
  planet: PlanetData;
  index: number;
  universePosition: [number, number, number];
}

export default function Planet({ planet, index, universePosition }: PlanetProps) {
  const { phase, setActivePlanet, setPanelOpen, setPhase, setAstronautMessage } =
    useGalaxyStore();
  const [hovered, setHovered] = useState(false);

  const groupRef  = useRef<THREE.Group>(null);   // the whole orbit group
  const planetRef = useRef<THREE.Group>(null);   // just the planet (for glow scale)
  const glowRef   = useRef<THREE.Mesh>(null);

  // Each planet starts at a different angle so they don't stack
  const initialAngle = useRef((index / 7) * Math.PI * 2);
  const angleRef     = useRef(initialAngle.current);

  // Entrance: stagger by index
  const scaleRef    = useRef(0);
  const entranceRef = useRef(0);
  const entryDelay  = index * 0.18;

  // Orbit tilt — slight variation per planet for depth
  const orbitTilt = useMemo(() => (index % 3) * 0.08 - 0.08, [index]);

  const glowColor = useMemo(() => new THREE.Color(planet.color), [planet.color]);

  useFrame((_, delta) => {
    if (phase !== "universe" && phase !== "orbit") return;

    // Staggered entrance scale
    entranceRef.current += delta;
    const t = Math.max(0, entranceRef.current - entryDelay);
    scaleRef.current = Math.min(1, t / 0.6);

    // Orbit movement
    angleRef.current += delta * planet.orbitSpeed * 0.3;
    const x = Math.cos(angleRef.current) * planet.orbitRadius;
    const z = Math.sin(angleRef.current) * planet.orbitRadius;
    const y = Math.sin(angleRef.current * 0.7 + index) * planet.orbitRadius * 0.06;

    if (groupRef.current) {
      groupRef.current.position.set(x, y, z);
      groupRef.current.scale.setScalar(scaleRef.current);
    }

    // Glow pulse on hover
    if (glowRef.current) {
      const targetOpacity = hovered ? 0.35 : 0.12;
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity += (targetOpacity - mat.opacity) * delta * 5;

      const targetScale = hovered ? 1.4 : 1.15;
      glowRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        delta * 6
      );
    }
  });

  const handleClick = useCallback(() => {
    if (phase !== "universe" && phase !== "orbit") return;
    setActivePlanet(planet.id);
    setPanelOpen(true);
    setPhase("landing");
    setAstronautMessage(`${planet.name}. ${planet.description.slice(0, 60)}...`);
  }, [phase, planet, setActivePlanet, setPanelOpen, setPhase, setAstronautMessage]);

  const handlePointerOver = useCallback(() => {
    setHovered(true);
    document.body.style.cursor = "pointer";
  }, []);

  const handlePointerOut = useCallback(() => {
    setHovered(false);
    document.body.style.cursor = "default";
  }, []);

  const isActive = phase === "universe" || phase === "orbit";

  return (
    <>
      {/* Orbit trail ring — static, centred at universe origin */}
      {isActive && (
        <OrbitTrail
          radius={planet.orbitRadius}
          color={planet.color}
          tilt={orbitTilt}
        />
      )}

      {/* Orbiting planet group */}
      <group ref={groupRef} scale={0}>
        {/* Click / hover target — slightly bigger than visual */}
        <mesh
          onClick={handleClick}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          <sphereGeometry args={[planet.size * 1.5, 8, 8]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>

        {/* Outer glow sphere */}
        <mesh ref={glowRef}>
          <sphereGeometry args={[planet.size * 1.3, 16, 16]} />
          <meshBasicMaterial
            color={planet.color}
            transparent
            opacity={0.12}
            side={THREE.BackSide}
            depthWrite={false}
          />
        </mesh>

        {/* Planet point light */}
        <pointLight
          color={planet.color}
          intensity={hovered ? 2.5 : 0.8}
          distance={planet.size * 6}
          decay={2}
        />

        {/* The actual planet visual */}
        <group ref={planetRef}>
          <PlanetMesh
            type={planet.type}
            color={planet.color}
            size={planet.size}
            timeOffset={index * 1.3}
          />
        </group>

        {/* Label */}
        {isActive && (
          <Html
            center
            position={[0, planet.size * 2.0, 0]}
            distanceFactor={18}
            style={{ pointerEvents: "none" }}
          >
            <div
              style={{
                fontFamily: "Space Mono, monospace",
                fontSize: "10px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: hovered ? planet.color : "rgba(232,240,255,0.55)",
                textAlign: "center",
                whiteSpace: "nowrap",
                transition: "color 0.25s ease, text-shadow 0.25s ease",
                textShadow: hovered ? `0 0 10px ${planet.color}` : "none",
                userSelect: "none",
              }}
            >
              {planet.name}
            </div>
            {hovered && (
              <div
                style={{
                  fontFamily: "Space Mono, monospace",
                  fontSize: "8px",
                  letterSpacing: "0.12em",
                  color: "rgba(232,240,255,0.38)",
                  textAlign: "center",
                  marginTop: "3px",
                  userSelect: "none",
                }}
              >
                click to explore
              </div>
            )}
          </Html>
        )}
      </group>
    </>
  );
}
