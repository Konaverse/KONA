'use client'

import { useLayoutEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { gsap, EASE, DUR } from '@/lib/motion-v4'
import { CALENDLY_URL } from '@/lib/site'
import { CALENDLY_FRAME_URL, placeCalendlyInline } from '@/lib/calendly'

/** One calendar, loaded by server HTML and retained by the shared layout.
 * Position the same frame in the contact card or anchored modal. Changing src
 * or moving the iframe to another DOM parent would restart Calendly. Only
 * input, resizing and navigation motion update its position, never idle frames.
 */
const W = 340
const H = 560
const MIN_H = 320
const GAP = 12

declare global {
  interface Window {
    __konaverseCalendlyReady?: WeakSet<Window>
  }
}

export default function CalendlyPopover() {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const refreshRef = useRef<(() => void) | null>(null)
  const pathname = usePathname()

  useLayoutEffect(() => {
    const root = rootRef.current
    const panel = root?.querySelector<HTMLElement>('.cal-pop')
    const frame = root?.querySelector<HTMLIFrameElement>('iframe')
    const note = root?.querySelector<HTMLElement>('.cal-note')
    const dim = root?.querySelector<HTMLElement>('.cal-inline-dim')
    const closeBtn = root?.querySelector<HTMLButtonElement>('.cal-close')
    if (!root || !panel || !frame || !note || !dim || !closeBtn) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let trigger: HTMLElement | null = null
    let open = false
    let closing = false
    let above = false
    let ready = Boolean(frame.contentWindow && window.__konaverseCalendlyReady?.has(frame.contentWindow))
    let failed = false
    let tween: gsap.core.Tween | null = null
    let raf = 0
    let menuFrames = 0
    let observedSlot: HTMLElement | null = null
    let disposed = false
    if (ready) root.dataset.ready = 'true'

    const setMode = (mode: 'parked' | 'inline' | 'popover') => {
      if (root.dataset.mode === mode) return
      root.dataset.mode = mode
      panel.classList.toggle('is-inline', mode === 'inline')
      panel.inert = mode === 'parked'
      panel.setAttribute('aria-hidden', String(mode === 'parked'))
      frame.tabIndex = mode === 'parked' ? -1 : 0
      if (mode === 'popover') panel.setAttribute('role', 'dialog')
      else panel.removeAttribute('role')
      panel.style.opacity = ''
      panel.style.filter = ''
      panel.style.zIndex = ''
      dim.style.opacity = '0'
    }
    const park = () => {
      if (root.dataset.mode === 'parked') return
      setMode('parked')
      panel.style.left = ''
      panel.style.top = ''
      panel.style.width = `${W}px`
      panel.style.height = `${H}px`
      panel.style.transform = ''
    }
    const pad = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--page-pad')) || 20
    const placePopover = () => {
      if (!trigger) return
      const vw = window.innerWidth, vh = window.innerHeight
      const p = Math.min(pad(), 20), w = Math.min(W, vw - 2 * p)
      let h = Math.min(H, vh - 2 * p)
      const r = trigger.getBoundingClientRect()
      const roomBelow = vh - p - (r.bottom + GAP), roomAbove = r.top - GAP - p
      above = roomBelow < h && roomAbove > roomBelow
      h = Math.max(MIN_H, Math.min(h, above ? roomAbove : roomBelow))
      panel.style.width = `${w}px`
      panel.style.height = `${h}px`
      panel.style.top = `${Math.round(above ? r.top - GAP - h : r.bottom + GAP)}px`
      panel.style.left = `${Math.max(p, Math.min(vw - p - w, r.left))}px`
      panel.style.transformOrigin = above ? '50% 100%' : '50% 0%'
    }

    const sizes = new ResizeObserver(() => schedule())
    const refresh = () => {
      if (open) { placePopover(); return }
      if (closing) return
      // Follow the outgoing slot until the arriving page covers it. Cloning
      // an iframe into that ghost would issue another booking-page request.
      const slot = document.querySelector<HTMLElement>('.k-shift > .k-pt__view [data-calendly-inline]')
        ?? document.querySelector<HTMLElement>('.k-pt__ghost [data-calendly-inline], .k-under-ghost [data-calendly-inline]')
      if (slot !== observedSlot) {
        sizes.disconnect()
        observedSlot = slot
        if (slot) {
          sizes.observe(slot)
          const page = slot.closest('.ct')
          if (page) sizes.observe(page)
        }
      }
      if (!slot) { park(); return }
      setMode('inline')
      panel.inert = Boolean(document.querySelector('.k-shift.is-frozen'))
      note.hidden = !failed
      placeCalendlyInline(panel, slot)
      const shade = slot.closest('.k-pt__ghost')?.querySelector('.k-pt__dim')
      panel.style.zIndex = slot.closest('.k-pt__ghost, .k-under-ghost') ? '1' : ''
      dim.style.opacity = shade ? getComputedStyle(shade).opacity : '0'
    }
    const schedule = () => {
      if (disposed || raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        refresh()
        // Compositor menu animations do not mutate inline styles each frame.
        const moving = [...document.querySelectorAll('.k-shift, .k-under-ghost')]
          .some(el => el.getAnimations().some(animation => animation.playState === 'running'))
        if (menuFrames-- > 0 || moving) schedule()
      })
    }
    refreshRef.current = refresh

    const show = (el: HTMLElement) => {
      tween?.kill()
      closing = false
      trigger = el
      open = true
      setMode('popover')
      panel.inert = false
      root.classList.add('is-open')
      note.hidden = ready && !failed
      placePopover()
      if (reduce) gsap.set(panel, { clearProps: 'opacity,transform,filter' })
      else tween = gsap.fromTo(panel,
        { opacity: 0, y: (above ? 1 : -1) * 18, scale: 0.98, filter: 'blur(14px)' },
        { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: DUR.base, ease: EASE.glass, clearProps: 'filter' })
      closeBtn.focus({ preventScroll: true })
    }
    const hide = (immediate = false) => {
      if (!open) return
      open = false
      closing = true
      root.classList.remove('is-open')
      tween?.kill()
      const done = () => {
        closing = false
        // Reset GSAP's transform cache before the contact slot owns its matrix.
        gsap.set(panel, { clearProps: 'opacity,transform,filter' })
        refresh()
      }
      if (reduce || immediate) done()
      else tween = gsap.to(panel, { opacity: 0, y: (above ? 1 : -1) * 12, scale: 0.985,
        duration: DUR.quick, ease: EASE.settle, onComplete: done })
      const previous = trigger
      trigger = null
      previous?.focus({ preventScroll: true })
    }
    const close = () => hide()
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const target = e.target instanceof Element ? e.target : null
      const a = target?.closest<HTMLAnchorElement>('a[href]')
      if (a?.href.startsWith(CALENDLY_URL) && !a.hasAttribute('data-calendly-external')) {
        e.preventDefault()
        if (open && trigger === a) hide()
        else show(a)
        return
      }
      if (open && target && !panel.contains(target)) hide()
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') hide() }
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== 'https://calendly.com' || e.source !== frame.contentWindow) return
      if (e.data?.event !== 'calendly.event_type_viewed') return
      ready = true
      failed = false
      root.dataset.ready = 'true'
      note.hidden = true
      clearTimeout(fallback)
    }
    const onFailure = () => {
      if (ready) return
      failed = true
      note.replaceChildren()
      const a = document.createElement('a')
      a.href = CALENDLY_URL
      a.target = '_blank'
      a.rel = 'noopener noreferrer'
      a.setAttribute('data-calendly-external', '')
      a.textContent = 'Open the calendar in a new tab ↗'
      note.append('The calendar is taking longer to load. ', a)
      note.hidden = false
    }
    const onTransition = (e: Event) => {
      if ((e as CustomEvent<boolean>).detail) {
        hide(true)
        gsap.ticker.add(refresh)
      } else { gsap.ticker.remove(refresh); schedule() }
    }
    const onMenu = () => { menuFrames = 2; schedule() }
    const changes = new MutationObserver(schedule)
    const shift = document.querySelector('.k-shift')
    const view = document.querySelector('.k-shift > .k-pt__view')
    if (shift) changes.observe(shift, { childList: true, subtree: true })
    const motion = new MutationObserver(schedule)
    if (shift) motion.observe(shift, { attributes: true, attributeFilter: ['style', 'class'] })
    if (view) motion.observe(view, { attributes: true, attributeFilter: ['style', 'class'] })
    const fallback = setTimeout(onFailure, 15000)
    document.addEventListener('click', onClick)
    document.addEventListener('keydown', onKey)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    window.addEventListener('message', onMessage)
    window.addEventListener('k:transition', onTransition)
    window.addEventListener('k:freeze', onMenu)
    window.visualViewport?.addEventListener('resize', schedule)
    window.visualViewport?.addEventListener('scroll', schedule)
    frame.addEventListener('error', onFailure)
    closeBtn.addEventListener('click', close)
    document.fonts.ready.then(schedule)
    refresh()

    return () => {
      disposed = true
      refreshRef.current = null
      document.removeEventListener('click', onClick)
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      window.removeEventListener('message', onMessage)
      window.removeEventListener('k:transition', onTransition)
      window.removeEventListener('k:freeze', onMenu)
      window.visualViewport?.removeEventListener('resize', schedule)
      window.visualViewport?.removeEventListener('scroll', schedule)
      frame.removeEventListener('error', onFailure)
      closeBtn.removeEventListener('click', close)
      sizes.disconnect(); changes.disconnect(); motion.disconnect()
      clearTimeout(fallback); cancelAnimationFrame(raf)
      gsap.ticker.remove(refresh)
      tween?.kill()
    }
  }, [])

  useLayoutEffect(() => { refreshRef.current?.() }, [pathname])

  return (
    <div ref={rootRef} className="cal" data-mode="parked">
      <div className="cal-pop k-glass" aria-label="Book a call" aria-hidden="true" inert>
        <div className="cal-head">
          <span className="cal-title t-small">Book a call</span>
          <button type="button" className="cal-close" aria-label="Close">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
              <path d="M3.5 3.5 12.5 12.5M12.5 3.5 3.5 12.5" />
            </svg>
          </button>
        </div>
        <p className="cal-note t-small" hidden>Loading the calendar…</p>
        <div className="cal-host">
          <iframe src={CALENDLY_FRAME_URL} title="Book a thirty-minute call with Konaverse" loading="eager" tabIndex={-1} />
        </div>
        <div className="cal-inline-dim" aria-hidden="true" />
      </div>
    </div>
  )
}
