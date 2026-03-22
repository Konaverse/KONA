"use client";

import { MotionValue } from "framer-motion";
import type { HoveredCardState } from "./SceneManager";

export default function ArchitectHeroV2({}: {
  hoveredCard: HoveredCardState | null;
  onHoverCard: (card: HoveredCardState | null) => void;
  headPosition: { x: number; y: number };
  scrollProgress: MotionValue<number>;
}) {
  return (
    <div style={{ position: "relative", width: "100%", height: "100vh", background: "transparent", pointerEvents: "none" }} />
  );
}
