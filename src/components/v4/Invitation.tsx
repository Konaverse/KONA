'use client'

import { useEffect, useRef, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/v4/Button'
import Reveal from '@/components/v4/Reveal'
import BlockReveal from '@/components/v4/BlockReveal'
import FooterField from '@/components/v4/FooterField'
import { gsap } from '@/lib/motion-v4'
import { CALENDLY_URL } from '@/lib/site'
import './invitation.css'

/**
 * THE INVITATION — the site's CTA, closing every page that ends on
 * paper. SECOND BUILD, 2026-09-18 (user: "a more 'to our style' cta
 * section for all the pages. Agentic, white themed, imagery"). The first
 * build (2026-08-24: the line, two buttons, two placeholder plates, a
 * sideways social rail) is replaced; the socials live in the footer.
 *
 * THIRD CUT, 2026-09-29 (user: "the images and cursor around this
 * section I want them to be removed … just keep the main text and the
 * rest"): the four site plates at the flanks and the agent's cursor
 * ("Kona") that lifted them and typed their briefs are gone. What is
 * left is the section at its plainest:
 *
 *   · THE LINE — the display sentence, wiped in.
 *   · THE ASK is a real prompt: "Tell us about your project". Sending it
 *     opens /contact with the brief already in the form (a plain GET
 *     without JS). Beside it, Book a call — the two CTAs the inner-page
 *     phase decided, Contact and Book, are still the two ways out.
 *   · THE STARTERS under it are the things people come with; one press
 *     writes it into the prompt.
 *   · THE GROUND is bare paper (user, 2026-09-18: "remove the dotted
 *     animated background from the cta, but I love the animation that
 *     fires when you click"). THE FIELD is still mounted, QUIET: no
 *     lattice, no band, no lens — a press sends one ring of ink points
 *     out from under the hand, and it is gone again.
 *
 * Phones and reduced motion: the same. Every word is server-rendered.
 */

const LINE = 'Make yours the site they remember.'
/** the starters: what people come with */
const STARTERS = ['A new website', 'A redesign', 'To be found on Google', 'Something in 3D', 'One page that sells']

export default function Invitation() {
  const rootRef = useRef<HTMLElement | null>(null)
  const router = useRouter()

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

    return () => {
      writing?.kill()
      chips.forEach((c) => c.removeEventListener('click', onChip))
    }
  }, [])

  return (
    <section ref={rootRef} className="inv" id="contact" aria-labelledby="inv-h">
      <FooterField tone="paper" quiet />

      <div className="k-page inv-body">
        <BlockReveal as="h2" className="t-display inv-line" id="inv-h" text={LINE} />

        <Reveal className="inv-row" index={1}>
          {/* THE ASK: a real form — /contact takes the brief */}
          <form className="inv-ask" action="/contact" method="get" onSubmit={onSubmit} aria-label="Tell us about your project">
            <svg className="inv-ask-mark" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M10 1.5 L11.9 8.1 L18.5 10 L11.9 11.9 L10 18.5 L8.1 11.9 L1.5 10 L8.1 8.1 Z" />
            </svg>
            <input className="inv-input" name="brief" type="text" autoComplete="off" placeholder="Tell us about your project" aria-label="Tell us about your project" maxLength={200} />
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
    </section>
  )
}
