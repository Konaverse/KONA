# Konaverse design context

The v4 source of truth is src/styles/tokens.css. The global stylesheet also contains retired v3 values; do not use its sage palette or serif typography for v4 work.

Use Manrope, the monochrome neutral ramp, and semantic surface, text, focus, shadow and radius tokens. Light and dark surfaces are polarities of the same system. Existing components live in src/components/v4.

## Hub content decision

On 9 October 2026 the user rejected the added overview panels, blog introduction and article excerpts and requested their removal. Preserve the original work, services and blog layouts, including the single-screen work gallery and services carousel. Do not reintroduce these additions.

## Mobile homepage services

The user selected image-led cards on 9 October 2026. Use distinct rounded cards with photos first, existing titles and descriptions, and expandable includes on mobile. Desktop services keep their sheets and row links. This choice applies to the homepage services section, not the services hub or projects.

## Mobile homepage projects

The user selected the open gallery on 9 October 2026 after exploring alternatives. All four projects share one vertical column with the same width and left edge. Keep the SELECTED WORK marquee, show each project name above its screenshot and its service below, and link the whole entry to the case study. Use a curtain reveal, settling image zoom and staggered text entrance once per project. Keep imagery uncropped at rest and fully visible with reduced motion or no JavaScript. Reuse WorkList's responsive markup, v4 tokens and GSAP motion helpers; desktop retains its hover list. This choice applies only to the homepage.

## Services artwork

The user replaced the six service photographs with the graphics from their respective service folders on 9 October 2026. Share the same graphics between the homepage and services hub through src/lib/service-graphics.ts. Preserve their original colors and 1672:941 proportions, and use optimized WebP files with 800px responsive siblings. The mobile cards and hub carousel keep their existing interactions.
