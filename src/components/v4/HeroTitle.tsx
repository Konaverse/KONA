'use client'

import { useEffect, useRef } from 'react'
import { gsap, EASE, DUR, rem } from '@/lib/motion-v4'

/**
 * THE HERO TITLE — "the breathing headline" (2026-08-19, user reference set:
 * `hero title initial state.png` → `hero rest state.png` → `hero animated
 * state 1/2.png`; feel pass the same day).
 *
 * One sentence — "Build the website that will make you stand out" — set as a
 * WRAPPING FLOW of words with three inline image pills sewn into it. The pills
 * are the animation: their widths change, the sentence re-wraps around them,
 * and words move between lines. It never repeats the same way twice.
 *
 * ── the beats ──────────────────────────────────────────────────────────────
 * `pre`  pills at zero width, the line reads as pure text (initial frame).
 * Then the pills sew in, and from there the title walks at random through six
 * COMPOSITIONS — six different, hand-solved ways this sentence can break
 * around three pills. Each hold is 2.6-4.4s, the order is a shuffled bag (no
 * repeats), and every pill takes a small random width jitter on top. Same
 * instrument, never the same phrase.
 *
 * ── why it does not look like a reflow ─────────────────────────────────────
 * A raw width tween re-wraps mid-flight and a word SNAPS a whole line down. So
 * every beat runs as a FLIP: measure where everything is, apply the new
 * widths, measure where the new layout puts them, freeze the flow to absolute
 * boxes, then fly each piece from its old box to the new one. The break
 * happens once, invisibly, inside the freeze.
 *
 * And the flight is choreographed, not parallel (the user's note: "make the
 * first word go down and the second, if it should go down, go down after it"):
 *  · movers leave in reading order, one after another
 *  · a mover going LEFT (to the head of the next line) leaves VERTICALLY
 *    first, so it never crosses back over the words it sat behind
 *  · a mover going RIGHT leaves HORIZONTALLY first, into the emptying tail of
 *    its own line, and lifts or lands at the end
 *  · either way the two axes overlap in the middle, so the word arcs to its
 *    new line instead of cutting a diagonal, and it dips, shrinks and blurs on
 *    the way — a word in transit, not a box being repositioned
 *  · everything that KEEPS its line moves in lockstep, one ease, one duration
 *
 * ── the pills as material ──────────────────────────────────────────────────
 * The image inside a pill is a FIXED-WIDTH plate, not a cover-fit crop: when
 * the pill grows it UNVEILS more picture instead of un-squashing it, so the
 * pill reads as an aperture opening. A specular glint runs the length of one
 * as it resizes, film grain sits over the top, and the moody-blue stand-in art
 * is graded pale so three pills do not punch three holes in a white page.
 *
 * The flow is a flex-wrap row, not a text block, so a) each word is its own
 * measurable box and b) the pre state's line breaks can be forced with
 * full-width zero-height spacers (.hw-br) that only exist while `is-pre`.
 *
 * The headline's font-size is CONTAINER-relative (cqi off .hw-comp), not
 * viewport-relative: the compositions are solved in `em`, so the type and its
 * box must scale together or every break drifts at another width.
 *
 * SEO: every word is real text in the served HTML (see project_seo_constraints).
 * No-JS holds the resting composition; reduced motion holds it too, no loop.
 */

type PillKey = 'a' | 'b' | 'c'
type Voice = 'grey' | 'ink' | 'key'
type Slot =
  | { word: string; voice: Voice }
  | { pill: PillKey }
  | { br: true }

/** The sentence, in flow order. `br` marks where the PRE state forces its
 *  break — the same breaks the resting composition falls into naturally. */
const FLOW: Slot[] = [
  { word: 'Build', voice: 'grey' },
  { word: 'the', voice: 'grey' },
  { pill: 'a' },
  { word: 'website', voice: 'grey' },
  { word: 'that', voice: 'key' },
  { br: true },
  { word: 'will', voice: 'grey' },
  { pill: 'b' },
  { word: 'make', voice: 'grey' },
  { br: true },
  { word: 'you', voice: 'ink' },
  { word: 'stand', voice: 'ink' },
  { word: 'out', voice: 'ink' },
  { pill: 'c' },
]

/** PLACEHOLDER art (user: "use whatever images you want") — the same
 *  moody-blue stand-in set §5 uses, lifted (not bleached) so the pills stay in
 *  the same palette as the window behind them. Picked for silhouette at pill
 *  height, and none of them is the hero portrait: a misty skyline,
 *  a lit corridor, an arcade of light shafts. `x` slides each plate
 *  to the stretch of picture that pill should open on, and must satisfy
 *  |x| + that pill's widest composition <= 13em (see .hw-pill img). */
const ART: Record<PillKey, { src: string; x: string }> = {
  a: { src: '/work/fog.webp', x: '-0.2em' },
  b: { src: '/work/corridor.webp', x: '-3.1em' },
  c: { src: '/work/orb.webp', x: '-0.6em' },
}

type Widths = Record<PillKey, number>
type Comp = {
  id: string
  /** pill widths, in `em` of the headline */
  w: Widths
  /** index in FLOW's item list of the first piece on each of the three lines —
   *  the runtime checks the real layout against this before anything flies */
  rows: [number, number, number]
}

/**
 * THE SIX COMPOSITIONS. Each was solved against .hw-headline's 15em box and
 * Manrope's measured word widths: every line fits, and the next word provably
 * does not. Item indices: 0 Build · 1 the · 2 [a] · 3 website · 4 that ·
 * 5 will · 6 [b] · 7 make · 8 you · 9 stand · 10 out · 11 [c].
 *
 * Change a width and you change where the sentence breaks. Retune by measuring
 * the word widths in em against the 15em box before touching these.
 */
const COMPS: Comp[] = [
  // Build the [a] website that / will [b] make / you stand out [c]
  { id: 'home', w: { a: 4.4, b: 9.9, c: 7.2 }, rows: [0, 5, 8] },
  // Build the [a] / website that will [b] make / you stand out [c]
  { id: 'wide-a', w: { a: 10.2, b: 4.3, c: 7.2 }, rows: [0, 3, 8] },
  // Build the [a] website that / will [b] make you stand / out [c]
  { id: 'wide-c', w: { a: 4.4, b: 5.5, c: 12.4 }, rows: [0, 5, 10] },
  // Build the [a] website that will / [b] make you / stand out [c]
  { id: 'lead-b', w: { a: 2.6, b: 9.4, c: 7.6 }, rows: [0, 6, 9] },
  // Build the [a] / website that will [b] make you / stand out [c]
  { id: 'long-mid', w: { a: 9.0, b: 2.9, c: 8.2 }, rows: [0, 3, 9] },
  // Build the [a] website / that will [b] make you / stand out [c]
  { id: 'mid-a', w: { a: 6.3, b: 5.6, c: 8.2 }, rows: [0, 4, 9] },
]
const HOME = COMPS[0]

/** gap between flow items, kept in sync with .hw-w's margin-right */
const GAP = '0.26em'
/** when the pills sew in — ONCE THE TEXT IS STILL (user 2026-08-20, third
 *  pass): the word arrival settles at ~0.94s, and the boxes grow the beat
 *  after. Sequenced, never overlapped — the text lands, then it is pushed.
 *  (The original 2.0 hold read as the page taking its time.) */
const SEW = 1.1
/** dwell on a composition before the next one, randomised per beat */
const HOLD_MIN = 2600
const HOLD_MAX = 4400
/** the lockstep group starts a beat after the departing words, so a pill
 *  growing into a vacated slot never catches the word leaving it */
const LOCK = 0.1
/** how far a pill may drift off its solved width. Small enough that the
 *  compositions hold, and the layout is verified anyway before anything flies. */
const JITTER = 0.3
/** THE PHONE (2026-08-26, user: the pills' animation is "too laggy").
 *  The six compositions are solved for the desktop's 15em box; a 390px
 *  phone gives the flow ~9.7em at the same h1, so a 9.9em pill was capped
 *  at the line and every beat re-broke the whole sentence across five or
 *  six lines — the most layout a beat can do. On phones the widths are
 *  scaled down so the pills read as inline thumbnails and a beat moves a
 *  word or two, and the movers drop their blur (a text raster per frame
 *  on a phone GPU is the other half of the stutter). Row verification is
 *  skipped: the desktop `rows` cannot match a different box, and the FLIP
 *  is correct for any break. */
const PHONE = '(max-width: 57.5rem)'
const PHONE_SCALE = 0.5

export default function HeroTitle() {
  const rootRef = useRef<HTMLHeadingElement | null>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const flow = root.querySelector<HTMLElement>('.hw-flow')
    if (!flow) return

    const items = Array.from(flow.querySelectorAll<HTMLElement>('.hw-it'))
    const words = items.filter((el) => el.classList.contains('hw-w'))
    const pills = {} as Record<PillKey, HTMLElement>
    ;(['a', 'b', 'c'] as PillKey[]).forEach((k) => {
      const el = flow.querySelector<HTMLElement>(`[data-pill="${k}"]`)
      if (el) pills[k] = el
    })
    const pillEls = Object.values(pills)

    /* the one place widths are written — the margin rides with the width so a
       collapsed pill does not leave a double space behind */
    const setWidths = (w: Widths) => {
      ;(Object.keys(pills) as PillKey[]).forEach((k) => {
        pills[k].style.width = `${w[k]}em`
        pills[k].style.marginRight = w[k] > 0 ? GAP : '0px'
      })
    }

    const phone = window.matchMedia(PHONE).matches
    const scaled = (w: Widths): Widths =>
      phone ? { a: w.a * PHONE_SCALE, b: w.b * PHONE_SCALE, c: w.c * PHONE_SCALE } : w

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      flow.classList.remove('is-pre')
      setWidths(scaled(HOME.w))
      gsap.set(items, { opacity: 1, y: 0, filter: 'none' })
      return
    }

    let live = true
    let comp = HOME

    /** which of the three lines each item is on, read off the live layout */
    const readRows = () => {
      const tops: number[] = []
      return items.map((el) => {
        const r = el.getBoundingClientRect()
        const mid = (r.top + r.bottom) / 2
        let row = tops.findIndex((t) => Math.abs(t - mid) < 12 * rem())
        if (row < 0) row = tops.push(mid) - 1
        return row
      })
    }
    /** does the live layout actually break where this composition says? */
    const matches = (c: Comp, rows: number[]) =>
      rows.every((row, i) => row === (i < c.rows[1] ? 0 : i < c.rows[2] ? 1 : 2))

    /** jittered widths, but only if the sentence still breaks as designed */
    const applyComp = (c: Comp) => {
      const w = scaled(c.w)
      const j = (n: number) => +(n + (Math.random() - 0.5) * JITTER * (phone ? PHONE_SCALE : 1)).toFixed(3)
      setWidths({ a: j(w.a), b: j(w.b), c: j(w.c) })
      if (!phone && !matches(c, readRows())) setWidths(w)
    }

    /**
     * ONE BEAT, AS A FLIP. `apply` mutates the layout; everything either side
     * of it is measurement and flight.
     */
    let running: gsap.core.Timeline | null = null
    const morph = (apply: () => void, opts: { sew?: boolean } = {}) => {
      /* NEVER MEASURE A FROZEN FLOW. While a beat is in flight the items are
         absolute and mid-transform, so reading rects then would give the next
         beat garbage to fly from. If one is still running, land it first. */
      if (running) running.progress(1).kill()

      const first = items.map((el) => el.getBoundingClientRect())
      const firstRows = readRows()
      apply()
      const base = flow.getBoundingClientRect()
      const last = items.map((el) => el.getBoundingClientRect())
      const lastRows = readRows()

      // freeze: children go absolute, so the re-wrap that just happened is
      // invisible and each piece can be flown from where it used to be
      flow.style.height = `${flow.offsetHeight}px`
      flow.classList.add('is-flip')

      /* the ENTRANCE beat plays at cinema length — the first expansion is
         the page introducing itself and gets the extra air (user, third
         pass: "smoother and slower"); the ongoing walk keeps DUR.slow */
      const D = opts.sew ? DUR.cinema : DUR.slow
      const tl = gsap.timeline()

      /* TWO GROUPS, AND THE REASON THEY ARE SEPARATE.
       *
       * Everything that KEEPS its line — the words sliding along and every
       * pill resizing under them — moves on ONE start time, ONE duration, ONE
       * ease. That is not tidiness: identical timing means every intermediate
       * frame is itself a valid layout, so a word can never be overrun by the
       * pill it sits next to. Stagger this group and words collide (they did,
       * on the first pass).
       *
       * Only the words CHANGING line get the cascade the user asked for. They
       * are the ones with somewhere to go, and they leave FIRST so the pill
       * growing behind them never catches up. */
      let order = 0
      items.forEach((el, i) => {
        const f = first[i]
        const l = last[i]
        const x0 = f.left - base.left
        const y0 = f.top - base.top
        const x1 = l.left - base.left
        const y1 = l.top - base.top
        const drop = lastRows[i] > firstRows[i]
        const rise = lastRows[i] < firstRows[i]

        gsap.set(el, { x: x0, y: y0, width: f.width, height: f.height })

        if (drop || rise) {
          // the cascade: movers leave in reading order, one behind the other
          const at = order++ * 0.07

          /* WHICH AXIS LEADS. A word changing line never travels straight —
           * it leaves along the axis that is not blocked by its own line.
           *  · going LEFT (the usual drop, to the head of the next line) means
           *    crossing back over every word before it, so it goes VERTICAL
           *    first: out of the line, into the gutter, then across.
           *  · going RIGHT (climbing to the tail of the line above, or landing
           *    late in the next one) has an emptying line ahead of it, so it
           *    goes HORIZONTAL first and lifts at the end.
           * Either way the two axes overlap in the middle, which curves the
           * path — a word arcs to its new line instead of cutting a diagonal. */
          if (x1 < x0) {
            tl.to(el, { y: y1, duration: D * 0.8, ease: EASE.settle }, at)
            tl.to(el, { x: x1, duration: D * 0.88, ease: EASE.settle }, at + 0.16)
          } else {
            tl.to(el, { x: x1, duration: D * 0.88, ease: EASE.settle }, at)
            tl.to(el, { y: y1, duration: D * 0.8, ease: EASE.settle }, at + 0.16)
          }

          // and it goes soft on the way. A word crossing a line it does not
          // belong to yet should read as a ghost passing through, not as two
          // words colliding — so it dips, shrinks and blurs at the midpoint.
          tl.to(
            el,
            {
              keyframes: phone
                ? { scale: [1, 0.94, 1], opacity: [1, 0.38, 1] }
                : {
                    scale: [1, 0.94, 1],
                    opacity: [1, 0.38, 1],
                    filter: ['blur(0px)', 'blur(2px)', 'blur(0px)'],
                  },
              duration: D * 0.98,
              ease: 'none',
            },
            at,
          )
          return
        }

        // the lockstep group
        if (Math.abs(l.width - f.width) > 0.5) {
          tl.to(el, { width: l.width, duration: D, ease: EASE.settle }, LOCK)
        }
        if (Math.abs(x1 - x0) > 0.5 || Math.abs(y1 - y0) > 0.5) {
          tl.to(el, { x: x1, y: y1, duration: D, ease: EASE.settle }, LOCK)
        }
      })

      // the glint: light runs the length of a pill that just changed size
      pillEls.forEach((el) => {
        const i = items.indexOf(el)
        if (Math.abs(last[i].width - first[i].width) < 6) return
        const g = el.querySelector<HTMLElement>('.hw-glint')
        if (!g) return
        tl.fromTo(
          g,
          { xPercent: -130, opacity: 0.9 },
          { xPercent: 130, opacity: 0, duration: D * 1.15, ease: EASE.drift },
          0.05,
        )
      })

      if (opts.sew) {
        /* the pills arrive by WIDTH alone — full opacity from the first
           pixel, so they visibly EXPAND out of nothing and push the words
           aside (user 2026-08-20: the old fade-in read as appearing from
           nowhere, not as growing). The FLIP's lockstep width tween is the
           whole entrance. */
        gsap.set(pillEls, { opacity: 1 })
      }

      running = tl
      tl.eventCallback('onComplete', () => {
        running = null
        flow.classList.remove('is-flip')
        flow.style.height = ''
        gsap.set(items, { clearProps: 'transform,width,height,opacity' })
        // clearProps wiped the pills' widths along with everything else
        pillEls.forEach((el) => {
          el.style.width = `${last[items.indexOf(el)].width}px`
          el.style.marginRight = GAP
        })
      })
      return tl
    }

    // ---- entrance: the words arrive as pure text, then the pills sew in.
    // The arrival keeps its quick spirit but breathes (user, third pass:
    // "like now but smoother"): a longer rise and a real stagger, settled
    // by ~0.94s — just inside SEW, so the boxes only ever push still text.
    // PAUSED until the peel's cover is up (the opening gate, 2026-08-24):
    // the words live UNDER the full-page sheet, and the sew this timeline
    // fires is what launches the container's carve — one clock, from arm. ----
    const intro = gsap.timeline({ paused: true })
    intro.fromTo(
      words,
      { yPercent: 70, filter: 'blur(12px)', opacity: 0 },
      {
        yPercent: 0,
        filter: 'blur(0px)',
        opacity: 1,
        duration: 0.7,
        ease: EASE.glass,
        stagger: 0.03,
      },
      0,
    )
    intro.add(() => {
      if (!live) return
      /* the sew starts flush with the arrival's tail — land any still-flying
         word first, or the FLIP below would measure a mid-tween rect. Opacity
         clears too: a killed word must not keep a stale inline 0.x (the CSS
         resting state is 1 once is-pre goes). */
      gsap.killTweensOf(words)
      gsap.set(items, { clearProps: 'transform,filter,opacity' })
      comp = HOME
      /* the CLOCK SIGNAL (2026-08-24, user): the container's opening carve
         (HeroPeel's uMorph) launches on this event, same duration, same
         ease — the boxes expanding and the sheet giving way are one motion,
         so the pills read as PUSHING the container into its shape */
      window.dispatchEvent(new Event('k-hero-sew'))
      morph(
        () => {
          flow.classList.remove('is-pre')
          applyComp(HOME)
        },
        { sew: true },
      )
    }, SEW)

    // ---- the walk: a shuffled bag of compositions, never twice in a row ----
    let bag: Comp[] = []
    const pick = (): Comp => {
      if (!bag.length) {
        bag = COMPS.slice()
        for (let j = bag.length - 1; j > 0; j--) {
          const k = Math.floor(Math.random() * (j + 1))
          ;[bag[j], bag[k]] = [bag[k], bag[j]]
        }
        if (bag[0] === comp && bag.length > 1) [bag[0], bag[1]] = [bag[1], bag[0]]
      }
      return bag.shift()!
    }

    let timer: ReturnType<typeof setTimeout> | null = null
    let onScreen = true
    const tick = () => {
      if (!live) return
      timer = setTimeout(tick, HOLD_MIN + Math.random() * (HOLD_MAX - HOLD_MIN))
      if (!onScreen) return
      comp = pick()
      morph(() => applyComp(comp))
    }

    /* the opening gate: everything above waits for the peel's cover
       ('k-peel-armed'), with a timeout fallback for the no-GL paths —
       no WebGL, a failed video — where the headline must still
       arrive on its own clock */
    let begun = false
    const begin = () => {
      if (begun || !live) return
      begun = true
      intro.play()
      timer = setTimeout(tick, SEW * 1000 + HOLD_MIN)
    }
    window.addEventListener('k-peel-armed', begin, { once: true })
    const fallback = setTimeout(begin, 1200)

    // a headline that re-lays-out every few seconds forever is not free — it
    // holds still while it is off screen
    const io =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver(([e]) => {
            onScreen = e.isIntersecting
          })
    io?.observe(root)

    return () => {
      live = false
      window.removeEventListener('k-peel-armed', begin)
      clearTimeout(fallback)
      if (timer) clearTimeout(timer)
      io?.disconnect()
      intro.kill()
      running?.kill()
      gsap.killTweensOf(items)
    }
  }, [])

  return (
    <h1
      ref={rootRef}
      className="hw-headline"
      aria-label="Build the website that will make you stand out"
    >
      {/* Three voices, user-directed: the sentence in light grey, "that" in
          ink semibold, "you stand out" in ink. */}
      <span className="hw-flow is-pre" aria-hidden="true">
        {FLOW.map((slot, n) => {
          if ('br' in slot) return <i key={n} className="hw-br" />
          if ('pill' in slot) {
            const art = ART[slot.pill]
            return (
              <span
                key={n}
                className="hw-it hw-pill"
                data-pill={slot.pill}
                style={{
                  ['--pw-rest' as string]: `${HOME.w[slot.pill]}em`,
                  ['--iox' as string]: art.x,
                }}
              >
                {/* a fixed-width plate, not a cover crop: the pill UNVEILS
                    picture as it grows instead of un-squashing it */}
                <img src={art.src} alt="" loading="eager" />
                <i className="hw-glint" />
              </span>
            )
          }
          return (
            <span key={n} className={`hw-it hw-w hw-${slot.voice}`}>
              {slot.word}
            </span>
          )
        })}
      </span>

      <noscript>
        <style>{`
          .hw-flow.is-pre .hw-br{display:none!important}
          .hw-flow.is-pre .hw-pill{width:var(--pw-rest)!important;margin-right:${GAP}!important;opacity:1!important}
          .hw-flow .hw-it{opacity:1!important;transform:none!important;filter:none!important}
        `}</style>
      </noscript>
    </h1>
  )
}
