"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";
import { UNIVERSES } from "@/data/galaxy";
import { useGalaxyStore } from "@/store/galaxyStore";
import UniverseCluster from "./UniverseCluster";
import UniverseConnections from "./UniverseConnections";

// Slow-drifting background nebula for galaxy view
function GalaxyNebula() {
  const ref = useRef<THREE.Mesh>(null);
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    timeRef.current += delta;
    if (ref.current) {
      ref.current.rotation.z += delta * 0.005;
      const mat = ref.current.material as THREE.ShaderMaterial;
      mat.uniforms.uTime.value = timeRef.current;
    }
  });

  return (
    <mesh ref={ref} position={[0, 0, -30]}>
      <planeGeometry args={[200, 200, 1, 1]} />
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

          float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
          float noise(vec2 p) {
            vec2 i = floor(p); vec2 f = fract(p);
            f = f*f*(3.0-2.0*f);
            return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
          }
          float fbm(vec2 p) {
            float v=0.0,a=0.5;
            for(int i=0;i<4;i++){v+=a*noise(p);p*=2.0;a*=0.5;}
            return v;
          }

          void main() {
            vec2 uv = vUv - 0.5;
            float dist = length(uv);
            float n = fbm(uv * 1.5 + uTime * 0.01);
            float n2 = fbm(uv * 2.5 - uTime * 0.008);

            // Very dark galaxy background — just subtle color variation
            vec3 c1 = vec3(0.02, 0.02, 0.08); // dark blue
            vec3 c2 = vec3(0.04, 0.01, 0.06); // dark purple
            vec3 col = mix(c1, c2, n * n2);

            // Fade at edges
            float edge = 1.0 - smoothstep(0.3, 0.5, dist);
            float alpha = edge * 0.4 * n;

            gl_FragColor = vec4(col, alpha);
          }
        `}
        uniforms={{ uTime: { value: 0 } }}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

// Asteroid field — scattered rocks drifting in the galaxy
function AsteroidField() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const count = 120;
  const dummy = new THREE.Object3D();
  const speeds = new Float32Array(count).map(() => (Math.random() - 0.5) * 0.01);

  // Set initial positions
  if (ref.current) {
    for (let i = 0; i < count; i++) {
      dummy.position.set(
        (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 40
      );
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      dummy.scale.setScalar(0.05 + Math.random() * 0.15);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  }

  useFrame(() => {
    if (!ref.current) return;
    for (let i = 0; i < count; i++) {
      ref.current.getMatrixAt(i, dummy.matrix);
      dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);
      dummy.rotation.y += speeds[i];
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color="#444455"
        roughness={0.9}
        metalness={0.1}
        transparent
        opacity={0.6}
      />
    </instancedMesh>
  );
}

interface GalaxyViewProps {
  visible: boolean;
}

export default function GalaxyView({ visible }: GalaxyViewProps) {
  const { phase } = useGalaxyStore();

  // Show in galaxy phase and keep mounted during universe phase (for background)
  const isActive = phase === "galaxy" || phase === "universe";

  if (!visible && !isActive) return null;

  return (
    <group>
      {/* Background nebula */}
      <GalaxyNebula />

      {/* Dense background stars for galaxy view */}
      <Stars
        radius={150}
        depth={60}
        count={7000}
        factor={3}
        saturation={0.2}
        fade
        speed={0.3}
      />

      {/* 4 Universe Clusters */}
      {UNIVERSES.map((universe, index) => (
        <UniverseCluster
          key={universe.id}
          universe={universe}
          visible={visible || isActive}
          index={index}
        />
      ))}

      {/* Glowing connections between universes */}
      <UniverseConnections visible={visible || isActive} />

      {/* Asteroid field */}
      <AsteroidField />
    </group>
  );
}
