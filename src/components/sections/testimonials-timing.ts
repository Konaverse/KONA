// ── Testimonials section scroll timing (800vh wrapper) ────────────────────────
// Progress 0→1 maps to 700vh of usable scroll (800vh − 100vh viewport).
//
//   0.00–0.08   ~56vh  green curtain sweep (bottom → top) — fast
//   0.06               background swap point (behind opaque curtain)
//   0.08–0.14   ~42vh  curtain exits top
//   0.14–0.90  ~532vh  credits-style content scroll
//   0.90–0.97   ~49vh  section fade-out
// ─────────────────────────────────────────────────────────────────────────────

export const TEST_CURTAIN_IN       = 0.08;   // curtain fully covers viewport
export const TEST_CURTAIN_OUT      = 0.14;   // curtain exits top

export const TEST_CONTENT_START    = 0.12;   // content begins scrolling up (still behind curtain tail)
export const TEST_CONTENT_END      = 0.90;   // content finishes scrolling

export const TEST_FADE_OUT_0       = 0.90;
export const TEST_FADE_OUT_1       = 0.97;
