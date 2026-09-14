'use client'

import { useEffect, useRef } from 'react'
import Button from '@/components/v4/Button'
import Reveal from '@/components/v4/Reveal'
import BlockReveal from '@/components/v4/BlockReveal'
import { gsap, rem } from '@/lib/motion-v4'
import { CALENDLY_URL, ROUTES } from '@/lib/site'
import './invitation.css'

/**
 * SECTION 9 — THE INVITATION (built 2026-08-24, user-directed: "scroll-driven
 * and kind of parallax, agentic, still a light theme section, with imagery;
 * the CTA is Start a project into contact; notes/links sideways or vertical
 * for the socials").
 *
 * THE LINE is the section: display scale, wiped in line by line as it
 * enters (BlockReveal, 2026-09-14 — until then the house scroll-fill,
 * ScrollFillText, filled it letter by letter). Under it, THE TWO
 * CTAs (architecture §5a; user 2026-09-12): Contact goes to /contact for
 * the person who wants to write first, Book opens the Calendly popover for
 * the one who already wants the meeting. The email that stood here went
 * with the contact page — the address is citable text THERE now, and the
 * footer still carries it.
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
    /* phones: no plates (home.css hides the layer) — nothing to drift */
    const layer = root.querySelector<HTMLElement>('.inv-plates')
    if (layer && getComputedStyle(layer).display === 'none') return
    const rates = plates.map((el) => Number(el.dataset.drift) || 0)

    const tick = () => {
      const r = root.getBoundingClientRect()
      const vh = window.innerHeight
      if (r.bottom < -200 || r.top > vh + 200) return
      /* the section's centre relative to the viewport's, in viewport-heights:
         0 when centred, ±~1 at the edges of its travel */
      const c = (r.top + r.height / 2 - vh / 2) / vh
      /* the rates are px/vh AT THE 16px ROOT; scaled with the picture the
         plates keep the same margin-to-drift ratio at every width */
      const k = rem()
      plates.forEach((el, i) => {
        el.style.transform = `translateY(${(c * rates[i] * k).toFixed(2)}px)`
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
        {/* the line wipes in (BlockReveal, 2026-09-14, user) — it was the
            scroll-fill until then */}
        <BlockReveal
          as="h2"
          className="t-display inv-line"
          text="Make yours the site they remember."
        />

        <Reveal className="inv-act" index={1}>
          <Button href={ROUTES.contact} hoverLabel="Write to us">
            Contact us
          </Button>
          <Button ghost href={CALENDLY_URL} external hoverLabel="Pick a time">
            Book a call
          </Button>
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
