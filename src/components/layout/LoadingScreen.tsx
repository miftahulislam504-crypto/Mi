'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const PHRASES = ['INITIALIZING ENGINE', 'CALIBRATING ORBITALS', 'COMPILING CIVILOS', 'RENDERING UNIVERSE']

function StatusText() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => setIndex((prev) => (prev + 1) % PHRASES.length), 480)
    return () => clearInterval(interval)
  }, [])

  return (
    <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-ink-dim">{PHRASES[index]}</span>
  )
}

/**
 * Full-screen loading overlay shown for ~2.4s on first load while the 3D
 * hero scene chunk loads, preventing a flash of unstyled / empty content.
 */
export function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-8 bg-void"
    >
      <div className="relative flex h-20 w-20 items-center justify-center">
        <span
          className="absolute h-full w-full animate-spin rounded-full border-2 border-transparent border-t-cosmic-purple border-r-cosmic-cyan"
          style={{ animationDuration: '1.4s' }}
        />
        <span
          className="absolute h-12 w-12 animate-spin rounded-full border-2 border-transparent border-b-cosmic-blue"
          style={{ animationDuration: '1s', animationDirection: 'reverse' }}
        />
        <span className="font-display text-sm font-bold tracking-widest text-ink">MI</span>
      </div>

      <div className="h-px w-48 overflow-hidden bg-white/10">
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: '0%' }}
          transition={{ duration: 1.8, ease: 'easeInOut' }}
          className="h-full w-full bg-gradient-to-r from-cosmic-purple via-cosmic-blue to-cosmic-cyan"
        />
      </div>

      <StatusText />
    </motion.div>
  )
}
