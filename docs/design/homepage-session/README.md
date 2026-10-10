# Homepage entrance once per session

Reviewed local change, 2026-10-10, included in the consolidated performance commit. Nothing has been pushed or deployed. See [the current handoff](../../performance-handoff.md) for completion status and the next pass. Generated PNG evidence remains local; reports and JSON records are committed.

The first homepage visit in a tab's browsing session retains the existing cover/carve, headline/pill reveal, and copy entrance. Subsequent homepage visits start immediately at the entrance's settled composition. The normal desktop headline walk, looping video, and scroll-driven fold continue.

`sessionStorage` remembers the visit across client navigation, browser history, and refreshes; a fresh session permits the entrance again. Visiting another page first does not consume the homepage entrance. The visit is recorded when the homepage mounts, so leaving during its opening also prevents a replay on return.

All three hero drivers share a cached decision for the mounted homepage. This prevents whichever component initializes first from consuming the entrance independently of the others, and keeps repeated effect setup consistent. If session storage is unavailable, an in-memory fallback preserves the behavior during client navigation.

## Verification

- Production build and TypeScript passed.
- Targeted ESLint passed with one existing HeroTitle image warning.
- 21st review: zero errors/warnings; three existing suggestions for HeroPortrait's white SVG gradient stops, retained to preserve appearance.
- Desktop and mobile browser checks passed for first entry, actual client navigation away/back, browser back/forward, and same-session refresh.
- A fresh browser session plays the entrance again.
- Entering from another page for the first time plays the entrance.
- Leaving before the entrance completes and returning shows the settled hero.
- Return visits preserve the scroll fold and the desktop headline walk; no opening/sewing cues or fullscreen morph replay.
- Storage restrictions produce no runtime errors and retain the once-only client navigation behavior.

`results.json` and the first/return screenshots record these checks. Run against the local production preview:

```powershell
node tools/profile-shared-effects.cjs homepage-session http://127.0.0.1:3007
```

The startup profiling harness explicitly clears only this session flag before its warmed-assets opening measurement. This keeps that diagnostic focused on the opening; the session checks exercise the real repeat-visit behavior separately.
