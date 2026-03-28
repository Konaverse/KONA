"use client";

import { useEffect, useRef } from "react";
import { MotionValue, useMotionValueEvent } from "framer-motion";
import { Globe } from "@/components/ui/globe";

// Render size for the canvas (cheap to draw)
const RENDER_SIZE = 1000;

// Desktop: globe right side, above the headline area
// Uses percentage-based positioning for the CENTER of the globe.
// centerX/centerY are viewport percentages (0-100).
function desktopPos(rawT: number): { centerX: number; centerY: number; scale: number; opacity: number } {
  const vh = window.innerHeight;

  // Globe visual size: sharp at ≤ 2x scale (600px canvas → max 1200px)
  const S = Math.max(1200, Math.min(1000, vh * 0.65));
  const scale = S / RENDER_SIZE;

  // Scroll-driven drift (0 → 0.5 of hero progress)
  const drift = Math.max(0, Math.min(1, rawT / 0.5));
  const eased = drift < 0.5 ? 2 * drift * drift : 1 - Math.pow(-2 * drift + 2, 2) / 2;

  const scaleMul = 1.0 + 0.15 * eased;

  // Position: right side, upper area above headline
  const centerX = 105;
  const centerY = 40;
  const driftY = -4 * eased; // drift up 4vh on scroll

  // Opacity: visible on load, fades after 0.50
  const opacity = rawT < 0.50
    ? 0.60 + 0.15 * eased
    : rawT > 0.75 ? 0 : 0.75 * (1 - (rawT - 0.50) / 0.25);

  return {
    centerX,
    centerY: centerY + driftY,
    scale: scale * scaleMul,
    opacity,
  };
}

// Mobile: globe centered behind architect, drifts up + fades out on scroll
function mobileArcPos(rawT: number): { left: number; top: number; scale: number; opacity: number } {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  // Size the globe to 120% of viewport width so it bleeds off edges — feels immersive
  const S = vw * 1.2;
  const scale = S / RENDER_SIZE;

  // Scroll-driven drift: 0 → 0.5
  const drift = Math.max(0, Math.min(1, rawT / 0.5));
  const eased = drift < 0.5 ? 2 * drift * drift : 1 - Math.pow(-2 * drift + 2, 2) / 2;

  // Start: centered horizontally, globe center at ~60% down viewport (behind architect)
  // End: centered horizontally, globe center at ~15% down viewport, scaled down
  const startScale = scale;
  const endScale = scale * 0.5;
  const currentScale = startScale + (endScale - startScale) * eased;
  const renderedSize = RENDER_SIZE * currentScale;

  const left = (vw - renderedSize) / 2;
  const startTop = vh * 0.60 - renderedSize / 2;
  const endTop = vh * 0.15 - renderedSize / 2;
  const top = startTop + (endTop - startTop) * eased;

  // Fade out: 0.5 → 0.75
  const fade = rawT < 0.5 ? 1 : rawT > 0.75 ? 0 : 1 - (rawT - 0.5) / 0.25;

  return { left, top, scale: currentScale, opacity: fade };
}

export default function GlobeBackground({
  heroScrollY,
  isMobile,
}: {
  heroScrollY: MotionValue<number>;
  isMobile?: boolean;
}) {
  const posRef = useRef<HTMLDivElement>(null);

  const applyPosition = (t: number) => {
    const el = posRef.current;
    if (!el) return;

    if (isMobile) {
      el.style.transformOrigin = "0 0";
      const { left, top, scale, opacity } = mobileArcPos(t);
      el.style.transform = `translate3d(${left}px, ${top}px, 0) scale(${scale})`;
      el.style.opacity = `${opacity}`;
    } else {
      // Desktop: position by center point (viewport %)
      el.style.transformOrigin = "center center";
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const { centerX, centerY, scale, opacity } = desktopPos(t);
      // Move center of the 600px element to the target viewport point
      const targetLeft = (vw * centerX / 100) - RENDER_SIZE / 2;
      const targetTop = (vh * centerY / 100) - RENDER_SIZE / 2;
      el.style.transform = `translate3d(${targetLeft}px, ${targetTop}px, 0) scale(${scale})`;
      el.style.opacity = `${opacity}`;
    }
  };

  // Set position from JS on mount so it always matches current scroll
  useEffect(() => {
    applyPosition(heroScrollY.get());
  }, [heroScrollY, isMobile]);

  // Recompute on resize/orientation change
  useEffect(() => {
    const handleResize = () => applyPosition(heroScrollY.get());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [heroScrollY, isMobile]);

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
        transformOrigin: isMobile ? "0 0" : "center center",
        willChange: "transform",
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <Globe className="max-w-none" dpr={isMobile ? 1 : 2} />
    </div>
  );
}
