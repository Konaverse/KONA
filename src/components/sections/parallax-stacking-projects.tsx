"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Play } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ── Types ── */

export interface StackProject {
  id: string;
  title: string;
  year: string;
  description: string;
  tags: string[];
  tech?: string[];
  image: string;
  href: string;
  linkLabel?: string;
  isVideo?: boolean;
  duration?: string;
}

interface ParallaxStackingProjectsProps {
  projects: StackProject[];
}

/* ── Animated film sweep keyframes (injected once) ── */
const FILM_SWEEP_STYLE_ID = "parallax-film-sweep";
if (typeof document !== "undefined" && !document.getElementById(FILM_SWEEP_STYLE_ID)) {
  const style = document.createElement("style");
  style.id = FILM_SWEEP_STYLE_ID;
  style.textContent = `
    @keyframes filmSweep {
      0%   { transform: translateX(-100%) translateY(-100%) rotate(-35deg); }
      100% { transform: translateX(200%) translateY(200%) rotate(-35deg); }
    }
  `;
  document.head.appendChild(style);
}

/* ── Per-project accent colors ── */
const PROJECT_ACCENTS = [
  "#4A9EFF",
  "#FF9F43",
  "#FF6B8A",
  "#FF4444",
  "#00D4AA",
  "#3B82F6",
  "#8B5CF6",
];

function getAccent(index: number) {
  return PROJECT_ACCENTS[index % PROJECT_ACCENTS.length];
}

const padIndex = (i: number) => String(i + 1).padStart(2, "0");

/* ── Component ── */

export default function ParallaxStackingProjects({
  projects,
}: ParallaxStackingProjectsProps) {
  const stickyRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
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

  useEffect(() => {
    if (!windowHeight) return;
    const sticky = stickyRef.current;
    if (!sticky) return;

    let ctx: ReturnType<typeof gsap.context> | null = null;

    const timer = setTimeout(() => {
      ctx = gsap.context(() => {
        // Pin the viewport for (N-1) full-height scroll segments.
        // Each card gets exactly one segment to animate out.
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sticky,
            pin: true,
            start: "top top",
            end: `+=${(projects.length - 1) * windowHeight}`,
            scrub: isMobile ? 0.4 : 0.6,
            invalidateOnRefresh: true,
          },
        });

        // Slide each card (except the last) upward out of view in sequence.
        cardRefs.current.forEach((card, i) => {
          if (!card || i === projects.length - 1) return;
          tl.to(card, { yPercent: -100, ease: "none", duration: 1 }, i);
        });
      });
    }, 200);

    return () => {
      clearTimeout(timer);
      ctx?.revert();
    };
  }, [windowHeight, isMobile, projects.length]);

  return (
    <section
      style={{
        backgroundColor: "#000000",
        overflowX: "clip",
      }}
    >
      {/* Glow blobs — rendered outside the pinned box so they scroll naturally */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        {projects.map((_, index) => {
          const accent = getAccent(index);
          const isEven = index % 2 === 0;
          const cardVh = isMobile ? 50 : 100;
          return (
            <React.Fragment key={`glow-${index}`}>
              <div
                style={{
                  position: "absolute",
                  top: `calc(${index} * ${cardVh}svh + ${cardVh * 0.15}svh)`,
                  left: isEven ? "-15%" : "auto",
                  right: isEven ? "auto" : "-15%",
                  width: isMobile ? "clamp(220px,90vw,380px)" : "clamp(500px,70vw,1100px)",
                  height: isMobile ? "clamp(220px,60vh,380px)" : "clamp(500px,70vh,1100px)",
                  background: `radial-gradient(ellipse at center,${accent}${isMobile?"30":"40"} 0%,${accent}${isMobile?"14":"20"} 30%,${accent}08 55%,transparent 75%)`,
                  filter: `blur(${isMobile ? 30 : 40}px)`,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: `calc(${index} * ${cardVh}svh + ${cardVh * 0.55}svh)`,
                  left: isEven ? "auto" : "-10%",
                  right: isEven ? "-10%" : "auto",
                  width: isMobile ? "clamp(160px,70vw,260px)" : "clamp(300px,45vw,700px)",
                  height: isMobile ? "clamp(160px,40vh,260px)" : "clamp(300px,45vh,700px)",
                  background: `radial-gradient(circle at center,${accent}${isMobile?"22":"30"} 0%,${accent}${isMobile?"0a":"12"} 40%,transparent 70%)`,
                  filter: `blur(${isMobile ? 35 : 50}px)`,
                }}
              />
            </React.Fragment>
          );
        })}
      </div>

      {/* ── Pinned viewport — GSAP takes ownership of stickiness ── */}
      <div
        ref={stickyRef}
        style={{
          position: "relative",
          width: "100%",
          height: "100svh",
          overflow: "hidden",
        }}
      >
        {/* SVG grid overlay */}
        <svg
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            opacity: 0.03,
            pointerEvents: "none",
            zIndex: 2,
          }}
        >
          <defs>
            <pattern id="stack-grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#stack-grid)" />
        </svg>

        {projects.map((project, index) => {
          const accent = getAccent(index);
          return (
            <div
              key={project.id}
              ref={(el) => { cardRefs.current[index] = el; }}
              style={{
                position: "absolute",
                inset: 0,
                // First card sits on top; each subsequent card is one layer lower.
                zIndex: projects.length - index,
              }}
            >
              {/* ── Background canvas ── */}
              <div style={{ position: "absolute", inset: 0, opacity: 0.45 }}>
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority={index < 2}
                />
                {/* Color shader */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: `linear-gradient(135deg,${accent}35 0%,${accent}10 30%,transparent 50%,${accent}08 75%,${accent}30 100%)`,
                    mixBlendMode: "screen",
                  }}
                />
                {/* Corner bloom */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: `radial-gradient(ellipse at ${index%2===0?"15% 85%":"85% 15%"},${accent}28 0%,${accent}10 30%,transparent 60%)`,
                  }}
                />
                {/* Top bleed */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: `linear-gradient(to bottom,${accent}15 0%,transparent 25%)`,
                  }}
                />
                {/* Film sweep — desktop only */}
                {!isMobile && (
                  <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "120%",
                        height: "300%",
                        background: `linear-gradient(90deg,transparent 0%,transparent 35%,${accent}08 40%,${accent}18 45%,rgba(255,255,255,0.06) 50%,${accent}18 55%,${accent}08 60%,transparent 65%,transparent 100%)`,
                        animation: `filmSweep ${8 + index * 1.5}s linear infinite`,
                        animationDelay: `${index * -2.5}s`,
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "120%",
                        height: "300%",
                        background: `linear-gradient(90deg,transparent 0%,transparent 44%,rgba(255,255,255,0.03) 48%,rgba(255,255,255,0.07) 50%,rgba(255,255,255,0.03) 52%,transparent 56%,transparent 100%)`,
                        animation: `filmSweep ${6 + index}s linear infinite`,
                        animationDelay: `${index * -1.8 + 3}s`,
                      }}
                    />
                  </div>
                )}
                {/* Readability gradient */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: isMobile
                      ? "linear-gradient(to top,rgba(0,0,0,0.85) 0%,rgba(0,0,0,0.35) 40%,rgba(0,0,0,0.1) 100%)"
                      : "linear-gradient(to right,rgba(0,0,0,0.75) 0%,rgba(0,0,0,0.3) 50%,rgba(0,0,0,0.08) 100%)",
                  }}
                />
              </div>

              {/* ── UI content ── */}
              {isMobile ? (
                /* Mobile layout */
                <div style={{ position: "relative", width: "100%", height: "100%", zIndex: 1 }}>
                  {/* Watermark number */}
                  <div
                    style={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      fontFamily: "var(--font-monument), sans-serif",
                      fontWeight: 800,
                      fontSize: 120,
                      lineHeight: 1,
                      color: "rgba(255,255,255,0.025)",
                      pointerEvents: "none",
                      userSelect: "none",
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
                      aspectRatio: project.isVideo ? "16/9" : "16/10",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        inset: "-1.5rem",
                        background: `radial-gradient(ellipse at 50% 50%,${accent}40 0%,${accent}20 35%,transparent 70%)`,
                        filter: "blur(12px)",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        inset: -2,
                        borderRadius: "0.6rem",
                        boxShadow: `0 0 20px ${accent}35,0 0 40px ${accent}20`,
                        border: `1px solid ${accent}25`,
                      }}
                    />
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover"
                      style={{ borderRadius: "0.5rem", boxShadow: `0 4px 30px rgba(0,0,0,0.3),0 0 40px ${accent}18` }}
                      sizes="83vw"
                    />
                    {project.isVideo && (
                      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ width: 48, height: 48, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,255,136,0.15)", backdropFilter: "blur(8px)", border: "1px solid rgba(0,255,136,0.3)" }}>
                          <Play className="w-5 h-5 ml-0.5" fill="#00ff88" color="#00ff88" />
                        </div>
                        {project.duration && (
                          <span style={{ position: "absolute", bottom: 8, right: 8, padding: "2px 8px", borderRadius: 4, fontFamily: "var(--font-geist-mono),monospace", fontSize: 10, background: "rgba(0,0,0,0.7)", color: "#00ff88" }}>
                            {project.duration}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Bottom text */}
                  <div style={{ position: "absolute", bottom: 0, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", paddingBottom: 16, gap: 4 }}>
                    <span style={{ fontFamily: "var(--font-geist-mono),monospace", fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "#00ff88" }}>
                      {project.year}
                    </span>
                    <h3 style={{ fontFamily: "var(--font-monument),sans-serif", fontWeight: 800, fontSize: 18, color: "#fff", textShadow: "0 2px 10px rgba(0,0,0,0.5)", textAlign: "center", padding: "0 16px", margin: 0 }}>
                      {project.title}
                    </h3>
                  </div>
                </div>
              ) : (
                /* Desktop layout */
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    zIndex: 1,
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    alignItems: "center",
                    padding: "0 clamp(2rem,8vw,8rem)",
                  }}
                >
                  {/* Left: details */}
                  <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 16, paddingRight: "clamp(2rem,6vw,6rem)" }}>
                    {/* Watermark number */}
                    <div
                      style={{
                        position: "absolute",
                        top: "-4rem",
                        left: "-1rem",
                        fontFamily: "var(--font-monument),sans-serif",
                        fontWeight: 800,
                        fontSize: "clamp(180px,20vw,300px)",
                        lineHeight: 1,
                        color: "rgba(255,255,255,0.025)",
                        pointerEvents: "none",
                        userSelect: "none",
                      }}
                    >
                      {padIndex(index)}
                    </div>

                    <span style={{ fontFamily: "var(--font-geist-mono),monospace", fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: "#00ff88" }}>
                      {project.year}
                    </span>

                    <h3 style={{ fontFamily: "var(--font-monument),sans-serif", fontWeight: 800, fontSize: "clamp(28px,4vw,56px)", lineHeight: 0.95, textTransform: "uppercase", color: "#fff", margin: 0 }}>
                      {project.title}
                    </h3>

                    <p style={{ fontFamily: "var(--font-geist-sans),sans-serif", fontSize: "clamp(0.8rem,1vw,1rem)", lineHeight: 1.7, color: "rgba(255,255,255,0.5)", maxWidth: 420, margin: 0 }}>
                      {project.description}
                    </p>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            fontFamily: "var(--font-geist-mono),monospace",
                            fontSize: 10,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            padding: "4px 12px",
                            borderRadius: 999,
                            border: "1px solid rgba(0,255,136,0.2)",
                            background: "rgba(0,255,136,0.05)",
                            color: "rgba(0,255,136,0.7)",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {project.tech && project.tech.length > 0 && (
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ fontFamily: "var(--font-geist-mono),monospace", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>
                          Built with
                        </span>
                        <div style={{ display: "flex", gap: 8 }}>
                          {project.tech.map((t) => (
                            <span key={t} style={{ fontFamily: "var(--font-geist-mono),monospace", fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <Link
                      href={project.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-2 group/link"
                    >
                      <span
                        className="text-sm tracking-wider uppercase transition-colors duration-300 group-hover/link:text-[#00ff88]"
                        style={{ fontFamily: "var(--font-geist-mono),monospace", color: "rgba(255,255,255,0.6)" }}
                      >
                        {project.linkLabel || "Visit Site"}
                      </span>
                      <ArrowUpRight className="w-4 h-4 text-[#00ff88] transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                    </Link>
                  </div>

                  {/* Right: image */}
                  <div
                    style={{
                      position: "absolute",
                      right: "clamp(2rem,8vw,8rem)",
                      width: "48%",
                      aspectRatio: project.isVideo ? "16/9" : "1920/1000",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        inset: "-4rem",
                        background: `radial-gradient(ellipse at 50% 50%,${accent}50 0%,${accent}28 30%,${accent}10 55%,transparent 75%)`,
                        filter: "blur(25px)",
                        pointerEvents: "none",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        inset: -4,
                        borderRadius: "0.9rem",
                        boxShadow: `0 0 30px ${accent}40,0 0 60px ${accent}25,0 0 120px ${accent}15`,
                        border: `1px solid ${accent}30`,
                        pointerEvents: "none",
                      }}
                    />
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover"
                      style={{ borderRadius: "0.75rem", boxShadow: `0 25px 80px rgba(0,0,0,0.7),0 0 50px ${accent}30,0 0 100px ${accent}18` }}
                      sizes="50vw"
                    />
                    {project.isVideo && (
                      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ width: 64, height: 64, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,255,136,0.12)", backdropFilter: "blur(12px)", border: "1px solid rgba(0,255,136,0.3)", boxShadow: "0 0 30px rgba(0,255,136,0.15)" }}>
                          <Play className="w-6 h-6 ml-0.5" fill="#00ff88" color="#00ff88" />
                        </div>
                        {project.duration && (
                          <span style={{ position: "absolute", bottom: 12, right: 12, padding: "4px 12px", borderRadius: 4, fontFamily: "var(--font-geist-mono),monospace", fontSize: 12, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", color: "#00ff88" }}>
                            {project.duration}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
