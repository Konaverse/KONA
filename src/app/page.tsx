import HeroSection from "@/components/sections/homepage/HeroSection";
import ArchetypesSection from "@/components/sections/homepage/ArchetypesSection";

export default function Page() {
  return (
    <main>
      <HeroSection />
      <div className="h-[20vh]" />
      <ArchetypesSection />
    </main>
  );
}
