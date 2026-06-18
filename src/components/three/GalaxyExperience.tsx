'use client'

/**
 * GalaxyExperience — Phase 2 persistent canvas.
 *
 * Single R3F <Canvas> that replaces the separate Hero + Universe canvases.
 * Three view-states drive what is rendered and where the camera sits:
 *
 *   'galaxy'      → Black hole + ambient debris + 4 glowing universe clusters
 *   universeId    → Zooms into a cluster; shows that universe's planets in orbit
 *   planetId      → Zooms onto a planet; ProjectPanel slides in
 *
 * Camera transitions: gsap.to() on a target ref that useFrame lerps toward
 * each frame — this keeps the R3F render loop in charge while GSAP owns the
 * timeline. No scroll required; the section below the canvas keeps a normal
 * scroll-accessible grid for SEO / no-JS fallback.
 */

import {
  useRef,
  useState,
  useMemo,
  useCallback,
  useEffect,
} from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Stars, Float, Html, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, ChevronRight } from 'lucide-react'

import { BlackHole } from './BlackHole'
import { ParticleField } from './ParticleField'
import { FloatingObjects } from './FloatingObjects'
import { CameraRig } from './CameraRig'
import {
  universes,
  projects,
  getUniverseProjects,
  type Universe,
  type Project,
} from '@/lib/data'
import { lerp, cn } from '@/lib/utils'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { usePointerTracker } from '@/hooks/usePointerTracker'

/* ─── Types ─────────────────────────────────────────────────────────── */

type ViewState =
  | { kind: 'galaxy' }
  | { kind: 'universe'; id: string }
  | { kind: 'planet'; universeId: string; planetId: string }

/* ─── Camera target tracker ─────────────────────────────────────────── */

/**
 * A module-level mutable that holds the GSAP-animated camera target.
 * useFrame reads this every tick and lerps the actual camera toward it —
 * giving smooth camera fly-throughs without janky React re-renders.
 */
const camTarget = {
  px: 0, py: 5, pz: 16,   // position
  lx: 0, ly: 0, lz: 0,    // lookAt
  fov: 55,
}

/** Call from React (non-R3F) to trigger a camera fly. */
function flyCamera(
  pos: [number, number, number],
  look: [number, number, number] = [0, 0, 0],
  fov = 55,
  duration = 1.4,
) {
  gsap.to(camTarget, {
    px: pos[0], py: pos[1], pz: pos[2],
    lx: look[0], ly: look[1], lz: look[2],
    fov,
    duration,
    ease: 'power2.inOut',
  })
}

/* ─── Smooth camera driver (R3F) ────────────────────────────────────── */

function CameraDriver({ active }: { active: boolean }) {
  const { camera } = useThree() as { camera: THREE.PerspectiveCamera }
  const lookAt = useRef(new THREE.Vector3())

  useFrame(() => {
    if (!active) return
    camera.position.x = lerp(camera.position.x, camTarget.px, 0.07)
    camera.position.y = lerp(camera.position.y, camTarget.py, 0.07)
    camera.position.z = lerp(camera.position.z, camTarget.pz, 0.07)
    lookAt.current.x = lerp(lookAt.current.x, camTarget.lx, 0.07)
    lookAt.current.y = lerp(lookAt.current.y, camTarget.ly, 0.07)
    lookAt.current.z = lerp(lookAt.current.z, camTarget.lz, 0.07)
    camera.lookAt(lookAt.current)
    camera.fov = lerp(camera.fov, camTarget.fov, 0.07)
    camera.updateProjectionMatrix()
  })

  return null
}

/* ─── Universe cluster ──────────────────────────────────────────────── */

interface UniverseClusterProps {
  universe: Universe
  viewState: ViewState
  onEnter: (id: string) => void
}

function UniverseCluster({ universe, viewState, onEnter }: UniverseClusterProps) {
  const [hovered, setHovered] = useState(false)
  const pulseRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const color = useMemo(() => new THREE.Color(universe.color), [universe.color])

  const isActive = viewState.kind !== 'galaxy' &&
    ('id' in viewState ? viewState.id === universe.id :
     'universeId' in viewState ? viewState.universeId === universe.id : false)

  const dimmed = viewState.kind !== 'galaxy' && !isActive

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (pulseRef.current) {
      const s = 1 + Math.sin(t * 1.4) * 0.08
      pulseRef.current.scale.setScalar(s)
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.3
    }
  })

  return (
    <group
      position={universe.position}
      onClick={() => !dimmed && onEnter(universe.id)}
      onPointerOver={() => !dimmed && setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Core glow sphere */}
      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.55, 24, 24]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered || isActive ? 4 : 2}
          transparent
          opacity={dimmed ? 0.15 : 0.9}
        />
      </mesh>

      {/* Outer atmosphere */}
      <mesh scale={2.8}>
        <sphereGeometry args={[0.55, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={dimmed ? 0.02 : hovered || isActive ? 0.12 : 0.05}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Spinning ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[0.85, 0.025, 8, 48]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={dimmed ? 0.05 : hovered || isActive ? 0.7 : 0.25}
        />
      </mesh>

      {/* Satellite dots */}
      {[0, 1, 2].map((i) => {
        const angle = (i / 3) * Math.PI * 2
        return (
          <SatelliteDot
            key={i}
            color={universe.color}
            angle={angle}
            radius={1.6}
            dimmed={dimmed}
          />
        )
      })}

      {/* HTML label */}
      {(hovered || isActive) && !dimmed && (
        <Html center distanceFactor={10} style={{ pointerEvents: 'none' }}>
          <div
            style={{
              background: 'rgba(4,5,13,0.9)',
              border: `1px solid ${universe.color}55`,
              borderRadius: 8,
              padding: '6px 12px',
              color: universe.color,
              fontFamily: 'monospace',
              fontSize: 10,
              whiteSpace: 'nowrap',
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
              transform: 'translateY(-38px)',
            }}
          >
            {universe.label}
          </div>
        </Html>
      )}

      {/* Point light */}
      <pointLight
        color={universe.color}
        intensity={dimmed ? 0.5 : hovered ? 6 : 3}
        distance={12}
      />
    </group>
  )
}

function SatelliteDot({
  color, angle, radius, dimmed,
}: { color: string; angle: number; radius: number; dimmed: boolean }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime() * 0.6 + angle
    ref.current.position.x = Math.cos(t) * radius
    ref.current.position.z = Math.sin(t) * radius
  })
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.07, 8, 8]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={3}
        transparent
        opacity={dimmed ? 0.1 : 0.9}
      />
    </mesh>
  )
}

/* ─── Connection filaments galaxy → cluster ─────────────────────────── */

function Filaments({ visible }: { visible: boolean }) {
  const lines = useMemo(() => {
    return universes.map((u) => {
      const pts = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(...u.position)]
      return new THREE.BufferGeometry().setFromPoints(pts)
    })
  }, [])

  return (
    <group>
      {lines.map((geo, i) => (
        <primitive
          key={i}
          object={new THREE.Line(
            geo,
            new THREE.LineBasicMaterial({
              color: universes[i].color,
              transparent: true,
              opacity: visible ? 0.12 : 0,
            })
          )}
        />
      ))}
    </group>
  )
}

/* ─── Planet (inside a universe) ────────────────────────────────────── */

const GEOM_TYPES = [
  'sphere', 'icosahedron', 'octahedron', 'dodecahedron',
  'sphere', 'icosahedron', 'octahedron',
] as const

function PlanetGeom({ type, r }: { type: typeof GEOM_TYPES[number]; r: number }) {
  switch (type) {
    case 'icosahedron': return <icosahedronGeometry args={[r, 1]} />
    case 'octahedron':  return <octahedronGeometry  args={[r, 0]} />
    case 'dodecahedron':return <dodecahedronGeometry args={[r, 0]} />
    default:            return <sphereGeometry       args={[r, 32, 32]} />
  }
}

interface PlanetProps {
  project: Project
  index: number
  total: number
  universeCenter: [number, number, number]
  viewState: ViewState
  onSelect: (universeId: string, planetId: string) => void
  universeId: string
}

function Planet({
  project, index, total, universeCenter, viewState, onSelect, universeId,
}: PlanetProps) {
  const orbitRef  = useRef<THREE.Group>(null)
  const meshRef   = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  const orbitR   = 3.2 + index * 1.3
  const speed    = 0.055 / (1 + index * 0.18)
  const size     = 0.26 + (index % 3) * 0.06
  const phase    = (index / total) * Math.PI * 2

  const color    = useMemo(() => new THREE.Color(project.color), [project.color])
  const glow     = useMemo(() => new THREE.Color(project.color).multiplyScalar(0.4), [project.color])

  const isSelected = viewState.kind === 'planet' && viewState.planetId === project.id
  const dimmed = viewState.kind === 'planet' && !isSelected

  useFrame(({ clock }) => {
    if (!orbitRef.current) return
    const t = clock.getElapsedTime() * speed + phase
    orbitRef.current.position.x = universeCenter[0] + Math.cos(t) * orbitR
    orbitRef.current.position.z = universeCenter[2] + Math.sin(t) * orbitR
    orbitRef.current.position.y = universeCenter[1]
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.006
      meshRef.current.rotation.x += 0.003
    }
  })

  return (
    <group ref={orbitRef}>
      <Float speed={1.2} rotationIntensity={0} floatIntensity={0.3}>
        <mesh
          ref={meshRef}
          onClick={(e) => { e.stopPropagation(); onSelect(universeId, project.id) }}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          scale={isSelected ? 1.6 : hovered ? 1.25 : 1}
        >
          <PlanetGeom type={GEOM_TYPES[index % GEOM_TYPES.length]} r={size} />
          <meshStandardMaterial
            color={color}
            emissive={glow}
            emissiveIntensity={hovered || isSelected ? 2.5 : 1}
            metalness={0.3}
            roughness={0.5}
            wireframe={GEOM_TYPES[index % GEOM_TYPES.length] !== 'sphere'}
            transparent
            opacity={dimmed ? 0.2 : 1}
          />
        </mesh>

        {/* Halo */}
        <mesh scale={isSelected ? 2.4 : 1.7}>
          <sphereGeometry args={[size, 16, 16]} />
          <meshBasicMaterial color={color} transparent opacity={hovered || isSelected ? 0.09 : 0.04} side={THREE.BackSide} />
        </mesh>

        {(hovered || isSelected) && (
          <Html center distanceFactor={8} style={{ pointerEvents: 'none' }}>
            <div style={{
              background: 'rgba(4,5,13,0.88)',
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

/* ─── Orbit rings for a universe ────────────────────────────────────── */

function UniverseOrbitRings({
  center, count,
}: { center: [number, number, number]; count: number }) {
  const rings = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const r = 3.2 + i * 1.3
      const pts: THREE.Vector3[] = []
      for (let j = 0; j <= 128; j++) {
        const a = (j / 128) * Math.PI * 2
        pts.push(new THREE.Vector3(
          center[0] + Math.cos(a) * r,
          center[1],
          center[2] + Math.sin(a) * r
        ))
      }
      return new THREE.BufferGeometry().setFromPoints(pts)
    })
  }, [center, count])

  return (
    <group>
      {rings.map((geo, i) => (
        <primitive
          key={i}
          object={new THREE.Line(
            geo,
            new THREE.LineBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.05 })
          )}
        />
      ))}
    </group>
  )
}

/* ─── 3D scene inner ────────────────────────────────────────────────── */

interface SceneProps {
  viewState: ViewState
  onEnterUniverse: (id: string) => void
  onSelectPlanet: (universeId: string, planetId: string) => void
  isMobile: boolean
  usePointer: boolean
}

function GalaxyScene({
  viewState, onEnterUniverse, onSelectPlanet, isMobile, usePointer,
}: SceneProps) {
  usePointerTracker()

  const activeUniverseId =
    viewState.kind === 'universe' ? viewState.id :
    viewState.kind === 'planet'   ? viewState.universeId : null

  const activeUniverse = activeUniverseId
    ? universes.find((u) => u.id === activeUniverseId)
    : null

  const universePlanets = activeUniverseId
    ? getUniverseProjects(activeUniverseId)
    : []

  const inGalaxy = viewState.kind === 'galaxy'

  return (
    <>
      <color attach="background" args={['#04050D']} />
      <fog attach="fog" args={['#04050D', 20, 55]} />

      <ambientLight intensity={0.25} />
      <pointLight position={[0, 0, 0]} color="#8B5CF6" intensity={5} distance={30} />
      <pointLight position={[6, 4, 6]}   color="#8B5CF6" intensity={3}  distance={20} />
      <pointLight position={[-6, -3, 4]} color="#22D3EE" intensity={2.4} distance={20} />
      <pointLight position={[0, -2, -6]} color="#3B82F6" intensity={1.6} distance={20} />

      <Stars
        radius={80}
        depth={50}
        count={isMobile ? 1500 : 4000}
        factor={2}
        saturation={0}
        fade
        speed={0.3}
      />

      {/* Black hole — always present */}
      <BlackHole />

      {/* Galaxy ambience — shown in galaxy view and fading in universe view */}
      {inGalaxy && <ParticleField count={isMobile ? 800 : 2000} />}
      {inGalaxy && <FloatingObjects />}

      {/* Galaxy → cluster filaments */}
      <Filaments visible={inGalaxy} />

      {/* Universe clusters */}
      {universes.map((u) => (
        <UniverseCluster
          key={u.id}
          universe={u}
          viewState={viewState}
          onEnter={onEnterUniverse}
        />
      ))}

      {/* Planets for the active universe */}
      {activeUniverse && (
        <>
          <UniverseOrbitRings
            center={activeUniverse.position}
            count={universePlanets.length}
          />
          {universePlanets.map((p, i) => (
            <Planet
              key={p.id}
              project={p}
              index={i}
              total={universePlanets.length}
              universeCenter={activeUniverse.position}
              viewState={viewState}
              onSelect={onSelectPlanet}
              universeId={activeUniverse.id}
            />
          ))}
        </>
      )}

      {/* Camera driver */}
      <CameraDriver active={!inGalaxy || !usePointer} />
      {/* Pointer parallax only in galaxy view */}
      {inGalaxy && usePointer && <CameraRig />}

      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
    </>
  )
}

/* ─── Breadcrumb ────────────────────────────────────────────────────── */

interface BreadcrumbProps {
  viewState: ViewState
  onBack: () => void
}

function Breadcrumb({ viewState, onBack }: BreadcrumbProps) {
  if (viewState.kind === 'galaxy') return null

  const universe = universes.find(
    (u) => u.id === ('id' in viewState ? viewState.id : 'universeId' in viewState ? viewState.universeId : '')
  )
  const planet = viewState.kind === 'planet'
    ? projects.find((p) => p.id === viewState.planetId)
    : null

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="absolute top-4 left-4 z-20 flex items-center gap-1.5 rounded-full border border-white/10 bg-void/80 px-3 py-1.5 backdrop-blur-md"
    >
      <button
        onClick={onBack}
        className="font-mono text-[10px] uppercase tracking-[0.2em] text-cosmic-cyan/80 hover:text-cosmic-cyan transition-colors"
      >
        Galaxy
      </button>

      {universe && (
        <>
          <ChevronRight size={10} className="text-ink-dim" />
          <button
            onClick={viewState.kind === 'planet' ? onBack : undefined}
            className="font-mono text-[10px] uppercase tracking-[0.2em] transition-colors"
            style={{ color: universe.color + (viewState.kind === 'planet' ? 'aa' : '') }}
          >
            {universe.label}
          </button>
        </>
      )}

      {planet && (
        <>
          <ChevronRight size={10} className="text-ink-dim" />
          <span
            className="font-mono text-[10px] uppercase tracking-[0.2em]"
            style={{ color: planet.color }}
          >
            {planet.shortName}
          </span>
        </>
      )}
    </motion.div>
  )
}

/* ─── Project panel ─────────────────────────────────────────────────── */

function ProjectPanel({ project, onClose }: { project: Project; onClose: () => void }) {
  const Icon = project.icon
  return (
    <motion.div
      key={project.id}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.35 }}
      className="absolute right-4 top-4 bottom-4 z-20 flex w-[min(340px,calc(100vw-2rem))] flex-col rounded-2xl p-6 sm:right-6"
      style={{
        background: 'rgba(4,5,13,0.9)',
        border: `1px solid ${project.color}33`,
        backdropFilter: 'blur(16px)',
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ background: `${project.color}22`, border: `1px solid ${project.color}44` }}
          >
            <Icon size={20} style={{ color: project.color }} />
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-dim">
              {project.index} · {project.category}
            </p>
            <p className="mt-0.5 font-display text-sm font-semibold text-ink leading-tight">
              {project.shortName}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-ink-dim hover:text-ink transition-colors"
          aria-label="Close"
        >
          <X size={16} />
        </button>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-ink-muted">{project.description}</p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.stack.map((s) => (
          <span
            key={s}
            className="rounded-full px-2.5 py-1 text-[11px] font-mono"
            style={{
              background: `${project.color}18`,
              color: project.color,
              border: `1px solid ${project.color}30`,
            }}
          >
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
          style={{
            background: `${project.color}22`,
            color: project.color,
            border: `1px solid ${project.color}44`,
          }}
        >
          <ExternalLink size={14} />
          Visit Live App
        </a>
      </div>
    </motion.div>
  )
}

/* ─── Camera positions by view state ────────────────────────────────── */

const GALAXY_CAM: [number, number, number] = [0, 5, 16]
const GALAXY_LOOK: [number, number, number] = [0, 0, 0]

function getCameraForUniverse(
  u: Universe,
  isMobile: boolean,
): { pos: [number, number, number]; look: [number, number, number] } {
  const [ux, uy, uz] = u.position
  const dist = isMobile ? 16 : 13
  // pull camera back along the vector from origin → cluster
  const len = Math.sqrt(ux * ux + uy * uy + uz * uz)
  const nx = ux / len; const ny = uy / len; const nz = uz / len
  return {
    pos: [ux + nx * dist, uy + 4, uz + nz * dist],
    look: [ux, uy, uz],
  }
}

/* ─── Main exported component ───────────────────────────────────────── */

export function GalaxyExperience() {
  const [viewState, setViewState] = useState<ViewState>({ kind: 'galaxy' })
  const isMobile = useMediaQuery('(max-width: 768px)')
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  /* Sync camera whenever view state changes */
  useEffect(() => {
    if (viewState.kind === 'galaxy') {
      flyCamera(GALAXY_CAM, GALAXY_LOOK, 55, 1.4)
    } else if (viewState.kind === 'universe') {
      const u = universes.find((u) => u.id === viewState.id)
      if (u) {
        const { pos, look } = getCameraForUniverse(u, isMobile)
        flyCamera(pos, look, isMobile ? 60 : 50, 1.4)
      }
    } else if (viewState.kind === 'planet') {
      const u = universes.find((u) => u.id === viewState.universeId)
      const p = projects.find((p) => p.id === viewState.planetId)
      if (u && p) {
        // keep same universe framing but zoom a touch closer
        const { pos, look } = getCameraForUniverse(u, isMobile)
        flyCamera(
          [pos[0] * 0.88, pos[1] * 0.88, pos[2] * 0.88],
          look,
          isMobile ? 58 : 46,
          1.2,
        )
      }
    }
    // initialise camTarget position to match GALAXY_CAM on first render
  }, [viewState, isMobile])

  // Seed camTarget on mount so CameraDriver doesn't jump
  useEffect(() => {
    camTarget.px = GALAXY_CAM[0]
    camTarget.py = GALAXY_CAM[1]
    camTarget.pz = GALAXY_CAM[2]
  }, [])

  const handleEnterUniverse = useCallback((id: string) => {
    setViewState({ kind: 'universe', id })
  }, [])

  const handleSelectPlanet = useCallback((universeId: string, planetId: string) => {
    setViewState((prev) => {
      // toggle off if already selected
      if (prev.kind === 'planet' && prev.planetId === planetId) {
        return { kind: 'universe', id: universeId }
      }
      return { kind: 'planet', universeId, planetId }
    })
  }, [])

  const handleBack = useCallback(() => {
    setViewState((prev) => {
      if (prev.kind === 'planet') return { kind: 'universe', id: prev.universeId }
      return { kind: 'galaxy' }
    })
  }, [])

  const selectedProject =
    viewState.kind === 'planet'
      ? projects.find((p) => p.id === viewState.planetId) ?? null
      : null

  /* Hint text */
  const hint =
    viewState.kind === 'galaxy'
      ? 'Click a cluster to enter its universe'
      : viewState.kind === 'universe'
      ? 'Click a planet to explore'
      : null

  if (prefersReducedMotion) {
    return <GalaxyFlatFallback viewState={viewState} onEnter={handleEnterUniverse} />
  }

  return (
    <div className="relative h-full w-full">
      {/* 3-D Canvas */}
      <Canvas
        camera={{ position: GALAXY_CAM, fov: 55, near: 0.1, far: 200 }}
        dpr={[1, isMobile ? 1.2 : 1.6]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <GalaxyScene
          viewState={viewState}
          onEnterUniverse={handleEnterUniverse}
          onSelectPlanet={handleSelectPlanet}
          isMobile={isMobile}
          usePointer={!isMobile}
        />
      </Canvas>

      {/* Breadcrumb */}
      <AnimatePresence>
        {viewState.kind !== 'galaxy' && (
          <Breadcrumb viewState={viewState} onBack={handleBack} />
        )}
      </AnimatePresence>

      {/* Project detail panel */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectPanel
            project={selectedProject}
            onClose={() => setViewState({ kind: 'universe', id: viewState.kind === 'planet' ? viewState.universeId : '' })}
          />
        )}
      </AnimatePresence>

      {/* Hint */}
      <AnimatePresence>
        {hint && (
          <motion.p
            key={hint}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.25em] text-ink-dim animate-pulse"
          >
            {hint}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Reduced-motion flat fallback ──────────────────────────────────── */

function GalaxyFlatFallback({
  viewState,
  onEnter,
}: {
  viewState: ViewState
  onEnter: (id: string) => void
}) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 px-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-dim">
        Select a universe
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {universes.map((u) => {
          const Icon = u.icon
          return (
            <button
              key={u.id}
              onClick={() => onEnter(u.id)}
              className="flex flex-col items-center gap-2 rounded-xl border p-4 transition-all hover:scale-105"
              style={{
                borderColor: `${u.color}33`,
                background: `${u.color}11`,
              }}
            >
              <Icon size={20} style={{ color: u.color }} />
              <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: u.color }}>
                {u.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
