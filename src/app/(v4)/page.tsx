import { Fragment } from 'react'
import HeroPortrait from '@/components/v4/HeroPortrait'
import HeroPeel from '@/components/v4/HeroPeel'
import ClaimEntrance from '@/components/v4/ClaimEntrance'
import SolveCredits from '@/components/v4/SolveCredits'
import ServiceCards from '@/components/v4/ServiceCards'
import ProjectSheets, { type SheetProject } from '@/components/v4/ProjectSheets'
import ArrowLink from '@/components/v4/ArrowLink'
import Process from '@/components/v4/Process'
import './home.css'

/**
 * §5's three featured projects. PLACEHOLDER project data and stand-in
 * artwork (the moody-blue design/images set, converted to public/work/) —
 * both replaced when real case studies and recordings land (B1). The same
 * component runs on /work with the full set; these three are the featured
 * subset, per the choreography's "three projects, one sheet each".
 *
 * hrefs point at the work hub until case-study routes exist — the
 * choreography wants each sheet linking to its own case study.
 */
const FEATURED: SheetProject[] = [
  {
    title: 'Meridian',
    line: 'A brand and site built as one continuous story.',
    year: '2026',
    href: '/work',
    image: '/work/fog.webp',
  },
  {
    title: 'Atlas Freight',
    line: 'A logistics platform that reads like a dashboard should.',
    year: '2025',
    href: '/work',
    image: '/work/city.webp',
  },
  {
    title: 'Nord Studio',
    line: 'One page, one argument, no scroll wasted.',
    year: '2025',
    href: '/work',
    image: '/work/hall.webp',
  },
]

/**
 * The v4 homepage, rebuilt section by section against
 * docs/homepage-choreography.md (binding).
 *
 * All copy is PLACEHOLDER — the user writes the real lines (checklist 6.6).
 */
const CLAIM_LINE =
  'Konaverse is a web studio for brands that want their site to carry the story, not just the information.'

export default function HomePage() {
  /* Hero A/B (2026-08-18): variant B, the user's staircase wireframe, is
     live here; variant A (the 3D object, HeroStage) is parked at
     /hero-object for comparison — swap the import to bring it back. */
  return (
    <main className="hm">
      {/* The peel runway: HeroPeel marks this wrapper `is-run` when GL is
          live — it grows to 170svh with the hero sticky inside, so the
          WHOLE hero holds still while the eight-corner choreography plays
          and releases exactly as the last corner unsticks. Unstyled (zero
          layout impact) for no-JS / reduced motion / mobile. */}
      <div className="hm-heropin">
        <HeroPortrait />
      </div>

      {/* The hero peel: the eight-corner clock — grab, fold-forward,
          unstick sweep, unfold, land as §2's full-bleed background. DOM
          position matters — see HeroPeel.tsx. */}
      <HeroPeel />

      {/* §2 — the claim: the statement lives INSIDE the landing pad —
          the container the peel's sheet lands on and keeps tracking — so
          the type is part of the landed object. ONE viewport, no pin:
          the page scrolls straight on to §3 (user call, 2026-08-19; the
          pinned shrink/dark-turn scene built the same day was removed).
          z-raised over the fixed GL canvas (z2) so the text rides ON the
          landed sheet. */}
      <section className="hm-claim">
        <div className="hm-claim-land">
          <h2 className="t-h1 hm-claim-line" aria-label={CLAIM_LINE}>
            <span aria-hidden="true">
              {CLAIM_LINE.split(' ').map((w, i, arr) => (
                <Fragment key={i}>
                  <span className="hm-cw-i">{w}</span>
                  {i < arr.length - 1 ? ' ' : null}
                </Fragment>
              ))}
            </span>
          </h2>
          <p className="t-body hm-claim-body">
            Strategy, design, motion and engineering in one continuous process.
            Based in Cyprus, working globally.
          </p>
        </div>
        <ClaimEntrance />
      </section>

      <SolveCredits />

      {/* §4 — the cards: two columns, three rows, six identical cards, each
          carrying its own light, entering as paper (per-corner matrix3d,
          inner corners leading). Replaced the threshold 2026-08-20 (user
          call); ServicesThreshold.tsx and ServicesAccordion.tsx both stay in
          the tree, unimported, for comparison. */}
      <ServiceCards />

      {/* §5 — the page-turn. Full bleed, pins itself. */}
      <ProjectSheets projects={FEATURED} />

      {/* the hub link the choreography specifies alongside the three
          tile links — four links out of this section, no more */}
      <div className="k-section k-page hm-workfoot">
        <ArrowLink href="/work">All projects</ArrowLink>
      </div>

      {/* §7 — how we work: the thread, drawn on scroll */}
      <Process />
    </main>
  )
}
