'use client'

import { useRef, useMemo, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html, Stars, AdaptiveDpr } from '@react-three/drei'
import * as THREE from 'three'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { SectionEyebrow } from '@/components/ui/Hud'
import { skills } from '@/lib/data'

/* ─── Skill categories config ─────────────────────────────────────── */

const SKILL_GROUPS = [
  { label: 'Frontend', items: skills.frontend, color: '#22D3EE', ringRadius: 3.2, speed: 0.18 },
  { label: 'Backend',  items: skills.backend,  color: '#8B5CF6', ringRadius: 5.2, speed: 0.12 },
  { label: 'Engineering', items: skills.engineering, color: '#3B82F6', ringRadius: 7.4, speed: 0.08 },
]

/* ─── Single skill node ───────────────────────────────────────────── */

interface SkillNodeProps {
  label: string
  color: string
  ringRadius: number
  phaseOffset: number
  speed: number
  tilt: number
}

function SkillNode({ label, color, ringRadius, phaseOffset, speed, tilt }: SkillNodeProps) {
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime() * speed + phaseOffset
    groupRef.current.position.x = Math.cos(t) * ringRadius
    groupRef.current.position.y = Math.sin(t) * ringRadius * Math.sin(tilt)
    groupRef.current.position.z = Math.sin(t) * ringRadius * Math.cos(tilt)
  })

  return (
    <group ref={groupRef}>
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.5 : 1}
      >
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 3 : 1.4}
          transparent
          opacity={0.9}
        />
      </mesh>
      {hovered && (
        <Html center distanceFactor={6} style={{ pointerEvents: 'none' }}>
          <div style={{
            background: 'rgba(4,5,13,0.9)',
            border: `1px solid ${color}66`,
            borderRadius: 4,
            padding: '3px 7px',
            color,
            fontFamily: 'monospace',
            fontSize: 10,
            whiteSpace: 'nowrap',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            transform: 'translateY(-22px)',
          }}>
            {label}
          </div>
        </Html>
      )}
    </group>
  )
}

/* ─── Galaxy core ─────────────────────────────────────────────────── */

function GalaxyCore() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.1
  })
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.4, 32, 32]} />
      <meshStandardMaterial color="#ffffff" emissive="#8B5CF6" emissiveIntensity={4} />
    </mesh>
  )
}

/* ─── Galaxy scene ────────────────────────────────────────────────── */

function GalaxyScene() {
  const tiltAngles = useMemo(() => [Math.PI / 6, Math.PI / 3.5, Math.PI / 2.5], [])

  return (
    <Canvas camera={{ position: [0, 4, 12], fov: 50 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
      <color attach="background" args={['#04050D']} />
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 0, 0]} color="#8B5CF6" intensity={8} distance={20} />
      <Stars radius={60} count={2500} factor={2} saturation={0} fade speed={0.2} />
      <GalaxyCore />
      {SKILL_GROUPS.map((group, gi) =>
        group.items.map((item, ii) => (
          <SkillNode
            key={`${gi}-${ii}`}
            label={item}
            color={group.color}
            ringRadius={group.ringRadius}
            phaseOffset={(ii / group.items.length) * Math.PI * 2}
            speed={group.speed}
            tilt={tiltAngles[gi]}
          />
        ))
      )}
      <AdaptiveDpr pixelated />
    </Canvas>
  )
}

const GalaxySceneDynamic = dynamic(() => Promise.resolve(GalaxyScene), { ssr: false })

/* ─── Skill chips (fallback / legend) ────────────────────────────── */

function SkillChips() {
  return (
    <div className="mx-auto mt-8 max-w-7xl px-6 pb-24 sm:px-8">
      <div className="grid gap-8 sm:grid-cols-3">
        {SKILL_GROUPS.map((group, i) => (
          <motion.div
            key={group.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <div className="mb-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ background: group.color }} />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: group.color }}>
                {group.label}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {group.items.map(skill => (
                <span key={skill} className="glass rounded-full px-3 py-1.5 text-xs text-ink-muted transition-colors hover:text-ink">
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* ─── Section ─────────────────────────────────────────────────────── */

export function SkillsGalaxy() {
  return (
    <section id="skills" className="relative border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6 pt-20 sm:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <SectionEyebrow>Capabilities · Skills Galaxy</SectionEyebrow>
          <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl md:text-5xl">
            Skills <span className="text-gradient">Galaxy</span>
          </h2>
          <p className="mt-3 max-w-xl text-ink-muted">
            Every technology I build with, orbiting in three rings — frontend, backend, and engineering software. Hover any node to identify it.
          </p>
        </motion.div>
      </div>

      <div className="mt-6 h-[60vh] min-h-[400px]">
        <GalaxySceneDynamic />
      </div>

      <SkillChips />
    </section>
  )
}
