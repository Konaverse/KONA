'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import ServiceRays from '@/components/v4/ServiceRays'

/**
 * THE SERVICE HERO — THE SUNBURST (2026-09-30; replaces THE BRIEF,
 * RunBrief.tsx, which is parked unimported with its `.rb-*` rules).
 *
 * THE BRIEF (the user, on the old hero: "I don't like the hero at all";
 * the reference was a poster — one big word behind, a ring of rays
 * behind it, the heading on top, two buttons under it — "applying our
 * colors, and enriching it a little bit"; and "no mouse cursor, no
 * animations"). Keep the hub's dots, seen only where the hand is.
 *
 * THE PICTURE (run.css `.ro`). Three layers on the paper (the ground and
 * its hover dots are RunGround's, shared with the statement), back to
 * front:
 *   the RAYS — a ring of hairlines of uneven length, an empty core;
 *   the WORD — one lowercase word, pale, fitted to the frame and cut by
 *     both edges;
 *   the H1 — the display word and its modifier, centred, in ink (the
 *     reference's values: a light word, a dark heading).
 * Under them the two CTAs, and the up-link to the hub at the foot (the
 * facts that stood beside it were cut, 2026-09-30).
 *
 * STILL but for the rays (the user, after the first cut: "the circle
 * with the lines rotating and the lines animated, getting bigger and
 * smaller"): the ring turns slowly, and each ray breathes on its own
 * clock. ServiceRays draws their original dash lengths together; CSS
 * turns the picture. Nothing enters. The word is
 * measured once the fonts are in (and on resize) so it spans the frame
 * exactly. The CSS carries an estimate from
 * the letter count, so no JS reads almost the same picture.
 */

/** the word may not stand taller than this share of the hero */
const MAX_H = 0.8

export default function RunHero({
  word,
  modifier,
  back,
  name,
  children,
}: {
  word: string
  modifier: string
  /** the big word behind — decoration */
  back: string
  name: string
  /** the two CTAs, rendered by the page */
  children: ReactNode
}) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const hero = ref.current
    if (!hero) return
    const big = hero.querySelector<HTMLElement>('.ro-back')!

    /* THE FIT: scale the word so its ink spans the frame */
    const fit = () => {
      big.style.fontSize = ''
      const bigStyle = getComputedStyle(big)
      const cur = parseFloat(bigStyle.fontSize)
      // Local box dimensions exclude the incoming sheet's rotation/scale.
      const w = parseFloat(bigStyle.width) + (bigStyle.boxSizing === 'border-box'
        ? 0 : parseFloat(bigStyle.paddingLeft) + parseFloat(bigStyle.paddingRight))
      if (!w || !cur) return
      /* how far past the frame it runs (run.css --ro-span); phones turn
         the word (--ro-turn), so it spans the height and is capped by
         the width */
      const cs = getComputedStyle(hero)
      const span = parseFloat(cs.getPropertyValue('--ro-span')) || 1
      const turn = cs.getPropertyValue('--ro-turn').trim() === '1'
      const along = turn ? hero.clientHeight : hero.clientWidth
      const across = turn ? hero.clientWidth : hero.clientHeight
      const size = Math.min((cur * along * span) / w, across * MAX_H)
      big.style.fontSize = `${size.toFixed(2)}px`
    }
    let alive = true
    if (typeof document.fonts?.ready?.then === 'function') document.fonts.ready.then(() => alive && fit())
    else fit()
    const ro = new ResizeObserver(fit)
    ro.observe(hero)

    return () => {
      alive = false
      ro.disconnect()
      big.style.fontSize = ''
    }
  }, [back])

  /* a short modifier stands at the word's size, a long one under it */
  const long = modifier.length > 14

  return (
    <header
      ref={ref}
      id="brief"
      className="ro"
      data-nav-hero="0.5"
      style={{ '--ro-n': back.length } as React.CSSProperties}
    >
      <ServiceRays />

      <span className="ro-back" aria-hidden="true">
        {back}
      </span>

      <div className="ro-mid">
        <h1 className={`ro-h1${long ? ' is-long' : ''}`}>
          <span className="ro-word">{word}</span> <span className="ro-mod">{modifier}</span>
        </h1>
        <div className="ro-cta">{children}</div>
      </div>

      <div className="ro-foot">
        <nav aria-label="Breadcrumb">
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- PageTransition owns ordinary anchor navigation. */}
          <a href="/services">Services</a>
          <i aria-hidden="true">/</i>
          <span aria-current="page">{name}</span>
        </nav>
      </div>
    </header>
  )
}
