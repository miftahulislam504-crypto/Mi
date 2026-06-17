'use client'

import { motion } from 'framer-motion'
import { SectionEyebrow } from '@/components/ui/Hud'
import { experience } from '@/lib/data'

export function Experience() {
  return (
    <section id="experience" className="relative border-t border-white/5 px-6 py-24 sm:px-8 sm:py-32">
      {/* Blueprint grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #22D3EE 1px, transparent 1px), linear-gradient(to bottom, #22D3EE 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative mx-auto max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <SectionEyebrow>Journey · Timeline</SectionEyebrow>
          <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl md:text-5xl">
            From One File to <span className="text-gradient">an Ecosystem</span>
          </h2>
          <p className="mt-3 max-w-xl text-ink-muted">
            The full build history — from learning HTML on a phone in Sirajganj to shipping eleven production applications.
          </p>
        </motion.div>

        <div className="relative mt-20">
          {/* Vertical spine */}
          <div className="absolute left-[calc(50%-0.5px)] top-0 h-full w-px bg-gradient-to-b from-cosmic-purple via-cosmic-blue/60 to-transparent hidden sm:block" />

          <div className="space-y-16">
            {experience.map((item, i) => {
              const isLeft = i % 2 === 0
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className={`relative flex flex-col gap-4 sm:flex-row sm:gap-0 ${isLeft ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}
                >
                  {/* Card */}
                  <div className={`glass rounded-2xl p-6 sm:w-[calc(50%-32px)] ${isLeft ? 'sm:mr-8' : 'sm:ml-8'}`}>
                    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-cosmic-cyan/70 mb-1">{item.period}</p>
                    <h3 className="font-display text-base font-semibold text-ink sm:text-lg">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.description}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {item.tags.map(tag => (
                        <span key={tag} className="rounded-full border border-cosmic-purple/20 bg-cosmic-purple/10 px-2.5 py-0.5 font-mono text-[10px] text-cosmic-purple/90">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Spine dot */}
                  <div className="absolute left-1/2 top-6 hidden -translate-x-1/2 sm:flex">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-cosmic-purple bg-void">
                      <span className="h-1.5 w-1.5 rounded-full bg-cosmic-cyan" />
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
