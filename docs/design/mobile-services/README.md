# Mobile homepage services cards

Selected on 9 October 2026: image-led cards. The user chose this direction from the three isolated concepts. The abandoned gallery and accordion previews have been removed. Cards.png retains the selected visual reference.

Implemented in src/components/v4/ServiceSheets.tsx and src/app/(v4)/home.css. Review on http://localhost:3000/#services in a mobile viewport. The existing WHAT / WE / image / DO sign remains above the cards.

Below the desktop breakpoint, services use rounded raised cards with artwork first, titles and descriptions underneath, and accessible expandable includes. All content is rendered once. Without JavaScript, includes remain visible and the inactive buttons are hidden. Desktop keeps its four-column sheets, service links and scroll-driven fan. The driver follows viewport and reduced-motion changes and cleans up when it becomes inactive.

Tokens, Manrope, service order, copy and destination URLs are retained. The services hub and homepage projects were not changed. No dependencies or generated imagery were added.

Validation passed at 320, 390, 430, 768 and 919px, with loaded images, card boundaries, correct content order, working includes and keyboard controls, service links and no horizontal overflow. Desktop columns and row targets passed at 1440px, along with responsive animation cleanup and reduced motion. The actual homepage passed with JavaScript disabled. TypeScript and deterministic 21st review passed; ESLint retained the existing next/no-img-element warning.

The design exploration used the installed taste and 21st skills, existing ServiceSheets/ServiceCarousel imagery and public 21st pattern references. The online CLI was signed out, so no hosted generation or component installation was used.

Final artwork update: the user requested the six supplied graphics in place of the photographs on both the homepage and services hub. A shared src/lib/service-graphics.ts mapping supplies the WebP sources and updated descriptions. Original color and aspect ratio are preserved. Full-size files are 34–69 KiB; the 800px siblings are 13–29 KiB. All six images and the hub carousel passed checks at 390 and 1440px, with no missing graphics or application runtime errors. ../services-graphics-home.png and ../services-graphics-hub.png show this update; cards.png is the earlier composition reference.
