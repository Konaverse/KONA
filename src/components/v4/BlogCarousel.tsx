'use client'

import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'

/** Native scrolling keeps touch, trackpads and server-rendered card links usable.
 * Each target is a card's leading edge, including the final card. */
export default function BlogCarousel({ children, count }: { children: ReactNode; count: number }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const targetRef = useRef(0)
  const goToRef = useRef<(index: number) => void>(() => {})
  const [active, setActive] = useState<number | null>(null)
  const trackId = useId()

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const cards = Array.from(track.querySelectorAll<HTMLElement>('.bl-card'))
    if (!cards.length) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let offsets: number[] = []
    let settleTimer: ReturnType<typeof setTimeout> | undefined

    const measure = () => {
      const start = cards[0].offsetLeft
      offsets = cards.map(card => card.offsetLeft - start)
    }
    const nearest = () => offsets.reduce((best, offset, index) =>
      Math.abs(offset - track.scrollLeft) < Math.abs(offsets[best] - track.scrollLeft) ? index : best, 0)
    const settle = () => {
      clearTimeout(settleTimer)
      const index = nearest()
      targetRef.current = index
      setActive(index)
    }
    const onScroll = () => {
      // Also handles browsers without scrollend; no work runs while at rest.
      clearTimeout(settleTimer)
      settleTimer = setTimeout(settle, 150)
    }
    const onManualInput = () => {
      // A swipe can interrupt an arrow move. The next arrow starts here.
      targetRef.current = nearest()
    }
    const onResize = () => {
      measure()
      const index = Math.min(targetRef.current, cards.length - 1)
      targetRef.current = index
      track.scrollTo({ left: offsets[index], behavior: 'instant' })
      setActive(index)
    }

    measure()
    settle()
    goToRef.current = (index) => {
      const next = Math.max(0, Math.min(index, cards.length - 1))
      // Keep the requested index during motion so fast clicks advance in order.
      targetRef.current = next
      setActive(next)
      track.scrollTo({ left: offsets[next], behavior: reducedMotion.matches ? 'instant' : 'smooth' })
    }

    track.addEventListener('scroll', onScroll, { passive: true })
    track.addEventListener('scrollend', settle)
    track.addEventListener('pointerdown', onManualInput, { passive: true })
    track.addEventListener('wheel', onManualInput, { passive: true })
    const resize = new ResizeObserver(onResize)
    resize.observe(track)

    return () => {
      clearTimeout(settleTimer)
      resize.disconnect()
      track.removeEventListener('scroll', onScroll)
      track.removeEventListener('scrollend', settle)
      track.removeEventListener('pointerdown', onManualInput)
      track.removeEventListener('wheel', onManualInput)
      goToRef.current = () => {}
    }
  }, [count])

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
    const target = event.target as HTMLElement
    if (target.closest('a')) return
    let index: number
    switch (event.key) {
      case 'ArrowLeft': index = targetRef.current - 1; break
      case 'ArrowRight': index = targetRef.current + 1; break
      case 'Home': index = 0; break
      case 'End': index = count - 1; break
      default: return
    }
    event.preventDefault()
    goToRef.current(index)
  }

  return (
    <div className="bl-carousel" data-count={count} data-ready={active === null ? undefined : true} data-active-index={active ?? 0} onKeyDown={onKeyDown}>
      <div className="bl-carousel-nav" hidden={count < 2}>
        <button type="button" className="bl-carousel-arrow" aria-label="Previous article" aria-controls={trackId} disabled={active === null || active === 0} onClick={() => goToRef.current(targetRef.current - 1)}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
        </button>
        <button type="button" className="bl-carousel-arrow" aria-label="Next article" aria-controls={trackId} disabled={active === null || active === count - 1} onClick={() => goToRef.current(targetRef.current + 1)}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </button>
        <span className="bl-carousel-status" aria-live="polite" aria-atomic="true">
          {active === null ? '' : `Article ${active + 1} of ${count}`}
        </span>
      </div>
      <div ref={trackRef} id={trackId} className="bl-track" data-count={count} role="group" aria-label="Blog articles" tabIndex={0}>
        {children}
      </div>
      <noscript><style>{'.bl-carousel-nav{display:none}'}</style></noscript>
    </div>
  )
}
