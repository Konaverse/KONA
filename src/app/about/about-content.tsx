"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import HomeFooter from "@/components/sections/HomeFooter";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ════════════════════════════════════════════════════════════════════════════
   DATA
   ════════════════════════════════════════════════════════════════════════════ */

const FOUNDERS = [
  {
    id: "konstantinos",
    number: "01",
    name: "Konstantinos Kyprianou",
    role: "The Architect",
    title: "Co-Founder",
    bio: "Architect of digital experiences. Deep command of web architecture, security, and paid media — he transforms brand vision into precise interfaces that perform and endure.",
    skills: ["Web Architecture", "Paid Media", "Security", "UX/UI", "Performance"],
    quote: "The interface is the product. Build it like it matters.",
    funFact: "Has been building websites since he was 15. His first client was a family business in Cyprus.",
    photo: "/images/founders/konstantinos.jpg",
    photoAlt: "/images/founders/konstantinos-2.jpg",
  },
  {
    id: "nabil",
    number: "02",
    name: "Nabil Al Jbawi",
    role: "The Visionary",
    title: "Co-Founder",
    bio: "Strategist and creative director. Editing video since 17, he bridges brand ambition and market reality — with a sharp eye for content that moves people and drives results.",
    skills: ["Brand Strategy", "Video Editing", "Content Creation", "Social Media", "Creative Direction"],
    quote: "Great content doesn't look like an ad. It looks like the truth.",
    funFact: "Started editing videos at 17 for fun. Now it's his professional weapon.",
    photo: "/images/founders/nabil.jpg",
    photoAlt: "/images/founders/nabil-2.jpg",
  },
];

const TIMELINE_EVENTS = [
  {
    year: "2018",
    ref: "01",
    headline: "The Origin",
    description:
      "Two fifteen-year-olds crossed paths in a high school corridor in Cyprus. Neither knew it yet — but that conversation was the founding moment of Konaverse. KONA: two letters from Konstantinos, two from Nabil.",
    image: "/images/about-timeline/ssm-green.png",
  },
  {
    year: "2019",
    ref: "02",
    headline: "First Hustle",
    description:
      "A Shopify store. Products sourced, ads drafted, lessons earned the hard way. The first taste of building something from nothing — and the first honest reckoning with what it actually costs to learn.",
    image: "/images/about-timeline/web-app-green-futuristic.png",
  },
  {
    year: "2020",
    ref: "03",
    headline: "Digital Frontier",
    description:
      "They moved toward the internet\u2019s most ambitious edge — an NFT project, built early and with conviction. It didn\u2019t survive. But it sharpened their instinct for timing, risk, and what the market truly wants.",
    image: "/images/about-timeline/digital-ads-green-futuristic.png",
  },
  {
    year: "2022",
    ref: "04",
    headline: "Kona Socials",
    description:
      "First agency. The name a signal — KO from Konstantinos, NA from Nabil. It launched, found resistance, and folded. They didn\u2019t fold with it. Heads down. Skills refined. The foundation quietly deepened.",
    image: "/images/about-timeline/ssm-green-futuristic.png",
  },
  {
    year: "2024",
    ref: "05",
    headline: "Mastering the Craft",
    description:
      "Two years of deliberate refinement. Konstantinos deepened his command of web architecture, security, and paid media. Nabil — editing video since seventeen — turned that obsession into a professional weapon.",
    image: "/images/about-timeline/videography-green-futuristic.png",
  },
  {
    year: "2025",
    ref: "06",
    headline: "Konaverse",
    description:
      "The agency they always meant to build. Websites. Social media. High-conversion advertising. Cinematic brand video. Everything under one roof, built by two people who refused to stop. The internet will know it.",
    image: "/images/about-timeline/digital-ads-green.png",
  },
];

const CAPABILITIES = [
  {
    title: "Web Design & Development",
    description: "React, Next.js, TypeScript. Performance-driven sites that rank and convert.",
  },
  {
    title: "Social Media Management",
    description: "Platform strategy, content calendars, and community growth across every channel.",
  },
  {
    title: "Brand Identity",
    description: "Logos, typography systems, and visual languages that are unmistakably yours.",
  },
  {
    title: "SEO & Performance",
    description: "Core Web Vitals optimization, structured data, and technical excellence.",
  },
  {
    title: "Content Strategy",
    description: "Editorial planning, brand narrative, and content that drives measurable results.",
  },
];

const MANIFESTO_WORDS = [
  { text: "DESIGN", color: "rgba(255,255,255,0.06)" },
  { text: "THAT", color: "rgba(255,255,255,0.9)" },
  { text: "OUTLASTS", color: "#00ff88" },
  { text: "EVERYTHING", color: "rgba(255,255,255,0.06)" },
  { text: "LOUDER.", color: "rgba(255,255,255,0.3)" },
];

const FLOATING_IMAGES = [
  { src: "/images/founders/konstantinos-2.jpg", top: "15%", left: "18%", rotate: -3, width: 180, height: 240 },
  { src: "/images/about-timeline/videography-green-futuristic.png", top: "55%", left: "38%", rotate: 2, width: 160, height: 120 },
  { src: "/images/founders/nabil-2.jpg", top: "25%", left: "62%", rotate: -4, width: 150, height: 200 },
  { src: "/images/about-timeline/ssm-green-futuristic.png", top: "60%", left: "78%", rotate: 3, width: 170, height: 130 },
];

/* ════════════════════════════════════════════════════════════════════════════
   HELPERS
   ════════════════════════════════════════════════════════════════════════════ */

function GridOverlay({ id }: { id: string }) {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none">
      <defs>
        <pattern id={id} width="80" height="80" patternUnits="userSpaceOnUse">
          <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   FOUNDER CARD
   ════════════════════════════════════════════════════════════════════════════ */

function FounderCard({ founder, offset }: { founder: (typeof FOUNDERS)[0]; offset?: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const isInView = useInView(cardRef, { once: true, margin: "-100px" });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(card, { rotateY: x * 8, rotateX: -y * 8, duration: 0.4, ease: "power2.out" });
    if (imageRef.current) {
      gsap.to(imageRef.current, { x: x * 20, y: y * 20, duration: 0.4, ease: "power2.out" });
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    if (cardRef.current) gsap.to(cardRef.current, { rotateY: 0, rotateX: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" });
    if (imageRef.current) gsap.to(imageRef.current, { x: 0, y: 0, duration: 0.6 });
  }, []);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`relative ${offset ? "lg:mt-24" : ""}`}
      style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
    >
      <div
        className="bg-white/[0.02] border border-white/[0.05] backdrop-blur-sm rounded-sm overflow-hidden transition-all duration-500"
        style={{
          boxShadow: isHovered
            ? "0 0 60px rgba(0,255,136,0.08), 0 20px 40px rgba(0,0,0,0.3)"
            : "0 10px 30px rgba(0,0,0,0.2)",
          borderColor: isHovered ? "rgba(0,255,136,0.2)" : "rgba(255,255,255,0.05)",
        }}
      >
        {/* Photo */}
        <div ref={imageRef} className="relative aspect-[4/5] overflow-hidden">
          <Image src={founder.photo} alt={founder.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div
            className="absolute top-4 left-4 font-mono text-[10px] tracking-[0.3em] uppercase"
            style={{ color: "#00ff88" }}
          >
            Co-Founder #{founder.number}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          <h3
            className="leading-[0.95] uppercase"
            style={{
              fontFamily: "var(--font-monument), sans-serif",
              fontWeight: 800,
              fontSize: "clamp(20px, 2.5vw, 32px)",
              color: "rgba(255,255,255,0.95)",
            }}
          >
            {founder.name}
          </h3>

          <p
            className="font-mono text-[10px] tracking-[0.3em] uppercase mt-2 mb-4"
            style={{ color: "#00ff88" }}
          >
            {founder.role}
          </p>

          <div
            className="mb-4"
            style={{ width: 60, height: 2, background: "#00ff88", boxShadow: "0 0 12px rgba(0,255,136,0.3)" }}
          />

          <p
            style={{
              fontFamily: "var(--font-geist-sans), sans-serif",
              color: "rgba(255,255,255,0.6)",
              fontSize: 14,
              lineHeight: 1.7,
            }}
          >
            {founder.bio}
          </p>

          {/* Skills */}
          <div className="flex flex-wrap gap-2 mt-6">
            {founder.skills.map((skill) => (
              <span
                key={skill}
                className="font-mono text-[9px] tracking-[0.15em] uppercase px-3 py-1 border border-white/[0.08] bg-white/[0.03] rounded-sm"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Quote — progressive disclosure */}
          <motion.blockquote
            initial={false}
            animate={isHovered ? { opacity: 1, height: "auto", marginTop: 24 } : { opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.4 }}
            className="overflow-hidden border-t border-white/[0.06] pt-4"
          >
            <p
              className="italic"
              style={{
                fontFamily: "var(--font-geist-sans), sans-serif",
                color: "rgba(255,255,255,0.4)",
                fontSize: 13,
              }}
            >
              &ldquo;{founder.quote}&rdquo;
            </p>
            <p
              className="mt-2 font-mono text-[9px] tracking-[0.2em] uppercase"
              style={{ color: "rgba(255,255,255,0.2)" }}
            >
              {founder.funFact}
            </p>
          </motion.blockquote>
        </div>
      </div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════════════════════════════════════ */

export default function AboutContent() {
  /* ── Refs ── */
  const heroSectionRef = useRef<HTMLDivElement>(null);
  const heroPinRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);

  const timelineCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const yearRefs = useRef<(HTMLDivElement | null)[]>([]);
  const timelineImageRefs = useRef<(HTMLDivElement | null)[]>([]);

  const manifestoSectionRef = useRef<HTMLDivElement>(null);
  const manifestoPinRef = useRef<HTMLDivElement>(null);
  const manifestoTrackRef = useRef<HTMLDivElement>(null);
  const floatRefs = useRef<(HTMLDivElement | null)[]>([]);

  /* ── Hero scroll values (for scroll indicator fade) ── */
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroSectionRef,
    offset: ["start start", "end start"],
  });
  const scrollIndicatorOpacity = useTransform(heroProgress, [0, 0.15], [1, 0]);

  /* ══════════════════════════════════════════════════════════════════════
     GSAP: Hero pin + video zoom
     ══════════════════════════════════════════════════════════════════════ */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const section = heroSectionRef.current;
    const pin = heroPinRef.current;
    const video = videoRef.current;
    const content = heroContentRef.current;
    if (!section || !pin || !video || !content) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          pin: pin,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });

      tl.fromTo(video, { scale: 1 }, { scale: 1.3, ease: "none" }, 0);
      tl.fromTo(content, { y: 0, opacity: 1 }, { y: -120, opacity: 0, ease: "power1.in" }, 0);
    });

    return () => ctx.revert();
  }, []);

  /* ══════════════════════════════════════════════════════════════════════
     GSAP: Timeline crossfade
     ══════════════════════════════════════════════════════════════════════ */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const timer = setTimeout(() => {
      yearRefs.current.forEach((yr, i) => {
        if (yr) gsap.set(yr, { autoAlpha: i === 0 ? 1 : 0 });
      });
      timelineImageRefs.current.forEach((img, i) => {
        if (img) gsap.set(img, { autoAlpha: i === 0 ? 1 : 0 });
      });

      const triggers: ScrollTrigger[] = [];

      const crossfadeTo = (index: number) => {
        yearRefs.current.forEach((yr, j) => {
          if (yr) gsap.to(yr, { autoAlpha: j === index ? 1 : 0, duration: 0.55, ease: "power2.inOut" });
        });
        timelineImageRefs.current.forEach((img, j) => {
          if (img) gsap.to(img, { autoAlpha: j === index ? 1 : 0, duration: 0.55, ease: "power2.inOut" });
        });
      };

      timelineCardRefs.current.forEach((card, i) => {
        if (!card) return;
        triggers.push(
          ScrollTrigger.create({
            trigger: card,
            start: "top 52%",
            onEnter: () => crossfadeTo(i),
            onEnterBack: () => crossfadeTo(i),
          })
        );
      });

      return () => triggers.forEach((t) => t.kill());
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  /* ══════════════════════════════════════════════════════════════════════
     GSAP: Manifesto horizontal scroll
     ══════════════════════════════════════════════════════════════════════ */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const section = manifestoSectionRef.current;
    const pinContainer = manifestoPinRef.current;
    const track = manifestoTrackRef.current;
    if (!section || !pinContainer || !track) return;

    const ctx = gsap.context(() => {
      const totalScroll = track.scrollWidth - window.innerWidth;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          pin: pinContainer,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.fromTo(track, { x: 0 }, { x: -totalScroll, ease: "none" }, 0);

      floatRefs.current.forEach((el, i) => {
        if (!el) return;
        tl.fromTo(el, { y: i % 2 === 0 ? 40 : -40 }, { y: i % 2 === 0 ? -40 : 40, ease: "none" }, 0);
      });
    });

    return () => ctx.revert();
  }, []);

  /* ══════════════════════════════════════════════════════════════════════
     RENDER
     ══════════════════════════════════════════════════════════════════════ */
  return (
    <div className="bg-black min-h-screen">
      {/* ══════════════════════════════════════════════════════════════════
          SECTION 1: HERO — "The Opening Shot"
          Video parallax with GSAP pin. Video zooms in, content drifts away.
          ══════════════════════════════════════════════════════════════════ */}
      <section ref={heroSectionRef} className="relative" style={{ height: "170vh" }}>
        <div ref={heroPinRef} className="relative h-screen w-full overflow-hidden">
          {/* Video background */}
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            style={{ willChange: "transform" }}
          >
            <source src="/Comp 1.mp4" type="video/mp4" />
          </video>

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/50" />

          {/* Grid overlay */}
          <GridOverlay id="hero-grid" />

          {/* Content */}
          <div
            ref={heroContentRef}
            className="absolute inset-0 z-10 flex flex-col justify-end pb-16 md:pb-20 pl-[clamp(1.5rem,4vw,4rem)] pr-[clamp(1.5rem,4vw,4rem)]"
          >
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[11px] tracking-[0.3em] uppercase mb-4"
              style={{ fontFamily: "var(--font-geist-mono), monospace", color: "rgba(0,255,136,0.5)" }}
            >
              The Studio
            </motion.p>

            <motion.h1
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 0% 0 0)" }}
              transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="leading-[0.85] uppercase"
              style={{
                fontFamily: "var(--font-monument), sans-serif",
                fontWeight: 800,
                fontSize: "clamp(48px, 10vw, 120px)",
                color: "#ffffff",
              }}
            >
              Who We
              <br />
              <span style={{ color: "#00ff88" }}>Are</span>
            </motion.h1>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mt-6 origin-left"
              style={{
                width: "clamp(60px, 10vw, 140px)",
                height: 2,
                background: "#00ff88",
                boxShadow: "0 0 20px rgba(0,255,136,0.3)",
              }}
            />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="mt-6 max-w-md"
              style={{
                fontFamily: "var(--font-geist-sans), sans-serif",
                color: "rgba(255,255,255,0.5)",
                fontSize: "clamp(13px, 1.2vw, 16px)",
                lineHeight: 1.7,
              }}
            >
              A boutique digital studio built on a quiet conviction — that design
              which is precise and purposeful outlasts everything louder.
            </motion.p>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
            style={{ opacity: scrollIndicatorOpacity }}
          >
            <span
              className="text-[9px] tracking-[0.3em] uppercase"
              style={{ fontFamily: "var(--font-geist-mono), monospace", color: "rgba(255,255,255,0.25)" }}
            >
              Scroll
            </span>
            <motion.div
              className="w-px h-6"
              style={{ background: "rgba(0,255,136,0.3)" }}
              animate={{ scaleY: [1, 0.4, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>

          {/* Bottom border */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="absolute bottom-0 left-0 right-0 h-px origin-left z-[6]"
            style={{
              background: "linear-gradient(90deg, rgba(0,255,136,0.4) 0%, rgba(0,255,136,0.1) 50%, transparent 100%)",
            }}
          />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 2: FOUNDERS — "The Discovery"
          Asymmetric two-column layout. 3D tilt on hover. Progressive disclosure.
          ══════════════════════════════════════════════════════════════════ */}
      <section className="relative py-32 md:py-44 overflow-hidden">
        <GridOverlay id="founders-grid" />

        {/* Radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(0,255,136,0.03), transparent 60%)" }}
        />

        {/* Background watermark */}
        <div
          className="absolute top-[10%] right-[5%] select-none pointer-events-none hidden md:block"
          style={{
            fontFamily: "var(--font-monument), sans-serif",
            fontWeight: 800,
            fontSize: "clamp(200px, 30vw, 500px)",
            color: "rgba(255,255,255,0.02)",
            lineHeight: 0.85,
          }}
        >
          02
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-[clamp(1.5rem,4vw,4rem)]">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="font-mono text-[11px] tracking-[0.3em] uppercase mb-4"
            style={{ color: "rgba(0,255,136,0.5)" }}
          >
            The Founders
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="leading-[0.95] uppercase mb-16"
            style={{
              fontFamily: "var(--font-monument), sans-serif",
              fontWeight: 800,
              fontSize: "clamp(28px, 4.5vw, 56px)",
              color: "#ffffff",
            }}
          >
            Two Minds,
            <br />
            <span style={{ color: "#00ff88" }}>One Vision</span>
          </motion.h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8">
            {FOUNDERS.map((founder, i) => (
              <FounderCard key={founder.id} founder={founder} offset={i === 1} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 3: ORIGIN STORY — "The Timeline"
          Scrollytelling with sticky year/image crossfade.
          ══════════════════════════════════════════════════════════════════ */}
      <section className="relative bg-black" style={{ overflowX: "clip" }}>
        <GridOverlay id="timeline-grid" />

        {/* Background watermark */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 select-none pointer-events-none hidden md:block"
          style={{
            fontFamily: "var(--font-monument), sans-serif",
            fontWeight: 800,
            fontSize: "clamp(200px, 25vw, 400px)",
            color: "rgba(255,255,255,0.015)",
            whiteSpace: "nowrap",
          }}
        >
          KONAVERSE
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-[clamp(1.5rem,4vw,4rem)] py-32 md:py-44">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="font-mono text-[11px] tracking-[0.3em] uppercase mb-4"
            style={{ color: "rgba(0,255,136,0.5)" }}
          >
            Our Story
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="leading-[0.95] uppercase mb-16 md:mb-24"
            style={{
              fontFamily: "var(--font-monument), sans-serif",
              fontWeight: 800,
              fontSize: "clamp(28px, 4.5vw, 56px)",
              color: "#ffffff",
            }}
          >
            The <span style={{ color: "#00ff88" }}>Timeline</span>
          </motion.h2>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-16">
            {/* Left: sticky year + image */}
            <div className="hidden lg:block">
              <div className="sticky top-[20vh]">
                {/* Year stack */}
                <div className="relative h-[120px] mb-8">
                  {TIMELINE_EVENTS.map((evt, i) => (
                    <div
                      key={evt.year}
                      ref={(el) => { yearRefs.current[i] = el; }}
                      className="absolute inset-0"
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-monument), sans-serif",
                          fontWeight: 800,
                          fontSize: "clamp(64px, 8vw, 120px)",
                          color: "rgba(255,255,255,0.08)",
                        }}
                      >
                        {evt.year}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Image stack */}
                <div className="relative aspect-[4/3] rounded-sm overflow-hidden border border-white/[0.05]">
                  {TIMELINE_EVENTS.map((evt, i) => (
                    <div
                      key={`img-${evt.year}`}
                      ref={(el) => { timelineImageRefs.current[i] = el; }}
                      className="absolute inset-0"
                    >
                      <Image src={evt.image} alt={evt.headline} fill className="object-cover" sizes="40vw" />
                    </div>
                  ))}
                </div>

                {/* Green accent line under image */}
                <div
                  className="mt-4"
                  style={{
                    width: 40,
                    height: 2,
                    background: "#00ff88",
                    boxShadow: "0 0 8px rgba(0,255,136,0.2)",
                  }}
                />
              </div>
            </div>

            {/* Right: scrollable narrative cards */}
            <div className="flex flex-col gap-24 md:gap-32">
              {TIMELINE_EVENTS.map((evt, i) => (
                <motion.div
                  key={evt.year}
                  ref={(el) => { timelineCardRefs.current[i] = el; }}
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-20%" }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                >
                  <p
                    className="font-mono text-[10px] tracking-[0.3em] uppercase mb-3"
                    style={{ color: "#00ff88" }}
                  >
                    {evt.ref} &mdash; {evt.year}
                  </p>

                  <h3
                    className="uppercase mb-4"
                    style={{
                      fontFamily: "var(--font-monument), sans-serif",
                      fontWeight: 800,
                      fontSize: "clamp(24px, 3vw, 40px)",
                      color: "rgba(255,255,255,0.9)",
                    }}
                  >
                    {evt.headline}
                  </h3>

                  <div
                    className="mb-4"
                    style={{
                      width: 40,
                      height: 2,
                      background: "#00ff88",
                      boxShadow: "0 0 8px rgba(0,255,136,0.2)",
                    }}
                  />

                  <p
                    className="max-w-[520px]"
                    style={{
                      fontFamily: "var(--font-geist-sans), sans-serif",
                      color: "rgba(255,255,255,0.5)",
                      lineHeight: 1.8,
                      fontSize: "clamp(13px, 1.1vw, 15px)",
                    }}
                  >
                    {evt.description}
                  </p>

                  {/* Mobile image */}
                  <div className="lg:hidden relative aspect-video mt-6 rounded-sm overflow-hidden border border-white/[0.05]">
                    <Image src={evt.image} alt={evt.headline} fill className="object-cover" sizes="100vw" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 4: THE MANIFESTO WALL
          Horizontal kinetic typography with GSAP scroll-scrub.
          ══════════════════════════════════════════════════════════════════ */}
      <section ref={manifestoSectionRef} className="relative" style={{ height: "300vh" }}>
        <div ref={manifestoPinRef} className="relative h-screen w-full overflow-hidden flex items-center">
          {/* Radial glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(circle at 50% 50%, rgba(0,255,136,0.04), transparent 50%)" }}
          />

          {/* Vertical accent lines */}
          <div className="absolute left-[10%] top-0 w-px h-full" style={{ background: "rgba(255,255,255,0.03)" }} />
          <div className="absolute right-[10%] top-0 w-px h-full" style={{ background: "rgba(255,255,255,0.03)" }} />

          {/* Floating images at depth */}
          {FLOATING_IMAGES.map((img, i) => (
            <div
              key={i}
              ref={(el) => { floatRefs.current[i] = el; }}
              className="absolute pointer-events-none"
              style={{ top: img.top, left: img.left }}
            >
              <div
                className="relative overflow-hidden rounded-sm border border-white/[0.05]"
                style={{
                  width: img.width,
                  height: img.height,
                  transform: `rotate(${img.rotate}deg)`,
                  opacity: 0.3,
                }}
              >
                <Image src={img.src} alt="" fill className="object-cover" sizes="200px" />
              </div>
            </div>
          ))}

          {/* Horizontal scrolling track */}
          <div
            ref={manifestoTrackRef}
            className="flex items-center whitespace-nowrap"
            style={{ willChange: "transform" }}
          >
            <div className="w-[30vw] shrink-0" />
            {MANIFESTO_WORDS.map((word, i) => (
              <span
                key={i}
                className="mx-[3vw] md:mx-[4vw] shrink-0 select-none"
                style={{
                  fontFamily: "var(--font-monument), sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(80px, 18vw, 280px)",
                  textTransform: "uppercase",
                  color: word.color,
                  lineHeight: 1,
                }}
              >
                {word.text}
              </span>
            ))}
            <div className="w-[40vw] shrink-0" />
          </div>

          {/* Bottom-left label */}
          <div className="absolute bottom-8 left-[clamp(1.5rem,4vw,4rem)]">
            <p
              className="font-mono text-[10px] tracking-[0.3em] uppercase"
              style={{ color: "rgba(0,255,136,0.3)" }}
            >
              04 &mdash; Philosophy
            </p>
          </div>

          {/* Bottom-right: faded studio name */}
          <div className="absolute bottom-8 right-[clamp(1.5rem,4vw,4rem)]">
            <p
              className="font-mono text-[10px] tracking-[0.3em] uppercase"
              style={{ color: "rgba(255,255,255,0.1)" }}
            >
              Konaverse &mdash; Est. 2024
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 5: THE SIGNAL — Capabilities + Manifesto
          Line-by-line reveals, glassmorphism capability cards.
          ══════════════════════════════════════════════════════════════════ */}
      <section className="relative py-32 md:py-44 overflow-hidden">
        <GridOverlay id="signal-grid" />

        {/* Radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 30%, rgba(0,255,136,0.05), transparent 60%)" }}
        />

        <div className="relative z-10 max-w-[1400px] mx-auto px-[clamp(1.5rem,4vw,4rem)]">
          {/* Section label */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="font-mono text-[11px] tracking-[0.3em] uppercase mb-6"
            style={{ color: "rgba(0,255,136,0.5)" }}
          >
            05 &mdash; Capabilities
          </motion.p>

          {/* Manifesto lines */}
          <div className="mb-20 md:mb-28">
            {["We don\u2019t guess.", "We architect.", "We execute.", "We iterate."].map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -40, clipPath: "inset(0 100% 0 0)" }}
                whileInView={{ opacity: 1, x: 0, clipPath: "inset(0 0% 0 0)" }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <h2
                  style={{
                    fontFamily: "var(--font-monument), sans-serif",
                    fontWeight: 800,
                    fontSize: "clamp(28px, 5vw, 72px)",
                    textTransform: "uppercase",
                    lineHeight: 1.15,
                    color: i === 1 ? "#00ff88" : "rgba(255,255,255,0.9)",
                  }}
                >
                  {line}
                </h2>
              </motion.div>
            ))}
          </div>

          {/* Capability cards — staggered grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CAPABILITIES.map((cap, i) => (
              <motion.div
                key={cap.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className={`relative group ${i === 1 ? "lg:mt-12" : i === 3 ? "lg:mt-8" : ""}`}
              >
                <div
                  className="bg-white/[0.02] border border-white/[0.05] backdrop-blur-sm rounded-sm p-6 md:p-8 relative overflow-hidden transition-all duration-500 hover:border-[rgba(0,255,136,0.2)] hover:bg-white/[0.04]"
                  style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 0 40px rgba(0,255,136,0.06), 0 20px 40px rgba(0,0,0,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 10px 30px rgba(0,0,0,0.2)";
                  }}
                >
                  {/* Number */}
                  <p
                    className="font-mono text-[10px] tracking-[0.3em] uppercase mb-4"
                    style={{ color: "rgba(0,255,136,0.4)" }}
                  >
                    0{i + 1}
                  </p>

                  {/* Title */}
                  <h3
                    className="uppercase mb-3"
                    style={{
                      fontFamily: "var(--font-monument), sans-serif",
                      fontWeight: 800,
                      fontSize: "clamp(16px, 1.8vw, 24px)",
                      color: "rgba(255,255,255,0.9)",
                    }}
                  >
                    {cap.title}
                  </h3>

                  {/* Green line */}
                  <div
                    className="mb-3"
                    style={{ width: 30, height: 2, background: "#00ff88", boxShadow: "0 0 8px rgba(0,255,136,0.2)" }}
                  />

                  {/* Description */}
                  <p
                    style={{
                      fontFamily: "var(--font-geist-sans), sans-serif",
                      color: "rgba(255,255,255,0.4)",
                      fontSize: 13,
                      lineHeight: 1.7,
                    }}
                  >
                    {cap.description}
                  </p>

                  {/* Corner accent on hover */}
                  <div className="absolute top-0 right-0 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute top-0 right-0 w-full h-px" style={{ background: "rgba(0,255,136,0.3)" }} />
                    <div className="absolute top-0 right-0 w-px h-full" style={{ background: "rgba(0,255,136,0.3)" }} />
                  </div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute bottom-0 left-0 w-full h-px" style={{ background: "rgba(0,255,136,0.3)" }} />
                    <div className="absolute bottom-0 left-0 w-px h-full" style={{ background: "rgba(0,255,136,0.3)" }} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Philosophy closer */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mt-24 text-center"
          >
            <p
              className="font-mono text-[10px] tracking-[0.4em] uppercase"
              style={{ color: "rgba(255,255,255,0.2)" }}
            >
              Precision over volume. Craft over compromise. Always.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 6: CTA + FOOTER
          Standard pattern from solutions pages.
          ══════════════════════════════════════════════════════════════════ */}
      <section className="relative bg-black overflow-hidden">
        {/* Background glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,255,136,0.04) 0%, transparent 60%)" }}
        />

        <GridOverlay id="cta-grid-about" />

        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(0,255,136,0.2) 30%, rgba(0,255,136,0.2) 70%, transparent 100%)",
          }}
        />

        <div className="relative z-[1] flex flex-col items-center justify-center min-h-[80vh] px-6 py-32">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="font-mono text-[11px] tracking-[0.3em] uppercase mb-8"
            style={{ color: "rgba(0,255,136,0.5)" }}
          >
            Start a Conversation
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-center leading-[0.95] uppercase mb-6"
            style={{
              fontFamily: "var(--font-monument), sans-serif",
              fontWeight: 800,
              fontSize: "clamp(32px, 7vw, 80px)",
              color: "#ffffff",
            }}
          >
            Build What
            <br />
            <span style={{ color: "#00ff88" }}>Matters.</span>
          </motion.h2>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8 origin-center"
            style={{
              width: "clamp(80px, 12vw, 160px)",
              height: 2,
              background: "#00ff88",
              boxShadow: "0 0 20px rgba(0,255,136,0.3)",
            }}
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center text-sm md:text-base leading-relaxed max-w-lg mb-12"
            style={{ fontFamily: "var(--font-geist-sans), sans-serif", color: "rgba(255,255,255,0.5)" }}
          >
            The next chapter starts with a conversation.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-fit"
          >
            <Button href="/contact" variant="primary" size="lg">
              <span style={{ color: "#00ff88" }}>Get in Touch</span>
            </Button>
          </motion.div>
        </div>
      </section>

      <HomeFooter />
    </div>
  );
}
