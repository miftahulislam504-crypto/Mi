import type { LucideIcon } from 'lucide-react'
import {
  Boxes,
  Calculator,
  KanbanSquare,
  FileBarChart,
  Network,
  HeartHandshake,
  GraduationCap,
  ShoppingCart,
  Briefcase,
  Users2,
  Compass,
  Layers,
  Sparkles,
  MessageSquare,
} from 'lucide-react'

export const profile = {
  name: 'Miftahul Islam',
  fullName: 'MD. Miftahul Islam',
  initials: 'MI',
  roles: ['Civil Engineer', 'Full-Stack Developer', 'CivilOS Founder', 'Structural Systems Architect'],
  headline: 'Building the Future of Engineering Through Software',
  subheadline: 'Creator of the CivilOS Ecosystem — transforming construction workflows in Bangladesh.',
  location: 'Ullapara, Sirajganj, Rajshahi, Bangladesh',
  coordinates: '24.4264° N, 89.5447° E',
  email: 'miftahulislam504@gmail.com',
  phone: '+880 1872 839294',
  github: 'https://github.com/miftahulislam504-crypto',
  githubHandle: '@miftahulislam504-crypto',
  bio: [
    "I'm a Civil Engineering student who believes software can transform Bangladesh's construction industry. Working from Sirajganj with a mobile phone and Spck Editor, I build enterprise-grade web applications that solve real problems in construction workflows.",
    'My primary focus is the CivilOS (EnginEx) ecosystem — interconnected tools covering architectural drawing, structural analysis, cost estimation and project management, all sharing a Firebase Firestore backend and built to BNBC 2020 standards.',
    "Beyond engineering software, I'm committed to Islamic community welfare through the Ek Ummah Foundation, providing interest-free Qard al-Hasana mutual aid, and I'm building a physical construction materials showroom alongside the Build EnginEx e-commerce platform.",
    'On the engineering side I work in AutoCAD, ETABS, SAFE and CSI Detail; on the software side, a full modern web stack centered on Next.js, TypeScript and Firebase.',
  ],
  stats: [
    { value: 11, label: 'Live Projects', suffix: '+', isYear: false },
    { value: 6, label: 'CivilOS Apps', suffix: '', isYear: false },
    { value: 1, label: 'Shared Firebase Core', suffix: '', isYear: false },
    { value: 2026, label: 'Graduating', suffix: '', isYear: true },
  ],
}

export interface Project {
  id: string
  index: string
  name: string
  shortName: string
  description: string
  url: string
  stack: string[]
  color: string
  category: 'CivilOS Core' | 'Community' | 'Commerce' | 'Business'
  icon: LucideIcon
}

export const projects: Project[] = [
  {
    id: 'archdrawing',
    index: '01',
    name: 'EnginEx — Architectural Drawing',
    shortName: 'Architectural Drawing',
    description:
      'Full 2D CAD tool with BIM objects, a structural grid, a 13-category BNBC 2020 compliance checker, BOQ extraction and PDF/SVG export.',
    url: 'https://enginex-archdrawing.vercel.app',
    stack: ['React', 'Fabric.js', 'TypeScript', 'BNBC 2020'],
    color: '#22D3EE',
    category: 'CivilOS Core',
    icon: Compass,
  },
  {
    id: 'structural',
    index: '02',
    name: 'EnginEx — Structural Analysis',
    shortName: 'Structural Analysis',
    description:
      'Full structural analysis pipeline — Preliminary, Modeling, Analysis, Code Check, Design, BBS, Drawing and Export — built to BNBC 2020.',
    url: 'https://enginex-structural.vercel.app',
    stack: ['JavaScript', 'Firebase', 'BNBC 2020'],
    color: '#8B5CF6',
    category: 'CivilOS Core',
    icon: Layers,
  },
  {
    id: 'estimate',
    index: '03',
    name: 'EnginEx — Estimating & Costing',
    shortName: 'Estimating & Costing',
    description:
      'BOQ generation with automatic data sync from the Architectural Drawing app, plus cost estimation against Bangladesh construction rates and PDF reports.',
    url: 'https://enginex-estimate.vercel.app',
    stack: ['Next.js', 'Firebase', 'BOQ Engine'],
    color: '#3B82F6',
    category: 'CivilOS Core',
    icon: Calculator,
  },
  {
    id: 'projectmgmt',
    index: '04',
    name: 'EnginEx — Project Management',
    shortName: 'Project Management',
    description:
      'Construction project scheduling, resource management and real-time progress tracking, wired directly into the CivilOS Firestore core.',
    url: 'https://enginex-projectmgmt.vercel.app',
    stack: ['Next.js', 'Firebase', 'Real-time'],
    color: '#A855F7',
    category: 'CivilOS Core',
    icon: KanbanSquare,
  },
  {
    id: 'reports',
    index: '05',
    name: 'EnginEx — Reports & Export',
    shortName: 'Reports & Export',
    description:
      'A 9-page professional report engine that aggregates data from the Structural, Architectural and BOQ apps into comprehensive project PDFs.',
    url: 'https://enginex-reports.vercel.app',
    stack: ['Next.js', 'Firebase', 'PDF Engine'],
    color: '#38BDF8',
    category: 'CivilOS Core',
    icon: FileBarChart,
  },
  {
    id: 'hub',
    index: '06',
    name: 'EnginEx — Hub',
    shortName: 'Hub',
    description:
      'The central hub and single source of truth for the CivilOS ecosystem — project routing, authentication and cross-app data sync.',
    url: 'https://enginex-hub.vercel.app',
    stack: ['Next.js', 'Firebase', 'TypeScript'],
    color: '#6366F1',
    category: 'CivilOS Core',
    icon: Network,
  },
  {
    id: 'learning',
    index: '07',
    name: 'EnginEx — Learning',
    shortName: 'Learning',
    description:
      'A Bengali-language civil engineering learning platform — concept cards, MCQ practice and BNBC 2020 references for Bangladeshi engineers.',
    url: 'https://enginex-learning.vercel.app',
    stack: ['Firebase', 'Bengali', 'BNBC 2020'],
    color: '#2DD4BF',
    category: 'CivilOS Core',
    icon: GraduationCap,
  },
  {
    id: 'ekummah',
    index: '08',
    name: 'Ek Ummah Foundation',
    shortName: 'Ek Ummah Foundation',
    description:
      'A Bengali-language Islamic community welfare PWA — interest-free Qard al-Hasana loans, donations and savings, member approvals and analytics.',
    url: 'https://akummahfoundation.vercel.app',
    stack: ['Firebase PWA', 'Bengali', 'Chart.js'],
    color: '#10B981',
    category: 'Community',
    icon: HeartHandshake,
  },
  {
    id: 'buildenginex',
    index: '09',
    name: 'Build EnginEx — Construction Hub',
    shortName: 'Build EnginEx',
    description:
      'A construction-materials e-commerce platform for Bangladesh — product catalog, admin panel, order management, material calculator and local payments.',
    url: 'https://build-enginex.vercel.app',
    stack: ['HTML/CSS/JS', 'bKash', 'Nagad'],
    color: '#F59E0B',
    category: 'Commerce',
    icon: ShoppingCart,
  },
  {
    id: 'businesssuites',
    index: '10',
    name: 'Business Suites',
    shortName: 'Business Suites',
    description:
      'A comprehensive business management suite with tools for streamlined professional workflows and operations.',
    url: 'https://businesssuites.vercel.app',
    stack: ['Next.js', 'Firebase', 'Vercel'],
    color: '#818CF8',
    category: 'Business',
    icon: Briefcase,
  },
  {
    id: 'ummahnet',
    index: '11',
    name: 'UmmahNet',
    shortName: 'UmmahNet',
    description:
      'An Islamic community networking platform connecting members for collaboration, resource sharing and community engagement.',
    url: 'https://ummahnet.vercel.app',
    stack: ['Firebase', 'Bengali', 'Community'],
    color: '#F472B6',
    category: 'Community',
    icon: Users2,
  },
]

export const ecosystemCore = projects.filter((p) => p.category === 'CivilOS Core')

export const ecosystemHighlights = [
  'Shared Firestore backend (civilengineering-platform)',
  'Real-time cross-app synchronization',
  'Unified BNBC 2020 compliance engine',
  'Single authentication layer across all apps',
]

/**
 * "Universes" group projects by category for the 3D Galaxy navigation
 * (Galaxy -> Universe -> Planet). Each universe is a glowing cluster
 * positioned around the galactic core (the Hero black hole); once a
 * visitor enters a universe, its projects render as orbiting planets
 * using the same logic as the current Universe scene, just filtered.
 *
 * `position` is the cluster's place in galaxy-space ([x, y, z], ready
 * to spread straight into an R3F <group position={...}>). These are
 * starting values — tune them once the Galaxy scene's camera framing
 * is dialled in during Phase 2.
 */
export interface Universe {
  id: string
  category: Project['category']
  label: string
  tagline: string
  color: string
  icon: LucideIcon
  position: [number, number, number]
}

export const universes: Universe[] = [
  {
    id: 'civilos-core',
    category: 'CivilOS Core',
    label: 'CivilOS Core',
    tagline: 'Seven apps. One Firestore core. The heart of the ecosystem.',
    color: '#8B5CF6',
    icon: Network,
    position: [13, 2.5, 5],
  },
  {
    id: 'community',
    category: 'Community',
    label: 'Community',
    tagline: 'Interest-free finance and networking for the Ummah.',
    color: '#10B981',
    icon: HeartHandshake,
    position: [-11, -3, 9],
  },
  {
    id: 'commerce',
    category: 'Commerce',
    label: 'Commerce',
    tagline: 'Construction materials, a tap away.',
    color: '#F59E0B',
    icon: ShoppingCart,
    position: [-6, 4, -13],
  },
  {
    id: 'business',
    category: 'Business',
    label: 'Business',
    tagline: 'Streamlined tools for everyday operations.',
    color: '#818CF8',
    icon: Briefcase,
    position: [12, -4, -10],
  },
]

/** All projects belonging to a given universe, by its `id`. */
export function getUniverseProjects(universeId: string): Project[] {
  const universe = universes.find((u) => u.id === universeId)
  if (!universe) return []
  return projects.filter((p) => p.category === universe.category)
}

export const skills = {
  frontend: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Fabric.js'],
  backend: ['Firebase', 'Firestore', 'Cloud Functions', 'Firebase Auth', 'Firebase Hosting', 'Vercel'],
  engineering: ['AutoCAD', 'ETABS', 'SAFE', 'CSI Detail', 'BNBC 2020', 'Structural Analysis'],
}

export interface ExperienceItem {
  period: string
  title: string
  description: string
  tags: string[]
}

export const experience: ExperienceItem[] = [
  {
    period: 'Foundation',
    title: 'Civil Engineering, Sirajganj',
    description:
      'Began a Civil Engineering diploma while teaching myself full-stack web development — building everything from a single Android phone running Termux and Spck Editor.',
    tags: ['AutoCAD', 'HTML/CSS/JS'],
  },
  {
    period: 'V1 → V18',
    title: 'CivilOS — the unified app',
    description:
      'Built CivilOS as a single-file HTML application through eighteen-plus versions: floor plan design, BOQ estimation, structural design, seismic analysis, reporting and construction tracking — all BNBC 2020 compliant.',
    tags: ['Vanilla JS', 'SVG / Canvas', 'BNBC 2020'],
  },
  {
    period: 'Ecosystem Split',
    title: 'CivilOS becomes EnginEx',
    description:
      'Split the monolith into a connected ecosystem of dedicated apps — Architectural Drawing, Estimating, Project Management, Reports and a central Hub — sharing one Firebase Firestore backend.',
    tags: ['React', 'Next.js', 'Firebase'],
  },
  {
    period: 'Community',
    title: 'Ek Ummah Foundation & UmmahNet',
    description:
      'Designed and shipped Bengali-language Islamic community platforms — interest-free Qard al-Hasana loan management, donations, savings and member networking.',
    tags: ['Firebase PWA', 'Bengali UI'],
  },
  {
    period: 'Deep Engineering',
    title: 'Direct Stiffness & Modal Analysis Engines',
    description:
      'Implemented a Direct Stiffness Method analysis engine and a Modal Analysis engine with SRSS/CQC combination and a BNBC 2020 design spectrum for EnginEx Structural.',
    tags: ['DSM Engine', 'Modal Analysis', 'BNBC 2020'],
  },
  {
    period: '2026',
    title: 'Graduating & scaling CivilOS',
    description:
      'Finishing my Civil Engineering degree while taking the full CivilOS ecosystem toward production — eleven live applications and counting.',
    tags: ['CivilOS', 'Production'],
  },
]

export const navLinks = [
  { id: 'universe', label: 'Universe' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'ecosystem', label: 'Ecosystem' },
  { id: 'experience', label: 'Journey' },
  { id: 'contact', label: 'Contact' },
]

export interface SectionChip {
  label: string
  href?: string
}

export interface SectionMeta {
  id: string
  phase: number
  eyebrow: string
  title: string
  accent: string
  description: string
  icon: LucideIcon
  chips: SectionChip[]
}

/**
 * Drives the Phase 1 placeholder sections rendered by <PlaceholderSection />.
 * Each entry is replaced by a full custom section in its listed phase.
 */
export const sections: SectionMeta[] = [
  {
    id: 'universe',
    phase: 2,
    eyebrow: 'Portfolio · Orbital System',
    title: '3D Engineering Universe',
    accent: 'Eleven worlds, one ecosystem.',
    description:
      'Every product I have shipped, rendered as a planet in its own orbit — click through for tech stacks, live links and case notes.',
    icon: Boxes,
    chips: projects.map((p) => ({ label: p.shortName, href: p.url })),
  },
  {
    id: 'about',
    phase: 3,
    eyebrow: 'Profile · Holographic ID',
    title: 'About',
    accent: 'Civil engineer. Systems builder. Sirajganj, Bangladesh.',
    description:
      'A holographic profile card with live stats, a career timeline and an interactive skill visualization is on its way.',
    icon: Sparkles,
    chips: profile.stats.map((s) => ({
      label: `${s.value}${s.suffix} ${s.label}`,
    })),
  },
  {
    id: 'skills',
    phase: 4,
    eyebrow: 'Capabilities · Skills Galaxy',
    title: 'Skills Galaxy',
    accent: 'Frontend, backend and structural engineering — one orbit.',
    description:
      'A rotating galaxy of every technology I build with, grouped by frontend, backend and engineering software.',
    icon: Layers,
    chips: [...skills.frontend, ...skills.backend, ...skills.engineering].map((s) => ({ label: s })),
  },
  {
    id: 'ecosystem',
    phase: 5,
    eyebrow: 'Architecture · CivilOS Core',
    title: 'CivilOS Ecosystem',
    accent: 'One Firestore core. Six connected apps.',
    description:
      'A live map of how Architectural, Structural, Estimating, Project Management, Reports and Hub talk to each other through a shared Firebase backend.',
    icon: Network,
    chips: [
      ...ecosystemCore.map((p) => ({ label: p.shortName, href: p.url })),
      ...ecosystemHighlights.map((h) => ({ label: h })),
    ],
  },
  {
    id: 'experience',
    phase: 6,
    eyebrow: 'Journey · Timeline',
    title: 'Experience',
    accent: 'From a single HTML file to an ecosystem.',
    description:
      'A scroll-driven timeline of how CivilOS grew from a one-file prototype into eleven production applications.',
    icon: Compass,
    chips: experience.map((e) => ({ label: e.title })),
  },
  {
    id: 'contact',
    phase: 6,
    eyebrow: 'Connection · Command Center',
    title: "Let's Build Something",
    accent: 'Open to collaboration on CivilOS, construction tech, or anything in between.',
    description:
      'A live globe and connection console are coming — for now, every channel below is fully open.',
    icon: MessageSquare,
    chips: [
      { label: profile.email, href: `mailto:${profile.email}` },
      { label: profile.githubHandle, href: profile.github },
      { label: profile.phone, href: `tel:${profile.phone.replace(/\s+/g, '')}` },
      { label: profile.location },
    ],
  },
]
