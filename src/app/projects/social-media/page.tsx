import { buildMetadata } from "@/lib/metadata";
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/json-ld";
import SocialMediaProjectsContent from "./social-media-projects-content";

export const metadata = buildMetadata({
  title: "Social Media Portfolio",
  description:
    "Explore our social media projects — strategic content, immersive visuals, and brand narratives that drive engagement and grow communities.",
  path: "/projects/social-media",
  keywords: [
    "social media portfolio",
    "social media design",
    "content creation",
    "brand visuals",
    "Instagram content",
    "social media agency Europe",
  ],
});

export default function SocialMediaProjectsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", href: "/" },
          { name: "Projects", href: "/projects" },
          { name: "Social Media", href: "/projects/social-media" },
        ])}
      />
      <SocialMediaProjectsContent />
    </>
  );
}
