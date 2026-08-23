'use client'

import { useEffect, useRef } from 'react'

/**
 * THE LOOPING SHADER BEHIND A CARD'S OBJECT.
 *
 * Sits in the media plate, under the fractured object, and plays a short
 * abstract render on a loop — chrome, noir, moving light.
 *
 * ── WHY THE FILE IS A BOOMERANG ───────────────────────────────────────────
 * The source clips are randomised shader renders: the last frame has nothing
 * to do with the first, so `loop` on the original cuts hard once a cycle.
 * They are rebuilt by tools/boomerang.js as forwards-then-backwards, which
 * makes both junctions frames meeting themselves. That is done to the FILE
 * rather than in here on purpose: video only decodes forwards from a
 * keyframe, so playing one backwards means stepping `currentTime` down and
 * re-decoding from the nearest keyframe every frame. A concatenated file is
 * an ordinary forward decode, and `loop` then needs no JavaScript at all.
 *
 * ── WHY THIS COMPONENT EXISTS AT ALL ──────────────────────────────────────
 * For one line of behaviour: it only plays while it is on screen. Six cards
 * decoding video forever is precisely the per-frame-forever cost this whole
 * section was rebuilt to remove — the conic ring and the blurred aura came
 * out for the same reason. A paused <video> costs nothing.
 *
 * `preload="none"` matters as much: without it six clips fetch on page load
 * whether or not anyone scrolls to them. The poster carries the plate until
 * the first frame decodes, so there is no pop and nothing to look at is
 * never nothing.
 *
 * Reduced motion never plays it — the poster is the whole treatment, which
 * is a still frame of the same art and reads as intended.
 */
export default function PlateLoop({ src, poster }: { src: string; poster: string }) {
  const ref = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    const v = ref.current
    if (!v) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          /* play() rejects if the element is torn down mid-promise, and on
             some browsers if autoplay is refused; neither is worth throwing */
          if (e.isIntersecting) void v.play().catch(() => {})
          else v.pause()
        }
      },
      { threshold: 0.15 },
    )
    io.observe(v)
    return () => {
      io.disconnect()
      v.pause()
    }
  }, [])

  return (
    <video
      ref={ref}
      className="sc-loop"
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
    />
  )
}
