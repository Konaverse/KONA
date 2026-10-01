'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { aimLight } from '@/lib/run-store'

/**
 * THE PAPER GROUND (service pages, 2026-09-30). ONE ground under the
 * whole page (the user: "the whole page needs the dotted background") —
 * the paper lit at the hero's centre, and the hub's dots, seen only
 * around the pointer.
 *
 * THE DOTS are one layer on the ground (`.ro-dots`, first child here)
 * PLUS one inside each section that must paint its own ground: the
 * poster (its difference blend needs a painted, isolated backdrop) and
 * the process's dark card (light dots). This driver finds every
 * `.ro-dots` inside it and places each one's mask from its OWN rect, so
 * the circle of dots sits under the hand wherever the hand is. Sections
 * with nothing to paint (the statement, the Invitation, the foot) are
 * transparent here and show the ground's layer. The page's light is
 * aimed with the hand. run.css `.ro-ground`.
 */
export default function RunGround({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const host = ref.current
    if (!host) return
    const layers = Array.from(host.querySelectorAll<HTMLElement>('.ro-dots'))
    /* the hand, in viewport px; re-placed on scroll so the dots stay
       under a still pointer while the page moves */
    let cx = -1
    let cy = -1
    const place = () => {
      if (cx < 0) return
      const vh = window.innerHeight
      layers.forEach((el) => {
        const r = el.getBoundingClientRect()
        if (r.bottom < 0 || r.top > vh) return
        el.style.setProperty('--ro-x', `${(cx - r.left).toFixed(1)}px`)
        el.style.setProperty('--ro-y', `${(cy - r.top).toFixed(1)}px`)
      })
    }
    const onMove = (ev: PointerEvent) => {
      cx = ev.clientX
      cy = ev.clientY
      place()
      if (!lit) {
        lit = true
        layers.forEach((el) => el.classList.add('is-hand'))
      }
      aimLight(cx / window.innerWidth, cy / window.innerHeight)
    }
    /* THE CLASS GOES ON THE DOT LAYERS, not on the ground (2026-10-01,
       measured): the hand crossing the fixed run bar and nav fires leave /
       enter over and over, and a class flip on the ground re-styled all
       ~600 elements under it each time. On the layers it touches three. */
    let lit = false
    const onLeave = () => {
      lit = false
      layers.forEach((el) => el.classList.remove('is-hand'))
    }
    host.addEventListener('pointermove', onMove, { passive: true })
    host.addEventListener('pointerleave', onLeave)
    window.addEventListener('scroll', place, { passive: true })
    return () => {
      host.removeEventListener('pointermove', onMove)
      host.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('scroll', place)
      layers.forEach((el) => {
        el.classList.remove('is-hand')
        el.style.removeProperty('--ro-x')
        el.style.removeProperty('--ro-y')
      })
    }
  }, [])

  return (
    <div ref={ref} className="ro-ground">
      <span className="ro-dots" aria-hidden="true" />
      {children}
    </div>
  )
}
