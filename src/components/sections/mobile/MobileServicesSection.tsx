"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  sectionReveal,
  itemReveal,
  viewportConfig,
  sectionLabelStyle,
  sectionHeadingStyle,
  BRAND_EASE,
} from "./motion-presets";

// ── Data ──
const SOLUTIONS = [
  {
    slug: "web-development",
    num: "01",
    title: "Web Development",
    tagline: "Built to convert",
    description:
      "Fast, conversion-focused websites built with intent. We design and develop digital experiences that make your brand impossible to ignore.",
    bullets: [
      "Custom design systems built to scale",
      "Performance-optimized, sub-2s load times",
      "SEO-ready architecture from day one",
      "Headless CMS and third-party integrations",
    ],
    cta: "Explore Web Development",
    image: "/images/bg-service-dev.png",
  },
  {
    slug: "videography",
    num: "02",
    title: "Videography",
    tagline: "Stories that stop the scroll",
    description:
      "Cinematic content that stops the scroll. From brand films to product showcases, we translate your vision into footage that converts.",
    bullets: [
      "Brand films and culture documentaries",
      "Product showcases and demo reels",
      "Social-ready short-form content",
      "Color grading and professional sound design",
    ],
    cta: "Explore Videography",
    image: "/images/solutions/videography/layer1-lens flares.png",
  },
  {
    slug: "digital-ads",
    num: "03",
    title: "Digital Ads",
    tagline: "Precision-targeted growth",
    description:
      "Paid media built to earn its budget. We craft and manage campaigns that reach the right audience at precisely the right moment.",
    bullets: [
      "Google, Meta, and LinkedIn campaigns",
      "Creative strategy and ad copywriting",
      "A/B testing and funnel optimization",
      "ROI-focused monthly reporting",
    ],
    cta: "Explore Digital Ads",
    image: "/images/bg-service-ads.png",
  },
  {
    slug: "social-media-management",
    num: "04",
    title: "Social Media",
    tagline: "Presence on every platform",
    description:
      "Consistent, on-brand presence across every platform. We manage your content calendar so you stay focused on what you do best.",
    bullets: [
      "Platform strategy and brand voice",
      "Content creation and scheduling",
      "Community management and engagement",
      "Analytics and growth reporting",
    ],
    cta: "Explore Social Media",
    image: "/images/bg-service-social.png",
  },
  {
    slug: "web-applications",
    num: "05",
    title: "Web Apps",
    tagline: "Software engineered to last",
    description:
      "Full-stack applications engineered for scale. From internal tools to customer-facing platforms, we build software that lasts.",
    bullets: [
      "Custom SaaS and platform development",
      "API design and third-party integrations",
      "Auth flows, dashboards, and user portals",
      "Cloud-native deployment and DevOps",
    ],
    cta: "Explore Web Applications",
    image: "/images/bg-service-app.png",
  },
] as const;

// ── Accordion item ──
function ServiceAccordionItem({
  sol,
  isOpen,
  onToggle,
  index,
}: {
  sol: (typeof SOLUTIONS)[number];
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, ease: BRAND_EASE, delay: index * 0.06 }}
      style={{
        borderBottom: "1px solid rgba(0,255,136,0.08)",
        overflow: "hidden",
      }}
    >
      {/* Collapsed header — always visible */}
      <button
        onClick={onToggle}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "22px 0",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          outline: "none",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {/* Number */}
          <span
            style={{
              fontFamily: "var(--font-geist-mono), monospace",
              fontSize: 11,
              letterSpacing: "0.15em",
              color: isOpen ? "#00ff88" : "rgba(255,255,255,0.2)",
              transition: "color 0.3s",
              width: 24,
              flexShrink: 0,
            }}
          >
            {sol.num}
          </span>

          {/* Title */}
          <span
            style={{
              fontFamily: "var(--font-monument), sans-serif",
              fontSize: "clamp(16px, 4.5vw, 22px)",
              fontWeight: 800,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: isOpen ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.5)",
              transition: "color 0.3s",
              textAlign: "left",
            }}
          >
            {sol.title}
          </span>
        </div>

        {/* Expand/collapse icon */}
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3, ease: BRAND_EASE }}
          style={{
            width: 28,
            height: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            border: `1px solid ${isOpen ? "#00ff88" : "rgba(255,255,255,0.1)"}`,
            borderRadius: "50%",
            transition: "border-color 0.3s",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 0V12M0 6H12" stroke={isOpen ? "#00ff88" : "rgba(255,255,255,0.3)"} strokeWidth="1.5" />
          </svg>
        </motion.div>
      </button>

      {/* Expanded content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.45, ease: BRAND_EASE },
              opacity: { duration: 0.3, delay: 0.1 },
            }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ paddingBottom: 28 }}>
              {/* Full-width image with overlay */}
              <div
                style={{
                  position: "relative",
                  width: "calc(100% + 48px)",
                  marginLeft: -24,
                  height: 200,
                  marginBottom: 20,
                  overflow: "hidden",
                  borderRadius: 0,
                }}
              >
                <Image
                  src={sol.image}
                  alt={sol.title}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="100vw"
                />
                {/* Green-tinted gradient overlay */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to bottom, rgba(0,20,10,0.3) 0%, rgba(0,0,0,0.7) 80%, rgba(0,0,0,0.95) 100%)",
                  }}
                />
                {/* Tagline over image */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 16,
                    left: 24,
                    fontFamily: "var(--font-geist-mono), monospace",
                    fontSize: 10,
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    color: "#00ff88",
                    textShadow: "0 0 12px rgba(0,255,136,0.4)",
                  }}
                >
                  {sol.tagline}
                </div>
                {/* Top glow line */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 1,
                    background: "linear-gradient(to right, transparent 10%, #00ff8833 50%, transparent 90%)",
                  }}
                />
              </div>

              {/* Description */}
              <p
                style={{
                  fontFamily: "var(--font-geist-mono), monospace",
                  fontSize: "clamp(12px, 3.2vw, 14px)",
                  lineHeight: 1.7,
                  color: "rgba(255,255,255,0.5)",
                  marginBottom: 18,
                }}
              >
                {sol.description}
              </p>

              {/* Bullets — 2-column grid for compact layout */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "8px 16px",
                  marginBottom: 22,
                }}
              >
                {sol.bullets.map((bullet) => (
                  <div
                    key={bullet}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 8,
                      fontFamily: "var(--font-geist-mono), monospace",
                      fontSize: 11,
                      lineHeight: 1.5,
                      color: "rgba(255,255,255,0.55)",
                    }}
                  >
                    <span
                      style={{
                        color: "#00ff88",
                        fontSize: 8,
                        marginTop: 3,
                        flexShrink: 0,
                        opacity: 0.6,
                      }}
                    >
                      &#9670;
                    </span>
                    {bullet}
                  </div>
                ))}
              </div>

              {/* CTA button */}
              <Link
                href={`/solutions/${sol.slug}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  fontFamily: "var(--font-geist-mono), monospace",
                  fontSize: 11,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#000",
                  background: "#00ff88",
                  textDecoration: "none",
                  padding: "10px 20px",
                  borderRadius: 4,
                  fontWeight: 600,
                }}
              >
                {sol.cta}
                <span style={{ fontSize: 14 }}>&#8594;</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Main section ──
export default function MobileServicesSection() {
  const [openIndex, setOpenIndex] = useState(0); // first one open by default

  return (
    <section
      style={{
        position: "relative",
        padding: "80px 24px 64px",
        overflow: "hidden",
      }}
    >
      {/* Ambient background glow */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(ellipse at 30% 20%, rgba(0,255,136,0.03) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(0,255,136,0.02) 0%, transparent 50%)",
          pointerEvents: "none",
        }}
      />

      {/* Top accent border */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 24,
          right: 24,
          height: 1,
          background:
            "linear-gradient(to right, transparent, rgba(0,255,136,0.2), transparent)",
        }}
      />

      {/* Section header */}
      <motion.div
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
      >
        <motion.div variants={itemReveal} style={sectionLabelStyle}>
          <span style={{ opacity: 0.5 }}>&#9670;</span>
          04 — Services
        </motion.div>

        <motion.div variants={itemReveal}>
          <div style={{ ...sectionHeadingStyle, marginBottom: 4 }}>
            What We
          </div>
          <div style={{ ...sectionHeadingStyle, color: "#00ff88" }}>Do.</div>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          variants={itemReveal}
          style={{
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: "clamp(12px, 3.2vw, 14px)",
            lineHeight: 1.7,
            color: "rgba(255,255,255,0.35)",
            marginTop: 16,
            marginBottom: 8,
            maxWidth: 340,
          }}
        >
          Tap a service to explore what we bring to the table.
        </motion.p>
      </motion.div>

      {/* Active service counter */}
      <div
        style={{
          display: "flex",
          gap: 6,
          marginTop: 32,
          marginBottom: 8,
        }}
      >
        {SOLUTIONS.map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 2,
              borderRadius: 1,
              background:
                i === openIndex
                  ? "#00ff88"
                  : "rgba(255,255,255,0.08)",
              boxShadow:
                i === openIndex
                  ? "0 0 8px rgba(0,255,136,0.4)"
                  : "none",
              transition: "all 0.3s",
            }}
          />
        ))}
      </div>

      {/* Accordion */}
      <div>
        {SOLUTIONS.map((sol, i) => (
          <ServiceAccordionItem
            key={sol.slug}
            sol={sol}
            isOpen={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
            index={i}
          />
        ))}
      </div>
    </section>
  );
}
