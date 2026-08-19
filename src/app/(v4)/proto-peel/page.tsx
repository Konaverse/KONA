import type { Metadata } from 'next'
import MediaPeel from '@/components/v4/MediaPeel'
import './proto-peel.css'

/**
 * MEDIA-PEEL VALIDATION PAGE — never linked, never indexed.
 *
 * The corner-stagger peel (Lusion's move, reverse-engineered 2026-08-19 from
 * upsunday.co's bundle — see MediaPeel.tsx) filmed in isolation before it is
 * allowed near the homepage. Candidate use: §5's card → full-bleed case view.
 * Runway above and below so the pin has honest neighbours. The stand-in video
 * is the legacy About comp (1920x1080 — full-bleed without upscaling).
 */
export const metadata: Metadata = {
  title: 'Media peel prototype',
  robots: { index: false, follow: false },
}

export default function ProtoPeelPage() {
  return (
    <div className="pp">
      <section className="pp-runway">
        <h1 className="t-h2">The peel, in isolation.</h1>
        <p className="t-small">
          Scroll: the card unfurls corner by corner into a full-bleed sheet — and folds back.
        </p>
      </section>

      <MediaPeel src="/About/Comp 1.mp4" ariaLabel="A flock of birds over a parking lot" />

      <section className="pp-runway">
        <p className="t-body">The pin released onto plain page.</p>
      </section>
    </div>
  )
}
