'use client'

import { Fragment, useEffect, useRef } from 'react'
import { gsap, rem } from '@/lib/motion-v4'
import { aimLight } from '@/lib/run-store'

/**
 * THE RUN · 3 — THE FIT (service pages, 2026-09-17; the brief: "'what
 * it is' against 'when it is the wrong choice' staged as a genuine
 * decision the page helps the visitor make, not two cards side by
 * side").
 *
 * SECOND CUT, the same day. The first was type alone — one stage, a
 * divider wiping paper to void; the user: "we have abandoned imagery
 * completely and I don't like it… purposeful imagery, incorporated on
 * scroll (… a small container that goes to full bleed background)…
 * the fit section needs to be really transformed". So the seam between
 * the two beats is a PICTURE now, and the void is that picture.
 *
 * THE PICTURE (run.css `.rf`). A pinned stage. On paper: the headline,
 * and "What it is" set large down the left. At the right a WINDOW — the
 * service's noir plate (`plate.image`, mono) in a small upright frame,
 * the whole print seen in it.
 *
 * THE GROW. The agent selects the window — four handles, a size tag —
 * and drags its corner: the frame grows until it IS the stage, its
 * corners squaring, the tag reading the frame's real size all the way
 * (GROW). The print grows with its frame (from fitting the window to
 * covering the screen, a breath of extra zoom easing out of it) and a
 * veil comes down over it, so the picture becomes the void. The first
 * beat gives way as the frame reaches it; the headline lies over
 * everything — ink on the paper, light where the frame has passed under
 * it (one text node, a clipped background whose stop is the frame's
 * edge: the hero word's trick). THE STAGE HAS NO GROUND OF ITS OWN (user,
 * the same day: "unify the background of the answer with the fit as to
 * not get half gradients"): the page's one light runs under both, which
 * is why the flip is not a difference blend — there is nothing in the
 * stage for one to read. On the picture: "When it is the wrong choice", same place,
 * same size (SECOND); then it lifts away and the close line resolves
 * word by word, large — the judgement (CLOSE).
 *
 * THE DRIVER. gsap.ticker + one rect per frame, on the glide. The frame
 * is ONE clip-path on a full-bleed layer, its insets snapped to whole
 * pixels (no layout, no shimmer); the print is one transform; the
 * selection box is the one element re-fitted by left/top/width/height.
 * The section says `data-dark` to the run bar once the picture holds
 * the bar's place. Hidden states live under `.is-live`: no JS, reduced
 * motion and phones get the headline, the first beat, the plate as a
 * figure, the second beat on a dark card with the close under it.
 * Every word is server-rendered; the plate carries its alt.
 */

export type RunBeat = { title: string; body: string }

/** the scene's beats inside the pin's progress */
const SELECT = [0.04, 0.1]
const GROW = [0.1, 0.5]
const SECOND = [0.47, 0.57]
const CLOSE = [0.8, 0.96]
/** the glide's time constant, in seconds */
const GLIDE = 0.18
/** the window at rest, in rem: its width, its top, its most height, and
 *  the room it leaves under it; its corner radius */
const WIN_W = 30
const WIN_TOP = 7.4
const WIN_H = 32
const WIN_FOOT = 5.2
const WIN_R = 1.6
/** the print's extra zoom in the small window, eased out by the grow */
const ZOOM = 1.16
/** the veil over the print: in the window, and as the void */
const VEIL = [0.06, 0.8]

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)
const drift = (v: number) => (v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

export default function RunFit({
  headline,
  beats,
  close,
  image,
  alt,
}: {
  headline: string
  beats: readonly [RunBeat, RunBeat]
  close: string
  image: string
  alt: string
}) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.matchMedia('(max-width: 57.5rem)').matches) return
    const stage = root.querySelector<HTMLElement>('.rf-stage')!
    const win = root.querySelector<HTMLElement>('.rf-win')!
    const img = root.querySelector<HTMLImageElement>('.rf-img')!
    const veil = root.querySelector<HTMLElement>('.rf-veil')!
    const head = root.querySelector<HTMLElement>('.rf-h')!
    const first = root.querySelector<HTMLElement>('.rf-a')!
    const second = root.querySelector<HTMLElement>('.rf-b .rf-beat')!
    const sel = root.querySelector<HTMLElement>('.rf-sel')!
    const tag = root.querySelector<HTMLElement>('.rf-sel-tag')!
    const words = Array.from(root.querySelectorAll<HTMLElement>('.rf-close .rf-cw'))
    root.classList.add('is-live')

    /* the stage, the window at rest, the print's cover box — px */
    let W = 1
    let H = 1
    let w0 = { x: 0, y: 0, w: 1, h: 1, r: 0 }
    let cover = { w: 1, h: 1 }
    let unit = 16
    let wrote = -1
    const measure = () => {
      unit = 16 * rem()
      W = stage.offsetWidth || 1
      H = stage.offsetHeight || 1
      const pad = first.offsetLeft
      const h = Math.min(WIN_H * unit, H - (WIN_TOP + WIN_FOOT) * unit)
      w0 = { x: W - pad - WIN_W * unit, y: WIN_TOP * unit, w: WIN_W * unit, h, r: WIN_R * unit }
      const a = img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : 0.667
      const cw = Math.max(W, H * a)
      cover = { w: cw, h: cw / a }
      /* the print is laid out ONCE as the screen's cover box, centred */
      img.style.width = `${cover.w.toFixed(1)}px`
      img.style.height = `${cover.h.toFixed(1)}px`
      img.style.left = `${((W - cover.w) / 2).toFixed(1)}px`
      img.style.top = `${((H - cover.h) / 2).toFixed(1)}px`
      wrote = -1
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(stage)
    if (!img.complete) img.addEventListener('load', measure, { once: true })

    let p = -1
    let lastClose = -1
    let lastTag = ''
    const tick = (_t?: number, deltaTime?: number) => {
      const r = root.getBoundingClientRect()
      const vh = window.innerHeight
      if (r.bottom < -vh * 0.2 || r.top > vh * 1.2) return
      const dt = (deltaTime ?? 16.7) / 1000
      const want = clamp01(-r.top / Math.max(1, r.height - vh))
      p = p < 0 || Math.abs(want - p) < 0.0004 ? want : p + (want - p) * (1 - Math.exp(-dt / GLIDE))
      if (Math.abs(p - wrote) < 0.0002) return
      wrote = p

      /* THE GROW: the frame, snapped to whole pixels */
      const g = drift(clamp01((p - GROW[0]) / (GROW[1] - GROW[0])))
      const x = Math.round(lerp(w0.x, 0, g))
      const y = Math.round(lerp(w0.y, 0, g))
      const w = Math.round(lerp(w0.w, W, g))
      const h = Math.round(lerp(w0.h, H, g))
      win.style.clipPath = g >= 1 ? 'none' : `inset(${y}px ${W - x - w}px ${H - y - h}px ${x}px round ${(w0.r * (1 - g)).toFixed(1)}px)`
      /* the print grows with its frame: it covers the frame, about the
         frame's centre, with a breath of zoom easing out */
      const s = Math.max(w / cover.w, h / cover.h) * lerp(ZOOM, 1, g)
      const dx = x + w / 2 - W / 2
      const dy = y + h / 2 - H / 2
      img.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0) scale(${s.toFixed(5)})`
      veil.style.opacity = lerp(VEIL[0], VEIL[1], clamp01(g * 1.25)).toFixed(3)
      /* the headline turns light where the frame has passed under it */
      head.style.setProperty('--rf-x', `${Math.max(0, x - head.offsetLeft)}px`)
      /* the page's light: on the paper beside the window, while there is paper */
      if (g < 1 && r.top < vh * 0.5 && r.bottom > vh * 0.5) aimLight(lerp(0.34, 0.1, g), 0.55)

      /* the selection: on as the agent arrives, off as the frame lands */
      const on = clamp01((p - SELECT[0]) / (SELECT[1] - SELECT[0])) * (1 - clamp01((g - 0.93) / 0.07))
      sel.style.opacity = on.toFixed(3)
      sel.style.left = `${x}px`
      sel.style.top = `${y}px`
      sel.style.width = `${w}px`
      sel.style.height = `${h}px`
      const t = `${w} × ${h}`
      if (t !== lastTag) tag.textContent = lastTag = t

      /* the first beat gives way; the second arrives on the picture */
      first.style.opacity = (1 - clamp01((g - 0.12) / 0.4)).toFixed(3)
      first.style.transform = `translate3d(${(-g * 4 * unit).toFixed(1)}px, 0, 0)`
      const c = clamp01((p - CLOSE[0]) / (CLOSE[1] - CLOSE[0]))
      const e2 = clamp01((p - SECOND[0]) / (SECOND[1] - SECOND[0]))
      const s2 = 1 - (1 - e2) * (1 - e2) * (1 - e2)
      second.style.opacity = (s2 * (1 - clamp01(c * 3))).toFixed(3)
      second.style.transform = `translate3d(0, ${((1 - s2) * 3 * unit - clamp01(c * 3) * 2 * unit).toFixed(1)}px, 0)`
      const dark = g > 0.55 ? '1' : '0'
      if (root.dataset.dark !== dark) root.dataset.dark = dark

      /* THE CLOSE */
      if (Math.abs(c - lastClose) > 0.0005) {
        lastClose = c
        const n = words.length
        words.forEach((wd, i) => {
          /* sequenced: the words wait until the second beat has gone */
          const e = clamp01((clamp01((c - 0.3) / 0.7) * (n + 3) - i) / 3)
          const k = 1 - (1 - e) * (1 - e) * (1 - e)
          wd.style.transform = `translate3d(0, ${((1 - k) * 105).toFixed(2)}%, 0)`
          wd.style.opacity = k.toFixed(3)
        })
      }
    }
    tick()
    gsap.ticker.add(tick)

    return () => {
      gsap.ticker.remove(tick)
      ro.disconnect()
      root.classList.remove('is-live')
      root.dataset.dark = '0'
      tag.textContent = ''
      ;[win, img, veil, head, first, second, sel, ...words].forEach((el) => el.removeAttribute('style'))
    }
  }, [image])

  return (
    <section ref={ref} id="fit" className="rf" data-dark="0" aria-labelledby="rf-h">
      <div className="rf-stage">
        <h2 id="rf-h" className="rf-h">{headline}</h2>

        {/* the first beat — on paper */}
        <div className="rf-a rf-beat">
          <h3 className="rf-t">{beats[0].title}</h3>
          <p className="rf-body">{beats[0].body}</p>
        </div>

        {/* THE WINDOW: the plate; it grows into the stage's ground */}
        <figure className="rf-win">
          <img className="rf-img" src={image} alt={alt} loading="lazy" decoding="async" draggable={false} />
          <i className="rf-veil" aria-hidden="true" />
        </figure>

        {/* the second beat and the close — on the picture */}
        <div className="rf-b k-dark">
          <div className="rf-beat">
            <h3 className="rf-t">{beats[1].title}</h3>
            <p className="rf-body">{beats[1].body}</p>
          </div>
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

        {/* the agent's selection on the window: decoration */}
        <span className="rf-sel" aria-hidden="true">
          <i /><i /><i /><i />
          <b className="rf-sel-tag" />
          <span className="rf-cursor k-agent">
            <svg viewBox="0 0 24 24">
              <path d="M4 2.5l15.5 8.2-6.6 1.9-2.6 6.6z" />
            </svg>
            <b>Kona</b>
          </span>
        </span>
      </div>
    </section>
  )
}
