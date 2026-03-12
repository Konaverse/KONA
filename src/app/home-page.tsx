"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import ArchitectHero from "@/components/three/ArchitectHero";
import SceneManager from "@/components/three/SceneManager";
import CylinderNav, { SECTIONS } from "@/components/layout/CylinderNav";
import ParticleField from "@/components/effects/ParticleField";
import type { HoveredCardState } from "@/components/three/SceneManager";
import WhoWereFor from "@/components/sections/WhoWereFor";

export default function HomePage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [entranceComplete, setEntranceComplete] = useState(false);
  
  // Lifted state for 3D interactions
  const [hoveredCard, setHoveredCard] = useState<HoveredCardState | null>(null);
  const [headPosition, setHeadPosition] = useState({ x: 0, y: 0 });

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
    <>
      {/* Global 3D Background */}
      <SceneManager 
        activeSection={activeIndex}
        hoveredCard={hoveredCard}
        onHeadPositionUpdate={setHeadPosition}
        sparkActive={entranceComplete}
      />

      {/* Main Scroll Container */}
      <div
        ref={containerRef}
        style={{
          position: "relative",
          zIndex: 1,
          height: "100vh",
          overflowY: entranceComplete ? "auto" : "hidden",
          scrollSnapType: "y mandatory",
          background: "transparent", // Must be transparent to see 3D
        }}
      >
        {entranceComplete && <ParticleField />}

        <div
          style={{
            position: "fixed",
            zIndex: 10,
            opacity: entranceComplete ? 1 : 0,
            transition: "opacity 1s ease-out",
          }}
        >
          <CylinderNav activeIndex={activeIndex} />
        </div>

        {/* Section 0: The Architect */}
        <div
          ref={setSectionRef(0)}
          style={{ height: "100vh", scrollSnapAlign: "start", position: "relative" }}
        >
          <ArchitectHero 
            onEntranceComplete={() => setEntranceComplete(true)}
            hoveredCard={hoveredCard}
            onHoverCard={setHoveredCard}
            headPosition={headPosition}
          />
        </div>

        {/* Section 1: Who We're For */}
        <div
          ref={setSectionRef(1)}
          style={{ height: "100vh", scrollSnapAlign: "start", position: "relative" }}
        >
          <WhoWereFor />
        </div>

        {/* Placeholder sections */}
        {SECTIONS.slice(2).map((label, i) => (
          <div
            key={label}
            ref={setSectionRef(i + 2)}
            style={{
              height: "100vh",
              scrollSnapAlign: "start",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0,0,0,0.5)", // Darken background slightly to ensure text is readable over 3D
              backdropFilter: "blur(4px)"
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
    </>
  );
}
