import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/json-ld";
import ContactContent from "./contact-content";

export const metadata: Metadata = buildMetadata({
  title: "Contact Us",
  description:
    "Start a conversation with Konaverse. Web development, videography, social media, and digital advertising — let's build something extraordinary together.",
  path: "/contact",
  keywords: [
    "contact Konaverse",
    "digital agency quote",
    "web design consultation",
    "hire digital agency Cyprus",
    "get in touch",
    "project inquiry",
  ],
});

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", href: "/" },
          { name: "Contact", href: "/contact" },
        ])}
      />
      <ContactContent />
    </>
  );
}
