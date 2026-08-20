'use client'

import { useEffect, useRef } from 'react'
import ArrowLink from '@/components/v4/ArrowLink'
import Button from '@/components/v4/Button'
import { getLenis } from '@/components/v4/SmoothScroll'
import { SERVICES, Letters } from '@/components/v4/services-data'
import { gsap } from '@/lib/motion-v4'

/**
 * SECTION 4 — WHAT WE DO: THE THRESHOLD (user-directed 2026-08-19, from the
 * `services_pinned_sections*.png` drafts; replaces the accordion, which stays
 * in the tree at ServicesAccordion.tsx for comparison).
 *
 * ONE HAIRLINE RUNS THE WHOLE SECTION, AND IT IS A MEMBRANE.
 *
 *   ┌───────────────────────────────────────────────┐
 *   │                    Everything a site needs to │  the headline, right,
 *   │              the [▓ live thumbnail ▓] story   │  with the hero's pill
 *   │  ┌──────────────┐                             │
 *   │  │  the picture │                    ⌗ glyph  │
 *   │  │              │              WEB DESIGN     │  the ACTIVE service
 *   ├──┴──────────────┴─────────────────────────────┤ ←── THE MEMBRANE
 *   │  WEB DEVELOPMENT      the paragraph, the       │  the QUEUE, and the
 *   │  ONE-PAGE WEBSITES    three includes, the      │  service's own detail
 *   │  WEBSITE REDESIGN     one button out           │
 *   └───────────────────────────────────────────────┘
 *
 * Below the line, left, the services that have not had their turn yet. Above
 * the line, right, the one that has. Scroll and the queue rises: the top name
 * slides UP under the hairline, and the same name surfaces on the OTHER SIDE
 * of it, right-aligned, as the active title (the user's note: "it goes under
 * the line and appears on the opposite side"). Two masks meeting at one y is
 * the whole trick — the queue is clipped at its top edge, the title slot at
 * its bottom edge, and the hairline sits exactly between them.
 *
 * Everything else follows that clock. The picture wipes upward into the frame
 * (the same direction the name travelled), the thumbnail inside the HEADLINE
 * wipes with it — so the sentence "carry the [thing] story" is always naming
 * the service you are on — the paragraph and its three includes rise, and the
 * service's hairline glyph draws itself in beside the title.
 *
 * SCRUB, NOT PLAYBACK (house rule, see ProjectSheets): every value here is a
 * pure function of scroll progress, so the section runs backwards exactly as
 * well as forwards. No timeline plays on its own.
 *
 * THE LAST BEAT. When the final name leaves the queue the column would empty,
 * so the hub link rides up in its place — the list literally ends in the link.
 * That keeps architecture §8's rule (rows are not routes; ONE link fans out),
 * while the per-service button stays what the accordion made it: the hub,
 * anchored at that service.
 *
 * MICRO-INTERACTIONS. A queued name letter-fills to ink under the pointer and
 * its rule draws in; clicking one scrolls the page to that service's slot, so
 * the queue is a table of contents for a scroll it does not otherwise let you
 * skip. The picture leans a few px toward the cursor, the hero's grammar.
 *
 * FALLBACK. Without JS, on a phone, or under reduced motion the pin never
 * arms and the section becomes six labelled blocks — heading, picture, copy,
 * includes, link — with the queue hidden (it would only repeat the headings)
 * and the hub link kept. Every word is server-rendered text either way.
 *
 * CSS in home.css (.wt-*); glyph drawing keeps the shared .wd-glyph classes.
 */

/** viewport-heights of scroll per beat — one beat per service */
const SEG_VH = 70
/** the share of a beat spent CROSSING. The rest is rest: six held
 *  compositions with a move between them, not a constant crawl. */
const CROSS = 0.42
const HALF = CROSS / 2

const N = SERVICES.length

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)
/** the crossing's shape. Eased, but still a pure function of scroll — drag
 *  back up and the name goes back under the line. */
const smooth = (x: number) => {
  const c = clamp01(x)
  return c * c * (3 - 2 * c)
}

export default function ServicesThreshold() {
  const rootRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(min-width: 57.5rem)').matches) return

    const stage = root.querySelector<HTMLElement>('.wt-stage')
    const track = root.querySelector<HTMLElement>('.wt-queue-track')
    const line = root.querySelector<HTMLElement>('.wt-line-fill')
    const frame = root.querySelector<HTMLElement>('.wt-frame')
    if (!stage || !track || !frame) return

    // the hub link rides in the same track but is not a service
    const rows = Array.from(track.querySelectorAll<HTMLElement>('.wt-q-row:not(.wt-q-end)'))
    const titles = Array.from(root.querySelectorAll<HTMLElement>('.wt-now-i'))
    const shots = Array.from(root.querySelectorAll<HTMLElement>('.wt-shot'))
    const chips = Array.from(root.querySelectorAll<HTMLElement>('.wt-chip'))
    const dets = Array.from(root.querySelectorAll<HTMLElement>('.wt-det'))
    const glyphs = Array.from(root.querySelectorAll<HTMLElement>('.wt-glyph'))
    if (rows.length !== N) return

    /* arm the pin. Unstyled until now, so every fallback above keeps the
       plain stacked section it server-rendered. */
    root.classList.add('is-scrub')
    root.style.height = `${N * SEG_VH + 100}vh`

    /** the queue's row pitch, measured (it is em-based and fluid) */
    let pitch = 0
    const measure = () => {
      pitch = rows.length > 1 ? rows[1].offsetTop - rows[0].offsetTop : rows[0].offsetHeight
    }
    measure()
    window.addEventListener('resize', measure)

    // ---- pointer parallax on the picture: it leans, it does not track ----
    const inner = frame.querySelector<HTMLElement>('.wt-frame-in')
    let tx = 0
    let ty = 0
    let px = 0
    let py = 0
    const onMove = (e: PointerEvent) => {
      const r = frame.getBoundingClientRect()
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2
    }
    frame.addEventListener('pointermove', onMove)
    frame.addEventListener('pointerleave', () => {
      tx = 0
      ty = 0
    })

    /**
     * THE ONE FUNCTION, AND THE ONE GESTURE.
     *
     * `t` is the beat: service i owns t ∈ [i, i + 1). Inside a beat, only the
     * FIRST `CROSS` of it moves — that is the crossing, when name i goes under
     * the membrane and surfaces above it. The rest of the beat is rest, so the
     * section reads as six held compositions rather than a constant crawl. The
     * ramp is a smoothstep, but it is still a pure function of scroll: drag
     * backwards and the name goes back under the line.
     *
     * Everything above is welded to that one number. The queue rises exactly
     * one row, the title rolls up exactly one slot, the previous title rolls
     * out the top, and the picture wipes — all on `cross`, all at once. If any
     * of them had its own window the same name would be visible twice, once
     * half-eaten by the line and once whole above it, which is what the first
     * pass did and it read as a bug.
     *
     * Service 0 is the exception, and deliberately: its picture and copy are
     * the section's opening state (the user's first draft frame), so only its
     * NAME performs the crossing. Nothing wipes in over an empty frame.
     */
    const write = (t: number) => {
      const k = Math.floor(t)
      /** where we are inside this beat's crossing, 0..1 */
      const g = (u: number) => clamp01((u - Math.floor(u)) / CROSS)

      /* UNDER FIRST, THEN OUT THE OTHER SIDE. The queue's name finishes going
         under the line in the first ~60% of the crossing, and the title only
         starts surfacing at 45%. Running them together looked right in theory
         (one object inside the membrane) and wrong on screen: two halves of
         the same word, at two different x, read as two copies of it. The
         user's own description is a sequence — "it goes under the line AND
         appears on the opposite side". */
      track.style.transform = `translate3d(0, ${
        -(k + smooth(g(t) / 0.6)) * pitch
      }px, 0)`

      // the slot: name i surfaces in the back half of its own crossing, and
      // the one before it has already rolled out the top in the front half
      titles.forEach((el, i) => {
        const u = t - i
        const y =
          u < 0
            ? 100
            : u < 1
              ? (1 - smooth((g(u) - 0.45) / 0.55)) * 100
              : u < 2
                ? -smooth(g(u) / 0.5) * 100
                : -100 /* g() cycles per beat; past its exit the slot is done */
        el.style.transform = `translate3d(0, ${y}%, 0)`
      })

      // the pictures are a STACK OF WIPES on the same clock: each rises over
      // the last, so nothing has to be faded out and the frame is never empty
      const wipe = (i: number) => (i === 0 ? 1 : smooth((t - i) / CROSS))
      shots.forEach((el, i) => {
        const e = wipe(i)
        el.style.clipPath = `inset(${(1 - e) * 100}% 0 0 0)`
        el.style.transform = `translate3d(0, ${(1 - e) * 4}%, 0) scale(${1 + (1 - e) * 0.05})`
      })
      chips.forEach((el, i) => {
        el.style.clipPath = `inset(${(1 - wipe(i)) * 100}% 0 0 0)`
      })

      /* The copy HANDS OVER, it does not cross-fade. The outgoing block clears
       * in the first half of the crossing and the incoming one arrives in the
       * second, so the two are never both legible — two paragraphs at half
       * strength on top of each other read as a rendering fault, which is what
       * the first pass looked like. The per-line stagger inside a block is
       * CSS's job: it reads --v and offsets each line by its own --k. */
      dets.forEach((el, i) => {
        const u = t - i
        const inn = i === 0 ? 1 : smooth((u - HALF) / HALF)
        const out = smooth((u - 1) / HALF)
        const v = inn * (1 - out)
        el.style.setProperty('--v', String(v))
        el.style.pointerEvents = v > 0.6 ? 'auto' : 'none'
        el.setAttribute('aria-hidden', v > 0.6 ? 'false' : 'true')
      })

      // the glyph belongs to the title, so it keeps the title's clock: it
      // draws itself in as the name surfaces and clears as the name leaves
      glyphs.forEach((el, i) => {
        const u = t - i
        const e = smooth(u / CROSS)
        const out = smooth((u - 1) / HALF)
        el.style.setProperty('--draw', String(100 - e * 100))
        el.style.opacity = String(e * (1 - out))
      })

      // the membrane doubles as the clock for a scroll the visitor cannot see
      // the end of
      if (line) line.style.transform = `scaleX(${clamp01(t / (N + 1))})`
    }

    const update = () => {
      const rect = root.getBoundingClientRect()
      const span = rect.height - window.innerHeight
      if (span > 0) {
        const p = clamp01(-rect.top / span)
        write(Math.min(p * N, N - 0.0001))
      }
      if (inner) {
        px += (tx - px) * 0.06
        py += (ty - py) * 0.06
        inner.style.transform = `translate3d(${px * 12}px, ${py * 10}px, 0) scale(1.06)`
      }
    }
    update()
    gsap.ticker.add(update)

    /* the queue as a table of contents: a name jumps the page to its beat */
    const seek = (i: number) => {
      const span = root.offsetHeight - window.innerHeight
      // mid-beat, so the jump lands on the composition, not on its crossing
      const y = root.offsetTop + (span * (i + 0.6)) / N
      const lenis = getLenis()
      if (lenis) lenis.scrollTo(y, { duration: 1.1 })
      else window.scrollTo({ top: y, behavior: 'smooth' })
    }
    const onClick = (e: Event) => {
      const btn = (e.target as HTMLElement).closest<HTMLElement>('.wt-q')
      if (!btn) return
      seek(Number(btn.dataset.i))
    }
    track.addEventListener('click', onClick)

    return () => {
      gsap.ticker.remove(update)
      window.removeEventListener('resize', measure)
      frame.removeEventListener('pointermove', onMove)
      track.removeEventListener('click', onClick)
      root.classList.remove('is-scrub')
      root.style.height = ''
      track.style.transform = ''
      if (line) line.style.transform = ''
      ;[...titles, ...shots, ...chips, ...dets, ...glyphs].forEach((el) => {
        el.style.cssText = ''
      })
    }
  }, [])

  return (
    <section ref={rootRef} className="wt" aria-labelledby="wt-head">
      <div className="wt-stage">
        <div className="k-page wt-grid">
          {/* ---- the headline, right-aligned, carrying a live thumbnail ---- */}
          <h2 id="wt-head" className="wt-head t-h1">
            <span className="sr-only">
              Everything a site needs to carry the story.
            </span>
            <span aria-hidden="true" className="wt-head-in">
              <span className="wt-head-l">
                Everything a site needs to <b>carry</b>
              </span>
              <span className="wt-head-l">
                <b>the</b>{' '}
                {/* the hero's pill again, and it is live: whichever service
                    you are on is the picture inside the sentence */}
                <span className="wt-headpill">
                  {SERVICES.map((s, i) => (
                    <span key={s.slug} className="wt-chip" style={{ zIndex: i }}>
                      <img src={s.image} alt="" loading="lazy" />
                    </span>
                  ))}
                </span>{' '}
                <b>story</b>
              </span>
            </span>
          </h2>

          {/* ---- above the membrane ---- */}
          <div className="wt-upper">
            <div className="wt-frame">
              <div className="wt-frame-in">
                {SERVICES.map((s, i) => (
                  <figure key={s.slug} className="wt-shot" style={{ zIndex: i }}>
                    <img
                      src={s.image}
                      alt={s.name}
                      width={s.w}
                      height={s.h}
                      loading={i === 0 ? 'eager' : 'lazy'}
                    />
                  </figure>
                ))}
              </div>
              <span className="wt-frame-edge" aria-hidden="true" />
            </div>

            <div className="wt-now">
              <div className="wt-glyphs" aria-hidden="true">
                {SERVICES.map((s, i) => (
                  <span key={s.slug} className="wt-glyph" style={{ zIndex: i }}>
                    {s.glyph}
                  </span>
                ))}
              </div>
              {/* the slot: clipped at its BOTTOM edge, which is the hairline */}
              <div className="wt-nowname" aria-hidden="true">
                {SERVICES.map((s) => (
                  <span key={s.slug} className="wt-now-i">
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ---- THE MEMBRANE ---- */}
          <div className="wt-line" aria-hidden="true">
            <i className="wt-line-fill" />
          </div>

          {/* ---- below the membrane ---- */}
          <div className="wt-lower">
            {/* clipped at its TOP edge, which is the same hairline */}
            <div className="wt-queue">
              <ul className="wt-queue-track">
                {SERVICES.map((s, i) => (
                  <li key={s.slug} className="wt-q-row">
                    <button type="button" className="wt-q" data-i={i}>
                      <span className="sr-only">{s.name}</span>
                      <span className="wt-q-t">
                        <Letters text={s.name} />
                      </span>
                      <i className="wt-q-rule" aria-hidden="true" />
                    </button>
                  </li>
                ))}
                {/* rides up into the column the last name just left */}
                <li className="wt-q-row wt-q-end">
                  <ArrowLink href="/services">All services</ArrowLink>
                </li>
              </ul>
            </div>

            <div className="wt-detail">
              {SERVICES.map((s, i) => (
                <div key={s.slug} className="wt-det" style={{ zIndex: i }}>
                  {/* the fallback's heading. Pinned, the title slot above the
                      membrane does this job and this is hidden; unpinned it is
                      what makes the stack read as six labelled services rather
                      than a list of names and a separate list of paragraphs. */}
                  <h3 className="wt-det-h">{s.name}</h3>
                  {/* --k is the line's place in the block; the CSS turns it
                      into a stagger against the block's own --v */}
                  <p className="wt-para t-body" style={{ '--k': 0 } as React.CSSProperties}>
                    {s.para}
                  </p>
                  <ul className="wt-inc">
                    {s.includes.map((line, k) => (
                      <li key={line} style={{ '--k': k + 1 } as React.CSSProperties}>
                        <i aria-hidden="true" />
                        {line}
                      </li>
                    ))}
                  </ul>
                  <div className="wt-cta" style={{ '--k': 4 } as React.CSSProperties}>
                    <Button ghost href={`/services#${s.slug}`}>
                      {s.name}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
