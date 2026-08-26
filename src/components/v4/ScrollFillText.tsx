'use client'

import { Fragment, createElement, useEffect, useRef } from 'react'
import { gsap } from '@/lib/motion-v4'

/**
 * Scroll-driven letter fill (user-directed 2026-08-18: "the statement needs
 * to come to life"). The text sits faded and fills to full ink letter by
 * letter as it travels up the viewport, with a soft feathered leading edge —
 * the hand supplies the easing through Lenis, exactly like the page-turn.
 *
 * Progressive enhancement, strictly: the letters are rendered at FULL ink on
 * the server — the no-JS page and crawlers see a plain readable statement —
 * and the first ticker tick is what drops the unfilled tail to the faded
 * state. Reduced motion never dims anything. A11y: the real string lives in
 * aria-label; the letter spans are aria-hidden.
 *
 * House pattern: gsap.ticker + rect math, no scroll listeners.
 *
 * THE TRAVEL IS WIDTH-DEPENDENT (2026-08-26, user: on the phone "the text
 * doesn't animate like the desktop"). The desktop fill runs while the
 * element climbs from 88% to 42% of the viewport — 46vh, a few wheel
 * notches under Lenis. On a phone that is ~390px, one thumb-flick of
 * native (unsmoothed) touch scroll, so the letters were at full ink before
 * the eye got there. Under 57.5rem the fill spans the element's whole
 * climb, from the bottom edge to 28% — and it starts from the edge, so the
 * line always enters faded and is seen filling.
 */
const TRAVEL = { desktop: [0.88, 0.42], phone: [1.0, 0.28] } as const
export default function ScrollFillText({
  text,
  as = 'h2',
  className = '',
  base = 0.14,
}: {
  text: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'div'
  className?: string
  /** rest opacity of an unfilled letter */
  base?: number
}) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const letters = Array.from(el.querySelectorAll<HTMLElement>('[data-l]'))
    const n = letters.length
    if (!n) return
    const feather = 7
    let last = -1
    const [from, to] = window.matchMedia('(max-width: 57.5rem)').matches
      ? TRAVEL.phone
      : TRAVEL.desktop

    const update = () => {
      const vh = window.innerHeight
      const r = el.getBoundingClientRect()
      // fill runs while the element's top travels from `from` to `to` of the viewport
      const p = Math.min(Math.max((vh * from - r.top) / (vh * (from - to)), 0), 1)
      if (p === last) return
      last = p
      const head = p * (n + feather)
      for (let i = 0; i < n; i++) {
        const o = Math.min(Math.max((head - i) / feather, base), 1)
        letters[i].style.opacity = o.toFixed(3)
      }
    }

    gsap.ticker.add(update)
    return () => gsap.ticker.remove(update)
  }, [base])

  const words = text.split(' ')
  const letterSpans = (word: string) =>
    Array.from(word).map((ch, ci) => createElement('span', { key: ci, 'data-l': true }, ch))

  return createElement(
    as,
    {
      ref: (node: HTMLElement | null) => {
        ref.current = node
      },
      className,
      'aria-label': text,
    },
    createElement(
      'span',
      { 'aria-hidden': true },
      words.map((word, wi) =>
        createElement(
          Fragment,
          { key: wi },
          createElement(
            'span',
            { style: { display: 'inline-block', whiteSpace: 'nowrap' } },
            letterSpans(word),
          ),
          wi < words.length - 1 ? ' ' : null,
        ),
      ),
    ),
  )
}
