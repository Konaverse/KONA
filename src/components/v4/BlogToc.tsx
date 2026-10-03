'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/motion-v4'

/**
 * THE ARTICLE'S CONTENTS, WITH "YOU ARE HERE" (2026-10-03, owner: "the
 * pinned headlines should be distinct and a little zoomed in when we are
 * in that section… we need to know on the pinned navbar on the left
 * where we are at each moment").
 *
 * The list is server HTML (plain anchors; SmoothScroll eases to them).
 * This only marks the entry whose section is being read: the last heading
 * that has climbed past the upper third of the screen. One read per frame
 * off gsap.ticker, one class written when the answer changes; the look
 * (ink, heavier, a touch larger; no rule or bullet, the owner cut it) is
 * blog.css `.bl-toc li.is-on`. No JS: the list, unmarked.
 */
export default function BlogToc({ items }: { items: { id: string; text: string }[] }) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const nav = ref.current
    if (!nav) return
    const rows = Array.from(nav.querySelectorAll<HTMLElement>('li'))
    const heads = items.map((it) => document.getElementById(it.id))
    let on = -2
    const tick = () => {
      const line = window.innerHeight * 0.34
      let now = -1
      heads.forEach((h, i) => {
        if (h && h.getBoundingClientRect().top <= line) now = i
      })
      if (now === on) return
      on = now
      rows.forEach((li, i) => {
        li.classList.toggle('is-on', i === now)
        if (i === now) li.querySelector('a')?.setAttribute('aria-current', 'true')
        else li.querySelector('a')?.removeAttribute('aria-current')
      })
    }
    tick()
    gsap.ticker.add(tick)
    return () => {
      gsap.ticker.remove(tick)
      rows.forEach((li) => {
        li.classList.remove('is-on')
        li.querySelector('a')?.removeAttribute('aria-current')
      })
    }
  }, [items])

  return (
    <nav ref={ref} className="bl-toc" aria-label="In this article">
      <p className="bl-toc-k">In this article</p>
      <ol>
        {items.map((c) => (
          <li key={c.id}>
            <a href={`#${c.id}`}>{c.text}</a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
