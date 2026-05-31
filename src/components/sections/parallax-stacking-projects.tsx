"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ── Types ── */

export interface StackProject {
  id: string;
  year: string;
  title: string;
  href: string;
  image: string;
  description?: string;
  tags?: string[];
  tech?: string[];
  linkLabel?: string;
}

interface ParallaxStackingProjectsProps {
  projects: StackProject[];
  theme?: "dark" | "light";
}

/* giats.me projects treatment — a dark surface the dimmed image sits on. On
   giats the dark behind the 0.4-opacity image is a site-wide WebGL fluid shader;
   we substitute a solid dark fill so the white card copy reads at rest and the
   image brightens on hover. */
const GIATS_BG = "#0a0a0a";

/* ── Theme tokens ── */

const THEMES = {
  dark: {
    pageBg: "#000",
    frame: "#000",
    textPrimary: "#fff",
    textMuted: "rgba(255,255,255,0.4)",
    watermark: "rgba(255,255,255,0.03)",
    tagBorder: "rgba(255,255,255,0.12)",
    imageOpacity: 0.4,
    titleShadow: "0 2px 12px rgba(0,0,0,0.8)",
    vignetteDesktop:
      "linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.25) 55%, rgba(0,0,0,0.08) 100%)",
    vignetteMobile:
      "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.1) 100%)",
  },
  light: {
    pageBg: "#f4f3ee",
    frame: "#f4f3ee",
    textPrimary: "#161616",
    textMuted: "rgba(22,22,22,0.5)",
    watermark: "rgba(22,22,22,0.05)",
    tagBorder: "rgba(22,22,22,0.18)",
    imageOpacity: 0.95,
    titleShadow: "0 2px 14px rgba(244,243,238,0.7)",
    vignetteDesktop:
      "linear-gradient(to right, rgba(244,243,238,0.94) 0%, rgba(244,243,238,0.55) 48%, rgba(244,243,238,0.05) 100%)",
    vignetteMobile:
      "linear-gradient(to top, rgba(244,243,238,0.95) 0%, rgba(244,243,238,0.45) 42%, rgba(244,243,238,0.05) 100%)",
  },
} as const;

/* ── Component ── */

export default function ParallaxStackingProjects({
  projects,
  theme = "dark",
}: ParallaxStackingProjectsProps) {
  const t = THEMES[theme];
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [windowHeight, setWindowHeight] = useState(0);

  useEffect(() => {
    const update = () => {
      setIsMobile(window.innerWidth < 768);
      setWindowHeight(window.innerHeight);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Setup GSAP animations — matching giats.me exactly
  useEffect(() => {
    if (typeof window === "undefined" || !windowHeight) return;

    const root = rootRef.current;
    if (!root) return;

    const cardHeight = isMobile ? windowHeight * 0.5 : windowHeight;

    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        // Animate each canvas EXCEPT the last one (slice 0 to -1)
        canvasRefs.current.slice(0, -1).forEach((canvas, index) => {
          if (!canvas) return;

          gsap.set(canvas, { yPercent: 0 });

          gsap.timeline({
            scrollTrigger: {
              trigger: root,
              start: `top+=${cardHeight * index}`,
              end: `+=${cardHeight * (projects.length - 1)}`,
              scrub: true,
              invalidateOnRefresh: true,
            },
          }).to(canvas, {
            yPercent: 100,
            ease: "none",
          });
        });
      }, root);

      return () => ctx.revert();
    }, 200);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [windowHeight, isMobile, projects.length]);

  // Calculate projectsWrap height — giats.me formula
  const getProjectsWrapHeight = (index: number): string => {
    if (isMobile) {
      return index === projects.length - 1
        ? "150svh"
        : `${100 + 50 * index}svh`;
    }
    return index === projects.length - 1
      ? "200svh"
      : `${200 + 100 * index}svh`;
  };

  // Calculate projectsWrap top position
  const getProjectsWrapTop = (index: number): string => {
    if (isMobile) {
      if (index === projects.length - 1) return "-25svh";
      return index === 0 ? "0px" : "-50svh";
    }
    return index === 0 ? "0px" : "-100svh";
  };

  const padIndex = (i: number) => String(i + 1).padStart(2, "0");

  return (
    <section
      ref={rootRef}
      style={{
        position: "relative",
        width: "100%",
        display: "block",
        backgroundColor: t.pageBg,
        paddingLeft: isMobile ? "1rem" : "clamp(1rem, 4vw, 5rem)",
        paddingRight: isMobile ? "1rem" : "clamp(1rem, 4vw, 5rem)",
        paddingTop: 0,
        paddingBottom: isMobile ? "2rem" : "clamp(48px, 8vh, 120px)",
        contain: "paint",
      }}
    >
      {/* Inner Container */}
      <div
        style={{
          position: "relative",
          width: "100%",
          display: "block",
          margin: "0 auto",
          borderRadius: isMobile ? "0.75rem" : "1.5rem",
          boxShadow: `0 0 0 ${isMobile ? "0.75rem" : "1.5rem"} ${t.frame}`,
        }}
      >
        {projects.map((project, index) => (
          <Link
            key={project.id}
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${project.title}`}
            className="proj-card"
            style={{
              display: "block",
              position: "relative",
              width: "100%",
              height: isMobile ? "50svh" : "100svh",
              padding: 0,
              cursor: "pointer",
              contain: "paint", // CRUCIAL — clips both canvas AND sticky content
              // Dark surface the 0.4-opacity image sits on (giats has its fluid
              // shader here). Mobile keeps its own dimmed look over the frame.
              backgroundColor: isMobile ? undefined : GIATS_BG,
              borderRadius: isMobile ? "0.75rem" : 0,
              marginBottom:
                isMobile && index !== projects.length - 1 ? "1rem" : 0,
            }}
          >
            {/* ── Projects Wrap — contains sticky content, z-index: 1 (in front) ──
                This div is position: absolute and extends FAR beyond the card
                (via calculated height/top). The sticky child inside pins to the
                viewport while scrolling. Because the parent card has contain: paint,
                the sticky content is only VISIBLE within the card's bounds — creating
                the illusion that one front card swaps content as backgrounds change. */}
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                width: "100%",
                pointerEvents: "none",
                zIndex: 1,
                height: getProjectsWrapHeight(index),
                top: getProjectsWrapTop(index),
                willChange: "transform",
              }}
            >
              {/* Sticky Container — stays fixed while scrolling */}
              <div
                style={{
                  position: "sticky",
                  top: isMobile ? "25vh" : "0",
                  width: "100%",
                  height: isMobile ? "50svh" : "100svh",
                  transform: "translateZ(0)", // stacking context for sticky
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {isMobile ? (
                  /* ── Mobile layout ── */
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    {/* Watermark number */}
                    <div
                      style={{
                        position: "absolute",
                        top: 12,
                        right: 16,
                        fontFamily: "var(--font-monument), sans-serif",
                        fontWeight: 800,
                        fontSize: 100,
                        lineHeight: 1,
                        color: t.watermark,
                        userSelect: "none",
                        pointerEvents: "none",
                      }}
                    >
                      {padIndex(index)}
                    </div>

                    {/* Front image */}
                    <div
                      style={{
                        position: "absolute",
                        width: "83%",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -55%)",
                        aspectRatio: "16/9",
                      }}
                    >
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover"
                        style={{
                          borderRadius: "0.5rem",
                          boxShadow: "0 4px 30px rgba(0,0,0,0.5)",
                        }}
                        sizes="83vw"
                      />
                    </div>

                    {/* Bottom label */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        paddingBottom: 24,
                        gap: 4,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-geist-mono), monospace",
                          fontSize: 10,
                          letterSpacing: "0.25em",
                          textTransform: "uppercase",
                          color: t.textMuted,
                        }}
                      >
                        {project.year}
                      </span>
                      <h3
                        style={{
                          fontFamily: "var(--font-monument), sans-serif",
                          fontWeight: 800,
                          fontSize: 18,
                          color: t.textPrimary,
                          textAlign: "center",
                          margin: 0,
                          padding: "0 16px",
                          textShadow: t.titleShadow,
                        }}
                      >
                        {project.title}
                      </h3>
                    </div>
                  </div>
                ) : (
                  /* ── Desktop layout ── */
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      padding: "0 clamp(2rem, 8vw, 8rem)",
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      alignItems: "center",
                      boxSizing: "border-box",
                    }}
                  >
                    {/* Left: title & meta */}
                    <div
                      className="proj-text-group"
                      style={{
                        position: "relative",
                        display: "flex",
                        flexDirection: "column",
                        gap: 16,
                        zIndex: 1,
                      }}
                    >
                      {/* Watermark number */}
                      <div
                        style={{
                          position: "absolute",
                          top: "-3rem",
                          left: "-1rem",
                          fontFamily: "var(--font-monument), sans-serif",
                          fontWeight: 800,
                          fontSize: "clamp(150px, 18vw, 260px)",
                          lineHeight: 1,
                          /* white tones so the `difference` blend (below) stays
                             legible on any background — theme colour ignored here */
                          color: "rgba(255,255,255,0.07)",
                          userSelect: "none",
                          pointerEvents: "none",
                        }}
                      >
                        {padIndex(index)}
                      </div>

                      <span
                        style={{
                          fontFamily: "var(--font-geist-mono), monospace",
                          fontSize: 11,
                          letterSpacing: "0.3em",
                          textTransform: "uppercase",
                          color: "rgba(255,255,255,0.7)",
                        }}
                      >
                        {project.year}
                      </span>

                      <h3
                        style={{
                          fontFamily: "var(--font-monument), sans-serif",
                          fontWeight: 800,
                          fontSize: "clamp(2rem, 5vw, 5rem)",
                          lineHeight: 0.9,
                          textTransform: "uppercase",
                          color: "#ffffff",
                          margin: 0,
                        }}
                      >
                        {project.title}
                      </h3>

                      {project.tags && project.tags.length > 0 && (
                        <div
                          style={{
                            display: "flex",
                            gap: 8,
                            flexWrap: "wrap",
                            marginTop: 4,
                          }}
                        >
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              style={{
                                fontFamily:
                                  "var(--font-geist-mono), monospace",
                                fontSize: 10,
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                                padding: "4px 12px",
                                borderRadius: 999,
                                border: "1px solid rgba(255,255,255,0.3)",
                                color: "rgba(255,255,255,0.85)",
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Right: image preview */}
                    <div
                      style={{
                        position: "absolute",
                        right: "clamp(2rem, 8vw, 8rem)",
                        width: "48%",
                        aspectRatio: "1920/900",
                      }}
                    >
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover"
                        style={{
                          borderRadius: "0.75rem",
                          boxShadow: "0 8px 60px rgba(0,0,0,0.6)",
                        }}
                        sizes="50vw"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── Canvas — background image that peels downward ── */}
            <div
              ref={(el) => {
                canvasRefs.current[index] = el;
              }}
              className={!isMobile ? "proj-canvas" : ""}
              style={{
                position: "absolute",
                inset: 0,
                ...(isMobile && { opacity: t.imageOpacity }),
                willChange: "transform",
              }}
            >
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
                style={{
                  borderRadius: isMobile ? "0.75rem" : undefined,
                  borderTopLeftRadius:
                    !isMobile && index === 0 ? "1.5rem" : undefined,
                  borderTopRightRadius:
                    !isMobile && index === 0 ? "1.5rem" : undefined,
                  borderBottomLeftRadius:
                    !isMobile && index === projects.length - 1
                      ? "1.5rem"
                      : undefined,
                  borderBottomRightRadius:
                    !isMobile && index === projects.length - 1
                      ? "1.5rem"
                      : undefined,
                }}
                sizes="100vw"
                priority={index < 2}
              />
              {isMobile ? (
                /* Readability vignette (mobile only) */
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: t.vignetteMobile,
                  }}
                />
              ) : null}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
