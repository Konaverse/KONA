"use client";

import { useRef, useState } from "react";
import {
  motion,
  useTransform,
  useMotionValueEvent,
  AnimatePresence,
  type MotionValue,
} from "framer-motion";
import Link from "next/link";

import { ACT_1_START, ACT_2_START } from "./projects-timing";

// ── Projects data (labels only — 3D is in ProjectScenes) ────────────────────
const PROJECTS = [
  {
    name: "GL Metal Works LTD",
    url: "https://www.glmetalworks.com",
  },
  {
    name: "Los Santos Barbershop",
    url: "https://www.lossantosbarbers.com/",
  },
  {
    name: "Velricon",
    url: "https://www.velricon.com",
  },
  {
    name: "APT Metal Construction",
    url: "https://www.aptmetalconstruction.com/",
  },
  {
    name: "TDK Design & Build",
    url: "https://www.tdkdb.com",
  },
  {
    name: "S.Ivory Designs Ltd",
    url: "https://www.sivorydesigns.com/",
  },
] as const;

const PANEL_COUNT = 6;

// ── Active panel detection (mirrors ProjectScenes keyframes) ────────────────
const HOLD_FIRST = 0.075;
const HOLD_NORMAL = 0.035;
const HOLD_LAST = 0.040;
const TRANS_DUR = 0.012;

function buildKeyframeInputs() {
  const inputs: number[] = [];
  let p = ACT_1_START;
  for (let i = 0; i < PANEL_COUNT; i++) {
    const hold =
      i === 0 ? HOLD_FIRST : i === PANEL_COUNT - 1 ? HOLD_LAST : HOLD_NORMAL;
    inputs.push(p);
    p += hold;
    inputs.push(p);
    if (i < PANEL_COUNT - 1) p += TRANS_DUR;
  }
  return inputs;
}

const KF_INPUTS = buildKeyframeInputs();

function getActivePanel(p: number): number {
  for (let i = PANEL_COUNT - 1; i > 0; i--) {
    const mid = (KF_INPUTS[i * 2 - 1] + KF_INPUTS[i * 2]) / 2;
    if (p >= mid) return i;
  }
  return 0;
}

// ── Main component (HTML overlay only) ──────────────────────────────────────
interface Act1WebsitesProps {
  progress: MotionValue<number>;
}

export default function Act1Websites({ progress }: Act1WebsitesProps) {
  const [activePanel, setActivePanel] = useState(0);
  const activePanelRef = useRef(0);

  useMotionValueEvent(progress, "change", (p) => {
    const idx = getActivePanel(p);
    if (idx !== activePanelRef.current) {
      activePanelRef.current = idx;
      setActivePanel(idx);
    }
  });

  const actOpacity = useTransform(
    progress,
    [ACT_1_START, ACT_1_START + 0.04, ACT_2_START - 0.03, ACT_2_START],
    [0, 1, 1, 0]
  );

  const project = PROJECTS[activePanel];

  return (
    <motion.div
      style={{
        position: "absolute",
        inset: 0,
        opacity: actOpacity,
        willChange: "opacity",
        pointerEvents: "none",
      }}
    >
      {/* ── Labels — below cylinder ── */}
      <div
        style={{
          position: "absolute",
          bottom: "6vh",
          left: "4vw",
          zIndex: 10,
          pointerEvents: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activePanel}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{ display: "flex", flexDirection: "column", gap: 8 }}
          >
            <div
              style={{
                fontFamily: "var(--font-monument), sans-serif",
                fontSize: "clamp(14px, 1.5vw, 22px)",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "#ffffff",
              }}
            >
              {project.name}
            </div>
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "var(--font-geist-mono), monospace",
                fontSize: "clamp(9px, 0.9vw, 12px)",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#00ff88",
                textDecoration: "none",
                opacity: 0.9,
              }}
            >
              Visit site →
            </a>
          </motion.div>
        </AnimatePresence>

        <Link
          href="/projects/website-projects"
          style={{
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: "clamp(8px, 0.85vw, 11px)",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "rgba(0,255,136,0.7)",
            textDecoration: "none",
            border: "1px solid rgba(0,255,136,0.3)",
            padding: "7px 16px",
            borderRadius: 2,
            whiteSpace: "nowrap",
            alignSelf: "flex-start",
          }}
        >
          View all projects
        </Link>
      </div>
    </motion.div>
  );
}
