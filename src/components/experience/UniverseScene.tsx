"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { UNIVERSES } from "@/data/galaxy";
import { useGalaxyStore } from "@/store/galaxyStore";
import Planet from "./Planet";

// Inter-planet connection lines (ecosystem feel)
function PlanetConnections({
  planets,
  connections,
}: {
  planets: { id: string; position: THREE.Vector3 }[];
  connections: [string, string][];
}) {
  const timeRef = useRef(0);
  const linesRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    timeRef.current += delta;
    if (linesRef.current) {
      linesRef.current.children.forEach((child) => {
        const mat = (child as THREE.Line).material as THREE.ShaderMaterial;
        if (mat.uniforms?.uTime) {
          mat.uniforms.uTime.value = timeRef.current;
        }
      });
    }
  });

  const posMap = Object.fromEntries(planets.map((p) => [p.id, p.position]));

  return (
    <group ref={linesRef}>
      {connections.map(([a, b], i) => {
        const fromPos = posMap[a];
        const toPos   = posMap[b];
        if (!fromPos || !toPos) return null;

        const points = [fromPos, toPos];
        const geo    = new THREE.BufferGeometry().setFromPoints(points);

        return (
          <primitive
            key={`${a}-${b}`}
            object={
              new THREE.Line(
                geo,
                new THREE.ShaderMaterial({
                  vertexShader: `
                    void main() {
                      gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
                    }
                  `,
                  fragmentShader: `
                    uniform float uTime;
                    uniform vec3  uColor;
                    void main() {
                      float pulse = sin(uTime * 2.0 + float(${i}) * 1.3) * 0.5 + 0.5;
                      float alpha = (0.08 + pulse * 0.12);
                      gl_FragColor = vec4(uColor * (0.5 + pulse * 0.5), alpha);
                    }
                  `,
                  uniforms: {
                    uTime:  { value: 0 },
                    uColor: { value: new THREE.Color("#4a9eff") },
                  },
                  transparent: true,
                  depthWrite:  false,
                  blending:    THREE.AdditiveBlending,
                })
              )
            }
          />
        );
      })}
    </group>
  );
}

// Asteroid belt around the universe
function UniverseAsteroidBelt({ color }: { color: string }) {
  const ref    = useRef<THREE.InstancedMesh>(null);
  const dummy  = useMemo(() => new THREE.Object3D(), []);
  const count  = 80;
  const speeds = useMemo(
    () => new Float32Array(count).map(() => (Math.random() - 0.5) * 0.008),
    []
  );

  // Initialise positions once
  const initialised = useRef(false);
  useFrame(() => {
    if (!ref.current) return;

    if (!initialised.current) {
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2 + Math.random() * 0.5;
        const r = 48 + Math.random() * 6;
        dummy.position.set(
          Math.cos(a) * r,
          (Math.random() - 0.5) * 3,
          Math.sin(a) * r
        );
        dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
        dummy.scale.setScalar(0.06 + Math.random() * 0.12);
        dummy.updateMatrix();
        ref.current.setMatrixAt(i, dummy.matrix);
      }
      ref.current.instanceMatrix.needsUpdate = true;
      initialised.current = true;
    }

    // Slow rotation
    for (let i = 0; i < count; i++) {
      ref.current.getMatrixAt(i, dummy.matrix);
      dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);
      dummy.rotation.y += speeds[i];
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color={color} roughness={0.9} transparent opacity={0.45} />
    </instancedMesh>
  );
}

// ─── Main Universe Scene ──────────────────────────────────────────────────────
interface UniverseSceneProps {
  visible: boolean;
}

export default function UniverseScene({ visible }: UniverseSceneProps) {
  const { phase, activeUniverseId } = useGalaxyStore();

  const isActive =
    visible ||
    phase === "universe" ||
    phase === "orbit" ||
    phase === "landing";

  if (!isActive || !activeUniverseId) return null;

  const universe = UNIVERSES.find((u) => u.id === activeUniverseId);
  if (!universe) return null;

  // Connection pairs for CivilOS Core (by planet id)
  const CORE_CONNECTIONS: [string, string][] = [
    ["boq",               "structural-design"],
    ["boq",               "cost-estimation"],
    ["structural-design", "analysis"],
    ["cost-estimation",   "project-management"],
    ["project-management","documentation"],
    ["architectural-drawing","structural-design"],
  ];

  const connections =
    universe.id === "core" ? CORE_CONNECTIONS : [];

  // Snapshot of planet positions for connections — we'll pass live refs later
  // For now we use approximate orbital positions (connections are decorative)
  const approxPositions = universe.planets.map((p, i) => {
    const a = (i / universe.planets.length) * Math.PI * 2;
    return {
      id:       p.id,
      position: new THREE.Vector3(
        Math.cos(a) * p.orbitRadius,
        0,
        Math.sin(a) * p.orbitRadius
      ),
    };
  });

  return (
    // Offset entire scene to the universe's position in galaxy space
    <group position={universe.position}>
      {/* Universe centre dim glow */}
      <pointLight
        color={universe.color}
        intensity={1.2}
        distance={60}
        decay={2}
      />

      {/* All planets with orbits */}
      {universe.planets.map((planet, i) => (
        <Planet
          key={planet.id}
          planet={planet}
          index={i}
          universePosition={universe.position}
        />
      ))}

      {/* Inter-planet connections */}
      {connections.length > 0 && (
        <PlanetConnections
          planets={approxPositions}
          connections={connections}
        />
      )}

      {/* Asteroid belt at the edge */}
      <UniverseAsteroidBelt color={universe.color} />
    </group>
  );
}
