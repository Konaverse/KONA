'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/motion-v4'

/**
 * THE ABOUT HERO — THE GRID (2026-09-14, user: "the same hero as
 * studioaton.webflow.io, with images that I will give you, the same
 * animation exactly"). Rebuilt from MEASUREMENT, not from the site's
 * JS: its own GSAP instances were read off the live page and every
 * tween below is theirs, to the number (extract/aton-hero/).
 *
 * THE OBJECT. A 300svh section with a 100svh sticky box. Inside it a
 * 3-row grid of picture tiles — two wide, three, two wide — sits
 * centred and is scaled up (2.2, or more if the viewport needs it) so
 * the CENTRE tile fills the screen: the page opens on one full-bleed
 * picture. The title is two words at the two edges with a rule between
 * them, lifted 40svh up from its resting place at the bottom, its
 * words a third larger. A scroll cue sits at the foot.
 *
 * THE SCROLL — two clocks, both linear, both scrubbed with lag:
 *   A (0 → 2.9svh of scroll)   0–½: the grid scales 2.2 → 1
 *                              ½–1: the wide rows slide +5%, the
 *                                   middle row −10% (mostly plays as
 *                                   the section leaves)
 *   B (0 → 1.7svh of scroll)   0–2/7:  the words scale 1.3 → 1
 *                              2/7–6/7: the title drops 40svh to the
 *                                       foot; the cue fades over the
 *                                       first quarter of that
 *                              6/7–1:  the rule draws to 15%
 * The original runs on ScrollTrigger scrub:1 (a one-second catch-up).
 * Here the progress is a pure function of the section's position on
 * one gsap.ticker (house rule: scrub, not playback) and the same lag
 * is a lerp — SCRUB below — on top of Lenis's own.
 *
 * REST STATES. CSS holds the OPENING frame (no JS = one full-bleed
 * picture and the title, a fine static hero; page.tsx's noscript
 * collapses the runway). Reduced motion lands on the LANDED frame —
 * the mosaic, the title at the foot, the rule drawn — with the runway
 * collapsed (`is-still`).
 *
 * CONTENT is the block below: the seven pictures (the user's own
 * showcase renders), the two words and the cue. The words are a first
 * draft.
 */

/* ← replace every value below with your own content */
const CONTENT = {
  /** the two words of the title, left and right of the rule */
  left: 'About',
  right: 'Konaverse',
  cue: '( Scroll down )',
  /** the seven tiles, in grid order: row 1 (two wide), row 2 (three —
   *  the MIDDLE one is the picture the page opens on), row 3 (two wide).
   *  THE USER'S PICTURES (2026-09-14, ~/Desktop/KonaverseShowcase, seven
   *  1672x941 renders), encoded to public/about-hero/ at 1600 wide; 04
   *  is the one they named for the first appearance. */
  tiles: [
    { src: '/about-hero/01.webp', alt: '' },
    { src: '/about-hero/02.webp', alt: '' },
    { src: '/about-hero/03.webp', alt: '' },
    { src: '/about-hero/04.webp', alt: '' } /* ← the opening picture */,
    { src: '/about-hero/05.webp', alt: '' },
    { src: '/about-hero/06.webp', alt: '' },
    { src: '/about-hero/07.webp', alt: '' },
  ],
}

/** the measured clocks, in viewport heights of scroll */
const A_END = 2.9
const B_END = 1.7
/** the grid's opening scale — raised at runtime if the centre tile
 *  would not cover the viewport at 2.2 */
const SCALE0 = 2.2
/** the scrub's lag per frame (0.1 ≈ the original's one-second catch-up
 *  once Lenis's own smoothing is under it) */
const SCRUB = 0.1

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)
const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a))
const lerp = (a: number, b: number, u: number) => a + (b - a) * u

function Tile({ i, eager }: { i: number; eager?: boolean }) {
  const t = CONTENT.tiles[i]
  return (
    <div className="ag-tile">
      <img src={t.src} alt={t.alt} loading={eager ? 'eager' : 'lazy'} draggable={false} />
    </div>
  )
}

export default function AboutGridHero() {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const sec = ref.current
    if (!sec) return
    const q = <T extends HTMLElement>(s: string) => sec.querySelector<T>(s)
    const box = q('.ag-box')
    const wrap = q('.ag-wrap')
    const rowsSm = Array.from(sec.querySelectorAll<HTMLElement>('.ag-row-sm'))
    const rowLg = q('.ag-row-lg')
    const tile = q('.ag-row-lg .ag-tile:nth-child(2)')
    const tw = q('.ag-tw')
    const words = Array.from(sec.querySelectorAll<HTMLElement>('.ag-word'))
    const line = q('.ag-line')
    const cue = q('.ag-cue')
    if (!box || !wrap || !rowLg || !tile || !tw || !line || !cue) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      sec.classList.add('is-still')
      return () => sec.classList.remove('is-still')
    }

    /* the opening scale: 2.2, or whatever covers the viewport with the
       centre tile (a tall window would otherwise show the tile's edges) */
    let scale0 = SCALE0
    let vh = box.offsetHeight
    const title = q('.ag-title')
    const measure = () => {
      vh = box.offsetHeight
      const need = Math.max(window.innerWidth / tile.offsetWidth, vh / tile.offsetHeight) * 1.02
      scale0 = Math.max(SCALE0, need)
      /* THE FIT. The original's title is two short words, so 12.5vw
         fits them at the opening's 1.3 even on a laptop; ours is
         copy-dependent. Measure both words at the CSS size and, if
         the row cannot hold them scaled, shrink the type until it
         can — the composition (edges, rule, scale) is what is kept. */
      if (title) {
        title.style.fontSize = ''
        const stacked = getComputedStyle(title).getPropertyValue('--ag-stack').trim() === '1'
        const pad = parseFloat(getComputedStyle(tw).paddingLeft) * 2
        const gap = parseFloat(getComputedStyle(title).columnGap) * 2
        /* the words grow inward from the edges, so the row at 1.3 has to
           fit between the paddings with the gaps still there; stacked
           (phones) it is the longest word alone that has to fit */
        const widths = words.map((el) => el.offsetWidth)
        const room = stacked ? window.innerWidth - pad : window.innerWidth - pad - gap
        const need = (stacked ? Math.max(...widths) : widths.reduce((a, b) => a + b, 0)) * 1.3
        if (need > room) title.style.fontSize = `${(parseFloat(getComputedStyle(title).fontSize) * room) / need}px`
      }
    }
    measure()

    let cur = 0
    let first = true
    let last = ''
    const update = () => {
      const r = sec.getBoundingClientRect()
      /* off screen either way: hold the last frame, spend nothing */
      if (r.bottom < -vh || r.top > vh * 2) return
      const target = Math.max(0, -r.top)
      cur = first ? target : cur + (target - cur) * SCRUB
      first = false
      if (Math.abs(target - cur) < 0.05) cur = target

      const pA = clamp01(cur / (A_END * vh))
      const pB = clamp01(cur / (B_END * vh))
      const scale = lerp(scale0, 1, seg(pA, 0, 0.5))
      const shift = seg(pA, 0.5, 1)
      const wordScale = lerp(1.3, 1, seg(pB, 0, 1 / 3.5))
      const y = lerp(-0.4 * vh, 0, seg(pB, 1 / 3.5, 3 / 3.5))
      const cueOp = 1 - seg(pB, 1 / 3.5, 1.5 / 3.5)
      const lineW = 15 * seg(pB, 3 / 3.5, 1)

      const key = [scale.toFixed(4), shift.toFixed(4), wordScale.toFixed(4), y.toFixed(2), cueOp.toFixed(3), lineW.toFixed(3)].join()
      if (key === last) return
      last = key

      gsap.set(wrap, { scale, force3D: true })
      gsap.set(rowsSm, { xPercent: 5 * shift, force3D: true })
      gsap.set(rowLg, { xPercent: -10 * shift, force3D: true })
      gsap.set(words, { scale: wordScale, force3D: true })
      gsap.set(tw, { y, force3D: true })
      gsap.set(cue, { opacity: cueOp })
      line.style.width = `${lineW}%`
    }

    const onResize = () => {
      measure()
      last = ''
    }
    window.addEventListener('resize', onResize)
    /* a frame after mount, so the first tick reads a settled layout */
    const raf = requestAnimationFrame(() => gsap.ticker.add(update))
    return () => {
      cancelAnimationFrame(raf)
      gsap.ticker.remove(update)
      window.removeEventListener('resize', onResize)
      gsap.set([wrap, ...rowsSm, rowLg, ...words, tw, cue], { clearProps: 'transform,opacity' })
      line.style.width = ''
      if (title) title.style.fontSize = ''
    }
  }, [])

  return (
    <section ref={ref} className="ag k-dark" aria-label="About Konaverse">
      <div className="ag-box">
        {/* the grid, scaled about the viewport's centre — the centre
            tile is the opening picture */}
        <div className="ag-wrap" aria-hidden="true">
          <div className="ag-grid">
            <div className="ag-row ag-row-sm">
              <Tile i={0} />
              <Tile i={1} />
            </div>
            <div className="ag-row ag-row-lg">
              <Tile i={2} />
              <Tile i={3} eager />
              <Tile i={4} />
            </div>
            <div className="ag-row ag-row-sm">
              <Tile i={5} />
              <Tile i={6} />
            </div>
          </div>
        </div>

        {/* the title: two words at the edges, the rule drawing between */}
        <div className="ag-tw">
          <h1 className="ag-title">
            <span className="ag-word">{CONTENT.left}</span>
            <i className="ag-line" aria-hidden="true" />
            <span className="ag-word">{CONTENT.right}</span>
          </h1>
        </div>

        <p className="ag-cue t-small" aria-hidden="true">
          {CONTENT.cue}
        </p>
      </div>
    </section>
  )
}
