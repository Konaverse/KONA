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
  "#4A9EFF", // 01 — steel blue
  "#FF9F43", // 02 — amber
  "#FF6B8A", // 03 — rose
  "#FF4444", // 04 — crimson
  "#00D4AA", // 05 — teal
  "#3B82F6", // 06 — electric blue
  "#8B5CF6", // 07 — violet
];

function getAccent(index: number) {
  return PROJECT_ACCENTS[index % PROJECT_ACCENTS.length];
}

/* ── Component ── */

export default function ParallaxStackingProjects({
  projects,
}: ParallaxStackingProjectsProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [windowHeight, setWindowHeight] = useState(0);

  useEffect(() => {
    const updateSize = () => {
      setIsMobile(window.innerWidth < 768);
      setWindowHeight(window.innerHeight);
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // GSAP scroll-driven stacking animation
  useEffect(() => {
    if (typeof window === "undefined" || !windowHeight) return;
    const root = rootRef.current;
    if (!root) return;

    const cardHeight = isMobile ? windowHeight * 0.5 : windowHeight;

    // Hold ctx outside the timeout so cleanup can revert it.
    // (return inside setTimeout is ignored by JS — that was a silent bug)
    // Also: never use ScrollTrigger.getAll().kill() — it nukes every trigger
    // on the page including the Hero frame scrub.
    let gsapCtx: ReturnType<typeof gsap.context> | null = null;

    const timer = setTimeout(() => {
      gsapCtx = gsap.context(() => {
        canvasRefs.current.forEach((canvas, index) => {
          if (!canvas) return;
          gsap.set(canvas, { yPercent: 0 });
          gsap.timeline({
            scrollTrigger: {
              trigger: root,
              start: `top+=${cardHeight * index}`,
              end: `+=${cardHeight * (projects.length - 1)}`,
              // Mobile: tighter scrub so cards track the finger, not lag behind
              scrub: isMobile ? 0.4 : 0.5,
              invalidateOnRefresh: true,
            },
          }).to(canvas, {
            yPercent: 100,
            ease: "none",
          });
        });
      }, root);
    }, 200);

    return () => {
      clearTimeout(timer);
      gsapCtx?.revert();
    };
  }, [windowHeight, isMobile, projects.length]);

  /* ── Sticky wrapper helpers ── */
  const getWrapHeight = (index: number): string => {
    if (isMobile) {
      return index === projects.length - 1
        ? "150svh"
        : `${100 + 50 * index}svh`;
    }
    return index === projects.length - 1
      ? "200svh"
      : `${200 + 100 * index}svh`;
  };

  const getWrapTop = (index: number): string => {
    if (isMobile) {
      return index === 0 ? "0px" : "-50svh";
    }
    return index === 0 ? "0px" : "-100svh";
  };

  const padIndex = (i: number) => String(i + 1).padStart(2, "0");

  return (
    <section
      ref={rootRef}
      className="relative w-full block"
      style={{
        backgroundColor: "#000000",
        paddingLeft: isMobile ? 0 : "clamp(1rem, 4vw, 5rem)",
        paddingRight: isMobile ? 0 : "clamp(1rem, 4vw, 5rem)",
        paddingTop: isMobile ? 0 : "3rem",
        paddingBottom: isMobile ? 0 : "3rem",
        overflowX: "clip",
      }}
    >
      {/* SVG grid overlay */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none z-[2]">
        <defs>
          <pattern
            id="stack-grid"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 80 0 L 0 0 0 80"
              fill="none"
              stroke="white"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#stack-grid)" />
      </svg>

      {/* ── Glow blobs — desktop: massive; mobile: smaller, 50svh spacing ── */}
      {projects.map((_, index) => {
        const accent = getAccent(index);
        const isEven = index % 2 === 0;
        const cardVh = isMobile ? 50 : 100;
        return (
          <React.Fragment key={`glow-${index}`}>
            {/* Primary glow — alternates sides */}
            <div
              className="absolute pointer-events-none"
              style={{
                top: `calc(${index} * ${cardVh}svh + ${cardVh * 0.15}svh)`,
                left: isEven ? "-15%" : "auto",
                right: isEven ? "auto" : "-15%",
                width: isMobile ? "clamp(220px, 90vw, 380px)" : "clamp(500px, 70vw, 1100px)",
                height: isMobile ? "clamp(220px, 60vh, 380px)" : "clamp(500px, 70vh, 1100px)",
                background: `radial-gradient(ellipse at center, ${accent}${isMobile ? "30" : "40"} 0%, ${accent}${isMobile ? "14" : "20"} 30%, ${accent}08 55%, transparent 75%)`,
                filter: `blur(${isMobile ? 30 : 40}px)`,
                zIndex: 0,
              }}
            />
            {/* Secondary glow — opposite side */}
            <div
              className="absolute pointer-events-none"
              style={{
                top: `calc(${index} * ${cardVh}svh + ${cardVh * 0.55}svh)`,
                left: isEven ? "auto" : "-10%",
                right: isEven ? "-10%" : "auto",
                width: isMobile ? "clamp(160px, 70vw, 260px)" : "clamp(300px, 45vw, 700px)",
                height: isMobile ? "clamp(160px, 40vh, 260px)" : "clamp(300px, 45vh, 700px)",
                background: `radial-gradient(circle at center, ${accent}${isMobile ? "22" : "30"} 0%, ${accent}${isMobile ? "0a" : "12"} 40%, transparent 70%)`,
                filter: `blur(${isMobile ? 35 : 50}px)`,
                zIndex: 0,
              }}
            />
            {/* Center bloom */}
            <div
              className="absolute pointer-events-none"
              style={{
                top: `calc(${index} * ${cardVh}svh + ${cardVh * 0.35}svh)`,
                left: "50%",
                transform: "translateX(-50%)",
                width: isMobile ? "clamp(200px, 80vw, 340px)" : "clamp(400px, 60vw, 900px)",
                height: isMobile ? "clamp(100px, 25vh, 180px)" : "clamp(200px, 30vh, 400px)",
                background: `radial-gradient(ellipse at center, ${accent}${isMobile ? "14" : "18"} 0%, transparent 60%)`,
                filter: `blur(${isMobile ? 25 : 30}px)`,
                zIndex: 0,
              }}
            />
          </React.Fragment>
        );
      })}

      {/* Inner container */}
      <div
        className="relative w-full block mx-auto"
        style={{
          borderRadius: isMobile ? 0 : "1.25rem",
          overflow: "clip",
        }}
      >
        {projects.map((project, index) => (
          <div
            key={project.id}
            className="block relative w-full"
            style={{
              height: isMobile ? "50svh" : "100svh",
              padding: 0,
              contain: "paint",
              borderRadius: 0,
              marginBottom: 0,
            }}
          >
            {/* ── Front content layer ── */}
            {/* ── Sticky content layer (z-index: 1, in front) ── */}
            <div
              className="absolute left-0 right-0 w-full pointer-events-none"
              style={{
                zIndex: 1,
                height: getWrapHeight(index),
                top: getWrapTop(index),
                willChange: isMobile ? "auto" : "transform",
              }}
            >
              <div
                className={`sticky w-full ${isMobile ? "top-[25vh]" : "top-0"}`}
                style={{
                  height: isMobile ? "50svh" : "100svh",
                  transform: "translateZ(0)",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {isMobile ? (
                  /* ── MOBILE layout ── */
                  <div className="relative w-full h-full pointer-events-auto">
                {/* Faded watermark number */}
                <div
                  className="absolute top-4 right-4 select-none pointer-events-none"
                  style={{
                    fontFamily: "var(--font-monument), sans-serif",
                    fontWeight: 800,
                    fontSize: "120px",
                    lineHeight: 1,
                    color: "rgba(255,255,255,0.025)",
                  }}
                >
                  {padIndex(index)}
                </div>

                {/* Front image */}
                <div
                  className="absolute"
                  style={{
                    width: "83%",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -55%)",
                    aspectRatio: project.isVideo ? "16 / 9" : "16 / 10",
                  }}
                >
                  {/* Glow halo behind the front image (mobile) */}
                  <div
                    className="absolute pointer-events-none"
                    style={{
                      inset: "-1.5rem",
                      background: `radial-gradient(ellipse at 50% 50%, ${getAccent(index)}40 0%, ${getAccent(index)}20 35%, transparent 70%)`,
                      filter: "blur(12px)",
                    }}
                  />
                  {/* Tight glow ring */}
                  <div
                    className="absolute -inset-[2px] rounded-[0.6rem] pointer-events-none"
                    style={{
                      boxShadow: `0 0 20px ${getAccent(index)}35, 0 0 40px ${getAccent(index)}20`,
                      border: `1px solid ${getAccent(index)}25`,
                    }}
                  />
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                    style={{
                      borderRadius: "0.5rem",
                      boxShadow: `0 4px 30px rgba(0,0,0,0.3), 0 0 40px ${getAccent(index)}18`,
                    }}
                    sizes="83vw"
                  />
                  {project.isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{
                          background: "rgba(0,255,136,0.15)",
                          backdropFilter: "blur(8px)",
                          border: "1px solid rgba(0,255,136,0.3)",
                        }}
                      >
                        <Play
                          className="w-5 h-5 ml-0.5"
                          fill="#00ff88"
                          color="#00ff88"
                        />
                      </div>
                      {project.duration && (
                        <span
                          className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px]"
                          style={{
                            fontFamily:
                              "var(--font-geist-mono), monospace",
                            background: "rgba(0,0,0,0.7)",
                            color: "#00ff88",
                          }}
                        >
                          {project.duration}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom text */}
                <div
                  className="absolute w-full flex flex-col items-center justify-end pb-4"
                  style={{ height: "100%", gap: "0.25rem" }}
                >
                  <span
                    className="text-[10px] tracking-[0.25em] uppercase"
                    style={{
                      fontFamily: "var(--font-geist-mono), monospace",
                      color: "#00ff88",
                    }}
                  >
                    {project.year}
                  </span>
                  <h3
                    className="text-lg text-center px-4"
                    style={{
                      fontFamily: "var(--font-monument), sans-serif",
                      fontWeight: 800,
                      color: "#ffffff",
                      textShadow: "0 2px 10px rgba(0,0,0,0.5)",
                    }}
                  >
                    {project.title}
                  </h3>
                </div>
                </div>
                ) : (
                  /* ── DESKTOP layout ── */
                  <div className="w-full h-full px-8 lg:px-16 grid grid-cols-2 items-center pointer-events-auto">
                    {/* Left: project details */}
                    <div className="flex flex-col gap-4 z-10 pr-8 lg:pr-12 relative">
                      {/* Faded watermark number */}
                      <div
                        className="absolute -top-16 -left-4 select-none pointer-events-none"
                        style={{
                          fontFamily: "var(--font-monument), sans-serif",
                          fontWeight: 800,
                          fontSize: "clamp(180px, 20vw, 300px)",
                          lineHeight: 1,
                          color: "rgba(255,255,255,0.025)",
                        }}
                      >
                        {padIndex(index)}
                      </div>

                      {/* Year */}
                      <span
                        className="text-[11px] tracking-[0.3em] uppercase"
                        style={{
                          fontFamily: "var(--font-geist-mono), monospace",
                          color: "#00ff88",
                        }}
                      >
                        {project.year}
                      </span>

                      {/* Title */}
                      <h3
                        className="leading-[0.95] uppercase"
                        style={{
                          fontFamily: "var(--font-monument), sans-serif",
                          fontWeight: 800,
                          fontSize: "clamp(28px, 4vw, 56px)",
                          color: "#ffffff",
                        }}
                      >
                        {project.title}
                      </h3>

                      {/* Description */}
                      <p
                        className="text-sm lg:text-base leading-relaxed max-w-md"
                        style={{
                          fontFamily: "var(--font-geist-sans), sans-serif",
                          color: "rgba(255,255,255,0.5)",
                        }}
                      >
                        {project.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mt-1">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 rounded-full text-[10px] tracking-wider uppercase"
                            style={{
                              fontFamily:
                                "var(--font-geist-mono), monospace",
                              border: "1px solid rgba(0,255,136,0.2)",
                              background: "rgba(0,255,136,0.05)",
                              color: "rgba(0,255,136,0.7)",
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Tech stack */}
                      {project.tech && project.tech.length > 0 && (
                        <div className="flex items-center gap-3 mt-1">
                          <span
                            className="text-[10px] tracking-wider uppercase"
                            style={{
                              fontFamily:
                                "var(--font-geist-mono), monospace",
                              color: "rgba(255,255,255,0.3)",
                            }}
                          >
                            Built with
                          </span>
                          <div className="flex gap-2">
                            {project.tech.map((t) => (
                              <span
                                key={t}
                                className="text-[11px]"
                                style={{
                                  fontFamily:
                                    "var(--font-geist-mono), monospace",
                                  color: "rgba(255,255,255,0.4)",
                                }}
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* CTA link */}
                      <Link
                        href={project.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-2 group/link"
                      >
                        <span
                          className="text-sm tracking-wider uppercase transition-colors duration-300 group-hover/link:text-[#00ff88]"
                          style={{
                            fontFamily:
                              "var(--font-geist-mono), monospace",
                            color: "rgba(255,255,255,0.6)",
                          }}
                        >
                          {project.linkLabel || "Visit Site"}
                        </span>
                        <ArrowUpRight className="w-4 h-4 text-[#00ff88] transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                      </Link>
                    </div>

                    {/* Right: project image */}
                    <div
                      className="relative"
                      style={{
                        position: "absolute",
                        right: "4rem",
                        width: "48%",
                        aspectRatio: project.isVideo
                          ? "16 / 9"
                          : "1920 / 1000",
                      }}
                    >
                      {/* Massive glow halo behind the image */}
                      <div
                        className="absolute pointer-events-none"
                        style={{
                          inset: "-4rem",
                          background: `radial-gradient(ellipse at 50% 50%, ${getAccent(index)}50 0%, ${getAccent(index)}28 30%, ${getAccent(index)}10 55%, transparent 75%)`,
                          filter: "blur(25px)",
                        }}
                      />
                      {/* Tight glow ring around image */}
                      <div
                        className="absolute -inset-1 rounded-[0.9rem] pointer-events-none"
                        style={{
                          boxShadow: `0 0 30px ${getAccent(index)}40, 0 0 60px ${getAccent(index)}25, 0 0 120px ${getAccent(index)}15`,
                          border: `1px solid ${getAccent(index)}30`,
                        }}
                      />
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover"
                        style={{
                          borderRadius: "0.75rem",
                          boxShadow: `0 25px 80px rgba(0,0,0,0.7), 0 0 50px ${getAccent(index)}30, 0 0 100px ${getAccent(index)}18`,
                        }}
                        sizes="50vw"
                      />
                      {project.isVideo && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div
                            className="w-16 h-16 rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-110"
                            style={{
                              background: "rgba(0,255,136,0.12)",
                              backdropFilter: "blur(12px)",
                              border: "1px solid rgba(0,255,136,0.3)",
                              boxShadow:
                                "0 0 30px rgba(0,255,136,0.15)",
                            }}
                          >
                            <Play
                              className="w-6 h-6 ml-0.5"
                              fill="#00ff88"
                              color="#00ff88"
                            />
                          </div>
                          {project.duration && (
                            <span
                              className="absolute bottom-3 right-3 px-3 py-1 rounded text-xs"
                              style={{
                                fontFamily:
                                  "var(--font-geist-mono), monospace",
                                background: "rgba(0,0,0,0.7)",
                                backdropFilter: "blur(4px)",
                                color: "#00ff88",
                              }}
                            >
                              {project.duration}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── Canvas — background image that peels away ── */}
            <div className="absolute inset-0 overflow-hidden">
              <div
                ref={(el) => {
                  canvasRefs.current[index] = el;
                }}
                className="absolute inset-0 transition-opacity duration-500"
                style={{ opacity: 0.45, willChange: "transform" }}
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority={index < 2}
                />
                {/* Color shader overlay — strong tint per project */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, ${getAccent(index)}35 0%, ${getAccent(index)}10 30%, transparent 50%, ${getAccent(index)}08 75%, ${getAccent(index)}30 100%)`,
                    mixBlendMode: "screen",
                  }}
                />
                {/* Corner color wash — big radial bloom */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `radial-gradient(ellipse at ${index % 2 === 0 ? "15% 85%" : "85% 15%"}, ${getAccent(index)}28 0%, ${getAccent(index)}10 30%, transparent 60%)`,
                  }}
                />
                {/* Top edge color bleed */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(to bottom, ${getAccent(index)}15 0%, transparent 25%)`,
                  }}
                />
                {/* Animated diagonal film sweep — desktop only */}
                {!isMobile && (
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ overflow: "hidden" }}
                >
                  {/* Primary sweep — wide colored band */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "120%",
                      height: "300%",
                      background: `linear-gradient(
                        90deg,
                        transparent 0%,
                        transparent 35%,
                        ${getAccent(index)}08 40%,
                        ${getAccent(index)}18 45%,
                        rgba(255,255,255,0.06) 50%,
                        ${getAccent(index)}18 55%,
                        ${getAccent(index)}08 60%,
                        transparent 65%,
                        transparent 100%
                      )`,
                      animation: `filmSweep ${8 + index * 1.5}s linear infinite`,
                      animationDelay: `${index * -2.5}s`,
                    }}
                  />
                  {/* Secondary sweep — thinner, faster, subtle white */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "120%",
                      height: "300%",
                      background: `linear-gradient(
                        90deg,
                        transparent 0%,
                        transparent 44%,
                        rgba(255,255,255,0.03) 48%,
                        rgba(255,255,255,0.07) 50%,
                        rgba(255,255,255,0.03) 52%,
                        transparent 56%,
                        transparent 100%
                      )`,
                      animation: `filmSweep ${6 + index}s linear infinite`,
                      animationDelay: `${index * -1.8 + 3}s`,
                    }}
                  />
                </div>
                )}
                {/* Dark gradient overlay for text readability */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: isMobile
                      ? "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.1) 100%)"
                      : "linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)",
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
