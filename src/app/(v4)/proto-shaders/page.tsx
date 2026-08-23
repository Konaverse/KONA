import type { Metadata } from 'next'
import ShaderBench from '@/components/v4/ShaderBench'
import './proto-shaders.css'

/**
 * SHADER BENCHMARK — never linked, never indexed.
 *
 * Answers one question: can §4's six plates be live shaders instead of six
 * looping videos? Six videos measured 33.3ms a frame with 88% of frames over
 * budget — exactly where the section sat before it was rebuilt. One video is
 * free. This asks where shaders land between those.
 *
 * It exists as a page rather than as a number in a commit message because the
 * only environment that can answer is a real GPU, and everything else in this
 * session was measured in a headless browser running a software rasteriser —
 * which is precisely the setup that gets this question wrong in both
 * directions. So: open it on the machine that matters, and read it.
 */
export const metadata: Metadata = {
  title: 'Shader benchmark',
  robots: { index: false, follow: false },
}

export default function ProtoShadersPage() {
  return (
    <div className="pz k-dark">
      <div className="pz-head">
        <h1 className="t-h2">Six plates, one canvas.</h1>
        <p className="t-body">
          Each plate is a different fragment shader, all drawn into a single WebGL surface
          with a scissor rect apiece &mdash; six contexts would be a non-starter, and one
          canvas composites once however many regions go into it. Change the plate count and
          the resolution and watch the readout: the question is whether six at device scale
          lands nearer one video (16.7ms, free) or six (33.3ms, 88% of frames over budget).
        </p>
        <p className="t-body">
          Scroll &mdash; the plates are drawn from their live rects, so scrolling is part of
          the test.
        </p>
      </div>
      <ShaderBench />
    </div>
  )
}
