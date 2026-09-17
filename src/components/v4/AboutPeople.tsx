'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/motion-v4'

/**
 * THE PEOPLE — THREE CARDS (2026-09-16, user: "something simpler but
 * we'll do it perfectly. three cards, all the same size, in a 200vh
 * section with a little bit abstract positioning, moving at different
 * speeds… something editorial. At some point all of the people need
 * to be visible in the frame. We still keep the background
 * transition"). It replaces, the same day, a pinned stage with letter
 * flips whose portraits went through a slatted shutter, then a drum,
 * then a GL funnel — all rejected.
 *
 * THE LAYOUT (about.css). A 200svh section on paper, not pinned.
 * Three cards of one size — the portrait in a rounded frame, then a
 * hairline, the name, the role (no description, no numbering) — set
 * about the section's centre line: the first high on the LEFT, the
 * second lower on the RIGHT, the third lower still near the CENTRE.
 * At the section's midpoint all three faces are in the viewport.
 *
 * THE PARALLAX. Each card rides the scroll at its own rate — the first
 * slower than the page, the second a little faster, the third faster
 * still (RATES, in viewport heights of drift across the section's
 * travel). Rate 0 would be the page; the drift is zero at the
 * midpoint, so the layout IS the composition where it matters and the
 * cards fan apart on the way in and gather on the way out. One
 * transform per card off gsap.ticker + one rect; no lag on top of
 * Lenis — the page and the cards share one clock.
 *
 * THE GROUND. Paper (user, 2026-09-17: "make the team and the below
 * section light theme"). The fade to the void this driver used to
 * write on the page root (`--ab-dark`, held through the opening) is
 * gone; the section sits on the page's own ground like the statement
 * above it.
 *
 * THE DOLLY ZOOM (same day, the user's People.zip: for each person the
 * set with them painted out, and them cut out). Two layers in the
 * frame; as the card crosses the viewport the set pulls back from a
 * close-up about head height while the person holds their size — the
 * Vertigo shot, the space opening up behind a still figure. The
 * driver owns both transforms (BG_*, CUT_*).
 *
 * THE ENTRANCE. Each frame comes up whole as its card enters, and the
 * caption, set IN the picture over a scrim at its foot, rises a beat
 * behind it (`is-in`, about.css). The mosaic that used to resolve
 * block by block (PixelReveal.tsx, parked, unimported) was removed at
 * the user's word, 2026-09-17. Reduced motion:
 * no parallax, everything in place. No JS: page.tsx's noscript lifts
 * the entrance. Every word is server-rendered.
 */

export type Person = {
  id: string
  name: string
  role: string
  /** the composed picture, for the schema */
  portrait: string
  /** THE DOLLY'S TWO LAYERS (the user's People.zip, 2026-09-16): the
   *  set with the person painted out, and the person cut out */
  bg: string
  cut: string
  bio: string
}

/** each card's drift across the section's travel, in viewport heights:
 *  negative lags the page (slower), positive leads it (faster) */
const RATES = [-0.22, 0.14, 0.5]
/** THE DOLLY ZOOM. As a card crosses the viewport (0 entering at the
 *  bottom, 1 leaving at the top) the set behind the person PULLS BACK
 *  — close up on entry (BG_FROM), zooming out to BG_TO — about a point
 *  at head height, while the person themself barely moves (CUT_FROM →
 *  CUT_TO): the space opens up behind a figure that holds its size
 *  (user, 2026-09-16: "the background is close up and as you move it
 *  zooms out"). */
const BG_FROM = 1.5
const BG_TO = 1
const CUT_FROM = 0.98
const CUT_TO = 1.04

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)

export default function AboutPeople({ people }: { people: readonly Person[] }) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const sec = ref.current
    if (!sec) return
    const cards = Array.from(sec.querySelectorAll<HTMLElement>('.ab-ppl-card'))
    const layers = cards.map((c) => ({
      pic: c.querySelector<HTMLElement>('.ab-ppl-pic'),
      bg: c.querySelector<HTMLElement>('.ab-ppl-bg'),
      cut: c.querySelector<HTMLElement>('.ab-ppl-cut'),
      last: -1,
    }))
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const phone = window.matchMedia('(max-width: 57.5rem)').matches

    /* the entrance, once each */
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          ;(e.target as HTMLElement).classList.add('is-in')
          io.unobserve(e.target)
        })
      },
      { threshold: 0.2 },
    )
    if (reduce) cards.forEach((c) => c.classList.add('is-in'))
    else cards.forEach((c) => io.observe(c))

    let lastP = -1
    const tick = () => {
      const r = sec.getBoundingClientRect()
      const vh = window.innerHeight
      if (r.bottom < -vh || r.top > vh * 2) return

      /* THE PARALLAX: 0 as the section's top enters at the bottom, 1 as
         its bottom leaves at the top; no drift at the midpoint */
      const p = (vh - r.top) / (vh + r.height)
      if (!phone && Math.abs(p - lastP) >= 0.0002) {
        lastP = p
        cards.forEach((c, i) => {
          const dy = -(p - 0.5) * (RATES[i] ?? 0) * vh
          c.style.transform = `translate3d(0, ${dy.toFixed(2)}px, 0)`
        })
      }

      /* THE DOLLY: each frame's own crossing of the viewport, read
         after the parallax so the zoom follows where the card IS */
      layers.forEach((l) => {
        if (!l.pic || !l.bg || !l.cut) return
        const fr = l.pic.getBoundingClientRect()
        const q = clamp01((vh - fr.top) / (vh + fr.height))
        if (Math.abs(q - l.last) < 0.0005) return
        l.last = q
        l.bg.style.transform = `scale(${(BG_FROM + (BG_TO - BG_FROM) * q).toFixed(4)})`
        l.cut.style.transform = `scale(${(CUT_FROM + (CUT_TO - CUT_FROM) * q).toFixed(4)})`
      })
    }
    if (!reduce) {
      tick()
      gsap.ticker.add(tick)
    }

    return () => {
      io.disconnect()
      gsap.ticker.remove(tick)
      cards.forEach((c) => {
        c.classList.remove('is-in')
        c.style.transform = ''
      })
      layers.forEach((l) => {
        if (l.bg) l.bg.style.transform = ''
        if (l.cut) l.cut.style.transform = ''
      })
    }
  }, [])

  return (
    <section ref={ref} className="ab-ppl" aria-label="Who we are">
      <p className="ab-ppl-k">The three behind the work</p>
      <h2 className="ab-ppl-t">Who we are</h2>

      {people.map((p, i) => (
        <article key={p.id} className={`ab-ppl-card ab-ppl-card-${i + 1}`} id={p.id}>
          {/* the frame: the set behind, the person in front — the
              dolly's two layers; the person carries the alt */}
          <figure className="ab-ppl-pic">
            <img
              className="ab-ppl-bg"
              src={p.bg}
              alt=""
              width={1200}
              height={1440}
              loading="lazy"
              decoding="async"
              draggable={false}
              aria-hidden="true"
            />
            <img
              className="ab-ppl-cut"
              src={p.cut}
              alt={p.name}
              width={1200}
              height={1440}
              loading="lazy"
              decoding="async"
              draggable={false}
            />
            {/* the caption IN the picture, over a scrim at its foot:
                name and role only (user: no description, no numbering);
                the bio stays in the data for the schema */}
            <figcaption className="ab-ppl-cap">
              <h3 className="ab-ppl-name">{p.name}</h3>
              <p className="ab-ppl-role">{p.role}</p>
            </figcaption>
          </figure>
        </article>
      ))}
    </section>
  )
}
