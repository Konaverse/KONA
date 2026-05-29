"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

const BG = "/About/Background image.png";
const MAN = "/About/man with transparent background.png";
const SCREEN_IMG = "/About/A_series_of_vertical_architectural_202605292032.jpeg";

type Stat = { value: string; label: string };
const STATS: Stat[] = [
  { value: "98%", label: "Avg. performance score" },
  { value: "2.4×", label: "Conversion lift" },
  { value: "100%", label: "Bespoke, hand-built code" },
];

/**
 * Cinema scene — a man standing in front of a cinema screen, in a cinema hall.
 *
 *   cinema hall   = the background image .......... z1   (back)
 *   cinema screen = the gradient container ........ z3   (mid — real, crawlable copy)
 *   the man       = the silhouette image .......... z4   (front)
 *
 * The hall and the man are renders of the SAME scene at the SAME framing, so
 * they share one identical transform ("the room") and read as a single image —
 * the depth comes purely from the screen being sandwiched between them by
 * z-index. A small differential parallax between the room and the screen plays
 * on the way in, then settles to the reference composition.
 */
export default function CinemaScene() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // 0 as the scene's top meets the viewport bottom → 1 once it's bottom-aligned
  // (the frame the About section then pins / holds).
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });

  // Room (background + man, locked together) and the screen drift at different
  // rates → parallax. Everything converges to 0 at the settled frame.
  const yRoom = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [30, 0]);
  const yScreen = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [80, 0]);
  const screenOpacity = useTransform(
    scrollYProgress,
    [0, 0.4, 1],
    reduce ? [1, 1, 1] : [0, 0.55, 1]
  );

  return (
    <div
      ref={ref}
      className="cinema-scene"
      style={{
        position: "relative",
        width: "100%",
        height: "100svh",
        overflow: "hidden",
        background: "#05060a",
      }}
    >
      {/* z1 — cinema hall (background) */}
      <motion.div
        aria-hidden
        style={{ position: "absolute", inset: 0, zIndex: 1, y: yRoom, scale: 1.08, willChange: "transform" }}
      >
        <Image src={BG} alt="" fill priority sizes="100vw" style={{ objectFit: "cover" }} />
      </motion.div>

      {/* z2 — vignette to seat the composite (behind the screen) */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          pointerEvents: "none",
          background:
            "radial-gradient(120% 95% at 50% 38%, transparent 55%, rgba(5,6,10,0.5) 100%)",
        }}
      />

      {/* SVG distortion filter (subtle warp for the screen media) */}
      <svg
        aria-hidden
        width="0"
        height="0"
        style={{ position: "absolute", pointerEvents: "none" }}
      >
        <filter id="cinema-distort">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.008 0.013"
            numOctaves="2"
            seed="7"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="9"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
        {/* softer warp for the on-screen copy — readable, just a wobble */}
        <filter id="cinema-distort-soft">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.006 0.01"
            numOctaves="10"
            seed="7"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="4"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      {/* z3 — cinema screen (real, crawlable content) */}
      <motion.div
        className="cinema-screen"
        style={{ zIndex: 3, y: yScreen, opacity: screenOpacity, willChange: "transform" }}
      >
        {/* screen media: sharp base + edge-blurred copy, both distorted */}
        <div className="cinema-screen-media">
          <Image
            src={SCREEN_IMG}
            alt=""
            fill
            sizes="80vw"
            className="cinema-screen-img"
            style={{ objectFit: "cover" }}
          />
          <Image
            src={SCREEN_IMG}
            alt=""
            fill
            sizes="80vw"
            aria-hidden
            className="cinema-screen-img-blur"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="cinema-screen-tint" aria-hidden />
        <div className="cinema-screen-noise" aria-hidden />

        <div className="cinema-screen-inner">
          <div className="cinema-screen-top">
            <span className="cinema-eyebrow">KONAVERSE — Web Studio</span>
            <h2 className="cinema-headline">
              We build digital
              <br />
              experiences that
              <br />
              outperform.
            </h2>
            <p className="cinema-copy">
              Visitors don&apos;t convert by accident. Performance-first
              engineering shapes every interaction — turning attention into
              measurable outcomes.
            </p>
          </div>

          <dl className="cinema-stats">
            {STATS.map((s) => (
              <div className="cinema-stat" key={s.value}>
                <dt className="cinema-stat-value">{s.value}</dt>
                <dd className="cinema-stat-label">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </motion.div>

      {/* z4 — the man (locked to the same transform as the hall) */}
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 4,
          y: yRoom,
          scale: 1.08,
          willChange: "transform",
          pointerEvents: "none",
        }}
      >
        <Image src={MAN} alt="" fill sizes="100vw" style={{ objectFit: "cover" }} />
      </motion.div>
    </div>
  );
}
