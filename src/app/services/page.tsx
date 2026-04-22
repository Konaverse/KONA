"use client";

import PageWrapper from "@/components/layout/PageWrapper";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const SERVICES = [
  {
    id: "web-development",
    number: "01",
    title: "Web Development",
    description: "Digital systems built for performance, not just decoration. We engineer high-end digital experiences using modern, scalable architectures that load instantly and interact seamlessly. From headless commerce to bespoke marketing platforms, every line of code is intentional.",
    image: "/General/web_dev_aesthetic..png",
    href: "/services/web-development",
    features: ["Bespoke Architecture", "Performance Engineering", "E-commerce Solutions", "Interactive Experiences"]
  },
  {
    id: "videography",
    number: "02",
    title: "Videography",
    description: "Cinematic visual assets that command attention and build undeniable authority. We craft visual narratives with a documentary eye and high-end production polish. Not just moving pictures, but strategic storytelling designed for the digital age.",
    image: "/General/videography_aesthetic..png",
    href: "/services/videography",
    features: ["Brand Storytelling", "Cinematic Production", "Social Content", "Documentary Style"]
  }
];

export default function ServicesPage() {
  return (
    <PageWrapper theme="dark">
      <PageHeader
        subtitle="Services"
        title="Our Disciplines"
        description="We don't do everything. We specialize in two core disciplines, combining technical precision with visual storytelling to build brands that refuse to be ignored."
      />

      <section className="container-padding pb-40">
        <div className="grid grid-cols-1 gap-24 md:gap-48">
          {SERVICES.map((service, index) => (
            <div 
              key={service.id}
              className={`flex flex-col ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-12 md:gap-32 items-center`}
            >
              {/* Image Container */}
              <div className="flex-1 w-full aspect-[4/5] md:aspect-square relative overflow-hidden group rounded-2xl">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-500" />
                
                {/* Float Number */}
                <span className="absolute top-8 left-8 font-display text-7xl md:text-9xl opacity-10 pointer-events-none select-none">
                  {service.number}
                </span>
              </div>

              {/* Text Container */}
              <div className="flex-1 flex flex-col items-start pt-8 md:pt-0 max-w-xl">
                <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-[var(--color-sage)] mb-8 flex items-center gap-4">
                  <span className="w-8 h-[1px] bg-[var(--color-sage)]" />
                  {service.number} / Discipline
                </span>
                <h2 className="font-display text-4xl md:text-7xl mb-10 leading-[1.1] tracking-tight">
                  {service.title}
                </h2>
                <p className="font-sans font-light text-xl text-white/50 mb-12 leading-relaxed">
                  {service.description}
                </p>

                <div className="grid grid-cols-2 gap-x-8 gap-y-6 mb-16 w-full">
                  {service.features.map(feature => (
                    <div key={feature} className="flex items-center gap-3">
                       <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-sage)]/40" />
                       <span className="font-mono text-[10px] tracking-widest uppercase opacity-60 italic">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button href={service.href} variant="primary">
                  Explore Discipline
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="bg-[var(--color-soft-white)] text-[var(--color-obsidian)] section-padding container-padding">
        <div className="max-w-4xl mx-auto">
           <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--color-sage)] mb-10 block font-semibold text-center md:text-left">
            The Philosophy
          </span>
          <h2 className="font-display text-4xl md:text-7xl mb-24 leading-[1.05] tracking-tight text-center md:text-left">
            We operate with the <em className="italic">precision</em> of architecture and the <em className="italic font-normal">soul</em> of cinema.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
            <div className="space-y-6">
              <h3 className="font-sans font-bold text-sm uppercase tracking-[0.2em] mb-4">Intentional Output</h3>
              <p className="font-sans font-light text-xl text-black/70 leading-relaxed">
                Everything we build is motivated by intent. We don't follow trends for the sake of novelty; we implement systems that serve your brand's specific narrative and performance goals.
              </p>
            </div>
            <div className="space-y-6">
               <h3 className="font-sans font-bold text-sm uppercase tracking-[0.2em] mb-4">High-Agency Partnership</h3>
              <p className="font-sans font-light text-xl text-black/70 leading-relaxed">
                You work directly with the experts doing the work. No account managers, no layers of bureaucracy. Just a direct line to performance and creative excellence.
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}

