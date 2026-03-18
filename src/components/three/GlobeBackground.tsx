"use client";

import { useEffect, useRef } from "react";
import { MotionValue, useMotionValueEvent } from "framer-motion";
import { Globe } from "@/components/ui/globe";

// Render size for the canvas (cheap to draw)
const RENDER_SIZE = 600;

// Clockwise cubic bezier arc: bottom-left → swings right → top-right
function arcPos(rawT: number): { left: number; top: number; scale: number } {
  // Active during hero scroll 0.25 → 0.75
  const t = Math.max(0, Math.min(1, (rawT - 0.25) / 0.5));
  // Ease in-out cubic
  const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const vm = Math.min(window.innerWidth, window.innerHeight) / 100;
  const vw = window.innerWidth / 100;
  const vh = window.innerHeight / 100;
  const S = 340 * vm; // visual size (px)
  const V = 130 * vm; // visible corner amount (px)
  const scale = S / RENDER_SIZE; // CSS scale factor

  // P0: bottom-left (globe mostly off-screen)
  const x0 = -(S - V) + 60 * vm, y0 = 100 * vh - V + 8 * vm;
  // P1: swing hard right + slightly below (creates the clockwise arc)
  const x1 = 100 * vw + S * 0.3, y1 = 100 * vh + S * 0.15;
  // P2: right side, rising up toward final position
  const x2 = 100 * vw + S * 0.3, y2 = -(S - V);
  // P3: top-right (globe mostly off-screen)
  const x3 = 100 * vw - V, y3 = -(S - V);

  const m = 1 - e;
  return {
    left: m * m * m * x0 + 3 * m * m * e * x1 + 3 * m * e * e * x2 + e * e * e * x3,
    top: m * m * m * y0 + 3 * m * m * e * y1 + 3 * m * e * e * y2 + e * e * e * y3,
    scale,
  };
}

export default function GlobeBackground({
  heroScrollY,
}: {
  heroScrollY: MotionValue<number>;
}) {
  const posRef = useRef<HTMLDivElement>(null);

  const applyPosition = (t: number) => {
    const el = posRef.current;
    if (!el) return;
    const { left, top, scale } = arcPos(t);
    // Use transform for both positioning and scaling — single composite layer, no layout thrash
    el.style.transform = `translate3d(${left}px, ${top}px, 0) scale(${scale})`;
  };

  // Set position from JS on mount so it always matches arcPos(currentScroll)
  useEffect(() => {
    applyPosition(heroScrollY.get());
  }, [heroScrollY]);

  useMotionValueEvent(heroScrollY, "change", applyPosition);

  return (
    <div
      ref={posRef}
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: `${RENDER_SIZE}px`,
        height: `${RENDER_SIZE}px`,
        transformOrigin: "0 0",
        willChange: "transform",
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <Globe className="max-w-none" />
    </div>
  );
}
