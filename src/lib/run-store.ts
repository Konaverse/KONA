/**
 * THE RUN's one shared value (service pages, 2026-09-17): where the
 * light should be. The ground of a service page is a fixed layer of
 * light (RunLight.tsx) whose bright core goes to whatever is WORKING —
 * the word being rendered, the fact computing, the step running. Each
 * chapter's driver aims it while that chapter holds the viewport;
 * RunLight eases after the aim. Viewport fractions, 0…1.
 */
export const runLight = { x: 0.72, y: 0.4 }

export const aimLight = (x: number, y: number) => {
  runLight.x = x
  runLight.y = y
}
