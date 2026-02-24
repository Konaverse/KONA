"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const colors = {
  50: "#f8f7f5",
  100: "#e6e1d7",
  200: "#c8b4a0",
  300: "#a89080",
  400: "#8a7060",
  500: "#6b5545",
  600: "#544237",
  700: "#3c4237",
  800: "#2a2e26",
  900: "#1a1d18",
};

const sage = "#6b7f62";

interface TimelineEvent {
  ref: string;
  year: string;
  image: string;
  headline: string;
  description: string;
}

const events: TimelineEvent[] = [
  {
    ref: "01",
    year: "2018",
    image: "/images/about-timeline/ssm-green.png",
    headline: "The Origin",
    description:
      "Two fifteen-year-olds crossed paths in a high school corridor in Cyprus. Neither knew it yet — but that conversation was the founding moment of Konaverse. KONA: two letters from Konstantinos, two from Nabil.",
  },
  {
    ref: "02",
    year: "2019",
    image: "/images/about-timeline/web-app-green-futuristic.png",
    headline: "First Hustle",
    description:
      "A Shopify store. Products sourced, ads drafted, lessons earned the hard way. The first taste of building something from nothing — and the first honest reckoning with what it actually costs to learn.",
  },
  {
    ref: "03",
    year: "2020",
    image: "/images/about-timeline/digital-ads-green-futuristic.png",
    headline: "Digital Frontier",
    description:
      "They moved toward the internet's most ambitious edge — an NFT project, built early and with conviction. It didn't survive. But it sharpened their instinct for timing, risk, and what the market truly wants.",
  },
  {
    ref: "04",
    year: "2022",
    image: "/images/about-timeline/ssm-green-futuristic.png",
    headline: "Kona Socials",
    description:
      "First agency. The name a signal — KO from Konstantinos, NA from Nabil. It launched, found resistance, and folded. They didn't fold with it. Heads down. Skills refined. The foundation quietly deepened.",
  },
  {
    ref: "05",
    year: "2024",
    image: "/images/about-timeline/videography-green-futuristic.png",
    headline: "Mastering the Craft",
    description:
      "Two years of deliberate refinement. Konstantinos deepened his command of web architecture, security, and paid media. Nabil — editing video since seventeen — turned that obsession into a professional weapon.",
  },
  {
    ref: "06",
    year: "2025",
    image: "/images/about-timeline/digital-ads-green.png",
    headline: "Konaverse",
    description:
      "The agency they always meant to build. Websites. Social media. High-conversion advertising. Cinematic brand video. Everything under one roof, built by two people who refused to stop. The internet will know it.",
  },
];

// ── Event card ────────────────────────────────────────────────────────────────
function EventCard({
  event,
  onRef,
}: {
  event: TimelineEvent;
  onRef: (el: HTMLDivElement | null) => void;
}) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={onRef}
      className="min-h-[80vh] flex items-center py-16 px-8 lg:px-12 lg:pr-20"
    >
      <div
        ref={innerRef}
        className="w-full max-w-lg"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(40px)",
          transition:
            "opacity 700ms cubic-bezier(0.16, 1, 0.3, 1), transform 700ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Top sage accent */}
        <div
          className="w-10 h-px mb-6"
          style={{ background: `linear-gradient(to right, ${sage}, transparent)` }}
        />

        {/* Mobile-only year */}
        <div className="lg:hidden mb-4">
          <span
            className="font-mono text-[10px] uppercase tracking-[0.25em]"
            style={{ color: colors[100] }}
          >
            {event.year}
          </span>
        </div>

        {/* Image */}
        <div
          className="relative w-full overflow-hidden mb-6"
          style={{ aspectRatio: "16 / 9" }}
        >
          <Image
            src={event.image}
            alt={event.headline}
            fill
            className="object-cover"
            style={{ filter: "brightness(0.8) saturate(0.85)" }}
            sizes="(max-width: 1024px) 100vw, 62vw"
          />
          {/* Warm overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, rgba(17,17,17,0.5), rgba(30,26,22,0.4))",
            }}
          />
        </div>

        {/* Archive ref */}
        <span
          className="font-mono text-[9px] uppercase tracking-[0.25em] block mb-2"
          style={{ color: colors[100] }}
        >
          Archive_Ref: {event.ref}
        </span>

        {/* Headline */}
        <h3
          className="font-extralight tracking-tight"
          style={{
            fontSize: "clamp(1.4rem, 2.5vw, 2.1rem)",
            color: colors[200],
          }}
        >
          {event.headline}
        </h3>

        {/* Description */}
        <p
          className="text-base md:text-lg font-light leading-relaxed mt-4"
          style={{ color: colors[100] }}
        >
          {event.description}
        </p>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function AboutTimeline() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const yearRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const timer = setTimeout(() => {
      // Set initial state — first year visible, rest hidden
      yearRefs.current.forEach((yr, i) => {
        if (yr) gsap.set(yr, { autoAlpha: i === 0 ? 1 : 0 });
      });

      const triggers: ScrollTrigger[] = [];

      cardRefs.current.forEach((card, i) => {
        if (!card) return;

        const trigger = ScrollTrigger.create({
          trigger: card,
          start: "top 52%",
          onEnter: () => {
            yearRefs.current.forEach((yr, j) => {
              if (yr)
                gsap.to(yr, {
                  autoAlpha: j === i ? 1 : 0,
                  duration: 0.55,
                  ease: "power2.inOut",
                });
            });
          },
          onEnterBack: () => {
            yearRefs.current.forEach((yr, j) => {
              if (yr)
                gsap.to(yr, {
                  autoAlpha: j === i ? 1 : 0,
                  duration: 0.55,
                  ease: "power2.inOut",
                });
            });
          },
        });

        triggers.push(trigger);
      });

      return () => triggers.forEach((t) => t.kill());
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const setCardRef = useCallback(
    (i: number) => (el: HTMLDivElement | null) => {
      cardRefs.current[i] = el;
    },
    []
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      style={{ backgroundColor: colors[900] }}
    >
      {/* Section header */}
      <div className="px-8 md:px-16 pt-24 pb-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-6 mb-10">
          <span
            className="font-mono text-[10px] uppercase tracking-[0.3em] shrink-0"
            style={{ color: colors[100] }}
          >
            03 — The Chronicle
          </span>
          <div
            className="flex-1 h-px"
            style={{
              background: `linear-gradient(to right, ${colors[600]}50, transparent)`,
            }}
          />
        </div>

        <h2
          className="font-extralight tracking-tight"
          style={{
            fontSize: "clamp(2rem, 5vw, 4rem)",
            color: colors[50],
          }}
        >
          <span style={{ color: colors[50] }}>How we</span> <span style={{ color: colors[200] }}>got here</span>.
        </h2>
      </div>

      {/* Timeline body */}
      <div className="flex max-w-7xl mx-auto">

        {/* ── Left sticky panel — desktop only ── */}
        <div className="hidden lg:block w-[38%] shrink-0 relative">
          <div className="sticky top-0 h-screen flex flex-col justify-center px-16">

            {/* Year panels stack — GSAP toggles autoAlpha */}
            <div className="relative">
              {events.map((event, i) => (
                <div
                  key={event.year}
                  ref={(el) => {
                    yearRefs.current[i] = el;
                  }}
                  style={{
                    position: i === 0 ? "relative" : "absolute",
                    top: 0,
                    left: 0,
                  }}
                >
                  {/* Enormous year */}
                  <div
                    className="font-extralight tracking-tight leading-none"
                    style={{
                      fontSize: "clamp(5rem, 10vw, 9.5rem)",
                      color: colors[50],
                    }}
                  >
                    {event.year}
                  </div>

                  {/* Archive ref */}
                  <span
                    className="font-mono text-[9px] uppercase tracking-[0.3em] block mt-4"
                    style={{ color: colors[100] }}
                  >
                    Archive_Ref: {event.ref}
                  </span>

                  {/* Sage tick */}
                  <div
                    className="mt-3 w-6 h-px"
                    style={{ backgroundColor: sage }}
                  />

                  {/* Headline echo */}
                  <p
                    className="mt-3 font-light"
                    style={{
                      fontSize: "clamp(0.85rem, 1.2vw, 1rem)",
                      color: colors[100],
                      letterSpacing: "0.01em",
                    }}
                  >
                    {event.headline}
                  </p>
                </div>
              ))}
            </div>

            {/* Vertical progress line */}
            <div
              className="absolute bottom-12 left-16 w-px"
              style={{
                height: "80px",
                background: `linear-gradient(to bottom, ${colors[700]}60, transparent)`,
              }}
            />
          </div>
        </div>

        {/* ── Right scrolling cards ── */}
        <div className="w-full lg:w-[62%]">
          {events.map((event, i) => (
            <EventCard
              key={event.year}
              event={event}
              onRef={setCardRef(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default AboutTimeline;
