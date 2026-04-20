"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { EASE_OUT_EXPO } from "@/lib/motion";

const NEON = "var(--color-green-neon)";

export default function BeatHeroEntry() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const textYProgress = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const fadeOut = useTransform(scrollYProgress, [0, 0.6, 1], [1, 0.7, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-[100svh] md:h-[100svh] md:min-h-0 overflow-hidden"
      style={{ background: "var(--color-black)" }}
    >
      {/* Lens flares background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.28] mix-blend-screen">
        <Image
          src="/Solutions/layer1-lens flares.png"
          alt=""
          fill
          priority
          className="object-cover select-none"
          sizes="100vw"
          draggable={false}
        />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 75% 45%, rgba(0,255,136,0.06) 0%, transparent 60%), radial-gradient(ellipse 70% 50% at 15% 85%, rgba(0,255,136,0.03) 0%, transparent 60%)",
        }}
      />
      <svg className="absolute inset-0 h-full w-full opacity-[0.025] pointer-events-none">
        <defs>
          <pattern id="hero-grid" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-grid)" />
      </svg>

      <div className="relative z-[2] flex h-full min-h-[100svh] md:min-h-0 md:h-full items-center px-5 md:px-10 pt-32 md:pt-20 pb-16 md:pb-12">
        <motion.div
          className="mx-auto w-full max-w-[1600px]"
          style={{ y: textYProgress, opacity: fadeOut }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, ease: EASE_OUT_EXPO, delay: 0.2 }}
            className="leading-[0.94]"
            style={{
              fontFamily: "var(--font-display-serif), serif",
              fontWeight: 200,
              fontSize: "clamp(52px, 9vw, 140px)",
              letterSpacing: "-0.028em",
              color: "var(--color-text-primary-dark)",
            }}
          >
            Digital work
            <br />
            that{" "}
            <span style={{ fontStyle: "italic", fontWeight: 300 }}>refuses</span>
            <br />
            to be{" "}
            <span style={{ color: NEON, fontWeight: 300 }}>ignored</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.55 }}
            className="mt-8 max-w-md text-sm md:text-base leading-relaxed"
            style={{
              fontFamily: "var(--font-geist-sans), sans-serif",
              fontWeight: 300,
              color: "var(--color-text-muted-dark)",
            }}
          >
            Konaverse is a premium digital agency out of Cyprus. We build sites,
            applications, films, and campaigns with one intent — to make the
            work of our clients impossible to overlook.
          </motion.p>
        </motion.div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-48"
        style={{
          background: "linear-gradient(to top, var(--color-black) 10%, transparent 100%)",
        }}
      />
    </section>
  );
}
