'use client'

import { useEffect, useRef } from 'react'
import Button from '@/components/v4/Button'
import ArrowLink from '@/components/v4/ArrowLink'
import { gsap, EASE, DUR } from '@/lib/motion-v4'

/**
 * SECTION 1 — ARRIVAL, second cut (2026-08-18, rebuilt against the user's
 * reference image `image.png`, analyzed via the image-to-code pass).
 *
 * What the reference dictates, translated to KONA:
 *  - The background is ALIVE: an ambient ice-toned gradient field that never
 *    stops moving (three soft radial blobs on slow transform loops — cheap on
 *    the GPU, transform-only). It fades to plain surface at the bottom so §2
 *    continues on white.
 *  - The headline FLOWS AROUND the object: a left block of three staggered
 *    lines and a right block of two, one sentence read together. Words carry
 *    different voices — ink at 200, ink at 600, and "faded" words in muted
 *    graphite at 200 (kept AA-passing rather than the reference's true fade).
 *  - Line 3's tail dies BEHIND the object (the rim-circle clip does the
 *    occlusion); the right block sits IN FRONT, grazing the rim. The h1 is
 *    `display: contents` so its two spans can layer on opposite sides of the
 *    video with no duplicate-text tricks.
 *  - The object wears an ORBIT: a thin tilted ellipse with two dot callouts,
 *    which is what recontextualises the ring from "floating badge" to
 *    "instrument". Display is capped at 560px so the 640px render never
 *    upscales (the "low res" read came from stretching past native).
 *  - ENTRANCE exists now (user reversed the no-entrance rule): object
 *    resolves from blur, headline lines rise masked, the orbit draws itself,
 *    chrome refracts in — one timeline, ~1.9s, EASE.glass.
 *  - The recede handoff survives: past the entrance, scroll makes the object
 *    assembly lag, shrink and blur; the two headline layers separate.
 *
 * No-JS: `.hm-ent` initial-hidden states are undone by the <noscript> block;
 * the page reads complete. Reduced motion: everything set visible instantly,
 * atmosphere frozen by CSS, video paused.
 *
 * All copy is PLACEHOLDER — the user writes the real lines (checklist 6.6).
 */
export default function HeroStage() {
  const rootRef = useRef<HTMLElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    const root = rootRef.current
    const video = videoRef.current
    if (!root || !video) return

    const q = (sel: string) => root.querySelector<HTMLElement>(sel)
    const qa = (sel: string) => Array.from(root.querySelectorAll<HTMLElement>(sel))

    const assembly = q('[data-hm-object]')
    const objEnt = q('.hm-obj-ent')
    const leftBlock = q('.hm-hl-left')
    const rightBlock = q('.hm-hl-right')
    const ellipse = root.querySelector<SVGElement>('.hm-orbit ellipse')
    if (!assembly || !objEnt || !leftBlock || !rightBlock) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      video.pause()
      gsap.set(qa('.hm-ent'), { opacity: 1, y: 0, yPercent: 0, filter: 'none' })
      if (ellipse) gsap.set(ellipse, { strokeDashoffset: 0 })
      return
    }

    const desktop = window.matchMedia('(min-width: 57.5rem)')
    let receding = false
    let last = -1

    const recede = () => {
      if (!desktop.matches) {
        if (last !== -1) {
          last = -1
          gsap.set([assembly, leftBlock, rightBlock], { clearProps: 'transform,filter' })
        }
        return
      }
      const h = root.offsetHeight || window.innerHeight
      const p = Math.min(Math.max(window.scrollY / (h * 0.9), 0), 1)
      if (p === last) return
      last = p
      gsap.set(assembly, {
        y: p * h * 0.16,
        scale: 1 - p * 0.1,
        filter: p > 0.001 ? `blur(${(p * 8).toFixed(2)}px)` : 'none',
      })
      gsap.set(leftBlock, { y: p * h * 0.06 })
      gsap.set(rightBlock, { y: p * h * 0.025 })
      if (p >= 1 && !video.paused) video.pause()
      else if (p < 1 && video.paused) video.play().catch(() => {})
    }

    // ---- the entrance. One timeline; recede takes over when it ends. ----
    const tl = gsap.timeline({
      defaults: { ease: EASE.glass },
      onComplete: () => {
        receding = true
      },
    })

    tl.fromTo(
      objEnt,
      { opacity: 0, scale: 0.93, filter: 'blur(18px)' },
      { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.1, clearProps: 'filter' },
      0,
    )
    tl.fromTo(
      qa('.hm-hl-left .hm-line'),
      { yPercent: 112, filter: 'blur(14px)', opacity: 0 },
      { yPercent: 0, filter: 'blur(0px)', opacity: 1, duration: DUR.slow, stagger: 0.09 },
      0.15,
    )
    tl.fromTo(
      qa('.hm-hl-right .hm-line'),
      { yPercent: 112, filter: 'blur(14px)', opacity: 0 },
      { yPercent: 0, filter: 'blur(0px)', opacity: 1, duration: DUR.slow, stagger: 0.09 },
      0.48,
    )
    if (ellipse) {
      tl.fromTo(
        ellipse,
        { strokeDashoffset: 100 },
        { strokeDashoffset: 0, duration: 1.0, ease: EASE.drift },
        0.62,
      )
    }
    tl.fromTo(
      qa('.hm-callout'),
      { y: 14, filter: 'blur(10px)', opacity: 0 },
      { y: 0, filter: 'blur(0px)', opacity: 1, duration: DUR.base, stagger: 0.1 },
      1.05,
    )
    tl.fromTo(
      qa('.hm-cta, .hm-corner'),
      { y: 18, filter: 'blur(14px)', opacity: 0 },
      { y: 0, filter: 'blur(0px)', opacity: 1, duration: DUR.slow, stagger: 0.08 },
      0.72,
    )
    tl.fromTo(
      '.hm-sparkle',
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: DUR.base, ease: EASE.settle },
      1.15,
    )

    const update = () => {
      if (receding) recede()
    }
    gsap.ticker.add(update)
    return () => {
      gsap.ticker.remove(update)
      tl.kill()
    }
  }, [])

  return (
    <section ref={rootRef} className="hm-hero">
      {/* The living ground. Pure CSS, transform-only loops, frozen under
          reduced motion, faded to --surface at the bottom edge. */}
      <div className="hm-atmo" aria-hidden="true">
        <i className="hm-atmo-a" />
        <i className="hm-atmo-b" />
        <i className="hm-atmo-c" />
      </div>

      {/* One sentence, two blocks, five voices. display:contents lets the
          two spans sit on opposite sides of the video in z. */}
      <h1 className="hm-headline">
        <span className="hm-hl-left">
          <span className="k-mask hm-line-mask hm-li1">
            <span className="hm-line hm-ent">Immersive</span>
          </span>
          <span className="k-mask hm-line-mask hm-li2">
            <span className="hm-line hm-ent">
              web <em>experiences</em> <i className="hm-faded">crafted</i>
            </span>
          </span>
          <span className="k-mask hm-line-mask hm-li3">
            <span className="hm-line hm-ent">for ambitious brands</span>
          </span>
        </span>
        <span className="hm-hl-right">
          <span className="k-mask hm-line-mask">
            <span className="hm-line hm-ent">that get</span>
          </span>
          <span className="k-mask hm-line-mask">
            <span className="hm-line hm-ent">
              <em>Remembered</em>
            </span>
          </span>
        </span>
      </h1>

      {/* The object assembly: glow, video, orbit, callouts. The outer div is
          the recede's target; .hm-obj-ent is the entrance's — they never
          write the same node. */}
      <div className="hm-objpos">
        <div data-hm-object>
          <div className="hm-obj-ent hm-ent">
            <i className="hm-glow" aria-hidden="true" />
            <video
              ref={videoRef}
              src="/object/idle-clear.mp4"
              poster="/object/idle-clear-poster.webp"
              width={640}
              height={640}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              disablePictureInPicture
              aria-hidden="true"
              tabIndex={-1}
            />
            <svg className="hm-orbit" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <ellipse
                cx="50"
                cy="50"
                rx="48.5"
                ry="17.5"
                pathLength={100}
                transform="rotate(-9 50 50)"
              />
            </svg>
            <span className="hm-callout hm-callout--l hm-ent">
              Design, motion, engineering
              <i className="hm-dot" aria-hidden="true" />
            </span>
            <span className="hm-callout hm-callout--r hm-ent">
              <i className="hm-dot" aria-hidden="true" />
              In-house, end to end
            </span>
          </div>
        </div>
      </div>

      {/* Reference's sparkle accent, one and only one. */}
      <svg className="hm-sparkle hm-ent" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 0c1.2 7.4 4.6 10.8 12 12-7.4 1.2-10.8 4.6-12 12-1.2-7.4-4.6-10.8-12-12C7.4 10.8 10.8 7.4 12 0Z" />
      </svg>

      <div className="hm-cta hm-ent">
        <Button href="/contact" hoverLabel="Say hello">
          Start a project
        </Button>
      </div>

      {/* Bottom-left anchor: a real destination, not a fake stat. */}
      <div className="hm-corner hm-ent">
        <span className="hm-worklink">
          <ArrowLink href="/work">Selected work</ArrowLink>
        </span>
        <p className="hm-lead t-small">
          Websites built as one continuous story, for brands that have outgrown
          the template.
        </p>
      </div>

      <noscript>
        <style>{`.hm-ent{opacity:1!important;transform:none!important;filter:none!important}.hm-orbit ellipse{stroke-dashoffset:0!important}`}</style>
      </noscript>
    </section>
  )
}
