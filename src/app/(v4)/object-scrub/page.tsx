import type { Metadata } from 'next'
import ObjectScrub from '@/components/v4/ObjectScrub'
import './object-scrub.css'

/**
 * §6 DELIVERY-VALIDATION PAGE — never linked, never indexed.
 *
 * This route exists to answer the choreography doc's open measurements with
 * a real scroll: does a 120-frame baked sequence scrub cleanly, what does it
 * weigh, and does the frosted -> clear -> dissolve arc read at wheel speed.
 * The section component itself (ObjectScrub) is the real §6 mechanic and
 * moves to the homepage when that page exists; this wrapper is what gets
 * deleted. Runway above and below so the pin has honest neighbours.
 */
export const metadata: Metadata = {
  title: 'Object scrub test',
  robots: { index: false, follow: false },
}

const FRAMES = Array.from(
  { length: 120 },
  (_, i) => `/object/scrub-test/f${String(i + 1).padStart(4, '0')}.webp`,
)

/* §6's two-or-three short lines — the material's story, told against it.
 * Real copy lands with the homepage; these carry the right arc. */
const LINES = [
  'The brief arrives opaque.',
  'Structure appears as the noise clears.',
  'What we deliver is the same thing, made legible.',
]

export default function ObjectScrubPage() {
  return (
    <div className="ost">
      <section className="ost-runway">
        {/* The AMBIENT delivery form: the clear object turning on its own —
            a pre-rendered Cycles loop (blockout.py --idle), not a live
            scene and not the scrub. 10s/turn, seamless. */}
        <video
          className="ost-idle"
          src="/object/idle-clear.mp4"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
        <h1 className="t-h2">Above: the ambient loop. Below: the scrub.</h1>
        <p className="t-small">§6 delivery validation — not a page.</p>
      </section>

      <ObjectScrub frames={FRAMES} lines={LINES} />

      <section className="ost-runway">
        <p className="t-body">The pin released onto plain page.</p>
      </section>
    </div>
  )
}
