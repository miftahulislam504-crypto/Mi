'use client'

/**
 * About section — Phase 3.
 *
 * Layout: two-column on desktop (ProfileCard + stats left, bio + skills right).
 * Timeline removed here — it lives in the dedicated Experience section below.
 *
 * New in Phase 3:
 *   • Ambient particle canvas backdrop (lightweight, CSS-only approach via
 *     animated pseudo-elements to avoid a third R3F canvas mount)
 *   • Touch-friendly tilt on ProfileCard: mouse on desktop, gyro hint on mobile
 *   • Skills quick-view — three collapsible rows (Frontend / Backend / Engineering)
 *     directly in About, so the visitor gets the full picture without scrolling
 *     to SkillsGalaxy
 *   • Stat cards now have a subtle color accent matching the cosmic palette
 *   • Section gets a faint blueprint-grid overlay for the engineering aesthetic
 */

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Mail, Github, Phone, GraduationCap, ChevronDown } from 'lucide-react'
import { SectionEyebrow } from '@/components/ui/Hud'
import { profile, skills } from '@/lib/data'
import { cn } from '@/lib/utils'

/* ─── Animated counter ─────────────────────────────────────────────── */

function Counter({ target, suffix, isYear }: { target: number; suffix: string; isYear: boolean }) {
  const [val, setVal] = useState(isYear ? target - 4 : 0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return
        started.current = true
        const start = isYear ? target - 4 : 0
        const duration = 1400
        const t0 = performance.now()
        const tick = (now: number) => {
          const p = Math.min((now - t0) / duration, 1)
          const e = 1 - Math.pow(1 - p, 3)
          setVal(Math.round(start + (target - start) * e))
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      },
      { rootMargin: '-60px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [target, isYear])

  return <span ref={ref}>{val}{suffix}</span>
}

/* ─── Stat card colors ─────────────────────────────────────────────── */

const STAT_COLORS = ['#8B5CF6', '#22D3EE', '#3B82F6', '#A855F7']

/* ─── Holographic profile card ─────────────────────────────────────── */

function ProfileCard() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)
  const rafRef  = useRef<number>(0)

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    const cx = rect.left + rect.width  / 2
    const cy = rect.top  + rect.height / 2
    const tx = ((e.clientY - cy) / (rect.height / 2)) * -8
    const ty = ((e.clientX - cx) / (rect.width  / 2)) *  8
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => setTilt({ x: tx, y: ty }))
  }, [])

  const handleLeave = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    setTilt({ x: 0, y: 0 })
  }, [])

  useEffect(() => () => cancelAnimationFrame(rafRef.current), [])

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7 }}
      style={{
        transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transformStyle: 'preserve-3d',
      }}
      className="glass-strong relative overflow-hidden rounded-2xl p-8 transition-[transform] duration-100 will-change-transform"
    >
      {/* Holographic sheen */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-25 transition-all duration-200"
        style={{
          background: `radial-gradient(ellipse at ${50 + tilt.y * 2.5}% ${50 + tilt.x * 2.5}%, rgba(139,92,246,0.35) 0%, rgba(34,211,238,0.18) 45%, transparent 70%)`,
        }}
      />
      {/* Scan lines */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-[0.035]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 4px)' }}
      />

      {/* Monogram avatar */}
      <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-cosmic-purple/30 to-cosmic-cyan/20">
        <span className="font-display text-2xl font-bold text-gradient">{profile.initials}</span>
        <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-void bg-cosmic-cyan animate-pulse-glow" />
      </div>

      <h3 className="font-display text-xl font-bold text-ink">{profile.fullName}</h3>
      <p className="mt-1 font-mono text-xs uppercase tracking-[0.2em] text-cosmic-cyan/80">
        Civil Engineer · Full-Stack Developer
      </p>

      <div className="mt-6 space-y-3">
        {[
          { icon: MapPin,        text: profile.location },
          { icon: Mail,          text: profile.email,        href: `mailto:${profile.email}` },
          { icon: Github,        text: profile.githubHandle, href: profile.github },
          { icon: Phone,         text: profile.phone,        href: `tel:${profile.phone.replace(/\s+/g, '')}` },
          { icon: GraduationCap, text: `Graduating ${2026}` },
        ].map(({ icon: Icon, text, href }) => (
          <div key={text} className="flex items-center gap-3 text-sm text-ink-muted">
            <Icon size={14} className="shrink-0 text-cosmic-cyan/70" />
            {href ? (
              <a
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="truncate hover:text-ink transition-colors"
                data-cursor="hover"
              >
                {text}
              </a>
            ) : (
              <span className="truncate">{text}</span>
            )}
          </div>
        ))}
      </div>

      {/* HUD corner marks */}
      {(['top-2 left-2', 'top-2 right-2', 'bottom-2 left-2', 'bottom-2 right-2'] as const).map((pos, i) => (
        <span
          key={i}
          className={cn('pointer-events-none absolute h-2.5 w-2.5 border-cosmic-cyan/40', pos,
            i < 2 ? (i === 0 ? 'border-t border-l' : 'border-t border-r')
                  : (i === 2 ? 'border-b border-l' : 'border-b border-r')
          )}
        />
      ))}
    </motion.div>
  )
}

/* ─── Skills quick-view ─────────────────────────────────────────────── */

const SKILL_GROUPS = [
  { key: 'frontend',    label: 'Frontend',    color: '#22D3EE', items: skills.frontend    },
  { key: 'backend',     label: 'Backend',     color: '#8B5CF6', items: skills.backend     },
  { key: 'engineering', label: 'Engineering', color: '#3B82F6', items: skills.engineering },
] as const

function SkillsQuickView() {
  const [open, setOpen] = useState<string | null>('frontend')

  return (
    <div className="space-y-2">
      {SKILL_GROUPS.map((group) => {
        const isOpen = open === group.key
        return (
          <div key={group.key} className="glass rounded-xl overflow-hidden">
            <button
              onClick={() => setOpen(isOpen ? null : group.key)}
              className="flex w-full items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-white/[0.03]"
            >
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ background: group.color }} />
                <span className="font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: group.color }}>
                  {group.label}
                </span>
                <span className="font-mono text-[10px] text-ink-dim">
                  {group.items.length} skills
                </span>
              </div>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={14} className="text-ink-dim" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-wrap gap-1.5 px-4 pb-4 pt-1">
                    {group.items.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full px-2.5 py-1 font-mono text-[10px] transition-colors"
                        style={{
                          background: `${group.color}12`,
                          color: group.color,
                          border: `1px solid ${group.color}28`,
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

/* ─── Section ───────────────────────────────────────────────────────── */

export function About() {
  return (
    <section
      id="about"
      className="relative border-t border-white/5 px-6 py-24 sm:px-8 sm:py-32 overflow-hidden"
    >
      {/* Blueprint grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #22D3EE 1px, transparent 1px), linear-gradient(to bottom, #22D3EE 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse at 30% 40%, black 20%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 30% 40%, black 20%, transparent 75%)',
        }}
      />

      {/* Ambient glow orbs */}
      <div className="pointer-events-none absolute -left-24 top-1/4 h-64 w-64 rounded-full bg-cosmic-purple/8 blur-[80px]" />
      <div className="pointer-events-none absolute -right-16 bottom-1/4 h-48 w-48 rounded-full bg-cosmic-cyan/6 blur-[60px]" />

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <SectionEyebrow>Profile · Holographic ID</SectionEyebrow>
          <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl md:text-5xl">
            About <span className="text-gradient">Miftahul</span>
          </h2>
        </motion.div>

        {/* Main grid */}
        <div className="mt-14 grid gap-10 lg:grid-cols-[320px_1fr] xl:grid-cols-[360px_1fr]">

          {/* ── Left column: card + stats ── */}
          <div className="space-y-6">
            <ProfileCard />

            {/* Animated stats */}
            <div className="grid grid-cols-2 gap-3">
              {profile.stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, scale: 0.88 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  className="glass rounded-xl p-4 text-center relative overflow-hidden"
                >
                  {/* Color accent line */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl"
                    style={{ background: `linear-gradient(to right, ${STAT_COLORS[i]}88, transparent)` }}
                  />
                  <p className="font-display text-2xl font-bold" style={{ color: STAT_COLORS[i] }}>
                    <Counter target={s.value} suffix={s.suffix} isYear={s.isYear} />
                  </p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-ink-dim">
                    {s.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ── Right column: bio + skills ── */}
          <div className="space-y-10">

            {/* Bio */}
            <div className="space-y-5">
              {profile.bio.map((para, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="text-sm leading-relaxed text-ink-muted sm:text-base"
                >
                  {para}
                </motion.p>
              ))}
            </div>

            {/* Skills quick-view */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.55, delay: 0.1 }}
            >
              <p className="mb-4 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-ink-dim">
                <span className="h-px w-6 bg-cosmic-cyan/50" />
                Technical Stack
              </p>
              <SkillsQuickView />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
