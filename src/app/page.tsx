import HeroV2 from "@/components/sections/homepage/HeroV2";
import ManifestoSection from "@/components/sections/homepage/ManifestoSection";
import ServicesCarousel from "@/components/sections/homepage/ServicesCarousel";
import ServicesBento from "@/components/sections/homepage/ServicesBento";
import ProjectsSection from "@/components/sections/homepage/ProjectsSection";
import KeyElements from "@/components/sections/homepage/KeyElements";
import PhilosophySection from "@/components/sections/homepage/PhilosophySection";
import TestimonialsSection from "@/components/sections/homepage/TestimonialsSection";
import CTASection from "@/components/sections/homepage/CTASection";
import FooterSection from "@/components/sections/homepage/FooterSection";

export default function Home() {
  return (
    <main className="relative w-full" style={{ background: "#0a0a0c" }}>
      <HeroV2 />
      <ManifestoSection />
      <ServicesBento />
      <ProjectsSection />
      <PhilosophySection />
      <TestimonialsSection />
      <CTASection />
      <FooterSection />
    </main>
  );
}
