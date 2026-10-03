'use client'

import { useEffect, useRef } from 'react'
import Reveal from '@/components/v4/Reveal'
import { gsap } from '@/lib/motion-v4'

/**
 * SECTION 3 — WHAT WE SOLVE: the credit roll (user-directed 2026-08-18).
 *
 * The page's first dark passage. A single photograph is the whole section's
 * background — a sticky 100svh frame inside a ~240svh section — and the
 * problems are thrown into the scene as loose text, no containers: one left,
 * one past centre, scattered, each rolling at its own speed like end credits
 * with depth.
 *
 * NOIR PASS 2026-08-23. The section is `k-dark`, and that is the whole
 * colour change: the roles re-point, so the two hand-written
 * rgba(255,255,255,…) type colours became --text and --text-muted, and
 * GrainField picks the section up for free (it scrubs the root grain by how
 * much of the viewport is .k-dark ground, with no second annotation). The
 * plate is graded to monochrome in CSS; that filter is INTERIM and comes out
 * the day the already-graded asset lands. The scatter is UNCHANGED and
 * deliberately so (user call, 2026-08-23) — what was wrong with the text was
 * never where it sat but how wide it was: see the measure note over .sv-q in
 * home.css.
 *
 * TWO PARALLAX SYSTEMS, ONE TICKER:
 *
 * 1. The depth reveal (rebuilt 2026-08-19 — no underlap). The section
 *    arrives plainly (the old slide-under-§2 died with the peel's inset
 *    landing), but the image's apparent speed is a constant 0.45× for its
 *    WHOLE life: while the section ENTERS, the image counter-translates
 *    down at 0.55× inside the rising frame — the claim above leaves at
 *    hand speed while the portrait below crawls, which is the depth seam —
 *    and the first sliver frames the image ~60vh deep, so the seam reveals
 *    the portrait, not its empty top edge. Once the frame sticks the same
 *    0.45× continues as the upward drift across the sticky range.
 *
 * 2. The credits. Each problem carries a speed (0.72–1.16). Per tick its
 *    layout position is recovered from the rect (minus the transform we
 *    last wrote) and the offset is (centre − vh/2) × (speed − 1): zero as
 *    it crosses the viewport's middle, so items never stray far from where
 *    layout put them, they just travel there at different rates.
 *
 * Entrances are the house Reveal per item (h2 first, body 80ms behind),
 * on top of the rolling wrapper — separate elements, no transform fights.
 *
 * SEO/fallback: all copy is server-rendered real DOM text. No JS or
 * reduced motion still get the sticky background and the static scatter —
 * the layout IS the fallback; the ticker only adds drift.
 *
 * Copy is PLACEHOLDER except where the choreography doc supplies the line —
 * the user writes the real ones (checklist 6.6). Written as the client
 * would say it, per the doc: symptoms, not categories.
 */

const PROBLEMS: { q: string; a: string; speed: number }[] = [
  {
    q: 'Your site looks like everyone else’s.',
    a: 'A template did what templates do. Nothing about it says who you are, and visitors feel that before they can name it.',
    speed: 0.82,
  },
  {
    q: 'Visitors leave before they understand what you do.',
    a: 'The work is good. The site never gets to that part: the story is buried somewhere under the interface.',
    speed: 1.16,
  },
  {
    q: 'The site hasn’t kept up with the business.',
    a: 'You outgrew it years ago. Every update fights the structure it was built on, so nothing ever quite fits.',
    speed: 0.72,
  },
  {
    q: 'You’re invisible where people actually search.',
    a: 'Customers ask search engines and AI the exact questions you answer, and your site never comes up.',
    speed: 1.08,
  },
]

export default function SolveCredits() {
  const rootRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const img = root.querySelector<HTMLElement>('.sv-img')
    /* warm the decode at mount: the plate is 17MP, and browsers defer
       decoding an offscreen image until it first paints — which used to
       land as a one-time hitch the moment the section scrolled in. This
       moves that work to idle time right after load. */
    if (img instanceof HTMLImageElement) img.decode().catch(() => {})
    /* ONE SPEED ON PHONES (2026-08-26, user: the problems "appear at
       different speed" and it read wrong). The credit-roll depth is a
       desktop effect: it needs the scatter's separate columns so blocks
       drifting at different rates pass beside each other. A phone has one
       column, so the same drift only ever put one credit on top of the
       next, and the 34–38svh gaps that kept them apart spread the section
       thin. Here they roll with the page, as a list over the drifting
       plate; the plate's own 0.45× depth stays. */
    const phone = window.matchMedia('(max-width: 57.5rem)').matches
    const items = Array.from(root.querySelectorAll<HTMLElement>('.sv-item')).map((el) => ({
      el,
      speed: phone ? 1 : Number(el.dataset.speed) || 1,
      y: 0,
    }))
    let imgY = 0

    const tick = () => {
      const vh = window.innerHeight
      const r = root.getBoundingClientRect()
      if (r.bottom < -200 || r.top > vh + 200) return

      // The background's counter-drift: 0.45× apparent speed for the whole
      // life of the section, in two continuous phases. ENTRY (top: vh→0):
      // the frame rises at hand speed, the image translates DOWN inside it
      // at 0.55× — apparent 0.45×, the depth seam against the leaving
      // claim. STUCK (top: 0→−range): the frame is fixed and the image
      // drifts up at 0.45× directly, scaled by the range itself — a fixed
      // travel would slow back down every time the section grows, which is
      // how the first cut (±14vh ≈ 0.2×) earned the user's "barely
      // moving". The +0.03vh bias starts the entry framing 60vh deep into
      // the −63vh CSS oversize (the face at the seam, not the image's top
      // edge); the oversize must always exceed the total travel — the
      // budget lives with .sv-img in home.css.
      const range = Math.max(r.height - vh, 1)
      const enter = Math.min(Math.max((vh - r.top) / vh, 0), 1)
      const p = Math.min(Math.max(-r.top / range, 0), 1)
      const iy = vh * 0.03 + vh * 0.55 * enter - range * 0.45 * p
      if (img && Math.abs(iy - imgY) > 0.05) {
        imgY = iy
        gsap.set(img, { y: iy })
      }

      for (const s of items) {
        const ir = s.el.getBoundingClientRect()
        const centre = ir.top + ir.height / 2 - s.y // layout position, transform removed
        const y = (centre - vh / 2) * (s.speed - 1)
        if (Math.abs(y - s.y) > 0.05) {
          s.y = y
          gsap.set(s.el, { y })
        }
      }
    }

    /* one frame late ON PURPOSE — the MediaPeel/HeroPeel lesson: this
       effect mounts before SmoothScroll's, so a direct add() lands BEFORE
       Lenis in the ticker order and reads every rect from the previous
       frame — the drift then trails the scroll by one frame, which is
       exactly the "kind of lag" it showed (user, 2026-08-24). Deferring
       the add by one rAF puts this tick after Lenis: current-frame rects,
       parallax locked to the scroll. */
    const rafId = requestAnimationFrame(() => gsap.ticker.add(tick))
    return () => {
      cancelAnimationFrame(rafId)
      gsap.ticker.remove(tick)
    }
  }, [])

  return (
    <section ref={rootRef} className="sv k-dark" id="solve">
      <div className="sv-frame" aria-hidden="true">
        {/* decorative — the content is the text riding over it. Eager on
            purpose: it sits exactly one viewport below the fold (the −100svh
            overlap), and a fast flick must never catch a lazy fetch mid-reveal
            — it buys the section's whole first impression. The Bosra
            amphitheatre (user photo, 2026-08-20), cropped 4:5 for the tall
            drifting frame; replaced the portrait-glass stand-in. FULL
            resolution at q95 per the user's call — ~7MB; revisit before
            launch if the section's arrival ever beats the fetch. */}
        {/* srcset (2026-08-25, mobile pass): the plate is the user's file at
            their quality — 3736w, ~5MB — and that is what desktop still gets.
            A phone was downloading and decoding all 17 megapixels of it for
            a 390px column; the 1200w/2000w derivatives (tools: sharp, q82)
            serve the small screens. */}
        <img
          className="sv-img"
          src="/home/bosra.webp"
          srcSet="/home/bosra-1200.webp 1200w, /home/bosra-2000.webp 2000w, /home/bosra.webp 3736w"
          sizes="100vw"
          alt=""
        />
        <i className="sv-shade" />
      </div>

      <div className="sv-list">
        {PROBLEMS.map((p, i) => (
          <div
            key={i}
            className={`sv-item sv-item-${i + 1} k-stagger`}
            data-speed={p.speed}
          >
            <Reveal as="h2" className="t-h2 sv-q">
              {p.q}
            </Reveal>
            <Reveal as="p" className="t-body sv-a" index={1}>
              {p.a}
            </Reveal>
          </div>
        ))}
      </div>
    </section>
  )
}
