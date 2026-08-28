'use client'

/**
 * NAVIGATION — the burger and its aperture, at every width.
 *
 * BURGER-ONLY AGAIN (2026-08-20, user decision), reversing the horizontal-nav
 * interlude. The links had been added because reaching a link through the
 * aperture opens a full-screen overlay that then closes back over the page
 * transition it triggered — the nav sits at z-index 50, above both pages, so
 * it painted over the exact thing it had just triggered. That tradeoff is now
 * accepted in exchange for the aperture owning navigation everywhere; the bar
 * carries only the brand, Contact, and the burger.
 *
 * The burger IS the aperture: the whole menu grows out of it as one circle and
 * is swallowed back into it on close. Adapted from the `aperture` section in
 * magnificent_sections; what was taken verbatim and what was changed is
 * documented in docs/components.md §2.
 *
 * Structure notes that are load-bearing:
 *  - The circle's origin is measured at CLICK time, so the menu opens out of
 *    wherever the burger actually is. Both clip-path keyframes are same-format
 *    `circle(<n>vmax at <x>px <y>px)` strings — GSAP can only interpolate them
 *    if the units match, and vmax keeps the END state valid across a resize.
 *  - ONE reversible timeline. Close is reverse() at 1.6x, so the content can
 *    never desync from the circle, and re-opening mid-close resumes the live
 *    timeline rather than rebuilding (a rebuild would snap half-revealed
 *    content back to its start).
 *  - Content enters at 30% of the expansion, while the circle is still
 *    travelling. Waiting for it to land reads as two events instead of one.
 *  - Reveals use the system signature: masked rise AND blur together for
 *    single-line display type, plain refraction for everything else.
 *  - Without JS the overlay renders OPEN and static, so the menu degrades to a
 *    visible sitemap. The layout effect closes it before first paint.
 */

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { gsap, EASE, DUR, REVEAL, rem } from '@/lib/motion-v4'
import { SECTIONS } from '@/lib/site'

/** useLayoutEffect warns when it runs during SSR; swap it out on the server. */
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

export interface ApertureItem {
  label: string
  href: string
}

export interface ApertureMenuProps {
  brand?: string
  /** The site map, in page order. Contact is a row AND the bar's standing link. */
  items?: ApertureItem[]
  email?: string
  location?: string
  /** Cropped by the bottom edge. Keep it short. */
  giantWord?: string
  contactLabel?: string
  contactHref?: string
}

export default function ApertureMenu({
  brand = 'Konaverse',
  /**
   * ONE-PAGE LAUNCH (2026-08-25, docs/launch-plan.md §1): every row is an
   * in-page anchor — SmoothScroll routes it through Lenis while the aperture
   * closes over it. Pricing and Journal are DROPPED until their pages exist
   * (user call), not linked to nothing. When the inner pages come back,
   * restore the routes here AND add them to V4_ROUTES in PageTransition.tsx;
   * the open-menu-into-the-ghost design (plan §5) lands first.
   */
  /* PAGE ORDER, all five (user call 2026-08-26): a one-page site's menu
     reads like its table of contents. Contact is a row here too now,
     as well as the bar's standing link. */
  items = [
    { label: 'Studio', href: SECTIONS.studio },
    { label: 'What we solve', href: SECTIONS.solve },
    { label: 'Solutions', href: SECTIONS.services },
    { label: 'Work', href: SECTIONS.work },
    { label: 'Contact', href: SECTIONS.contact },
  ],
  email = 'info@kona-verse.com',
  location = 'Cyprus, working globally',
  giantWord = 'KONAVERSE',
  contactLabel = 'Contact',
  contactHref = SECTIONS.contact,
}: ApertureMenuProps) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const barRef = useRef<HTMLDivElement | null>(null)
  const overlayRef = useRef<HTMLDivElement | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const closeRef = useRef<HTMLButtonElement | null>(null)
  const ctxRef = useRef<gsap.Context | null>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const modeRef = useRef<'motion' | 'reduce' | null>(null)
  // No-JS state is OPEN — the menu is content. The layout effect flips it.
  const openRef = useRef(true)
  const [open, setOpen] = useState(true)

  const openMenu = useCallback(() => {
    const root = rootRef.current
    const overlay = overlayRef.current
    const trigger = triggerRef.current
    const ctx = ctxRef.current
    if (!root || !overlay || !trigger || !ctx || openRef.current) return
    openRef.current = true
    setOpen(true)

    ctx.add(() => {
      if (modeRef.current !== 'motion') {
        gsap.set(overlay, { clipPath: 'none', visibility: 'visible' })
        closeRef.current?.focus()
        return
      }
      const live = tlRef.current
      if (live && live.isActive()) {
        live.timeScale(1).play()
        return
      }
      live?.kill()

      // Measured at click time — the circle must be born inside the burger.
      const b = trigger.getBoundingClientRect()
      const x = b.left + b.width / 2
      const y = b.top + b.height / 2
      // 142vmax clears the viewport diagonal from any origin and survives resize.
      const from = `circle(0vmax at ${x}px ${y}px)`
      const to = `circle(142vmax at ${x}px ${y}px)`
      const d = DUR.cinema
      // the reveal lengths at this viewport's scale (tokens.css, THE PICTURE)
      const k = rem()
      const blur = `blur(${REVEAL.blur * k}px)`

      const tl = gsap.timeline({
        defaults: { ease: EASE.glass },
        onComplete: () => closeRef.current?.focus(),
        onReverseComplete: () => {
          gsap.set(overlay, { visibility: 'hidden' })
          tlRef.current = null
          triggerRef.current?.focus()
        },
      })
      tlRef.current = tl

      tl.set(overlay, { visibility: 'visible' }, 0)
      tl.fromTo(overlay, { clipPath: from }, { clipPath: to, duration: d, ease: EASE.drift }, 0)

      // chrome
      tl.fromTo('[data-k-chrome]', { opacity: 0 }, { opacity: 1, duration: DUR.base, ease: 'none', stagger: REVEAL.stagger }, d * 0.3)

      // display type — masked rise AND blur, the combined signature
      tl.fromTo(
        '[data-k-title]',
        { yPercent: 110, filter: blur, opacity: 0 },
        { yPercent: 0, filter: 'blur(0px)', opacity: 1, duration: DUR.slow },
        d * 0.3,
      )
      tl.fromTo(
        '[data-k-row-label]',
        { yPercent: 110, filter: blur, opacity: 0 },
        { yPercent: 0, filter: 'blur(0px)', opacity: 1, duration: DUR.slow, stagger: REVEAL.stagger },
        d * 0.42,
      )

      // rules draw left to right
      tl.fromTo('[data-k-row-rule]', { scaleX: 0 }, { scaleX: 1, transformOrigin: 'left center', duration: DUR.slow, stagger: REVEAL.stagger }, d * 0.38)

      // plain refraction for the blocks that have no crop edge
      tl.fromTo(
        '[data-k-soft]',
        { y: REVEAL.shift * k, filter: blur, opacity: 0 },
        { y: 0, filter: 'blur(0px)', opacity: 1, duration: DUR.slow, stagger: REVEAL.stagger },
        d * 0.46,
      )

      // numbers + chips. --e-settle, never back.out: the token file bans
      // overshoot outright, and it was the least calm thing in the reference.
      tl.fromTo('[data-k-row-num]', { opacity: 0 }, { opacity: 1, duration: DUR.base, ease: 'none', stagger: REVEAL.stagger }, d * 0.46)
      tl.fromTo('[data-k-chip]', { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: DUR.base, ease: EASE.settle, stagger: REVEAL.stagger }, d * 0.5)

      // the cropped wordmark lifts into the bottom edge
      tl.fromTo('[data-k-giant]', { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: DUR.slow, ease: EASE.glass }, d * 0.45)
    })
  }, [])

  const closeMenu = useCallback(() => {
    const overlay = overlayRef.current
    const ctx = ctxRef.current
    if (!overlay || !ctx || !openRef.current) return
    openRef.current = false
    setOpen(false)

    ctx.add(() => {
      if (modeRef.current !== 'motion') {
        gsap.set(overlay, { clipPath: 'none', visibility: 'hidden' })
        triggerRef.current?.focus()
        return
      }
      // The close IS the open, played backwards into the burger, faster —
      // the way a released aperture snaps shut.
      tlRef.current?.timeScale(1.6).reverse()
    })
  }, [])

  useIsoLayoutEffect(() => {
    const root = rootRef.current
    const overlay = overlayRef.current
    if (!root || !overlay) return

    // JS takes over: the no-JS state is OPEN, so the first scripted act is to
    // close it — in a layout effect, before the browser ever paints it.
    openRef.current = false
    setOpen(false)

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add(
        { motion: '(prefers-reduced-motion: no-preference)', reduce: '(prefers-reduced-motion: reduce)' },
        (context) => {
          modeRef.current = context.conditions?.reduce ? 'reduce' : 'motion'
          // clip-path stays 'none' at rest; only the open timeline owns it.
          gsap.set(overlay, { visibility: openRef.current ? 'visible' : 'hidden', clipPath: 'none' })
          return () => {
            tlRef.current?.kill()
            tlRef.current = null
            modeRef.current = null
          }
        },
      )
    }, root)
    ctxRef.current = ctx

    return () => {
      ctx.revert()
      ctxRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, closeMenu])

  /**
   * Scroll behaviour. THE BAR LIVES IN THE HERO ONLY, at every width
   * (2026-08-26, user: "on scroll up the navbar shouldn't appear. The
   * navbar is only a part of the hero" — the phone rule of the same day,
   * now universal; the 2026-08-18 return-on-upward-intent is gone).
   * Grounded past the top; past the hero's end it hides and stays hidden
   * in either scroll direction; the open menu still pins it visible.
   * House pattern — gsap.ticker + position reads, no scroll listener.
   */
  const pathname = usePathname()
  useEffect(() => {
    const bar = barRef.current
    if (!bar) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let hidden = false
    let grounded = false
    /* The hero's end is read off the page; a route without a hero falls
       back to a free zone that is a length of the composition (the hero
       headline's height), so it scales with the picture. Re-read on
       resize only. */
    let heroEnd = 0
    const measure = () => {
      const hero = document.querySelector<HTMLElement>('.hw-hero')
      heroEnd = hero
        ? hero.getBoundingClientRect().bottom + window.scrollY - bar.offsetHeight
        : 160 * rem()
    }
    measure()
    const onMeasure = () => measure()
    window.addEventListener('resize', onMeasure)

    const update = () => {
      const y = window.scrollY
      const g = y > 8
      if (g !== grounded) {
        grounded = g
        bar.classList.toggle('is-grounded', g)
      }
      if (!reduce) {
        const inHero = openRef.current || y < heroEnd
        if (inHero && hidden) {
          hidden = false
          bar.classList.remove('is-hidden')
        } else if (!inHero && !hidden) {
          hidden = true
          bar.classList.add('is-hidden')
        }
      }
    }

    gsap.ticker.add(update)
    return () => {
      gsap.ticker.remove(update)
      window.removeEventListener('resize', onMeasure)
    }
    /* re-run per route: this component lives in the layout, so without the
       dependency a visit that starts on /privacy keeps the hero-less free
       zone after coming home (and vice versa) */
  }, [pathname])

  const Arrow = () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
      <path d="M2 8h11M9 3.5 13.5 8 9 12.5" />
    </svg>
  )

  /** The nav's label roll — the button's move at nav scale, whole word.
      Real string in .sr-only, both painted copies hidden from AT. */
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
    <div ref={rootRef} className="k-nav-root">
      {/* the no-JS sitemap: tokens.css hides the overlay at rest (killing
          the pre-hydration flash of the server-rendered OPEN state); with
          scripts off, this restores it so the menu still degrades to a
          visible sitemap */}
      <noscript>
        <style>{`.k-aperture{visibility:visible!important}`}</style>
      </noscript>
      {/* ---- persistent chrome. Contact never hides behind the burger. ---- */}
      <div ref={barRef} className="k-nav-bar">
        <a href="/" className="k-nav-brand">{brand}</a>

        <a href={contactHref} className="k-nav-contact">
          <NavLabel text={contactLabel} />
        </a>
        <button
          ref={triggerRef}
          type="button"
          className="k-burger"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={openMenu}
        >
          <i /><i />
        </button>
      </div>

      {/* ---- the menu. Renders OPEN without JS. GSAP owns its clip-path. ---- */}
      <div
        ref={overlayRef}
        className="k-aperture"
        role="dialog"
        aria-modal={open || undefined}
        aria-hidden={!open}
        aria-label={`${brand} menu`}
      >
        <div className="k-aperture__bar">
          <span data-k-chrome className="k-nav-brand">{brand}</span>
          <button ref={closeRef} type="button" data-k-chrome className="k-aperture__close" onClick={closeMenu}>
            Close
            <span className="k-aperture__x" aria-hidden="true">
              <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3">
                <path d="M1 1l10 10M11 1L1 11" />
              </svg>
            </span>
          </button>
        </div>

        <div className="k-aperture__main">
          <div className="k-aperture__left">
            <span className="k-mask">
              <h2 data-k-title className="k-aperture__title">Index</h2>
            </span>
            <p data-k-soft className="k-aperture__loc">{location}</p>
            <p data-k-soft className="k-aperture__email">
              <a href={`mailto:${email}`}>{email}</a>
            </p>
          </div>

          <nav className="k-aperture__nav" aria-label="Menu">
            <ul>
              {items.map((item, i) => (
                <li key={item.href}>
                  <span data-k-row-rule className="k-aperture__rule" aria-hidden="true" />
                  <a className="k-aperture__row" href={item.href} onClick={closeMenu}>
                    <span data-k-row-num className="k-aperture__num" aria-hidden="true">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="k-mask k-aperture__labelmask">
                      <span data-k-row-label className="k-aperture__label">{item.label}</span>
                    </span>
                    <span data-k-chip className="k-aperture__chipwrap">
                      <span className="k-aperture__chip" aria-hidden="true"><Arrow /></span>
                    </span>
                  </a>
                  {i === items.length - 1 && (
                    <span data-k-row-rule className="k-aperture__rule k-aperture__rule--last" aria-hidden="true" />
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Cropped by the bottom edge — only the shoulders of the glyphs show.
            No marquee: nothing on this site moves on its own. */}
        <div className="k-aperture__giantwrap" aria-hidden="true">
          <div data-k-giant className="k-aperture__giant">{giantWord}</div>
        </div>
      </div>
    </div>
  )
}
