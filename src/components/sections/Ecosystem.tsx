'use client'

import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { SectionEyebrow } from '@/components/ui/Hud'
import { ecosystemCore, ecosystemHighlights, type Project } from '@/lib/data'
import { ExternalLink } from 'lucide-react'

/* ─── Animated connection line (SVG) ─────────────────────────────── */

interface ConnectionProps {
  x1: number; y1: number; x2: number; y2: number; color: string; delay: number
}

function Connection({ x1, y1, x2, y2, color, delay }: ConnectionProps) {
  const length = Math.hypot(x2 - x1, y2 - y1)
  return (
    <g>
      {/* Base dim line */}
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} strokeOpacity={0.15} />
      {/* Animated glowing pulse */}
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.5} strokeOpacity={0.7}
        strokeDasharray={`${length * 0.25} ${length}`}
      >
        <animate attributeName="stroke-dashoffset" from={length} to={-length * 0.25}
          dur="2.4s" begin={`${delay}s`} repeatCount="indefinite" />
      </line>
      {/* Dot at core end */}
      <circle cx={x2} cy={y2} r={2.5} fill={color} opacity={0.6} />
    </g>
  )
}

/* ─── App node ────────────────────────────────────────────────────── */

interface AppNodeProps {
  project: Project
  cx: number; cy: number
  coreCx: number; coreCy: number
  index: number
}

function AppNode({ project, cx, cy, coreCx, coreCy, index }: AppNodeProps) {
  const Icon = project.icon
  const [hovered, setHovered] = useState(false)

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Connection x1={cx} y1={cy} x2={coreCx} y2={coreCy} color={project.color} delay={index * 0.4} />

      <foreignObject x={cx - 48} y={cy - 48} width={96} height={96}>
        <div
          className="flex h-full w-full flex-col items-center justify-center gap-1.5 rounded-2xl cursor-pointer transition-all duration-200"
          style={{
            background: hovered ? `${project.color}22` : 'rgba(10,14,28,0.8)',
            border: `1px solid ${hovered ? project.color + '66' : project.color + '33'}`,
            backdropFilter: 'blur(12px)',
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={() => window.open(project.url, '_blank')}
        >
          <Icon size={18} style={{ color: project.color }} />
          <span style={{ color: hovered ? project.color : '#8B93A7', fontFamily: 'monospace', fontSize: 9, textAlign: 'center', lineHeight: 1.3, letterSpacing: '0.05em', textTransform: 'uppercase', maxWidth: 70 }}>
            {project.shortName}
          </span>
          {hovered && <ExternalLink size={10} style={{ color: project.color }} />}
        </div>
      </foreignObject>
    </motion.g>
  )
}

/* ─── SVG Ecosystem map ───────────────────────────────────────────── */

function EcosystemMap() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 640, h: 420 })

  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        setSize({ w: containerRef.current.offsetWidth, h: containerRef.current.offsetHeight })
      }
    }
    update()
    const ro = new ResizeObserver(update)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  const cx = size.w / 2
  const cy = size.h / 2
  const r = Math.min(size.w, size.h) * 0.34

  const nodes = ecosystemCore.map((p, i) => {
    const angle = (i / ecosystemCore.length) * Math.PI * 2 - Math.PI / 2
    return { project: p, x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r }
  })

  return (
    <div ref={containerRef} className="relative h-[460px] w-full">
      <svg width={size.w} height={size.h} className="absolute inset-0">
        <defs>
          <radialGradient id="coreGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#22D3EE" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Core glow */}
        <circle cx={cx} cy={cy} r={70} fill="url(#coreGrad)" />
        <circle cx={cx} cy={cy} r={48} fill="rgba(4,5,13,0.9)" stroke="rgba(139,92,246,0.5)" strokeWidth={1.5} />

        {/* App nodes */}
        {nodes.map((n, i) => (
          <AppNode key={n.project.id} project={n.project} cx={n.x} cy={n.y}
            coreCx={cx} coreCy={cy} index={i} />
        ))}

        {/* Core label */}
        <foreignObject x={cx - 44} y={cy - 22} width={88} height={44}>
          <div className="flex h-full flex-col items-center justify-center text-center">
            <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-cosmic-purple">Firestore</span>
            <span className="font-mono text-[8px] text-ink-dim leading-tight">civilengineering-platform</span>
          </div>
        </foreignObject>
      </svg>
    </div>
  )
}

/* ─── Section ─────────────────────────────────────────────────────── */

export function Ecosystem() {
  return (
    <section id="ecosystem" className="relative border-t border-white/5 px-6 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <SectionEyebrow>Architecture · CivilOS Core</SectionEyebrow>
          <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl md:text-5xl">
            CivilOS <span className="text-gradient">Ecosystem</span>
          </h2>
          <p className="mt-3 max-w-xl text-ink-muted">
            Six apps. One shared Firestore backend. Real-time sync, unified auth, and a single BNBC 2020 compliance engine powering everything.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_300px]">
          <EcosystemMap />

          <div className="flex flex-col justify-center space-y-6">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-dim mb-4">Core Architecture</p>
              <div className="space-y-3">
                {ecosystemHighlights.map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="flex items-start gap-3 text-sm text-ink-muted"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cosmic-purple" />
                    {h}
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-dim mb-4">Live Apps</p>
              <div className="space-y-2">
                {ecosystemCore.map((p, i) => {
                  const Icon = p.icon
                  return (
                    <motion.a
                      key={p.id}
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.06 }}
                      data-cursor="hover"
                      className="group flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-white/[0.03]"
                    >
                      <Icon size={14} style={{ color: p.color }} className="shrink-0" />
                      <span className="text-xs text-ink-muted group-hover:text-ink transition-colors">{p.shortName}</span>
                      <ExternalLink size={11} className="ml-auto opacity-0 group-hover:opacity-60 transition-opacity text-ink-dim" />
                    </motion.a>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
