'use client'

import { useEffect } from 'react'
import { gsap } from '@/lib/motion-v4'

/**
 * §2 — the claim's entrance, and nothing else. The statement lives INSIDE
 * the landed container (the pad the peel's sheet lands on); as the sheet
 * finishes expanding (section top 0.34→0.04 of the viewport) the words
 * resolve in the house signature — opacity + 18px rise + 14px blur
 * (the tokens' own --reveal-shift / --reveal-blur), feathered word by
 * word — and the paragraph resolves over the tail of the same window.
 * Scrubbed through Lenis, reversible by construction.
 *
 * That is ALL this driver does. The pinned shrink / dark-turn scene built
 * earlier on 2026-08-19 (ClaimShrink.tsx) was REMOVED the same day — user
 * call: "after the landing of the container, we scroll normally to the
 * next section, no pin, no shrink no nothing."
 *
 * Engages only once `.hm-heropin.is-run` exists — HeroPeel's "GL is real"
 * signal — so every fallback mode (no JS / reduced motion / mobile / no
 * WebGL / texture failure) keeps the plain screen with the statement
 * fully visible (SSR, SEO D5).
 *
 * House pattern: gsap.ticker + rect math, no scroll listeners.
 */
export default function ClaimEntrance() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const sec = document.querySelector<HTMLElement>('.hm-claim')
    const heropin = document.querySelector<HTMLElement>('.hm-heropin')
    if (!sec || !heropin) return
    const body = sec.querySelector<HTMLElement>('.hm-claim-body')
    const words = Array.from(sec.querySelectorAll<HTMLElement>('.hm-cw-i'))
    if (!words.length) return

    let engaged = false
    let lastPe = -1

    const tick = () => {
      if (!engaged) {
        if (!heropin.classList.contains('is-run')) return
        engaged = true
      }

      const vh = window.innerHeight
      const r = sec.getBoundingClientRect()
      if (r.bottom < -120 || r.top > vh + 120) return

      const pe = gsap.utils.clamp(0, 1, (vh * 0.34 - r.top) / (vh * 0.3))
      if (pe === lastPe) return
      lastPe = pe

      const F = 4
      const head = pe * (words.length + F)
      for (let i = 0; i < words.length; i++) {
        const t = gsap.utils.clamp(0, 1, (head - i) / F)
        const w = words[i]
        if (t >= 1) {
          w.style.opacity = ''
          w.style.transform = ''
          w.style.filter = ''
        } else {
          w.style.opacity = t.toFixed(3)
          w.style.transform = `translateY(${(18 * (1 - t)).toFixed(1)}px)`
          w.style.filter = `blur(${(14 * (1 - t)).toFixed(1)}px)`
        }
      }
      if (body) {
        const tb = gsap.utils.clamp(0, 1, (pe - 0.6) / 0.4)
        if (tb >= 1) {
          body.style.opacity = ''
          body.style.transform = ''
          body.style.filter = ''
        } else {
          body.style.opacity = tb.toFixed(3)
          body.style.transform = `translateY(${(18 * (1 - tb)).toFixed(1)}px)`
          body.style.filter = `blur(${(10 * (1 - tb)).toFixed(1)}px)`
        }
      }
    }

    gsap.ticker.add(tick)
    return () => gsap.ticker.remove(tick)
  }, [])

  return null
}
