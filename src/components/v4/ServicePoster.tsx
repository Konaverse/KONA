'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/motion-v4'

/**
 * THE POSTER (service pages, 2026-09-19, user: "I would like more
 * sections like this" — the About page's words and the rose — "do it
 * and I'll check it out"). The same family — poster-scale heavy type on
 * paper, one cut-out object laid across it, the letters inverting where
 * they cross it — with ANOTHER VERB, so it reads as the site's language
 * and not as the rose again.
 *
 * WHERE. An interlude between THE FIT and THE PLAN. The page's opening
 * (RunBrief) is a storyboarded hero of its own and is left alone; the
 * poster is the page's one loud moment, placed where the argument turns
 * from "what it is" to "how it goes".
 *
 * THE PICTURE. The service's TAGLINE — the line the hero pins as a small
 * comment — said once at full voice: three lines, heavy, alternating
 * left / right / left the way the About words do. The service's own
 * rendered object (the chrome knot, the glass pane, the dashboard, the
 * page mockup, the arrow, the sphere) sits in the middle UNDER the type;
 * the type is white in `mix-blend-mode: difference` on an isolated,
 * painted paper ground, so it is ink over the paper and turns light
 * where it crosses the object — the word is CUT BY the thing.
 *
 * DIFFERENCE NEEDS A DARK OBJECT: over mid-grey the letters go mid-grey
 * and vanish (the About sheet's note says the same). Four of the six
 * renders are bright chrome or clear glass, so each object carries a CSS
 * grade (run.css `.pst-obj--*`) that takes it down to black chrome /
 * smoked glass. Same assets, noir print.
 *
 * THE VERB: THE LINES SLIDE, THE OBJECT TURNS. Scrubbed by the section's
 * passage through the viewport: the three lines travel sideways in
 * opposite directions and cross at the middle, while the object rises
 * against the scroll, turns a few degrees and swells a touch — three
 * rates, so the cut through the letters keeps changing. The rose's verb
 * was letters flying one by one; this one is whole lines passing each
 * other over a turning object.
 *
 * THE GLIDE. As on the About words, the scroll is where the progress is
 * HEADED: it eases after its target with a time constant, frame-rate
 * independent, so a flick of the wheel becomes a glide.
 *
 * THE DRIVER. gsap.ticker, one rect per frame, transforms only.
 * Reduced motion / no JS: the composed poster, still. The tagline is one
 * real paragraph for a reader; the split lines are decoration.
 */

/** how far a line travels either side of its rest, as a share of the
 *  section's width */
const SLIDE = 0.075
/** the object: rise (share of its own height), turn (deg), swell */
const RISE = 0.22
const TURN = 9
const SWELL = 0.12
/** the glide's time constant, in seconds */
const GLIDE = 0.2

/** the tagline in `n` lines, words kept whole, split where the LONGEST
 *  line comes out shortest (every break tried — a tagline is a dozen
 *  words at most), ties going to the evener split. The type is sized off
 *  that longest line, so a bad split costs the whole poster its scale. */
export function posterLines(text: string, n = 3): string[] {
  const words = text.trim().split(/\s+/)
  if (words.length <= n) return words
  let best: string[] = []
  let bestMax = Infinity
  let bestSpread = Infinity
  const walk = (start: number, left: number, acc: string[]) => {
    if (left === 1) {
      const lines = [...acc, words.slice(start).join(' ')]
      const lens = lines.map((l) => l.length)
      const max = Math.max(...lens)
      const spread = max - Math.min(...lens)
      if (max < bestMax || (max === bestMax && spread < bestSpread)) {
        best = lines
        bestMax = max
        bestSpread = spread
      }
      return
    }
    for (let end = start + 1; end <= words.length - (left - 1); end++) {
      walk(end, left - 1, [...acc, words.slice(start, end).join(' ')])
    }
  }
  walk(0, n, [])
  return best
}

export default function ServicePoster({
  tagline,
  object,
  grade,
}: {
  tagline: string
  /** the service's cut-out render */
  object: string
  /** which noir grade the render takes — see run.css */
  grade: 'none' | 'chrome' | 'glass'
}) {
  const ref = useRef<HTMLElement | null>(null)
  const lines = posterLines(tagline, 3)
  /* the longest line's length: the type is sized off it (run.css) */
  const longest = Math.max(...lines.map((l) => l.length))
  /* clear glass is mostly alpha: three copies stacked build it up to
     something a grade can take dark */
  const copies = grade === 'glass' ? 4 : 1

  useEffect(() => {
    const root = ref.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const rows = Array.from(root.querySelectorAll<HTMLElement>('.pst-line'))
    const obj = root.querySelector<HTMLElement>('.pst-obj')
    if (!obj) return
    root.classList.add('is-live')

    let cur = -1
    const tick = (_t?: number, deltaTime?: number) => {
      const r = root.getBoundingClientRect()
      const vh = window.innerHeight
      const seen = r.top < vh && r.bottom > 0
      /* 0 as the top edge enters at the bottom, 1 as the bottom edge
         leaves at the top; 0.5 is the poster centred */
      const to = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)))
      if (cur < 0 || !seen) cur = to
      else {
        const dt = Math.min(0.05, (deltaTime ?? 16.7) / 1000)
        cur += (to - cur) * (1 - Math.exp(-dt / GLIDE))
      }
      if (!seen) return
      const c = cur * 2 - 1 // −1 … 0 … 1, the poster composed at 0
      const w = r.width
      rows.forEach((el, i) => {
        const dir = i % 2 ? -1 : 1
        el.style.transform = `translate3d(${(dir * c * SLIDE * w).toFixed(2)}px,0,0)`
      })
      obj.style.transform =
        `translate3d(0, ${(-c * RISE * 100).toFixed(2)}%, 0) rotate(${(c * TURN).toFixed(3)}deg) scale(${(1 + (1 - Math.abs(c)) * SWELL).toFixed(4)})`
    }
    tick()
    gsap.ticker.add(tick)
    return () => {
      gsap.ticker.remove(tick)
      root.classList.remove('is-live')
      rows.forEach((el) => (el.style.transform = ''))
      obj.style.transform = ''
    }
  }, [])

  return (
    <section className="pst" ref={ref} aria-label={tagline}>
      <div className="pst-stage" style={{ '--pst-n': longest } as React.CSSProperties}>
        <div className={`pst-obj pst-obj--${grade}`} aria-hidden="true">
          {Array.from({ length: copies }, (_, i) => (
            <img key={i} src={object} alt="" loading="lazy" decoding="async" draggable={false} />
          ))}
        </div>
        <p className="pst-type" aria-hidden="true">
          {lines.map((l, i) => (
            <span key={i} className={`pst-line${i % 2 ? ' is-right' : ''}`}>
              {l}
            </span>
          ))}
        </p>
      </div>
    </section>
  )
}
