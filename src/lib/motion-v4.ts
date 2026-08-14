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
} as const

/** Durations, in seconds, mirroring --d-* in tokens.css. */
export const DUR = {
  instant: 0.12,
  quick:   0.24,
  base:    0.42,
  slow:    0.9,
  cinema:  1.4,
} as const

/** --reveal-blur / --reveal-shift / --stagger. */
export const REVEAL = {
  blur:    14,
  shift:   18,
  stagger: 0.08,
} as const

export { gsap }
