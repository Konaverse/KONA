'use client'

import { useEffect, useRef } from 'react'
import Button from '@/components/v4/Button'
import { gsap, EASE, DUR } from '@/lib/motion-v4'

/**
 * SECTION 1 — ARRIVAL, VARIANT B ("the staircase"), 2026-08-18 night.
 * Built from the user's own wireframe (`image.png`): a trial WITHOUT the 3D
 * object — HeroStage (variant A) stays in the tree and is parked at
 * /hero-object for live comparison.
 *
 * THE CONTAINER IS THE TRICK. Two overlapping rounded rectangles — a tall
 * block top-right, a wide block bottom-left — union into a staircase with
 * concave fillets at the junction, and ONE portrait flows through both. It
 * is drawn once as an SVG path (viewBox 0 0 815 375) used as a clipPath, so
 * it scales losslessly at any width, fillets included. The image lives
 * inside a <g> that carries the clip while the <image> itself runs a slow
 * ken-burns — the picture breathes inside a still window.
 *
 * The empty quadrants carry the content: top-left the headline — the
 * user's copy, "Build the website that will make [chip] stand out", with
 * "you" letter-spaced under the chip — bottom-right the paragraph and the
 * ghost CTA.
 *
 * Alive, per the standing feedback: atmosphere blobs behind, ken-burns in
 * the glass, an entrance where the shape settles in, headline lines rise
 * masked, the chip pops, and the letters of "you" fly in and ALIGN (the
 * user's requested move). Reduced motion: everything instant and still.
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
    const youLetters = qa('.hw-you span')

    // Centre "you" under the chip — the chip's offset depends on rendered
    // text width, so CSS cannot know it. Re-run on resize. (The hover swap
    // that once lifted "you" into the chip's slot was REMOVED by the user,
    // 2026-08-18 — "you" just lives under the chip now.)
    const chipwrap = root.querySelector<HTMLElement>('.hw-chipwrap')
    const you = root.querySelector<HTMLElement>('.hw-you')
    const wrap = root.querySelector<HTMLElement>('.hw-l2wrap')
    const alignYou = () => {
      if (!chipwrap || !you || !wrap) return
      const c = chipwrap.getBoundingClientRect()
      const w = wrap.getBoundingClientRect()
      you.style.left = `${c.left - w.left + c.width / 2}px`
    }
    alignYou()
    window.addEventListener('resize', alignYou)

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(qa('.hw-ent'), { opacity: 1, y: 0, yPercent: 0, filter: 'none' })
      return () => window.removeEventListener('resize', alignYou)
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

    const tl = gsap.timeline({ defaults: { ease: EASE.glass } })
    tl.fromTo(
      ['.hw-shape', '.hw-mimg'],
      { opacity: 0, y: 30, scale: 0.985 },
      { opacity: 1, y: 0, scale: 1, duration: 1.05 },
      0,
    )
    tl.fromTo(
      qa('.hw-headline .hw-line'),
      { yPercent: 112, filter: 'blur(14px)', opacity: 0 },
      { yPercent: 0, filter: 'blur(0px)', opacity: 1, duration: DUR.slow, stagger: 0.1 },
      0.14,
    )
    // scale only — the chip's opacity belongs to the hover swap's CSS, and
    // a GSAP-inlined opacity would outrank it forever
    tl.fromTo(
      '.hw-chip',
      { scale: 0.55, transformOrigin: '50% 50%' },
      { scale: 1, duration: DUR.base, ease: EASE.settle },
      0.5,
    )
    // "the letters come in and align"
    tl.set('.hw-you', { opacity: 1 }, 0.66)
    tl.fromTo(
      youLetters,
      { opacity: 0, x: (i: number) => (i - 1) * 36 },
      { opacity: 1, x: 0, duration: DUR.base, ease: EASE.settle, stagger: 0.07 },
      0.66,
    )
    tl.fromTo(
      qa('.hw-para, .hw-btn'),
      { y: 18, filter: 'blur(14px)', opacity: 0 },
      { y: 0, filter: 'blur(0px)', opacity: 1, duration: DUR.slow, stagger: 0.1 },
      0.8,
    )

    return () => {
      window.removeEventListener('resize', alignYou)
      root.removeEventListener('pointermove', onMove)
      gsap.ticker.remove(panTick)
      tl.kill()
    }
  }, [])

  return (
    <section ref={rootRef} className="hw-hero">
      <div className="hm-atmo" aria-hidden="true">
        <i className="hm-atmo-a" />
        <i className="hm-atmo-b" />
        <i className="hm-atmo-c" />
      </div>

      <div className="hw-comp">
        {/* the staircase window */}
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
          </defs>
          {/* clip on the GROUP, ken-burns on the image: the picture breathes
              inside a still window (a clip on the image itself would breathe
              with it). 1208x680 keeps the source's 16:9 aspect, oversized and
              offset so the eyes land just below the step junction in the
              lower-left block and the arm arch textures the top-right one —
              the slack also means pan/ken-burns never expose the clip edge. */}
          <g clipPath="url(#hw-clip)">
            {/* pointer parallax pans this group; ken-burns lives on the
                image itself — two elements, no transform channel fights */}
            <g className="hw-pan">
              <image
                className="hw-img"
                href="/home/portrait-distorted.webp"
                x="-213"
                y="-6"
                width="1208"
                height="680"
              />
            </g>
          </g>
        </svg>

        <h1
          className="hw-headline"
          aria-label="Build the website that will make you stand out"
        >
          {/* Four voices, user-directed: "Build the website" grey bold ·
              "that will make" ink extralight · "you" ink bold · "stand out"
              grey bold. */}
          <span aria-hidden="true">
            <span className="hw-mask">
              <span className="hw-line hw-ent">
                <i className="hw-grey">Build the website</i>{' '}
                <span className="hw-xlight">that will</span>
              </span>
            </span>
            {/* "you" hangs BELOW the line, so it cannot live inside the
                overflow-hidden mask — it anchors to this wrapper and the
                effect aligns it under the chip. */}
            <span className="hw-l2wrap">
              <span className="hw-mask">
                <span className="hw-line hw-ent">
                  <span className="hw-xlight">make</span>{' '}
                  <span className="hw-chipwrap">
                    {/* no hw-ent here: the chip inherits the line's entrance
                        (its own inline opacity would outrank the hover CSS) */}
                    <img className="hw-chip" src="/home/typing.webp" alt="" />
                  </span>{' '}
                  <i className="hw-grey">stand out</i>
                </span>
              </span>
              <span className="hw-you hw-ent">
                <span>y</span>
                <span>o</span>
                <span>u</span>
              </span>
            </span>
          </span>
        </h1>

        {/* mobile swaps the staircase for a plain rounded crop; sits after
            the headline in flow, hidden on desktop */}
        <img
          className="hw-mimg hw-ent"
          src="/home/portrait-distorted.webp"
          alt=""
          loading="eager"
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
            <Button ghost href="/contact" hoverLabel="Say hello">
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
