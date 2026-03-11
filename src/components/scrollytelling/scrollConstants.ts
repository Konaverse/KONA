/**
 * Scroll-section constants for the layered parallax experience.
 * Replaces the old frame-based TOTAL_FRAMES / PIXELS_PER_FRAME system.
 *
 * All values are expressed as multiples of viewport height (vh).
 * At runtime, multiply by `window.innerHeight` to get pixel values.
 */

/** How many viewport heights the entire experience spans */
export const TOTAL_VH = 26;

/** Service definitions with scroll positions (in vh multiples) */
export const SERVICES = [
  { id: "web-development",     name: "Web Development",     startVh: 5,    endVh: 7.5,  image: "/assets/services/web-development.png" },
  { id: "web-applications",    name: "Web Applications",    startVh: 8.5,  endVh: 11,   image: "/assets/services/web-applications.png" },
  { id: "videography",         name: "Videography",         startVh: 12,   endVh: 14.5, image: "/assets/services/videography.png" },
  { id: "digital-advertising", name: "Digital Advertising", startVh: 15.5, endVh: 18,   image: "/assets/services/digital-advertising.png" },
  { id: "social-media",        name: "Social Media",        startVh: 19,   endVh: 21.5, image: "/assets/services/social-media.png" },
] as const;

/** Invitation / closing section (in vh multiples) */
export const INVITATION = { startVh: 22.5, endVh: 25 };

/** Hero crack opening section (in vh multiples) */
export const HERO = { startVh: 0, endVh: 3 };

/** Atmosphere crossfade section (in vh multiples) */
export const ATMOSPHERE = { startVh: 2, endVh: 4 };

/* ── Pixel helpers (call after mount / on resize) ──────────── */

export function getTotalScroll(): number {
  return TOTAL_VH * window.innerHeight;
}

export function vhToPx(vh: number): number {
  return vh * window.innerHeight;
}
