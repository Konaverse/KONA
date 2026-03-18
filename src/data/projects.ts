// ─── Project Data — Single source of truth for all project categories ───────
// Used by: ProjectsSection (homepage) and individual category pages.
//
// VIDEOS: All entries are placeholders. Swap `thumbnail` and `videoUrl`
//         once real assets are available.
// VIDEOGRAPHY PAGE: /projects/videography does not exist yet.
//                   The CTA is wired but disabled until the page is created.

// ─── Types ───────────────────────────────────────────────────────────────────

export interface WebsiteProject {
  id: string;
  title: string;
  client: string;
  year: string;
  description: string;
  /** Service tags shown as pills */
  tags: string[];
  /** Tech stack */
  tech: string[];
  /** Path to mockup screenshot (browser/device) */
  image: string;
  /** Live site URL */
  href: string;
}

export interface VideoProject {
  id: string;
  title: string;
  client: string;
  year: string;
  description: string;
  /** Category/type tags */
  tags: string[];
  /** Thumbnail image path — placeholder until real assets are ready */
  thumbnail: string;
  /** YouTube or Vimeo URL for in-page modal — placeholder until ready */
  videoUrl: string;
  /** Display duration e.g. "2:34" */
  duration: string;
}

export interface SocialMetrics {
  impressions: string;
  reach: string;
  engagement: string;
}

export interface SocialProject {
  id: string;
  title: string;
  client: string;
  year: string;
  description: string;
  /** Service tags */
  tags: string[];
  /** Platform names e.g. ["Instagram", "Facebook"] */
  platforms: string[];
  /** Four feed images shown in the phone mockup */
  feedImages: [string, string, string, string];
  /** Headline metrics for the floating badge overlay */
  metrics: SocialMetrics;
}

// ─── Category metadata (CTAs, routing) ───────────────────────────────────────

export const PROJECT_CATEGORIES = {
  websites: {
    label: "Websites",
    slug: "WEBSITES",
    cta: "All Website Projects",
    href: "/projects/website-projects",
    available: true,
  },
  videos: {
    label: "Videos",
    slug: "VIDEOS",
    cta: "All Video Projects",
    /** Page does not exist yet — set available: true once /projects/videography is created */
    href: "/projects/videography",
    available: false,
  },
  social: {
    label: "Social",
    slug: "SOCIAL",
    cta: "All Social Projects",
    href: "/projects/social-media",
    available: true,
  },
} as const;

// ─── Website Projects ─────────────────────────────────────────────────────────
// Picking 3 from the full roster for the homepage spotlight.

export const WEBSITE_PROJECTS: WebsiteProject[] = [
  {
    id: "glmetalworks",
    title: "GL Metal Works",
    client: "GL Metal Works",
    year: "2024",
    description:
      "A modern, high-performance website for a leading metal construction company in Cyprus. Built for authority — stunning visuals, seamless UX, and an architecture engineered to convert.",
    tags: ["Web Development", "UI/UX Design", "SEO"],
    tech: ["Next.js", "Tailwind CSS", "Framer Motion"],
    image: "/kona websites screenshots/mockup-glmetalworks.png",
    href: "https://glmetalworks.com",
  },
  {
    id: "tdk",
    title: "TDK Design & Build",
    client: "TDK Design & Build",
    year: "2024",
    description:
      "Residential development company website showcasing luxury apartments and homes. Designed around elegant presentation and lead generation — every page built to move buyers forward.",
    tags: ["Web Development", "Brand Identity", "Content Strategy"],
    tech: ["WordPress", "Custom Theme", "PHP"],
    image: "/kona websites screenshots/mockup-tdk.png",
    href: "https://tdkdb.com/",
  },
  {
    id: "leanthia",
    title: "Leanthia Bakery",
    client: "Leanthia Bakery",
    year: "2024",
    description:
      "A delightful bakery website that captures the warmth and craft of traditional baking in every pixel. E-commerce ready, SEO-optimised, and built for discovery.",
    tags: ["Web Development", "UI/UX Design", "E-commerce"],
    tech: ["Next.js", "Tailwind CSS", "Stripe"],
    image: "/kona websites screenshots/mockup-leanthia.png",
    href: "https://leanthiabakery.com",
  },
];

// ─── Video Projects ───────────────────────────────────────────────────────────
// All entries are PLACEHOLDERS. Replace thumbnail + videoUrl with real assets.

export const VIDEO_PROJECTS: VideoProject[] = [
  {
    id: "video-placeholder-01",
    title: "Brand Film",
    client: "Client Name",
    year: "2024",
    description:
      "A cinematic brand film that captures the identity, energy, and vision behind the client's business. Shot on location, color graded for premium feel.",
    tags: ["Brand Film", "Cinematography", "Color Grading"],
    thumbnail: "/images/bg-service-dev.png", // PLACEHOLDER — replace with real thumbnail
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // PLACEHOLDER — replace with real URL
    duration: "2:30",
  },
  {
    id: "video-placeholder-02",
    title: "Product Showcase",
    client: "Client Name",
    year: "2024",
    description:
      "High-production product showcase reel designed to stop the scroll. Combines macro photography, motion graphics, and professional sound design.",
    tags: ["Product Video", "Motion Graphics", "Sound Design"],
    thumbnail: "/images/bg-service-social.png", // PLACEHOLDER — replace with real thumbnail
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // PLACEHOLDER — replace with real URL
    duration: "1:45",
  },
  {
    id: "video-placeholder-03",
    title: "Social Content Reel",
    client: "Client Name",
    year: "2024",
    description:
      "Short-form social content package built for performance. Fast cuts, native formats, and hooks engineered for Instagram and TikTok.",
    tags: ["Social Content", "Short-form", "Editing"],
    thumbnail: "/images/bg-service-ads.png", // PLACEHOLDER — replace with real thumbnail
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // PLACEHOLDER — replace with real URL
    duration: "0:45",
  },
];

// ─── Social Media Projects ────────────────────────────────────────────────────

export const SOCIAL_PROJECTS: SocialProject[] = [
  {
    id: "glmetalworks-social",
    title: "GL Metal Works",
    client: "GL Metal Works",
    year: "2024",
    description:
      "Strategic social media management for a leading metal construction company. Authoritative content that showcases craftsmanship and builds brand trust across every platform.",
    tags: ["Content Creation", "Social Strategy", "Brand Voice"],
    platforms: ["Instagram", "Facebook", "LinkedIn"],
    feedImages: [
      "/GLMetalWorksSocialMedia/1.png",
      "/GLMetalWorksSocialMedia/2.png",
      "/GLMetalWorksSocialMedia/3.png",
      "/GLMetalWorksSocialMedia/4.png",
    ],
    metrics: {
      impressions: "48K+",
      reach: "22K+",
      engagement: "6.4%",
    },
  },
  {
    id: "leanthia-social",
    title: "Leanthia Bakery",
    client: "Leanthia Bakery",
    year: "2024",
    description:
      "Curated social presence for an artisanal bakery. Warm, appetite-driven content that translates the craft of traditional baking into a compelling digital narrative.",
    tags: ["Content Creation", "Visual Identity", "Community Management"],
    platforms: ["Instagram", "Facebook"],
    feedImages: [
      "/LeanthiaSocialMedia/1.png",
      "/LeanthiaSocialMedia/2.png",
      "/LeanthiaSocialMedia/3.png",
      "/LeanthiaSocialMedia/4.png",
    ],
    metrics: {
      impressions: "31K+",
      reach: "14K+",
      engagement: "8.1%",
    },
  },
  {
    id: "tdk-social",
    title: "TDK Design & Build",
    client: "TDK Design & Build",
    year: "2024",
    description:
      "Premium social media strategy for a residential development brand. Elevated visual content that positions luxury properties and reinforces a design-forward identity.",
    tags: ["Content Creation", "Social Strategy", "Brand Voice"],
    platforms: ["Instagram", "Facebook", "LinkedIn"],
    feedImages: [
      "/TdkDBSocialMedia/1.png",
      "/TdkDBSocialMedia/2.png",
      "/TdkDBSocialMedia/3.png",
      "/TdkDBSocialMedia/4.png",
    ],
    metrics: {
      impressions: "39K+",
      reach: "18K+",
      engagement: "5.8%",
    },
  },
];
