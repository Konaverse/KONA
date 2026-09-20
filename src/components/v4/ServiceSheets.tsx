'use client'

import { useEffect, useRef } from 'react'
import { SERVICES } from '@/components/v4/services-data'
import Reveal from '@/components/v4/Reveal'
import { gsap } from '@/lib/motion-v4'

/**
 * §4b — THE SERVICES, AS SHEETS (2026-09-19, user: a reference frame —
 * a giant SERVICES over full-width rows, each row an index, a name,
 * three small tags, a paragraph and a picture at the right edge, the
 * lower rows TILTED and tucked under the row above like a fanned stack
 * of paper — "right after the what we do section, a services section
 * that looks like this").
 *
 * THE ROWS are the six services off services-data.tsx: the index, the
 * name in the light display voice (the reference sets a serif; the house
 * has one family), the three includes where the reference has its tags,
 * the paragraph, and the service's plate cropped to a landscape window.
 * Each row is one link to its service page.
 *
 * THE FAN. Every row after the first starts TUCKED under the row above
 * — lifted by most of its own height, tipped a few degrees clockwise
 * about its top-left corner so its right end hangs low, a shade across
 * its top where the sheet above covers it — and slides down and flat as
 * it climbs the viewport. Earlier rows sit above later ones, so a row
 * is always drawn OUT from under its neighbour, never over it. It is a
 * scrub, not a playback (house rule): progress is a pure function of the
 * row's place in the viewport, so scrolling back tucks the sheets away
 * again, and at any moment two or three rows are mid-fan at increasing
 * tilt — the reference's exact picture.
 *
 * THE DRIVER. One gsap.ticker subscription; one rect read per frame (the
 * list's, which is never transformed) plus offsets measured on resize,
 * so nothing reads back its own transform. Writes are transform and one
 * custom property per moving row; settled rows are skipped.
 *
 * FALLBACKS. No JS, reduced motion, or a phone: the rows lie flat in
 * flow. Every word is server-rendered.
 */

const PHOTOS: Record<string, string> = {
  '3d-websites': '/services/3d.webp',
  'web-design': '/services/design.webp',
  'web-development': '/services/development.webp',
  'one-page-websites': '/services/one-page.webp',
  'website-redesign': '/services/redesign.webp',
  seo: '/services/seo.webp',
}

/** the tip of a fully tucked sheet, in degrees, about its top-left */
const TILT = 4.2
/** how much of its own height a tucked sheet hides under the row above.
 *  Half, not most: the reference's tilted rows are still READABLE — a
 *  sheet that hides four fifths of itself only ever shows a sliver. */
const TUCK = 0.5
/** a row starts to come out as its place reaches this share of the
 *  viewport's height, and lies flat by the time it reaches END. The
 *  travel is long on purpose: rows stand a fifth of a viewport apart, so
 *  a seven-tenths travel keeps three of them mid-fan at once, each
 *  tipped further than the one above — the reference's picture. */
const START = 1.0
const END = 0.3

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)

export default function ServiceSheets() {
  const rootRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(min-width: 57.5rem)').matches) return

    const list = root.querySelector<HTMLElement>('.svs-list')
    if (!list) return
    const rows = Array.from(list.querySelectorAll<HTMLElement>('.svs-row'))
    if (rows.length < 2) return

    list.classList.add('is-live')

    /* LAYOUT values, not rects: the rows are transformed every frame */
    let tops: number[] = []
    let hs: number[] = []
    const measure = () => {
      tops = rows.map((r) => r.offsetTop)
      hs = rows.map((r) => r.offsetHeight)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(list)

    const last = new Array(rows.length).fill(-1)
    const tick = () => {
      const lt = list.getBoundingClientRect().top // the list never moves
      const vh = window.innerHeight
      if (lt > vh * 1.5 || lt + list.offsetHeight < -vh * 0.5) return
      const span = vh * (START - END)
      for (let i = 1; i < rows.length; i++) {
        const p = clamp01((vh * START - (lt + tops[i])) / span)
        if (p === last[i] && (p === 0 || p === 1)) continue
        last[i] = p
        /* a soft settle, close to linear: the fan has to read as a fan the
           whole way up, not snap flat in the first third */
        const e = 1 - Math.pow(1 - p, 1.6)
        const k = 1 - e
        const el = rows[i]
        if (p >= 1) {
          el.style.transform = ''
          el.style.removeProperty('--svs-k')
          continue
        }
        el.style.transform = `translate3d(0, ${(-TUCK * hs[i] * k).toFixed(2)}px, 0) rotate(${(TILT * k).toFixed(3)}deg)`
        el.style.setProperty('--svs-k', k.toFixed(3))
      }
    }
    tick()
    gsap.ticker.add(tick)

    return () => {
      gsap.ticker.remove(tick)
      ro.disconnect()
      list.classList.remove('is-live')
      rows.forEach((el) => {
        el.style.transform = ''
        el.style.removeProperty('--svs-k')
      })
    }
  }, [])

  return (
    <section className="svs" ref={rootRef} aria-labelledby="svs-h">
      <div className="k-page svs-head">
        <h2 className="svs-title" id="svs-h">
          <Reveal as="span" className="svs-title-w" masked>
            Services
          </Reveal>
        </h2>
      </div>

      <ul className="svs-list">
        {SERVICES.map((s, i) => (
          <li
            key={s.slug}
            className="svs-row"
            style={{ zIndex: SERVICES.length - i } as React.CSSProperties}
          >
            <a className="k-page svs-link" href={`/services/${s.slug}`}>
              <span className="svs-no t-small" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="svs-name">{s.name}</h3>
              <ul className="svs-tags t-small">
                {s.includes.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <p className="svs-para t-body">{s.para}</p>
              <span className="svs-pic">
                <img src={PHOTOS[s.slug]} alt="" loading="lazy" decoding="async" />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
