'use client'

import { Fragment, useEffect, useRef } from 'react'
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

type Service = {
  slug: string
  name: string
  para: string
  includes: [string, string, string]
  image: string
  w: number
  h: number
  glyph: React.ReactNode
}

/* The glyphs: stroke-drawn instruments, viewBox 100, hairline weight held
   by vector-effect in CSS. Every drawable stroke carries pathLength=100 +
   .g-draw so one dashoffset tween draws any of them edge-to-edge; dots and
   dashed strokes stay out of the draw (a dash pattern and the draw trick
   share stroke-dasharray and cannot coexist). Each is a small SCENE, not an
   icon (user call: "each one needs to be magnificent"), and each keeps one
   or two idle motions, keyed by its .wd-g* class in home.css. Carried over
   unchanged from the index/detail instrument — in the accordion they play
   over the panel image as ice-lit line work (the "animated neon icon" ask,
   executed in the house accent). */
const GLYPHS = {
  three_d: (
    /* The hero object's world: cube with trapped air, two crossed orbits,
       one sparkle. The orbit PLANES never rotate — a flat ellipse swept in
       the plane reads as a clock hand and periodically tangles the cube
       (seen on film); instead the DOTS travel their ellipses via
       offset-path, which is the hero's own rule: attitude constant, motion
       carried by what rides the orbit. */
    <svg className="wd-glyph wd-g1" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <ellipse cx="50" cy="52" rx="46" ry="13" pathLength={100} className="g-draw" transform="rotate(-16 50 52)" />
      <ellipse cx="50" cy="50" rx="30" ry="9" pathLength={100} className="g-draw" transform="rotate(58 50 50)" />
      <path className="g-draw" pathLength={100} d="M50 18 L72 29 L50 40 L28 29 Z" />
      <path className="g-draw" pathLength={100} d="M28 29 L28 55 L50 66 L50 40" />
      <path className="g-draw" pathLength={100} d="M72 29 L72 55 L50 66" />
      {/* the trapped air */}
      <circle cx="44" cy="50" r="1.2" className="g-dot" />
      <circle cx="55" cy="45" r="0.9" className="g-dot" />
      <circle cx="48" cy="58" r="1" className="g-dot" />
      <path className="g-draw g-spark" pathLength={100} d="M82 10 L84.2 15.8 L90 18 L84.2 20.2 L82 26 L79.8 20.2 L74 18 L79.8 15.8 Z" />
      {/* the travellers — positioned entirely by offset-path (CSS hides
          them where Motion Path is unsupported) */}
      <circle r="2.2" className="g-dot g-orbdot g-orbdot1" />
      <circle r="1.8" className="g-dot g-orbdot g-orbdot2" />
    </svg>
  ),
  design: (
    /* the hero's stage in miniature: the staircase window, its own layout
       roughed in, and the designer's cursor still moving things */
    <svg className="wd-glyph wd-g2" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <path
        className="g-draw"
        pathLength={100}
        d="M56 14 H 86 A 6 6 0 0 1 92 20 V 44 A 6 6 0 0 1 86 50 H 62 A 6 6 0 0 0 56 56 V 80 A 6 6 0 0 1 50 86 H 14 A 6 6 0 0 1 8 80 V 56 A 6 6 0 0 1 14 50 H 44 A 6 6 0 0 0 50 44 V 20 A 6 6 0 0 1 56 14 Z"
      />
      {/* headline + chip in the tall block */}
      <path className="g-draw" pathLength={100} d="M62 24 H 84" />
      <path className="g-draw" pathLength={100} d="M62 31 H 78" />
      <rect x="62" y="37" width="14" height="6" rx="3" pathLength={100} className="g-draw" />
      {/* paragraph in the wide block */}
      <path className="g-draw" pathLength={100} d="M14 60 H 44" />
      <path className="g-draw" pathLength={100} d="M14 67 H 38" />
      <path className="g-draw" pathLength={100} d="M14 74 H 30" />
      <path className="g-draw g-cursor" pathLength={100} d="M68 56 L68 70 L72 66.5 L75 73 L77.5 71.5 L74.5 65 L79 64.5 Z" />
    </svg>
  ),
  development: (
    /* the editor: a browser frame, code with real indentation, brackets,
       one line still being typed and the caret keeping time */
    <svg className="wd-glyph wd-g3" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <rect x="10" y="16" width="80" height="66" rx="5" pathLength={100} className="g-draw" />
      <path className="g-draw" pathLength={100} d="M10 28 H 90" />
      <circle cx="17" cy="22" r="1.6" className="g-dot" />
      <circle cx="24" cy="22" r="1.6" className="g-dot" />
      <path className="g-draw" pathLength={100} d="M18 40 H 44" />
      <path className="g-draw g-type" pathLength={100} d="M24 49 H 56" />
      <path className="g-draw" pathLength={100} d="M24 58 H 48" />
      <path className="g-draw" pathLength={100} d="M18 67 H 38" />
      <path className="g-draw" pathLength={100} d="M68 42 L61 53 L68 64" />
      <path className="g-draw" pathLength={100} d="M78 42 L85 53 L78 64" />
      <path className="g-draw g-caret" pathLength={100} d="M75 40 L71 66" />
    </svg>
  ),
  one_page: (
    /* The one page, alive: content and scroll dot travel together — the
       glyph demonstrates scrolling the way §3 demonstrates parallax. The
       content is CLIPPED to the page and runs taller than it, so the
       travel reveals below-the-fold blocks instead of poking past the
       frame (the unclipped first cut did exactly that on film). */
    <svg className="wd-glyph wd-g4" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id="wd-g4-clip">
          <rect x="31.5" y="9.5" width="37" height="81" rx="5" />
        </clipPath>
      </defs>
      <rect x="30" y="8" width="40" height="84" rx="6" pathLength={100} className="g-draw" />
      <g className="g-page" clipPath="url(#wd-g4-clip)">
        <rect x="36" y="16" width="28" height="14" rx="2" pathLength={100} className="g-draw" />
        <path className="g-draw" pathLength={100} d="M36 38 H 62" />
        <path className="g-draw" pathLength={100} d="M36 45 H 58" />
        <path className="g-draw" pathLength={100} d="M36 52 H 54" />
        <rect x="36" y="61" width="16" height="7" rx="3.5" pathLength={100} className="g-draw" />
        <path className="g-draw" pathLength={100} d="M36 78 H 60" />
        {/* below the fold — what the scroll travel reveals */}
        <rect x="36" y="86" width="28" height="12" rx="2" pathLength={100} className="g-draw" />
        <path className="g-draw" pathLength={100} d="M36 106 H 56" />
      </g>
      <path className="g-draw" pathLength={100} d="M78 16 V 84" />
      <circle cx="78" cy="22" r="2.2" className="g-dot g-scroll" />
    </svg>
  ),
  redesign: (
    /* the transformation: the old page dashed and swaying, the new one
       solid and still, and the flow between them never stopping */
    <svg className="wd-glyph wd-g5" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <g className="g-old">
        <rect x="12" y="30" width="34" height="44" strokeDasharray="3.2 3" />
        <path d="M18 40 H 40" strokeDasharray="3.2 3" />
        <path d="M18 48 H 36" strokeDasharray="3.2 3" />
        <path d="M18 56 H 30" strokeDasharray="3.2 3" />
      </g>
      <rect x="50" y="28" width="38" height="50" rx="5" pathLength={100} className="g-draw" />
      <path className="g-draw" pathLength={100} d="M57 40 H 80" />
      <path className="g-draw" pathLength={100} d="M57 48 H 74" />
      <rect x="57" y="57" width="14" height="8" rx="2" pathLength={100} className="g-draw" />
      {/* the flow: a dashed arc whose dashes march old → new */}
      <path className="g-flow" d="M30 20 C 42 6, 60 6, 70 17" strokeDasharray="4 4" />
      <path className="g-draw" pathLength={100} d="M64.5 15.5 L70 17 L68 10.5" />
    </svg>
  ),
  seo: (
    /* the results page: three results, the top one starred, and inside the
       lens the only thing that matters — the line going up */
    <svg className="wd-glyph wd-g6" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <path className="g-draw" pathLength={100} d="M12 24 H 48" />
      <path className="g-draw" pathLength={100} d="M12 31 H 36" />
      <path className="g-draw" pathLength={100} d="M12 46 H 52" />
      <path className="g-draw" pathLength={100} d="M12 53 H 40" />
      <path className="g-draw" pathLength={100} d="M12 68 H 44" />
      <path className="g-draw" pathLength={100} d="M12 75 H 32" />
      <path className="g-draw g-spark" pathLength={100} d="M56 21 L57.2 23.8 L60 25 L57.2 26.2 L56 29 L54.8 26.2 L52 25 L54.8 23.8 Z" />
      <g className="g-lens">
        <circle cx="70" cy="52" r="17" pathLength={100} className="g-draw" />
        <path className="g-draw" pathLength={100} d="M60 58 L66 53 L70 55 L78 45" />
        <circle cx="78" cy="45" r="1.6" className="g-dot" />
        <path className="g-draw" pathLength={100} d="M82 64 L 92 74" />
      </g>
    </svg>
  ),
} as const

/* The imagery: the moody-blue art-direction set (design/images), converted
   to public/services/. Chosen from the frames NOT already spent on this
   page — §3 holds the glass portrait, the hero holds the distorted one and
   the typing chip, §5's three featured sheets hold fog/city/hall. Stand-in
   art like §5's: replaced when real per-service artwork lands. */
const SERVICES: Service[] = [
  {
    slug: '3d-websites',
    name: '3D Websites',
    para: 'Real dimension for brands that need presence felt rather than described. Path-traced, pre-rendered, and engineered to read premium on every device.',
    includes: [
      'Path-traced renders, never live guesswork',
      'Scroll-driven object choreography',
      'Premium on every device, not just yours',
    ],
    image: '/services/3d.webp',
    w: 1024,
    h: 1536,
    glyph: GLYPHS.three_d,
  },
  {
    slug: 'web-design',
    name: 'Web Design',
    para: 'Interfaces with editorial calm and deliberate motion, designed on a system of type, space and restraint, never assembled from a template.',
    includes: [
      'A design system, not a theme',
      'Editorial type and layout',
      'Motion designed with the page, not after it',
    ],
    image: '/services/design.webp',
    w: 1122,
    h: 1402,
    glyph: GLYPHS.design,
  },
  {
    slug: 'web-development',
    name: 'Web Development',
    para: 'Engineering where performance is a feature: clean semantics, instant loads, and a site that humans and crawlers both read effortlessly.',
    includes: [
      'Server-rendered, crawlable to the last line',
      'Core Web Vitals treated as a feature',
      'Built to be maintained, not just shipped',
    ],
    image: '/services/development.webp',
    w: 1024,
    h: 1536,
    glyph: GLYPHS.development,
  },
  {
    slug: 'one-page-websites',
    name: 'One-page Websites',
    para: 'One page, one argument. For launches and focused offers that need a complete, sharp statement without the weight of a full site.',
    includes: [
      'One argument, sharply made',
      'Launch-ready in weeks, not months',
      'Everything earns its scroll',
    ],
    image: '/services/one-page.webp',
    w: 1024,
    h: 1536,
    glyph: GLYPHS.one_page,
  },
  {
    slug: 'website-redesign',
    name: 'Website Redesign',
    para: 'For sites the business outgrew. We keep what earned its place, rebuild what didn’t, and migrate without losing what search already knows about you.',
    includes: [
      'An audit of what earned its place',
      'A migration that keeps your rankings',
      'A system your team can extend',
    ],
    image: '/services/redesign.webp',
    w: 1122,
    h: 1402,
    glyph: GLYPHS.redesign,
  },
  {
    slug: 'seo',
    name: 'SEO',
    para: 'Structure, copy and technical groundwork, so the people searching for what you do actually find you. The AI engines asking on their behalf do too.',
    includes: [
      'Technical groundwork and structure',
      'Copy that answers real questions',
      'Visible to AI engines, not just Google',
    ],
    image: '/services/seo.webp',
    w: 1122,
    h: 1402,
    glyph: GLYPHS.seo,
  },
]

/** row label split into letter spans; --i is the GLOBAL letter index so the
 *  ink (and, open, white) sweep runs across the whole name, word gaps included */
function Letters({ text }: { text: string }) {
  let i = 0
  return (
    <span aria-hidden="true">
      {text.split(' ').map((word, wi) => (
        <Fragment key={wi}>
          <span style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
            {Array.from(word).map((ch, ci) => (
              <span key={ci} style={{ '--i': i++ } as React.CSSProperties}>
                {ch}
              </span>
            ))}
          </span>
          {wi < text.split(' ').length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </span>
  )
}

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
