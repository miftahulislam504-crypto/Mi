"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { useGalaxyStore } from "@/store/galaxyStore";

// ── Context messages per phase ─────────────────────────────────────────────────
const PHASE_MESSAGES: Record<string, string[]> = {
  genesis:       ["Welcome Explorer. The universe awaits.", "Scroll down to begin your journey."],
  galaxy:        ["Four universes await your exploration.", "Click any cluster to dive in.", "Each universe holds unique projects."],
  universe:      ["These planets are active projects.", "Hover to see what each world holds.", "Click a planet to land and explore."],
  orbit:         ["Observe how the planets orbit.", "Each orbit speed reflects project complexity.", "The connections show shared technologies."],
  landing:       ["You've landed on a project world.", "Explore the features and tech stack.", "Press back to return to the universe."],
  timeline:      ["This is my journey through time.", "Each star marks a milestone.", "Click any star to learn more."],
  constellation: ["These constellations are my skills.", "Hover to connect the stars.", "Hidden ones reward the curious."],
};

const IDLE_MESSAGES = [
  "Did you know? This galaxy has 3 hidden planets.",
  "Try the Konami code for a surprise... ↑↑↓↓←→←→BA",
  "The connections between planets show shared tech.",
  "Each universe represents a domain of expertise.",
  "Built entirely on a mobile phone. Seriously.",
  "BNBC 2020 — Bangladesh's national building code.",
  "Firebase powers the entire CivilOS ecosystem.",
  "Hover over the star patterns to connect them.",
];

// ── Typewriter hook ────────────────────────────────────────────────────────────
function useTypewriter(text: string, speed = 32) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    setDisplayed("");
    if (!text) return;
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(iv);
    }, speed);
    return () => clearInterval(iv);
  }, [text, speed]);

  return displayed;
}

// ── Speech bubble ─────────────────────────────────────────────────────────────
function SpeechBubble({ message, visible }: { message: string; visible: boolean }) {
  const displayed = useTypewriter(visible ? message : "");

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.92 }}
          transition={{ duration: 0.3 }}
          style={{
            fontFamily: "Space Mono, monospace",
            fontSize: "11px",
            lineHeight: "1.7",
            color: "#e8f0ff",
            background: "rgba(5,5,25,0.92)",
            border: "1px solid rgba(74,158,255,0.3)",
            borderRadius: "10px",
            padding: "10px 14px",
            maxWidth: "220px",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            position: "relative",
            boxShadow: "0 0 20px rgba(74,158,255,0.12)",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {displayed}
          <span style={{ opacity: 0.4 }}>▍</span>
          {/* Bubble tail pointing down */}
          <div
            style={{
              position: "absolute",
              bottom: "-7px",
              left: "20px",
              width: 0,
              height: 0,
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderTop: "7px solid rgba(5,5,25,0.92)",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── 3D Astronaut body ─────────────────────────────────────────────────────────
function AstronautBody({ onClick }: { onClick: () => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const trailRef = useRef<THREE.Points>(null);
  const timeRef  = useRef(0);

  const trailPositions = useMemo(() => {
    const count = 30;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 0.18;
      arr[i * 3 + 1] = -i * 0.1;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 0.18;
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    timeRef.current += delta;
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(timeRef.current * 0.7) * 0.28;
      groupRef.current.rotation.y = Math.sin(timeRef.current * 0.38) * 0.14;
      groupRef.current.rotation.z = Math.sin(timeRef.current * 0.5) * 0.04;
    }
    if (trailRef.current) {
      (trailRef.current.material as THREE.PointsMaterial).opacity =
        0.28 + Math.sin(timeRef.current * 3.5) * 0.12;
    }
  });

  const WHITE = "#e8f0ff";
  const GREY  = "#ccccdd";
  const BLUE  = "#4a9eff";
  const DARK  = "#0d0d2a";

  return (
    <group ref={groupRef}>
      {/* Helmet */}
      <mesh position={[0, 0.38, 0]}>
        <sphereGeometry args={[0.21, 16, 16]} />
        <meshStandardMaterial color={DARK} roughness={0.1} metalness={0.95} />
      </mesh>
      {/* Visor */}
      <mesh position={[0, 0.38, 0.15]}>
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshStandardMaterial color={BLUE} roughness={0.0} metalness={1.0} transparent opacity={0.65} />
      </mesh>
      {/* Torso */}
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.13, 0.15, 0.36, 12]} />
        <meshStandardMaterial color={WHITE} roughness={0.5} metalness={0.15} />
      </mesh>
      {/* Left arm */}
      <mesh position={[-0.21, 0.06, 0]} rotation={[0, 0, 0.5]}>
        <cylinderGeometry args={[0.05, 0.05, 0.27, 8]} />
        <meshStandardMaterial color={WHITE} roughness={0.5} metalness={0.15} />
      </mesh>
      {/* Right arm */}
      <mesh position={[0.21, 0.06, 0]} rotation={[0, 0, -0.5]}>
        <cylinderGeometry args={[0.05, 0.05, 0.27, 8]} />
        <meshStandardMaterial color={WHITE} roughness={0.5} metalness={0.15} />
      </mesh>
      {/* Left leg */}
      <mesh position={[-0.07, -0.28, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.24, 8]} />
        <meshStandardMaterial color={GREY} roughness={0.55} />
      </mesh>
      {/* Right leg */}
      <mesh position={[0.07, -0.28, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.24, 8]} />
        <meshStandardMaterial color={GREY} roughness={0.55} />
      </mesh>
      {/* Jetpack glow */}
      <pointLight color={BLUE} intensity={1.2} distance={2.5} decay={2} position={[0, -0.05, -0.18]} />
      {/* Trail */}
      <points ref={trailRef} position={[0, -0.42, 0]}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[trailPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color={BLUE}
          size={0.038}
          transparent
          opacity={0.3}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>
      {/* Invisible click zone */}
      <mesh
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        onPointerOver={() => { document.body.style.cursor = "pointer"; }}
        onPointerOut={() => { document.body.style.cursor = "default"; }}
      >
        <sphereGeometry args={[0.55, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}

// ── Main AIAstronaut ───────────────────────────────────────────────────────────
export default function AIAstronaut() {
  const { phase, astronautMessage, setAstronautMessage } = useGalaxyStore();
  const [showBubble, setShowBubble] = useState(false);
  const idleTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idleIndexRef  = useRef(0);
  const prevPhaseRef  = useRef(phase);

  const isVisible = phase !== "loading" && phase !== "genesis";

  // Show message when phase changes
  useEffect(() => {
    if (phase === prevPhaseRef.current) return;
    prevPhaseRef.current = phase;

    const msgs = PHASE_MESSAGES[phase];
    if (!msgs) return;
    const msg = msgs[Math.floor(Math.random() * msgs.length)];
    setAstronautMessage(msg);
    setShowBubble(true);
    const t = setTimeout(() => setShowBubble(false), 6000);
    return () => clearTimeout(t);
  }, [phase, setAstronautMessage]);

  // Show message when astronautMessage changes externally (e.g. planet click)
  useEffect(() => {
    if (!astronautMessage) return;
    setShowBubble(true);
    const t = setTimeout(() => setShowBubble(false), 6000);
    return () => clearTimeout(t);
  }, [astronautMessage]);

  // Idle messages
  useEffect(() => {
    if (!isVisible) return;

    const schedule = () => {
      idleTimerRef.current = setTimeout(() => {
        setAstronautMessage(IDLE_MESSAGES[idleIndexRef.current % IDLE_MESSAGES.length]);
        idleIndexRef.current++;
        setShowBubble(true);
        setTimeout(() => setShowBubble(false), 5500);
        schedule();
      }, 20000 + Math.random() * 10000);
    };

    schedule();
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [isVisible, setAstronautMessage]);

  if (!isVisible) return null;

  return (
    <group position={[5.5, -1.8, 3.5]}>
      <AstronautBody onClick={() => setShowBubble((v) => !v)} />
      <Html
        position={[-0.3, 1.1, 0]}
        distanceFactor={5.5}
        style={{ pointerEvents: "none" }}
      >
        <SpeechBubble message={astronautMessage} visible={showBubble} />
      </Html>
    </group>
  );
}
