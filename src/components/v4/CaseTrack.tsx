'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { getLenis } from '@/components/v4/SmoothScroll'
import { gsap, rem } from '@/lib/motion-v4'

/**
 * /work/[slug] — THE TRAVEL (2026-09-18, user: "a complete redesign…
 * maybe full horizontal… imagery and video focused… one viewport can be
 * one video in a big container, one can be a nice layout… a bit of
 * editorial design layout with agentic. No numbering, no hairlines, no
 * eyebrows").
 *
 * THE PAGE IS ONE HORIZONTAL RUN of spreads — a magazine laid flat — on
 * a pinned stage. The VERTICAL scroll drives it (Lenis, the wheel, the
 * keyboard, the scrollbar all stay native; nothing is hijacked): the
 * runway is as tall as the run is long, and the track is translated by
 * the runway's progress. Pages alternate paper and void; pictures
 * straddle the seams.
 *
 * THE REFERENCES (read as film, nothing installed): 21st "Story scroll"
 * and "Scroll 01" (a pinned horizontal run), "Kinetic Scroll Gallery"
 * (pictures shear with the scroll's speed), Skiper 30 "Oliver parallax"
 * (columns at their own rates), Skiper 67 (the video as a big window),
 * Watermelon "scroll-island" (a floating island that carries progress
 * and the index) — that last one is THE ISLAND here, the page's agentic
 * part with THE NOTES (below).
 *
 * WHAT THE DRIVER DOES, on one gsap.ticker, from one rect per frame:
 *   · THE RUN — x glides to the runway's progress; one transform
 *   · DEPTH — `[data-rate]` elements slide against the run by their
 *     distance from the screen's centre; a plate's print (`.cx-print`)
 *     slides inside its window the other way
 *   · SHEAR — pictures lean with the run's speed (one custom property)
 *   · ARRIVAL — `.cx-r` gets `is-in` as it crosses into the screen
 *   · THE REELS — a `.cx-reel`'s stacked captures cut on a clock while
 *     on screen; videos play only on screen
 *   · THE NOTES (`.cx-notes`) — the agent's cursor walks a chapter's
 *     decisions as the spread crosses the screen: the note on show is
 *     lit, the plate beside it cuts to that note's picture; a hand on a
 *     note takes over
 *   · THE ISLAND — progress ring, the chapter on show (a rolling
 *     title), the index (jumps move the SCROLL), the live site
 * Offsets are read once per measure from offsetLeft chains (transforms
 * never pollute them).
 *
 * Phones, reduced motion and no JS get the same DOM in flow: the spreads
 * stack, top to bottom, every word and picture in place.
 */

/** how many px the run travels per px of scroll */
const SPEED = 1.35
/** the run's glide (s) */
const GLIDE = 0.11
/** the shear: degrees per (px/s) of run, and its cap */
const SHEAR = 0.0011
const SHEAR_MAX = 2.2
/** a print's slide inside its window, as a share of the window's width */
const PRINT = 0.07
/** the reels' cut (s a frame) */
const CUT = 0.55

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v)

export interface CaseChapter {
  id: string
  title: string
}

export default function CaseTrack({
  chapters,
  live,
  children,
}: {
  /** the index: spread ids and their names, in run order */
  chapters: CaseChapter[]
  /** the live site, when there is one */
  live?: string
  children: ReactNode
}) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const phone = window.matchMedia('(max-width: 57.5rem)').matches
    const run = root.querySelector<HTMLElement>('.cx-run')!
    const stage = root.querySelector<HTMLElement>('.cx-stage')!
    const track = root.querySelector<HTMLElement>('.cx-track')!
    const isle = root.querySelector<HTMLElement>('.cx-isle')!
    const isleBtn = root.querySelector<HTMLButtonElement>('.cx-isle-btn')!
    const isleRoll = root.querySelector<HTMLElement>('.cx-isle-roll')!
    const videos = Array.from(root.querySelectorAll<HTMLVideoElement>('video'))
    const reels = Array.from(root.querySelectorAll<HTMLElement>('.cx-reel'))
    /* React drops `muted` on SSR */
    videos.forEach((v) => (v.muted = true))

    /* THE REELS' clocks */
    const reelAt = reels.map(() => 0)
    const reelSince = reels.map((_, i) => -i * 0.17)
    const cutReel = (i: number, dt: number) => {
      const imgs = reels[i].children
      if (imgs.length < 2) return
      reelSince[i] += dt
      if (reelSince[i] < CUT) return
      reelSince[i] = 0
      const prev = reelAt[i]
      reelAt[i] = (prev + 1) % imgs.length
      for (let k = 0; k < imgs.length; k++) {
        imgs[k].classList.toggle('is-on', k === reelAt[i])
        imgs[k].classList.toggle('is-prev', k === prev)
      }
    }

    if (reduce || phone) {
      /* in flow: arrive on sight, play on sight */
      const io = new IntersectionObserver(
        (es) =>
          es.forEach((e) => {
            if (e.target instanceof HTMLVideoElement) {
              if (e.isIntersecting) e.target.play().catch(() => {})
              else e.target.pause()
            } else if (e.isIntersecting) e.target.classList.add('is-in')
          }),
        { rootMargin: '0px 0px -8% 0px' },
      )
      root.querySelectorAll('.cx-r').forEach((el) => io.observe(el))
      if (!reduce) videos.forEach((v) => io.observe(v))
      const t = (_t?: number, deltaTime?: number) => {
        const vh = window.innerHeight
        const dt = Math.min(0.05, (deltaTime ?? 16.7) / 1000)
        reels.forEach((r, i) => {
          const b = r.getBoundingClientRect()
          if (b.bottom > 0 && b.top < vh) cutReel(i, dt)
        })
      }
      if (!reduce) gsap.ticker.add(t)
      return () => {
        io.disconnect()
        gsap.ticker.remove(t)
      }
    }

    root.classList.add('is-live')

    /* ---- what moves, and where it stands in the run (px, measured) ---- */
    const leftIn = (el: HTMLElement) => {
      let x = 0
      let n: HTMLElement | null = el
      while (n && n !== track) {
        x += n.offsetLeft
        n = n.offsetParent as HTMLElement | null
      }
      return x
    }
    type Item = { el: HTMLElement; x: number; w: number }
    const pack = (sel: string): Item[] => Array.from(root.querySelectorAll<HTMLElement>(sel)).map((el) => ({ el, x: 0, w: 0 }))
    const arrivals = pack('.cx-r')
    const depths = pack('[data-rate]').map((it) => ({ ...it, rate: parseFloat(it.el.dataset.rate || '0') }))
    const prints = pack('.cx-print')
    const vids = videos.map((el) => ({ el: el as HTMLElement, x: 0, w: 0, on: false }))
    const reelItems = reels.map((el) => ({ el, x: 0, w: 0 }))
    const spreads = pack('.cx-s')
    const marks = chapters.map((c) => ({ id: c.id, el: root.querySelector<HTMLElement>(`#${CSS.escape(c.id)}`), x: 0 }))
    const notes = Array.from(root.querySelectorAll<HTMLElement>('.cx-notes')).map((el) => ({
      el,
      x: 0,
      w: 0,
      items: Array.from(el.querySelectorAll<HTMLElement>('.cx-note')),
      pics: Array.from(el.querySelectorAll<HTMLElement>('.cx-notes-f')),
      cursor: el.querySelector<HTMLElement>('.cx-agent'),
      at: -1,
      hand: -1,
    }))

    let W = 1
    let trackW = 1
    let travel = 1
    let unit = 16
    const measure = () => {
      unit = 16 * rem()
      W = stage.offsetWidth || 1
      trackW = track.scrollWidth
      travel = Math.max(1, trackW - W)
      run.style.height = `${Math.round(window.innerHeight + travel / SPEED)}px`
      ;[arrivals, depths, prints, vids, reelItems, spreads, notes].forEach((list) =>
        (list as Item[]).forEach((it) => {
          it.x = leftIn(it.el)
          it.w = it.el.offsetWidth
        }),
      )
      marks.forEach((m) => (m.x = m.el ? leftIn(m.el) : 0))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(track)
    ro.observe(stage)

    /* ---- moving the SCROLL to a place in the run ---- */
    const scrollFor = (runX: number) => {
      const top = run.getBoundingClientRect().top + window.scrollY
      return top + clamp(runX, 0, travel) / SPEED
    }
    const goto = (runX: number, immediate = false) => {
      const y = scrollFor(runX)
      const lenis = getLenis()
      if (lenis) lenis.scrollTo(y, immediate ? { immediate: true, force: true } : { duration: 1.3 })
      else window.scrollTo({ top: y, behavior: immediate ? 'auto' : 'smooth' })
    }
    const gotoId = (id: string, immediate = false) => {
      const m = marks.find((k) => k.id === id)
      if (m?.el) goto(m.x, immediate)
    }

    /* THE ISLAND: open and close, jump */
    const setOpen = (on: boolean) => {
      isle.classList.toggle('is-open', on)
      isleBtn.setAttribute('aria-expanded', on ? 'true' : 'false')
    }
    const onIsleBtn = () => setOpen(!isle.classList.contains('is-open'))
    isleBtn.addEventListener('click', onIsleBtn)
    const onIsleLink = (ev: MouseEvent) => {
      const a = (ev.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]')
      if (!a) return
      ev.preventDefault()
      gotoId(a.getAttribute('href')!.slice(1))
      setOpen(false)
    }
    isle.addEventListener('click', onIsleLink)
    const onDocDown = (ev: PointerEvent) => {
      if (!isle.contains(ev.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onDocDown)

    /* the keyboard: arrows step through the spreads; Escape shuts the index */
    let x = 0
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') return setOpen(false)
      if (ev.key !== 'ArrowRight' && ev.key !== 'ArrowLeft') return
      const tag = (ev.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || ev.metaKey || ev.ctrlKey || ev.altKey) return
      const r = run.getBoundingClientRect()
      if (r.top > 1 || r.bottom < window.innerHeight - 1) return
      const starts = spreads.map((s) => Math.min(s.x, travel))
      const next =
        ev.key === 'ArrowRight'
          ? starts.find((s) => s > x + 8)
          : [...starts].reverse().find((s) => s < x - 8)
      if (next === undefined) return
      ev.preventDefault()
      goto(next)
    }
    window.addEventListener('keydown', onKey)

    /* a focused thing off screen: the stage must not side-scroll to it —
       the run goes there instead */
    const onFocus = (ev: FocusEvent) => {
      stage.scrollLeft = 0
      const el = ev.target as HTMLElement
      if (!track.contains(el)) return
      const ex = leftIn(el)
      if (ex < x + 0.08 * W || ex + el.offsetWidth > x + 0.92 * W) goto(ex - W * 0.3)
    }
    track.addEventListener('focusin', onFocus)
    const onStageScroll = () => {
      if (stage.scrollLeft) stage.scrollLeft = 0
    }
    stage.addEventListener('scroll', onStageScroll)

    /* a hand on a note takes it */
    const offs: (() => void)[] = []
    notes.forEach((n) =>
      n.items.forEach((it, i) => {
        const enter = () => (n.hand = i)
        const leave = () => (n.hand = -1)
        it.addEventListener('pointerenter', enter)
        it.addEventListener('pointerleave', leave)
        offs.push(() => {
          it.removeEventListener('pointerenter', enter)
          it.removeEventListener('pointerleave', leave)
        })
      }),
    )

    if (window.location.hash.length > 1) requestAnimationFrame(() => gotoId(window.location.hash.slice(1), true))

    let first = true
    let shear = 0
    let chapter = -1
    let wroteX = -1
    const tick = (_t?: number, deltaTime?: number) => {
      const r = run.getBoundingClientRect()
      const vh = window.innerHeight
      const dt = Math.min(0.05, (deltaTime ?? 16.7) / 1000)
      const want = clamp(-r.top * SPEED, 0, travel)
      const before = x
      if (first) x = want
      else x += (want - x) * (1 - Math.exp(-dt / GLIDE))
      if (Math.abs(want - x) < 0.05) x = want
      const speed = (x - before) / dt
      const lean = clamp(-speed * SHEAR, -SHEAR_MAX, SHEAR_MAX)
      shear += (lean - shear) * (1 - Math.exp(-dt / 0.14))
      if (Math.abs(shear) < 0.002) shear = 0

      const off = r.bottom < -vh * 0.3 || r.top > vh * 1.3
      const lo = x - W * 0.35
      const hi = x + W * 1.35
      const seen = (it: { x: number; w: number }) => it.x + it.w > x && it.x < x + W

      /* the clocks run whether or not the run moved */
      if (!off) {
        reelItems.forEach((it, i) => seen(it) && cutReel(i, dt))
        vids.forEach((v) => {
          const on = seen(v)
          if (on === v.on) return
          v.on = on
          const el = v.el as HTMLVideoElement
          if (on) el.play().catch(() => {})
          else el.pause()
        })
      }

      if (Math.abs(x - wroteX) < 0.05 && !first && shear === 0 && !notes.some((n) => n.hand !== n.at && n.hand >= 0)) return
      wroteX = x
      first = false

      track.style.transform = `translate3d(${(-x).toFixed(1)}px, 0, 0)`
      track.style.setProperty('--cx-shear', `${shear.toFixed(3)}deg`)

      /* ARRIVAL */
      for (const it of arrivals) {
        if (it.x < x + W * 0.94 && !it.el.classList.contains('is-in')) it.el.classList.add('is-in')
      }
      /* DEPTH */
      for (const it of depths) {
        if (it.x + it.w < lo || it.x > hi) continue
        const d = it.x + it.w / 2 - (x + W / 2)
        it.el.style.transform = `translate3d(${(d * it.rate).toFixed(1)}px, 0, 0)`
      }
      for (const it of prints) {
        if (it.x + it.w < lo || it.x > hi) continue
        const d = (it.x + it.w / 2 - (x + W / 2)) / W
        it.el.style.transform = `translate3d(${(-d * PRINT * it.w).toFixed(1)}px, 0, 0)`
      }
      /* THE NOTES: the agent walks them as the spread crosses the screen */
      for (const n of notes) {
        if (n.x + n.w < lo || n.x > hi || !n.items.length) continue
        const t = clamp((x + W * 0.62 - n.x) / Math.max(1, n.w * 0.9), 0, 0.999)
        const to = n.hand >= 0 ? n.hand : Math.floor(t * n.items.length)
        if (to === n.at) continue
        n.at = to
        n.items.forEach((it, i) => it.classList.toggle('is-on', i === to))
        n.pics.forEach((p, i) => p.classList.toggle('is-on', i === to % Math.max(1, n.pics.length)))
        if (n.cursor) {
          const it = n.items[to]
          n.cursor.style.transform = `translate3d(0, ${(it.offsetTop + 0.35 * unit).toFixed(1)}px, 0)`
        }
      }
      /* THE ISLAND */
      const p = x / travel
      isle.style.setProperty('--cx-p', `${(p * 100).toFixed(2)}%`)
      let now = 0
      marks.forEach((m, i) => {
        if (m.el && m.x <= x + W * 0.45) now = i
      })
      if (now !== chapter) {
        chapter = now
        /* one LINE per chapter (1.3rem, .cx-isle-roll span) — a % here is
           of the whole roll, and the first step pushed every title out */
        isleRoll.style.transform = `translate3d(0, ${-now * 1.3}rem, 0)`
        isle.querySelectorAll('.cx-isle-list li').forEach((li, i) => li.classList.toggle('is-on', i === now))
      }
      isle.classList.toggle('is-away', r.bottom < vh * 0.6)
    }
    tick()
    gsap.ticker.add(tick)

    return () => {
      gsap.ticker.remove(tick)
      ro.disconnect()
      offs.forEach((f) => f())
      isleBtn.removeEventListener('click', onIsleBtn)
      isle.removeEventListener('click', onIsleLink)
      document.removeEventListener('pointerdown', onDocDown)
      window.removeEventListener('keydown', onKey)
      track.removeEventListener('focusin', onFocus)
      stage.removeEventListener('scroll', onStageScroll)
      root.classList.remove('is-live')
      run.style.height = ''
      track.removeAttribute('style')
      isleRoll.style.transform = ''
      ;[...depths, ...prints].forEach((it) => (it.el.style.transform = ''))
      notes.forEach((n) => n.cursor && (n.cursor.style.transform = ''))
    }
  }, [chapters])

  return (
    <main ref={ref} className="cx">
      <div className="cx-run">
        <div className="cx-stage">
          <div className="cx-track">{children}</div>

          {/* THE ISLAND — progress, the chapter on show, the index */}
          <nav className="cx-isle k-dark" aria-label="In this case study">
            <div className="cx-isle-panel">
              <ol className="cx-isle-list">
                {chapters.map((c) => (
                  <li key={c.id}>
                    <a href={`#${c.id}`}>{c.title}</a>
                  </li>
                ))}
              </ol>
            </div>
            <div className="cx-isle-bar">
              <button type="button" className="cx-isle-btn" aria-expanded="false" aria-label="Open the index">
                <i className="cx-isle-ring" aria-hidden="true" />
                <span className="cx-isle-now" aria-hidden="true">
                  <span className="cx-isle-roll">
                    {chapters.map((c) => (
                      <span key={c.id}>{c.title}</span>
                    ))}
                  </span>
                </span>
                <svg className="cx-isle-chev" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                  <path d="M4 10 L8 6 L12 10" />
                </svg>
              </button>
              {live ? (
                <a className="cx-isle-live" href={live} target="_blank" rel="noopener noreferrer">
                  Visit site
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                    <path d="M4.5 11.5 L11.5 4.5" />
                    <path d="M6 4.5 L11.5 4.5 L11.5 10" />
                  </svg>
                </a>
              ) : null}
            </div>
          </nav>
        </div>
      </div>
    </main>
  )
}
