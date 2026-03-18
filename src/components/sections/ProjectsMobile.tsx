"use client";

import { useState } from "react";
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

// ── Shared constants ──────────────────────────────────────────────────────────

type TabId = "websites" | "videos" | "social";

const TABS: { id: TabId; label: string }[] = [
  { id: "websites", label: "Websites" },
  { id: "videos",   label: "Videos"   },
  { id: "social",   label: "Social"   },
];

const PLATFORM_COLORS: Record<string, string> = {
  Instagram: "#e1306c",
  Facebook:  "#1877f2",
  LinkedIn:  "#0a66c2",
  TikTok:    "#69c9d0",
};

// ── Shared card primitives ────────────────────────────────────────────────────

function Counter({ index, total }: { index: number; total: number }) {
  return (
    <div
      style={{
        fontFamily: "var(--font-geist-mono), monospace",
        fontSize: 10,
        letterSpacing: "0.35em",
        color: "#00ff88",
        marginBottom: 8,
      }}
    >
      {String(index + 1).padStart(2, "0")}&nbsp;/&nbsp;0{total}
    </div>
  );
}

function ClientName({ name }: { name: string }) {
  return (
    <div
      style={{
        fontFamily: "var(--font-monument), sans-serif",
        fontSize: "clamp(18px, 5vw, 26px)",
        fontWeight: 800,
        color: "#ffffff",
        letterSpacing: "0.03em",
        textTransform: "uppercase",
        marginBottom: 4,
        lineHeight: 1.1,
      }}
    >
      {name}
    </div>
  );
}

function Year({ year }: { year: string }) {
  return (
    <div
      style={{
        fontFamily: "var(--font-geist-mono), monospace",
        fontSize: 10,
        letterSpacing: "0.28em",
        color: "rgba(0,255,136,0.5)",
        marginBottom: 12,
      }}
    >
      {year}
    </div>
  );
}

function Description({ text }: { text: string }) {
  return (
    <p
      style={{
        fontFamily: "var(--font-geist-mono), monospace",
        fontSize: 12,
        color: "rgba(255,255,255,0.45)",
        lineHeight: 1.8,
        marginBottom: 14,
      }}
    >
      {text}
    </p>
  );
}

function TagPills({ tags }: { tags: string[] }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
      {tags.map((tag) => (
        <span
          key={tag}
          style={{
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: 9,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(0,255,136,0.6)",
            padding: "3px 8px",
            border: "1px solid rgba(0,255,136,0.18)",
            background: "rgba(0,255,136,0.03)",
          }}
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

function CardDivider() {
  return <div style={{ height: 1, background: "rgba(0,255,136,0.08)", marginTop: 36 }} />;
}

function CategoryCta({ href, label, disabled = false }: { href: string; label: string; disabled?: boolean }) {
  if (disabled) {
    return (
      <div
        title="Page coming soon"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          padding: "12px 20px",
          border: "1px solid rgba(255,255,255,0.09)",
          cursor: "not-allowed",
          userSelect: "none",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: 10,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.2)",
          }}
        >
          {label}&nbsp;→
        </span>
        <span
          style={{
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: 8,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(0,255,136,0.4)",
            border: "1px solid rgba(0,255,136,0.18)",
            padding: "2px 6px",
          }}
        >
          Soon
        </span>
      </div>
    );
  }
  return (
    <Link
      href={href}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        padding: "12px 20px",
        border: "1px solid rgba(0,255,136,0.28)",
        color: "#00ff88",
        fontFamily: "var(--font-geist-mono), monospace",
        fontSize: 10,
        letterSpacing: "0.24em",
        textTransform: "uppercase",
        textDecoration: "none",
      }}
    >
      {label}
      <span style={{ fontSize: 13 }}>→</span>
    </Link>
  );
}

// ── Tab panels ────────────────────────────────────────────────────────────────

function WebsitesTab() {
  return (
    <>
      {WEBSITE_PROJECTS.map((project, i) => (
        <div key={project.id} style={{ marginBottom: 36 }}>
          {/* Screenshot */}
          <div
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "16 / 9",
              background: "#061009",
              border: "1px solid rgba(0,255,136,0.12)",
              overflow: "hidden",
              marginBottom: 16,
            }}
          >
            <Image
              src={project.image}
              alt={project.title}
              fill
              style={{ objectFit: "contain" }}
              sizes="90vw"
            />
          </div>

          <Counter index={i} total={WEBSITE_PROJECTS.length} />
          <ClientName name={project.client} />
          <Year year={project.year} />
          <Description text={project.description} />
          <TagPills tags={project.tech} />

          <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "9px 16px",
              border: "1px solid rgba(0,255,136,0.25)",
              color: "rgba(0,255,136,0.85)",
              fontFamily: "var(--font-geist-mono), monospace",
              fontSize: 10,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            View Live Site <span style={{ fontSize: 12 }}>↗</span>
          </a>

          {i < WEBSITE_PROJECTS.length - 1 && <CardDivider />}
        </div>
      ))}

      <div style={{ marginTop: 8 }}>
        <CategoryCta href={PROJECT_CATEGORIES.websites.href} label={PROJECT_CATEGORIES.websites.cta} />
      </div>
    </>
  );
}

function VideosTab({ onPlay }: { onPlay: (v: VideoProject) => void }) {
  return (
    <>
      {VIDEO_PROJECTS.map((project, i) => (
        <div key={project.id} style={{ marginBottom: 36 }}>
          {/* Thumbnail + play overlay */}
          <button
            onClick={() => onPlay(project)}
            style={{
              position: "relative",
              width: "100%",
              display: "block",
              aspectRatio: "16 / 9",
              background: "#000",
              border: "1px solid rgba(255,255,255,0.07)",
              overflow: "hidden",
              cursor: "pointer",
              padding: 0,
              marginBottom: 16,
            }}
          >
            <Image
              src={project.thumbnail}
              alt={project.title}
              fill
              style={{ objectFit: "cover" }}
              sizes="90vw"
            />
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.42)" }} />
            {/* Play button */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "rgba(0,0,0,0.52)",
                  border: "2px solid rgba(0,255,136,0.6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 24px rgba(0,255,136,0.18)",
                }}
              >
                <div
                  style={{
                    width: 0,
                    height: 0,
                    borderTop: "11px solid transparent",
                    borderBottom: "11px solid transparent",
                    borderLeft: "18px solid #00ff88",
                    marginLeft: 4,
                    filter: "drop-shadow(0 0 6px rgba(0,255,136,0.6))",
                  }}
                />
              </div>
            </div>
            {/* Duration */}
            <div
              style={{
                position: "absolute",
                bottom: 10,
                right: 10,
                fontFamily: "var(--font-geist-mono), monospace",
                fontSize: 10,
                letterSpacing: "0.16em",
                color: "rgba(255,255,255,0.55)",
                background: "rgba(0,0,0,0.65)",
                padding: "2px 7px",
              }}
            >
              {project.duration}
            </div>
          </button>

          <Counter index={i} total={VIDEO_PROJECTS.length} />
          <ClientName name={project.client} />
          <Year year={project.year} />
          <Description text={project.description} />
          <TagPills tags={project.tags} />

          <button
            onClick={() => onPlay(project)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "9px 16px",
              border: "1px solid rgba(0,255,136,0.25)",
              color: "rgba(0,255,136,0.85)",
              fontFamily: "var(--font-geist-mono), monospace",
              fontSize: 10,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            <span style={{ fontSize: 10 }}>▶</span> Watch Film
          </button>

          {i < VIDEO_PROJECTS.length - 1 && <CardDivider />}
        </div>
      ))}

      <div style={{ marginTop: 8 }}>
        <CategoryCta href={PROJECT_CATEGORIES.videos.href} label={PROJECT_CATEGORIES.videos.cta} disabled />
      </div>
    </>
  );
}

function SocialTab() {
  return (
    <>
      {SOCIAL_PROJECTS.map((project, i) => (
        <div key={project.id} style={{ marginBottom: 36 }}>
          {/* 2×2 feed grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 3,
              marginBottom: 16,
            }}
          >
            {project.feedImages.map((src, imgI) => (
              <div
                key={imgI}
                style={{
                  position: "relative",
                  aspectRatio: "1 / 1",
                  overflow: "hidden",
                  background: "#061009",
                }}
              >
                <Image
                  src={src}
                  alt={`${project.client} post ${imgI + 1}`}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="45vw"
                />
              </div>
            ))}
          </div>

          <Counter index={i} total={SOCIAL_PROJECTS.length} />
          <ClientName name={project.client} />
          <Year year={project.year} />
          <Description text={project.description} />
          <TagPills tags={project.tags} />

          {/* Platform chips */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
              marginBottom: 16,
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-geist-mono), monospace",
                fontSize: 9,
                letterSpacing: "0.2em",
                color: "rgba(255,255,255,0.25)",
                textTransform: "uppercase",
              }}
            >
              On
            </span>
            {project.platforms.map((p) => (
              <span
                key={p}
                style={{
                  fontFamily: "var(--font-geist-mono), monospace",
                  fontSize: 9,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: PLATFORM_COLORS[p] ?? "rgba(255,255,255,0.5)",
                  padding: "3px 8px",
                  border: `1px solid ${(PLATFORM_COLORS[p] ?? "#fff") + "40"}`,
                  background: `${(PLATFORM_COLORS[p] ?? "#fff") + "08"}`,
                  borderRadius: 2,
                }}
              >
                {p}
              </span>
            ))}
          </div>

          {/* Metrics row */}
          <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
            {[
              { value: project.metrics.impressions, label: "Impressions" },
              { value: project.metrics.reach,       label: "Reach"       },
              { value: project.metrics.engagement,  label: "Engagement"  },
            ].map((metric) => (
              <div
                key={metric.label}
                style={{
                  flex: 1,
                  background: "rgba(0,255,136,0.04)",
                  border: "1px solid rgba(0,255,136,0.12)",
                  borderRadius: 3,
                  padding: "10px 8px",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-monument), sans-serif",
                    fontSize: "clamp(14px, 3.8vw, 19px)",
                    fontWeight: 800,
                    color: "rgba(255,255,255,0.9)",
                    lineHeight: 1,
                    marginBottom: 4,
                  }}
                >
                  {metric.value}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-geist-mono), monospace",
                    fontSize: 8,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "rgba(0,255,136,0.5)",
                  }}
                >
                  {metric.label}
                </div>
              </div>
            ))}
          </div>

          {i < SOCIAL_PROJECTS.length - 1 && <CardDivider />}
        </div>
      ))}

      <div style={{ marginTop: 8 }}>
        <CategoryCta href={PROJECT_CATEGORIES.social.href} label={PROJECT_CATEGORIES.social.cta} />
      </div>
    </>
  );
}

// ── Main mobile component ─────────────────────────────────────────────────────

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

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          style={{ padding: "0 24px" }}
        >
          {activeTab === "websites" && <WebsitesTab />}
          {activeTab === "videos"   && <VideosTab onPlay={setActiveVideo} />}
          {activeTab === "social"   && <SocialTab />}
        </motion.div>
      </AnimatePresence>

      {/* Shared video modal */}
      <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
    </div>
  );
}
