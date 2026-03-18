// ── Projects section scroll timing (1600vh wrapper) ───────────────────────────
// Single source of truth imported by ProjectsSection.tsx and all Act*.tsx files.
//
// 1600vh layout  (1500vh usable scroll = wrapper − 100vh viewport):
//   0.00–0.12  180vh  curtain sweep
//   0.12–0.22  150vh  intro header hold
//   0.22–0.27   75vh  header fade-out
//   0.25–0.49  360vh  Act 1: Websites   (3 projects × 120vh each)
//   0.49–0.64  225vh  Act 2: Videos     (3 projects ×  75vh each)
//   0.64–0.86  330vh  Act 3: Social     (3 projects × 110vh each)
//   0.86–0.91   75vh  exit fade
// ─────────────────────────────────────────────────────────────────────────────

export const CURTAIN_IN         = 0.05;
export const CURTAIN_OUT        = 0.12;

export const SECTION_FADE_IN_0  = 0.13;
export const SECTION_FADE_IN_1  = 0.17;

export const HEADER_FADE_OUT_0  = 0.22;  // header starts fading
export const HEADER_FADE_OUT_1  = 0.27;  // header fully gone

export const ACT_1_START        = 0.25;  // Websites — overlaps briefly with header fade
export const ACT_2_START        = 0.49;  // Videos
export const ACT_3_START        = 0.64;  // Social Media

export const SECTION_FADE_OUT_0 = 0.86;
export const SECTION_FADE_OUT_1 = 0.91;

// Per-project step sizes within each act (3 projects per act)
export const ACT_1_STEP = (ACT_2_START - ACT_1_START) / 3; // = 0.0800  (120vh)
export const ACT_2_STEP = (ACT_3_START - ACT_2_START) / 3; // = 0.0500  ( 75vh)
export const ACT_3_STEP = (SECTION_FADE_OUT_0 - ACT_3_START) / 3; // = 0.0733 (110vh)
