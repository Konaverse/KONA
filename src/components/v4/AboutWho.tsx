'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { gsap, rem } from '@/lib/motion-v4'

/**
 * WHO WE ARE — THE PICTURE'S DRIVER (2026-09-11; second pass 2026-09-13).
 *
 * THE REVEALS. The title's three words rise through their masks as the
 * title enters; each person's block reveals once as it enters (`is-in`,
 * about.css): the ledger's hairlines draw across the page, the plate
 * draws from the page edge it bleeds off, the figure rises onto it, the
 * bio, the name, the portrait and the dossier resolve a beat apart.
 * IntersectionObserver, 15% in, unobserved once landed.
 *
 * THE TITLE'S PARALLAX (user, 2026-09-11: "WHO moves slow, WE faster,
 * ARE even faster, so that they eventually align"). The three words
 * start stepped down the page and travel up at three rates as the
 * title climbs, and the rates are chosen so the three MEET: at the end
 * of the travel "Who we are" sits on one line. Since 2026-09-13 the
 * line is the layout itself — the masks are a flex row at the page
 * pad, in the site's light lowercase display voice — and the driver
 * only holds each word DOWN by its step times what is left of the
 * travel, so the landing needs no measuring. The travel runs while the
 * title climbs from 92% to 38% of the viewport; past that the line
 * holds. The move is on each word's MASK, so the rise inside it (a CSS
 * transition on the word) is untouched.
 *
 * THE PORTRAITS' PARALLAX (user, 2026-09-11: "scrolls faster and
 * eventually covers the description, when the description is about to
 * exit"; 2026-09-13: "they stop moving after a certain point, they
 * shouldn't stop"). Each portrait climbs faster than the page at a
 * constant rate — set so that over the bio's travel from entering the
 * viewport to nearly leaving it, the portrait climbs exactly the
 * distance from its own top to the bio's top, and so slides up OVER
 * the description as the description is about to go — and it KEEPS
 * that rate before and after: a layer moving at its own speed for as
 * long as the section is on screen, never a move that ends. Layout
 * tops are read once (offsetTop inside the block), the transform is
 * the portrait's alone (its reveal is opacity and blur only). THE
 * DEVELOP rides the same clock: the portrait comes in mono and
 * develops to colour over the climb (--ab-dev, clamped), the person
 * coming into focus as they cover their own description.
 *
 * THE LAG. The word inside each plate drifts sideways a touch against
 * its tilt. Rect math on the shared ticker, transform only, aria-hidden
 * layers.
 */

/** the travel of the title's collapse, as fractions of the viewport
 *  the title's top climbs through */
const TITLE_FROM = 0.92
const TITLE_TO = 0.38
/** where each word starts, below its landing, in rem — the first word
 *  moves too, so the line arrives rather than assembles onto a fixed
 *  word */
const WORD_STEPS_REM = [1.5, 7.5, 11.9]
/** the bio's travel that the portrait's cover is measured over, in
 *  viewport heights */
const COVER_SPAN = 0.94

const smooth = (t: number) => t * t * (3 - 2 * t)
const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1)

export default function AboutWho({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const phone = window.matchMedia('(max-width: 57.5rem)').matches
    const targets = Array.from(root.querySelectorAll<HTMLElement>('.ab-who-k, .ab-who-t, .ab-person'))

    if (reduce) {
      targets.forEach((el) => el.classList.add('is-in'))
      /* no climbing portraits: rest them where the section holds them */
      root.classList.add('is-static')
      return () => {
        targets.forEach((el) => el.classList.remove('is-in'))
        root.classList.remove('is-static')
      }
    }

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
    targets.forEach((el) => io.observe(el))

    /* the layers that move */
    const title = root.querySelector<HTMLElement>('.ab-who-t')
    const masks = Array.from(root.querySelectorAll<HTMLElement>('.ab-who-m'))
    const words = Array.from(root.querySelectorAll<HTMLElement>('.ab-plate-w'))
    const persons = Array.from(root.querySelectorAll<HTMLElement>('.ab-person'))
    /* the portraits' geometry: each with its bio, and the distance the
       portrait must climb to cover it — read from layout (rem-based, so
       it holds through a resize as a ratio of the root) */
    const ports = persons
      .map((p) => {
        const bio = p.querySelector<HTMLElement>('.ab-bio')
        const port = p.querySelector<HTMLElement>('.ab-port')
        return bio && port ? { bio, port } : null
      })
      .filter((x): x is { bio: HTMLElement; port: HTMLElement } => x !== null)

    const tick = () => {
      const r = root.getBoundingClientRect()
      const vh = window.innerHeight
      if (r.bottom < -200 || r.top > vh + 200) return
      const k = rem()

      /* THE LAG: the plate words drift against their tilt */
      words.forEach((w, i) => {
        const wr = w.getBoundingClientRect()
        const wc = (wr.top + wr.height / 2 - vh / 2) / vh
        const dir = i === 0 ? 1 : -1
        w.style.setProperty('--ab-dx', `${(wc * dir * 22 * k).toFixed(2)}px`)
      })

      if (phone) return

      /* THE TITLE: the three words collapse onto their one line */
      if (title) {
        const top = r.top + title.offsetTop
        const p = smooth(clamp01((vh * TITLE_FROM - top) / (vh * (TITLE_FROM - TITLE_TO))))
        masks.forEach((m, i) => {
          const dy = (WORD_STEPS_REM[i] ?? 0) * 16 * k * (1 - p)
          m.style.transform = `translate3d(0, ${dy.toFixed(2)}px, 0)`
        })
      }

      /* THE PORTRAITS: a constant rate, never a move that ends */
      ports.forEach(({ bio, port }) => {
        const bioTop = r.top + bio.offsetTop
        /* 0 as the bio enters at the bottom, 1 as its top nears the top —
           and on past 1, at the same rate, for as long as we are here */
        const p = (vh - bioTop) / (vh * COVER_SPAN)
        const travel = port.offsetTop - bio.offsetTop
        port.style.transform = `translate3d(0, ${(-travel * p).toFixed(2)}px, 0)`
        port.style.setProperty('--ab-dev', clamp01(p).toFixed(3))
      })
    }
    tick()
    gsap.ticker.add(tick)

    return () => {
      io.disconnect()
      gsap.ticker.remove(tick)
      targets.forEach((el) => el.classList.remove('is-in'))
      words.forEach((w) => w.style.removeProperty('--ab-dx'))
      masks.forEach((m) => (m.style.transform = ''))
      ports.forEach(({ port }) => {
        port.style.transform = ''
        port.style.removeProperty('--ab-dev')
      })
    }
  }, [])

  return (
    <section ref={ref} className="ab-who" aria-label="Who we are">
      {children}
    </section>
  )
}
