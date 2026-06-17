'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { TypingText, RoleCycler } from '@/components/ui/TypingText'
import { GlowButton } from '@/components/ui/Button'
import { HudLabel, ScrollIndicator } from '@/components/ui/Hud'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useVisitorPulse } from '@/hooks/useVisitorPulse'
import { profile } from '@/lib/data'
import { formatNumber } from '@/lib/utils'

const HeroScene = dynamic(() => import('@/components/three/HeroScene'), {
  ssr: false,
  loading: () => null,
})

/**
 * Static gradient shown instead of the 3D scene when the visitor prefers
 * reduced motion, and as the dynamic-import loading placeholder.
 */
function HeroBackdropFallback() {
  return (
    <div className="absolute inset-0">
      <div className="absolute left-1/2 top-1/2 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cosmic-purple/20 blur-[120px]" />
      <div className="absolute right-1/4 top-1/3 h-[40vmin] w-[40vmin] rounded-full bg-cosmic-cyan/15 blur-[100px]" />
      <div className="absolute bottom-0 left-1/4 h-[40vmin] w-[40vmin] rounded-full bg-cosmic-blue/15 blur-[100px]" />
    </div>
  )
}

export function Hero() {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const visitors = useVisitorPulse()

  return (
    <section id="home" className="relative flex h-[100svh] w-full flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#0c0f1f] via-[#04050D] to-[#04050D]">
        {prefersReducedMotion ? <HeroBackdropFallback /> : <HeroScene />}
      </div>
      <div className="absolute inset-0 -z-[5] bg-noise" />

      {/* Engineering HUD overlays */}
      <HudLabel
        label={profile.coordinates}
        sub={profile.location.toUpperCase()}
        align="left"
        className="left-4 top-24 sm:left-8"
        delay={1.2}
      />
      <HudLabel
        label="SYS // CIVILOS"
        sub={visitors !== null ? `SIGNAL #${formatNumber(visitors)}` : 'STATUS: ONLINE'}
        align="right"
        className="right-4 top-24 sm:right-8"
        delay={1.4}
      />

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 backdrop-blur-md"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cosmic-cyan opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-cosmic-cyan" />
          </span>
          <span className="min-w-[13ch] font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">
            <RoleCycler roles={profile.roles} />
          </span>
        </motion.div>

        <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-ink sm:text-5xl md:text-6xl lg:text-7xl">
          <TypingText text={profile.headline} startDelay={400} speed={28} />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.2 }}
          className="mt-6 max-w-2xl text-base text-ink-muted sm:text-lg"
        >
          {profile.subheadline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.5 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <GlowButton href="#universe">Explore the Universe</GlowButton>
          <GlowButton href="#contact" variant="ghost" icon={false}>
            Get in Touch
          </GlowButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 2.8 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
        >
          {profile.stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <span className="font-display text-xl font-bold text-ink sm:text-2xl">
                {stat.isYear ? stat.value : `${stat.value}${stat.suffix}`}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-dim">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      <ScrollIndicator />
    </section>
  )
}
