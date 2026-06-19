"use client";

import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";

export interface DeviceProfile {
  isMobile: boolean;
  isLowEnd: boolean;
  pixelRatio: number;
  particleMultiplier: number; // 0.3 on low-end, 1.0 on high-end
}

let cachedProfile: DeviceProfile | null = null;

export function getDeviceProfile(): DeviceProfile {
  if (cachedProfile) return cachedProfile;

  const isMobile =
    typeof window !== "undefined" &&
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  // Estimate low-end by hardware concurrency + memory
  const cores   = (navigator as any).hardwareConcurrency ?? 4;
  const memory  = (navigator as any).deviceMemory ?? 4; // GB
  const isLowEnd = isMobile && (cores <= 4 || memory <= 2);

  const pixelRatio = Math.min(window.devicePixelRatio ?? 1, isLowEnd ? 1.0 : 1.5);

  cachedProfile = {
    isMobile,
    isLowEnd,
    pixelRatio,
    particleMultiplier: isLowEnd ? 0.3 : isMobile ? 0.6 : 1.0,
  };

  return cachedProfile;
}

// Hook: adjusts renderer DPR based on device
export function usePerformanceAdaptation() {
  const { gl, invalidate } = useThree();
  const appliedRef = useRef(false);

  useEffect(() => {
    if (appliedRef.current) return;
    appliedRef.current = true;

    const profile = getDeviceProfile();
    gl.setPixelRatio(profile.pixelRatio);
    invalidate();
  }, [gl, invalidate]);
}

// Hook: touch-based camera pan
export function useTouchControls(
  onPan: (dx: number, dy: number) => void,
  onTap: (x: number, y: number) => void
) {
  useEffect(() => {
    let lastX = 0;
    let lastY = 0;
    let startX = 0;
    let startY = 0;
    let isPanning = false;

    const onTouchStart = (e: TouchEvent) => {
      lastX = e.touches[0].clientX;
      lastY = e.touches[0].clientY;
      startX = lastX;
      startY = lastY;
      isPanning = false;
    };

    const onTouchMove = (e: TouchEvent) => {
      const dx = e.touches[0].clientX - lastX;
      const dy = e.touches[0].clientY - lastY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        isPanning = true;
        onPan(dx, dy);
      }
      lastX = e.touches[0].clientX;
      lastY = e.touches[0].clientY;
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!isPanning) {
        onTap(startX, startY);
      }
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove",  onTouchMove,  { passive: true });
    window.addEventListener("touchend",   onTouchEnd,   { passive: true });

    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove",  onTouchMove);
      window.removeEventListener("touchend",   onTouchEnd);
    };
  }, [onPan, onTap]);
}
