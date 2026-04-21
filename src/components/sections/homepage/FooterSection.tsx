"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const ACCENT = "#6B7F62";

const SERVICES = [
  { label: "Web Design", href: "/services/web-design" },
  { label: "Web Development", href: "/services/web-development" },
  { label: "Videography", href: "/services/videography" },
  { label: "Video Editing", href: "/services/video-editing" },
  { label: "SEO & Strategy", href: "/services/seo" },
];

const PROJECTS = [
  { label: "All Work", href: "/work" },
  { label: "Web Projects", href: "/work?filter=web" },
  { label: "Film Projects", href: "/work?filter=film" },
  { label: "Branding", href: "/work?filter=brand" },
];

const PAGES = [
  { label: "About", href: "/about" },
  { label: "Process", href: "/process" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Use", href: "/terms" },
];

const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Vimeo", href: "https://vimeo.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "X / Twitter", href: "https://x.com" },
];

// Reusable column
function FooterCol({
  heading,
  links,
  accentHover = false,
}: {
  heading: string;
  links: { label: string; href: string }[];
  accentHover?: boolean;
}) {
  return (
    <div>
      <p
        style={{
          fontFamily: "var(--font-jakarta), sans-serif",
          fontWeight: 500,
          fontSize: "0.52rem",
          letterSpacing: "0.24em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.22)",
          marginBottom: "1.2rem",
        }}
      >
        {heading}
      </p>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.7rem" }}>
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              target={l.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              style={{
                fontFamily: "var(--font-jakarta), sans-serif",
                fontWeight: 300,
                fontSize: "0.82rem",
                color: "rgba(240,237,232,0.42)",
                textDecoration: "none",
                letterSpacing: "0.01em",
                transition: "color 0.3s ease",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.color = accentHover ? ACCENT : "#f0ede8")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.color = "rgba(240,237,232,0.42)")
              }
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function FooterSection() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <footer
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        minHeight: isMobile ? 580 : 640,
        background: "#080809",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Ambient orbs ── */}
      <div aria-hidden style={{ position: "absolute", width: "50vw", height: "50vw", borderRadius: "50%", background: "rgba(107,127,98,0.16)", filter: "blur(14vw)", bottom: "-15%", left: "-10%", pointerEvents: "none", zIndex: 0 }} />
      <div aria-hidden style={{ position: "absolute", width: "28vw", height: "28vw", borderRadius: "50%", background: "rgba(107,127,98,0.10)", filter: "blur(10vw)", top: "5%", right: "-4%", pointerEvents: "none", zIndex: 0 }} />

      {/* ── Top accent rule ── */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(107,127,98,0.35) 30%, rgba(255,255,255,0.06) 70%, transparent)", zIndex: 1 }} />

      {/* ─────────────── CONTENT ─────────────── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: isMobile ? "3rem 1.25rem 2rem" : "3.5rem 2.5rem 2.5rem",
          position: "relative",
          zIndex: 2,
        }}
      >

        {isMobile ? (
          /* ═══════════════════════════════════════
             MOBILE LAYOUT (unchanged from before)
             ═══════════════════════════════════════ */
          <>
            {/* Headline */}
            <div style={{ marginBottom: "2.5rem" }}>
              <div style={{ containerType: "inline-size", width: "100%" }}>
                <h2
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontSize: "clamp(3rem, 19cqi, 6.5rem)",
                    fontWeight: 300,
                    lineHeight: 0.9,
                    letterSpacing: "-0.025em",
                    color: "#f0ede8",
                    margin: 0,
                    userSelect: "none",
                  }}
                >
                  Crafted
                  <br />
                  <em style={{ fontStyle: "italic", color: ACCENT }}>In</em>
                  <br />
                  Konaverse
                  <em style={{ fontStyle: "italic", color: ACCENT, fontSize: "0.6em" }}>.</em>
                </h2>
              </div>
            </div>

            {/* Mobile nav grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "2.5rem" }}>
              <FooterCol heading="Services" links={SERVICES} />
              <FooterCol heading="Connect" links={[{ label: "info@kona-verse.com", href: "mailto:info@kona-verse.com" }, ...SOCIALS]} accentHover />
            </div>
          </>
        ) : (
          /* ═══════════════════════════════════════
             DESKTOP LAYOUT
             ═══════════════════════════════════════ */
          <>
            {/* ── TOP ROW: headline (3/5) + logo (2/5) ── */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "3fr 2fr",
                gap: "2rem",
                alignItems: "flex-end",
                marginBottom: "3.5rem",
              }}
            >
              {/* Headline — 3/5 */}
              <div style={{ containerType: "inline-size" }}>
                <h2
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontSize: "clamp(2.8rem, 9.5cqi, 7.5rem)",
                    fontWeight: 300,
                    lineHeight: 0.9,
                    letterSpacing: "-0.028em",
                    color: "#f0ede8",
                    margin: 0,
                    userSelect: "none",
                  }}
                >
                  A creative studio,
                  <br />
                  <em style={{ fontStyle: "italic", color: ACCENT }}>limitless</em> experiences
                  <em style={{ fontStyle: "italic", color: ACCENT, fontSize: "0.55em" }}>.</em>
                </h2>
              </div>

              {/* Logo — 2/5 */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "flex-end",
                  paddingBottom: "0.3rem",
                }}
              >
                <div style={{ position: "relative", width: "min(260px, 80%)", aspectRatio: "3 / 1" }}>
                  <Image
                    src="/About/KonaLogoNoBg.png"
                    alt="Konaverse"
                    fill
                    style={{ objectFit: "contain", objectPosition: "right bottom", opacity: 0.75 }}
                  />
                </div>
              </div>
            </div>

            {/* ── MIDDLE ROW: 4 link columns + 1 wider contact column ── */}
            {/*  Grid: 4 equal cols + 1 wider contact col (1.5x)           */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 1fr 1.6fr",
                gap: "1.5rem",
                marginBottom: "3rem",
                alignItems: "start",
              }}
            >
              {/* Col 1: Services */}
              <FooterCol heading="Services" links={SERVICES} />

              {/* Col 2: Projects */}
              <FooterCol heading="Projects" links={PROJECTS} />

              {/* Col 3: Pages & Legal */}
              <FooterCol heading="Studio" links={PAGES} />

              {/* Col 4: Socials */}
              <FooterCol heading="Follow" links={SOCIALS} accentHover />

              {/* Col 5: Contact — wider */}
              <div style={{ borderLeft: "1px solid rgba(255,255,255,0.05)", paddingLeft: "1.5rem" }}>
                <p
                  style={{
                    fontFamily: "var(--font-jakarta), sans-serif",
                    fontWeight: 500,
                    fontSize: "0.52rem",
                    letterSpacing: "0.24em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.22)",
                    marginBottom: "1.2rem",
                  }}
                >
                  Contact
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
                  {/* Email */}
                  <div>
                    <div style={{ fontFamily: "var(--font-jakarta), sans-serif", fontWeight: 500, fontSize: "0.52rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.16)", marginBottom: "0.3rem" }}>
                      Email
                    </div>
                    <a
                      href="mailto:info@kona-verse.com"
                      style={{
                        fontFamily: "var(--font-cormorant), serif",
                        fontWeight: 300,
                        fontStyle: "italic",
                        fontSize: "clamp(0.9rem, 1.05vw, 1.1rem)",
                        color: "rgba(240,237,232,0.55)",
                        textDecoration: "none",
                        transition: "color 0.3s ease",
                      }}
                      onMouseEnter={(e) => ((e.currentTarget).style.color = ACCENT)}
                      onMouseLeave={(e) => ((e.currentTarget).style.color = "rgba(240,237,232,0.55)")}
                    >
                      info@kona-verse.com
                    </a>
                  </div>

                  {/* Location */}
                  <div>
                    <div style={{ fontFamily: "var(--font-jakarta), sans-serif", fontWeight: 500, fontSize: "0.52rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.16)", marginBottom: "0.3rem" }}>
                      Location
                    </div>
                    <span style={{ fontFamily: "var(--font-jakarta), sans-serif", fontWeight: 300, fontSize: "0.82rem", color: "rgba(240,237,232,0.42)" }}>
                      Cyprus
                    </span>
                  </div>

                  {/* CTA */}
                  <a
                    href="/contact"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginTop: "0.6rem",
                      fontFamily: "var(--font-jakarta), sans-serif",
                      fontWeight: 500,
                      fontSize: "0.62rem",
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: ACCENT,
                      textDecoration: "none",
                      borderBottom: `1px solid ${ACCENT}44`,
                      paddingBottom: "0.2rem",
                      transition: "border-color 0.3s ease, color 0.3s ease",
                      width: "fit-content",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget).style.color = "#f0ede8";
                      (e.currentTarget).style.borderColor = "rgba(240,237,232,0.3)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget).style.color = ACCENT;
                      (e.currentTarget).style.borderColor = `${ACCENT}44`;
                    }}
                  >
                    Start a project →
                  </a>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── BOTTOM: rule + copyright (shared) ── */}
        <div>
          <div style={{ height: 1, background: "rgba(255,255,255,0.05)", marginBottom: isMobile ? "1.2rem" : "1.4rem" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
            <span style={{ fontFamily: "var(--font-jakarta), sans-serif", fontWeight: 300, fontSize: "0.62rem", color: "rgba(255,255,255,0.18)", letterSpacing: "0.06em" }}>
              &copy; {new Date().getFullYear()} Konaverse. All rights reserved.
            </span>
            <span style={{ fontFamily: "var(--font-jakarta), sans-serif", fontWeight: 300, fontSize: "0.62rem", color: "rgba(255,255,255,0.15)", letterSpacing: "0.04em" }}>
              Cyprus
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
