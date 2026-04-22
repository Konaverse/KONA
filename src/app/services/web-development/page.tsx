"use client";

import PageWrapper from "@/components/layout/PageWrapper";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const CAPABILITIES = [
  {
    title: "Headless e-Commerce",
    description: "Lightning-fast shopping experiences built on modern frameworks like Next.js and Shopify Hydrogen. We decouple the frontend from the backend for total creative freedom and conversion-focused performance."
  },
  {
    title: "Bespoke Web Applications",
    description: "Custom software built to solve specific business problems. From internal dashboards to customer-facing portals, we prioritize security, scalability, and user-centric design."
  },
  {
    title: "Dynamic Brand Experiences",
    description: "Immersive websites that tell your brand's story through high-end typography, motion, and interaction. We bridge the gap between editorial design and technical precision."
  },
  {
    title: "Performance Engineering",
    description: "We don't just build websites; we optimize them. Every project starts with a performance budget, ensuring your site is fast on every device and optimized for search ranking."
  }
];

export default function WebDevelopmentService() {
  return (
    <PageWrapper theme="dark">
      <PageHeader
        subtitle="Services / 01"
        title="Web Development"
        description="We build digital systems that prioritize performance over decoration. Engineering excellence meets editorial aesthetics."
      />

      {/* Main Image Section */}
      <section className="container-padding pb-40">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl md:rounded-3xl">
          <Image
            src="/General/web_dev_aesthetic..png"
            alt="Engineering Excellence"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="container-padding pb-40 grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
        <div>
           <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--color-sage)] mb-8 block">
            Philosophy
          </span>
          <h2 className="font-display text-4xl md:text-6xl mb-12 leading-[1.1]">
            Code should be <em className="italic">invisible</em>.
          </h2>
        </div>
        <div className="space-y-8 font-sans font-light text-lg text-white/60 leading-relaxed">
          <p>
            We believe that technical complexity should never be the user's problem. Our goal is to create interfaces that feel effortless, despite the sophisticated engineering happening beneath the surface.
          </p>
          <p>
            By utilizing headless architectures and modern tech stacks (React, Next.js, GSAP, Tailwind), we ensure your digital presence is not just beautiful today, but resilient for tomorrow.
          </p>
        </div>
      </section>

      {/* Capabilities Grid */}
      <section className="bg-[var(--color-soft-white)] text-[var(--color-obsidian)] section-padding container-padding">
        <div className="mb-20">
           <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--color-sage)] mb-8 block font-semibold">
            Capabilities
          </span>
          <h2 className="font-display text-4xl md:text-6xl tracking-tight">Technical Proficiency</h2>
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

      {/* CTA */}
      <section className="container-padding py-40 flex flex-col items-center text-center">
        <h2 className="font-display text-4xl md:text-7xl mb-12 leading-tight max-w-3xl">
          Ready to build your digital presence?
        </h2>
        <Button href="/contact" variant="primary">
          Start a Project
        </Button>
      </section>
    </PageWrapper>
  );
}
