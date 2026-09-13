import type { Metadata } from 'next'
import AboutHero from '@/components/v4/AboutHero'
import AboutWho from '@/components/v4/AboutWho'
import AboutRefuse from '@/components/v4/AboutRefuse'
import AboutTools from '@/components/v4/AboutTools'
import AboutTimeline from '@/components/v4/AboutTimeline'
import ScrollFillText from '@/components/v4/ScrollFillText'
import Invitation from '@/components/v4/Invitation'
import { SITE_URL } from '@/lib/site'
import './about.css'

/**
 * THE ABOUT PAGE — /about (2026-09-11, the user's frame "About Page.png":
 * a hero, a statement, WHO WE ARE, WE REFUSE TO DO). Its job is the one no
 * other page does: the two Person entities the root layout declares
 * (`/#konstantinos`, `/#nabil`) get their faces, their bios and their
 * page here — the E-E-A-T anchor every blog byline points back to. It
 * repeats nothing the homepage owns (process is §7, price is §8).
 *
 * §1 THE HERO — one sentence in three lines, light weight: "designing
 * with / ideas [plate] that / connect". The plate sits INLINE in the
 * second line — the homepage hero's dark-grain pill, the bosra
 * colonnade — and the third line runs on a full-bleed dark band, the
 * one polarity flip on the page, carried by its own seam (the band
 * wipes in from the left as the word rises). On load the lines rise
 * through their masks, then the pill opens after "ideas" as an aperture
 * — the homepage pills' own move — and "that" is carried right by it.
 * AboutHero.tsx.
 *
 * §2 THE STATEMENT — two paragraphs, the studio's aim in the heavier
 * voice and what it does in the light one, filling letter by letter as
 * they climb (the house scroll fill).
 *
 * §3 WHO WE ARE — THE PICTURE. A fixed composition on paper, every
 * length rem (the picture rule): the title in three stepped words, a
 * two of them as MIRRORED BLOCKS — a dark plate bleeding off the page
 * edge with the role written inside it, tilted and cut by the figure;
 * the cutout standing on the plate's bottom edge and rising above it;
 * the bio beside; the name below; the framed portrait on the other
 * side. Konstantinos's plate bleeds LEFT, Nabil's RIGHT.
 *
 * SECOND PASS (2026-09-13, user: the title did not connect to the
 * site, the watermark had to go, the portraits stopped moving, and the
 * section wanted enriching): the title is the site's own voice now — a
 * kicker over "Who we are" in light lowercase at the page pad, its
 * three words still collapsing onto one line at three rates, set in
 * DIFFERENCE so the figure and the climbing portrait cut through it
 * (the work hub's "selected work" grammar). The watermark is gone; in
 * its place THE LEDGER — each plate's two edges carried across the page
 * as hairlines, the person's index at the far end — so the plate reads
 * as a stripe of the page, not a box on it. Each person gained a LINE
 * in their own voice (scroll-fill, the house display grammar) and a
 * DOSSIER of three hairline rows (role, what they own, their tools),
 * both in the free paper under the name. The portraits climb at a
 * constant rate for as long as the section is on screen and develop
 * from mono to colour over the climb. Each block reveals once as it
 * enters (the ledger and the plate draw, the figure rises, the rest
 * resolves). AboutWho.tsx.
 *
 * §4 WE REFUSE TO DO — one dark card (REBUILT 2026-09-11, user: "a big
 * card with nice layout, clean design, premium"): the bosra plate as
 * its ground under a scrim, the heading and a short intro in the left
 * column, the five refusals as hairline rows on the right — the refused
 * thing in the light weight, what we do instead beside it in the muted
 * step. Each row rises as it enters and the refused phrase is STRUCK
 * a beat later. AboutRefuse.tsx.
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
 * sentence, the statement, both names as h3 with the roles, both bios,
 * the five refusals. The drivers are enhancements; the layout is the
 * fallback and the noscript rule lifts the entrance.
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
  'Konaverse is two people in Cyprus — Konstantinos Kyprianou, technical architect, and Nabil Al Jbawi, creative director — designing and building websites with a character of their own.'

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

/** the two of them — the Person entities' visible half. `id` is the
 *  root layout's schema id, so the page's nodes MERGE into the existing
 *  entity instead of duplicating it. */
const PEOPLE = [
  {
    id: 'konstantinos',
    name: 'Konstantinos Kyprianou',
    role: 'Technical Architect & Co-Founder',
    /** the word inside the plate */
    plate: ['the', 'developer'],
    cutout: '/people/konstantinos-cutout.webp',
    portrait: '/people/konstantinos-portrait.webp',
    bio:
      'Konstantinos is the technical architect. He builds the sites: the code, the performance, the integrations, and the part nobody sees that makes the part everybody sees work. Next.js, WebGL, the 3D pipeline, the search work — if it has to load in under a second and move at sixty frames, it goes through him.',
    /** the line in his own voice — FIRST DRAFT, cut from the bio */
    quote: 'If it has to load in under a second and move at sixty frames, it goes through me.',
    /** the dossier — nothing here the bio and the toolset do not already say */
    dossier: [
      ['Role', 'Technical architect'],
      ['Owns', 'The code, the performance, the integrations, the 3D pipeline, the search work'],
      ['Tools', 'Next.js, Three.js, GSAP, Blender'],
    ],
  },
  {
    id: 'nabil',
    name: 'Nabil Al Jbawi',
    role: 'Creative Director & Co-Founder',
    plate: ['the', 'designer'],
    cutout: '/people/nabil-cutout.webp',
    portrait: '/people/nabil-portrait.webp',
    bio:
      'Nabil is the creative director. He decides what a site looks like and how it moves: the layout, the type, the imagery, the motion. He starts from the brand, never from a template, and does not stop until the page has a character someone will remember.',
    quote: 'Start from the brand, never from a template, and do not stop until the page has a character.',
    dossier: [
      ['Role', 'Creative director'],
      ['Owns', 'The layout, the type, the imagery, the motion'],
      ['Tools', 'Figma, After Effects, Blender'],
    ],
  },
] as const

/** the refusals — the section people quote. FIRST DRAFT. */
const REFUSALS = [
  {
    no: 'Templates',
    why: 'Every site starts from your brand and a blank file. A theme is someone else’s decisions.',
  },
  {
    no: 'Stock photography',
    why: 'If the picture is not yours, it does not go on the page. We shoot it, render it or draw it.',
  },
  {
    no: 'Page builders',
    why: 'Hand-written code, server-rendered. It is why the sites load fast and move at sixty frames.',
  },
  {
    no: 'Hero sliders',
    why: 'One idea, said once. A carousel is a decision nobody made.',
  },
  {
    no: 'Lifeless pages',
    why: 'If nothing moves, nothing is remembered. Motion is part of the design, not a plug-in.',
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
        <style>{`.ab-ent,.ab-w,.ab-who-k,.ab-fig,.ab-bio,.ab-name,.ab-port,.ab-plate,.ab-plate-w,.ab-dossier,.ab-ledger-l,.ab-ref-h,.ab-ref-p,.ab-row{opacity:1!important;transform:none!important;filter:none!important;clip-path:none!important}.ab-pill{width:var(--ab-pill-rest)!important;margin-left:.22em!important}.ab-band::before{transform:none!important}.ab-row-what::after{transform:none!important}.ab-person-r .ab-port{top:100rem!important}.ab-tools-vp{overflow-x:auto!important}.ab-tool,.ab-tools-w,.ab-tools-t{opacity:1!important;transform:none!important}.ab-tl-list{position:static!important;width:auto!important;height:auto!important;clip:auto!important;overflow:visible!important;padding:0 var(--ab-pad) 4rem!important}.ab-time{--ab-tl-len:auto}.ab-tl-stage{position:static!important;height:auto!important}`}</style>
      </noscript>

      {/* §1 — THE HERO: the sentence, the plate in its second line, the
          third line on the band */}
      <AboutHero>
        <h1 className="ab-h1">
          <span className="ab-mask">
            <span className="ab-ln ab-ent">designing with</span>
          </span>
          <span className="ab-mask">
            <span className="ab-ln ab-ent">
              ideas
              {/* THE PLATE — decorative, inline, the sentence reads whole
                  without it. Width is the entrance's; --ab-pill-rest is
                  the resting width so CSS alone holds the composition. */}
              <span className="ab-pill" aria-hidden="true">
                <img src="/home/bosra-1200.webp" alt="" draggable={false} />
                <i className="ab-glint" />
              </span>
              that
            </span>
          </span>
          <span className="ab-band">
            <span className="ab-mask">
              <span className="ab-ln ab-ent">connect</span>
            </span>
          </span>
        </h1>
      </AboutHero>

      {/* §2 — THE STATEMENT, two voices */}
      <section className="ab-state" aria-label="What we do">
        <ScrollFillText
          as="p"
          className="ab-aim"
          text="We aim to fill the internet with websites that convey a strong character and personality through it."
        />
        <ScrollFillText
          as="p"
          className="ab-do"
          text="We design websites that provide immersive experiences to the visitors."
        />
      </section>

      {/* §3 — WHO WE ARE: the picture */}
      <AboutWho>
        {/* the head: the house kicker, then the title in the site's light
            lowercase voice — one line in layout; the driver holds the
            words down at three rates until they meet */}
        <p className="ab-who-k">The two behind the work</p>
        <h2 className="ab-who-t">
          <span className="ab-who-m"><span className="ab-w">Who</span></span>
          <span className="ab-who-m"><span className="ab-w">we</span></span>
          <span className="ab-who-m"><span className="ab-w">are</span></span>
        </h2>

        {PEOPLE.map((p, i) => (
          <article key={p.id} className={`ab-person ab-person-${i === 0 ? 'l' : 'r'}`} id={p.id}>
            {/* THE LEDGER: the plate's two edges carried across the page
                as hairlines, the index at the far end */}
            <div className="ab-ledger" aria-hidden="true">
              <i className="ab-ledger-l ab-ledger-l1" />
              <i className="ab-ledger-l ab-ledger-l2" />
              <span className="ab-index">{String(i + 1).padStart(2, '0')}</span>
            </div>
            {/* the plate: dark, bleeding off the page, the role inside it */}
            <div className="ab-plate" aria-hidden="true">
              <span className="ab-plate-w">
                {p.plate[0]}
                <br />
                {p.plate[1]}
              </span>
            </div>
            <img
              className="ab-fig"
              src={p.cutout}
              alt=""
              width={900}
              height={i === 0 ? 1649 : 1686}
              loading={i === 0 ? 'eager' : 'lazy'}
              decoding="async"
              draggable={false}
            />
            <p className="ab-bio">{p.bio}</p>
            <h3 className="ab-name">{p.name}</h3>
            <figure className="ab-port">
              <img
                src={p.portrait}
                alt={p.name}
                width={1000}
                height={1200}
                loading="lazy"
                decoding="async"
                draggable={false}
              />
            </figure>
            {/* THE LINE, in their own voice, filling as it climbs; THE
                DOSSIER, three hairline rows — the role moved here from
                under the name */}
            <ScrollFillText as="p" className="ab-quote" text={p.quote} />
            <dl className="ab-dossier">
              {p.dossier.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
      </AboutWho>

      {/* §4 — WE REFUSE TO DO: the dark card, the glass, the list */}
      <AboutRefuse>
        <img className="ab-ref-bg" src="/home/bosra-2000.webp" alt="" loading="lazy" decoding="async" aria-hidden="true" />
        <div className="ab-ref-l">
          <h2 className="ab-ref-h">
            We refuse
            <br />
            to do
          </h2>
          <p className="ab-ref-p">
            Five things you will not find in a site we build, and what you get instead.
          </p>
        </div>
        <ol className="ab-rows">
          {REFUSALS.map((r, i) => (
            <li key={r.no} className="ab-row" style={{ '--i': i } as React.CSSProperties}>
              <span className="ab-row-no" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <span className="ab-row-what">{r.no}</span>
              <span className="ab-row-why">{r.why}</span>
            </li>
          ))}
        </ol>
      </AboutRefuse>

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
