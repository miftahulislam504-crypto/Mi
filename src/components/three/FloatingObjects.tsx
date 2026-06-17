'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

/**
 * A 3D grid of points connected along each axis — reads as a structural
 * lattice / space-frame node grid.
 */
function useLatticeGeometry(nx: number, ny: number, nz: number, spacing: number) {
  return useMemo(() => {
    const verts: number[] = []
    const push = (a: number[], b: number[]) => verts.push(...a, ...b)

    for (let x = 0; x <= nx; x++) {
      for (let y = 0; y <= ny; y++) {
        for (let z = 0; z <= nz; z++) {
          const p: [number, number, number] = [x * spacing, y * spacing, z * spacing]
          if (x < nx) push(p, [(x + 1) * spacing, y * spacing, z * spacing])
          if (y < ny) push(p, [x * spacing, (y + 1) * spacing, z * spacing])
          if (z < nz) push(p, [x * spacing, y * spacing, (z + 1) * spacing])
        }
      }
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3))
    geo.center()
    return geo
  }, [nx, ny, nz, spacing])
}

/**
 * A repeating Warren-truss pattern — reads as a structural beam / bridge
 * truss segment.
 */
function useTrussGeometry(segments: number, width: number, height: number) {
  return useMemo(() => {
    const verts: number[] = []
    const push = (a: number[], b: number[]) => verts.push(...a, ...b)

    for (let i = 0; i < segments; i++) {
      const x0 = i * width
      const x1 = (i + 1) * width
      push([x0, 0, 0], [x1, 0, 0])
      push([x0, height, 0], [x1, height, 0])
      push([x0, 0, 0], [x1, height, 0])
      push([x1, 0, 0], [x0, height, 0])
    }
    push([0, 0, 0], [0, height, 0])
    push([segments * width, 0, 0], [segments * width, height, 0])

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3))
    geo.center()
    return geo
  }, [segments, width, height])
}

/**
 * A flat grid of crossing lines — reads as a CAD floor / foundation grid.
 */
function useGridGeometry(divisions: number, size: number) {
  return useMemo(() => {
    const verts: number[] = []
    const half = size / 2
    const step = size / divisions

    for (let i = 0; i <= divisions; i++) {
      const p = -half + i * step
      verts.push(-half, 0, p, half, 0, p)
      verts.push(p, 0, -half, p, 0, half)
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3))
    geo.center()
    return geo
  }, [divisions, size])
}

interface WireframeObjectProps {
  geometry: THREE.BufferGeometry
  color: string
  position: [number, number, number]
  rotation?: [number, number, number]
  rotationSpeed?: number
  scale?: number
  opacity?: number
  floatSpeed?: number
  floatIntensity?: number
}

function WireframeObject({
  geometry,
  color,
  position,
  rotation = [0, 0, 0],
  rotationSpeed = 0.05,
  scale = 1,
  opacity = 0.35,
  floatSpeed = 1,
  floatIntensity = 1,
}: WireframeObjectProps) {
  const ref = useRef<THREE.LineSegments>(null)

  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.rotation.y += delta * rotationSpeed
    ref.current.rotation.x += delta * rotationSpeed * 0.4
  })

  return (
    <Float speed={floatSpeed} rotationIntensity={0.2} floatIntensity={floatIntensity}>
      <lineSegments ref={ref} geometry={geometry} position={position} rotation={rotation} scale={scale}>
        <lineBasicMaterial color={color} transparent opacity={opacity} toneMapped={false} />
      </lineSegments>
    </Float>
  )
}

/**
 * The drifting "floating engineering objects" around the black hole —
 * a structural lattice, a truss, a foundation grid and a smaller lattice,
 * each rendered as glowing wireframe lines in the cosmic palette.
 */
export function FloatingObjects() {
  const lattice = useLatticeGeometry(2, 3, 2, 0.9)
  const truss = useTrussGeometry(4, 0.8, 0.8)
  const grid = useGridGeometry(8, 5)
  const latticeSmall = useLatticeGeometry(1, 2, 1, 0.7)

  return (
    <group>
      <WireframeObject geometry={lattice} color="#8B5CF6" position={[-4.2, 1.6, -2]} scale={0.9} rotationSpeed={0.04} opacity={0.4} />
      <WireframeObject geometry={truss} color="#22D3EE" position={[4.0, -1.2, -1.5]} scale={0.85} rotationSpeed={-0.05} opacity={0.4} />
      <WireframeObject
        geometry={grid}
        color="#3B82F6"
        position={[0, -3.2, -3]}
        rotation={[1.3, 0, 0.3]}
        scale={1}
        rotationSpeed={0.015}
        opacity={0.3}
        floatIntensity={0.6}
      />
      <WireframeObject geometry={latticeSmall} color="#3B82F6" position={[3.6, 2.4, -4]} scale={0.7} rotationSpeed={0.06} opacity={0.35} />
    </group>
  )
}
