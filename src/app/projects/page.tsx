import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/json-ld";
import ProjectsContent from "./projects-content";

export const metadata: Metadata = buildMetadata({
  title: "Selected Work",
  description:
    "Browse our portfolio of websites, videography, and social media projects. Premium digital work for brands across Europe.",
  path: "/projects",
  keywords: [
    "digital portfolio",
    "web design projects",
    "videography portfolio",
    "social media portfolio",
    "agency work",
    "digital agency Europe",
  ],
});

export default function ProjectsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", href: "/" },
          { name: "Projects", href: "/projects" },
        ])}
      />
      <ProjectsContent />
    </>
  );
}
