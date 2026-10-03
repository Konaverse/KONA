/**
 * Site-wide constants.
 *
 * THE INNER PAGES ARE IN (2026-09-12, user: "all of the pages except pricing
 * and blogs are done"). Navigation is by ROUTES now: the burger, the footer
 * and the homepage's sections link to the pages, not to in-page anchors.
 * The one-page launch's SECTIONS stay for the homepage's own landmarks
 * (SmoothScroll still eases to a hash on `/`). There is no pricing page
 * (/pricing redirects to /services). THE BLOG OPENED 2026-10-03: /blog,
 * linked from the footer and from the homepage's row under the work.
 */

/** The site's pages, in menu order. */
export const ROUTES = {
  home: '/',
  services: '/services',
  work: '/work',
  about: '/about',
  blog: '/blog',
  contact: '/contact',
} as const

/** The studio's booking link (user, 2026-08-25). */
export const CALENDLY_URL = 'https://calendly.com/kona-verse/30min'

/** The homepage's landmarks, IN PAGE ORDER (the menu and the footer list
 *  them in this order — user call 2026-08-26: "since it's a one page
 *  website, the links should be ordered correctly"). The labels live with
 *  the menus (§4 reads "Solutions" in the menu, its id stays `services`).
 *
 *  ROOT-RELATIVE (`/#id`, not `#id`) since the legal pages went v4
 *  (2026-08-28): the menu and footer render on /privacy too, where a bare
 *  `#studio` points at nothing. On `/` SmoothScroll sees the same pathname
 *  and eases in-page as before; anywhere else PageTransition carries the
 *  hash home and lands on the section. */
export const SECTIONS = {
  studio: '/#studio',
  solve: '/#solve',
  services: '/#services',
  work: '/#work',
  contact: '/#contact',
} as const

export const SITE_URL = 'https://kona-verse.com'
/** The blog's authors, one paragraph each: shown under their articles
 *  and carried by their Person nodes in the root layout's graph (one
 *  wording per person). */
export const NABIL_BIO =
  'Nabil Al Jbawi is the creative director and a co-founder of Konaverse, a web studio in Cyprus. He decides what the studio’s websites look like and how they move: the layout, the type, the imagery and the motion, starting from the brand and never from a template.'
export const AUTHOR_BIO =
  'Konstantinos Kyprianou is the technical architect and a co-founder of Konaverse, a web studio in Cyprus. He builds the studio’s websites: the code, the performance, the integrations and the search work, on Next.js and WebGL.'
export const SITE_NAME = 'Konaverse'
export const CONTACT_EMAIL = 'info@kona-verse.com'
/** The one phone number, written the same everywhere: the site, the
 *  schema, Google Business Profile, Bing, Apple, Clutch and every
 *  directory (owner, 2026-10-02). A second spelling is a second entity. */
export const CONTACT_PHONE = '+357 96 273855'
export const CONTACT_PHONE_HREF = 'tel:+35796273855'

/**
 * The Open Graph fields every page must carry. Next merges metadata
 * SHALLOWLY: a page that sets its own `openGraph` replaces the root's
 * whole object, and the share card loses its image, site name and locale
 * (SEO plan v3 §1, found 2026-10-02). Spread this into every page-level
 * `openGraph`; a page with its own picture overrides `images` after it.
 */
export const OG_DEFAULTS = {
  siteName: SITE_NAME,
  locale: 'en_US',
  images: [
    {
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Konaverse: Build the website that will make you stand out',
    },
  ],
}
