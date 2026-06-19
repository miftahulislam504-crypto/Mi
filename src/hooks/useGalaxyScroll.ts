"use client";

import { useEffect, useRef } from "react";
import { useGalaxyStore } from "@/store/galaxyStore";

const TRIGGER_DELTA = 50;

export function useGalaxyScroll() {
  const { phase, setPhase } = useGalaxyStore();
  const cooldownRef     = useRef(false);
  const accumulatedRef  = useRef(0);
  const touchStartY     = useRef(0);
  const touchStartX     = useRef(0);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (phase !== "genesis") return;
      e.preventDefault();
      accumulatedRef.current += Math.abs(e.deltaY);
      if (accumulatedRef.current >= TRIGGER_DELTA && !cooldownRef.current) {
        cooldownRef.current = true;
        setPhase("galaxy");
        setTimeout(() => {
          cooldownRef.current  = false;
          accumulatedRef.current = 0;
        }, 1000);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
      touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (cooldownRef.current) return;

      const dy = touchStartY.current - e.changedTouches[0].clientY;
      const dx = Math.abs(touchStartX.current - e.changedTouches[0].clientX);

      // Only trigger on mostly-vertical swipe (not horizontal)
      if (dx > Math.abs(dy) * 0.8) return;

      if (phase === "genesis" && dy > 30) {
        cooldownRef.current = true;
        setPhase("galaxy");
        setTimeout(() => { cooldownRef.current = false; }, 1200);
      }
    };

    window.addEventListener("wheel",        handleWheel,      { passive: false });
    window.addEventListener("touchstart",   handleTouchStart, { passive: true  });
    window.addEventListener("touchend",     handleTouchEnd,   { passive: true  });

    return () => {
      window.removeEventListener("wheel",      handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend",   handleTouchEnd);
    };
  }, [phase, setPhase]);
}

// Konami code detector
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
