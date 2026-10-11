# Homepage blog carousel

Implemented and checked locally on `main`, 11 October 2026. The owner then authorized committing and pushing the reviewed work. Check Git's remote tracking state for delivery; hosting deployment has not been verified.

The owner requested circular previous/next buttons above the cards at the top right, with each active card aligned to the same left edge and the previous card fully clipped. The implementation retains the existing server-rendered BlogCard content and native horizontal scrolling. A trailing flex space allows the final card to reach that edge too. On mobile, the scroller itself begins at the page inset so older cards cannot peek into the gutter.

`BlogCarousel.tsx` adds the controls, keyboard arrows/Home/End, polite position announcements and disabled end states. It respects reduced motion and keeps the active card aligned after a resize. Scroll and resize events drive updates; there is no continuous animation loop. Without JavaScript, the cards and links remain available and the inactive controls are hidden.

The controls reuse the services carousel's SVG arrow shapes and circular proportions, with v4 role tokens. The 21st catalog search was unavailable because its CLI was not signed in. Local `21st review` completed; its eight informational color findings concern existing card CSS, not the added controls. No catalog component or dependency was installed.

## Verification

- Production build passed, including TypeScript and 44 generated routes.
- Targeted ESLint passed with the existing BlogCards raw-image warning; no errors.
- The SEO gate passed for 25 pages, five redirects and three retired URLs.
- Browser checks passed at desktop 1440 × 900 and mobile 390 × 844: next/previous, rapid clicks, final-card alignment, resize, keyboard, native touch swipe, reduced motion and no-JavaScript content.
- Settled alignment was within 0.41 CSS pixels on desktop and exactly aligned on mobile. Previous cards were fully outside the crop edge, and the page had no horizontal overflow.
- Desktop second-card and mobile last-card captures were visually reviewed.

The local preview also logged a Sanity connection timeout during background revalidation. The page gate and carousel checks passed against the rendered production content; CMS connectivity is outside this navigation change.

Reproduce against a running local production build:

```powershell
node tools/check-blog-carousel.cjs http://127.0.0.1:3010
```

The tool writes `checks.json` and viewport screenshots here. Screenshots are local review evidence. Captures use the existing viewport because expanding Chrome's screenshot surface can reset native scroll-snap positions. These are interaction checks, not runtime performance profiles or a physical-device/Safari review.

The reviewed performance commits remain on `main`. This task changes homepage blog navigation and its design records; it does not resume the paused performance passes. The authorized delivery also includes the sharing image and a separate editorial-records commit. Unrelated artwork, exports, local settings and generated screenshots remain outside those commits.
