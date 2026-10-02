import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

/**
 * REDIRECT MAP (SEO plan v3 launch gate, 2026-10-02).
 *
 * PERMANENT (308) — URLs that are gone for good, sent to their nearest
 * live page in ONE hop so Google moves the old URL's signals across
 * (a 307 says "temporary" and keeps the old URL in the index):
 *   www.kona-verse.com/*  → the apex, same path
 *   /index                → /
 *   /projects, /projects/* (the v3 portfolio, 72 impressions in GSC)
 *                         → /work
 *   /services/videography (a v3 service that no longer exists)
 *                         → /services
 *   /pricing (no pricing page will exist — owner, 2026-10-02; prices
 *            live on the service pages; 67 GSC impressions move across)
 *                         → /services
 *
 * TEMPORARY (307) — pages that are coming back at the same URL:
 *   /blog → / (until the blog ships).
 *
 * HISTORY: ONE-PAGE LAUNCH (2026-08-25, docs/launch-plan.md §1). Every inner URL sends
 * the visitor home until its v4 page exists. `permanent: false` (307) on
 * purpose: a 308 is cached by browsers and crawlers, and the real pages
 * would inherit it. Config redirects run BEFORE the filesystem, so the
 * legacy app/(site) pages need no edits to be hidden. The v4 prototypes
 * (/design-system, /proto-*) redirect only in production so they stay
 * usable in dev. Delete a line here the day its page ships.
 *
 * 2026-09-12: /services, /work, /about and /contact SHIPPED (their pages
 * are done and the site links to them), so their lines went. /projects is
 * the legacy route (the v4 hub is /work); /pricing and /blog wait for
 * their pages.
 */
const PERMANENT_REDIRECTS: [string, string][] = [
  ["/index", "/"],
  ["/projects", "/work"],
  ["/services/videography", "/services"],
  ["/pricing", "/services"],
];
const LAUNCH_REDIRECTS: [string, string][] = [
  ["/blog", "/"],
];
const PROTO_REDIRECTS = [
  "/design-system",
  "/hero-object",
  "/object-scrub",
  "/proto-aurora",
  "/proto-peel",
  "/proto-shaders",
  "/proto-shatter",
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  typedRoutes: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/konaverse/**",
      },
    ],
  },
  async redirects() {
    /* The sub-path pattern excludes any segment with a dot: config
     * redirects run BEFORE the public/ folder AND match case-insensitively,
     * so a bare `/work/:path*` swallowed public/work/tzankatian.webp and
     * `/about/:path*` swallowed public/About/KonaLogoNoBg.png. */
    const send = (p: string, to: string, permanent: boolean) => [
      { source: p, destination: to, permanent },
      { source: `${p}/:path([^.]+)*`, destination: to, permanent },
    ];
    return [
      /* www → apex, path kept, one hop */
      {
        source: "/:path*",
        has: [{ type: "host" as const, value: "www.kona-verse.com" }],
        destination: "https://kona-verse.com/:path*",
        permanent: true,
      },
      ...PERMANENT_REDIRECTS.flatMap(([p, to]) => send(p, to, true)),
      ...LAUNCH_REDIRECTS.flatMap(([p, to]) => send(p, to, false)),
      ...(process.env.NODE_ENV === "production"
        ? PROTO_REDIRECTS.flatMap((p) => send(p, "/", false))
        : []),
    ];
  },
  async headers() {
    /* preview and development deployments never compete with production
     * (SEO plan v3 §2): VERCEL_ENV is "production" only on the live
     * deployment, so every preview URL carries noindex by header */
    const noindex =
      process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production"
        ? [{ key: "X-Robots-Tag", value: "noindex, nofollow" }]
        : [];
    return [
      {
        source: "/(.*)",
        headers: [...securityHeaders, ...noindex],
      },
    ];
  },
};

export default nextConfig;
