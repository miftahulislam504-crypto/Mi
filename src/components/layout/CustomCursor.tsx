'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useMediaQuery } from '@/hooks/useMediaQuery'

/**
 * Custom dot + trailing ring cursor. Only mounts on `(pointer: fine)`
 * devices (real mice/trackpads) — touch devices render nothing and keep
 * their native cursor behavior.
 *
 * The ring scales up over anything with `data-cursor="hover"` or any
 * native interactive element (links, buttons).
 */
export function CustomCursor() {
  const isFinePointer = useMediaQuery('(pointer: fine)')
  const [hovering, setHovering] = useState(false)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const ringX = useSpring(x, { damping: 25, stiffness: 300, mass: 0.5 })
  const ringY = useSpring(y, { damping: 25, stiffness: 300, mass: 0.5 })

  useEffect(() => {
    if (!isFinePointer) return

    document.documentElement.classList.add('cursor-active')

    const handleMove = (event: PointerEvent) => {
      x.set(event.clientX)
      y.set(event.clientY)
    }

    const handleOver = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null
      setHovering(Boolean(target?.closest('a, button, [data-cursor="hover"]')))
    }

    window.addEventListener('pointermove', handleMove, { passive: true })
    window.addEventListener('pointerover', handleOver, { passive: true })

    return () => {
      document.documentElement.classList.remove('cursor-active')
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerover', handleOver)
    }
  }, [isFinePointer, x, y])

  if (!isFinePointer) return null

  return (
    <>
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[100] h-1.5 w-1.5 rounded-full bg-cosmic-cyan"
        style={{ x, y, translateX: '-50%', translateY: '-50%' }}
      />
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[100] rounded-full border border-cosmic-cyan/50 mix-blend-difference"
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}
        animate={{
          width: hovering ? 56 : 32,
          height: hovering ? 56 : 32,
          opacity: hovering ? 0.9 : 0.5,
        }}
        transition={{ duration: 0.25 }}
      />
    </>
  )
}
