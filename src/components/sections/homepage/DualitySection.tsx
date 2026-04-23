"use client";

import { useRef, useLayoutEffect } from "react";
import Image from "next/image";
import { gsap } from "@/utils/gsap";

const ACCENT = "#6B7F62";

export default function DualitySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftImgRef = useRef<HTMLDivElement>(null);
  const rightImgRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial states immediately to prevent flash
      gsap.set(lineRef.current, { scaleY: 0, transformOrigin: "50% 50%" });
      gsap.set(textRef.current, { opacity: 0, y: 20 });

      const mm = gsap.matchMedia();

      // ── Desktop: opposite-direction parallax (convergence effect) ─────
      mm.add("(min-width: 768px)", () => {
        // Left image travels upward as you scroll (starts below, ends above)
        gsap.fromTo(
          leftImgRef.current,
          { yPercent: 7 },
          {
            yPercent: -7,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 2,
              invalidateOnRefresh: true,
            },
          }
        );

        // Right image travels downward (opposite direction)
        gsap.fromTo(
          rightImgRef.current,
          { yPercent: -7 },
          {
            yPercent: 7,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 2,
              invalidateOnRefresh: true,
            },
          }
        );
      });

      // ── Mobile: gentle uniform parallax ─────────────────────────────
      mm.add("(max-width: 767px)", () => {
        [leftImgRef.current, rightImgRef.current].forEach((img) => {
          gsap.fromTo(
            img,
            { yPercent: -4 },
            {
              yPercent: 4,
              ease: "none",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
                invalidateOnRefresh: true,
              },
            }
          );
        });
      });

      // ── Divider line: grows from center outward ──────────────────────
      gsap.to(lineRef.current, {
        scaleY: 1,
        ease: "power2.inOut",
        duration: 1.5,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 62%",
          toggleActions: "play none none none",
        },
      });

      // ── Statement text: fade + rise ──────────────────────────────────
      gsap.to(textRef.current, {
        opacity: 1,
        y: 0,
        ease: "power3.out",
        duration: 1.1,
        delay: 0.4,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 52%",
          toggleActions: "play none none none",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-[100dvh] bg-[#050505] overflow-hidden"
    >
      <div className="relative w-full h-full flex flex-col md:flex-row">

        {/* ── Left panel: Web Development / precision ──────────────── */}
        <div className="relative flex-1 overflow-hidden">
          <div
            ref={leftImgRef}
            className="absolute inset-0 scale-[1.18] will-change-transform"
          >
            <Image
              src="/General/aesth_corner_office.png"
              alt="Web development precision"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
              priority
            />
          </div>

          {/* Base overlay */}
          <div className="absolute inset-0 bg-black/50" />
          {/* Gradient toward divider — right edge darkens */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/55 pointer-events-none" />
          {/* Gradient toward divider — bottom edge darkens on mobile */}
          <div className="absolute inset-0 md:hidden bg-gradient-to-b from-transparent via-transparent to-black/55 pointer-events-none" />

          {/* Discipline label */}
          <div className="absolute bottom-7 md:bottom-12 left-6 sm:left-8 md:left-12 lg:left-16 z-10">
            <span className="font-mono text-[9px] md:text-[10px] tracking-[0.28em] uppercase text-white/30">
              Web Development
            </span>
          </div>
        </div>

        {/* ── Center: divider line + statement text ────────────────── */}
        <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">

          {/* Vertical divider — desktop only */}
          <div
            ref={lineRef}
            className="hidden md:block absolute top-0 bottom-0 w-px"
            style={{
              left: "50%",
              transformOrigin: "50% 50%",
              background: `linear-gradient(to bottom, transparent 0%, ${ACCENT}60 28%, ${ACCENT}60 72%, transparent 100%)`,
            }}
          />

          {/* Statement */}
          <div
            ref={textRef}
            className="relative z-10 text-center px-8 md:px-12"
          >
            <p
              className="font-display font-light text-[#f0ede8] uppercase leading-tight tracking-[0.04em]"
              style={{ fontSize: "clamp(1.05rem, 2.6vw, 1.9rem)" }}
            >
              Two disciplines.
              <br className="md:hidden" />
              {" "}
              <span style={{ color: ACCENT }}>One standard.</span>
            </p>
          </div>
        </div>

        {/* ── Right panel: Videography / light / motion ────────────── */}
        <div className="relative flex-1 overflow-hidden">
          <div
            ref={rightImgRef}
            className="absolute inset-0 scale-[1.18] will-change-transform"
          >
            <Image
              src="/Solutions/Videography/aesth_film_light.png"
              alt="Cinematic vision"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>

          {/* Base overlay */}
          <div className="absolute inset-0 bg-black/50" />
          {/* Gradient toward divider — left edge darkens */}
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-black/55 pointer-events-none" />
          {/* Gradient toward divider — top edge darkens on mobile */}
          <div className="absolute inset-0 md:hidden bg-gradient-to-t from-transparent via-transparent to-black/55 pointer-events-none" />

          {/* Discipline label */}
          <div className="absolute bottom-7 md:bottom-12 right-6 sm:right-8 md:right-12 lg:right-16 z-10 text-right">
            <span className="font-mono text-[9px] md:text-[10px] tracking-[0.28em] uppercase text-white/30">
              Videography
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
