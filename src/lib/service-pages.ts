/**
 * THE SERVICE PAGES — one record per /services/[slug], six instances, one
 * template (docs/site-architecture.md §2a, decided 2026-09-04).
 *
 * The template's slots are FIXED and this type is the contract: every field
 * here is a slot the page renders in the order search engines and language
 * models read in — the citable content at the top (h1 → direct answer with
 * the from-price and the timeline in the first hundred words → what it is
 * and is not) and the persuasion below it (process → proof → what changes
 * the price → the two CTAs → the up-link and the one link to the sister
 * page). Nothing about layout lives here; services/[slug]/page.tsx is the
 * one reader.
 *
 * `services-data.tsx` beside the components is the HOMEPAGE'S six cards
 * (objects, light angles). Same six slugs, different job; the slug is the
 * join.
 *
 * ALL COPY, PRICES AND TIMELINES ARE PLACEHOLDER (checklist 6.6). The
 * numbers are the /work stub's tiers where a tier existed and a guess where
 * it did not — the user supplies the real ones before any page indexes. The
 * proof projects are the three live sites the homepage already shows; each
 * page will be wired to its own case study once /work/[slug] exists.
 */

export type Fact = {
  /** the number, as it should read: "€2,000", "4–6 weeks", "12 pages" */
  value: string
  /** what the number is: "Starting at", "Typical timeline" */
  label: string
  /** the capsule plate — one of the hero's three inline plates */
  plate: 1 | 2 | 3
}

export type PlateBeat = {
  title: string
  body: string
}

export type ProcessStep = {
  title: string
  give: string
  get: string
  /** as it reads on the card: "2 weeks", "1–2 weeks", "Ongoing" */
  time: string
  /** the step's span on the schedule's week ruler (ServiceProcess) —
   *  a number even where `time` is a range or "Ongoing" */
  weeks: number
}

export type PriceDriver = {
  driver: string
  effect: string
}

export type ServicePage = {
  slug: string
  /** the service's name as the menu says it */
  name: string
  /** the display word(s) of the h1 — set in uppercase by the CSS */
  word: string
  /** completes the primary keyword INSIDE the h1, as a smaller second
   *  line: "Web design" + "in Cyprus" → the h1 reads "Web design in Cyprus" */
  modifier: string
  /** display size of the word, in rem — chosen per instance: the short
   *  names sit on one line in the hero's left column, the long ones
   *  ("One-page websites", "Website redesign") break into a two-line
   *  block on purpose. The picture scales, so one rem value holds at
   *  every desktop width; phones clamp it to the viewport. */
  wordSize: number
  title: string
  description: string
  areaServed: 'Cyprus' | 'Worldwide'
  /** the line under the CTAs — a promise, not a heading */
  tagline: string
  /** THE DIRECT ANSWER. The first paragraph carries what this is, who it is
   *  for, the from-price and the timeline in sentences that survive being
   *  lifted on their own. */
  answer: [string, string]
  facts: [Fact, Fact, Fact]
  fromPrice: number
  plate: {
    image: string
    alt: string
    headline: string
    beats: [PlateBeat, PlateBeat]
    close: string
  }
  process: ProcessStep[]
  proof: {
    name: string
    line: string
    year: string
    href: string
    image: string
    alt: string
  }
  priceDrivers: PriceDriver[]
  /** the CTA block's line */
  invite: string
  /** the sister page — linked ONCE, in the foot (§2a.8). Design ↔ development. */
  sister?: { slug: string; name: string; line: string }
}

/* the stand-in plate for every page until the user's dune master lands:
   Bosra, already graded for the noir direction (see .sv-img in home.css) */
const PLATE = '/home/bosra-2000.webp'

export const SERVICE_PAGES: ServicePage[] = [
  {
    slug: 'web-design',
    name: 'Web Design',
    word: 'Web design',
    modifier: 'in Cyprus',
    wordSize: 7.25,
    title: 'Web Design in Cyprus',
    description:
      'Custom web design for Cyprus businesses — a site designed on a system of type, space and motion, never assembled from a template. From €2,000, four to six weeks.',
    areaServed: 'Cyprus',
    tagline: 'Tailored design according to your brand’s aesthetic',
    answer: [
      'Web design at Konaverse is a custom website designed from your brand outward — layout, type, imagery and motion decided for you, not picked from a theme. It is for Cyprus businesses that have outgrown the template and want a site people remember. Projects start at €2,000 and take four to six weeks from the first call to launch.',
      'We aim to fill the internet with websites that carry a strong character. No more plain and lifeless pages: a personalised structure, layout and motion, so that your website stands out and stays in mind.',
    ],
    facts: [
      { value: '€2,000', label: 'Starting at', plate: 1 },
      { value: '4–6 weeks', label: 'From call to launch', plate: 2 },
      { value: '1 designer', label: 'Start to finish', plate: 3 },
    ],
    fromPrice: 2000,
    plate: {
      image: PLATE,
      alt: 'A dune ridge in black and white — light on one face, shadow on the other',
      headline: 'Design the website you want',
      beats: [
        {
          title: 'What it is',
          body: 'A site designed around your brand: its type, its colour, its pace. Every screen is drawn before it is built, so what you approve is what ships. You are in the room for every decision that shows.',
        },
        {
          title: 'When it is the wrong choice',
          body: 'If you need a page online by Friday, or your brand is still a name and a logo, a custom design will slow you down. A one-page site or a template gets you live; come back when the business has a shape to design around.',
        },
      ],
      close: 'Allow us to show you the possibilities when designing the web',
    },
    process: [
      {
        title: 'Discovery',
        give: 'An hour of your time, your brand files, three sites you admire.',
        get: 'A written brief: audience, pages, tone, what success looks like.',
        time: '1 week',
        weeks: 1,
      },
      {
        title: 'Direction',
        give: 'One round of honest feedback.',
        get: 'Two visual directions for the homepage, presented live.',
        time: '1 week',
        weeks: 1,
      },
      {
        title: 'Design',
        give: 'Final copy and imagery, or the go-ahead for us to source them.',
        get: 'Every page designed at desktop and phone size, with the motion specified.',
        time: '2 weeks',
        weeks: 2,
      },
      {
        title: 'Handover',
        give: 'Sign-off.',
        get: 'The design system, the files, and the build — or a hand-off pack for your developer.',
        time: '1–2 weeks',
        weeks: 1.5,
      },
    ],
    proof: {
      name: 'Dimitris Tzankatian',
      line: 'A videographer’s site that opens like his showreel — every frame with a purpose.',
      year: '2026',
      href: 'https://dtzankatian.com',
      image: '/work/tzankatian.webp',
      alt: 'The Dimitris Tzankatian homepage — a full-bleed film still under a single line of type',
    },
    priceDrivers: [
      { driver: 'Number of distinct page designs', effect: 'Each new layout is designed twice, desktop and phone. Templates within a type (all blog posts, all products) count once.' },
      { driver: 'Motion', effect: 'Entrances and hover states are included. Scroll-driven scenes and 3D are their own line — see 3D websites.' },
      { driver: 'Copy and imagery', effect: 'Supplied by you at no cost; written or sourced by us as an addition.' },
      { driver: 'Build', effect: 'Design only, or design and development in one continuous process — the second is the usual choice and the cheaper total.' },
    ],
    invite: 'Let’s design yours.',
    sister: {
      slug: 'web-development',
      name: 'Web development',
      line: 'The other half — building what gets designed.',
    },
  },

  {
    slug: 'web-development',
    name: 'Web Development',
    word: 'Web development',
    modifier: 'in Cyprus',
    wordSize: 5.6,
    title: 'Web Development in Cyprus',
    description:
      'Web development in Cyprus on Next.js — fast, server-rendered sites with the integrations and CMS your business runs on. From €2,000, four to eight weeks.',
    areaServed: 'Cyprus',
    tagline: 'Built to load fast, rank, and never fight you',
    answer: [
      'Web development at Konaverse is the build of a website on a modern stack — Next.js, server-rendered, deployed on Vercel — with the CMS, forms, bookings and integrations your business needs wired in. It is for Cyprus companies whose site has to perform, not just exist. Builds start at €2,000 and take four to eight weeks depending on the integrations.',
      'Every page ships as real HTML, so search engines and AI assistants read all of it. Core Web Vitals are a delivery requirement, not an afterthought.',
    ],
    facts: [
      { value: '€2,000', label: 'Starting at', plate: 2 },
      { value: '4–8 weeks', label: 'Typical build', plate: 3 },
      { value: '< 2.5 s', label: 'Largest paint, guaranteed', plate: 1 },
    ],
    fromPrice: 2000,
    plate: {
      image: PLATE,
      alt: 'A dune ridge in black and white — light on one face, shadow on the other',
      headline: 'Build the site that keeps up',
      beats: [
        {
          title: 'What it is',
          body: 'A codebase you own, on a stack that is mainstream enough to hire for. Content lives in a CMS you can edit; the parts that must not break are typed and tested.',
        },
        {
          title: 'When it is the wrong choice',
          body: 'If a Shopify theme or a WordPress site already does the job, keep it. Custom development pays off when the site has logic, integrations or traffic that a platform cannot carry.',
        },
      ],
      close: 'Engineering is the part of the site you never see, and always feel',
    },
    process: [
      { title: 'Scope', give: 'The design, or the brief for one, and a list of every system the site talks to.', get: 'A technical plan: stack, integrations, hosting, what is fixed-price and what is not.', time: '1 week' , weeks: 1 },
      { title: 'Build', give: 'Access to the accounts we integrate with.', get: 'A staging site you can click through, updated every few days.', time: '2–5 weeks' , weeks: 4 },
      { title: 'Content and QA', give: 'Final content in the CMS — we train you in an hour.', get: 'Every page tested on real devices, performance measured, accessibility checked.', time: '1 week' , weeks: 1 },
      { title: 'Launch', give: 'DNS access, or your IT contact.', get: 'The site live, monitored, with analytics and search console connected.', time: '2 days' , weeks: 0.4 },
    ],
    proof: {
      name: 'Los Santos Barbershop',
      line: 'Nicosia’s barbershop set in type as sharp as the fades.',
      year: '2025',
      href: 'https://lossantosbarbers.com',
      image: '/work/lossantos.webp',
      alt: 'The Los Santos Barbershop homepage — large type over a dark photograph',
    },
    priceDrivers: [
      { driver: 'Integrations', effect: 'Bookings, payments, CRM, newsletters — each is a fixed line, quoted upfront.' },
      { driver: 'Content model', effect: 'A blog is included. Products, listings or multi-language content are their own model each.' },
      { driver: 'Accounts and roles', effect: 'A public site is the base; logins, dashboards and customer areas are a different class of build.' },
      { driver: 'Migration', effect: 'Moving existing content and redirecting every old URL is priced by the page count.' },
    ],
    invite: 'Let’s build yours.',
    sister: {
      slug: 'web-design',
      name: 'Web design',
      line: 'The other half — designing what gets built.',
    },
  },

  {
    slug: '3d-websites',
    name: '3D Websites',
    word: '3D websites',
    modifier: 'Immersive website design, for brands anywhere',
    wordSize: 7,
    title: '3D and Immersive Website Design',
    description:
      'Immersive, 3D website design — path-traced objects, scroll-driven scenes and WebGL, engineered to read premium on every device. From €4,000, eight to twelve weeks.',
    areaServed: 'Worldwide',
    tagline: 'Presence you feel before you read a word',
    answer: [
      'A 3D website at Konaverse is an immersive site built around real dimension — pre-rendered, path-traced objects and scroll-driven scenes that move with the visitor — for brands that need presence felt rather than described. It is for product, hospitality and technology brands selling to the world. Projects start at €4,000 and take eight to twelve weeks.',
      'The objects are rendered offline and delivered as light video and imagery, so the site stays fast on a phone. WebGL is used where it earns its cost, never for its own sake.',
    ],
    facts: [
      { value: '€4,000', label: 'Starting at', plate: 3 },
      { value: '8–12 weeks', label: 'Concept to launch', plate: 1 },
      { value: '60 fps', label: 'On a mid-range phone', plate: 2 },
    ],
    fromPrice: 4000,
    plate: {
      image: PLATE,
      alt: 'A dune ridge in black and white — light on one face, shadow on the other',
      headline: 'Make the screen a place',
      beats: [
        {
          title: 'What it is',
          body: 'Objects with weight and light, choreographed to the scroll. Concept art first, then a rendered pipeline, then a site that stays under budget on frames and bytes alike.',
        },
        {
          title: 'When it is the wrong choice',
          body: 'If your visitors come to read, book or buy in a hurry, dimension is in their way. And if the brand has no object, no material, no space of its own, there is nothing honest to render.',
        },
      ],
      close: 'The page itself is the proof: everything you are looking at was built this way',
    },
    process: [
      { title: 'Concept', give: 'Brand, product, references, and what the visitor should feel.', get: 'A storyboard of the scroll: every scene, in order, with the object in it.', time: '2 weeks' , weeks: 2 },
      { title: 'Art', give: 'Product files or the go-ahead to model.', get: 'Rendered stills for approval, then the animation passes.', time: '3–4 weeks' , weeks: 3.5 },
      { title: 'Build', give: 'Copy.', get: 'The site with every scene wired to the scroll, measured on real devices.', time: '3–4 weeks' , weeks: 3.5 },
      { title: 'Launch', give: 'Sign-off.', get: 'Live, with a fallback that reads fully with no JavaScript at all.', time: '1 week' , weeks: 1 },
    ],
    proof: {
      name: 'Lumière Éclat',
      line: 'A scroll-driven story of light and steel.',
      year: '2026',
      href: 'https://watchweb.vercel.app',
      image: '/work/lumiere.webp',
      alt: 'The Lumière Éclat homepage — a watch rendered in light and steel',
    },
    priceDrivers: [
      { driver: 'Number of scenes', effect: 'Each scroll-driven scene is storyboarded, rendered and built. Three is a typical site; one is a hero.' },
      { driver: 'Modelling', effect: 'A product with CAD files renders quickly. A product modelled from photographs is its own line.' },
      { driver: 'Live WebGL', effect: 'Pre-rendered is the base. Interactive, real-time 3D adds engineering and testing time.' },
      { driver: 'Pages beyond the story', effect: 'Supporting pages are priced as web design.' },
    ],
    invite: 'Let’s make yours.',
  },

  {
    slug: 'one-page-websites',
    name: 'One-page Websites',
    word: 'One-page websites',
    modifier: 'Landing pages and single-page sites, designed and built',
    wordSize: 5.1,
    title: 'One-page Website Design',
    description:
      'A single-page website designed and built in two to three weeks, from €1,000. One argument, no scroll wasted — for launches, practices and campaigns.',
    areaServed: 'Cyprus',
    tagline: 'One page, one argument, no scroll wasted',
    answer: [
      'A one-page website at Konaverse is a single, long page designed and built to make one argument — who you are, what you offer, how to reach you — for practices, launches and campaigns that do not need a site map. It costs from €1,000 and is live in two to three weeks.',
      'It is the smallest thing we make and it is made the same way as the largest: designed for your brand, built as real HTML, fast on a phone.',
    ],
    facts: [
      { value: '€1,000', label: 'Starting at', plate: 1 },
      { value: '2–3 weeks', label: 'To live', plate: 3 },
      { value: '1 page', label: 'Everything on it', plate: 2 },
    ],
    fromPrice: 1000,
    plate: {
      image: PLATE,
      alt: 'A dune ridge in black and white — light on one face, shadow on the other',
      headline: 'Say the one thing well',
      beats: [
        { title: 'What it is', body: 'Six to eight sections in a fixed order that answers the visitor’s questions as they arrive: what, for whom, proof, price, contact. Designed, not templated.' },
        { title: 'When it is the wrong choice', body: 'If you have more than one audience, or more than one thing to sell, a single page makes everyone scroll past what is not for them. That is a small site, not a long page.' },
      ],
      close: 'Small is a discipline, not a compromise',
    },
    process: [
      { title: 'Brief', give: 'A call, your logo, the text you already have.', get: 'The page’s outline and a quote.', time: '2 days' , weeks: 0.4 },
      { title: 'Design', give: 'One round of feedback.', get: 'The page designed at desktop and phone size.', time: '1 week' , weeks: 1 },
      { title: 'Build and launch', give: 'Final copy, domain access.', get: 'The page live, with analytics and a contact route that works.', time: '1 week' , weeks: 1 },
    ],
    proof: {
      name: 'Los Santos Barbershop',
      line: 'Nicosia’s barbershop set in type as sharp as the fades.',
      year: '2025',
      href: 'https://lossantosbarbers.com',
      image: '/work/lossantos.webp',
      alt: 'The Los Santos Barbershop homepage — large type over a dark photograph',
    },
    priceDrivers: [
      { driver: 'Copywriting', effect: 'Your text is free; ours is a fixed addition.' },
      { driver: 'Bookings or payments', effect: 'A contact form is included; a booking calendar or a checkout is a line each.' },
      { driver: 'Motion', effect: 'Entrances are included; a scroll-driven scene is priced as 3D work.' },
    ],
    invite: 'Let’s make your page.',
  },

  {
    slug: 'website-redesign',
    name: 'Website Redesign',
    word: 'Website redesign',
    modifier: 'For sites the business has outgrown',
    wordSize: 5.4,
    title: 'Website Redesign Services',
    description:
      'Website redesign from €1,500 — keep what works, redesign what does not, and redirect every old URL so rankings survive the move. Four to eight weeks.',
    areaServed: 'Worldwide',
    tagline: 'Keep what works. Redesign what doesn’t.',
    answer: [
      'A website redesign at Konaverse starts with what your current site already does right — its traffic, its content, its rankings — and rebuilds the design and structure around it. It is for businesses whose site has fallen behind the company. Redesigns start at €1,500 and take four to eight weeks, and every old URL is redirected so nothing you rank for is lost.',
      'Before and after is the easiest proof there is. Half of our redesigns begin with an audit you can act on whether or not you hire us.',
    ],
    facts: [
      { value: '€1,500', label: 'Starting at', plate: 2 },
      { value: '4–8 weeks', label: 'Audit to launch', plate: 1 },
      { value: '0 lost', label: 'Old URLs redirected', plate: 3 },
    ],
    fromPrice: 1500,
    plate: {
      image: PLATE,
      alt: 'A dune ridge in black and white — light on one face, shadow on the other',
      headline: 'The site your business deserves now',
      beats: [
        { title: 'What it is', body: 'An audit of what the current site earns — pages that rank, pages that convert, pages nobody visits — then a redesign that keeps the first two and drops the third.' },
        { title: 'When it is the wrong choice', body: 'If the site is two years old and the complaint is the colour, change the colour. A redesign is for structure, content and trust that have drifted from the business.' },
      ],
      close: 'A redesign is a decision about what to keep',
    },
    process: [
      { title: 'Audit', give: 'Analytics and Search Console access.', get: 'A written audit: what to keep, what to cut, what to add.', time: '1 week' , weeks: 1 },
      { title: 'Structure', give: 'Your priorities for the next two years.', get: 'A new site map with every old URL mapped to a new one.', time: '1 week' , weeks: 1 },
      { title: 'Design and build', give: 'Feedback in two rounds.', get: 'The redesigned site on staging, content migrated.', time: '2–5 weeks' , weeks: 4 },
      { title: 'Launch', give: 'A go date.', get: 'Live, redirects in place, rankings monitored for the following month.', time: '1 week' , weeks: 1 },
    ],
    proof: {
      name: 'Dimitris Tzankatian',
      line: 'A videographer’s site that opens like his showreel — every frame with a purpose.',
      year: '2026',
      href: 'https://dtzankatian.com',
      image: '/work/tzankatian.webp',
      alt: 'The Dimitris Tzankatian homepage — a full-bleed film still under a single line of type',
    },
    priceDrivers: [
      { driver: 'Page count', effect: 'The number of pages that survive the audit and need designing.' },
      { driver: 'Content migration', effect: 'Moving fifty posts is an afternoon; moving five hundred products is a project.' },
      { driver: 'Platform change', effect: 'Staying on your platform is cheapest. Moving to a modern stack is priced as development.' },
    ],
    invite: 'Let’s redesign yours.',
  },

  {
    slug: 'seo',
    name: 'SEO',
    word: 'SEO',
    modifier: 'Search and AI visibility for Cyprus businesses',
    wordSize: 7.25,
    title: 'SEO Services in Cyprus',
    description:
      'SEO in Cyprus that starts with the technical foundation — server-rendered pages, structured data, real content — and continues monthly from €500. For Google and for AI search.',
    areaServed: 'Cyprus',
    tagline: 'Be the answer when they ask',
    answer: [
      'SEO at Konaverse is the work of making a Cyprus business visible where people actually search — Google, and increasingly ChatGPT, Perplexity and Gemini — starting with the technical foundation of the site and continuing with content that answers real questions. It is for businesses with a site worth ranking. A foundation audit is €800; ongoing work starts at €500 a month.',
      'We do not sell rankings. We sell the pages, the structure and the citations that earn them, and we report what moved each month.',
    ],
    facts: [
      { value: '€500 / mo', label: 'Ongoing, from', plate: 3 },
      { value: '€800', label: 'Foundation audit', plate: 2 },
      { value: 'Monthly', label: 'Report you can read', plate: 1 },
    ],
    fromPrice: 500,
    plate: {
      image: PLATE,
      alt: 'A dune ridge in black and white — light on one face, shadow on the other',
      headline: 'Show up where it counts',
      beats: [
        { title: 'What it is', body: 'Technical fixes first — rendering, speed, structured data, indexing. Then one strong page a month that answers a question your customers are asking, and the off-site work that gets it cited.' },
        { title: 'When it is the wrong choice', body: 'If the site itself is the problem, SEO polishes a page nobody should land on. Redesign first. And if you need leads this month, that is advertising, not search.' },
      ],
      close: 'Search is a habit your customers already have',
    },
    process: [
      { title: 'Foundation audit', give: 'Search Console and analytics access.', get: 'A prioritised list of technical and content fixes, with the expected effect of each.', time: '2 weeks' , weeks: 2 },
      { title: 'Fixes', give: 'Access to the site, or your developer’s.', get: 'Every technical item done and verified in Search Console.', time: '2–4 weeks' , weeks: 3 },
      { title: 'Monthly', give: 'An hour a month with whoever knows the customers.', get: 'One page written and published, off-site work done, a report in plain language.', time: 'Ongoing' , weeks: 4 },
    ],
    proof: {
      name: 'Konaverse',
      line: 'This site — server-rendered, structured, and measured monthly.',
      year: '2026',
      href: 'https://kona-verse.com',
      image: '/work/lumiere.webp',
      alt: 'The Konaverse homepage',
    },
    priceDrivers: [
      { driver: 'Competition', effect: 'A Nicosia dentist and a Europe-wide SaaS need different amounts of work for the same position.' },
      { driver: 'Content volume', effect: 'One page a month is the base. More pages, more research, more writing.' },
      { driver: 'Site condition', effect: 'A site we built needs no foundation work. One we did not may need a lot.' },
    ],
    invite: 'Let’s get you found.',
  },
]

export const getServicePage = (slug: string) => SERVICE_PAGES.find((s) => s.slug === slug)

export const formatEuro = (n: number) => `€${n.toLocaleString('en-US')}`
