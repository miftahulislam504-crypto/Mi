"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  blackHoleVertexShader,
  blackHoleFragmentShader,
} from "@/shaders";

export default function BlackHole() {
  const diskRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const timeRef = useRef(0);

  // Accretion disk particles
  const particleCount = 800;
  const particlePositions = new Float32Array(particleCount * 3);
  const particleColors = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 2.5 + Math.random() * 2.5;
    const spread = (Math.random() - 0.5) * 0.3;
    particlePositions[i * 3] = Math.cos(angle) * radius;
    particlePositions[i * 3 + 1] = spread;
    particlePositions[i * 3 + 2] = Math.sin(angle) * radius;

    // Color gradient: orange → yellow
    const t = Math.random();
    particleColors[i * 3] = 0.8 + t * 0.2;   // R
    particleColors[i * 3 + 1] = 0.3 + t * 0.6; // G
    particleColors[i * 3 + 2] = 0.0;           // B
  }

  useFrame((_, delta) => {
    timeRef.current += delta;

    // Rotate disk
    if (diskRef.current) {
      diskRef.current.rotation.z += delta * 0.3;
      (diskRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value =
        timeRef.current;
    }

    // Rotate particles (different speed)
    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.15;
    }

    // Core pulse
    if (coreRef.current) {
      const pulse = 1 + Math.sin(timeRef.current * 2) * 0.05;
      coreRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Event horizon — pure black sphere */}
      <mesh>
        <sphereGeometry args={[1.8, 32, 32]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Gravitational glow ring */}
      <mesh>
        <torusGeometry args={[2.0, 0.15, 8, 64]} />
        <meshBasicMaterial color="#220a00" />
      </mesh>

      {/* Accretion disk — shader */}
      <mesh ref={diskRef} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 10, 1, 1]} />
        <shaderMaterial
          vertexShader={blackHoleVertexShader}
          fragmentShader={blackHoleFragmentShader}
          uniforms={{
            uTime: { value: 0 },
            uOpacity: { value: 0.85 },
          }}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Particle accretion belt */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[particleColors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.04}
          vertexColors
          transparent
          opacity={0.7}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      {/* Core — very subtle blue glow */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial color="#0033ff" transparent opacity={0.3} />
      </mesh>

      {/* Outer glow haze */}
      <mesh>
        <sphereGeometry args={[3.5, 16, 16]} />
        <meshBasicMaterial
          color="#110000"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}
