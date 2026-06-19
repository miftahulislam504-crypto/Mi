"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { useGalaxyStore } from "@/store/galaxyStore";
import { UNIVERSES, PlanetData } from "@/data/galaxy";

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return mobile;
}

function TechBadge({ name, accent }: { name: string; accent: string }) {
  return (
    <span style={{
      fontFamily: "Space Mono, monospace",
      fontSize: "10px",
      letterSpacing: "0.12em",
      padding: "3px 8px",
      borderRadius: "4px",
      border: `1px solid ${accent}44`,
      color: accent,
      background: `${accent}0a`,
      display: "inline-block",
      marginBottom: "4px",
    }}>
      {name}
    </span>
  );
}

function FeatureItem({ text, accent }: { text: string; accent: string }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "flex-start",
      gap: "8px",
      marginBottom: "8px",
      fontFamily: "Space Mono, monospace",
      fontSize: "11px",
      color: "rgba(232,240,255,0.72)",
      lineHeight: "1.6",
    }}>
      <span style={{ color: accent, marginTop: "2px", flexShrink: 0 }}>▸</span>
      <span>{text}</span>
    </div>
  );
}

function LinkBtn({ href, label, icon, accent }: { href: string; label: string; icon: React.ReactNode; accent: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      style={{
        display: "flex", alignItems: "center", gap: "8px",
        padding: "8px 14px", borderRadius: "8px",
        border: `1px solid ${accent}44`,
        background: `${accent}0a`,
        color: accent,
        fontFamily: "Space Mono, monospace",
        fontSize: "11px", letterSpacing: "0.15em",
        textDecoration: "none", textTransform: "uppercase" as const,
      }}
    >
      {icon}{label}
    </a>
  );
}

function PanelContent({ planet }: { planet: PlanetData }) {
  const universe  = UNIVERSES.find((u) => u.id === planet.universeId);
  const accent    = universe?.color ?? "#4a9eff";

  return (
    <div style={{
      padding: "28px 24px 48px",
      display: "flex",
      flexDirection: "column",
      gap: "22px",
      height: "100%",
      overflowY: "auto",
      scrollbarWidth: "thin",
      scrollbarColor: `${accent}33 transparent`,
    }}>
      {/* Header */}
      <div>
        <div style={{ fontFamily:"Space Mono,monospace", fontSize:"9px", letterSpacing:"0.4em", color:accent, textTransform:"uppercase", marginBottom:"7px", opacity:0.8 }}>
          {universe?.name} · Project
        </div>
        <h2 style={{ fontFamily:"Space Mono,monospace", fontSize:"18px", fontWeight:700, color:"#e8f0ff", lineHeight:1.3, letterSpacing:"0.05em", margin:0 }}>
          {planet.name}
        </h2>
        <div style={{ width:"36px", height:"2px", background:`linear-gradient(90deg,${accent},transparent)`, marginTop:"9px", borderRadius:"2px" }} />
      </div>

      {/* Description */}
      <p style={{ fontFamily:"Space Mono,monospace", fontSize:"11px", color:"rgba(232,240,255,0.65)", lineHeight:1.85, margin:0 }}>
        {planet.description}
      </p>

      {/* Features */}
      <div>
        <div style={{ fontFamily:"Space Mono,monospace", fontSize:"9px", letterSpacing:"0.35em", color:accent, textTransform:"uppercase", marginBottom:"11px" }}>
          Features
        </div>
        {planet.features.map((f, i) => <FeatureItem key={i} text={f} accent={accent} />)}
      </div>

      {/* Tech */}
      <div>
        <div style={{ fontFamily:"Space Mono,monospace", fontSize:"9px", letterSpacing:"0.35em", color:accent, textTransform:"uppercase", marginBottom:"11px" }}>
          Tech Stack
        </div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:"6px" }}>
          {planet.techStack.map((t) => <TechBadge key={t} name={t} accent={accent} />)}
        </div>
      </div>

      <div style={{ height:"1px", background:`linear-gradient(90deg,${accent}33,transparent)` }} />

      {/* Links */}
      <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
        {planet.liveUrl && (
          <LinkBtn href={planet.liveUrl} label="Live App" accent={accent}
            icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>}
          />
        )}
        {planet.githubUrl && (
          <LinkBtn href={planet.githubUrl} label="GitHub" accent="#aaaaaa"
            icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>}
          />
        )}
      </div>
    </div>
  );
}

export default function ProjectPanel() {
  const { isPanelOpen, activePlanetId, setPanelOpen, setPhase, setActivePlanet } = useGalaxyStore();
  const isMobile = useIsMobile();
  const dragControls = useDragControls();

  const planet = UNIVERSES.flatMap((u) => u.planets).find((p) => p.id === activePlanetId);

  const handleClose = useCallback(() => {
    setPanelOpen(false);
    setActivePlanet(null);
    setPhase("universe");
    document.body.style.cursor = "default";
  }, [setPanelOpen, setActivePlanet, setPhase]);

  if (!planet) return null;

  // ── Mobile: bottom sheet ───────────────────────────────────────────────────
  if (isMobile) {
    return (
      <AnimatePresence>
        {isPanelOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={handleClose}
              style={{ position:"fixed", inset:0, zIndex:60, background:"rgba(0,0,15,0.55)", backdropFilter:"blur(3px)", WebkitBackdropFilter:"blur(3px)" }}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type:"spring", stiffness:300, damping:35 }}
              drag="y"
              dragControls={dragControls}
              dragListener={false}
              dragConstraints={{ top: 0 }}
              onDragEnd={(_, info) => { if (info.offset.y > 120) handleClose(); }}
              style={{
                position:"fixed", left:0, right:0, bottom:0, zIndex:70,
                height:"80vh",
                background:"linear-gradient(180deg,rgba(8,8,28,0.98) 0%,rgba(5,5,18,0.98) 100%)",
                borderTop:"1px solid rgba(74,158,255,0.2)",
                borderRadius:"16px 16px 0 0",
                boxShadow:"0 -20px 60px rgba(0,0,30,0.8)",
                overflow:"hidden",
              }}
            >
              {/* Drag handle */}
              <div
                onPointerDown={(e) => dragControls.start(e)}
                style={{ padding:"14px 0 4px", display:"flex", justifyContent:"center", cursor:"grab" }}
              >
                <div style={{ width:"40px", height:"4px", borderRadius:"2px", background:"rgba(232,240,255,0.18)" }} />
              </div>
              {/* Close */}
              <button onClick={handleClose} style={{
                position:"absolute", top:"14px", right:"18px",
                width:"30px", height:"30px", borderRadius:"50%",
                border:"1px solid rgba(232,240,255,0.15)",
                background:"rgba(232,240,255,0.05)",
                color:"rgba(232,240,255,0.5)", cursor:"pointer",
                display:"flex", alignItems:"center", justifyContent:"center",
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
              <div style={{ height:"calc(100% - 36px)", overflowY:"auto" }}>
                <PanelContent planet={planet} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  // ── Desktop: right side panel ──────────────────────────────────────────────
  return (
    <AnimatePresence>
      {isPanelOpen && (
        <>
          <motion.div
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            transition={{ duration:0.4 }}
            onClick={handleClose}
            style={{ position:"fixed", inset:0, zIndex:60, background:"rgba(0,0,15,0.4)", backdropFilter:"blur(2px)", WebkitBackdropFilter:"blur(2px)" }}
          />
          <motion.div
            initial={{ x:"100%", opacity:0 }}
            animate={{ x:0, opacity:1 }}
            exit={{ x:"100%", opacity:0 }}
            transition={{ type:"spring", stiffness:280, damping:32 }}
            style={{
              position:"fixed", top:0, right:0, bottom:0,
              width:"min(420px,92vw)", zIndex:70,
              background:"linear-gradient(135deg,rgba(5,5,20,0.97) 0%,rgba(8,8,28,0.97) 100%)",
              borderLeft:"1px solid rgba(74,158,255,0.14)",
              boxShadow:"-20px 0 60px rgba(0,0,30,0.65)",
              backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)",
              overflow:"hidden",
            }}
          >
            <button onClick={handleClose} style={{
              position:"absolute", top:"18px", right:"18px", zIndex:2,
              width:"32px", height:"32px", borderRadius:"50%",
              border:"1px solid rgba(232,240,255,0.15)",
              background:"rgba(232,240,255,0.05)",
              color:"rgba(232,240,255,0.5)", cursor:"pointer",
              display:"flex", alignItems:"center", justifyContent:"center",
              transition:"all 0.2s",
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
            <PanelContent planet={planet} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
