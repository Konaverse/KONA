'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { gsap } from '@/lib/motion-v4'
import { createHandLens, within } from '@/lib/hand-lens'
import HandDisc from '@/components/v4/HandDisc'

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
 * THE HAND (second pass 2026-09-13; shared with the work hub since the
 * same day — src/lib/hand-lens.ts has the how and the why). Over the
 * track the native cursor goes and the glass disc follows the pointer,
 * "Drag" inside it, the row itself refracted through its face. This
 * driver's part: the pointer's last known place (a page-level
 * pointermove), the hit test of that point against the row's live rect
 * every frame (so the row scrolling under a still trackpad pointer shows
 * and hides the disc without a move — user, 2026-09-13), the clone's
 * preparation (its reveal forced in) and the mirroring of the track's
 * drag onto the clone's track each frame.
 *
 * Hover devices only. No JS: the row scrolls natively (the noscript
 * rule in page.tsx makes the viewport overflow-x: auto).
 */

/** velocity decay per frame once the hand lets go */
const FRICTION = 0.94
/** how far past the end the track can be pulled, as a share of the pull */
const RUBBER = 0.32


export default function AboutTools({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const viewport = root.querySelector<HTMLElement>('.ab-tools-vp')
    const track = root.querySelector<HTMLElement>('.ab-tools-track')
    const disc = root.querySelector<HTMLElement>('.k-hand-disc')
    if (!viewport || !track) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const hover = window.matchMedia('(hover: hover)').matches
    const html = document.documentElement

    /* the cards reveal once as the row enters */
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
    /* the pointer's last known place on the page; unknown until it has
       moved once, and unknown again once it has left the window */
    let px = 0
    let py = 0
    let known = false
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return
      px = e.clientX
      py = e.clientY
      known = true
    }
    const onGone = () => {
      known = false
    }
    if (hover && disc) {
      window.addEventListener('pointermove', onPointer, { passive: true })
      html.addEventListener('pointerleave', onGone)
      window.addEventListener('blur', onGone)
    }
    /* the lens: the clone of the row shows revealed, and follows the drag */
    const lens =
      hover && disc
        ? createHandLens({
            disc,
            onClone: (c) => {
              c.removeAttribute('style')
              c.classList.add('is-in')
            },
            syncClone: (c) => {
              const t = c.querySelector<HTMLElement>('.ab-tools-track')
              if (t) t.style.transform = track.style.transform
            },
          })
        : null

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

      if (!lens) return

      /* PRESENCE: the hand against the row's live rect, every frame */
      const under = known && within(viewport.getBoundingClientRect(), px, py) ? viewport : null
      lens.tick(px, py, under, dragging)
    }
    if (!reduce) gsap.ticker.add(tick)
    else track.style.transform = ''

    return () => {
      io.disconnect()
      gsap.ticker.remove(tick)
      viewport.removeEventListener('pointerdown', onDown)
      viewport.removeEventListener('pointermove', onMove)
      viewport.removeEventListener('pointerup', onUp)
      viewport.removeEventListener('pointercancel', onUp)
      viewport.removeEventListener('click', onClick, true)
      window.removeEventListener('pointermove', onPointer)
      html.removeEventListener('pointerleave', onGone)
      window.removeEventListener('blur', onGone)
      track.style.transform = ''
      viewport.classList.remove('is-holding')
      lens?.destroy()
    }
  }, [])

  return (
    <section ref={ref} className="ab-tools" aria-label="Our toolset">
      {children}
      {/* the hand's disc: the glass, the lens, the word */}
      <HandDisc word="Drag" />
    </section>
  )
}
