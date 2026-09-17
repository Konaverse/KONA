import type { Metadata } from 'next'
import AboutGridHero from '@/components/v4/AboutGridHero'
import AboutPeople, { type Person } from '@/components/v4/AboutPeople'
import AboutOpen, { type Beat } from '@/components/v4/AboutOpen'
import AboutWords from '@/components/v4/AboutWords'
import AboutBento, { type Tool } from '@/components/v4/AboutBento'
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
 * we'll do it perfectly"). A 200svh section, not pinned, ON PAPER
 * (2026-09-17 — the void, its ground fade and the mosaic reveal all
 * removed at the user's word):
 * three cards of one size — portrait, hairline, name, role; no
 * description, no numbering — placed about the centre line, high left / lower right
 * / lower still near the centre, each riding the scroll at its own
 * rate so they fan apart on the way in and gather on the way out; at
 * the midpoint all three faces are in the frame. AboutPeople.tsx. THE
 * PICTURE it replaces (AboutWho.tsx — the mirrored plates, the
 * ledger, the climbing portraits, the dossiers) is parked,
 * unimported, like the sentence hero.
 *
 * §4 WHAT WE MAKE — THE OPENING (2026-09-16, the user's recording; it
 * replaces WE REFUSE TO DO, removed the same day): a ground — paper
 * since 2026-09-17 — with the title and a circle of the picture; pinned, the circle grows to
 * the viewport and covers the title, then the picture zooms on under
 * a darkening veil while one sentence, in four parts, scrolls up over
 * it; THE WORDS slide over the held picture. AboutOpen.tsx.
 *
 * §5 WHAT WE MAKE — THE WORDS (2026-09-17, the user's frame "image.png":
 * "big editorial and bold words, almost the full width, one below
 * another… no eyebrows, no numbering, no hairlines"): a section on
 * paper, in flow, the cover over the opening's held picture; the four words at
 * display size, one below another; each is done as its row climbs
 * through its own window of the viewport — it swells from the light face to the heavy
 * one and its letters fly one by one from the right edge to the left,
 * then lets go of its ink once the next is at work; the done words pile up on the
 * left, ghosted, the waiting ones queue on the right. NOT pinned,
 * scrubbed by each row's own place in the viewport (user: "continuous
 * scroll" — a clock and a pin were both turned down). AboutWords.tsx.
 *
 * §6 OUR TOOLSET — THE BENTO (2026-09-17, the user's frame "image.png",
 * a dark bento turned to paper: "a white theme bento grid with black
 * gradients… objects that exceed the margins of their card"): six
 * raised paper cards in the frame's grid, each with a soft black wash,
 * a name, one line, and a rendered object hanging past its edge with
 * a shadow. Entrance, a slow ride on the scroll, a lean from the
 * pointer. AboutBento.tsx. The drag track it replaces (AboutTools.tsx,
 * "this very heavy drag section") is parked, unimported, with its hand
 * lens; the objects are PLACEHOLDERS from the homepage's services.
 *
 * §7 HOW IT WENT — THE THREAD (2026-09-17, user: "more impressive…
 * vertical scroll not horizontal… an svg scroll follow lines
 * animation, cool image transitions… not too heavy"; it replaces THE
 * TRAVEL's pinned horizontal track of 09-16): in flow, no pin, the
 * four entries alternating sides a viewport apart; one SVG line drawn
 * by the scroll swings from plate to plate behind them, and each
 * picture opens in a circle from the point the line reaches it; the
 * years are giant numerals over the plates' edges in the difference
 * blend, their digits rising as the entry speaks.
 * AboutTimeline.tsx.
 *
 * §8 THE INVITATION follows in flow and carries the footer out.
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

/** THE WORDS — what we make, in four (user, 2026-09-17), in the
 *  order they take the line */
const WORDS = ['Branding', 'Design', 'Experience', 'Motion'] as const

/** the toolset — the six cards of the bento, in the grid's order (tall
 *  left, wide top right, two squares, wide bottom left, square bottom
 *  right). Lines FIRST DRAFT. The `art` is a PLACEHOLDER from the
 *  homepage's service objects — the user generates the real ones. */
const TOOLS: readonly Tool[] = [
  { name: 'Blender', line: 'Every 3D object on our sites is modelled, lit and rendered here, then brought to the browser as a loop.', art: { src: '/services/seo-art/sphere.webp', width: 900, height: 906 } },
  { name: 'Next.js', line: 'The frame every site is built in: server-rendered, fast, and honest to crawlers.', art: { src: '/services/web-design/main.webp', width: 1200, height: 877 } },
  { name: 'Three.js', line: 'The WebGL layer: the shaders, the fluids and the objects that answer the cursor.', art: { src: '/services/web-design/orb-4.webp', width: 460, height: 513 } },
  { name: 'GSAP', line: 'Every entrance, roll and scrub on the page runs on one clock.', art: { src: '/services/redesign-art/arrow.webp', width: 900, height: 952 } },
  { name: 'Figma', line: 'Where the picture is decided before a line of code: the type, the space, the motion.', art: { src: '/services/one-page-art/mockup.webp', width: 1000, height: 542 } },
  { name: 'After Effects', line: 'The motion is drawn before it is coded; the loops and the reels start here.', art: { src: '/work/device-back.webp', width: 522, height: 546 } },
]

/** the timeline — four years; only the LAST digit changes, so every
 *  year here shares "202". FIRST DRAFT. */
const YEARS = [
  { year: '2021', label: 'The beginning', plate: '/home/bosra-1200.webp', text: 'Konaverse starts as two people and a laptop in Limassol, building sites for the businesses around us.' },
  { year: '2022', label: 'The first 3D site', plate: '/work/cathedral.webp', text: 'The first immersive site ships. Blender enters the pipeline and never leaves it.' },
  { year: '2025', label: 'The studio', plate: '/work/hall.webp', text: 'The practice becomes a studio: a process, a price list, and a team of two that stays two.' },
  { year: '2026', label: 'The redesign', plate: '/work/corridor.webp', text: 'The site you are reading, rebuilt in black and white from the first pixel.' },
]

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
        <style>{`.ab-ent{opacity:1!important;transform:none!important;filter:none!important}.ab-pill{width:var(--ab-pill-rest)!important;margin-left:.22em!important}.ab-band::before{transform:none!important}.ab-op-stage{position:static!important;height:auto!important;padding:8rem 0 0}.ab-op-t{position:static!important;padding:0 var(--ab-pad) 3rem}.ab-op-box{position:relative!important;width:100%!important;height:70svh!important;border-radius:0!important;transform:none!important;contain:none!important}.ab-op-veil{display:none!important}.ab-op-beats{margin-top:0!important;padding:4rem 0 100svh!important}.ab-op-beat{height:auto!important;padding:3rem var(--ab-pad)!important}.ab-op-line{color:var(--text)!important}.ab-op-note{color:var(--text-muted)!important}.ab-ppl-cap,.ab-ppl-pic{opacity:1!important;transform:none!important}.ab-wd-w{opacity:1!important}.ab-bento-card,.ab-bento-obj{opacity:1!important;translate:none!important;transform:none!important}.ab-tools-w{transform:none!important}.ag{height:100svh!important}`}</style>
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

      {/* §5 — WHAT WE MAKE: the words, on their own clock */}
      <AboutWords words={WORDS} />

      {/* §6 — OUR TOOLSET: the bento */}
      <AboutBento tools={TOOLS} />

      {/* §7 — HOW IT WENT: the travel */}
      <AboutTimeline eras={YEARS} />

      {/* §8 — THE INVITATION */}
      <div className="ab-cta">
        <Invitation />
      </div>
    </main>
  )
}
