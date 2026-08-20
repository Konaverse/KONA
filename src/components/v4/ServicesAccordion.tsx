'use client'

import { useEffect, useRef } from 'react'
import { SERVICES, Letters } from '@/components/v4/services-data'
import Reveal from '@/components/v4/Reveal'
import ArrowLink from '@/components/v4/ArrowLink'
import Button from '@/components/v4/Button'
import { getLenis } from '@/components/v4/SmoothScroll'
import { gsap, EASE } from '@/lib/motion-v4'

/**
 * SECTION 4 — WHAT WE DO: the accordion (user-directed 2026-08-19,
 * replacing the index/detail instrument; adaptation notes in the
 * choreography doc §4).
 *
 * Closed, the section is six full-bleed rows, each carrying ONLY the
 * service name — display scale, centered, muted — between edge-to-edge
 * hairlines. Hover answers twice: the name letter-fills to ink (§2's fill
 * signature at hover speed), and the service's image rides the cursor as
 * a small satellite card, springing after the pointer with a touch of
 * velocity tilt.
 *
 * THE OPEN. Clicking a row hands the satellite off to the room: the same
 * image BLOOMS from under the pointer (clip-path circle from the click
 * point) to become the panel's full-bleed dark ground while the row
 * grows to make space — the reveal and the growth are one gesture. Over
 * the image: the service's hairline glyph redrawn as an ice-lit
 * instrument (drawing itself in, then keeping its one idle), the masked
 * rising numeral, the paragraph, three "includes" lines, and the one
 * button out — to the services hub, anchored at this service, which is
 * how "a button to the service" and architecture §8's hub-only rule
 * both hold.
 *
 * One row open at a time; opening another closes the first mid-gesture.
 * Escape closes. There is NO auto-cycle — an accordion that opens itself
 * fights the hand that owns it, and the height changes would shove the
 * page around under a reader who never asked. The tease at the cursor is
 * what demonstrates the section instead.
 *
 * SEO/no-JS: all names, paragraphs and includes are server-rendered, and
 * the SSR state is EVERY PANEL OPEN — the no-JS page reads as six full
 * illustrated blocks. JS (`is-live`) collapses them. Reduced motion: no
 * satellite, no bloom, instant open/close. All copy is PLACEHOLDER — the
 * user writes the real lines (checklist 6.6).
 *
 * CSS in home.css (.wa-*; the glyphs keep their .wd-glyph classes).
 */


export default function ServicesAccordion() {
  const rootRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches

    const list = root.querySelector<HTMLElement>('.wa-list')
    if (!list) return
    const parts = Array.from(root.querySelectorAll<HTMLElement>('.wa-item')).map((item) => ({
      item,
      head: item.querySelector<HTMLButtonElement>('.wa-head-btn')!,
      body: item.querySelector<HTMLElement>('.wa-body')!,
      bg: item.querySelector<HTMLElement>('.wa-bg')!,
      img: item.querySelector<HTMLImageElement>('.wa-bg img')!,
      num: item.querySelector<HTMLElement>('.wa-num')!,
      bits: Array.from(item.querySelectorAll<HTMLElement>('.wa-bit')),
      draws: Array.from(item.querySelectorAll<SVGGeometryElement>('.g-draw')),
    }))
    if (parts.length === 0) return

    /* ---- collapse the server-rendered all-open state ---- */
    list.classList.add('is-live')
    let open = -1
    parts.forEach((p) => {
      p.item.classList.remove('is-open')
      p.head.setAttribute('aria-expanded', 'false')
      gsap.set(p.body, { height: 0 })
      gsap.set(p.bg, { autoAlpha: 0 })
      gsap.set(p.bits, { autoAlpha: 0, y: 18, filter: 'blur(14px)' })
      gsap.set(p.num, { yPercent: 112 })
      gsap.set(p.draws, { strokeDashoffset: 100 })
    })

    /* Panel images are lazy so the no-JS page still behaves; live, they are
       promoted to eager once the section is NEAR (not visible — the bloom
       must never open onto a half-loaded frame), and the satellite divs get
       their backgrounds in the same pass. */
    const curImgs = Array.from(root.querySelectorAll<HTMLElement>('.wa-curimg'))
    const promote = () => {
      parts.forEach((p) => {
        p.img.loading = 'eager'
      })
      curImgs.forEach((el) => {
        const src = el.dataset.bg
        if (src) el.style.backgroundImage = `url("${src}")`
      })
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          promote()
          io.disconnect()
        }
      },
      { rootMargin: '60% 0px' },
    )
    io.observe(list)

    /* ---- the satellite: the image riding the cursor ---- */
    const cursor = root.querySelector<HTMLElement>('.wa-cursor')
    let curShown = false
    let lastX = 0
    let qx: ((v: number) => void) | null = null
    let qy: ((v: number) => void) | null = null
    let qr: ((v: number) => void) | null = null
    if (cursor && fine && !reduced) {
      gsap.set(cursor, { xPercent: -50, yPercent: -56, autoAlpha: 0, scale: 0.85 })
      qx = gsap.quickTo(cursor, 'x', { duration: 0.5, ease: 'power3' })
      qy = gsap.quickTo(cursor, 'y', { duration: 0.5, ease: 'power3' })
      qr = gsap.quickTo(cursor, 'rotation', { duration: 0.6, ease: 'power2' })
    }
    const showCursor = (i: number) => {
      if (!cursor || !qx) return
      curImgs.forEach((el, j) =>
        gsap.to(el, { autoAlpha: j === i ? 1 : 0, duration: 0.3, ease: EASE.settle }),
      )
      if (!curShown) {
        curShown = true
        gsap.to(cursor, { autoAlpha: 1, scale: 1, duration: 0.4, ease: EASE.settle })
      }
    }
    const hideCursor = (handoff = false) => {
      if (!cursor || !curShown) return
      curShown = false
      gsap.to(cursor, {
        autoAlpha: 0,
        scale: handoff ? 1.12 : 0.9,
        duration: 0.3,
        ease: EASE.settle,
      })
    }
    /* tracking lives on the SECTION, not the rows, so the satellite has
       already caught up (invisibly) by the time a row shows it */
    const onMove = (e: PointerEvent) => {
      if (!qx || !qy || !qr) return
      qx(e.clientX)
      qy(e.clientY)
      qr(gsap.utils.clamp(-9, 9, (e.clientX - lastX) * 0.5))
      lastX = e.clientX
    }
    const onOver = (e: PointerEvent) => {
      const item = (e.target as HTMLElement | null)?.closest?.('.wa-item')
      const i = parts.findIndex((p) => p.item === item)
      if (i >= 0 && i !== open) showCursor(i)
      else hideCursor()
    }
    const onLeave = () => hideCursor()
    if (cursor && fine && !reduced) {
      root.addEventListener('pointermove', onMove, { passive: true })
      list.addEventListener('pointerover', onOver)
      list.addEventListener('pointerleave', onLeave)
    }

    /* ---- open / close ---- */
    const killItem = (p: (typeof parts)[number]) =>
      gsap.killTweensOf([p.body, p.bg, p.img, p.num, ...p.bits, ...p.draws])

    const closeItem = (i: number, switching = false) => {
      const p = parts[i]
      if (!switching && open === i) open = -1
      p.item.classList.remove('is-open')
      p.head.setAttribute('aria-expanded', 'false')
      killItem(p)
      if (reduced) {
        gsap.set(p.body, { height: 0 })
        gsap.set(p.bg, { autoAlpha: 0 })
        gsap.set(p.bits, { autoAlpha: 0, y: 18, filter: 'blur(14px)' })
        gsap.set(p.num, { yPercent: 112 })
        gsap.set(p.draws, { strokeDashoffset: 100 })
        return
      }
      const tl = gsap.timeline()
      tl.to(p.body, { height: 0, duration: 0.7, ease: EASE.arc }, 0)
      tl.to(p.bg, { autoAlpha: 0, duration: 0.45, ease: EASE.settle }, 0.1)
      /* reset the furniture once it is out of sight, ready for the next open */
      tl.set(p.bits, { autoAlpha: 0, y: 18, filter: 'blur(14px)' }, 0.55)
      tl.set(p.num, { yPercent: 112 }, 0.55)
      tl.set(p.draws, { strokeDashoffset: 100 }, 0.55)
    }

    const openItem = (i: number, px?: number, py?: number) => {
      const p = parts[i]
      const prev = open
      open = i
      if (prev >= 0) closeItem(prev, true)
      p.item.classList.add('is-open')
      p.head.setAttribute('aria-expanded', 'true')
      killItem(p)
      hideCursor(true)

      if (reduced) {
        gsap.set(p.body, { height: 'auto' })
        gsap.set(p.bg, { autoAlpha: 1, clipPath: 'none' })
        gsap.set(p.img, { scale: 1 })
        gsap.set(p.bits, { autoAlpha: 1, y: 0, filter: 'none' })
        gsap.set(p.num, { yPercent: 0 })
        gsap.set(p.draws, { strokeDashoffset: 0 })
        return
      }

      /* the bloom's origin: the pointer, in item coordinates. Keyboard and
         touch-without-coords get a centred origin instead. */
      const ir = p.item.getBoundingClientRect()
      const hasPoint = px != null && py != null
      const ox = hasPoint ? px! - ir.left : ir.width * 0.5
      const oy = hasPoint ? py! - ir.top : ir.height * 0.6
      /* final footprint = header as-is + the body's content height; the
         radius must reach the farthest corner of THAT rect, not the
         still-collapsed one */
      const fh = ir.height + p.body.scrollHeight
      const R = Math.ceil(Math.hypot(Math.max(ox, ir.width - ox), Math.max(oy, fh - oy)))
      /* from roughly the satellite's own footprint, so the bloom reads as
         the card growing rather than a pinhole opening */
      const r0 = hasPoint ? 120 : 16

      const tl = gsap.timeline()
      /* the room: image blooms from the pointer while the row makes space —
         one gesture, two consequences */
      tl.set(p.bg, { autoAlpha: 1, clipPath: `circle(${r0}px at ${ox}px ${oy}px)` }, 0)
      tl.to(p.bg, { clipPath: `circle(${R}px at ${ox}px ${oy}px)`, duration: 1.0, ease: EASE.glass }, 0)
      /* release the clip once fully open, so resizes never crop the room */
      tl.set(p.bg, { clipPath: 'none' })
      tl.fromTo(p.img, { scale: 1.08 }, { scale: 1, duration: 2.2, ease: EASE.glass }, 0)
      tl.to(p.body, { height: 'auto', duration: 0.9, ease: EASE.arc }, 0)
      /* the furniture arrives once the ground is laid */
      tl.fromTo(p.num, { yPercent: 112 }, { yPercent: 0, duration: 0.55, ease: EASE.glass }, 0.3)
      tl.fromTo(
        p.draws,
        { strokeDashoffset: 100 },
        { strokeDashoffset: 0, duration: 0.9, ease: EASE.glass, stagger: 0.07 },
        0.35,
      )
      tl.to(
        p.bits,
        { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.6, ease: EASE.glass, stagger: 0.08 },
        0.4,
      )
      /* settle the frame once every height in the neighbourhood has landed —
         positions read now would be stale mid-collapse of the previous item */
      tl.call(
        () => {
          if (open === i) getLenis()?.scrollTo(p.item, { offset: -72, duration: 0.9 })
        },
        [],
        0.95,
      )
    }

    const unbind: Array<() => void> = []
    parts.forEach((p, i) => {
      const onClick = (e: MouseEvent) => {
        if (open === i) closeItem(i)
        /* e.detail === 0 is a keyboard activation — no honest pointer origin */
        else if (e.detail === 0) openItem(i)
        else openItem(i, e.clientX, e.clientY)
      }
      p.head.addEventListener('click', onClick)
      unbind.push(() => p.head.removeEventListener('click', onClick))
    })

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open >= 0) closeItem(open)
    }
    window.addEventListener('keydown', onKey)

    return () => {
      unbind.forEach((f) => f())
      window.removeEventListener('keydown', onKey)
      root.removeEventListener('pointermove', onMove)
      list.removeEventListener('pointerover', onOver)
      list.removeEventListener('pointerleave', onLeave)
      io.disconnect()
      parts.forEach(killItem)
      if (cursor) gsap.killTweensOf(cursor)
    }
  }, [])

  return (
    <section ref={rootRef} className="wa k-section">
      <div className="k-page">
        <Reveal as="h2" className="t-h1 wa-head">
          Everything a site needs to <em>carry the story</em>.
        </Reveal>
      </div>

      <div className="wa-list">
        {SERVICES.map((s, i) => (
          <article key={s.slug} className="wa-item is-open">
            <h3 className="wa-h">
              <button
                type="button"
                className="wa-head-btn"
                id={`wa-tab-${i}`}
                aria-expanded="true"
                aria-controls={`wa-panel-${i}`}
              >
                <span className="sr-only">{s.name}</span>
                <Reveal as="span" className="wa-title" index={i}>
                  <Letters text={s.name} />
                </Reveal>
              </button>
            </h3>

            <div
              className="wa-body"
              id={`wa-panel-${i}`}
              role="region"
              aria-labelledby={`wa-tab-${i}`}
            >
              <div className="wa-panel k-page">
                <span className="wa-mask" aria-hidden="true">
                  <span className="wa-num">{String(i + 1).padStart(2, '0')}</span>
                </span>
                <div className="wa-cols">
                  <div className="wa-info">
                    <p className="wa-para wa-bit">{s.para}</p>
                    <ul className="wa-incl wa-bit">
                      {s.includes.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                    <div className="wa-cta wa-bit">
                      <Button href={`/services#${s.slug}`}>Explore the service</Button>
                    </div>
                  </div>
                  {s.glyph}
                </div>
              </div>
            </div>

            <div className="wa-bg" aria-hidden="true">
              <img src={s.image} alt="" width={s.w} height={s.h} loading="lazy" decoding="async" />
              <i className="wa-scrim" />
            </div>
          </article>
        ))}
      </div>

      <div className="k-page">
        <Reveal as="div" className="wa-foot" index={1}>
          <ArrowLink href="/services">All six, in full</ArrowLink>
        </Reveal>
      </div>

      {/* §4's handoff: one last hairline before the page-turn (doc §4) */}
      <hr className="k-rule wa-foot-rule" />

      {/* the satellite — a duplicate of the six images as background divs so
          nothing loads for touch devices, where this never shows */}
      <div className="wa-cursor" aria-hidden="true">
        {SERVICES.map((s) => (
          <i key={s.slug} className="wa-curimg" data-bg={s.image} />
        ))}
      </div>
    </section>
  )
}
