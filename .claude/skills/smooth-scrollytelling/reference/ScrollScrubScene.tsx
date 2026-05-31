"use client";

/**
 * ScrollScrubScene — buttery scroll-scrubbed frame sequence on a <canvas>.
 *
 * Reference implementation for the `smooth-scrollytelling` skill. Drop it in,
 * set the CONFIG block + the overlay content, and wire the returned track into
 * the page where you want the pin.
 *
 * Smoothness = three layers (see SKILL.md):
 *   1. motion-interpolated source frames (ffmpeg minterpolate)
 *   2. rAF lerp loop (eased `current` toward scroll `target`)
 *   3. sub-frame cross-blend (draw ⌊p⌋ opaque, ⌈p⌉ at globalAlpha = frac(p))
 *
 * Deps: framer-motion, next/image (for the fallback). Plain React works too —
 * swap useScroll/useMotionValueEvent for a scroll listener that writes targetRef.
 */

import Image from "next/image";
import { useRef, useEffect, useState, useCallback, type ReactNode } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";

/* ── CONFIG — edit these ─────────────────────────────────────── */
const FRAME_COUNT = 298; // exact number of extracted frames
const SCRUB_VH = 500; // pinned track height (vh); longer = slower scrub
const FRAME_END = 0.9; // frames finish at this progress; last frame holds after
const SMOOTH = 0.16; // lerp factor; lower = heavier/smoother, higher = snappier
const NARROW_QUERY = "(max-width: 860px)"; // phones fall back to a static frame
const BG = "#05060a";
const framePath = (i: number) =>
  `/About/frames/droplet/frame_${String(i).padStart(3, "0")}.jpg`;
const FALLBACK_FRAME = framePath(FRAME_COUNT);
/* ────────────────────────────────────────────────────────────── */

export default function ScrollScrubScene({
  children,
}: {
  /** Overlay UI; receives scroll progress so you can fade copy in sequentially. */
  children?: (progress: MotionValue<number>) => ReactNode;
}) {
  const reduce = useReducedMotion();
  const [narrow, setNarrow] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const targetRef = useRef(0); // continuous frame position scroll wants
  const currentRef = useRef(0); // eased frame position actually shown
  const drawnRef = useRef(-1);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const mq = window.matchMedia(NARROW_QUERY);
    const update = () => setNarrow(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const active = !reduce && !narrow;

  // object-fit: cover draw of a single frame
  const drawCover = useCallback((img: HTMLImageElement | undefined) => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx || !img || !img.complete || !img.naturalWidth) return false;
    const cw = canvas.width;
    const ch = canvas.height;
    const ir = img.naturalWidth / img.naturalHeight;
    let dw: number;
    let dh: number;
    if (cw / ch > ir) {
      dw = cw;
      dh = cw / ir;
    } else {
      dh = ch;
      dw = ch * ir;
    }
    ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    return true;
  }, []);

  // blended sub-frame at continuous position `pos`
  const drawAt = useCallback(
    (pos: number) => {
      const ctx = ctxRef.current;
      if (!ctx) return;
      const imgs = imagesRef.current;
      const i0 = Math.max(0, Math.min(FRAME_COUNT - 1, Math.floor(pos)));
      const i1 = Math.min(FRAME_COUNT - 1, i0 + 1);
      const frac = pos - Math.floor(pos);
      ctx.globalAlpha = 1;
      const base = drawCover(imgs[i0]);
      if (base && frac > 0.01 && i1 !== i0) {
        ctx.globalAlpha = frac;
        drawCover(imgs[i1]);
        ctx.globalAlpha = 1;
      }
    },
    [drawCover]
  );

  // preload all frames (desktop only). Live matchMedia guard covers the first
  // commit where `narrow` state hasn't resolved → phones never download frames.
  useEffect(() => {
    if (!active) return;
    if (window.matchMedia(NARROW_QUERY).matches) return;
    const imgs: HTMLImageElement[] = [];
    let first = true;
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new window.Image();
      img.decoding = "async";
      img.src = framePath(i);
      img.onload = () => {
        if (first) {
          first = false;
          drawAt(currentRef.current);
        }
      };
      imgs.push(img);
    }
    imagesRef.current = imgs;
    return () => {
      imagesRef.current = [];
    };
  }, [active, drawAt]);

  // size canvas backing store to box × DPR, then redraw
  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    ctxRef.current = canvas.getContext("2d", { alpha: false });
    if (ctxRef.current) ctxRef.current.imageSmoothingQuality = "high";
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
      drawnRef.current = -1;
      drawAt(currentRef.current);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [active, drawAt]);

  // scroll → continuous target frame (NO rounding)
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const t = Math.min(1, Math.max(0, p) / FRAME_END);
    targetRef.current = t * (FRAME_COUNT - 1);
  });

  // rAF lerp loop, paused off-screen
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const tick = () => {
      const cur = currentRef.current;
      const tgt = targetRef.current;
      const diff = tgt - cur;
      const next = Math.abs(diff) < 0.004 ? tgt : cur + diff * SMOOTH;
      currentRef.current = next;
      if (Math.abs(next - drawnRef.current) > 0.002) {
        drawAt(next);
        drawnRef.current = next;
      }
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !raf) raf = requestAnimationFrame(tick);
        else if (!entry.isIntersecting && raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { rootMargin: "300px 0px" }
    );
    if (ref.current) io.observe(ref.current);
    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [active, drawAt]);

  // reduced-motion / mobile static fallback
  if (!active) {
    return (
      <div style={{ position: "relative", width: "100%", height: "100svh", overflow: "hidden", background: BG }}>
        <Image src={FALLBACK_FRAME} alt="" fill sizes="100vw" style={{ objectFit: "cover", opacity: 0.85 }} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(5,6,10,0.45)" }} />
        {children?.(scrollYProgress)}
      </div>
    );
  }

  return (
    <div ref={ref} style={{ position: "relative", height: `${SCRUB_VH}vh`, background: BG }}>
      <div style={{ position: "sticky", top: 0, height: "100svh", overflow: "hidden", background: BG }}>
        <canvas
          ref={canvasRef}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
        />
        {/* optional tint/vignette to seat copy over the frames */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "radial-gradient(120% 95% at 50% 36%, transparent 48%, rgba(5,6,10,0.55) 100%), linear-gradient(180deg, rgba(5,6,10,0.55) 0%, rgba(5,6,10,0.25) 38%, rgba(5,6,10,0.82) 100%)",
          }}
        />
        {children?.(scrollYProgress)}
      </div>
    </div>
  );
}

/* Overlay helper — fades + lifts children across a [start,end] scroll window.
   Import alongside the scene and use inside the `children` render-prop:

     <ScrollScrubScene>
       {(p) => (
         <div className="container-padding" style={{ position:"relative", zIndex:2, height:"100%" }}>
           <Reveal progress={p} range={[0.12, 0.32]}>…headline…</Reveal>
           <Reveal progress={p} range={[0.50, 0.60]}>…stat 1…</Reveal>
         </div>
       )}
     </ScrollScrubScene>
*/
export function Reveal({
  progress,
  range,
  y = 22,
  children,
  style,
}: {
  progress: MotionValue<number>;
  range: [number, number];
  y?: number;
  children: ReactNode;
  style?: React.CSSProperties;
}) {
  const opacity = useTransform(progress, range, [0, 1]);
  const ty = useTransform(progress, range, [y, 0]);
  return <motion.div style={{ opacity, y: ty, ...style }}>{children}</motion.div>;
}
