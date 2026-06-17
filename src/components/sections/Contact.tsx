'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Github, Phone, MapPin, ArrowUpRight, Send } from 'lucide-react'
import { SectionEyebrow } from '@/components/ui/Hud'
import { profile } from '@/lib/data'

/* ─── Animated globe canvas ───────────────────────────────────────── */

function GlobeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let frame = 0
    let raf: number

    const draw = () => {
      const w = canvas.width = canvas.offsetWidth * window.devicePixelRatio
      const h = canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.clearRect(0, 0, w, h)
      ctx.scale(1, 1)

      const cx = w / 2, cy = h / 2
      const r = Math.min(w, h) * 0.38
      const t = frame * 0.008

      // Outer glow
      const grd = ctx.createRadialGradient(cx, cy, r * 0.6, cx, cy, r * 1.3)
      grd.addColorStop(0, 'rgba(139,92,246,0.08)')
      grd.addColorStop(1, 'rgba(34,211,238,0)')
      ctx.fillStyle = grd
      ctx.fillRect(0, 0, w, h)

      // Globe base
      const globeGrd = ctx.createRadialGradient(cx - r * 0.25, cy - r * 0.2, r * 0.1, cx, cy, r)
      globeGrd.addColorStop(0, 'rgba(16,22,43,0.95)')
      globeGrd.addColorStop(1, 'rgba(4,5,13,0.98)')
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.fillStyle = globeGrd
      ctx.fill()
      ctx.strokeStyle = 'rgba(139,92,246,0.3)'
      ctx.lineWidth = 1.5
      ctx.stroke()

      // Latitude lines
      for (let lat = -60; lat <= 60; lat += 30) {
        const latR = r * Math.cos((lat * Math.PI) / 180)
        const latY = cy + r * Math.sin((lat * Math.PI) / 180)
        if (latR > 2) {
          ctx.beginPath()
          ctx.ellipse(cx, latY, latR, latR * 0.15, 0, 0, Math.PI * 2)
          ctx.strokeStyle = 'rgba(34,211,238,0.12)'
          ctx.lineWidth = 0.8
          ctx.stroke()
        }
      }

      // Longitude lines (rotating)
      for (let i = 0; i < 6; i++) {
        const angle = ((i / 6) * Math.PI * 2 + t) % (Math.PI * 2)
        const xOff = Math.sin(angle) * r
        ctx.save()
        ctx.beginPath()
        ctx.ellipse(cx + xOff * 0.15, cy, Math.abs(xOff), r, 0, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(139,92,246,${0.06 + Math.cos(angle) * 0.04})`
        ctx.lineWidth = 0.8
        ctx.stroke()
        ctx.restore()
      }

      // Location dot (Bangladesh approximate position on globe)
      const bdLon = ((89.5 - 0) / 180) * Math.PI
      const bdLat = (24.4 / 180) * Math.PI
      const dotAngle = bdLon + t
      const dotX = cx + r * Math.cos(bdLat) * Math.sin(dotAngle)
      const dotY = cy - r * Math.sin(bdLat)
      const dotVis = Math.cos(bdLat) * Math.cos(dotAngle)
      if (dotVis > 0) {
        ctx.beginPath()
        ctx.arc(dotX, dotY, 5 * dotVis, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(34,211,238,${dotVis * 0.9})`
        ctx.fill()
        // Pulse ring
        const pulse = (Math.sin(t * 4) * 0.5 + 0.5) * 10 + 5
        ctx.beginPath()
        ctx.arc(dotX, dotY, pulse * dotVis, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(34,211,238,${dotVis * 0.3})`
        ctx.lineWidth = 1
        ctx.stroke()
      }

      frame++
      raf = requestAnimationFrame(draw)
    }

    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [])

  return <canvas ref={canvasRef} className="h-full w-full" style={{ imageRendering: 'crisp-edges' }} />
}

/* ─── Contact links ───────────────────────────────────────────────── */

const CONTACTS = [
  { icon: Mail, label: 'Email', value: profile.email, href: `mailto:${profile.email}`, color: '#8B5CF6' },
  { icon: Github, label: 'GitHub', value: profile.githubHandle, href: profile.github, color: '#22D3EE', external: true },
  { icon: Phone, label: 'Phone', value: profile.phone, href: `tel:${profile.phone.replace(/\s+/g, '')}`, color: '#3B82F6' },
  { icon: MapPin, label: 'Location', value: profile.location, href: undefined, color: '#A855F7' },
]

/* ─── Terminal-style form ─────────────────────────────────────────── */

function TerminalInput() {
  const [value, setValue] = useState('')
  const [sent, setSent] = useState(false)

  const handleSend = () => {
    if (!value.trim()) return
    window.location.href = `mailto:${profile.email}?subject=Hello from Portfolio&body=${encodeURIComponent(value)}`
    setSent(true)
    setValue('')
    setTimeout(() => setSent(false), 3000)
  }

  return (
    <div className="glass rounded-2xl p-6">
      <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.25em] text-cosmic-cyan/70">
        {'>'} OPEN CHANNEL
      </p>
      <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-void px-4 py-3 focus-within:border-cosmic-cyan/40 transition-colors">
        <span className="font-mono text-cosmic-cyan/70 text-sm shrink-0">{'>'}_</span>
        <input
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Type a message and press Enter…"
          className="flex-1 bg-transparent font-mono text-sm text-ink outline-none placeholder:text-ink-dim"
        />
        <button onClick={handleSend} data-cursor="hover" aria-label="Send"
          className="shrink-0 rounded-lg p-1.5 text-cosmic-cyan/60 transition-colors hover:text-cosmic-cyan">
          <Send size={14} />
        </button>
      </div>
      {sent && (
        <p className="mt-2 font-mono text-[10px] text-cosmic-cyan/80 uppercase tracking-[0.2em]">
          ✓ Opening mail client…
        </p>
      )}
      <p className="mt-3 text-[11px] text-ink-dim">
        Or email directly at{' '}
        <a href={`mailto:${profile.email}`} className="text-cosmic-cyan/80 hover:text-cosmic-cyan transition-colors">
          {profile.email}
        </a>
      </p>
    </div>
  )
}

/* ─── Section ─────────────────────────────────────────────────────── */

export function Contact() {
  return (
    <section id="contact" className="relative border-t border-white/5 px-6 py-24 sm:px-8 sm:py-32">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 left-1/2 h-[50%] w-[60%] -translate-x-1/2 rounded-full bg-cosmic-purple/8 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <SectionEyebrow>Connection · Command Center</SectionEyebrow>
          <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl md:text-5xl">
            Let&apos;s Build <span className="text-gradient">Something</span>
          </h2>
          <p className="mt-3 max-w-xl text-ink-muted">
            Open to collaboration on CivilOS, construction tech, community platforms, or anything in between. Based in Sirajganj, Bangladesh — available globally.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-12 lg:grid-cols-2">
          {/* Globe */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative flex items-center justify-center"
          >
            <div className="h-[320px] w-[320px] sm:h-[380px] sm:w-[380px]">
              <GlobeCanvas />
            </div>
            {/* Coordinates overlay */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-cosmic-cyan/70">{profile.coordinates}</p>
              <p className="font-mono text-[9px] text-ink-dim mt-0.5">{profile.location}</p>
            </div>
          </motion.div>

          {/* Right column */}
          <div className="flex flex-col gap-6">
            {/* Contact links */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {CONTACTS.map(({ icon: Icon, label, value, href, color, external }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  {href ? (
                    <a
                      href={href}
                      target={external ? '_blank' : undefined}
                      rel={external ? 'noopener noreferrer' : undefined}
                      data-cursor="hover"
                      className="group glass flex items-center gap-3 rounded-xl p-4 transition-all hover:border-white/20"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: `${color}18` }}>
                        <Icon size={15} style={{ color }} />
                      </span>
                      <div className="min-w-0">
                        <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink-dim">{label}</p>
                        <p className="mt-0.5 truncate text-xs text-ink-muted group-hover:text-ink transition-colors">{value}</p>
                      </div>
                      <ArrowUpRight size={13} className="ml-auto shrink-0 opacity-0 group-hover:opacity-60 transition-opacity text-ink-dim" />
                    </a>
                  ) : (
                    <div className="glass flex items-center gap-3 rounded-xl p-4">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: `${color}18` }}>
                        <Icon size={15} style={{ color }} />
                      </span>
                      <div className="min-w-0">
                        <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink-dim">{label}</p>
                        <p className="mt-0.5 truncate text-xs text-ink-muted">{value}</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Terminal input */}
            <TerminalInput />
          </div>
        </div>
      </div>
    </section>
  )
}
