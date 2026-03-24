import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLd, serviceJsonLd, breadcrumbJsonLd } from "@/components/seo/json-ld";
import VideographyContent from "./videography-content";

export const metadata: Metadata = buildMetadata({
  title: "Videography Services",
  description:
    "Cinematic brand films, social content, event coverage, and product videos that tell your story with intention. Professional videography for businesses across Europe.",
  path: "/solutions/videography",
  keywords: [
    "videography services",
    "brand films",
    "corporate video production",
    "social media video content",
    "event videography",
    "product videos",
    "video production agency Europe",
    "cinematic brand content",
    "professional videographer",
    "video marketing",
  ],
});

export default function VideographyPage() {
  return (
    <>
      <JsonLd
        data={serviceJsonLd({
          name: "Videography",
          description:
            "Cinematic brand films, social content, event coverage, and product videos that tell your story with intention.",
          url: "https://www.kona-verse.com/solutions/videography",
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", href: "/" },
          { name: "Solutions", href: "/solutions" },
          { name: "Videography", href: "/solutions/videography" },
        ])}
      />
      <VideographyContent />
    </>
  );
}
