"use client";

import {
  motion,
  useTransform,
  type MotionValue,
} from "framer-motion";

import {
  TEST_CURTAIN_IN,
  TEST_CURTAIN_OUT,
  TEST_CONTENT_START,
  TEST_CONTENT_END,
  TEST_FADE_OUT_0,
  TEST_FADE_OUT_1,
} from "./testimonials-timing";

// Re-export timing so callers can import from here if needed
export * from "./testimonials-timing";

// ── Placeholder testimonials (replace with real data) ───────────────────────
const TESTIMONIALS = [
  {
    id: "t1",
    quote: "KONA transformed our digital presence completely. The results speak for themselves.",
    author: "Alex M.",
    role: "CEO, TechStart",
  },
  {
    id: "t2",
    quote: "Working with KONA felt like having a creative partner, not just an agency.",
    author: "Sarah K.",
    role: "Marketing Director, Bloom",
  },
  {
    id: "t3",
    quote: "They delivered beyond our expectations — on time and with incredible attention to detail.",
    author: "James R.",
    role: "Founder, Vortex Labs",
  },
  {
    id: "t4",
    quote: "The website they built for us became our best-performing sales channel overnight.",
    author: "Maria L.",
    role: "COO, GreenPath",
  },
  {
    id: "t5",
    quote: "KONA doesn't just build websites, they build experiences. Truly next-level work.",
    author: "David C.",
    role: "Creative Director, Neon Studios",
  },
];

// ── Types ───────────────────────────────────────────────────────────────────
interface TestimonialsSectionProps {
  progress: MotionValue<number>;
  visible: boolean;
}

// Total content height estimate: title block (~200px) + 5 cards (~130px each) + gaps
// We scroll from +100vh (below fold) to about -120vh (past top) for full credits travel.
const SCROLL_TRAVEL = 220; // vh total travel distance

// ── Main component ──────────────────────────────────────────────────────────
export default function TestimonialsSection({ progress, visible }: TestimonialsSectionProps) {
  // ── Curtain — fast green sweep from bottom to top ─────────────────────
  const curtainY = useTransform(progress, [0, TEST_CURTAIN_IN, TEST_CURTAIN_OUT], [100, 0, -105]);
  const curtainOp = useTransform(
    progress,
    [0, 0.005, TEST_CURTAIN_OUT - 0.02, TEST_CURTAIN_OUT],
    [0, 1, 1, 0]
  );
  const curtainTranslateY = useTransform(curtainY, (v) => `${v}%`);

  // ── Credits scroll — content translateY driven by progress ────────────
  // Starts at +100vh (below viewport), scrolls up to -120vh (past top)
  const creditsY = useTransform(
    progress,
    [TEST_CONTENT_START, TEST_CONTENT_END],
    [100, -SCROLL_TRAVEL + 100] // vh units
  );
  const creditsTranslateY = useTransform(creditsY, (v) => `${v}vh`);

  // ── Overall content opacity (fade in after curtain, fade out at end) ──
  const contentOpacity = useTransform(
    progress,
    [TEST_CONTENT_START, TEST_CONTENT_START + 0.03, TEST_FADE_OUT_0, TEST_FADE_OUT_1],
    [0, 1, 1, 0]
  );

  if (!visible) return null;

  return (
    <>
      {/* ══ Curtain — fast green sweep bottom → top ══ */}
      <motion.div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 20,
          pointerEvents: "none",
          opacity: curtainOp,
        }}
      >
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            background: "#00ff88",
            willChange: "transform",
            y: curtainTranslateY,
          }}
        />
      </motion.div>

      {/* ══ Credits-style scrolling content — left 62% of viewport ══ */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          opacity: contentOpacity,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        <motion.div
          style={{
            position: "absolute",
            left: 0,
            width: "62%",
            paddingLeft: "7%",
            paddingRight: "3%",
            y: creditsTranslateY,
            willChange: "transform",
          }}
        >
          {/* ── Section label ── */}
          <div
            style={{
              fontFamily: "var(--font-geist-mono), monospace",
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "#00ff88",
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span style={{ opacity: 0.5 }}>◆</span>
            05 — Testimonials
          </div>

          {/* ── Title ── */}
          <div
            style={{
              fontFamily: "var(--font-monument), sans-serif",
              fontSize: "clamp(28px, 4.5vw, 64px)",
              fontWeight: 800,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.95)",
              lineHeight: 1,
              marginBottom: 48,
            }}
          >
            What They
            <br />
            <span style={{ color: "#00ff88" }}>Say.</span>
          </div>

          {/* ── Testimonial cards ── */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 24,
              maxWidth: 560,
              paddingBottom: "30vh",
            }}
          >
            {TESTIMONIALS.map((t) => (
              <div
                key={t.id}
                style={{
                  padding: "20px 24px",
                  borderRadius: 8,
                  background: "rgba(0, 255, 136, 0.04)",
                  border: "1px solid rgba(0, 255, 136, 0.1)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-geist-mono), monospace",
                    fontSize: "clamp(12px, 1.1vw, 15px)",
                    lineHeight: 1.65,
                    color: "rgba(255, 255, 255, 0.75)",
                    margin: 0,
                    marginBottom: 12,
                  }}
                >
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div
                  style={{
                    fontFamily: "var(--font-geist-mono), monospace",
                    fontSize: 10,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "#00ff88",
                  }}
                >
                  {t.author}
                  <span style={{ color: "rgba(255,255,255,0.3)", marginLeft: 8 }}>
                    {t.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}
