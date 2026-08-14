'use client'

import { useEffect, useRef } from 'react'

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
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          e.target.classList.add('is-in')
          io.unobserve(e.target)
          e.target.addEventListener('transitionend', () => e.target.classList.add('is-done'), {
            once: true,
          })
        })
      },
      { threshold: 0.15 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // A callback ref, not the object form: an object ref is invariant in its
  // element type, so RefObject<HTMLElement> will not satisfy Ref<HTMLDivElement>
  // for a polymorphic tag. A function taking HTMLElement accepts any of them.
  const setRef = (node: HTMLElement | null) => {
    ref.current = node
  }

  const Component = Tag as React.ElementType

  const inner = (
    <Component
      ref={setRef}
      className={`k-reveal ${className}`}
      style={{ '--i': index, ...style } as React.CSSProperties}
    >
      {children}
    </Component>
  )

  return masked ? <span className="k-mask">{inner}</span> : inner
}
