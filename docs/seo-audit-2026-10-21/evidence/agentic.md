# Agent readiness audit, kona-verse.com, 21 Oct 2026

## Lighthouse Agentic Browsing (Lighthouse 13.5.0, via PSI)
- /  mobile 2/2, and desktop run by same tool (a11y tree pass, WebMCP N/A)
- /services/web-design  mobile 2/2 (agent-accessibility-tree pass, 0 failed axe rules)
- /contact  desktop 1/2: agent-accessibility-tree PASS, cumulative-layout-shift FAIL (0.222). Mobile PSI call failed (SSL EOF from googleapis), not retried successfully.
- llms-txt, ard-schema, webmcp-*: not applicable (not counted).

## Agent-UX heuristic (separate from Lighthouse): 100, complete, on /, /contact, /services/web-design
- 0 unnamed interactive nodes; / has 53 interactive nodes (11 buttons, 41 links).
- /contact: 3 form fields, labels wrapping inputs (name type=text autoComplete=name; email type=email autoComplete=email; message textarea required). Honeypot "company" is aria-hidden + tabindex=-1 (correct).
- Two Calendly iframes on /contact, both titled "Book a thirty-minute call with Konaverse"; the second has tabindex=-1 (the preloaded reused iframe).

## Findings
1. P2, NEW: /contact CLS 0.222 (desktop PSI, Lighthouse 13.5.0) is the only counted Agentic audit failing. Likely the eager Calendly iframe or the layout settling; SUSPECTED. Fix: reserve fixed height/aspect-ratio for the inline Calendly card. Check src/components/v4 contact split.
2. P3, NEW: Duplicate iframe title on /contact. Agents listing frames see two identical "Book a thirty-minute call" frames. Fix: make the hidden preload copy aria-hidden or retitle it. Do not recreate the iframe (owner preload rule).
3. P3, NEW: No visible-label alternative for textarea beyond label wrapper; placeholder "Tell us about the project." only a hint. Passes axe; informational.
4. CONFIRMED FIXED: letter-split buttons. src/components/v4/Button.tsx:254-255 mark split lines aria-hidden and :258 adds sr-only text with the real label. Tree shows 0 unnamed interactive and no spaced-letter names.
5. Info (owner decision): /llms.txt and index.md return 404 (real 404, content_type html, not soft-404). Not a defect.
6. Info/opportunity: no Content-Signal line in robots.txt, no WebMCP (0 registerTool; 1 form, 0 annotated), no ai-catalog.json / api-catalog (404). All drafts/proposals: WebMCP (W3C CG draft), Content-Signal (Cloudflare policy/IETF draft), checked 2026-09-23 per vendor-matrix.
7. Pass: server-rendered, 791 words without JS on /; real 404 for unknown URLs.

## Access policy (robots.txt, 200)
- Training: no named training-bot groups (GPTBot, ClaudeBot, Google-Extended etc. fall under User-agent * Allow / except /api/). Allowed by default, consistent with decision 3.
- Search: OAI-SearchBot, Claude-SearchBot, PerplexityBot, Googlebot, Bingbot, Applebot explicitly allowed.
- User-triggered: ChatGPT-User, Claude-User, Perplexity-User explicitly allowed. Vendor behaviour: Claude-User honours robots; ChatGPT-User may not apply; Perplexity-User generally ignores.
- /api/ disallowed for all, so the contact POST endpoint is not crawled (correct).

## Can an agent complete the contact path?
Yes: /contact is SSR, a plain POST form (/api/contact, works without JS) with named, typed, autocomplete-annotated fields; email shown as link with aria-label info@kona-verse.com; Calendly iframe has a descriptive title. Not submitted, nothing booked. Calendly content inside the third-party iframe was not inspected.

## Score: 94/100 agent readiness (judgement), Lighthouse 2/2 on / and /services/web-design, 1/2 on /contact desktop.
