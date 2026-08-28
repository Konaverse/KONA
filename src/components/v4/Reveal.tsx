'use client'

import { createElement, useEffect, useRef } from 'react'

/**
 * The reveal signature, wired to scroll.
 *
 * Fires at 15% into the viewport, not at the edge — firing at the edge means
 * the animation is over before the element is properly visible. Blur is the
 * expensive half of the effect, so the `will-change` promotion is dropped
 * (via .is-done) the moment each element lands rather than left on forever.
 *
 * `masked` wraps the child in a real crop edge. Only use it where an edge
 * genuinely exists and the content is a single line of display type — never
 * wrap a box in overflow:hidden just to get the effect.
 */
export default function Reveal({
  children,
  masked = false,
  index = 0,
  as: Tag = 'div',
  className = '',
  style,
}: {
  children: React.ReactNode
  masked?: boolean
  index?: number
  as?: 'div' | 'span' | 'p' | 'h1' | 'h2' | 'h3'
  className?: string
  style?: React.CSSProperties
}) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('is-in', 'is-done')
      return
    }
    /* WATCH THE MASK, NOT THE MASKED (2026-08-28). The masked variant
       parks the element at translateY(110%) inside overflow:hidden, and
       IntersectionObserver clips by overflow ancestors — so the element
       it was told to watch had an intersection of exactly 0 for as long
       as it was hidden, and 15% never came: the legal pages' h1 stayed
       blank for good. The wrapper is never clipped; observe that. */
    const watched =
      masked && el.parentElement?.classList.contains('k-mask') ? el.parentElement : el
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          el.classList.add('is-in')
          io.unobserve(e.target)
          el.addEventListener('transitionend', () => el.classList.add('is-done'), {
            once: true,
          })
        })
      },
      { threshold: 0.15 },
    )
    io.observe(watched)
    return () => io.disconnect()
  }, [masked])

  // A callback ref, not the object form: an object ref is invariant in its
  // element type, so RefObject<HTMLElement> will not satisfy Ref<HTMLDivElement>
  // for a polymorphic tag. A function taking HTMLElement accepts any of them.
  const setRef = (node: HTMLElement | null) => {
    ref.current = node
  }

  // createElement rather than <Tag />: a union of intrinsic tags narrows its
  // props to the INTERSECTION of every member, which collapses to never and
  // rejects className, style and ref alike.
  const inner = createElement(
    Tag,
    {
      ref: setRef,
      className: `k-reveal ${className}`,
      style: { '--i': index, ...style } as React.CSSProperties,
    },
    children,
  )

  return masked ? <span className="k-mask">{inner}</span> : inner
}
