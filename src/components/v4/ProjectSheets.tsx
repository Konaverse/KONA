'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/motion-v4'

/**
 * PROJECT SHEETS — the page-turn, scrubbed. Homepage §5's mechanic,
 * DECIDED 2026-08-17 (choreography doc carries the amendment).
 *
 * The section speaks the page transition's exact grammar, driven by the
 * wheel instead of a click: the next project rises as a full-bleed sheet —
 * tilted +2.2°, seam shadow ahead of its edge, arriving slightly swollen —
 * and buries the current one, which lifts, drifts, swells toward the viewer
 * and dims progressively. Clicking a sheet then hands off into the real
 * transition mid-language; the section teaches the navigation.
 *
 * This exists because the alternative was the giats stacking-parallax we
 * ported to the legacy site, and that is someone else's move. Every number
 * here is shared with PageTransition.tsx — one grammar, two drivers.
 *
 * SCRUB, NOT PLAYBACK. The timeline maps linearly to scroll (ease: 'none');
 * the user's hand supplies the velocity and Lenis supplies the smoothing.
 * Easing a scrub twice is how scroll sections end up feeling detached from
 * the wheel.
 *
 * PROGRESSIVE ENHANCEMENT. At rest this renders as a plain vertical
 * sequence of full-height projects — that is what no-JS and reduced-motion
 * get, and it is a perfectly serviceable section. The effect only switches
 * to the pinned, stacked form (`.is-scrub`) once the driver mounts.
 */

/* Shared with PageTransition.tsx — the one grammar. */
const TILT = 2.2
const OUT_RISE = 31 // yPercent
const OUT_DRIFT = 5 // xPercent
const OUT_DIM = 0.18
const OUT_SCALE = 1.05
const IN_SCALE = 1.06
/** Fraction of each segment the settled sheet simply holds. ZERO by the
 *  user's decision (2026-08-17): no pin, no rest — one continuous motion,
 *  each sheet entirely on screen for exactly the instant between finishing
 *  its arrival and beginning its burial. The knob stays for tuning. */
const DWELL = 0
/** Scroll length of one turn, in viewport-heights. */
const TURN_VH = 120

export interface SheetProject {
  title: string
  line: string
  year: string
  href: string
  /** Full-bleed artwork. Absent → the ice placeholder wash (B1). */
  image?: string
}

export default function ProjectSheets({
  projects,
  buried = false,
}: {
  projects: SheetProject[]
  /** §7 rises over the last sheet as an opaque light sheet (`.pr.is-over`,
   *  −100svh) while that sheet drifts up at 0.45× underneath — the same
   *  burial grammar §4 uses on §3. This costs the pin ONE extra viewport of
   *  runway the scrub does not consume: the last turn finishes exactly as
   *  the burial begins, then holds while it is covered. The two are a PAIR,
   *  set together in page.tsx — an overlap with no tail eats the last sheet,
   *  a tail with no overlap is a dead viewport. */
  buried?: boolean
}) {
  const rootRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const sheets = Array.from(root.querySelectorAll<HTMLElement>('.k-sheet'))
    if (sheets.length < 2) return

    const stage = root.querySelector<HTMLElement>('.k-sheets__stage')

    root.classList.add('is-scrub')
    root.style.height = `${(sheets.length - 1) * TURN_VH + 100 + (buried ? 100 : 0)}vh`

    /* The mini window — the giats stacking-parallax mechanic, studied and
     * kept honest: the images inside NEVER move. Each layer is stationary,
     * and what changes it is the incoming SHEET's top edge sweeping through
     * the window — the layer is clip-path'd to exactly the region below
     * that edge, tilt and all. When the edge is above the window, the new
     * project owns it; when no edge is crossing, nothing in it moves. One
     * system: the clip is derived per tick from the same progress that
     * drives the sheets, so the wipe line IS the sheet edge. */
    const minis = Array.from(root.querySelectorAll<HTMLElement>('.k-sheets__mini-item'))
    const mini = root.querySelector<HTMLElement>('.k-sheets__mini')

    /* One paused timeline, one unit of time per segment; scroll owns the
     * playhead. Every tween is ease:'none' — see the header. */
    const tl = gsap.timeline({ paused: true })
    sheets.forEach((sheet, i) => {
      if (i === 0) return
      const base = i - 1 + DWELL
      const turn = 1 - DWELL
      const prev = sheets[i - 1]
      const dim = prev.querySelector('.k-sheet__dim')

      tl.fromTo(
        sheet,
        { yPercent: 100, rotation: TILT, scale: IN_SCALE },
        { yPercent: 0, rotation: 0, scale: 1, duration: turn, ease: 'none' },
        base,
      )
      /* The seam shadow arrives with the motion, same trick as the
       * transition: the ::before reads this variable. */
      tl.fromTo(
        sheet,
        { '--seam': 0 },
        { '--seam': 1, duration: turn * 0.35, ease: 'none' },
        base,
      )
      tl.to(
        prev,
        {
          yPercent: -OUT_RISE,
          xPercent: -OUT_DRIFT,
          rotation: -TILT,
          scale: OUT_SCALE,
          duration: turn,
          ease: 'none',
        },
        base,
      )
      if (dim) tl.to(dim, { opacity: OUT_DIM, duration: turn, ease: 'none' }, base)
    })

    /* Parked start states for everything after the first sheet. */
    sheets.forEach((s, i) => {
      if (i > 0) gsap.set(s, { yPercent: 100, rotation: TILT, scale: IN_SCALE })
    })

    /* Where the incoming sheet's top edge sits in viewport coords, at
     * horizontal position x, for turn-progress e in [0,1]. The sheet is a
     * 112%-bled box translated by yPercent, rotated about its own centre
     * (which the bleed keeps at the viewport centre) and overscaled; this
     * is that composition applied to the box's top edge. */
    const BLEED = 0.06
    const edgeY = (e: number, x: number, vw: number, vh: number) => {
      const ty = (1 + 2 * BLEED) * vh * (1 - e) // yPercent of the bled box
      const th = ((TILT * (1 - e)) * Math.PI) / 180
      const s = 1 + (IN_SCALE - 1) * (1 - e)
      const cy = vh / 2 + ty
      const dy = -(BLEED + 0.5) * vh // box top, relative to its centre
      return cy + s * ((x - vw / 2) * Math.sin(th) + dy * Math.cos(th))
    }

    const setMinis = (p: number) => {
      if (!mini || minis.length < 2) return
      const r = mini.getBoundingClientRect()
      if (r.width === 0) return
      const vw = window.innerWidth
      const vh = window.innerHeight
      for (let k = 1; k < minis.length; k++) {
        const e = gsap.utils.clamp(0, 1, p * (sheets.length - 1) - (k - 1))
        const el = minis[k]
        if (e >= 1) {
          el.style.clipPath = 'none'
        } else {
          // the wipe line = the real edge, sampled at the window's sides
          const yA = edgeY(e, r.left, vw, vh) - r.top
          const yB = edgeY(e, r.right, vw, vh) - r.top
          el.style.clipPath = `polygon(0 ${yA}px, 100% ${yB}px, 100% 500%, 0 500%)`
        }
        /* the outgoing layer above the wipe falls into shadow with its
         * sheet — same dim, same clock */
        const shade = minis[k - 1].querySelector<HTMLElement>('.k-sheets__mini-shade')
        if (shade) shade.style.opacity = String(OUT_DIM * e)
      }
    }

    const update = () => {
      const rect = root.getBoundingClientRect()
      const vh = window.innerHeight
      /* the burial tail is excluded from the denominator, so the turns pace
         identically whether or not §7 is there to bury the last sheet */
      const tail = buried ? vh : 0
      const span = rect.height - vh - tail
      if (span <= 0) return
      const p = gsap.utils.clamp(0, 1, -rect.top / span)
      tl.progress(p)
      setMinis(p)
      /* THE BURIAL — §7's top edge is at rect.bottom − vh (it overlaps by
         −100svh): it enters the viewport bottom at rect.bottom = 2vh and
         covers this stage completely at rect.bottom = vh. Across exactly
         that window the stage drifts up at 0.45× — slower than the sheet
         climbing over it, which is the whole depth effect, and 0.45 always
         loses to §7's 1.0 so no bare ground can open between them. */
      if (buried && stage) {
        const d = gsap.utils.clamp(0, vh, 2 * vh - rect.bottom)
        gsap.set(stage, { y: -0.45 * d })
      }
    }
    update()
    gsap.ticker.add(update)

    return () => {
      gsap.ticker.remove(update)
      tl.kill()
      root.classList.remove('is-scrub')
      root.style.height = ''
      if (stage) gsap.set(stage, { clearProps: 'transform' })
      sheets.forEach((s) => gsap.set(s, { clearProps: 'all' }))
      minis.forEach((m) => {
        m.style.clipPath = ''
        const shade = m.querySelector<HTMLElement>('.k-sheets__mini-shade')
        if (shade) shade.style.opacity = ''
      })
    }
  }, [projects.length, buried])

  return (
    <section ref={rootRef} className="k-sheets" id="work" aria-label="Selected work">
      <div className="k-sheets__stage">
        {projects.map((p, i) => (
          <a
            key={p.title}
            href={p.href}
            className={`k-sheet${p.image ? ' has-image' : ''}`}
            style={{ zIndex: i + 1 }}
          >
            <span className="k-sheet__media" aria-hidden="true">
              {p.image && (
                /* eager: with the stage pinned, every sheet is one turn away
                   from full-bleed — a lazy image would decode mid-scrub.
                   srcset (mobile pass, 2026-08-25): a 1080w derivative for
                   phones; the capture itself is 2880w. */
                <img
                  className="k-sheet__img"
                  src={p.image}
                  srcSet={`${p.image.replace(/\.webp$/, '-1080.webp')} 1080w, ${p.image.replace(/\.webp$/, '-1600.webp')} 1600w, ${p.image} 2880w`}
                  sizes="100vw"
                  alt=""
                  decoding="async"
                />
              )}
            </span>
            <span className="k-sheet__cap">
              {/* Display scale, not h3 — this is the section that sells, and
                  a full-bleed sheet with a timid caption reads as apology.
                  The choreography amendment covers the size change. */}
              <span className="k-sheet__name t-h1">{p.title}</span>
              <span className="k-sheet__line t-body">{p.line}</span>
              <span className="k-sheet__year t-small">{p.year}</span>
            </span>
            {/* last, so it darkens media AND caption — same as the transition */}
            <span className="k-sheet__dim" aria-hidden="true" />
          </a>
        ))}

        {/* The mini stack: pinned over every sheet, one item per project,
            covering flat like the giats deck while the sheets page-turn
            underneath. Purely decorative — the sheet carries the link and
            the name — and it only exists in scrub mode. */}
        <div
          className="k-sheets__mini"
          aria-hidden="true"
          style={{ zIndex: projects.length + 1 }}
        >
          {projects.map((p, i) => (
            <span className="k-sheets__mini-item" key={p.title} style={{ zIndex: i + 1 }}>
              {p.image ? (
                <img className="k-sheets__mini-img" src={p.image} alt="" decoding="async" />
              ) : (
                <span className={`k-sheets__mini-img k-sheets__mini-wash-${i % 3}`} />
              )}
              <span className="k-sheets__mini-shade" />
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
