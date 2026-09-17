'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import BlockReveal from '@/components/v4/BlockReveal'
import Button from '@/components/v4/Button'
import FooterField from '@/components/v4/FooterField'
import Reveal from '@/components/v4/Reveal'
import { gsap, rem } from '@/lib/motion-v4'
import { CALENDLY_URL, CONTACT_EMAIL, ROUTES } from '@/lib/site'

/**
 * THE FOOTER — rebuilt 2026-09-16 (user: "we need something better to
 * describe us … background should be black with minimal look").
 *
 * The aurora sky and the giant wordmark are gone. The footer is now the
 * house void, flat, carrying ONE thing: the studio's own description in
 * the light display voice — what we do, who we are, where — with the
 * site map beside it, the address under it, and a single bar at the
 * floor. No picture, no label, no ornament. A break is space plus a
 * hairline, as everywhere else on the site.
 *
 * THE COPY is the site's canonical line, not a new claim: the About
 * page's own description ("websites with a character of their own").
 *
 * THE UNDER-REVEAL stays, re-based for a footer shorter than the
 * viewport. The content is counter-translated by −DRAG × the seam's
 * remaining travel (how far the footer's top still has to climb before
 * the page ends), so it slides up from behind the page above at 55% of
 * hand speed and lands flush, y = 0, exactly at page end. `.ft`'s
 * overflow clip swallows what the shift pushes past the seam. Pages
 * sliding over each other is the house move; this is the last one.
 *
 * THE CLAIM wipes in (BlockReveal, the block wipe the statements use);
 * the rest resolves with the default reveal.
 *
 * THE NEXT-PAGE ARROW (user, 2026-08-24) is now route-aware: it points
 * at the page after this one in the menu's order and wraps home, so
 * the footer reads as the page's own end rather than a fixed sign to
 * /about on every route. Same 16-box arrow as ArrowLink; the glyph
 * exits right and re-enters from the left on hover — still the one
 * element on the page with that move.
 *
 * FALLBACKS. No JS / reduced motion: no counter-translation (the footer
 * is simply in flow), the claim plain (BlockReveal ships its text),
 * everything server-rendered.
 *
 * SECOND PASS, 2026-09-18 (user: "the concept of the reveal stays. The
 * layout is good but it can be improved. The background also can be
 * improved. I would like something animated or interactive").
 *   · THE GROUND is THE FIELD (FooterField.tsx): a lattice of points on
 *     the void that the hand lenses, a press rings, and the reveal
 *     powers on from the seam down.
 *   · THE ADDRESS is the footer's big object now — set across the width
 *     in display type, and its letters take WEIGHT from the hand
 *     (Manrope's variable axis, 200 → 760 by distance, on a glide). It
 *     replaces the drawn underline: nothing here is a hairline any more,
 *     the bar's rule included.
 *   · THE TWO CTAs (Contact, Book) stand beside the description on
 *     /work only — that page ends on the footer; the others end on the
 *     Invitation, which already carries them.
 *   · THE MAP is set larger and light; a column dims around the link
 *     under the hand.
 *   · 2026-09-18, later (user): the description paragraph and the
 *     Cyprus clock are cut — the claim stands alone over the map.
 */

const CLAIM = 'We design and build websites with a character of their own.'

const PAGES: { label: string; href: string }[] = [
  { label: 'Home', href: ROUTES.home },
  { label: 'Services', href: ROUTES.services },
  { label: 'Work', href: ROUTES.work },
  { label: 'About', href: ROUTES.about },
  { label: 'Contact', href: ROUTES.contact },
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

/** the pages in menu order, and how the arrow names each as a destination */
const NEXT: { href: string; label: string }[] = [
  { href: ROUTES.home, label: 'Home' },
  { href: ROUTES.services, label: 'Services' },
  { href: ROUTES.work, label: 'The work' },
  { href: ROUTES.about, label: 'The studio' },
  { href: ROUTES.contact, label: 'Contact' },
]

/** the page after this one; a nested route counts as its hub, anything
 *  outside the menu (the legal pages) goes home */
function nextPage(pathname: string | null) {
  const p = pathname || '/'
  const i = NEXT.findIndex((r) =>
    r.href === '/' ? p === '/' : p === r.href || p.startsWith(r.href + '/'),
  )
  return i < 0 ? NEXT[0] : NEXT[(i + 1) % NEXT.length]
}

/** Content moves at (1 − DRAG) of hand speed during the reveal. */
const DRAG = 0.45
/** the address under the hand: the weights, the reach (rem), the glide (s) */
const WGHT = [200, 760]
const REACH = 11
const WGHT_GLIDE = 0.14

export default function SiteFooter() {
  const rootRef = useRef<HTMLElement | null>(null)
  const pathname = usePathname()
  const next = nextPage(pathname)
  /* the two CTAs stand here only where the page above does not already end
     on them (the Invitation, a case study's own): the work hub */
  const invite = pathname === ROUTES.work

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const inner = root.querySelector<HTMLElement>('.ft-inner')
    if (!inner) return

    const tick = () => {
      const r = root.getBoundingClientRect()
      const vh = window.innerHeight
      if (r.top > vh + 100) return
      /* the seam's remaining travel: r.top climbs to (vh − height) at
         page end, so this is how far it still has to go — 0 at the end */
      const rest = r.top - (vh - r.height)
      gsap.set(inner, { y: -DRAG * Math.max(0, rest) })
    }
    tick()
    gsap.ticker.add(tick)

    /* THE ADDRESS takes weight from the hand */
    const letters = Array.from(root.querySelectorAll<HTMLElement>('.ft-mail-l'))
    const weights = letters.map(() => WGHT[0])
    let px = -1
    let py = -1
    const onMove = (ev: PointerEvent) => {
      px = ev.clientX
      py = ev.clientY
    }
    const onGone = () => (px = -1)
    const fine = window.matchMedia('(hover: hover)').matches
    if (fine) {
      window.addEventListener('pointermove', onMove, { passive: true })
      document.documentElement.addEventListener('pointerleave', onGone)
    }
    const weigh = (_t?: number, deltaTime?: number) => {
      if (!letters.length) return
      const r = root.getBoundingClientRect()
      if (r.top > window.innerHeight || r.bottom < 0) return
      const dt = Math.min(0.05, (deltaTime ?? 16.7) / 1000)
      const f = 1 - Math.exp(-dt / WGHT_GLIDE)
      const reach = REACH * 16 * rem()
      const near = px >= 0 && py >= r.top && py <= r.bottom
      letters.forEach((l, i) => {
        let to = WGHT[0]
        if (near) {
          const b = l.getBoundingClientRect()
          const d = Math.hypot(px - (b.left + b.width / 2), py - (b.top + b.height / 2))
          const k = Math.max(0, 1 - d / reach)
          to = WGHT[0] + (WGHT[1] - WGHT[0]) * k * k * (3 - 2 * k)
        }
        if (Math.abs(to - weights[i]) < 0.5) return
        weights[i] += (to - weights[i]) * f
        l.style.fontVariationSettings = `"wght" ${weights[i].toFixed(0)}`
      })
    }
    if (fine) gsap.ticker.add(weigh)

    return () => {
      gsap.ticker.remove(tick)
      gsap.ticker.remove(weigh)
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onGone)
      letters.forEach((l) => (l.style.fontVariationSettings = ''))
      gsap.set(inner, { clearProps: 'transform' })
    }
  }, [])


  return (
    <footer ref={rootRef} className="ft k-dark">
      <FooterField />
      <div className="ft-inner">
        <div className="k-page ft-top">
          <div className="ft-say">
            <BlockReveal as="h2" className="t-h1 ft-claim" text={CLAIM} />
            <div className="ft-sub">
            {invite ? (
            <Reveal as="div" className="ft-acts" index={2}>
              <Button href={ROUTES.contact} hoverLabel="Say hello">
                Contact us
              </Button>
              <Button href={CALENDLY_URL} external ghost hoverLabel="Pick a time">
                Book a call
              </Button>
            </Reveal>
            ) : null}
            </div>
          </div>

          <Reveal as="div" className="ft-nav" index={1}>
            <nav aria-label="Site">
              <ul className="ft-col">
                {PAGES.map((l) => (
                  <li key={l.href}>
                    <a className="ft-link t-body" href={l.href}>
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <nav aria-label="Social media">
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
            </nav>
          </Reveal>
        </div>

        {/* THE ADDRESS: the letters are painted copies, the link carries the name */}
        <Reveal as="div" className="k-page ft-mail-row" index={1}>
          <a className="ft-mail" href={`mailto:${CONTACT_EMAIL}`} aria-label={CONTACT_EMAIL}>
            {CONTACT_EMAIL.split('').map((ch, i) => (
              <span key={i} className="ft-mail-l" aria-hidden="true">
                {ch}
              </span>
            ))}
          </a>
        </Reveal>

        <div className="k-page ft-bar">
          <div className="ft-bar-in">
            <p className="ft-fine t-small">
              <img
                className="ft-logo"
                src="/brand/mark.png"
                alt=""
                width="28"
                height="28"
              />
              &copy; {new Date().getFullYear()} Konaverse
            </p>

            <ul className="ft-legal" aria-label="Legal">
              {LEGAL.map((l) => (
                <li key={l.href}>
                  <a className="ft-link t-small" href={l.href}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>

            <a className="ft-next" href={next.href}>
              <span className="t-small">{next.label}</span>
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
        </div>
      </div>
    </footer>
  )
}
