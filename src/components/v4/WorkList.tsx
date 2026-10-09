'use client'

import { useEffect, useRef } from 'react'
import Button from '@/components/v4/Button'
import { WORK_PROJECTS, type WorkProject } from '@/lib/work-projects'
import { EASE, gsap } from '@/lib/motion-v4'
import { CustomEase } from 'gsap/CustomEase'
import './worklist.css'

/**
 * §5 — THE LIST (2026-09-14, user: igniteagency.com's selected work,
 * "same exactly style"). Rebuilt from MEASUREMENT (extract/ignite-work/):
 *
 * THE MARQUEE HEAD. One line of display type repeated across the width,
 * drifting right at DRIFT px/s for as long as it is on screen, and on
 * top of that scrubbed by the scroll: +10vw when it enters at the foot,
 * −10vw as it leaves at the top (the original's ScrollTrigger, scrub 0).
 *
 * THE ROWS. A hairline list: the name left, a category pill right. On
 * hover, all on one 0.6s curve (cubic-bezier .075 .82 .165 1):
 *   · an ink overlay grows up from the row's bottom edge (scaleY 0→1)
 *   · the name steps right 16px and turns paper (0.4s)
 *   · in the clipped right slot the pill slides up and out and "View
 *     case study →" slides in from below
 *   · a 16:9 preview scales in from nothing, centred on the row's
 *     height and on the CURSOR's x, which it follows with a lag
 * The original's preview is a Vimeo loop; ours is the project's capture.
 *
 * ON THE WORK HUB (2026-09-17, user: "replace the cards section with the
 * hover section of the projects we have in the homepage") the same rows
 * stand alone — `bare`: no marquee, no kicker, no "All projects" foot
 * (the hero's "selected work" is the title there, and the hub is where
 * that button goes).
 *
 * Progress and the preview's chase run on one gsap.ticker (house rule).
 * The homepage's mobile gallery uses the same links and image markup,
 * with aligned screenshots and once-only entrances. Reduced motion
 * and no JavaScript retain the complete gallery. Every word is rendered.
 */

/* ← replace every value below with your own content */
const CONTENT = {
  marquee: 'Selected work.',
  kicker: 'Featured projects',
  rowCta: 'View case study',
  cta: { label: 'All projects', href: '/work', hover: 'See the work' },
}

/** the marquee's drift, px per second, rightwards (measured 96) */
const DRIFT = 96
/** the scroll scrub's reach, in viewport widths (measured 10vw) */
const SCRUB_VW = 0.1
/** the preview's chase: how much of the gap it closes per frame */
const CHASE = 0.16
/** the original's hover curve, as a CustomEase */
const EASE_IN = CustomEase.create('k-ignite', 'M0,0 C0.075,0.82 0.165,1 1,1')

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)

/** the row's destination: the case study when there is one, else the
 *  live site, else the hub */
const hrefOf = (p: WorkProject, studies: Set<string>) =>
  studies.has(p.slug) ? `/work/${p.slug}` : p.href ?? '/work'

export default function WorkList({
  projects = WORK_PROJECTS,
  studies,
  bare = false,
  mobileGallery = false,
}: {
  projects?: WorkProject[]
  studies: string[]
  /** the rows alone: no marquee head, no kicker, no foot (the work hub) */
  bare?: boolean
  /** Aligned image gallery below the homepage marquee on mobile. */
  mobileGallery?: boolean
}) {
  const ref = useRef<HTMLElement | null>(null)
  const has = new Set(studies)

  useEffect(() => {
    const sec = ref.current
    if (!sec) return
    const marq = sec.querySelector<HTMLElement>('.wl-marq')
    const track = sec.querySelector<HTMLElement>('.wl-marq-track')
    const copy = sec.querySelector<HTMLElement>('.wl-marq-t')
    const rows = Array.from(sec.querySelectorAll<HTMLElement>('.wl-row'))
    const media = gsap.matchMedia()
    media.add({
      always: 'all',
      reduce: '(prefers-reduced-motion: reduce)',
      hover: '(hover: hover)',
      mobile: '(max-width: 57.499rem)',
    }, (context) => {
      const { reduce, hover, mobile } = context.conditions!
      const gallery = mobileGallery && mobile

      /* ---- the marquee: drift + scrub, wrapped on one copy's width ---- */
      let drift = 0
      let lastT = performance.now()
      let W = copy?.offsetWidth ?? 0
      const onResize = () => {
        W = copy?.offsetWidth ?? 0
      }
      window.addEventListener('resize', onResize)

      /* ---- the preview chase: one per row, only the hovered one moves ---- */
      const chase = rows.map(() => ({ x: 0, tx: 0, on: false }))
      const prevs = gallery ? [] : rows.map((r) => r.querySelector<HTMLElement>('.wl-prev'))
      /* the preview is centred on its own box by the driver — see the CSS */
      gsap.set(prevs.filter(Boolean), { xPercent: -50, yPercent: -50, scale: 0 })

      const tick = () => {
        const now = performance.now()
        const dt = Math.min(0.05, (now - lastT) / 1000)
        lastT = now
        const vh = window.innerHeight
        const mr = marq && track ? marq.getBoundingClientRect() : null
        if (mr && mr.bottom > 0 && mr.top < vh && W > 0) {
          if (!reduce) drift += DRIFT * dt
          const p = clamp01((vh - mr.top) / (vh + mr.height))
          const scrub = reduce ? 0 : (0.5 - p) * 2 * SCRUB_VW * window.innerWidth
          const x = drift + scrub
          const wrapped = -W + ((x % W) + W) % W
          gsap.set(track, { x: wrapped, force3D: true })
        }
        chase.forEach((c, i) => {
          const el = prevs[i]
          if (!el || !c.on) return
          c.x += (c.tx - c.x) * CHASE
          gsap.set(el, { x: c.x, force3D: true })
        })
      }

      const offs: (() => void)[] = []
      if (hover && !reduce && !gallery) {
        rows.forEach((row, i) => {
          const prev = prevs[i]
          if (!prev) return
          const onEnter = (e: PointerEvent) => {
            const r = row.getBoundingClientRect()
            chase[i].on = true
            chase[i].tx = e.clientX - r.left
            chase[i].x = chase[i].tx
            gsap.set(prev, { x: chase[i].x })
            gsap.killTweensOf(prev, 'scale')
            gsap.to(prev, { scale: 1, duration: 0.6, ease: EASE_IN, overwrite: 'auto' })
          }
          const onMove = (e: PointerEvent) => {
            const r = row.getBoundingClientRect()
            chase[i].tx = e.clientX - r.left
          }
          const onLeave = () => {
            gsap.to(prev, {
              scale: 0,
              duration: 0.45,
              ease: EASE_IN,
              overwrite: 'auto',
              onComplete: () => {
                chase[i].on = false
              },
            })
          }
          row.addEventListener('pointerenter', onEnter)
          row.addEventListener('pointermove', onMove, { passive: true })
          row.addEventListener('pointerleave', onLeave)
          offs.push(() => {
            row.removeEventListener('pointerenter', onEnter)
            row.removeEventListener('pointermove', onMove)
            row.removeEventListener('pointerleave', onLeave)
          })
        })
      }

      const raf = requestAnimationFrame(() => gsap.ticker.add(tick))
      return () => {
        cancelAnimationFrame(raf)
        gsap.ticker.remove(tick)
        window.removeEventListener('resize', onResize)
        offs.forEach((f) => f())
        gsap.killTweensOf(prevs.filter(Boolean))
      }
    })
    return () => media.revert()
  }, [mobileGallery, projects])

  useEffect(() => {
    const sec = ref.current
    if (!sec || !mobileGallery || !('IntersectionObserver' in window)) return
    const media = gsap.matchMedia()
    media.add('(max-width: 57.499rem) and (prefers-reduced-motion: no-preference)', () => {
      const rows = Array.from(sec.querySelectorAll<HTMLElement>('.wl-row'))
      const entrances = new Map<Element, gsap.core.Timeline>()
      for (const row of rows) {
        const curtain = row.querySelector('.wl-gallery-curtain')
        const image = row.querySelector('.wl-prev img')
        const name = row.querySelector('.wl-name')
        const service = row.querySelector('.wl-service')
        const arrow = row.querySelector('.wl-gallery-arrow')
        if (!curtain || !image || !name || !service || !arrow) continue
        gsap.set(curtain, { scaleY: 1 })
        gsap.set(image, { scale: 1.08, yPercent: 4 })
        gsap.set(name, { y: 20, autoAlpha: 0 })
        gsap.set(service, { y: 12, autoAlpha: 0 })
        gsap.set(arrow, { x: -8, autoAlpha: 0 })
        entrances.set(row, gsap.timeline({ paused: true })
          .to(curtain, { scaleY: 0, duration: 0.95, ease: EASE.settle }, 0)
          .to(image, { scale: 1, yPercent: 0, duration: 1.2, ease: EASE.glass }, 0)
          .to(name, { y: 0, autoAlpha: 1, duration: 0.8, ease: EASE.settle }, 0.08)
          .to(arrow, { x: 0, autoAlpha: 1, duration: 0.65, ease: EASE.settle }, 0.18)
          .to(service, { y: 0, autoAlpha: 1, duration: 0.65, ease: EASE.settle }, 0.28))
      }
      const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entrances.get(entry.target)?.play()
          observer.unobserve(entry.target)
        }
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' })
      rows.forEach(row => observer.observe(row))
      // Keyboard navigation must reveal the destination immediately.
      const onFocus = (event: FocusEvent) => {
        const row = event.target instanceof Element ? event.target.closest('.wl-row') : null
        if (!row) return
        entrances.get(row)?.progress(1)
        observer.unobserve(row)
      }
      sec.addEventListener('focusin', onFocus)
      return () => {
        observer.disconnect()
        sec.removeEventListener('focusin', onFocus)
      }
    })
    return () => media.revert()
  }, [mobileGallery, projects])

  return (
    <section ref={ref} className={`wl${bare ? ' wl-bare' : ''}${mobileGallery ? ' wl-home-gallery' : ''}`} id="work" aria-labelledby="wl-h">
      {/* the marquee head — decorative repeats; the real heading is below */}
      {!bare && (
      <div className="wl-marq" aria-hidden="true">
        <div className="wl-marq-track">
          {Array.from({ length: 6 }, (_, i) => (
            <span key={i} className="wl-marq-t">
              {CONTENT.marquee}
            </span>
          ))}
        </div>
      </div>
      )}

      <div className="wl-page">
        <h2 className={bare ? 'sr-only' : 'wl-k t-small'} id="wl-h">
          {bare ? 'Selected work' : CONTENT.kicker}
        </h2>

        <ul className="wl-list">
          {projects.map((p, i) => (
            <li key={p.slug} className="wl-row" style={{ '--i': i } as React.CSSProperties}>
              <a className="wl-link" href={hrefOf(p, has)} aria-label={mobileGallery ? `${p.name}, ${p.service}` : undefined}>
                <i className="wl-ov" aria-hidden="true" />
                <span className="wl-name">{p.name}</span>
                {mobileGallery && <span className="wl-gallery-arrow" aria-hidden="true">↗</span>}
                <span className="wl-right" aria-hidden="true">
                  <span className="wl-tag">{p.service}</span>
                  <span className="wl-cta">
                    {CONTENT.rowCta}
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
                      <path d="M2 8 L13 8" />
                      <path d="M9 4.5 L13 8 L9 11.5" />
                    </svg>
                  </span>
                </span>
                <span className="wl-service sr-only">{p.service}</span>
                <span className="wl-prev" aria-hidden={mobileGallery ? undefined : true}>
                  <picture>
                    {mobileGallery && <source media="(max-width: 57.499rem)" srcSet={`/work/covers/${p.slug}-960.webp`} type="image/webp" />}
                    <img src={p.image} alt={`The ${p.name} website`} width={960} height={528} loading="lazy" draggable={false} />
                  </picture>
                  {mobileGallery && <span className="wl-gallery-curtain" aria-hidden="true" />}
                </span>
              </a>
            </li>
          ))}
        </ul>

        {!bare && (
          <div className="wl-foot">
            <Button href={CONTENT.cta.href} hoverLabel={CONTENT.cta.hover}>
              {CONTENT.cta.label}
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
