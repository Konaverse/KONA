"use client";

import { useEffect, useRef } from "react";
import SplitType from "split-type";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const NEON = "var(--color-green-neon)";

export default function BeatPromise() {
  const rootRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = headlineRef.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const split = new SplitType(el, { types: "words,chars", tagName: "span" });
    const words = split.words ?? [];

    if (reduced) {
      gsap.set(words, { opacity: 1, y: 0 });
      return () => split.revert();
    }

    gsap.set(words, { opacity: 0.08, y: 12 });

    const ctx = gsap.context(() => {
      gsap.to(words, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.06,
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 80%",
          end: "bottom 30%",
          scrub: 1,
        },
      });

      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: rootRef.current,
              start: "top 80%",
              end: "bottom 30%",
              scrub: 0.8,
            },
          }
        );
      }
    }, rootRef);

    return () => {
      ctx.revert();
      split.revert();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative w-full overflow-hidden"
      style={{ background: "var(--color-black)", paddingTop: "18vh", paddingBottom: "18vh" }}
    >
      {/* Faint green wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(0,255,136,0.04) 0%, transparent 70%)",
        }}
      />
      {/* Growing vertical neon line */}
      <div
        className="absolute left-5 md:left-10 top-[10vh] bottom-[10vh] w-px origin-top"
        ref={lineRef}
        style={{ background: NEON, opacity: 0.35 }}
        aria-hidden
      />

      <div className="relative z-[2] mx-auto max-w-[1400px] px-10 md:px-24">
        <h2
          ref={headlineRef}
          className="leading-[1.08]"
          style={{
            fontFamily: "var(--font-display-serif), serif",
            fontWeight: 300,
            fontSize: "clamp(28px, 4.6vw, 68px)",
            letterSpacing: "-0.015em",
            color: "var(--color-text-primary-dark)",
          }}
        >
          Every agency promises results. We promise
          {" "}
          <span style={{ color: "var(--color-green-neon)", fontStyle: "italic" }}>presence</span>
          — the kind a brand earns when every pixel, frame, and word is an argument for why they matter. We are two people, one standard, and a refusal to ship anything that blends in.
        </h2>
      </div>
    </section>
  );
}
