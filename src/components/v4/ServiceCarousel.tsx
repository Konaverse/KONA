'use client'

import { useEffect, useRef } from 'react'
import { gsap, EASE } from '@/lib/motion-v4'
import { responsive } from '@/lib/img'

/**
 * /services — THE CAROUSEL (2026-09-30; replaces the hub's hero + bench,
 * HubStill / HubBench, parked unimported).
 *
 * THE BRIEF (the user, with a reference frame of cards graded in size
 * about a centre one): "like the projects hub page where all the
 * projects are there and you can't scroll to go anywhere, only click…
 * a loop between the 6 cards of services. Above, centered, the services
 * title, and the active card's service title (bigger), below a service
 * description, and below left and right arrows… real images… the cards
 * landscape not portrait, and forever 3 cards visible (the main in the
 * middle, the two behind left and right) and maybe part of the far
 * behind cards… the cards need to work with dragging too."
 *
 * THE PICTURE (hub.css `.sv`). One viewport, nothing below it
 * (FooterGate leaves the footer off, as on /work). Top, centred: the
 * page's h1, small; the active service's name, large; its line; the two
 * arrows. Below, THE RING: six landscape cards standing on one baseline,
 * the centre one whole, one a side behind it, the far ones cut by the
 * screen's edges. Each card uses the owner's service graphic (2026-10-09),
 * shared with the homepage and shown in its original colors and proportions.
 *
 * THE LOOP. One number, `target`, in cards; `pos` glides after it. A
 * card's PLACE is its index less `pos`, wrapped into −N/2 … N/2, and the
 * place is read off a small table (offset in card widths, scale, shade)
 * — the wrap happens at ±3, where the card is invisible. The arrows and
 * the keys move the target a card; a drag moves it by the hand's travel
 * over one step and, let go, carries its speed and settles on the
 * nearest card. A click on a side card brings it to the centre; a click
 * on the centre card follows its link.
 *
 * SERVER-RENDERED: the h1, all six names and lines (the copy stack, the
 * inactive ones only faded), six real links. The first paint is the
 * resting picture (the places are written inline on the server), so no
 * JS reads a still carousel on card one.
 */

export type CarouselService = {
  slug: string
  name: string
  blurb: string
  image: string
  /** Description of the service artwork. */
  alt?: string
}

/** the places: |place| → offset (card widths), scale, shade. Three
 *  cards read (the centre, one a side); the far ones are tucked behind
 *  the side cards and only their outer part shows (the user: "maybe
 *  part of the far behind cards can be visible a little"). */
const TABLE = [
  { x: 0, s: 1, sh: 0 },
  { x: 0.72, s: 0.7, sh: 0.3 },
  { x: 1.1, s: 0.5, sh: 0.62 },
  { x: 1.3, s: 0.36, sh: 0.85 },
]
/** the glide's time constant, in seconds */
const GLIDE = 0.2
/** a press that travels less than this (px) is a click */
const CLICK = 6

const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/** a place (any real number in −N/2 … N/2) → its look */
function look(d: number) {
  const ad = Math.min(3, Math.abs(d))
  const i = Math.min(2, Math.floor(ad))
  const t = ad - i
  const A = TABLE[i]
  const B = TABLE[i + 1]
  return {
    x: Math.sign(d) * lerp(A.x, B.x, t),
    s: lerp(A.s, B.s, t),
    sh: lerp(A.sh, B.sh, t),
    /* the far cards fade as they reach the wrap */
    o: ad > 2.5 ? Math.max(0, (3 - ad) * 2) : 1,
    z: Math.round(100 - ad * 10),
  }
}

const wrap = (v: number, n: number) => {
  const m = ((v % n) + n) % n
  return m >= n / 2 ? m - n : m
}

const cardStyle = (d: number) => {
  const l = look(d)
  return {
    transform: `translate3d(calc(-50% + var(--sv-w) * ${l.x.toFixed(4)}), 0, 0) scale(${l.s.toFixed(4)})`,
    opacity: l.o,
    zIndex: l.z,
    '--sh': l.sh.toFixed(3),
    '--s': l.s.toFixed(4),
  } as React.CSSProperties
}

export default function ServiceCarousel({ services }: { services: readonly CarouselService[] }) {
  const ref = useRef<HTMLDivElement | null>(null)
  const n = services.length

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const cards = Array.from(root.querySelectorAll<HTMLAnchorElement>('.sv-card'))
    const copies = Array.from(root.querySelectorAll<HTMLElement>('.sv-copy'))
    const ring = root.querySelector<HTMLElement>('.sv-ring')!
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let target = 0
    let pos = 0
    /* THE DEAL: the ring opens out of the centre card on arrival */
    const deal = { k: reduce ? 1 : 0 }
    let shown = -1

    const write = () => {
      cards.forEach((card, i) => {
        const d = wrap(i - pos, n) * deal.k
        const l = look(d)
        card.style.transform = `translate3d(calc(-50% + var(--sv-w) * ${l.x.toFixed(4)}), 0, 0) scale(${l.s.toFixed(4)})`
        card.style.opacity = String(deal.k < 1 && Math.abs(wrap(i - pos, n)) > 2.5 ? 0 : l.o)
        card.style.zIndex = String(l.z)
        card.style.setProperty('--sh', l.sh.toFixed(3))
        card.style.setProperty('--s', l.s.toFixed(4))
      })
    }

    const settleOn = (near: number) => {
      if (near === shown) return
      shown = near
      copies.forEach((c, i) => c.classList.toggle('is-on', i === near))
      cards.forEach((c, i) => {
        c.classList.toggle('is-on', i === near)
        c.setAttribute('tabindex', i === near ? '0' : '-1')
      })
    }

    /* THE HAND: a drag reads the travel over one step */
    let dragging = false
    let moved = 0
    let startX = 0
    let startT = 0
    let lastX = 0
    let lastTime = 0
    let vel = 0
    let pressed: number = -1
    /* one step, in px: the side card's offset (a card's offsetWidth is
       its untransformed width, --sv-w) */
    const stepPx = () => cards[0].offsetWidth * TABLE[1].x
    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return
      dragging = true
      moved = 0
      startX = lastX = e.clientX
      startT = target
      lastTime = performance.now()
      vel = 0
      const card = (e.target as HTMLElement).closest<HTMLAnchorElement>('.sv-card')
      pressed = card ? cards.indexOf(card) : -1
      ring.setPointerCapture(e.pointerId)
      ring.classList.add('is-drag')
    }
    const onMove = (e: PointerEvent) => {
      if (!dragging) return
      const now = performance.now()
      const dx = e.clientX - startX
      moved = Math.max(moved, Math.abs(dx))
      const dt = Math.max(1, now - lastTime)
      vel = vel * 0.6 + ((e.clientX - lastX) / dt) * 0.4
      lastX = e.clientX
      lastTime = now
      target = startT - dx / stepPx()
      pos = target
    }
    const onUp = (e: PointerEvent) => {
      if (!dragging) return
      dragging = false
      ring.classList.remove('is-drag')
      if (ring.hasPointerCapture(e.pointerId)) ring.releasePointerCapture(e.pointerId)
      if (moved < CLICK) {
        /* a click: the centre card follows its link; a side card comes
           to the centre */
        if (pressed >= 0) {
          const d = wrap(pressed - Math.round(pos), n)
          if (d === 0) {
            /* a CLICK on the link, not a page load: the page transition
               listens for link clicks (a synthetic click has detail 0, so
               onClick below lets it through) — location.assign skipped it */
            cards[pressed].click()
            return
          }
          target = Math.round(pos) + d
        }
        return
      }
      /* let go: carry the speed, then the nearest card */
      target = Math.round(target - (vel * 180) / stepPx())
    }
    /* the links themselves never navigate on their own: the press
       decides (a drag must never open a page) — but keyboard Enter does */
    const onClick = (e: MouseEvent) => {
      if ((e as PointerEvent).pointerType === '' || e.detail === 0) return
      e.preventDefault()
    }
    ring.addEventListener('pointerdown', onDown)
    ring.addEventListener('pointermove', onMove)
    ring.addEventListener('pointerup', onUp)
    ring.addEventListener('pointercancel', onUp)
    cards.forEach((c) => {
      c.addEventListener('click', onClick)
      c.addEventListener('dragstart', (e) => e.preventDefault())
    })

    const go = (step: number) => {
      target = Math.round(target) + step
    }
    const prev = root.querySelector<HTMLButtonElement>('.sv-prev')!
    const next = root.querySelector<HTMLButtonElement>('.sv-next')!
    const onPrev = () => go(-1)
    const onNext = () => go(1)
    prev.addEventListener('click', onPrev)
    next.addEventListener('click', onNext)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') go(-1)
      else if (e.key === 'ArrowRight') go(1)
    }
    window.addEventListener('keydown', onKey)

    root.classList.add('is-live')
    settleOn(0)
    write()

    const tick = (_t?: number, deltaTime?: number) => {
      if (!dragging) {
        const f = 1 - Math.exp(-((deltaTime ?? 16.7) / 1000) / (reduce ? 0.01 : GLIDE))
        pos = Math.abs(target - pos) < 0.0005 ? target : pos + (target - pos) * f
      }
      write()
      settleOn(((Math.round(pos) % n) + n) % n)
    }
    gsap.ticker.add(tick)

    let dealTl: gsap.core.Tween | null = null
    if (!reduce) {
      root.classList.add('is-dealing')
      dealTl = gsap.to(deal, {
        k: 1,
        duration: 1.35,
        ease: EASE.glass,
        delay: 0.25,
        onComplete: () => root.classList.remove('is-dealing'),
      })
    }

    return () => {
      gsap.ticker.remove(tick)
      dealTl?.kill()
      ring.removeEventListener('pointerdown', onDown)
      ring.removeEventListener('pointermove', onMove)
      ring.removeEventListener('pointerup', onUp)
      ring.removeEventListener('pointercancel', onUp)
      cards.forEach((c) => c.removeEventListener('click', onClick))
      prev.removeEventListener('click', onPrev)
      next.removeEventListener('click', onNext)
      window.removeEventListener('keydown', onKey)
      root.classList.remove('is-live', 'is-dealing')
    }
  }, [n])

  return (
    <div ref={ref} className="sv">
      <div className="sv-top">
        {/* the label and what the page is, in the words people search (SEO
            plan v3, owner-approved 2026-10-03) */}
        <h1 className="sv-h1">
          Services <span className="sv-h1-mod">Web design, development and 3D websites, from Cyprus</span>
        </h1>

        {/* THE COPY: all six in the HTML, the active one shown */}
        <div className="sv-copies" aria-live="polite">
          {services.map((s, i) => (
            <div key={s.slug} className={`sv-copy${i === 0 ? ' is-on' : ''}`}>
              <h2 className="sv-name">
                <a href={`/services/${s.slug}`} tabIndex={-1}>
                  {s.name}
                </a>
              </h2>
              <p className="sv-blurb">{s.blurb}</p>
            </div>
          ))}
        </div>

        <div className="sv-arrows">
          <button type="button" className="sv-arrow sv-prev" aria-label="Previous service">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M19 12H5M11 6l-6 6 6 6" />
            </svg>
          </button>
          <button type="button" className="sv-arrow sv-next" aria-label="Next service">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>

      {/* THE RING */}
      <div className="sv-ring">
        {services.map((s, i) => (
          <a
            key={s.slug}
            href={`/services/${s.slug}`}
            className={`sv-card${i === 0 ? ' is-on' : ''}`}
            style={cardStyle(wrap(i, n))}
            tabIndex={i === 0 ? 0 : -1}
            aria-label={s.name}
            draggable={false}
          >
            <span className="sv-tag" aria-hidden="true">
              <i />
              {s.name}
            </span>
            <span className="sv-pic">
              <img
                {...responsive(s.image)}
                alt={s.alt ?? ''}
                loading={i < 2 || i === n - 1 ? 'eager' : 'lazy'}
                decoding="async"
                draggable={false}
              />
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}
