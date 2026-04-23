"use client";

import PageWrapper from "@/components/layout/PageWrapper";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState, useRef, useLayoutEffect } from "react";
import { gsap } from "@/utils/gsap";

// ── Web Development ───────────────────────────────────────────────────────────

const WEB_PLANS = [
  {
    n: "01",
    name: "Website Development",
    tagline: "Your brand's digital home.",
    desc: "Custom built websites engineered for performance and designed for presence. From marketing sites to portfolio platforms, every pixel is intentional.",
    includes: [
      "Custom UI & UX Design",
      "Responsive Development (Next.js)",
      "SEO Foundations & Metadata",
      "CMS Integration",
      "Performance Optimization",
      "30 days of post launch support",
    ],
    ideal: "Brands entering or refreshing their digital presence",
  },
  {
    n: "02",
    name: "Web Application",
    tagline: "Complex systems, elegant execution.",
    desc: "Scalable, secure web applications built for real world demands. From SaaS platforms to internal tools; we architect systems that grow with your business.",
    includes: [
      "Custom Architecture & System Design",
      "User Authentication & Authorization",
      "Database Design & API Development",
      "Admin Dashboard & Analytics",
      "Third party Integrations",
      "Ongoing support available",
    ],
    ideal: "Businesses needing scalable digital infrastructure",
  },
];

// ── Videography ───────────────────────────────────────────────────────────────

const VIDEO_PLANS = [
  {
    n: "01",
    name: "Video Production",
    tagline: "One story, perfectly told.",
    desc: "Full service production from concept to delivery. Professional filming, cinematic editing, and color grading for a single high impact video asset.",
    includes: [
      "Pre production Planning",
      "Professional Filming (Half/Full Day)",
      "Cinematic Color Grading",
      "Sound Design & Mix",
      "Titles & Lower Thirds",
      "2 Rounds of Revisions",
    ],
    ideal: "Brand films, product launches, testimonials",
    featured: false,
  },
  {
    n: "02",
    name: "Motion Graphics",
    tagline: "Motion that commands attention.",
    desc: "Custom animated graphics for brands that refuse to blend in. From animated logos to full explainer sequences, motion is designed with purpose and precision.",
    includes: [
      "Custom Motion Design",
      "Brand aligned Animation",
      "Animated Logo & Transitions",
      "Intro / Outro Sequences",
      "Social Media Format Delivery",
      "Source Files Included",
    ],
    ideal: "Social content, paid ads, brand animations",
    featured: false,
  },
  {
    n: "03",
    name: "Video Bundle",
    tagline: "Three to five videos. Maximum impact.",
    desc: "Our best value production package. A series of premium video assets built with a unified visual language, cohesive narrative arc, and priority turnaround.",
    includes: [
      "Everything in Video Production",
      "Series Pre production Strategy",
      "Dedicated Production Day(s)",
      "Consistent Visual Identity",
      "Priority Editing Turnaround",
      "Best per video rate",
    ],
    ideal: "Campaigns, content series, brand storytelling",
    featured: true,
  },
];

// ── FAQ ───────────────────────────────────────────────────────────────────────

const FAQ = [
  {
    q: "Do you show prices upfront?",
    a: "We don't publish fixed prices because every project is unique. Scope, complexity, and timeline all affect the investment. We prefer a conversation first and provide a tailored quote that reflects your specific goals.",
  },
  {
    q: "How long does a typical project take?",
    a: "Website builds typically run four to eight weeks. Web applications are scoped individually based on complexity. Single video productions are usually delivered within two to three weeks of the shoot date.",
  },
  {
    q: "Do you work with international clients?",
    a: "Yes. Our clients span Europe, the Middle East, and North America. We operate with a global first mindset; we utilize async communication and flexible scheduling across any timezone.",
  },
  {
    q: "What's your payment structure?",
    a: "We work with a 50% deposit to initiate the project, with the remaining balance split across key delivery milestones to ensure alignment and momentum throughout.",
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const webSectionRef = useRef<HTMLDivElement>(null);
  const videoSectionRef = useRef<HTMLDivElement>(null);
  const webCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const videoCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const faqRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const ctaSectionRef = useRef<HTMLDivElement>(null);
  const ctaWrapperRef = useRef<HTMLDivElement>(null);
  const ctaImageRef = useRef<HTMLDivElement>(null);
  const ctaTextRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const staggerIn = (targets: (HTMLDivElement | null)[], trigger: HTMLDivElement | null) => {
        if (!trigger || !targets[0]) return;
        gsap.fromTo(
          targets,
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out",
            stagger: 0.15,
            scrollTrigger: {
              trigger,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      };

      staggerIn(webCardRefs.current, webCardRefs.current[0]);
      staggerIn(videoCardRefs.current, videoCardRefs.current[0]);

      if (faqRef.current) {
        gsap.fromTo(
          faqRef.current,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: faqRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // 3. Immersive CTA Animation
      if (ctaSectionRef.current) {
        const isMobile = window.innerWidth < 768;
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ctaSectionRef.current,
            start: "top bottom",
            end: "bottom bottom",
            scrub: true,
          }
        });

        tl.fromTo(ctaWrapperRef.current,
          { clipPath: isMobile ? "inset(15% 5% 15% 5% round 2rem)" : "inset(20% 15% 20% 15% round 3rem)" },
          { clipPath: "inset(0% 0% 0% 0% round 0rem)", ease: "power2.inOut" }
        );

        tl.fromTo(ctaImageRef.current,
          { scale: 1.2 },
          { scale: 1, ease: "power2.inOut" },
          "<"
        );

        gsap.to(ctaTextRef.current, {
           opacity: 1,
           y: 0,
           duration: 1,
           ease: "power3.out",
           scrollTrigger: {
             trigger: ctaSectionRef.current,
             start: "center 70%",
             toggleActions: "play none none reverse",
           }
        });
      }
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <PageWrapper theme="dark">
      <div ref={containerRef}>
        <PageHeader
          subtitle="Investment"
          title="Transparent value. Custom craft."
          description="No hidden fees. No generic packages. We price based on exactly what your brand requires to command attention in its market."
        />

        {/* ── Web Development ────────────────────────────────────── */}
        <section
          ref={webSectionRef}
          className="bg-[var(--color-soft-white)] text-[var(--color-obsidian)] section-padding container-padding"
        >
          <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--color-sage)] mb-4 block font-semibold">
                01 / Web Development
              </span>
              <h2 className="font-display text-4xl md:text-6xl leading-tight">Digital Systems.</h2>
            </div>
            <p className="font-sans font-light text-sm text-black/50 max-w-xs leading-relaxed">
              Every project is scoped individually. Request a quote and we'll respond within 24 hours.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            {WEB_PLANS.map((plan, index) => (
              <div
                key={plan.n}
                ref={(el) => { webCardRefs.current[index] = el; }}
                className="h-full"
                style={{ willChange: "transform, opacity" }}
              >
                <div className="relative h-full flex flex-col p-10 md:p-14 rounded-3xl border bg-white/60 border-black/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
                  <div className="mb-10">
                    <span className="font-mono text-[10px] tracking-widest text-[var(--color-sage)] italic">
                      {plan.n}
                    </span>
                  </div>

                  <h3 className="font-display text-3xl md:text-4xl mb-2">{plan.name}</h3>
                  <p className="font-display italic text-lg opacity-60 mb-8 font-light">{plan.tagline}</p>

                  <p className="font-sans font-light text-sm opacity-50 leading-relaxed mb-10 border-b border-black/5 pb-10">
                    {plan.desc}
                  </p>

                  <ul className="space-y-4 mb-12 flex-grow">
                    {plan.includes.map((item) => (
                      <li key={item} className="flex gap-3 items-start">
                        <span className="text-[var(--color-sage)] mt-0.5 shrink-0 text-sm">✓</span>
                        <span className="font-sans font-light text-sm opacity-80">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-10 border-t border-black/5 mt-auto">
                    <p className="font-mono text-[9px] tracking-widest uppercase opacity-40 mb-6">
                      Ideal for: {plan.ideal}
                    </p>
                    <Button
                      href="/contact"
                      variant="primary"
                      className="w-full bg-[var(--color-obsidian)] text-white"
                    >
                      Request a Quote
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Videography ────────────────────────────────────────── */}
        <section
          ref={videoSectionRef}
          className="section-padding container-padding"
        >
          <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--color-sage)] mb-4 block font-light">
                02 / Videography
              </span>
              <h2 className="font-display text-4xl md:text-6xl text-[var(--color-off-white)] leading-tight">
                Visual Storytelling.
              </h2>
            </div>
            <p className="font-sans font-light text-sm text-white/40 max-w-xs leading-relaxed">
              Priced per video or per project. Bundles offer the best per-unit rate for series work.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-8">
            {VIDEO_PLANS.map((plan, index) => (
              <div
                key={plan.n}
                ref={(el) => { videoCardRefs.current[index] = el; }}
                className={`h-full ${plan.featured ? "md:scale-[1.03]" : ""}`}
                style={{ willChange: "transform, opacity" }}
              >
                <div
                  className={`relative h-full flex flex-col rounded-3xl border transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${
                    plan.featured
                      ? "p-10 md:p-12 bg-[var(--color-off-white)] text-[var(--color-obsidian)] border-transparent shadow-2xl"
                      : "p-10 md:p-12 bg-white/[0.04] border-white/10 text-[var(--color-off-white)]"
                  }`}
                >
                  <div className="flex justify-between items-start mb-10">
                    <span className="font-mono text-[10px] tracking-widest text-[var(--color-sage)] italic">
                      {plan.n}
                    </span>
                    {plan.featured && (
                      <span className="bg-[var(--color-sage)] text-white text-[8px] font-mono tracking-widest uppercase px-3 py-1 rounded-full">
                        Best Value
                      </span>
                    )}
                  </div>

                  <h3 className="font-display text-3xl md:text-4xl mb-2">{plan.name}</h3>
                  <p
                    className={`font-display italic text-lg mb-8 font-light ${
                      plan.featured ? "opacity-60" : "opacity-50"
                    }`}
                  >
                    {plan.tagline}
                  </p>

                  <p
                    className={`font-sans font-light text-sm leading-relaxed mb-10 border-b pb-10 ${
                      plan.featured ? "opacity-50 border-black/5" : "opacity-40 border-white/[0.06]"
                    }`}
                  >
                    {plan.desc}
                  </p>

                  <ul className="space-y-4 mb-12 flex-grow">
                    {plan.includes.map((item) => (
                      <li key={item} className="flex gap-3 items-start">
                        <span className="text-[var(--color-sage)] mt-0.5 shrink-0 text-sm">✓</span>
                        <span
                          className={`font-sans font-light text-sm ${
                            plan.featured ? "opacity-80" : "opacity-60"
                          }`}
                        >
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div
                    className={`pt-10 border-t mt-auto ${
                      plan.featured ? "border-black/5" : "border-white/[0.06]"
                    }`}
                  >
                    <p
                      className={`font-mono text-[9px] tracking-widest uppercase mb-6 ${
                        plan.featured ? "opacity-40" : "opacity-30"
                      }`}
                    >
                      Ideal for: {plan.ideal}
                    </p>
                    <Button
                      href="/contact"
                      variant="primary"
                      className={`w-full ${
                        plan.featured ? "bg-[var(--color-obsidian)] text-white" : ""
                      }`}
                    >
                      Request a Quote
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ ────────────────────────────────────────────────── */}
        <section className="container-padding py-40">
          <div className="mb-20">
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--color-sage)] mb-8 block font-light">
              Service Clarity
            </span>
            <h2 className="font-display text-4xl md:text-6xl text-[var(--color-off-white)]">
              Common Questions.
            </h2>
          </div>

          <div className="max-w-4xl" ref={faqRef}>
            {FAQ.map((item, i) => (
              <div key={i} className="border-b border-white/5 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full py-8 flex items-center justify-between text-left group"
                >
                  <h3 className="font-display text-xl md:text-2xl text-[var(--color-off-white)] group-hover:text-[var(--color-sage)] transition-colors duration-300 font-light pr-8">
                    {item.q}
                  </h3>
                  <span
                    className={`text-[var(--color-sage)] shrink-0 transition-transform duration-500 ${
                      openFaq === i ? "rotate-45" : ""
                    }`}
                  >
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

        {/* Immersive CTA */}
        <section 
          ref={ctaSectionRef}
          className="relative flex items-center justify-center h-screen w-full overflow-hidden bg-[var(--color-obsidian)]"
        >
           <div 
             ref={ctaWrapperRef}
             className="absolute inset-0 w-full h-full will-change-transform"
           >
              {/* Background Image */}
              <div className="absolute inset-0 w-full h-full will-change-transform" ref={ctaImageRef}>
                <Image 
                  src="/General/aesth_window.png"
                  alt="Build your digital presence"
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
              </div>

              {/* Text Content */}
              <div 
                ref={ctaTextRef}
                className="absolute inset-0 flex flex-col items-center justify-end text-center p-8 pb-32 md:p-20 md:pb-40 opacity-0 translate-y-12 will-change-transform"
              >
                 <span className="font-mono text-[10px] md:text-[12px] tracking-[0.4em] uppercase text-[var(--color-sage)] mb-6 md:mb-8 font-semibold">
                   Next Steps
                 </span>
                 <h2 className="font-display text-4xl md:text-7xl lg:text-8xl mb-12 leading-[1.05] tracking-tight max-w-4xl text-white drop-shadow-2xl">
                   Engineering <br/><em className="italic font-light">Authority.</em>
                 </h2>
                 <Button href="/contact" variant="primary" className="scale-110 md:scale-125 hover:scale-125 transition-transform duration-300">
                   Request a Quote
                 </Button>
              </div>
           </div>
        </section>
      </div>
    </PageWrapper>
  );
}
