"use client";

import PageWrapper from "@/components/layout/PageWrapper";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const TIERS = [
  {
    n: "01",
    name: "Foundation",
    tagline: "Your digital presence, established.",
    desc: "Built for brands entering the digital space and needing a strong, credible starting point.",
    includes: [
      "Custom UI & UX Design",
      "Responsive Web Development",
      "On-page SEO Setup",
      "1 round of revisions",
      "30-day post-launch support",
    ],
    ideal: "Startups & New Brands",
  },
  {
    n: "02",
    name: "Signature",
    tagline: "Elevated. Refined. Unmistakably you.",
    desc: "For established brands demanding a premium experience that differentiates them in their market.",
    includes: [
      "Everything in Foundation",
      "Custom Design System",
      "Advanced Animations & Interactions",
      "Video Content (1 brand film)",
      "SEO Strategy & Content Planning",
      "3 months post-launch support",
    ],
    ideal: "Growing Businesses",
    featured: true,
  },
  {
    n: "03",
    name: "Architect",
    tagline: "For those who refuse to be ordinary.",
    desc: "A full creative partnership for visionaries redefining their industry. We become your dedicated digital studio.",
    includes: [
      "Everything in Signature",
      "Full Brand Identity System",
      "Cinematic Brand Film Series",
      "Performance & Analytics Dashboard",
      "Dedicated Account Manager",
      "Ongoing Retainer available",
    ],
    ideal: "Established & Premium Brands",
  },
];

const FAQ = [
  {
    q: "Do you show prices upfront?",
    a: "We don't publish fixed prices because every project is unique. Scope, complexity, and timeline all affect investment. We prefer to have a conversation and provide a tailored quote that reflects your specific goals.",
  },
  {
    q: "How long does a typical project take?",
    a: "Foundation projects typically run 4–6 weeks. Signature projects run 8–12 weeks. Architect engagements vary based on complexity — we'll define a clear roadmap before we start.",
  },
  {
    q: "Do you work with international clients?",
    a: "Yes. Our clients are based across Europe, the Middle East, and North America. We operate with a 'global-first' mindset, utilizing async communication and flexible scheduling to accommodate any timezone.",
  },
  {
    q: "What's your payment structure?",
    a: "We typically work with a 50% deposit to initiate the project, with the remaining balance split across key delivery milestones to ensure alignment and momentum.",
  },
];

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <PageWrapper theme="dark">
      <PageHeader
        subtitle="Investment"
        title="Transparent value. Custom craft."
        description="No hidden fees. No generic packages. We price based on exactly what your brand requires to command attention in its market."
      />

      {/* Tiers — Transition to Light */}
      <section className="bg-[var(--color-soft-white)] text-[var(--color-obsidian)] section-padding container-padding">
        <div className="mb-20">
           <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--color-sage)] mb-8 block font-semibold">Service Tiers</span>
           <h2 className="font-display text-4xl md:text-7xl leading-tight">Investment Models.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TIERS.map((tier) => (
            <div 
              key={tier.n}
              className={`relative flex flex-col p-10 rounded-2xl border transition-all duration-500 ${
                tier.featured 
                ? "bg-[var(--color-obsidian)] text-[var(--color-off-white)] border-transparent shadow-2xl scale-[1.02] z-20" 
                : "bg-white/50 border-black/10 text-[var(--color-obsidian)] z-10"
              }`}
            >
              <div className="flex justify-between items-start mb-10">
                <span className="font-mono text-[10px] tracking-widest text-[var(--color-sage)] italic">{tier.n}</span>
                {tier.featured && (
                  <span className="bg-[var(--color-sage)] text-white text-[8px] font-mono tracking-widest uppercase px-3 py-1 rounded-full">Recommended</span>
                )}
              </div>

              <h3 className="font-display text-3xl md:text-4xl mb-2">{tier.name}</h3>
              <p className="font-display italic text-lg opacity-60 mb-8 font-light">{tier.tagline}</p>
              
              <p className="font-sans font-light text-sm opacity-50 leading-relaxed mb-10 border-b border-black/5 pb-10">
                {tier.desc}
              </p>

              <ul className="space-y-4 mb-12 flex-grow">
                {tier.includes.map(item => (
                  <li key={item} className="flex gap-3 items-start">
                    <span className="text-[var(--color-sage)] mt-1 shrink-0">✓</span>
                    <span className="font-sans font-light text-sm opacity-80">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-10 border-t border-black/5 mt-auto">
                 <p className="font-mono text-[9px] tracking-widest uppercase opacity-40 mb-6">Ideal for: {tier.ideal}</p>
                 <Button 
                   href="/contact" 
                   variant="primary" 
                   className={`w-full ${tier.featured ? "bg-[var(--color-off-white)] text-[var(--color-obsidian)]" : "bg-[var(--color-obsidian)] text-white"}`}
                 >
                   Request Quote
                 </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ — Back to Dark */}
      <section className="container-padding py-40">
        <div className="mb-20">
           <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--color-sage)] mb-8 block font-light">Service Clarity</span>
           <h2 className="font-display text-4xl md:text-6xl text-[var(--color-off-white)]">Common Questions.</h2>
        </div>

        <div className="max-w-4xl">
          {FAQ.map((item, i) => (
            <div key={i} className="border-b border-white/5 overflow-hidden">
              <button 
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full py-8 flex items-center justify-between text-left group"
              >
                <h3 className="font-display text-xl md:text-2xl text-[var(--color-off-white)] group-hover:text-[var(--color-sage)] transition-colors duration-300 font-light">
                  {item.q}
                </h3>
                <span className={`text-[var(--color-sage)] transition-transform duration-500 ${openFaq === i ? "rotate-45" : ""}`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </button>
              <div 
                className={`transition-all duration-500 ease-in-out px-1 ${
                  openFaq === i ? "max-h-96 pb-8 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <p className="font-sans font-light text-lg text-white/40 leading-relaxed max-w-3xl">
                  {item.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-padding py-40 text-center flex flex-col items-center border-t border-white/5">
         <h2 className="font-display text-4xl md:text-7xl mb-12 leading-tight max-w-3xl">
           Ready to invest in your <em className="italic text-[var(--color-sage)]">authority</em>?
         </h2>
         <Button href="/contact" variant="primary">
           Get Started
         </Button>
      </section>
    </PageWrapper>
  );
}
