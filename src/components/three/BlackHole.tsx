'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const diskVertexShader = /* glsl */ `
  varying vec3 vPos;

  void main() {
    vPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const diskFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uInner;
  uniform float uOuter;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;

  varying vec3 vPos;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 5; i++) {
      v += amp * noise(p);
      p = p * 2.0 + vec2(1.7, 9.2);
      amp *= 0.5;
    }
    return v;
  }

  void main() {
    float r = length(vPos.xy);
    float radial = clamp((r - uInner) / (uOuter - uInner), 0.0, 1.0);
    float angle = atan(vPos.y, vPos.x);

    vec2 swirlUv = vec2(radial * 3.0, angle * 1.2 - uTime * 0.35);
    float n1 = fbm(swirlUv + uTime * 0.06);
    float n2 = fbm(swirlUv * 2.3 - uTime * 0.1);

    vec3 color = mix(uColorA, uColorB, n1);
    color = mix(color, uColorC, smoothstep(0.2, 0.9, radial) * n2);

    float edge = smoothstep(0.0, 0.12, radial) * (1.0 - smoothstep(0.78, 1.0, radial));
    float streaks = pow(n1, 2.0) * 0.6 + pow(n2, 3.0) * 0.4;
    float alpha = edge * (0.35 + streaks * 0.9);

    gl_FragColor = vec4(color * (0.6 + streaks), alpha);
  }
`

const glowVertexShader = /* glsl */ `
  varying vec3 vNormal;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const glowFragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uPower;
  uniform float uIntensity;

  varying vec3 vNormal;

  void main() {
    float fresnel = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), uPower);
    gl_FragColor = vec4(uColor, clamp(fresnel, 0.0, 1.0) * uIntensity);
  }
`

function createGlowMaterial(color: string, power: number, intensity: number) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uPower: { value: power },
      uIntensity: { value: intensity },
    },
    vertexShader: glowVertexShader,
    fragmentShader: glowFragmentShader,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false,
  })
}

/**
 * Stylized black hole: a solid event-horizon core, two layered Fresnel
 * "atmosphere" glows (inner violet, outer cyan), and a custom-shader
 * accretion disk with an animated FBM noise swirl across the cosmic
 * palette. No external textures or postprocessing required.
 */
export function BlackHole() {
  const groupRef = useRef<THREE.Group>(null)
  const diskRef = useRef<THREE.Mesh>(null)

  const diskMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uInner: { value: 1.4 },
          uOuter: { value: 3.6 },
          uColorA: { value: new THREE.Color('#8B5CF6') },
          uColorB: { value: new THREE.Color('#22D3EE') },
          uColorC: { value: new THREE.Color('#3B82F6') },
        },
        vertexShader: diskVertexShader,
        fragmentShader: diskFragmentShader,
        transparent: true,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    []
  )

  const innerGlow = useMemo(() => createGlowMaterial('#7C3AED', 2.5, 1.0), [])
  const outerGlow = useMemo(() => createGlowMaterial('#22D3EE', 1.6, 0.35), [])

  useFrame((_, delta) => {
    diskMaterial.uniforms.uTime.value += delta
    if (diskRef.current) diskRef.current.rotation.z += delta * 0.04
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.02
  })

  return (
    <group ref={groupRef}>
      {/* Event horizon core */}
      <mesh>
        <sphereGeometry args={[1.2, 64, 64]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Inner violet atmosphere glow */}
      <mesh scale={1.5}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <primitive object={innerGlow} attach="material" />
      </mesh>

      {/* Outer cyan ambient glow */}
      <mesh scale={3.2}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <primitive object={outerGlow} attach="material" />
      </mesh>

      {/* Accretion disk */}
      <mesh ref={diskRef} rotation={[Math.PI / 2.35, 0, 0]}>
        <ringGeometry args={[1.4, 3.6, 128, 4]} />
        <primitive object={diskMaterial} attach="material" />
      </mesh>
    </group>
  )
}
