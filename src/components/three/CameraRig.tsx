'use client'

import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { pointer, lerp } from '@/lib/utils'

/**
 * Subtle mouse-parallax: smoothly lerps the camera position toward the
 * pointer's normalized screen position each frame, then re-aims it at
 * the origin (the black hole). Renders nothing.
 */
export function CameraRig() {
  const { camera } = useThree()
  const initial = useRef(new THREE.Vector3().copy(camera.position))

  useFrame(() => {
    pointer.x = lerp(pointer.x, pointer.targetX, 0.04)
    pointer.y = lerp(pointer.y, pointer.targetY, 0.04)

    camera.position.x = lerp(camera.position.x, initial.current.x + pointer.x * 0.6, 0.05)
    camera.position.y = lerp(camera.position.y, initial.current.y - pointer.y * 0.4, 0.05)
    camera.lookAt(0, 0, 0)
  })

  return null
}
