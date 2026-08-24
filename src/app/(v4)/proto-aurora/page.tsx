import type { Metadata } from 'next'
import Aurora from '@/components/v4/Aurora'
import './proto-aurora.css'

/**
 * THE AURORA, ALONE — never linked, never indexed.
 *
 * §6 was deleted on 2026-08-24 and the aurora was lifted out of it and
 * repainted monochrome for the noir pivot. It is destined for the footer,
 * which is not built, so without this page the shader has nowhere to be
 * looked at and the repaint could only be judged from source.
 *
 * TWO BOXES, deliberately: a full-bleed one, which is roughly what a footer
 * ground looks like, and a short banded one, because the curtains are
 * composed for a tall frame and the first question about putting them in a
 * footer is what survives being cropped to a strip.
 *
 * Throwaway. Nothing here graduates — what moves to the footer is Aurora.tsx.
 */
export const metadata: Metadata = {
  title: 'Aurora',
  robots: { index: false, follow: false },
}

export default function ProtoAuroraPage() {
  return (
    <div className="pa k-dark">
      <section className="pa-full">
        <Aurora />
        <div className="pa-cap">
          <h1 className="t-h2">The aurora, monochrome.</h1>
          <p className="t-body">
            Three curtains on a value ramp &mdash; n-5, n-3, white at the tips &mdash; over
            the n-11 void. The one colour left on the page, <code>--ice-deep</code>, sits at
            the FOOT of the curtains and is gone by their tips, running opposite to the
            value. Colour as emitted light, never as a surface.
          </p>
        </div>
      </section>

      <section className="pa-band">
        <Aurora />
      </section>

      <p className="pa-note t-small">
        Full bleed above, footer-height band below &mdash; the band is the real question.
      </p>
    </div>
  )
}
