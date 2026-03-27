// ─── Project Data — Single source of truth for all project categories ───────
// Used by: ProjectsSection (homepage) and individual category pages.
//
// VIDEOS: All entries are placeholders. Swap `thumbnail` and `videoUrl`
//         once real assets are available.

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
  /** Show on homepage spotlight? */
  spotlight?: boolean;
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
    href: "/projects/videography",
    available: true,
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
    image: "/kona websites screenshots/glmetalworks.png",
    href: "https://glmetalworks.com",
    spotlight: true,
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
    image: "/kona websites screenshots/tdk_macbook.png",
    href: "https://tdkdb.com/",
    spotlight: true,
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
    image: "/kona websites screenshots/LeanthiaBakery.png",
    href: "https://leanthiabakery.com",
    spotlight: true,
  },
  {
    id: "lossantos",
    title: "Los Santos Barbers",
    client: "Los Santos Barbers",
    year: "2024",
    description:
      "A stylish booking platform for a premium barbershop. Features online appointments, service showcase, and a bold visual identity that matches the brand's edge.",
    tags: ["Web Development", "Booking System", "Social Media"],
    tech: ["React", "Node.js", "MongoDB"],
    image: "/kona websites screenshots/lossantosbarbers.png",
    href: "https://lossantosbarbers.com",
  },
  {
    id: "sivory",
    title: "Sivory Design",
    client: "Sivory Design",
    year: "2024",
    description:
      "Elegant portfolio website for an interior and outdoor design company. Showcases premium pergolas and architectural elements with stunning imagery and refined UX.",
    tags: ["Web Development", "Photography", "SEO"],
    tech: ["Next.js", "Tailwind CSS", "Vercel"],
    image: "/kona websites screenshots/sivory_macbook.png",
    href: "https://sivorydesigns.com/",
  },
  {
    id: "apt",
    title: "APT Metal Construction",
    client: "APT Metal Construction",
    year: "2024",
    description:
      "Professional metal construction company website highlighting 10+ years of excellence. Features project showcases, service details, and seamless lead generation.",
    tags: ["Web Development", "SEO", "Lead Generation"],
    tech: ["Next.js", "Tailwind CSS", "Vercel"],
    image: "/kona websites screenshots/apt_macbook.png",
    href: "https://www.aptmetalconstruction.com/",
  },
  {
    id: "velricon",
    title: "Velricon",
    client: "Velricon",
    year: "2024",
    description:
      "Corporate website for a modern digital services provider. Clean, authoritative design that communicates technical expertise and builds trust with prospective clients.",
    tags: ["Web Development", "Corporate Identity", "SEO"],
    tech: ["Next.js", "Tailwind CSS", "Vercel"],
    image: "/kona websites screenshots/velricon.png",
    href: "https://velricon.com",
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
  {
    id: "velricon-social",
    title: "Velricon",
    client: "Velricon",
    year: "2024",
    description:
      "Authoritative social media presence for a modern digital services brand. Precise, technically confident content that communicates innovation without sacrificing clarity.",
    tags: ["Content Creation", "Digital Marketing", "Social Strategy"],
    platforms: ["Instagram", "LinkedIn"],
    feedImages: [
      "/VelriconSocialMedia/1.png",
      "/VelriconSocialMedia/2.png",
      "/VelriconSocialMedia/3.png",
      "/VelriconSocialMedia/4.png",
    ],
    metrics: {
      impressions: "27K+",
      reach: "12K+",
      engagement: "5.2%",
    },
  },
];
