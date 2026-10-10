import { CALENDLY_URL } from '@/lib/site'
import { CALENDLY_FRAME_URL } from '@/lib/calendly'

/**
 * THE CALENDAR, INLINE — /contact (user, 2026-09-12: "the modal of the
 * Calendly opened as a section"). Calendly's page in an iframe, with the
 * event header hidden so the pane is the date picker alone and the card
 * can be wide and short. Calendly's colour parameters are a paid feature
 * this account does not have, so the pane is white and sits on the paper
 * as one white card.
 *
 * The shared layout starts the real iframe in server HTML, on every
 * route. This slot borrows that already-loaded calendar when Contact
 * opens. Without JavaScript, render the original direct iframe here.
 *
 * Under the frame (it covers it once loaded) is a plain link to the
 * booking page, for a frame that is blocked or slow.
 */
export default function CalendlyInline() {
  return (
    <div className="ct-cal-wrap">
      <div className="ct-cal-host" data-calendly-inline>
        <a className="ct-cal-out" data-calendly-external href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
          Open the calendar on Calendly
        </a>
        <noscript>
          <iframe src={CALENDLY_FRAME_URL} title="Book a thirty-minute call with Konaverse" loading="eager" />
        </noscript>
      </div>
    </div>
  )
}
