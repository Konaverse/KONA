"use client";

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

/* Scroll-scrubbed frame sequence (extracted from public/About/droplet video.mp4
   with motion-compensated interpolation — `ffmpeg minterpolate fps=60` — scaled
   to 1280w → public/About/frames/droplet/). The whole stage pins for SCRUB_VH;
   the frames play in the full-bleed canvas as you scroll, and the editorial
   content + stat numbers fade in sequentially over the top.

   Smoothness ("not frame-by-frame"):
   1. Motion-interpolated source frames close the real motion gaps.
   2. A rAF lerp loop eases the displayed position toward the scroll target, so
      slow scrolls glide instead of snapping (the cinematic settle).
   3. Sub-frame cross-blend: frame ⌊p⌋ is drawn opaque, frame ⌈p⌉ on top at
      alpha = frac(p) — a true dissolve between frames, never a hard step. */
const FRAME_COUNT = 298;
const SCRUB_VH = 500; // total pinned track height (vh)
const FRAME_END = 0.9; // frames finish at 90% of the track, last frame holds
const SMOOTH = 0.16; // lerp factor — lower = smoother/heavier, higher = snappier
const framePath = (i: number) =>
  `/About/frames/droplet/frame_${String(i).padStart(3, "0")}.jpg`;
const FALLBACK_FRAME = framePath(FRAME_COUNT);
const NARROW_QUERY = "(max-width: 860px)";

const ACCENT = "#8ba27c";

type Stat = { value: string; label: string };
const STATS: Stat[] = [
  { value: "98%", label: "Avg. performance score" },
  { value: "2.4×", label: "Conversion lift" },
  { value: "100%", label: "Bespoke, hand-built code" },
];

/* Fades + lifts its children across a [start, end] scroll window. */
function Reveal({
  progress,
  range,
  y = 22,
  children,
  className,
  style,
}: {
  progress: MotionValue<number>;
  range: [number, number];
  y?: number;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const opacity = useTransform(progress, range, [0, 1]);
  const ty = useTransform(progress, range, [y, 0]);
  return (
    <motion.div className={className} style={{ opacity, y: ty, ...style }}>
      {children}
    </motion.div>
  );
}

export default function CinemaScene() {
  const reduce = useReducedMotion();
  const [narrow, setNarrow] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const targetRef = useRef(0); // continuous frame position the scroll wants
  const currentRef = useRef(0); // eased frame position actually shown
  const drawnRef = useRef(-1);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Track viewport width so phones skip the heavy scrub.
  useEffect(() => {
    const mq = window.matchMedia(NARROW_QUERY);
    const update = () => setNarrow(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const active = !reduce && !narrow;

  // Draw one frame with object-fit: cover math.
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

  // Draw the blended sub-frame at continuous position `pos`.
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

  // Preload every frame (desktop only). The live matchMedia check guards the
  // first commit, where `narrow` state hasn't resolved yet, so phones never
  // kick off the multi-MB preload.
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

  // Size the canvas backing store to its box × DPR; redraw.
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

  // Scroll → continuous target frame (no rounding).
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const t = Math.min(1, Math.max(0, p) / FRAME_END);
    targetRef.current = t * (FRAME_COUNT - 1);
  });

  // rAF lerp loop — runs only while the stage is on-screen.
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
        if (entry.isIntersecting && !raf) {
          raf = requestAnimationFrame(tick);
        } else if (!entry.isIntersecting && raf) {
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

  /* ── Reduced motion / mobile static fallback ───────────────── */
  if (!active) {
    return (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100svh",
          overflow: "hidden",
          background: "#05060a",
        }}
      >
        <Image
          src={FALLBACK_FRAME}
          alt=""
          fill
          sizes="100vw"
          style={{ objectFit: "cover", opacity: 0.85 }}
        />
        <div style={{ position: "absolute", inset: 0, background: "rgba(5,6,10,0.45)" }} />
        <CinemaContent progress={scrollYProgress} reduce />
      </div>
    );
  }

  return (
    <div ref={ref} style={{ position: "relative", height: `${SCRUB_VH}vh`, background: "#05060a" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100svh",
          overflow: "hidden",
          background: "#05060a",
        }}
      >
        {/* full-bleed scrubbed frame */}
        <canvas
          ref={canvasRef}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
        />
        {/* cinematic tint + vignette to seat the copy */}
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
        <CinemaContent progress={scrollYProgress} />
      </div>
    </div>
  );
}

/* Editorial content layered over the frames; numbers fade in sequentially. */
function CinemaContent({
  progress,
  reduce = false,
}: {
  progress: MotionValue<number>;
  reduce?: boolean;
}) {
  // When reduced, show everything immediately (ranges collapse to [0,0]).
  const r = (a: number, b: number): [number, number] => (reduce ? [0, 0] : [a, b]);

  return (
    <div
      className="container-padding"
      style={{
        position: "relative",
        zIndex: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        paddingTop: "clamp(5rem, 16vh, 9rem)",
        paddingBottom: "clamp(3rem, 9vh, 6rem)",
      }}
    >
      <div style={{ maxWidth: "62%" }}>
        <Reveal progress={progress} range={r(0.03, 0.12)} y={14}>
          <span
            style={{
              display: "inline-block",
              fontFamily: "var(--font-geist-mono), monospace",
              fontSize: "0.62rem",
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "rgba(214,227,205,0.72)",
              marginBottom: "1.1rem",
            }}
          >
            KONAVERSE — Web Studio
          </span>
        </Reveal>

        <Reveal progress={progress} range={r(0.12, 0.32)} y={28}>
          <h2
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontWeight: 300,
              fontSize: "clamp(1.9rem, 5vw, 4.6rem)",
              lineHeight: 1.04,
              letterSpacing: "-0.02em",
              margin: 0,
              color: "#eef3e8",
              textShadow: "0 0 34px rgba(139,162,124,0.4)",
            }}
          >
            We build digital
            <br />
            experiences that
            <br />
            <span style={{ color: ACCENT }}>outperform.</span>
          </h2>
        </Reveal>

        <Reveal progress={progress} range={r(0.3, 0.42)} y={20}>
          <p
            style={{
              margin: "1.5rem 0 0",
              maxWidth: "44ch",
              fontFamily: "var(--font-dm-sans), sans-serif",
              fontWeight: 300,
              fontSize: "clamp(0.82rem, 1vw, 1rem)",
              lineHeight: 1.6,
              color: "rgba(220,230,212,0.74)",
            }}
          >
            Visitors don&apos;t convert by accident. Performance-first engineering
            shapes every interaction — turning attention into measurable outcomes.
          </p>
        </Reveal>
      </div>

      <dl
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "clamp(1.5rem, 5vw, 4.5rem)",
          margin: 0,
        }}
      >
        {STATS.map((s, i) => (
          <Reveal
            key={s.value}
            progress={progress}
            range={r(0.5 + i * 0.13, 0.6 + i * 0.13)}
            y={26}
            style={{ position: "relative" }}
          >
            <dt
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontWeight: 300,
                fontSize: "clamp(2.2rem, 5.2vw, 4.6rem)",
                lineHeight: 1,
                letterSpacing: "-0.03em",
                color: "#f3f7ee",
                textShadow: "0 0 30px rgba(139,162,124,0.5)",
              }}
            >
              {s.value}
            </dt>
            <dd
              style={{
                margin: "0.55rem 0 0",
                fontFamily: "var(--font-dm-sans), sans-serif",
                fontSize: "clamp(0.64rem, 0.85vw, 0.82rem)",
                letterSpacing: "0.02em",
                color: "rgba(214,227,205,0.62)",
              }}
            >
              {s.label}
            </dd>
          </Reveal>
        ))}
      </dl>
    </div>
  );
}
