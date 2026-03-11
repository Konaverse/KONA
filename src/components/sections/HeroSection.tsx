"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";

const BRAND_EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const konaRef = useRef<HTMLDivElement>(null);
  const verseRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Set initial hidden states immediately to prevent flash
    const elements = [
      dividerRef.current,
      rightPanelRef.current,
      labelRef.current,
      konaRef.current,
      verseRef.current,
      scrollIndicatorRef.current,
    ];
    elements.forEach((el) => {
      if (el) el.style.opacity = "0";
    });

    let gsapInstance: typeof import("gsap") | null = null;
    let scrollTriggerInstance: typeof import("gsap/ScrollTrigger").ScrollTrigger | null = null;

    const initGSAP = async () => {
      const gsapModule = await import("gsap");
      const scrollTriggerModule = await import("gsap/ScrollTrigger");

      const gsap = gsapModule.default || gsapModule;
      const ScrollTrigger =
        scrollTriggerModule.ScrollTrigger || scrollTriggerModule.default;

      gsap.registerPlugin(ScrollTrigger);
      gsapInstance = gsapModule;
      scrollTriggerInstance = ScrollTrigger;

      // --- Entry Animation ---
      const tl = gsap.timeline();

      tl.from(
        dividerRef.current,
        { scaleY: 0, transformOrigin: "top", duration: 0.6, ease: "power3.out" },
        0.3
      );
      tl.from(
        rightPanelRef.current,
        { opacity: 0, duration: 0.8 },
        0.5
      );
      tl.from(
        labelRef.current,
        { opacity: 0, duration: 0.5 },
        0.7
      );
      tl.from(
        konaRef.current,
        { x: -40, opacity: 0, duration: 0.7, ease: BRAND_EASE },
        0.9
      );
      tl.from(
        verseRef.current,
        { x: -40, opacity: 0, duration: 0.7, ease: BRAND_EASE },
        1.05
      );
      tl.from(
        scrollIndicatorRef.current,
        { opacity: 0, duration: 0.4 },
        1.4
      );

      // --- Scroll indicator dot loop ---
      if (dotRef.current) {
        gsap.to(dotRef.current, {
          y: 56,
          duration: 2,
          repeat: -1,
          ease: "none",
        });
      }

      // --- Scroll Reveal ---
      const runReveal = () => {
        const konaLetters = konaRef.current?.querySelectorAll(".hero-letter");
        const verseLetters = verseRef.current?.querySelectorAll(".hero-letter");

        const t2 = gsap.timeline();

        t2.to(
          dividerRef.current,
          { x: "100vw", duration: 0.4, ease: "power3.in" },
          0
        );
        t2.to(
          rightPanelRef.current,
          { width: "100vw", left: 0, duration: 0.6, ease: BRAND_EASE },
          0
        );

        if (konaLetters && konaLetters.length > 0) {
          t2.to(
            konaLetters,
            { scaleX: 1.4, opacity: 0, stagger: 0.03, duration: 0.4 },
            0.3
          );
        }
        if (verseLetters && verseLetters.length > 0) {
          t2.to(
            verseLetters,
            { scaleX: 1.4, opacity: 0, stagger: 0.03, duration: 0.4 },
            0.35
          );
        }

        t2.to(
          labelRef.current,
          { y: -20, opacity: 0, duration: 0.3 },
          0.3
        );
        t2.to(
          scrollIndicatorRef.current,
          { opacity: 0, duration: 0.2 },
          0.3
        );
      };

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top -80vh",
        onEnter: () => runReveal(),
        once: true,
      });
    };

    initGSAP();

    return () => {
      if (scrollTriggerInstance) {
        scrollTriggerInstance.getAll().forEach((t) => t.kill());
      }
      if (gsapInstance) {
        const gsap = gsapInstance.default || gsapInstance;
        gsap.killTweensOf("*");
      }
    };
  }, []);

  // Split text into individual spans for letter animation
  const splitLetters = (text: string) =>
    text.split("").map((char, i) => (
      <span
        key={i}
        className="hero-letter inline-block"
        style={{ display: "inline-block" }}
      >
        {char}
      </span>
    ));

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[200vh] bg-[#111111]"
    >
      {/* Sticky container */}
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        {/* ── Left Panel ── */}
        <div className="absolute inset-0 w-[55vw] max-md:w-full max-md:h-[60vh] max-md:top-[40vh] max-md:bottom-0 bg-[#111111] z-10 flex flex-col justify-between">
          {/* Archive Label */}
          <div
            ref={labelRef}
            className="p-12 max-md:p-6"
          >
            <span className="font-mono text-xs font-light tracking-[0.2em] uppercase text-[#b6a492]">
              _ Digital Studio
            </span>
          </div>

          {/* Headline */}
          <div className="flex-1 flex items-center px-12 max-md:px-6">
            <div>
              <div
                ref={konaRef}
                className="block font-normal text-[#faf7f2] leading-[0.9] hero-headline"
                style={{
                  fontFamily: "var(--font-monument), 'Monument Extended', sans-serif",
                }}
              >
                {splitLetters("KONA")}
              </div>
              <div
                ref={verseRef}
                className="block font-normal text-[#faf7f2] leading-[0.9] hero-headline"
                style={{
                  fontFamily: "var(--font-monument), 'Monument Extended', sans-serif",
                }}
              >
                {splitLetters("VERSE")}
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div
            ref={scrollIndicatorRef}
            className="p-12 max-md:p-6 flex items-center gap-3"
          >
            <div className="relative w-[1px] h-[60px] bg-[#6b7f62]">
              <div
                ref={dotRef}
                className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#6b7f62]"
              />
            </div>
            <span className="font-mono text-[10px] uppercase text-[#b6a492] tracking-[0.2em]">
              scroll
            </span>
          </div>
        </div>

        {/* ── Dividing Line ── */}
        <div
          ref={dividerRef}
          className="absolute top-0 left-[55%] max-md:left-0 max-md:top-[40vh] w-[1px] max-md:w-full max-md:h-[1px] h-full bg-[#6b7f62] z-20"
        />

        {/* ── Right Panel ── */}
        <div
          ref={rightPanelRef}
          className="absolute top-0 right-0 w-[45vw] max-md:w-full max-md:h-[40vh] h-full z-[5] overflow-hidden"
        >
          {/* Image */}
          {!imageError ? (
            <Image
              src="https://res.cloudinary.com/konaverse/image/upload/f_auto,q_auto/v1/konaverse/hero-atmosphere"
              alt="Atmospheric dark green environment representing the Konaverse digital landscape"
              fill
              priority
              className="object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="absolute inset-0 bg-[#0d1a0f]" />
          )}

          {/* Left edge gradient blend */}
          <div
            className="absolute top-0 left-0 w-[180px] h-full z-10 max-md:hidden"
            style={{
              background: "linear-gradient(to right, #111111, transparent)",
            }}
          />
          {/* Mobile: top edge gradient blend */}
          <div
            className="absolute top-auto bottom-0 left-0 w-full h-[120px] z-10 hidden max-md:block"
            style={{
              background: "linear-gradient(to bottom, transparent, #111111)",
            }}
          />
        </div>

        {/* ── Grain Overlay ── */}
        <div
          className="fixed inset-0 z-50 pointer-events-none mix-blend-overlay"
          style={{ opacity: 0.05 }}
          aria-hidden="true"
        >
          <svg width="100%" height="100%">
            <filter id="grain">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.65"
                numOctaves="3"
                stitchTiles="stitch"
              />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#grain)" />
          </svg>
        </div>
      </div>
    </section>
  );
}
