'use client'

import { useEffect, useRef } from 'react'
import Button from '@/components/v4/Button'
import HeroTitle from '@/components/v4/HeroTitle'
import { gsap, EASE, DUR } from '@/lib/motion-v4'
import { CALENDLY_URL } from '@/lib/site'

/**
 * SECTION 1 — ARRIVAL, VARIANT B ("the staircase"), 2026-08-18 night.
 * Built from the user's own wireframe (`image.png`): a trial WITHOUT the 3D
 * object — HeroStage (variant A) stays in the tree and is parked at
 * /hero-object for live comparison.
 *
 * THE CONTAINER IS THE TRICK. Two overlapping rounded rectangles — a tall
 * block top-right, a wide block bottom-left — union into a staircase with
 * concave fillets at the junction, and ONE picture flows through both. It
 * is drawn once as an SVG path (viewBox 0 0 815 375) used as a clipPath, so
 * it scales losslessly at any width, fillets included. Since 2026-08-24 the
 * picture is a LOOPING VIDEO in a clipped <foreignObject> (user call) — the
 * footage supplies the life the old ken-burns used to fake, so the ken-burns
 * is gone.
 *
 * The empty quadrants carry the content: top-left the headline —
 * HeroTitle's breathing sentence, whose inline image pills swell and shrink
 * on a 3s loop while the words re-wrap around them — bottom-right the
 * paragraph and the ghost CTA.
 *
 * Alive, per the standing feedback: atmosphere blobs behind, ken-burns in
 * the glass, an entrance where the shape settles in; the headline runs its
 * own arrival and loop (HeroTitle). Reduced motion: everything instant and
 * still.
 *
 * The paragraph is PLACEHOLDER copy; the headline is the user's own line.
 */

const SHAPE_PATH =
  'M 548 0 H 787 A 28 28 0 0 1 815 28 V 162 A 28 28 0 0 1 787 190 H 573 ' +
  'A 28 28 0 0 0 545 218 V 347 A 28 28 0 0 1 517 375 H 28 A 28 28 0 0 1 0 347 ' +
  'V 183 A 28 28 0 0 1 28 155 H 492 A 28 28 0 0 0 520 127 V 28 A 28 28 0 0 1 548 0 Z'

export default function HeroPortrait() {
  const rootRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const qa = (sel: string) => Array.from(root.querySelectorAll<HTMLElement>(sel))

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(qa('.hw-ent'), { opacity: 1, y: 0, yPercent: 0, filter: 'none' })
      return
    }

    // pointer parallax: the picture leans a few px toward the cursor,
    // lerped on the shared ticker so it drifts rather than tracks
    const pan = root.querySelector<SVGGElement>('.hw-pan')
    let tx = 0
    let ty = 0
    let px = 0
    let py = 0
    const onMove = (e: PointerEvent) => {
      const r = root.getBoundingClientRect()
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2
    }
    const panTick = () => {
      if (!pan) return
      px += (tx - px) * 0.055
      py += (ty - py) * 0.055
      gsap.set(pan, { x: px * 10, y: py * 8 })
    }
    root.addEventListener('pointermove', onMove)
    gsap.ticker.add(panTick)

    // the loop must actually loop: autoplay of muted inline video is allowed
    // everywhere, but a nudge covers the browsers that defer it anyway
    root.querySelectorAll('video').forEach((v) => v.play().catch(() => {}))

    /* THE OPENING GATE (2026-08-24, user): the entrance holds, paused,
       until HeroPeel's full-page cover is actually drawing
       ('k-peel-armed') — otherwise a slow video let the resting hero
       play first and then the cover popped in OVER it, which read as
       "another section in the back". Pre-gate the hero is just beams
       and nav (every entrance element rests at opacity 0), which reads
       as a quiet first paint, not a flash. The timeout is the no-GL
       fallback — no WebGL, a failed video — where the hero must
       still arrive on its own. */
    const tl = gsap.timeline({ paused: true, defaults: { ease: EASE.glass } })
    tl.fromTo(
      ['.hw-shape', '.hw-mimg'],
      { opacity: 0, y: 30, scale: 0.985 },
      { opacity: 1, y: 0, scale: 1, duration: 1.05 },
      0,
    )

    /* THE COPY RIDES THE PILLS (2026-08-26, with the entrance re-ordered:
       cover → carve → headline → pills). It used to rise at 1s into the
       ground the carve had just cleared; the carve now runs before the
       headline, so the copy waits for the headline's sew (`k-hero-sew`,
       the pills' push) and rises with it — the last act arrives as one.
       The fallback covers a sew that never fires. */
    const copy = gsap.timeline({ paused: true, defaults: { ease: EASE.glass } })
    copy.fromTo(
      qa('.hw-para, .hw-btn'),
      { y: 18, filter: 'blur(14px)', opacity: 0 },
      { y: 0, filter: 'blur(0px)', opacity: 1, duration: DUR.slow, stagger: 0.1 },
      0.15,
    )
    let copyBegun = false
    const beginCopy = () => {
      if (copyBegun) return
      copyBegun = true
      copy.play()
    }
    window.addEventListener('k-hero-sew', beginCopy, { once: true })
    const copyFallback = setTimeout(beginCopy, 7000)

    let begun = false
    const begin = () => {
      if (begun) return
      begun = true
      tl.play()
    }
    window.addEventListener('k-peel-armed', begin, { once: true })
    const fallback = setTimeout(begin, 1200)

    return () => {
      root.removeEventListener('pointermove', onMove)
      window.removeEventListener('k-peel-armed', begin)
      window.removeEventListener('k-hero-sew', beginCopy)
      clearTimeout(fallback)
      clearTimeout(copyFallback)
      gsap.ticker.remove(panTick)
      tl.kill()
      copy.kill()
    }
  }, [])

  return (
    <section ref={rootRef} className="hw-hero">
      {/* the key light: beam, fluting, fall-off. See .hw-light in home.css --
          it replaced three drifting ice blobs, which were wallpaper rather
          than a lit ground. */}
      <div className="hw-light" aria-hidden="true">
        <i className="hw-beam" />
        <i className="hw-flute" />
        <i className="hw-fall" />
      </div>

      <div className="hw-comp">
        {/* the staircase window. NO drop shadow: one was built here and
            removed the same day -- a shadow says the shape sits ON the page,
            the peel says the shape IS the page, and the fold then read as a
            sticker being picked off. See home.css. */}
        <svg
          className="hw-shape hw-ent"
          viewBox="0 0 815 375"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <clipPath id="hw-clip">
              <path d={SHAPE_PATH} />
            </clipPath>
            {/* the lit edge, as a gradient along the stroke: bright where the
                silhouette faces the key light, gone a third of the way down.
                This is `inset 0 1px 0` for a shape that is not a rectangle. */}
            <linearGradient id="hw-catch" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ffffff" stopOpacity="0.85" />
              <stop offset="0.34" stopColor="#ffffff" stopOpacity="0.12" />
              <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* clip on the GROUP, the LIVE VIDEO inside (2026-08-24, user):
              the still portrait became a looping clip — the motion the
              ken-burns used to fake, the footage now supplies, so the
              ken-burns is gone. Same 1208x680 box in the same spot, so the
              peel's texture mapping (HeroPeel's IMG constants) is untouched
              and pan slack still never exposes the clip edge. The video is
              muted+playsinline+loop: it autoplays everywhere, and HeroPeel
              re-uploads THIS element's current frame as the GL texture each
              tick — DOM and folding sheet can never drift apart. */}
          <g clipPath="url(#hw-clip)">
            {/* pointer parallax pans this group — the one transform here */}
            <g className="hw-pan">
              <foreignObject
                className="hw-vidbox"
                x="-213"
                y="-6"
                width="1208"
                height="680"
              >
                <video
                  className="hw-vid"
                  poster="/home/portrait-glass-mono.webp"
                  src="/home/hero-loop.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              </foreignObject>
            </g>
          </g>

          {/* outside the clip group on purpose, so the stroke traces the true
              outline instead of being halved by its own clip */}
          <path className="hw-edge" d={SHAPE_PATH} />
        </svg>

        <HeroTitle />

        {/* mobile swaps the staircase for a plain rounded crop; sits after
            the headline in flow, hidden on desktop. Same looping clip — and
            since 2026-08-26 it is the PEEL'S SOURCE on phones: HeroPeel
            takes its rect, opacity, radius and crop, and folds it into
            §2's background exactly as it does the staircase. */}
        <video
          className="hw-mimg hw-ent"
          poster="/home/portrait-glass-mono.webp"
          src="/home/hero-loop.mp4"
          autoPlay
          muted
          loop
          playsInline
        />

        <div className="hw-side">
          <p className="hw-para hw-ent t-small">
            Konaverse designs and builds websites end to end: strategy, design,
            motion and engineering in one continuous process. One team, one
            story, from the first sketch to the moment it ships. Based in
            Cyprus, working globally with brands that have outgrown the
            template.
          </p>
          <div className="hw-btn hw-ent">
            <Button ghost href={CALENDLY_URL} external hoverLabel="Book a call">
              Start a project
            </Button>
          </div>
        </div>
      </div>

      <noscript>
        <style>{`.hw-ent{opacity:1!important;transform:none!important;filter:none!important}`}</style>
      </noscript>
    </section>
  )
}
