'use client'

import { useEffect, useRef } from 'react'
import { gsap, rem } from '@/lib/motion-v4'

/**
 * HOW IT WENT — THE THREAD (2026-09-17, user: "something more
 * impressive… vertical scroll not horizontal… vertical years, maybe
 * circular movement, cool image transitions, maybe an svg scroll
 * follow lines animation… smooth like butter… I don't want something
 * too heavy"). It replaces THE TRAVEL of 2026-09-16 (a pinned viewport,
 * the entries on a horizontal track panned by the hand, a band of years
 * at the foot) and, before it, THE ROLL of 09-11.
 *
 * THE PICTURE (about.css). A section on paper, IN FLOW — no pin, the
 * page's own vertical scroll. The four entries stand one under another,
 * a viewport apart, alternating sides: a tall plate right of the centre
 * with its year and words to the left, then the mirror. The year is a
 * giant numeral that overhangs the plate's inner edge in the difference
 * blend — ink on the paper, light on the picture.
 *
 * THE THREAD. One SVG line comes in at the top of the section, swings
 * in wide S-curves from plate to plate — it runs BEHIND each plate,
 * top centre to bottom centre, so the pictures are beads on it — and
 * leaves at the foot towards the invitation. A dotted ghost of the
 * whole route is always there; the ink is drawn over it by the scroll:
 * the line's HEAD (a small ring) is wherever the route crosses a line
 * HEAD_AT down the viewport. The route is built in px from the laid-out
 * plates (and again on resize), so the CSS numbers are the only ones;
 * y is monotonic along it (the curves' handles are vertical), so the
 * head's length is a lookup in a sampled table — one
 * getPointAtLength a frame.
 *
 * THE IRIS. The head IS the clock. As it reaches a plate's top edge and
 * runs down behind it, the picture opens from that very point: a
 * circle (clip-path) growing from the top centre until it clears the
 * frame — the thread pours into the picture. Under it the print settles
 * from a close-up (SCALE_FROM → SCALE_TO), drifts against the page as
 * the plate crosses the viewport (INNER), and develops from mono to
 * colour about the viewport's middle (two <img> of one file — an
 * opacity, not a per-frame filter). The plate HANGS from that point:
 * it opens turned a few degrees about its top centre and swings to
 * rest as the iris clears (SWING), then keeps turning a breath across
 * the crossing (SWAY) — left plates one way, right plates the other.
 * Once the iris is a fifth open the
 * entry is `is-on`: the year's digits rise one by one from their masks
 * and the words follow (about.css); it reads the same backwards.
 *
 * THE BUTTER. The head eases after its target with a short time
 * constant (GLIDE, frame-rate independent), so the draw, the ring and
 * the iris trail the hand by a breath instead of ticking with the
 * wheel. Everything written per frame is a transform, an opacity, a
 * clip-path or a dash offset; nothing is read but one rect.
 *
 * THE DRIVER. gsap.ticker + one rect per frame, the house pattern (no
 * scroll listeners, no ScrollTrigger, no library). The hidden states
 * live under `.is-live`, which only this driver sets: reduced motion
 * and no JS get the four entries in flow, open, in colour, no thread.
 * Every word is server-rendered; the thread and the ring are
 * decoration (aria-hidden).
 */

export type Era = {
  year: string
  label: string
  plate: string
  text: string
}

/** where the head rides, as a share of the viewport's height */
const HEAD_AT = 0.74
/** the head's ease after its target: the time constant, in seconds */
const GLIDE = 0.16
/** the S-curves' vertical handles, as a share of the gap they span
 *  (up to 1 keeps y monotonic along the route) */
const CURVE = 0.78
/** the iris is fully open once the head is this far down the plate */
const IRIS_RUN = 0.5
/** the entry speaks once the iris is this far open, and hushes under */
const ON_AT = 0.18
const OFF_AT = 0.02
/** the print's scale under the iris */
const SCALE_FROM = 1.34
const SCALE_TO = 1.12
/** the print's drift inside its frame across the crossing, in % */
const INNER = 4
/** the year's drift against the page across the crossing, in rem */
const YEAR_DRIFT = 4.5
/** THE SWING: the plate hangs from the point the thread enters it (top
 *  centre) — it opens turned this far (deg) and settles as the iris
 *  clears, then keeps turning a little across the crossing (SWAY) */
const SWING = 7
const SWAY = 2.5
/** the route's samples (length → y) */
const SAMPLES = 480

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)
const easeOut = (v: number) => 1 - (1 - v) * (1 - v) * (1 - v)

export default function AboutTimeline({ eras }: { eras: readonly Era[] }) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    const svg = root.querySelector<SVGSVGElement>('.ab-tl-thread')
    const ghost = root.querySelector<SVGPathElement>('.ab-tl-ghost')
    const ink = root.querySelector<SVGPathElement>('.ab-tl-ink')
    const ring = root.querySelector<HTMLElement>('.ab-tl-head')
    const entries = Array.from(root.querySelectorAll<HTMLElement>('.ab-tl-entry'))
    if (!svg || !ghost || !ink || !ring || entries.length === 0) return

    const parts = entries.map((e) => ({
      entry: e,
      plate: e.querySelector<HTMLElement>('.ab-tl-plate')!,
      imgs: Array.from(e.querySelectorAll<HTMLElement>('.ab-tl-img')),
      colour: e.querySelector<HTMLElement>('.ab-tl-img-colour'),
      year: e.querySelector<HTMLElement>('.ab-tl-when'),
      /* the plate's box in the section (px), measured */
      top: 0,
      h: 0,
      w: 0,
      /* which way it swings: +1 right of the centre, -1 left, 0 on
         phones (one column, no thread to hang from) */
      side: 1,
      iris: -1,
      q: -1,
      on: false,
    }))

    const phone = window.matchMedia('(max-width: 57.5rem)')
    root.classList.add('is-live')

    /* THE ROUTE: built from the layout */
    let H = 0
    let total = 0
    let ys: number[] = []
    const measure = () => {
      /* offsets, not rects: the plates are turned by the driver */
      const W = root.clientWidth
      H = root.offsetHeight
      const list = parts[0].plate.offsetParent as HTMLElement
      let d = `M${(W / 2).toFixed(1)},0`
      let px = W / 2
      let py = 0
      const swing = (x: number, y: number) => {
        const k = (y - py) * CURVE
        d += ` C${px.toFixed(1)},${(py + k).toFixed(1)} ${x.toFixed(1)},${(y - k).toFixed(1)} ${x.toFixed(1)},${y.toFixed(1)}`
        px = x
        py = y
      }
      parts.forEach((p) => {
        p.top = list.offsetTop + p.plate.offsetTop
        p.h = p.plate.offsetHeight
        p.w = p.plate.offsetWidth
        const cx = list.offsetLeft + p.plate.offsetLeft + p.w / 2
        p.side = phone.matches ? 0 : cx >= W / 2 ? 1 : -1
        swing(cx, p.top)
        /* behind the plate, straight down */
        py = p.top + p.h
        d += ` L${cx.toFixed(1)},${py.toFixed(1)}`
        p.iris = -1
        p.q = -1
      })
      swing(W / 2, H)
      svg.setAttribute('viewBox', `0 0 ${W.toFixed(1)} ${H.toFixed(1)}`)
      ghost.setAttribute('d', d)
      ink.setAttribute('d', d)
      total = ink.getTotalLength()
      ink.style.strokeDasharray = `${total.toFixed(1)}`
      ys = []
      for (let i = 0; i <= SAMPLES; i++) ys.push(ink.getPointAtLength((total * i) / SAMPLES).y)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(root)

    /** the length along the route at which it crosses y */
    const lengthAt = (y: number) => {
      let lo = 0
      let hi = SAMPLES
      while (hi - lo > 1) {
        const mid = (lo + hi) >> 1
        if (ys[mid] < y) lo = mid
        else hi = mid
      }
      const span = ys[hi] - ys[lo]
      const f = span > 0 ? (y - ys[lo]) / span : 0
      return ((lo + clamp01(f)) / SAMPLES) * total
    }

    let head = -1
    let drawn = -1
    const tick = (_time?: number, deltaTime?: number) => {
      const r = root.getBoundingClientRect()
      const vh = window.innerHeight
      const seen = r.bottom > -vh * 0.25 && r.top < vh * 1.25
      const target = Math.max(0, Math.min(H, HEAD_AT * vh - r.top))
      if (!seen && head === target) return
      /* THE BUTTER: the head eases after its target; unseen, it lands */
      const k = 1 - Math.exp(-((deltaTime ?? 16.7) / 1000) / GLIDE)
      const gap = target - head
      head = head < 0 || !seen || Math.abs(gap) < 0.2 ? target : head + gap * k

      if (Math.abs(head - drawn) > 0.05) {
        drawn = head
        const L = lengthAt(head)
        ink.style.strokeDashoffset = (total - L).toFixed(1)
        const pt = ink.getPointAtLength(L)
        ring.style.transform = `translate3d(${pt.x.toFixed(1)}px, ${pt.y.toFixed(1)}px, 0)`
        ring.style.opacity = head <= 1 || head >= H - 1 ? '0' : '1'
      }

      const unit = 16 * rem()
      parts.forEach((p) => {
        /* THE IRIS: the head's run down the plate */
        const iris = clamp01((head - p.top) / (p.h * IRIS_RUN))
        /* the plate's crossing of the viewport: 0 entering, 1 gone */
        const q = clamp01((vh - (r.top + p.top)) / (vh + p.h))
        if (Math.abs(iris - p.iris) > 0.0005) {
          p.iris = iris
          const e = easeOut(iris)
          /* from the top centre, the far corners are the reach */
          const reach = Math.hypot(p.w / 2, p.h) * 1.02
          p.plate.style.clipPath = iris >= 1 ? 'none' : `circle(${(reach * e).toFixed(1)}px at 50% 0%)`
          if (!p.on && iris > ON_AT) p.entry.classList.toggle('is-on', (p.on = true))
          else if (p.on && iris < OFF_AT) p.entry.classList.toggle('is-on', (p.on = false))
          p.q = -1
        }
        if (Math.abs(q - p.q) > 0.0005) {
          p.q = q
          const e = easeOut(p.iris)
          const s = SCALE_FROM + (SCALE_TO - SCALE_FROM) * e
          p.plate.style.transform = `rotate(${(p.side * ((1 - e) * SWING + (0.5 - q) * 2 * SWAY)).toFixed(3)}deg)`
          const dy = (q - 0.5) * 2 * INNER
          p.imgs.forEach((img) => {
            img.style.transform = `translate3d(0, ${dy.toFixed(2)}%, 0) scale(${s.toFixed(4)})`
          })
          /* the develop: full colour about the viewport's middle */
          if (p.colour) p.colour.style.opacity = clamp01(1.6 - Math.abs(q - 0.5) * 4.4).toFixed(3)
          if (p.year) p.year.style.transform = `translate3d(0, ${((0.5 - q) * 2 * YEAR_DRIFT * unit).toFixed(1)}px, 0)`
        }
      })
    }
    tick()
    gsap.ticker.add(tick)

    return () => {
      gsap.ticker.remove(tick)
      ro.disconnect()
      root.classList.remove('is-live')
      ink.style.strokeDasharray = ''
      ink.style.strokeDashoffset = ''
      ring.style.transform = ''
      ring.style.opacity = ''
      parts.forEach((p) => {
        p.entry.classList.remove('is-on')
        p.plate.style.clipPath = ''
        p.plate.style.transform = ''
        p.imgs.forEach((img) => (img.style.transform = ''))
        if (p.colour) p.colour.style.opacity = ''
        if (p.year) p.year.style.transform = ''
      })
    }
  }, [eras])

  return (
    <section ref={ref} className="ab-time" aria-label="How it went">
      <h2 className="ab-tl-t">How it <em>went</em></h2>

      {/* the thread: the dotted route and the ink drawn over it; the
          driver writes both paths from the layout */}
      <svg className="ab-tl-thread" aria-hidden="true" focusable="false" preserveAspectRatio="none">
        <path className="ab-tl-ghost" fill="none" />
        <path className="ab-tl-ink" fill="none" />
      </svg>
      <span className="ab-tl-head" aria-hidden="true" />

      <ol className="ab-tl-list">
        {eras.map((y) => (
          <li key={y.year} className="ab-tl-entry">
            <figure className="ab-tl-plate">
              {/* the mono print under the colour print; the driver
                  develops the colour as the plate crosses the middle */}
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
            <div className="ab-tl-body">
              <h3 className="ab-tl-name">
                {/* the year for readers, whole; the digits for the eye */}
                <span className="ab-tl-when">
                  <span className="sr-only">{y.year}</span>
                  <span aria-hidden="true">
                    {Array.from(y.year).map((ch, j) => (
                      <span key={j} className="ab-tl-d" style={{ '--j': j } as React.CSSProperties}>
                        <span>{ch}</span>
                      </span>
                    ))}
                  </span>
                </span>
                <span className="ab-tl-label">{y.label}</span>
              </h3>
              <p className="ab-tl-text">{y.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
