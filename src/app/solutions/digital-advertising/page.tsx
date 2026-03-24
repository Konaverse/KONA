import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLd, serviceJsonLd, breadcrumbJsonLd } from "@/components/seo/json-ld";
import DigitalAdvertisingContent from "./digital-advertising-content";

export const metadata: Metadata = buildMetadata({
  title: "Digital Advertising",
  description:
    "Precision-targeted digital advertising campaigns on Google Ads & Meta Ads that convert interest into growth. PPC management, retargeting, A/B testing, and conversion tracking for businesses across Europe.",
  path: "/solutions/digital-advertising",
  keywords: [
    "digital advertising",
    "Google Ads management",
    "Meta Ads",
    "PPC management",
    "paid social media",
    "retargeting campaigns",
    "conversion tracking",
    "A/B testing",
    "digital advertising agency Europe",
    "ROI optimisation",
  ],
});

export default function DigitalAdvertisingPage() {
  return (
    <>
      <JsonLd
        data={serviceJsonLd({
          name: "Digital Advertising",
          description:
            "Precision-targeted digital advertising campaigns on Google Ads & Meta Ads that convert casual interest into sustainable business growth.",
          url: "https://www.kona-verse.com/solutions/digital-advertising",
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", href: "/" },
          { name: "Solutions", href: "/solutions" },
          { name: "Digital Advertising", href: "/solutions/digital-advertising" },
        ])}
      />
      <DigitalAdvertisingContent />
    </>
  );
}
