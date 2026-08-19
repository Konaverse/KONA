'use client'

import { useEffect, useRef } from 'react'
import Reveal from '@/components/v4/Reveal'
import Button from '@/components/v4/Button'
import { gsap } from '@/lib/motion-v4'

/**
 * SECTION 7 — HOW WE WORK: the thread (user-directed 2026-08-19).
 *
 * THE ARRIVAL, and it is the reason this section exists in this form: §7 is
 * an opaque white sheet with `margin-top: -100svh` that rises OVER §6's
 * pinned dark stage and buries it — the same grammar §4 uses on §3. §6 keeps
 * its pin, and gains one extra viewport of runway at the end (Interlude's
 * `buried` prop) whose only job is this burial: through it the interlude's
 * frame DRIFTS UP at 0.45× scroll while this sheet climbs at hand speed. It
 * is not frozen and it is not travelling with the page; it is moving slower,
 * which is the whole depth effect. The two are a pair — `buried` on the
 * Interlude and this section's `is-over` are set together in page.tsx.
 *
 * ON SCREEN. Four moves in an asymmetric left/right stagger, connected by ONE
 * hairline THREAD that draws itself as you scroll: an SVG rebuilt from the
 * real node positions, so it genuinely joins them at any width. A lit dot
 * rides the drawing head, and each node fills to ice as the head reaches it.
 * The thread is scrubbed, so it stops the instant you stop — rest is still.
 *
 * THE HOVER is one gesture expressed across the whole group: hovering any
 * move brings it to full ink and RECEDES the other three. It is a reading
 * focus, not a link affordance — these blocks navigate nowhere, and the
 * house rule is that nothing may imply a click it does not provide. The one
 * link out is the button at the foot.
 *
 * MEASUREMENT NOTE: the nodes sit OUTSIDE the revealed copy on purpose. The
 * reveal signature carries an 18px transform, and a transform would move the
 * node's measured rect and hang the thread off its anchors. Only `.pr-copy`
 * is revealed; `.pr-node` is untransformed, so geometry read at mount is
 * true.
 *
 * SEO/no-JS: every move, body and deliverable is server-rendered. Without JS
 * the thread is replaced by a plain CSS spine (`.pr-phases` loses `is-live`),
 * nothing is hidden, and the section reads as four stacked blocks. Reduced
 * motion: thread fully drawn, all nodes lit, no head, no burial overlap.
 * Copy is PLACEHOLDER — the user writes the real lines (checklist 6.6).
 */

type Move = { name: string; body: string; get: string }

const MOVES: Move[] = [
  {
    name: 'Frame',
    body: 'We agree on what the site has to do, who it is for, and what winning looks like, before anything gets designed.',
    get: 'A written brief, a sitemap, and a shared definition of done.',
  },
  {
    name: 'Draw',
    body: 'Type, space, motion and layout designed as one system, so every page built later already has its rules.',
    get: 'A design system and the key pages, drawn in full.',
  },
  {
    name: 'Build',
    body: 'Engineered server-first: real HTML, real speed, and motion that never costs a frame.',
    get: 'The site on your stack, with a CMS your team will actually use.',
  },
  {
    name: 'Launch',
    body: 'Redirects mapped, analytics wired, and the numbers watched through the first month.',
    get: 'A live site and a measured report, not a handover email.',
  },
]

export default function Process() {
  const rootRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const phases = root.querySelector<HTMLElement>('.pr-phases')
    const svg = root.querySelector<SVGSVGElement>('.pr-thread')
    const head = root.querySelector<SVGCircleElement>('.pr-head')
    if (!phases || !svg || !head) return
    const segs = Array.from(svg.querySelectorAll<SVGPathElement>('.pr-seg'))
    const nodes = Array.from(root.querySelectorAll<HTMLElement>('.pr-node'))
    if (segs.length === 0 || nodes.length !== segs.length + 1) return

    /* the CSS fallback spine is for the no-JS page only */
    phases.classList.add('is-live')

    /* geometry, rebuilt from the REAL node centres so the thread joins them
       at any width. Nodes are untransformed (see the header note), so these
       reads are true even while the copy is still revealing. */
    let lens: number[] = []
    let cum: number[] = []
    let nodeAt: number[] = []
    let L = 0

    const build = () => {
      const pr = phases.getBoundingClientRect()
      if (pr.width < 2 || pr.height < 2) return
      svg.setAttribute('viewBox', `0 0 ${pr.width} ${pr.height}`)
      const pts = nodes.map((n) => {
        const r = n.getBoundingClientRect()
        return { x: r.left - pr.left + r.width / 2, y: r.top - pr.top + r.height / 2 }
      })
      lens = []
      cum = []
      nodeAt = [0]
      L = 0
      segs.forEach((s, i) => {
        const a = pts[i]
        const b = pts[i + 1]
        /* an S between the two anchors: control points pulled along Y only,
           so the thread leaves and arrives vertically and the sideways
           travel happens in the middle of the run */
        const dy = (b.y - a.y) * 0.55
        s.setAttribute('d', `M ${a.x} ${a.y} C ${a.x} ${a.y + dy} ${b.x} ${b.y - dy} ${b.x} ${b.y}`)
        const len = s.getTotalLength()
        cum.push(L)
        lens.push(len)
        L += len
        nodeAt.push(L)
        s.style.strokeDasharray = String(len)
        s.style.strokeDashoffset = String(reduced ? 0 : len)
      })
    }
    build()

    const ro = new ResizeObserver(build)
    ro.observe(phases)
    /* a late webfont can reflow the copy without changing the container's
       height, which a ResizeObserver would never see */
    document.fonts?.ready.then(build).catch(() => {})

    if (reduced) {
      nodes.forEach((n) => n.classList.add('is-lit'))
      head.style.opacity = '0'
      return () => ro.disconnect()
    }

    /* §6's burial: this sheet climbs over the pinned interlude. Paired with
       `buried` on <Interlude> in page.tsx — one sets the overlap, the other
       the 0.45× drift underneath it. */
    root.classList.add('is-over')

    const lit = nodes.map(() => false)

    const tick = () => {
      const r = phases.getBoundingClientRect()
      const vh = window.innerHeight
      if (r.bottom < -200 || r.top > vh + 200) return
      /* p 0 when the block's top passes 78% of the viewport, 1 when its
         bottom passes 62% — the thread draws across the reading zone */
      const start = vh * 0.78
      const end = vh * 0.62
      const p = gsap.utils.clamp(0, 1, (start - r.top) / Math.max(start - end + r.height, 1))
      const drawn = p * L

      let hx = 0
      let hy = 0
      let onHead = false
      segs.forEach((s, i) => {
        const d = gsap.utils.clamp(0, lens[i], drawn - cum[i])
        s.style.strokeDashoffset = String(lens[i] - d)
        if (d > 0.5 && d < lens[i] - 0.5) {
          const pt = s.getPointAtLength(d)
          hx = pt.x
          hy = pt.y
          onHead = true
        }
      })
      head.style.opacity = onHead ? '1' : '0'
      if (onHead) {
        head.setAttribute('cx', String(hx))
        head.setAttribute('cy', String(hy))
      }

      /* each node fills as the drawing head reaches it, and empties again on
         the way back up — the thread owns them in both directions */
      nodes.forEach((n, i) => {
        const on = drawn >= nodeAt[i] - 0.5 && p > 0
        if (on !== lit[i]) {
          lit[i] = on
          n.classList.toggle('is-lit', on)
        }
      })
    }
    gsap.ticker.add(tick)

    return () => {
      gsap.ticker.remove(tick)
      ro.disconnect()
    }
  }, [])

  return (
    <section ref={rootRef} className="pr k-section">
      <div className="k-page">
        <Reveal as="h2" className="t-h1 pr-title">
          Four moves, from the first call to <em>launch day</em>.
        </Reveal>
        <Reveal as="p" className="t-body pr-lede" index={1}>
          No mystery phases and no black box. You always know what is happening,
          what we need from you, and what lands at the end of it.
        </Reveal>

        <div className="pr-phases">
          {/* the thread. Rebuilt from the node positions on mount and on every
              resize; aria-hidden because it draws what the list already says. */}
          <svg className="pr-thread" aria-hidden="true" focusable="false" preserveAspectRatio="none">
            {MOVES.slice(1).map((m) => (
              <path className="pr-seg" key={m.name} />
            ))}
            <circle className="pr-head" r="4.5" cx="0" cy="0" />
          </svg>

          {MOVES.map((m, i) => (
            <div
              key={m.name}
              className={`pr-move pr-m${i + 1} ${i % 2 === 0 ? 'pr-move--l' : 'pr-move--r'}`}
            >
              <span className="pr-node" aria-hidden="true">
                <i />
              </span>
              <Reveal className="pr-copy" index={i}>
                <h3 className="pr-name">{m.name}</h3>
                <p className="pr-body">{m.body}</p>
                <p className="pr-get">{m.get}</p>
              </Reveal>
            </div>
          ))}
        </div>

        <Reveal as="div" className="pr-foot" index={1}>
          <Button href="/contact" hoverLabel="Say hello">
            Start a project
          </Button>
        </Reveal>
      </div>
    </section>
  )
}
