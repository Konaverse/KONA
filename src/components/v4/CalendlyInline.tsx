import { CALENDLY_URL } from '@/lib/site'

/**
 * THE CALENDAR, INLINE — /contact (user, 2026-09-12: "the modal of the
 * Calendly opened as a section"). Calendly's page in an iframe, with the
 * event header hidden so the pane is the date picker alone and the card
 * can be wide and short. Calendly's colour parameters are a paid feature
 * this account does not have, so the pane is white and sits on the paper
 * as one white card.
 *
 * RENDERED FROM THE START, WITH NO DELAY (owner, 2026-10-03: "I want the
 * calendly on the contact page rendered from the start. Remove the
 * question, show it from the start, and show it without delay"). For one
 * day it had loaded on a click (the frame brings Calendly's own cookies,
 * Stripe and trackers); the owner reversed that. So the frame is in the
 * SERVER HTML: the same URL Calendly's widget script would build
 * (embed_type=Inline, embed_domain), without waiting for React to
 * hydrate, the script to download and the widget to initialise. A server
 * component now: nothing here runs in the browser.
 *
 * Under the frame (it covers it once loaded) is a plain link to the
 * booking page, for a frame that is blocked or slow.
 */
const FRAME_URL = `${CALENDLY_URL}?embed_domain=kona-verse.com&embed_type=Inline&hide_event_type_details=1&hide_gdpr_banner=1`

export default function CalendlyInline() {
  return (
    <div className="ct-cal-wrap">
      <div className="ct-cal-host">
        <a className="ct-cal-out" href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
          Open the calendar on Calendly
        </a>
        <iframe src={FRAME_URL} title="Book a thirty-minute call with Konaverse" loading="eager" />
      </div>
    </div>
  )
}
