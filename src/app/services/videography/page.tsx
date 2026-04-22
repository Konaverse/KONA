"use client";

import PageWrapper from "@/components/layout/PageWrapper";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const CAPABILITIES = [
  {
    title: "Brand Narratives",
    description: "Deep-dive films that capture the essence of your business. We move beyond testimonials to create emotional connections with your audience through cinematic storytelling."
  },
  {
    title: "Product Showcases",
    description: "High-end product reveals and demonstrations that highlight craftsmanship and quality. We use lighting and motion to make your offerings impossible to ignore."
  },
  {
    title: "Editorial & Lifestyle",
    description: "Atmospheric content designed for social presence. We capture the 'vibe' of your space or service with an eye for detail and high production value."
  },
  {
    title: "Post-Production",
    description: "Expert editing, color grading, and sound design. We give every project a custom look and rhythm that aligns with your brand's unique character."
  }
];

export default function VideographyService() {
  return (
    <PageWrapper theme="dark">
      <PageHeader
        subtitle="Services / 02"
        title="Videography"
        description="We craft cinematic visual assets that build undeniable authority. Not just moving pictures, but strategic storytelling."
      />

      {/* Main Image Section */}
      <section className="container-padding pb-40">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl md:rounded-3xl">
          <Image
            src="/General/videography_aesthetic..png"
            alt="Cinematic Storytelling"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="container-padding pb-40 grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
        <div>
           <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--color-sage)] mb-8 block">
            The Lens
          </span>
          <h2 className="font-display text-4xl md:text-6xl mb-12 leading-[1.1]">
            Presence is <em className="italic">felt</em>.
          </h2>
        </div>
        <div className="space-y-8 font-sans font-light text-lg text-white/60 leading-relaxed">
          <p>
            In a world of constant noise, quiet confidence stands out. We don't shout; we show. Our videography is built on the principle that the most powerful brand narratives are the ones that feel authentic, considered, and visually arresting.
          </p>
          <p>
            From documentary-style brand films to high-precision product showcases, we focus on the details that make your brand remarkable.
          </p>
        </div>
      </section>

      {/* Capabilities Grid */}
      <section className="bg-[var(--color-soft-white)] text-[var(--color-obsidian)] section-padding container-padding">
        <div className="mb-20">
           <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--color-sage)] mb-8 block font-semibold">
            Capabilities
          </span>
          <h2 className="font-display text-4xl md:text-6xl tracking-tight">Visual Mastery</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-x-24 md:gap-y-20">
          {CAPABILITIES.map((cap, i) => (
            <div key={cap.title} className="flex flex-col">
              <span className="font-mono text-[10px] tracking-widest uppercase opacity-40 mb-4">{`0${i + 1}`}</span>
              <h3 className="font-sans font-bold text-lg mb-6">{cap.title}</h3>
              <p className="font-sans font-light text-black/60 leading-relaxed">
                {cap.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Detail Showcase */}
      <section className="container-padding py-40">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src="/a_pro_camera.png"
              alt="Pro Camera Equipment"
              fill
              className="object-cover"
            />
          </div>
          <div className="max-w-md">
            <h3 className="font-display text-3xl md:text-4xl mb-8 leading-tight italic text-[var(--color-pale-warm)]">
              "Every frame is an opportunity to build trust."
            </h3>
            <p className="font-sans font-light text-lg text-white/50 leading-relaxed">
              We utilize high-end cinematic equipment and advanced post-production techniques to ensure your visual assets are of the highest caliber.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-padding py-40 flex flex-col items-center text-center">
        <h2 className="font-display text-4xl md:text-7xl mb-12 leading-tight max-w-3xl">
          Need a cinematic brand film?
        </h2>
        <Button href="/contact" variant="primary">
          Start the Conversation
        </Button>
      </section>
    </PageWrapper>
  );
}
