'use client'

import { useRef, useState, useMemo, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Html, Stars, AdaptiveDpr } from '@react-three/drei'
import * as THREE from 'three'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, X, ExternalLink } from 'lucide-react'
import { SectionEyebrow } from '@/components/ui/Hud'
import { projects, type Project } from '@/lib/data'
import { cn } from '@/lib/utils'

/* ─── Planet mesh ─────────────────────────────────────────────────── */

const GEOMETRIES = [
  'sphere', 'icosahedron', 'octahedron', 'dodecahedron',
  'sphere', 'icosahedron', 'octahedron', 'dodecahedron',
  'sphere', 'icosahedron', 'octahedron',
] as const

function PlanetGeometry({ type, radius }: { type: typeof GEOMETRIES[number]; radius: number }) {
  switch (type) {
    case 'icosahedron': return <icosahedronGeometry args={[radius, 1]} />
    case 'octahedron':  return <octahedronGeometry args={[radius, 0]} />
    case 'dodecahedron':return <dodecahedronGeometry args={[radius, 0]} />
    default:            return <sphereGeometry args={[radius, 32, 32]} />
  }
}

interface PlanetProps {
  project: Project
  index: number
  total: number
  selected: string | null
  onSelect: (id: string) => void
}

function Planet({ project, index, total, selected, onSelect }: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const orbitRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)

  const orbitRadius = 3.5 + index * 1.45
  const orbitSpeed  = 0.06 / (1 + index * 0.18)
  const planetSize  = 0.28 + (index % 3) * 0.06
  const phaseOffset = (index / total) * Math.PI * 2

  const color = useMemo(() => new THREE.Color(project.color), [project.color])
  const glowColor = useMemo(() => new THREE.Color(project.color).multiplyScalar(0.4), [project.color])

  useFrame(({ clock }) => {
    if (!orbitRef.current) return
    const t = clock.getElapsedTime() * orbitSpeed + phaseOffset
    orbitRef.current.position.x = Math.cos(t) * orbitRadius
    orbitRef.current.position.z = Math.sin(t) * orbitRadius
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.006
      meshRef.current.rotation.x += 0.003
    }
  })

  const isSelected = selected === project.id
  const dimmed = selected !== null && !isSelected

  return (
    <group ref={orbitRef}>
      <Float speed={1.2} rotationIntensity={0} floatIntensity={0.3}>
        <mesh
          ref={meshRef}
          onClick={() => onSelect(project.id)}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          scale={isSelected ? 1.6 : hovered ? 1.25 : 1}
        >
          <PlanetGeometry type={GEOMETRIES[index % GEOMETRIES.length]} radius={planetSize} />
          <meshStandardMaterial
            color={color}
            emissive={glowColor}
            emissiveIntensity={hovered || isSelected ? 2 : 0.8}
            metalness={0.3}
            roughness={0.5}
            wireframe={GEOMETRIES[index % GEOMETRIES.length] !== 'sphere'}
            transparent
            opacity={dimmed ? 0.25 : 1}
          />
        </mesh>

        {/* Glow halo */}
        <mesh scale={isSelected ? 2.2 : 1.6}>
          <sphereGeometry args={[planetSize, 16, 16]} />
          <meshBasicMaterial color={color} transparent opacity={hovered || isSelected ? 0.08 : 0.04} side={THREE.BackSide} />
        </mesh>

        {/* Label */}
        {(hovered || isSelected) && (
          <Html center distanceFactor={8} style={{ pointerEvents: 'none' }}>
            <div style={{
              background: 'rgba(4,5,13,0.85)',
              border: `1px solid ${project.color}55`,
              borderRadius: 6,
              padding: '4px 8px',
              color: project.color,
              fontFamily: 'monospace',
              fontSize: 10,
              whiteSpace: 'nowrap',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              transform: 'translateY(-28px)',
            }}>
              {project.index} {project.shortName}
            </div>
          </Html>
        )}
      </Float>
    </group>
  )
}

/* ─── Orbit rings ─────────────────────────────────────────────────── */

function OrbitRings({ count }: { count: number }) {
  const rings = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const r = 3.5 + i * 1.45
      const pts: THREE.Vector3[] = []
      for (let j = 0; j <= 128; j++) {
        const a = (j / 128) * Math.PI * 2
        pts.push(new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r))
      }
      return new THREE.BufferGeometry().setFromPoints(pts)
    })
  }, [count])

  return (
    <group>
      {rings.map((geo, i) => {
        const lineObj = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.06 }))
        return <primitive key={i} object={lineObj} />
      })}
    </group>
  )
}

/* ─── Central star ────────────────────────────────────────────────── */

function CentralStar() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.15
  })
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.55, 32, 32]} />
      <meshStandardMaterial color="#ffffff" emissive="#8B5CF6" emissiveIntensity={3} />
    </mesh>
  )
}

/* ─── Auto-rotate camera ──────────────────────────────────────────── */

function OrbitalCamera({ paused }: { paused: boolean }) {
  const { camera } = useThree()
  useFrame(({ clock }) => {
    if (paused) return
    const t = clock.getElapsedTime() * 0.04
    camera.position.x = Math.sin(t) * 16
    camera.position.z = Math.cos(t) * 16
    camera.position.y = 5 + Math.sin(t * 0.5) * 2
    camera.lookAt(0, 0, 0)
  })
  return null
}

/* ─── 3D Scene ────────────────────────────────────────────────────── */

interface UniverseSceneProps {
  selected: string | null
  onSelect: (id: string) => void
}

function UniverseScene({ selected, onSelect }: UniverseSceneProps) {
  return (
    <Canvas camera={{ position: [0, 5, 16], fov: 55 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
      <color attach="background" args={['#04050D']} />
      <fog attach="fog" args={['#04050D', 18, 38]} />
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, 0]} color="#8B5CF6" intensity={6} distance={25} />
      <pointLight position={[10, 5, 10]} color="#22D3EE" intensity={2} distance={30} />
      <Stars radius={60} depth={40} count={3000} factor={2} saturation={0} fade speed={0.3} />
      <CentralStar />
      <OrbitRings count={projects.length} />
      {projects.map((p, i) => (
        <Planet key={p.id} project={p} index={i} total={projects.length} selected={selected} onSelect={onSelect} />
      ))}
      <OrbitalCamera paused={selected !== null} />
      <AdaptiveDpr pixelated />
    </Canvas>
  )
}

const UniverseSceneDynamic = dynamic(() => Promise.resolve(UniverseScene), { ssr: false })

/* ─── Project detail panel ────────────────────────────────────────── */

function ProjectPanel({ project, onClose }: { project: Project; onClose: () => void }) {
  const Icon = project.icon
  return (
    <motion.div
      key={project.id}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.35 }}
      className="glass-strong absolute right-4 top-4 bottom-4 z-20 flex w-[min(340px,calc(100vw-2rem))] flex-col rounded-2xl p-6 sm:right-6"
      style={{ borderColor: `${project.color}33` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${project.color}22`, border: `1px solid ${project.color}44` }}>
            <Icon size={20} style={{ color: project.color }} />
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-dim">{project.index} · {project.category}</p>
            <p className="mt-0.5 font-display text-sm font-semibold text-ink leading-tight">{project.shortName}</p>
          </div>
        </div>
        <button onClick={onClose} className="rounded-lg p-1.5 text-ink-dim hover:text-ink transition-colors" aria-label="Close">
          <X size={16} />
        </button>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-ink-muted">{project.description}</p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.stack.map(s => (
          <span key={s} className="rounded-full px-2.5 py-1 text-[11px] font-mono" style={{ background: `${project.color}18`, color: project.color, border: `1px solid ${project.color}30` }}>
            {s}
          </span>
        ))}
      </div>

      <div className="mt-auto pt-6">
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium transition-opacity hover:opacity-80"
          style={{ background: `${project.color}22`, color: project.color, border: `1px solid ${project.color}44` }}
        >
          <ExternalLink size={14} />
          Visit Live App
        </a>
      </div>
    </motion.div>
  )
}

/* ─── Section ─────────────────────────────────────────────────────── */

export function Universe() {
  const [selected, setSelected] = useState<string | null>(null)
  const selectedProject = projects.find(p => p.id === selected) ?? null

  const handleSelect = useCallback((id: string) => {
    setSelected(prev => prev === id ? null : id)
  }, [])

  return (
    <section id="universe" className="relative border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6 pt-20 sm:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <SectionEyebrow>Portfolio · Orbital System</SectionEyebrow>
          <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl md:text-5xl">
            3D Engineering <span className="text-gradient">Universe</span>
          </h2>
          <p className="mt-3 max-w-xl text-ink-muted">
            Eleven live applications, each orbiting as a planet. Click any world to explore its stack and open the live app.
          </p>
        </motion.div>
      </div>

      <div className="relative mt-6 h-[70vh] min-h-[480px]">
        <UniverseSceneDynamic selected={selected} onSelect={handleSelect} />
        <AnimatePresence>
          {selectedProject && <ProjectPanel project={selectedProject} onClose={() => setSelected(null)} />}
        </AnimatePresence>
        {!selected && (
          <p className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.25em] text-ink-dim animate-pulse">
            Click a planet to explore
          </p>
        )}
      </div>

      {/* Project grid below canvas */}
      <div className="mx-auto max-w-7xl px-6 pb-24 sm:px-8">
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {projects.map(p => {
            const Icon = p.icon
            return (
              <button
                key={p.id}
                onClick={() => handleSelect(p.id)}
                data-cursor="hover"
                className={cn(
                  'glass group flex flex-col gap-2 rounded-xl p-3 text-left transition-all',
                  selected === p.id ? 'border-opacity-50' : 'hover:border-white/20'
                )}
                style={selected === p.id ? { borderColor: `${p.color}55`, background: `${p.color}0A` } : {}}
              >
                <Icon size={16} style={{ color: p.color }} />
                <span className="text-[11px] leading-tight text-ink-muted group-hover:text-ink transition-colors">{p.shortName}</span>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
