'use client'

import { useEffect, useRef } from 'react'
import Aurora from '@/components/v4/Aurora'
import { gsap, EASE } from '@/lib/motion-v4'
import { CALENDLY_URL, SECTIONS } from '@/lib/site'

/**
 * THE FOOTER (built 2026-08-24, user-directed: ~150vh, dark, the aurora as
 * its sky, revealed from BEHIND the page at a slower speed, a giant
 * Konaverse entering letter by letter, and a bottom-right arrow to the
 * next page).
 *
 * THE UNDER-REVEAL, and its TIMING CONTRACT (user call 2026-08-24): the
 * content's top edge meets the viewport's top edge EXACTLY as the section
 * above fully leaves the viewport. That pins the formula:
 * y = −0.45 × max(0, rect.top) — while the container's top is still below
 * the viewport top (the reveal), the content rides 45% behind the hand,
 * already partway up when the section above scrolls off it and landing
 * flush at rect.top = 0; from the connect moment on, y is 0 and the
 * footer scrolls at hand speed through its remaining 20svh to the page
 * end, so the bar at its floor is always reachable. `.ft`'s overflow clip
 * swallows what the shift pushes past the seam. The AURORA does not
 * translate: it lives in `.ft-sky`, outside the mover, so the sky holds
 * still while the content slides over it — one more depth cue for free.
 * Same maths family as §5's burial, run in reverse.
 *
 * THE WORDMARK. KONAVERSE at ~13vw, each letter rising out of a real
 * crop edge (the word's own overflow) across the LAST viewport of
 * approach, staggered left to right and scrubbed — scroll owns it, so
 * backing out lowers the letters again. The house rule holds: the crop
 * edge exists (it is the word's own box), so the mask is honest.
 *
 * THE SKY. Aurora.tsx on its own canvas, dimmed to 0.75 over the same
 * void it renders (dimming toward the ground it already has, so the cost
 * is one compositor multiply). A top scrim keeps the sitemap band on AA
 * ground — the aurora's hot centre may never sit under small type.
 *
 * THE NEXT-PAGE ARROW (bottom right → /about): a ringed arrow whose
 * glyph exits right and re-enters from the left on hover — a move no
 * other element on the page uses, which is what the user asked of it.
 * Same 16-box arrow geometry as ArrowLink, so it is the same arrow.
 *
 * FALLBACKS. No JS / reduced motion: no counter-translation (the footer
 * is simply in flow), letters resting assembled, aurora per Aurora.tsx's
 * own fallbacks. Every link, the email and the wordmark are real DOM
 * text (the letters are aria-hidden under one aria-label).
 */

/**
 * ONE-PAGE LAUNCH (2026-08-25): in-page anchors, Pricing/Journal dropped,
 * and Contact opens CALENDLY in a new tab — an interested visitor books a
 * meeting on the spot (user call). Routes return with the inner pages.
 */
const PAGES: { label: string; href: string; external?: boolean }[] = [
  { label: 'Home', href: '/' },
  { label: 'Work', href: SECTIONS.work },
  { label: 'Services', href: SECTIONS.services },
  { label: 'Studio', href: SECTIONS.studio },
  { label: 'Contact', href: CALENDLY_URL, external: true },
]

const SOCIALS = [
  { label: 'Instagram', href: 'https://www.instagram.com/konaverse.cy/' },
  { label: 'Facebook', href: 'https://www.facebook.com/konaverse' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/konaverse' },
]

const LEGAL = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Cookies', href: '/cookies' },
]

const WORD = 'Konaverse'

/** Content moves at (1 − DRAG) of hand speed during the reveal. */
const DRAG = 0.45
/** Letters assemble across this fraction of the last viewport of travel.
 *  Tuned DOWN from 0.9 when the word moved to the floor (user call): it
 *  only clears the bottom edge in roughly the last fifth of the travel,
 *  so a wider window meant arriving assembled. This starts the rise just
 *  as the word comes into view and lands the last letter at page end. */
const WORD_SPAN = 0.26

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)
const smooth = (v: number) => {
  const t = clamp01(v)
  return t * t * (3 - 2 * t)
}

export default function SiteFooter() {
  const rootRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const inner = root.querySelector<HTMLElement>('.ft-inner')
    const letters = Array.from(root.querySelectorAll<HTMLElement>('.ft-l'))
    if (!inner) return

    const N = letters.length
    const word = root.querySelector<HTMLElement>('.ft-word')
    /* PHONES: the word lives at the floor (user call 2026-08-26) and is
       ~46px tall, so its box is only on screen for the last few dozen
       pixels of scroll — nothing to scrub across. The rise is a ONE-SHOT
       entrance there instead: fired as the box enters, reversed if the
       hand backs out far enough that the box has gone again, so a return
       replays it. Desktop keeps the scrub. */
    const phone = window.matchMedia('(max-width: 57.5rem)')
    /* the CSS parks the letters with translateY(108%); GSAP reads that as
       PIXELS off the computed matrix, so a yPercent tween alone would leave
       the pixel offset in place — restate the parked state in GSAP's terms */
    if (phone.matches) gsap.set(letters, { yPercent: 108, y: 0 })
    let risen = false
    let riseTween: gsap.core.Tween | null = null
    const rise = (up: boolean) => {
      risen = up
      riseTween?.kill()
      riseTween = gsap.to(letters, {
        yPercent: up ? 0 : 108,
        duration: up ? 0.9 : 0.5,
        ease: up ? EASE.glass : EASE.settle,
        stagger: up ? 0.05 : 0.02,
        overwrite: true,
      })
    }
    const tick = () => {
      const r = root.getBoundingClientRect()
      const vh = window.innerHeight
      if (r.top > vh + 100) return
      /* the timing contract: dragged only while the seam is still coming
         up the viewport; flush the instant the section above is gone */
      gsap.set(inner, { y: -DRAG * Math.max(0, r.top) })
      /* remaining travel: 0 at page end — the wordmark's clock */
      const e = Math.max(0, r.bottom - vh)

      if (phone.matches) {
        const wr = word ? word.getBoundingClientRect() : r
        const entered = wr.top < vh - 8
        if (entered && !risen) rise(true)
        else if (!entered && risen && wr.top > vh + wr.height * 2) rise(false)
        return
      }

      /* the wordmark, scrubbed across the last viewport of approach */
      const q = 1 - clamp01(e / (vh * WORD_SPAN))
      for (let j = 0; j < N; j++) {
        const lp = smooth((q - (j / N) * 0.5) / 0.5)
        letters[j].style.transform = `translateY(${((1 - lp) * 108).toFixed(2)}%)`
      }
    }
    tick()
    gsap.ticker.add(tick)

    return () => {
      gsap.ticker.remove(tick)
      riseTween?.kill()
      gsap.set(inner, { clearProps: 'transform' })
      letters.forEach((l) => gsap.set(l, { clearProps: 'transform' }))
    }
  }, [])

  return (
    <footer ref={rootRef} className="ft k-dark">
      {/* the sky: static behind the mover, so the content slides over it */}
      <div className="ft-sky" aria-hidden="true">
        <Aurora />
        <i className="ft-scrim" />
      </div>

      <div className="ft-inner">
        <div className="k-page ft-top">
          <div className="ft-id">
            <img
              className="ft-logo"
              src="/About/KonaLogoNoBg.png"
              alt="Konaverse"
              width="44"
              height="44"
            />
            <p className="ft-tagline t-body">
              Structural code, cinematic detail.
              <br />
              Built in Cyprus, shipped worldwide.
            </p>
          </div>

          <nav className="ft-cols" aria-label="Site">
            <ul className="ft-col">
              {PAGES.map((l) => (
                <li key={l.href}>
                  <a
                    className="ft-link t-body"
                    href={l.href}
                    target={l.external ? '_blank' : undefined}
                    rel={l.external ? 'noopener noreferrer' : undefined}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <ul className="ft-col">
              {SOCIALS.map((l) => (
                <li key={l.href}>
                  <a
                    className="ft-link t-body"
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <ul className="ft-col">
              {LEGAL.map((l) => (
                <li key={l.href}>
                  <a className="ft-link t-body" href={l.href}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="k-page ft-mid">
          <a className="ft-mail t-h2" href="mailto:info@kona-verse.com">
            info@kona-verse.com
          </a>
        </div>

        <div className="ft-foot">
          {/* the bar rides ABOVE the hairline; the wordmark is the floor
              itself, sunk a little past the bottom edge (user call) */}
          <div className="k-page ft-bar">
            <p className="ft-fine t-small">
              &copy; {new Date().getFullYear()} Konaverse. All rights reserved.
            </p>
            <a className="ft-next" href={SECTIONS.studio}>
              <span className="t-small">The studio</span>
              <span className="ft-next-ring" aria-hidden="true">
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" className="ft-next-a ft-next-a1">
                  <path d="M2 8 L13 8" />
                  <path d="M9 4.5 L13 8 L9 11.5" />
                </svg>
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" className="ft-next-a ft-next-a2">
                  <path d="M2 8 L13 8" />
                  <path d="M9 4.5 L13 8 L9 11.5" />
                </svg>
              </span>
            </a>
          </div>

          <p className="ft-word" aria-label={WORD}>
            {WORD.split('').map((ch, j) => (
              <span className="ft-lbox" key={j} aria-hidden="true">
                <span className="ft-l">{ch}</span>
              </span>
            ))}
          </p>
        </div>
      </div>
    </footer>
  )
}
