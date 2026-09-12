/**
 * THE CASE STUDIES — /work/[slug] (2026-09-12, the user's wireframe
 * "Case Study.png").
 *
 * One data shape, one page. The page is an ARTICLE with a pinned index,
 * and docs/site-architecture.md §3 fixes what every article must carry,
 * in this order, so the studies stay comparable and a language model
 * reads the same six things off each:
 *
 *   1  what the client does and what they came with     → `intro` + Overview
 *   2  the problem, as a BUSINESS problem               → The problem
 *   3  what we built                                     → Design / Development / Delivered
 *   4  one technical or craft detail that proves difficulty → Key decisions
 *   5  the result — a number, or the honest sentence     → `result` (REQUIRED)
 *   6  the link to the matching service page             → `service`
 *
 * The sections are free in number and name (the user's index: Overview,
 * Design concept, Development, Key decisions, SEO, What was delivered)
 * but `result` and `service` are required fields, so a study cannot be
 * published without block 5 and block 6. The page renders `result` as
 * the last section of the article.
 *
 * COPY IS A FIRST DRAFT (2026-09-12) — the user confirms every claim
 * about what the client came with and what changed. Nothing here
 * invents a number: where there is none, `result.text` says so.
 *
 * ASSETS live in public/work/<slug>/ — `device` is the user's laptop
 * render (the screen baked in), `reel` the screen recording of the live
 * site under a real wheel (tools: scratchpad capture, ffmpeg), the
 * stills 1900 x 1000 (19:10, the hub card's ratio).
 */

export type CaseBlock =
  | { kind: 'text'; paragraphs: string[] }
  /** three tiles, a title and a line each — the wireframe's "Something" cards */
  | { kind: 'cards'; items: { title: string; body: string }[] }
  | { kind: 'quote'; text: string; who: string; role?: string }
  /** one still is full width; two sit side by side */
  | { kind: 'images'; items: { src: string; alt: string; caption?: string }[] }
  /** numbered rows */
  | { kind: 'steps'; items: { title: string; body: string }[] }
  /** the checklist grid */
  | { kind: 'list'; items: string[] }

export interface CaseSection {
  /** the anchor the index points at */
  id: string
  title: string
  blocks: CaseBlock[]
}

export interface CaseStudy {
  slug: string
  /** the project's name — the h1 */
  name: string
  /** the <title> and the description */
  title: string
  description: string
  /** the two paragraphs under the name (block 1's first half) */
  intro: string[]
  /** the hairline row of facts under the intro */
  facts: { label: string; value: string }[]
  /** the live site, when there is one */
  live?: string
  /** the small still in the hero's corner, and the recording's poster */
  still: { src: string; alt: string }
  /** the laptop render(s): the open one, and the closed one behind it */
  device: { front: string; back?: string }
  /** the screen recording */
  reel?: { mp4: string; webm?: string; poster: string }
  sections: CaseSection[]
  /** BLOCK 5, required: a number with its label, or no number and the
   *  honest sentence. `text` is always rendered. */
  result: { stats?: { value: string; label: string }[]; text: string }
  /** BLOCK 6, required: the service page this project belongs to */
  service: { name: string; slug: string }
  /** the study that follows in the foot; defaults to the roster's next */
  next?: string
}

const DT = '/work/dt-zankatian'

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: 'dt-zankatian',
    name: 'Dimitris Tzankatian',
    title: 'Dimitris Tzankatian — a videographer’s website | Case study',
    description:
      'How Konaverse designed and built dtzankatian.com: a bilingual, film-first website for an Athens videographer and drone operator, with a scroll-driven opening and case studies by discipline.',
    intro: [
      'Dimitris Tzankatian is a luxury videographer and photographer based in Athens. Most of his work is yacht and villa videography and photography, alongside commercials and documentaries for Greek and international brands.',
      'His expertise in drone operations, videography and photography has built a large portfolio of luxurious work, appreciated well beyond Greece. The website had to carry that portfolio the way he does: every frame with a purpose.',
    ],
    facts: [
      { label: 'Client', value: 'Dimitris Tzankatian' },
      { label: 'Sector', value: 'Videography & drone' },
      { label: 'Year', value: '2026' },
      { label: 'Services', value: 'Web design, development, SEO' },
      { label: 'Languages', value: 'English, Greek' },
    ],
    live: 'https://dtzankatian.com',
    still: { src: `${DT}/home.webp`, alt: 'The homepage of dtzankatian.com — “Every Frame Has a Purpose” over a yacht at speed' },
    device: { front: `${DT}/device.webp`, back: `${DT}/device-back.webp` },
    reel: { mp4: `${DT}/reel.mp4`, webm: `${DT}/reel.webm`, poster: `${DT}/poster.webp` },
    sections: [
      {
        id: 'overview',
        title: 'Overview',
        blocks: [
          {
            kind: 'text',
            paragraphs: [
              'Dimitris came to us with a body of work that sold itself in person and on Instagram, and a website that did not. The films were on the reel, the stills were on the feed, and the site was a place people landed and left. Enquiries arrived by message and by word of mouth, which is fine until you want to be found by someone who has never heard your name.',
              'The brief was one line: make the website feel like the work. Five disciplines, two languages, a press record worth showing, and a client list of shipyards, hotels and production companies that expects a certain standard before it picks up the phone.',
            ],
          },
          {
            kind: 'cards',
            items: [
              { title: 'Who he is', body: 'A certified drone operator and cinematographer in Athens, working across yachts, villas, hotels, commercials and television.' },
              { title: 'What he came with', body: 'A showreel, a strong Instagram, a press archive from MEGA TV to Greek City Times, and a site that showed none of it well.' },
              { title: 'What he needed', body: 'A site that opens like a film, sorts the work by discipline, reads in Greek and English, and is found for the searches his clients type.' },
            ],
          },
        ],
      },
      {
        id: 'problem',
        title: 'The problem',
        blocks: [
          {
            kind: 'text',
            paragraphs: [
              'The business problem was not aesthetic. A yacht owner, a hotel group or a production company checking Dimitris out before a call was looking for three things: proof that he had done this exact kind of job before, proof that other people trusted him, and a way to reach him without friction. The old site answered none of them quickly. The work was not sorted, the press was not on it, and the contact path was a form nobody used.',
              'The second problem was language. Half of the clients are Greek and half are not, and a single English site quietly told one half that it was not for them. The third was search: for “videographer Greece” and “drone operator Athens” he was invisible, while his name alone brought people to Instagram rather than to a page he controlled.',
            ],
          },
          {
            kind: 'quote',
            text: 'People would see my work on Instagram, then open the website and wonder if it was the same person.',
            who: 'Dimitris Tzankatian',
            role: 'Videographer & drone operator, Athens',
          },
        ],
      },
      {
        id: 'design',
        title: 'Design concept',
        blocks: [
          {
            kind: 'text',
            paragraphs: [
              'The concept is the tagline: every frame has a purpose. The homepage opens on a full-bleed film and the scroll moves through it frame by frame, so the first thing a visitor does is watch, and the first thing they learn is that the man knows where to put a camera. Type stays thin and quiet so it never competes with the footage. The palette is the footage’s own: sea, hull, sky, and a lot of white space between.',
              'Below the opening, the site behaves like an editorial. Each service is a chapter, the case studies are sorted by the four disciplines his clients think in, and the press archive and Google reviews sit on the page as text, not as logos, because a sentence from MEGA TV is worth more than a badge.',
            ],
          },
          {
            kind: 'images',
            items: [
              { src: `${DT}/home.webp`, alt: 'The homepage opening: “Every Frame Has a Purpose” over a yacht underway', caption: 'The opening frame' },
              { src: `${DT}/about.webp`, alt: 'The about page: “Dimitris Tzankatian, Cinematographer” with a portrait', caption: 'The about page' },
            ],
          },
          {
            kind: 'cards',
            items: [
              { title: 'Film first', body: 'The footage is the hero on every page. Type is set thin and small so the frame is never fighting a headline.' },
              { title: 'Sorted the way clients think', body: 'Yacht & marine, villas & hotels, commercials, TV & documentaries. Four doors, one standard.' },
              { title: 'Proof as text', body: 'Press mentions and reviews are written out and linked, so a reader and a search engine both get the sentence.' },
            ],
          },
        ],
      },
      {
        id: 'development',
        title: 'Development',
        blocks: [
          {
            kind: 'text',
            paragraphs: [
              'The site is a Next.js build with every page rendered on the server, so every word of it exists in the HTML before any script runs. That matters for a portfolio that wants to rank: a crawler that never executes JavaScript still gets the whole page. Animation is layered on top and the page stands without it.',
            ],
          },
          {
            kind: 'steps',
            items: [
              { title: 'The scroll-driven opening', body: 'The hero film is scrubbed by the scroll over roughly eight thousand pixels, so the visitor controls the pace of the first shot. It is a video element driven by scroll position, not an autoplaying loop, and it hands over to the page the moment the last frame lands.' },
              { title: 'Two languages, one site', body: 'English and Greek live under /en and /gr with their own URLs, their own metadata and hreflang links between them, so each language ranks on its own and a Greek visitor never lands on an English page by accident.' },
              { title: 'Case studies by discipline', body: 'A category structure that mirrors the services, so a yacht broker sees yachts and nothing else, and every category is its own indexable page.' },
              { title: 'Fast on a phone', body: 'The films are encoded per breakpoint and the stills are served at the size they are shown. The site was built to be watched on a phone at a marina, on whatever signal is there.' },
            ],
          },
          {
            kind: 'images',
            items: [
              { src: `${DT}/services.webp`, alt: 'The services page: five disciplines listed as chapters', caption: 'Services as chapters' },
            ],
          },
        ],
      },
      {
        id: 'decisions',
        title: 'Key decisions',
        blocks: [
          {
            kind: 'text',
            paragraphs: [
              'The hardest call was the opening. A scroll-driven film is the kind of thing that is easy to make and hard to make feel right: too slow and the visitor is trapped, too fast and it is a slideshow. We tuned the scroll distance against the film’s cut so that a normal flick of the wheel moves through one shot, and a deliberate scroll reads as a shot held. There is a Skip control from the first frame, because a returning client should never have to watch it twice.',
              'The second decision was to keep the type thin. On a site full of film, a bold sans looks like an advertisement. The whole site uses one weight of one face, which is what keeps it feeling like a reel rather than a brochure.',
            ],
          },
          {
            kind: 'cards',
            items: [
              { title: 'One film, scrolled', body: 'The opening is scrubbed, not played. The visitor sets the pace, and a Skip is there from frame one.' },
              { title: 'One face, one weight', body: 'Thin type everywhere, so nothing on the page is louder than the footage.' },
              { title: 'WhatsApp before a form', body: 'The primary contact is the channel his clients already use. The form exists for the ones who want it.' },
            ],
          },
        ],
      },
      {
        id: 'seo',
        title: 'SEO',
        blocks: [
          {
            kind: 'text',
            paragraphs: [
              'The search work was done before the design. The terms that matter are commercial and specific: videographer in Greece, drone operator in Athens, yacht videography, real estate videography. The homepage title carries the first two, each service page owns one, and the Greek pages carry the Greek equivalents rather than a translation of the English.',
              'Structure does the rest. Every page is server-rendered, every image has a written description, the press mentions are linked to their sources, and the reviews are on the page as text with their dates. Nothing on the site depends on a script to be read.',
            ],
          },
          {
            kind: 'list',
            items: [
              'Keyword map per page, in both languages',
              'Server-rendered pages, all copy in the HTML',
              'hreflang between /en and /gr',
              'Structured data for the person, the business and the reviews',
              'Press archive as linked text, not logos',
              'Stills and films sized per breakpoint',
            ],
          },
          {
            kind: 'images',
            items: [
              { src: `${DT}/cases.webp`, alt: 'The case studies page: four disciplines, and the Google reviews as text', caption: 'Case studies, with the reviews written out' },
            ],
          },
        ],
      },
      {
        id: 'delivered',
        title: 'What was delivered',
        blocks: [
          {
            kind: 'text',
            paragraphs: [
              'A complete bilingual website, designed and built from a blank file, hosted and handed over with the source. Dimitris updates the case studies himself.',
            ],
          },
          {
            kind: 'list',
            items: [
              'Homepage with the scroll-driven opening film',
              'About, with the press archive and the showreel',
              'Services hub and six service pages',
              'Case studies hub in four disciplines',
              'Contact page with WhatsApp and a form',
              'Greek and English editions of every page',
              'Cookie consent, privacy, terms',
              'Hosting, domain and analytics set up',
            ],
          },
        ],
      },
    ],
    result: {
      text: 'The site went live in 2026. We do not publish traffic or enquiry numbers we have not been given, and Dimitris has not shared his yet. What we can say is what changed on the page: the work is sorted, the proof is on it, both languages rank on their own URLs, and the first thing a visitor sees is a film.',
    },
    service: { name: 'Web design', slug: 'web-design' },
    next: 'los-santos-barbers',
  },
]

export const getCaseStudy = (slug: string) => CASE_STUDIES.find((c) => c.slug === slug)
