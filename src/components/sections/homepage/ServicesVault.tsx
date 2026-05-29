"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
} from "framer-motion";
import ServicesSection from "./ServicesSection";

/**
 * Vault-door transition: the Services section is revealed through an
 * expanding circular clip-path over the pinned About section, with a
 * glowing green ring riding the edge of the iris.
 *
 * Services then STAYS pinned (sticky) while `children` (the next section)
 * scrolls over it — so the following section can enter like Hero → About.
 */
export default function ServicesVault({ children }: { children?: ReactNode }) {
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);

  // Progress across the whole track (Services stays pinned the entire time).
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  // Iris grows over the first slice (the spacer runway), then holds open while
  // the next section scrolls over the pinned Services.
  const radius = useTransform(scrollYProgress, [0, 0.26], ["0vmax", "75vmax"]);
  const clipPath = useMotionTemplate`circle(${radius} at 50% 50%)`;

  const ringSize = useTransform(scrollYProgress, [0, 0.26], ["0vmax", "150vmax"]);
  const ringOpacity = useTransform(scrollYProgress, [0, 0.03, 0.22, 0.28], [0, 1, 1, 0]);

  const staticClip = "circle(150vmax at 50% 50%)";

  return (
    <div ref={trackRef} style={{ position: "relative", zIndex: 20 }}>
      {/* Services — pinned for the full track */}
      <div
        style={{
          position: reduce ? "relative" : "sticky",
          top: 0,
          height: "100svh",
          overflow: "hidden",
          zIndex: 0,
        }}
      >
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            clipPath: reduce ? staticClip : clipPath,
            WebkitClipPath: reduce ? staticClip : clipPath,
          }}
        >
          <ServicesSection />
        </motion.div>

        {!reduce && (
          <motion.div
            aria-hidden
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              x: "-50%",
              y: "-50%",
              width: ringSize,
              height: ringSize,
              borderRadius: "50%",
              border: "2px solid rgba(139,162,124,0.9)",
              boxShadow:
                "0 0 60px 6px rgba(107,127,98,0.55), inset 0 0 50px rgba(107,127,98,0.35)",
              opacity: ringOpacity,
              pointerEvents: "none",
            }}
          />
        )}
      </div>

      {/* Iris runway — scroll length for the reveal before the next section rises */}
      {!reduce && <div aria-hidden style={{ height: "130vh" }} />}

      {/* Next section scrolls over the pinned Services */}
      {children}
    </div>
  );
}
