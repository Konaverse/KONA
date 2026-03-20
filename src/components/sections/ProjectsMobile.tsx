"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type VideoProject } from "@/data/projects";
import VideoModal from "./VideoModal";

type TabId = "websites" | "videos" | "social";

const TABS: { id: TabId; label: string }[] = [
  { id: "websites", label: "Websites" },
  { id: "videos",   label: "Videos"   },
  { id: "social",   label: "Social"   },
];

export default function ProjectsMobile() {
  const [activeTab, setActiveTab] = useState<TabId>("websites");
  const [activeVideo, setActiveVideo] = useState<VideoProject | null>(null);

  return (
    <div style={{ width: "100%", paddingBottom: 64 }}>

      {/* Section header */}
      <div style={{ padding: "48px 24px 28px" }}>
        <div
          style={{
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: 10,
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "#00ff88",
            marginBottom: 14,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span style={{ opacity: 0.5 }}>◆</span>
          04 — Projects
        </div>

        <div
          style={{
            width: "clamp(100px, 28vw, 180px)",
            height: 1,
            background: "#00ff88",
            boxShadow: "0 0 12px rgba(0,255,136,0.3)",
            marginBottom: 14,
          }}
        />

        <div
          style={{
            fontFamily: "var(--font-monument), sans-serif",
            fontSize: "clamp(30px, 8vw, 48px)",
            fontWeight: 800,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.95)",
            lineHeight: 1,
          }}
        >
          Selected
          <br />
          <span style={{ color: "#00ff88" }}>Work.</span>
        </div>
      </div>

      {/* Tab bar */}
      <div
        style={{
          display: "flex",
          borderTop: "1px solid rgba(0,255,136,0.1)",
          borderBottom: "1px solid rgba(0,255,136,0.1)",
          marginBottom: 32,
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: "13px 8px",
              background: "transparent",
              border: "none",
              borderBottom:
                activeTab === tab.id
                  ? "2px solid #00ff88"
                  : "2px solid transparent",
              cursor: "pointer",
              fontFamily: "var(--font-geist-mono), monospace",
              fontSize: 10,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color:
                activeTab === tab.id
                  ? "#00ff88"
                  : "rgba(255,255,255,0.3)",
              transition: "color 0.18s, border-color 0.18s",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content — empty, awaiting new design */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          style={{ padding: "0 24px" }}
        />
      </AnimatePresence>

      <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
    </div>
  );
}
