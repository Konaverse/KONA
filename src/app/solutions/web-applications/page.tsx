import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLd, serviceJsonLd, breadcrumbJsonLd } from "@/components/seo/json-ld";
import WebApplicationsContent from "./web-applications-content";

export const metadata: Metadata = buildMetadata({
  title: "Web Application Development",
  description:
    "Complex, data-driven web applications engineered for reliability, security, and scale. SaaS platforms, admin dashboards, and workflow automation built for businesses across Europe.",
  path: "/solutions/web-applications",
  keywords: [
    "web application development",
    "SaaS development",
    "custom web apps",
    "admin dashboard development",
    "enterprise web applications",
    "scalable web platforms",
    "API development",
    "database management",
    "workflow automation",
    "web app agency Europe",
  ],
});

export default function WebApplicationsPage() {
  return (
    <>
      <JsonLd
        data={serviceJsonLd({
          name: "Web Application Development",
          description:
            "Complex, data-driven web applications engineered for reliability, security, and effortless user scaling. SaaS platforms, dashboards, and workflow automation.",
          url: "https://www.kona-verse.com/solutions/web-applications",
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", href: "/" },
          { name: "Solutions", href: "/solutions" },
          { name: "Web Applications", href: "/solutions/web-applications" },
        ])}
      />
      <WebApplicationsContent />
    </>
  );
}
