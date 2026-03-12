"use client";

import { useEffect, useRef } from "react";

const SECTIONS = [
  "The Architect",
  "The Blueprint",
  "The Clients",
  "The Arsenal",
  "The Builds",
  "The Proof",
  "The Next Move",
];

const ITEM_HEIGHT = 40;

interface CylinderNavProps {
  activeIndex: number;
}

export default function CylinderNav({ activeIndex }: CylinderNavProps) {
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (stripRef.current) {
      const offset = -activeIndex * ITEM_HEIGHT;
      stripRef.current.style.transform = `translateY(${offset}px)`;
    }
  }, [activeIndex]);

  return (
    <div
      style={{
        position: "fixed",
        left: 32,
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 100,
        pointerEvents: "none",
      }}
    >
      {/* Visible window — shows 3 items with the active one in the center */}
      <div
        style={{
          height: ITEM_HEIGHT * 3,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Highlight container for active item */}
        <div
          style={{
            position: "absolute",
            top: ITEM_HEIGHT,
            left: -8,
            right: -8,
            height: ITEM_HEIGHT,
            background: "rgba(255, 255, 255, 0.06)",
            borderRadius: 6,
            border: "1px solid rgba(255, 255, 255, 0.1)",
            zIndex: 0,
          }}
        />

        {/* Scrolling strip */}
        <div
          ref={stripRef}
          style={{
            position: "relative",
            zIndex: 1,
            // Start with one empty slot so first item lands in center
            paddingTop: ITEM_HEIGHT,
            transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {SECTIONS.map((label, i) => {
            const distance = i - activeIndex;
            const isActive = distance === 0;
            const absDistance = Math.abs(distance);

            // Cylinder effect: rotate away and fade
            const rotateX = distance * 25;
            const scale = isActive ? 1 : 0.85;
            const opacity = isActive ? 1 : absDistance === 1 ? 0.35 : 0.12;

            return (
              <div
                key={label}
                style={{
                  height: ITEM_HEIGHT,
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: 12,
                  paddingRight: 12,
                  fontFamily: "var(--font-monument), sans-serif",
                  fontSize: 11,
                  fontWeight: isActive ? 800 : 400,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "white",
                  opacity,
                  transform: `perspective(200px) rotateX(${rotateX}deg) scale(${scale})`,
                  transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                  whiteSpace: "nowrap",
                  userSelect: "none",
                }}
              >
                {label}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export { SECTIONS };
