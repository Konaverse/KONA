'use client'

import { useEffect, useRef } from 'react'
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
 * Without JS the card holds a plain link to the booking page.
 */
/** the user's embed URL (hide_gdpr_banner) plus hide_event_type_details,
 *  so the pane is the calendar alone and can be short (user, 2026-09-12:
 *  "more wide and less tall") */
const INLINE_URL = `${CALENDLY_URL}?hide_event_type_details=1&hide_gdpr_banner=1`
export default function CalendlyInline() {
  const hostRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    let cancelled = false
    loadCalendlyScript()
      .then(() => {
        if (cancelled || !window.Calendly) return
        host.innerHTML = ''
        window.Calendly.initInlineWidget({ url: INLINE_URL, parentElement: host })
        host.classList.add('is-live')
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div ref={hostRef} className="ct-cal-host">
      <a className="ct-cal-fallback" href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
        Open the calendar
      </a>
    </div>
  )
}
