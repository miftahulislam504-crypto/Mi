'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface HudLabelProps {
  label: string
  sub?: string
  className?: string
  align?: 'left' | 'right'
  delay?: number
}

/**
 * Small mono-font coordinate / status readout overlaid on the hero —
 * the "engineering HUD" signature element that ties civil-engineering
 * data into the space environment.
 */
export function HudLabel({ label, sub, className, align = 'left', delay = 1 }: HudLabelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      className={cn(
        'pointer-events-none absolute z-10 hidden flex-col gap-1 font-mono text-[10px] uppercase tracking-[0.25em] sm:flex',
        align === 'right' ? 'items-end text-right' : 'items-start text-left',
        className
      )}
    >
      <span className="flex items-center gap-2 text-cosmic-cyan/80">
        {align === 'left' && <span className="h-px w-4 bg-cosmic-cyan/60" />}
        {label}
        {align === 'right' && <span className="h-px w-4 bg-cosmic-cyan/60" />}
      </span>
      {sub && <span className="text-ink-dim">{sub}</span>}
    </motion.div>
  )
}

/**
 * Animated "Scroll" cue at the bottom of the hero.
 */
export function ScrollIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 2.8 }}
      className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-dim">Scroll</span>
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        className="flex h-9 w-5 items-start justify-center rounded-full border border-white/15 p-1.5"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-cosmic-cyan" />
      </motion.div>
    </motion.div>
  )
}

/**
 * Small mono-font eyebrow label used above section headings throughout
 * the site (e.g. "Portfolio · Orbital System").
 */
export function SectionEyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('mb-4 flex items-center gap-3', className)}>
      <span className="h-px w-8 bg-gradient-to-r from-cosmic-cyan to-transparent" />
      <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-cosmic-cyan/80">{children}</span>
    </div>
  )
}
