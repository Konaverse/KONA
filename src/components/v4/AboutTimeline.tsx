'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/motion-v4'

/**
 * HOW IT WENT — THE TRAVEL (2026-09-16, user: "a more functional and
 * motion-filled timeline… no eyebrows, no unnecessary small numbering,
 * no hairlines. Pure motion"). It replaces THE ROLL of 2026-09-11 (one
 * fixed composition, the year's last digit rolling on an odometer, a
 * "Scroll to explore" badge with a progress ring) — a slideshow that
 * mostly stood still.
 *
 * THE TRACK. One pinned viewport; the entries stand on one horizontal
 * track, a STRIDE apart, and the track pans left as the hand scrolls —
 * scrubbed, continuous, no steps. The neighbours are always in the
 * frame at the edges, so the hand can see where it is and where it is
 * going: that is the timeline's function, the line of years itself.
 *
 * THREE RATES. The plates (tall portrait pictures) and their captions
 * ride the track at full speed. A band of giant YEAR numerals runs
 * along the foot on its own track at YEAR_RATE of the speed, in white
 * with mix-blend-mode: difference — ink on the paper, light where they
 * cross a picture — so the numerals slide under the pictures and cut
 * across their edges as the two layers drift apart and realign. At
 * each entry's stop the year and its plate are centred together (the
 * band's stride is the track's stride × YEAR_RATE; about.css).
 *
 * THE DEVELOP. Each entry's state is continuous in its distance d
 * from the centre (0 there, 1 a stride away): the plate scales from
 * SCALE_FAR to 1, its mono print gives way to the colour print
 * (two <img> of the same file — an opacity, not a per-frame filter),
 * the picture drifts inside its frame against the pan (INNER), and the
 * caption rises to full ink. Everything written is transform/opacity.
 *
 * THE DRIVER. gsap.ticker + one rect per frame, the house pattern (no
 * scroll listeners, no ScrollTrigger). The strides are MEASURED off the
 * laid-out entries, so the CSS numbers are the only ones. The pin's
 * length is written to --ab-tl-len: a viewport plus STEP viewports per
 * stride, plus a hold on the last entry.
 *
 * Reduced motion (`is-still`) and no JS (page.tsx's noscript): the stage
 * is static and the entries stack in flow, each with its own year in
 * the caption (the band is decoration, aria-hidden). Every word is
 * server-rendered.
 */

export type Era = {
  year: string
  label: string
  plate: string
  text: string
}

/** viewports of scroll per stride */
const STEP = 0.8
/** the hold on the last entry, in viewports, before the stage releases */
const HOLD = 0.35
/** the year band's speed as a share of the track's — the same number as
 *  the band's stride in about.css (calc(stride * 0.6)) */
const YEAR_RATE = 0.6
/** a plate's scale one stride from the centre */
const SCALE_FAR = 0.86
/** the picture's drift inside its frame, in % of its width per stride */
const INNER = 5
/** how fast the caption fades with distance (1 = gone a stride away) */
const CAP_FADE = 1.8

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)

export default function AboutTimeline({ eras }: { eras: readonly Era[] }) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const track = root.querySelector<HTMLElement>('.ab-tl-track')
    const band = root.querySelector<HTMLElement>('.ab-tl-years')
    const entries = Array.from(root.querySelectorAll<HTMLElement>('.ab-tl-entry'))
    const years = Array.from(root.querySelectorAll<HTMLElement>('.ab-tl-year'))
    const n = entries.length
    if (!track || !band || n === 0) return

    if (reduce) {
      root.classList.add('is-still')
      return () => root.classList.remove('is-still')
    }

    const parts = entries.map((e) => ({
      plate: e.querySelector<HTMLElement>('.ab-tl-plate'),
      colour: e.querySelector<HTMLElement>('.ab-tl-img-colour'),
      imgs: Array.from(e.querySelectorAll<HTMLElement>('.ab-tl-img')),
      cap: e.querySelector<HTMLElement>('.ab-tl-cap'),
    }))

    /* the pin's length */
    root.style.setProperty('--ab-tl-len', `${100 + (n - 1) * STEP * 100 + HOLD * 100}svh`)

    /* the strides, measured off the layout (about.css sets them) */
    let stride = 0
    let yearStride = 0
    const measure = () => {
      stride = n > 1 ? entries[1].offsetLeft - entries[0].offsetLeft : 0
      yearStride = years.length > 1 ? years[1].offsetLeft - years[0].offsetLeft : stride * YEAR_RATE
    }
    measure()
    window.addEventListener('resize', measure)

    let last = -1
    const tick = () => {
      const r = root.getBoundingClientRect()
      const vh = window.innerHeight
      if (r.bottom < 0 || r.top > vh) return
      /* the playhead: 0 with the first entry centred, n-1 with the last */
      const travel = (n - 1) * STEP * vh
      const p = travel > 0 ? clamp01(-r.top / travel) * (n - 1) : 0
      if (Math.abs(p - last) < 0.0005) return
      last = p

      track.style.transform = `translate3d(${(-p * stride).toFixed(2)}px, 0, 0)`
      band.style.transform = `translate3d(${(-p * yearStride).toFixed(2)}px, 0, 0)`

      parts.forEach((q, i) => {
        const dd = i - p
        const d = Math.min(Math.abs(dd), 1)
        if (q.plate) q.plate.style.transform = `scale(${(1 - (1 - SCALE_FAR) * d).toFixed(4)})`
        if (q.colour) q.colour.style.opacity = (1 - d).toFixed(3)
        q.imgs.forEach((img) => {
          img.style.transform = `translate3d(${(dd * INNER).toFixed(2)}%, 0, 0) scale(1.14)`
        })
        if (q.cap) {
          const c = clamp01(1 - d * CAP_FADE)
          q.cap.style.opacity = c.toFixed(3)
          q.cap.style.transform = `translate3d(0, ${((1 - c) * 1.2).toFixed(3)}rem, 0)`
        }
      })
    }
    tick()
    gsap.ticker.add(tick)

    return () => {
      gsap.ticker.remove(tick)
      window.removeEventListener('resize', measure)
      root.style.removeProperty('--ab-tl-len')
      track.style.transform = ''
      band.style.transform = ''
      parts.forEach((q) => {
        if (q.plate) q.plate.style.transform = ''
        if (q.colour) q.colour.style.opacity = ''
        q.imgs.forEach((img) => (img.style.transform = ''))
        if (q.cap) {
          q.cap.style.opacity = ''
          q.cap.style.transform = ''
        }
      })
    }
  }, [eras])

  return (
    <section ref={ref} className="ab-time" aria-label="How it went">
      <div className="ab-tl-stage">
        <h2 className="ab-tl-t">How it <em>went</em></h2>

        {/* the track: the entries a stride apart, panned by the driver */}
        <ol className="ab-tl-track">
          {eras.map((y, i) => (
            <li key={y.year} className="ab-tl-entry" style={{ '--i': i } as React.CSSProperties}>
              <figure className="ab-tl-plate">
                {/* the mono print under the colour print; the driver
                    fades the colour in as the entry reaches the centre */}
                <img
                  className="ab-tl-img ab-tl-img-mono"
                  src={y.plate}
                  alt=""
                  width={1024}
                  height={1536}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  aria-hidden="true"
                />
                <img
                  className="ab-tl-img ab-tl-img-colour"
                  src={y.plate}
                  alt={y.label}
                  width={1024}
                  height={1536}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
              </figure>
              <div className="ab-tl-cap">
                <h3 className="ab-tl-name">
                  <span className="ab-tl-when">{y.year}</span>
                  {y.label}
                </h3>
                <p className="ab-tl-text">{y.text}</p>
              </div>
            </li>
          ))}
        </ol>

        {/* the band: the years along the foot, on the slower track, in
            the difference blend; decoration — each entry says its year */}
        <div className="ab-tl-years" aria-hidden="true">
          {eras.map((y, i) => (
            <span key={y.year} className="ab-tl-year" style={{ '--i': i } as React.CSSProperties}>
              {y.year}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
