'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Stars, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei'
import { BlackHole } from './BlackHole'
import { ParticleField } from './ParticleField'
import { FloatingObjects } from './FloatingObjects'
import { CameraRig } from './CameraRig'
import { usePointerTracker } from '@/hooks/usePointerTracker'
import { useMediaQuery } from '@/hooks/useMediaQuery'

/**
 * The full hero 3D scene: a custom-shader black hole with accretion disk,
 * an ambient particle field, drifting structural wireframes, a starfield,
 * and a mouse-parallax camera rig. Dynamically imported with `ssr: false`
 * from `Hero.tsx`.
 */
export default function HeroScene() {
  usePointerTracker()
  const isMobile = useMediaQuery('(max-width: 768px)')

  return (
    <Canvas
      camera={{ position: [0, 0.4, 8], fov: 45, near: 0.1, far: 100 }}
      dpr={[1, isMobile ? 1.2 : 1.6]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      <color attach="background" args={['#04050D']} />
      <fog attach="fog" args={['#04050D', 10, 22]} />

      <ambientLight intensity={0.2} />
      <pointLight position={[6, 4, 6]} color="#8B5CF6" intensity={3} distance={20} />
      <pointLight position={[-6, -3, 4]} color="#22D3EE" intensity={2.4} distance={20} />
      <pointLight position={[0, -2, -6]} color="#3B82F6" intensity={1.6} distance={20} />

      <Suspense fallback={null}>
        <Stars radius={50} depth={40} count={isMobile ? 1500 : 4000} factor={2} saturation={0} fade speed={0.4} />
        <BlackHole />
        <ParticleField count={isMobile ? 1000 : 2400} />
        <FloatingObjects />
        <CameraRig />
      </Suspense>

      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
    </Canvas>
  )
}
