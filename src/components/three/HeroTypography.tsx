"use client";

import React, { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import gsap from "gsap";

interface HeroTypographyProps {
  visible: boolean;
  mouseRef?: React.RefObject<{ x: number; y: number } | null>;
}

function LetterSpans({
  text,
  dataWord,
}: {
  text: string;
  dataWord: string;
}) {
  return (
    <span data-word={dataWord} className="inline-block">
      {text.split("").map((char, i) => (
        <span
          key={i}
          className="inline-block"
          style={{ opacity: 0, transform: "translateY(20px)", filter: "blur(8px)" }}
        >
          {char}
        </span>
      ))}
    </span>
  );
}

export interface HeroTypographyRef {
  exitTimeline: gsap.core.Timeline | null;
}

export default forwardRef<HeroTypographyRef, HeroTypographyProps>(
  ({ visible, mouseRef }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const innerRef = useRef<HTMLDivElement>(null);
    const hasAnimated = useRef(false);
    const timelineRef = useRef<gsap.core.Timeline | null>(null);
    const exitTimelineRef = useRef<gsap.core.Timeline | null>(null);

    useImperativeHandle(ref, () => ({
      get exitTimeline() { return exitTimelineRef.current; },
    }));

    // Typography reveal animation
    useEffect(() => {
      if (!visible || hasAnimated.current || !containerRef.current) return;
      hasAnimated.current = true;

      const container = containerRef.current;
      const konaLetters = container.querySelectorAll("[data-word='kona'] > span");
      const verseLetters = container.querySelectorAll("[data-word='verse'] > span");
      const tagline = container.querySelector("[data-tagline]");
      const line = container.querySelector("[data-line]");

      const tl = gsap.timeline();
      timelineRef.current = tl;

      // Phase 1: KONA letters
      tl.to(konaLetters, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.6,
        stagger: 0.08,
        ease: "power3.out",
      });

      // Phase 2: VERSE letters (overlap)
      tl.to(
        verseLetters,
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.6,
          stagger: 0.08,
          ease: "power3.out",
        },
        "-=0.3"
      );

      // Phase 3: Tagline
      tl.to(
        tagline,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.1"
      );

      // Phase 4: Decorative line
      tl.to(
        line,
        {
          scaleX: 1,
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
        },
        "-=0.4"
      );

      // Hero Exit Sequence (Dispersal)
      // Stored in its own ref so scroll orchestration can scrub it directly
      const exitTl = gsap.timeline({ paused: true });
      exitTl.to(konaLetters, {
        x: -120,
        opacity: 0,
        filter: "blur(12px)",
        stagger: 0.03,
        duration: 1,
        ease: "power3.inOut",
        immediateRender: false,
      });
      exitTl.to(
        verseLetters,
        {
          x: 120,
          opacity: 0,
          filter: "blur(12px)",
          stagger: 0.03,
          duration: 1,
          ease: "power3.inOut",
          immediateRender: false,
        },
        "<"
      );
      exitTl.to(
        tagline,
        {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: "power2.inOut",
          immediateRender: false,
        },
        "<0.1"
      );
      exitTl.to(
        line,
        {
          scaleX: 0,
          opacity: 0,
          duration: 0.6,
          ease: "power2.inOut",
          immediateRender: false,
        },
        "<"
      );

      exitTimelineRef.current = exitTl;
    }, [visible]);

    // Parallax depth shift — subtle opposite-direction offset from cursor
    useEffect(() => {
      if (!mouseRef) return;

      let rafId: number;
      let currentX = 0;
      let currentY = 0;

      const updateParallax = () => {
        rafId = requestAnimationFrame(updateParallax);
        const inner = innerRef.current;
        const mouse = mouseRef.current;
        if (!inner || !mouse) return;

        // Shift opposite to mouse, max ~4px horizontal, ~3px vertical
        const targetX = -mouse.x * 4;
        const targetY = -mouse.y * 3;

        // Smooth interpolation (fixed factor — visually identical at 60/120fps for this scale)
        currentX += (targetX - currentX) * 0.06;
        currentY += (targetY - currentY) * 0.06;

        inner.style.transform = `translate(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px)`;
      };

      rafId = requestAnimationFrame(updateParallax);
      return () => cancelAnimationFrame(rafId);
    }, [mouseRef]);

    return (
      <div
        ref={containerRef}
        className="absolute inset-0 z-10 pointer-events-none flex items-center"
      >
        <div
          ref={innerRef}
          className="max-w-[55%] pl-[clamp(2rem,6vw,6rem)] max-md:max-w-full max-md:pl-0 max-md:text-center max-md:w-full max-md:px-4"
        >
          {/* KONA */}
          <div
            className="font-monument leading-[0.9] tracking-[-0.02em]"
            style={{
              fontSize: "clamp(3rem, 10vw, 9rem)",
              color: "#f0fff4",
              fontWeight: 800,
            }}
          >
            <LetterSpans text="KONA" dataWord="kona" />
          </div>

          {/* VERSE */}
          <div
            className="font-monument leading-[0.9] tracking-[-0.02em] ml-[clamp(1rem,4vw,4rem)] max-md:ml-0"
            style={{
              fontSize: "clamp(3rem, 10vw, 9rem)",
              color: "#f0fff4",
              fontWeight: 800,
            }}
          >
            <LetterSpans text="VERSE" dataWord="verse" />
          </div>

          {/* Tagline */}
          <p
            data-tagline
            className="font-mono text-[clamp(0.65rem,1.2vw,0.9rem)] tracking-[0.3em] uppercase mt-6 max-md:mt-4"
            style={{ color: "#00ff88", opacity: 0, transform: "translateY(10px)" }}
          >
            Architects of Digital Experience
          </p>

          {/* Decorative line */}
          <div
            data-line
            className="h-[2px] w-[clamp(4rem,12vw,10rem)] mt-4 origin-left max-md:mx-auto"
            style={{
              background: "linear-gradient(to right, #00ff88, transparent)",
              transform: "scaleX(0)",
              opacity: 0,
            }}
          />
        </div>
      </div>
    );
  }
);

