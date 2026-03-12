"use client";

import { useEffect, useRef, useState } from "react";
import { Code2, TrendingUp, Palette, Play } from "lucide-react";

// ─── Animated counter ─────────────────────────────────────────
function CountUp({
  target,
  prefix = "",
  suffix = "",
  duration = 2000,
  start,
}: {
  target: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  start: boolean;
}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;
    const startTime = performance.now();
    let rafId: number;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [start, target, duration]);

  return (
    <span>
      {prefix}
      {value.toLocaleString()}
      {suffix}
    </span>
  );
}

// ─── Self-drawing mini chart ──────────────────────────────────
function MiniChart({ start }: { start: boolean }) {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!start || !pathRef.current) return;
    const path = pathRef.current;
    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;

    // Trigger draw
    requestAnimationFrame(() => {
      path.style.transition = "stroke-dashoffset 2s cubic-bezier(0.16, 1, 0.3, 1)";
      path.style.strokeDashoffset = "0";
    });
  }, [start]);

  return (
    <svg width="80" height="32" viewBox="0 0 80 32" fill="none">
      <path
        ref={pathRef}
        d="M2 28 L12 24 L22 26 L32 18 L42 20 L52 12 L62 8 L72 4 L78 2"
        stroke="#00ff88"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        style={{ strokeDasharray: 200, strokeDashoffset: 200 }}
      />
      {/* Glow version */}
      <path
        d="M2 28 L12 24 L22 26 L32 18 L42 20 L52 12 L62 8 L72 4 L78 2"
        stroke="#00ff88"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity={0.15}
        style={{
          filter: "blur(4px)",
          strokeDasharray: 200,
          strokeDashoffset: start ? 0 : 200,
          transition: "stroke-dashoffset 2s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />
    </svg>
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

// ─── Capability card ──────────────────────────────────────────
function CapabilityCard({
  icon,
  label,
  children,
  delay,
  visible,
  breatheOffset,
}: {
  icon: React.ReactNode;
  label: string;
  children?: React.ReactNode;
  delay: number;
  visible: boolean;
  breatheOffset: number;
}) {
  return (
    <GlassCard delay={delay} visible={visible} breatheOffset={breatheOffset}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: children ? 10 : 0 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
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
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(255, 255, 255, 0.7)",
          }}
        >
          {label}
        </span>
      </div>
      {children}
    </GlassCard>
  );
}

// ─── Video card placeholder ───────────────────────────────────
function VideoCard({ delay, visible, breatheOffset }: { delay: number; visible: boolean; breatheOffset: number }) {
  return (
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
          height: 100,
          background: "linear-gradient(135deg, rgba(0,255,136,0.04) 0%, rgba(0,0,0,0.4) 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Fake UI lines to suggest a website preview */}
        <div style={{ position: "absolute", top: 10, left: 12, right: 12 }}>
          <div style={{ width: "40%", height: 3, background: "rgba(255,255,255,0.08)", borderRadius: 2, marginBottom: 6 }} />
          <div style={{ width: "70%", height: 2, background: "rgba(255,255,255,0.04)", borderRadius: 2, marginBottom: 4 }} />
          <div style={{ width: "55%", height: 2, background: "rgba(255,255,255,0.04)", borderRadius: 2 }} />
        </div>
        <div
          style={{
            width: 36,
            height: 36,
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
          <Play size={14} fill="#00ff88" />
        </div>
      </div>
      <div style={{ padding: "10px 14px" }}>
        <div
          style={{
            fontFamily: "var(--font-monument), sans-serif",
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(255, 255, 255, 0.5)",
          }}
        >
          Latest Build
        </div>
      </div>
    </GlassCard>
  );
}

// ─── Main HUD export ─────────────────────────────────────────
export default function HeroHUD({ visible }: { visible: boolean }) {
  // Delay counter start slightly after cards appear
  const [countersStarted, setCountersStarted] = useState(false);

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => setCountersStarted(true), 600);
    return () => clearTimeout(timer);
  }, [visible]);

  return (
    <>
      {/* ── Bottom bar: all supporting elements anchored to bottom ── */}
      <div
        style={{
          position: "absolute",
          bottom: 32,
          left: 40,
          right: 40,
          zIndex: 5,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
        }}
      >
        {/* Left group: Tagline + Stats */}
        <div style={{ maxWidth: 360 }}>
          {/* Tagline */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.8s ease-out 0.2s, transform 0.8s ease-out 0.2s",
              marginBottom: 20,
            }}
          >
            <h1
              style={{
                fontFamily: "var(--font-monument), sans-serif",
                fontSize: 18,
                fontWeight: 800,
                lineHeight: 1.4,
                color: "white",
                letterSpacing: "0.01em",
                margin: 0,
              }}
            >
              We architect
              <br />
              <span style={{ color: "#00ff88" }}>digital empires.</span>
            </h1>
            <p
              style={{
                fontFamily: "var(--font-geist-sans), sans-serif",
                fontSize: 13,
                lineHeight: 1.6,
                color: "rgba(255, 255, 255, 0.4)",
                margin: "10px 0 0 0",
              }}
            >
              Websites, apps & growth systems that turn visitors into revenue.
            </p>
          </div>

          {/* Stats row */}
          <div
            style={{
              display: "flex",
              gap: 16,
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.8s ease-out 0.5s, transform 0.8s ease-out 0.5s",
            }}
          >
            <GlassCard delay={0.6} visible={visible} breatheOffset={0}>
              <div
                style={{
                  fontFamily: "var(--font-monument), sans-serif",
                  fontSize: 20,
                  fontWeight: 800,
                  color: "white",
                  lineHeight: 1,
                }}
              >
                <CountUp target={127} suffix="+" start={countersStarted} />
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: "rgba(255, 255, 255, 0.35)",
                  marginTop: 4,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  fontWeight: 500,
                }}
              >
                Builds Deployed
              </div>
            </GlassCard>

            <GlassCard delay={0.8} visible={visible} breatheOffset={1}>
              <div
                style={{
                  fontFamily: "var(--font-monument), sans-serif",
                  fontSize: 20,
                  fontWeight: 800,
                  color: "white",
                  lineHeight: 1,
                }}
              >
                €<CountUp target={2400000} prefix="" suffix="" start={countersStarted} duration={2500} />
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: "rgba(255, 255, 255, 0.35)",
                  marginTop: 4,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  fontWeight: 500,
                }}
              >
                Revenue Generated
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Right group: Capability cards */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            alignItems: "flex-end",
          }}
        >
        <CapabilityCard
          icon={<Code2 size={16} />}
          label="Web Apps"
          delay={0.3}
          visible={visible}
          breatheOffset={0}
        >
          {/* Mini terminal snippet */}
          <div
            style={{
              fontFamily: "var(--font-geist-mono), monospace",
              fontSize: 10,
              color: "rgba(0, 255, 136, 0.5)",
              lineHeight: 1.6,
              padding: "6px 8px",
              background: "rgba(0, 0, 0, 0.3)",
              borderRadius: 6,
            }}
          >
            <span style={{ color: "rgba(255,255,255,0.25)" }}>{'>'}</span> deploying
            <span style={{ color: "#00ff88" }}> production</span>
            <span className="heroTerminalBlink" style={{ color: "#00ff88" }}>_</span>
          </div>
        </CapabilityCard>

        <CapabilityCard
          icon={<TrendingUp size={16} />}
          label="Growth"
          delay={0.5}
          visible={visible}
          breatheOffset={0.5}
        >
          <MiniChart start={countersStarted} />
        </CapabilityCard>

        <VideoCard delay={0.7} visible={visible} breatheOffset={1} />

        <CapabilityCard
          icon={<Palette size={16} />}
          label="Brand Identity"
          delay={0.9}
          visible={visible}
          breatheOffset={1.5}
        >
          {/* Color palette dots */}
          <div style={{ display: "flex", gap: 6, marginTop: 2 }}>
            {["#00ff88", "#0a0a0a", "#ffffff", "#1a3a2a", "#00cc6a"].map((c) => (
              <div
                key={c}
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: c,
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              />
            ))}
          </div>
        </CapabilityCard>
        </div>
      </div>

      {/* Animations (injected via style tag) */}
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
