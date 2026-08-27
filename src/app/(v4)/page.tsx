import { Fragment } from 'react'
import HeroPortrait from '@/components/v4/HeroPortrait'
import HeroPeel from '@/components/v4/HeroPeel'
import ClaimEntrance from '@/components/v4/ClaimEntrance'
import SolveCredits from '@/components/v4/SolveCredits'
import ServiceCards from '@/components/v4/ServiceCards'
import type { SheetProject } from '@/components/v4/ProjectSheets'
import WorkWheel from '@/components/v4/WorkWheel'
import WorkDeck from '@/components/v4/WorkDeck'
import Invitation from '@/components/v4/Invitation'
import './home.css'

/**
 * §5's three featured projects — REAL WORK as of 2026-08-24 (user-supplied
 * links). Artwork is each live site's own hero, captured at 1440x1000@2x
 * (tools/shot.js's sibling recipe) and encoded to public/work/. The same
 * component runs on /work with the full set; these three are the featured
 * subset, per the choreography's "three projects, one sheet each".
 *
 * hrefs point at the LIVE sites until case-study routes exist — the
 * choreography wants each sheet linking to its own case study eventually.
 * YEARS: Lumière states 2026 in its own footer; the other two are the
 * user's to confirm (marked provisional, not scraped).
 */
const FEATURED: SheetProject[] = [
  {
    title: 'Dimitris Tzankatian',
    line: 'A videographer’s site that opens like his showreel — every frame with a purpose.',
    year: '2025', // provisional — user to confirm
    href: 'https://dtzankatian.com',
    image: '/work/tzankatian.webp',
  },
  {
    title: 'Los Santos Barbershop',
    line: 'Nicosia’s barbershop set in type as sharp as the fades.',
    year: '2024', // provisional — user to confirm
    href: 'https://lossantosbarbers.com',
    image: '/work/lossantos.webp',
  },
  {
    title: 'Lumière Éclat',
    line: 'A scroll-driven story of light and steel.',
    year: '2026',
    href: 'https://watchweb.vercel.app',
    image: '/work/lumiere.webp',
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
      <section className="hm-claim" id="studio">
        <div className="hm-claim-land">
          {/* THE LANDED SHEET, IN THE DOM (phones, 2026-08-26). Once the
              peel's sheet has landed, HeroPeel hands its pixels to this:
              the same loop, cover-fit at the same crop, the same grade and
              catch the shader draws — but scrolling natively WITH the text
              instead of being redrawn from JS a frame behind it, which on a
              phone read as the background trembling under the claim.
              Hidden on desktop (Lenis drives the scroll there, so GL and
              DOM never disagree). preload none: HeroPeel loads it when the
              GL arms, and never on desktop. */}
          <div className="hm-claim-bg" aria-hidden="true">
            <video
              poster="/home/portrait-glass-mono.webp"
              src="/home/hero-loop.mp4"
              preload="none"
              muted
              loop
              playsInline
            />
          </div>
          {/* ONE LINE, BODY SIZE, IN THE CORNER (2026-08-26, user): after the
              sheet lands the only type on it is the claim, at body size,
              bottom-right on desktop and bottom-centre on phones. The
              display headline and the second paragraph are gone; the
              word-resolve entrance stays (ClaimEntrance targets the
              .hm-cw-i spans). Still the section's heading for the outline. */}
          <h2 className="t-body hm-claim-line" aria-label={CLAIM_LINE}>
            <span aria-hidden="true">
              {CLAIM_LINE.split(' ').map((w, i, arr) => (
                <Fragment key={i}>
                  <span className="hm-cw-i">{w}</span>
                  {i < arr.length - 1 ? ' ' : null}
                </Fragment>
              ))}
            </span>
          </h2>
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

      {/* §5 — TWO FORMS, ONE LANDMARK (2026-08-26). Desktop: THE WHEEL
          (WorkWheel — the user's wireframe: one pinned viewport, the
          names on a wheel, one window that FOLDS between captures with
          the hero's fold (fold-gl.ts), description resolving under it,
          the title carrying the captures as an inline tile-pill; the
          capture rests under a veil that lifts on hover; replaced the
          page-turn, ProjectSheets, which still renders /work). Phones:
          THE DECK (WorkDeck — the same title, each project a card, the
          cards stacking on scroll on the pitch deck's mechanic; replaced
          the fold deck, WorkFold, git 8f46d2b). CSS shows exactly one;
          each driver returns early
          when it is the hidden one. The wrapper carries `#work` so the
          nav anchor lands on whichever is displayed. */}
      <div id="work">
        <WorkWheel projects={FEATURED} />
        <WorkDeck projects={FEATURED} />
      </div>

      {/* §7 (Process) is UNMOUNTED for a user experiment (2026-08-24) — not
          deleted. To restore: re-import Process, mount it here, put `buried`
          back on ProjectSheets, and remove the workfoot below (the "All
          projects" hub link rides §7's rising sheet when it is mounted). */}

      {/* The "All projects" hub band that sat here is OUT for the one-page
          launch (/work redirects home). It returns with the /work page:
          a `k-page hm-workfoot` div holding an ArrowLink to /work, CSS in
          git (5da89b2). */}

      {/* §9 — the invitation: the line, the button, the address */}
      <Invitation />
    </main>
  )
}
