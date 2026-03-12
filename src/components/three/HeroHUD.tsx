"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Play, X, Zap } from "lucide-react";

// ─── Project Data ───────────────────────────────────────────
const PROJECTS = [
  { name: "Leanthia Bakery", img: "/kona websites screenshots/mockup-leanthia.png" },
  { name: "GL Metal Works", img: "/kona websites screenshots/mockup-glmetalworks.png" },
  { name: "Velricon", img: "/kona websites screenshots/mockup-velricon.png" },
  { name: "APT", img: "/kona websites screenshots/mockup-apt.png" },
];

// ─── Mini Design System (Brand Identity) ────────────────────
function DesignSystemModule() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 4 }}>
      <div style={{ display: "flex", gap: 4 }}>
        {["#00ff88", "rgba(0,255,136,0.4)", "rgba(255,255,255,0.2)"].map((c, i) => (
          <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />
        ))}
      </div>
      <div 
        style={{ fontFamily: "var(--font-monument), sans-serif", fontSize: 14, color: "white", opacity: 0.8, lineHeight: 1 }}
      >
        Aa
      </div>
    </div>
  );
}

// ─── Mini Oscillator (Immersive Motion) ──────────────────────
function OscillatorModule() {
  return (
    <div style={{ width: "100%", height: 30, marginTop: 4, overflow: "hidden" }}>
      <svg width="100%" height="100%" viewBox="0 0 100 30" preserveAspectRatio="none">
        <motion.path
          d="M0 15 Q 12.5 5, 25 15 T 50 15 T 75 15 T 100 15"
          fill="none"
          stroke="#00ff88"
          strokeWidth="1.5"
          animate={{ d: [
            "M0 15 Q 12.5 5, 25 15 T 50 15 T 75 15 T 100 15",
            "M0 15 Q 12.5 25, 25 15 T 50 15 T 75 15 T 100 15",
            "M0 15 Q 12.5 5, 25 15 T 50 15 T 75 15 T 100 15"
          ]}}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}

// ─── Glass card wrapper ───────────────────────────────────────
function GlassCard({
  children,
  delay = 0,
  visible,
  breatheOffset = 0,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  visible: boolean;
  breatheOffset?: number;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        background: "rgba(255, 255, 255, 0.03)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(0, 255, 136, 0.08)",
        borderRadius: 12,
        padding: "14px 18px",
        opacity: visible ? 1 : 0,
        transform: visible
          ? `translateY(0px)`
          : `translateY(20px)`,
        transition: `opacity 0.8s ease-out ${delay}s, transform 0.8s ease-out ${delay}s`,
        animation: visible
          ? `heroCardBreathe 4s ease-in-out ${breatheOffset}s infinite`
          : "none",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── Live Build Feed (Idea 1) ────────────────────────────────
function LiveBuildFeed({ 
  visible, 
  onHover, 
  onHoverEnd 
}: { 
  visible: boolean, 
  onHover?: (rect: DOMRect) => void, 
  onHoverEnd?: () => void 
}) {
  const [index, setIndex] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % PROJECTS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [visible]);

  const handleMouseEnter = () => {
    if (cardRef.current && onHover) {
      onHover(cardRef.current.getBoundingClientRect());
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onHoverEnd}
      style={{
        flex: 1,
        width: "auto",
        aspectRatio: "16/9",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(20px)",
        transition: `opacity 0.8s ease-out 0.1s, transform 0.8s ease-out 0.1s`,
        pointerEvents: "auto",
        cursor: "pointer",
        position: "relative",
        background: "rgba(255, 255, 255, 0.03)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(0, 255, 136, 0.15)",
        borderRadius: 16,
        overflow: "hidden",
        minHeight: 100,
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, filter: "blur(15px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(15px)" }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          style={{ width: "100%", height: "100%" }}
        >
          <img
            src={PROJECTS[index].img}
            alt={PROJECTS[index].name}
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.8 }}
          />
        </motion.div>
      </AnimatePresence>

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "16px 20px",
          background: "linear-gradient(to top, rgba(0,0,0,0.9), transparent)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <span style={{ 
          fontFamily: "var(--font-geist-mono), monospace", 
          fontSize: 10, 
          color: "#00ff88", 
          letterSpacing: "0.1em", 
          fontWeight: 600,
          textShadow: "0 0 10px rgba(0,255,136,0.5)"
        }}>
          LIVE_FEED // {PROJECTS[index].name.toUpperCase()}
        </span>
      </div>
    </div>
  );
}

// ─── Capability card ──────────────────────────────────────────
function CapabilityCard({
  icon,
  label,
  children,
  delay,
  visible,
  breatheOffset,
  onHover,
  onHoverEnd,
}: {
  icon: React.ReactNode;
  label: string;
  children?: React.ReactNode;
  delay: number;
  visible: boolean;
  breatheOffset: number;
  onHover?: (rect: DOMRect) => void;
  onHoverEnd?: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (cardRef.current && onHover) {
      onHover(cardRef.current.getBoundingClientRect());
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onHoverEnd}
      style={{ position: "relative" }}
    >
      <GlassCard delay={delay} visible={visible} breatheOffset={breatheOffset} style={{ width: 180 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: children ? 8 : 0 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: "rgba(0, 255, 136, 0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#00ff88",
              flexShrink: 0,
            }}
          >
            {icon}
          </div>
          <span
            style={{
              fontFamily: "var(--font-monument), sans-serif",
              fontSize: 9,
              fontWeight: 800,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              color: "rgba(255, 255, 255, 0.7)",
              lineHeight: 1.2,
              whiteSpace: "pre-line"
            }}
          >
            {label}
          </span>
        </div>
        {children}
      </GlassCard>
    </div>
  );
}

// ─── Video card ───────────────────────────────────────────────
function VideoCard({ 
  delay, 
  visible, 
  breatheOffset,
  onHover,
  onHoverEnd,
}: { 
  delay: number; 
  visible: boolean; 
  breatheOffset: number;
  onHover?: (rect: DOMRect) => void;
  onHoverEnd?: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    if (cardRef.current && onHover && !isExpanded) {
      onHover(cardRef.current.getBoundingClientRect());
    }
  };

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    if (isExpanded && videoRef.current) {
      videoRef.current.play().catch(console.error);
    } else if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isExpanded]);

  return (
    <>
      <div
        ref={cardRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={onHoverEnd}
        onClick={toggleExpand}
        style={{ position: "relative", cursor: "pointer", pointerEvents: "auto" }}
      >
        <motion.div layoutId="video-card-container">
          <GlassCard
            delay={delay}
            visible={visible}
            breatheOffset={breatheOffset}
            style={{ padding: 0, overflow: "hidden", width: 180 }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                height: 90,
                background: "#000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <video
                src="/konavers_video.mp4"
                muted
                loop
                playsInline
                autoPlay
                style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.6 }}
              />
              <div
                style={{
                  position: "absolute",
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "rgba(0, 255, 136, 0.12)",
                  border: "1px solid rgba(0, 255, 136, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#00ff88",
                  zIndex: 1,
                }}
              >
                <Play size={12} fill="#00ff88" />
              </div>
            </div>
            <div style={{ padding: "10px 14px" }}>
              <div
                style={{
                  fontFamily: "var(--font-monument), sans-serif",
                  fontSize: 9,
                  fontWeight: 800,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  color: "rgba(255, 255, 255, 0.5)",
                }}
              >
                Latest Build
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Expanded Overlay */}
      <AnimatePresence>
        {isExpanded && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 100,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0,0,0,0.9)",
              backdropFilter: "blur(20px)",
              pointerEvents: "auto",
            }}
            onClick={toggleExpand}
          >
            <motion.div
              layoutId="video-card-container"
              style={{
                width: "min(90vw, 1000px)",
                aspectRatio: "16/9",
                background: "#050505",
                borderRadius: 24,
                border: "1px solid rgba(0, 255, 136, 0.2)",
                overflow: "hidden",
                position: "relative",
                boxShadow: "0 0 50px rgba(0, 255, 136, 0.1)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <video
                ref={videoRef}
                src="/konavers_video.mp4"
                controls
                playsInline
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
              <button
                onClick={toggleExpand}
                style={{
                  position: "absolute",
                  top: 24,
                  right: 24,
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  zIndex: 10,
                }}
              >
                <X size={20} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Stat Counter Component ──────────────────────────────────
function StatCounter({ target, suffix = "", delay = 0, visible }: { target: number, suffix?: string, delay: number, visible: boolean }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const end = target;
    const duration = 2000;
    const startTime = performance.now();

    const timer = setTimeout(() => {
      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOutExpo = 1 - Math.pow(2, -10 * progress);
        
        setCount(Math.floor(easeOutExpo * end));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [visible, target, delay]);

  return <span>{count}{suffix}</span>;
}

// ─── Main HUD export ─────────────────────────────────────────
export default function HeroHUD({ 
  visible,
  onHoverCard,
}: { 
  visible: boolean;
  onHoverCard?: (id: string | null, rect?: DOMRect) => void;
}) {
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: "15%",
          bottom: 32,
          left: 40,
          right: 40,
          zIndex: 5,
          display: "flex",
          justifyContent: "space-between",
          pointerEvents: "none",
        }}
      >
        {/* Left Column: Context Paragraph (Top) and Headline + Stats (Bottom) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            maxWidth: 600,
            height: "100%",
          }}
        >
          {/* Top Left Context Paragraph */}
          <div
            style={{
              maxWidth: 280,
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(-20px)",
              transition: `opacity 0.8s ease-out 0.8s, transform 0.8s ease-out 0.8s`,
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-geist-mono), monospace",
                fontSize: 12,
                lineHeight: 1.6,
                color: "#00ff88",
                opacity: 0.6,
                margin: 0,
                textAlign: "left",
              }}
            >
              We build high-performance digital ecosystems for visionary brands and high-growth ventures that demand more than just a website.
            </p>
          </div>

          {/* Bottom Left: Tagline + Stats Container */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(16px)",
                transition: "opacity 0.8s ease-out 0.2s, transform 0.8s ease-out 0.2s",
              }}
            >
              <h1
                style={{
                  fontFamily: "var(--font-monument), sans-serif",
                  fontSize: "clamp(24px, 4vw, 48px)",
                  fontWeight: 800,
                  lineHeight: 1.1,
                  color: "white",
                  letterSpacing: "0.01em",
                  margin: 0,
                  textTransform: "uppercase",
                }}
              >
                <span style={{ display: "block", whiteSpace: "nowrap" }}>We architect</span>
                <span style={{ color: "#00ff88", display: "block", whiteSpace: "nowrap" }}>digital experiences.</span>
              </h1>
            </div>

            {/* Entrance Stats */}
            <div 
              style={{ 
                display: "flex", 
                gap: 40,
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(10px)",
                transition: "opacity 0.8s ease-out 0.4s, transform 0.8s ease-out 0.4s",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ 
                  fontFamily: "var(--font-geist-mono), monospace", 
                  fontSize: 20, 
                  fontWeight: 700, 
                  color: "#00ff88",
                  lineHeight: 1
                }}>
                  <StatCounter target={15} suffix="+" delay={0.6} visible={visible} />
                </span>
                <span style={{ 
                  fontFamily: "var(--font-geist-mono), monospace", 
                  fontSize: 9, 
                  color: "white", 
                  opacity: 0.4, 
                  textTransform: "uppercase",
                  letterSpacing: "0.1em"
                }}>
                  Projects Completed
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ 
                  fontFamily: "var(--font-geist-mono), monospace", 
                  fontSize: 20, 
                  fontWeight: 700, 
                  color: "white",
                  lineHeight: 1
                }}>
                  <StatCounter target={99} suffix="%" delay={0.8} visible={visible} />
                </span>
                <span style={{ 
                  fontFamily: "var(--font-geist-mono), monospace", 
                  fontSize: 9, 
                  color: "white", 
                  opacity: 0.4, 
                  textTransform: "uppercase",
                  letterSpacing: "0.1em"
                }}>
                  Client Satisfaction
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Unified Card Stack */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            alignItems: "flex-end",
            height: "100%",
            width: "auto",
          }}
        >
          <LiveBuildFeed 
            visible={visible} 
            onHover={(rect) => onHoverCard?.("build-feed", rect)}
            onHoverEnd={() => onHoverCard?.(null)}
          />

          <CapabilityCard
            icon={<Palette size={14} />}
            label={"Brand\nIdentity"}
            delay={0.2}
            visible={visible}
            breatheOffset={0}
            onHover={(rect) => onHoverCard?.("brand", rect)}
            onHoverEnd={() => onHoverCard?.(null)}
          >
            <DesignSystemModule />
          </CapabilityCard>

          <CapabilityCard
            icon={<Zap size={14} />}
            label={"Immersive\nMotion"}
            delay={0.4}
            visible={visible}
            breatheOffset={1.0}
            onHover={(rect) => onHoverCard?.("motion", rect)}
            onHoverEnd={() => onHoverCard?.(null)}
          >
            <OscillatorModule />
          </CapabilityCard>

          <VideoCard 
            delay={0.6} 
            visible={visible} 
            breatheOffset={1.5} 
            onHover={(rect) => onHoverCard?.("video", rect)}
            onHoverEnd={() => onHoverCard?.(null)}
          />
        </div>
      </div>

      <style>{`
        @keyframes heroCardBreathe {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        .heroTerminalBlink {
          animation: heroBlink 1s step-end infinite;
        }
        @keyframes heroBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </>
  );
}
