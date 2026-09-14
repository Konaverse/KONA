/**
 * THE STAIRCASE (2026-08-18, HeroPortrait): two overlapping rounded
 * rectangles unioned with concave fillets, drawn once as a path in a
 * 815 x 375 box. The hero clips its video with it; the preloader
 * (2026-09-14) draws its outline as the count and opens it as the window
 * the page arrives through. One path, two places — kept here so they can
 * never drift.
 */
export const SHAPE_W = 815
export const SHAPE_H = 375
export const SHAPE_PATH =
  'M 548 0 H 787 A 28 28 0 0 1 815 28 V 162 A 28 28 0 0 1 787 190 H 573 ' +
  'A 28 28 0 0 0 545 218 V 347 A 28 28 0 0 1 517 375 H 28 A 28 28 0 0 1 0 347 ' +
  'V 183 A 28 28 0 0 1 28 155 H 492 A 28 28 0 0 0 520 127 V 28 A 28 28 0 0 1 548 0 Z'
