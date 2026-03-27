import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLd, serviceJsonLd, breadcrumbJsonLd } from "@/components/seo/json-ld";
import VideographyProjectsContent from "./videography-content";

export const metadata: Metadata = buildMetadata({
  title: "Videography Portfolio",
  description:
    "Cinematic brand films, product showcases, and social content reels. Watch our video production work — shot, edited, and color graded for premium brands.",
  path: "/projects/videography",
  keywords: [
    "videography portfolio",
    "brand film production",
    "product video showcase",
    "social media video content",
    "video production Cyprus",
    "corporate videography",
    "cinematic video production",
  ],
});

export default function VideographyProjectsPage() {
  return (
    <>
      <JsonLd
        data={serviceJsonLd({
          name: "Videography Portfolio",
          description:
            "Cinematic brand films, product showcases, and social content reels produced by Kona-verse.",
          url: "https://www.kona-verse.com/projects/videography",
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", href: "/" },
          { name: "Projects", href: "/projects" },
          { name: "Videography", href: "/projects/videography" },
        ])}
      />
      <VideographyProjectsContent />
    </>
  );
}
