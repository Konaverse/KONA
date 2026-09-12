'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { gsap, EASE, DUR, rem } from '@/lib/motion-v4'
import { getLenis } from '@/components/v4/SmoothScroll'
import CaseMesh from '@/components/v4/CaseMesh'

/**
 * /work/[slug] — THE MOTION (2026-09-12, the user's wireframe "Case
 * Study.png": "clean layout, smooth motion, not crazy, elegant; it needs
 * to read as a nice article").
 *
 * The register here is READING. Nothing pins, nothing locks the scroll,
 * nothing plays on its own except the recording. Every move is either an
 * entrance that lands and is done, or a scrub that follows the hand:
 *
 *   THE ENTRANCE. The name rises through its crop; the paragraphs, the
 *   still, the button and the facts resolve a beat behind it.
 *
 *   THE GROUND is the mesh (CaseMesh.tsx), mounted here, fixed behind
 *   everything — the one thing on the page that moves on its own.
 *
 *   THE DEVICE. The laptop and the closed one behind it lag the scroll at
 *   two rates — a parallax of two planes, small.
 *
 *   THE RECORDING. Enters a touch smaller and rounder and resolves to
 *   its rest size as it crosses the viewport; plays only while it is on
 *   screen; the hairline under it is the playhead.
 *
 *   THE INDEX. The pinned list follows the reading position — the row
 *   whose section has crossed the reading line is the active one, the
 *   marker on the rail slides to it, a click eases the page there.
 *
 *   THE STILLS slide inside their frames as they cross the viewport;
 *   THE CARDS carry a spotlight that rides the pointer; THE STILL in the
 *   hero tilts toward the hand.
 *
 * One ticker, rect math, transform and custom properties only. Reduced
 * motion keeps the recording's play/pause and the index; the rest
 * lands at rest.
 */

/** the still's reach under the hand, in degrees at its edge */
const TILT_X = 5
const TILT_Y = 7
const TILT_GLIDE = 0.12
/** where on the viewport a section becomes the one being read */
const READ_LINE = 0.42
/** the recording's rest scale and how much smaller it enters */
const REEL_SCALE_IN = 0.9
/** the device's two lag rates, as a fraction of the scroll */
const DEVICE_FRONT = 0.08
const DEVICE_BACK = 0.16

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

export default function CaseMotion({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const cleanups: Array<() => void> = []

    /* ---- the elements ---- */
    const lines = Array.from(root.querySelectorAll<HTMLElement>('.cs-h1 .cs-ln'))
    const ents = Array.from(root.querySelectorAll<HTMLElement>('.cs-ent'))
    const deviceFront = root.querySelector<HTMLElement>('.cs-device-front')
    const deviceBack = root.querySelector<HTMLElement>('.cs-device-back')
    const device = root.querySelector<HTMLElement>('.cs-device')
    const reel = root.querySelector<HTMLElement>('.cs-reel')
    const reelWin = root.querySelector<HTMLElement>('.cs-reel-win')
    const video = root.querySelector<HTMLVideoElement>('.cs-reel-win video')
    const reelBar = root.querySelector<HTMLElement>('.cs-reel-bar')
    const index = root.querySelector<HTMLElement>('.cs-index')
    const rows = Array.from(root.querySelectorAll<HTMLElement>('.cs-index li'))
    const secs = rows
      .map((li) => root.querySelector<HTMLElement>(`#${li.dataset.id}`))
      .filter((s): s is HTMLElement => !!s)
    const figs = Array.from(root.querySelectorAll<HTMLElement>('.cs-fig-win'))
    const still = root.querySelector<HTMLElement>('.cs-still')
    const stillWrap = root.querySelector<HTMLElement>('.cs-still-wrap')
    const cards = Array.from(root.querySelectorAll<HTMLElement>('.cs-card'))

    /* ---- THE ENTRANCE ---- */
    if (reduced) {
      root.classList.add('is-in')
    } else {
      const R = rem()
      gsap.set(lines, { yPercent: 110 })
      gsap.set(ents, { opacity: 0, y: 18 * R })
      root.classList.add('is-in')
      const tl = gsap.timeline({ delay: 0.15 })
      tl.to(lines, { yPercent: 0, duration: DUR.slow, ease: EASE.glass, stagger: 0.09, clearProps: 'transform' }, 0)
      tl.to(ents, { opacity: 1, y: 0, duration: DUR.slow, ease: EASE.glass, stagger: 0.08, clearProps: 'all' }, 0.35)
      cleanups.push(() => tl.kill())
    }

    /* ---- THE RECORDING: play only on screen; the playhead ---- */
    if (video) {
      video.muted = true
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) video.play().catch(() => {})
            else video.pause()
          })
        },
        { threshold: 0.25 },
      )
      io.observe(video)
      cleanups.push(() => io.disconnect())
      if (reelBar) {
        const onTime = () => {
          if (!video.duration) return
          reelBar.style.setProperty('--cs-reel-p', String(video.currentTime / video.duration))
        }
        video.addEventListener('timeupdate', onTime)
        cleanups.push(() => video.removeEventListener('timeupdate', onTime))
      }
    }

    /* ---- THE INDEX: click eases there ---- */
    rows.forEach((li) => {
      const a = li.querySelector<HTMLAnchorElement>('a')
      const target = root.querySelector<HTMLElement>(`#${li.dataset.id}`)
      if (!a || !target) return
      const onClick = (e: MouseEvent) => {
        const lenis = getLenis()
        if (!lenis) return
        e.preventDefault()
        lenis.scrollTo(target, { offset: -8 * rem() * 16, duration: 1.2 })
        history.replaceState(null, '', `#${li.dataset.id}`)
      }
      a.addEventListener('click', onClick)
      cleanups.push(() => a.removeEventListener('click', onClick))
    })

    /* ---- THE STILL under the hand ---- */
    const tilt = { x: 0, y: 0, tx: 0, ty: 0 }
    if (still && stillWrap && !reduced && window.matchMedia('(hover: hover)').matches) {
      const onMove = (e: PointerEvent) => {
        const r = still.getBoundingClientRect()
        const px = clamp((e.clientX - r.left) / r.width, 0, 1) * 2 - 1
        const py = clamp((e.clientY - r.top) / r.height, 0, 1) * 2 - 1
        tilt.tx = -py * TILT_X
        tilt.ty = px * TILT_Y
      }
      const onLeave = () => {
        tilt.tx = 0
        tilt.ty = 0
      }
      stillWrap.addEventListener('pointermove', onMove)
      stillWrap.addEventListener('pointerleave', onLeave)
      cleanups.push(() => {
        stillWrap.removeEventListener('pointermove', onMove)
        stillWrap.removeEventListener('pointerleave', onLeave)
      })
    }

    /* ---- THE CARDS' spotlight ---- */
    cards.forEach((card) => {
      const onMove = (e: PointerEvent) => {
        const r = card.getBoundingClientRect()
        card.style.setProperty('--cs-mx', `${((e.clientX - r.left) / r.width) * 100}%`)
        card.style.setProperty('--cs-my', `${((e.clientY - r.top) / r.height) * 100}%`)
      }
      card.addEventListener('pointermove', onMove)
      cleanups.push(() => card.removeEventListener('pointermove', onMove))
    })

    /* ---- THE TICKER ---- */
    let active = -1
    const tick = () => {
      const vh = window.innerHeight

      /* the index */
      let cur = 0
      for (let i = 0; i < secs.length; i++) {
        if (secs[i].getBoundingClientRect().top <= vh * READ_LINE) cur = i
      }
      if (cur !== active) {
        active = cur
        rows.forEach((li, i) => li.classList.toggle('is-active', i === cur))
        index?.style.setProperty('--cs-active', String(cur))
      }

      if (reduced) return

      /* the device */
      if (device && deviceFront) {
        const r = device.getBoundingClientRect()
        const c = r.top + r.height / 2 - vh / 2
        deviceFront.style.transform = `translate3d(0, ${(c * DEVICE_FRONT).toFixed(1)}px, 0)`
        if (deviceBack) deviceBack.style.transform = `translate3d(0, ${(c * DEVICE_BACK).toFixed(1)}px, 0)`
      }

      /* the recording */
      if (reel && reelWin) {
        const r = reel.getBoundingClientRect()
        /* 0 at the bottom edge, 1 once its top has reached a third down */
        const p = clamp((vh - r.top) / (vh * 0.67), 0, 1)
        const e = 1 - Math.pow(1 - p, 3)
        reelWin.style.setProperty('--cs-reel-s', lerp(REEL_SCALE_IN, 1, e).toFixed(4))
        reelWin.style.setProperty('--cs-reel-r', `${lerp(1.5, 0.625, e).toFixed(3)}rem`)
      }

      /* the stills */
      figs.forEach((f) => {
        const r = f.getBoundingClientRect()
        if (r.bottom < 0 || r.top > vh) return
        const p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2)
        f.style.setProperty('--cs-py', `${(clamp(p, -1, 1) * 5).toFixed(2)}%`)
      })

      /* the still's tilt */
      if (still) {
        tilt.x = lerp(tilt.x, tilt.tx, TILT_GLIDE)
        tilt.y = lerp(tilt.y, tilt.ty, TILT_GLIDE)
        still.style.setProperty('--cs-rx', `${tilt.x.toFixed(2)}deg`)
        still.style.setProperty('--cs-ry', `${tilt.y.toFixed(2)}deg`)
      }
    }
    gsap.ticker.add(tick)
    cleanups.push(() => gsap.ticker.remove(tick))

    return () => cleanups.forEach((c) => c())
  }, [])

  return (
    <main ref={ref} className="cs k-dark">
      <CaseMesh />
      {children}
    </main>
  )
}
