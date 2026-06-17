'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface ParticleFieldProps {
  count?: number
}

const PALETTE = ['#8B5CF6', '#3B82F6', '#22D3EE']

/**
 * A slowly-rotating field of additive-blended points distributed in a
 * flattened sphere around the black hole, colored from the cosmic palette.
 */
export function ParticleField({ count = 2400 }: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null)

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const palette = PALETTE.map((hex) => new THREE.Color(hex))
    const flatten = 0.35

    for (let i = 0; i < count; i++) {
      const radius = 3.2 + Math.random() * 14
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(THREE.MathUtils.randFloatSpread(2))

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * flatten
      pos[i * 3 + 2] = radius * Math.cos(phi)

      const c = palette[Math.floor(Math.random() * palette.length)]
      col[i * 3] = c.r
      col[i * 3 + 1] = c.g
      col[i * 3 + 2] = c.b
    }

    return [pos, col]
  }, [count])

  useFrame((_, delta) => {
    if (!pointsRef.current) return
    pointsRef.current.rotation.y += delta * 0.018
    pointsRef.current.rotation.x += delta * 0.004
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        vertexColors
        transparent
        opacity={0.75}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
