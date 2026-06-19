"use client";

import { useEffect, useRef } from "react";
import { useGalaxyStore } from "@/store/galaxyStore";

const TRIGGER_DELTA = 40;

export function useGalaxyScroll() {
  const { phase, setPhase } = useGalaxyStore();
  const phaseRef     = useRef(phase);
  const cooldownRef  = useRef(false);
  const touchStartY  = useRef(0);
  const touchStartX  = useRef(0);

  // Keep phaseRef in sync so event listeners always see current phase
  // without needing to re-register on every phase change
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    // ── Wheel (desktop) ───────────────────────────────────────────
    const handleWheel = (e: WheelEvent) => {
      if (phaseRef.current !== "genesis") return;
      if (cooldownRef.current) return;
      if (Math.abs(e.deltaY) < TRIGGER_DELTA) return;

      cooldownRef.current = true;
      setPhase("galaxy");
      setTimeout(() => { cooldownRef.current = false; }, 1200);
    };

    // ── Touch (mobile) ────────────────────────────────────────────
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
      touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (cooldownRef.current) return;
      if (phaseRef.current !== "genesis") return;

      const dy = touchStartY.current - e.changedTouches[0].clientY;
      const dx = Math.abs(touchStartX.current - e.changedTouches[0].clientX);

      // Must be mostly vertical swipe, upward, and at least 40px
      if (dx > Math.abs(dy) || dy < 40) return;

      cooldownRef.current = true;
      setPhase("galaxy");
      setTimeout(() => { cooldownRef.current = false; }, 1200);
    };

    // Register on document so canvas touchAction:none doesn't block these
    document.addEventListener("wheel",       handleWheel,      { passive: true });
    document.addEventListener("touchstart",  handleTouchStart, { passive: true });
    document.addEventListener("touchend",    handleTouchEnd,   { passive: true });

    return () => {
      document.removeEventListener("wheel",      handleWheel);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend",   handleTouchEnd);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setPhase]); // intentionally NOT re-run on phase change — phaseRef handles it
}

// ── Konami code detector ──────────────────────────────────────────
const KONAMI = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

export function useKonami() {
  const { konami, incrementKonami, resetKonami, setWarpMode } = useGalaxyStore();
  const seqRef = useRef(konami);
  seqRef.current = konami;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.keyCode === KONAMI[seqRef.current]) {
        incrementKonami();
        if (seqRef.current + 1 >= KONAMI.length) {
          setWarpMode(true);
          resetKonami();
          setTimeout(() => setWarpMode(false), 8000);
        }
      } else {
        resetKonami();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [incrementKonami, resetKonami, setWarpMode]);
}
