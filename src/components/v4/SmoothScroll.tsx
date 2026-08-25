'use client'

import { useEffect, type ReactNode } from 'react'
import Lenis from '@studio-freight/lenis'
import { gsap } from '@/lib/motion-v4'

/**
 * Lenis, driving NATIVE window scroll — no transform wrapper, so position:
 * sticky and IntersectionObserver both keep working. That was a hard-won
 * detail on the previous build and it is worth not relearning.
 *
 * Driven off gsap.ticker rather than its own rAF loop so there is exactly one
 * animation frame source on the page; two loops fighting is how scroll-linked
 * motion ends up a frame behind the scroll position.
 *
 * Disabled outright under prefers-reduced-motion — smoothing IS motion, and
 * hijacked scrolling is a common vestibular trigger.
 */
/**
 * The live instance, module-scoped.
 *
 * Lenis owns scrolling, so anything that needs to *move* the scroll position
 * has to go through it rather than window.scrollTo — notably the page
 * transition, which must land the incoming route at the top instead of
 * inheriting the outgoing route's offset (checklist §5.3). Null under reduced
 * motion, where Lenis is never constructed and native scroll applies; callers
 * must handle that.
 */
let lenis: Lenis | null = null
export const getLenis = () => lenis

export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const instance = new Lenis({ lerp: 0.1, smoothWheel: true })
    lenis = instance

    const tick = (time: number) => instance.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    /* IN-PAGE ANCHORS (one-page launch, docs/launch-plan.md §1). A native
     * hash jump sets scrollY under Lenis's feet; Lenis then eases from
     * wherever it thought it was — a visible snap-then-drift. So every
     * same-page link is routed through lenis.scrollTo: `#id` eases to the
     * section, and a link to the page itself (the brand, "Home") eases to
     * the top. Delegated on document so the aperture menu, the footer and
     * the buttons all get it without a call site changing. The hash is
     * still written to the URL (replaceState) so a shared link lands right.
     * Without JS the links are plain anchors and just work. */
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as HTMLElement | null)?.closest?.('a')
      if (!a || !a.getAttribute('href')) return
      if (a.target && a.target !== '_self') return
      let url: URL
      try {
        url = new URL(a.href, window.location.href)
      } catch {
        return
      }
      if (url.origin !== window.location.origin) return
      if (url.pathname !== window.location.pathname) return
      const target: string | number = url.hash && url.hash !== '#' ? url.hash : 0
      if (typeof target === 'string' && !document.querySelector(target)) return
      e.preventDefault()
      instance.scrollTo(target, { duration: 1.4 })
      history.replaceState(null, '', typeof target === 'string' ? target : window.location.pathname)
    }
    document.addEventListener('click', onClick)

    /* A deep link (`/#work`) arrives with the browser already jumped there
     * before Lenis existed; tell Lenis so it does not ease back to 0. */
    if (window.location.hash && document.querySelector(window.location.hash)) {
      instance.scrollTo(window.location.hash, { immediate: true })
    }

    return () => {
      document.removeEventListener('click', onClick)
      gsap.ticker.remove(tick)
      instance.destroy()
      if (lenis === instance) lenis = null
    }
  }, [])

  return <>{children}</>
}
