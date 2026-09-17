'use client'

import { Fragment, useEffect, useRef } from 'react'
import { gsap, rem } from '@/lib/motion-v4'
import { aimLight } from '@/lib/run-store'

/**
 * THE RUN · 3 — THE FIT (service pages). THIRD CUT, 2026-09-18 (user:
 * "make the answer and fit sections work without being pinned. From the
 * fit, remove the text that appears when the image expands, we don't
 * need it… unify the background of the answer and fit with this image").
 *
 * WHAT WENT. The pin, and with it the whole theatre on top of it: the
 * agent's selection box and its size tag, the drag that grew the window
 * to full bleed, the veil that turned the picture into the void, the
 * headline half ink and half light across the frame's edge, and the
 * second beat that APPEARED ON the expanded picture (the text the user
 * cut). The section no longer has a ground of its own either — it
 * shares THE GROUND with the answer (run.css `.rs-ground`: the user's
 * aerial crowd, sticky behind both, the plan then scrolling over it).
 *
 * WHAT IT IS NOW. One spread in flow, on that ground: the headline,
 * then the two beats as what they are — what it is, and when it is the
 * wrong choice — with the service's noir plate standing beside them in
 * a tall window. The close line ends it, large.
 *
 * THE MOTION IS THE SCROLL. As the section crosses: the window's print
 * eases back from a close-up and drifts against the page (depth, not
 * decoration), and the close line resolves word by word. On the way out
 * the window takes THE PARTING — the hero artboard's exit, rising and
 * tipping (`data-lift`, PlateLift.tsx). That is all — no cursor, no
 * handles, no flip.
 *
 * THE DRIVER. gsap.ticker, one rect a frame, on the glide; it writes
 * two transforms and the close's words. Reduced motion, no JS and
 * phones get the same spread, resolved. Every word is server-rendered;
 * the plate carries its alt.
 */

export type RunBeat = { title: string; body: string }

/** the close's run inside the section's crossing */
const CLOSE = [0.42, 0.9]
/** the print: its zoom at the start of the crossing, and its drift (rem) */
const ZOOM = 1.16
const DRIFT = 3.4
/** the glide's time constant, in seconds */
const GLIDE = 0.16

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)

export default function RunFit({
  headline,
  beats,
  close,
  image,
  alt,
}: {
  headline: string
  beats: readonly RunBeat[]
  close: string
  image: string
  alt: string
}) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    const img = root.querySelector<HTMLElement>('.rf-img')!
    const words = Array.from(root.querySelectorAll<HTMLElement>('.rf-cw'))

    root.classList.add('is-live')
    let p = -1
    let wrote = -1
    const tick = (_t?: number, deltaTime?: number) => {
      const r = root.getBoundingClientRect()
      const vh = window.innerHeight
      if (r.bottom < -vh * 0.2 || r.top > vh * 1.2) return
      /* the crossing: 0 as the section's top reaches the fold, 1 as its
         foot clears it */
      const want = clamp01((vh - r.top) / Math.max(1, r.height + vh * 0.2))
      const f = 1 - Math.exp(-((deltaTime ?? 16.7) / 1000) / GLIDE)
      p = p < 0 || Math.abs(want - p) < 0.0004 ? want : p + (want - p) * f
      if (Math.abs(p - wrote) < 0.0004) return
      wrote = p
      const unit = 16 * rem()

      /* the print: back from its close-up, drifting against the page */
      const s = 1 + (ZOOM - 1) * (1 - p)
      img.style.transform = `translate3d(0, ${((0.5 - p) * DRIFT * unit).toFixed(1)}px, 0) scale(${s.toFixed(4)})`

      /* THE CLOSE, word by word */
      const c = clamp01((p - CLOSE[0]) / (CLOSE[1] - CLOSE[0]))
      const n = words.length
      words.forEach((wd, i) => {
        const e = clamp01((c * (n + 3) - i) / 3)
        const k = 1 - (1 - e) * (1 - e) * (1 - e)
        wd.style.transform = k >= 1 ? '' : `translate3d(0, ${((1 - k) * 105).toFixed(2)}%, 0)`
        wd.style.opacity = k.toFixed(3)
      })

      /* the page's light follows the reading down the spread */
      if (r.top < vh * 0.6 && r.bottom > vh * 0.4) aimLight(0.74, 0.3 + p * 0.4)
    }
    tick()
    gsap.ticker.add(tick)

    return () => {
      gsap.ticker.remove(tick)
      root.classList.remove('is-live')
      ;[img, ...words].forEach((el) => el.removeAttribute('style'))
    }
  }, [image])

  return (
    <section ref={ref} id="fit" className="rf" aria-labelledby="rf-h">
      <div className="rf-stage">
        <h2 id="rf-h" className="rf-h">
          {headline}
        </h2>

        <div className="rf-beats">
          {beats.slice(0, 2).map((b) => (
            <div key={b.title} className="rf-beat">
              <h3 className="rf-t">{b.title}</h3>
              <p className="rf-body">{b.body}</p>
            </div>
          ))}
        </div>

        {/* the plate: the service's own noir picture */}
        <figure className="rf-win" data-lift>
          <img className="rf-img" src={image} alt={alt} loading="lazy" decoding="async" draggable={false} />
        </figure>

        <p className="rf-close">
          {/* a mask per word (open flanks); the space stays outside it */}
          {close.split(' ').map((w, i) => (
            <Fragment key={i}>
              {i > 0 ? ' ' : null}
              <span className="rf-cm">
                <span className="rf-cw">{w}</span>
              </span>
            </Fragment>
          ))}
        </p>
      </div>
    </section>
  )
}
