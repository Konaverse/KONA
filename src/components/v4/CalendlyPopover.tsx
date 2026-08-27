'use client'

import { useEffect, useRef } from 'react'
import { gsap, EASE, DUR } from '@/lib/motion-v4'
import { CALENDLY_URL } from '@/lib/site'

/**
 * CALENDLY, AS A POPOVER (2026-08-26, user: "instead of taking you to
 * another page I would rather the calendly open as a small modal right
 * above or below the clicked button. This will be on both desktop and
 * mobile.")
 *
 * WHICH OF CALENDLY'S THREE. Calendly offers an INLINE embed (their
 * calendar in a box you own), a BADGE (their floating button, bottom
 * right) and a POPUP (their full-screen centred modal). A panel anchored
 * to the clicked button is the inline embed inside a box of ours — the
 * popup cannot be anchored and the badge is a second button. So: one
 * fixed glass panel, positioned off the trigger, and Calendly's
 * `initInlineWidget` mounting its calendar into it.
 *
 * HOW IT ATTACHES. One delegated click listener on the document: any
 * `<a>` whose href is the booking link opens the panel instead of the
 * link. The links stay real links — without JS (or before hydration)
 * they open Calendly in a new tab exactly as before — and no button
 * needs to know the panel exists. The panel sits BELOW the trigger when
 * there is room, ABOVE when there is not, and clamped into the viewport
 * either way (on a phone that is most of the screen, which is what a
 * calendar needs). It re-anchors while the page scrolls or resizes.
 *
 * THE WIDGET SCRIPT loads once, on the first open, never before: nobody
 * pays for Calendly's JS to look at the hero. Until it lands the panel
 * shows a quiet loading line. The panel is LIGHT: Calendly's calendar is
 * white on this plan (see EMBED_URL), and one white card reads better
 * than a dark frame around a white pane.
 *
 * CLOSING: the × , Escape, a click outside. Focus goes to the panel on
 * open and back to the trigger on close. Entrance and exit are the house
 * reveal (blur + shift), scaled from the side the panel opens toward.
 */

type CalendlyGlobal = {
  initInlineWidget: (opts: { url: string; parentElement: HTMLElement }) => void
}
declare global {
  interface Window {
    Calendly?: CalendlyGlobal
  }
}

const SCRIPT = 'https://assets.calendly.com/assets/external/widget.js'
/* Calendly's embed colour params (background_color / text_color /
   primary_color) are a PAID-PLAN feature and are ignored on this account
   — the calendar comes white with Calendly blue whatever we ask. So the
   panel takes the LIGHT polarity and frames the calendar as one white
   card rather than a dark frame around a white pane. If the plan ever
   changes, the params go back here and the panel can go dark. */
/* CALENDAR ONLY (user, 2026-08-26): `hide_event_type_details=1` drops the
   event's header — logo, title, duration, the note — so the pane is the
   date picker and nothing else; `hide_gdpr_banner=1` drops the cookie
   strip. The panel's own head is the only chrome around it. */
const EMBED_URL = `${CALENDLY_URL}?hide_event_type_details=1&hide_gdpr_banner=1`

/** the panel's box — Calendly's calendar wants ~320 wide; the month view
 *  is ~520 tall and scrolls inside the pane below that (user, 2026-08-26:
 *  smaller, and the button it opened from must stay visible) */
const W = 340
const H = 560
/** the least the panel will shrink to before the calendar is unusable */
const MIN_H = 320
const GAP = 12

let scriptPromise: Promise<void> | null = null
const loadScript = () => {
  if (window.Calendly) return Promise.resolve()
  if (scriptPromise) return scriptPromise
  scriptPromise = new Promise<void>((resolve, reject) => {
    const s = document.createElement('script')
    s.src = SCRIPT
    s.async = true
    s.onload = () => resolve()
    s.onerror = () => {
      scriptPromise = null
      reject(new Error('calendly'))
    }
    document.head.appendChild(s)
  })
  return scriptPromise
}

export default function CalendlyPopover() {
  const rootRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const panel = root.querySelector<HTMLElement>('.cal-pop')
    const host = root.querySelector<HTMLElement>('.cal-host')
    const note = root.querySelector<HTMLElement>('.cal-note')
    const closeBtn = root.querySelector<HTMLButtonElement>('.cal-close')
    if (!panel || !host || !note || !closeBtn) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let trigger: HTMLElement | null = null
    let open = false
    let mounted = false
    let above = false
    let tween: gsap.core.Tween | null = null

    const pad = () =>
      parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--page-pad')) || 20

    /* the panel's box for this viewport, and where it sits off the trigger */
    const place = () => {
      if (!trigger) return
      const vw = window.innerWidth
      const vh = window.innerHeight
      const p = Math.min(pad(), 20)
      const w = Math.min(W, vw - 2 * p)
      let h = Math.min(H, vh - 2 * p)
      const r = trigger.getBoundingClientRect()
      /* NEVER OVER THE TRIGGER: the panel takes the side of the button
         with more room, and if the full height does not fit there it
         shrinks to that room (the calendar scrolls inside) rather than
         sliding over the button it opened from */
      const roomBelow = vh - p - (r.bottom + GAP)
      const roomAbove = r.top - GAP - p
      above = roomBelow < h && roomAbove > roomBelow
      const room = above ? roomAbove : roomBelow
      h = Math.max(MIN_H, Math.min(h, room))
      const top = above ? r.top - GAP - h : r.bottom + GAP
      let left = r.left
      left = Math.max(p, Math.min(vw - p - w, left))
      panel.style.width = `${w}px`
      panel.style.height = `${h}px`
      panel.style.top = `${Math.round(top)}px`
      panel.style.left = `${Math.round(left)}px`
      panel.style.transformOrigin = above ? '50% 100%' : '50% 0%'
    }

    const mount = async () => {
      if (mounted) return
      note.textContent = 'Loading the calendar…'
      note.hidden = false
      try {
        await loadScript()
        if (!open || mounted) return
        window.Calendly?.initInlineWidget({ url: EMBED_URL, parentElement: host })
        mounted = true
        note.hidden = true
      } catch {
        note.innerHTML = ''
        const a = document.createElement('a')
        a.href = CALENDLY_URL
        a.target = '_blank'
        a.rel = 'noopener noreferrer'
        a.textContent = 'Open the calendar in a new tab ↗'
        note.append('The calendar could not load here. ', a)
      }
    }

    const show = (el: HTMLElement) => {
      trigger = el
      open = true
      root.classList.add('is-open')
      panel.removeAttribute('hidden')
      place()
      tween?.kill()
      if (reduce) {
        gsap.set(panel, { clearProps: 'opacity,transform,filter' })
      } else {
        const dy = (above ? 1 : -1) * 18
        tween = gsap.fromTo(
          panel,
          { opacity: 0, y: dy, scale: 0.98, filter: 'blur(14px)' },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: DUR.base,
            ease: EASE.glass,
            clearProps: 'filter',
          },
        )
      }
      void mount()
      closeBtn.focus({ preventScroll: true })
      gsap.ticker.add(place)
    }

    const hide = () => {
      if (!open) return
      open = false
      gsap.ticker.remove(place)
      root.classList.remove('is-open')
      const done = () => {
        panel.setAttribute('hidden', '')
      }
      tween?.kill()
      if (reduce) done()
      else {
        tween = gsap.to(panel, {
          opacity: 0,
          y: (above ? 1 : -1) * 12,
          scale: 0.985,
          duration: DUR.quick,
          ease: EASE.settle,
          onComplete: done,
        })
      }
      const t = trigger
      trigger = null
      t?.focus({ preventScroll: true })
    }

    /* every booking link on the page opens the panel instead */
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return
      const target = e.target as HTMLElement | null
      const a = target?.closest<HTMLAnchorElement>('a[href]')
      if (a && a.href.startsWith(CALENDLY_URL)) {
        e.preventDefault()
        if (open && trigger === a) hide()
        else show(a)
        return
      }
      if (open && target && !panel.contains(target)) hide()
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) hide()
    }
    document.addEventListener('click', onClick)
    document.addEventListener('keydown', onKey)
    closeBtn.addEventListener('click', hide)

    return () => {
      document.removeEventListener('click', onClick)
      document.removeEventListener('keydown', onKey)
      closeBtn.removeEventListener('click', hide)
      gsap.ticker.remove(place)
      tween?.kill()
    }
  }, [])

  return (
    <div ref={rootRef} className="cal">
      <div className="cal-pop k-glass" role="dialog" aria-label="Book a call" hidden>
        <div className="cal-head">
          <span className="cal-title t-small">Book a call</span>
          <button type="button" className="cal-close" aria-label="Close">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
              <path d="M3.5 3.5 12.5 12.5M12.5 3.5 3.5 12.5" />
            </svg>
          </button>
        </div>
        <p className="cal-note t-small" hidden />
        {/* Calendly mounts its iframe in here */}
        <div className="cal-host" />
      </div>
    </div>
  )
}
