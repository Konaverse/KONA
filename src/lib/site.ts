/**
 * Site-wide constants.
 *
 * THE INNER PAGES ARE IN (2026-09-12, user: "all of the pages except pricing
 * and blogs are done"). Navigation is by ROUTES now: the burger, the footer
 * and the homepage's sections link to the pages, not to in-page anchors.
 * The one-page launch's SECTIONS stay for the homepage's own landmarks
 * (SmoothScroll still eases to a hash on `/`). Pricing and the blog are
 * still redirected home (next.config.ts) and are not linked anywhere.
 */

/** The site's pages, in menu order. */
export const ROUTES = {
  home: '/',
  services: '/services',
  work: '/work',
  about: '/about',
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
export const SITE_NAME = 'Konaverse'
export const CONTACT_EMAIL = 'info@kona-verse.com'
