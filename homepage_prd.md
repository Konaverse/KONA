# Konaverse Scrollytelling Experience — PRD
**Version:** 1.0  
**Branch:** scrollytelling  
**Stack:** Next.js, Tailwind CSS, Framer Motion, GSAP + ScrollTrigger  
**Status:** Ready for build

---

## 1. Overview

Replace the current Konaverse homepage body with a full-screen scrollytelling experience. The user scrolls through a cinematic sequence of 906 JPG frames (converted to WebP) driven by GSAP ScrollTrigger. Each scroll position maps to a specific frame, creating the illusion of watching a video. Overlaid text, subheadings, and CTA buttons appear and disappear at defined scroll milestones using anagram animations. The navbar remains visible throughout. The experience is desktop-only for now — mobile gets a separate implementation later.

---

## 2. Asset Pipeline — JPG to WebP Conversion

### Source folders
All frame folders live at `/public/frames/`:

```
/public/frames/00_start_to_web_dev/        (151 frames)
/public/frames/01_web_dev_to_web_apps/     (151 frames)
/public/frames/02_web_apps_to_videography/ (151 frames)
/public/frames/03_videography_to_digital_ads/ (151 frames)
/public/frames/04_digital_ads_to_social_media/ (240 frames)
/public/frames/05_social_media_to_invitation/  (240 frames)
```

### Frame naming convention
Each folder contains sequentially named frames:
```
ezgif-frame-001.jpg → ezgif-frame-151.jpg
```

### WebP conversion
Write a Node.js conversion script at `/scripts/convert-frames.js` using the `sharp` library.

- Convert every `.jpg` in every subfolder of `/public/frames/` to `.webp`
- Quality: **85**
- Output: same folder, same filename, `.webp` extension
- Do NOT delete the original JPGs until conversion is verified
- Log progress per folder
- Run once as a build prep step — not at runtime

```bash
node scripts/convert-frames.js
```

After conversion, all frame references in code use `.webp` exclusively.

---

## 3. Page Structure

### Homepage (`/app/page.tsx` or `/pages/index.tsx`)

Strip the homepage down to:
1. `<Navbar />` — existing component, stays mounted, `position: fixed`, `z-index: 50`
2. `<ScrollytellingExperience />` — new component, full page
3. `<Footer />` — existing component, appears after the scrollytelling section ends

### Component file location
```
/components/scrollytelling/ScrollytellingExperience.tsx
/components/scrollytelling/FrameCanvas.tsx
/components/scrollytelling/ServiceText.tsx
/components/scrollytelling/useFrameSequence.ts
```

---

## 4. Scroll Architecture

### Scroll container
The `ScrollytellingExperience` component renders:
- A **fixed full-screen canvas/image layer** — always fills the viewport, never scrolls
- A **tall scroll spacer div** — provides the scroll distance that GSAP reads
- **Fixed overlay text panels** — positioned over the canvas, driven by scroll progress

### Scroll height calculation
Clips 00–03 have 151 frames each. Clips 04–05 have 240 frames each.

```
Total frames: (151 × 4) + (240 × 2) = 604 + 480 = 1,084
Scroll height per frame: 8px  (adjust if motion feels too fast/slow)
Total scroll height: 1,084 × 8px = 8,672px
```

Set the spacer div height to `8672px`. This sits in normal document flow and drives the scroll. Everything visual is `position: fixed`.

### GSAP ScrollTrigger setup
```js
ScrollTrigger.create({
  trigger: scrollSpacerRef.current,
  start: "top top",
  end: "bottom bottom",
  scrub: true,
  onUpdate: (self) => {
    const totalFrames = 1084;
    const frameIndex = Math.floor(self.progress * (totalFrames - 1));
    setCurrentFrame(frameIndex);
  }
});
```

---

## 5. Frame Rendering — FrameCanvas Component

### Strategy
Preload all 906 WebP frames using an image preloader. Display the current frame as a full-screen `<img>` tag with `object-fit: cover`. Do NOT use `<canvas>` — direct `<img>` swapping is simpler and sufficient.

### Preloading
Preload frames in batches — do not block render. Show a loading state (simple dark screen with a subtle green pulsing dot) until the first clip (frames 0–150) is fully loaded. Preload remaining clips in the background progressively.

### Frame index mapping
```
Global frame 0–150     → /public/frames/00_start_to_web_dev/ezgif-frame-001.webp – ezgif-frame-151.webp
Global frame 151–301   → /public/frames/01_web_dev_to_web_apps/ezgif-frame-001.webp – ezgif-frame-151.webp
Global frame 302–452   → /public/frames/02_web_apps_to_videography/ezgif-frame-001.webp – ezgif-frame-151.webp
Global frame 453–603   → /public/frames/03_videography_to_digital_ads/ezgif-frame-001.webp – ezgif-frame-151.webp
Global frame 604–843   → /public/frames/04_digital_ads_to_social_media/ezgif-frame-001.webp – ezgif-frame-240.webp
Global frame 844–1083  → /public/frames/05_social_media_to_invitation/ezgif-frame-001.webp – ezgif-frame-240.webp
```

Frame number within folder = relative frame index + 1, zero-padded to 3 digits.
Frame path construction: `ezgif-frame-${String(frameNumber).padStart(3, '0')}.webp`

Clip boundary map for frame resolution:
```ts
const clips = [
  { folder: '00_start_to_web_dev',           frames: 151, globalStart: 0 },
  { folder: '01_web_dev_to_web_apps',         frames: 151, globalStart: 151 },
  { folder: '02_web_apps_to_videography',     frames: 151, globalStart: 302 },
  { folder: '03_videography_to_digital_ads',  frames: 151, globalStart: 453 },
  { folder: '04_digital_ads_to_social_media', frames: 240, globalStart: 604 },
  { folder: '05_social_media_to_invitation',  frames: 240, globalStart: 844 },
];
```

### Image display
```css
position: fixed;
inset: 0;
width: 100vw;
height: 100vh;
object-fit: cover;
object-position: center;
z-index: 1;
```

---

## 6. Text Overlay System — ServiceText Component

### Text panels
Each service chapter has one text panel. Panels are `position: fixed` overlays that sit above the frame canvas (`z-index: 10`).

Text uses the anagram animation already present in the codebase — apply it to headline, subheading, and CTA identically to how it is currently used elsewhere in the project.

### Chapter definitions

```ts
const chapters = [
  {
    id: "opening",
    frameStart: 0,
    frameEnd: 75,          // first half of clip 00
    textVisible: true,
    headline: "ENTER THE.\nDIGITAL.\nERA.",
    subheading: "Konaverse provides you with the tools to build your own digital realm.",
    cta: null,
    layout: "split",       // headline top-left, subheading bottom-right
    headlinePosition: "top-left",
    subheadingPosition: "bottom-right",
  },
  {
    id: "web-development",
    frameStart: 151,
    frameEnd: 301,
    textVisible: true,
    headline: "01 — Web Development",
    subheading: "Endless imagination, built to last.\nWe design and develop websites that don't just look premium — they perform, convert, and position you in a different league.",
    cta: { label: "View Web Development", href: "/solutions/web-development" },
    layout: "left",        // all text on left side
    headlinePosition: "left",
  },
  {
    id: "web-applications",
    frameStart: 302,
    frameEnd: 452,
    textVisible: true,
    headline: "02 — Web Applications",
    subheading: "Performance without compromise.\nCustom web applications built for scale. From internal tools to client-facing platforms — engineered with precision so your business runs without friction.",
    cta: { label: "View Web Applications", href: "/solutions/web-applications" },
    layout: "right",       // all text on right side
    headlinePosition: "right",
  },
  {
    id: "videography",
    frameStart: 453,
    frameEnd: 603,
    textVisible: true,
    headline: "03 — Videography",
    subheading: "Every frame, intentional.\nCinematic content that makes people stop. We capture your brand the way it deserves to be seen — with depth, atmosphere, and purpose.",
    cta: { label: "View Videography", href: "/solutions/videography" },
    layout: "left",
    headlinePosition: "left",
  },
  {
    id: "digital-advertising",
    frameStart: 604,
    frameEnd: 754,
    textVisible: true,
    headline: "04 — Digital Advertising",
    subheading: "Reach the right people. Every time.\nCampaigns built around conversion, not vanity metrics. We put your brand in front of audiences that matter and turn attention into revenue.",
    cta: { label: "View Digital Advertising", href: "/solutions/digital-advertising" },
    layout: "right",
    headlinePosition: "right",
  },
  {
    id: "social-media",
    frameStart: 755,
    frameEnd: 905,
    textVisible: true,
    headline: "05 — Social Media Management",
    subheading: "Presence that compounds.\nWe manage your social identity so you never have to think about it. Consistent, creative, always on-brand — your audience grows while you focus on your business.",
    cta: { label: "View Social Media", href: "/solutions/social-media" },
    layout: "center-bottom",
    headlinePosition: "center",
  },
  {
    id: "invitation",
    frameStart: 830,
    frameEnd: 905,
    textVisible: true,
    headline: "ENGAGE WITH.\nKONAVERSE.",
    subheading: "Your digital presence, perfected. Your time, protected.",
    cta: { label: "Start Your Project", href: "/contact" },
    layout: "split",
    headlinePosition: "top-right",
    subheadingPosition: "bottom-left",
  },
];
```

### Text visibility logic
Each chapter's text fades in when `currentFrame` enters the chapter's `frameStart` and fades out before `frameEnd`. Use a 20-frame fade-in buffer and a 20-frame fade-out buffer at chapter boundaries.

```ts
const fadeInEnd = chapter.frameStart + 20;
const fadeOutStart = chapter.frameEnd - 20;

if (currentFrame < chapter.frameStart || currentFrame > chapter.frameEnd) opacity = 0;
else if (currentFrame < fadeInEnd) opacity = (currentFrame - chapter.frameStart) / 20;
else if (currentFrame > fadeOutStart) opacity = (chapter.frameEnd - currentFrame) / 20;
else opacity = 1;
```

Trigger the anagram animation when a chapter's text transitions from opacity 0 to opacity 1.

### Text layout positions

**Top-left:**
```css
position: fixed;
top: 10%;
left: 6%;
max-width: 40%;
```

**Bottom-right:**
```css
position: fixed;
bottom: 12%;
right: 6%;
max-width: 40%;
text-align: right;
```

**Left:**
```css
position: fixed;
top: 50%;
left: 6%;
transform: translateY(-50%);
max-width: 38%;
```

**Right:**
```css
position: fixed;
top: 50%;
right: 6%;
transform: translateY(-50%);
max-width: 38%;
text-align: right;
```

**Center-bottom:**
```css
position: fixed;
bottom: 12%;
left: 50%;
transform: translateX(-50%);
text-align: center;
max-width: 50%;
```

**Top-right:**
```css
position: fixed;
top: 10%;
right: 6%;
max-width: 40%;
text-align: right;
```

**Bottom-left:**
```css
position: fixed;
bottom: 12%;
left: 6%;
max-width: 40%;
```

---

## 7. Typography

All text follows Konaverse brand guidelines.

| Element | Font | Weight | Size | Color | Transform |
|---|---|---|---|---|---|
| Headline (service) | Monument Extended | 300 | clamp(1.5rem, 3vw, 2.5rem) | #faf7f2 | uppercase |
| Headline (opening/closing) | Monument Extended | 300 | clamp(2.5rem, 5vw, 5rem) | #faf7f2 | uppercase |
| Subheading first line | Satoshi or Neue Montreal | 300 | clamp(0.9rem, 1.2vw, 1.1rem) | #6b7f62 | none |
| Body copy | Satoshi or Neue Montreal | 300 | clamp(0.85rem, 1vw, 1rem) | #b6a492 | none |
| CTA button | Geist Mono | 300 | 0.75rem | #faf7f2 | uppercase, letter-spacing: 0.15em |

Letter spacing on headlines: `0.08em`  
Line height on large headlines: `1.1`  
Line height on body: `1.7`

---

## 8. CTA Button Style

Consistent with existing Konaverse button style:

```css
display: inline-block;
border: 1px solid rgba(250, 247, 242, 0.3);
padding: 0.6rem 1.4rem;
font-family: 'Geist Mono', monospace;
font-size: 0.75rem;
font-weight: 300;
letter-spacing: 0.15em;
text-transform: uppercase;
color: #faf7f2;
background: transparent;
margin-top: 1.5rem;
transition: border-color 0.4s ease, color 0.4s ease;
cursor: pointer;

&:hover {
  border-color: #6b7f62;
  color: #6b7f62;
}
```

CTA appears simultaneously with headline and subheading — same anagram animation trigger, slight stagger delay of 200ms after headline.

---

## 9. Numbered Archive Label

The Konaverse numbered archive label visual signature must appear on screen throughout the experience. Display it as a fixed element bottom-right corner (above the frame canvas, below the text overlays):

```
z-index: 9
position: fixed
bottom: 2rem
right: 2rem
font-family: Geist Mono
font-size: 0.65rem
color: rgba(107, 127, 98, 0.4)
letter-spacing: 0.2em
text-transform: uppercase
```

Content: dynamically update to show current chapter:
```
00 — Opening
01 — Web Development
02 — Web Applications
03 — Videography
04 — Digital Advertising
05 — Social Media
06 — Invitation
```

---

## 10. Scroll Progress Indicator

A minimal vertical progress bar on the far right edge of the screen:

```css
position: fixed;
right: 0;
top: 0;
width: 2px;
height: 100vh;
background: rgba(107, 127, 98, 0.1);
z-index: 20;
```

Fill bar:
```css
width: 2px;
background: #6b7f62;
height: {scrollProgress * 100}%;
transition: height 0.05s linear;
```

---

## 11. Loading State

Before the first clip finishes preloading, show a full-screen loading overlay:

```css
background: #111111;
position: fixed;
inset: 0;
z-index: 100;
display: flex;
align-items: center;
justify-content: center;
```

Center element: the Konaverse logo mark (4-pointed star) pulsing softly in `#6b7f62`. Fade out the overlay once frames 0–150 are loaded using a 600ms ease-out opacity transition.

---

## 12. Performance Requirements

- WebP quality 85 — non-negotiable
- Preload clip 00 before showing anything
- Preload clips 01–05 progressively in the background after clip 00 is ready
- Use `requestAnimationFrame` for frame updates — never update frame index directly in scroll event
- Debounce frame updates to a minimum of 16ms (60fps cap)
- Do not mount text overlay components until their chapter is within 200 frames of becoming active
- All fixed elements use `will-change: transform` or `will-change: opacity` where appropriate
- No autoplay video, no GIFs, no heavy third-party scripts on this page

---

## 13. GSAP Installation

GSAP is not currently installed. Install it:

```bash
npm install gsap
```

Import in the component:
```ts
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
```

---

## 14. Mobile Behavior

On viewport width below `768px`:
- Hide the `ScrollytellingExperience` component entirely
- Show a `MobileServicesPlaceholder` component instead
- This is a stub — implementation deferred. For now render a simple dark section with the text "Full experience available on desktop." styled in Geist Mono, Soft White, centered.

---

## 15. Footer Behavior

The `<Footer />` component sits in normal document flow below the scroll spacer. It appears naturally when the user scrolls past the end of the sequence. No special behavior needed.

---

## 16. File Checklist for Cursor

Before building, confirm the following exist:

- [ ] `/public/frames/00_start_to_web_dev/ezgif-frame-001.jpg` through `ezgif-frame-151.jpg`
- [ ] `/public/frames/01_web_dev_to_web_apps/ezgif-frame-001.jpg` through `ezgif-frame-151.jpg`
- [ ] `/public/frames/02_web_apps_to_videography/ezgif-frame-001.jpg` through `ezgif-frame-151.jpg`
- [ ] `/public/frames/03_videography_to_digital_ads/ezgif-frame-001.jpg` through `ezgif-frame-151.jpg`
- [ ] `/public/frames/04_digital_ads_to_social_media/ezgif-frame-001.jpg` through `ezgif-frame-240.jpg`
- [ ] `/public/frames/05_social_media_to_invitation/ezgif-frame-001.jpg` through `ezgif-frame-240.jpg`
- [ ] Monument Extended font loaded (Google Fonts or local)
- [ ] Satoshi or Neue Montreal font loaded
- [ ] Geist Mono font loaded (already in project)
- [ ] GSAP installed (`npm install gsap`)
- [ ] `sharp` installed for conversion script (`npm install sharp`)
- [ ] Anagram animation utility available in codebase

---

## 17. Build Order for Cursor

Execute in this exact sequence:

1. Install GSAP and Sharp
2. Write and run `/scripts/convert-frames.js` — convert all JPGs to WebP
3. Build `useFrameSequence.ts` — preloading logic and frame index state
4. Build `FrameCanvas.tsx` — fixed full-screen image display
5. Build `ServiceText.tsx` — fixed overlay text with anagram animation and opacity logic
6. Build `ScrollytellingExperience.tsx` — scroll spacer, GSAP ScrollTrigger, composes all sub-components
7. Update homepage to use `ScrollytellingExperience` between Navbar and Footer
8. Test scroll at multiple speeds — verify frame transitions are smooth
9. Verify WebP files load correctly in browser
10. Verify text panels appear and disappear at correct scroll milestones
11. Verify anagram animations trigger correctly on chapter entry
12. Verify mobile stub renders below 768px