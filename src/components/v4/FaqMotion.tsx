'use client'

import { useEffect } from 'react'

/**
 * THE FAQ'S OPEN AND CLOSE (2026-10-03, owner: "when I click on a
 * question it needs to open smoothly", desktop and phone).
 *
 * The rows are native <details> (contact/page.tsx) and stay so: without
 * JS they open and shut at once and every answer is in the HTML. The
 * browser's own animation (`::details-content` + `interpolate-size`) is
 * Chromium only — on an iPhone a row simply snapped — so the motion is
 * done here, the same everywhere: the answer's box (`.ct-a`) is run
 * between 0 and its content's height by the Web Animations API, the
 * `open` attribute set before an open and cleared after a close. One row
 * open at a time: opening one closes the other on the same clock.
 *
 * Reduced motion: the rows toggle at once (still one at a time).
 */

const OPEN = 520
const CLOSE = 380
const CURVE = 'cubic-bezier(0.22, 1, 0.36, 1)'

export default function FaqMotion({ selector = '.ct-q' }: { selector?: string }) {
  useEffect(() => {
    const rows = Array.from(document.querySelectorAll<HTMLDetailsElement>(selector))
    if (!rows.length) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const running = new Map<HTMLDetailsElement, Animation>()
    const box = (d: HTMLDetailsElement) => d.querySelector<HTMLElement>('.ct-a')

    /** run a row's answer to open or shut, from wherever it stands */
    const run = (d: HTMLDetailsElement, open: boolean) => {
      const a = box(d)
      if (!a) return
      const from = d.open ? a.getBoundingClientRect().height : 0
      running.get(d)?.cancel()
      d.classList.toggle('is-open', open)
      if (open) d.open = true
      const to = open ? a.scrollHeight : 0
      if (reduce) {
        d.open = open
        return
      }
      const anim = a.animate(
        [
          { height: `${from}px`, opacity: open ? 0 : 1 },
          { height: `${to}px`, opacity: open ? 1 : 0 },
        ],
        { duration: open ? OPEN : CLOSE, easing: CURVE },
      )
      running.set(d, anim)
      anim.onfinish = () => {
        running.delete(d)
        if (!open) d.open = false
      }
    }

    const onClick = (e: MouseEvent) => {
      const summary = (e.target as HTMLElement | null)?.closest?.('summary')
      const d = summary?.parentElement as HTMLDetailsElement | null
      if (!summary || !d || !rows.includes(d)) return
      e.preventDefault()
      const open = !d.classList.contains('is-open')
      if (open) rows.forEach((o) => o !== d && o.classList.contains('is-open') && run(o, false))
      run(d, open)
    }
    rows.forEach((d) => d.classList.toggle('is-open', d.open))
    document.addEventListener('click', onClick)
    return () => {
      document.removeEventListener('click', onClick)
      running.forEach((a) => a.cancel())
      rows.forEach((d) => d.classList.remove('is-open'))
    }
  }, [selector])

  return null
}
