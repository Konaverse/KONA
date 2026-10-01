'use client'

/**
 * NAVIGATION — THE UNDERLAY (2026-09-30; replaces THE APERTURE,
 * ApertureMenu.tsx, parked unimported with its `.k-aperture*` rules).
 *
 * THE BRIEF: the user's recording of a "fixed underlay navigation" —
 * "study it, internalize it, look at every motion, detail, easing,
 * spacing. I love this." What the film shows, frame by frame (30fps):
 *
 *   THE PAGE SLIDES, THE MENU DOES NOT. A white panel is fixed under
 *   the page at the right, a third of the screen wide; opening moves the
 *   WHOLE PAGE left by the panel's width and so uncovers it. The page's
 *   moving edge rounds and the page dims a little. The logo and the
 *   Menu button stay where they are (they are above both).
 *   THE CURVE. 35% of the travel in the first 57ms, 72% by 123ms, 94% by
 *   257ms, settled by ~600ms — a hard expo-out: EASE.glass, 0.8s.
 *   THE LINKS arrive from the right AND fade up, one after another
 *   (~50ms apart), starting with the slide — the first is readable by
 *   the time the panel is half open, the last lands after the page has.
 *   The current page's link sits on a solid bar the panel's width.
 *   THE FOOT: a hairline, then two small columns (a grey label over
 *   links) — they come in last, fading.
 *   THE BUTTON: "Menu ≡" rolls to "Close ×" in place.
 *   THE CLOSE is quicker than the open: the links and the foot are gone
 *   in a blink while the page slides back on the same curve.
 *
 * HOW THE PAGE MOVES (the load-bearing part). A transform on the page
 * — on <html>, <body> or any wrapper — re-homes every position:fixed
 * element inside it (measured: they jump by the scroll offset). So the
 * page is first FROZEN (and gsap.ticker sleeps — every page driver runs on
 * it, and a page that cannot scroll gives them nothing to do): `.k-shift` (the layout's wrapper around the
 * page) becomes a fixed, viewport-sized box that scrolls INSIDE itself
 * to the same offset (Lenis stopped). Fixed layers inside it (a page's
 * light, its run bar) now belong to a viewport-sized box, and sticky
 * sections stick to its own scroll — nothing jumps. Then that box
 * slides. Closed, it is unfrozen and the window put back at the offset.
 *
 * SMOOTHNESS (the user, on the first cut: "not as smooth as it looks").
 * Two causes, both fixed: (1) the slide was a GSAP tween — main thread,
 * the same thread every page's scroll drivers and WebGL run on — so it
 * stuttered whenever the page worked; the page, its dim and the links
 * now move by the Web Animations API (transform + opacity only), which
 * the compositor runs on its own clock. (2) the freeze re-lays the whole
 * page out, and it happened on the slide's first frame; now the page is
 * frozen, two frames go by, THEN the slide starts.
 *
 * THE SHRINK (second pass): the underlay is the whole screen, white; the
 * page scales to SHRINK about its centre as it slides, so the white shows
 * above and below it and around its rounded corners, and it takes a
 * slight dark overlay (the dim, which rides it).
 *
 * A LINK in the panel closes the menu first, then the same click is
 * replayed for PageTransition (document-delegated, it skips a click
 * that was prevented) — the page transition never runs on a page that
 * is still shifted.
 *
 * THE SWAP (2026-09-30): a panel link to ANOTHER page does not close
 * first. The menu stays open; the shrunk page rises out of its slot and
 * off the top while the new page rises into the slot from below, one
 * gesture, the white showing between them; the current-page bar moves
 * to the new link as it lands; then the menu closes on its own. React
 * unmounts the old route on commit, so the outgoing page is a still — a
 * clone of the frozen box, left in its place (PageTransition's trick) —
 * and the live box, parked below the fold, carries the new page in.
 * (Barba.js was the brief's suggestion; it swaps server HTML into the
 * DOM behind React's back, so the new page would arrive unhydrated.)
 *
 * Without JS the panel renders as a static column over the page's
 * right edge — the menu degrades to a visible sitemap.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { gsap, rem } from '@/lib/motion-v4'
import { getLenis } from '@/components/v4/SmoothScroll'
import { ROUTES } from '@/lib/site'

const ITEMS = [
  { label: 'Home', href: ROUTES.home },
  { label: 'Services', href: ROUTES.services },
  { label: 'Work', href: ROUTES.work },
  { label: 'About', href: ROUTES.about },
  { label: 'Contact', href: ROUTES.contact },
]
const SOCIALS = [
  { label: 'Instagram', href: 'https://www.instagram.com/konaverse.cy/' },
  { label: 'Facebook', href: 'https://www.facebook.com/konaverse' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/konaverse' },
]
const LEGAL = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Cookies', href: '/cookies' },
]

/** the slide: the film's curve and length (EASE.glass as a CSS curve —
 *  the page's moves run on the COMPOSITOR, see the header) */
const SLIDE = 800
const CURVE = 'cubic-bezier(0.22, 1, 0.36, 1)'
/** the page shrinks as it goes (the user: "space up and down") */
const SHRINK = 0.94
/** the links: their lead-in, stagger and travel (rem) */
const LINK_AT = 60
const LINK_STAGGER = 50
const LINK_FROM = 5
/** THE SWAP: the two pages' vertical run, its curve, and the beat the new
 *  page rests in the slot before the menu closes */
const SWAP = 1100
const SWAP_CURVE = 'cubic-bezier(0.76, 0, 0.24, 1)'
const SWAP_HOLD = 140

export default function UnderlayMenu() {
  const barRef = useRef<HTMLDivElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const dimRef = useRef<HTMLDivElement | null>(null)
  const btnRef = useRef<HTMLButtonElement | null>(null)
  const openRef = useRef(false)
  const frozenAt = useRef<number | null>(null)
  const passRef = useRef<HTMLAnchorElement | null>(null)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  /** the page's slot while open: its x and scale (the swap moves in it) */
  const slotRef = useRef<{ x: number; s: number } | null>(null)
  /** a swap in flight: the route it leaves, its still, its failsafe */
  const swapRef = useRef<string | null>(null)
  const ghostRef = useRef<HTMLElement | null>(null)
  const swapFail = useRef<ReturnType<typeof setTimeout> | null>(null)

  const shiftEl = () => document.querySelector<HTMLElement>('.k-shift')

  /* ── the freeze: the page becomes a viewport box scrolled to its offset */
  const freeze = useCallback(() => {
    const shift = shiftEl()
    if (!shift || frozenAt.current != null) return
    const y = window.scrollY
    frozenAt.current = y
    getLenis()?.stop()
    shift.classList.add('is-frozen')
    shift.scrollTop = y
    /* the page's drivers (every one rides gsap.ticker) have nothing to do
       on a page that cannot scroll — and traced, they were most of each
       frame's main-thread time during the open. Asleep until unfrozen;
       the menu's own motion is Web Animations, off that clock. */
    gsap.ticker.sleep()
    /* and the loops that keep their own clock (FluidCursor) hear it */
    window.dispatchEvent(new CustomEvent('k:freeze', { detail: true }))
    ;(shift as HTMLElement & { inert: boolean }).inert = true
  }, [])

  const unfreeze = useCallback(() => {
    const shift = shiftEl()
    const y = frozenAt.current
    if (!shift || y == null) return
    frozenAt.current = null
    gsap.ticker.wake()
    window.dispatchEvent(new CustomEvent('k:freeze', { detail: false }))
    shift.style.transform = ''
    shift.classList.remove('is-frozen')
    ;(shift as HTMLElement & { inert: boolean }).inert = false
    window.scrollTo(0, y)
    /* Lenis measured the page while it was frozen (no height, so a limit
       of 0): re-measure BEFORE restoring, or the offset clamps to the top */
    const lenis = getLenis()
    lenis?.start()
    lenis?.resize()
    lenis?.scrollTo(y, { immediate: true, force: true })
  }, [])

  /* the running animations, so a toggle mid-move starts from where the
     page actually is */
  const animsRef = useRef<Animation[]>([])
  const stopAll = () => {
    animsRef.current.forEach((a) => a.cancel())
    animsRef.current = []
  }
  /* an element's transform as it stands right now (a running animation
     included), pinned inline so cancelling the animation cannot jump it */
  const pin = (el: HTMLElement) => {
    const t = getComputedStyle(el).transform
    el.style.transform = t === 'none' ? '' : t
    return t === 'none' ? 'translate3d(0px, 0px, 0px) scale(1)' : t
  }

  /* THE WARM-UP: the freeze makes the page its own layer, and the first
     frame of that layer is the costly one (it is rasterised then). So the
     page is frozen as soon as the hand reaches the button — it looks
     identical — and the click finds it ready. A hand that leaves without
     clicking lets it go. Pointer only: the close hands focus back to the
     button, and a focus warm-up would re-freeze the page right there. */
  const warm = useCallback(() => {
    if (openRef.current || frozenAt.current != null) return
    freeze()
    if (panelRef.current) panelRef.current.style.visibility = 'visible'
  }, [freeze])
  const cool = useCallback(() => {
    if (openRef.current || frozenAt.current == null || animsRef.current.length) return
    if (panelRef.current) panelRef.current.style.visibility = 'hidden'
    unfreeze()
  }, [unfreeze])

  const openMenu = useCallback(() => {
    if (openRef.current) return
    const shift = shiftEl()
    const panel = panelRef.current
    const dim = dimRef.current
    if (!shift || !panel || !dim) return
    openRef.current = true
    setOpen(true)
    const fromShift = pin(shift)
    const fromDim = pin(dim)
    const dimOpacity = getComputedStyle(dim).opacity
    stopAll()
    freeze()

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const k = 16 * rem()
    const W = window.innerWidth
    const w = panel.querySelector<HTMLElement>('.k-under__col')!.offsetWidth
    /* scaled about the centre, the page's right edge lands on the panel's
       left edge */
    const x = (W * (1 - SHRINK)) / 2 - w
    slotRef.current = { x, s: SHRINK }
    const to = `translate3d(${x.toFixed(1)}px, 0px, 0px) scale(${SHRINK})`
    const links = Array.from(panel.querySelectorAll<HTMLElement>('[data-u-link]'))
    const foot = Array.from(panel.querySelectorAll<HTMLElement>('[data-u-foot], [data-u-rule]'))
    panel.style.visibility = 'visible'
    dim.style.visibility = 'visible'
    ;[...links, ...foot].forEach((el) => {
      el.style.opacity = '1'
      el.style.transform = ''
    })

    const go = () => {
      if (!openRef.current) return
      const d = reduce ? 0 : 1
      const run = (el: Element, kf: Keyframe[], o: KeyframeAnimationOptions) => {
        const a = el.animate(kf, { easing: CURVE, fill: 'both', ...o, duration: (o.duration as number) * d, delay: ((o.delay as number) || 0) * d })
        animsRef.current.push(a)
        return a
      }
      run(shift, [{ transform: fromShift }, { transform: to }], { duration: SLIDE })
      run(dim, [{ transform: fromDim, opacity: dimOpacity }, { transform: to, opacity: 1 }], { duration: SLIDE })
      links.forEach((el, i) =>
        run(el, [{ opacity: 0, transform: `translate3d(${LINK_FROM * k}px, 0, 0)` }, { opacity: 1, transform: 'none' }], {
          duration: 750,
          delay: LINK_AT + i * LINK_STAGGER,
        }),
      )
      foot.forEach((el, i) =>
        run(el, [{ opacity: 0, transform: `translate3d(${1.5 * k}px, 0, 0)` }, { opacity: 1, transform: 'none' }], {
          duration: 600,
          delay: 380 + i * 35,
        }),
      )
      window.setTimeout(() => {
        if (openRef.current) panel.querySelector<HTMLElement>('[data-u-link]')?.focus({ preventScroll: true })
      }, SLIDE * d)
    }
    /* the freeze re-lays the page out: let that land, then move */
    requestAnimationFrame(() => requestAnimationFrame(go))
  }, [freeze])

  const closeMenu = useCallback(
    (then?: () => void) => {
      if (!openRef.current || swapRef.current) return
      const shift = shiftEl()
      const panel = panelRef.current
      const dim = dimRef.current
      if (!shift || !panel || !dim) return
      openRef.current = false
      setOpen(false)
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const d = reduce ? 0 : 1
      const k = 16 * rem()
      const fromShift = pin(shift)
      const fromDim = pin(dim)
      const dimOpacity = getComputedStyle(dim).opacity
      const items = Array.from(panel.querySelectorAll<HTMLElement>('[data-u-link], [data-u-foot], [data-u-rule]'))
      const itemFrom = items.map((el) => getComputedStyle(el).opacity)
      stopAll()
      const run = (el: Element, kf: Keyframe[], o: KeyframeAnimationOptions) => {
        const a = el.animate(kf, { easing: CURVE, fill: 'both', ...o, duration: (o.duration as number) * d, delay: ((o.delay as number) || 0) * d })
        animsRef.current.push(a)
        return a
      }
      /* the film: the panel's contents are gone in a blink, the page comes
         home on the open's curve, a touch quicker */
      items.forEach((el, i) =>
        run(el, [{ opacity: itemFrom[i] }, { opacity: 0, transform: `translate3d(${0.8 * k}px, 0, 0)` }], {
          duration: 180,
          easing: 'cubic-bezier(0.55, 0, 1, 0.45)',
        }),
      )
      const home = 'translate3d(0px, 0px, 0px) scale(1)'
      run(dim, [{ transform: fromDim, opacity: dimOpacity }, { transform: home, opacity: 0 }], { duration: SLIDE * 0.85, delay: 40 })
      const slide = run(shift, [{ transform: fromShift }, { transform: home }], { duration: SLIDE * 0.85, delay: 40 })
      slide.onfinish = () => {
        if (openRef.current) return
        stopAll()
        panel.style.visibility = 'hidden'
        dim.style.visibility = 'hidden'
        dim.style.transform = ''
        shift.style.transform = ''
        items.forEach((el) => {
          el.style.opacity = ''
          el.style.transform = ''
        })
        unfreeze()
        btnRef.current?.focus({ preventScroll: true })
        then?.()
      }
    },
    [unfreeze],
  )

  /** the slot, shifted vertically by dy px */
  const slotAt = (dy: number) => {
    const { x, s } = slotRef.current!
    return `translate3d(${x.toFixed(1)}px, ${dy.toFixed(1)}px, 0px) scale(${s})`
  }

  /* THE SWAP, step one (the click): the page as it stands becomes a still
     in the slot, the live box drops below the fold, and the route is asked
     for. Nothing moves until it commits (step two, the effect below), so
     both pages set off together. */
  const swapTo = useCallback(
    (dest: string) => {
      const shift = shiftEl()
      if (!shift || !slotRef.current || frozenAt.current == null) return false
      swapRef.current = window.location.pathname
      /* hold everything where it stands (an open still landing included) */
      animsRef.current.forEach((a) => {
        try {
          a.commitStyles()
        } catch {}
        a.cancel()
      })
      animsRef.current = []

      const ghost = shift.cloneNode(true) as HTMLElement
      ghost.className = 'k-under-ghost'
      ghost.setAttribute('aria-hidden', 'true')
      ;(ghost as HTMLElement & { inert: boolean }).inert = true
      /* the still shows everything final-state (see PageTransition) */
      ghost.querySelectorAll<HTMLElement>('.k-reveal').forEach((el) => {
        el.classList.add('is-in', 'is-done')
        el.style.opacity = '1'
        el.style.filter = 'none'
        el.style.transform = 'none'
        el.style.transition = 'none'
        el.style.willChange = 'auto'
      })
      /* films carry on from the frame they were on */
      const films = shift.querySelectorAll('video')
      ghost.querySelectorAll('video').forEach((v, i) => {
        const f = films[i]
        if (!f) return
        v.muted = true
        v.currentTime = f.currentTime
        if (!f.paused) v.play().catch(() => {})
      })
      shift.after(ghost)
      ghost.scrollTop = shift.scrollTop
      ghost.style.transform = slotAt(0)
      ghostRef.current = ghost

      shift.style.transform = slotAt(window.innerHeight)
      router.push(dest, { scroll: false })
      /* a route that never commits: put the page back and close */
      swapFail.current = setTimeout(() => {
        ghost.remove()
        ghostRef.current = null
        shift.style.transform = slotAt(0)
        swapRef.current = null
        closeMenu()
      }, 4000)
      return true
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router, closeMenu],
  )

  /* THE SWAP, step two (the commit): the live box holds the new page, at
     its top. The still rises out of the slot and off the screen while the
     new page rises into it; a beat, then the menu closes on its own. */
  useEffect(() => {
    const from = swapRef.current
    if (!from || from === pathname) return
    if (swapFail.current) clearTimeout(swapFail.current)
    swapFail.current = null
    const shift = shiftEl()
    const ghost = ghostRef.current
    const dim = dimRef.current
    if (!shift || !ghost || !dim) return
    shift.scrollTop = 0
    /* the close puts the window back where the box is: the new page's top */
    frozenAt.current = 0
    /* the new page's entrance rides gsap.ticker — let it play as it arrives */
    gsap.ticker.wake()

    let raf = requestAnimationFrame(() => {
      raf = requestAnimationFrame(() => {
        const H = window.innerHeight
        const o = { duration: SWAP, easing: SWAP_CURVE, fill: 'both' as const }
        const out = ghost.animate([{ transform: slotAt(0) }, { transform: slotAt(-H) }], o)
        const inn = shift.animate([{ transform: slotAt(H) }, { transform: slotAt(0) }], o)
        /* the dim lifts: it sits on the slot, and the white between the two
           pages would pass under it */
        const lift = dim.animate([{ opacity: getComputedStyle(dim).opacity }, { opacity: 0 }], {
          duration: 300,
          easing: 'linear',
          fill: 'both',
        })
        animsRef.current.push(out, inn, lift)
        inn.onfinish = () => {
          ghost.remove()
          ghostRef.current = null
          window.setTimeout(() => {
            swapRef.current = null
            closeMenu(() => {
              /* measure-on-resize drivers learn the new page's real height */
              window.dispatchEvent(new Event('resize'))
            })
          }, SWAP_HOLD)
        }
      })
    })
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, closeMenu])

  /* a panel link to another page: THE SWAP. Reduced motion (or a menu not
     yet open): close first, then hand the same click to the page
     transition (a prevented click is one it skips) */
  const onLink = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      const a = e.currentTarget
      if (passRef.current === a) {
        passRef.current = null
        return
      }
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
      e.preventDefault()
      if (swapRef.current) return
      const url = new URL(a.href, window.location.href)
      if (url.pathname === window.location.pathname) return closeMenu()
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (!reduce && openRef.current && swapTo(url.pathname + url.search + url.hash)) return
      closeMenu(() => {
        passRef.current = a
        a.click()
      })
    },
    [closeMenu, swapTo],
  )

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, closeMenu])

  /* a route change with the menu open (the back button): put the page back
     — unless it is the swap's own */
  useEffect(() => {
    return () => {
      if (openRef.current && !swapRef.current) {
        animsRef.current.forEach((a) => a.cancel())
        animsRef.current = []
        openRef.current = false
        setOpen(false)
        if (panelRef.current) panelRef.current.style.visibility = 'hidden'
        if (dimRef.current) {
          dimRef.current.style.visibility = 'hidden'
          dimRef.current.style.transform = ''
        }
        const shift = shiftEl()
        if (shift) shift.style.transform = ''
        unfreeze()
      }
    }
  }, [pathname, unfreeze])

  /**
   * Scroll behaviour (kept from the aperture): THE BAR LIVES IN THE HERO
   * ONLY, at every width — past the hero's end it hides in either scroll
   * direction; the open menu pins it visible. gsap.ticker + position
   * reads, no scroll listener.
   */
  useEffect(() => {
    const bar = barRef.current
    if (!bar) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let hidden = false
    let heroEnd = 0
    const measure = () => {
      const hero = document.querySelector<HTMLElement>('.hw-hero, [data-nav-hero]')
      const frac = hero ? parseFloat(hero.dataset.navHero || '') : NaN
      if (hero) {
        const r = hero.getBoundingClientRect()
        const end = Number.isFinite(frac) ? r.top + r.height * frac : r.bottom
        heroEnd = end + window.scrollY - bar.offsetHeight
      } else {
        heroEnd = 160 * rem()
      }
    }
    measure()
    window.addEventListener('resize', measure)
    const update = () => {
      if (reduce) return
      const inHero = openRef.current || frozenAt.current != null || window.scrollY < heroEnd
      if (inHero && hidden) {
        hidden = false
        bar.classList.remove('is-hidden')
      } else if (!inHero && !hidden) {
        hidden = true
        bar.classList.add('is-hidden')
      }
    }
    gsap.ticker.add(update)
    return () => {
      gsap.ticker.remove(update)
      window.removeEventListener('resize', measure)
    }
  }, [pathname])

  const current = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)

  /** the bar's Contact: the nav's label roll, whole word */
  const NavLabel = ({ text }: { text: string }) => (
    <>
      <span className="sr-only">{text}</span>
      <span className="k-navlink__roll" aria-hidden="true">
        <span className="k-navlink__sizer">{text}</span>
        <span className="k-navlink__line k-navlink__line--a">{text}</span>
        <span className="k-navlink__line k-navlink__line--b">{text}</span>
      </span>
    </>
  )

  return (
    <div className="k-nav-root">
      <noscript>
        <style>{`.k-under{visibility:visible!important;z-index:60!important}.k-under [data-u-link],.k-under [data-u-foot]{opacity:1!important}`}</style>
      </noscript>

      {/* ---- the bar: above the page and the panel; nothing here moves ---- */}
      <div ref={barRef} className={`k-nav-bar${open ? ' is-open' : ''}`}>
        <a href="/" className="k-nav-brand">
          <img className="k-nav-mark" src="/brand/mark.png" alt="Konaverse" width="552" height="512" />
        </a>
        <a href={ROUTES.contact} className="k-nav-contact">
          <NavLabel text="Contact" />
        </a>
        <button
          ref={btnRef}
          type="button"
          className={`k-menu-btn${open ? ' is-open' : ''}`}
          aria-expanded={open}
          aria-controls="k-under"
          onClick={() => (swapRef.current ? undefined : openRef.current ? closeMenu() : openMenu())}
          onPointerEnter={warm}
          onPointerLeave={cool}
        >
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          <span className="k-menu-btn__roll" aria-hidden="true">
            <span>Menu</span>
            <span>Close</span>
          </span>
          <span className="k-menu-btn__icon" aria-hidden="true">
            <i />
            <i />
          </span>
        </button>
      </div>

      {/* ---- the page's dim: it rides the page, and a click on it closes */}
      <div ref={dimRef} className="k-under-dim" aria-hidden="true" onClick={() => closeMenu()} />

      {/* ---- THE PANEL: fixed under the page at the right ---- */}
      <div
        ref={panelRef}
        id="k-under"
        className="k-under"
        role="dialog"
        aria-modal={open || undefined}
        aria-hidden={!open}
        aria-label="Konaverse menu"
      >
        <div className="k-under__col">
        <nav className="k-under__nav" aria-label="Menu">
          <ul>
            {ITEMS.map((it) => (
              <li key={it.href}>
                <a
                  data-u-link
                  className={`k-under__link${current(it.href) ? ' is-current' : ''}`}
                  href={it.href}
                  aria-current={current(it.href) ? 'page' : undefined}
                  tabIndex={open ? 0 : -1}
                  onClick={onLink}
                >
                  <span>{it.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="k-under__foot">
          <i data-u-rule className="k-under__rule" aria-hidden="true" />
          <div className="k-under__fcol">
            <p data-u-foot className="k-under__k">Socials</p>
            {SOCIALS.map((s) => (
              <a key={s.href} data-u-foot href={s.href} target="_blank" rel="noopener noreferrer" tabIndex={open ? 0 : -1}>
                {s.label}
              </a>
            ))}
          </div>
          <div className="k-under__fcol">
            <p data-u-foot className="k-under__k">Quick links</p>
            {LEGAL.map((s) => (
              <a key={s.href} data-u-foot href={s.href} tabIndex={open ? 0 : -1} onClick={onLink}>
                {s.label}
                <svg viewBox="0 0 10 10" aria-hidden="true">
                  <path d="M2.5 7.5l5-5M3.5 2.5h4v4" />
                </svg>
              </a>
            ))}
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}
