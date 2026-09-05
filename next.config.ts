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
 * ONE-PAGE LAUNCH (2026-08-25, docs/launch-plan.md §1). Every inner URL sends
 * the visitor home until its v4 page exists. `permanent: false` (307) on
 * purpose: a 308 is cached by browsers and crawlers, and the real pages
 * would inherit it. Config redirects run BEFORE the filesystem, so the
 * legacy app/(site) pages need no edits to be hidden. The v4 prototypes
 * (/design-system, /proto-*) redirect only in production so they stay
 * usable in dev. Delete a line here the day its page ships.
 */
const LAUNCH_REDIRECTS = [
  "/services",
  "/projects",
  "/work",
  "/about",
  "/pricing",
  "/blog",
  "/contact",
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
    const toHome = (p: string) => [
      { source: p, destination: "/", permanent: false },
      { source: `${p}/:path([^.]+)*`, destination: "/", permanent: false },
    ];
    /* KONA_OPEN_ROUTES (comma list, .env.local only — never set on Vercel)
     * lifts the launch redirect for routes under construction so they can
     * be built and judged locally while production keeps sending them
     * home. Inner-page phase, 2026-09-05. */
    const open = (process.env.KONA_OPEN_ROUTES || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const list = [
      ...LAUNCH_REDIRECTS.filter((p) => !open.includes(p)),
      ...(process.env.NODE_ENV === "production" ? PROTO_REDIRECTS : []),
    ];
    return list.flatMap(toHome);
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
