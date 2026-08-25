import { gsap } from 'gsap'
import { CustomEase } from 'gsap/CustomEase'

gsap.registerPlugin(CustomEase)

/**
 * The four token easings, registered as GSAP eases.
 *
 * GSAP cannot read a cubic-bezier() string natively, so the usual shortcut is
 * to reach for the nearest built-in (power3.out and friends). That quietly puts
 * the JS-driven motion on a different curve from the CSS-driven motion, which is
 * exactly how a site ends up feeling incoherent. CustomEase ships free in GSAP
 * 3.13, so these are the *same* curves as --e-glass / --e-drift / --e-arc /
 * --e-settle in tokens.css, to the control point.
 *
 * If a value changes in tokens.css it must change here too. There is no way to
 * read a CSS custom property at module scope, so this pair is the one place in
 * the system where a token is written twice — hence the comment.
 */
export const EASE = {
  glass:  CustomEase.create('k-glass',  'M0,0 C0.22,1 0.36,1 1,1'),
  drift:  CustomEase.create('k-drift',  'M0,0 C0.65,0 0.35,1 1,1'),
  arc:    CustomEase.create('k-arc',    'M0,0 C0.83,0 0.17,1 1,1'),
  settle: CustomEase.create('k-settle', 'M0,0 C0.16,1 0.30,1 1,1'),
  /**
   * The reference's measured curve — KEPT FOR THE RECORD, no longer in use.
   *
   * Fitted to the reference recording frame by frame: the top edge of the
   * incoming page was tracked across 1918x900 at 30fps and a cubic bezier was
   * least-squares fitted to its rise (rms 0.022 over 11 samples). A brief
   * ease-in into a very long ease-out tail; none of the four tokens fit it
   * (e-glass 0.099 · e-settle 0.148 · e-drift 0.407 · e-arc 0.426).
   *
   * The transition ran on it, was watched, and the user chose EASE.arc over
   * it — slow in, fast middle, soft landing, which is what the choreography
   * document had specified all along. The measurement documented what exoape
   * built; the feel pass decides what WE build. This stays so the comparison
   * can be re-run in one line.
   */
  page:   CustomEase.create('k-page',   'M0,0 C0.304,0.635 0,0.835 1,1'),
} as const

/** Durations, in seconds, mirroring --d-* in tokens.css. */
export const DUR = {
  instant: 0.12,
  quick:   0.24,
  base:    0.42,
  slow:    0.9,
  cinema:  1.4,
  /** The page transition. Measured off the reference at ~0.68s; lengthened to
   *  1s by the user's decision after watching the working move — the feel pass
   *  outranks the measurement. Runs on EASE.arc (also user-chosen; EASE.page
   *  below preserves the measured curve if it is ever wanted back). */
  page:    1.0,
} as const

/**
 * The picture's scale factor: root font-size over 16. The desktop root
 * follows the viewport width (tokens.css, "THE PICTURE"), so any JS number
 * that is a CSS-pixel LENGTH of the composition — a reveal shift, a blur
 * radius, a parallax rate — multiplies by this to stay proportional.
 * Percent, vh/vw fractions and measured rects need nothing. 1 on the server
 * and below the desktop breakpoint.
 */
export const rem = () =>
  typeof window === 'undefined'
    ? 1
    : parseFloat(getComputedStyle(document.documentElement).fontSize) / 16

/** --reveal-blur / --reveal-shift / --stagger — at the 16px root; scale
 *  by rem() at the use site. */
export const REVEAL = {
  blur:    14,
  shift:   18,
  stagger: 0.08,
} as const

/* Dev-only handle so headless recordings can slow the clock
 * (window.__gsap.globalTimeline.timeScale(0.25)) and film a move in
 * detail. Stripped from production bundles by the env guard. */
if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
  ;(window as unknown as { __gsap: typeof gsap }).__gsap = gsap
}

export { gsap }
