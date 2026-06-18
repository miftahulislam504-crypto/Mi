export type PlanetType =
  | "saturn"
  | "hexagonal"
  | "crystal"
  | "golden"
  | "gas-giant"
  | "rocky"
  | "moon-system";

export type UniverseId = "core" | "community" | "commerce" | "business";

export interface PlanetData {
  id: string;
  name: string;
  type: PlanetType;
  color: string;
  glowColor: string;
  orbitRadius: number;
  orbitSpeed: number;
  size: number;
  description: string;
  features: string[];
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  videoUrl?: string;
  universeId: UniverseId;
}

export interface UniverseData {
  id: UniverseId;
  name: string;
  color: string;
  glowColor: string;
  position: [number, number, number];
  description: string;
  planets: PlanetData[];
}

export const UNIVERSES: UniverseData[] = [
  {
    id: "core",
    name: "CivilOS Core",
    color: "#4a9eff",
    glowColor: "#4a9eff88",
    position: [-22, 0, 0],
    description: "The engineering backbone of the CivilOS ecosystem",
    planets: [
      {
        id: "architectural-drawing",
        name: "Architectural Drawing",
        type: "saturn",
        color: "#7ec8e3",
        glowColor: "#7ec8e344",
        orbitRadius: 8,
        orbitSpeed: 0.15,
        size: 1.2,
        description:
          "AutoCAD-style floor plan drawing tool with touch-safe tools for Android. Built with SVG renderer, dimension lines, and BNBC zone-based room templates.",
        features: [
          "AutoCAD-style wall/door/window tools",
          "CAD SVG renderer with dimension lines",
          "Zone-based room templates per BNBC",
          "Touch-safe drawing for Android",
          "Export to DXF/PDF",
        ],
        techStack: ["Next.js", "TypeScript", "SVG", "BNBC 2020", "Firebase"],
        githubUrl: "https://github.com",
        liveUrl: "https://civilos-design.vercel.app",
        universeId: "core",
      },
      {
        id: "structural-design",
        name: "Structural Design",
        type: "hexagonal",
        color: "#5b8dd9",
        glowColor: "#5b8dd944",
        orbitRadius: 14,
        orbitSpeed: 0.1,
        size: 1.4,
        description:
          "BNBC 2020-compliant structural analysis platform with Direct Stiffness Method, Modal Analysis, and isometric 3D visualization.",
        features: [
          "Direct Stiffness Method engine",
          "Full Modal Analysis with eigenvalue solver",
          "SRSS/CQC seismic combination",
          "Story drift checks per BNBC 2020",
          "Isometric 3D visualization",
          "ETABS-style drag-to-rotate",
        ],
        techStack: [
          "Next.js",
          "TypeScript",
          "Three.js",
          "BNBC 2020",
          "ACI 318-19",
        ],
        githubUrl: "https://github.com",
        liveUrl: "https://civilos-structural.vercel.app",
        universeId: "core",
      },
      {
        id: "boq",
        name: "BOQ",
        type: "crystal",
        color: "#a8d8ea",
        glowColor: "#a8d8ea44",
        orbitRadius: 20,
        orbitSpeed: 0.08,
        size: 1.0,
        description:
          "Bill of Quantities system with detailed member schedule per BNBC 2020. Covers C1–C5 columns, B1–B5 beams with per-member concrete grades.",
        features: [
          "Member schedule system (C1–C5, B1–B5)",
          "Per-member concrete grade selection",
          "Volumetric calculation engine",
          "BNBC 2020 compliant",
          "Export to Excel/PDF",
        ],
        techStack: ["React", "TypeScript", "Firebase", "BNBC 2020"],
        githubUrl: "https://github.com",
        universeId: "core",
      },
      {
        id: "cost-estimation",
        name: "Cost Estimation",
        type: "golden",
        color: "#ffd700",
        glowColor: "#ffd70044",
        orbitRadius: 26,
        orbitSpeed: 0.06,
        size: 1.3,
        description:
          "Construction cost estimating and costing system for Bangladesh market with live material price integration.",
        features: [
          "Material price database (BD market)",
          "Labor cost calculation",
          "Overhead & profit markup",
          "S-curve cost projection",
          "Multi-project comparison",
        ],
        techStack: ["Next.js", "TypeScript", "Firebase", "Plotly.js"],
        githubUrl: "https://github.com",
        universeId: "core",
      },
      {
        id: "project-management",
        name: "Project Management",
        type: "gas-giant",
        color: "#4a9eff",
        glowColor: "#4a9eff44",
        orbitRadius: 32,
        orbitSpeed: 0.05,
        size: 1.6,
        description:
          "Full-featured civil engineering PM platform with WBS, Gantt, Kanban, procurement, EVM, and approval workflows.",
        features: [
          "WBS & Gantt scheduling (Frappe Gantt)",
          "Kanban board (dnd-kit)",
          "Procurement & cost tracking",
          "Earned Value Management",
          "S-curve with Plotly.js",
          "QA/QC & approval workflows",
          "PDF/Excel exports",
        ],
        techStack: [
          "React",
          "Vite",
          "TypeScript",
          "Firebase",
          "Frappe Gantt",
          "Plotly.js",
        ],
        githubUrl: "https://github.com",
        liveUrl: "https://enginex-projectmgmt.vercel.app",
        universeId: "core",
      },
      {
        id: "analysis",
        name: "Analysis",
        type: "rocky",
        color: "#e74c3c",
        glowColor: "#e74c3c44",
        orbitRadius: 38,
        orbitSpeed: 0.04,
        size: 1.1,
        description:
          "Structural analysis engine with advanced load combination, response spectrum, and code-compliant design checks.",
        features: [
          "Load combination generator",
          "Response spectrum analysis",
          "Code-compliant design checks",
          "Member force diagrams",
          "Foundation reaction output",
        ],
        techStack: ["TypeScript", "Next.js", "BNBC 2020", "ACI 318-19"],
        universeId: "core",
      },
      {
        id: "documentation",
        name: "Documentation",
        type: "moon-system",
        color: "#bdc3c7",
        glowColor: "#bdc3c744",
        orbitRadius: 44,
        orbitSpeed: 0.03,
        size: 0.9,
        description:
          "Report generation and export system for structural drawings, BOQ reports, and project documentation.",
        features: [
          "Phase G drawing generation",
          "Beam layout drawings",
          "Stair section drawings",
          "Grade beam plans",
          "Title block system",
          "PDF export with Playwright",
        ],
        techStack: ["Next.js", "TypeScript", "Playwright", "PDF", "Firebase"],
        universeId: "core",
      },
    ],
  },
  {
    id: "community",
    name: "Community",
    color: "#00ff88",
    glowColor: "#00ff8844",
    position: [-7, 10, 0],
    description: "Apps built for community welfare and Islamic foundations",
    planets: [
      {
        id: "ek-ummah",
        name: "Ek Ummah Foundation",
        type: "crystal",
        color: "#00ff88",
        glowColor: "#00ff8844",
        orbitRadius: 8,
        orbitSpeed: 0.12,
        size: 1.3,
        description:
          "Bengali-language Islamic nonprofit management platform for members, loans, donations, savings, and expenses with Firebase backend.",
        features: [
          "Member management system",
          "Loan & savings tracking",
          "Donation management",
          "Role-based access (member/admin)",
          "PWA + APK support",
          "Bengali UI with Bengali date",
          "Referral & admin approval",
        ],
        techStack: ["HTML", "JavaScript", "Firebase", "PWABuilder"],
        githubUrl: "https://github.com",
        universeId: "community",
      },
    ],
  },
  {
    id: "commerce",
    name: "Commerce",
    color: "#ff6b35",
    glowColor: "#ff6b3544",
    position: [7, 10, 0],
    description: "E-commerce and marketplace platforms",
    planets: [
      {
        id: "brotherfit",
        name: "BrotherFit",
        type: "golden",
        color: "#ff6b35",
        glowColor: "#ff6b3544",
        orbitRadius: 7,
        orbitSpeed: 0.14,
        size: 1.2,
        description:
          "Fashion e-commerce site with Firebase/Firestore backend, product catalog, and mobile-first design.",
        features: [
          "Product catalog with Firestore",
          "Mobile-first design",
          "Cart & checkout flow",
          "Admin dashboard",
          "Real-time inventory",
        ],
        techStack: ["Next.js", "TypeScript", "Firebase", "Firestore", "Tailwind"],
        githubUrl: "https://github.com",
        universeId: "commerce",
      },
      {
        id: "build-enginex",
        name: "Build EngineX",
        type: "rocky",
        color: "#e67e22",
        glowColor: "#e67e2244",
        orbitRadius: 13,
        orbitSpeed: 0.09,
        size: 1.1,
        description:
          "Construction materials marketplace for Bangladesh with browser-based Firebase setup and GitHub code editor.",
        features: [
          "Construction materials catalog",
          "Supplier management",
          "Browser-based Firebase setup tool",
          "Self-contained GitHub code editor",
          "Bangladesh market focused",
        ],
        techStack: ["Next.js", "TypeScript", "Firebase", "Vercel", "Tailwind"],
        githubUrl: "https://github.com",
        liveUrl: "https://build-enginex.vercel.app",
        universeId: "commerce",
      },
    ],
  },
  {
    id: "business",
    name: "Business",
    color: "#9b59ff",
    glowColor: "#9b59ff44",
    position: [22, 0, 0],
    description: "Business tools and productivity applications",
    planets: [
      {
        id: "game-changers",
        name: "Game Changers",
        type: "hexagonal",
        color: "#9b59ff",
        glowColor: "#9b59ff44",
        orbitRadius: 8,
        orbitSpeed: 0.11,
        size: 1.0,
        description:
          "Call Bridge scoring app with dark neon aesthetic, player avatar capture, and mobile scoreboard.",
        features: [
          "Call Bridge scoring system",
          "Player avatar photo capture",
          "Phased call/win-loss workflow",
          "Mobile scoreboard layout",
          "Dark neon aesthetic",
        ],
        techStack: ["HTML", "CSS", "JavaScript", "Spck Editor"],
        githubUrl: "https://github.com",
        universeId: "business",
      },
    ],
  },
];

export const CONSTELLATION_SKILLS = [
  {
    id: "react",
    name: "React",
    color: "#61dafb",
    stars: [
      [0, 2, -50],
      [1.5, 3, -50],
      [3, 2, -50],
      [1.5, 0.5, -50],
    ] as [number, number, number][],
  },
  {
    id: "nextjs",
    name: "Next.js",
    color: "#ffffff",
    stars: [
      [-5, 1, -48],
      [-3.5, 3, -48],
      [-2, 1, -48],
      [-3.5, -0.5, -48],
    ] as [number, number, number][],
  },
  {
    id: "typescript",
    name: "TypeScript",
    color: "#3178c6",
    stars: [
      [5, 3, -52],
      [7, 3, -52],
      [6, 1.5, -52],
      [5, 0, -52],
      [7, 0, -52],
    ] as [number, number, number][],
  },
  {
    id: "firebase",
    name: "Firebase",
    color: "#ffca28",
    stars: [
      [-8, -1, -49],
      [-7, 1, -49],
      [-6, -1, -49],
      [-7, -2.5, -49],
    ] as [number, number, number][],
  },
  {
    id: "threejs",
    name: "Three.js",
    color: "#ffffff",
    stars: [
      [10, 0, -51],
      [11.5, 2, -51],
      [13, 0, -51],
      [11.5, -2, -51],
      [11.5, 0, -51],
    ] as [number, number, number][],
  },
];

export const TIMELINE_MILESTONES = [
  {
    year: 2019,
    title: "The Beginning",
    description: "Started civil engineering journey",
    type: "star" as const,
    position: [-30, -5, -20] as [number, number, number],
  },
  {
    year: 2021,
    title: "First Web App",
    description: "Built first web application for engineering calculations",
    type: "star" as const,
    position: [-15, -8, -18] as [number, number, number],
  },
  {
    year: 2022,
    title: "Firebase Mastery",
    description: "Launched Ek Ummah Foundation app with full Firebase backend",
    type: "pulsar" as const,
    position: [0, -6, -22] as [number, number, number],
  },
  {
    year: 2023,
    title: "CivilOS Born",
    description: "Started building the CivilOS ecosystem",
    type: "pulsar" as const,
    position: [12, -4, -19] as [number, number, number],
  },
  {
    year: 2024,
    title: "Structural Engine",
    description: "Completed BNBC 2020-compliant structural analysis platform",
    type: "supernova" as const,
    position: [22, -7, -21] as [number, number, number],
  },
  {
    year: 2025,
    title: "Full Ecosystem",
    description: "CivilOS PM, Design, Structural all live",
    type: "supernova" as const,
    position: [32, -5, -20] as [number, number, number],
  },
  {
    year: 2026,
    title: "Galaxy Launch",
    description: "CivilOS Galaxy — the interactive digital universe",
    type: "supernova" as const,
    position: [42, -3, -18] as [number, number, number],
  },
];
