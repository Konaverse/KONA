/**
 * A NOIR GRADE PREVIEW, FOR SCREENSHOTS ONLY.
 *
 * The real imagery is being edited outside this repo and will arrive already
 * graded and textured (user, 2026-08-22). Nothing here ships, and nothing here
 * is imported by the app — it exists so a section can be judged against roughly
 * what it will look like before those assets exist, instead of being judged
 * against blue stand-in art that flatters nothing and misleads every contrast
 * call.
 *
 * Injected by tools/shot.js and tools/shot-fluid.js when PREVIEW_GRADE=1.
 *
 * DELIBERATELY NOT ON `.k-root`. A filter on an ancestor of the fluid canvas
 * creates a stacking context and silently kills the difference blend — the
 * exact failure mode documented in FluidCursor.tsx. Media elements only.
 *
 * It is a preview, not a proposal: grayscale plus a contrast lift is the cheap
 * approximation of a grade. It carries no film texture, because the shipping
 * grain is one fixed layer at the root and per-image noise would both
 * misrepresent the result and break the rule that keeps it cheap.
 */
const PREVIEW_GRADE = `
  img, video, .hp-canvas, .sv-img, .hw-pill img, .wt-shot img {
    filter: grayscale(1) contrast(1.16) brightness(0.94) !important;
  }
  /* the hero portrait is the one that carries the section, so it takes the
     harder push a real noir grade would give it */
  .hw-img, .hw-mimg, .sv-img {
    filter: grayscale(1) contrast(1.28) brightness(0.86) !important;
  }
`

module.exports = { PREVIEW_GRADE }
