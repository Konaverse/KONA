"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import ArchitectHero from "@/components/three/ArchitectHero";
import CylinderNav, { SECTIONS } from "@/components/layout/CylinderNav";
import ParticleField from "@/components/effects/ParticleField";

export default function HomePage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [entranceComplete, setEntranceComplete] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const setSectionRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      sectionRefs.current[index] = el;
    },
    []
  );

  // Detect active section via IntersectionObserver
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sectionRefs.current.indexOf(
              entry.target as HTMLDivElement
            );
            if (index !== -1) setActiveIndex(index);
          }
        });
      },
      {
        root: container,
        threshold: 0.6,
      }
    );

    sectionRefs.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        height: "100vh",
        overflowY: entranceComplete ? "auto" : "hidden",
        scrollSnapType: "y mandatory",
        background: "#000000",
      }}
    >
      {entranceComplete && <ParticleField />}

      <div
        style={{
          opacity: entranceComplete ? 1 : 0,
          transition: "opacity 1s ease-out",
        }}
      >
        <CylinderNav activeIndex={activeIndex} />
      </div>

      {/* Section 0: The Architect */}
      <div
        ref={setSectionRef(0)}
        style={{ height: "100vh", scrollSnapAlign: "start" }}
      >
        <ArchitectHero onEntranceComplete={() => setEntranceComplete(true)} />
      </div>

      {/* Placeholder sections */}
      {SECTIONS.slice(1).map((label, i) => (
        <div
          key={label}
          ref={setSectionRef(i + 1)}
          style={{
            height: "100vh",
            scrollSnapAlign: "start",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-monument), sans-serif",
              fontSize: "3vw",
              fontWeight: 800,
              color: "rgba(255, 255, 255, 0.06)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              userSelect: "none",
            }}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
