import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLd, serviceJsonLd, breadcrumbJsonLd } from "@/components/seo/json-ld";
import WebDevelopmentContent from "./web-development-content";

export const metadata: Metadata = buildMetadata({
  title: "Web Development Services",
  description:
    "Fast, scalable, and beautifully crafted websites built with React, Next.js & TypeScript. SEO-optimised, performance-driven web development for businesses across Europe.",
  path: "/solutions/web-development",
  keywords: [
    "web development",
    "React development",
    "Next.js websites",
    "TypeScript development",
    "responsive web design",
    "SEO optimised websites",
    "Core Web Vitals",
    "fast websites Europe",
    "custom web development",
    "UI/UX design",
  ],
});

export default function WebDevelopmentPage() {
  return (
    <>
      <JsonLd
        data={serviceJsonLd({
          name: "Web Development",
          description:
            "Fast, scalable, and beautifully crafted websites built with React, Next.js & TypeScript. SEO-optimised, performance-driven web development.",
          url: "https://www.kona-verse.com/solutions/web-development",
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", href: "/" },
          { name: "Solutions", href: "/solutions" },
          { name: "Web Development", href: "/solutions/web-development" },
        ])}
      />
      <WebDevelopmentContent />
    </>
  );
}
