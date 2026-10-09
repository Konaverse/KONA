'use client'

import { useEffect, useRef } from 'react'
import Button from '@/components/v4/Button'
import HeroTitle from '@/components/v4/HeroTitle'
import { gsap, EASE, DUR } from '@/lib/motion-v4'
import { CALENDLY_URL } from '@/lib/site'
import { HERO_VIDEO_RECT, SHAPE_H, SHAPE_PATH, SHAPE_W } from '@/lib/hero-shape'

// Mask an HTML wrapper rather than a video inside SVG foreignObject: Safari's
// composited video layer can escape the foreignObject's ancestor clipPath.
const SHAPE_MASK = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SHAPE_W} ${SHAPE_H}" preserveAspectRatio="none"><path fill="white" d="${SHAPE_PATH}"/></svg>`,
)}")`
const VIDEO_PLACEMENT = {
  left: `${(HERO_VIDEO_RECT.x / SHAPE_W) * 100}%`,
  top: `${(HERO_VIDEO_RECT.y / SHAPE_H) * 100}%`,
  width: `${(HERO_VIDEO_RECT.w / SHAPE_W) * 100}%`,
  height: `${(HERO_VIDEO_RECT.h / SHAPE_H) * 100}%`,
}

/**
 * SECTION 1 — ARRIVAL, VARIANT B ("the staircase"), 2026-08-18 night.
 * Built from the user's own wireframe (`image.png`): a trial WITHOUT the 3D
 * object — HeroStage (variant A) stays in the tree and is parked at
 * /hero-object for live comparison.
 *
 * THE CONTAINER IS THE TRICK. Two overlapping rounded rectangles — a tall
 * block top-right, a wide block bottom-left — union into a staircase with
 * concave fillets at the junction, and ONE picture flows through both. It
 * is drawn once as an SVG path (viewBox 0 0 815 375) used as a CSS mask, so
 * it scales losslessly at any width, fillets included. Since 2026-08-24 the
 * picture is a LOOPING VIDEO (user call) — the
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


export default function HeroPortrait() {
  const rootRef = useRef<HTMLElement | null>(null)

  /* ONE VIDEO, NOT TWO (performance pass, 2026-10-03): the loop is in the
     markup twice — the desktop portrait's masked wrapper and the phone's
     plate — and CSS hides whichever the layout does not use. A hidden
     <video src autoplay> still downloads, so the file (1.1 MB) came down
     twice. The URL now sits in data-src and goes onto the copy that is
     actually laid out, and again on a resize that swaps the layouts.
     No poster: only the video's own frames may appear in this window. */
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const attach = () => {
      root.querySelectorAll<HTMLVideoElement>('video[data-src]').forEach((v) => {
        if (v.src || !v.getClientRects().length) return
        v.src = v.dataset.src as string
        v.play().catch(() => {})
      })
    }
    attach()
    window.addEventListener('resize', attach)
    return () => window.removeEventListener('resize', attach)
  }, [])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const qa = (sel: string) => Array.from(root.querySelectorAll<HTMLElement>(sel))

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(qa('.hw-ent'), { opacity: 1, y: 0, yPercent: 0, filter: 'none' })
      return
    }

    /* THE POINTER PARALLAX IS OFF (2026-10-03, owner: "remove the mouse
       parallax movement for the homepage hero, for the video inside the
       container"). The picture used to lean a few px toward the cursor
       (.hw-pan, lerped on the ticker); it now stands still. HeroPeel
       still reads .hw-pan's x/y, which stay 0. */

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
      window.removeEventListener('k-peel-armed', begin)
      window.removeEventListener('k-hero-sew', beginCopy)
      clearTimeout(fallback)
      clearTimeout(copyFallback)
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
        <div className="hw-shape hw-ent" aria-hidden="true">
          {/* Keep the authored crop and the SAME video used by HeroPeel.
              Mask the HTML wrapper to avoid foreignObject's Safari
              compositing bugs. */}
          <div
            className="hw-vidbox"
            style={{ maskImage: SHAPE_MASK, WebkitMaskImage: SHAPE_MASK }}
          >
            <div className="hw-pan" style={VIDEO_PLACEMENT}>
              <video
                className="hw-vid"
                data-src="/home/hero-loop.mp4"
                autoPlay
                muted
                loop
                playsInline
              />
            </div>
          </div>

          <svg
            className="hw-outline"
            viewBox={`0 0 ${SHAPE_W} ${SHAPE_H}`}
            focusable="false"
          >
            <defs>
              {/* the lit edge, as a gradient along the stroke: bright where the
                  silhouette faces the key light, gone a third of the way down.
                  This is `inset 0 1px 0` for a shape that is not a rectangle. */}
              <linearGradient id="hw-catch" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#ffffff" stopOpacity="0.85" />
                <stop offset="0.34" stopColor="#ffffff" stopOpacity="0.12" />
                <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* outside the mask on purpose, so the stroke traces the true
                outline instead of being halved by its own clip */}
            <path className="hw-edge" d={SHAPE_PATH} />
          </svg>
        </div>

        <HeroTitle />

        {/* mobile swaps the staircase for a plain rounded crop; sits after
            the headline in flow, hidden on desktop. Same looping clip — and
            since 2026-08-26 it is the PEEL'S SOURCE on phones: HeroPeel
            takes its rect, opacity, radius and crop, and folds it into
            §2's background exactly as it does the staircase. */}
        <video
          className="hw-mimg hw-ent"
          data-src="/home/hero-loop.mp4"
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
