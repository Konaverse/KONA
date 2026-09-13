'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { gsap, rem } from '@/lib/motion-v4'

/**
 * THE HUB'S LIST — the services as a STAIR of sticky cards (rebuilt
 * 2026-09-13; user: "I like the stacked idea but I need something
 * different: the title a little indented the more services you go down,
 * an actual feeling of stairs; they come in a circular movement like the
 * page transition and settle horizontally straight right below the one
 * above; and the content inside was too basic").
 *
 * THE PAGE. A lead paragraph, then one sticky card per service (hub.css):
 * each locks one step lower and one tread further right than the one
 * before, so the covered half-titles read as a staircase, and the tread
 * under each title is an editorial spread — the promise, the blurb, the
 * way in, the plate with the number printed on it, the facts as one
 * hairline strip. The markup is the page (page.tsx); this wrapper adds
 * three things and nothing else:
 *
 * THE SWEEP. A sticky card rises straight by nature. Here, while a card
 * travels from the viewport's bottom to its lock, it is rotated about the
 * VIEWPORT'S CENTRE — the page transition's own pivot (PageTransition.tsx:
 * the incoming page pivots on the viewport's centre, tilted TILT, left
 * corner high) — so its path is an arc: it starts a little left and
 * tilted, swings up and right, and settles flat exactly as it locks. The
 * tilt runs on EASE.arc against the travel, so it holds through the
 * middle of the rise and lands in the last third, the way the transition
 * does; a soft shadow under the card's top edge (--sh-lift) lifts with the
 * tilt and fades as it lands, which is what makes a paper card on paper
 * read as a sheet laid on a sheet. Scrubbed, so it reverses under the
 * wheel. Cards enter one at a time by construction: each card's flow top
 * reaches the viewport's bottom exactly as the previous one locks (their
 * heights step down by the stack step), so no two sweep at once.
 *
 * THE SET. As a card locks (SET_AT), `is-set`: the spec's hairline draws,
 * the facts resolve in order, the plate's number rises through its crop
 * and the glint crosses once — the ink setting on the landed sheet. The
 * parked states exist only under `is-js` (put on the section here), so
 * the no-JS page is whole and at rest.
 *
 * THE COVER. The hero before this section is sticky; the section scrolls
 * up over it and the hero drifts and takes a shade beneath (--sh-cover).
 *
 * Reduced motion: no sweep, everything set. Phones: no stack, no sweep.
 */

const clamp01 = (x: number) => Math.min(Math.max(x, 0), 1)

/** the page transition's tilt, a touch more: a card is a smaller sheet
 *  than a page and the same angle read as a wobble at this size */
const TILT = 3.2
/** where the sweep gives way to the landing: the tilt is all but gone by
 *  here on the arc, so the ink sets while the card is still settling, not
 *  after a pause */
const SET_AT = 0.9

export default function HubList({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const phone = window.matchMedia('(max-width: 57.5rem)')
    const list = root.querySelector<HTMLElement>('.sh-list')
    const rows = Array.from(root.querySelectorAll<HTMLElement>('.sh-row'))
    const prev = root.previousElementSibling
    const hero = prev instanceof HTMLElement && prev.classList.contains('sh-hero') ? prev : null
    const arc = gsap.parseEase('k-arc') as (t: number) => number

    root.classList.add('is-js')

    /* the stack step, in px: the computed value comes back unresolved
       ("3.45rem") and motion-v4's rem() is a SCALE against a 16px root,
       not the root size — so it is rem * 16 * rem(). Re-read on resize
       only. (The first cut multiplied by rem() alone: a step 16x too
       small put every lock near the viewport's top, so a card sat visibly
       locked while the driver still had it in the air, unset.) */
    let step = 0
    const measure = () => {
      step = parseFloat(getComputedStyle(root).getPropertyValue('--sh-stack-step')) * 16 * rem()
    }
    measure()
    window.addEventListener('resize', measure)

    const state = rows.map(() => ({ p: -1, set: false }))
    const rest = (row: HTMLElement, s: { p: number }) => {
      if (s.p === 1) return
      s.p = 1
      row.style.transform = ''
      row.style.transformOrigin = ''
      row.style.removeProperty('--sh-lift')
    }
    const setRow = (row: HTMLElement, s: { set: boolean }, on: boolean) => {
      if (s.set === on) return
      s.set = on
      row.classList.toggle('is-set', on)
    }

    let lastC = -1
    const tick = () => {
      /* THE COVER */
      if (hero) {
        const r = root.getBoundingClientRect()
        const c = clamp01(1 - r.top / window.innerHeight)
        if (c !== lastC) {
          lastC = c
          hero.style.setProperty('--sh-cover', c.toFixed(4))
        }
      }

      if (!list) return
      if (reduce || phone.matches) {
        rows.forEach((row, i) => {
          rest(row, state[i])
          setRow(row, state[i], true)
        })
        return
      }

      /* THE SWEEP. A card's flow position is the list's top plus the
         heights before it (the rows are the list's only children, block
         on block) — read that way because a sticky element's own rect is
         already stuck, and its offsetTop is not to be trusted either. */
      const vh = window.innerHeight
      let flow = list.getBoundingClientRect().top
      rows.forEach((row, i) => {
        const top = i * step
        const travel = vh - top
        const here = flow
        const p = clamp01(1 - (here - top) / travel)
        const s = state[i]
        flow += row.offsetHeight

        if (p <= 0 || p >= 1) {
          rest(row, s)
        } else if (p !== s.p) {
          s.p = p
          const k = 1 - arc(p)
          /* the pivot: the viewport's centre, in the card's own frame */
          row.style.transformOrigin = `50% ${(vh / 2 - here).toFixed(1)}px`
          row.style.transform = `rotate(${(TILT * k).toFixed(3)}deg)`
          row.style.setProperty('--sh-lift', k.toFixed(3))
        }
        setRow(row, s, p >= SET_AT)
      })
    }
    gsap.ticker.add(tick)

    return () => {
      gsap.ticker.remove(tick)
      window.removeEventListener('resize', measure)
      hero?.style.removeProperty('--sh-cover')
      root.classList.remove('is-js')
      rows.forEach((row, i) => {
        state[i].p = -1
        rest(row, state[i])
        row.classList.remove('is-set')
      })
    }
  }, [])

  return (
    <section ref={ref} className="sh-index" aria-label="Our services">
      {children}
    </section>
  )
}
