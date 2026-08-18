'use client'

import { Fragment, useEffect, useRef } from 'react'
import Reveal from '@/components/v4/Reveal'
import ArrowLink from '@/components/v4/ArrowLink'
import { gsap, EASE } from '@/lib/motion-v4'

/**
 * SECTION 4 — WHAT WE DO: the index/detail instrument (user-directed
 * 2026-08-18, from a "stages" reference image; adaptation notes in the
 * choreography doc §4).
 *
 * Right: the six services as an unlinked tab index — muted at rest, and the
 * ACTIVE name letter-fills to ink (§2's fill signature at hover speed, done
 * with per-letter transition-delay so CSS owns the sweep). Hover activates;
 * click/tap and keyboard focus do too. Cursor stays default — these rows
 * promise no navigation (architecture §8), the one link out is the hub
 * arrow-link at the foot.
 *
 * Left: the active service blown up — giant numeral rising through a mask
 * (the button-roll grammar at display scale), a hairline GLYPH that draws
 * itself in (pathLength=100 dashoffset, the hero orbit's language) and then
 * keeps one slow CSS idle motion, name, paragraph. Swaps resolve from blur —
 * refraction, never a fade.
 *
 * AUTO-CYCLE (user call): the active service advances every ~5s on the
 * shared ticker, pauses while the pointer is over the instrument, sits out a
 * longer grace after a manual activation, and only runs while the section is
 * on screen. Reduced motion: no cycle, no draw, instant swaps.
 *
 * ARRIVAL: the section is an opaque z-raised sheet with margin-top −100svh —
 * it rises OVER §3's portrait (still drifting at ~0.45×) and buries it, the
 * claim's reveal grammar mirrored. CSS in home.css (.wd-*).
 *
 * SEO/fallback: all six names and paragraphs are server-rendered; without JS
 * the deck is six stacked readable blocks (`is-live` is what collapses it).
 * Copy is PLACEHOLDER — the user writes the real lines (checklist 6.6).
 */

/** 4s per service (user call: 5s read as "takes too long"), and the wait is
 *  VISIBLE — the ice-deep progress line under the active row fills across
 *  exactly this window and the jump lands when it completes. */
const CYCLE_MS = 4000

type Service = { name: string; para: string; glyph: React.ReactNode }

/* The glyphs: stroke-drawn instruments, viewBox 100, hairline weight held
   by vector-effect in CSS. Every drawable stroke carries pathLength=100 +
   .g-draw so one dashoffset tween draws any of them edge-to-edge; dots and
   dashed strokes stay out of the draw (a dash pattern and the draw trick
   share stroke-dasharray and cannot coexist). Each is a small SCENE, not an
   icon (user call: "each one needs to be magnificent"), and each keeps one
   or two idle motions, keyed by its .wd-g* class in home.css. */
const GLYPHS = {
  three_d: (
    /* The hero object's world: cube with trapped air, two crossed orbits,
       one sparkle. The orbit PLANES never rotate — a flat ellipse swept in
       the plane reads as a clock hand and periodically tangles the cube
       (seen on film); instead the DOTS travel their ellipses via
       offset-path, which is the hero's own rule: attitude constant, motion
       carried by what rides the orbit. */
    <svg className="wd-glyph wd-g1" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <ellipse cx="50" cy="52" rx="46" ry="13" pathLength={100} className="g-draw" transform="rotate(-16 50 52)" />
      <ellipse cx="50" cy="50" rx="30" ry="9" pathLength={100} className="g-draw" transform="rotate(58 50 50)" />
      <path className="g-draw" pathLength={100} d="M50 18 L72 29 L50 40 L28 29 Z" />
      <path className="g-draw" pathLength={100} d="M28 29 L28 55 L50 66 L50 40" />
      <path className="g-draw" pathLength={100} d="M72 29 L72 55 L50 66" />
      {/* the trapped air */}
      <circle cx="44" cy="50" r="1.2" className="g-dot" />
      <circle cx="55" cy="45" r="0.9" className="g-dot" />
      <circle cx="48" cy="58" r="1" className="g-dot" />
      <path className="g-draw g-spark" pathLength={100} d="M82 10 L84.2 15.8 L90 18 L84.2 20.2 L82 26 L79.8 20.2 L74 18 L79.8 15.8 Z" />
      {/* the travellers — positioned entirely by offset-path (CSS hides
          them where Motion Path is unsupported) */}
      <circle r="2.2" className="g-dot g-orbdot g-orbdot1" />
      <circle r="1.8" className="g-dot g-orbdot g-orbdot2" />
    </svg>
  ),
  design: (
    /* the hero's stage in miniature: the staircase window, its own layout
       roughed in, and the designer's cursor still moving things */
    <svg className="wd-glyph wd-g2" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <path
        className="g-draw"
        pathLength={100}
        d="M56 14 H 86 A 6 6 0 0 1 92 20 V 44 A 6 6 0 0 1 86 50 H 62 A 6 6 0 0 0 56 56 V 80 A 6 6 0 0 1 50 86 H 14 A 6 6 0 0 1 8 80 V 56 A 6 6 0 0 1 14 50 H 44 A 6 6 0 0 0 50 44 V 20 A 6 6 0 0 1 56 14 Z"
      />
      {/* headline + chip in the tall block */}
      <path className="g-draw" pathLength={100} d="M62 24 H 84" />
      <path className="g-draw" pathLength={100} d="M62 31 H 78" />
      <rect x="62" y="37" width="14" height="6" rx="3" pathLength={100} className="g-draw" />
      {/* paragraph in the wide block */}
      <path className="g-draw" pathLength={100} d="M14 60 H 44" />
      <path className="g-draw" pathLength={100} d="M14 67 H 38" />
      <path className="g-draw" pathLength={100} d="M14 74 H 30" />
      <path className="g-draw g-cursor" pathLength={100} d="M68 56 L68 70 L72 66.5 L75 73 L77.5 71.5 L74.5 65 L79 64.5 Z" />
    </svg>
  ),
  development: (
    /* the editor: a browser frame, code with real indentation, brackets,
       one line still being typed and the caret keeping time */
    <svg className="wd-glyph wd-g3" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <rect x="10" y="16" width="80" height="66" rx="5" pathLength={100} className="g-draw" />
      <path className="g-draw" pathLength={100} d="M10 28 H 90" />
      <circle cx="17" cy="22" r="1.6" className="g-dot" />
      <circle cx="24" cy="22" r="1.6" className="g-dot" />
      <path className="g-draw" pathLength={100} d="M18 40 H 44" />
      <path className="g-draw g-type" pathLength={100} d="M24 49 H 56" />
      <path className="g-draw" pathLength={100} d="M24 58 H 48" />
      <path className="g-draw" pathLength={100} d="M18 67 H 38" />
      <path className="g-draw" pathLength={100} d="M68 42 L61 53 L68 64" />
      <path className="g-draw" pathLength={100} d="M78 42 L85 53 L78 64" />
      <path className="g-draw g-caret" pathLength={100} d="M75 40 L71 66" />
    </svg>
  ),
  one_page: (
    /* The one page, alive: content and scroll dot travel together — the
       glyph demonstrates scrolling the way §3 demonstrates parallax. The
       content is CLIPPED to the page and runs taller than it, so the
       travel reveals below-the-fold blocks instead of poking past the
       frame (the unclipped first cut did exactly that on film). */
    <svg className="wd-glyph wd-g4" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id="wd-g4-clip">
          <rect x="31.5" y="9.5" width="37" height="81" rx="5" />
        </clipPath>
      </defs>
      <rect x="30" y="8" width="40" height="84" rx="6" pathLength={100} className="g-draw" />
      <g className="g-page" clipPath="url(#wd-g4-clip)">
        <rect x="36" y="16" width="28" height="14" rx="2" pathLength={100} className="g-draw" />
        <path className="g-draw" pathLength={100} d="M36 38 H 62" />
        <path className="g-draw" pathLength={100} d="M36 45 H 58" />
        <path className="g-draw" pathLength={100} d="M36 52 H 54" />
        <rect x="36" y="61" width="16" height="7" rx="3.5" pathLength={100} className="g-draw" />
        <path className="g-draw" pathLength={100} d="M36 78 H 60" />
        {/* below the fold — what the scroll travel reveals */}
        <rect x="36" y="86" width="28" height="12" rx="2" pathLength={100} className="g-draw" />
        <path className="g-draw" pathLength={100} d="M36 106 H 56" />
      </g>
      <path className="g-draw" pathLength={100} d="M78 16 V 84" />
      <circle cx="78" cy="22" r="2.2" className="g-dot g-scroll" />
    </svg>
  ),
  redesign: (
    /* the transformation: the old page dashed and swaying, the new one
       solid and still, and the flow between them never stopping */
    <svg className="wd-glyph wd-g5" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <g className="g-old">
        <rect x="12" y="30" width="34" height="44" strokeDasharray="3.2 3" />
        <path d="M18 40 H 40" strokeDasharray="3.2 3" />
        <path d="M18 48 H 36" strokeDasharray="3.2 3" />
        <path d="M18 56 H 30" strokeDasharray="3.2 3" />
      </g>
      <rect x="50" y="28" width="38" height="50" rx="5" pathLength={100} className="g-draw" />
      <path className="g-draw" pathLength={100} d="M57 40 H 80" />
      <path className="g-draw" pathLength={100} d="M57 48 H 74" />
      <rect x="57" y="57" width="14" height="8" rx="2" pathLength={100} className="g-draw" />
      {/* the flow: a dashed arc whose dashes march old → new */}
      <path className="g-flow" d="M30 20 C 42 6, 60 6, 70 17" strokeDasharray="4 4" />
      <path className="g-draw" pathLength={100} d="M64.5 15.5 L70 17 L68 10.5" />
    </svg>
  ),
  seo: (
    /* the results page: three results, the top one starred, and inside the
       lens the only thing that matters — the line going up */
    <svg className="wd-glyph wd-g6" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <path className="g-draw" pathLength={100} d="M12 24 H 48" />
      <path className="g-draw" pathLength={100} d="M12 31 H 36" />
      <path className="g-draw" pathLength={100} d="M12 46 H 52" />
      <path className="g-draw" pathLength={100} d="M12 53 H 40" />
      <path className="g-draw" pathLength={100} d="M12 68 H 44" />
      <path className="g-draw" pathLength={100} d="M12 75 H 32" />
      <path className="g-draw g-spark" pathLength={100} d="M56 21 L57.2 23.8 L60 25 L57.2 26.2 L56 29 L54.8 26.2 L52 25 L54.8 23.8 Z" />
      <g className="g-lens">
        <circle cx="70" cy="52" r="17" pathLength={100} className="g-draw" />
        <path className="g-draw" pathLength={100} d="M60 58 L66 53 L70 55 L78 45" />
        <circle cx="78" cy="45" r="1.6" className="g-dot" />
        <path className="g-draw" pathLength={100} d="M82 64 L 92 74" />
      </g>
    </svg>
  ),
} as const

const SERVICES: Service[] = [
  {
    name: '3D Websites',
    para: 'Real dimension for brands that need presence felt rather than described. Path-traced, pre-rendered, and engineered to read premium on every device.',
    glyph: GLYPHS.three_d,
  },
  {
    name: 'Web Design',
    para: 'Interfaces with editorial calm and deliberate motion — designed on a system of type, space and restraint, never assembled from a template.',
    glyph: GLYPHS.design,
  },
  {
    name: 'Web Development',
    para: 'Engineering where performance is a feature: clean semantics, instant loads, and a site that humans and crawlers both read effortlessly.',
    glyph: GLYPHS.development,
  },
  {
    name: 'One-page Websites',
    para: 'One page, one argument. For launches and focused offers that need a complete, sharp statement without the weight of a full site.',
    glyph: GLYPHS.one_page,
  },
  {
    name: 'Website Redesign',
    para: 'For sites the business outgrew. We keep what earned its place, rebuild what didn’t, and migrate without losing what search already knows about you.',
    glyph: GLYPHS.redesign,
  },
  {
    name: 'SEO',
    para: 'Structure, copy and technical groundwork so the people — and the AI engines — searching for what you do actually find you.',
    glyph: GLYPHS.seo,
  },
]

/** row label split into letter spans; --i is the GLOBAL letter index so the
 *  ink sweep runs across the whole name, word gaps included */
function Letters({ text }: { text: string }) {
  let i = 0
  return (
    <span aria-hidden="true">
      {text.split(' ').map((word, wi) => (
        <Fragment key={wi}>
          <span style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
            {Array.from(word).map((ch, ci) => (
              <span key={ci} style={{ '--i': i++ } as React.CSSProperties}>
                {ch}
              </span>
            ))}
          </span>
          {wi < text.split(' ').length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </span>
  )
}

export default function ServicesIndex() {
  const rootRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const deck = root.querySelector<HTMLElement>('.wd-deck')
    const panels = Array.from(root.querySelectorAll<HTMLElement>('.wd-panel'))
    const rows = Array.from(root.querySelectorAll<HTMLElement>('.wd-row'))
    const lines = rows.map((r) => r.querySelector<SVGLineElement>('.wd-prog line'))
    if (!deck || panels.length === 0) return

    let active = 0
    let entered = false
    let hoverPaused = false
    /* time toward the next auto-advance; the progress line renders it */
    let acc = 0

    deck.classList.add('is-live')
    panels.forEach((p, i) => {
      if (i !== active) gsap.set(p, { autoAlpha: 0 })
    })
    rows[active]?.classList.add('is-active')

    const drawGlyph = (panel: HTMLElement, delay = 0.1) =>
      gsap.fromTo(
        panel.querySelectorAll<SVGGeometryElement>('.g-draw'),
        { strokeDashoffset: 100 },
        { strokeDashoffset: 0, duration: 0.9, ease: EASE.glass, stagger: 0.08, delay },
      )

    const activate = (next: number, manual: boolean) => {
      if (next === active) {
        if (manual) acc = 0
        return
      }
      const old = panels[active]
      const nu = panels[next]
      rows[active]?.classList.remove('is-active')
      rows[active]?.setAttribute('aria-selected', 'false')
      rows[next]?.classList.add('is-active')
      rows[next]?.setAttribute('aria-selected', 'true')
      /* both lines back to empty — the new one fills from zero */
      const oldLine = lines[active]
      const nuLine = lines[next]
      if (oldLine) oldLine.style.strokeDashoffset = '100'
      if (nuLine) nuLine.style.strokeDashoffset = '100'
      active = next
      acc = 0

      if (reduced) {
        gsap.set(old, { autoAlpha: 0 })
        gsap.set(nu, { autoAlpha: 1, y: 0, filter: 'none' })
        return
      }
      gsap.killTweensOf([old, nu])
      gsap.to(old, { autoAlpha: 0, y: -14, filter: 'blur(8px)', duration: 0.28, ease: EASE.glass })
      gsap.fromTo(
        nu,
        { autoAlpha: 0, y: 22, filter: 'blur(14px)' },
        { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.6, ease: EASE.glass, delay: 0.08 },
      )
      const num = nu.querySelector<HTMLElement>('.wd-num-line')
      if (num) {
        gsap.fromTo(num, { yPercent: 112 }, { yPercent: 0, duration: 0.55, ease: EASE.glass, delay: 0.12 })
      }
      drawGlyph(nu, 0.16)
    }

    /* hover / focus / tap all activate; hover is the primary desktop verb */
    const unbind: Array<() => void> = []
    rows.forEach((row, i) => {
      const over = () => activate(i, true)
      const click = () => activate(i, true)
      const focus = () => activate(i, true)
      row.addEventListener('pointerenter', over)
      row.addEventListener('click', click)
      row.addEventListener('focus', focus)
      unbind.push(() => {
        row.removeEventListener('pointerenter', over)
        row.removeEventListener('click', click)
        row.removeEventListener('focus', focus)
      })
    })

    if (reduced) return () => unbind.forEach((f) => f())

    /* the instrument holds still while the pointer is anywhere over it */
    const grid = root.querySelector<HTMLElement>('.wd-grid')
    const pauseOn = () => {
      hoverPaused = true
    }
    const pauseOff = () => {
      hoverPaused = false
      acc = 0
    }
    grid?.addEventListener('pointerenter', pauseOn)
    grid?.addEventListener('pointerleave', pauseOff)

    /* first draw + cycle start only once the section is actually seen */
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          entered = true
          drawGlyph(panels[active], 0.35)
          io.disconnect()
        })
      },
      { threshold: 0.3 },
    )
    io.observe(deck)

    const tick = (_t: number, dt: number) => {
      if (!entered || hoverPaused) return
      const r = root.getBoundingClientRect()
      if (r.bottom < 0 || r.top > window.innerHeight) return
      acc += dt
      /* the line IS the timer: offset 100 → 0 across the cycle window */
      const line = lines[active]
      if (line) {
        line.style.strokeDashoffset = String(Math.max(100 - (acc / CYCLE_MS) * 100, 0))
      }
      if (acc >= CYCLE_MS) activate((active + 1) % panels.length, false)
    }
    gsap.ticker.add(tick)

    return () => {
      unbind.forEach((f) => f())
      grid?.removeEventListener('pointerenter', pauseOn)
      grid?.removeEventListener('pointerleave', pauseOff)
      io.disconnect()
      gsap.ticker.remove(tick)
    }
  }, [])

  return (
    <section ref={rootRef} className="wd k-section">
      <div className="k-page">
        <Reveal as="h2" className="t-h1 wd-head">
          Everything a site needs to <em>carry the story</em>.
        </Reveal>

        <div className="wd-grid">
          <div className="wd-deck">
            {SERVICES.map((s, i) => (
              <div
                key={i}
                className="wd-panel"
                id={`wd-panel-${i}`}
                role="tabpanel"
                aria-labelledby={`wd-tab-${i}`}
              >
                <div className="wd-numrow">
                  <span className="wd-mask" aria-hidden="true">
                    <span className="wd-num wd-num-line">{String(i + 1).padStart(2, '0')}</span>
                  </span>
                  {s.glyph}
                </div>
                <h3 className="t-h2 wd-name">{s.name}</h3>
                <p className="t-body wd-para">{s.para}</p>
              </div>
            ))}
          </div>

          <div className="wd-index k-stagger" role="tablist" aria-orientation="vertical">
            {SERVICES.map((s, i) => (
              <Reveal key={i} as="div" index={i}>
                <button
                  type="button"
                  className="wd-row"
                  id={`wd-tab-${i}`}
                  role="tab"
                  aria-selected={i === 0}
                  aria-controls={`wd-panel-${i}`}
                >
                  <span className="sr-only">{s.name}</span>
                  <Letters text={s.name} />
                  {/* the wait made visible: fills across CYCLE_MS, and the
                      jump lands exactly when it completes */}
                  <svg className="wd-prog" aria-hidden="true" focusable="false">
                    <line x1="0" y1="50%" x2="100%" y2="50%" pathLength={100} />
                  </svg>
                </button>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal as="div" className="wd-foot" index={1}>
          <ArrowLink href="/services">All six, in full</ArrowLink>
        </Reveal>
      </div>

      {/* §4's handoff: the last hairline opens out full bleed (doc §4) */}
      <hr className="k-rule wd-foot-rule" />
    </section>
  )
}
