'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { MapPin, Mail, Github, Phone, GraduationCap } from 'lucide-react'
import { SectionEyebrow } from '@/components/ui/Hud'
import { profile, experience } from '@/lib/data'
import { cn } from '@/lib/utils'

/* ─── Animated counter ────────────────────────────────────────────── */

function Counter({ target, suffix, isYear }: { target: number; suffix: string; isYear: boolean }) {
  const [val, setVal] = useState(isYear ? target - 4 : 0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  useEffect(() => {
    if (!inView) return
    const start = isYear ? target - 4 : 0
    const duration = 1400
    const startTime = performance.now()

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setVal(Math.round(start + (target - start) * eased))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView, target, isYear])

  return (
    <span ref={ref}>
      {val}{suffix}
    </span>
  )
}

/* ─── Holographic profile card ────────────────────────────────────── */

function ProfileCard() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    setTilt({
      x: ((e.clientY - cy) / (rect.height / 2)) * -8,
      y: ((e.clientX - cx) / (rect.width / 2)) * 8,
    })
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7 }}
      style={{ transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`, transformStyle: 'preserve-3d' }}
      className="glass-strong relative overflow-hidden rounded-2xl p-8 transition-transform duration-100"
    >
      {/* Holographic sheen */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-30"
        style={{
          background: `radial-gradient(ellipse at ${50 + tilt.y * 2}% ${50 + tilt.x * 2}%, rgba(139,92,246,0.3) 0%, rgba(34,211,238,0.15) 40%, transparent 70%)`,
        }}
      />
      {/* Scan lines */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-[0.04]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 4px)' }} />

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
          { icon: MapPin, text: profile.location },
          { icon: Mail, text: profile.email, href: `mailto:${profile.email}` },
          { icon: Github, text: profile.githubHandle, href: profile.github },
          { icon: Phone, text: profile.phone, href: `tel:${profile.phone.replace(/\s+/g, '')}` },
          { icon: GraduationCap, text: `Graduating ${2026}` },
        ].map(({ icon: Icon, text, href }) => (
          <div key={text} className="flex items-center gap-3 text-sm text-ink-muted">
            <Icon size={14} className="shrink-0 text-cosmic-cyan/70" />
            {href ? (
              <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                className="hover:text-ink transition-colors truncate" data-cursor="hover">{text}</a>
            ) : (
              <span className="truncate">{text}</span>
            )}
          </div>
        ))}
      </div>

      {/* HUD corner marks */}
      {['top-2 left-2', 'top-2 right-2', 'bottom-2 left-2', 'bottom-2 right-2'].map((pos, i) => (
        <span key={i} className={cn('pointer-events-none absolute h-2.5 w-2.5 border-cosmic-cyan/40', pos,
          i < 2 ? (i === 0 ? 'border-t border-l' : 'border-t border-r') : (i === 2 ? 'border-b border-l' : 'border-b border-r')
        )} />
      ))}
    </motion.div>
  )
}

/* ─── Timeline ────────────────────────────────────────────────────── */

function Timeline() {
  return (
    <div className="relative">
      <div className="absolute left-[7px] top-0 h-full w-px bg-gradient-to-b from-cosmic-purple via-cosmic-blue to-transparent" />
      <div className="space-y-10 pl-8">
        {experience.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="relative"
          >
            <span className="absolute -left-8 top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full border border-cosmic-purple/60 bg-void">
              <span className="h-1.5 w-1.5 rounded-full bg-cosmic-purple" />
            </span>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cosmic-cyan/70">{item.period}</p>
            <h4 className="mt-1 font-display text-base font-semibold text-ink">{item.title}</h4>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{item.description}</p>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {item.tags.map(tag => (
                <span key={tag} className="glass rounded-full px-2.5 py-0.5 font-mono text-[10px] text-ink-dim">{tag}</span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* ─── Section ─────────────────────────────────────────────────────── */

export function About() {
  return (
    <section id="about" className="relative border-t border-white/5 px-6 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <SectionEyebrow>Profile · Holographic ID</SectionEyebrow>
          <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl md:text-5xl">
            About <span className="text-gradient">Miftahul</span>
          </h2>
        </motion.div>

        <div className="mt-14 grid gap-12 lg:grid-cols-[340px_1fr]">
          {/* Left: card + stats */}
          <div className="space-y-8">
            <ProfileCard />

            {/* Animated stats */}
            <div className="grid grid-cols-2 gap-3">
              {profile.stats.map(s => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: '-40px' }}
                  className="glass rounded-xl p-4 text-center"
                >
                  <p className="font-display text-2xl font-bold text-gradient">
                    <Counter target={s.value} suffix={s.suffix} isYear={s.isYear} />
                  </p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-ink-dim">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: bio + timeline */}
          <div className="space-y-10">
            <div className="space-y-5">
              {profile.bio.map((para, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="text-sm leading-relaxed text-ink-muted sm:text-base"
                >
                  {para}
                </motion.p>
              ))}
            </div>

            <div>
              <p className="mb-8 font-mono text-[11px] uppercase tracking-[0.25em] text-ink-dim flex items-center gap-3">
                <span className="h-px w-6 bg-cosmic-purple/60" />Journey
              </p>
              <Timeline />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
