"use client";

import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { MotionValue } from "framer-motion";

const FONT_URL = "/fonts/MonumentExtended-FreeForPersonalUse/MonumentExtended-Ultrabold.otf";
const FONT_FAMILY = "MonumentExtendedDepthText";

const Z_START = 1.5;
const Z_END = -15.5;

const GREEN = "#00ff88";
const WHITE = "#ffffff";

const LINES: { text: string; color: string }[][] = [
  [
    { text: "Design", color: GREEN },
    { text: " should be easy to", color: WHITE },
  ],
  [
    { text: "understand because ", color: WHITE },
    { text: "simple", color: GREEN },
  ],
  [
    { text: "ideas", color: GREEN },
    { text: " are quicker to ", color: WHITE },
    { text: "grasp", color: GREEN },
    { text: "...", color: WHITE },
  ],
];

const FONT_SIZE = 66;
const LINE_H = 104;
const PAD_X = 48;  // horizontal padding so ascenders/descenders don't clip
const PAD_Y = 24;

// Fixed target height in world units; width is derived from the measured canvas
const PLANE_H_WORLD = 0.58;

interface TextureResult {
  texture: THREE.CanvasTexture;
  planeW: number;
  planeH: number;
}

async function buildTexture(): Promise<TextureResult> {
  const fontFace = new FontFace(FONT_FAMILY, `url(${FONT_URL})`);
  await fontFace.load();
  document.fonts.add(fontFace);

  // ── Measure pass — find the widest line ──────────────────────────────────
  const probe = document.createElement("canvas").getContext("2d")!;
  probe.font = `800 ${FONT_SIZE}px ${FONT_FAMILY}`;
  (probe as any).letterSpacing = "2px";

  let maxLineW = 0;
  LINES.forEach((segments) => {
    let w = 0;
    segments.forEach((s) => { w += probe.measureText(s.text).width; });
    maxLineW = Math.max(maxLineW, w);
  });

  const canvasW = Math.ceil(maxLineW) + PAD_X * 2;
  const canvasH = LINES.length * LINE_H + PAD_Y * 2;

  // ── Draw pass ─────────────────────────────────────────────────────────────
  const canvas = document.createElement("canvas");
  canvas.width = canvasW;
  canvas.height = canvasH;

  const ctx = canvas.getContext("2d")!;
  ctx.font = `800 ${FONT_SIZE}px ${FONT_FAMILY}`;
  ctx.textBaseline = "middle";
  (ctx as any).letterSpacing = "2px";

  LINES.forEach((segments, row) => {
    const y = PAD_Y + row * LINE_H + LINE_H / 2;

    let totalW = 0;
    segments.forEach((s) => { totalW += probe.measureText(s.text).width; });

    let x = (canvasW - totalW) / 2;
    segments.forEach((s) => {
      ctx.fillStyle = s.color;
      ctx.fillText(s.text, x, y);
      x += probe.measureText(s.text).width;
    });
  });

  // Derive world plane dimensions from canvas aspect ratio
  const planeH = PLANE_H_WORLD;
  const planeW = planeH * (canvasW / canvasH);

  return { texture: new THREE.CanvasTexture(canvas), planeW, planeH };
}

export default function DepthText({ progress }: { progress: MotionValue<number> }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [result, setResult] = useState<TextureResult | null>(null);

  useEffect(() => {
    buildTexture().then(setResult);
  }, []);

  useFrame(({ camera }) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const p = progress.get();
    mesh.position.z = THREE.MathUtils.lerp(Z_START, Z_END, p);
    mesh.lookAt(camera.position);

    const opacity = 1 - THREE.MathUtils.clamp((p - 0.40) / 0.20, 0, 1);
    if (mesh.material instanceof THREE.MeshBasicMaterial) {
      mesh.material.opacity = opacity;
    }
  });

  if (!result) return null;

  return (
    <mesh ref={meshRef} position={[0, 1.52, Z_START]}>
      <planeGeometry args={[result.planeW, result.planeH]} />
      <meshBasicMaterial
        map={result.texture}
        transparent
        depthTest
        depthWrite={false}
        side={THREE.FrontSide}
      />
    </mesh>
  );
}
