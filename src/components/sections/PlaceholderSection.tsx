'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { SectionEyebrow } from '@/components/ui/Hud'
import type { SectionMeta } from '@/lib/data'

const chipVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
}

/**
 * Renders a "coming in Phase X" teaser for one of the upcoming sections —
 * still genuinely informative: a real description plus a chip grid of the
 * actual content (project names, skills, ecosystem apps, timeline
 * milestones, or live contact links) that will power the full build.
 */
export function PlaceholderSection({ section }: { section: SectionMeta }) {
  const Icon = section.icon

  return (
    <section id={section.id} className="relative overflow-hidden border-t border-white/5 px-6 py-24 sm:px-8 sm:py-32">
      <div className="pointer-events-none absolute -right-16 -top-16 text-white/[0.025] sm:-right-24 sm:-top-24">
        <Icon size={320} strokeWidth={0.6} />
      </div>

      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse at top, black, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse at top, black, transparent 70%)',
        }}
      />

      <div className="relative mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
        >
          <SectionEyebrow>{section.eyebrow}</SectionEyebrow>

          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl md:text-5xl">
              {section.title}
            </h2>
            <span className="whitespace-nowrap rounded-full border border-cosmic-purple/30 bg-cosmic-purple/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-cosmic-purple">
              Phase {section.phase} — In Development
            </span>
          </div>

          <p className="mt-3 max-w-xl font-display text-lg text-cosmic-cyan/90">{section.accent}</p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-muted sm:text-base">{section.description}</p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}
          className="mt-10 flex flex-wrap gap-2.5"
        >
          {section.chips.map((chip, i) =>
            chip.href ? (
              <motion.a
                key={i}
                href={chip.href}
                target={chip.href.startsWith('http') ? '_blank' : undefined}
                rel={chip.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                data-cursor="hover"
                variants={chipVariants}
                className="glass group flex items-center gap-1.5 rounded-full px-4 py-2 text-xs text-ink-muted transition-colors hover:border-cosmic-cyan/40 hover:text-ink"
              >
                {chip.label}
                <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
              </motion.a>
            ) : (
              <motion.div key={i} variants={chipVariants} className="glass rounded-full px-4 py-2 text-xs text-ink-muted">
                {chip.label}
              </motion.div>
            )
          )}
        </motion.div>
      </div>
    </section>
  )
}
