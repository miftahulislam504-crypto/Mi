"use client";

import { useEffect, useRef } from "react";
import { useGalaxyStore } from "@/store/galaxyStore";

// We load audio lazily (after user interaction) to comply with browser autoplay policy
export default function AudioSystem() {
  const { audioEnabled, phase } = useGalaxyStore();
  const ambientRef = useRef<any>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    // Only load Howler client-side
    if (typeof window === "undefined" || loadedRef.current) return;

    import("howler").then(({ Howl }) => {
      loadedRef.current = true;

      // Using a royalty-free space ambient from public domain
      // In production, replace with actual audio files in /public/audio/
      ambientRef.current = new Howl({
        src: ["/audio/space-ambient.mp3"],
        loop: true,
        volume: 0,
        autoplay: false,
        html5: true,
        onloaderror: () => {
          // Silently fail if audio not found — audio is optional
          console.log("Audio file not found, continuing without sound");
        },
      });
    });
  }, []);

  // Start audio when genesis phase begins
  useEffect(() => {
    if (!ambientRef.current) return;
    if (phase === "genesis" && audioEnabled) {
      try {
        ambientRef.current.play();
        // Fade in over 3 seconds
        ambientRef.current.fade(0, 0.35, 3000);
      } catch {
        // Ignore autoplay errors
      }
    }
  }, [phase, audioEnabled]);

  // Mute/unmute
  useEffect(() => {
    if (!ambientRef.current) return;
    if (audioEnabled) {
      ambientRef.current.fade(0, 0.35, 1000);
    } else {
      ambientRef.current.fade(0.35, 0, 500);
    }
  }, [audioEnabled]);

  return null;
}
