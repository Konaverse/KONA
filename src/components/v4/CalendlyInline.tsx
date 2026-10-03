'use client'

import { useRef, useState } from 'react'
import Button from '@/components/v4/Button'
import { loadCalendlyScript } from '@/components/v4/CalendlyPopover'
import { CALENDLY_URL } from '@/lib/site'

/**
 * THE CALENDAR, INLINE — /contact (user, 2026-09-12: "the modal of the
 * Calendly opened as a section"). Calendly's own inline embed, as the
 * user supplied it, with the event header hidden so the pane is the
 * date picker alone and the card can be wide and short — mounted
 * through the same script the popover loads,
 * via initInlineWidget rather than the data-url auto-init, so it works
 * inside a client-rendered tree. Calendly's colour parameters are a
 * paid feature this account does not have, so the pane is white and
 * sits on the paper as one white card.
 *
 * Without JS the card still holds a plain link to the booking page.
 */
/** the user's embed URL (hide_gdpr_banner) plus hide_event_type_details,
 *  so the pane is the calendar alone and can be short (user, 2026-09-12:
 *  "more wide and less tall") */
const INLINE_URL = `${CALENDLY_URL}?hide_event_type_details=1&hide_gdpr_banner=1`
export default function CalendlyInline() {
  const hostRef = useRef<HTMLDivElement | null>(null)
  /* ON CLICK ONLY (owner, 2026-10-03). The widget is Calendly's page in an
     iframe, and that page loads Stripe and Calendly's own trackers (a
     Facebook pixel among them) — third-party cookies the Cyprus
     Commissioner's rules say need consent first, and about 3 MB nobody
     asked for yet. So the card holds an invitation, and the calendar comes
     in only when the visitor asks for it. */
  const [state, setState] = useState<'idle' | 'loading' | 'live'>('idle')

  const open = () => {
    const host = hostRef.current
    if (!host || state !== 'idle') return
    setState('loading')
    loadCalendlyScript()
      .then(() => {
        if (!window.Calendly) return setState('idle')
        window.Calendly.initInlineWidget({ url: INLINE_URL, parentElement: host })
        setState('live')
      })
      .catch(() => setState('idle'))
  }

  return (
    <div className="ct-cal-wrap">
      {/* the widget mounts here; React never renders into it */}
      <div ref={hostRef} className={`ct-cal-host${state === 'live' ? ' is-live' : ''}`} />
      {state !== 'live' ? (
        <div className="ct-cal-ask">
          <p className="ct-cal-t">Book a thirty-minute call</p>
          <p className="ct-cal-b">
            Pick a time that suits you. The calendar is Calendly's, and it loads its own cookies
            once you open it.
          </p>
          <Button onClick={open} hoverLabel="Open the calendar">
            {state === 'loading' ? 'Opening…' : 'Show the calendar'}
          </Button>
          <a className="ct-cal-out" href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
            or open it on Calendly
          </a>
        </div>
      ) : null}
    </div>
  )
}
