'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/motion-v4'

/**
 * OBJECT SCRUB — homepage §6, the demonstration. The pre-rendered frame
 * sequence (blender/blockout.py --scrub) answering scroll: the object pins,
 * and the wheel drives it frosted -> clear -> the dark jewel -> dissolved
 * to white. This component exists to VALIDATE the delivery pipeline
 * (choreography §6's numbers are estimates until this works), but it is
 * built as the real mechanic, not a throwaway harness.
 *
 * SCRUB, NOT PLAYBACK — same law as ProjectSheets. Scroll position maps
 * linearly to a frame index; Lenis supplies the smoothing; nothing here
 * eases. The canvas redraws only when the index actually changes.
 *
 * PROGRESSIVE ENHANCEMENT (SEO plan D5). At rest this is a still image and
 * the section's lines as real DOM text, stacked and readable — that is what
 * no-JS, reduced-motion and every crawler get. The driver adds `.is-scrub`,
 * which pins the stage, floats the lines around the object, and swaps the
 * still for the canvas once every frame has decoded. The scrub chooses when
 * the lines are SEEN, never whether they EXIST.
 */

/** Pinned scroll length, in viewport-heights. §6 says 250-300; the midpoint
 *  until the scrub can be felt and the number argued from the real thing. */
const SCRUB_VH = 280

/** Each line's visibility window in scrub progress, with a short ramp on
 *  both edges. Fixed points in the material's story: one against the frost,
 *  one as the structure surfaces, one for the jewel's dwell — all clear of
 *  the dissolve (progress ~0.9 on) so the handoff owns the end. */
const LINE_WINDOWS: [number, number][] = [
  [0.06, 0.3],
  [0.42, 0.66],
  [0.74, 0.88],
]
const LINE_RAMP = 0.05

export interface ObjectScrubProps {
  /** Frame URLs, in order. Frame 1 doubles as the at-rest still. */
  frames: string[]
  /** The section's copy — real HTML, shown stacked at rest. */
  lines: string[]
}

export default function ObjectScrub({ frames, lines }: ObjectScrubProps) {
  const rootRef = useRef<HTMLElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const root = rootRef.current
    const canvas = canvasRef.current
    if (!root || !canvas) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    root.classList.add('is-scrub')
    root.style.height = `${SCRUB_VH + 100}vh`

    const lineEls = Array.from(root.querySelectorAll<HTMLElement>('.k-oscrub__line'))
    const ctx = canvas.getContext('2d')

    /* Decode everything up front. On the homepage this preload belongs to
     * section 5's dwell (§6: "sequence preloads during section 5"); the
     * test page just pays it on mount and reports how much it weighed.
     *
     * Into ImageBitmaps, not bare HTMLImageElements: img.decode() warms a
     * cache the browser is free to evict, and 120 frames of raw pixels
     * (~200MB at 640px) overflow it — so mid-scrub drawImage was paying a
     * synchronous WebP re-decode per frame. A bitmap's pixels stay resident
     * for its lifetime; the draw is a blit. */
    let disposed = false
    const bitmaps: (ImageBitmap | null)[] = frames.map(() => null)
    /* is-live goes on via classList, NEVER via state: a state flip would
     * re-render, and React rewriting className from JSX is what silently
     * strips the imperative is-scrub class — the pin dies with it. One
     * owner for the element's classes, same discipline as ProjectSheets. */
    Promise.all(
      frames.map((src, i) => {
        const img = new Image()
        img.src = src
        return img
          .decode()
          .then(() => createImageBitmap(img))
          .then((bmp) => {
            if (disposed) bmp.close()
            else bitmaps[i] = bmp
          })
          .catch(() => {})
      }),
    ).then(() => {
      if (!disposed) root.classList.add('is-live')
    })

    let drawn = -1
    const draw = (index: number) => {
      const bmp = bitmaps[index]
      if (!ctx || !bmp) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const size = Math.round(canvas.clientWidth * dpr)
      if (canvas.width !== size) canvas.width = canvas.height = size
      ctx.clearRect(0, 0, size, size)
      ctx.drawImage(bmp, 0, 0, size, size)
      drawn = index
    }

    const update = () => {
      const rect = root.getBoundingClientRect()
      const span = rect.height - window.innerHeight
      if (span <= 0) return
      const p = gsap.utils.clamp(0, 1, -rect.top / span)

      const index = Math.round(p * (bitmaps.length - 1))
      if (index !== drawn) draw(index)

      for (let i = 0; i < lineEls.length; i++) {
        const [a, b] = LINE_WINDOWS[i] ?? [0, 0]
        const o = Math.min((p - a) / LINE_RAMP, (b - p) / LINE_RAMP)
        lineEls[i].style.opacity = String(gsap.utils.clamp(0, 1, o))
      }
    }
    update()
    gsap.ticker.add(update)

    return () => {
      disposed = true
      bitmaps.forEach((bmp) => bmp?.close())
      gsap.ticker.remove(update)
      root.classList.remove('is-scrub', 'is-live')
      root.style.height = ''
      lineEls.forEach((el) => (el.style.opacity = ''))
    }
  }, [frames])

  return (
    <section ref={rootRef} className="k-oscrub" aria-label="The object, made clear">
      <div className="k-oscrub__stage">
        <div className="k-oscrub__media" aria-hidden="true">
          {/* First paint, no-JS and reduced-motion all show frame 1. */}
          <img className="k-oscrub__still" src={frames[0]} alt="" decoding="async" />
          <canvas className="k-oscrub__canvas" ref={canvasRef} />
        </div>
        {lines.map((line, i) => (
          <p className={`k-oscrub__line k-oscrub__line--${i + 1} t-h3`} key={line}>
            {line}
          </p>
        ))}
      </div>
    </section>
  )
}
