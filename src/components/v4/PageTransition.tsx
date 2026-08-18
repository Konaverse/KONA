'use client'

import { useCallback, useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { gsap, EASE, DUR } from '@/lib/motion-v4'
import { getLenis } from './SmoothScroll'

/**
 * The page transition. Checklist §5.
 *
 * ── THE MOVE ────────────────────────────────────────────────────────────────
 *
 * The incoming page slides UP AND OVER the outgoing one, like a sheet laid on
 * top of another sheet. The outgoing page does not get out of the way — it
 * drifts up and left a short distance, darkening, and is buried.
 *
 * Getting that layering backwards is what made the first two attempts wrong.
 * v1 raised a blank white sheet instead of the real incoming page. v2 showed
 * the real page but put the OUTGOING one on top at z-index 90, so the incoming
 * page was hidden behind a slab that drifted 20% of the viewport and then
 * vanished. Proof it is the other way round, from frame 57 of the reference:
 * the outgoing heading has travelled up to y≈165, so that page's own bottom
 * edge is near y≈630 — yet the seam between the two pages is at y≈272. The
 * outgoing page still occupies 272→630 and you cannot see it, because the
 * incoming page is over it.
 *
 * ── WHERE THE NUMBERS COME FROM ─────────────────────────────────────────────
 *
 * Measured off `page transition.mp4` (1918x900, 30fps), not chosen:
 *
 *   • incoming: its top edge tracked per frame per column by max-gradient with
 *     a robust line fit — that yields both its rise and its tilt;
 *   • outgoing: tracked by ZNCC template-matching on its "Fluid Glass" heading.
 *     An earlier attempt matched a mid-page patch and returned garbage after
 *     frame 55 because the incoming page covered it — the heading survives
 *     above the seam to ~frame 64, which is why it is the anchor;
 *   • darkening: luminance ratio of that same heading patch.
 *
 *   duration   ~0.68s        (spec said --d-cinema 1.4s: twice too slow)
 *   easing     EASE.page     (spec said --e-arc, the WORST fitting of the four
 *                             tokens on this data — rms 0.43 vs 0.02)
 *   incoming   rises a full viewport, tilt +2.2deg -> 0, LEFT corner high
 *   outgoing   up ~31%, left ~5%, rotating to -2.2deg, dimming to ~50%
 *   lead       outgoing starts ~130ms before the incoming
 *
 * ── WHY THIS IS A CLONE, AND WHAT EXOAPE ACTUALLY DOES ──────────────────────
 *
 * Exoape is Nuxt/Vue, where Vue Router's <Transition> keeps the leaving and
 * entering page components BOTH MOUNTED during a transition. Two real pages on
 * screen is native there. React's App Router unmounts the old route the moment
 * the new one commits, so it has to be faked: the outgoing page is captured
 * with cloneNode into a fixed, viewport-sized clip window offset by the scroll
 * position, and that clone is what drifts away.
 *
 * The browser-native equivalent in React is the View Transitions API, which
 * snapshots both pages and composites them on the GPU — and whose default
 * paint order is already new-above-old. It is the better long-term answer and
 * is logged as §5.10; it is not used yet because it is still behind
 * `experimental.viewTransition` in Next 16.
 */

/** Every route inside app/(v4). ADD NEW V4 ROUTES HERE — see the warn below. */
export const V4_ROUTES = ['/', '/design-system', '/work', '/hero-object']

const isV4Route = (path: string) =>
  V4_ROUTES.some((r) => path === r || path.startsWith(`${r}/`))

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* ── constants ──────────────────────────────────────────────────────────────
 * Geometry is measured off the reference; the FEEL is the user's, decided
 * watching the working move (2026-08-16), and overrides the measurement
 * where the two disagree:
 *   · duration 1s and EASE.arc (slow in, fast middle, soft landing) — the
 *     measurement said 0.68s fast-start; it read as a lag, not a gesture.
 *     Ironically --e-arc is what the choreography doc specified first.
 *   · NO lead — the measured 130ms offset is dropped. Both sheets run the
 *     same curve over the same second, one locked system.
 *   · both sheets breathe: outgoing swells toward you as it is buried,
 *     incoming arrives slightly swollen and settles to rest.
 */
/** Incoming enters at +TILT and settles to 0; outgoing leaves at -TILT.
 *  Positive = clockwise = LEFT top corner higher. */
const TILT = 2.2
/** Outgoing drift, as a fraction of the viewport. */
const OUT_RISE = 0.31
const OUT_DRIFT = 0.05
/** Black over the outgoing page by the time it is buried — reached
 *  PROGRESSIVELY, on the same curve as the motion: fully visible at the
 *  first frame, darkest just as it disappears. The reference dims a DARK
 *  photo page to ~50% of its luminance; 50% black on a white page reads as
 *  a concrete slab (the first recording proved it), so Whiteout takes a
 *  fraction of the value. */
const OUT_DIM = 0.18
/** The outgoing page swells toward the viewer as it is buried. */
const OUT_SCALE = 1.05
/** Overscale on the incoming page while it is tilted. A viewport-sized rect
 *  rotated 2.2deg no longer covers the viewport corners — the gap runs to
 *  ~(w/2)·sin(2.2°) ≈ 37px — so without this you get slivers of the outgoing
 *  page down the edges. Settles to 1 as the tilt settles to 0, which also
 *  reads as the arriving page zooming out into place. */
const IN_SCALE = 1.06

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  const viewRef = useRef<HTMLDivElement>(null)
  const ghostRef = useRef<HTMLDivElement | null>(null)
  const pendingRef = useRef<string | null>(null)
  /** Scroll offset at click time — the ghost pivot needs it after commit. */
  const scrollYRef = useRef(0)
  const seenPathRef = useRef(pathname)
  const failsafeRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const prefetched = useRef<Set<string>>(new Set())

  /** Back to rest: drop the ghost, un-transform and un-layer the view. */
  const cleanup = useCallback(() => {
    pendingRef.current = null
    if (ghostRef.current) {
      ghostRef.current.remove()
      ghostRef.current = null
    }
    const view = viewRef.current
    if (view) {
      gsap.set(view, { clearProps: 'all' })
      view.classList.remove('is-moving')
    }
    document.documentElement.classList.remove('k-pt-active')
    getLenis()?.start()
  }, [])

  /* ── Exit: freeze the outgoing page, park the incoming below the fold ──── */
  const go = useCallback(
    (dest: string) => {
      if (pendingRef.current) return // one at a time
      const view = viewRef.current
      if (!view || prefersReducedMotion()) {
        router.push(dest) // §5.5 — instant cut
        return
      }
      pendingRef.current = dest

      const vh = window.innerHeight
      const scrollY = window.scrollY || document.documentElement.scrollTop || 0
      scrollYRef.current = scrollY

      const ghost = document.createElement('div')
      ghost.className = 'k-pt__ghost'
      ghost.setAttribute('aria-hidden', 'true')
      // There are briefly two copies of every link on the page.
      ;(ghost as HTMLElement & { inert: boolean }).inert = true

      const inner = document.createElement('div')
      inner.className = 'k-pt__ghost-inner'
      inner.style.top = `${-scrollY}px`
      const clone = view.cloneNode(true) as HTMLElement
      /* Below the fold the clone's reveals never fired (the IO belongs to the
       * live elements), so as the page lifts and its lower content slides into
       * the window, that content would be blank. The ghost is a still: show
       * everything, final-state. Freshly inserted nodes don't replay their
       * transitions, so this cannot flash.
       *
       * The inline styles are a frame-budget fix, not belt and braces: a
       * revealed element's computed filter is blur(0px), which is still a
       * filter — one compositing layer per element, hundreds of them, on a
       * clone that only needs to be a flat picture sliding under the incoming
       * page. Flattening these is what buys the 60fps. */
      clone.querySelectorAll<HTMLElement>('.k-reveal').forEach((el) => {
        el.classList.add('is-in', 'is-done')
        el.style.opacity = '1'
        el.style.filter = 'none'
        el.style.transform = 'none'
        el.style.transition = 'none'
        el.style.willChange = 'auto'
      })
      inner.appendChild(clone)

      const dim = document.createElement('div')
      dim.className = 'k-pt__dim'

      ghost.append(inner, dim)
      /* INSIDE .k-root, not on body: the ghost must inherit the v4 cascade.
       * Parented to body it sits in the LEGACY site's scope and the clone's
       * text re-resolves to the dark theme's near-white — the entire outgoing
       * page went pale mid-transition until this moved. */
      ;(view.parentElement ?? document.body).appendChild(ghost)
      ghostRef.current = ghost

      document.documentElement.classList.add('k-pt-active')
      getLenis()?.stop()

      /* The live view is lifted ABOVE the ghost and parked a full viewport
       * below the fold. It still holds the OLD content at this instant, but it
       * is off screen, and the ghost in front of it is a pixel-identical copy
       * of what was just there — so the swap is invisible. When the route
       * commits, this same element already holds the new page at the right
       * starting position and only has to travel. */
      view.classList.add('is-moving')
      /* vh + scrollY, not vh: the view's rendered top sits at -scrollY, so a
       * bare vh only clears the fold when the page was at the top. Parked from
       * 1400px deep, y:vh left the whole view ON screen, over the ghost,
       * showing a region of the old page 900px above the one just frozen —
       * including sections whose reveals had never fired: a blank page with
       * two hairlines, for the entire commit wait. This offset lands the top
       * edge exactly at the fold for ANY scroll; after the commit resets
       * scroll to 0 the enter tween re-bases to a plain vh. */
      gsap.set(view, { y: vh + scrollY, rotate: 0, scale: 1 })

      /* NOTHING animates yet. The ghost's tween starts alongside the enter
       * tween once the route commits, so the 130ms lead is a designed number
       * rather than a measure of network latency — v3 started the ghost here
       * at click, and a ~370ms dev-mode commit meant the outgoing page had
       * all but finished leaving before the incoming one moved: two moves in
       * sequence instead of one gesture. The freeze between click and commit
       * is fine; the reference recording itself holds ~0.3s before anything
       * moves, because exoape too waits for the next page to be ready. */
      router.push(dest)
      /* If the route never commits — 404, a throw in a server component, a push
       * the router coalesces away — the enter effect never runs. */
      failsafeRef.current = setTimeout(cleanup, 4000)
    },
    [router, cleanup],
  )

  /* ── Intercept ────────────────────────────────────────────────────────────
   * Delegated on `document`, not on the wrapper, because the aperture menu is
   * the primary navigation and renders as a SIBLING of this component — its
   * clicks never bubble through here. Listening on the document also means
   * Button, ArrowLink and the menu all get the transition without a single
   * call site changing: they all render a plain <a>.
   */
  useEffect(() => {
    const resolve = (el: EventTarget | null) => {
      const a = (el as HTMLElement | null)?.closest?.('a')
      if (!a || a.hasAttribute('download')) return null
      if (a.target && a.target !== '_self') return null
      if (!a.getAttribute('href')) return null
      let url: URL
      try {
        url = new URL(a.href, window.location.href)
      } catch {
        return null
      }
      if (url.origin !== window.location.origin) return null
      return url
    }

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return

      const url = resolve(e.target)
      if (!url) return
      if (url.pathname === window.location.pathname) return

      if (!isV4Route(url.pathname)) {
        /* A route that lives in app/(v4) but is missing from V4_ROUTES looks
         * identical from in here, and that is exactly how this stops running
         * with no symptom. It already happened once: the aperture menu's "Work"
         * pointed at the legacy /projects. */
        if (process.env.NODE_ENV !== 'production') {
          console.warn(
            `[k-pt] no transition for "${url.pathname}" — not in V4_ROUTES. ` +
              `If that route lives in app/(v4), add it there; if it is a legacy ` +
              `route, this is expected.`,
          )
        }
        return
      }

      e.preventDefault()
      go(url.pathname + url.search)
    }

    /* Prefetch on intent, so the commit is effectively free and the 130ms lead
     * below stays a designed number rather than a measure of network latency. */
    const onIntent = (e: Event) => {
      const url = resolve(e.target)
      if (!url || !isV4Route(url.pathname)) return
      if (prefetched.current.has(url.pathname)) return
      prefetched.current.add(url.pathname)
      router.prefetch(url.pathname)
    }

    document.addEventListener('click', onClick)
    document.addEventListener('pointerover', onIntent)
    document.addEventListener('focusin', onIntent)
    return () => {
      document.removeEventListener('click', onClick)
      document.removeEventListener('pointerover', onIntent)
      document.removeEventListener('focusin', onIntent)
    }
  }, [go, router])

  /* ── Enter: the new page rides up over the old one and straightens ─────── */
  useEffect(() => {
    if (pathname === seenPathRef.current) return
    seenPathRef.current = pathname

    if (failsafeRef.current) {
      clearTimeout(failsafeRef.current)
      failsafeRef.current = null
    }

    const dest = pendingRef.current
    if (!dest) return // a navigation we did not drive (back button, etc.)

    const view = viewRef.current
    if (!view) {
      cleanup()
      return
    }

    /* §5.3 — Lenis owns scrolling, so without this the incoming route arrives
     * at the OUTGOING route's offset. Safe to do bluntly here: the view is
     * parked below the fold and the ghost covers the viewport. */
    const lenis = getLenis()
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true })
    else window.scrollTo(0, 0)

    const vh = window.innerHeight
    const vw = window.innerWidth

    let done = false
    const finish = () => {
      if (done) return
      done = true
      cleanup()
    }

    /* One timeline, starting NOW, at commit. Everything in it — both sheets
     * and the dim — sits at position 0 on the SAME curve over the SAME second:
     * one locked system, not two animations that happen to overlap. (The
     * measured 130ms lead was tried and dropped; see the constants block.)
     *
     * The rotation pivots on the VIEWPORT's centre, not the element's. The page
     * is taller than the viewport, so spinning it about its own middle would
     * swing the visible top wildly; scroll is 0 here, so vh/2 down the element
     * is the centre of what you can actually see — it turns like a card. */
    const tl = gsap.timeline({ onComplete: finish })
    const ghost = ghostRef.current
    if (ghost) {
      /* The INNER moves, never the window. The ghost is a fixed viewport-sized
       * clip; sliding the window itself up exposed a strip of bare background
       * under its bottom edge for the whole ride. Sliding the full-height clone
       * inside the window means the outgoing page's below-the-fold content
       * rises into view instead — the page keeps going, like a real sheet.
       * The pivot is the centre of what was on screen at click time, expressed
       * in the clone's own coordinates (hence the scroll offset). */
      const inner = ghost.querySelector('.k-pt__ghost-inner')
      if (inner) {
        tl.to(
          inner,
          {
            y: -vh * OUT_RISE,
            x: -vw * OUT_DRIFT,
            rotate: -TILT,
            scale: OUT_SCALE,
            transformOrigin: `50% ${scrollYRef.current + vh / 2}px`,
            duration: DUR.page,
            ease: EASE.arc,
          },
          0,
        )
      }
      /* Same curve as the motion, so the darkening IS the movement: fully
       * visible while the sheets are still gathering speed, darkest exactly
       * as the page is buried. */
      const dim = ghost.querySelector('.k-pt__dim')
      if (dim) tl.to(dim, { opacity: OUT_DIM, duration: DUR.page, ease: EASE.arc }, 0)
    }
    tl.fromTo(
      view,
      {
        y: vh,
        rotate: TILT,
        scale: IN_SCALE,
        transformOrigin: `50% ${vh / 2}px`,
        willChange: 'transform',
      },
      { y: 0, rotate: 0, scale: 1, duration: DUR.page, ease: EASE.arc },
      0,
    )
    /* The seam shadow (the ::before on .is-moving) fades in over the slow
     * first stretch instead of popping onto the bottom edge at click —
     * GSAP tweens the CSS variable the pseudo-element's opacity reads. */
    tl.fromTo(
      view,
      { '--k-pt-seam': 0 },
      { '--k-pt-seam': 1, duration: DUR.page * 0.35, ease: 'none' },
      0,
    )

    /* GSAP runs on rAF, and rAF stops in a backgrounded tab, so onComplete
     * alone would leave the page stuck under the ghost. Degrade to "no
     * animation, correct final state". Divided by the global timeScale
     * because the timeout runs on wall-clock time and the timeline may not
     * (the slow-motion recording harness sets timeScale 0.25 — the backstop
     * was cutting those recordings off mid-move). */
    const speed = gsap.globalTimeline.timeScale() || 1
    const backstop = setTimeout(finish, (DUR.page / speed) * 1000 + 400)

    return () => {
      tl.kill()
      clearTimeout(backstop)
    }
  }, [pathname, cleanup])

  return (
    <div ref={viewRef} className="k-pt__view">
      {children}
    </div>
  )
}
