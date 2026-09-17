import { Fragment } from 'react'
import type { Metadata } from 'next'
import HeroPortrait from '@/components/v4/HeroPortrait'
import HeroPeel from '@/components/v4/HeroPeel'
import ClaimEntrance from '@/components/v4/ClaimEntrance'
import BlockReveal from '@/components/v4/BlockReveal'
import SolveStack from '@/components/v4/SolveStack'
import HubBench from '@/components/v4/HubBench'
import { SERVICE_PAGES } from '@/lib/service-pages'
import WorkList from '@/components/v4/WorkList'
import { CASE_STUDIES } from '@/lib/case-studies'
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

/* §5's FEATURED list (three SheetProjects for the rows/deck/stack) left
   with WorkList (2026-09-14): the list draws every project from
   src/lib/work-projects.ts. */


/**
 * The v4 homepage, rebuilt section by section against
 * docs/homepage-choreography.md (binding).
 *
 * All copy is PLACEHOLDER — the user writes the real lines (checklist 6.6).
 */
/** §3's statement — the four symptoms the credit roll used to scatter
 *  (a template look, visitors leaving early, a site the business outgrew,
 *  invisibility in search), said once, as the client would. FIRST DRAFT —
 *  the user writes the real line. */
const SOLVE_LINE =
  'Your site looks like everyone else’s. Visitors leave before they understand what you do. It has not kept up with the business, and where people actually search, you are nowhere. That is what we solve.'

/** §3's SHEET (2026-09-17). SOLVE_LINE names four symptoms in one
 *  breath; the sheet names them again one word at a time, each word cut
 *  by the plate it sits on. A tag and an answer line rode with each of
 *  these until the user cut them — "just basically remove everything
 *  except the big text in the middle" — so the word is all that is left,
 *  and the statement above carries the meaning.
 *
 *  WORDS ARE A FIRST DRAFT and the PICTURES ARE PLACEHOLDER — the house
 *  noir plates, deliberately NOT the case-study covers, because §5 right
 *  below is the work. Every plate has to be DARK (see SolveStack.tsx). */
const SOLVE_BEATS = [
  { word: 'TEMPLATE', src: '/work/city.webp', alt: 'One lit tower standing out of a dark skyline' },
  { word: 'FORGETTABLE', src: '/work/corridor.webp', alt: 'Figures at the threshold of a corridor opening onto light' },
  { word: 'OUTGROWN', src: '/work/orb.webp', alt: 'People crossing the floor of a vast hall, seen from above' },
  /* NOT fog.webp, though it suited the word: the sheet's word lies over
     the plate in difference blend, and a mid-grey picture sends it
     straight back to mid-grey. Every plate here has to be dark. */
  { word: 'INVISIBLE', src: '/work/hall.webp', alt: 'A shaft of light crossing a dark hall' },
] as const

/** the bench's lead — the hub's own line */
const BENCH_LEAD =
  'Our websites are the result when you combine a personalised structure, layout and motion. When you work with us, we make sure your website stands out and is remembered.'

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

      {/* §3 — WHAT WE SOLVE, AS ONE STATEMENT (2026-09-14, user: "remove
          that picture completely and create those texts as one big new
          text with good meaning, a large nice minimal paragraph with the
          revealing animation"). The credit roll over the Bosra plate
          (SolveCredits.tsx — four problems scattered over a sticky
          photograph, drifting at four speeds) is parked, unimported; its
          four symptoms are now one paragraph on paper, wiped in line by
          line (BlockReveal). `#solve` stays for the nav anchor. */}
      <section className="sv2" id="solve" aria-labelledby="sv2-h">
        <div className="sv2-page">
          <p className="sv2-k t-small">What we solve</p>
          <BlockReveal as="h2" className="sv2-p" id="sv2-h" text={SOLVE_LINE} />
        </div>
        {/* THE SPREAD (2026-09-17, the user's recording "pinned stack
            image section.mp4": "recreate this component and make it a
            part of the what we solve — text a little above, component
            below", then "make the plate smaller and let's design a
            section around it"). The statement scrolls away; a pinned
            spread holds — the answer large on the left, the deck on the
            right, a step rail under both — and one scroll deals a new
            picture and a new answer together. SolveStack.tsx carries the
            measurements the deck was built from. */}
        <SolveStack beats={SOLVE_BEATS} />
      </section>

      {/* §4 — THE WORKBENCH (2026-09-18, user: "in the homepage replace
          the services section cards with the services bento grid we have
          in the services hub"): the hub's bento, the same component — six
          artboards whose scenes play under the hand, tipping up out of the
          fold, and the dark card that sends the undecided to the
          Invitation's prompt. The six void cards (ServiceCards.tsx, and
          the threshold and accordion before them) stay in the tree,
          unimported. */}
      <HubBench
        lead={BENCH_LEAD}
        services={SERVICE_PAGES.map((p) => ({
          slug: p.slug,
          name: p.name,
          tagline: p.tagline,
          blurb: p.blurb,
          facts: p.facts.map((f) => ({ value: f.value, label: f.label })),
        }))}
      />

      {/* §5 — THE LIST (WorkList, 2026-09-14): igniteagency.com's selected
          work rebuilt from measurement — a marquee head, hairline rows
          that flood with ink on hover, a preview chasing the cursor. All
          four projects, linking to their case studies. The section carries
          `#work`. The stack (WorkStack), the rows (WorkRows) and the deck
          (WorkDeck) stay in the tree unimported. */}
      <WorkList studies={CASE_STUDIES.map((c) => c.slug)} />

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
