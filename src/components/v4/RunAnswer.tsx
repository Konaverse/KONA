'use client'

import { Fragment, useEffect, useRef } from 'react'
import { gsap, EASE } from '@/lib/motion-v4'
import { aimLight } from '@/lib/run-store'

/**
 * THE RUN · 2 — THE ANSWER, COMPUTED (service pages, 2026-09-17; the
 * brief: "the direct answer reads as prose while the three facts are
 * DERIVED beside it, each settling as its sentence passes… every
 * readout on screen must be a true fact from the page's data").
 *
 * SECOND CUT, the same day. The first had three paper cards and a
 * hairline drawn from each phrase to its card; the user: "we have
 * abandoned imagery completely and I don't like it… purposeful imagery,
 * incorporated on scroll (maybe stacked images…) — I don't like the
 * lines in the answer section that connect to the cards". The lines are
 * gone and the facts are PICTURES now.
 *
 * THE PICTURE (run.css `.ra`). A pinned stage on the light. Left, the
 * direct answer set large, its second paragraph smaller under it.
 * Right, THE DECK: an empty slot, and three plates waiting under the
 * fold — the studio's own work on screens (`deck` in the data), each
 * carrying one fact as its caption: the label, the number, its gauge,
 * its tick.
 *
 * THE READ-HEAD. The scroll reads the answer: words go from grey to ink
 * as the head passes them (a class per word, CSS softens the edge).
 * When the head clears a phrase that CARRIES a number — a fact's `cue`,
 * found in the prose on the server and wrapped in a <mark> — the agent
 * plucks it: the phrase takes a selection box, Kona's cursor presses on
 * it and crosses to the deck, and that fact's PLATE LANDS: it comes up
 * from under the fold turned a few degrees and settles flat on the
 * slot, its print easing back from a close-up, while the plates already
 * down step up and back behind it — a stack whose caption strips stay
 * readable. On the landed plate the number COMPUTES: digits roll in on
 * reels (the reel's other digits are a CSS pseudo-element — the markup
 * holds only the true value), the gauge draws (a range "4–6" is a bar
 * to the low number, hatched to the high), the tick closes. It reads
 * the same backwards: scroll up past the phrase and the plate goes back
 * under the fold. A fact with no cue lands on an even beat, no pluck.
 * The read is on the glide; the landing and the roll are TIMED (a reel
 * tied to the wheel reads as a broken counter).
 *
 * THE DRIVER. gsap.ticker + one rect per frame; the pluck's places are
 * offsets, measured on resize. Written: classes, one custom property a
 * plate (its depth in the stack), the cursor's transform. Hidden states
 * live under `.is-live`, which only this driver sets: no JS and reduced
 * motion get the answer in ink and the three plates in a column,
 * resolved. Phones: unpinned, the plates under the prose landing as the
 * section crosses; no cursor. Every word is server-rendered.
 */

export type RunFact = { value: string; label: string; cue?: string; plate: string }

/** the head's run inside the pin's progress */
const READ_FROM = 0.04
const READ_TO = 0.8
/** the glide's time constant, in seconds */
const GLIDE = 0.16
/** the uncued facts land AFTER the last plucked one, spread evenly over
 *  what is left of the read — never sooner than this share of it */
const BEAT_FROM = 0.6
/** the pluck — seconds: the cursor's crossing; then, from the landing,
 *  when the digits roll and when the tick closes */
const CROSS = 0.7
const LAND_AT = 0.3
const ROLL_AT = 0.55
const DONE_AT = 1.7

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)

type Seg = { text: string; fact?: number }

/** cut the two paragraphs at the facts' cues (first occurrence wins) */
function cut(answer: readonly string[], facts: readonly RunFact[]): Seg[][] {
  const taken = new Set<number>()
  return answer.map((para) => {
    const hits: { at: number; len: number; fact: number }[] = []
    facts.forEach((f, i) => {
      if (!f.cue || taken.has(i)) return
      const at = para.indexOf(f.cue)
      if (at < 0 || hits.some((h) => at < h.at + h.len && h.at < at + f.cue!.length)) return
      taken.add(i)
      hits.push({ at, len: f.cue.length, fact: i })
    })
    hits.sort((a, b) => a.at - b.at)
    const segs: Seg[] = []
    let pos = 0
    hits.forEach((h) => {
      if (h.at > pos) segs.push({ text: para.slice(pos, h.at) })
      segs.push({ text: para.slice(h.at, h.at + h.len), fact: h.fact })
      pos = h.at + h.len
    })
    if (pos < para.length) segs.push({ text: para.slice(pos) })
    return segs
  })
}

const Words = ({ text }: { text: string }) => (
  <>
    {text.split(/(\s+)/).map((t, i) =>
      t.trim() === '' ? <Fragment key={i}>{t}</Fragment> : <span key={i} className="ra-w">{t}</span>,
    )}
  </>
)

/** the value, its digits on reels */
const Value = ({ value }: { value: string }) => {
  let j = 0
  return (
    <>
      {Array.from(value).map((ch, i) =>
        /\d/.test(ch) ? (
          <span key={i} className="ra-d" style={{ '--j': j++ } as React.CSSProperties}>
            <span className="ra-d-in">{ch}</span>
          </span>
        ) : (
          <Fragment key={i}>{ch}</Fragment>
        ),
      )}
    </>
  )
}

export default function RunAnswer({ answer, facts }: { answer: readonly string[]; facts: readonly RunFact[] }) {
  const ref = useRef<HTMLElement | null>(null)
  const paras = cut(answer, facts)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const phone = window.matchMedia('(max-width: 57.5rem)').matches
    const stage = root.querySelector<HTMLElement>('.ra-stage')!
    const deck = root.querySelector<HTMLElement>('.ra-deck')!
    const words = Array.from(root.querySelectorAll<HTMLElement>('.ra-w'))
    const cursor = root.querySelector<HTMLElement>('.ra-cursor')!
    const N = words.length

    const items = Array.from(root.querySelectorAll<HTMLElement>('.ra-fact')).map((card, i) => {
      const mark = root.querySelector<HTMLElement>(`.ra-cue[data-f="${i}"]`)
      const mw = mark ? Array.from(mark.querySelectorAll<HTMLElement>('.ra-w')) : []
      return {
        card,
        mark,
        /* the head must CLEAR the phrase */
        trig: mw.length ? words.indexOf(mw[mw.length - 1]) + 1 : -1,
        last: mw[mw.length - 1] as HTMLElement | undefined,
        on: false,
        /* when it landed: the stack's order */
        at: 0,
        from: { x: 0, y: 0 },
        calls: [] as gsap.core.Tween[],
        tl: null as gsap.core.Timeline | null,
      }
    })
    /* the uncued land on an even beat, after the plucked ones */
    const from = Math.max(N * BEAT_FROM, ...items.map((it) => it.trig))
    const loose = items.filter((it) => it.trig < 0)
    loose.forEach((it, k) => {
      it.trig = Math.round(from + ((N - from) * (k + 1)) / (loose.length + 1))
    })

    root.classList.add('is-live')

    /* offsets, up to the stage */
    const off = (el: HTMLElement) => {
      let x = 0
      let y = 0
      let n: HTMLElement | null = el
      while (n && n !== stage) {
        x += n.offsetLeft
        y += n.offsetTop
        n = n.offsetParent as HTMLElement | null
      }
      return { x, y }
    }
    let SH = 1
    let deckAt = { x: 0, y: 0 }
    const measure = () => {
      SH = stage.offsetHeight || 1
      const d = off(deck)
      deckAt = { x: d.x + deck.offsetWidth * 0.2, y: d.y + deck.offsetHeight * 0.66 }
      items.forEach((it) => {
        if (!it.last) return
        const w = off(it.last)
        it.from = { x: w.x + it.last.offsetWidth * 0.5, y: w.y + it.last.offsetHeight * 0.7 }
      })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(stage)

    /* THE STACK: a plate's depth is how many landed after it */
    let clock = 0
    const restack = () => {
      const down = items.filter((it) => it.on).sort((a, b) => a.at - b.at)
      down.forEach((it, i) => it.card.style.setProperty('--k', String(down.length - 1 - i)))
      deck.classList.toggle('has-plate', down.length > 0)
    }

    /* THE PLUCK */
    let lit: (typeof items)[number] | null = null
    const compute = (it: (typeof items)[number]) => {
      it.on = true
      it.at = ++clock
      lit = it
      it.mark?.classList.add('is-hot')
      const plucked = !!it.mark && !phone
      const t0 = plucked ? LAND_AT : 0.02
      if (plucked) {
        /* the agent presses on the phrase and crosses to the deck */
        it.tl = gsap.timeline()
        it.tl.set(cursor, { x: it.from.x, y: it.from.y, opacity: 1, scale: 1 }, 0)
        it.tl.to(cursor, { scale: 0.86, duration: 0.09, ease: 'power2.out' }, 0.05)
        it.tl.to(cursor, { scale: 1, duration: 0.3, ease: EASE.settle }, 0.14)
        it.tl.to(cursor, { x: deckAt.x, y: deckAt.y, duration: CROSS, ease: 'power3.inOut' }, 0.2)
        it.tl.to(cursor, { opacity: 0, duration: 0.4 }, t0 + DONE_AT)
      }
      it.calls.push(
        gsap.delayedCall(t0, () => {
          it.card.classList.add('is-down')
          restack()
        }),
        gsap.delayedCall(t0 + ROLL_AT, () => it.card.classList.add('is-run')),
        gsap.delayedCall(t0 + DONE_AT, () => {
          it.card.classList.add('is-done')
          it.mark?.classList.add('is-kept')
          if (lit === it) lit = null
        }),
      )
    }
    const reset = (it: (typeof items)[number]) => {
      it.on = false
      if (lit === it) lit = null
      it.calls.forEach((c) => c.kill())
      it.calls = []
      it.tl?.kill()
      it.tl = null
      it.mark?.classList.remove('is-hot', 'is-kept')
      it.card.classList.remove('is-down', 'is-run', 'is-done')
      restack()
      gsap.to(cursor, { opacity: 0, duration: 0.2 })
    }

    let p = -1
    let readTo = 0
    const tick = (_t?: number, deltaTime?: number) => {
      const r = root.getBoundingClientRect()
      const vh = window.innerHeight
      if (r.bottom < -vh * 0.2 || r.top > vh * 1.2) return
      const want = phone ? clamp01((vh * 0.8 - r.top) / (r.height * 0.95)) : clamp01(-r.top / Math.max(1, r.height - vh))
      const f = 1 - Math.exp(-((deltaTime ?? 16.7) / 1000) / GLIDE)
      p = p < 0 || Math.abs(want - p) < 0.0004 ? want : p + (want - p) * f
      const head = Math.round(clamp01((p - READ_FROM) / (READ_TO - READ_FROM)) * N)
      if (head !== readTo) {
        const lo = Math.min(head, readTo)
        const hi = Math.max(head, readTo)
        for (let i = lo; i < hi; i++) words[i].classList.toggle('is-read', head > readTo)
        readTo = head
      }
      items.forEach((it) => {
        if (!it.on && head >= it.trig) compute(it)
        else if (it.on && head < it.trig - 1) reset(it)
      })
      /* the light: on the deck while a plate lands, else with the head
         down the prose */
      if (!phone && r.top < vh * 0.5 && r.bottom > vh * 0.5) {
        if (lit) aimLight(0.78, (deckAt.y / SH) * 0.85)
        else aimLight(0.3, 0.25 + 0.4 * (head / Math.max(1, N)))
      }
    }
    tick()
    gsap.ticker.add(tick)

    return () => {
      gsap.ticker.remove(tick)
      ro.disconnect()
      items.forEach((it) => {
        it.calls.forEach((c) => c.kill())
        it.tl?.kill()
        it.mark?.classList.remove('is-hot', 'is-kept')
        it.card.classList.remove('is-down', 'is-run', 'is-done')
        it.card.style.removeProperty('--k')
      })
      deck.classList.remove('has-plate')
      gsap.killTweensOf(cursor)
      gsap.set(cursor, { clearProps: 'all' })
      words.forEach((w) => w.classList.remove('is-read'))
      root.classList.remove('is-live')
    }
  }, [answer, facts])

  return (
    <section ref={ref} id="answer" className="ra" aria-label="The short answer">
      <div className="ra-stage">
        <div className="ra-prose">
          {paras.map((segs, pi) => (
            <p key={pi} className={`ra-p ra-p${pi + 1}`}>
              {segs.map((s, si) =>
                s.fact != null ? (
                  <mark key={si} className="ra-cue" data-f={s.fact}>
                    <Words text={s.text} />
                  </mark>
                ) : (
                  <Words key={si} text={s.text} />
                ),
              )}
            </p>
          ))}
        </div>

        {/* THE DECK: a plate a fact. The picture is decoration (alt "");
            the caption is the fact. */}
        <ul className="ra-deck" aria-label="At a glance">
          {facts.map((f) => {
            const m = f.value.match(/(\d+)\s*[–-]\s*(\d+)/)
            return (
              <li key={f.label} className="ra-fact">
                <span className="ra-img">
                  <img src={f.plate} alt="" loading="lazy" decoding="async" draggable={false} />
                </span>
                <span className="ra-cap">
                  <span className="ra-label">{f.label}</span>
                  <i className="rn-tick ra-tick" aria-hidden="true" />
                  <span className="ra-val">
                    <Value value={f.value} />
                  </span>
                  {/* the gauge: a range is a bar to the low number, hatched
                      to the high; anything else, a rule that draws */}
                  <span
                    className={`ra-gauge${m ? ' is-range' : ''}`}
                    style={m ? ({ '--lo': Number(m[1]) / Number(m[2]) } as React.CSSProperties) : undefined}
                    aria-hidden="true"
                  >
                    <i /><i />
                  </span>
                </span>
              </li>
            )
          })}
        </ul>

        {/* the agent: decoration */}
        <span className="ra-cursor k-agent" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M4 2.5l15.5 8.2-6.6 1.9-2.6 6.6z" />
          </svg>
          <b>Kona</b>
        </span>
      </div>
    </section>
  )
}
