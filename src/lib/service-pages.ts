/**
 * THE SERVICE PAGES — one record per /services/[slug], six instances, one
 * template (docs/site-architecture.md §2a, decided 2026-09-04).
 *
 * The template's slots are FIXED and this type is the contract: every field
 * here is a slot the page renders in the order search engines and language
 * models read in — the citable content at the top (h1 → direct answer with
 * the from-price and the timeline in the first hundred words → what it is
 * and is not) and the persuasion below it (process → the two CTAs → the
 * up-link and the one link to the sister page). LOCKED 2026-09-08: no
 * proof section and no price-driver section on the template. Nothing
 * about layout lives here; services/[slug]/page.tsx is the one reader.
 *
 * `services-data.tsx` beside the components is the HOMEPAGE'S six cards
 * (objects, light angles). Same six slugs, different job; the slug is the
 * join.
 *
 * PRICES ARE THE OWNER'S (confirmed 2026-10-03): one-page from €1,000;
 * web design ON ITS OWN €1,500 and web development ON ITS OWN €1,500
 * (a standard site of five main pages), TOGETHER €2,000 minimum;
 * redesign (design and build) from €2,000; 3D from €4,000; SEO audit
 * €500, then from €300 a month.
 * Timelines are still ours.
 * COPY RULE (owner, same day): written for search, and NO EM DASHES in
 * anything a visitor or a crawler reads (tools/dashes.js checks).
 */

export type Fact = {
  /** the number, as it should read: "€2,000", "4–6 weeks", "12 pages" */
  value: string
  /** what the number is: "Starting at", "Typical timeline" */
  label: string
  /** the capsule plate — one of the old hero's three inline plates
   *  (ServiceStage, parked 2026-09-17; THE RUN draws its facts in code) */
  plate: 1 | 2 | 3
  /** THE CUE (THE RUN, 2026-09-17): the phrase INSIDE `answer`, verbatim,
   *  that carries this number — "four to six weeks" for "4–6 weeks". As
   *  the read-head clears it the agent plucks it and the fact computes.
   *  Optional: a fact with no cue (or one the answer does not contain)
   *  computes on an even beat, no pluck. PLACEHOLDER with the copy. */
  cue?: string
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

export type ServicePage = {
  slug: string
  /** the service's name as the menu says it */
  name: string
  /** the display word(s) of the h1 */
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
  /** THE HERO'S BIG WORD (RunHero, 2026-09-30): one lowercase word set
   *  behind the h1, fitted edge to edge — decoration, aria-hidden.
   *  PLACEHOLDER picks, one verb/noun a service. */
  back: string
  title: string
  description: string
  areaServed: 'Cyprus' | 'Worldwide'
  /** the line under the CTAs — a promise, not a heading */
  tagline: string
  /** THE HUB'S LINE (/services, 2026-09-08): two sentences beside the name
   *  on the index. Written for the hub, never lifted from the page — the
   *  hub must not duplicate its children (site-architecture §2). */
  blurb: string
  /** THE HUB'S PRINT: the plate that comes out of the index's slot for
   *  this service (HubIndex). STAND-INS from the homepage's plate pool
   *  until the user supplies six; `visualPos` is the crop's focus. */
  visual: string
  visualPos?: string
  /** THE DIRECT ANSWER. The first paragraph carries what this is, who it is
   *  for, the from-price and the timeline in sentences that survive being
   *  lifted on their own. */
  answer: [string, string]
  facts: [Fact, Fact, Fact]
  /** THE DECK (THE RUN's answer, 2026-09-17): the three plates the facts
   *  land on, one per fact, in order — the studio's own work on screens
   *  (the About hero's renders), so the picture under a number is the
   *  thing the number buys. Decorative (alt ""): the caption on each
   *  plate is the fact. STAND-INS until a service has renders of its
   *  own; optional — the template falls back to RUN_DECK. */
  deck?: [string, string, string]
  fromPrice: number
  plate: {
    /** THE FIT'S WINDOW (THE RUN, 2026-09-17): one noir plate a service —
     *  the small frame beside "what it is" that grows into the full-bleed
     *  ground of "when it is the wrong choice". STAND-INS out of the
     *  site's pool, chosen for what they say (structure, a lit hall, an
     *  object in space, one line, a city out of the fog, the one lit
     *  tower), shown mono by run.css. The portrait ones are 1024–1122
     *  wide and run ~1.4x at full bleed under the veil — the user
     *  supplies masters before launch. */
    image: string
    alt: string
    headline: string
    beats: [PlateBeat, PlateBeat]
    close: string
  }
  process: ProcessStep[]
  /** the CTA block's line */
  invite: string
  /** the sister page — linked ONCE, in the foot (§2a.8). Design ↔ development. */
  sister?: { slug: string; name: string; line: string }
  /** THE SUBSTANCE (2026-10-02, owner: "we've stripped a lot… there's no
   *  problem solving, problem-focused content"; researched the same day —
   *  Google: no preferred word count, reward first-hand, non-commodity
   *  content; FAQ rich results are gone, so no FAQ). Four sections, each
   *  visual first and in flow (no pin): the fit (what it is / when it is
   *  the wrong choice, from `plate`), the problems it fixes, the work it
   *  produced, what you get. Optional: a page without it keeps the lean
   *  run. FIRST DRAFT copy, written from the case studies. */
  more?: ServiceMore
}

export interface ServiceProblem {
  /** the problem, as a client says it */
  say: string
  /** our answer, first-hand, naming the project that shows it */
  answer: string
  /** the case study that shows the answer */
  study: string
  /** what the picture is: the study's desktop capture, or two phones */
  pictures: string[]
  /** the link's words */
  link: string
}

export interface ServiceMore {
  /** "what it is", shown: a desktop capture and a phone capture */
  kindPictures?: [string, string]
  /** the problems section's title */
  fixTitle: string
  problems: ServiceProblem[]
  /** the work section's title, and each study's line, in order */
  workTitle: string
  work: { slug: string; line: string }[]
  /** what you get: six deliverables; `pictures` makes a card a picture card */
  getsTitle: string
  gets: { title: string; text: string; pictures?: string[] }[]
}

/** the answer's deck when a page names none */
export const RUN_DECK: [string, string, string] = ['/about-hero/02.webp', '/about-hero/06.webp', '/about-hero/01.webp']

export const SERVICE_PAGES: ServicePage[] = [
  {
    slug: 'web-design',
    name: 'Web Design',
    word: 'Web design',
    modifier: 'in Cyprus',
    wordSize: 11.4,
    back: 'design',
    title: 'Web Design in Cyprus',
    description:
      'Custom web design in Cyprus: a website designed around your brand, never assembled from a template. From €1,500 for the design of a five-page site, or €2,000 designed and built.',
    areaServed: 'Cyprus',
    tagline: 'Tailored design according to your brand’s aesthetic',
    blurb:
      'The look, the layout and the motion, designed from your brand outward and never picked from a theme. For businesses that have outgrown the template.',
    visual: '/home/inline-1.webp',
    visualPos: '50% 40%',
    answer: [
      'Web design at Konaverse is a custom website designed from your brand outward: layout, type, imagery and motion decided for you, not picked from a theme. It is for Cyprus businesses that have outgrown the template and want a site people remember. The design of a standard website of five main pages starts at €1,500 and takes four to six weeks. Designed and built by us together, the same website starts at €2,000.',
      'We aim to fill the internet with websites that carry a strong character. No more plain and lifeless pages: a personalised structure, layout and motion, so that your website stands out and stays in mind.',
    ],
    facts: [
      { value: '€1,500', label: 'Design, starting at', plate: 1, cue: '€1,500' },
      { value: '4–6 weeks', label: 'From call to launch', plate: 2, cue: 'four to six weeks' },
      { value: '€2,000', label: 'Designed and built', plate: 3, cue: '€2,000' },
    ],
    deck: ['/about-hero/02.webp', '/about-hero/03.webp', '/about-hero/01.webp'],
    fromPrice: 1500,
    plate: {
      image: '/home/bosra-2000.webp',
      alt: 'Roman columns in black and white, lit from one side against a black sky',
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
        get: 'The design system, the files and the build, or a hand-off pack for your developer.',
        time: '1–2 weeks',
        weeks: 1.5,
      },
    ],
    invite: 'Let’s design yours.',
    sister: {
      slug: 'web-development',
      name: 'Web development',
      line: 'The other half: building what gets designed.',
    },
    more: {
      kindPictures: ['/work/heimat-group/06.webp', '/work/velricon/m-02.webp'],
      fixTitle: 'What a custom design fixes',
      problems: [
        {
          say: 'Our site looks like everyone else’s.',
          answer:
            'Because it probably is everyone else’s: a theme bought by thousands of businesses, with a logo dropped in. We start from your brand instead, its type, its colour, its pace, and draw every page around it. For Chris N Clean that meant showing the house being cleaned as you scroll, not two photographs side by side like every other cleaning site.',
          study: 'chris-n-clean',
          pictures: ['/work/chris-n-clean/01.webp'],
          link: 'Chris N Clean, Nicosia',
        },
        {
          say: 'People leave before they find out what we do.',
          answer:
            'Most sites open on a slider, a slogan and three paragraphs, and the offer sits somewhere under them. We design the first screen to say what you do, who it is for and what to do next, and every section after it has to earn its place. Velricon’s homepage now opens on the decisions the firm helps with, and the first step is a conversation, not a form.',
          study: 'velricon',
          pictures: ['/work/velricon/01.webp'],
          link: 'Velricon, financial advisory',
        },
        {
          say: 'The business has outgrown the website.',
          answer:
            'A site made for the company you were five years ago cannot carry the one you are now: new services, new projects, sometimes a new name. We design around who you are today. HEIMAT was three companies becoming one group, and its site introduces them as one, with all four projects and their plans a click away.',
          study: 'heimat-group',
          pictures: ['/work/heimat-group/01.webp'],
          link: 'HEIMAT Development Group',
        },
        {
          say: 'It looks fine on a laptop and falls apart on a phone.',
          answer:
            'Most visitors arrive on a phone, and most sites are designed for a desktop and squeezed down afterwards. We design every page at both sizes from the first draft, with the motion written for each, so nothing is left for a breakpoint to decide.',
          study: 'city-arcade',
          pictures: ['/work/city-arcade/m-01.webp', '/work/chris-n-clean/m-04.webp'],
          link: 'City Arcade on a phone',
        },
      ],
      workTitle: 'Recent web design work',
      work: [
        { slug: 'velricon', line: 'Senior financial leadership, made to look composed, precise and unmistakably senior.' },
        { slug: 'chris-n-clean', line: 'A cleaning company whose site shows the clean happen before you read a word.' },
        { slug: 'heimat-group', line: 'Three companies introduced as one group, its homes and plans a click away.' },
        { slug: 'city-arcade', line: 'A studio concept: a property brand that starts from the buildings, not the listings.' },
      ],
      getsTitle: 'What you get',
      gets: [
        { title: 'A written brief', text: 'Audience, pages, tone and what success looks like, agreed before anything is drawn.' },
        {
          title: 'Two directions',
          text: 'Two visual directions for the homepage, presented live, so you choose with the real thing in front of you.',
          pictures: ['/work/velricon/02.webp', '/work/heimat-group/03.webp'],
        },
        { title: 'The motion, written down', text: 'How every section enters, scrolls and answers the cursor, specified with the design rather than left to the build.' },
        {
          title: 'Every page, at both sizes',
          text: 'Each page designed at desktop and phone size, so no screen is left for anyone to guess.',
          pictures: ['/work/tdk/01.webp', '/work/tdk/m-01.webp', '/work/heimat-group/m-01.webp'],
        },
        { title: 'A design system', text: 'Type, colour, spacing and components, named and documented, so the next page stays on brand.' },
        { title: 'The files and the build', text: 'The design files, and the site built by us, or a hand-off pack for your own developer.' },
      ],
    },
  },

  {
    slug: 'web-development',
    name: 'Web Development',
    word: 'Web development',
    modifier: 'in Cyprus',
    wordSize: 9.6,
    back: 'build',
    title: 'Web Development in Cyprus',
    description:
      'Web development in Cyprus on Next.js: fast, server-rendered websites with the CMS and integrations your business runs on. From €1,500 for the build, or €2,000 designed and built.',
    areaServed: 'Cyprus',
    tagline: 'Built to load fast, rank, and never fight you',
    blurb:
      'The build behind the design: a modern stack, real HTML on every page, fast on a phone. A site that never fights you.',
    visual: '/home/inline-2.webp',
    visualPos: '50% 55%',
    answer: [
      'Web development at Konaverse is the build of a website on a modern stack (Next.js, server-rendered, deployed on Vercel) with the CMS, forms, bookings and integrations your business needs wired in. It is for Cyprus companies whose site has to perform, not just exist. The build of a standard website of five main pages starts at €1,500 and takes four to eight weeks depending on the integrations. Designed and built by us together, it starts at €2,000.',
      'Every page ships as real HTML, so search engines and AI assistants read all of it. Core Web Vitals are a delivery requirement, not an afterthought.',
    ],
    facts: [
      { value: '€1,500', label: 'Build, starting at', plate: 2, cue: '€1,500' },
      { value: '4–8 weeks', label: 'Typical build', plate: 3, cue: 'four to eight weeks' },
      { value: '< 2.5 s', label: 'Largest paint, guaranteed', plate: 1, cue: 'Core Web Vitals' },
    ],
    deck: ['/about-hero/07.webp', '/about-hero/01.webp', '/about-hero/06.webp'],
    fromPrice: 1500,
    plate: {
      image: '/work/hall.webp',
      alt: 'A vast dark hall, one shaft of light falling on small figures crossing the floor',
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
      { title: 'Content and QA', give: 'Final content in the CMS. We train you in an hour.', get: 'Every page tested on real devices, performance measured, accessibility checked.', time: '1 week' , weeks: 1 },
      { title: 'Launch', give: 'DNS access, or your IT contact.', get: 'The site live, monitored, with analytics and search console connected.', time: '2 days' , weeks: 0.4 },
    ],
    invite: 'Let’s build yours.',
    sister: {
      slug: 'web-design',
      name: 'Web design',
      line: 'The other half: designing what gets built.',
    },
    more: {
      kindPictures: ['/work/tdk/06.webp', '/work/tdk/m-02.webp'],
      fixTitle: 'What a proper build fixes',
      problems: [
        {
          say: 'Every change means calling a developer.',
          answer: 'A site you cannot update yourself is out of date the month after launch. For TDK we built the editor into the site: projects, units, team and images are content the studio edits, and publishing rebuilds exactly the pages that changed, so a sold unit shows as sold within seconds. The studio now runs the site without us.',
          study: 'tdk',
          pictures: ['/work/tdk/02.webp'],
          link: 'TDK Design & Build',
        },
        {
          say: 'Our enquiries vanish into an inbox.',
          answer: 'A contact form that only sends an email is where leads go to die. On Chris N Clean every page carries a quote form that asks what a quote needs, the service, the space and how soon, and posts to the site’s own endpoint, so each request arrives as a message the company answers the same day.',
          study: 'chris-n-clean',
          pictures: ['/work/chris-n-clean/08.webp'],
          link: 'Chris N Clean, Nicosia',
        },
        {
          say: 'Search engines can’t see half of our site.',
          answer: 'Content that only appears once a script runs is content many crawlers never read. HEIMAT’s pages are all built ahead of time and served from cache, with the motion added on top, so every word is in the HTML first. Each project opens in a panel that is also a real page, with its own address, title and structured data, so one house can be shared and found.',
          study: 'heimat-group',
          pictures: ['/work/heimat-group/06.webp'],
          link: 'HEIMAT Development Group',
        },
        {
          say: 'It crawls on a phone.',
          answer: 'A build has to be measured on the phone in a visitor’s hand, not on the developer’s laptop. Chris N Clean’s opening film is 121 frames on a desktop and its own lighter cut of 73 frames on a phone, with a shorter scroll, so it stays smooth on a mobile connection. Every page is tested on real devices before launch.',
          study: 'chris-n-clean',
          pictures: ['/work/chris-n-clean/m-01.webp', '/work/tdk/m-01.webp'],
          link: 'Chris N Clean on a phone',
        },
      ],
      workTitle: 'Recent development work',
      work: [
        {
          slug: 'tdk',
          line: 'An editor built into the site: the studio publishes, and a sold unit shows as sold within seconds.',
        },
        {
          slug: 'heimat-group',
          line: 'Every page prerendered, every project its own address and structured data, the motion layered on top.',
        },
        {
          slug: 'chris-n-clean',
          line: 'A scroll-bound film with a lighter cut for phones, and a quote form on every page.',
        },
        {
          slug: 'velricon',
          line: 'Server-rendered pages on a strict token system, with content the firm edits itself.',
        },
      ],
      getsTitle: 'What you get',
      gets: [
        {
          title: 'A technical plan',
          text: 'The stack, the integrations and the hosting, and what is fixed-price and what is not, before a line is written.',
        },
        {
          title: 'A staging site',
          text: 'A working copy you can click through from the first week, updated every few days.',
          pictures: ['/work/heimat-group/01.webp', '/work/tdk/03.webp'],
        },
        {
          title: 'A CMS you can edit',
          text: 'Pages, projects and posts as content you change yourself, with no developer in between.',
        },
        {
          title: 'Tested on real devices',
          text: 'Every page checked on real phones and desktops, its speed measured and its accessibility verified.',
          pictures: ['/work/chris-n-clean/04.webp', '/work/chris-n-clean/m-05.webp', '/work/tdk/m-04.webp'],
        },
        {
          title: 'Forms that land',
          text: 'Quotes, bookings and enquiries wired to where your business actually answers them.',
        },
        {
          title: 'A codebase you own',
          text: 'Live and monitored, with analytics and Search Console connected, and the code handed to you.',
        },
      ],
    },
  },

  {
    slug: '3d-websites',
    name: '3D Websites',
    word: '3D websites',
    modifier: 'Immersive website design, for brands anywhere',
    wordSize: 10.6,
    back: 'depth',
    title: '3D and Immersive Website Design',
    description:
      'Immersive website design and 3D websites: rendered objects, scroll-driven scenes and WebGL, built to stay fast on every device. From €4,000, live in eight to twelve weeks.',
    areaServed: 'Worldwide',
    tagline: 'Presence you feel before you read a word',
    blurb:
      'Real dimension on the page: pre-rendered objects and scroll-driven scenes, delivered light enough to stay fast. The top of what we make.',
    visual: '/home/inline-3.webp',
    visualPos: '50% 50%',
    answer: [
      'A 3D website at Konaverse is an immersive website built around real dimension: pre-rendered, path-traced objects and scroll-driven scenes that move with the visitor. It is for product, hospitality and technology brands that need their presence felt rather than described, wherever they sell. Projects start at €4,000 and take eight to twelve weeks.',
      'The objects are rendered offline and delivered as light video and imagery, so the site stays fast on a phone. WebGL is used where it earns its cost, never for its own sake.',
    ],
    facts: [
      { value: '€4,000', label: 'Starting at', plate: 3, cue: '€4,000' },
      { value: '8–12 weeks', label: 'Concept to launch', plate: 1, cue: 'eight to twelve weeks' },
      { value: '60 fps', label: 'On a mid-range phone', plate: 2, cue: 'fast on a phone' },
    ],
    deck: ['/about-hero/06.webp', '/about-hero/07.webp', '/about-hero/02.webp'],
    fromPrice: 4000,
    plate: {
      image: '/work/orb.webp',
      alt: 'A dark sphere hanging over a lit glass floor, figures walking beneath it',
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
    invite: 'Let’s make yours.',
    more: {
      kindPictures: ['/work/lumiere-eclat/02.webp', '/work/lumiere-eclat/m-03.webp'],
      fixTitle: 'What a 3D site fixes',
      problems: [
        {
          say: 'Our product looks flat in a photograph.',
          answer: 'A photograph shows one angle under one light. For Lumière Éclat the watch is a modelled object with a real material, lit by an environment the scroll turns, and the eleven rows of its bracelet are geometry rather than a picture, so they catch the light as they move. The visitor turns the product by reading.',
          study: 'lumiere-eclat',
          pictures: ['/work/lumiere-eclat/04.webp'],
          link: 'Lumière Éclat',
        },
        {
          say: 'Every site in our category looks the same.',
          answer: 'Cleaning sites all show two photographs side by side, before and after. Chris N Clean’s opens on a house drawn from 121 rendered frames bound to the scroll, so the clean happens as you move, forwards and backwards. The promise of the company is acted out before a word is read.',
          study: 'chris-n-clean',
          pictures: ['/work/chris-n-clean/01.webp'],
          link: 'Chris N Clean, Nicosia',
        },
        {
          say: 'Immersive sites feel like a gimmick.',
          answer: 'They do when the page performs for its own sake. On Lumière Éclat particles, reflections and a cursor that moves the object were all tried and all cut. The watch turns with the scroll and nothing else, because the moment the scene shows off, the product stops being the point.',
          study: 'lumiere-eclat',
          pictures: ['/work/lumiere-eclat/03.webp'],
          link: 'Lumière Éclat, the restraint',
        },
        {
          say: 'It has to work on a phone too.',
          answer: 'Dimension is no use if it stutters. The scene is capped to what the device can draw, phones get their own lighter cuts, and a device that cannot draw it, or a reader who asks for less motion, gets rendered stills that tell the same story.',
          study: 'lumiere-eclat',
          pictures: ['/work/lumiere-eclat/m-01.webp', '/work/chris-n-clean/m-02.webp'],
          link: 'Lumière Éclat on a phone',
        },
      ],
      workTitle: 'Recent 3D and motion work',
      work: [
        {
          slug: 'lumiere-eclat',
          line: 'A studio piece: a watch that turns with the scroll, written in a maison’s voice, in two languages.',
        },
        {
          slug: 'chris-n-clean',
          line: 'A house cleaned in 121 rendered frames, bound to the reader’s scroll.',
        },
      ],
      getsTitle: 'What you get',
      gets: [
        {
          title: 'A storyboard of the scroll',
          text: 'Every scene in order, with the object in it, approved before anything is rendered.',
        },
        {
          title: 'Rendered stills first',
          text: 'The object, modelled and lit, shown as stills for approval before the animation passes.',
          pictures: ['/work/lumiere-eclat/01.webp', '/work/lumiere-eclat/05.webp'],
        },
        {
          title: 'One scroll, one clock',
          text: 'The camera, the object and the copy all driven by one scroll position, so nothing falls out of step.',
        },
        {
          title: 'Every scene, on every screen',
          text: 'Each scene wired to the scroll and measured on real devices, with lighter cuts for phones.',
          pictures: ['/work/lumiere-eclat/03.webp', '/work/lumiere-eclat/m-02.webp', '/work/lumiere-eclat/m-04.webp'],
        },
        {
          title: 'A budget on frames and bytes',
          text: 'The scene is held to what a phone can draw, so the dimension never costs the visitor their patience.',
        },
        {
          title: 'A fallback that still reads',
          text: 'Stills and full copy for reduced motion and for anyone without JavaScript.',
        },
      ],
    },
  },

  {
    slug: 'one-page-websites',
    name: 'One-page Websites',
    word: 'One-page websites',
    modifier: 'Landing pages and single-page sites, designed and built',
    wordSize: 9.2,
    back: 'focus',
    title: 'One-page Website Design',
    description:
      'One-page website design from €1,000, designed and built in two to three weeks. A single page that makes one argument, for launches, practices and campaigns.',
    areaServed: 'Cyprus',
    tagline: 'One page, one argument, no scroll wasted',
    blurb:
      'One long page making one argument: who you are, what you offer, how to reach you. The smallest thing we make, made the same way as the largest.',
    visual: '/home/bosra-1200.webp',
    visualPos: '50% 35%',
    answer: [
      'A one-page website at Konaverse is a single, long page designed and built to make one argument: who you are, what you offer and how to reach you. It is for practices, launches and campaigns that do not need a site map. It costs from €1,000 and is live in two to three weeks.',
      'It is the smallest thing we make and it is made the same way as the largest: designed for your brand, built as real HTML, fast on a phone.',
    ],
    facts: [
      { value: '€1,000', label: 'Starting at', plate: 1, cue: '€1,000' },
      { value: '2–3 weeks', label: 'To live', plate: 3, cue: 'two to three weeks' },
      { value: '1 page', label: 'Everything on it', plate: 2, cue: 'a single, long page' },
    ],
    deck: ['/about-hero/03.webp', '/about-hero/02.webp', '/about-hero/07.webp'],
    fromPrice: 1000,
    plate: {
      image: '/home/inline-2.webp',
      alt: 'A single line of light along a dark horizon',
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
    invite: 'Let’s make your page.',
    more: {
      kindPictures: ['/work/city-arcade/02.webp', '/work/los-santos-barbers/m-02.webp'],
      fixTitle: 'What one good page fixes',
      problems: [
        {
          say: 'People have to call us to ask the price.',
          answer: 'Many barbers keep prices off their site to avoid the comparison. Los Santos is not the cheapest in Nicosia, and its page says what a cut costs anyway, because a client who books knowing the price is a client who turns up.',
          study: 'los-santos-barbers',
          pictures: ['/work/los-santos-barbers/02.webp'],
          link: 'Los Santos Barbershop',
        },
        {
          say: 'Visitors get lost before they book.',
          answer: 'The first draft for Los Santos had an about page, a gallery page and a contact page, and each one was a place to lose someone between the price and the button. The final site is one page with the booking button in every section, so the distance from any sentence to a booked chair is one scroll.',
          study: 'los-santos-barbers',
          pictures: ['/work/los-santos-barbers/06.webp'],
          link: 'Los Santos, the booking path',
        },
        {
          say: 'We want to look premium, not expensive.',
          answer: 'A fair price for a premium cut reads as expensive on a page that does not look premium. On Los Santos the type, the photography and the pace of the page do that work before the copy does, so the price reads as worth it.',
          study: 'los-santos-barbers',
          pictures: ['/work/los-santos-barbers/01.webp'],
          link: 'Los Santos Barbershop',
        },
        {
          say: 'Our clients find us on Instagram, on a phone.',
          answer: 'So the page is designed for the phone first. Every section has its own anchor, so the menu, the reviews and the booking link can be linked straight from Instagram or Google, and the pictures are sized for each screen.',
          study: 'los-santos-barbers',
          pictures: ['/work/los-santos-barbers/m-01.webp', '/work/los-santos-barbers/m-03.webp'],
          link: 'Los Santos on a phone',
        },
      ],
      workTitle: 'Recent one-page work',
      work: [
        {
          slug: 'los-santos-barbers',
          line: 'A barbershop page that puts the price, the reviews and the booking button on one screen.',
        },
        {
          slug: 'city-arcade',
          line: 'One scroll that says who an agency is, what it offers and what it has done.',
        },
      ],
      getsTitle: 'What you get',
      gets: [
        {
          title: 'The outline and a quote',
          text: 'The page’s sections in order, and a fixed price, within two days.',
        },
        {
          title: 'One argument, in order',
          text: 'Six to eight sections that answer the visitor’s questions as they arrive: what, for whom, proof, price, contact.',
          pictures: ['/work/los-santos-barbers/04.webp', '/work/city-arcade/04.webp'],
        },
        {
          title: 'One search term, owned',
          text: 'The title, the heading and the description all pointed at the one thing you want to be found for.',
        },
        {
          title: 'Designed for the phone',
          text: 'The page designed at phone and desktop size, for the visitor who arrives from a social post.',
          pictures: ['/work/los-santos-barbers/05.webp', '/work/los-santos-barbers/m-04.webp', '/work/city-arcade/m-02.webp'],
        },
        {
          title: 'A contact route that works',
          text: 'Booking, call or message, wired straight through, with nothing in between.',
        },
        {
          title: 'Live in weeks',
          text: 'Built, hosted and live in two to three weeks, with analytics connected.',
        },
      ],
    },
  },

  {
    slug: 'website-redesign',
    name: 'Website Redesign',
    word: 'Website redesign',
    modifier: 'For sites the business has outgrown',
    wordSize: 9.6,
    back: 'renew',
    title: 'Website Redesign Services',
    description:
      'Website redesign services from €2,000. We keep what works, redesign what does not, and redirect every old URL so your rankings survive the move. Four to eight weeks.',
    areaServed: 'Worldwide',
    tagline: 'Keep what works. Redesign what doesn’t.',
    blurb:
      'Keep what your site already does right (its traffic, its content, its rankings) and rebuild the rest around it.',
    visual: '/home/inline-1.webp',
    visualPos: '80% 60%',
    answer: [
      'A website redesign at Konaverse starts with what your current site already does right (its traffic, its content, its rankings) and rebuilds the design and structure around it. It is for businesses whose site has fallen behind the company. A redesign is a new design and build, so it is priced as one and starts at €2,000 and takes four to eight weeks, and every old URL is redirected so nothing you rank for is lost.',
      'Before and after is the easiest proof there is. Half of our redesigns begin with an audit you can act on whether or not you hire us.',
    ],
    facts: [
      { value: '€2,000', label: 'Starting at', plate: 2, cue: '€2,000' },
      { value: '4–8 weeks', label: 'Audit to launch', plate: 1, cue: 'four to eight weeks' },
      { value: '0 lost', label: 'Old URLs redirected', plate: 3, cue: 'every old URL is redirected' },
    ],
    deck: ['/about-hero/01.webp', '/about-hero/02.webp', '/about-hero/03.webp'],
    fromPrice: 2000,
    plate: {
      image: '/work/fog.webp',
      alt: 'Towers rising out of fog over a city, in black and white',
      headline: 'The site your business deserves now',
      beats: [
        { title: 'What it is', body: 'An audit of what the current site earns (pages that rank, pages that convert, pages nobody visits), then a redesign that keeps the first two and drops the third.' },
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
    invite: 'Let’s redesign yours.',
    more: {
      kindPictures: ['/work/velricon/03.webp', '/work/velricon/m-05.webp'],
      fixTitle: 'What a redesign fixes',
      problems: [
        {
          say: 'Our site still describes the company we used to be.',
          answer: 'Velricon’s old site spoke in generic language, with no structure that matched the decisions its clients actually face. The redesign rebuilt it around those decisions: four services became four pages, each written for the owner facing that choice.',
          study: 'velricon',
          pictures: ['/work/velricon/02.webp'],
          link: 'Velricon, financial advisory',
        },
        {
          say: 'We’re afraid of losing what we already rank for.',
          answer: 'A redesign starts with what the current site earns: the pages that rank, the pages that convert, the pages nobody visits. We keep the first two, map every old address to a new one, redirect them all, and watch the rankings for a month after launch.',
          study: 'velricon',
          pictures: ['/work/velricon/06.webp'],
          link: 'Velricon, the structure',
        },
        {
          say: 'Nobody finds us unless they already know our name.',
          answer: 'Velricon grew by referral. Owners searched for CFO services, bank financing preparation and investor packages, and none of those searches led to the firm. The keyword work came before the copy, so each new service page now owns its own term.',
          study: 'velricon',
          pictures: ['/work/velricon/05.webp'],
          link: 'Velricon, the search work',
        },
        {
          say: 'It asks for a form before it has earned one.',
          answer: 'The old contact path asked visitors to fill in a form before the site had given them a reason to. Velricon’s homepage now leads with one line about the reader, and the first step it offers is a conversation.',
          study: 'velricon',
          pictures: ['/work/velricon/m-01.webp', '/work/velricon/m-06.webp'],
          link: 'Velricon on a phone',
        },
      ],
      workTitle: 'A recent redesign',
      work: [
        {
          slug: 'velricon',
          line: 'Generic language and a form-first contact path, rebuilt around the decisions owners actually face.',
        },
      ],
      getsTitle: 'What you get',
      gets: [
        {
          title: 'A written audit',
          text: 'What the current site earns and what it does not: what to keep, what to cut, what to add.',
        },
        {
          title: 'A new site map',
          text: 'The new structure, with every old address mapped to its new one before anything is designed.',
          pictures: ['/work/velricon/04.webp', '/work/velricon/07.webp'],
        },
        {
          title: 'Content carried over',
          text: 'The pages worth keeping migrated, rewritten where they had drifted from the business.',
        },
        {
          title: 'The redesign, both sizes',
          text: 'Every page redesigned at desktop and phone size, on a staging site you can click through.',
          pictures: ['/work/velricon/01.webp', '/work/velricon/m-02.webp', '/work/velricon/m-04.webp'],
        },
        {
          title: 'Redirects in place',
          text: 'Every old URL redirected on launch day, so nothing you rank for is lost.',
        },
        {
          title: 'A month of watching',
          text: 'Rankings and traffic monitored for the month after launch, with anything that slips fixed.',
        },
      ],
    },
  },

  {
    slug: 'seo',
    name: 'SEO',
    word: 'SEO',
    modifier: 'Search and AI visibility for Cyprus businesses',
    wordSize: 15,
    back: 'search',
    title: 'SEO Services in Cyprus',
    description:
      'SEO services in Cyprus that start with the technical foundation (server-rendered pages, structured data, real content) and continue monthly from €300. For Google and for AI search.',
    areaServed: 'Cyprus',
    tagline: 'Be the answer when they ask',
    blurb:
      'Visible where people actually search: Google, and increasingly the AI assistants. The pages, structure and citations that earn the answer.',
    visual: '/home/inline-2.webp',
    visualPos: '30% 50%',
    answer: [
      'SEO at Konaverse is the work of making a Cyprus business visible where people actually search: Google, and increasingly ChatGPT, Perplexity and Gemini. It starts with the technical foundation of the site and continues with content that answers real questions. It is for businesses with a site worth ranking. An SEO audit is €500; ongoing work starts at €300 a month.',
      'We do not sell rankings. We sell the pages, the structure and the citations that earn them, and we report what moved each month.',
    ],
    facts: [
      { value: '€300 / mo', label: 'Ongoing, from', plate: 3, cue: '€300 a month' },
      { value: '€500', label: 'SEO audit', plate: 2, cue: '€500' },
      { value: 'Monthly', label: 'Report you can read', plate: 1, cue: 'each month' },
    ],
    deck: ['/about-hero/06.webp', '/about-hero/03.webp', '/about-hero/07.webp'],
    fromPrice: 300,
    plate: {
      image: '/work/city.webp',
      alt: 'A city at night, one tower lit above all the others',
      headline: 'Show up where it counts',
      beats: [
        { title: 'What it is', body: 'Technical fixes first: rendering, speed, structured data, indexing. Then one strong page a month that answers a question your customers are asking, and the off-site work that gets it cited.' },
        { title: 'When it is the wrong choice', body: 'If the site itself is the problem, SEO polishes a page nobody should land on. Redesign first. And if you need leads this month, that is advertising, not search.' },
      ],
      close: 'Search is a habit your customers already have',
    },
    process: [
      { title: 'SEO audit', give: 'Search Console and analytics access.', get: 'A prioritised list of technical and content fixes, with the expected effect of each.', time: '2 weeks' , weeks: 2 },
      { title: 'Fixes', give: 'Access to the site, or your developer’s.', get: 'Every technical item done and verified in Search Console.', time: '2–4 weeks' , weeks: 3 },
      { title: 'Monthly', give: 'An hour a month with whoever knows the customers.', get: 'One page written and published, off-site work done, a report in plain language.', time: 'Ongoing' , weeks: 4 },
    ],
    invite: 'Let’s get you found.',
    more: {
      kindPictures: ['/work/heimat-group/07.webp', '/work/los-santos-barbers/m-05.webp'],
      fixTitle: 'What search work fixes',
      problems: [
        {
          say: 'Nobody finds us unless they already know our name.',
          answer: 'Velricon grew by referral and could not be found by anyone who had not been told the name. The fix started with the words owners type at the decisive moment, CFO services Cyprus, bank financing preparation, investor package, and gave each its own page.',
          study: 'velricon',
          pictures: ['/work/velricon/03.webp'],
          link: 'Velricon, the keyword map',
        },
        {
          say: 'We’re a new name with no search history.',
          answer: 'A new name starts from zero, so the site has to give search engines everything at once. HEIMAT launched with a title and description for every page and project, all copy in the server HTML, and structured data saying what the group is and what each project is, down to whether it is a house or an apartment building.',
          study: 'heimat-group',
          pictures: ['/work/heimat-group/02.webp'],
          link: 'HEIMAT Development Group',
        },
        {
          say: 'We show up for the wrong searches.',
          answer: 'A page that tries to rank for everything ranks for nothing. Los Santos is one page pointed at one thing, a barbershop in Nicosia, and its title, heading, description and structured data all say the same.',
          study: 'los-santos-barbers',
          pictures: ['/work/los-santos-barbers/01.webp'],
          link: 'Los Santos Barbershop',
        },
        {
          say: 'ChatGPT and Perplexity never mention us.',
          answer: 'Their crawlers do not run JavaScript, so a page whose words appear only after a script runs is blank to them. We make sure every word is in the HTML first, then do the work off the site: the profiles, directories and published lists that answer engines lean on when they name a business.',
          study: 'heimat-group',
          pictures: ['/work/velricon/m-03.webp', '/work/heimat-group/m-02.webp'],
          link: 'HEIMAT, every word in the HTML',
        },
      ],
      workTitle: 'Recent search work',
      work: [
        {
          slug: 'velricon',
          line: 'A keyword map before the copy: one primary term per page, and an insights section to keep earning more.',
        },
        {
          slug: 'heimat-group',
          line: 'A new name given everything at once: per-page titles, server HTML and structured data for every project.',
        },
        {
          slug: 'los-santos-barbers',
          line: 'A one-page site pointed at one search: barbershop in Nicosia.',
        },
      ],
      getsTitle: 'What you get',
      gets: [
        {
          title: 'An SEO audit',
          text: 'A prioritised list of technical and content fixes, with the expected effect of each.',
        },
        {
          title: 'Fixes, verified',
          text: 'Rendering, speed, structured data and indexing fixed and checked in Search Console.',
          pictures: ['/work/heimat-group/04.webp', '/work/velricon/06.webp'],
        },
        {
          title: 'A keyword map',
          text: 'One primary term per page, chosen from what your customers actually type.',
        },
        {
          title: 'A page a month',
          text: 'One strong page answering a question your customers ask, written and published every month.',
          pictures: ['/work/velricon/08.webp', '/work/heimat-group/m-04.webp', '/work/los-santos-barbers/m-06.webp'],
        },
        {
          title: 'Off-site work',
          text: 'Profiles, directories and the published lists that search and answer engines cite.',
        },
        {
          title: 'A plain report',
          text: 'What moved, what did not and what happens next, in plain language, every month.',
        },
      ],
    },
  },
]

export const getServicePage = (slug: string) => SERVICE_PAGES.find((s) => s.slug === slug)

export const formatEuro = (n: number) => `€${n.toLocaleString('en-US')}`

