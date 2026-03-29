"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  sectionReveal,
  itemReveal,
  viewportConfig,
  sectionLabelStyle,
  sectionHeadingStyle,
  accentRuleStyle,
  BRAND_EASE,
} from "./motion-presets";

const SOLUTIONS = [
  {
    slug: "web-development",
    num: "01",
    title: "Web Development",
    description:
      "Fast, conversion-focused websites built with intent. We design and develop digital experiences that make your brand impossible to ignore.",
    bullets: [
      "Custom design systems built to scale",
      "Performance-optimized, sub-2s load times",
      "SEO-ready architecture from day one",
      "Headless CMS and third-party integrations",
    ],
    cta: "Explore Web Development",
  },
  {
    slug: "videography",
    num: "02",
    title: "Videography",
    description:
      "Cinematic content that stops the scroll. From brand films to product showcases, we translate your vision into footage that converts.",
    bullets: [
      "Brand films and culture documentaries",
      "Product showcases and demo reels",
      "Social-ready short-form content",
      "Color grading and professional sound design",
    ],
    cta: "Explore Videography",
  },
  {
    slug: "digital-ads",
    num: "03",
    title: "Digital Ads",
    description:
      "Paid media built to earn its budget. We craft and manage campaigns that reach the right audience at precisely the right moment.",
    bullets: [
      "Google, Meta, and LinkedIn campaigns",
      "Creative strategy and ad copywriting",
      "A/B testing and funnel optimization",
      "ROI-focused monthly reporting",
    ],
    cta: "Explore Digital Ads",
  },
  {
    slug: "social-media-management",
    num: "04",
    title: "Social Media",
    description:
      "Consistent, on-brand presence across every platform. We manage your content calendar so you stay focused on what you do best.",
    bullets: [
      "Platform strategy and brand voice",
      "Content creation and scheduling",
      "Community management and engagement",
      "Analytics and growth reporting",
    ],
    cta: "Explore Social Media",
  },
  {
    slug: "web-applications",
    num: "05",
    title: "Web Applications",
    description:
      "Full-stack applications engineered for scale. From internal tools to customer-facing platforms, we build software that lasts.",
    bullets: [
      "Custom SaaS and platform development",
      "API design and third-party integrations",
      "Auth flows, dashboards, and user portals",
      "Cloud-native deployment and DevOps",
    ],
    cta: "Explore Web Applications",
  },
] as const;

export default function MobileServicesSection() {
  return (
    <section
      style={{
        position: "relative",
        padding: "80px 24px 64px",
        overflow: "hidden",
      }}
    >
      {/* Subtle radial green glow behind the section */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "140%",
          height: "60%",
          background: "radial-gradient(ellipse, rgba(0,255,136,0.02) 0%, transparent 70%)",
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
          background: "linear-gradient(to right, transparent, rgba(0,255,136,0.2), transparent)",
        }}
      />

      <motion.div
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
      >
        {/* Section label */}
        <motion.div variants={itemReveal} style={sectionLabelStyle}>
          <span style={{ opacity: 0.5 }}>◆</span>
          04 — Services
        </motion.div>

        {/* Headline */}
        <motion.div variants={itemReveal}>
          <div style={{ ...sectionHeadingStyle, marginBottom: 4 }}>
            What We
          </div>
          <div style={{ ...sectionHeadingStyle, color: "#00ff88" }}>
            Do.
          </div>
        </motion.div>

        <motion.div variants={itemReveal} style={accentRuleStyle} />
      </motion.div>

      {/* Service cards */}
      <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 0 }}>
        {SOLUTIONS.map((sol, i) => (
          <motion.div
            key={sol.slug}
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, ease: BRAND_EASE, delay: 0.05 }}
            style={{
              padding: "32px 0",
              borderBottom:
                i < SOLUTIONS.length - 1
                  ? "1px solid rgba(0,255,136,0.08)"
                  : "none",
            }}
          >
            {/* Counter */}
            <div
              style={{
                fontFamily: "var(--font-geist-mono), monospace",
                fontSize: 10,
                letterSpacing: "0.2em",
                color: "rgba(255,255,255,0.25)",
                marginBottom: 12,
              }}
            >
              {sol.num} / 05
            </div>

            {/* Title */}
            <div
              style={{
                fontFamily: "var(--font-monument), sans-serif",
                fontSize: "clamp(22px, 6vw, 32px)",
                fontWeight: 800,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.92)",
                lineHeight: 1.1,
                marginBottom: 10,
              }}
            >
              {sol.title}
            </div>

            {/* Accent rule */}
            <div
              style={{
                width: 36,
                height: 2,
                background: "#00ff88",
                boxShadow: "0 0 8px rgba(0,255,136,0.3)",
                marginBottom: 14,
              }}
            />

            {/* Description */}
            <p
              style={{
                fontFamily: "var(--font-geist-mono), monospace",
                fontSize: "clamp(12px, 3.2vw, 14px)",
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.45)",
                marginBottom: 16,
                maxWidth: 380,
              }}
            >
              {sol.description}
            </p>

            {/* Bullets */}
            <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 20 }}>
              {sol.bullets.map((bullet) => (
                <div
                  key={bullet}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    fontFamily: "var(--font-geist-mono), monospace",
                    fontSize: "clamp(11px, 2.8vw, 13px)",
                    lineHeight: 1.5,
                    color: "rgba(255,255,255,0.55)",
                  }}
                >
                  <span style={{ color: "rgba(0,255,136,0.6)", flexShrink: 0 }}>—</span>
                  {bullet}
                </div>
              ))}
            </div>

            {/* CTA link */}
            <Link
              href={`/solutions/${sol.slug}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontFamily: "var(--font-geist-mono), monospace",
                fontSize: 11,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#00ff88",
                textDecoration: "none",
                padding: "10px 0",
              }}
            >
              {sol.cta}
              <span style={{ fontSize: 14, transition: "transform 0.2s" }}>→</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
