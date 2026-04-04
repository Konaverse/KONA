"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  WEBSITE_PROJECTS,
  VIDEO_PROJECTS,
  SOCIAL_PROJECTS,
  PROJECT_CATEGORIES,
  type VideoProject,
} from "@/data/projects";
import VideoModal from "./VideoModal";

type TabId = "websites" | "videos" | "social";

const TABS: { id: TabId; label: string }[] = [
  { id: "websites", label: "Websites" },
  { id: "videos", label: "Videos" },
  { id: "social", label: "Social" },
];

const BRAND_EASE = [0.16, 1, 0.3, 1] as const;

// Height of the global nav on mobile (h-16 = 64px)
const NAV_HEIGHT = 64;

// Sort spotlight projects first
const sortedWebsites = [
  ...WEBSITE_PROJECTS.filter((p) => p.spotlight),
  ...WEBSITE_PROJECTS.filter((p) => !p.spotlight),
];

export default function ProjectsMobile() {
  const [activeTab, setActiveTab] = useState<TabId>("websites");
  const [activeVideo, setActiveVideo] = useState<VideoProject | null>(null);

  // ── Fix #2: ref on the NON-sticky outer wrapper.
  // getBoundingClientRect() on a sticky element returns its VISUAL position
  // (always NAV_HEIGHT when stuck), not the layout position we need for scrollTo.
  // The outer wrapper is never sticky, so its rect.top is always the true layout top.
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleTabChange = (tabId: TabId) => {
    if (tabId === activeTab) return;
    // Scroll first (instant) so the section length doesn't change mid-animation.
    if (wrapperRef.current) {
      const wrapperDocTop =
        wrapperRef.current.getBoundingClientRect().top + window.scrollY;
      // wrapperDocTop = sticky header's layout top (wrapper has no padding-top).
      // Scroll to exactly where the sticky header will be at NAV_HEIGHT.
      window.scrollTo({ top: wrapperDocTop - NAV_HEIGHT, behavior: "smooth" });
    }
    setActiveTab(tabId);
  };

  return (
    // Fragment: 48px spacer lives OUTSIDE wrapperRef so wrapperRef.top ===
    // sticky header's layout top. No padding-top arithmetic needed.
    <>
      <div style={{ height: 48, background: "#000" }} />

      <div
        ref={wrapperRef}
        style={{ width: "100%", paddingBottom: 64, background: "#000" }}
      >
        {/* ── STICKY HEADER ──────────────────────────────────────────────
            Fix #1: boxShadow "0 -64px 0 0 #000" creates a solid black
            extension 64px ABOVE the sticky element. When the header is
            stuck at viewport y=64, this shadow covers y=0–64 (the
            transparent global nav zone), hiding any project cards that
            have scrolled up behind the nav — without touching the nav.  */}
        <div
          style={{
            position: "sticky",
            top: NAV_HEIGHT,
            zIndex: 10,
            background: "#000",
            boxShadow: "0 -64px 0 0 #000",
            borderBottom: "1px solid rgba(0,255,136,0.08)",
          }}
        >
          {/* Section header content */}
          <div style={{ padding: "14px 24px 16px" }}>
            {/* Eyebrow */}
            <div
              style={{
                fontFamily: "var(--font-geist-mono), monospace",
                fontSize: 10,
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                color: "#00ff88",
                marginBottom: 12,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span style={{ opacity: 0.5 }}>◆</span>
              04 — Projects
            </div>

            {/* Line */}
            <div
              style={{
                width: "clamp(100px, 28vw, 180px)",
                height: 1,
                background: "#00ff88",
                boxShadow: "0 0 12px rgba(0,255,136,0.3)",
                marginBottom: 12,
              }}
            />

            {/* Title */}
            <div
              style={{
                fontFamily: "var(--font-monument), sans-serif",
                fontSize: "clamp(26px, 7vw, 40px)",
                fontWeight: 800,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.95)",
                lineHeight: 1,
              }}
            >
              Selected{" "}
              <span style={{ color: "#00ff88" }}>Work.</span>
            </div>
          </div>

          {/* Tab bar */}
          <div
            style={{
              display: "flex",
              borderTop: "1px solid rgba(0,255,136,0.1)",
            }}
          >
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
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
        </div>

        {/* ── PROJECTS LIST ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: BRAND_EASE }}
            style={{ padding: "24px 24px 0" }}
          >
            {/* ── WEBSITES ── */}
            {activeTab === "websites" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {sortedWebsites.map((project, i) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{
                      duration: 0.5,
                      ease: BRAND_EASE,
                      delay: i < 3 ? i * 0.08 : 0,
                    }}
                  >
                    <a
                      href={project.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: "none", display: "block" }}
                    >
                      <div
                        style={{
                          borderRadius: 10,
                          overflow: "hidden",
                          border: "1px solid rgba(0,255,136,0.08)",
                          background: "rgba(255,255,255,0.02)",
                        }}
                      >
                        <div style={{ position: "relative", aspectRatio: "16 / 10" }}>
                          <Image
                            src={project.image}
                            alt={project.title}
                            fill
                            sizes="(max-width: 1023px) 100vw, 0px"
                            style={{ objectFit: "cover" }}
                          />
                        </div>

                        <div style={{ padding: "16px 16px 18px" }}>
                          <div
                            style={{
                              fontFamily: "var(--font-monument), sans-serif",
                              fontSize: "clamp(16px, 4.5vw, 22px)",
                              fontWeight: 800,
                              letterSpacing: "0.03em",
                              textTransform: "uppercase",
                              color: "rgba(255,255,255,0.9)",
                              lineHeight: 1.15,
                              marginBottom: 6,
                            }}
                          >
                            {project.title}
                          </div>

                          <div
                            style={{
                              fontFamily: "var(--font-geist-mono), monospace",
                              fontSize: 10,
                              letterSpacing: "0.2em",
                              color: "rgba(255,255,255,0.3)",
                              marginBottom: 10,
                            }}
                          >
                            {project.client} · {project.year}
                          </div>

                          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                            {project.tags.map((tag) => (
                              <span
                                key={tag}
                                style={{
                                  fontFamily: "var(--font-geist-mono), monospace",
                                  fontSize: 9,
                                  letterSpacing: "0.1em",
                                  textTransform: "uppercase",
                                  color: "rgba(0,255,136,0.7)",
                                  padding: "3px 8px",
                                  border: "1px solid rgba(0,255,136,0.12)",
                                  borderRadius: 4,
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </a>
                  </motion.div>
                ))}

                <Link
                  href={PROJECT_CATEGORIES.websites.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    fontFamily: "var(--font-geist-mono), monospace",
                    fontSize: 11,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "#00ff88",
                    textDecoration: "none",
                    padding: "16px 0",
                    marginTop: 8,
                  }}
                >
                  {PROJECT_CATEGORIES.websites.cta}
                  <span style={{ fontSize: 14 }}>→</span>
                </Link>
              </div>
            )}

            {/* ── VIDEOS ── */}
            {activeTab === "videos" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {VIDEO_PROJECTS.map((project, i) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.5, ease: BRAND_EASE, delay: i * 0.08 }}
                  >
                    <button
                      onClick={() => setActiveVideo(project)}
                      style={{
                        background: "none",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                        width: "100%",
                        textAlign: "left",
                      }}
                    >
                      <div
                        style={{
                          borderRadius: 10,
                          overflow: "hidden",
                          border: "1px solid rgba(0,255,136,0.08)",
                          background: "rgba(255,255,255,0.02)",
                        }}
                      >
                        <div style={{ position: "relative", aspectRatio: "16 / 9" }}>
                          <Image
                            src={project.thumbnail}
                            alt={project.title}
                            fill
                            sizes="(max-width: 1023px) 100vw, 0px"
                            style={{ objectFit: "cover" }}
                          />

                          <div
                            style={{
                              position: "absolute",
                              inset: 0,
                              background: "rgba(0,0,0,0.3)",
                            }}
                          />

                          <div
                            style={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              width: 52,
                              height: 52,
                              borderRadius: "50%",
                              background: "rgba(0,255,136,0.15)",
                              border: "2px solid rgba(0,255,136,0.5)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <div
                              style={{
                                width: 0,
                                height: 0,
                                borderStyle: "solid",
                                borderWidth: "8px 0 8px 14px",
                                borderColor:
                                  "transparent transparent transparent #00ff88",
                                marginLeft: 3,
                              }}
                            />
                          </div>

                          <div
                            style={{
                              position: "absolute",
                              bottom: 10,
                              right: 10,
                              fontFamily: "var(--font-geist-mono), monospace",
                              fontSize: 10,
                              letterSpacing: "0.1em",
                              color: "rgba(255,255,255,0.8)",
                              background: "rgba(0,0,0,0.6)",
                              padding: "3px 8px",
                              borderRadius: 4,
                            }}
                          >
                            {project.duration}
                          </div>
                        </div>

                        <div style={{ padding: "14px 16px 16px" }}>
                          <div
                            style={{
                              fontFamily: "var(--font-monument), sans-serif",
                              fontSize: "clamp(16px, 4.5vw, 22px)",
                              fontWeight: 800,
                              letterSpacing: "0.03em",
                              textTransform: "uppercase",
                              color: "rgba(255,255,255,0.9)",
                              lineHeight: 1.15,
                              marginBottom: 6,
                            }}
                          >
                            {project.title}
                          </div>

                          <div
                            style={{
                              fontFamily: "var(--font-geist-mono), monospace",
                              fontSize: 10,
                              letterSpacing: "0.2em",
                              color: "rgba(255,255,255,0.3)",
                              marginBottom: 10,
                            }}
                          >
                            {project.client} · {project.year}
                          </div>

                          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                            {project.tags.map((tag) => (
                              <span
                                key={tag}
                                style={{
                                  fontFamily: "var(--font-geist-mono), monospace",
                                  fontSize: 9,
                                  letterSpacing: "0.1em",
                                  textTransform: "uppercase",
                                  color: "rgba(0,255,136,0.7)",
                                  padding: "3px 8px",
                                  border: "1px solid rgba(0,255,136,0.12)",
                                  borderRadius: 4,
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </button>
                  </motion.div>
                ))}

                <Link
                  href={PROJECT_CATEGORIES.videos.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    fontFamily: "var(--font-geist-mono), monospace",
                    fontSize: 11,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "#00ff88",
                    textDecoration: "none",
                    padding: "16px 0",
                    marginTop: 8,
                  }}
                >
                  {PROJECT_CATEGORIES.videos.cta}
                  <span style={{ fontSize: 14 }}>→</span>
                </Link>
              </div>
            )}

            {/* ── SOCIAL ── */}
            {activeTab === "social" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                {SOCIAL_PROJECTS.map((project, i) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{
                      duration: 0.5,
                      ease: BRAND_EASE,
                      delay: i < 3 ? i * 0.08 : 0,
                    }}
                    style={{
                      borderRadius: 10,
                      overflow: "hidden",
                      border: "1px solid rgba(0,255,136,0.08)",
                      background: "rgba(255,255,255,0.02)",
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 2,
                      }}
                    >
                      {project.feedImages.map((img, j) => (
                        <div
                          key={j}
                          style={{ position: "relative", aspectRatio: "1 / 1" }}
                        >
                          <Image
                            src={img}
                            alt={`${project.title} feed ${j + 1}`}
                            fill
                            sizes="(max-width: 1023px) 50vw, 0px"
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                      ))}
                    </div>

                    <div style={{ padding: "16px 16px 18px" }}>
                      <div
                        style={{
                          fontFamily: "var(--font-monument), sans-serif",
                          fontSize: "clamp(16px, 4.5vw, 22px)",
                          fontWeight: 800,
                          letterSpacing: "0.03em",
                          textTransform: "uppercase",
                          color: "rgba(255,255,255,0.9)",
                          lineHeight: 1.15,
                          marginBottom: 6,
                        }}
                      >
                        {project.title}
                      </div>

                      <div
                        style={{
                          fontFamily: "var(--font-geist-mono), monospace",
                          fontSize: 10,
                          letterSpacing: "0.15em",
                          color: "rgba(255,255,255,0.3)",
                          marginBottom: 14,
                        }}
                      >
                        {project.platforms.join(" · ")}
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(3, 1fr)",
                          gap: 8,
                        }}
                      >
                        {[
                          { label: "IMPRESSIONS", value: project.metrics.impressions },
                          { label: "REACH", value: project.metrics.reach },
                          { label: "ENGAGEMENT", value: project.metrics.engagement },
                        ].map((m) => (
                          <div
                            key={m.label}
                            style={{
                              textAlign: "center",
                              padding: "10px 4px",
                              background: "rgba(0,255,136,0.03)",
                              borderRadius: 4,
                            }}
                          >
                            <div
                              style={{
                                fontFamily: "var(--font-monument), sans-serif",
                                fontSize: "clamp(14px, 4vw, 18px)",
                                fontWeight: 800,
                                color: "#00ff88",
                                lineHeight: 1,
                                marginBottom: 4,
                              }}
                            >
                              {m.value}
                            </div>
                            <div
                              style={{
                                fontFamily: "var(--font-geist-mono), monospace",
                                fontSize: 7,
                                letterSpacing: "0.2em",
                                textTransform: "uppercase",
                                color: "rgba(255,255,255,0.3)",
                              }}
                            >
                              {m.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}

                <Link
                  href={PROJECT_CATEGORIES.social.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    fontFamily: "var(--font-geist-mono), monospace",
                    fontSize: 11,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "#00ff88",
                    textDecoration: "none",
                    padding: "16px 0",
                    marginTop: 8,
                  }}
                >
                  {PROJECT_CATEGORIES.social.cta}
                  <span style={{ fontSize: 14 }}>→</span>
                </Link>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
      </div>
    </>
  );
}
