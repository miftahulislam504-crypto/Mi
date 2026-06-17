'use client'

import { useEffect } from 'react'
import { pointer } from '@/lib/utils'

/**
 * Tracks normalized pointer position (-1 to 1 on each axis) into the
 * module-level `pointer` singleton, which the 3D `CameraRig` reads inside
 * `useFrame` for a smooth mouse-parallax effect.
 *
 * Mounted once from `HeroScene`. No-op on touch-only devices (pointermove
 * simply won't fire meaningfully, which is fine — parallax is a desktop
 * enhancement).
 */
export function usePointerTracker() {
  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      pointer.targetX = (event.clientX / window.innerWidth) * 2 - 1
      pointer.targetY = (event.clientY / window.innerHeight) * 2 - 1
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    return () => window.removeEventListener('pointermove', handlePointerMove)
  }, [])
}
