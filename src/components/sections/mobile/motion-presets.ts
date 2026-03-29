import type { Variants } from "framer-motion";

// ── Shared animation presets for all mobile homepage sections ──

export const BRAND_EASE = [0.16, 1, 0.3, 1] as const;

export const sectionReveal: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

export const itemReveal: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: BRAND_EASE },
  },
};

export const itemRevealFast: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: BRAND_EASE },
  },
};

export const viewportConfig = { once: true, margin: "-80px" as const };

// ── Section label style (reusable inline style object) ──
export const sectionLabelStyle: React.CSSProperties = {
  fontFamily: "var(--font-geist-mono), monospace",
  fontSize: 10,
  fontWeight: 500,
  letterSpacing: "0.35em",
  textTransform: "uppercase",
  color: "#00ff88",
  marginBottom: 14,
  display: "flex",
  alignItems: "center",
  gap: 10,
};

// ── Section heading style ──
export const sectionHeadingStyle: React.CSSProperties = {
  fontFamily: "var(--font-monument), sans-serif",
  fontSize: "clamp(30px, 8vw, 48px)",
  fontWeight: 800,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.95)",
  lineHeight: 1.05,
};

// ── Accent rule ──
export const accentRuleStyle: React.CSSProperties = {
  width: "clamp(80px, 24vw, 160px)",
  height: 1,
  background: "#00ff88",
  boxShadow: "0 0 12px rgba(0,255,136,0.3)",
  marginBottom: 14,
  marginTop: 14,
};
