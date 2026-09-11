'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { gsap, rem } from '@/lib/motion-v4'

/**
 * OUR TOOLSET — THE DRAG TRACK (2026-09-11, the user's frame "toolset
 * section.png": "not pinned, the horizontal cards are draggable; on
 * hover the button becomes a glassy frosty circle with the word drag").
 *
 * THE TRACK. One row of cards wider than the page, moved by the hand:
 * pointer down, drag, release — the track keeps the hand's velocity and
 * coasts to rest, and past either end it stretches like rubber and eases
 * back. Pointer events (mouse, pen and touch alike; `touch-action:
 * pan-y` leaves vertical swipes to the page). Transform only, on the
 * shared ticker. No library.
 *
 * THE HAND. Over the track the native cursor goes and a frosted disc
 * follows the pointer — glass over the cards, the word inside it — and
 * settles a little smaller while the hand is holding the track. It
 * glides to the pointer rather than snapping. Hover devices only.
 *
 * No JS: the row scrolls natively (the noscript rule in page.tsx makes
 * the viewport overflow-x: auto).
 */

/** velocity decay per frame once the hand lets go */
const FRICTION = 0.94
/** how far past the end the track can be pulled, as a share of the pull */
const RUBBER = 0.32
/** the glide of the disc toward the pointer, per frame */
const GLIDE = 0.18

export default function AboutTools({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const viewport = root.querySelector<HTMLElement>('.ab-tools-vp')
    const track = root.querySelector<HTMLElement>('.ab-tools-track')
    const disc = root.querySelector<HTMLElement>('.ab-drag')
    if (!viewport || !track) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const hover = window.matchMedia('(hover: hover)').matches

    /* the cards reveal once as the row enters */
    const cards = Array.from(root.querySelectorAll<HTMLElement>('.ab-tool'))
    const title = root.querySelector<HTMLElement>('.ab-tools-t')
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          ;(e.target as HTMLElement).classList.add('is-in')
          io.unobserve(e.target)
        })
      },
      { threshold: 0.15 },
    )
    if (title) io.observe(title)
    io.observe(viewport)

    /* ---- THE TRACK ---- */
    let x = 0
    let vel = 0
    let dragging = false
    let startX = 0
    let startTrackX = 0
    let lastX = 0
    let lastT = 0
    let moved = false
    const minX = () => Math.min(0, viewport.clientWidth - track.scrollWidth)

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0 && e.pointerType === 'mouse') return
      dragging = true
      moved = false
      startX = e.clientX
      startTrackX = x
      lastX = e.clientX
      lastT = performance.now()
      vel = 0
      viewport.setPointerCapture(e.pointerId)
      viewport.classList.add('is-holding')
    }
    const onMove = (e: PointerEvent) => {
      if (!dragging) return
      const dx = e.clientX - startX
      if (Math.abs(dx) > 3) moved = true
      const raw = startTrackX + dx
      const lo = minX()
      /* the rubber: past an end, the pull counts for a share */
      x = raw > 0 ? raw * RUBBER : raw < lo ? lo + (raw - lo) * RUBBER : raw
      const t = performance.now()
      const dt = Math.max(t - lastT, 1)
      vel = ((e.clientX - lastX) / dt) * 16.7
      lastX = e.clientX
      lastT = t
    }
    const onUp = (e: PointerEvent) => {
      if (!dragging) return
      dragging = false
      viewport.classList.remove('is-holding')
      try {
        viewport.releasePointerCapture(e.pointerId)
      } catch {}
    }
    /* a drag must not end as a click on whatever is under the hand */
    const onClick = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault()
        e.stopPropagation()
      }
    }
    viewport.addEventListener('pointerdown', onDown)
    viewport.addEventListener('pointermove', onMove)
    viewport.addEventListener('pointerup', onUp)
    viewport.addEventListener('pointercancel', onUp)
    viewport.addEventListener('click', onClick, true)

    /* ---- THE HAND ---- */
    let px = 0
    let py = 0
    let dx = 0
    let dy = 0
    let over = false
    const onEnter = () => {
      over = true
      root.classList.add('is-hand')
    }
    const onLeave = () => {
      over = false
      root.classList.remove('is-hand')
    }
    const onPoint = (e: PointerEvent) => {
      px = e.clientX
      py = e.clientY
      if (!over) onEnter()
    }
    if (hover && disc) {
      viewport.addEventListener('pointerenter', onEnter)
      viewport.addEventListener('pointerleave', onLeave)
      viewport.addEventListener('pointermove', onPoint)
    }

    const tick = () => {
      if (!dragging) {
        const lo = minX()
        if (x > 0) {
          x += (0 - x) * 0.16
          vel = 0
        } else if (x < lo) {
          x += (lo - x) * 0.16
          vel = 0
        } else if (Math.abs(vel) > 0.05) {
          x += vel
          vel *= FRICTION
        } else {
          vel = 0
        }
      }
      track.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0)`

      if (hover && disc) {
        /* the disc glides to the hand; snaps in from where the hand is
           if it has just arrived */
        if (over && dx === 0 && dy === 0) {
          dx = px
          dy = py
        }
        dx += (px - dx) * GLIDE
        dy += (py - dy) * GLIDE
        disc.style.transform = `translate3d(${(dx - disc.offsetWidth / 2).toFixed(1)}px, ${(dy - disc.offsetHeight / 2).toFixed(1)}px, 0)`
      }
    }
    if (!reduce) gsap.ticker.add(tick)
    else track.style.transform = ''
    /* keep k referenced for the picture rule: sizes below are rem-based
       and resolved by CSS; the driver moves in px it measured */
    void rem

    return () => {
      io.disconnect()
      gsap.ticker.remove(tick)
      viewport.removeEventListener('pointerdown', onDown)
      viewport.removeEventListener('pointermove', onMove)
      viewport.removeEventListener('pointerup', onUp)
      viewport.removeEventListener('pointercancel', onUp)
      viewport.removeEventListener('click', onClick, true)
      viewport.removeEventListener('pointerenter', onEnter)
      viewport.removeEventListener('pointerleave', onLeave)
      viewport.removeEventListener('pointermove', onPoint)
      track.style.transform = ''
      root.classList.remove('is-hand')
      viewport.classList.remove('is-holding')
    }
  }, [])

  return (
    <section ref={ref} className="ab-tools" aria-label="Our toolset">
      {children}
      {/* the hand's disc — the word inside it is the affordance */}
      <div className="ab-drag" aria-hidden="true">
        <span>Drag</span>
      </div>
    </section>
  )
}
