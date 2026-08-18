import Reveal from '@/components/v4/Reveal'
import HeroPortrait from '@/components/v4/HeroPortrait'
import ScrollFillText from '@/components/v4/ScrollFillText'
import SolveCredits from '@/components/v4/SolveCredits'
import ServicesIndex from '@/components/v4/ServicesIndex'
import ProjectSheets, { type SheetProject } from '@/components/v4/ProjectSheets'
import ArrowLink from '@/components/v4/ArrowLink'
import Interlude from '@/components/v4/Interlude'
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
 * Currently live: §1 Arrival (HeroStage, second cut — the reference-image
 * rebuild) and a §2 skeleton whose statement fills letter by letter with
 * scroll (user-directed 2026-08-18). §2 still gets its own full design pass.
 *
 * All copy is PLACEHOLDER — the user writes the real lines (checklist 6.6).
 */
export default function HomePage() {
  /* Hero A/B (2026-08-18): variant B, the user's staircase wireframe, is
     live here; variant A (the 3D object, HeroStage) is parked at
     /hero-object for comparison — swap the import to bring it back. */
  return (
    <main className="hm">
      <HeroPortrait />

      {/* Full-width sheet with an inner k-page: §3 slides UNDER this
          section, so its background must span the whole viewport or the
          image would peek past the content column on wide screens. */}
      <section className="hm-claim k-section">
        <div className="k-page">
          <ScrollFillText
            as="h2"
            className="t-h1 hm-claim-line"
            text="Konaverse is a web studio for brands that want their site to carry the story, not just the information."
          />
          <Reveal as="p" className="t-body hm-claim-body" index={1}>
            Strategy, design, motion and engineering in one continuous process.
            Based in Cyprus, working globally.
          </Reveal>
          <hr className="k-rule hm-claim-rule" />
        </div>
      </section>

      <SolveCredits />

      <ServicesIndex />

      {/* §5 — the page-turn. Full bleed, pins itself. */}
      <ProjectSheets projects={FEATURED} />

      {/* the hub link the choreography specifies alongside the three
          tile links — four links out of this section, no more */}
      <div className="k-section k-page hm-workfoot">
        <ArrowLink href="/work">All projects</ArrowLink>
      </div>

      {/* §6 — the interlude: CRT turn-on, aurora stage, the ultra card */}
      <Interlude />
    </main>
  )
}
