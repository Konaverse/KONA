import HeroSection from '@/components/sections/HeroSection'
import ServicesSection from '@/components/sections/ServicesSection'
import ManifestoSection from '@/components/sections/homepage/ManifestoSection'
import ProjectsSection from '@/components/sections/ProjectsSection'
import StudioSection from '@/components/sections/StudioSection'
import FooterSection from '@/components/sections/homepage/FooterSection'

export default function Home() {
  return (
    <div className="grain">
      <HeroSection />
      <ServicesSection />
      <ManifestoSection />
      <ProjectsSection />
      <StudioSection />
      <FooterSection />
    </div>
  )
}
