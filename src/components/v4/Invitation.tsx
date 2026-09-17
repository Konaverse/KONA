'use client'

import { useEffect, useRef, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/v4/Button'
import Reveal from '@/components/v4/Reveal'
import BlockReveal from '@/components/v4/BlockReveal'
import FooterField from '@/components/v4/FooterField'
import { gsap, EASE, rem } from '@/lib/motion-v4'
import { WORK_PROJECTS } from '@/lib/work-projects'
import { CALENDLY_URL } from '@/lib/site'
import './invitation.css'

/**
 * THE INVITATION — the site's CTA, closing every page that ends on
 * paper. SECOND BUILD, 2026-09-18 (user: "a more 'to our style' cta
 * section for all the pages. Agentic, white themed, imagery"). The first
 * build (2026-08-24: the line, two buttons, two placeholder plates, a
 * sideways social rail) is replaced; the socials live in the footer.
 *
 * OUR STYLE, as the services hub's hero set it: paper, a field of points
 * that answers the hand, a PROMPT, and an agent's cursor ("Kona") doing
 * the job in front of you. Here the job is the brief:
 *
 *   · THE LINE stays — the display sentence, wiped in.
 *   · THE ASK is a real prompt: "Tell us about your project". Sending it
 *     opens /contact with the brief already in the form (a plain GET
 *     without JS). Beside it, Book a call — the two CTAs the inner-page
 *     phase decided, Contact and Book, are still the two ways out.
 *   · THE STARTERS under it are the things people come with; one press
 *     writes it into the prompt.
 *   · THE WORK is the imagery: the four sites as plates at the flanks,
 *     drifting at their own depths, mono until a hand (or the agent)
 *     is on them; each is a way in to its case study.
 *   · THE AGENT keeps the section alive: its cursor goes to a plate,
 *     lifts it toward the prompt, and types the kind of brief that site
 *     began as; lets go; next. The moment you reach for the prompt it
 *     steps aside.
 *   · THE GROUND is bare paper (user, the same day: "remove the dotted
 *     animated background from the cta, but I love the animation that
 *     fires when you click"). THE FIELD is still mounted, QUIET: no
 *     lattice, no band, no lens — a press sends one ring of ink points
 *     out from under the hand, and it is gone again.
 *
 * References (21st.dev, read as film, none installed): "AI Suggested
 * Actions" / "Prompt Suggestion" (starters under a prompt), "Input Bar"
 * (the composer), "cta section with gallery" (work at the flanks),
 * "Agent Plan" — and our own HubAgent.
 *
 * Phones: no plates (user, 2026-08-26: "probably no images"), no agent;
 * the line, the prompt, the starters, the button. Reduced motion: the
 * same, still. Every word is server-rendered.
 */

const LINE = 'Make yours the site they remember.'
/** the starters: what people come with */
const STARTERS = ['A new website', 'A redesign', 'To be found on Google', 'Something in 3D', 'One page that sells']
/** what the agent types while it holds each plate — the brief that site began as */
const BRIEFS: Record<string, string> = {
  'dt-zankatian': 'A site that opens like a film.',
  'los-santos-barbers': 'One page that fills the chairs.',
  'lumiere-eclat': 'Something immersive, in 3D.',
  velricon: 'A calm site for a serious firm.',
}
/** the plates' drift, px per viewport-height of travel at the 16px root */
const DRIFT = [-70, 46, 58, -40]

export default function Invitation() {
  const rootRef = useRef<HTMLElement | null>(null)
  const router = useRouter()
  const plates = WORK_PROJECTS.slice(0, 4)

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const brief = String(new FormData(form).get('brief') ?? '').trim()
    form.classList.add('is-routing')
    const to = brief ? `/contact?brief=${encodeURIComponent(brief)}` : '/contact'
    window.setTimeout(() => router.push(to), 620)
  }

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const input = root.querySelector<HTMLInputElement>('.inv-input')!
    const ghost = root.querySelector<HTMLElement>('.inv-ghost')!
    const ask = root.querySelector<HTMLElement>('.inv-ask')!
    const chips = Array.from(root.querySelectorAll<HTMLButtonElement>('.inv-chip'))

    /* a starter writes itself into the prompt */
    let writing: gsap.core.Tween | null = null
    const write = (text: string) => {
      writing?.kill()
      const n = { v: 0 }
      input.value = ''
      writing = gsap.to(n, {
        v: text.length,
        duration: Math.min(0.7, text.length * 0.028),
        ease: 'none',
        onUpdate: () => {
          input.value = text.slice(0, Math.round(n.v))
        },
        onComplete: () => input.focus({ preventScroll: true }),
      })
    }
    const onChip = (ev: Event) => write((ev.currentTarget as HTMLElement).dataset.ask || '')
    chips.forEach((c) => c.addEventListener('click', onChip))
    const offChips = () => {
      writing?.kill()
      chips.forEach((c) => c.removeEventListener('click', onChip))
    }

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const layer = root.querySelector<HTMLElement>('.inv-plates')
    if (reduce || !layer || getComputedStyle(layer).display === 'none') return offChips

    /* THE DRIFT: the plates ride the section's travel at their own depths */
    const figs = Array.from(root.querySelectorAll<HTMLElement>('.inv-plate'))
    const inners = figs.map((f) => f.querySelector<HTMLElement>('.inv-plate-in')!)
    let seen = false
    const tick = () => {
      const r = root.getBoundingClientRect()
      const vh = window.innerHeight
      seen = r.bottom > vh * 0.25 && r.top < vh * 0.75
      if (r.bottom < -200 || r.top > vh + 200) return
      const c = (r.top + r.height / 2 - vh / 2) / vh
      const k = rem()
      figs.forEach((el, i) => (el.style.transform = `translate3d(0, ${(c * DRIFT[i % DRIFT.length] * k).toFixed(1)}px, 0)`))
    }
    tick()
    gsap.ticker.add(tick)

    /* THE AGENT: to a plate, lift it toward the prompt, type its brief,
       let go, next — for as long as nobody is at the prompt */
    const agent = root.querySelector<HTMLElement>('.inv-agent')!
    const fine = window.matchMedia('(hover: hover)').matches
    let tl: gsap.core.Timeline | null = null
    let at = 0
    let hushed = false
    let timer = 0
    /* the agent types OVER the empty input, so the placeholder steps out
       for it (a ::placeholder colour rule alone did not hold in Chrome) */
    const hint = input.placeholder
    const release = () => {
      figs.forEach((f) => f.classList.remove('is-held'))
      gsap.to(inners, { x: 0, y: 0, duration: 0.7, ease: EASE.settle, overwrite: 'auto' })
    }
    const rest = () => {
      tl?.kill()
      tl = null
      window.clearTimeout(timer)
      release()
      ghost.textContent = ''
      input.placeholder = hint
      ask.classList.remove('is-agent')
      gsap.to(agent, { opacity: 0, duration: 0.3, overwrite: 'auto' })
    }
    const visit = () => {
      if (hushed) return
      if (!seen || document.hidden) {
        timer = window.setTimeout(visit, 600)
        return
      }
      const i = at % figs.length
      at++
      const fig = figs[i]
      const inner = inners[i]
      const R = root.getBoundingClientRect()
      const b = fig.getBoundingClientRect()
      const a = ask.getBoundingClientRect()
      const px = b.left - R.left + b.width * 0.62
      const py = b.top - R.top + b.height * 0.58
      /* the pull: a short way along the line from the plate to the prompt */
      const dx = a.left + a.width / 2 - (b.left + b.width / 2)
      const dy = a.top + a.height / 2 - (b.top + b.height / 2)
      const len = Math.hypot(dx, dy) || 1
      const pull = 2.6 * 16 * rem()
      const text = BRIEFS[fig.dataset.slug || ''] || 'A website people remember.'
      const n = { v: 0 }
      const type = () => {
        ghost.textContent = text.slice(0, Math.round(n.v))
      }
      tl = gsap.timeline({
        onComplete: () => {
          timer = window.setTimeout(visit, 500)
        },
      })
      tl.to(agent, { opacity: 1, duration: 0.3 }, 0)
      tl.to(agent, { x: px, y: py, duration: 1.0, ease: EASE.drift }, 0)
      tl.call(() => fig.classList.add('is-held'))
      tl.to([agent, inner], { x: `+=${(dx / len) * pull}`, y: `+=${(dy / len) * pull}`, duration: 0.8, ease: EASE.glass }, '+=0.15')
      tl.call(() => {
        input.placeholder = ''
        ask.classList.add('is-agent')
      })
      tl.to(n, { v: text.length, duration: text.length * 0.042, ease: 'none', onUpdate: type })
      tl.to({}, { duration: 1.3 })
      tl.to(n, { v: 0, duration: 0.35, ease: 'none', onUpdate: type })
      tl.call(() => {
        input.placeholder = hint
        ask.classList.remove('is-agent')
        fig.classList.remove('is-held')
      })
      tl.to(inner, { x: 0, y: 0, duration: 0.8, ease: EASE.settle }, '<')
    }
    const hush = () => {
      hushed = true
      rest()
    }
    const wake = () => {
      if (input.value || document.activeElement === input) return
      hushed = false
      window.clearTimeout(timer)
      timer = window.setTimeout(visit, 900)
    }
    if (fine) {
      gsap.set(agent, { x: root.offsetWidth * 0.5, y: root.offsetHeight * 0.85, opacity: 0 })
      input.addEventListener('focus', hush)
      input.addEventListener('input', hush)
      input.addEventListener('blur', wake)
      chips.forEach((c) => c.addEventListener('pointerdown', hush))
      timer = window.setTimeout(visit, 1200)
    }

    return () => {
      offChips()
      gsap.ticker.remove(tick)
      tl?.kill()
      window.clearTimeout(timer)
      input.removeEventListener('focus', hush)
      input.removeEventListener('input', hush)
      input.removeEventListener('blur', wake)
      chips.forEach((c) => c.removeEventListener('pointerdown', hush))
      figs.forEach((f) => {
        f.style.transform = ''
        f.classList.remove('is-held')
      })
      gsap.set([agent, ...inners], { clearProps: 'all' })
      ghost.textContent = ''
      input.placeholder = hint
    }
  }, [])

  return (
    <section ref={rootRef} className="inv" id="contact" aria-labelledby="inv-h">
      <FooterField tone="paper" quiet />

      {/* THE WORK — the imagery; each plate a second way in to its study */}
      <div className="inv-plates" aria-hidden="true">
        {plates.map((p, i) => (
          <figure key={p.slug} className={`inv-plate inv-plate-${i + 1}`} data-slug={p.slug}>
            <a className="inv-plate-in" href={`/work/${p.slug}`} tabIndex={-1}>
              <img src={p.image} alt="" width={1900} height={1000} loading="lazy" decoding="async" draggable={false} />
            </a>
          </figure>
        ))}
      </div>

      <div className="k-page inv-body">
        <BlockReveal as="h2" className="t-display inv-line" id="inv-h" text={LINE} />

        <Reveal className="inv-row" index={1}>
          {/* THE ASK: a real form — /contact takes the brief */}
          <form className="inv-ask" action="/contact" method="get" onSubmit={onSubmit} aria-label="Tell us about your project">
            <svg className="inv-ask-mark" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M10 1.5 L11.9 8.1 L18.5 10 L11.9 11.9 L10 18.5 L8.1 11.9 L1.5 10 L8.1 8.1 Z" />
            </svg>
            <span className="inv-field">
              <input className="inv-input" name="brief" type="text" autoComplete="off" placeholder="Tell us about your project" aria-label="Tell us about your project" maxLength={200} />
              <span className="inv-ghost" aria-hidden="true" />
            </span>
            <button className="inv-send" type="submit" aria-label="Send the brief">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M2 8 L13 8" />
                <path d="M9 4.5 L13 8 L9 11.5" />
              </svg>
            </button>
            <span className="inv-note" aria-hidden="true">
              Opening the contact page with your brief
            </span>
          </form>
          <Button ghost href={CALENDLY_URL} external hoverLabel="Pick a time">
            Book a call
          </Button>
        </Reveal>

        <Reveal as="div" className="inv-chips" index={2}>
          {STARTERS.map((s) => (
            <button key={s} type="button" className="inv-chip" data-ask={`${s}.`}>
              {s}
            </button>
          ))}
        </Reveal>
      </div>

      {/* the agent's cursor */}
      <i className="inv-agent" aria-hidden="true">
        <svg viewBox="0 0 20 20" fill="currentColor">
          <path d="M3 2.5 L17 9.2 L10.6 11 L8.4 17.5 Z" />
        </svg>
        <b>Kona</b>
      </i>
    </section>
  )
}
