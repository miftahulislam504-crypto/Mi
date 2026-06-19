"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { UNIVERSES } from "@/data/galaxy";

// Pairs of universes to connect
const CONNECTIONS: [string, string][] = [
  ["core", "community"],
  ["core", "commerce"],
  ["core", "business"],
  ["community", "commerce"],
];

function ConnectionLine({
  from,
  to,
  color,
  delay,
}: {
  from: [number, number, number];
  to: [number, number, number];
  color: string;
  delay: number;
}) {
  const lineRef = useRef<THREE.Line>(null);
  const timeRef = useRef(0);
  const opacityRef = useRef(0);

  // Build a curved path between the two universes
  const { points, count } = useMemo(() => {
    const start = new THREE.Vector3(...from);
    const end = new THREE.Vector3(...to);

    // Mid-point with a gentle arc upward
    const mid = new THREE.Vector3()
      .addVectors(start, end)
      .multiplyScalar(0.5);
    mid.y += 4;

    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    const count = 60;
    const pts = curve.getPoints(count);
    return { points: pts, count };
  }, [from, to]);

  // Build geometry with lineProgress attribute
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const progress = new Float32Array(
      points.map((_, i) => i / (points.length - 1))
    );
    geo.setAttribute("lineProgress", new THREE.BufferAttribute(progress, 1));
    return geo;
  }, [points]);

  const threeColor = useMemo(() => new THREE.Color(color), [color]);

  useFrame((_, delta) => {
    timeRef.current += delta;

    // Delayed fade in
    const t = Math.max(0, timeRef.current - delay);
    opacityRef.current = Math.min(0.35, t / 1.5 * 0.35);

    if (lineRef.current) {
      const mat = lineRef.current.material as THREE.ShaderMaterial;
      mat.uniforms.uTime.value = timeRef.current;
      mat.uniforms.uOpacity.value = opacityRef.current;
    }
  });

  return (
    <primitive object={new THREE.Line(geometry, new THREE.ShaderMaterial({
      vertexShader: `
        varying float vProgress;
        attribute float lineProgress;
        void main() {
          vProgress = lineProgress;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor;
        uniform float uOpacity;
        varying float vProgress;
        void main() {
          float pulse = sin(vProgress * 10.0 - uTime * 2.5) * 0.5 + 0.5;
          float edge = smoothstep(0.0, 0.15, vProgress) * smoothstep(1.0, 0.85, vProgress);
          float alpha = edge * (0.3 + pulse * 0.7) * uOpacity;
          vec3 col = uColor * (0.5 + pulse * 0.5);
          gl_FragColor = vec4(col, alpha);
        }
      `,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: threeColor },
        uOpacity: { value: 0 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }))} ref={lineRef as any} />
  );
}

// Energy particle that travels along the connection
function TravelingParticle({
  from,
  to,
  color,
  speed,
  offset,
}: {
  from: [number, number, number];
  to: [number, number, number];
  color: string;
  speed: number;
  offset: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const progressRef = useRef(offset);

  const curve = useMemo(() => {
    const start = new THREE.Vector3(...from);
    const end = new THREE.Vector3(...to);
    const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    mid.y += 4;
    return new THREE.QuadraticBezierCurve3(start, mid, end);
  }, [from, to]);

  useFrame((_, delta) => {
    progressRef.current = (progressRef.current + delta * speed) % 1;
    if (ref.current) {
      const pos = curve.getPoint(progressRef.current);
      ref.current.position.copy(pos);
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.07, 6, 6]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}

interface UniverseConnectionsProps {
  visible: boolean;
}

export default function UniverseConnections({ visible }: UniverseConnectionsProps) {
  if (!visible) return null;

  // Build universe position lookup
  const posMap = Object.fromEntries(
    UNIVERSES.map((u) => [u.id, u.position as [number, number, number]])
  );
  const colorMap = Object.fromEntries(UNIVERSES.map((u) => [u.id, u.color]));

  return (
    <group>
      {CONNECTIONS.map(([a, b], i) => {
        const from = posMap[a];
        const to = posMap[b];
        if (!from || !to) return null;

        // Blend color between the two universes
        const col = colorMap[a];

        return (
          <group key={`${a}-${b}`}>
            <ConnectionLine
              from={from}
              to={to}
              color={col}
              delay={i * 0.3 + 0.5}
            />
            {/* 2 traveling particles per connection */}
            <TravelingParticle
              from={from}
              to={to}
              color={col}
              speed={0.12 + i * 0.03}
              offset={i * 0.25}
            />
            <TravelingParticle
              from={to}
              to={from}
              color={colorMap[b]}
              speed={0.1 + i * 0.02}
              offset={0.5 + i * 0.15}
            />
          </group>
        );
      })}
    </group>
  );
}
