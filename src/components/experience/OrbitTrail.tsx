"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { orbitTrailVertexShader, orbitTrailFragmentShader } from "@/shaders/planets";

interface OrbitTrailProps {
  radius: number;
  color: string;
  tilt?: number;   // x-axis tilt of the orbit plane
  segments?: number;
}

export default function OrbitTrail({
  radius,
  color,
  tilt = 0,
  segments = 128,
}: OrbitTrailProps) {
  const ref = useRef<THREE.Points>(null);
  const timeRef = useRef(0);
  const col = useMemo(() => new THREE.Color(color), [color]);

  // Build ring of points
  const { positions, progress, sizes } = useMemo(() => {
    const positions = new Float32Array(segments * 3);
    const progress  = new Float32Array(segments);
    const sizes     = new Float32Array(segments);
    for (let i = 0; i < segments; i++) {
      const a = (i / segments) * Math.PI * 2;
      positions[i * 3]     = Math.cos(a) * radius;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = Math.sin(a) * radius;
      progress[i]           = i / segments;          // 0 = tail, 1 = head
      sizes[i]              = 0.8 + (i / segments) * 1.8;
    }
    return { positions, progress, sizes };
  }, [radius, segments]);

  useFrame((_, delta) => {
    timeRef.current += delta;
    if (ref.current) {
      (ref.current.material as THREE.ShaderMaterial).uniforms.uTime.value =
        timeRef.current;
    }
  });

  return (
    <group rotation={[tilt, 0, 0]}>
      {/* Faint static ring line */}
      <mesh>
        <ringGeometry args={[radius - 0.02, radius + 0.02, 96]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.07}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Particle trail */}
      <points ref={ref}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-aProgress"  args={[progress,  1]} />
          <bufferAttribute attach="attributes-aSize"      args={[sizes,     1]} />
        </bufferGeometry>
        <shaderMaterial
          vertexShader={orbitTrailVertexShader}
          fragmentShader={orbitTrailFragmentShader}
          uniforms={{ uColor: { value: col }, uTime: { value: 0 } }}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
