import HeroSection from "@/components/sections/homepage/HeroSection";
import ArchetypesSection from "@/components/sections/homepage/ArchetypesSection";
import ManifestoSection from "@/components/sections/homepage/ManifestoSection";
import ServicesSection from "@/components/sections/homepage/ServicesSection";

export default function Page() {
  return (
    <main style={{ background: "#000" }}>
      <HeroSection />
      <ArchetypesSection />
      <ManifestoSection />
      <ServicesSection />
    </main>
  );
}
