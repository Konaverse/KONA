'use client'

import { createElement, useCallback, useEffect, useRef } from 'react'
import { gsap, EASE } from '@/lib/motion-v4'

/**
 * THE BLOCK WIPE (2026-09-14, user: researchdesignagency.com's text
 * reveal, "apply it to some of our text reveals where it suits best").
 * Measured off the live page frame by frame (extract/rda/):
 *
 *   per line   a solid bar grows from the LEFT edge over the line
 *              (0.5s, in-out), holds a beat (0.25s) during which the
 *              text underneath snaps on, then shrinks toward the RIGHT
 *              edge (0.5s, in-out) uncovering the text as if painted in
 *   lines      0.15s apart
 *   trigger    once, when the block's top reaches ~70% of the viewport
 *
 * The bar is the polarity's text colour — ink on paper, paper on the
 * void — so one component serves both grounds.
 *
 * SERVER-RENDERED PLAIN: the element ships with its full text, readable
 * (SEO D5, no JS, reduced motion). The driver splits it into lines on
 * mount by measuring where the words wrap, rebuilds each line as a
 * clipped block with its bar, and plays once. The real string stays in
 * aria-label; the line spans are aria-hidden. A resize before the wipe
 * has played re-splits; after it, the text is plain again and nothing
 * is left to break.
 *
 * WHERE IT LIVES: the About statement, the services hub's lead, the
 * case studies' section heads — multi-line statements that enter on
 * scroll, the reference's own use. The scroll-fill (ScrollFillText)
 * stays where the hand is meant to drive the read: the invitation, the
 * people's own lines.
 */
const GROW = 0.5
const HOLD = 0.25
const SHRINK = 0.5
const STEP = 0.15

export default function BlockReveal({
  text,
  as = 'p',
  className = '',
  id,
}: {
  text: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'div'
  className?: string
  id?: string
}) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let played = false
    let tl: gsap.core.Timeline | null = null

    /* split by MEASUREMENT: words in spans, grouped by their top */
    const split = () => {
      el.textContent = ''
      const probe = document.createElement('span')
      probe.setAttribute('aria-hidden', 'true')
      const words = text.split(/\s+/).filter(Boolean)
      const spans = words.map((w) => {
        const s = document.createElement('span')
        s.textContent = w
        s.style.display = 'inline-block'
        probe.appendChild(s)
        probe.appendChild(document.createTextNode(' '))
        return s
      })
      el.appendChild(probe)
      /* offsetTop is relative to the nearest positioned ancestor — the
         element itself when it is positioned, so the first line can sit
         at 0. The first word always opens a line; a sentinel would not. */
      const lines: string[][] = []
      let top = 0
      spans.forEach((s, i) => {
        if (i === 0 || Math.abs(s.offsetTop - top) > 2) {
          lines.push([])
          top = s.offsetTop
        }
        lines[lines.length - 1].push(s.textContent || '')
      })
      el.textContent = ''
      const wrap = document.createElement('span')
      wrap.setAttribute('aria-hidden', 'true')
      lines.forEach((ws) => {
        const l = document.createElement('span')
        l.className = 'k-wipe-l'
        const t = document.createElement('span')
        t.className = 'k-wipe-t'
        t.textContent = ws.join(' ')
        const b = document.createElement('i')
        b.className = 'k-wipe-b'
        l.append(t, b)
        wrap.appendChild(l)
      })
      el.appendChild(wrap)
      el.classList.add('is-wipe')
    }

    const play = () => {
      if (played) return
      played = true
      const lines = Array.from(el.querySelectorAll<HTMLElement>('.k-wipe-l'))
      tl = gsap.timeline({
        onComplete: () => {
          /* plain again: the text, nothing else */
          el.classList.remove('is-wipe')
          el.textContent = text
        },
      })
      lines.forEach((l, i) => {
        const t = l.querySelector<HTMLElement>('.k-wipe-t')
        const b = l.querySelector<HTMLElement>('.k-wipe-b')
        if (!t || !b) return
        const at = i * STEP
        tl!.fromTo(b, { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: GROW, ease: EASE.drift }, at)
        tl!.set(t, { opacity: 1 }, at + GROW + HOLD / 2)
        tl!.set(b, { transformOrigin: '100% 50%' }, at + GROW + HOLD)
        tl!.to(b, { scaleX: 0, duration: SHRINK, ease: EASE.drift }, at + GROW + HOLD)
      })
    }

    split()
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return
        io.disconnect()
        play()
      },
      /* the reference fires with the block's top at ~70% of the viewport */
      { rootMargin: '0px 0px -30% 0px', threshold: 0 },
    )
    io.observe(el)

    let raf = 0
    const onResize = () => {
      if (played) return
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(split)
    }
    window.addEventListener('resize', onResize)
    return () => {
      io.disconnect()
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(raf)
      tl?.kill()
      el.classList.remove('is-wipe')
      el.textContent = text
    }
  }, [text])

  /* a callback ref (the tag is polymorphic), outside render for the
     compiler's ref rule */
  const setRef = useCallback((node: HTMLElement | null) => {
    ref.current = node
  }, [])
  return createElement(as, { ref: setRef, id, className: `k-wipe ${className}`.trim(), 'aria-label': text }, text)
}
