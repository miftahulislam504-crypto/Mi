"use client";

import { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { TIMELINE_MILESTONES } from "@/data/galaxy";
import { useGalaxyStore } from "@/store/galaxyStore";

// ── Achievement type visuals ───────────────────────────────────────────────────
function StarMilestone({ position, color }: { position: [number, number, number]; color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  const t   = useRef(Math.random() * Math.PI * 2);
  useFrame((_, d) => {
    t.current += d;
    if (ref.current) ref.current.scale.setScalar(0.9 + Math.sin(t.current * 1.5) * 0.1);
  });
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.18, 12, 12]} />
      <meshBasicMaterial color={color} transparent opacity={0.9} />
    </mesh>
  );
}

function PulsarMilestone({ position, color }: { position: [number, number, number]; color: string }) {
  const coreRef  = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const t = useRef(Math.random() * Math.PI * 2);

  useFrame((_, d) => {
    t.current += d;
    if (coreRef.current)  coreRef.current.scale.setScalar(0.85 + Math.sin(t.current * 2.5) * 0.15);
    if (ring1Ref.current) {
      ring1Ref.current.scale.setScalar(1 + (t.current % 2) * 0.8);
      (ring1Ref.current.material as THREE.MeshBasicMaterial).opacity =
        Math.max(0, 0.5 - ((t.current % 2) * 0.25));
    }
    if (ring2Ref.current) {
      const t2 = (t.current + 1) % 2;
      ring2Ref.current.scale.setScalar(1 + t2 * 0.8);
      (ring2Ref.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.5 - t2 * 0.25);
    }
  });

  return (
    <group position={position}>
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.95} />
      </mesh>
      <mesh ref={ring1Ref}>
        <ringGeometry args={[0.3, 0.36, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh ref={ring2Ref}>
        <ringGeometry args={[0.3, 0.36, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.25} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
    </group>
  );
}

function SupernovaMilestone({ position, color }: { position: [number, number, number]; color: string }) {
  const groupRef    = useRef<THREE.Group>(null);
  const particleRef = useRef<THREE.Points>(null);
  const t = useRef(0);

  const count = 60;
  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const speed = 0.3 + Math.random() * 0.5;
      vel[i*3]   = Math.sin(phi)*Math.cos(theta)*speed;
      vel[i*3+1] = Math.sin(phi)*Math.sin(theta)*speed;
      vel[i*3+2] = Math.cos(phi)*speed;
    }
    return { positions: pos, velocities: vel };
  }, []);

  const posAttr = useRef(new THREE.BufferAttribute(positions.slice(), 3));

  useFrame((_, d) => {
    t.current += d;
    if (groupRef.current) groupRef.current.rotation.y += d * 0.3;

    // Expand + reset particles
    const pos = posAttr.current.array as Float32Array;
    const cycle = t.current % 3; // 3s cycle
    for (let i = 0; i < count; i++) {
      pos[i*3]   = velocities[i*3]   * cycle * 0.6;
      pos[i*3+1] = velocities[i*3+1] * cycle * 0.6;
      pos[i*3+2] = velocities[i*3+2] * cycle * 0.6;
    }
    posAttr.current.needsUpdate = true;

    if (particleRef.current) {
      (particleRef.current.material as THREE.PointsMaterial).opacity =
        Math.max(0, 0.7 - cycle * 0.22);
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Bright core */}
      <mesh>
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.95} />
      </mesh>
      {/* Expanding shell */}
      <mesh>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.08} side={THREE.BackSide} depthWrite={false} />
      </mesh>
      {/* Burst particles */}
      <points ref={particleRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" ref={posAttr} args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color={color} size={0.05} transparent opacity={0.7}
          depthWrite={false} blending={THREE.AdditiveBlending} sizeAttenuation
        />
      </points>
    </group>
  );
}

// ── Timeline path curve ────────────────────────────────────────────────────────
function TimelinePath() {
  const points = useMemo(() => {
    return TIMELINE_MILESTONES.map((m) => new THREE.Vector3(...m.position));
  }, []);

  const curve  = useMemo(() => new THREE.CatmullRomCurve3(points), [points]);
  const tubePts = useMemo(() => curve.getPoints(120), [curve]);

  const geo = useMemo(
    () => new THREE.BufferGeometry().setFromPoints(tubePts),
    [tubePts]
  );

  const timeRef = useRef(0);
  const lineRef = useRef<THREE.Line>(null);

  useFrame((_, d) => {
    timeRef.current += d;
    if (lineRef.current) {
      (lineRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value = timeRef.current;
    }
  });

  return (
    <primitive
      ref={lineRef}
      object={new THREE.Line(
        geo,
        new THREE.ShaderMaterial({
          vertexShader: `
            attribute float lineProgress;
            varying float vProg;
            void main() { vProg = lineProgress; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }
          `,
          fragmentShader: `
            uniform float uTime;
            varying float vProg;
            void main() {
              float pulse = sin(vProg * 8.0 - uTime * 1.2) * 0.5 + 0.5;
              vec3 col = mix(vec3(0.2,0.4,1.0), vec3(0.6,0.2,1.0), vProg);
              float alpha = 0.15 + pulse * 0.2;
              gl_FragColor = vec4(col, alpha);
            }
          `,
          uniforms: { uTime: { value: 0 } },
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        })
      )}
    />
  );
}

// ── Milestone card popup ───────────────────────────────────────────────────────
function MilestoneCard({
  milestone,
  onClose,
}: {
  milestone: typeof TIMELINE_MILESTONES[0];
  onClose: () => void;
}) {
  const typeColors = { star: "#4a9eff", pulsar: "#00ff88", supernova: "#ff6b35" };
  const typeLabels = { star: "⭐ Achievement", pulsar: "💫 Major Milestone", supernova: "🌟 Supernova Event" };
  const color = typeColors[milestone.type];

  return (
    <Html
      position={[milestone.position[0], milestone.position[1] + 1.5, milestone.position[2]]}
      center
      distanceFactor={22}
      style={{ pointerEvents: "all" }}
    >
      <div
        style={{
          fontFamily: "Space Mono, monospace",
          background: "rgba(0,0,20,0.92)",
          border: `1px solid ${color}55`,
          borderRadius: "10px",
          padding: "14px 18px",
          minWidth: "180px",
          textAlign: "center",
          backdropFilter: "blur(12px)",
          cursor: "default",
        }}
      >
        <div style={{ fontSize: "10px", color, letterSpacing: "0.2em", marginBottom: "4px" }}>
          {milestone.year}
        </div>
        <div style={{ fontSize: "13px", color: "#e8f0ff", fontWeight: 700, marginBottom: "6px" }}>
          {milestone.title}
        </div>
        <div style={{ fontSize: "9px", color: "rgba(232,240,255,0.5)", lineHeight: 1.6, marginBottom: "8px" }}>
          {milestone.description}
        </div>
        <div style={{ fontSize: "8px", color, letterSpacing: "0.15em" }}>
          {typeLabels[milestone.type]}
        </div>
        <button
          onClick={onClose}
          style={{
            marginTop: "10px",
            background: "transparent",
            border: `1px solid ${color}44`,
            borderRadius: "4px",
            color,
            fontFamily: "Space Mono, monospace",
            fontSize: "9px",
            letterSpacing: "0.15em",
            padding: "3px 10px",
            cursor: "pointer",
          }}
        >
          CLOSE
        </button>
      </div>
    </Html>
  );
}

// ── Main Timeline Nebula ───────────────────────────────────────────────────────
interface TimelineNebulaProps {
  visible: boolean;
}

export default function TimelineNebula({ visible }: TimelineNebulaProps) {
  const { phase, activeTimelineYear, setActiveTimelineYear, setAstronautMessage } =
    useGalaxyStore();
  const [openMilestone, setOpenMilestone] = useState<string | null>(null);

  const isActive = visible || phase === "timeline" || phase === "galaxy";
  if (!isActive) return null;

  const typeColors = { star: "#4a9eff", pulsar: "#00ff88", supernova: "#ff9500" };

  return (
    <group>
      {/* Animated path */}
      <TimelinePath />

      {/* Milestones */}
      {TIMELINE_MILESTONES.map((m) => {
        const color = typeColors[m.type];
        const isOpen = openMilestone === String(m.year);

        const handleClick = () => {
          setOpenMilestone(isOpen ? null : String(m.year));
          setActiveTimelineYear(isOpen ? null : m.year);
          setAstronautMessage(`${m.year}: ${m.title} — ${m.description}`);
        };

        return (
          <group key={m.year}>
            {/* Clickable invisible sphere */}
            <mesh
              position={m.position as [number, number, number]}
              onClick={(e) => { e.stopPropagation(); handleClick(); }}
              onPointerOver={() => { document.body.style.cursor = "pointer"; }}
              onPointerOut={() => { document.body.style.cursor = "default"; }}
            >
              <sphereGeometry args={[0.5, 8, 8]} />
              <meshBasicMaterial transparent opacity={0} />
            </mesh>

            {/* Visual */}
            {m.type === "star" && (
              <StarMilestone position={m.position as [number, number, number]} color={color} />
            )}
            {m.type === "pulsar" && (
              <PulsarMilestone position={m.position as [number, number, number]} color={color} />
            )}
            {m.type === "supernova" && (
              <SupernovaMilestone position={m.position as [number, number, number]} color={color} />
            )}

            {/* Year label (always visible) */}
            <Html
              position={[m.position[0], m.position[1] - 0.7, m.position[2]]}
              center
              distanceFactor={25}
              style={{ pointerEvents: "none" }}
            >
              <div style={{
                fontFamily: "Space Mono, monospace",
                fontSize: "9px",
                letterSpacing: "0.2em",
                color: isOpen ? color : "rgba(232,240,255,0.4)",
                userSelect: "none",
              }}>
                {m.year}
              </div>
            </Html>

            {/* Detail card */}
            {isOpen && (
              <MilestoneCard
                milestone={m}
                onClose={() => { setOpenMilestone(null); setActiveTimelineYear(null); }}
              />
            )}
          </group>
        );
      })}
    </group>
  );
}
