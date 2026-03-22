// ── CTA section scroll timing (400vh wrapper) ────────────────────────────────
// Progress 0→1 maps to 300vh of usable scroll (400vh − 100vh viewport).
// No curtain — content fades in as testimonials scroll out.
//
//   0.00–0.15   ~45vh  content fade-in
//   0.15–0.80  ~195vh  content hold
//   0.80–0.95   ~45vh  content fade-out
// ─────────────────────────────────────────────────────────────────────────────

export const CTA_FADE_IN_0  = 0.05;
export const CTA_FADE_IN_1  = 0.15;

export const CTA_FADE_OUT_0 = 0.80;
export const CTA_FADE_OUT_1 = 0.95;
