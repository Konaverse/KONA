// ── Projects INTRO scroll timing (600vh wrapper) ─────────────────────────────
// Single source of truth for the intro header section (curtain + "Selected Work").
// Progress 0→1 maps to 500vh of usable scroll (600vh − 100vh viewport).
//
//   0.00–0.36  180vh  curtain sweep
//   0.40–0.53   65vh  intro header fade-in
//   0.53–0.79  130vh  intro header hold
//   0.79–0.89   50vh  header fade-out
//   0.89–1.00   55vh  breathing room
// ─────────────────────────────────────────────────────────────────────────────

export const CURTAIN_IN         = 0.17;
export const CURTAIN_OUT        = 0.36;

export const SECTION_FADE_IN_0  = 0.40;
export const SECTION_FADE_IN_1  = 0.53;

export const HEADER_FADE_OUT_0  = 0.86;
export const HEADER_FADE_OUT_1  = 0.96;

// ── Projects ACTS 1/2/3 scroll timing (1500vh wrapper) ──────────────────────
// Progress 0→1 maps to 1400vh of usable scroll (1500vh − 100vh viewport).
//
//   0.00–0.015   21vh  section fade-in
//   0.015–0.33  435vh  Act 1: Websites  (3 projects × ~145vh each)
//   0.33–0.63   420vh  Act 2: Videos    (3 projects × ~140vh each)
//   0.63–0.93   420vh  Act 3: Social    (3 projects × ~140vh each)
//   0.93–0.98    70vh  exit fade
// ─────────────────────────────────────────────────────────────────────────────

export const ACT_1_START        = 0.015;
export const ACT_2_START        = 0.33;
export const ACT_3_START        = 0.63;

export const SECTION_FADE_OUT_0 = 0.93;
export const SECTION_FADE_OUT_1 = 0.98;

// Per-project step sizes within each act (3 projects per act)
export const ACT_1_STEP = (ACT_2_START - ACT_1_START) / 3; // 0.10 → ~140vh
export const ACT_2_STEP = (ACT_3_START - ACT_2_START) / 3; // 0.10 → ~140vh
export const ACT_3_STEP = (SECTION_FADE_OUT_0 - ACT_3_START) / 3; // 0.10 → ~140vh

// ── Letterbox bars (Act 2 — Videos) ─────────────────────────────────────────
export const LETTERBOX_IN  = ACT_2_START;
export const LETTERBOX_OUT = ACT_3_START - 0.02;
