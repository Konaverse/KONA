'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap, EASE, DUR } from '@/lib/motion-v4'

/**
 * PROJECT CARD — the work carries itself.
 *
 * DESIGN. No frame, no rounded container, no drop shadow. The media IS the
 * card and the type sits underneath it on the page. A bordered rounded
 * rectangle is the most template-like pattern there is, and this page's whole
 * argument is that the work stands on its own.
 *
 * HOVER. A screen recording of the site plays and the poster still cross-fades
 * out beneath it. The video is NOT in the DOM until first hover — architecture
 * §7 names Core Web Vitals as the live risk, and three autoplaying recordings
 * above the fold would wreck LCP. preload="none" plus mount-on-intent means a
 * visitor who never hovers never pays for it.
 *
 * ENTRANCE — "slime". Pulled from a corner so it stretches, then settling into
 * a solid rectangle. Built as squash-and-stretch DURING travel that resolves
 * without overshoot, not as an elastic bounce at the end: the token file bans
 * back and bounce curves outright ("they break the register"). The deformation
 * is what reads as fluid — the overshoot was never the part doing the work.
 */
export default function ProjectCard({
  title,
  meta,
  href,
  poster,
  video,
  index = 0,
}: {
  title: string
  meta: string
  href: string
  poster?: string
  video?: string
  index?: number
}) {
  const rootRef = useRef<HTMLAnchorElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [mounted, setMounted] = useState(false)
  const [playing, setPlaying] = useState(false)

  /* ---------------------------------------------------------- entrance */
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(el, { opacity: 1, clearProps: 'transform' })
      return
    }

    const ctx = gsap.context(() => {
      const media = el.querySelector('.k-card__media')
      const body = el.querySelector('.k-card__body')

      gsap.set(el, { opacity: 0, transformPerspective: 900 })
      gsap.set(media, { transformOrigin: '0% 0%' })

      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: EASE.glass },
      })

      // 1 — pulled from the top-left corner: it arrives long, thin and skewed,
      //     as though still being drawn out of somewhere.
      tl.fromTo(
        el,
        { opacity: 0, y: 64, scaleX: 0.82, scaleY: 1.16, skewY: 4, rotate: -1.2 },
        { opacity: 1, y: 0, duration: DUR.cinema, ease: EASE.drift },
        0,
      )
      // 2 — the stretch releases and the shape recovers. Overshoot lives here
      //     as a SECOND resolving tween rather than an elastic ease, so the
      //     rectangle gets its wobble without a banned curve.
      tl.to(el, { scaleX: 1.04, scaleY: 0.95, skewY: -1.4, rotate: 0.3, duration: DUR.slow * 0.55, ease: EASE.glass }, DUR.cinema * 0.42)
      tl.to(el, { scaleX: 1, scaleY: 1, skewY: 0, rotate: 0, duration: DUR.slow, ease: EASE.settle }, DUR.cinema * 0.72)
      // 3 — the caption arrives after the shape is solid, never during
      tl.fromTo(body, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: DUR.slow }, DUR.cinema * 0.8)

      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (!e.isIntersecting) return
            tl.delay(index * 0.12).play()
            io.unobserve(e.target)
          })
        },
        { threshold: 0.2 },
      )
      io.observe(el)
      return () => io.disconnect()
    }, el)

    return () => ctx.revert()
  }, [index])

  /* ------------------------------------------------------------- video */
  const onEnter = () => {
    if (!video) return
    setMounted(true) // first hover is what puts the <video> in the DOM
    setPlaying(true)
  }
  const onLeave = () => {
    setPlaying(false)
    const v = videoRef.current
    if (v) {
      v.pause()
      v.currentTime = 0
    }
  }

  useEffect(() => {
    const v = videoRef.current
    if (!v || !playing) return
    // play() rejects if the gesture heuristics dislike it; that is fine, the
    // poster simply stays up rather than throwing into the console
    v.play().catch(() => {})
  }, [playing, mounted])

  return (
    <a
      ref={rootRef}
      href={href}
      className={`k-card${playing ? ' is-playing' : ''}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
    >
      <span className="k-card__media">
        {poster ? (
          <img className="k-card__poster" src={poster} alt="" loading="lazy" decoding="async" />
        ) : (
          <span className="k-card__poster k-card__placeholder" aria-hidden="true" />
        )}
        {mounted && video && (
          <video
            ref={videoRef}
            className="k-card__video"
            src={video}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
          />
        )}
      </span>
      <span className="k-card__body">
        <h3 className="k-card__title">{title}</h3>
        <p className="k-card__meta">{meta}</p>
      </span>
    </a>
  )
}
