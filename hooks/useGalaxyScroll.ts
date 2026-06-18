"use client";

import { useEffect, useRef } from "react";
import { useGalaxyStore } from "@/store/galaxyStore";

// Wheel/touch delta threshold to trigger transition
const TRIGGER_DELTA = 50;

export function useGalaxyScroll() {
  const { phase, setPhase } = useGalaxyStore();
  const cooldownRef = useRef(false);
  const accumulatedRef = useRef(0);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (phase !== "genesis") return;
      e.preventDefault();

      accumulatedRef.current += Math.abs(e.deltaY);

      if (accumulatedRef.current >= TRIGGER_DELTA && !cooldownRef.current) {
        cooldownRef.current = true;
        setPhase("galaxy");

        // Reset after transition
        setTimeout(() => {
          cooldownRef.current = false;
          accumulatedRef.current = 0;
        }, 1000);
      }
    };

    // Touch support
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (phase !== "genesis") return;
      const dy = touchStartY - e.touches[0].clientY;
      if (Math.abs(dy) > 30) {
        setPhase("galaxy");
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [phase, setPhase]);
}

// Konami code detector
const KONAMI = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA

export function useKonami() {
  const { konami, incrementKonami, resetKonami, setWarpMode } =
    useGalaxyStore();
  const seqRef = useRef(konami);
  seqRef.current = konami;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.keyCode === KONAMI[seqRef.current]) {
        incrementKonami();
        if (seqRef.current + 1 >= KONAMI.length) {
          setWarpMode(true);
          resetKonami();
          // Warp mode lasts 8s
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
