'use client'

import { useEffect, useState } from 'react'
import Button from '@/components/v4/Button'
import {
  CONSENT_CHOICE_EVENT,
  CONSENT_KEY,
  CONSENT_RESET_EVENT,
  applyConsent,
  type Consent,
} from '@/components/layout/consent'
import '@/styles/tokens.css'

/**
 * Cookie consent — restyled to Whiteout (checklist 6.2). The CONSENT LOGIC is
 * untouched: same storage key, same gtag consent update, same 2s arrival
 * delay. Only the shell changed: framer-motion and the legacy Button are out,
 * the card is tokens.css (`k-cookie`) and the actions are the v4 Button.
 *
 * Renders from the ROOT layout, over legacy and v4 pages alike — so it
 * imports tokens.css itself rather than relying on the (v4) layout having
 * done it. Everything in that file is :root variables and k- prefixed
 * classes, so the import is inert on the legacy pages.
 *
 * Comes back on demand (2026-08-28): the withdrawal control on /cookies
 * forgets the stored choice and fires CONSENT_RESET_EVENT; the banner
 * listens and re-enters at once, so changing your mind is the same two
 * buttons as the first time.
 */

type Phase = 'hidden' | 'entering' | 'in' | 'leaving'

export default function CookieConsent() {
  const [phase, setPhase] = useState<Phase>('hidden')

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY)
    if (consent) return
    const timer = setTimeout(() => setPhase('entering'), 2000)
    return () => clearTimeout(timer)
  }, [])

  /* the /cookies page's "change your choice" — return immediately */
  useEffect(() => {
    const onReset = () => setPhase('entering')
    window.addEventListener(CONSENT_RESET_EVENT, onReset)
    return () => window.removeEventListener(CONSENT_RESET_EVENT, onReset)
  }, [])

  /* mount first, then transition: is-in lands one frame after `entering`
     renders, so the card actually travels instead of appearing mid-state */
  useEffect(() => {
    if (phase !== 'entering') return
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setPhase('in')))
    return () => cancelAnimationFrame(id)
  }, [phase])

  /* unmount on a clock, not on transitionend — under reduced motion the
     durations collapse to 1ms and a missed event would strand an invisible
     but still-interactive card over the page */
  useEffect(() => {
    if (phase !== 'leaving') return
    const id = setTimeout(() => setPhase('hidden'), 600)
    return () => clearTimeout(id)
  }, [phase])

  const close = (value: Consent) => {
    localStorage.setItem(CONSENT_KEY, value)
    applyConsent(value)
    window.dispatchEvent(new Event(CONSENT_CHOICE_EVENT))
    setPhase('leaving')
  }

  if (phase === 'hidden') return null

  return (
    <aside
      className={`k-cookie${phase === 'in' ? ' is-in' : ''}${
        phase === 'leaving' ? ' is-leaving' : ''
      }`}
      aria-label="Cookie consent"
    >
      <p className="k-cookie__title">Cookies, plainly.</p>
      <p className="k-cookie__body">
        One is essential and remembers this choice. The rest are analytics
        (they tell us how the site is used so we can improve it) and they are
        yours to allow.
      </p>
      <div className="k-cookie__actions">
        <Button onClick={() => close('accepted')}>Accept</Button>
        <Button ghost onClick={() => close('declined')}>
          Essential only
        </Button>
      </div>
      <a className="k-cookie__policy" href="/cookies">
        Cookie policy
      </a>
    </aside>
  )
}
