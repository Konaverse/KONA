'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/motion-v4'
import PixelReveal from '@/components/v4/PixelReveal'

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
 * THE LAYOUT (about.css). A 200svh section on the void, not pinned.
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
 * THE GROUND. The page fades to the void as the section arrives and
 * STAYS there (user, 2026-09-16: "make the team section stay dark
 * after it switches, don't make it go back to white" — the opening
 * that follows is on the void): `--ab-dark` on the page root, mixed
 * in about.css, so the statement above cross-fades with it. The way
 * back to paper happens only once the section has left the viewport,
 * behind the opening's own ground, so the toolset after it is on
 * paper again. `k-dark` goes on the section once the roles have flipped
 * (the grain, GrainField).
 *
 * THE DOLLY ZOOM (same day, the user's People.zip: for each person the
 * set with them painted out, and them cut out). Two layers in the
 * frame; as the card crosses the viewport the set pulls back from a
 * close-up about head height while the person holds their size — the
 * Vertigo shot, the space opening up behind a still figure. The
 * driver owns both transforms (BG_*, CUT_*).
 *
 * THE ENTRANCE. Each frame stands as a blurred MOSAIC of its two
 * layers from the moment they load (PixelReveal.tsx — both layers are
 * eager for that) and resolves block by block as it enters; the
 * caption, set IN the picture over a scrim at its foot, rises once
 * the pixels have sharpened (`is-in`, a beat late). Reduced motion:
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
/** the ground's fade, in viewport heights of the section's edge */
const FADE = 0.6
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
    const page = sec.closest<HTMLElement>('.ab')
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

    let lastDark = -1
    let lastP = -1
    const tick = () => {
      const r = sec.getBoundingClientRect()
      const vh = window.innerHeight
      if (r.bottom < -vh || r.top > vh * 2) return

      /* THE GROUND: in over the section's top edge; held to the end;
         out only once the bottom edge has left the viewport (unseen,
         behind the next section's own ground) */
      const dark = Math.min(clamp01((vh - r.top) / (FADE * vh)), clamp01((r.bottom + FADE * vh) / (FADE * vh)))
      if (page && Math.abs(dark - lastDark) > 0.002) {
        lastDark = dark
        page.style.setProperty('--ab-dark', dark.toFixed(3))
        sec.classList.toggle('k-dark', dark >= 0.55)
      }

      if (reduce) return
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
    tick()
    gsap.ticker.add(tick)

    return () => {
      io.disconnect()
      gsap.ticker.remove(tick)
      page?.style.removeProperty('--ab-dark')
      sec.classList.remove('k-dark')
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
              loading="eager"
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
              loading="eager"
              decoding="async"
              draggable={false}
            />
            {/* the reveal: a blurred mosaic of the two layers that
                resolves when the frame enters (PixelReveal.tsx) */}
            <PixelReveal />
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
