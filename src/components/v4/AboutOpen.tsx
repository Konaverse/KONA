'use client'

import { useEffect, useRef } from 'react'
import { gsap, EASE, rem } from '@/lib/motion-v4'

/**
 * WHAT WE MAKE — THE OPENING (2026-09-16, the user's recording
 * "Recording 2026-09-16 204911.mp4": "the way the image opens up, the
 * way the image continues to zoom in and the way a dark overlay
 * strengthens on scroll… we need smart content"). Read frame by frame
 * (the clip is the section scrolled backwards); in scroll order:
 *
 *  1. THE REST. A dark ground scrolls in like any section: the title
 *     centred in the upper third, a small CIRCLE of the picture under
 *     it. Nothing moves until the section's top reaches the viewport's.
 *  2. THE GROW (the first viewport of the pin). The circle grows into
 *     a rounded box and then to the whole viewport — width and height
 *     on their own rates, the centre drifting from under the title to
 *     the viewport's middle, the corners rounding off as it fills —
 *     and covers the title on its way. The picture is re-FITTED to the
 *     box at every size (object-fit cover on a box whose size changes),
 *     which is why it is a box that grows and not a clip over a
 *     full-bleed picture: the whole subject sits in the circle.
 *  3. THE ZOOM. Full bleed, the picture keeps closing in (SCALE_TO) and
 *     a VEIL darkens over it (VEIL_TO) for the whole run of the beats.
 *  4. THE BEATS. Plain flow: one sentence in four parts, each centred
 *     in its own stretch of the run, scrolling up over the pinned
 *     picture and out at the top — no driver on the words.
 *  5. THE COVER. The picture holds for one more viewport and the next
 *     section (THE WORDS, on paper) slides up over it: about.css
 *     pulls `.ab-wd` up by a viewport and stacks it above.
 *
 * THE DRIVER. One rect per frame off gsap.ticker (the page and the
 * picture share a clock — no lag on top of Lenis). The grow is the pin's
 * first viewport on EASE.drift; the box's left/top/width/height and
 * radius are written from the rest geometry (REST_D, REST_CY) to the
 * stage's own rect. The zoom and the veil run linearly from the end
 * of the grow to the start of the cover. CSS holds the rest frame so
 * the first paint matches the first tick.
 *
 * Reduced motion (`is-still`) and no JS (page.tsx's noscript): the
 * stage is static, the picture a full-width block under the title, the
 * beats in flow. Every word is server-rendered.
 */

export type Beat = {
  /** the part of the sentence, large */
  line: string
  /** the proof under it, small */
  note?: string
}

/** the circle's rest diameter, in rem — the same numbers as the CSS
 *  rest frame in about.css (desktop, phones) */
const REST_D = 20
const REST_D_PHONE = 13
/** the circle's centre, as a share of the stage's height */
const REST_CY = 0.72
/** the picture's scale at the end of the zoom */
const SCALE_TO = 1.22
/** the veil's opacity at the end of the zoom */
const VEIL_TO = 0.72

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)

export default function AboutOpen({
  title,
  sub,
  picture,
  alt,
  beats,
}: {
  title: string
  sub: string
  picture: string
  alt: string
  beats: readonly Beat[]
}) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const sec = ref.current
    if (!sec) return
    const stage = sec.querySelector<HTMLElement>('.ab-op-stage')
    const box = sec.querySelector<HTMLElement>('.ab-op-box')
    const img = sec.querySelector<HTMLElement>('.ab-op-img')
    const veil = sec.querySelector<HTMLElement>('.ab-op-veil')
    if (!stage || !box || !img || !veil) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    /* the rest diameter must match the CSS rest frame (about.css) so
       the first tick changes nothing */
    const phone = window.matchMedia('(max-width: 57.5rem)').matches
    const restD = (phone ? REST_D_PHONE : REST_D) * 16 * rem()

    if (reduce) {
      sec.classList.add('is-still')
      return () => sec.classList.remove('is-still')
    }

    let lastG = -1
    let lastZ = -1
    const tick = () => {
      const r = sec.getBoundingClientRect()
      const vh = window.innerHeight
      if (r.bottom < 0 || r.top > vh) return
      const st = stage.getBoundingClientRect()
      const W = st.width
      const H = st.height
      /* the pin's scroll: 0 as the section's top meets the viewport's */
      const s = -r.top

      /* THE GROW — the pin's first viewport */
      const g = clamp01(s / vh)
      if (Math.abs(g - lastG) > 0.0004 || lastG < 0) {
        lastG = g
        const e = EASE.drift(g)
        const D = Math.min(restD, W * 0.7)
        const w = D + (W - D) * e
        const h = D + (H - D) * e
        const cx = W / 2
        const cy = H * REST_CY + (H / 2 - H * REST_CY) * e
        box.style.transform = `translate3d(${(cx - w / 2).toFixed(2)}px, ${(cy - h / 2).toFixed(2)}px, 0)`
        box.style.width = `${w.toFixed(2)}px`
        box.style.height = `${h.toFixed(2)}px`
        box.style.borderRadius = `${((D / 2) * (1 - e)).toFixed(2)}px`
      }

      /* THE ZOOM AND THE VEIL — from the end of the grow to the start
         of the cover (the section's last viewport, where the next
         section slides over the held picture; about.css) */
      const z = clamp01((s - vh) / (r.height - 3 * vh))
      if (Math.abs(z - lastZ) > 0.0004 || lastZ < 0) {
        lastZ = z
        img.style.transform = `scale(${(1 + (SCALE_TO - 1) * z).toFixed(4)})`
        veil.style.opacity = (VEIL_TO * z).toFixed(3)
      }
    }
    tick()
    gsap.ticker.add(tick)

    return () => {
      gsap.ticker.remove(tick)
      box.style.transform = ''
      box.style.width = ''
      box.style.height = ''
      box.style.borderRadius = ''
      img.style.transform = ''
      veil.style.opacity = ''
    }
  }, [])

  return (
    <section ref={ref} className="ab-op k-dark" aria-label={title}>
      <div className="ab-op-stage">
        <h2 className="ab-op-t">
          {title}
          <span className="ab-op-sub">{sub}</span>
        </h2>
        {/* the box: a circle at rest, the viewport at the end of the
            grow; the picture re-fits to it at every size */}
        <div className="ab-op-box">
          <img
            className="ab-op-img"
            src={picture}
            alt={alt}
            width={2000}
            height={2500}
            loading="lazy"
            decoding="async"
            draggable={false}
          />
          <div className="ab-op-veil" aria-hidden="true" />
        </div>
      </div>

      {/* the beats: one sentence in parts, in flow over the pinned
          picture; the padding before is the grow's runway, the padding
          after is the cover's */}
      <div className="ab-op-beats">
        {beats.map((b) => (
          <p key={b.line} className="ab-op-beat">
            <span className="ab-op-line">{b.line}</span>
            {b.note ? <span className="ab-op-note">{b.note}</span> : null}
          </p>
        ))}
      </div>
    </section>
  )
}
