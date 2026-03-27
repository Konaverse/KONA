import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/json-ld";
import AboutContent from "./about-content";

export const metadata: Metadata = buildMetadata({
  title: "About Us",
  description:
    "Meet the team behind Konaverse — a boutique digital studio in Cyprus. Web development, videography, social media, and digital advertising by Konstantinos & Nabil.",
  path: "/about",
  keywords: [
    "about Konaverse",
    "digital agency team",
    "web design founders",
    "creative digital studio",
    "who we are",
    "digital agency Cyprus",
  ],
});

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", href: "/" },
          { name: "About", href: "/about" },
        ])}
      />
      <AboutContent />
    </>
  );
}
