import type { Metadata } from 'next'
import AboutGridHero from '@/components/v4/AboutGridHero'
import AboutPeople, { type Person } from '@/components/v4/AboutPeople'
import AboutOpen, { type Beat } from '@/components/v4/AboutOpen'
import AboutTools from '@/components/v4/AboutTools'
import AboutTimeline from '@/components/v4/AboutTimeline'
import BlockReveal from '@/components/v4/BlockReveal'
import Invitation from '@/components/v4/Invitation'
import { SITE_URL } from '@/lib/site'
import './about.css'

/**
 * THE ABOUT PAGE — /about (2026-09-11, the user's frame "About Page.png":
 * a hero, a statement, WHO WE ARE, and — since 2026-09-16 — WHAT WE MAKE). Its job is the one no
 * other page does: the two Person entities the root layout declares
 * (`/#konstantinos`, `/#nabil`) get their faces, their bios and their
 * page here — the E-E-A-T anchor every blog byline points back to. It
 * repeats nothing the homepage owns (process is §7, price is §8).
 *
 * §1 THE HERO — THE GRID (2026-09-14, user: the studioaton.webflow.io
 * hero, "the same animation exactly", with their own pictures). A
 * 300svh runway with a 100svh sticky box: a three-row grid of tiles
 * scaled so the centre one fills the screen, the title lifted to the
 * middle with its words a third larger. Scrolling scales the grid down
 * to the mosaic, lands the title at the foot, fades the cue and draws
 * a rule between the words; the rows slide apart as the section leaves.
 * Every number is the original's, read off its own GSAP instances
 * (extract/aton-hero/). AboutGridHero.tsx. The sentence hero it
 * replaces (AboutHero.tsx, "designing with / ideas [plate] that /
 * connect") is parked, unimported.
 *
 * §2 THE STATEMENT — two paragraphs, the studio's aim in the heavier
 * voice and what it does in the light one, filling letter by letter as
 * they climb (the house scroll fill).
 *
 * §3 THE PEOPLE — THREE CARDS (2026-09-16, user: three people now;
 * after a day of pinned stages — letter flips over a slatted
 * shutter, a drum, a GL funnel, all rejected — "something simpler but
 * we'll do it perfectly"). A 200svh section, not pinned, on the void:
 * three cards of one size — portrait, hairline, name, role; no
 * description, no numbering — placed about the centre line, high left / lower right
 * / lower still near the centre, each riding the scroll at its own
 * rate so they fan apart on the way in and gather on the way out; at
 * the midpoint all three faces are in the frame. The page fades to
 * the void as the section arrives and back to paper as it leaves
 * (`--ab-dark` on the root, mixed in about.css). AboutPeople.tsx. THE
 * PICTURE it replaces (AboutWho.tsx — the mirrored plates, the
 * ledger, the climbing portraits, the dossiers) is parked,
 * unimported, like the sentence hero.
 *
 * §4 WHAT WE MAKE — THE OPENING (2026-09-16, the user's recording; it
 * replaces WE REFUSE TO DO, removed the same day): a dark ground with
 * the title and a circle of the picture; pinned, the circle grows to
 * the viewport and covers the title, then the picture zooms on under
 * a darkening veil while one sentence, in four parts, scrolls up over
 * it; the toolset slides over the held picture. AboutOpen.tsx.
 *
 * §5 OUR TOOLSET (2026-09-11, the user's frame "toolset section.png") —
 * a row of cards wider than the page, DRAGGED by the hand, not pinned:
 * each card a step of the dark ladder with the bosra plate fading in
 * its corner, the tool's name and one line on what it does here. Over
 * the row the cursor becomes a frosted disc that says "Drag".
 * AboutTools.tsx.
 *
 * §6 HOW IT WENT (same day, "timeline section.png") — the pinned
 * timeline: "202" holds and only the last digit ROLLS; the label, the
 * plate and the caption roll with it on one clock as the hand scrolls
 * through the four years; a badge on the plate's corner says "Scroll
 * to explore" and fills a ring with the progress. The accessible
 * content is a plain list of the four entries; the rolling layers are
 * decoration. AboutTimeline.tsx.
 *
 * §7 THE INVITATION follows in flow and carries the footer out.
 *
 * SERVER-RENDERED, every word in the raw HTML (SEO plan D5): the h1
 * sentence, the statement, the three names as h3 with the roles, the
 * three bios, the five refusals. The drivers are enhancements; the
 * layout is the fallback and the noscript rule lifts the entrance.
 *
 * NOT INDEXED YET — KONA_OPEN_ROUTES=/about in .env.local lifts the
 * launch redirect locally. Flip INDEXABLE, drop the redirect and list
 * the page in sitemap.ts in one commit.
 *
 * COPY: the hero and the statement are the frame's, verbatim. The bios
 * and the refusals are FIRST DRAFTS — the user writes the real ones.
 */
const INDEXABLE = false

const TITLE = 'About Konaverse'
const DESCRIPTION =
  'Konaverse is three people in Cyprus — Konstantinos Kyprianou, technical architect, Nabil Al Jbawi, creative director, and Andreas Kyriakou — designing and building websites with a character of their own.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/about` },
  robots: INDEXABLE ? { index: true, follow: true } : { index: false, follow: true },
  openGraph: {
    title: `${TITLE} | Konaverse`,
    description: DESCRIPTION,
    url: `${SITE_URL}/about`,
    type: 'website',
  },
}

/** the three of them — the Person entities' visible half. `id` is the
 *  root layout's schema id for the two founders, so the page's nodes
 *  MERGE into the existing entities instead of duplicating them;
 *  Andreas's node is new here (the root layout does not declare him
 *  yet). */
const PEOPLE: readonly Person[] = [
  {
    id: 'konstantinos',
    name: 'Konstantinos Kyprianou',
    role: 'Technical Architect & Co-Founder',
    portrait: '/people/konstantinos-portrait.webp',
    bg: '/people/konstantinos-bg.webp',
    cut: '/people/konstantinos-cut.webp',
    bio:
      'Konstantinos is the technical architect. He builds the sites: the code, the performance, the integrations, and the part nobody sees that makes the part everybody sees work. Next.js, WebGL, the 3D pipeline, the search work — if it has to load in under a second and move at sixty frames, it goes through him.',
  },
  {
    id: 'nabil',
    name: 'Nabil Al Jbawi',
    role: 'Creative Director & Co-Founder',
    portrait: '/people/nabil-portrait.webp',
    bg: '/people/nabil-bg.webp',
    cut: '/people/nabil-cut.webp',
    bio:
      'Nabil is the creative director. He decides what a site looks like and how it moves: the layout, the type, the imagery, the motion. He starts from the brand, never from a template, and does not stop until the page has a character someone will remember.',
  },
  {
    /* Co-founder (user, 2026-09-16); what he owns is not said yet, so
       the role is the bare title and THE BIO IS A PLACEHOLDER (unseen
       on the page — the cards show name and role only — but it feeds
       the schema's Person description). The portrait is the user's
       "1.png", cropped to the set's 5:6 (public/people/andreas-portrait.webp). */
    id: 'andreas',
    name: 'Andreas Kyriakou',
    role: 'Co-Founder',
    portrait: '/people/andreas-portrait.webp',
    bg: '/people/andreas-bg.webp',
    cut: '/people/andreas-cut.webp',
    bio:
      'Andreas is the third of us. What he owns, and the line in his own voice, go here once they are written — for now this paragraph stands in so the stage has three people to move through.',
  },
]

/** THE OPENING's sentence — one line in four parts, each with its
 *  proof under it. FIRST DRAFT. */
const OPEN_BEATS: Beat[] = [
  {
    line: 'Websites people remember.',
    note: 'Not for a trick. For the feeling of having been somewhere.',
  },
  {
    line: 'Remembered for how they move,',
    note: 'Motion is designed in from the first sketch, never plugged in after.',
  },
  {
    line: 'for how fast they arrive,',
    note: 'Hand-written code, rendered on the server. Sixty frames on every scroll.',
  },
  {
    line: 'and for being unmistakably yours.',
    note: 'No templates, no stock. Every site starts from your brand and a blank file.',
  },
]

/** the toolset — the cards, in the ladder's order. FIRST DRAFT. */
const TOOLS = [
  { name: 'Blender', line: 'Every 3D object on our sites is modelled, lit and rendered here, then brought to the browser as a loop.' },
  { name: 'Next.js', line: 'The frame every site is built in: server-rendered, fast, and honest to crawlers.' },
  { name: 'Three.js', line: 'The WebGL layer: the shaders, the fluids and the objects that answer the cursor.' },
  { name: 'GSAP', line: 'Every entrance, roll and scrub on the page runs on one clock.' },
  { name: 'Figma', line: 'Where the picture is decided before a line of code: the type, the space, the motion.' },
  { name: 'After Effects', line: 'The motion is drawn before it is coded; the loops and the reels start here.' },
]

/** the timeline — four years; only the LAST digit changes, so every
 *  year here shares "202". FIRST DRAFT. */
const YEARS = [
  { year: '2021', label: 'The beginning', plate: '/home/bosra-1200.webp', text: 'Konaverse starts as two people and a laptop in Limassol, building sites for the businesses around us.' },
  { year: '2022', label: 'The first 3D site', plate: '/work/cathedral.webp', text: 'The first immersive site ships. Blender enters the pipeline and never leaves it.' },
  { year: '2025', label: 'The studio', plate: '/work/hall.webp', text: 'The practice becomes a studio: a process, a price list, and a team of two that stays two.' },
  { year: '2026', label: 'The redesign', plate: '/work/corridor.webp', text: 'The site you are reading, rebuilt in black and white from the first pixel.' },
]

/** the last digit of each year: the odometer's stops (module-level so
 *  the array is stable across renders) */
const YEAR_DIGITS = YEARS.map((y) => Number(y.year.slice(3)))

export default function AboutPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'About', item: `${SITE_URL}/about` },
        ],
      },
      {
        '@type': 'AboutPage',
        '@id': `${SITE_URL}/about#page`,
        url: `${SITE_URL}/about`,
        name: TITLE,
        description: DESCRIPTION,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: { '@id': `${SITE_URL}/#organization` },
      },
      /* the faces and the bios, merged into the layout's Person nodes */
      ...PEOPLE.map((p) => ({
        '@type': 'Person',
        '@id': `${SITE_URL}/#${p.id}`,
        name: p.name,
        jobTitle: p.role,
        description: p.bio,
        image: `${SITE_URL}${p.portrait}`,
        url: `${SITE_URL}/about`,
        worksFor: { '@id': `${SITE_URL}/#organization` },
      })),
    ],
  }

  return (
    <main className="ab">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* the entrances park things at opacity 0 or behind a crop edge;
          the no-JS page undoes every one of them */}
      <noscript>
        <style>{`.ab-ent{opacity:1!important;transform:none!important;filter:none!important}.ab-pill{width:var(--ab-pill-rest)!important;margin-left:.22em!important}.ab-band::before{transform:none!important}.ab-op-stage{position:static!important;height:auto!important;padding:8rem 0 0}.ab-op-t{position:static!important;padding:0 var(--ab-pad) 3rem}.ab-op-box{position:relative!important;width:100%!important;height:70svh!important;border-radius:0!important;transform:none!important;contain:none!important}.ab-op-veil{display:none!important}.ab-op-beats{margin-top:0!important;padding:4rem 0 100svh!important}.ab-op-beat{height:auto!important;padding:3rem var(--ab-pad)!important}.ab-ppl-cap,.ab-ppl-pic img{opacity:1!important;transform:none!important}.k-pix{display:none!important}.ab-tools-vp{overflow-x:auto!important}.ab-tool,.ab-tools-w,.ab-tools-t{opacity:1!important;transform:none!important}.ab-tl-list{position:static!important;width:auto!important;height:auto!important;clip:auto!important;overflow:visible!important;padding:0 var(--ab-pad) 4rem!important}.ab-time{--ab-tl-len:auto}.ab-tl-stage{position:static!important;height:auto!important}.ag{height:100svh!important}`}</style>
      </noscript>

      {/* §1 — THE HERO: the grid (2026-09-14) — one picture full-bleed,
          the mosaic it belongs to revealed on scroll, the title landing
          at the foot. AboutGridHero.tsx. */}
      <AboutGridHero />

      {/* §2 — THE STATEMENT, two voices, each wiped in line by line
          (BlockReveal, 2026-09-14 — the scroll-fill it replaces here
          stays on the people's lines and the invitation) */}
      <section className="ab-state" aria-label="What we do">
        <BlockReveal
          as="p"
          className="ab-aim"
          text="We aim to fill the internet with websites that convey a strong character and personality through it."
        />
        <BlockReveal
          as="p"
          className="ab-do"
          text="We design websites that provide immersive experiences to the visitors."
        />
      </section>

      {/* §3 — THE PEOPLE: the stage, scrolled through */}
      <AboutPeople people={PEOPLE} />

      {/* §4 — WHAT WE MAKE: the opening */}
      <AboutOpen
        title="What we make,"
        sub="in one sentence."
        picture="/home/bosra-2000.webp"
        alt="The columns of the theatre at Bosra"
        beats={OPEN_BEATS}
      />

      {/* §5 — OUR TOOLSET: the drag track */}
      <AboutTools>
        <h2 className="ab-tools-t">
          <span className="ab-tools-m">
            <span className="ab-tools-w"><em>Our</em> toolset</span>
          </span>
        </h2>
        <div className="ab-tools-vp">
          <ul className="ab-tools-track">
            {TOOLS.map((t, i) => (
              <li key={t.name} className="ab-tool" style={{ '--i': i } as React.CSSProperties}>
                <img className="ab-tool-bg" src="/home/bosra-1200.webp" alt="" loading="lazy" decoding="async" draggable={false} aria-hidden="true" />
                <span className="ab-tool-arrow" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 18 18 6M8 6h10v10" />
                  </svg>
                </span>
                <h3 className="ab-tool-name">{t.name}</h3>
                <p className="ab-tool-line">{t.line}</p>
              </li>
            ))}
          </ul>
        </div>
      </AboutTools>

      {/* §6 — HOW IT WENT: the pinned roll */}
      <AboutTimeline count={YEARS.length} digits={YEAR_DIGITS}>
        {/* the accessible content: the four entries as a plain list */}
        <ol className="ab-tl-list">
          {YEARS.map((y) => (
            <li key={y.year}>
              <h3>
                <span>{y.year}</span> {y.label}
              </h3>
              <p>{y.text}</p>
            </li>
          ))}
        </ol>

        <div className="ab-tl-stage" aria-hidden="true">
          <h2 className="ab-tl-t">How it <em>went</em></h2>

          {/* the label above the rolling digit */}
          <div className="ab-tl-labels">
            {YEARS.map((y) => (
              <span key={y.year} className="ab-tl-label">{y.label}</span>
            ))}
          </div>

          {/* the year: "202" holds, the last digit rolls */}
          <div className="ab-tl-year">
            <span className="ab-tl-hold">{YEARS[0].year.slice(0, 3)}</span>
            <span className="ab-tl-digits">
              {/* the odometer: all ten digits in a strip; the strip slides
                  to the year's last digit, passing the ones between */}
              <span className="ab-tl-strip">
                {Array.from({ length: 10 }, (_, d) => (
                  <span key={d} className="ab-tl-digit">{d}</span>
                ))}
              </span>
            </span>
          </div>

          {/* the plate, the caption, the badge */}
          <div className="ab-tl-frame">
            {YEARS.map((y) => (
              <img key={y.year} className="ab-tl-plate" src={y.plate} alt="" loading="lazy" decoding="async" draggable={false} />
            ))}
          </div>
          <div className="ab-tl-chip">
            {YEARS.map((y) => (
              <p key={y.year} className="ab-tl-cap">{y.text}</p>
            ))}
          </div>
          <button type="button" className="ab-tl-badge">
            <svg className="ab-tl-ringsvg" viewBox="0 0 100 100" aria-hidden="true">
              <circle className="ab-tl-track" cx="50" cy="50" r="48" />
              <circle className="ab-tl-ring" cx="50" cy="50" r="48" pathLength="1" />
            </svg>
            <span className="ab-tl-arrow">↓</span>
            <span className="ab-tl-say">Scroll to<br />explore</span>
            <span className="ab-tl-arrow">↓</span>
          </button>
        </div>
      </AboutTimeline>

      {/* §7 — THE INVITATION */}
      <div className="ab-cta">
        <Invitation />
      </div>
    </main>
  )
}
