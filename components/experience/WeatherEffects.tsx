"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Single meteor streak
function Meteor({
  startPos,
  direction,
  speed,
  delay,
  length,
}: {
  startPos: [number, number, number];
  direction: [number, number, number];
  speed: number;
  delay: number;
  length: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const timeRef = useRef(-delay);
  const activeRef = useRef(false);

  const dir = useMemo(
    () => new THREE.Vector3(...direction).normalize(),
    [direction]
  );

  useFrame((_, delta) => {
    timeRef.current += delta;
    if (timeRef.current < 0) return;

    const t = timeRef.current * speed;
    const lifetime = 2.5; // seconds

    if (!ref.current) return;

    if (t > lifetime) {
      // Reset
      timeRef.current = -delay - Math.random() * 3;
      ref.current.position.set(...startPos);
      return;
    }

    // Move along direction
    ref.current.position.set(
      startPos[0] + dir.x * t * 20,
      startPos[1] + dir.y * t * 20,
      startPos[2] + dir.z * t * 20
    );

    // Fade in then out
    const progress = t / lifetime;
    const opacity =
      progress < 0.1
        ? progress / 0.1
        : progress > 0.7
        ? (1 - progress) / 0.3
        : 1.0;
    (ref.current.material as THREE.MeshBasicMaterial).opacity = opacity * 0.85;
  });

  return (
    <mesh ref={ref} position={startPos}>
      {/* Thin elongated streak */}
      <cylinderGeometry args={[0.01, 0.03, length, 4, 1]} />
      <meshBasicMaterial
        color="#e8f0ff"
        transparent
        opacity={0}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

// Comet — bigger, slower, with tail
function Comet() {
  const groupRef = useRef<THREE.Group>(null);
  const timeRef = useRef(Math.random() * -15);
  const startX = useRef(-60 + Math.random() * 30);

  useFrame((_, delta) => {
    timeRef.current += delta;

    if (!groupRef.current) return;

    const t = timeRef.current;
    if (t < 0) return;

    // Arc trajectory
    groupRef.current.position.set(
      startX.current + t * 8,
      25 - t * 3,
      -30 + t * 2
    );

    if (t > 15) {
      timeRef.current = -8 - Math.random() * 10;
      startX.current = -60 + Math.random() * 30;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Head */}
      <mesh>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshBasicMaterial
          color="#aaddff"
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      {/* Tail */}
      <mesh position={[-1.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.06, 3, 4]} />
        <meshBasicMaterial
          color="#4488ff"
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <pointLight color="#88aaff" intensity={0.8} distance={5} decay={2} />
    </group>
  );
}

// Aurora — color planes near top of scene
function Aurora() {
  const ref = useRef<THREE.Mesh>(null);
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    timeRef.current += delta;
    if (ref.current) {
      const mat = ref.current.material as THREE.ShaderMaterial;
      mat.uniforms.uTime.value = timeRef.current;
    }
  });

  return (
    <mesh ref={ref} position={[0, 25, -50]} rotation={[-0.3, 0, 0]}>
      <planeGeometry args={[120, 20, 1, 1]} />
      <shaderMaterial
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          varying vec2 vUv;

          void main() {
            // Slow wave
            float wave = sin(vUv.x * 6.0 + uTime * 0.4) * 0.5 + 0.5;
            float wave2 = sin(vUv.x * 10.0 - uTime * 0.25 + 1.5) * 0.5 + 0.5;

            // Fade top & bottom
            float fade = smoothstep(0.0, 0.25, vUv.y) * smoothstep(1.0, 0.75, vUv.y);

            // Colors: green + purple aurora
            vec3 green  = vec3(0.0, 0.9, 0.4);
            vec3 purple = vec3(0.5, 0.0, 0.9);
            vec3 teal   = vec3(0.0, 0.7, 0.8);
            vec3 col = mix(green, purple, wave);
            col = mix(col, teal, wave2 * 0.4);

            float alpha = fade * (wave * 0.5 + 0.1) * 0.18;
            gl_FragColor = vec4(col, alpha);
          }
        `}
        uniforms={{ uTime: { value: 0 } }}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

// Meteor shower config
const METEORS = Array.from({ length: 12 }, (_, i) => ({
  startPos: [
    -40 + Math.random() * 80,
    20 + Math.random() * 20,
    -20 + Math.random() * 10,
  ] as [number, number, number],
  direction: [
    0.3 + Math.random() * 0.4,
    -0.8 - Math.random() * 0.3,
    -0.1 + Math.random() * 0.2,
  ] as [number, number, number],
  speed: 0.6 + Math.random() * 0.8,
  delay: i * 1.2 + Math.random() * 2,
  length: 1.5 + Math.random() * 2,
}));

interface WeatherEffectsProps {
  visible: boolean;
}

export default function WeatherEffects({ visible }: WeatherEffectsProps) {
  if (!visible) return null;

  return (
    <group>
      {/* Meteor shower */}
      {METEORS.map((m, i) => (
        <Meteor key={i} {...m} />
      ))}

      {/* One comet */}
      <Comet />

      {/* Aurora borealis */}
      <Aurora />
    </group>
  );
}
