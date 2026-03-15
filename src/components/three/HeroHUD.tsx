"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useTransform, MotionValue } from "framer-motion";
import { Palette, Play, X, Zap } from "lucide-react";

// ─── Project Data ───────────────────────────────────────────
const PROJECTS = [
  { name: "Leanthia Bakery", img: "/kona websites screenshots/mockup-leanthia.png" },
  { name: "GL Metal Works", img: "/kona websites screenshots/mockup-glmetalworks.png" },
  { name: "Velricon", img: "/kona websites screenshots/mockup-velricon.png" },
  { name: "APT", img: "/kona websites screenshots/mockup-apt.png" },
];

// ─── Sub-Modules ────────────────────
function DesignSystemModule() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 4 }}>
      <div style={{ display: "flex", gap: 4 }}>
        {["#00ff88", "rgba(0,255,136,0.4)", "rgba(255,255,255,0.2)"].map((c, i) => (
          <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />
        ))}
      </div>
      <div style={{ fontFamily: "var(--font-monument), sans-serif", fontSize: 14, color: "white", opacity: 0.8, lineHeight: 1 }}>Aa</div>
    </div>
  );
}

function OscillatorModule() {
  return (
    <div style={{ width: "100%", height: 30, marginTop: 4, overflow: "hidden" }}>
      <svg width="100%" height="100%" viewBox="0 0 100 30" preserveAspectRatio="none">
        <motion.path
          d="M0 15 Q 12.5 5, 25 15 T 50 15 T 75 15 T 100 15"
          fill="none" stroke="#00ff88" strokeWidth="1.5"
          animate={{
            d: [
              "M0 15 Q 12.5 5, 25 15 T 50 15 T 75 15 T 100 15",
              "M0 15 Q 12.5 25, 25 15 T 50 15 T 75 15 T 100 15",
              "M0 15 Q 12.5 5, 25 15 T 50 15 T 75 15 T 100 15"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}

// ─── Components ───────────────────────────────────────
function GlassCard({ children, delay, visible, style, p, parallaxFactor = 0 }: any) {
  const y = useTransform(p, [0, 1], [0, -400 * parallaxFactor]);
  const opacity = useTransform(p, [0, 0.5], [1, 0]);
  return (
    <motion.div style={{
      background: "rgba(255, 255, 255, 0.03)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
      border: "1px solid rgba(0, 255, 136, 0.08)", borderRadius: 12, padding: "14px 18px",
      opacity: visible ? opacity : 0, y, ...style
    }}>
      {children}
    </motion.div>
  );
}

function LiveBuildFeed({ visible, p, onHover, onHoverEnd }: any) {
  const [index, setIndex] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => setIndex((prev) => (prev + 1) % PROJECTS.length), 4000);
    return () => clearInterval(interval);
  }, [visible]);

  const y = useTransform(p, [0, 1], [0, -600]);
  const opacity = useTransform(p, [0, 0.4], [1, 0]);

  return (
    <motion.div
      ref={cardRef}
      onMouseEnter={() => p.get() < 0.02 && onHover?.(cardRef.current?.getBoundingClientRect())}
      onMouseLeave={onHoverEnd}
      style={{
        width: 320,
        height: 180, // 16:9 Aspect Ratio
        opacity: visible ? opacity : 0, y,
        pointerEvents: "auto", cursor: "pointer", position: "relative",
        background: "rgba(255, 255, 255, 0.03)", backdropFilter: "blur(12px)", borderRadius: 12, overflow: "hidden",
        border: "1px solid rgba(0, 255, 136, 0.1)",
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div key={index} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }} style={{ width: "100%", height: "100%" }}>
          <img src={PROJECTS[index].img} alt={PROJECTS[index].name} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.8 }} />
        </motion.div>
      </AnimatePresence>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "8px 10px", background: "linear-gradient(to top, rgba(0,0,0,0.9), transparent)" }}>
        <span style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 8, color: "#00ff88", letterSpacing: "0.05em", fontWeight: 600 }}>
          {PROJECTS[index].name.toUpperCase()}
        </span>
      </div>
    </motion.div>
  );
}

function CapabilityCard({ icon, label, children, delay, visible, p, parallaxFactor, onHover, onHoverEnd }: any) {
  const cardRef = useRef<HTMLDivElement>(null);
  return (
    <div ref={cardRef} onMouseEnter={() => p.get() < 0.02 && onHover?.(cardRef.current?.getBoundingClientRect())} onMouseLeave={onHoverEnd}>
      <GlassCard delay={delay} visible={visible} style={{ width: 180 }} p={p} parallaxFactor={parallaxFactor}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: children ? 8 : 0 }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, background: "rgba(0, 255, 136, 0.06)", display: "flex", alignItems: "center", justifyContent: "center", color: "#00ff88" }}>{icon}</div>
          <span style={{ fontFamily: "var(--font-monument), sans-serif", fontSize: 9, fontWeight: 800, textTransform: "uppercase", color: "rgba(255, 255, 255, 0.7)", whiteSpace: "pre-line" }}>{label}</span>
        </div>
        {children}
      </GlassCard>
    </div>
  );
}

function VideoCard({ visible, p, onHover, onHoverEnd }: any) {
  const [isExpanded, setIsExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  // FLIP: capture card rect at click time
  const originRect = useRef<DOMRect | null>(null);

  const y = useTransform(p, [0, 1], [0, -400]);
  const opacity = useTransform(p, [0, 0.4], [1, 0]);
  const uiOpacity = useTransform(p, [0, 0.2], [1, 0]);

  const handleExpand = () => {
    if (cardRef.current) originRect.current = cardRef.current.getBoundingClientRect();
    setIsExpanded(true);
  };

  const handleCollapse = () => {
    setIsExpanded(false);
  };

  useEffect(() => {
    if (isExpanded && videoRef.current) videoRef.current.play().catch(console.error);
    else if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0; }
  }, [isExpanded]);

  // Calculate FLIP transform: from card position to centered overlay
  const getFlipTransform = () => {
    if (!originRect.current) return {};
    const rect = originRect.current;
    // Target: centered, min(90vw, 1000px) wide, 16:9
    const targetW = Math.min(window.innerWidth * 0.9, 1000);
    const targetH = targetW * (9 / 16);
    const targetX = (window.innerWidth - targetW) / 2;
    const targetY = (window.innerHeight - targetH) / 2;
    // Delta from target position back to card origin
    const dx = rect.left - targetX;
    const dy = rect.top - targetY;
    const sx = rect.width / targetW;
    const sy = rect.height / targetH;
    return { dx, dy, sx, sy };
  };

  return (
    <>
      <motion.div
        ref={cardRef}
        onMouseEnter={() => p.get() < 0.02 && onHover?.(cardRef.current?.getBoundingClientRect())}
        onMouseLeave={onHoverEnd}
        onClick={handleExpand}
        style={{
          position: "relative", cursor: "pointer", pointerEvents: "auto",
          y, opacity: visible ? opacity : 0, zIndex: 20,
          alignSelf: "flex-end",
          willChange: "transform",
        }}
      >
        <div style={{
          background: "rgba(255, 255, 255, 0.03)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
          border: `1px solid rgba(0, 255, 136, 0.1)`, borderRadius: 12, padding: 0, overflow: "hidden",
          width: 320, height: 180,
        }}>
          <div style={{ position: "relative", width: "100%", height: "100%", background: "#000" }}>
            <video src="/konavers_video.mp4" muted loop playsInline autoPlay style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <motion.div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: uiOpacity }}>
              <Play size={16} fill="#00ff88" color="#00ff88" />
            </motion.div>
            <motion.div style={{ position: "absolute", bottom: 12, left: 14, opacity: uiOpacity }}>
              <div style={{ fontFamily: "var(--font-monument), sans-serif", fontSize: 9, fontWeight: 800, color: "rgba(255, 255, 255, 0.5)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Latest Build</div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isExpanded && (() => {
          const flip = getFlipTransform();
          return (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                onClick={handleCollapse}
                style={{
                  position: "fixed", inset: 0, zIndex: 100,
                  background: "rgba(0,0,0,0.92)", backdropFilter: "blur(20px)",
                  pointerEvents: "auto",
                }}
              />
              {/* FLIP Video — animates from card origin to centered overlay */}
              <motion.div
                initial={{
                  x: flip.dx, y: flip.dy,
                  scaleX: flip.sx, scaleY: flip.sy,
                  borderRadius: 12,
                }}
                animate={{
                  x: 0, y: 0,
                  scaleX: 1, scaleY: 1,
                  borderRadius: 24,
                }}
                exit={{
                  x: flip.dx, y: flip.dy,
                  scaleX: flip.sx, scaleY: flip.sy,
                  borderRadius: 12,
                  opacity: 0,
                }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  position: "fixed", zIndex: 101,
                  top: (window.innerHeight - Math.min(window.innerWidth * 0.9, 1000) * (9 / 16)) / 2,
                  left: (window.innerWidth - Math.min(window.innerWidth * 0.9, 1000)) / 2,
                  width: Math.min(window.innerWidth * 0.9, 1000),
                  aspectRatio: "16/9",
                  background: "#000", overflow: "hidden",
                  transformOrigin: "top left",
                  willChange: "transform",
                  pointerEvents: "auto",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <video ref={videoRef} src="/konavers_video.mp4" controls playsInline style={{ width: "100%", height: "100%" }} />
                {/* Close button fades in after morph */}
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                  onClick={handleCollapse}
                  style={{ position: "absolute", top: 24, right: 24, color: "white", cursor: "pointer", background: "none", border: "none" }}
                >
                  <X />
                </motion.button>
              </motion.div>
            </>
          );
        })()}
      </AnimatePresence>
    </>
  );
}

function StatCounter({ target, suffix = "", delay = 0, visible }: { target: number, suffix?: string, delay: number, visible: boolean }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!visible) return;
    const duration = 2000;
    const startTime = performance.now();
    const timer = setTimeout(() => {
      const animate = (now: number) => {
        const progress = Math.min((now - startTime) / duration, 1);
        setCount(Math.floor((1 - Math.pow(2, -10 * progress)) * target));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }, delay * 1000);
    return () => clearTimeout(timer);
  }, [visible, target, delay]);
  return <span>{count}{suffix}</span>;
}

// ─── Main HUD ─────────────────────────────────────────
export default function HeroHUD({ visible, onHoverCard, scrollProgress }: any) {
  const p = useTransform(scrollProgress, [0, 0.5], [0, 1]);
  const contentY = useTransform(p, [0, 1], [0, -200]);
  const contentOpacity = useTransform(p, [0, 0.4], [1, 0]);

  return (
    <div style={{ position: "absolute", top: "15%", bottom: 32, left: 40, right: 40, zIndex: 5, display: "flex", justifyContent: "space-between", pointerEvents: "none" }}>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", maxWidth: 600, height: "100%" }}>
        <motion.div style={{ maxWidth: 280, opacity: visible ? contentOpacity : 0, y: contentY, textAlign: "left" }}>
          <p style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 12, lineHeight: 1.6, color: "#00ff88", opacity: 0.6, margin: 0 }}>
            We build high-performance digital ecosystems for visionary brands and high-growth ventures that demand more than just a website.
          </p>
        </motion.div>

        <motion.div style={{ display: "flex", flexDirection: "column", gap: 24, y: useTransform(p, [0, 1], [0, -150]), opacity: visible ? contentOpacity : 0 }}>
          <h1 style={{ fontFamily: "var(--font-monument), sans-serif", fontSize: "clamp(24px, 4vw, 48px)", fontWeight: 800, lineHeight: 1.1, color: "white", textTransform: "uppercase" }}>
            We architect <br /><span style={{ color: "#00ff88" }}>digital experiences.</span>
          </h1>

          <div style={{ display: "flex", gap: 40 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 20, fontWeight: 700, color: "#00ff88", lineHeight: 1 }}><StatCounter target={15} suffix="+" delay={0.6} visible={visible} /></span>
              <span style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 9, color: "white", opacity: 0.4, textTransform: "uppercase", letterSpacing: "0.1em" }}>Projects Completed</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 20, fontWeight: 700, color: "white", lineHeight: 1 }}><StatCounter target={99} suffix="%" delay={0.8} visible={visible} /></span>
              <span style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 9, color: "white", opacity: 0.4, textTransform: "uppercase", letterSpacing: "0.1em" }}>Client Satisfaction</span>
            </div>
          </div>
        </motion.div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-end", height: "100%", width: "auto" }}>
        <LiveBuildFeed visible={visible} p={p} onHover={(rect: any) => onHoverCard?.("build-feed", rect)} onHoverEnd={() => onHoverCard?.(null)} />
        <CapabilityCard icon={<Palette size={14} />} label={"Brand\nIdentity"} visible={visible} p={p} parallaxFactor={0.8} delay={0.2} onHover={(rect: any) => onHoverCard?.("brand", rect)} onHoverEnd={() => onHoverCard?.(null)}>
          <DesignSystemModule />
        </CapabilityCard>
        <CapabilityCard icon={<Zap size={14} />} label={"Immersive\nMotion"} visible={visible} p={p} parallaxFactor={0.4} delay={0.4} onHover={(rect: any) => onHoverCard?.("motion", rect)} onHoverEnd={() => onHoverCard?.(null)}>
          <OscillatorModule />
        </CapabilityCard>
        <VideoCard visible={visible} p={p} onHover={(rect: any) => onHoverCard?.("video", rect)} onHoverEnd={() => onHoverCard?.(null)} />
      </div>
    </div>
  );
}
