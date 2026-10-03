'use client'

import { useEffect, useRef } from 'react'
import { gsap, EASE } from '@/lib/motion-v4'

/**
 * /work — THE CASCADE (2026-09-19, user: a reference frame — rounded
 * cards (square there; 16:10 here, the covers' own shape) stepping
 * down a diagonal, each over the last, the run leaving the screen at
 * both ends, on a flat pale ground — "this is what I want to make the
 * work page like… once opened the page it can be one card full page and
 * smoothly reduce its size to the image reference and then expand to the
 * final state where the cards will show like the image. All smoothly and
 * with a studied flow"). It replaces the work hub from the top: WorkHero
 * (the statement, the slider) is parked, unimported.
 *
 * THE RESTING STATE IS CSS. Every card sits at the stage's centre plus
 * its PLACE's share of one diagonal step (work.css: --wc-w / --wc-h the
 * card, --wc-dx / --wc-dy the step, all fluid), later cards over earlier
 * ones as in the reference. Places are whole numbers, −N/2 … N/2−1, so
 * one card stands exactly at the centre. No JS lands on that picture.
 *
 * THE ENTRANCE, three beats and a breath between each:
 *
 *   1 THE PLATE   (it wears THE OPENING FRAME — a collage of the work,
 *                 user, 2026-09-19 — swapped for its own cover inside
 *                 the draw-in's fast middle; see SWAP_FROM)
 *                 the page opens on ONE card at full bleed — the top of
 *                 the deck (the last card of the run), square corners,
 *                 edge to edge. It holds long enough to be seen as a
 *                 picture, not as a loading state.
 *   2 THE DRAW-IN the plate draws in to card size at the centre: its box
 *                 goes from the viewport to the card's 16:10 while its
 *                 picture stays `cover`, so the site is never squashed,
 *                 the corners round as it shrinks, and the ground arrives
 *                 around it. In-out (EASE.arc): it leaves the edges
 *                 slowly, moves with purpose, and SETTLES — the settle is
 *                 what makes the next beat read as a decision.
 *   3 THE DEAL    the card was the top of a deck all along. It slides
 *                 down the diagonal to the run's far end and the deck
 *                 comes out from under it, each card leaving a beat after
 *                 the one above and stopping short of it — the top card
 *                 leads because it has the furthest to go. Expo-out
 *                 (EASE.glass): fast off the stack, long landing. The
 *                 deck rides a touch small while stacked and comes up to
 *                 size as it spreads, so the spread has depth as well as
 *                 travel.
 *
 * THE GATE. The entrance waits for the plate's picture to decode, and
 * for the page transition to finish (`k-pt-active` on <html>) when the
 * page was reached by a link — playing under the transition's sheet
 * would spend the whole entrance unseen.
 *
 * ─────────────────────────────────────────────────────────────────────
 * THE TRAVEL (2026-09-19, user: "a good interactive way to scroll
 * through the cards" — approved as: the run travels along its own
 * diagonal, endlessly, and the card at the centre is the one in focus).
 *
 * THE PAGE DOES NOT SCROLL — it is one viewport with nothing below it
 * (FooterGate leaves the footer off) — so the hand is read directly:
 * the wheel and the trackpad, a drag (mouse or touch) projected onto the
 * diagonal, the arrow keys, and Tab (a card that takes focus comes to
 * the centre). All of them move one number, `target`, in CARDS; `pos`
 * glides after it, and a card's PLACE is its index less `pos`, WRAPPED
 * into −N/2 … N/2 — the loop. The wrap happens off screen: work.css
 * sizes the step so N of them span more than the screen plus a card.
 * Z-ORDER follows place, not the DOM, or the first card would arrive
 * UNDER the last one each time round.
 *
 *   THE SETTLE   when the hand goes quiet the target eases onto the
 *                nearest whole card — soft, a glide to rest, never a
 *                snap per wheel tick (that is what feels sticky on a
 *                trackpad). A drag let go carries its speed on first.
 *   THE FOCUS    the card at the centre comes up a few percent and the
 *                corner names it, so a touch screen gets the names with
 *                no hover. A card under the pointer names itself instead;
 *                a touched card keeps the name until the next touch.
 *   THE BREATH   the step OPENS with the run's speed and closes again at
 *                rest: a fast hand fans the deck apart. It is the one
 *                move here that makes the hand's speed visible.
 *   THE SPINE    (2026-09-19, user: "make it vertical, taking a good
 *                amount of space") the title stands up the left edge,
 *                bottom to top, sized off the screen's height. The run
 *                only ever touches that edge near the top, fanned open
 *                or not, so the strip is the title's.
 *   THE PULL     a card under the pointer slides up-left from under its
 *                neighbour (CSS, on the card inside the slot — the slot's
 *                transform is the driver's).
 *
 * THE DRIVER. One gsap.ticker subscription; per frame it writes one
 * transform per slot (and a z-index when a place changes). The step is
 * read off a probe sized in the CSS variables, so the layout still has
 * one source. Reduced motion: no entrance, no glide, no breath, no
 * throw — the wheel steps a card at a time. No JS: the cascade, still,
 * every card a link with its project's name, the h1 real text.
 *
 * NEXT: the click-through (the entrance played backwards into the case
 * study).
 */

export type CascadeCard = {
  slug: string
  name: string
  /** service and year; empty when not known yet */
  meta: string
  /** the case study, else the live site; absent = a picture, not a link */
  href?: string
  /** the cover (16:9, the subject near its centre) and its 960w sibling */
  src: string
  small?: string
  /** the cover described, for Google Images and as the link's text
   *  (SEO plan v3: the hub's only words are its alts) */
  alt: string
}

/* ---- the entrance ---- */
/** the plate holds this long before it draws in (s) */
const HOLD = 0.55
/** the draw-in */
const DRAW = 1.25
/** THE SWAP: the opening frame gives way to the plate's own cover across
 *  this share of the draw-in. EASE.arc does nearly all of its travel
 *  between about 0.35 and 0.65 — the box is changing size too fast there
 *  for the eye to hold a picture, so a cross-fade inside that window
 *  reads as the motion itself. By the time the card settles it has been
 *  the cover for a while. */
const SWAP_FROM = 0.36
const SWAP_TO = 0.62
/** the breath between the draw-in and the deal */
const BREATH = 0.16
/** the deal: one card's travel, and the beat between cards */
const DEAL = 1.35
const BEAT = 0.055
/** the deck rides this small while stacked */
const DECK_SCALE = 0.965

/* ---- the travel ---- */
/** wheel pixels that move the run one card */
const WHEEL_PX = 300
/** the run's glide after its target (s) */
const GLIDE = 0.16
/** the hand has gone quiet after this long (ms), and the settle's time
 *  constant (s) */
const IDLE = 130
const SETTLE = 0.24
/** a drag let go carries this many seconds of its speed */
const THROW = 0.3
/** a press becomes a drag past this many px — below it, it is a click */
const SLOP = 6
/** the focus: how much the centred card comes up */
const FOCUS = 0.05
/** the breath: how much the step opens per card/s of speed, and its cap */
const SWELL_K = 0.035
const SWELL_MAX = 0.28

export default function WorkCascade({
  cards,
  title,
  modifier,
  line,
  opener,
}: {
  cards: CascadeCard[]
  title: string
  /** the h1's second line: what the page is, in the words people search
   *  (SEO plan v3, owner-approved 2026-10-03). Set small beside the spine. */
  modifier?: string
  line: string
  /** THE OPENING FRAME: a picture the plate wears at full bleed instead
   *  of its own cover, swapped for the cover mid-draw-in */
  opener?: { src: string; small?: string }
}) {
  const ref = useRef<HTMLElement | null>(null)
  const N = cards.length

  useEffect(() => {
    const root = ref.current
    if (!root) return
    /* THE SLOT is what the drivers move and size; THE CARD inside it
       keeps its own transform for the hand's pull */
    const els = Array.from(root.querySelectorAll<HTMLElement>('.wc-slot'))
    const links = Array.from(root.querySelectorAll<HTMLElement>('.wc-card'))
    const label = root.querySelector<HTMLElement>('.wc-now')
    const words = Array.from(root.querySelectorAll<HTMLElement>('.wc-ent'))
    const spine = root.querySelector<HTMLElement>('.wc-title-m')
    const open = root.querySelector<HTMLImageElement>('.wc-open')
    const stage = root.querySelector<HTMLElement>('.wc-stage')
    const probe = root.querySelector<HTMLElement>('.wc-probe')
    if (!els.length || !stage || !probe) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const offs: (() => void)[] = []
    const on = (
      el: HTMLElement | Window,
      type: string,
      fn: (e: never) => void,
      opts?: AddEventListenerOptions,
    ) => {
      el.addEventListener(type, fn as EventListener, opts)
      offs.push(() => el.removeEventListener(type, fn as EventListener, opts))
    }

    /* ---- the corner: the focused card's name, or the hovered one's ---- */
    let focus = -1
    let hover = -1
    const nameOf = (i: number) => {
      const d = links[i]?.dataset
      return d ? (d.meta ? `${d.name}, ${d.meta}` : `${d.name}`) : ''
    }
    const say = () => {
      if (!label) return
      const i = hover >= 0 ? hover : focus
      if (i >= 0) label.textContent = nameOf(i)
    }
    /* MOUSE: the card under the pointer, while it is under it. TOUCH
       (2026-10-03, owner: "the name appears and disappears very quickly…
       wherever I touch needs to be displayed until I touch somewhere
       else"): a finger enters on touchstart and leaves the moment the drag
       captures it, so the name flashed. A touch NAMES the card it lands on
       and that name stays — through the drag and after it — until the next
       touch names another (or lands off the cards, and the centre card
       speaks again). */
    links.forEach((el, i) => {
      on(el, 'pointerenter', (e: PointerEvent) => {
        if (e.pointerType !== 'mouse') return
        hover = i
        say()
      })
      on(el, 'pointerleave', (e: PointerEvent) => {
        if (e.pointerType !== 'mouse') return
        hover = -1
        say()
      })
    })
    on(
      root,
      'pointerdown',
      (e: PointerEvent) => {
        if (e.pointerType === 'mouse') return
        const card = (e.target as HTMLElement | null)?.closest?.<HTMLElement>('.wc-card')
        hover = card ? links.indexOf(card) : -1
        say()
      },
      { capture: true },
    )

    /* ================= THE TRAVEL ================= */
    let live = false
    let pos = 0
    let target = 0
    let vel = 0
    let spread = 1
    let lastInput = 0
    let dragging = false
    let dx = 0
    let dy = 0
    const zs: number[] = new Array(N).fill(NaN)
    const half = N / 2

    const measure = () => {
      const r = probe.getBoundingClientRect()
      dx = r.width
      dy = r.height
    }
    /** a raw place wrapped into −N/2 … N/2 */
    const wrap = (raw: number) => ((((raw + half) % N) + N) % N) - half

    const render = () => {
      for (let i = 0; i < N; i++) {
        const place = wrap(i - half - pos)
        const near = Math.max(0, 1 - Math.abs(place))
        const sc = 1 + FOCUS * near * near * (3 - 2 * near)
        els[i].style.transform =
          `translate3d(${(place * dx * spread).toFixed(2)}px, ${(place * dy * spread).toFixed(2)}px, 0) scale(${sc.toFixed(4)})`
        const z = Math.round(place * 10) + 100
        if (z !== zs[i]) {
          zs[i] = z
          els[i].style.zIndex = String(z)
        }
      }
      const f = (((Math.round(pos) + half) % N) + N) % N
      if (f !== focus) {
        focus = f
        say()
      }
    }

    const tick = (_t?: number, deltaTime?: number) => {
      if (!live) return
      const dt = Math.min(0.05, (deltaTime ?? 16.7) / 1000)
      const quiet = !dragging && performance.now() - lastInput > IDLE
      if (reduce) {
        pos = target
        spread = 1
        render()
        return
      }
      if (quiet) target += (Math.round(target) - target) * (1 - Math.exp(-dt / SETTLE))
      const prev = pos
      pos += (target - pos) * (1 - Math.exp(-dt / GLIDE))
      vel += ((pos - prev) / dt - vel) * (1 - Math.exp(-dt / 0.12))
      const want = 1 + Math.min(SWELL_MAX, Math.abs(vel) * SWELL_K)
      spread += (want - spread) * (1 - Math.exp(-dt / 0.2))
      /* at rest there is nothing to write */
      if (
        quiet &&
        Math.abs(target - pos) < 0.0004 &&
        Math.abs(spread - 1) < 0.0006 &&
        Math.abs(Math.round(target) - target) < 0.0004
      )
        return
      render()
    }

    const goLive = () => {
      if (live) return
      measure()
      root.classList.add('is-live')
      live = true
      render()
      gsap.ticker.add(tick)
      offs.push(() => gsap.ticker.remove(tick))

      /* the wheel and the trackpad */
      let acc = 0
      on(
        stage,
        'wheel',
        (e: WheelEvent) => {
          e.preventDefault()
          const d = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX
          const px = e.deltaMode === 1 ? d * 32 : d
          lastInput = performance.now()
          if (reduce) {
            acc += px
            if (Math.abs(acc) >= WHEEL_PX * 0.6) {
              target = Math.round(target) + Math.sign(acc)
              acc = 0
            }
            return
          }
          target += px / WHEEL_PX
        },
        { passive: false },
      )

      /* the drag, projected onto the diagonal. No pointer capture until it
         IS a drag: a captured press would steal the click from the card. */
      let pid = -1
      let sx = 0
      let sy = 0
      let st = 0
      let moved = false
      let lt = 0
      let lv = 0
      let dragVel = 0
      on(stage, 'pointerdown', (e: PointerEvent) => {
        if (e.pointerType === 'mouse' && e.button !== 0) return
        pid = e.pointerId
        sx = e.clientX
        sy = e.clientY
        st = target
        moved = false
        lt = performance.now()
        lv = target
        dragVel = 0
      })
      on(window, 'pointermove', (e: PointerEvent) => {
        if (e.pointerId !== pid) return
        const mx = e.clientX - sx
        const my = e.clientY - sy
        if (!moved) {
          if (Math.hypot(mx, my) < SLOP) return
          moved = true
          dragging = true
          root.classList.add('is-dragging')
          try {
            stage.setPointerCapture(pid)
          } catch {}
        }
        /* cards dragged one step down the diagonal are one place further
           on, which is `pos` one less */
        const along = (mx * dx + my * dy) / (dx * dx + dy * dy || 1)
        target = st - along
        const now = performance.now()
        if (now - lt > 16) {
          dragVel = ((target - lv) / (now - lt)) * 1000
          lt = now
          lv = target
        }
        lastInput = now
      })
      const drop = (e: PointerEvent) => {
        if (e.pointerId !== pid) return
        pid = -1
        if (!moved) return
        dragging = false
        root.classList.remove('is-dragging')
        if (!reduce && performance.now() - lt < 90) target += dragVel * THROW
        if (reduce) target = Math.round(target)
        lastInput = performance.now()
      }
      on(window, 'pointerup', drop)
      on(window, 'pointercancel', drop)
      /* the click a drag ends on is not a click */
      on(
        stage,
        'click',
        (e: MouseEvent) => {
          if (!moved) return
          moved = false
          e.preventDefault()
          e.stopPropagation()
        },
        { capture: true },
      )

      /* the keys */
      on(window, 'keydown', (e: KeyboardEvent) => {
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return
        const t = e.target as HTMLElement | null
        if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return
        /* an open dialog owns the keys (the burger's menu is one: the
           arrows moved the deck underneath it) */
        if (document.querySelector('[role="dialog"][aria-hidden="false"]')) return
        let step = 0
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'PageDown') step = 1
        else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'PageUp') step = -1
        if (!step) return
        e.preventDefault()
        target = Math.round(target) + step
        lastInput = performance.now()
      })

      /* Tab: a card that takes focus comes to the centre, by the short way */
      links.forEach((el, i) => {
        on(el, 'focus', () => {
          if (!el.matches(':focus-visible')) return
          const want = i - half
          target = want + Math.round((target - want) / N) * N
          lastInput = performance.now()
        })
      })

      on(window, 'resize', () => {
        measure()
        render()
      })
    }

    if (reduce) {
      root.classList.add('is-done')
      goLive()
      return () => {
        live = false
        offs.forEach((f) => f())
        root.classList.remove('is-done', 'is-live', 'is-dragging')
        els.forEach((el) => {
          el.style.transform = ''
          el.style.zIndex = ''
        })
      }
    }

    /* ================= THE ENTRANCE ================= */
    const top = els[els.length - 1]
    const INLINE = 'transform,width,height,borderRadius'
    let tl: gsap.core.Timeline | null = null
    let dead = false
    /* each slot's way back to the stage's centre; the plate's size (the
       stage) and the card's (what it draws in to) */
    let home: { x: number; y: number }[] = []
    let plate = { w: 0, h: 0, cw: 0, ch: 0 }

    const park = () => {
      gsap.set(els, { clearProps: INLINE })
      const sr = stage.getBoundingClientRect()
      const cx = sr.left + sr.width / 2
      const cy = sr.top + sr.height / 2
      /* the slots centre themselves with margins, not a transform, so a
         rect read here is pure layout and GSAP starts from a clean x/y */
      home = els.map((el) => {
        const r = el.getBoundingClientRect()
        return { x: cx - (r.left + r.width / 2), y: cy - (r.top + r.height / 2) }
      })
      plate = { w: sr.width, h: sr.height, cw: els[0].offsetWidth, ch: els[0].offsetHeight }
      els.forEach((el, i) => gsap.set(el, { x: home[i].x, y: home[i].y, scale: el === top ? 1 : DECK_SCALE }))
      /* the top card is the plate: the whole stage, square corners. A box
         grows from its top-left, so it is walked back by half its growth
         to stay centred — and walked forward again as it draws in. */
      const t = home[els.length - 1]
      gsap.set(top, {
        width: plate.w,
        height: plate.h,
        borderRadius: 0,
        x: t.x - (plate.w - plate.cw) / 2,
        y: t.y - (plate.h - plate.ch) / 2,
      })
      gsap.set(words, { autoAlpha: 0, y: 14 })
      if (open) gsap.set(open, { opacity: 1 })
      /* the spine waits below its own crop */
      if (spine) gsap.set(spine, { yPercent: 101 })
    }

    const play = () => {
      if (dead) return
      park()
      const t = home[els.length - 1]
      const radius = getComputedStyle(els[0]).borderTopLeftRadius

      tl = gsap.timeline({
        onComplete: () => {
          /* hand the layout back to CSS — nothing inline outlives the
             play — and then to the travel, which draws the same picture */
          gsap.set(els, { clearProps: INLINE })
          gsap.set(words, { clearProps: 'all' })
          if (spine) gsap.set(spine, { clearProps: 'transform' })
          if (open) gsap.set(open, { clearProps: 'opacity' })
          root.classList.remove('is-playing')
          root.classList.add('is-done')
          if (!dead) goLive()
        },
      })

      /* 2 — the draw-in */
      tl.to(top, { width: plate.cw, height: plate.ch, x: t.x, y: t.y, borderRadius: radius, duration: DRAW, ease: EASE.arc }, HOLD)

      /* the swap, inside the draw-in's fast middle. Linear: the motion
         around it supplies the curve. */
      if (open) tl.to(open, { opacity: 0, duration: DRAW * (SWAP_TO - SWAP_FROM), ease: 'none' }, HOLD + DRAW * SWAP_FROM)

      /* 3 — the deal: the top card first, the deck after it in order */
      const dealAt = HOLD + DRAW + BREATH
      for (let k = 0; k < N; k++) {
        tl.to(els[N - 1 - k], { x: 0, y: 0, scale: 1, duration: DEAL, ease: EASE.glass }, dealAt + k * BEAT)
      }

      /* the spine rises through its crop — up, the way it reads — as the
         deck spreads; the name arrives as the deck lands */
      if (spine) tl.to(spine, { yPercent: 0, duration: 1.5, ease: EASE.glass }, dealAt + 0.3)
      tl.to(words, { autoAlpha: 1, y: 0, duration: 0.9, ease: EASE.glass, stagger: 0.08 }, dealAt + 0.75)
    }

    /* the corner names the card that will stand at the centre */
    focus = half
    say()

    /* the gate: the plate's picture, then the page transition */
    const ready = (im: HTMLImageElement | null) =>
      im && !im.complete ? im.decode().catch(() => undefined) : Promise.resolve()
    /* BOTH of the plate's pictures: the opening frame it shows, and the
       cover under it — a cover still decoding would make the swap a fade
       to an empty card */
    const decoded = Promise.all([ready(top.querySelector<HTMLImageElement>('img:not(.wc-open)')), ready(open)])
    const html = document.documentElement
    let mo: MutationObserver | null = null
    const afterTransition = new Promise<void>((resolve) => {
      if (!html.classList.contains('k-pt-active')) return resolve()
      mo = new MutationObserver(() => {
        if (html.classList.contains('k-pt-active')) return
        mo?.disconnect()
        resolve()
      })
      mo.observe(html, { attributes: true, attributeFilter: ['class'] })
    })
    /* parked at once, so the first painted frame is already the plate */
    park()
    root.classList.add('is-playing')
    Promise.all([decoded, afterTransition]).then(play)

    return () => {
      dead = true
      live = false
      mo?.disconnect()
      tl?.kill()
      offs.forEach((f) => f())
      gsap.set(els, { clearProps: INLINE })
      els.forEach((el) => (el.style.zIndex = ''))
      gsap.set(words, { clearProps: 'all' })
      if (spine) gsap.set(spine, { clearProps: 'transform' })
      if (open) gsap.set(open, { clearProps: 'opacity' })
      root.classList.remove('is-playing', 'is-done', 'is-live', 'is-dragging')
    }
  }, [N])

  return (
    <section className="wc" ref={ref} style={{ '--wc-n': N } as React.CSSProperties} aria-labelledby="wc-h">
      {/* data-lenis-prevent: the smooth scroller leaves this stage's wheel
          alone — the page has nowhere to scroll and the travel reads it */}
      <div className="wc-stage" data-lenis-prevent>
        <ul className="wc-run">
          {cards.map((c, i) => (
            <li key={c.src} className="wc-slot" style={{ '--i': i } as React.CSSProperties}>
              {(() => {
                const last = i === cards.length - 1
                /* a cover is shown at the card's width; the plate is the
                   whole screen. All eager: the loop brings every card on
                   screen, and a lazy one would arrive empty. */
                const img = (
                  <img
                    src={c.src}
                    srcSet={c.small ? `${c.small} 960w, ${c.src} 1690w` : undefined}
                    sizes={last ? '100vw' : '(max-aspect-ratio: 1/1) 62vw, 36vw'}
                    alt={c.alt}
                    width={1690}
                    height={930}
                    loading="eager"
                    fetchPriority={last && !opener ? 'high' : undefined}
                    decoding="async"
                    draggable={false}
                  />
                )
                /* the opening frame rides over the plate's own cover */
                const over =
                  last && opener ? (
                    <img
                      className="wc-open"
                      src={opener.src}
                      srcSet={opener.small ? `${opener.small} 960w, ${opener.src} 1672w` : undefined}
                      sizes="100vw"
                      alt=""
                      width={1672}
                      height={941}
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                      draggable={false}
                    />
                  ) : null
                return c.href ? (
                  <a className="wc-card" href={c.href} data-name={c.name} data-meta={c.meta} draggable={false}>
                    {img}
                    {over}
                  </a>
                ) : (
                  <div className="wc-card" role="img" aria-label={c.name} data-name={c.name} data-meta={c.meta}>
                    {img}
                    {over}
                  </div>
                )
              })()}
            </li>
          ))}
        </ul>
        {/* the step, as a box: its width is --wc-dx and its height
            --wc-dy, so the travel reads the layout's own numbers */}
        <span className="wc-probe" aria-hidden="true" />

        <div className="wc-words">
          {/* THE SPINE: the title stands up the left edge. Three boxes, one
              job each — the h1 is the crop, the mover is what the entrance
              slides (GSAP never meets the rotation), the inner is turned */}
          <h1 className="wc-title" id="wc-h">
            <span className="wc-title-m">
              <span className="wc-title-t">
                {title}
                {modifier ? <> <span className="wc-title-mod">{modifier}</span></> : null}
              </span>
            </span>
          </h1>
          <p className="wc-now wc-ent" aria-live="polite">
            {line}
          </p>
        </div>
      </div>
    </section>
  )
}
