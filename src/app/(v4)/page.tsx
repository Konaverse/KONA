import { Fragment } from 'react'
import type { Metadata } from 'next'
import HeroPortrait from '@/components/v4/HeroPortrait'
import HeroPeel from '@/components/v4/HeroPeel'
import ClaimEntrance from '@/components/v4/ClaimEntrance'
import SolveCredits from '@/components/v4/SolveCredits'
import ServiceCards from '@/components/v4/ServiceCards'
import type { SheetProject } from '@/components/v4/ProjectSheets'
import WorkRows from '@/components/v4/WorkRows'
import WorkDeck from '@/components/v4/WorkDeck'
import Invitation from '@/components/v4/Invitation'
import { SITE_URL } from '@/lib/site'
import './home.css'

/**
 * THE ONE PAGE'S METADATA (2026-08-28). Until now `/` inherited the root
 * layout's v3 defaults — "Premium Digital Agency", the old description, the
 * old keyword list — so the first thing a search result or a link preview
 * said about the new site was the old site's line. Title is `absolute`:
 * the root template appends " | Konaverse", and the brand is already the
 * first word. Description is the hero's paragraph, cut to a result's
 * width. The OG image is the v4 hero (public/og-image.png, 1200x630).
 */
const HOME_TITLE = 'Konaverse — Build the website that will make you stand out'
const HOME_OG =
  'A web studio in Cyprus. Strategy, design, motion and engineering in one continuous process, for brands that have outgrown the template.'

export const metadata: Metadata = {
  title: { absolute: HOME_TITLE },
  description:
    'Konaverse is a web studio in Cyprus that designs and builds websites end to end — strategy, design, motion and engineering in one continuous process — for brands that have outgrown the template.',
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: HOME_TITLE,
    description: HOME_OG,
    url: SITE_URL,
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: HOME_TITLE }],
  },
  twitter: {
    card: 'summary_large_image',
    title: HOME_TITLE,
    description: HOME_OG,
    images: ['/og-image.png'],
  },
}

/**
 * §5's three featured projects — REAL WORK as of 2026-08-24 (user-supplied
 * links). Artwork is each live site's own hero, captured at 1440x1000@2x
 * (tools/shot.js's sibling recipe) and encoded to public/work/. The same
 * component runs on /work with the full set; these three are the featured
 * subset, per the choreography's "three projects, one sheet each".
 *
 * hrefs point at the LIVE sites until case-study routes exist — the
 * choreography wants each sheet linking to its own case study eventually.
 * YEARS confirmed by the user 2026-08-28: Los Santos 2025, Lumière 2026.
 * Velricon replaced Tzankatian 2026-09-25; its year and line are the
 * /work roster's first drafts, still to confirm.
 */
const FEATURED: SheetProject[] = [
  {
    title: 'Velricon',
    line: 'Financial leadership, given a site with the same composure.',
    year: '2025',
    href: 'https://velricon.com',
    image: '/work/velricon.webp',
  },
  {
    title: 'Los Santos Barbershop',
    line: 'Nicosia’s barbershop set in type as sharp as the fades.',
    year: '2025',
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

      {/* §5 — TWO FORMS, ONE LANDMARK. Desktop: THE ROWS (WorkRows,
          2026-08-31, the user's final mockups — the IMMERSIVENESS /
          THROUGH — WORK head arriving word by word, then three rows
          pinned in one viewport, the expanded project trading its
          height to the next through wave-gl.ts's jelly resize;
          replaced the wheel, WorkWheel, which stays in the tree
          unimported). Phones: THE DECK (WorkDeck — each project a
          card, the cards stacking on scroll on the pitch deck's
          mechanic). CSS shows exactly one; each driver returns early
          when it is the hidden one. The wrapper carries `#work` so the
          nav anchor lands on whichever is displayed. */}
      <div id="work">
        <WorkRows projects={FEATURED} />
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
