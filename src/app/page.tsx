import HeroV2 from "@/components/sections/homepage/HeroV2";
import ManifestoSection from "@/components/sections/homepage/ManifestoSection";
import ServicesBento from "@/components/sections/homepage/ServicesBento";
import ProjectsSection from "@/components/sections/homepage/ProjectsSection";
import PhilosophySection from "@/components/sections/homepage/PhilosophySection";
import TestimonialsSection from "@/components/sections/homepage/TestimonialsSection";
import CTASection from "@/components/sections/homepage/CTASection";
import FooterSection from "@/components/sections/homepage/FooterSection";

export default function Home() {
  return (
    <div style={{ position: "relative" }}>

      {/*
       * FOOTER — pinned to the bottom of the viewport at z-index 0.
       * The page content (z-index 1) scrolls over it, covering it with
       * its dark background. Once the page content runs out the footer
       * is naturally revealed as you scroll into the transparent spacer below.
       */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          zIndex: 0,
        }}
      >
        <FooterSection />
      </div>

      {/*
       * PAGE CONTENT — position relative, z-index 1, dark background.
       * This sits above the fixed footer and covers it completely.
       * As sections scroll up they naturally slide over the footer.
       */}
      <main
        className="relative w-full"
        style={{
          position: "relative",
          zIndex: 1,
          background: "#0a0a0c",
        }}
      >
        <HeroV2 />
        <ManifestoSection />
        <ServicesBento />
        <ProjectsSection />
        <PhilosophySection />
        <TestimonialsSection />
        <CTASection />
      </main>

      {/*
       * SCROLL SPACER — transparent, 100vh tall, z-index 1.
       * No background = the fixed footer (z-index 0) shows through it.
       * This is what creates the extra scroll distance so the footer
       * can be revealed as the CTA section slides away upward.
       */}
      <div
        aria-hidden
        style={{
          height: "100vh",
          position: "relative",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

    </div>
  );
}
