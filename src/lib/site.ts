/**
 * Site-wide constants for the ONE-PAGE LAUNCH (docs/launch-plan.md §1).
 *
 * Until the inner pages exist, `/` is the whole site: navigation is in-page
 * (the section ids below), every inner URL redirects to `/` (next.config.ts),
 * and the "commit" CTAs open Calendly so an interested visitor books a
 * meeting on the spot (user call, 2026-08-25).
 */

/** The studio's booking link (user, 2026-08-25). */
export const CALENDLY_URL = 'https://calendly.com/kona-verse/30min'

/** The homepage's landmarks, IN PAGE ORDER (the menu and the footer list
 *  them in this order — user call 2026-08-26: "since it's a one page
 *  website, the links should be ordered correctly"). Values are the ids;
 *  the labels live with the menus (§4 reads "Solutions" in the menu, its
 *  id stays `services`). */
export const SECTIONS = {
  studio: '#studio',
  solve: '#solve',
  services: '#services',
  work: '#work',
  contact: '#contact',
} as const
