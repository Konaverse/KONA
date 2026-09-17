'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import ServiceScene from '@/components/v4/ServiceScene'
import { gsap, EASE, DUR, rem } from '@/lib/motion-v4'
import { aimLight } from '@/lib/run-store'

/**
 * THE RUN · 1 — THE BRIEF, ACCEPTED (service pages, 2026-09-17; the
 * brief: "the brief has been accepted, and now the work happens as you
 * scroll… the h1 assembles; the tagline is the agent's one-line reading
 * of the job"; approved as a storyboard the same day).
 *
 * THE PICTURE (run.css `.rb`). On the light: a chip that says the brief
 * came in; the h1 — the display word with the modifier under it — down
 * the left; the tagline as a COMMENT pinned under the word, the way a
 * design tool pins one; the two CTAs. On the right THE ARTBOARD: the
 * hub's code-drawn scene for this service, enlarged in a window — the
 * card you clicked has become the page.
 *
 * THE PASS (about three seconds, once the fonts are in). The word stands
 * as an OUTLINE — type not yet rendered. Kona's cursor comes in, presses
 * at the word's top-left and drags a MARQUEE across it: behind the box's
 * leading edge the word is ink, ahead of it still outline (one text
 * node, a background-clip gradient whose stop is the edge — the h1 stays
 * clean text, no letter spans), and the size tag under the box reads the
 * box's real size as it grows. Released, the weight settles down the
 * variable axis, the chip ticks to "accepted", the modifier wipes in,
 * the comment pops out of the cursor's tip, the buttons rise, the scene
 * on the artboard starts to play. The hub's word ROSE out of masks under
 * a skeleton; this one is rendered where it stands — same family,
 * another verb.
 *
 * ALIVE AFTER. The scene replays on a slow clock (and reads the pointer
 * where it can: the cube leans, the divider sways); the light leans to
 * the pointer; on the way out the word and the artboard part at
 * different rates.
 *
 * THE DRIVER. One GSAP timeline for the pass, gsap.ticker + one rect
 * for the rest. Written per frame: transform, opacity, one width (the
 * marquee), custom properties. Hidden states are parked in CSS
 * (`.rb-ent`, the outline) and lifted by page.tsx's noscript and by
 * `is-still` (reduced motion: the finished hero, no cursor). Phones: no
 * agent — one soft reveal. Every word is server-rendered.
 */

/** the word's weight: where the ink lands, and where it settles */
const W_INK = 360
const W_REST = 200
/** the scene replays: seconds on, seconds off */
const PLAY_ON = 4.2
const PLAY_OFF = 1.6
/** the parting on the way out, in rem: the word sinks, the board lifts */
const PART_WORD = 5
const PART_BOARD = -7
/** how far the light leans from the artboard to the pointer */
const LEAN = 0.55

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)

export default function RunBrief({
  name,
  word,
  modifier,
  tagline,
  scene,
  children,
}: {
  name: string
  word: string
  modifier: string
  tagline: string
  scene: string
  /** the two CTAs, rendered by the page */
  children: ReactNode
}) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const hero = ref.current
    if (!hero) return
    const q = <T extends Element = HTMLElement>(s: string) => hero.querySelector<T>(s)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const phone = window.matchMedia('(max-width: 57.5rem)').matches
    if (reduce) {
      hero.classList.add('is-still')
      return () => hero.classList.remove('is-still')
    }
    const k = rem()
    const unit = 16 * k
    const wordEl = q('.rb-word')!
    const left = q('.rb-left')!
    const mod = q('.rb-mod')!
    const chip = q('.rb-chip')!
    const note = q('.rb-note')!
    const cta = q('.rb-cta')!
    const board = q('.rb-board')!
    const sel = q('.rb-sel')!
    const tag = q('.rb-sel-tag')!
    const cursor = q('.rb-cursor')!
    const re = q('.hv-re')

    let cancelled = false
    let tl: gsap.core.Timeline | null = null
    let built = false
    let playAt = 0
    let playing = false
    /* the pointer, as viewport fractions; and -1…1 about the board */
    let px = 0.76
    let py = 0.46
    let seen = false
    const onMove = (ev: PointerEvent) => {
      px = ev.clientX / window.innerWidth
      py = ev.clientY / window.innerHeight
      seen = true
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    let lastQ = -1
    let split = 50
    let lx = 0
    let ly = 0
    const tick = (time?: number, deltaTime?: number) => {
      const r = hero.getBoundingClientRect()
      const vh = window.innerHeight
      if (r.bottom < 0) return
      const dt = (deltaTime ?? 16.7) / 1000
      const t = time ?? 0
      /* the light: on the cursor during the pass (the pass aims it), on
         the artboard after, leaning to the hand */
      if (built && r.bottom > vh * 0.5) {
        const bx = 0.76
        const by = 0.46 + r.top / vh
        aimLight(seen ? bx + (px - bx) * LEAN : bx, seen ? by + (py - by) * LEAN : by)
      }
      /* the parting */
      const qv = clamp01(-r.top / r.height)
      if (!phone && Math.abs(qv - lastQ) > 0.0005) {
        lastQ = qv
        left.style.transform = qv <= 0 ? '' : `translate3d(0, ${(qv * PART_WORD * unit).toFixed(1)}px, 0)`
        board.style.setProperty('--rb-part', `${(qv * PART_BOARD * unit).toFixed(1)}px`)
        board.style.setProperty('--rb-tip', `${(qv * 7).toFixed(2)}deg`)
      }
      if (!built) return
      /* the scene's clock */
      if (t > playAt) {
        playing = !playing
        board.classList.toggle('is-hot', playing)
        playAt = t + (playing ? PLAY_ON : PLAY_OFF)
      }
      /* before | after sways; the cube leans to the hand */
      if (re) {
        const want = 50 + Math.sin(t * 0.7) * 22
        split += (want - split) * (1 - Math.exp(-dt / 0.18))
        re.style.setProperty('--split', `${split.toFixed(2)}%`)
      }
      if (scene === 'three') {
        const f = 1 - Math.exp(-dt / 0.2)
        lx += ((seen ? (px - 0.76) * 3 : 0) - lx) * f
        ly += ((seen ? (py - 0.46) * 3 : 0) - ly) * f
        board.style.setProperty('--lx', Math.max(-1, Math.min(1, lx)).toFixed(3))
        board.style.setProperty('--ly', Math.max(-1, Math.min(1, ly)).toFixed(3))
      }
    }

    const start = () => {
      if (cancelled) return
      hero.classList.add('is-in')
      gsap.ticker.add(tick)
      const ents = [chip, mod, note, cta, board]

      if (phone) {
        built = true
        hero.classList.add('is-set', 'is-ok')
        gsap.set([sel, cursor], { display: 'none' })
        tl = gsap.timeline()
        tl.fromTo(
          [chip, wordEl, mod, note, cta, board],
          { opacity: 0, y: 18 * k, filter: `blur(${12 * k}px)` },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: DUR.slow, ease: EASE.glass, stagger: 0.08, clearProps: 'filter,transform' },
        )
        return
      }

      /* where things are, in the hero (px) — read before anything moves.
         The word's INK box is a range's (the span is as wide as its column). */
      const hr = hero.getBoundingClientRect()
      const range = document.createRange()
      range.selectNodeContents(wordEl)
      const wr = range.getBoundingClientRect()
      const wl = wordEl.getBoundingClientRect()
      const pad = 0.55 * unit
      const box = { x: wr.left - hr.left - pad, y: wr.top - hr.top + 0.2 * unit, w: wr.width + pad * 2, h: wr.height - 0.2 * unit }
      const at = (el: Element, fx: number, fy: number) => {
        const b = el.getBoundingClientRect()
        return { x: b.left - hr.left + b.width * fx, y: b.top - hr.top + b.height * fy }
      }
      const P = { note: at(note, 0, 0), rest: at(board, 0.08, 0.9) }
      const vw = window.innerWidth
      const vh = window.innerHeight
      const aim = () =>
        aimLight((hr.left + Number(gsap.getProperty(cursor, 'x'))) / vw, (hr.top + Number(gsap.getProperty(cursor, 'y'))) / vh)

      /* the first frame */
      gsap.set(sel, { x: box.x, y: box.y, width: 0, height: box.h, opacity: 0 })
      gsap.set(cursor, { x: hr.width * 0.62, y: hr.height + 40, opacity: 0 })
      gsap.set(chip, { opacity: 0, y: 10 * k })
      gsap.set(mod, { opacity: 1, clipPath: 'inset(0 100% 0 0)' })
      gsap.set(note, { opacity: 0, scale: 0.6, transformOrigin: '0% 0%' })
      gsap.set(cta, { opacity: 0, y: 16 * k })
      gsap.set(board, { opacity: 0, scale: 0.94, y: 26 * k, filter: `blur(${10 * k}px)` })
      wordEl.style.setProperty('--rb-x', '0px')
      wordEl.style.setProperty('--w', String(W_INK))

      tl = gsap.timeline({
        onComplete: () => {
          built = true
          gsap.set(ents, { clearProps: 'transform,filter,clipPath' })
        },
      })
      tl.to(chip, { opacity: 1, y: 0, duration: 0.6, ease: EASE.glass }, 0.1)
      tl.to(board, { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)', duration: DUR.slow, ease: EASE.glass }, 0.15)
      /* the agent arrives at the word's top-left and presses */
      tl.to(cursor, { opacity: 1, duration: 0.25 }, 0.3)
      tl.to(cursor, { x: box.x, y: box.y, duration: 0.75, ease: 'power3.inOut', onUpdate: aim }, 0.3)
      tl.to(cursor, { scale: 0.86, duration: 0.09, ease: 'power2.out' }, 1.05)
      tl.to(cursor, { scale: 1, duration: 0.3, ease: EASE.settle }, 1.14)
      tl.set(sel, { opacity: 1 }, 1.1)
      /* THE MARQUEE: the box grows, the ink follows its leading edge */
      const m = { w: 0 }
      tl.to(
        m,
        {
          w: box.w,
          duration: 1.25,
          ease: 'power2.inOut',
          onUpdate: () => {
            sel.style.width = `${m.w.toFixed(1)}px`
            wordEl.style.setProperty('--rb-x', `${Math.max(0, box.x + m.w - (wl.left - hr.left)).toFixed(1)}px`)
            tag.textContent = `${Math.round(m.w)} × ${Math.round(box.h)}`
            gsap.set(cursor, { x: box.x + m.w, y: box.y + box.h * (m.w / box.w) })
            aim()
          },
        },
        1.15,
      )
      /* released: the ink settles, the chip ticks, the box lets go */
      tl.call(() => hero.classList.add('is-set', 'is-ok'), undefined, 2.45)
      tl.to(wordEl, { '--w': W_REST, duration: 1.1, ease: EASE.drift }, 2.4)
      tl.to(sel, { opacity: 0, duration: 0.35 }, 2.75)
      tl.to(mod, { clipPath: 'inset(0 0% 0 0)', duration: 0.8, ease: EASE.drift }, 2.45)
      /* the comment comes out of the cursor's tip */
      tl.to(cursor, { x: P.note.x, y: P.note.y, duration: 0.55, ease: 'power3.inOut', onUpdate: aim }, 2.5)
      tl.to(note, { opacity: 1, scale: 1, duration: 0.55, ease: EASE.settle }, 3.0)
      tl.to(cta, { opacity: 1, y: 0, duration: 0.7, ease: EASE.glass }, 3.1)
      /* it rests by the artboard */
      tl.to(cursor, { x: P.rest.x, y: P.rest.y, duration: 0.8, ease: 'power3.inOut', onUpdate: aim }, 3.25)
      tl.call(() => cursor.classList.add('is-idle'), undefined, 4.05)
      tl.timeScale(1.15)
    }

    if (typeof document.fonts?.ready?.then === 'function') document.fonts.ready.then(start)
    else start()

    /* a resize lands the pass on its last frame */
    let seenW = window.innerWidth
    const onResize = () => {
      if (window.innerWidth === seenW) return
      seenW = window.innerWidth
      tl?.progress(1)
      gsap.set([cursor, sel], { opacity: 0 })
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelled = true
      tl?.kill()
      gsap.ticker.remove(tick)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('resize', onResize)
      hero.classList.remove('is-in', 'is-set', 'is-ok')
      board.classList.remove('is-hot')
      cursor.classList.remove('is-idle')
      ;['--rb-part', '--rb-tip', '--lx', '--ly'].forEach((v) => board.style.removeProperty(v))
      wordEl.style.removeProperty('--rb-x')
      wordEl.style.removeProperty('--w')
      re?.style.removeProperty('--split')
      tag.textContent = ''
      gsap.set([wordEl, left, mod, chip, note, cta, board, sel, cursor], { clearProps: 'all' })
    }
  }, [scene])

  return (
    <header ref={ref} id="brief" className="rb" data-nav-hero="0.5">
      <div className="rb-left">
        <h1 className="rb-h1">
          <span className="rb-word">{word}</span> <span className="rb-mod rb-ent">{modifier}</span>
        </h1>

        {/* the brief's state: decoration. It stands ABOVE the h1 (CSS
            order) and AFTER it in the source — the h1 is the page's first
            words. Both labels are in the markup; the pass swaps them. */}
        <p className="rb-chip rb-ent" aria-hidden="true">
          <i className="rn-tick" />
          <span className="rb-chip-a">Brief received</span>
          <span className="rb-chip-b">Brief accepted</span>
        </p>

        {/* the tagline, as the agent's comment */}
        <p className="rb-note rb-ent">
          <span className="rb-note-who" aria-hidden="true">K</span>
          <span className="rb-note-t">{tagline}</span>
        </p>

        <div className="rb-cta rb-ent">{children}</div>
      </div>

      {/* THE ARTBOARD: the hub's scene, enlarged — decoration */}
      <div className="rb-board rb-ent" aria-hidden="true">
        <div className="rb-board-in">
          <span className="rb-board-bar">
            <i /><i /><i />
            <b>{name}</b>
          </span>
          <div className={`rb-scene rb-scene-${scene}`}>
            <ServiceScene kind={scene} />
          </div>
        </div>
      </div>

      {/* the marquee and the agent */}
      <span className="rb-sel" aria-hidden="true">
        <i /><i /><i /><i />
        <b className="rb-sel-tag" />
      </span>
      <span className="rb-cursor k-agent" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="M4 2.5l15.5 8.2-6.6 1.9-2.6 6.6z" />
        </svg>
        <b>Kona</b>
      </span>
    </header>
  )
}
