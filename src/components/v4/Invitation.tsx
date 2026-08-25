'use client'

import { useEffect, useRef } from 'react'
import Button from '@/components/v4/Button'
import Reveal from '@/components/v4/Reveal'
import ScrollFillText from '@/components/v4/ScrollFillText'
import { gsap } from '@/lib/motion-v4'
import { CALENDLY_URL } from '@/lib/site'

/**
 * SECTION 9 — THE INVITATION (built 2026-08-24, user-directed: "scroll-driven
 * and kind of parallax, agentic, still a light theme section, with imagery;
 * the CTA is Start a project into contact; notes/links sideways or vertical
 * for the socials").
 *
 * THE LINE is the section: display scale, filling letter by letter as it
 * travels the viewport (ScrollFillText — the house scroll-fill, so the last
 * thing anyone reads arrives the way §2's claim did). Under it, ONE button
 * and the email as REAL text — no form on the homepage, forms belong on
 * /contact (choreography §9), and a real address is citable text where a
 * "contact us" button is invisible to a crawler.
 *
 * THE PLATES are the imagery: two framed stills drifting at different rates
 * as the section travels — the parallax is depth, not decoration, so the
 * rates STRADDLE the page (one behind it, one ahead of it) and stay small.
 * Driven off the shared ticker with rect math, transform-only, and the
 * plates are aria-hidden: they are atmosphere, not content. Art is
 * PLACEHOLDER (B1) — the two /work stills the featured set does not use,
 * graded monochrome by an interim CSS filter exactly like §3's plate
 * (safe on the IMG, never on an ancestor of the fluid canvas).
 *
 * THE SOCIAL RAIL runs vertically up the right edge (user ask) — three
 * links, muted to ink on hover, real <a>s reading bottom-to-top. On touch
 * widths it lies back down into a plain row.
 *
 * Copy is PLACEHOLDER — the user writes the real line (checklist 6.6).
 */

const SOCIALS = [
  { label: 'Instagram', href: 'https://www.instagram.com/konaverse.cy/' },
  { label: 'Facebook', href: 'https://www.facebook.com/konaverse' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/konaverse' },
]

export default function Invitation() {
  const rootRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const plates = Array.from(root.querySelectorAll<HTMLElement>('[data-drift]'))
    if (!plates.length) return
    const rates = plates.map((el) => Number(el.dataset.drift) || 0)

    const tick = () => {
      const r = root.getBoundingClientRect()
      const vh = window.innerHeight
      if (r.bottom < -200 || r.top > vh + 200) return
      /* the section's centre relative to the viewport's, in viewport-heights:
         0 when centred, ±~1 at the edges of its travel */
      const c = (r.top + r.height / 2 - vh / 2) / vh
      plates.forEach((el, i) => {
        el.style.transform = `translateY(${(c * rates[i]).toFixed(2)}px)`
      })
    }
    tick()
    gsap.ticker.add(tick)

    return () => {
      gsap.ticker.remove(tick)
      plates.forEach((el) => (el.style.transform = ''))
    }
  }, [])

  return (
    <section ref={rootRef} className="inv" id="contact" aria-label="Start a project">
      {/* the drifting plates — atmosphere, not content */}
      <div className="inv-plates" aria-hidden="true">
        <figure className="inv-plate inv-plate-a" data-drift="-64">
          <img src="/work/corridor.webp" alt="" loading="lazy" decoding="async" />
        </figure>
        <figure className="inv-plate inv-plate-b" data-drift="42">
          <img src="/work/orb.webp" alt="" loading="lazy" decoding="async" />
        </figure>
      </div>

      <div className="k-page inv-body">
        <ScrollFillText
          as="h2"
          className="t-display inv-line"
          text="Make yours the site they remember."
        />

        <Reveal className="inv-act" index={1}>
          <Button href={CALENDLY_URL} external hoverLabel="Book a call">
            Start a project
          </Button>
          <a className="inv-mail t-body" href="mailto:info@kona-verse.com">
            info@kona-verse.com
          </a>
        </Reveal>
      </div>

      {/* the sideways notes — reading bottom-to-top up the right edge */}
      <nav className="inv-social" aria-label="Social media">
        {SOCIALS.map((s) => (
          <a
            key={s.label}
            className="inv-soc t-small"
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {s.label}
          </a>
        ))}
      </nav>
    </section>
  )
}
