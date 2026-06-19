"use client";

import { useEffect, useRef } from "react";
import { useGalaxyStore } from "@/store/galaxyStore";

// ── Procedural Space Ambient — no external audio file needed ──────────────────
// Layers:
//   1. Sub-bass drone (40 Hz) — deep space hum
//   2. Mid drone (80 Hz) — black hole resonance
//   3. High shimmer (320 Hz, very quiet) — cosmic wind
//   4. Random crackle — space static
//   5. Slow LFO filter sweep — breathing effect
//   6. Reverb convolver — infinite space feel

class SpaceAmbientEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private running = false;
  private nodes: AudioNode[] = [];
  private crackleTimer: ReturnType<typeof setTimeout> | null = null;

  init() {
    if (this.ctx) return;
    this.ctx = new AudioContext();

    // Master gain (starts at 0, fades in)
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    this.buildLayers();
  }

  private buildLayers() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    // ── Layer 1: Sub-bass drone (40 Hz) ─────────────────────────────────────
    const sub = ctx.createOscillator();
    sub.type = "sine";
    sub.frequency.setValueAtTime(40, now);
    // Slow pitch drift ±0.5 Hz
    sub.frequency.linearRampToValueAtTime(40.5, now + 8);
    sub.frequency.linearRampToValueAtTime(39.8, now + 16);

    const subGain = ctx.createGain();
    subGain.gain.setValueAtTime(0.35, now);
    sub.connect(subGain);
    subGain.connect(this.masterGain);
    sub.start();
    this.nodes.push(sub, subGain);

    // ── Layer 2: Mid drone (80 Hz) ───────────────────────────────────────────
    const mid = ctx.createOscillator();
    mid.type = "triangle";
    mid.frequency.setValueAtTime(80.3, now);

    const midGain = ctx.createGain();
    midGain.gain.setValueAtTime(0.12, now);

    // LFO for mid gain — slow breathing
    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.setValueAtTime(0.07, now); // very slow ~14s cycle

    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(0.06, now);
    lfo.connect(lfoGain);
    lfoGain.connect(midGain.gain);
    lfo.start();
    mid.connect(midGain);
    midGain.connect(this.masterGain);
    mid.start();
    this.nodes.push(mid, midGain, lfo, lfoGain);

    // ── Layer 3: High shimmer (320 Hz + 321 Hz — slight detune for chorus) ──
    const shimA = ctx.createOscillator();
    shimA.type = "sine";
    shimA.frequency.setValueAtTime(320, now);

    const shimB = ctx.createOscillator();
    shimB.type = "sine";
    shimB.frequency.setValueAtTime(321.2, now);

    const shimGain = ctx.createGain();
    shimGain.gain.setValueAtTime(0.018, now);

    // Filter sweep on shimmer — cosmic wind feel
    const shimFilter = ctx.createBiquadFilter();
    shimFilter.type = "bandpass";
    shimFilter.frequency.setValueAtTime(320, now);
    shimFilter.Q.setValueAtTime(3, now);

    // LFO for filter freq
    const shimLFO = ctx.createOscillator();
    shimLFO.type = "sine";
    shimLFO.frequency.setValueAtTime(0.04, now);
    const shimLFOGain = ctx.createGain();
    shimLFOGain.gain.setValueAtTime(80, now);
    shimLFO.connect(shimLFOGain);
    shimLFOGain.connect(shimFilter.frequency);
    shimLFO.start();

    shimA.connect(shimFilter);
    shimB.connect(shimFilter);
    shimFilter.connect(shimGain);
    shimGain.connect(this.masterGain);
    shimA.start();
    shimB.start();
    this.nodes.push(shimA, shimB, shimGain, shimFilter, shimLFO, shimLFOGain);

    // ── Layer 4: Pink noise (filtered white noise) ───────────────────────────
    const bufferSize = ctx.sampleRate * 4; // 4 second buffer, looped
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const noiseData   = noiseBuffer.getChannelData(0);

    // Generate pink noise via Paul Kellett's method
    let b0=0, b1=0, b2=0, b3=0, b4=0, b5=0, b6=0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886*b0 + white*0.0555179;
      b1 = 0.99332*b1 + white*0.0750759;
      b2 = 0.96900*b2 + white*0.1538520;
      b3 = 0.86650*b3 + white*0.3104856;
      b4 = 0.55000*b4 + white*0.5329522;
      b5 = -0.7616*b5 - white*0.0168980;
      noiseData[i] = (b0+b1+b2+b3+b4+b5+b6+white*0.5362) * 0.11;
      b6 = white * 0.115926;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    // Very low-pass filter — only rumble passes through
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "lowpass";
    noiseFilter.frequency.setValueAtTime(180, now);
    noiseFilter.Q.setValueAtTime(0.5, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.08, now);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    noise.start();
    this.nodes.push(noise, noiseFilter, noiseGain);

    // ── Layer 5: Occasional deep pulse (black hole resonance) ────────────────
    this.scheduleDeepPulse();

    this.running = true;
  }

  // Occasional deep thud — like something vast breathing
  private scheduleDeepPulse() {
    if (!this.ctx || !this.masterGain) return;

    const delay = 8000 + Math.random() * 14000; // 8–22s intervals
    this.crackleTimer = setTimeout(() => {
      if (!this.ctx || !this.masterGain || !this.running) return;

      const ctx  = this.ctx;
      const now  = ctx.currentTime;

      const osc  = ctx.createOscillator();
      osc.type   = "sine";
      osc.frequency.setValueAtTime(28, now);
      osc.frequency.exponentialRampToValueAtTime(20, now + 2.5);

      const env  = ctx.createGain();
      env.gain.setValueAtTime(0, now);
      env.gain.linearRampToValueAtTime(0.22, now + 0.3);
      env.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

      osc.connect(env);
      env.connect(this.masterGain!);
      osc.start(now);
      osc.stop(now + 3);

      this.scheduleDeepPulse();
    }, delay);
  }

  fadeIn(duration = 4000) {
    if (!this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(t);
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, t);
    this.masterGain.gain.linearRampToValueAtTime(0.55, t + duration / 1000);
  }

  fadeOut(duration = 1500) {
    if (!this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(t);
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, t);
    this.masterGain.gain.linearRampToValueAtTime(0, t + duration / 1000);
  }

  setVolume(v: number, duration = 0.5) {
    if (!this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(t);
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, t);
    this.masterGain.gain.linearRampToValueAtTime(v, t + duration);
  }

  resume() {
    this.ctx?.resume();
  }

  suspend() {
    this.ctx?.suspend();
  }

  destroy() {
    this.running = false;
    if (this.crackleTimer) clearTimeout(this.crackleTimer);
    this.nodes.forEach((n) => {
      try { (n as OscillatorNode).stop?.(); } catch {}
      try { n.disconnect(); } catch {}
    });
    this.nodes = [];
    this.ctx?.close();
    this.ctx = null;
  }
}

// Singleton
let engineInstance: SpaceAmbientEngine | null = null;

function getEngine(): SpaceAmbientEngine {
  if (!engineInstance) engineInstance = new SpaceAmbientEngine();
  return engineInstance;
}

// ── React Component ────────────────────────────────────────────────────────────
export default function AudioSystem() {
  const { audioEnabled, phase } = useGalaxyStore();
  const initialised = useRef(false);
  const prevEnabled = useRef(audioEnabled);

  // Init on first user interaction (autoplay policy)
  useEffect(() => {
    const start = () => {
      if (initialised.current) return;
      const engine = getEngine();
      engine.init();
      if (audioEnabled) engine.fadeIn(4000);
      initialised.current = true;
      window.removeEventListener("click",     start);
      window.removeEventListener("touchstart", start);
      window.removeEventListener("keydown",   start);
    };

    window.addEventListener("click",      start, { once: true });
    window.addEventListener("touchstart", start, { once: true });
    window.addEventListener("keydown",    start, { once: true });

    return () => {
      window.removeEventListener("click",     start);
      window.removeEventListener("touchstart", start);
      window.removeEventListener("keydown",   start);
    };
  }, [audioEnabled]);

  // Phase-based volume
  useEffect(() => {
    if (!initialised.current) return;
    const engine = getEngine();
    const volumes: Record<string, number> = {
      loading:       0,
      genesis:       0.45,
      galaxy:        0.55,
      universe:      0.5,
      orbit:         0.5,
      landing:       0.35,
      constellation: 0.4,
      timeline:      0.4,
    };
    const v = volumes[phase] ?? 0.45;
    if (audioEnabled) engine.setVolume(v, 1.5);
  }, [phase, audioEnabled]);

  // Mute/unmute
  useEffect(() => {
    if (!initialised.current) return;
    const engine = getEngine();
    if (audioEnabled && !prevEnabled.current) {
      engine.resume();
      engine.fadeIn(1000);
    } else if (!audioEnabled && prevEnabled.current) {
      engine.fadeOut(800);
      setTimeout(() => engine.suspend(), 900);
    }
    prevEnabled.current = audioEnabled;
  }, [audioEnabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      engineInstance?.destroy();
      engineInstance = null;
    };
  }, []);

  return null;
}
