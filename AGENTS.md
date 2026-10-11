# KONA project memory

Read [docs/performance-handoff.md](docs/performance-handoff.md) before continuing
the performance work. It records the reviewed changes, validation, known limits
and next pass as of 10 October 2026. Phase reports in `docs/design/` are historical;
the handoff takes precedence for their completion and repository status.

## Blog writing

Before drafting or revising articles, read [docs/blog-writing-handoff.md](docs/blog-writing-handoff.md)
and [docs/editorial/konstantinos-voice-and-search.md](docs/editorial/konstantinos-voice-and-search.md).
They record the owner's voice, research standards, draft status and next topic.
Use [docs/content-planner-three-months.md](docs/content-planner-three-months.md)
for the current Tuesday/Thursday sequence; it supersedes the older blog plan's
cadence and topic order. Local drafts exist through Article 12; Article 13,
scrollytelling, is next when the owner resumes writing. Konstantinos Kyprianou
is the author of subsequent articles. Draft carefully one article at a time
unless the owner requests a batch. Drafting does not authorize CMS publication,
Git commits, pushes or deployment. Keep factual claims sourced and hypothetical
examples explicit; do not invent personal experience, client results or SEO/GEO
outcomes. After each completed article, update the planner and writing handoff.

## Working preferences

- Preserve the existing appearance and authored motion while improving runtime
  work. The user wants one performance pass at a time, reviewed locally.
- On 11 October 2026, the user authorized committing the remaining site and
  editorial updates and pushing `main`, including both reviewed performance
  commits. This does not authorize CMS publication or a manual deployment.
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

The user authorized a local commit of the first-load pass and put further
performance work on hold on 10 October 2026. See
`docs/design/first-load/README.md` and the handoff for the committed scope,
validation and remaining cold-load costs. The 11 October push authorization
supersedes the earlier local-only delivery restriction; check Git's remote
tracking state for delivery status. Hosting deployment has not been verified.
Do not resume performance work unless requested. Physical-device/Safari review
remains outstanding.
