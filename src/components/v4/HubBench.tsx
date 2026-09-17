'use client'

import { useEffect, useRef } from 'react'
import BlockReveal from '@/components/v4/BlockReveal'
import { gsap, rem } from '@/lib/motion-v4'

/**
 * THE HUB'S SERVICES — THE WORKBENCH (2026-09-17, user: "same process
 * for the services below. I want it completely changed… hover animated
 * mixed with scroll motion rich… it doesn't have to be a list. it can
 * be a grid, it can be cards… don't be afraid to mix things up"). It
 * replaces THE LIST / THE STAIR (HubList.tsx, parked, unimported, with
 * its rules in hub.css).
 *
 * THE REFERENCES (21st.dev, read as film, none installed): "Hover
 * Expand Gallery" and "Expanding Cards" (one item takes the room, the
 * rest give way), "Services with Animated Hover Modal" (a service
 * answers the pointer with a preview), "Layered Stack" (a fanned sheet
 * that settles into a grid), "Card Spotlight" and "Tilt" (light and a
 * lean under the hand).
 *
 * THE PICTURE. The hero's world carried on: six ARTBOARDS on the
 * paper, a bento. No photographs — a picture per service is not to be
 * had (user, same day) — so each card carries a SCENE DRAWN IN CODE
 * that says what the service is by doing it:
 *   web design      a wireframe whose blocks rearrange into a second
 *                   layout, the agent's cursor dragging the hero block
 *   development     an editor whose lines type themselves, then a
 *                   "build passed" pill
 *   3D websites     a glass cube with a solid core, turning, that
 *                   leans to the pointer
 *   one-page        a long page scrolling itself inside a tall frame,
 *                   a rail keeping its place
 *   redesign        before | after under one frame, the divider under
 *                   the hand
 *   SEO             a results page where YOUR row climbs from fourth
 *                   to first, the line beside it rising
 * and a seventh, dark card that sends the undecided back to the hero's
 * prompt.
 *
 * THE HOVER. A card under the hand is `is-hot`: its scene plays, a
 * spotlight follows the pointer across it, the card leans a few degrees
 * about its centre, its blurb opens under the tagline, the arrow disc
 * floods; the other cards step back (`has-hot`). Without a hover-capable
 * pointer the card nearest the viewport's middle is the hot one — the
 * scroll does the hovering.
 *
 * THE SCROLL. The grid is a sheet in perspective: each card comes up
 * from under the fold tipped back about its foot and settles flat as it
 * climbs (rotateX, a lift, a scale — scrubbed, on the glide so it
 * trails the wheel by a breath), its column a beat behind the one to
 * its left. Positions are read off offsets, never off a transformed
 * rect. This section is also THE COVER: it scrolls up over the sticky
 * hero and writes `--sh-cover` on it, as the list did.
 *
 * THE DRIVER. gsap.ticker + one rect per frame; everything written is
 * transform, opacity or a custom property. The scenes are CSS keyed on
 * `is-hot` / `is-seen`. Reduced motion: the grid flat, the scenes
 * still. Every word is server-rendered; each card's link is its h2.
 */

export type BenchService = {
  slug: string
  name: string
  tagline: string
  blurb: string
  facts: readonly { value: string; label: string }[]
}

/** which scene a service gets */
const SCENE: Record<string, string> = {
  'web-design': 'design',
  'web-development': 'dev',
  '3d-websites': 'three',
  'one-page-websites': 'one',
  'website-redesign': 're',
  seo: 'seo',
}

/** the entrance: how far back a card is tipped, how far down it
 *  starts (rem), and how much of the viewport its climb takes */
const TIP = 26
const DROP = 7
const CLIMB = 0.6
/** the beat between columns, as a share of the viewport */
const COL_BEAT = 0.07
/** the glide's time constant, in seconds */
const GLIDE = 0.13
/** the lean under the hand, in degrees */
const LEAN = 3.2

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)
const easeOut = (v: number) => 1 - (1 - v) * (1 - v) * (1 - v)

export default function HubBench({ lead, services }: { lead: string; services: readonly BenchService[] }) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const grid = root.querySelector<HTMLElement>('.hb-grid')
    const prev = root.previousElementSibling
    const hero = prev instanceof HTMLElement && prev.classList.contains('sh-hero') ? prev : null
    if (!grid) return
    const k = rem()
    const unit = 16 * k

    const cards = Array.from(grid.querySelectorAll<HTMLElement>('.hb-card')).map((el) => ({
      el,
      inner: el.querySelector<HTMLElement>('.hb-card-in')!,
      re: el.querySelector<HTMLElement>('.hv-re'),
      top: 0,
      h: 0,
      col: 0,
      p: -1,
      seen: false,
      /* the lean and the pointer in the card (0…1) */
      lx: 0,
      ly: 0,
      tx: 0.5,
      ty: 0.5,
      split: 50,
    }))

    const measure = () => {
      const gw = grid.clientWidth || 1
      cards.forEach((c) => {
        c.top = c.el.offsetTop
        c.h = c.el.offsetHeight
        c.col = c.el.offsetLeft / gw
        c.p = -1
      })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(grid)

    /* THE HOVER */
    let hot: (typeof cards)[number] | null = null
    const setHot = (c: (typeof cards)[number] | null) => {
      if (hot === c) return
      hot?.el.classList.remove('is-hot')
      hot = c
      c?.el.classList.add('is-hot')
      grid.classList.toggle('has-hot', !!c)
    }
    const offs: (() => void)[] = []
    if (canHover) {
      cards.forEach((c) => {
        const enter = () => setHot(c)
        const leave = () => {
          if (hot === c) setHot(null)
          c.tx = 0.5
          c.ty = 0.5
        }
        const move = (ev: PointerEvent) => {
          const r = c.el.getBoundingClientRect()
          c.tx = clamp01((ev.clientX - r.left) / r.width)
          c.ty = clamp01((ev.clientY - r.top) / r.height)
          c.inner.style.setProperty('--px', `${(c.tx * 100).toFixed(1)}%`)
          c.inner.style.setProperty('--py', `${(c.ty * 100).toFixed(1)}%`)
        }
        c.el.addEventListener('pointerenter', enter)
        c.el.addEventListener('pointerleave', leave)
        c.el.addEventListener('pointermove', move)
        offs.push(() => {
          c.el.removeEventListener('pointerenter', enter)
          c.el.removeEventListener('pointerleave', leave)
          c.el.removeEventListener('pointermove', move)
        })
      })
    }

    /* the dark card sends the undecided back to the hero's prompt */
    const ask = grid.querySelector<HTMLAnchorElement>('.hb-ask-a')
    const onAsk = (ev: MouseEvent) => {
      const input = document.querySelector<HTMLInputElement>('.ha-input')
      if (!input) return
      ev.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
      window.setTimeout(() => input.focus({ preventScroll: true }), 900)
    }
    ask?.addEventListener('click', onAsk)

    let lastC = -1
    const tick = (time?: number, deltaTime?: number) => {
      const vh = window.innerHeight
      const rr = root.getBoundingClientRect()
      /* THE COVER */
      if (hero) {
        const c = clamp01(1 - rr.top / vh)
        if (c !== lastC) {
          lastC = c
          hero.style.setProperty('--sh-cover', c.toFixed(4))
        }
      }
      if (rr.bottom < -vh * 0.2 || rr.top > vh * 1.3) return
      const dt = (deltaTime ?? 16.7) / 1000
      const g = grid.getBoundingClientRect()
      const glide = 1 - Math.exp(-dt / GLIDE)

      if (!reduce) {
        /* the sheet's vanishing point rides with the viewport */
        grid.style.perspectiveOrigin = `50% ${(vh * 0.5 - g.top).toFixed(0)}px`
      }

      let best: (typeof cards)[number] | null = null
      let bestD = Infinity
      cards.forEach((c) => {
        const top = g.top + c.top
        /* THE SCROLL: the climb from under the fold, a beat per column */
        const want = reduce ? 1 : clamp01((vh * (1.02 - c.col * COL_BEAT) - top) / (vh * CLIMB))
        const p = c.p < 0 ? want : c.p + (want - c.p) * glide
        if (Math.abs(p - c.p) > 0.0004) {
          c.p = p
          const e = easeOut(p)
          c.el.style.transform =
            e >= 0.9995
              ? ''
              : `translate3d(0, ${((1 - e) * DROP * unit).toFixed(1)}px, 0) rotateX(${(-(1 - e) * TIP).toFixed(2)}deg) scale(${(0.93 + 0.07 * e).toFixed(4)})`
          c.el.style.opacity = clamp01(e * 1.5).toFixed(3)
          if (!c.seen && e > 0.5) {
            c.seen = true
            c.el.classList.add('is-seen')
          }
        }
        /* the hot card, where nothing can hover: the one at the middle */
        if (!canHover) {
          const d = Math.abs(top + c.h / 2 - vh / 2)
          if (d < bestD && d < vh * 0.42) {
            bestD = d
            best = c
          }
        }
        /* THE LEAN, eased; rests flat */
        if (canHover && !reduce) {
          const wx = hot === c ? (c.tx - 0.5) * 2 : 0
          const wy = hot === c ? (c.ty - 0.5) * 2 : 0
          const f = 1 - Math.exp(-dt / 0.16)
          const lx = c.lx + (wx - c.lx) * f
          const ly = c.ly + (wy - c.ly) * f
          if (Math.abs(lx - c.lx) > 0.0005 || Math.abs(ly - c.ly) > 0.0005) {
            c.lx = lx
            c.ly = ly
            c.inner.style.transform =
              Math.abs(lx) < 0.002 && Math.abs(ly) < 0.002
                ? ''
                : `rotateY(${(lx * LEAN).toFixed(3)}deg) rotateX(${(-ly * LEAN).toFixed(3)}deg)`
            /* the 3D scene reads the same lean, larger */
            c.inner.style.setProperty('--lx', lx.toFixed(3))
            c.inner.style.setProperty('--ly', ly.toFixed(3))
          }
        }
        /* before | after: the divider under the hand, or swaying */
        if (c.re && top < vh && top + c.h > 0) {
          const want2 = hot === c ? 8 + c.tx * 84 : 50 + Math.sin((time ?? 0) * 0.7) * 16
          const s = c.split + (want2 - c.split) * (1 - Math.exp(-dt / 0.18))
          if (Math.abs(s - c.split) > 0.02) {
            c.split = s
            c.re.style.setProperty('--split', `${s.toFixed(2)}%`)
          }
        }
      })
      if (!canHover) setHot(best)
    }
    tick()
    gsap.ticker.add(tick)

    return () => {
      gsap.ticker.remove(tick)
      ro.disconnect()
      offs.forEach((off) => off())
      ask?.removeEventListener('click', onAsk)
      hero?.style.removeProperty('--sh-cover')
      grid.classList.remove('has-hot')
      grid.style.perspectiveOrigin = ''
      cards.forEach((c) => {
        c.el.classList.remove('is-hot', 'is-seen')
        c.el.style.transform = ''
        c.el.style.opacity = ''
        c.inner.style.transform = ''
        ;['--px', '--py', '--lx', '--ly'].forEach((v) => c.inner.style.removeProperty(v))
        c.re?.style.removeProperty('--split')
      })
    }
  }, [])

  return (
    <section ref={ref} className="sh-index hb" aria-label="Our services">
      <div className="hb-head">
        <p className="hb-title">
          Pick a <em>starting point.</em>
        </p>
        <BlockReveal as="p" className="hb-lead" text={lead} />
      </div>

      <div className="hb-grid">
        {services.map((s, i) => {
          const scene = SCENE[s.slug] ?? 'design'
          return (
            <article key={s.slug} className={`hb-card hb-card-${scene}`} style={{ '--i': i } as React.CSSProperties}>
              <div className="hb-card-in">
                <div className="hb-vis" aria-hidden="true">
                  <Scene kind={scene} />
                </div>
                <div className="hb-body">
                  <h2 className="hb-name">
                    <a className="hb-link" href={`/services/${s.slug}`}>{s.name}</a>
                  </h2>
                  <p className="hb-tag">{s.tagline}</p>
                  {/* the blurb opens under the hand (it is in the markup
                      either way) */}
                  <div className="hb-more">
                    <p className="hb-blurb">{s.blurb}</p>
                  </div>
                  <ul className="hb-facts">
                    {s.facts.slice(0, 2).map((f) => (
                      <li key={f.label}>
                        <b>{f.value}</b> {f.label}
                      </li>
                    ))}
                  </ul>
                </div>
                <span className="hb-go" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="M6 18L18 6M9 6h9v9" /></svg>
                  <svg viewBox="0 0 24 24"><path d="M6 18L18 6M9 6h9v9" /></svg>
                </span>
              </div>
            </article>
          )
        })}

        {/* the seventh: not sure? — back to the hero's prompt */}
        <article className="hb-card hb-card-ask">
          <div className="hb-card-in">
            <svg className="hb-ask-spark" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2.5l1.9 6.1a2 2 0 0 0 1.4 1.4l6.2 2-6.2 2a2 2 0 0 0-1.4 1.4L12 21.5l-1.9-6.1a2 2 0 0 0-1.4-1.4l-6.2-2 6.2-2a2 2 0 0 0 1.4-1.4z" fill="currentColor" />
            </svg>
            <p className="hb-ask-t">Not sure which one is yours?</p>
            <a className="hb-ask-a hb-link" href="/contact">
              Tell us what you need
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M12.5 6l6 6-6 6" /></svg>
            </a>
          </div>
        </article>
      </div>
    </section>
  )
}

/** THE SCENES: markup only — hub.css draws and moves them */
function Scene({ kind }: { kind: string }) {
  switch (kind) {
    case 'design':
      return (
        <div className="hv hv-design">
          <span className="hv-frame-l">Home — 1440</span>
          <div className="hv-board">
            <i className="hv-b hv-b1" />
            <i className="hv-b hv-b2"><u /><u /></i>
            <i className="hv-b hv-b3" />
            <i className="hv-b hv-b4" />
            <i className="hv-b hv-b5" />
            <span className="hv-cur">
              <svg viewBox="0 0 24 24"><path d="M4 2.5l15.5 8.2-6.6 1.9-2.6 6.6z" /></svg>
              <b>Kona</b>
            </span>
          </div>
        </div>
      )
    case 'dev':
      return (
        <div className="hv hv-dev">
          <div className="hv-win">
            <span className="hv-bar"><i /><i /><i /></span>
            <div className="hv-code">
              {[
                [18, 34],
                [10, 26, 40],
                [22, 16],
                [10, 44, 12],
                [30, 20],
                [10, 18, 30],
                [14],
              ].map((ln, l) => (
                <span key={l} className="hv-ln" style={{ '--l': l, '--in': l > 0 && l < 6 ? 1 : 0 } as React.CSSProperties}>
                  {ln.map((w, j) => (
                    <i key={j} style={{ width: `${w}%` }} />
                  ))}
                </span>
              ))}
            </div>
          </div>
          <span className="hv-pill"><i />Build passed · 0.8 s</span>
        </div>
      )
    case 'three':
      return (
        <div className="hv hv-three">
          <div className="hv-tilt">
            <div className="hv-cube">
              <i /><i /><i /><i /><i /><i />
              <div className="hv-core"><i /><i /><i /><i /><i /><i /></div>
            </div>
          </div>
          <span className="hv-floor" />
        </div>
      )
    case 'one':
      return (
        <div className="hv hv-one">
          <div className="hv-tall">
            <div className="hv-strip">
              <i className="hv-s hv-s1"><u /><u /></i>
              <i className="hv-s hv-s2" />
              <i className="hv-s hv-s3"><u /><u /><u /></i>
              <i className="hv-s hv-s4" />
              <i className="hv-s hv-s5"><u /></i>
            </div>
          </div>
          <span className="hv-rail"><i /></span>
        </div>
      )
    case 're':
      return (
        <div className="hv hv-re">
          <div className="hv-after">
            <i className="hv-a1" /><i className="hv-a2" /><i className="hv-a3" /><i className="hv-a4" />
          </div>
          <div className="hv-before">
            {Array.from({ length: 14 }).map((_, j) => (
              <i key={j} style={{ '--j': j } as React.CSSProperties} />
            ))}
          </div>
          <span className="hv-div"><i /></span>
          <b className="hv-lab hv-lab-b">Before</b>
          <b className="hv-lab hv-lab-a">After</b>
        </div>
      )
    default:
      return (
        <div className="hv hv-seo">
          <div className="hv-serp">
            <span className="hv-q"><i />web design cyprus</span>
            {[0, 1, 2, 3].map((r) => (
              <span key={r} className={`hv-r${r === 3 ? ' hv-you' : ''}`} style={{ '--r': r } as React.CSSProperties}>
                <i /><u /><u />
                {r === 3 ? <b>You</b> : null}
              </span>
            ))}
          </div>
          <div className="hv-rank">
            <span className="hv-rank-n"><b>#4</b><b>#1</b></span>
            <svg viewBox="0 0 120 60" aria-hidden="true">
              <path d="M2 54C24 52 34 44 48 40S72 30 84 18 104 8 118 4" />
            </svg>
          </div>
        </div>
      )
  }
}
