'use client'

/**
 * Universe section — Phase 2.
 *
 * Hosts the single persistent GalaxyExperience canvas that replaced both
 * the old HeroScene and the old UniverseScene. The canvas is 90vh tall so
 * it dominates the viewport; below it lives the accessible project grid
 * for SEO / keyboard / no-JS users.
 *
 * Navigation flow (all handled inside GalaxyExperience):
 *   Galaxy view → click cluster → Universe view → click planet → ProjectPanel
 */

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { SectionEyebrow } from '@/components/ui/Hud'
import { projects } from '@/lib/data'
import { cn } from '@/lib/utils'
import { useState, useCallback } from 'react'

const GalaxyExperienceDynamic = dynamic(
  () => import('@/components/three/GalaxyExperience').then((m) => ({ default: m.GalaxyExperience })),
  { ssr: false, loading: () => <GalaxyPlaceholder /> }
)

function GalaxyPlaceholder() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-cosmic-purple border-t-transparent" />
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-dim">
          Initialising galaxy…
        </span>
      </div>
    </div>
  )
}

export function Universe() {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const handleGridSelect = useCallback((id: string) => {
    setSelectedId((prev) => (prev === id ? null : id))
  }, [])

  return (
    <section id="universe" className="relative border-t border-white/5">
      {/* Section header */}
      <div className="mx-auto max-w-7xl px-6 pt-20 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <SectionEyebrow>Portfolio · Galaxy Explorer</SectionEyebrow>
          <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl md:text-5xl">
            3D Engineering{' '}
            <span className="text-gradient">Universe</span>
          </h2>
          <p className="mt-3 max-w-xl text-ink-muted">
            Four universes. Eleven live applications. Click any cluster to fly in,
            then click a planet to open its project.
          </p>
        </motion.div>
      </div>

      {/* Galaxy canvas — tall so it dominates the viewport */}
      <div className="relative mt-6 h-[90vh] min-h-[560px]">
        <GalaxyExperienceDynamic />
      </div>

      {/* Accessible project grid — SEO + keyboard fallback */}
      <div className="mx-auto max-w-7xl px-6 pb-24 sm:px-8">
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {projects.map((p) => {
            const Icon = p.icon
            return (
              <a
                key={p.id}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="hover"
                className={cn(
                  'glass group flex flex-col gap-2 rounded-xl p-3 text-left transition-all hover:border-white/20'
                )}
              >
                <Icon size={16} style={{ color: p.color }} />
                <span className="text-[11px] leading-tight text-ink-muted group-hover:text-ink transition-colors">
                  {p.shortName}
                </span>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
