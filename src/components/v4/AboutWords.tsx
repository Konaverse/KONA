'use client'

import { useEffect, useRef } from 'react'
import { gsap, EASE } from '@/lib/motion-v4'

/**
 * WHAT WE MAKE — THE WORDS (2026-09-17, the user's frame "image.png":
 * "big editorial and bold words, almost the full width, one below
 * another; each more transparent when it is not the one. The featured
 * word gets bold in a cool animation; all the words sit on the right,
 * and the featured word translates its letters to the left side one by
 * one; once that's done the next word becomes featured. No eyebrows,
 * no numbering, no hairlines." Then, after a clock and a pin were both
 * turned down: "continuous scroll. The first word goes to the left
 * immediately, the second a little later, the third a little later,
 * and the final word just a bit before it exits the viewport."
 * Then: "smooth everything out, the animation is too abrupt; all the
 * words are already bold, they just get the colour when featured.")
 *
 * THE PICTURE. A section on paper, in flow, NOT pinned, that slides up
 * over the opening's held picture (the cover — about.css). Inside, the
 * four words at display size, one below another, right-aligned, all
 * in the heavy face, ghosted. Each word is done as it climbs: it comes
 * up to ink, its letters fly one by one from the right edge to the
 * left, and as the next word comes up it lets go of its ink and stays
 * where it landed.
 *
 * THE SCRUB. Each word has its own paused timeline (the ink, the
 * flight, the letting-go) and its own WINDOW of the viewport: the
 * word's progress is where its row's centre sits between the window's
 * start line and its end line (as shares of the viewport's height,
 * from the bottom). The first window starts at the bottom edge — the
 * word goes as soon as it is in — and the last ends near the top —
 * the word goes just before it leaves; the windows in between are
 * spaced evenly and LONG — half the viewport where the rows' pitch
 * allows — and overlap a little, so a word lets go of its ink as the
 * next comes up to it (the smoothing pass: short windows made a flick
 * of the wheel a whole flight). Everything runs on the scrub token
 * (EASE.drift) and every state is a tween of progress: it reads the
 * same up and down. One rect per frame off gsap.ticker.
 *
 * THE GLIDE (the second smoothing pass, user, 2026-09-17: "smooth out
 * even further… it's too abrupt on the scroll"). Three things. The
 * windows are longer still and overlap more (SPAN_MAX, GAP), so a
 * word's first letters lift off while the last of the word before are
 * landing. A letter's flight is a bigger share of its word's clock
 * (T.flight), so each one crosses over more scroll. And the scroll no
 * longer IS the progress, it is where the progress is HEADED: each
 * word eases after its target with a time constant (GLIDE), frame-rate
 * independent, so a flick of the wheel becomes a glide that settles
 * after the page has stopped — the one place on the page with a lag
 * on top of Lenis, because here the hand's speed was the abruptness.
 * And the glide has a TOP SPEED (FASTEST): however hard the flick, no
 * word runs its whole clock in less than that, so a letter never
 * crosses the row in a blink — it trails the hand and lands after it.
 * Out of sight the words snap to their targets.
 *
 * THE FLIGHT's distance is the row's inner width less the word's
 * width, measured once (and again on resize).
 *
 * TOUCH IS THE SCROLL ITSELF (2026-10-03, owner, on the phone: "I want
 * it scroll driven instead of scroll activated"). First the glide's lag
 * and top speed made a fling look like nothing happened and then an
 * instant change; a real-time playback tried the same day "restarts on
 * its own and it's laggy". So on touch each word's progress IS its
 * place in its window — no top speed, and only a breath of easing
 * (GLIDE_TOUCH) to take the steps out of a finger's scroll. Where the
 * page is, the words are; up and down read the same.
 */

/** the ghost's ink */
const GHOST = 0.1

/** the windows, as shares of the viewport's height measured from the
 *  top: the first word's window opens at the bottom edge, the last
 *  word's closes here */
const FIRST_START = 1.0
const LAST_END = 0.15
/** the longest a window may be (its length in viewport shares) */
const SPAN_MAX = 0.62
/** the gap between one word's end and the next one's start — negative:
 *  they overlap by this much, the hand-over */
const GAP = -0.26
/** THE GLIDE: the time constant (s) of each word's ease after its
 *  target — ~63% of the way there in this long, settled in about four */
const GLIDE = 0.4
/** on touch the words follow the scroll all but directly */
const GLIDE_TOUCH = 0.06
/** THE TOP SPEED: the least time (s) a word's whole clock may take */
const FASTEST = 1.8
/** how much of the page's scroll the rose gives back */
const ROSE_DRIFT = 0.1

/** one word's clock, in timeline units */
const T = {
  ink: 1.2,
  flightAt: 0.2,
  flight: 1.7,
  stagger: 0.07,
  letGoAt: 2.6,
  letGo: 1.0,
} as const

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)

export default function AboutWords({ words }: { words: readonly string[] }) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const sec = ref.current
    if (!sec) return
    const rows = Array.from(sec.querySelectorAll<HTMLElement>('.ab-wd-w'))
    const n = rows.length
    if (n < 2) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      sec.classList.add('is-still')
      return () => sec.classList.remove('is-still')
    }

    /* touch: the scroll itself, no top speed (see the header) */
    const touch =
      window.matchMedia('(max-width: 57.5rem)').matches || window.matchMedia('(pointer: coarse)').matches
    const letters = rows.map((r) => Array.from(r.querySelectorAll<HTMLElement>('.ab-wd-l')))
    const wordEls = rows.map((r) => r.querySelector<HTMLElement>('.ab-wd-word')!)

    let tls: gsap.core.Timeline[] = []
    /** each row's centre, from the section's top (px) */
    let centres: number[] = []
    /** each window's start line and its span (viewport shares) */
    let starts: number[] = []
    let span = SPAN_MAX
    const last: number[] = rows.map(() => -1)
    /** where each word's progress IS (it eases after the scroll's) */
    const cur: number[] = rows.map(() => -1)

    const build = () => {
      tls.forEach((t) => t.kill())
      /* the flight's distance: the row's inner width less the word's */
      const flight = rows.map((row, r) => row.clientWidth - wordEls[r].offsetWidth)
      rows.forEach((row, r) => {
        gsap.set(row, { opacity: GHOST })
        gsap.set(letters[r], { x: 0, scaleX: 1 })
      })

      /* the windows: from the rows' pitch */
      const vh = window.innerHeight
      centres = rows.map((r) => r.offsetTop + r.offsetHeight / 2)
      const pitch = (centres[1] - centres[0]) / vh
      const room = FIRST_START - LAST_END
      span = Math.min(SPAN_MAX, (room + (n - 1) * (pitch - GAP)) / n)
      const step = (room - span) / (n - 1)
      starts = rows.map((_, i) => FIRST_START - i * step)

      tls = rows.map((row, i) => {
        const tl = gsap.timeline({ paused: true })
        /* the ink */
        tl.to(row, { opacity: 1, duration: T.ink, ease: EASE.drift }, 0)
        /* the flight, letter by letter from the first */
        tl.to(letters[i], { x: -flight[i], duration: T.flight, ease: EASE.drift, stagger: T.stagger }, T.flightAt)
        tl.to(
          letters[i],
          {
            keyframes: { '0%': { scaleX: 1 }, '50%': { scaleX: 1.07 }, '100%': { scaleX: 1 }, easeEach: 'sine.inOut' },
            duration: T.flight,
            stagger: T.stagger,
          },
          T.flightAt,
        )
        /* the letting-go — the last word keeps its ink to the end */
        if (i < n - 1) tl.to(row, { opacity: GHOST, duration: T.letGo, ease: EASE.drift }, T.letGoAt)
        else tl.to({}, { duration: T.letGo }, T.letGoAt)
        return tl
      })
      last.fill(-1)
      cur.fill(-1)
    }
    build()

    const rose = sec.querySelector<HTMLElement>('.ab-wd-rose')
    const tick = (_time?: number, deltaTime?: number) => {
      const r = sec.getBoundingClientRect()
      const vh = window.innerHeight
      const seen = r.bottom > 0 && r.top < vh
      /* out of sight and settled: nothing to do */
      if (!seen && cur[0] >= 0 && cur.every((c, i) => c === last[i])) return
      /* the share of the way to the target this frame covers */
      const dt = (deltaTime ?? 16.7) / 1000
      const k = 1 - Math.exp(-dt / (touch ? GLIDE_TOUCH : GLIDE))
      const cap = touch ? 1 : dt / FASTEST
      /* the rose rides a little slower than the page (the drift) */
      if (rose) rose.style.transform = `translate3d(0, ${((vh / 2 - (r.top + r.height / 2)) * ROSE_DRIFT).toFixed(2)}px, 0)`
      for (let i = 0; i < n; i++) {
        const c = (r.top + centres[i]) / vh
        const p = clamp01((starts[i] - c) / span)
        last[i] = p
        /* the first frame and the unseen ones land on the target */
        const was = cur[i]
        const d = p - was
        cur[i] = was < 0 || !seen || Math.abs(d) < 0.0004 ? p : was + Math.max(-cap, Math.min(cap, d * k))
        if (cur[i] !== was) tls[i].progress(cur[i])
      }
    }
    tick()
    gsap.ticker.add(tick)

    let raf = 0
    let width = window.innerWidth
    const onResize = () => {
      /* a phone's browser bar sliding in or out is a resize too: the
         height alone changed, and rebuilding there reset the words
         mid-scroll */
      if (touch && window.innerWidth === width) return
      width = window.innerWidth
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        build()
        tick()
      })
    }
    window.addEventListener('resize', onResize)

    return () => {
      gsap.ticker.remove(tick)
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(raf)
      tls.forEach((t) => t.kill())
      if (rose) rose.style.transform = ''
      rows.forEach((row, r) => {
        row.style.opacity = ''
        letters[r].forEach((l) => (l.style.transform = ''))
      })
    }
  }, [words])

  return (
    <section ref={ref} className="ab-wd" aria-label="What we make">
      <h2 className="sr-only">What we make</h2>
      {/* THE ROSE (2026-09-17, the user's "rose.png": a black rose with
          no ground, its stem leaving the picture's bottom edge a third
          of the way along — "the stem needs to start from the left side
          of the section, not from the bottom": turned to the right and
          set with the stem's end past the left edge, the head left of
          centre; the words go over it in the difference blend). The
          wrapper takes the drift, the picture the turn. */}
      <div className="ab-wd-rose" aria-hidden="true">
        <img src="/About/rose.webp" alt="" width={984} height={1368} loading="lazy" decoding="async" draggable={false} />
      </div>
      <ul className="ab-wd-list">
        {words.map((w) => (
          <li key={w} className="ab-wd-w">
            {/* the word for readers, whole; the letters for the eye */}
            <span className="sr-only">{w}</span>
            <span className="ab-wd-word" aria-hidden="true">
              {Array.from(w).map((ch, j) => (
                <span key={j} className="ab-wd-l">{ch}</span>
              ))}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
