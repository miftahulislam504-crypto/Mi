"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGalaxyStore } from "@/store/galaxyStore";

// Mute toggle button
export function MuteButton() {
  const { audioEnabled, toggleAudio } = useGalaxyStore();

  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5 }}
      onClick={toggleAudio}
      className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full 
                 border border-white/20 bg-black/40 backdrop-blur-sm
                 flex items-center justify-center text-white/70 
                 hover:text-white hover:border-white/50 transition-all"
      aria-label={audioEnabled ? "Mute" : "Unmute"}
    >
      {audioEnabled ? (
        // Sound on icon
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      ) : (
        // Sound off icon
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      )}
    </motion.button>
  );
}

// Scroll hint that appears after genesis text
export function ScrollHint() {
  const { phase } = useGalaxyStore();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (phase === "genesis") {
      const timer = setTimeout(() => setVisible(true), 11000);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [phase]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed bottom-12 left-1/2 -translate-x-1/2 z-40
                     flex flex-col items-center gap-2 text-white/50"
        >
          <span className="text-xs tracking-[0.3em] uppercase font-mono">
            Begin Journey
          </span>
          {/* Animated chevron */}
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Phase indicator (top-left subtle label)
export function PhaseIndicator() {
  const { phase } = useGalaxyStore();

  const labels: Record<string, string> = {
    genesis: "GENESIS",
    galaxy: "GALAXY VIEW",
    universe: "UNIVERSE",
    orbit: "ORBIT",
    landing: "LANDING",
  };

  return (
    <motion.div
      key={phase}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.4 }}
      className="fixed top-6 left-6 z-40 font-mono text-xs 
                 tracking-[0.4em] text-white/40 uppercase"
    >
      {labels[phase] || ""}
    </motion.div>
  );
}

// Loading overlay — shown before canvas initializes
export function LoadingOverlay() {
  const { phase } = useGalaxyStore();
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (phase !== "loading") {
      const t = setTimeout(() => setShow(false), 800);
      return () => clearTimeout(t);
    }
  }, [phase]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[100] bg-[#00000f] 
                     flex flex-col items-center justify-center gap-6"
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="text-white/90 font-mono text-lg tracking-[0.5em] uppercase"
          >
            CivilOS
          </motion.div>

          {/* Loading bar */}
          <div className="w-48 h-[1px] bg-white/10 overflow-hidden">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="h-full bg-gradient-to-r from-transparent via-blue-400 to-transparent"
            />
          </div>

          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 0.5 }}
            className="text-white/40 font-mono text-xs tracking-widest"
          >
            INITIALIZING GALAXY
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Back button — appears in universe phase
export function BackButton() {
  const { phase, setPhase, setActiveUniverse } = useGalaxyStore();

  if (phase !== "universe" && phase !== "orbit") return null;

  return (
    <motion.button
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      onClick={() => {
        setPhase("galaxy");
        setActiveUniverse(null);
      }}
      className="fixed top-6 right-6 z-50 flex items-center gap-2
                 px-4 py-2 rounded-full border border-white/20 
                 bg-black/40 backdrop-blur-sm text-white/60
                 hover:text-white hover:border-white/50 
                 transition-all font-mono text-xs tracking-widest uppercase"
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="15 18 9 12 15 6" />
      </svg>
      Galaxy
    </motion.button>
  );
}

// Universe name label — shown when inside a universe
export function UniverseLabel() {
  const { phase, activeUniverseId } = useGalaxyStore();

  if (phase !== "universe" && phase !== "orbit") return null;

  const labels: Record<string, { name: string; color: string }> = {
    core:      { name: "CivilOS Core",  color: "#4a9eff" },
    community: { name: "Community",     color: "#00ff88" },
    commerce:  { name: "Commerce",      color: "#ff6b35" },
    business:  { name: "Business",      color: "#9b59ff" },
  };

  const info = activeUniverseId ? labels[activeUniverseId] : null;
  if (!info) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-40
                 font-mono text-sm tracking-[0.3em] uppercase"
      style={{ color: info.color, textShadow: `0 0 20px ${info.color}88` }}
    >
      {info.name}
    </motion.div>
  );
}
