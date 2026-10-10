# KONA project memory

Read [docs/performance-handoff.md](docs/performance-handoff.md) before continuing
the performance work. It records the reviewed changes, validation, known limits
and next pass as of 10 October 2026. Phase reports in `docs/design/` are historical;
the handoff takes precedence for their completion and repository status.

## Working preferences

- Preserve the existing appearance and authored motion while improving runtime
  work. The user wants one performance pass at a time, reviewed locally.
- The reviewed performance passes were authorized for a local commit. Do not
  push or deploy until the user explicitly authorizes it; the user wants to push
  the reviewed work together later.
- Work on the active v4 site in `src/app/(v4)` and `src/components/v4`. Its token
  source is `src/styles/tokens.css`; consult `.21st/DESIGN.md` and
  `.21st/design.json` for design and content decisions.
- Ordinary page-link transitions and the navigation-menu choreography are
  separate. Preserve both, including interruption, history and hash handling.
- The homepage entrance runs on the first homepage visit per tab session only.
  Navigation, history and same-session reloads return to the settled hero.
- Keep the six restored realistic service photographs, their existing frames,
  mobile disclosures and hub carousel behavior.
- Keep Calendly preloading at site entry and reuse its single iframe for Contact
  and booking popovers. Avoid recreating it or sacrificing booking readiness for
  a performance score.
- Keep unrelated local artwork, content drafts, exports and
  `.claude/settings.local.json` out of performance commits. Generated screenshots
  are local evidence; the committed reports and tools can reproduce them.

## Verification

Use a production build for runtime profiling. Run browser profiles sequentially,
with cold and warm contexts separated. Headless Chrome uses software WebGL here;
its timings cannot establish smoothness on a physical device. Run checks that
cover the changed behavior, preserving reduced-motion and no-JavaScript content.

The next proposed lever is attribution of the remaining cold-load stalls in the
current build, including the Calendly preload. See the handoff before choosing
an implementation.
