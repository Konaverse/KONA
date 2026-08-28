'use client'

import { useSyncExternalStore } from 'react'
import Button from '@/components/v4/Button'
import {
  CONSENT_CHOICE_EVENT,
  CONSENT_KEY,
  CONSENT_RESET_EVENT,
  applyConsent,
} from '@/components/layout/consent'

/**
 * The withdrawal control on /cookies (2026-08-28). The GDPR wants consent
 * to be as easy to take back as it was to give, and until this existed the
 * only way was clearing site data by hand.
 *
 * Shows the current choice, and one button that forgets it: the stored
 * value is removed, Google's consent signals drop back to "denied" at once
 * (so an "accepted" visitor stops being measured from this click, not from
 * the next page load), and the banner is asked to come back so the choice
 * is made again with the same two options as the first time.
 *
 * Client-only by nature — it reads localStorage — but the copy around it is
 * server-rendered, so the page reads fully without JS; only the control
 * itself needs the browser. The stored value is read through
 * useSyncExternalStore: the server snapshot is "unknown", the client's is
 * localStorage, and the banner's events are the subscription.
 */

/** 'unknown' on the server and before hydration; the real value after */
type Choice = 'accepted' | 'declined' | 'none' | 'unknown'

const subscribe = (cb: () => void) => {
  window.addEventListener('storage', cb)
  window.addEventListener(CONSENT_RESET_EVENT, cb)
  window.addEventListener(CONSENT_CHOICE_EVENT, cb)
  return () => {
    window.removeEventListener('storage', cb)
    window.removeEventListener(CONSENT_RESET_EVENT, cb)
    window.removeEventListener(CONSENT_CHOICE_EVENT, cb)
  }
}
const getSnapshot = (): Choice => {
  const v = localStorage.getItem(CONSENT_KEY)
  return v === 'accepted' || v === 'declined' ? v : 'none'
}
const getServerSnapshot = (): Choice => 'unknown'

const LINE: Record<Choice, string> = {
  accepted: 'You currently accept analytics cookies.',
  declined: 'You currently keep to essential cookies only.',
  none: 'You have not made a choice yet — the banner will ask.',
  unknown: ' ',
}

export default function CookiePreferences() {
  const choice = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const reset = () => {
    localStorage.removeItem(CONSENT_KEY)
    applyConsent('declined')
    window.dispatchEvent(new Event(CONSENT_RESET_EVENT))
  }

  return (
    <div className="lg-choice">
      <p className="t-small" aria-live="polite">
        {LINE[choice]}
      </p>
      <Button ghost onClick={reset} hoverLabel="Ask me again">
        Change your choice
      </Button>
    </div>
  )
}
