"use client";

import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

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

const capabilities = [
  { id: "01", name: "Web Design & Development" },
  { id: "02", name: "Social Media Management" },
  { id: "03", name: "Brand Identity" },
  { id: "04", name: "SEO & Performance" },
  { id: "05", name: "Content Strategy" },
];

// ── Capability row ──────────────────────────────────────────────────────────
function CapabilityRow({
  id,
  name,
  index,
}: {
  id: string;
  name: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), index * 90);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [index]);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(36px)",
        transition:
          "opacity 700ms cubic-bezier(0.16, 1, 0.3, 1), transform 700ms cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative flex items-center gap-4 md:gap-8 py-5 md:py-7 cursor-default pl-4">
        {/* Sage left-border reveal */}
        <div
          className="absolute left-0 top-0 bottom-0 w-px"
          style={{
            backgroundColor: hovered ? sage : "transparent",
            transition: "background-color 400ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />

        {/* Number */}
        <span
          className="font-mono text-[9px] uppercase tracking-[0.25em] shrink-0 w-6 text-right"
          style={{ color: colors[100] }}
        >
          {id}
        </span>

        {/* Short tick */}
        <div
          className="w-3 h-px shrink-0"
          style={{ backgroundColor: `${colors[600]}60` }}
        />

        {/* Service name */}
        <span
          className="flex-1 font-extralight"
          style={{
            fontSize: "clamp(1.15rem, 2.8vw, 2.25rem)",
            color: hovered ? colors[50] : colors[100],
            letterSpacing: hovered ? "0.015em" : "-0.01em",
            transition:
              "letter-spacing 500ms cubic-bezier(0.16, 1, 0.3, 1), color 300ms ease",
          }}
        >
          {name}
        </span>

        {/* Active indicator */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{
              backgroundColor: sage,
              boxShadow: hovered ? `0 0 8px ${sage}90` : "none",
              transition: "box-shadow 400ms ease",
            }}
          />
          <span
            className="font-mono text-[9px] uppercase tracking-[0.2em]"
            style={{ color: colors[500] }}
          >
            Active
          </span>
        </div>
      </div>

      {/* Row separator */}
      <div
        className="w-full h-px"
        style={{
          background: `linear-gradient(to right, ${colors[700]}50, ${colors[600]}30, transparent)`,
        }}
      />
    </div>
  );
}

// ── Corner bracket helper ────────────────────────────────────────────────────
function CornerBracket({
  position,
  visible,
  delay,
}: {
  position: "tl" | "tr" | "bl" | "br";
  visible: boolean;
  delay: number;
}) {
  const isTop = position === "tl" || position === "tr";
  const isLeft = position === "tl" || position === "bl";

  const translateFrom = {
    tl: "translate(-12px, -12px)",
    tr: "translate(12px, -12px)",
    bl: "translate(-12px, 12px)",
    br: "translate(12px, 12px)",
  }[position];

  return (
    <div
      className="absolute w-12 h-12"
      style={{
        top: isTop ? "3rem" : "auto",
        bottom: !isTop ? "3rem" : "auto",
        left: isLeft ? "3rem" : "auto",
        right: !isLeft ? "3rem" : "auto",
        opacity: visible ? 0.3 : 0,
        transform: visible ? "translate(0, 0)" : translateFrom,
        transition:
          "opacity 900ms cubic-bezier(0.16, 1, 0.3, 1), transform 900ms cubic-bezier(0.16, 1, 0.3, 1)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {/* Horizontal arm */}
      <div
        className="absolute w-full h-px"
        style={{
          top: isTop ? 0 : "auto",
          bottom: !isTop ? 0 : "auto",
          backgroundColor: colors[400],
        }}
      />
      {/* Vertical arm */}
      <div
        className="absolute w-px h-full"
        style={{
          left: isLeft ? 0 : "auto",
          right: !isLeft ? 0 : "auto",
          backgroundColor: colors[400],
        }}
      />
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export function AboutClose() {
  const closingRef = useRef<HTMLDivElement>(null);
  const [closingVisible, setClosingVisible] = useState(false);
  const [bracketsVisible, setBracketsVisible] = useState(false);

  useEffect(() => {
    const el = closingRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setClosingVisible(true);
          setTimeout(() => setBracketsVisible(true), 500);
          observer.unobserve(el);
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* ── 03  Capabilities index ─────────────────────────────────────────── */}
      <section
        className="relative w-full"
        style={{ backgroundColor: colors[900] }}
      >
        <div className="max-w-5xl mx-auto px-8 md:px-16 py-24 md:py-32">
          {/* Section label + rule */}
          <div className="flex items-center gap-6 mb-16">
            <span
              className="font-mono text-[10px] uppercase tracking-[0.3em] shrink-0"
              style={{ color: colors[100] }}
            >
              04 — What We Do
            </span>
            <div
              className="flex-1 h-px"
              style={{
                background: `linear-gradient(to right, ${colors[600]}50, transparent)`,
              }}
            />
          </div>

          {/* Top rule */}
          <div
            className="w-full h-px mb-2"
            style={{
              background: `linear-gradient(to right, ${colors[700]}50, ${colors[600]}30, transparent)`,
            }}
          />

          {/* Rows */}
          {capabilities.map((cap, i) => (
            <CapabilityRow key={cap.id} id={cap.id} name={cap.name} index={i} />
          ))}
        </div>
      </section>

      {/* ── 04  Closing CTA ────────────────────────────────────────────────── */}
      <section
        ref={closingRef}
        className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: colors[900] }}
      >
        {/* Ghost "K" */}
        <div
          className="absolute inset-0 flex items-center justify-center select-none pointer-events-none"
          style={{ opacity: 0.025 }}
        >
          <span
            style={{
              fontSize: "clamp(8rem, 28vw, 22rem)",
              fontWeight: 200,
              letterSpacing: "-0.06em",
              color: colors[200],
              lineHeight: 1,
            }}
          >
            K
          </span>
        </div>

        {/* Corner brackets */}
        <CornerBracket position="tl" visible={bracketsVisible} delay={0} />
        <CornerBracket position="tr" visible={bracketsVisible} delay={80} />
        <CornerBracket position="bl" visible={bracketsVisible} delay={160} />
        <CornerBracket position="br" visible={bracketsVisible} delay={240} />

        {/* Centered content */}
        <div className="relative z-10 text-center px-8 max-w-3xl mx-auto flex flex-col items-center gap-0">
          {/* Label */}
          <div
            style={{
              opacity: closingVisible ? 1 : 0,
              transform: closingVisible ? "translateY(0)" : "translateY(20px)",
              transition:
                "opacity 700ms cubic-bezier(0.16, 1, 0.3, 1), transform 700ms cubic-bezier(0.16, 1, 0.3, 1)",
              transitionDelay: "0ms",
            }}
          >
            <span
              className="font-mono text-[10px] uppercase tracking-[0.3em]"
              style={{ color: colors[100] }}
            >
              05 — Begin
            </span>
          </div>

          {/* Main statement */}
          <div
            className="mt-6"
            style={{
              opacity: closingVisible ? 1 : 0,
              transform: closingVisible ? "translateY(0)" : "translateY(32px)",
              transition:
                "opacity 800ms cubic-bezier(0.16, 1, 0.3, 1), transform 800ms cubic-bezier(0.16, 1, 0.3, 1)",
              transitionDelay: "140ms",
            }}
          >
            <h2
              className="font-extralight tracking-tight leading-tight"
              style={{
                fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
                color: colors[200],
              }}
            >
              Build what matters.
            </h2>
          </div>

          {/* Subtitle */}
          <div
            className="mt-5"
            style={{
              opacity: closingVisible ? 1 : 0,
              transform: closingVisible ? "translateY(0)" : "translateY(28px)",
              transition:
                "opacity 700ms cubic-bezier(0.16, 1, 0.3, 1), transform 700ms cubic-bezier(0.16, 1, 0.3, 1)",
              transitionDelay: "260ms",
            }}
          >
            <p
              className="font-light"
              style={{
                fontSize: "clamp(0.875rem, 1.4vw, 1rem)",
                color: colors[100],
                letterSpacing: "0.03em",
              }}
            >
              The next chapter starts with a conversation.
            </p>
          </div>

          {/* Shimmer divider */}
          <div
            className="mt-10 mb-10"
            style={{
              width: "100px",
              height: "1px",
              background: `linear-gradient(to right, transparent, ${colors[300]}, transparent)`,
              transform: closingVisible ? "scaleX(1)" : "scaleX(0)",
              transition:
                "transform 900ms cubic-bezier(0.16, 1, 0.3, 1)",
              transitionDelay: "360ms",
            }}
          />

          {/* CTA button */}
          <div
            style={{
              opacity: closingVisible ? 1 : 0,
              transform: closingVisible ? "translateY(0)" : "translateY(20px)",
              transition:
                "opacity 700ms cubic-bezier(0.16, 1, 0.3, 1), transform 700ms cubic-bezier(0.16, 1, 0.3, 1)",
              transitionDelay: "440ms",
            }}
          >
            <Button
              href="/contact"
              showCorners={true}
            >
              Initialize Engagement
            </Button>
          </div>

          {/* Studio signature */}
          <div
            className="mt-20"
            style={{
              opacity: closingVisible ? 0.35 : 0,
              transition: "opacity 800ms ease",
              transitionDelay: "600ms",
            }}
          >
            <span
              className="font-mono text-[9px] uppercase tracking-[0.35em]"
              style={{ color: colors[100] }}
            >
              Konaverse — Est. 2024
            </span>
          </div>
        </div>
      </section>
    </>
  );
}

export default AboutClose;
