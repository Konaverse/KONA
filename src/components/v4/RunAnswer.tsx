'use client'

import { Fragment, useEffect, useRef } from 'react'
import { gsap } from '@/lib/motion-v4'
import { responsive } from '@/lib/img'

/**
 * THE RUN · 2 — THE STATEMENT, AND THE THREE CARDS (service pages;
 * THIRD CUT 2026-09-30, on the hero's paper ground — RunGround).
 *
 * THE BRIEF (the user): "the next section to be a statement" — the
 * direct answer's first paragraph, laid out after their reference: a
 * small label at the top left, the paragraph set large with its first
 * line indented, the key phrases picked out, a thin arc drawn through
 * the text. The second paragraph is CUT from the page. Under it the
 * three fact cards "just like they are (same cards, same animations),
 * but not one on top of another… a little smaller, so all 3 can fit in
 * the width… sequentially from left to right".
 *
 * (The second cut — a read-head that plucked each cue with Kona's cursor
 * and landed its plate on a STACK beside the prose — is in git history;
 * the stack and the cursor are gone, the plates and their landing stay.)
 *
 * THE STATEMENT (run.css `.ra-say`). Words go from grey to ink as the
 * section crosses the screen (a class per word). The phrases that carry
 * a fact's number — its `cue`, found in the prose on the server and
 * wrapped in a <mark> — are the reference's picked-out words: heavier,
 * with a ringed dot after them.
 *
 * THE CARDS (`.ra-deck`, a row of three). Each is the same plate: the
 * studio's work on a screen, mono, the fact as its caption — label,
 * number, gauge, tick. A card LANDS when it comes on screen, never
 * sooner than STAGGER after the one to its left: it rises turned a few
 * degrees and settles flat, its print easing back from a close-up; then
 * the number COMPUTES (digits roll on reels — the reel's other digits
 * are a CSS pseudo-element, the markup holds only the true value), the
 * gauge draws, the tick closes. NO EXIT (2026-10-01, user: "no exit
 * animation for the 3 cards"): landed, they stay, and scroll away with
 * the page (the shared parting, data-lift, stays off this row too). A
 * card that falls back below the fold resets and lands again.
 *
 * THE DRIVER. gsap.ticker + one rect a card. Written: classes only.
 * Hidden states live under `.is-live`, which only this driver sets: no
 * JS and reduced motion read the statement in ink and the three cards
 * resolved. Every word is server-rendered.
 */

export type RunFact = { value: string; label: string; cue?: string; plate: string }

/** the read's run over the section's crossing */
const READ_FROM = 0.02
const READ_TO = 0.62
/** the glide's time constant, in seconds */
const GLIDE = 0.16
/** a card lands when its top is this far up the screen (share of vh) */
const LAND_LINE = 0.86
/** the gap between two landings, left to right, in seconds */
const STAGGER = 0.42
/** from the landing: when the digits roll and when the tick closes */
const ROLL_AT = 0.55
const DONE_AT = 1.7

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)

type Seg = { text: string; fact?: number }

/** cut the paragraph at the facts' cues (first occurrence wins) */
function cut(para: string, facts: readonly RunFact[]): Seg[] {
  const hits: { at: number; len: number; fact: number }[] = []
  facts.forEach((f, i) => {
    if (!f.cue) return
    const at = para.indexOf(f.cue)
    if (at < 0 || hits.some((h) => at < h.at + h.len && h.at < at + f.cue!.length)) return
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

export default function RunAnswer({
  label,
  answer,
  facts,
}: {
  /** the small label at the statement's top left */
  label: string
  /** the statement: the direct answer's first paragraph */
  answer: string
  facts: readonly RunFact[]
}) {
  const ref = useRef<HTMLElement | null>(null)
  const segs = cut(answer, facts)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const say = root.querySelector<HTMLElement>('.ra-say')!
    const words = Array.from(root.querySelectorAll<HTMLElement>('.ra-w'))
    const N = words.length
    const cards = Array.from(root.querySelectorAll<HTMLElement>('.ra-fact')).map((card) => ({
      card,
      /* where the card is headed: parked under the fold, or landed */
      want: 'wait' as 'wait' | 'in',
      rolled: false,
      calls: [] as gsap.core.Tween[],
    }))

    root.classList.add('is-live')

    /* ONE queue for the arrivals: each waits STAGGER after the last, so
       the row lands left to right */
    let last = -Infinity
    const go = (it: (typeof cards)[number]) => {
      it.want = 'in'
      it.calls.forEach((c) => c.kill())
      it.calls = []
      const now = gsap.ticker.time
      const at = Math.max(now, last + STAGGER)
      last = at
      const t0 = at - now
      it.calls.push(gsap.delayedCall(t0, () => it.card.classList.add('is-down')))
      if (!it.rolled) {
        it.rolled = true
        it.calls.push(
          gsap.delayedCall(t0 + ROLL_AT, () => it.card.classList.add('is-run')),
          gsap.delayedCall(t0 + DONE_AT, () => it.card.classList.add('is-done')),
        )
      }
    }
    const reset = (it: (typeof cards)[number]) => {
      it.want = 'wait'
      it.rolled = false
      it.calls.forEach((c) => c.kill())
      it.calls = []
      it.card.classList.remove('is-down', 'is-run', 'is-done')
    }

    let p = -1
    let readTo = 0
    const tick = (_t?: number, deltaTime?: number) => {
      const vh = window.innerHeight
      const r = say.getBoundingClientRect()
      if (r.top < vh * 1.2 && r.bottom > -vh * 0.2) {
        /* the read: over the statement's own crossing */
        const want = clamp01((vh * 0.85 - r.top) / Math.max(1, r.height + vh * 0.35))
        const f = 1 - Math.exp(-((deltaTime ?? 16.7) / 1000) / GLIDE)
        p = p < 0 || Math.abs(want - p) < 0.0004 ? want : p + (want - p) * f
        const head = Math.round(clamp01((p - READ_FROM) / (READ_TO - READ_FROM)) * N)
        if (head !== readTo) {
          const lo = Math.min(head, readTo)
          const hi = Math.max(head, readTo)
          for (let i = lo; i < hi; i++) words[i].classList.toggle('is-read', head > readTo)
          readTo = head
        }
      }
      /* the cards: in, left to right, as they come on screen; they stay
         landed off the top; parked again below the fold */
      cards.forEach((it) => {
        const b = it.card.parentElement!.getBoundingClientRect()
        if (b.top > vh) {
          if (it.want !== 'wait') reset(it)
        } else if (b.top < vh * LAND_LINE && it.want !== 'in') go(it)
      })
      if (cards.every((it) => it.want === 'wait')) last = -Infinity
    }
    tick()
    gsap.ticker.add(tick)

    return () => {
      gsap.ticker.remove(tick)
      cards.forEach(reset)
      words.forEach((w) => w.classList.remove('is-read'))
      root.classList.remove('is-live')
    }
  }, [answer, facts])

  return (
    <section ref={ref} id="answer" className="ra" aria-label="The short answer">
      <div className="ra-say">
        <p className="ra-label-top" aria-hidden="true">
          {label}
        </p>
        <p className="ra-p">
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
        {/* the arc through the text: decoration */}
        <svg className="ra-arc" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="ra-arc-g" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0" stopColor="currentColor" stopOpacity="0" />
              <stop offset="0.35" stopColor="currentColor" stopOpacity="0.9" />
              <stop offset="0.75" stopColor="currentColor" stopOpacity="0.55" />
              <stop offset="1" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>
          <ellipse cx="500" cy="300" rx="430" ry="170" transform="rotate(-24 500 300)" stroke="url(#ra-arc-g)" />
        </svg>
      </div>

      {/* THE CARDS: a plate a fact. The picture is decoration (alt "");
          the caption is the fact. */}
      <ul className="ra-deck" aria-label="At a glance">
        {facts.map((f) => {
          const m = f.value.match(/(\d+)\s*[–-]\s*(\d+)/)
          return (
            <li key={f.label} className="ra-slot">
              <div className="ra-fact">
                <span className="ra-img">
                  <img {...responsive(f.plate)} alt="" loading="lazy" decoding="async" draggable={false} />
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
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
