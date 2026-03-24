import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/json-ld";
import SolutionsContent from "./solutions-content";

export const metadata: Metadata = buildMetadata({
  title: "Digital Solutions",
  description:
    "A comprehensive ecosystem of web development, web applications, social media management, and digital advertising solutions designed to scale your business across Europe.",
  path: "/solutions",
  keywords: [
    "digital solutions",
    "web development services",
    "web application development",
    "social media management services",
    "digital advertising services",
    "full-service digital agency Europe",
  ],
});

export default function SolutionsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", href: "/" },
          { name: "Solutions", href: "/solutions" },
        ])}
      />
      <SolutionsContent />
    </>
  );
}
