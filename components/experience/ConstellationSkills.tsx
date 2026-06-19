"use client";

import { useRef, useState, useMemo, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { CONSTELLATION_SKILLS, ConstellationSkill } from "@/data/galaxy";
import { useGalaxyStore } from "@/store/galaxyStore";

// ── Single star dot ────────────────────────────────────────────────────────────
function ConstellationStar({
  position,
  color,
  isHovered,
  isConnected,
  onClick,
  onOver,
  onOut,
  index,
  secret,
}: {
  position: [number, number, number];
  color: string;
  isHovered: boolean;
  isConnected: boolean;
  onClick: () => void;
  onOver: () => void;
  onOut: () => void;
  index: number;
  secret: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const timeRef = useRef(index * 1.7); // stagger twinkle

  useFrame((_, delta) => {
    timeRef.current += delta;
    if (ref.current) {
      const twinkle = 0.85 + Math.sin(timeRef.current * 2.3 + index) * 0.15;
      const scale = isHovered ? 2.5 : isConnected ? 1.8 : twinkle;
      ref.current.scale.setScalar(scale);
      (ref.current.material as THREE.MeshBasicMaterial).opacity =
        secret ? (isHovered || isConnected ? 0.9 : 0.2) : (isConnected ? 0.9 : 0.6 * twinkle);
    }
  });

  return (
    <mesh
      ref={ref}
      position={position}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onPointerOver={(e) => { e.stopPropagation(); onOver(); }}
      onPointerOut={(e) => { e.stopPropagation(); onOut(); }}
    >
      <sphereGeometry args={[0.06, 8, 8]} />
      <meshBasicMaterial
        color={isHovered || isConnected ? color : "#ffffff"}
        transparent
        opacity={0.6}
        depthWrite={false}
      />
    </mesh>
  );
}

// ── Connection line between two stars ─────────────────────────────────────────
function StarLine({
  from,
  to,
  color,
  progress,
}: {
  from: [number, number, number];
  to: [number, number, number];
  color: string;
  progress: number; // 0→1 draw-in animation
}) {
  const points = useMemo(() => {
    const start = new THREE.Vector3(...from);
    const end   = new THREE.Vector3(...to);
    // Interpolate endpoint by progress
    const current = start.clone().lerp(end, progress);
    return [start, current];
  }, [from, to, progress]);

  const geo = useMemo(
    () => new THREE.BufferGeometry().setFromPoints(points),
    [points]
  );

  if (progress <= 0) return null;

  return (
    <primitive
      object={new THREE.Line(
        geo,
        new THREE.LineBasicMaterial({
          color,
          transparent: true,
          opacity: 0.35 + progress * 0.25,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        })
      )}
    />
  );
}

// ── Skill tooltip ─────────────────────────────────────────────────────────────
function SkillTooltip({
  skill,
  centerPos,
}: {
  skill: ConstellationSkill;
  centerPos: [number, number, number];
}) {
  return (
    <Html
      position={[centerPos[0], centerPos[1] + 1.5, centerPos[2]]}
      center
      distanceFactor={20}
      style={{ pointerEvents: "none" }}
    >
      <div
        style={{
          fontFamily: "Space Mono, monospace",
          background: "rgba(0,0,15,0.85)",
          border: `1px solid ${skill.color}44`,
          borderRadius: "8px",
          padding: "10px 14px",
          minWidth: "140px",
          textAlign: "center",
          backdropFilter: "blur(8px)",
        }}
      >
        <div style={{ fontSize: "13px", color: skill.color, fontWeight: 700, letterSpacing: "0.15em" }}>
          {skill.name}
        </div>
        {!skill.secret && (
          <>
            <div style={{ fontSize: "9px", color: "rgba(232,240,255,0.5)", marginTop: "4px", letterSpacing: "0.1em" }}>
              {skill.yearsExp}+ years
            </div>
            <div style={{ fontSize: "9px", color: "rgba(232,240,255,0.45)", marginTop: "5px", lineHeight: 1.5 }}>
              {skill.description}
            </div>
          </>
        )}
        {skill.secret && (
          <div style={{ fontSize: "10px", color: "#ff00ff", marginTop: "4px" }}>
            🎉 Secret Found!
          </div>
        )}
      </div>
    </Html>
  );
}

// ── One constellation group ────────────────────────────────────────────────────
function ConstellationGroup({ skill }: { skill: ConstellationSkill }) {
  const {
    hoveredConstellationId,
    setHoveredConstellation,
    unlockConstellation,
    unlockedConstellations,
    setSecretConstellation,
    secretConstellationUnlocked,
    setAstronautMessage,
  } = useGalaxyStore();

  const isHovered = hoveredConstellationId === skill.id;
  const isUnlocked = unlockedConstellations.includes(skill.id);

  // Line draw-in progress (0→1)
  const lineProgress = useRef(0);
  useFrame((_, delta) => {
    if (isHovered || isUnlocked) {
      lineProgress.current = Math.min(1, lineProgress.current + delta * 1.8);
    } else {
      lineProgress.current = Math.max(0, lineProgress.current - delta * 2.5);
    }
  });

  // Center of the constellation (average position)
  const center = useMemo<[number, number, number]>(() => {
    const avg = skill.stars.reduce(
      (acc, s) => [acc[0] + s[0], acc[1] + s[1], acc[2] + s[2]],
      [0, 0, 0]
    );
    return [
      avg[0] / skill.stars.length,
      avg[1] / skill.stars.length,
      avg[2] / skill.stars.length,
    ];
  }, [skill.stars]);

  const handleStarClick = useCallback(() => {
    unlockConstellation(skill.id);
    if (skill.secret && !secretConstellationUnlocked) {
      setSecretConstellation(true);
      setAstronautMessage("🎉 You found the secret constellation! The universe rewards the curious.");
    } else {
      setAstronautMessage(`${skill.name} — ${skill.description}`);
    }
  }, [skill, unlockConstellation, secretConstellationUnlocked, setSecretConstellation, setAstronautMessage]);

  return (
    <group>
      {/* Stars */}
      {skill.stars.map((pos, i) => (
        <ConstellationStar
          key={i}
          position={pos as [number, number, number]}
          color={skill.color}
          isHovered={isHovered}
          isConnected={isUnlocked || isHovered}
          onClick={handleStarClick}
          onOver={() => setHoveredConstellation(skill.id)}
          onOut={() => setHoveredConstellation(null)}
          index={i}
          secret={!!skill.secret}
        />
      ))}

      {/* Connection lines — draw in on hover/unlock */}
      {skill.lines.map(([a, b], i) => (
        <StarLine
          key={i}
          from={skill.stars[a] as [number, number, number]}
          to={skill.stars[b] as [number, number, number]}
          color={skill.color}
          progress={lineProgress.current}
        />
      ))}

      {/* Tooltip on hover */}
      {isHovered && (
        <SkillTooltip skill={skill} centerPos={center} />
      )}

      {/* Glow halo when unlocked */}
      {isUnlocked && (
        <mesh position={center}>
          <sphereGeometry args={[0.3, 8, 8]} />
          <meshBasicMaterial
            color={skill.color}
            transparent
            opacity={0.08}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
}

// ── Main export ────────────────────────────────────────────────────────────────
interface ConstellationSkillsProps {
  visible: boolean;
}

export default function ConstellationSkills({ visible }: ConstellationSkillsProps) {
  const { phase, secretConstellationUnlocked } = useGalaxyStore();

  const isActive = visible || phase === "constellation" || phase === "galaxy";
  if (!isActive) return null;

  return (
    <group>
      {CONSTELLATION_SKILLS.map((skill) => {
        // Secret constellation only visible once galaxy is explored
        if (skill.secret && !secretConstellationUnlocked && phase !== "constellation") {
          // Still render but very faint — discoverable by wandering
          return <ConstellationGroup key={skill.id} skill={skill} />;
        }
        return <ConstellationGroup key={skill.id} skill={skill} />;
      })}
    </group>
  );
}
