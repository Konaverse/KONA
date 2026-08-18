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
 */
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

    const update = () => {
      const vh = window.innerHeight
      const r = el.getBoundingClientRect()
      // fill runs while the element travels from 88% to 42% of the viewport
      const p = Math.min(Math.max((vh * 0.88 - r.top) / (vh * 0.46), 0), 1)
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
