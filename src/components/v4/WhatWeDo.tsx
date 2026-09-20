import ArrowLink from '@/components/v4/ArrowLink'
import Reveal from '@/components/v4/Reveal'
import { ROUTES } from '@/lib/site'

/**
 * §4 — WHAT WE DO, SET AS A SIGN (2026-09-19, user: a screenshot of a
 * typographic block — THE ART / *( picture ) Showreel / OF / HACKING /
 * SOCIAL — "replace it with a section like this: WHAT one line, WE one
 * line, then the image in brackets one line, and DO last line").
 *
 * It replaces the hub's bento on the homepage (HubBench stays on
 * /services). Four lines, centred, the display face at its heaviest —
 * Manrope's variable axis carries the weight, the same axis the footer's
 * address leans on — and the third line is a pair of parentheses holding
 * a picture. The picture is the one link out: it goes to the services
 * hub, and the small note beside the brackets says so, which keeps the
 * homepage's one required route to /services (architecture §8).
 *
 * THE ENTRANCE. The three words rise through their masks in turn; the
 * bracket line resolves with the house reveal, and then the picture
 * OPENS between the parentheses — from no width to its full square, the
 * parentheses parting to make room — the aperture, in type.
 *
 * Server-rendered, every word real text: the h2 reads "What we do" to a
 * reader; the bracket line is decoration and says so.
 */

/** the picture in the brackets — one of the house plates */
const PICTURE = { src: '/services/design.webp', alt: '' }

export default function WhatWeDo() {
  return (
    <section className="sg" id="services" aria-labelledby="sg-h">
      <div className="k-page sg-page">
        <h2 className="sg-h" id="sg-h" aria-label="What we do">
          <Reveal as="span" className="sg-w" masked index={0}>
            What
          </Reveal>
          <Reveal as="span" className="sg-w" masked index={1}>
            We
          </Reveal>
          <span className="sg-line">
            <span aria-hidden="true">
              <Reveal as="span" className="sg-br" index={2}>
                <span className="sg-p">(</span>
                <a className="sg-pic" href={ROUTES.services} tabIndex={-1}>
                  <img src={PICTURE.src} alt={PICTURE.alt} loading="lazy" decoding="async" />
                </a>
                <span className="sg-p">)</span>
              </Reveal>
            </span>
            {/* the note beside the brackets: the route the picture takes */}
            <Reveal as="span" className="sg-note" index={4}>
              <ArrowLink href={ROUTES.services}>Six services</ArrowLink>
            </Reveal>
          </span>
          <Reveal as="span" className="sg-w" masked index={3}>
            Do
          </Reveal>
        </h2>
      </div>
    </section>
  )
}
