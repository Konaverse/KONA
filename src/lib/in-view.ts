/**
 * THE TOUCH STAND-IN FOR HOVER (2026-08-26, user: §4's objects must do on
 * scroll what they do on hover — "3D, web design, SEO, redesign, where they
 * rotate, or the web design where the elements flow in an orbit").
 *
 * A device without hover has no enter/leave, but a card scrolling into view
 * and out again is the same pair of moments. This watches one element and
 * calls `onEnter` when at least `threshold` of it is on screen, `onLeave`
 * when it drops back below — edge-triggered, never twice in a row, so the
 * callers' open/close can be the very functions the pointer listeners use.
 * Leaving closes: a card off screen must not keep a turn running, which is
 * what keeps §4's one-live-card budget on a phone (one column, one card
 * mostly on screen at a time).
 *
 * Returns the disconnect. No IntersectionObserver (nothing modern) → enter
 * once and stay.
 */
export function watchInView(
  el: Element,
  onEnter: () => void,
  onLeave: () => void,
  threshold = 0.55,
): () => void {
  if (typeof IntersectionObserver === 'undefined') {
    onEnter()
    return () => {}
  }
  let inside = false
  const io = new IntersectionObserver(
    ([e]) => {
      const now = e.isIntersecting && e.intersectionRatio >= threshold
      if (now === inside) return
      inside = now
      if (now) onEnter()
      else onLeave()
    },
    { threshold: [threshold] },
  )
  io.observe(el)
  return () => io.disconnect()
}
