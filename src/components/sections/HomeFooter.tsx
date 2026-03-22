"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Instagram, Linkedin, Twitter } from "lucide-react";

// ── Link data ───────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/#services" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/contact" },
];

const SOLUTIONS = [
  { label: "Web Development", href: "/solutions/web-development" },
  { label: "Videography", href: "/solutions/videography" },
  { label: "Social Media", href: "/solutions/social-media" },
  { label: "Digital Ads", href: "/solutions/digital-advertising" },
  { label: "Web Apps", href: "/solutions/web-applications" },
];

const PROJECTS = [
  { label: "Website Projects", href: "/projects/website-projects" },
  { label: "Videography Projects", href: "/projects/videography" },
  { label: "Social Media Projects", href: "/projects/social-media" },
];

const SOCIALS = [
  { label: "LinkedIn", href: "https://linkedin.com", icon: <Linkedin size={14} /> },
  { label: "Instagram", href: "https://instagram.com", icon: <Instagram size={14} /> },
  { label: "Twitter", href: "https://twitter.com", icon: <Twitter size={14} /> },
];

const LEGAL = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Use", href: "/terms" },
  { label: "Cookie Policy", href: "/cookies" },
];

// ── Subtle star canvas (2D, lightweight) ────────────────────────────────────
function StarCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const dpr = Math.min(window.devicePixelRatio, 2);

    const stars: { x: number; y: number; r: number; phase: number; speed: number }[] = [];
    const COUNT = 80;

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
    }

    function init() {
      stars.length = 0;
      for (let i = 0; i < COUNT; i++) {
        stars.push({
          x: Math.random(),
          y: Math.random(),
          r: 0.3 + Math.random() * 1.2,
          phase: Math.random() * Math.PI * 2,
          speed: 0.3 + Math.random() * 0.7,
        });
      }
    }

    function draw(t: number) {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const s of stars) {
        const alpha = 0.15 + 0.2 * (0.5 + 0.5 * Math.sin(t * 0.001 * s.speed + s.phase));
        ctx.beginPath();
        ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r * dpr, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 136, ${alpha})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    }

    resize();
    init();
    animId = requestAnimationFrame(draw);

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}

// ── Section label (numbered, mono) ──────────────────────────────────────────
function SectionLabel({ number, label }: { number: string; label: string }) {
  return (
    <div
      style={{
        fontFamily: "var(--font-geist-mono), monospace",
        fontSize: 10,
        fontWeight: 500,
        letterSpacing: "0.45em",
        textTransform: "uppercase",
        color: "rgba(0, 255, 136, 0.4)",
        marginBottom: 28,
        display: "flex",
        alignItems: "center",
        gap: 6,
      }}
    >
      <span style={{ opacity: 0.5 }}>{number}</span>
      <span
        style={{
          width: 16,
          height: 1,
          background: "rgba(0, 255, 136, 0.2)",
          display: "inline-block",
        }}
      />
      {label}
    </div>
  );
}

// ── Link column ─────────────────────────────────────────────────────────────
function LinkColumn({
  links,
  external = false,
}: {
  links: { label: string; href: string; icon?: React.ReactNode }[];
  external?: boolean;
}) {
  return (
    <ul style={{ display: "flex", flexDirection: "column", gap: 14, margin: 0, padding: 0, listStyle: "none" }}>
      {links.map((link) => (
        <li key={link.label}>
          <Link
            href={link.href}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            style={{
              fontFamily: "var(--font-geist-mono), monospace",
              fontSize: 13,
              fontWeight: 300,
              letterSpacing: "0.06em",
              color: "rgba(255, 255, 255, 0.55)",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              transition: "color 0.25s ease, transform 0.25s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#00ff88";
              e.currentTarget.style.transform = "translateX(4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(255, 255, 255, 0.55)";
              e.currentTarget.style.transform = "translateX(0)";
            }}
          >
            {link.icon && <span style={{ opacity: 0.6 }}>{link.icon}</span>}
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

// ── Main footer ─────────────────────────────────────────────────────────────
export default function HomeFooter() {
  return (
    <footer
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        background: "#060a07",
        zIndex: 10,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Background layers ── */}
      <StarCanvas />

      {/* Decorative vertical grid lines */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {[18, 40, 62, 84].map((pct) => (
          <div
            key={pct}
            style={{
              position: "absolute",
              left: `${pct}%`,
              top: 0,
              width: 1,
              height: "100%",
              background: "rgba(0, 255, 136, 0.04)",
            }}
          />
        ))}
      </div>

      {/* Top accent line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background: "linear-gradient(90deg, transparent 0%, rgba(0,255,136,0.3) 30%, rgba(0,255,136,0.3) 70%, transparent 100%)",
        }}
      />

      {/* ── Content ── */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1280,
          width: "100%",
          margin: "0 auto",
          padding: "clamp(48px, 8vh, 80px) clamp(24px, 5vw, 64px)",
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        {/* ════ Top zone: Logo + Tagline ════ */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 32,
            marginBottom: "clamp(48px, 6vh, 72px)",
            paddingBottom: "clamp(32px, 4vh, 48px)",
            borderBottom: "1px solid rgba(0, 255, 136, 0.08)",
          }}
        >
          {/* Tagline */}
          <div>
            <div
              style={{
                fontFamily: "var(--font-monument), sans-serif",
                fontSize: "clamp(28px, 4.5vw, 56px)",
                fontWeight: 800,
                letterSpacing: "0.03em",
                textTransform: "uppercase",
                color: "rgba(255, 255, 255, 0.9)",
                lineHeight: 1.1,
              }}
            >
              Building Websites
              <br />
              <span style={{ color: "#00ff88" }}>That Print Money</span>
            </div>
            <p
              style={{
                fontFamily: "var(--font-geist-mono), monospace",
                fontSize: 10,
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                color: "rgba(255, 255, 255, 0.2)",
                marginTop: 16,
              }}
            >
              A creative partner, not an agency
            </p>
          </div>

          {/* Logo block */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
            <Image
              src="/KonaLogoNoBg.png"
              alt="Konaverse Logo"
              width={240}
              height={80}
              style={{ height: "clamp(48px, 5vw, 72px)", width: "auto", filter: "brightness(2)" }}
            />
            <div
              style={{
                fontFamily: "var(--font-geist-mono), monospace",
                fontSize: 9,
                letterSpacing: "0.5em",
                textTransform: "uppercase",
                color: "rgba(0, 255, 136, 0.3)",
              }}
            >
              Konaverse
            </div>
          </div>
        </motion.div>

        {/* ════ Middle zone: Three columns + socials ════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "clamp(32px, 4vw, 64px)",
            flex: 1,
          }}
        >
          {/* Column 1: Navigate */}
          <div>
            <SectionLabel number="01" label="Navigate" />
            <LinkColumn links={NAV_LINKS} />
          </div>

          {/* Column 2: Solutions */}
          <div>
            <SectionLabel number="02" label="Solutions" />
            <LinkColumn links={SOLUTIONS} />
          </div>

          {/* Column 3: Projects */}
          <div>
            <SectionLabel number="03" label="Projects" />
            <LinkColumn links={PROJECTS} />
          </div>

          {/* Column 4: Connect */}
          <div>
            <SectionLabel number="04" label="Connect" />
            <LinkColumn links={SOCIALS} external />

            {/* Manifest text below socials */}
            <div
              style={{
                marginTop: 36,
                paddingTop: 24,
                borderTop: "1px solid rgba(0, 255, 136, 0.06)",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-geist-mono), monospace",
                  fontSize: 11,
                  fontWeight: 300,
                  lineHeight: 1.8,
                  color: "rgba(255, 255, 255, 0.2)",
                  fontStyle: "italic",
                }}
              >
                Not an agency.
                <br />
                A creative partner for those
                <br />
                who value intentionality
                <br />
                over consensus.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ════ Bottom zone: Legal + Copyright ════ */}
        <div
          style={{
            marginTop: "auto",
            paddingTop: "clamp(32px, 4vh, 48px)",
            borderTop: "1px solid rgba(0, 255, 136, 0.06)",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
          }}
        >
          {/* Copyright */}
          <div
            style={{
              fontFamily: "var(--font-geist-mono), monospace",
              fontSize: 9,
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "rgba(255, 255, 255, 0.2)",
            }}
          >
            &copy; {new Date().getFullYear()} Konaverse. All rights reserved.
          </div>

          {/* Legal links */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
            {LEGAL.map((link, i) => (
              <Link
                key={link.label}
                href={link.href}
                style={{
                  fontFamily: "var(--font-geist-mono), monospace",
                  fontSize: 9,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: "rgba(255, 255, 255, 0.2)",
                  textDecoration: "none",
                  transition: "color 0.25s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "rgba(0, 255, 136, 0.6)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(255, 255, 255, 0.2)";
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Decorative corner mark */}
          <div
            style={{
              position: "absolute",
              bottom: 24,
              right: 24,
              width: 12,
              height: 12,
              opacity: 0.15,
              pointerEvents: "none",
            }}
          >
            <div style={{ position: "absolute", bottom: 0, right: 0, width: "100%", height: 1, background: "#00ff88" }} />
            <div style={{ position: "absolute", bottom: 0, right: 0, width: 1, height: "100%", background: "#00ff88" }} />
          </div>
        </div>
      </div>
    </footer>
  );
}
