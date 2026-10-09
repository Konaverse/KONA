# Mobile homepage projects: selected gallery

On 9 October 2026 the user chose the open gallery after exploring alternatives,
asking for all projects in one aligned vertical column with richer entrances.
The gallery is implemented in the actual homepage; abandoned motion prototypes
and their preview server have been removed.

Review at http://localhost:3000/#work with a mobile viewport, for example 390px.
Run npm run dev from KONA if the development server is stopped.
The screenshot gallery.png shows the implementation in the running homepage.

## Composition and motion

Retain the SELECTED WORK marquee, Featured projects label, four projects and their
order, case-study destinations and All projects link. Each entry has its name and
an arrow above the screenshot, followed by its service label. Every entry shares
the same left edge and width. The images are uncropped at rest, without rounded
cards, surface shells or alternating indents.

As a project enters the viewport, a curtain reveals its screenshot while a slight
image zoom settles. The title, arrow and service label enter with short offsets.
Entrances play once; normal vertical scrolling remains native. Keyboard focus
reveals an entry immediately. Reduced motion and no JavaScript show the complete
gallery without entrances. Desktop retains its hover list and cursor preview.

## Implementation

- src/components/v4/WorkList.tsx: opt-in mobile gallery using the existing linked
  project markup, responsive picture sources, GSAP matchMedia and per-entry
  IntersectionObserver entrances. Animation cleanup belongs to this component.
- src/components/v4/worklist.css: one aligned column below 57.499rem, using v4
  semantic tokens and Manrope. Explicitly resets the service label's sr-only clip.
- src/app/(v4)/page.tsx: enables mobileGallery for the homepage's four projects.
- .21st/design.json and .21st/DESIGN.md: record the selected direction.

No dependency was added. Existing project screenshots, Button, GSAP and the house
motion easings are reused. No catalogue component code or Giats stacking code was
copied into the gallery.

## Validation

TypeScript, targeted ESLint, 21st review and git diff --check passed. Chromium
checks passed at 320, 390, 430, 768 and 919px: equal image widths and alignment,
correct loaded mobile sources, all four case-study links, settled entrances and
no horizontal overflow. Keyboard focus, live reduced-motion preference, desktop
hover after resizing, restoration to mobile, curtain completion, visible service
captions and a fresh no-JavaScript page passed. No browser runtime errors were
observed. Actual Safari testing remains a device check; Chromium is not Safari.
Nothing has been pushed or deployed.

## References and provenance follow-up

Skills used: 21st-ui-explore, 21st-ui-build, design-taste-frontend and scrollytelling.
21st CLI was signed out, so public pattern references informed the exploration.
The selected gallery uses existing project components and independently authored
motion rather than retrieved catalogue source.

- https://21st.dev/community/components/explore/sticky-scroll-reveal
- https://gsap.com/docs/v3/GSAP/gsap.matchMedia/

The originally referenced parked component is
src/components/sections/parallax-stacking-projects.tsx. Its comments describe
matching giats.me. The selected gallery does not import or reproduce it.

Separate audit finding: src/components/v4/FluidCursor.tsx and its fluid
implementation/shaders explicitly say they were ported from giats-portfolio.
FluidCursor is active in the v4 layout. Attribution alone does not establish
license compliance or noncompliance. Review the original source, license and
notices before publication, in line with the user's ownership requirement.
This finding is separate from the selected projects gallery.
