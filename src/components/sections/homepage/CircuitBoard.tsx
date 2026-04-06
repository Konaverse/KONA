"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NEON = "#00ff88";
const PURPLE = "#b482ff";

// ── Node data ──
const NODES = [
  {
    id: "web",
    label: "Web",
    x: 75,
    y: 18,
    color: NEON,
    detail: "High-performance sites & apps built to convert.",
    stat: "40+ launched",
  },
  {
    id: "brand",
    label: "Brand",
    x: 30,
    y: 50,
    color: PURPLE,
    detail: "Visual identity systems that cut through noise.",
    stat: "Complete systems",
  },
  {
    id: "growth",
    label: "Growth",
    x: 70,
    y: 80,
    color: NEON,
    detail: "Data-driven campaigns that compound over time.",
    stat: "3x avg. ROI",
  },
];

// SVG paths connecting nodes (as percentage-based coords scaled to viewBox)
const PATHS = [
  { from: "web", to: "brand", d: "M 300,72 C 220,72 180,140 120,200", color: NEON },
  { from: "brand", to: "growth", d: "M 120,200 C 160,260 220,300 280,320", color: PURPLE },
  { from: "web", to: "growth", d: "M 300,72 C 340,160 320,260 280,320", color: NEON },
];

interface CircuitBoardProps {
  opacity: number;
  circuitDraw: number;
  cardOpacities: [number, number, number];
  terminalOp: number;
}

export default function CircuitBoard({
  opacity,
  circuitDraw,
  cardOpacities,
  terminalOp,
}: CircuitBoardProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax on mouse move
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x, y });
  }, []);

  // Animated signal dots traveling along paths
  const [signalPhase, setSignalPhase] = useState(0);
  useEffect(() => {
    if (opacity < 0.3) return;
    let raf: number;
    let start: number;
    const tick = (ts: number) => {
      if (!start) start = ts;
      setSignalPhase(((ts - start) / 4000) % 1);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [opacity]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full pointer-events-auto"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        setHoveredNode(null);
        setMousePos({ x: 0, y: 0 });
      }}
      style={{ opacity }}
    >
      {/* ── Circuit SVG layer ── */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 400 400"
        preserveAspectRatio="xMidYMid meet"
        style={{
          transform: `translate(${mousePos.x * -3}px, ${mousePos.y * -3}px)`,
          transition: "transform 0.3s ease-out",
        }}
      >
        <defs>
          <filter id="glow-green">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-purple">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── Connection paths ── */}
        {PATHS.map((path, i) => {
          const isActive =
            hoveredNode === path.from || hoveredNode === path.to;
          return (
            <g key={i}>
              {/* Base path */}
              <path
                d={path.d}
                fill="none"
                stroke={path.color}
                strokeWidth={isActive ? 1.5 : 0.8}
                opacity={isActive ? 0.6 : 0.15}
                strokeDasharray="600"
                strokeDashoffset={600 - circuitDraw * 600}
                style={{ transition: "opacity 0.4s, stroke-width 0.4s" }}
              />
              {/* Energy pulse along path */}
              {circuitDraw > 0.5 && (
                <circle r={isActive ? 3 : 2} fill={path.color} opacity={isActive ? 0.9 : 0.4}>
                  <animateMotion
                    dur={isActive ? "2s" : "4s"}
                    repeatCount="indefinite"
                    path={path.d}
                    keyPoints={`${signalPhase};${(signalPhase + 1) % 1}`}
                    keyTimes="0;1"
                  />
                </circle>
              )}
            </g>
          );
        })}

        {/* ── Nodes ── */}
        {NODES.map((node, i) => {
          const isHovered = hoveredNode === node.id;
          const isDimmed = hoveredNode !== null && !isHovered;
          const nx = node.x * 4;
          const ny = node.y * 4;

          return (
            <g
              key={node.id}
              style={{
                opacity: cardOpacities[i],
                transform: `translate(${mousePos.x * -6}px, ${mousePos.y * -6}px)`,
                transition: "opacity 0.3s, transform 0.3s ease-out",
              }}
            >
              {/* Outer ring pulse */}
              <circle
                cx={nx}
                cy={ny}
                r={isHovered ? 22 : 16}
                fill="none"
                stroke={node.color}
                strokeWidth="0.5"
                opacity={isHovered ? 0.4 : 0.1}
                style={{ transition: "all 0.4s ease" }}
              />
              {isHovered && (
                <>
                  <circle cx={nx} cy={ny} r="28" fill="none" stroke={node.color} strokeWidth="0.3" opacity="0.15">
                    <animate attributeName="r" values="22;32;22" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.15;0.03;0.15" dur="2s" repeatCount="indefinite" />
                  </circle>
                </>
              )}

              {/* Inner glow */}
              <circle
                cx={nx}
                cy={ny}
                r="10"
                fill={node.color}
                opacity={isHovered ? 0.12 : 0.04}
                filter={isHovered ? (node.color === NEON ? "url(#glow-green)" : "url(#glow-purple)") : undefined}
                style={{ transition: "opacity 0.4s" }}
              />

              {/* Core dot */}
              <circle
                cx={nx}
                cy={ny}
                r={isHovered ? 5 : 3.5}
                fill={node.color}
                opacity={isDimmed ? 0.3 : 0.85}
                style={{ transition: "all 0.3s ease", cursor: "pointer" }}
              />

              {/* Label */}
              <text
                x={nx}
                y={ny - 22}
                textAnchor="middle"
                fill={isDimmed ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.6)"}
                fontSize="11"
                fontFamily="var(--font-body)"
                fontWeight="600"
                letterSpacing="0.1em"
                style={{ transition: "fill 0.3s", textTransform: "uppercase" } as React.CSSProperties}
              >
                {node.label}
              </text>

              {/* Hover hitbox (invisible, larger for easier interaction) */}
              <circle
                cx={nx}
                cy={ny}
                r="30"
                fill="transparent"
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
              />
            </g>
          );
        })}
      </svg>

      {/* ── Hover detail panel ── */}
      <AnimatePresence>
        {hoveredNode && (
          <motion.div
            key={hoveredNode}
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-[12%] left-1/2 -translate-x-1/2 w-[85%] max-w-[240px]"
          >
            {(() => {
              const node = NODES.find((n) => n.id === hoveredNode)!;
              return (
                <div
                  className="rounded-xl px-5 py-4"
                  style={{
                    background: "rgba(0,0,0,0.6)",
                    backdropFilter: "blur(20px)",
                    border: `1px solid ${node.color}22`,
                    boxShadow: `0 0 30px ${node.color}08`,
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-[6px] h-[6px] rounded-full"
                      style={{
                        background: node.color,
                        boxShadow: `0 0 6px ${node.color}`,
                      }}
                    />
                    <span
                      className="text-[10px] tracking-[0.3em] uppercase"
                      style={{ color: node.color, fontFamily: "var(--font-body)", opacity: 0.8 }}
                    >
                      {node.label}
                    </span>
                    <span
                      className="ml-auto text-[9px] tracking-wide"
                      style={{ color: "rgba(255,255,255,0.25)", fontFamily: "var(--font-geist-mono, monospace)" }}
                    >
                      {node.stat}
                    </span>
                  </div>
                  <p
                    className="text-[11px] leading-[1.6]"
                    style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-body)" }}
                  >
                    {node.detail}
                  </p>
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Bottom prompt ── */}
      <div
        className="absolute bottom-[4%] left-1/2 -translate-x-1/2"
        style={{
          opacity: terminalOp * (hoveredNode ? 0.3 : 1),
          transition: "opacity 0.3s",
        }}
      >
        <span
          className="text-[8px] tracking-[0.4em] uppercase"
          style={{ color: "rgba(255,255,255,0.15)", fontFamily: "var(--font-body)" }}
        >
          hover to explore
        </span>
      </div>
    </div>
  );
}
