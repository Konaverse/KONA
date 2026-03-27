"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { X } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ── Types ── */

export interface SocialShowcaseProject {
  id: string;
  title: string;
  year: string;
  description: string;
  tags: string[];
  platforms: string[];
  images: [string, string, string, string];
  metrics: { impressions: string; reach: string; engagement: string };
}

interface SocialMediaShowcaseProps {
  projects: SocialShowcaseProject[];
}

/* ── Component ── */

export default function SocialMediaShowcase({
  projects,
}: SocialMediaShowcaseProps) {
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  // GSAP entrance animations
  useEffect(() => {
    if (typeof window === "undefined") return;

    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        sectionRefs.current.forEach((section) => {
          if (!section) return;

          const images = section.querySelectorAll(".showcase-image");
          const info = section.querySelector(".showcase-info");
          const metrics = section.querySelectorAll(".showcase-metric");

          gsap.set(images, { opacity: 0, scale: 0.92, y: 30 });
          gsap.set(info, { opacity: 0, y: 40 });
          gsap.set(metrics, { opacity: 0, y: 20 });

          ScrollTrigger.create({
            trigger: section,
            start: "top 75%",
            onEnter: () => {
              gsap.to(info, {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: "power3.out",
              });
              gsap.to(images, {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.12,
                ease: "power3.out",
                delay: 0.15,
              });
              gsap.to(metrics, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.08,
                ease: "power2.out",
                delay: 0.4,
              });
            },
          });
        });
      });

      return () => ctx.revert();
    }, 200);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [projects.length]);

  const padIndex = (i: number) => String(i + 1).padStart(2, "0");

  return (
    <section className="relative" style={{ backgroundColor: "#000000" }}>
      {/* SVG grid overlay */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none">
        <defs>
          <pattern
            id="social-grid"
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
        <rect width="100%" height="100%" fill="url(#social-grid)" />
      </svg>

      {projects.map((project, index) => (
        <div
          key={project.id}
          ref={(el) => {
            sectionRefs.current[index] = el;
          }}
          className="relative"
        >
          {/* Divider line between clients */}
          {index > 0 && (
            <div
              className="w-full h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(0,255,136,0.15) 30%, rgba(0,255,136,0.15) 70%, transparent 100%)",
              }}
            />
          )}

          <div className="relative px-6 md:px-8 lg:px-16 py-20 md:py-32">
            {/* Faded watermark number */}
            <div
              className="absolute top-8 md:top-12 left-6 md:left-8 lg:left-16 select-none pointer-events-none"
              style={{
                fontFamily: "var(--font-monument), sans-serif",
                fontWeight: 800,
                fontSize: "clamp(120px, 18vw, 280px)",
                lineHeight: 1,
                color: "rgba(255,255,255,0.02)",
              }}
            >
              {padIndex(index)}
            </div>

            {/* Desktop: two columns / Mobile: stacked */}
            <div className="relative grid grid-cols-1 lg:grid-cols-[40%_1fr] gap-12 lg:gap-16 items-start">
              {/* ── Left: Client info ── */}
              <div className="showcase-info flex flex-col gap-5 lg:sticky lg:top-32">
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

                {/* Client name */}
                <h2
                  className="leading-[0.95] uppercase"
                  style={{
                    fontFamily: "var(--font-monument), sans-serif",
                    fontWeight: 800,
                    fontSize: "clamp(28px, 5vw, 52px)",
                    color: "#ffffff",
                  }}
                >
                  {project.title}
                </h2>

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

                {/* Platform pills */}
                <div className="flex flex-wrap gap-2">
                  {project.platforms.map((platform) => (
                    <span
                      key={platform}
                      className="px-3 py-1.5 rounded-full text-[11px] tracking-wider uppercase"
                      style={{
                        fontFamily: "var(--font-geist-mono), monospace",
                        backdropFilter: "blur(12px)",
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.06)",
                        color: "rgba(255,255,255,0.6)",
                      }}
                    >
                      {platform}
                    </span>
                  ))}
                </div>

                {/* Metrics row */}
                <div className="grid grid-cols-3 gap-3 mt-2">
                  {[
                    { label: "Impressions", value: project.metrics.impressions },
                    { label: "Reach", value: project.metrics.reach },
                    { label: "Engagement", value: project.metrics.engagement },
                  ].map((metric) => (
                    <div
                      key={metric.label}
                      className="showcase-metric rounded-lg px-3 py-3 text-center"
                      style={{
                        backdropFilter: "blur(12px)",
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <div
                        className="text-lg md:text-xl font-bold"
                        style={{
                          fontFamily: "var(--font-monument), sans-serif",
                          fontWeight: 800,
                          color: "#00ff88",
                        }}
                      >
                        {metric.value}
                      </div>
                      <div
                        className="text-[9px] tracking-[0.2em] uppercase mt-1"
                        style={{
                          fontFamily: "var(--font-geist-mono), monospace",
                          color: "rgba(255,255,255,0.35)",
                        }}
                      >
                        {metric.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Service tags */}
                <div className="flex flex-wrap gap-2 mt-1">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-[10px] tracking-wider uppercase"
                      style={{
                        fontFamily: "var(--font-geist-mono), monospace",
                        border: "1px solid rgba(0,255,136,0.2)",
                        background: "rgba(0,255,136,0.05)",
                        color: "rgba(0,255,136,0.7)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* ── Right: Offset masonry grid ── */}
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                {/* Column 1 */}
                <div className="flex flex-col gap-3 md:gap-4">
                  <button
                    onClick={() => setLightboxSrc(project.images[0])}
                    className="showcase-image relative overflow-hidden rounded-xl cursor-pointer group"
                    style={{ aspectRatio: "4 / 5" }}
                  >
                    <Image
                      src={project.images[0]}
                      alt={`${project.title} post 1`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(min-width: 1024px) 30vw, 45vw"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  </button>
                  <button
                    onClick={() => setLightboxSrc(project.images[1])}
                    className="showcase-image relative overflow-hidden rounded-xl cursor-pointer group"
                    style={{ aspectRatio: "1 / 1" }}
                  >
                    <Image
                      src={project.images[1]}
                      alt={`${project.title} post 2`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(min-width: 1024px) 30vw, 45vw"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  </button>
                </div>
                {/* Column 2 — offset down */}
                <div className="flex flex-col gap-3 md:gap-4 mt-8 md:mt-12">
                  <button
                    onClick={() => setLightboxSrc(project.images[2])}
                    className="showcase-image relative overflow-hidden rounded-xl cursor-pointer group"
                    style={{ aspectRatio: "1 / 1" }}
                  >
                    <Image
                      src={project.images[2]}
                      alt={`${project.title} post 3`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(min-width: 1024px) 30vw, 45vw"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  </button>
                  <button
                    onClick={() => setLightboxSrc(project.images[3])}
                    className="showcase-image relative overflow-hidden rounded-xl cursor-pointer group"
                    style={{ aspectRatio: "4 / 5" }}
                  >
                    <Image
                      src={project.images[3]}
                      alt={`${project.title} post 4`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(min-width: 1024px) 30vw, 45vw"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* ── Lightbox ── */}
      {lightboxSrc && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.92)" }}
          onClick={() => setLightboxSrc(null)}
        >
          <button
            onClick={() => setLightboxSrc(null)}
            className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center z-[101]"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <X className="w-5 h-5 text-white/70" />
          </button>
          <div
            className="relative w-[90vw] max-w-lg"
            style={{ aspectRatio: "4 / 5" }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightboxSrc}
              alt="Enlarged post"
              fill
              className="object-contain rounded-lg"
              sizes="90vw"
            />
          </div>
        </div>
      )}
    </section>
  );
}
