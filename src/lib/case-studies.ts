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
const LS = '/work/los-santos-barbers'
const LE = '/work/lumiere-eclat'
const VE = '/work/velricon'
/** the closed laptop behind the open one — shared by every study */
const BACK = '/work/device-back.webp'

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
    device: { front: `${DT}/device.webp`, back: BACK },
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
  /* ------------------------------------------------------------------
     LOS SANTOS BARBERSHOP — the one-page site (FIRST DRAFT, 2026-09-12)
     ------------------------------------------------------------------ */
  {
    slug: 'los-santos-barbers',
    name: 'Los Santos Barbershop',
    title: 'Los Santos Barbershop — a one-page website that books | Case study',
    description:
      'How Konaverse designed and built lossantosbarbers.com: a one-page site for a Nicosia barbershop that turns a 4.9-star reputation into booked chairs — services with prices, reviews as text, and a booking button that is never more than a scroll away.',
    intro: [
      'Los Santos is a barbershop in Nicosia run by Fahed, a master barber cutting since 2015. Classic cuts, beard sculpting, hot-towel shaves, and a 4.9 rating from the people who sit in his chair.',
      'The shop had a reputation and a full book of walk-ins. What it did not have was a place online that looked as sharp as the fades, said what a cut costs, and let a new client book without a phone call.',
    ],
    facts: [
      { label: 'Client', value: 'Los Santos Barbershop' },
      { label: 'Sector', value: 'Barbershop, Nicosia' },
      { label: 'Year', value: '2025' },
      { label: 'Services', value: 'One-page website, booking' },
      { label: 'Pages', value: 'One' },
    ],
    live: 'https://lossantosbarbers.com',
    still: { src: `${LS}/01.webp`, alt: 'The Los Santos Barbershop homepage — the name set large, the three services listed, a Book Appointment button' },
    device: { front: `${LS}/device.webp`, back: BACK },
    reel: { mp4: `${LS}/reel.mp4`, webm: `${LS}/reel.webm`, poster: `${LS}/poster.webp` },
    sections: [
      {
        id: 'overview',
        title: 'Overview',
        blocks: [
          {
            kind: 'text',
            paragraphs: [
              'A barbershop does not need a website with ten pages. It needs one page that answers the four questions a new client has before they walk in: what do you do, what does it cost, is it any good, and how do I get a slot. Los Santos came to us with a strong Instagram, a Google listing full of five-star reviews, and no site at all.',
              'The brief was a single page that carries the shop’s character, puts the prices on the table, shows the reviews, and makes booking the obvious next step on every screen.',
            ],
          },
          {
            kind: 'cards',
            items: [
              { title: 'Who they are', body: 'A premium barbershop in Nicosia, est. 2023, run by Fahed: precision cuts, beard grooming, hot-towel shaves, for adults and kids.' },
              { title: 'What they came with', body: 'A loyal client base, a 4.9 rating across dozens of Google reviews, a good Instagram, and no website.' },
              { title: 'What they needed', body: 'One page that looks the part, states the prices, shows the proof, and books a chair without a phone call.' },
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
              'The business problem was friction. Someone new to Nicosia searches for a barber, finds the Google listing, likes the reviews, and then has to call or message to find out a price and get an appointment. Some of them do. Most of them pick the shop whose site already told them.',
              'The second problem was positioning. Los Santos charges a fair price for a premium cut, and without a site that looks premium the price reads as expensive rather than as worth it. The type, the photography and the pace of the page had to do that work before a single word of copy did.',
            ],
          },
          {
            kind: 'quote',
            text: 'People kept asking the same three questions in messages: how much, when, where. I wanted the site to answer them so I could cut hair.',
            who: 'Fahed',
            role: 'Master barber, Los Santos Barbershop',
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
              'The concept is the shop itself: black, white, sharp edges, a monospaced voice for the small print like a price list pinned by the mirror. The name is set huge at the top, the three services listed under it like a menu, and one button. Nothing else competes for the first screen.',
              'Below it the page is a sequence of short rooms: services with prices and durations, the products on the shelf sorted by brand, the reviews written out with the names, a parallax gallery of the work, and Fahed himself. Every room ends where a booking button can be reached.',
            ],
          },
          {
            kind: 'images',
            items: [
              { src: `${LS}/01.webp`, alt: 'The opening screen: the name, the three services, Book Appointment', caption: 'The first screen' },
              { src: `${LS}/02.webp`, alt: 'The services with prices and durations', caption: 'The menu, priced' },
            ],
          },
          {
            kind: 'cards',
            items: [
              { title: 'A price list, not a brochure', body: 'Every service has a price and a duration on the page. It is the most-read part of the site and it was designed as such.' },
              { title: 'Reviews as text', body: 'The Google reviews are on the page as sentences with names, not as a star widget. A crawler reads them, a person believes them.' },
              { title: 'One button, everywhere', body: 'Book Appointment is the only call to action, and it recurs at the end of every section.' },
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
              'A Next.js single page, rendered on the server, with the motion layered on top: the gallery’s parallax, the section entrances, the counters. The whole site is one route, which is exactly right for a business with one location and one thing to say.',
            ],
          },
          {
            kind: 'steps',
            items: [
              { title: 'One route, many rooms', body: 'The page is built as a sequence of sections with their own anchors, so the menu, the reviews and the booking link are all deep-linkable from Instagram and Google.' },
              { title: 'Booking, straight through', body: 'The booking button opens the shop’s scheduling flow directly. No form of our own in between, no email that has to be answered.' },
              { title: 'The parallax gallery', body: 'The portfolio scrolls at a different rate from the page, driven off the scroll position, transform-only, so it stays smooth on a phone.' },
              { title: 'Light on the phone', body: 'Most clients open the site on a phone from Instagram. The stills are served per breakpoint and the page is under a second to first paint on a mid-range device.' },
            ],
          },
          {
            kind: 'images',
            items: [
              { src: `${LS}/04.webp`, alt: 'The reviews section, written out with names', caption: 'The reviews, written out' },
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
              'The hardest call was what to leave out. A first draft had an about page, a gallery page and a contact page. Each one was a place for a visitor to get lost between the price and the booking button. The final site is one page, and the booking button appears in every section, so the distance from any sentence to a booked chair is one scroll.',
              'The second decision was to write the prices in. Many barbers keep prices off the site to avoid comparison. Los Santos is not the cheapest in Nicosia and the page says what a cut costs anyway, because a client who books knowing the price shows up.',
            ],
          },
          {
            kind: 'cards',
            items: [
              { title: 'One page, on purpose', body: 'Every extra page was a place to lose someone between the price and the button.' },
              { title: 'Prices on the page', body: 'A client who books knowing the price shows up. The comparison risk was worth it.' },
              { title: 'The barber on the page', body: 'Fahed’s section — since 2015, the languages he speaks, what he specialises in — is the trust the reviews point at.' },
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
              'A one-page site ranks on one thing, so it was pointed at one thing: barbershop in Nicosia. The title, the heading, the description and the structured data all say it. The reviews are on the page as text with their rating and count, which is what lets a search engine show the stars next to the listing.',
            ],
          },
          {
            kind: 'list',
            items: [
              'One primary term: barbershop Nicosia',
              'Server-rendered page, all copy in the HTML',
              'Structured data for the business, the services and the reviews',
              'Reviews and ratings as text on the page',
              'Section anchors that Google and Instagram can deep-link',
              'Stills sized per breakpoint',
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
              'One page, designed and built from a blank file, wired to the shop’s booking flow, hosted and handed over.',
            ],
          },
          {
            kind: 'list',
            items: [
              'The one-page site with seven sections',
              'Services and products with prices',
              'Reviews section fed from Google',
              'Parallax portfolio gallery',
              'Booking button wired to the scheduling flow',
              'Structured data, metadata, hosting',
            ],
          },
        ],
      },
    ],
    result: {
      text: 'The site went live in 2025 and is the address on the shop’s Google listing and Instagram. We do not have booking numbers from Fahed to publish, and we will not invent them. What changed is measurable on the page itself: a new client now sees the price, the reviews and the button on one screen, and books without a message.',
    },
    service: { name: 'One-page websites', slug: 'one-page-websites' },
    next: 'lumiere-eclat',
  },

  /* ------------------------------------------------------------------
     LUMIÈRE ÉCLAT — the 3D scroll story (FIRST DRAFT, 2026-09-12).
     A studio concept: Lumière is a fictional maison, built to show
     what an immersive product story can do. The copy says so.
     ------------------------------------------------------------------ */
  {
    slug: 'lumiere-eclat',
    name: 'Lumière Éclat',
    title: 'Lumière Éclat — a 3D scroll-driven watch story | Case study',
    description:
      'How Konaverse built Lumière Éclat: a scroll-driven 3D website for a fictional watchmaker, where one watch turns in light as the story scrolls — built as a working demonstration of what an immersive product site can do.',
    intro: [
      'Lumière is a watchmaker that does not exist. Éclat is its one watch. We built the site as a studio piece: a scroll-driven story of light and steel, with the watch itself rendered in three dimensions and turning under the reader’s scroll.',
      'It exists to answer the question every prospective client asks about 3D websites — what does it actually feel like — with a site they can scroll rather than a sentence they have to believe.',
    ],
    facts: [
      { label: 'Client', value: 'Studio concept' },
      { label: 'Sector', value: 'Haute horlogerie (fictional)' },
      { label: 'Year', value: '2026' },
      { label: 'Services', value: '3D website, art direction' },
      { label: 'Format', value: 'One scroll, five chapters' },
    ],
    live: 'https://watchweb.vercel.app',
    still: { src: `${LE}/01.webp`, alt: 'The Lumière Éclat opening: “Time, held — in a single point of light”' },
    device: { front: `${LE}/device.webp`, back: BACK },
    reel: { mp4: `${LE}/reel.mp4`, webm: `${LE}/reel.webm`, poster: `${LE}/poster.webp` },
    sections: [
      {
        id: 'overview',
        title: 'Overview',
        blocks: [
          {
            kind: 'text',
            paragraphs: [
              'Every conversation about a 3D website ends at the same place: the client wants to see one. Not a showreel, not someone else’s site, but a page they can scroll on their own laptop and feel the thing move. We did not have one to show, so we built one.',
              'Lumière Éclat is a luxury watch that we invented so the site could be about a single object. One product, one story, five chapters, and the object present in every one of them: turning, catching light, changing scale as the reader moves.',
            ],
          },
          {
            kind: 'cards',
            items: [
              { title: 'What it is', body: 'A single-page, scroll-driven 3D product story for a fictional Geneva watchmaker.' },
              { title: 'Why it exists', body: 'To let a prospective client scroll an immersive site instead of imagining one.' },
              { title: 'What it proves', body: 'That a 3D object can carry a whole page and still load fast, read well and scroll smoothly.' },
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
              'The business problem was ours. Immersive sites are the work we most want to do and the hardest to sell, because the value is in the feel and the feel cannot be described. A deck of screenshots undersells it. A video of someone else’s site raises the wrong question. The only proof that works is a site of our own.',
              'The design problem underneath it is the one every 3D site has: the object has to be the reason for the page without becoming a toy. It has to move because the story moves, not because it can.',
            ],
          },
          {
            kind: 'quote',
            text: 'A 3D site is easy to make impressive for five seconds. The work is making it still feel right at the fifth chapter.',
            who: 'Konaverse',
            role: 'Studio note, during the build',
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
              'The concept is the tagline: time, held, in a single point of light. The page is dark. The watch is the only lit thing on it. Type is set thin and small and stays out of the object’s way; the copy is written like a maison’s, in French and English, and part of it is deliberately rendered as a stream of digits, the way a movement ticks.',
              'Five chapters. The measure of light. Weight, and the absence of it. The collection, where the story turns and the scroll runs east for a while. The atelier. Then the end, or the beginning again. Each chapter changes the watch’s angle, its scale and its light, and the reader drives all of it.',
            ],
          },
          {
            kind: 'images',
            items: [
              { src: `${LE}/01.webp`, alt: 'The opening chapter: the watch and the line “Time, held”', caption: 'Chapter one' },
              { src: `${LE}/03.webp`, alt: 'The marquee chapter: a panther holding the watch, “Precision forged in light” running across', caption: 'Precision forged in light' },
            ],
          },
          {
            kind: 'cards',
            items: [
              { title: 'One lit object', body: 'The page is dark and the watch is the light source. Nothing else on the page is allowed to glow.' },
              { title: 'The scroll is the story', body: 'Every turn, every change of scale is tied to the reader’s scroll. Nothing plays on its own.' },
              { title: 'A turn east', body: 'The collection chapter runs horizontally — same grid, same rules, a different direction — so the page has a second act.' },
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
              'Next.js with a WebGL scene for the watch, every chapter’s copy rendered on the server, and one scroll driver that owns the whole page: the object’s pose, the light, the chapter transitions and the horizontal run are all functions of one scroll position.',
            ],
          },
          {
            kind: 'steps',
            items: [
              { title: 'The object', body: 'The watch is a real-time model with a physically based material, lit by an environment that the scroll rotates. The bracelet’s eleven rows are geometry, not a texture, so they catch the light as they turn.' },
              { title: 'One scroll, everything', body: 'A single scroll position drives the camera, the object’s rotation, the light rig and the chapter copy. There are no independent animations to fall out of sync.' },
              { title: 'The horizontal act', body: 'The collection chapter pins the viewport and translates the story sideways off the same scroll, then hands back to the vertical page without a seam.' },
              { title: 'Kept fast', body: 'The scene is capped to what the device can draw, the model is compressed, and the page is readable before the scene is ready. Reduced motion gets the chapters as stills.' },
            ],
          },
          {
            kind: 'images',
            items: [
              { src: `${LE}/05.webp`, alt: 'The crown in close-up under the line “Poids et Lumière”', caption: 'Weight, and light' },
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
              'The hardest call was restraint. A 3D scene invites a hundred things: particles, reflections, a cursor that moves the object. Every one of them was tried and cut. The watch turns on the scroll and nothing else, because a product story is about the product and the moment the page performs for its own sake the object stops being the point.',
              'The second decision was to write the copy as a real brand would, in two languages, with a maison’s voice. A demonstration with lorem ipsum demonstrates nothing. The words had to be the kind of words a client would actually need to set on a page like this.',
            ],
          },
          {
            kind: 'cards',
            items: [
              { title: 'Scroll only', body: 'No cursor tricks, no autoplay. The object answers the scroll and nothing else.' },
              { title: 'Real copy', body: 'Written as a maison would write it, in French and English, so the demonstration is honest.' },
              { title: 'Stills for the rest', body: 'A device that cannot draw the scene, or a reader who asks for reduced motion, gets the chapters as stills. The story survives.' },
            ],
          },
        ],
      },
      {
        id: 'performance',
        title: 'Performance',
        blocks: [
          {
            kind: 'text',
            paragraphs: [
              'An immersive site earns its place only if it is not slow, so the budget was set before the scene was built. The copy is in the HTML and paints first; the scene loads behind it and takes over when it is ready. On a phone the scene draws at a lower resolution and fewer frames, and on a device without WebGL it does not draw at all and the page still reads.',
            ],
          },
          {
            kind: 'list',
            items: [
              'Copy server-rendered, readable before the scene',
              'Compressed model, one material, one light rig',
              'Resolution and frame cap per device',
              'Chapters as stills for reduced motion and no WebGL',
              'One scroll driver, transform-only',
              'The horizontal act on the same scroll',
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
              'A complete, deployable 3D product site — and the template we now start from when a client asks for one.',
            ],
          },
          {
            kind: 'list',
            items: [
              'The five-chapter scroll story',
              'The 3D watch, its material and light rig',
              'Bilingual copy, French and English',
              'The horizontal collection chapter',
              'Still fallbacks for every chapter',
              'The scroll driver, reusable',
            ],
          },
        ],
      },
    ],
    result: {
      text: 'There is no client and there are no sales numbers, and this page will not pretend otherwise. Lumière Éclat is a studio piece. Its result is the conversation it starts: it is the page we send when someone asks what a 3D website feels like, and it is the reason the 3D websites service page can point at something real.',
    },
    service: { name: '3D websites', slug: '3d-websites' },
    next: 'velricon',
  },

  /* ------------------------------------------------------------------
     VELRICON — the financial advisory (FIRST DRAFT, 2026-09-12)
     ------------------------------------------------------------------ */
  {
    slug: 'velricon',
    name: 'Velricon',
    title: 'Velricon — a website for senior financial leadership | Case study',
    description:
      'How Konaverse designed and built velricon.com: a corporate site for a Cyprus financial leadership firm — CFO services, bank financing, investor packages — written to be found for the searches business owners type and built to convert a careful reader into a conversation.',
    intro: [
      'Velricon provides senior financial leadership to businesses in Cyprus: the analysis, the reporting, the projections and the conversations with banks, investors and buyers, without the business hiring a full-time CFO.',
      'It is a firm whose product is judgement, and its website had to carry that: composed, precise, quick to understand, and unmistakably senior. Nothing on it could look like a template.',
    ],
    facts: [
      { label: 'Client', value: 'Velricon' },
      { label: 'Sector', value: 'Financial advisory, Cyprus' },
      { label: 'Year', value: '2025' },
      { label: 'Services', value: 'Web design, development, SEO' },
      { label: 'Pages', value: 'Nine' },
    ],
    live: 'https://velricon.com',
    still: { src: `${VE}/01.webp`, alt: 'The Velricon homepage: “Big financial decisions need senior finance behind them.”' },
    device: { front: `${VE}/device.webp`, back: BACK },
    reel: { mp4: `${VE}/reel.mp4`, webm: `${VE}/reel.webm`, poster: `${VE}/poster.webp` },
    sections: [
      {
        id: 'overview',
        title: 'Overview',
        blocks: [
          {
            kind: 'text',
            paragraphs: [
              'Velricon came to us with a clear service and an unclear site. The firm does four things — ongoing financial leadership, bank financing, investor-ready packages, and the financial side of transactions — and does them for owners who are about to make a large decision. The old site described the firm. It did not describe the decision the reader was facing, and so it did not get read.',
              'The brief was a site that speaks to the owner at the moment of the decision, sets out the four services as four doors, and makes the first conversation easy to start.',
            ],
          },
          {
            kind: 'cards',
            items: [
              { title: 'Who they are', body: 'Senior finance for businesses in Cyprus: reporting, forecasting, financing, investor and transaction preparation.' },
              { title: 'What they came with', body: 'A strong practice, referrals by word of mouth, and a site that described the firm rather than the reader’s problem.' },
              { title: 'What they needed', body: 'A site that reads as senior, sorts the work into four services, ranks for what owners search, and starts conversations.' },
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
              'The business problem was trust at a distance. A business owner preparing for a bank loan or an investor round is looking for someone senior, and decides in a minute whether a firm is. The old site made that minute hard: generic language, no structure that matched the decisions people actually face, and a contact path that asked for a form before it had earned one.',
              'The second problem was search. Owners in Cyprus type specific things — CFO services, bank financing preparation, investor package — and none of those searches led to Velricon. The firm grew by referral and had no way to be found by someone who had not been told the name.',
            ],
          },
          {
            kind: 'quote',
            text: 'Our clients come to us at a decisive moment. The site had to meet them there, not introduce us.',
            who: 'Velricon',
            role: 'Founding partner',
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
              'The concept is composure. A restrained palette, generous space, type set with the confidence of a firm that does not need to raise its voice. The homepage opens on one sentence — big financial decisions need senior finance behind them — and the rest of the page earns it: three counters, four services stated as what they do for the owner, and one calm invitation to start a financial conversation.',
              'Each service is a chapter of its own, written for the decision it serves. Bank financing is written for the owner about to walk into a bank. The investor package is written for the owner about to raise. The site does not explain finance; it explains what happens next.',
            ],
          },
          {
            kind: 'images',
            items: [
              { src: `${VE}/01.webp`, alt: 'The homepage opening sentence', caption: 'The opening sentence' },
              { src: `${VE}/03.webp`, alt: 'The four services, each stated as an outcome', caption: 'Four doors' },
            ],
          },
          {
            kind: 'cards',
            items: [
              { title: 'Written for the decision', body: 'Every service page is addressed to the owner at the moment they need it, not to a general reader.' },
              { title: 'Numbers that count up', body: 'Three counters — decisions executed, industries, years — arrive as the page does. Quiet proof, no badges.' },
              { title: 'A conversation, not a form', body: 'The call to action is to start a financial conversation. The form exists, but the language does not lead with it.' },
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
              'A Next.js site with every page rendered on the server and styled with a strict token system, so the composure holds on every page rather than only on the home. The motion is restrained by design: entrances, the counters, a handful of transitions, nothing that competes with reading.',
            ],
          },
          {
            kind: 'steps',
            items: [
              { title: 'Four service pages, one template', body: 'The services share one structure — the decision, what we do, what you get, the invitation — so they read as a set and are easy to extend.' },
              { title: 'Insights', body: 'A writing section built for the firm to publish on the questions its clients ask, each post a page that can rank on its own.' },
              { title: 'The counters', body: 'The three figures count up once, when they enter, and never again. The numbers are in the HTML before any script runs.' },
              { title: 'Built to be maintained', body: 'Copy, services and posts are structured content the firm can edit without touching layout.' },
            ],
          },
          {
            kind: 'images',
            items: [
              { src: `${VE}/05.webp`, alt: 'Further down the homepage', caption: 'Further down the page' },
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
              'The hardest call was tone. Financial sites default to two registers, the corporate and the startup, and Velricon is neither. The type is set light, the sentences are short, and the site never uses a word the owner would have to look up. Seniority is shown by what the site does not do.',
              'The second decision was structure. The four services could have been one page with four headings. They became four pages, each written for its own decision and each able to rank for its own term, because the owner searching for bank financing help does not want to scroll past investor packages to find it.',
            ],
          },
          {
            kind: 'cards',
            items: [
              { title: 'Quiet over loud', body: 'Light type, short sentences, no jargon. The confidence is in the restraint.' },
              { title: 'Four pages, not four headings', body: 'Each service ranks and reads on its own, for its own decision.' },
              { title: 'The sentence first', body: 'The homepage leads with one line about the reader, not a paragraph about the firm.' },
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
              'The keyword work came before the copy. The terms that matter are the ones an owner types at the decisive moment: CFO services Cyprus, financial leadership, bank financing preparation, investor package. The homepage carries the first two; each service page owns its own. Every page is server-rendered, every heading says what the page is for, and the insights section gives the firm a way to keep earning new terms.',
            ],
          },
          {
            kind: 'list',
            items: [
              'Keyword map: one primary term per page',
              'Server-rendered pages, all copy in the HTML',
              'Structured data for the organisation and the services',
              'Titles and descriptions written per page',
              'Insights section for ongoing content',
              'Contact and location data as text',
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
              'A complete corporate site, designed and built from a blank file, with a content structure the firm maintains itself.',
            ],
          },
          {
            kind: 'list',
            items: [
              'Homepage with the opening sentence and the counters',
              'Services hub and four service pages',
              'Who we are',
              'Insights, the writing section',
              'Contact with the conversation form',
              'Structured data, metadata, hosting and analytics',
            ],
          },
        ],
      },
    ],
    result: {
      text: 'The site went live in 2025. Velricon has not shared enquiry or ranking figures for publication, and we do not report numbers we have not been given. What the page can show is the change in kind: the firm is now described by the decisions it serves, each service can be found on its own, and the first step is a conversation rather than a form.',
    },
    service: { name: 'Web design', slug: 'web-design' },
    next: 'dt-zankatian',
  },

]

export const getCaseStudy = (slug: string) => CASE_STUDIES.find((c) => c.slug === slug)
