"use client";

import MobileBlueprintSection from "./MobileBlueprintSection";
import MobileClientsSection from "./MobileClientsSection";
import MobileServicesSection from "./MobileServicesSection";
import ProjectsMobile from "../ProjectsMobile";
import MobileTestimonialsSection from "./MobileTestimonialsSection";
import MobileCtaSection from "./MobileCtaSection";

export default function MobileHomeSections() {
  return (
    <div
      style={{
        position: "relative",
        background: "#000",
        zIndex: 2,
      }}
    >
      <MobileBlueprintSection />
      <MobileClientsSection />
      <MobileServicesSection />
      <ProjectsMobile />
      <MobileTestimonialsSection />
      <MobileCtaSection />
    </div>
  );
}
