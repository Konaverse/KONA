import { buildMetadata } from "@/lib/metadata";
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/json-ld";
import WebsiteProjectsContent from "./website-projects-content";

export const metadata = buildMetadata({
  title: "Web Projects Portfolio",
  description:
    "Browse our portfolio of high-performance websites — fast, scalable, and beautifully crafted digital experiences built with React, Next.js, and modern web technologies.",
  path: "/projects/website-projects",
  keywords: [
    "web design portfolio",
    "website projects",
    "React websites",
    "Next.js development",
    "web development portfolio Europe",
  ],
});

export default function WebsiteProjectsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", href: "/" },
          { name: "Projects", href: "/projects" },
          { name: "Website Projects", href: "/projects/website-projects" },
        ])}
      />
      <WebsiteProjectsContent />
    </>
  );
}
