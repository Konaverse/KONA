'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { gsap, EASE, DUR, rem } from '@/lib/motion-v4'

/**
 * THE HUB'S HERO — THE BEND (2026-09-08, the user's frames "Service Hub
 * Hero load.png" → "Service Hub Hero final state.png").
 *
 * THE ENTRANCE. The statement's six lines rise through their masks in
 * reading order (the house masked rise, blur resolving as each clears its
 * edge); the display word and its keyword line rise behind them; the small
 * paragraph resolves last.
 *
 * THE BEND. Once the third line has landed, "bending" leaves its sentence:
 * it slides LEFT along its own axis (the FLIP rule — a mover leaves on the
 * axis it travels) out of the text column and into the gutter, landing one
 * word-gap short of the column's edge on the same baseline. The plate
 * opens BEHIND it in exactly the word's footprint: the pill's clip edge
 * tracks the word's right edge frame by frame, so the picture is unveiled
 * by the departure itself — the word drags the aperture open — and the
 * words after it never move. A specular glint runs the plate's length as
 * it finishes, the material answering the change.
 *
 * (THE RING — the stroke that drew itself around the landed word, and the
 * disc it grew into — was REMOVED on 2026-09-09, user: "remove the ring
 * from the hero. Pin the hero, and the services section will scroll over
 * it." The hero is sticky now; hub.css.)
 *
 * THE ROLL (user, 2026-09-08; letter by letter, 2026-09-09). Once the
 * word has landed it rolls through its synonyms — bending, defying,
 * challenging, confronting — on a loop. Each word is split into letters
 * and the change runs LETTER BY LETTER, left to right: every column of
 * the strip rolls up through the word's crop on the same clock, the
 * leaving letter and the arriving one in lockstep, a beat behind its
 * neighbour, with a touch of blur in transit. The synonyms are injected
 * here, never served, so the sentence in the HTML says "bending" exactly
 * once. The words are LEFT-aligned at the landing, which is set by the
 * WIDEST synonym, so no word ever reaches the column.
 *
 * At the bend the slot's width is frozen to the word's footprint and the
 * word comes out of the flow, so the plate keeps its size and "the rules
 * of" never moves whatever word is showing.
 *
 * The final state is CSS (`is-bent` + --sh-travel), so it survives a resize
 * and reduced motion lands on it directly. No JS = the load frame, the word
 * in its sentence (the noscript rule in page.tsx lifts the entrance's
 * opacity 0).
 *
 * PHONES have no gutter. There the word stays and the plate sews in AFTER
 * it — the homepage pills' own move — as a width the sentence wraps around.
 * No roll.
 */

/** the words the landed word rolls through, in order; the first is the
 *  one served */
const SYNONYMS = ['bending', 'defying', 'challenging', 'confronting']
/** seconds a word holds before the next roll */
const HOLD = 2.8
/** one letter's travel through the crop */
const ROLL = 0.78
/** the beat between neighbouring letters */
const ROLL_STAGGER = 0.042

/** the word gap between the landed word and the column, in em of the line */
const GAP_EM = 0.3
/** the plate's width after the word on a phone, in em of the line */
const PHONE_PILL_EM = 4.4

export default function HubHero({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const hero = ref.current
    if (!hero) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const phone = window.matchMedia('(max-width: 57.5rem)').matches

    const lines = Array.from(hero.querySelectorAll<HTMLElement>('.sh-ln'))
    const slot = hero.querySelector<HTMLElement>('.sh-slot')
    const word = hero.querySelector<HTMLElement>('.sh-word')
    const pill = hero.querySelector<HTMLElement>('.sh-pill')
    const glint = hero.querySelector<HTMLElement>('.sh-glint')
    const rises = Array.from(hero.querySelectorAll<HTMLElement>('.sh-h1-w'))
    const reveals = Array.from(hero.querySelectorAll<HTMLElement>('.sh-para, .sh-kicker'))
    if (!slot || !word || !pill) return

    const k = rem()
    let tl: gsap.core.Timeline | null = null
    let rollTl: gsap.core.Timeline | null = null
    let rollCall: gsap.core.Tween | null = null
    let cancelled = false

    /* THE SYNONYMS, injected: the served word stays the first; the rest
       sit hidden in the word's box so their widths can be measured */
    const cur = word.querySelector<HTMLElement>('.sh-syn')
    const syns: HTMLElement[] = cur ? [cur] : []
    /* each word's letters, split for the roll (the served word is split
       at the bend, once the sentence has been read in its set form) */
    const chars: HTMLElement[][] = []
    const split = (el: HTMLElement) => {
      const text = el.textContent ?? ''
      el.textContent = ''
      return Array.from(text).map((ch) => {
        const s = document.createElement('span')
        s.className = 'sh-ch'
        s.textContent = ch
        el.appendChild(s)
        return s
      })
    }
    if (cur && !phone) {
      chars.push([])
      SYNONYMS.slice(1).forEach((w) => {
        const el = document.createElement('span')
        el.className = 'sh-syn'
        el.textContent = w
        el.setAttribute('aria-hidden', 'true')
        word.appendChild(el)
        syns.push(el)
        chars.push(split(el))
      })
    }

    /* freeze the footprint, take the word out of the flow, set the
       landing from the widest synonym — the geometry of the final state.
       The words are RIGHT-aligned at the landing (user, 2026-09-09): every
       synonym ends one gap short of the plate, so the box at the landing
       is the widest word's and the served word travels ITS width plus the
       gap — its right edge lands where every other word's will. */
    const settle = () => {
      const w = word.offsetWidth
      const h = word.offsetHeight
      const fs = parseFloat(getComputedStyle(word).fontSize) || 16
      const wMax = Math.max(w, ...syns.map((el) => el.getBoundingClientRect().width))
      const gap = fs * GAP_EM
      /* both dimensions: an inline-block with only absolute children
         collapses, and the plate and the landing are measured off it */
      slot.style.width = `${w}px`
      slot.style.height = `${h}px`
      slot.style.setProperty('--sh-travel', `${wMax + gap}px`)
      slot.style.setProperty('--sh-wmax', `${wMax}px`)
      return { w, travel: w + gap }
    }

    if (reduce) {
      const go = () => {
        if (cancelled) return
        if (!phone) settle()
        hero.classList.add('is-in', 'is-bent')
      }
      if (typeof document.fonts?.ready?.then === 'function') document.fonts.ready.then(go)
      else go()
      return () => {
        cancelled = true
        hero.classList.remove('is-in', 'is-bent')
      }
    }

    const start = () => {
      if (cancelled) return
      tl = gsap.timeline()

      if (phone) {
        /* the phone statement wraps, so no masks: the whole block resolves
           as one reveal, then the plate sews in after the word */
        const state = hero.querySelector<HTMLElement>('.sh-state')
        tl.fromTo(
          [state, ...rises, ...reveals].filter(Boolean),
          { opacity: 0, y: 18 * k, filter: `blur(${14 * k}px)` },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: DUR.slow, ease: EASE.glass, stagger: 0.08 },
          0,
        )
        tl.set(lines, { opacity: 1 }, 0)
        tl.to(
          pill,
          {
            width: `${PHONE_PILL_EM}em`,
            duration: 1.0,
            ease: EASE.arc,
            onComplete: () => {
              hero.classList.add('is-bent')
              gsap.set(pill, { clearProps: 'width' })
            },
          },
          0.85,
        )
        return
      }

      /* the lines: parked below their masks, rising in reading order */
      tl.fromTo(
        lines,
        { yPercent: 110, opacity: 1, filter: `blur(${8 * k}px)` },
        { yPercent: 0, filter: 'blur(0px)', duration: DUR.slow, ease: EASE.glass, stagger: 0.08 },
        0,
      )
      /* the display word and its keyword line, behind the statement */
      tl.fromTo(
        rises,
        { yPercent: 110, opacity: 1 },
        { yPercent: 0, duration: DUR.cinema, ease: EASE.glass, stagger: 0.1 },
        0.25,
      )
      if (reveals.length) {
        tl.fromTo(
          reveals,
          { opacity: 0, y: 18 * k, filter: `blur(${14 * k}px)` },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: DUR.slow, ease: EASE.glass, stagger: 0.1 },
          0.55,
        )
      }

      /* THE BEND. Geometry is read at the move's first frame, once the
         fonts are in and the third line has landed. That line's mask is
         released first: the word is about to leave the column, and a
         crop edge that exists for the rise must not clip the departure. */
      tl.call(() => hero.classList.add('is-free'), undefined, 1.06)
      const geo = { w: 0, travel: 0 }
      const proxy = { p: 0 }
      tl.to(
        proxy,
        {
          p: 1,
          duration: 1.15,
          ease: EASE.arc,
          onStart: () => {
            /* the served word becomes letters here, before the footprint
               is frozen, so the plate is measured off the split word */
            if (cur && chars.length && !chars[0].length) chars[0] = split(cur)
            const g = settle()
            geo.w = g.w
            geo.travel = g.travel
            word.style.position = 'absolute'
            word.style.left = '0px'
            word.style.top = '0px'
            pill.style.clipPath = `inset(0 0 0 ${geo.w}px)`
          },
          onUpdate: () => {
            const dx = geo.travel * proxy.p
            word.style.transform = `translateX(${-dx}px)`
            /* the vacated stretch of the footprint is what the plate shows:
               the clip's left edge is the word's right edge, floored at
               the slot's own left edge */
            const left = Math.max(geo.w - dx, 0)
            pill.style.clipPath = `inset(0 0 0 ${left}px)`
          },
          onComplete: () => {
            hero.classList.add('is-bent')
            word.style.transform = ''
            word.style.position = ''
            word.style.left = ''
            word.style.top = ''
            pill.style.clipPath = ''
          },
        },
        1.1,
      )
      /* in transit the word is a word in motion, not a box being moved:
         a touch of blur that peaks mid-flight */
      tl.to(word, { filter: `blur(${2.5 * k}px)`, duration: 0.5, ease: 'sine.inOut' }, 1.1)
      tl.to(word, { filter: 'blur(0px)', duration: 0.65, ease: 'sine.out' }, 1.6)
      /* the glint: light catching the plate as the aperture settles */
      if (glint) {
        tl.fromTo(
          glint,
          { xPercent: -70, opacity: 0.85 },
          { xPercent: 70, opacity: 0, duration: 0.8, ease: EASE.settle },
          1.87,
        )
      }
      /* THE ROLL begins once the word has settled, and loops */
      if (syns.length > 1) {
        let at = 0
        const roll = () => {
          if (cancelled) return
          const from = syns[at]
          const fromCh = chars[at]
          at = (at + 1) % syns.length
          const to = syns[at]
          const toCh = chars[at]
          rollTl = gsap.timeline({
            onComplete: () => {
              from.style.visibility = 'hidden'
              rollCall = gsap.delayedCall(HOLD, roll)
            },
          })
          /* the arriving letters wait under the crop, the word shown */
          rollTl.set(toCh, { yPercent: 108, filter: 'blur(0px)' }, 0)
          rollTl.set(to, { visibility: 'visible' }, 0)
          /* letter by letter, left to right: each column of the strip
             rolls up on one clock — the leaving letter and the arriving
             one in lockstep — a beat behind its neighbour */
          rollTl.to(fromCh, { yPercent: -108, duration: ROLL, ease: EASE.arc, stagger: ROLL_STAGGER }, 0)
          rollTl.to(toCh, { yPercent: 0, duration: ROLL, ease: EASE.arc, stagger: ROLL_STAGGER }, 0)
          /* in transit a letter blurs a touch, peaking mid-travel */
          const blur = `blur(${2 * k}px)`
          rollTl.to(fromCh, { filter: blur, duration: ROLL * 0.45, ease: 'sine.inOut', stagger: ROLL_STAGGER }, 0)
          rollTl.to(toCh, { filter: blur, duration: ROLL * 0.45, ease: 'sine.inOut', stagger: ROLL_STAGGER }, 0)
          rollTl.to(fromCh, { filter: 'blur(0px)', duration: ROLL * 0.55, ease: 'sine.out', stagger: ROLL_STAGGER }, ROLL * 0.45)
          rollTl.to(toCh, { filter: 'blur(0px)', duration: ROLL * 0.55, ease: 'sine.out', stagger: ROLL_STAGGER }, ROLL * 0.45)
        }
        tl.call(() => {
          rollCall = gsap.delayedCall(HOLD * 0.6, roll)
        }, undefined, 2.4)
      }
    }

    /* the bend measures the word, so the fonts must be in first */
    if (typeof document.fonts?.ready?.then === 'function') {
      document.fonts.ready.then(start)
    } else {
      start()
    }

    return () => {
      cancelled = true
      tl?.kill()
      rollTl?.kill()
      rollCall?.kill()
      syns.slice(1).forEach((el) => el.remove())
      /* the served word back to plain text, as it was rendered */
      if (cur && chars[0]?.length) cur.textContent = SYNONYMS[0]
      hero.classList.remove('is-in', 'is-bent', 'is-free')
    }
  }, [])

  return (
    <header ref={ref} className="sh-hero" data-nav-hero="0.5">
      {children}
    </header>
  )
}
