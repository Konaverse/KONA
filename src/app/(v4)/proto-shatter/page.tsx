import type { Metadata } from 'next'
import ShatterStage from '@/components/v4/ShatterStage'
import './proto-shatter.css'

/**
 * GLASS-SHATTER VALIDATION PAGE — never linked, never indexed.
 *
 * The 3D Websites card's media, judged on its own before §4 is touched
 * (user call, 2026-08-23: "build the 3D card alone first"). The card around
 * it is a stand-in — enough of the dark ground and glass pane that the media
 * can be read in context, not a rebuild of the section.
 *
 * The scrubber exists because hover plays the assembly at one speed and the
 * thing that needs judging is the shape of it: where the pieces are at 40%,
 * whether the knot surfaces too early, whether the flash lands on the meet.
 */
export const metadata: Metadata = {
  title: 'Glass shatter prototype',
  robots: { index: false, follow: false },
}

export default function ProtoShatterPage() {
  return (
    <div className="ps k-dark">
      <div className="ps-head">
        <h1 className="t-h2">The screen assembles.</h1>
        <p className="t-body">
          It rests broken. Hover the card and the shards converge from the outside in, the
          chrome surfaces as they close, and a breath of light marks the moment they meet.
          Leave, and it comes apart again at 1.4×. Drag the scrubber to hold any frame.
        </p>
      </div>
      <ShatterStage />
    </div>
  )
}
