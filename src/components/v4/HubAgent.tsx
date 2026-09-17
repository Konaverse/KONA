'use client'

import { useEffect, useRef, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { gsap, EASE, DUR, rem } from '@/lib/motion-v4'

/**
 * THE HUB'S HERO — THE BRIEF (2026-09-17, user: "forget about the
 * current and previous hero… collect references on the animations and
 * design, and create something familiar, smart, smooth, agentic,
 * premium, light theme and motion rich… We need to impress"; THE
 * GATHERING before it was stopped — "you reveal all the services from
 * the hero", and no picture-per-service is to be had). Nothing here is
 * a photograph and no service is named: the hero is the STUDIO AT WORK,
 * drawn in code.
 *
 * THE REFERENCES (21st.dev, read as film, none installed): "Agent
 * Plan" (a task list that ticks itself), "Animated AI Input" (the
 * prompt everyone knows), "Variable Font Proximity" (letters that gain
 * weight under the hand), "Kinetic Grid" (a dot field that bends to
 * the pointer), "Tool Approval"/"Bento Card" (quiet product cards), and
 * the multiplayer cursor of every design tool.
 *
 * THE PICTURE. Paper, and on it a field of dots that leans away from
 * the pointer. The page's own furniture arrives UNBUILT — a skeleton
 * bar where the h1 will be, two where the statement will be — and a
 * prompt bar at the foot. Then an agent's cursor ("Kona") does the
 * job in front of you, one pass, about six seconds:
 *   1. it types a brief into the prompt and sends it; a plan of four
 *      steps appears and ticks itself as each is done;
 *   2. TYPE — the skeleton gives way to the word, its letters rising
 *      while their weight runs down the variable axis from heavy to
 *      the display light; a selection box with its size tag holds it,
 *      and the TYPE card (Aa, a weight slider) slides to match;
 *   3. LAYOUT — guides draw across the page, the statement resolves
 *      and the cursor drags it onto the guide, which flashes;
 *   4. MOTION — the MOTION card draws the house curve (it is EASE.drift's
 *      own bezier) with a dot riding it, and the word runs a preview;
 *   5. SPEED — the PERFORMANCE card's ring closes as its number counts
 *      to 100.
 * Then it rests, and stays alive: the cards float and lean from the
 * pointer, the dots bend, the word's letters gain weight under the
 * hand, and the agent keeps typing the things people come with into
 * the prompt, one after another.
 *
 * THE PROMPT IS REAL. A form: type what you need, and a small router
 * (NEEDS) sends you to the page that answers it, or to /contact with
 * the brief; without JS it posts to /contact as a plain GET.
 *
 * THE DRIVER. One GSAP timeline for the pass (positions measured once
 * the fonts are in), gsap.ticker for the field, the lean and the
 * proximity weight. Everything animated is transform, opacity, a dash
 * offset, or the `wght` axis of eight letters. A resize lands the pass
 * on its last frame. The hidden states are parked in CSS (`.ha-ent`)
 * and lifted by page.tsx's noscript; reduced motion (`is-still`) gets
 * the finished hero, no cursor. Every word is server-rendered.
 */

/** what the agent types first, and then what people come with */
const BRIEF = 'A website people remember.'
const ASKS = ['Our site is slow and dated.', 'Nobody finds us on Google.', 'Something immersive, in 3D.', 'One page that sells one thing.']
/** the plan's steps */
const PLAN = ['Set the type', 'Draw the layout', 'Add the motion', 'Make it fast']
/** THE ROUTER: what the words of a brief point at, first match wins */
const NEEDS: [RegExp, string][] = [
  [/seo|google|rank|search|found|traffic|visib/i, '/services/seo'],
  [/3d|immersive|webgl|three\.?js|experience/i, '/services/3d-websites'],
  [/redesign|rebuild|refresh|dated|old site|slow/i, '/services/website-redesign'],
  [/one[\s-]?page|landing|single page/i, '/services/one-page-websites'],
  [/develop|code|shop|store|commerce|app|cms|integrat|fast|build/i, '/services/web-development'],
  [/design|brand|look|beautiful|remember|ui|ux/i, '/services/web-design'],
]

/** the word's weight: the display light, the heavy it starts from, and
 *  the most the hand can add */
const W_REST = 200
const W_FROM = 720
const W_NEAR = 640
/** the hand's reach on the letters and on the dots, in rem */
const REACH = 13
const DOT_REACH = 10
/** the dots: their pitch and how far one is pushed, in rem */
const PITCH = 2.1
const PUSH = 0.85

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)

export default function HubAgent({ kicker, statement }: { kicker: string; statement: readonly string[] }) {
  const ref = useRef<HTMLElement | null>(null)
  const router = useRouter()
  /* the driver's handle on the asks' loop, for the form */
  const hush = useRef<() => void>(() => {})

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    const brief = String(new FormData(e.currentTarget).get('brief') ?? '').trim()
    if (!brief) {
      e.preventDefault()
      return
    }
    e.preventDefault()
    const hit = NEEDS.find(([re]) => re.test(brief))
    e.currentTarget.classList.add('is-routing')
    const to = hit ? hit[1] : `/contact?brief=${encodeURIComponent(brief)}`
    window.setTimeout(() => router.push(to), 520)
  }

  useEffect(() => {
    const hero = ref.current
    if (!hero) return
    const q = <T extends Element = HTMLElement>(s: string) => hero.querySelector<T>(s)
    const qa = <T extends Element = HTMLElement>(s: string) => Array.from(hero.querySelectorAll<T>(s))
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const phone = window.matchMedia('(max-width: 57.5rem)').matches
    if (reduce) {
      hero.classList.add('is-still')
      return () => hero.classList.remove('is-still')
    }

    const k = rem()
    const unit = 16 * k
    const cursor = q('.ha-cursor')!
    const prompt = q('.ha-prompt')!
    const input = q<HTMLInputElement>('.ha-input')!
    const typed = q('.ha-typed-t')!
    const send = q('.ha-send')!
    const chips = qa('.ha-chip')
    const h1 = q('.ha-h1-in')!
    const letters = qa('.ha-l')
    const skelH = q('.ha-skel-h1')!
    const skelS = qa('.ha-skel-s')
    const sel = q('.ha-sel')!
    const tag = q('.ha-sel-tag')!
    const state = q('.ha-state-in')!
    const lines = qa('.ha-state-ln')
    const guides = qa('.ha-guide')
    const cardType = q('.ha-card-type')!
    const cardMotion = q('.ha-card-motion')!
    const cardSpeed = q('.ha-card-speed')!
    const knob = q('.ha-knob')!
    const aa = q('.ha-aa')!
    const wLabel = q('.ha-wlabel')!
    const curve = q<SVGPathElement>('.ha-curve')!
    const ring = q<SVGCircleElement>('.ha-ring-v')!
    const score = q('.ha-score')!
    const kickerEl = q('.ha-kicker')!
    const canvas = q<HTMLCanvasElement>('.ha-grid')!

    let cancelled = false
    let tl: gsap.core.Timeline | null = null
    let loop: gsap.core.Timeline | null = null
    let built = false

    /* ---------- THE FIELD, THE LEAN, THE PROXIMITY (one ticker) ---------- */
    const ctx = canvas.getContext('2d')
    let W = 0
    let H = 0
    let dpr = 1
    /* the pointer (px in the hero; off = far away) and the agent's tip */
    let px = -9999
    let py = -9999
    let mx = 0
    let my = 0
    let tmx = 0
    let tmy = 0
    const agent = { x: -9999, y: -9999 }
    let rects: { cx: number; cy: number }[] = []
    const weights = letters.map(() => W_REST)
    let frame = 0
    const size = () => {
      const r = hero.getBoundingClientRect()
      W = r.width
      H = r.height
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
    }
    const readLetters = () => {
      const hr = hero.getBoundingClientRect()
      rects = letters.map((l) => {
        const r = l.getBoundingClientRect()
        return { cx: r.left - hr.left + r.width / 2, cy: r.top - hr.top + r.height / 2 }
      })
    }
    const onMove = (ev: PointerEvent) => {
      const r = hero.getBoundingClientRect()
      px = ev.clientX - r.left
      py = ev.clientY - r.top
      tmx = (ev.clientX / window.innerWidth) * 2 - 1
      tmy = (ev.clientY / window.innerHeight) * 2 - 1
    }
    const onLeave = () => {
      px = -9999
      py = -9999
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)

    const ink = getComputedStyle(hero).getPropertyValue('--n-6').trim() || '#8a9094'
    const tick = (_t?: number, deltaTime?: number) => {
      /* under the list's cover nothing here is seen */
      if (parseFloat(hero.style.getPropertyValue('--sh-cover') || '0') >= 0.98) return
      const dt = (deltaTime ?? 16.7) / 1000
      const f = 1 - Math.exp(-dt / 0.22)
      mx += (tmx - mx) * f
      my += (tmy - my) * f
      hero.style.setProperty('--ha-mx', mx.toFixed(4))
      hero.style.setProperty('--ha-my', my.toFixed(4))

      /* the dots: pushed away from the hand and from the agent's tip */
      if (ctx) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        ctx.clearRect(0, 0, W, H)
        ctx.fillStyle = ink
        const pitch = PITCH * unit
        const reach = DOT_REACH * unit
        const push = PUSH * unit
        const ax = agent.x
        const ay = agent.y
        for (let y = pitch / 2; y < H; y += pitch) {
          for (let x = pitch / 2; x < W; x += pitch) {
            let ox = 0
            let oy = 0
            let lift = 0
            for (let s = 0; s < 2; s++) {
              const sx = s ? ax : px
              const sy = s ? ay : py
              const dx = x - sx
              const dy = y - sy
              const d = Math.hypot(dx, dy)
              if (d < reach && d > 0.001) {
                const a = (1 - d / reach) ** 2
                ox += (dx / d) * a * push
                oy += (dy / d) * a * push
                lift = Math.max(lift, a)
              }
            }
            const r = 1 + lift * 1.4
            ctx.globalAlpha = 0.55 + lift * 0.45
            ctx.beginPath()
            ctx.arc(x + ox, y + oy, r, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      }

      /* the word under the hand: weight by distance, once it is built */
      if (built && !phone) {
        if (frame++ % 24 === 0) readLetters()
        const reach = REACH * unit
        letters.forEach((l, i) => {
          const c = rects[i]
          if (!c) return
          const d = Math.hypot(c.cx - px, c.cy - py)
          const want = W_REST + (W_NEAR - W_REST) * clamp01(1 - d / reach) ** 2
          const w = weights[i] + (want - weights[i]) * (1 - Math.exp(-dt / 0.14))
          if (Math.abs(w - weights[i]) < 0.4) return
          weights[i] = w
          l.style.setProperty('--w', w.toFixed(0))
        })
      }
    }

    /* ---------- THE ASKS: the agent keeps the prompt alive ---------- */
    const type = (t: gsap.core.Timeline, text: string, at: number | string, per = 0.042) => {
      const o = { n: 0 }
      t.to(
        o,
        {
          n: text.length,
          duration: text.length * per,
          ease: 'none',
          onUpdate: () => {
            typed.textContent = text.slice(0, Math.round(o.n))
          },
        },
        at,
      )
    }
    const startAsks = () => {
      if (cancelled) return
      loop = gsap.timeline({ repeat: -1, delay: 1.2 })
      ASKS.concat(BRIEF).forEach((ask) => {
        loop!.call(() => prompt.classList.remove('is-sent'))
        type(loop!, ask, '>')
        loop!.to({}, { duration: 2.1 })
        loop!.call(() => prompt.classList.add('is-sent'))
        loop!.to({}, { duration: 0.55 })
        loop!.call(() => {
          typed.textContent = ''
        })
      })
    }
    /* the visitor takes the prompt: the agent lets go of it */
    hush.current = () => {
      loop?.kill()
      loop = null
      typed.textContent = ''
      prompt.classList.remove('is-sent')
      prompt.classList.add('is-yours')
    }
    const onFocus = () => hush.current()
    input.addEventListener('focus', onFocus)

    /* ---------- THE PASS ---------- */
    const start = () => {
      if (cancelled) return
      size()
      hero.classList.add('is-in')
      gsap.ticker.add(tick)

      if (phone) {
        /* phones: no agent, one soft reveal of the finished hero */
        built = true
        gsap.set([skelH, ...skelS, sel, cursor], { display: 'none' })
        gsap.set(chips, { opacity: 1 })
        chips.forEach((c) => c.classList.add('is-done'))
        tl = gsap.timeline()
        tl.fromTo(
          [kickerEl, h1, state, prompt, q('.ha-plan'), cardType, cardMotion, cardSpeed].filter(Boolean),
          { opacity: 0, y: 18 * k, filter: `blur(${12 * k}px)` },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: DUR.slow, ease: EASE.glass, stagger: 0.08, clearProps: 'filter' },
        )
        gsap.set(lines, { yPercent: 0, opacity: 1 })
        gsap.set(letters, { yPercent: 0 })
        gsap.set(ring, { strokeDashoffset: 0 })
        score.textContent = '100'
        startAsks()
        return
      }

      /* where things are, in the hero (px) — read before anything moves */
      const hr = hero.getBoundingClientRect()
      const at = (el: Element, fx = 0.5, fy = 0.5) => {
        const r = el.getBoundingClientRect()
        return { x: r.left - hr.left + r.width * fx, y: r.top - hr.top + r.height * fy }
      }
      const P = {
        input: at(input, 0.12, 0.55),
        send: at(send),
        h1: at(h1, 0.62, 0.55),
        state: at(state, 0.3, 0.5),
        motion: at(cardMotion, 0.62, 0.42),
        speed: at(cardSpeed, 0.5, 0.5),
        rest: at(prompt, 1.06, 0.2),
      }
      const hb = h1.getBoundingClientRect()
      tag.textContent = `${Math.round(hb.width)} × ${Math.round(hb.height)}`
      /* the guides stand ON the layout: the statement's top edge and the
         TYPE card's left one (read before the card is turned) */
      guides[2].style.top = `${(at(state, 0, 0).y - 0.6 * unit).toFixed(1)}px`
      guides[1].style.left = `${(cardType.offsetLeft + (cardType.offsetParent as HTMLElement).offsetLeft).toFixed(1)}px`
      const len = curve.getTotalLength()
      const DRAG = { x: 3.2 * unit, y: 1.3 * unit }

      /* the first frame */
      gsap.set(cursor, { x: W * 0.74, y: H + 40, opacity: 0 })
      gsap.set(letters, { yPercent: 112, '--w': W_FROM })
      gsap.set(lines, { yPercent: 112 })
      gsap.set(state, { opacity: 1, x: DRAG.x, y: DRAG.y })
      gsap.set(h1, { opacity: 1 })
      gsap.set(sel, { opacity: 0, scale: 1.035 })
      gsap.set(guides, { scaleX: (i: number) => (i === 2 ? 0 : 1), scaleY: (i: number) => (i === 2 ? 1 : 0), opacity: 1 })
      gsap.set([cardType, cardMotion, cardSpeed], { opacity: 0, scale: 0.9, y: 22 * k, filter: `blur(${10 * k}px)` })
      gsap.set(curve, { strokeDasharray: len, strokeDashoffset: len })
      gsap.set(knob, { left: '86%' })
      gsap.set(chips, { opacity: 0, y: 10 * k })

      const go = (t: gsap.core.Timeline, to: { x: number; y: number }, atT: number, dur = 0.7) =>
        t.to(
          cursor,
          {
            x: to.x,
            y: to.y,
            duration: dur,
            ease: 'power3.inOut',
            onUpdate: () => {
              agent.x = Number(gsap.getProperty(cursor, 'x'))
              agent.y = Number(gsap.getProperty(cursor, 'y'))
            },
          },
          atT,
        )
      const press = (t: gsap.core.Timeline, atT: number) => {
        t.to(cursor, { scale: 0.86, duration: 0.09, ease: 'power2.out' }, atT)
        t.to(cursor, { scale: 1, duration: 0.3, ease: EASE.settle }, atT + 0.09)
      }
      const step = (t: gsap.core.Timeline, i: number, from: number, to: number) => {
        t.call(() => chips[i]?.classList.add('is-run'), undefined, from)
        t.call(() => {
          chips[i]?.classList.remove('is-run')
          chips[i]?.classList.add('is-done')
        }, undefined, to)
      }
      const pop = (t: gsap.core.Timeline, el: Element, atT: number) =>
        t.to(el, { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)', duration: 0.9, ease: EASE.glass }, atT)

      tl = gsap.timeline({
        onComplete: () => {
          built = true
          readLetters()
          startAsks()
        },
      })
      /* 0 — the ground, the kicker, the prompt; the agent arrives */
      tl.fromTo(kickerEl, { opacity: 0, y: 14 * k }, { opacity: 1, y: 0, duration: DUR.slow, ease: EASE.glass }, 0)
      tl.fromTo(
        prompt,
        { opacity: 0, y: 26 * k, filter: `blur(${12 * k}px)` },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: DUR.slow, ease: EASE.glass, clearProps: 'filter' },
        0.05,
      )
      tl.to(cursor, { opacity: 1, duration: 0.3 }, 0.25)
      go(tl, P.input, 0.25, 0.85)
      press(tl, 1.08)
      tl.call(() => prompt.classList.add('is-typing'), undefined, 1.1)
      /* 1 — the brief, sent */
      type(tl, BRIEF, 1.2, 0.034)
      go(tl, P.send, 2.1, 0.45)
      press(tl, 2.55)
      tl.to(send, { scale: 0.88, duration: 0.09, ease: 'power2.out' }, 2.55)
      tl.to(send, { scale: 1, duration: 0.4, ease: EASE.settle }, 2.64)
      tl.call(() => prompt.classList.add('is-sent'), undefined, 2.62)
      tl.call(() => {
        typed.textContent = ''
      }, undefined, 3.2)
      tl.to(chips, { opacity: 1, y: 0, duration: 0.5, ease: EASE.glass, stagger: 0.06 }, 2.7)

      /* 2 — TYPE */
      step(tl, 0, 2.85, 4.05)
      go(tl, P.h1, 2.75, 0.7)
      tl.to(skelH, { opacity: 0, duration: 0.35, ease: 'sine.out' }, 3.15)
      tl.to(letters, { yPercent: 0, duration: 1.05, ease: EASE.glass, stagger: 0.045 }, 3.15)
      tl.to(letters, { '--w': W_REST, duration: 1.25, ease: EASE.drift, stagger: 0.045 }, 3.2)
      tl.to(sel, { opacity: 1, scale: 1, duration: 0.45, ease: EASE.settle }, 3.45)
      pop(tl, cardType, 3.2)
      tl.to(knob, { left: '12%', duration: 1.25, ease: EASE.drift }, 3.35)
      const wv = { v: W_FROM }
      tl.to(
        wv,
        {
          v: W_REST,
          duration: 1.25,
          ease: EASE.drift,
          onUpdate: () => {
            aa.style.setProperty('--w', wv.v.toFixed(0))
            wLabel.textContent = wv.v.toFixed(0)
          },
        },
        3.35,
      )

      /* 3 — LAYOUT */
      step(tl, 1, 4.05, 5.15)
      tl.to(sel, { opacity: 0, duration: 0.3 }, 4.1)
      tl.to(guides, { scaleX: 1, scaleY: 1, duration: 0.8, ease: EASE.drift, stagger: 0.08 }, 4.05)
      go(tl, { x: P.state.x + DRAG.x, y: P.state.y + DRAG.y }, 4.05, 0.6)
      tl.to(skelS, { opacity: 0, duration: 0.3, stagger: 0.06 }, 4.3)
      tl.to(lines, { yPercent: 0, duration: 0.9, ease: EASE.glass, stagger: 0.09 }, 4.3)
      press(tl, 4.66)
      tl.to(state, { x: 0, y: 0, duration: 0.55, ease: 'power3.inOut' }, 4.72)
      go(tl, P.state, 4.72, 0.55)
      tl.call(() => hero.classList.add('is-snapped'), undefined, 5.22)

      /* 4 — MOTION */
      step(tl, 2, 5.15, 6.2)
      pop(tl, cardMotion, 5.1)
      go(tl, P.motion, 5.15, 0.6)
      tl.to(curve, { strokeDashoffset: 0, duration: 0.9, ease: EASE.drift }, 5.35)
      tl.call(() => cardMotion.classList.add('is-on'), undefined, 5.9)
      tl.to(letters, { yPercent: -9, duration: 0.24, ease: 'sine.out', stagger: 0.035 }, 5.6)
      tl.to(letters, { yPercent: 0, duration: 0.5, ease: EASE.settle, stagger: 0.035 }, 5.84)

      /* 5 — SPEED */
      step(tl, 3, 6.2, 7.2)
      pop(tl, cardSpeed, 6.1)
      go(tl, P.speed, 6.15, 0.6)
      tl.to(ring, { strokeDashoffset: 0, duration: 1.0, ease: EASE.drift }, 6.35)
      const sc = { v: 0 }
      tl.to(sc, { v: 100, duration: 1.0, ease: EASE.drift, onUpdate: () => {
        score.textContent = sc.v.toFixed(0)
      } }, 6.35)

      /* 6 — it rests by the prompt; the guides stay as furniture */
      tl.to(guides, { opacity: 0.45, duration: 0.8 }, 7.2)
      tl.to(q('.ha-plan'), { opacity: 0.6, duration: 0.8 }, 7.4)
      go(tl, P.rest, 7.25, 0.9)
      tl.call(() => cursor.classList.add('is-idle'), undefined, 8.15)
      /* the pass, a touch brisker than it was written */
      tl.timeScale(1.12)
    }

    if (typeof document.fonts?.ready?.then === 'function') document.fonts.ready.then(start)
    else start()

    /* a resize lands the pass on its last frame and re-measures */
    let seenW = window.innerWidth
    const onResize = () => {
      size()
      if (window.innerWidth === seenW) return
      seenW = window.innerWidth
      tl?.progress(1)
      gsap.set(cursor, { opacity: 0 })
      agent.x = -9999
      agent.y = -9999
      readLetters()
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelled = true
      tl?.kill()
      loop?.kill()
      gsap.ticker.remove(tick)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('resize', onResize)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      input.removeEventListener('focus', onFocus)
      hero.classList.remove('is-in', 'is-snapped')
      prompt.classList.remove('is-typing', 'is-sent', 'is-yours')
      cardMotion.classList.remove('is-on')
      cursor.classList.remove('is-idle')
      chips.forEach((c) => c.classList.remove('is-run', 'is-done'))
      typed.textContent = ''
      gsap.set(
        [cursor, kickerEl, prompt, h1, state, sel, skelH, ...skelS, ...letters, ...lines, ...guides, cardType, cardMotion, cardSpeed, knob, curve, ring, ...chips, send, q('.ha-plan')].filter(Boolean),
        { clearProps: 'all' },
      )
    }
  }, [])

  return (
    <header ref={ref} className="sh-hero ha" data-nav-hero="0.5">
      {/* the field and the guides: decoration */}
      <canvas className="ha-grid" aria-hidden="true" />
      <div className="ha-guides" aria-hidden="true">
        <i className="ha-guide ha-guide-v1" />
        <i className="ha-guide ha-guide-v2" />
        <i className="ha-guide ha-guide-h" />
      </div>

      <p className="sh-kicker ha-kicker ha-ent">{kicker}</p>

      <h1 className="ha-h1">
        {/* the word for readers, whole; the letters for the eye */}
        <span className="sr-only">Services</span>
        <span className="ha-h1-in ha-ent" aria-hidden="true">
          {Array.from('Services').map((ch, i) => (
            <span key={i} className="ha-lm">
              <span className="ha-l">{ch}</span>
            </span>
          ))}
          <span className="ha-sel">
            <i /><i /><i /><i />
            <b className="ha-sel-tag" />
          </span>
        </span>
        <span className="ha-skel ha-skel-h1" aria-hidden="true" />
      </h1>

      <p className="ha-state">
        <span className="ha-state-in ha-ent">
          {statement.map((ln, i) => (
            <span key={i} className="ha-state-m">
              <span className="ha-state-ln">{ln}{i < statement.length - 1 ? ' ' : ''}</span>
            </span>
          ))}
        </span>
        {statement.map((_, i) => (
          <span key={i} className="ha-skel ha-skel-s" aria-hidden="true" style={{ '--i': i } as React.CSSProperties} />
        ))}
      </p>

      {/* the plan: the agent's four steps (decoration — it ticks itself) */}
      <ul className="ha-plan" aria-hidden="true">
        {PLAN.map((p) => (
          <li key={p} className="ha-chip">
            <i className="ha-tick" />
            {p}
          </li>
        ))}
      </ul>

      {/* THE PROMPT: a real form — the router answers it; without JS it
          is a GET to /contact */}
      <form className="ha-prompt ha-ent" action="/contact" method="get" onSubmit={onSubmit} role="search" aria-label="Tell us what you need">
        <svg className="ha-spark" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2.5l1.9 6.1a2 2 0 0 0 1.4 1.4l6.2 2-6.2 2a2 2 0 0 0-1.4 1.4L12 21.5l-1.9-6.1a2 2 0 0 0-1.4-1.4l-6.2-2 6.2-2a2 2 0 0 0 1.4-1.4z" fill="currentColor" />
        </svg>
        <span className="ha-field">
          <input className="ha-input" name="brief" type="text" autoComplete="off" placeholder="Tell us what you need" aria-label="Tell us what you need" maxLength={160} />
          <span className="ha-typed" aria-hidden="true">
            <span className="ha-typed-t" />
            <i className="ha-caret" />
          </span>
        </span>
        <button className="ha-send" type="submit" aria-label="Send">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h13M12.5 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </form>

      {/* the three cards: decoration, drawn in code */}
      <div className="ha-cards" aria-hidden="true">
        <div className="ha-card ha-card-type ha-ent">
          <div className="ha-float">
            <span className="ha-card-k">Type</span>
            <span className="ha-aa">Aa</span>
            <span className="ha-track"><i className="ha-knob" /></span>
            <span className="ha-card-v">Manrope <b className="ha-wlabel">200</b></span>
          </div>
        </div>
        <div className="ha-card ha-card-motion ha-ent">
          <div className="ha-float">
            <span className="ha-card-k">Motion</span>
            <svg className="ha-plot" viewBox="0 0 200 120" aria-hidden="true">
              <path className="ha-plot-g" d="M10 110H190M10 10H190M10 10V110M190 10V110M70 10V110M130 10V110M10 60H190" />
              <path className="ha-plot-h" d="M10 110L127 110M190 10L73 10" />
              <circle className="ha-plot-k" cx="127" cy="110" r="3.5" />
              <circle className="ha-plot-k" cx="73" cy="10" r="3.5" />
              {/* the house scrub curve: cubic-bezier(0.65, 0, 0.35, 1) */}
              <path id="ha-curve" className="ha-curve" d="M10 110C127 110 73 10 190 10" />
              <circle className="ha-rider" r="5">
                <animateMotion dur="2.4s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.5;1" keyPoints="0;1;0" keySplines="0.65 0 0.35 1;0.65 0 0.35 1">
                  <mpath href="#ha-curve" />
                </animateMotion>
              </circle>
            </svg>
            <span className="ha-card-v">cubic-bezier(0.65, 0, 0.35, 1)</span>
          </div>
        </div>
        <div className="ha-card ha-card-speed ha-ent">
          <div className="ha-float">
            <span className="ha-card-k">Performance</span>
            <span className="ha-dial">
              <svg viewBox="0 0 100 100" aria-hidden="true">
                <circle className="ha-ring-g" cx="50" cy="50" r="42" />
                <circle className="ha-ring-v" cx="50" cy="50" r="42" pathLength={100} />
              </svg>
              <b className="ha-score">0</b>
            </span>
            <span className="ha-card-v">Largest paint 0.8 s</span>
          </div>
        </div>
      </div>

      {/* the agent */}
      <span className="ha-cursor" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="M4 2.5l15.5 8.2-6.6 1.9-2.6 6.6z" />
        </svg>
        <b>Kona</b>
      </span>
    </header>
  )
}
