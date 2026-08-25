/**
 * Site-wide constants for the ONE-PAGE LAUNCH (docs/launch-plan.md §1).
 *
 * Until the inner pages exist, `/` is the whole site: navigation is in-page
 * (the section ids below), every inner URL redirects to `/` (next.config.ts),
 * and the "commit" CTAs open Calendly so an interested visitor books a
 * meeting on the spot (user call, 2026-08-25).
 */

/** REPLACE with the real booking link — the user supplies it. */
export const CALENDLY_URL = 'https://calendly.com/konaverse'

/** The homepage's landmarks. Keys are the menu labels, values the ids. */
export const SECTIONS = {
  studio: '#studio',
  services: '#services',
  work: '#work',
  contact: '#contact',
} as const
