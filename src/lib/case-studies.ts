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
  /** the laptop render(s): the open one, and the closed one behind it.
   *  Optional: without one the opening shows the cover and the END TITLE
   *  (the name cut by the laptop) is skipped. NO STUDY HAS ONE since
   *  2026-10-02 (owner: "remove the laptop mockups") — the renders stay
   *  in public/work/<slug>/device.webp */
  device?: { front: string; back?: string }
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

const LS = '/work/los-santos-barbers'
const LE = '/work/lumiere-eclat'
const VE = '/work/velricon'

export const CASE_STUDIES: CaseStudy[] = [
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
    next: 'chris-n-clean',
  },
  /* ------------------------------------------------------------------
     CHRIS N CLEAN — the cleaning company's site (FIRST DRAFT,
     2026-10-01). Facts from the live chrisnclean.com. Left out on
     purpose: the client counts (the site gives 15K in three places with
     three meanings) and "licensed, insured" (nothing on the site backs
     it). No SEO chapter: one shared title, no sitemap, no schema. The
     quote is Chris's own line from the site.
     ------------------------------------------------------------------ */
  {
    slug: 'chris-n-clean',
    name: 'Chris N Clean',
    title: 'Chris N Clean — a cleaning company’s website | Case study',
    description:
      'How Konaverse designed and built chrisnclean.com for a Nicosia cleaning company working since 1992: a hero that turns a neglected house spotless under the scroll, four services in two languages, and a quote form on every page.',
    intro: [
      'Chris N Clean is a cleaning company in Nicosia that works across all of Cyprus: windows, carpets, deep cleans and commercial contracts. Chris started on his own in 1992, and the company has grown from one man with a bucket into crews and vans across the island.',
      'Cleaning is a before-and-after business, and almost every cleaning site says so with two photographs side by side. We wanted the site to show it happening.',
    ],
    facts: [
      { label: 'Client', value: 'Chris N Clean Ltd' },
      { label: 'Sector', value: 'Residential & commercial cleaning' },
      { label: 'Year', value: '2026' },
      { label: 'Services', value: 'Web design, development' },
      { label: 'Location', value: 'Nicosia, Cyprus' },
    ],
    live: 'https://www.chrisnclean.com',
    still: { src: '/work/chris-n-clean/01.webp', alt: 'The Chris N Clean homepage — “From chaos to spotless.” over a house on a hillside' },
    sections: [
      {
        id: 'overview',
        title: 'Overview',
        blocks: [
          {
            kind: 'text',
            paragraphs: [
              'Chris N Clean came to us with three decades of work, corporate clients, a fleet of branded vans and a reputation that had spread almost entirely by word of mouth. What it did not have was a site that looked like a company that size, or one that turned a visit into a request for a quote.',
              'The brief was to show the work rather than describe it, lay out four services clearly for homes and for businesses, and put a quote form within reach of every reader, whatever page they landed on.',
            ],
          },
          {
            kind: 'cards',
            items: [
              { title: 'Who they are', body: 'A family cleaning company in Nicosia, working since 1992 across every district of Cyprus, for homes, offices, shops and clinics.' },
              { title: 'What they came with', body: 'Thirty years of work, corporate clients, a Greek-speaking customer base and a website that showed none of it.' },
              { title: 'What they needed', body: 'A site that proves the result before the call, explains four services in plain terms, and collects quote requests.' },
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
              'People do not compare cleaning companies on price first. They compare on trust: will they turn up, will it actually be clean, will they do it again next month. A cleaning site that looks thrown together answers all three questions badly before a word is read.',
              'The second problem was range. The same company cleans a family’s windows and an office block’s carpets, and the two visitors want different things from the same page. The site had to speak to a homeowner and a facilities manager without sounding like two companies.',
            ],
          },
          {
            kind: 'quote',
            text: 'A deep clean isn’t maintenance — it’s a reset. We bring every space back to day one.',
            who: 'Chris',
            role: 'Founder, Chris N Clean',
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
              'The concept is the line on the first screen: from chaos to spotless. The hero opens on a neglected house on a hillside, grimy glass and litter by the road, and as the visitor scrolls it is cleaned in front of them, until the house is spotless and a Chris N Clean van is parked outside.',
              'Everything after it is quiet on purpose: a white page, a light sans with one heavier word in each headline, small mono labels, and full-bleed photographs of the work. The services carry their Greek names beside the English, because that is how the customers say them.',
            ],
          },
          {
            kind: 'cards',
            items: [
              { title: 'The before and after, played', body: 'Not two photographs side by side: one house, cleaned under the scroll, frame by frame.' },
              { title: 'White, like the result', body: 'A clean page with no brand colour of its own; the only colour is in the photographs of the work.' },
              { title: 'Two languages, one line', body: 'Each service is named in English and Greek together, so neither half of the audience is a second thought.' },
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
              'A Next.js site, server-rendered, with GSAP, ScrollTrigger and ScrollSmoother for the motion. Four pages, each ending in a way to ask for a quote, and every form posting to the site’s own endpoint, so requests arrive as messages the company answers within the day.',
            ],
          },
          {
            kind: 'steps',
            items: [
              { title: 'A film you scroll', body: 'The hero is 121 rendered frames drawn onto a canvas, pinned for four screens of scroll and snapped to whole frames, so the house cleans exactly as fast as the visitor reads.' },
              { title: 'A lighter cut for phones', body: 'Phones load their own 73-frame sequence and a shorter pin, so the opening stays smooth on a mobile connection.' },
              { title: 'A quote on every page', body: 'The home, services, about and contact pages each carry a form that asks the questions a quote needs: the service, the space and how soon.' },
              { title: 'Services you can link to', body: 'Each service has its own anchor on the services page, so a facilities manager can be sent straight to commercial and a homeowner to windows.' },
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
              'The hardest piece is the opening. A video would have been simpler, but a video plays at its own speed and the visitor watches. As a sequence of frames bound to the scroll, the cleaning happens as the visitor moves, forwards and backwards, which is the whole promise of the company acted out in one gesture.',
              'The other decision was restraint after it. Once the house is spotless, the page stops performing: the services, the story, the clients and the contact details are set plainly, because a company that cleans for a living should look tidy, not busy.',
            ],
          },
          {
            kind: 'cards',
            items: [
              { title: 'Frames, not a video', body: 'The scroll drives the clean, so it can be played, paused and reversed by the reader.' },
              { title: 'Snapped to whole frames', body: 'The timeline lands only on real frames and the canvas caps its pixel ratio, so the film stays sharp without overloading a phone.' },
              { title: 'One show, then calm', body: 'The motion is spent on the opening; everything after it is laid out to be read and acted on.' },
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
              'The site, designed and built from a blank file, with its scroll film, its four pages and the quote forms wired to the company’s inbox.',
            ],
          },
          {
            kind: 'list',
            items: [
              'Homepage, services, about and contact',
              'The scroll-driven cleaning film, desktop and mobile cuts',
              'Four services with their own anchors, in English and Greek',
              'A milestone timeline from 1992 to today',
              'Quote and contact forms on every page',
              'Hosting on Vercel',
            ],
          },
        ],
      },
    ],
    result: {
      text: 'The site is live and is where the company sends people for a quote. Chris N Clean has not shared enquiry figures for publication, and we do not report numbers we have not been given. What changed is the first impression: a visitor sees the result happen before reading a word, and can ask for a quote from any page.',
    },
    service: { name: 'Web design', slug: 'web-design' },
  },
  /* ------------------------------------------------------------------
     HEIMAT DEVELOPMENT GROUP — the developer's site (FIRST DRAFT,
     2026-10-01). Facts from the live heimat-group.com. The site names no
     people and carries no testimonials, so this study has no quote.
     ------------------------------------------------------------------ */
  {
    slug: 'heimat-group',
    name: 'Heimat Group',
    title: 'HEIMAT Development Group — a developer’s website | Case study',
    description:
      'How Konaverse designed and built heimat-group.com for HEIMAT Development Group in Nicosia: a pinned, layered hero where the house rises out of its own landscape, project pages with floor plans, and structured data for every building.',
    intro: [
      'HEIMAT Development Group builds homes in Nicosia. It is three companies, in development, engineering and construction, joined into one, with more than twenty-five years of experience between them and more than two hundred homes behind them.',
      'A new name with a long record is an odd thing to launch. The website had to introduce the group as one company, and make the record and the houses under construction feel like they belong to it.',
    ],
    facts: [
      { label: 'Client', value: 'HEIMAT Development Group' },
      { label: 'Sector', value: 'Residential development' },
      { label: 'Year', value: '2026' },
      { label: 'Services', value: 'Web design, development, SEO' },
      { label: 'Location', value: 'Nicosia, Cyprus' },
    ],
    live: 'https://www.heimat-group.com',
    still: { src: '/work/heimat-group/01.webp', alt: 'The HEIMAT Development Group homepage — “Building Homes Worth Coming Home To” over a house at dusk' },
    sections: [
      {
        id: 'overview',
        title: 'Overview',
        blocks: [
          {
            kind: 'text',
            paragraphs: [
              'HEIMAT came to us as three companies that had decided to work as one: a developer, an engineering practice and a contractor. Between them, decades of work and hundreds of homes across Cyprus. As HEIMAT, a new name, a new brand, and four projects on the books, from detached houses in Lakatamia and Nicosia to an apartment building in Kaimakli.',
              'The brief was to make the name mean something on first sight, warm and settled rather than corporate, and to give every project a page a buyer could share, with the plans on it.',
            ],
          },
          {
            kind: 'cards',
            items: [
              { title: 'Who they are', body: 'Three companies in development, engineering and construction, joined as one group in Nicosia, from land planning to the final finish.' },
              { title: 'What they came with', body: 'A new name and identity, a long record across the three partners, renders and photography for four projects, and no website.' },
              { title: 'What they needed', body: 'A launch site that says home before it says company, and a page per project with the details a buyer asks for.' },
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
              'Developers in Nicosia sell on renders, and the renders all look alike: a white block, a blue sky, a pool. A buyer comparing them has no reason to remember one over another, and a group with a brand-new name has even less of a head start.',
              'The second problem was the record itself. Twenty-five years and two hundred homes were real, but they belonged to three older companies. The site had to carry that experience over to HEIMAT without hiding that the group is new, and it had to rank as a company people have heard of, starting from zero.',
            ],
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
              'The concept is the name. Heimat is home in German, and the site is set like one: a deep forest green and a warm sand, a heavy upright sans for the headlines and a soft serif for everything you read. It looks less like a developer and more like a place you would want to live.',
              'The hero is pinned. The headline drops in line by line, Building Homes Worth Coming Home To, and then the house rises out of its own landscape behind it. The section after it holds the tagline over a looping film while the logo builds on top.',
            ],
          },
          {
            kind: 'cards',
            items: [
              { title: 'Green and sand', body: 'Forest green and warm sand instead of the white and blue every developer uses: home before construction.' },
              { title: 'A serif you read', body: 'Heavy uppercase for the statements, a light serif for the body and the form, so the long text reads like a letter, not a brochure.' },
              { title: 'The house rises', body: 'Two layers, the landscape and the house cut from it, open in turn under the falling headline.' },
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
              'A Next.js site, every page prerendered and served from the edge cache, with the motion layered on top in GSAP and Lenis: the pinned hero, the line-by-line headline, the clip-path reveals, the transitions between pages and a custom cursor.',
              'Each project opens as a panel over the project list with its own address, so a buyer can send a link to one house, and the panel keeps them inside the portfolio. Inside it, five tabs: general information, characteristics, exterior, interior and the architect’s floor plans.',
            ],
          },
          {
            kind: 'steps',
            items: [
              { title: 'Prerendered, then animated', body: 'Every page is built ahead of time and served from cache; the motion is added on top, so the copy is in the HTML before any of it moves.' },
              { title: 'A project is a link', body: 'Each project panel has its own URL, title and description, so a single house can be shared, bookmarked and found.' },
              { title: 'Plans, not just renders', body: 'The layout tab carries the architect’s floor plans with dimensions, the thing a serious buyer asks for second.' },
              { title: 'One form, guarded', body: 'The contact form posts to the site’s own endpoint, with a honeypot against bots and the phone number optional.' },
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
              'The hardest piece is the opening. The headline falls into place while two image layers open beneath it by clip-path, the full photograph first and then the cut-out house over it, so the building appears to rise out of the ground it stands on. All of it is pinned to the scroll and has to land in the same order at any speed.',
              'The other decision was to let the record speak in numbers and nowhere else. The site does not invent a history for a new group. It says plainly what the three partners bring, twenty-five years and two hundred homes, and lets the projects under way carry the HEIMAT name.',
            ],
          },
          {
            kind: 'cards',
            items: [
              { title: 'Layered, not one picture', body: 'Landscape and house are separate layers with separate reveals, which is what makes the house rise instead of fade in.' },
              { title: 'Modals with addresses', body: 'Project panels open over the list but each is a real page, with its own schema and metadata.' },
              { title: 'The record, stated once', body: 'Four numbers on the about page carry three companies’ history without pretending the name is older than it is.' },
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
              'A new name has no search history, so the site gives search engines everything at once: a title and description for every page, all copy in the server HTML, and structured data that says what the group is and what each project is, down to whether it is a house or an apartment building.',
            ],
          },
          {
            kind: 'list',
            items: [
              'Every page prerendered, all copy in the HTML',
              'A title and description per page and per project',
              'GeneralContractor schema with address and area served',
              'House and ApartmentComplex schema per project',
              'Breadcrumbs on every inner page',
              'Sitemap and robots, generated Open Graph images',
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
              'The launch site for a new group, designed and built from a blank file, with a page for each project and the search groundwork a new name needs.',
            ],
          },
          {
            kind: 'list',
            items: [
              'Homepage, about, projects and contact',
              'Four project pages with tabbed details and floor plans',
              'The pinned, layered hero and the logo film',
              'Page transitions and a custom cursor',
              'Contact form with spam protection',
              'Structured data, metadata, sitemap, hosting',
            ],
          },
        ],
      },
    ],
    result: {
      text: 'The site is live as the group’s first address online, with all four projects on it, two of them still in construction or design. HEIMAT has not shared enquiry or ranking figures for publication, and we do not report numbers we have not been given. What it changed is the first impression: a buyer meets one group, its record and its houses, with the plans a click away.',
    },
    service: { name: 'Web design', slug: 'web-design' },
  },
  /* ------------------------------------------------------------------
     TDK DESIGN & BUILD — the studio's site + its CMS (FIRST DRAFT,
     2026-10-01). Facts from the repo (TDK_Design_&_Build/tdkdb) and the
     live tdkdb.vercel.app. No SEO chapter: the live site still ships the
     default title and an empty sitemap, so we claim none. The quote is
     Theodora's own line from the site, not an invented one.
     ------------------------------------------------------------------ */
  {
    slug: 'tdk',
    name: 'TDK Design & Build',
    title: 'TDK Design & Build — a residential studio’s website | Case study',
    description:
      'How Konaverse designed and built the website for TDK Design & Build, a family design-and-build studio in Nicosia: an editorial site with a pinned project reel, a building that stands in front of its own name, and a CMS the studio runs itself.',
    intro: [
      'TDK Design & Build is a family studio in Nicosia that draws residences and then builds them. The architect who designs a building is on the same team as the people who put it up and hand over the keys.',
      'That is the whole pitch, and it is rare in Cyprus, where design and construction are usually two contracts and two sets of excuses. The website had to say it in one look, and then sell the flats.',
    ],
    facts: [
      { label: 'Client', value: 'TDK Design & Build' },
      { label: 'Sector', value: 'Residential design & construction' },
      { label: 'Year', value: '2026' },
      { label: 'Services', value: 'Web design, development, CMS' },
      { label: 'Location', value: 'Nicosia, Cyprus' },
    ],
    live: 'https://tdkdb.vercel.app/en',
    still: { src: '/work/tdk/01.webp', alt: 'The TDK Design & Build homepage — the building standing in front of the letters TDK' },
    sections: [
      {
        id: 'overview',
        title: 'Overview',
        blocks: [
          {
            kind: 'text',
            paragraphs: [
              'TDK came to us with buildings, not with a brand online. Two apartment buildings delivered, a third under construction in Strovolos, modular homes, a complex in Limassol, and an architect and a site manager who run the whole thing as a family.',
              'The brief had two jobs in it. The first was to make one idea obvious, that the same people draw and build. The second was commercial: Almond Suites, eight residences under construction, needed a page that shows what is still available and takes a buyer’s interest without a phone call.',
            ],
          },
          {
            kind: 'cards',
            items: [
              { title: 'Who they are', body: 'A family design-and-build studio in Nicosia: an architect, a site manager, one team from the first sketch to the last fitting.' },
              { title: 'What they came with', body: 'Six projects across Nicosia and Limassol, renders and site photography, and no website that showed any of it.' },
              { title: 'What they needed', body: 'A site that says design and build in one look, a project archive, and a sales page for the flats still on offer.' },
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
              'A buyer looking at a new apartment in Nicosia is comparing developers, and most developers look the same online: a render, a floor plan PDF, a phone number. The difference TDK offers, that the architect stays on the project until handover, does not show in a render. It had to be told, and told quickly.',
              'The second problem was keeping the site true. Units sell, buildings finish, new projects start. A site the studio cannot update itself is out of date the month after launch, and an out-of-date availability table is worse than none.',
            ],
          },
          {
            kind: 'quote',
            text: 'A home is not a beautiful object. It is a space that makes daily life feel better.',
            who: 'Theodora Kyprianou',
            role: 'Architect, TDK Design & Build',
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
              'The concept is the building in front of the name. The hero sets the letters TDK across the street, and the studio’s own building stands in front of them, its roof slab crossing the D. It is the brief in one picture: the name and the thing they build, in the same frame.',
              'Below it the page is white and editorial, set in a light geometric sans with a monospaced voice for the labels and the numbers, and one teal accent. The projects come as a pinned reel, one building at a time, then the team and the materials, then three short beats that end on the line the studio is built on.',
            ],
          },
          {
            kind: 'cards',
            items: [
              { title: 'The building in front', body: 'Two aligned plates, the street and the building cut from its sky, with the letters between them, so the roof reads in front of the name.' },
              { title: 'One building at a time', body: 'The project reel is pinned: each building gets the whole screen, its name pulls into focus, and the index keeps count.' },
              { title: 'Numbers you can trust', body: 'Units, sizes and availability are set in the mono face and count up when they arrive, like a schedule rather than a brochure.' },
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
              'A Next.js site with a Sanity studio built into it. Projects, units, team members, site images and settings are all content the studio edits itself, and a webhook rebuilds the affected pages the moment they publish, so the availability table is never older than the last change.',
              'The motion runs on GSAP and Lenis: the hero’s wipes and letter slides, the pinned reel, the scrubbed beats, the count-ups. Interest in a unit goes through a form that emails the studio, sends the buyer a reply and files the enquiry as a lead in the same CMS.',
            ],
          },
          {
            kind: 'steps',
            items: [
              { title: 'The CMS inside the site', body: 'Sanity Studio lives at its own route on the same deployment. Projects, units, team and images are documents the studio edits, with no developer in between.' },
              { title: 'Publish, and it is live', body: 'A webhook revalidates exactly the pages a change touches, so a sold unit is shown as sold within seconds of being marked.' },
              { title: 'Interest, filed as a lead', body: 'Register interest validates the form, emails the studio, answers the buyer and writes a lead into the CMS, so no enquiry lives only in an inbox.' },
              { title: 'Two forms, guarded', body: 'Both forms are validated on the server, carry a honeypot and are rate-limited, because a contact form on a property site is a spam target from day one.' },
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
              'The hardest piece is the hero. The letters have to sit behind the building at every screen width, and a building does not scale the way type does. The letters are sized in container units against the same box as the photographs, so the roofline lands on the D on a phone and on a wide monitor alike.',
              'The second is the way a project opens. Click a building in the archive and its photograph lifts off the page, grows to fill the screen, and becomes the hero of the project page underneath it. The route changes only once the picture is in place, so the visitor never sees a page load, only the building getting closer.',
            ],
          },
          {
            kind: 'cards',
            items: [
              { title: 'Locked to the roofline', body: 'Container-unit type against the photographs’ own box keeps the building in front of the name at any width.' },
              { title: 'The picture carries over', body: 'A shared-element transition keeps the clicked photograph on screen across the route change, so a project opens without a cut.' },
              { title: 'One function per scene', body: 'The pinned reel is driven by a single render function of the scroll that never reads layout, which is why it stays smooth on a phone.' },
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
              'The site, designed and built from a blank file, with its CMS, its forms and its project pages, handed over to a studio that now runs it without us.',
            ],
          },
          {
            kind: 'list',
            items: [
              'Homepage, about, projects archive and contact',
              'A page per project with an availability table',
              'Sanity CMS embedded in the site',
              'Webhook revalidation on publish',
              'Register-interest and contact forms with auto-replies',
              'Shared-element transition into every project',
            ],
          },
        ],
      },
    ],
    result: {
      text: 'The site is live and the studio runs it: projects, units and availability are edited in the CMS and appear on the page within seconds. We have no sales or enquiry figures from TDK to publish, and we will not invent them. What changed is that a buyer can see what is still available at Almond Suites and register interest in a unit without a phone call.',
    },
    service: { name: 'Web development', slug: 'web-development' },
  },
  /* ------------------------------------------------------------------
     CITY ARCADE — a real-estate concept (FIRST DRAFT, 2026-10-01).
     A STUDIO CONCEPT like Lumière: no such agency exists, the figures
     and the three projects on the live page are part of the fiction, and
     the copy says so. Facts from city-arcade-roan.vercel.app.
     ------------------------------------------------------------------ */
  {
    slug: 'city-arcade',
    name: 'City Arcade',
    title: 'City Arcade — a real-estate website concept | Case study',
    description:
      'How Konaverse built City Arcade: a one-page concept for a modern real-estate agency, where the building rises out of its own photograph and over the name, and the work slides across a pinned title.',
    intro: [
      'City Arcade is a real-estate agency that does not exist. We built its website as a studio piece: one page that shows how a property brand can feel modern and trustworthy at once, without a single stock smile or a search bar wall.',
      'Property sites are the most copied category on the web. This one was made to answer what an agency could look like if it started from the buildings rather than the listings.',
    ],
    facts: [
      { label: 'Client', value: 'Studio concept' },
      { label: 'Sector', value: 'Real estate (fictional)' },
      { label: 'Year', value: '2026' },
      { label: 'Services', value: 'Web design, development' },
      { label: 'Format', value: 'One page' },
    ],
    live: 'https://city-arcade-roan.vercel.app',
    still: { src: '/work/city-arcade/01.webp', alt: 'The City Arcade homepage — the name set large beside a glass building at golden hour' },
    sections: [
      {
        id: 'overview',
        title: 'Overview',
        blocks: [
          {
            kind: 'text',
            paragraphs: [
              'Agencies come to us asking for the same site: a search bar, a grid of listings, a team page, and a promise of trust that every other agency makes in the same words. We wanted a piece to show them before that conversation, so we invented a client and gave it the site we would argue for.',
              'City Arcade is that client: a modern agency for homes, apartments, rentals and investment, with a short line of projects across Europe. The agency, its figures and its projects are fiction. The design, the build and the motion are exactly what we would ship.',
            ],
          },
          {
            kind: 'cards',
            items: [
              { title: 'Who it is', body: 'A fictional modern real-estate agency: homes, apartments, rentals and investment, with digital tools and local knowledge.' },
              { title: 'What we gave it', body: 'One photograph of a glass building, a name, four services and three invented projects to show.' },
              { title: 'What it had to show', body: 'That a property brand can lead with architecture and still read as calm, verified and safe to call.' },
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
              'Real-estate sites compete on inventory and look identical because of it. The listing grid is the product, and the brand is whatever colour the header is. A buyer remembers the house, not the agency, and the agency is the one thing that wants to be remembered.',
              'The brief we set ourselves was to make the agency the first thing you see and the buildings the proof of it, on one page, with nothing a visitor has to learn before they understand who this is.',
            ],
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
              'The concept is the building breaking out of the frame. The name is set huge in two staggered lines beside a rounded photograph of a glass building, and as you scroll the frame opens and the building rises out of its own picture and over the type.',
              'The rest is near-monochrome: paper, ink and carbon, with a single sky blue on the arrows. A grotesque for the display type, a mono for the labels. A statement in two tones, four feature cards beside a grey photograph, and then the work, on carbon, under a title as wide as the screen.',
            ],
          },
          {
            kind: 'cards',
            items: [
              { title: 'Out of the frame', body: 'The full photograph sits in a rounded frame; a cut-out of the building on a taller layer above it rises past the frame’s edge as it opens.' },
              { title: 'One accent', body: 'Ink, paper and carbon, and one sky blue reserved for the arrows, so every direction on the page is the same colour.' },
              { title: 'The work over its title', body: 'A pinned OUR WORK sits behind the projects, which slide across it and dim it as they pass.' },
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
              'A Next.js page, server-rendered, with GSAP and ScrollTrigger for the scrubbed moves, Lenis for the scroll on GSAP’s own clock, and Framer Motion for the cards. Every move checks for reduced motion first, and the page reads complete without any of it.',
            ],
          },
          {
            kind: 'steps',
            items: [
              { title: 'One clock', body: 'The smooth scroll runs on GSAP’s ticker, so the scrubbed hero, the parallax and the pinned title all read the same scroll position on the same frame.' },
              { title: 'The frame opens', body: 'The hero frame is a clip-path scrubbed outward while the heading drifts up, so the building and the name trade places as you scroll.' },
              { title: 'Projects wipe in', body: 'Each project row opens from the bottom by clip-path, its picture settling from a close-up, with a carbon shade and grain scrubbed over it.' },
              { title: 'Motion is optional', body: 'Every animation is gated on the reduced-motion setting; without it the page is the same page, still.' },
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
              'The hardest piece is the hero. One photograph plays two parts: the full picture inside the rounded frame, and a cut-out of the building on a layer three times as tall above it. The frame’s clip-path is scrubbed beyond its own edges while the type moves at another rate, and the two layers have to stay registered at every width, or the building visibly tears from its picture.',
              'The second decision was to keep it to one page. An agency site grows pages by habit. This one says who the agency is, what it offers, and what it has done, in one scroll, and leaves the listings to the product a real agency would plug in behind it.',
            ],
          },
          {
            kind: 'cards',
            items: [
              { title: 'Two layers, one picture', body: 'Photograph and cut-out share one image and one box, so the building rises out of its own picture instead of floating over it.' },
              { title: 'Sticky with an overlap', body: 'The work section slides up over the features and holds its title pinned behind the projects, with no extra scroll spent.' },
              { title: 'One page', body: 'Who, what and proof in a single scroll; the listing engine is the part a real agency brings.' },
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
              'A complete one-page concept, designed and built from a blank file and live for anyone to scroll.',
            ],
          },
          {
            kind: 'list',
            items: [
              'The one-page site, server-rendered',
              'The building-out-of-the-frame hero',
              'Count-up figures and feature cards',
              'The pinned work section with three projects',
              'Reduced-motion fallbacks throughout',
              'Hosting on Vercel',
            ],
          },
        ],
      },
    ],
    result: {
      text: 'City Arcade is a concept, so there are no sales or traffic figures to report and the numbers on its page are part of the fiction. What it does is the job it was built for: it is the site we open when an agency asks what their website could be, and it answers in one scroll.',
    },
    service: { name: 'Web design', slug: 'web-design' },
    next: 'los-santos-barbers',
  },
]

export const getCaseStudy = (slug: string) => CASE_STUDIES.find((c) => c.slug === slug)
