import { AUTHOR_BIO, NABIL_BIO } from '@/lib/site'

/**
 * THE BLOG — one record per /blog/[slug] (docs/blog-plan-2026.md; opened
 * 2026-10-03, owner: "I want the blog built, with two articles posted…
 * SEO on point, structured data, schema, indexable posts, internal
 * linking").
 *
 * THE RULES OF EVERY PIECE (the plan, §1 and §5):
 *   · nothing that could be written without our own work: our prices, our
 *     timelines, our measurements, our migrations;
 *   · buying-stage questions only, answered in the first two sentences;
 *   · one named author per piece (Konstantinos or Nabil), real dates. `updated` moves only with a real edit
 *     (the sitemap's lastmod reads it);
 *   · EXACTLY ONE link to a service page (`service`), plus the case
 *     studies it cites; the service page links back (service-pages.ts);
 *   · a table wherever the question is a cost or a comparison;
 *   · NO EM DASHES (owner, 2026-10-03; tools/dashes.js checks).
 *
 * THE BODY is data, rendered on the server by blog/[slug]/page.tsx, so
 * every word is in the HTML. Inline marks in a string: `[label](/path)`
 * is a link, `**words**` is strong. Nothing else is parsed.
 *
 * THE MIGRATION PIECE IS ANONYMISED (owner, 2026-10-03): no client name,
 * domain, screenshot or identifying detail. Its numbers come from that
 * project's own record (inventory, redirect map, gate reports). Where the
 * record stops, the piece says so: it publishes no traffic or ranking
 * outcome, because none was recorded.
 */

/** TWO AUTHORS (owner, 2026-10-03, after asking whether one is better
 *  for SEO: it is not; what matters is that each piece names who wrote
 *  it and that person is one consistent entity). `id` is the Person node
 *  in the root layout's graph, which carries the same bio, portrait and
 *  links, so the byline and the entity are one. */
export type AuthorKey = 'konstantinos' | 'nabil'

export const AUTHORS: Record<
  AuthorKey,
  { name: string; role: string; id: string; portrait: string; bio: string; links: { label: string; href: string }[] }
> = {
  konstantinos: {
    name: 'Konstantinos Kyprianou',
    role: 'Technical architect and co-founder, Konaverse',
    id: '#konstantinos',
    portrait: '/people/konstantinos-portrait.webp',
    bio: AUTHOR_BIO,
    links: [
      { label: 'About Konaverse', href: '/about' },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/kon-kyprianou-1011/' },
    ],
  },
  nabil: {
    name: 'Nabil Al Jbawi',
    role: 'Creative director and co-founder, Konaverse',
    id: '#nabil',
    portrait: '/people/nabil-portrait.webp',
    bio: NABIL_BIO,
    links: [
      { label: 'About Konaverse', href: '/about' },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/nabil-al-jbawi-257517291/' },
    ],
  },
}

export type Block =
  | { kind: 'p'; text: string }
  | { kind: 'h2'; id: string; text: string }
  | { kind: 'h3'; text: string }
  | { kind: 'list'; ordered?: boolean; items: string[] }
  | { kind: 'table'; caption: string; head: string[]; rows: string[][] }
  /** a row of large numbers with their labels */
  | { kind: 'stats'; items: { value: string; label: string }[] }
  /** a set-off note: the caveat, the rule, the thing to remember */
  | { kind: 'note'; title: string; text: string }

export interface BlogPost {
  slug: string
  /** the h1 */
  title: string
  /** the <title> (the layout adds "| Konaverse") */
  metaTitle: string
  description: string
  /** the card's two lines, on the index and on the homepage */
  excerpt: string
  /** the card's label: what kind of question this answers */
  topic: string
  /** ISO dates; `updated` only moves with a real edit */
  published: string
  updated: string
  author: AuthorKey
  cover: { src: string; alt: string; width: number; height: number; position?: string }
  /** THE DIRECT ANSWER: the first paragraph, written to survive being
   *  lifted on its own */
  answer: string
  blocks: Block[]
  /** the ONE service page this piece feeds */
  service: { slug: string; label: string; line: string }
  /** the case studies it cites, for the related row and the schema */
  studies: string[]
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'website-cost-cyprus',
    title: 'How much does a website cost in Cyprus in 2026?',
    metaTitle: 'Website Cost in Cyprus (2026): Real Prices and What Moves Them',
    description:
      'What a website costs in Cyprus in 2026, from a studio that publishes its prices: one-page sites from €1,200, five-page websites from €2,500 designed and built, 3D websites from €6,000, and what moves each number.',
    excerpt:
      'Our real prices in one table, what moves each number, and how to compare two quotes that look nothing alike.',
    topic: 'Pricing',
    published: '2026-10-03',
    updated: '2026-10-03',
    author: 'nabil',
    cover: {
      src: '/work/cathedral.webp',
      alt: 'A tall stone interior in black and white, light falling from high windows',
      width: 1122,
      height: 1402,
      position: '50% 40%',
    },
    answer:
      'A professionally designed website in Cyprus costs from €1,200 for a one-page site, from €2,500 for a standard website of five main pages, designed and built, and from €6,000 for a 3D or immersive website. Those are our own starting prices at Konaverse for 2026. The final number depends on how many pages you need, how much of the site is custom motion, and what the site has to connect to.',
    blocks: [
      { kind: 'h2', id: 'prices', text: 'Website prices in Cyprus, in one table' },
      {
        kind: 'p',
        text: 'Most agencies in Cyprus ask you to request a quote before they name a number. We publish ours. These are starting prices, with the time each kind of project takes from the first call to launch.',
      },
      {
        kind: 'table',
        caption: 'Konaverse starting prices and timelines, 2026',
        head: ['Type of website', 'Starting price', 'Timeline', 'Right for'],
        rows: [
          ['One-page website', '€1,200', '2 to 3 weeks', 'A practice, a launch or a campaign with one thing to say'],
          ['Website, designed and built (five main pages)', '€2,500', '4 to 8 weeks', 'A business that has outgrown its template'],
          ['Web design only', '€1,800', '4 to 6 weeks', 'You have a developer and need the design'],
          ['Web development only', '€1,800', '4 to 8 weeks', 'You have a finished design and need it built'],
          ['Website redesign', '€2,500', '4 to 8 weeks', 'An existing site that has fallen behind the company'],
          ['3D or immersive website', '€6,000', '8 to 12 weeks', 'A brand that needs presence, not only information'],
        ],
      },
      {
        kind: 'p',
        text: 'Most clients want both halves, so the number to remember is €2,500: a standard website of five main pages, designed and built by us. Web design and web development are also sold on their own, at €1,800 each, because some clients arrive with one half already done. Some bring a finished design and need it built. Some have a developer and need the design. A redesign is a new design and build, so it is priced as one: the difference is the audit at the start and the redirects at the end.',
      },
      { kind: 'h2', id: 'what-moves-the-price', text: 'What moves the price' },
      {
        kind: 'p',
        text: 'Two quotes for "a website" can differ by a factor of ten and both be honest. These are the things that actually move the number, in the order they usually matter.',
      },
      {
        kind: 'list',
        items: [
          '**The number of pages.** Five main pages is the standard site: home, services, about, work, contact. Every page beyond that has to be designed, written, built and tested at two sizes.',
          '**How much of it moves.** A page that scrolls is cheap. A page whose sections are choreographed to the scroll, or that carries a rendered 3D object, is designed twice: once as a layout and once as a sequence.',
          '**What the site connects to.** Bookings, payments, a CMS your team edits, a CRM, a second language. Each one is a system to integrate and to test.',
          '**Who supplies the content.** Finished copy and photography shorten a project. Writing and sourcing them for you lengthens it.',
          '**Whether an old site has to be moved.** Search rankings live on URLs. Moving them safely is its own piece of work, and we have written up [how we redesign a site without losing its rankings](/blog/redesign-website-without-losing-seo).',
        ],
      },
      { kind: 'h2', id: 'one-page-or-full-site', text: 'Is a €1,200 one-page website enough?' },
      {
        kind: 'p',
        text: 'Often, yes. If your business has one audience and one thing to sell, a single well-ordered page does the job and nothing gets lost between the price and the button. [Los Santos Barbershop](/work/los-santos-barbers) in Nicosia is one page: the services with their prices, the reviews, and a booking button in every section.',
      },
      {
        kind: 'p',
        text: 'A one-page site is the wrong choice when you have more than one audience, or more than one thing to sell. Then every visitor scrolls past what is not for them, and each service has no page of its own to be found by. [Velricon](/work/velricon), a financial advisory firm, needed nine pages, because each of its services is a separate search and a separate decision.',
      },
      { kind: 'h2', id: 'cheap-websites', text: 'What an €800 website leaves out' },
      {
        kind: 'p',
        text: 'When we recorded the Cyprus search results for web design in September 2026, the advertisements at the top quoted prices from €800. Those offers are real, and for some businesses they are the right call. It helps to know what the price usually assumes.',
      },
      {
        kind: 'table',
        caption: 'What a low fixed price usually includes, and what it leaves out',
        head: ['Question to ask', 'Template build', 'Custom build'],
        rows: [
          ['Where does the design come from?', 'A theme, with your logo and colours applied', 'Drawn for your brand, every page'],
          ['Who owns the site?', 'Often the agency’s account or a rented platform', 'You: domain, hosting and code in your name'],
          ['Is it designed for the phone?', 'The desktop layout, squeezed', 'Each page designed at both sizes'],
          ['Can search engines read it?', 'Depends on the theme', 'Every word in the page’s HTML'],
          ['What happens to your old URLs?', 'Usually nothing', 'Mapped and redirected'],
        ],
      },
      {
        kind: 'note',
        title: 'The honest version',
        text: 'If you need a page online by Friday, or the business is still a name and a logo, a template is the right answer and a custom site will slow you down. Come back when the business has a shape to design around.',
      },
      { kind: 'h2', id: 'seo-cost', text: 'What SEO costs in Cyprus' },
      {
        kind: 'p',
        text: 'Search work is priced separately from the site because it does not end at launch. At Konaverse an SEO audit is €500: a prioritised list of technical and content fixes, with the expected effect of each. Ongoing work starts at €300 a month with a three-month minimum, which covers one strong page written and published, the off-site work, and a report in plain language.',
      },
      {
        kind: 'p',
        text: 'SEO is the wrong purchase if the site itself is the problem. It polishes a page nobody should land on. Fix the site first.',
      },
      { kind: 'h2', id: 'running-costs', text: 'What you pay after launch' },
      {
        kind: 'p',
        text: 'A website has running costs after launch: the domain, the hosting, and the maintenance that keeps it secure and working. Our hosting and maintenance plan is €40 a month, or €90 a month for a site with a CMS. It covers keeping the site online, updated, backed up and monitored. The domain is yours and is billed to you by the registrar. Changes you ask for later are quoted when you ask. Ongoing search work is the monthly SEO service above.',
      },
      { kind: 'h2', id: 'compare-quotes', text: 'How to compare two quotes' },
      {
        kind: 'p',
        text: 'Ask every agency the same five questions and the quotes become comparable.',
      },
      {
        kind: 'list',
        ordered: true,
        items: [
          'How many pages are included, and what does one more cost?',
          'Is the design made for us, or is it a theme? Can I see the last three sites you designed from nothing?',
          'Who owns the domain, the hosting account and the code on launch day?',
          'Is every page designed for the phone, or adapted to it?',
          'What happens to the URLs of my current site?',
        ],
      },
      {
        kind: 'p',
        text: 'A quote that answers all five in writing is worth more than a lower one that answers none.',
      },
    ],
    service: {
      slug: 'web-design',
      label: 'Web design in Cyprus',
      line: 'A five-page website designed around your brand: from €1,800 for the design, or €2,500 designed and built.',
    },
    studies: ['los-santos-barbers', 'velricon'],
  },

  {
    slug: 'redesign-website-without-losing-seo',
    title: 'How to redesign a website without losing SEO: what moving 172 URLs taught us',
    metaTitle: 'Redesign a Website Without Losing SEO: A 172-URL Migration',
    description:
      'How to redesign or migrate a website without losing its rankings, from a real migration of 172 URLs off Squarespace: the inventory, the redirect map, the automated checks and what they caught.',
    excerpt:
      'A real migration off Squarespace, with its numbers: the inventory, the redirect map, the automated gate, and what it caught before launch.',
    topic: 'Redesign and SEO',
    published: '2026-10-03',
    updated: '2026-10-03',
    author: 'konstantinos',
    cover: {
      src: '/work/fog.webp',
      alt: 'Towers rising out of fog over a city, in black and white',
      width: 1122,
      height: 1402,
      position: '50% 30%',
    },
    answer:
      'You redesign a website without losing SEO by treating every existing URL as an asset: list them all, keep the paths that can stay, redirect each one that changes with a single permanent redirect, and carry the titles, descriptions and headings across unchanged. Then you check all of it by machine before the domain moves. This is how we did it for a site of 172 pages in two languages, and what the checks caught.',
    blocks: [
      { kind: 'h2', id: 'the-project', text: 'The project' },
      {
        kind: 'p',
        text: 'In 2026 we moved a bilingual photography and film studio off Squarespace onto a custom Next.js site. The client is not named here at their request, so there are no screenshots. The numbers are from the project’s own records.',
      },
      {
        kind: 'stats',
        items: [
          { value: '172', label: 'live pages, in two languages' },
          { value: '224', label: 'URLs Google knew about' },
          { value: '57', label: 'permanent redirects at launch' },
          { value: '176 / 176', label: 'rows passed the launch check' },
        ],
      },
      { kind: 'h2', id: 'inventory', text: '1. List every URL, then ask Google what it knows' },
      {
        kind: 'p',
        text: 'A crawl of the old site found 172 live pages, 86 in each language, all returning a normal response. That list felt complete. It was not.',
      },
      {
        kind: 'p',
        text: 'Search Console knew 224 URLs for the same domain. The 52 extras were addresses the site had never linked to, or no longer did, and Google still held every one of them.',
      },
      {
        kind: 'table',
        caption: 'The 52 URLs Search Console knew that the crawl did not find',
        head: ['What they were', 'How many', 'What we did'],
        rows: [
          ['Parameter and system addresses', 'About 25', 'Left alone, on purpose'],
          ['Targets of older redirects', 'About 14', 'Redirected to the live page'],
          ['Category addresses the platform generated', '8', 'Redirected to the clean category page'],
          ['Duplicates and phantoms', '4', 'Redirected or dropped'],
          ['A real page missing from the list', '1', 'Added to the inventory'],
        ],
      },
      {
        kind: 'note',
        title: 'The lesson',
        text: 'Your own list of pages is not the list that matters. Compare it against Search Console’s before you plan a single redirect.',
      },
      { kind: 'h2', id: 'keep-the-urls', text: '2. Keep the URLs that can stay' },
      {
        kind: 'p',
        text: 'The safest redirect is the one you never need. The policy was one to one: every page kept its exact path on the new site, language prefix and slug included. All 172 did. Only four pages were renamed, each at the client’s request on or after launch day, and each got a permanent redirect with the rename.',
      },
      {
        kind: 'p',
        text: 'This costs something in the build. Slugs differ between the two languages and follow no rule, so they are stored per page, never generated. That is cheaper than recovering a ranking.',
      },
      { kind: 'h2', id: 'redirect-map', text: '3. Write the redirect map, and test it with the awkward addresses' },
      {
        kind: 'p',
        text: 'The site went live with 57 redirect rules. Every one is a permanent (301) redirect, a single hop, to a page that answers. When a target was later renamed, the rules pointing at it were re-pointed, so a chain never formed.',
      },
      {
        kind: 'p',
        text: 'The check that mattered was on the addresses nobody would choose. The old platform exposed category URLs containing capital letters, spaces, an ampersand and non-Latin characters. Four of those were silently dropped by a filter in our own redirect code and returned "not found" on staging. Google knew all four. The fix was to percent-encode every source address, and to add a second rule for the encoded ampersand.',
      },
      { kind: 'h2', id: 'what-exports', text: '4. Find out what the old platform will not give you' },
      {
        kind: 'p',
        text: 'Squarespace’s export is an XML file of blog posts and basic page text. It holds no galleries, no video blocks, no images and no layout. Everything else had to be collected another way.',
      },
      {
        kind: 'table',
        caption: 'What had to be carried across, and where it came from',
        head: ['What', 'Where it came from'],
        rows: [
          ['Titles, descriptions, headings, canonicals', 'A crawl of the live site'],
          ['Body copy', 'A script that fetched and extracted each page'],
          ['Service pages', 'Captured by hand'],
          ['Language pairs', 'A hand-kept footer switcher; the old site had no hreflang at all'],
          ['Image descriptions', 'Written fresh, in both languages'],
          ['Search engine verification', 'Recovered from the old home page’s HTML'],
          ['Email records', 'Copied by hand from the DNS panel'],
        ],
      },
      {
        kind: 'p',
        text: 'The crawl also showed what not to carry across. Of the 172 old pages, 130 had two main headings instead of one. The platform also set headings in capitals with a style rule, so the extracted text had to be checked against the real, accented spelling.',
      },
      { kind: 'h2', id: 'the-gate', text: '5. Check all of it by machine before the domain moves' },
      {
        kind: 'p',
        text: 'We wrote a script that walks the whole inventory and compares the new site against the record of the old one. It does not sample. It checks every row.',
      },
      {
        kind: 'list',
        items: [
          'The title, the description and the main heading of every page, compared exactly.',
          'The canonical address, the language annotations and the structured data.',
          'Every redirect: one hop, permanent, landing on a live page.',
          'The sitemap: every entry is a real page in the inventory.',
          'That "do not index" is on for staging and off for the real domain.',
        ],
      },
      {
        kind: 'p',
        text: 'On the live domain, the night of the move, it passed 176 of 176 rows with no failures. That number is only interesting because of what the same script found in the days before.',
      },
      {
        kind: 'table',
        caption: 'What the automated check caught before launch',
        head: ['What it found', 'Why it mattered'],
        rows: [
          ['181 fields on 85 pages edited in the CMS without a record', 'The site no longer matched what was agreed to be migrated'],
          ['One page returning "not found"', 'Its row carried the other language’s slug'],
          ['The second-language home page serving an English title', 'The wrong page would have been indexed for that language'],
          ['Two posts with each other’s title and heading', 'The mistake was live on the old site and had been copied faithfully'],
        ],
      },
      {
        kind: 'note',
        title: 'Read every difference',
        text: 'The check reports differences. It cannot tell an improvement from a mistake. Accepting them all in one click would have recorded the English title on the wrong home page as the truth.',
      },
      { kind: 'h2', id: 'cutover', text: '6. Make the move reversible' },
      {
        kind: 'p',
        text: 'The move itself was one change: the domain’s nameservers. The old site was left running and untouched, so going back was the same single change in reverse. The night before, the email records were copied to the new DNS and two were added that had never existed (SPF and DMARC), because a test message from the new contact form had landed in spam.',
      },
      { kind: 'h2', id: 'results', text: 'What happened to indexing' },
      {
        kind: 'p',
        text: 'Before the move, Google had indexed 135 of the 172 pages. Nine days after it, the count was 143.',
      },
      {
        kind: 'p',
        text: 'That is where our record ends. We do not hold traffic or ranking figures for the months after, so we are not going to print any. What we can say is what the process is built to protect: the addresses Google knows keep answering, with the same titles and headings, from the first minute.',
      },
      {
        kind: 'note',
        title: 'Redirects are not a launch task',
        text: 'A redirect only works while it exists. If rules are removed from the site months later, the old addresses return "not found" again and whatever they had earned goes with them. Treat the redirect map as part of the site, and check it whenever the site changes.',
      },
      { kind: 'h2', id: 'checklist', text: 'The checklist' },
      {
        kind: 'list',
        ordered: true,
        items: [
          'Crawl the old site and export every URL with its title, description and main heading.',
          'Export the URLs Search Console knows and compare the two lists.',
          'Keep every path you can. Decide the rest, one by one.',
          'Write a single-hop permanent redirect for each address that changes.',
          'Test the redirects with the awkward addresses: spaces, capitals, symbols, other alphabets.',
          'Carry the titles, descriptions and headings across unchanged. Improve them after the move, not during it.',
          'Check every row by machine on staging, then again on the live domain.',
          'Move the domain with one reversible change, and keep the old site running.',
          'Submit the new sitemap, then watch indexing for a month.',
          'Keep the redirect map for as long as the site exists.',
        ],
      },
      {
        kind: 'p',
        text: 'The same method scales down to a site of a few pages. The list is shorter; the steps do not change. [Velricon](/work/velricon) is a redesign of that size.',
      },
    ],
    service: {
      slug: 'website-redesign',
      label: 'Website redesign services',
      line: 'An audit of what your site already earns, then a redesign that keeps it. From €2,500, four to eight weeks.',
    },
    studies: ['velricon'],
  },
]

export const getPost = (slug: string) => BLOG_POSTS.find((p) => p.slug === slug)

/** newest first */
export const postsByDate = () => [...BLOG_POSTS].sort((a, b) => (a.published < b.published ? 1 : -1))

/** the words a reader reads, for the reading time and the schema */
export function wordCount(post: BlogPost): number {
  const parts: string[] = [post.answer]
  for (const b of post.blocks) {
    if (b.kind === 'p' || b.kind === 'h2' || b.kind === 'h3') parts.push(b.text)
    else if (b.kind === 'list') parts.push(...b.items)
    else if (b.kind === 'table') parts.push(b.caption, ...b.head, ...b.rows.flat())
    else if (b.kind === 'stats') parts.push(...b.items.map((i) => `${i.value} ${i.label}`))
    else if (b.kind === 'note') parts.push(b.title, b.text)
  }
  return parts.join(' ').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').split(/\s+/).filter(Boolean).length
}

export const readMinutes = (post: BlogPost) => Math.max(2, Math.round(wordCount(post) / 220))

/** "3 October 2026" */
export const longDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
