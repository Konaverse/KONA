import type { Metadata } from 'next'
import FractureStage from '@/components/v4/FractureStage'
import { CHROME_KNOT, GLASS_SCREEN } from '@/components/v4/fractures'
import './proto-shatter.css'

/**
 * FRACTURE VALIDATION PAGE — never linked, never indexed.
 *
 * §4's house move, judged on its own before the section is touched. Two
 * objects, because the point is that ONE component does both and they break
 * differently: the screen shatters like a pane, the knot comes apart along
 * its own curve. See fractures.ts for why that needed two pivots.
 *
 * The scrubber exists because hover plays the assembly at one speed and what
 * needs judging is the shape of it — where the pieces are at 40%, whether
 * the flash lands on the meet.
 */
export const metadata: Metadata = {
  title: 'Fracture prototype',
  robots: { index: false, follow: false },
}

export default function ProtoShatterPage() {
  return (
    <div className="ps k-dark">
      <div className="ps-head">
        <h1 className="t-h2">The objects arrive broken.</h1>
        <p className="t-body">
          Each card&rsquo;s object rests in pieces and assembles under the pointer, closing
          last at the point it came apart. Leave, and it opens again at 1.4&times;. One
          component, one image per object, N clip-paths &mdash; the screen shatters like a
          pane, the knot unwinds along its own curve. Drag a scrubber to hold any frame.
        </p>
      </div>
      <div className="ps-grid">
        <FractureStage
          art={CHROME_KNOT}
          name="3D Websites"
          copy="Real dimension for brands that need presence felt rather than described."
        />
        <FractureStage
          art={GLASS_SCREEN}
          name="Web Development"
          copy="Engineering where performance is a feature: clean semantics and instant loads."
        />
      </div>
    </div>
  )
}
