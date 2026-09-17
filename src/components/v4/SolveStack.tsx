'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/motion-v4'

/**
 * §3 — THE PRESS SHEET (2026-09-17). Built in three passes, all the
 * user's calls: recreate the deck from "pinned stack image section.mp4"
 * → "make the plate smaller and let's design a section around it" → and
 * then back: "I want it in the middle like it was before, and make the
 * plate a little bigger like it was before. And build the section around
 * that. Make it an unconventional section. The extra elements don't even
 * have to be description or title, they could be whatever."
 *
 * AND THEN STRIPPED TO TWO THINGS ("remove the grey placeholder, just
 * set it to the same colour as the section background; remove the
 * numbering at the top; just basically remove everything except the big
 * text in the middle"). The trim rules, the crop brackets, the corner
 * readouts and the step rail were all built and are all GONE. What is
 * left is the whole section:
 *
 *   the plate    in the middle, 46rem at 8:5, centred in both axes, on a
 *                card the colour of the page — so when a plate recedes
 *                it shrinks away into the paper and not onto a slab.
 *   the word     ONE word per beat, its letters justified edge to edge
 *                across the whole sheet, laid straight over the plate in
 *                `mix-blend-mode: difference` — each letter dark where
 *                it crosses paper and white where it crosses the
 *                picture, so the word is CUT BY the plate rather than
 *                sitting beside it. It names the thing being solved
 *                (TEMPLATE, FORGETTABLE, OUTGROWN, INVISIBLE). The blend
 *                needs a painted, isolated backdrop or white-on-white
 *                eats it — see `.sk-pin` in home.css.
 *
 * THE DECK, measured off the reference frame by frame (1896x906, 30fps):
 *
 *   the clip     every plate carries its OWN clip box at the frame's
 *                geometry, so a beat can own its picture in the markup
 *                (which is what makes the plain fallback readable) and
 *                still be clipped exactly like a shared frame would.
 *   the rise     the incoming plate is LEVEL and UNSCALED all the way
 *                up, pushed through that bottom edge. Its own top edge
 *                is the wipe line and its picture travels with it — no
 *                fade, no counter-move.
 *   the recede   the plate being covered sinks, shrinks INWARDS and
 *                TIPS at once (user: "the exit image has a little
 *                rotation and shrinks inwards simultaneously").
 *                Measured at rise 0.474, off its top edge stretched 4x:
 *                the edge falls 18px across its 838px of visible run,
 *                so it is rotated 1.23 degrees CLOCKWISE; taking that
 *                out of the horizontal extent leaves it at 0.896 of its
 *                width and 63px — 10.9% of its height — low. All three
 *                read straight in the rise, hence the linear
 *                SINK/SHRINK/TILT below. The tip is a flat rotate, not
 *                a rotateX: the top EDGE itself slopes.
 *   the crop     WHAT SHRINKS IS THE FRAME, NOT THE PICTURE (user: "the
 *                container of the image shrinks not the image itself —
 *                the image stays the same cover ratio and just the
 *                container that holds it shrinks"). The driver
 *                counter-scales the picture by 1/s inside its shrinking
 *                plate, so the recede CROPS it rather than zooming out
 *                of it — and the whole move stays on transforms.
 *
 * THE WORDS hand over SEQUENTIALLY: the standing one leaves over the
 * first 0.42 of a handoff and the next arrives over the 0.45 starting
 * exactly there, so the sheet is never blank between two words.
 *
 * THE DRIVER. One rect per frame off gsap.ticker — the page and the
 * deck share Lenis's clock, so nothing lags a frame behind the scroll.
 * Progress over the sticky travel becomes a deck position in plates;
 * every plate, readout and tick reads its own state out of that one
 * number, so the handoffs are sequential by construction and reversing
 * the scroll runs them backwards exactly.
 *
 * SERVER-RENDERED PLAIN (SEO D5): every picture and word ships in the
 * HTML, and each beat OWNS its own in the markup — so without JS, and
 * under reduced motion, the section falls back to four plates each with
 * its word under it. `is-live` is what turns it into the sheet, and
 * only the driver ever adds it. The section's argument is carried by
 * the statement above (SOLVE_LINE in page.tsx), which is why the sheet
 * itself can afford to be this bare.
 */

export type SolveBeat = {
  /** ONE word, justified across the sheet and cut by the plate */
  word: string
  src: string
  alt: string
}

/* The recede, extrapolated straight from the measurement at rise 0.474
 * (10.9% / 0.896 / 1.23deg) to a full rise. */
/** how much of its height the covered plate sinks, at full rise */
const SINK = 23
/** how much of itself the covered plate's FRAME loses, at full rise */
const SHRINK = 0.22
/** how far it tips, clockwise, in degrees, at full rise */
const TILT = 2.6

/** how far a readout travels as it arrives and leaves, in rem (a rem is
 *  the picture's own scale on desktop, so this stays proportional) */
const SHIFT = 0.9
/** the share of a handoff the standing readouts take to leave, and the
 *  share the next set takes to arrive. The arrival starts EXACTLY where
 *  the departure ends — sequential, but with no window in between where
 *  the sheet stands empty. */
const WORD_OUT = 0.42
const WORD_IN = 0.45

/** the share of the run held before the first handoff, and after the last */
const LEAD = 0.04
const TAIL = 0.06

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)
/** smoothstep — the rise eases in and out of each step so a scrubbed
 *  handoff settles instead of arriving at speed */
const smooth = (t: number) => t * t * (3 - 2 * t)

export default function SolveStack({ beats }: { beats: readonly SolveBeat[] }) {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const sec = ref.current
    if (!sec) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const pin = sec.querySelector<HTMLElement>('.sk-pin')
    const cards = Array.from(sec.querySelectorAll<HTMLElement>('.sk-beat'))
    const plates = Array.from(sec.querySelectorAll<HTMLElement>('.sk-plate'))
    const pics = plates.map((el) => el.querySelector<HTMLElement>('img'))
    if (!pin || plates.length < 2) return

    sec.classList.add('is-live')

    const n = plates.length
    let last = -1

    const draw = () => {
      /* the sticky travel: the runway minus the one viewport the sheet
         occupies. offsetHeight is the laid-out height, so this survives
         a resize without a stored measurement. */
      const span = sec.offsetHeight - pin.offsetHeight
      if (span <= 0) return
      const p = clamp01(-sec.getBoundingClientRect().top / span)
      /* the held lead and tail keep the first plate whole on arrival and
         the last plate whole before the release */
      const d = clamp01((p - LEAD) / (1 - LEAD - TAIL)) * (n - 1)
      if (Math.abs(d - last) < 0.0004) return
      last = d

      plates.forEach((el, i) => {
        const rise = smooth(clamp01(d - i + 1))
        const sink = clamp01(d - i)
        const y = (1 - rise) * 100 + sink * SINK
        const s = 1 - sink * SHRINK
        const a = sink * TILT
        /* read right to left: close the frame in, tip it, then travel.
           The translate is a percentage of the UNSCALED box, so the
           rise always covers exactly one plate however far the one
           behind has receded. */
        el.style.transform = `translate3d(0,${y.toFixed(3)}%,0) rotate(${a.toFixed(3)}deg) scale(${s.toFixed(4)})`
        /* and the picture holds its size against it, so the plate's
           edges crop in rather than the whole image getting smaller */
        const pic = pics[i]
        if (pic) pic.style.transform = `scale(${(1 / s).toFixed(4)})`
      })

      /* one pair of numbers a beat, spent by the CSS on the word */
      cards.forEach((el, i) => {
        const come = i === 0 ? 1 : clamp01((d - i + 1 - WORD_OUT) / WORD_IN)
        const go = clamp01((d - i) / WORD_OUT)
        el.style.setProperty('--o', (come * (1 - go)).toFixed(3))
        el.style.setProperty('--y', `${((1 - come) * SHIFT - go * SHIFT).toFixed(3)}rem`)
      })
    }

    draw()
    gsap.ticker.add(draw)
    return () => {
      gsap.ticker.remove(draw)
      sec.classList.remove('is-live')
      plates.forEach((el, i) => {
        el.style.transform = ''
        const pic = pics[i]
        if (pic) pic.style.transform = ''
      })
      cards.forEach((el) => {
        el.style.cssText = ''
      })
    }
  }, [beats])

  return (
    <div className="sk" ref={ref} style={{ ['--sk-n' as string]: beats.length - 1 }}>
      <div className="sk-pin">
        <div className="sk-sheet">
          {/* the card the deck sits on — see .sk-back in home.css for
              why this is an element and not a background */}
          <i className="sk-back" aria-hidden="true" />

          {beats.map((b, i) => (
            <article className="sk-beat" key={b.src}>
              <div className="sk-clip" style={{ zIndex: i + 1 }}>
                <figure className="sk-plate">
                  <img src={b.src} alt={b.alt} loading="lazy" decoding="async" />
                </figure>
              </div>
              {/* letters as flex children so every word, whatever its
                  length, justifies across the whole sheet. Split for the
                  eye, so the word is given to a reader whole. */}
              <p className="sk-word">
                <span className="sr-only">{b.word}</span>
                <span className="sk-letters" aria-hidden="true">
                  {b.word.split('').map((c, k) => (
                    <span key={k}>{c}</span>
                  ))}
                </span>
              </p>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
