"use client";

import PageWrapper from "@/components/layout/PageWrapper";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRef, useLayoutEffect } from "react";
import { gsap, ScrollTrigger } from "@/utils/gsap";

const SERVICES = [
  {
    id: "web-development",
    number: "01",
    title: "Web Development",
    description: "Digital systems built for performance, not just decoration. We engineer high-end digital experiences using modern, scalable architectures that load instantly and interact seamlessly. From headless commerce to bespoke marketing platforms, every line of code is intentional.",
    image: "/Solutions/Web Dev/aesth_brand_experiences.png",
    href: "/services/web-development",
    features: ["Bespoke Architecture", "Performance Engineering", "E-commerce Solutions", "Interactive Experiences"]
  },
  {
    id: "videography",
    number: "02",
    title: "Videography",
    description: "Cinematic visual assets that command attention and build undeniable authority. We craft visual narratives with a documentary eye and high-end production polish. Not just moving pictures, but strategic storytelling designed for the digital age.",
    image: "/Solutions/Videography/aesth_product_showcase.png",
    href: "/services/videography",
    features: ["Brand Storytelling", "Cinematic Production", "Social Content", "Documentary Style"]
  }
];

export default function ServicesPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const serviceRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageWrappersRef = useRef<(HTMLDivElement | null)[]>([]);
  const philosophyRef = useRef<HTMLDivElement>(null);
  const ctaSectionRef = useRef<HTMLDivElement>(null);
  const ctaWrapperRef = useRef<HTMLDivElement>(null);
  const ctaImageRef = useRef<HTMLDivElement>(null);
  const ctaTextRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Service Cards — text entrance only; image is always visible
      serviceRefs.current.forEach((el, i) => {
        if (!el) return;

        gsap.fromTo(
          el,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );

        // Image Parallax (image container stays visible; only the inner wrapper moves)
        const imgWrapper = imageWrappersRef.current[i];
        if (imgWrapper) {
          gsap.fromTo(
            imgWrapper,
            { yPercent: -15 },
            {
              yPercent: 15,
              ease: "none",
              scrollTrigger: {
                trigger: imgWrapper.closest(".service-block") ?? el,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          );
        }
      });

      // 2. Philosophy Section Entrance
      if (philosophyRef.current) {
        gsap.fromTo(
          philosophyRef.current,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: philosophyRef.current,
              start: "top 80%",
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
        subtitle="Services"
        title="Our Disciplines"
        description="We don't do everything. We specialize in two core disciplines, combining technical precision with visual storytelling to build brands that refuse to be ignored."
      />

      <section className="container-padding pb-56">
        <div className="grid grid-cols-1 gap-32 md:gap-56">
          {SERVICES.map((service, index) => (
            <div
              key={service.id}
              className={`service-block flex flex-col ${index % 2 === 0 ? "md:flex-row-reverse" : "md:flex-row"} gap-16 md:gap-32 items-center`}
            >
              {/* Text Container — first in DOM so it sits on top in mobile flex-col */}
              <div
                ref={el => { serviceRefs.current[index] = el; }}
                className="flex-1 flex flex-col items-start max-w-xl"
              >
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

              {/* Image Container — always visible (no opacity animation) */}
              <div className="flex-1 w-full aspect-[4/5] md:aspect-square relative overflow-hidden group rounded-2xl bg-[#050505]">
                <div
                  ref={el => { imageWrappersRef.current[index] = el; }}
                  className="absolute top-[-20%] left-0 w-full h-[140%] will-change-transform"
                >
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-500" />
                <span className="absolute top-8 left-8 font-display text-7xl md:text-9xl opacity-10 pointer-events-none select-none">
                  {service.number}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="bg-[var(--color-soft-white)] text-[var(--color-obsidian)] section-padding container-padding">
        <div className="max-w-4xl mx-auto" ref={philosophyRef}>
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
                src="/General/aesth_corner_office.png"
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

