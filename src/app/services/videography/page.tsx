"use client";

import PageWrapper from "@/components/layout/PageWrapper";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRef, useLayoutEffect } from "react";
import { gsap, ScrollTrigger } from "@/utils/gsap";

const CAPABILITIES = [
  {
    title: "Brand Narratives",
    description: "Deep-dive films that capture the essence of your business. We move beyond testimonials to create emotional connections with your audience through cinematic storytelling.",
    image: "/Solutions/Videography/aesth_brand_narratives.png"
  },
  {
    title: "Product Showcases",
    description: "High-end product reveals and demonstrations that highlight craftsmanship and quality. We use lighting and motion to make your offerings impossible to ignore.",
    image: "/Solutions/Videography/aesth_product_showcase.png"
  },
  {
    title: "Editorial & Lifestyle",
    description: "Atmospheric content designed for social presence. We capture the 'vibe' of your space or service with an eye for detail and high production value.",
    image: "/Solutions/Videography/aesth_editorial_style.png"
  },
  {
    title: "Post-Production",
    description: "Expert editing, color grading, and sound design. We give every project a custom look and rhythm that aligns with your brand's unique character.",
    image: "/Solutions/Videography/aesth_post_production.png"
  }
];

export default function VideographyService() {
  // Scrollytelling Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const desktopImagesRef = useRef<(HTMLDivElement | null)[]>([]);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileImagesRef = useRef<(HTMLDivElement | null)[]>([]);

  // CTA Refs
  const mainRef = useRef<HTMLDivElement>(null);
  const ctaSectionRef = useRef<HTMLElement>(null);
  const ctaWrapperRef = useRef<HTMLDivElement>(null);
  const ctaImageRef = useRef<HTMLDivElement>(null);
  const ctaTextRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      let currentImageIndex = -1;

      // Desktop Sticky Images Logic
      textRefs.current.forEach((textEl, i) => {
        if (!textEl || !desktopImagesRef.current[i]) return;

        ScrollTrigger.create({
          trigger: textEl,
          start: "top center",
          end: "bottom center",
          onEnter: () => {
            if (currentImageIndex !== i) {
              gsap.to(desktopImagesRef.current[i], { opacity: 1, zIndex: 1, duration: 0.6, ease: "power2.out" });
              if (currentImageIndex >= 0 && desktopImagesRef.current[currentImageIndex]) {
                 gsap.to(desktopImagesRef.current[currentImageIndex], { opacity: 0, zIndex: 0, duration: 0.6, ease: "power2.out" });
              }
              currentImageIndex = i;
            }
          },
          onEnterBack: () => {
            if (currentImageIndex !== i) {
              gsap.to(desktopImagesRef.current[i], { opacity: 1, zIndex: 1, duration: 0.6, ease: "power2.out" });
              if (currentImageIndex >= 0 && desktopImagesRef.current[currentImageIndex]) {
                 gsap.to(desktopImagesRef.current[currentImageIndex], { opacity: 0, zIndex: 0, duration: 0.6, ease: "power2.out" });
              }
              currentImageIndex = i;
            }
          }
        });
      });

      // Desktop Parallax for active image
      desktopImagesRef.current.forEach((imgEl) => {
         if (!imgEl) return;
         const innerImage = imgEl.querySelector('.parallax-img');
         if (innerImage) {
            gsap.fromTo(innerImage, 
              { yPercent: -10 },
              { 
                yPercent: 10,
                ease: "none",
                scrollTrigger: {
                   trigger: containerRef.current,
                   start: "top bottom",
                   end: "bottom top",
                   scrub: true,
                }
              }
            );
         }
      });

      // Mobile Parallax
      mobileImagesRef.current.forEach((imgEl) => {
        if (!imgEl) return;
        const innerImage = imgEl.querySelector('.parallax-img');
        if (innerImage) {
          gsap.fromTo(innerImage,
            { yPercent: -15 },
            {
              yPercent: 15,
              ease: "none",
              scrollTrigger: {
                trigger: imgEl,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              }
            }
          );
        }
      });

      // CTA Animation
      if (ctaSectionRef.current && ctaWrapperRef.current && ctaImageRef.current && ctaTextRef.current) {
        const isMobile = window.innerWidth < 768;

        // Global Entrance Animations
        gsap.utils.toArray<HTMLElement>(".fade-up").forEach((el) => {
          gsap.fromTo(el, 
            { opacity: 0, y: 40 },
            { 
              opacity: 1, 
              y: 0, 
              duration: 1, 
              ease: "power3.out", 
              scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none reverse"
              } 
            }
          );
        });

        // Global Parallax Backgrounds
        gsap.utils.toArray<HTMLElement>(".parallax-bg").forEach((el) => {
          const parent = el.parentElement;
          if (parent) {
            gsap.fromTo(el,
              { yPercent: -10 },
              {
                yPercent: 10,
                ease: "none",
                scrollTrigger: {
                  trigger: parent,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                }
              }
            );
          }
        });

        
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ctaSectionRef.current,
            start: "top bottom", 
            end: "center center", 
            scrub: true,
          }
        });

        // Expand clip-path
        tl.fromTo(ctaWrapperRef.current,
          { clipPath: isMobile ? "inset(15% 5% 15% 5% round 2rem)" : "inset(20% 15% 20% 15% round 3rem)" },
          { clipPath: "inset(0% 0% 0% 0% round 0rem)", ease: "power2.inOut" }
        );

        // Zoom out image
        tl.fromTo(ctaImageRef.current,
          { scale: 1.2 },
          { scale: 1, ease: "power2.inOut" },
          "<"
        );

        // Reveal Text
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
    }, { scope: mainRef });
    
    return () => ctx.revert();
  }, []);

  return (
    <PageWrapper theme="dark">
      <div ref={mainRef}>
      <PageHeader
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
          <h2 className="font-display fade-up text-4xl md:text-6xl mb-12 leading-[1.1]">
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

      {/* Capabilities Section - Image Parallax */}
      <section className="bg-[var(--color-soft-white)] text-[var(--color-obsidian)] py-20 md:py-40">
        <div className="container-padding">
          <div className="mb-20">
             <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--color-sage)] mb-8 block font-semibold">
              Capabilities
            </span>
            <h2 className="font-display fade-up text-4xl md:text-6xl tracking-tight">Visual Mastery</h2>
          </div>
        </div>

        <div className="container-padding">
           <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 relative" ref={containerRef}>
              
              {/* Desktop Sticky Images Container */}
              <div className="hidden lg:block w-1/2 sticky top-40 h-[60vh] rounded-3xl overflow-hidden shadow-2xl">
                 {CAPABILITIES.map((cap, i) => (
                    <div 
                      key={`desktop-img-${i}`}
                      ref={el => { desktopImagesRef.current[i] = el; }}
                      className="absolute inset-0 opacity-0 will-change-transform"
                      style={{ zIndex: i === 0 ? 1 : 0, opacity: i === 0 ? 1 : 0 }}
                    >
                      <div className="parallax-img absolute inset-[-10%] w-[120%] h-[120%]">
                        <Image
                           src={cap.image!}
                           alt={cap.title}
                           fill
                           className="object-cover"
                           sizes="50vw"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/10" />
                    </div>
                 ))}
              </div>

              {/* Text Content */}
              <div className="w-full lg:w-1/2 flex flex-col">
                 {CAPABILITIES.map((cap, i) => (
                   <div 
                     key={`text-${i}`}
                     ref={el => { textRefs.current[i] = el; }}
                     className="flex flex-col justify-center min-h-[50vh] lg:min-h-[70vh] py-16 lg:py-0 border-b border-black/10 last:border-0"
                   >
                     {/* Mobile Image (Visible only on mobile) */}
                     <div 
                        ref={el => { mobileImagesRef.current[i] = el; }}
                        className="block lg:hidden w-full aspect-[4/5] relative rounded-2xl overflow-hidden mb-12 shadow-xl"
                     >
                        <div className="parallax-img absolute inset-[-15%] w-[130%] h-[130%]">
                          <Image
                             src={cap.image!}
                             alt={cap.title}
                             fill
                             className="object-cover"
                             sizes="100vw"
                          />
                        </div>
                        <div className="absolute inset-0 bg-black/10" />
                     </div>

                     <span className="font-mono text-[10px] tracking-widest uppercase text-[var(--color-sage)] mb-6">{`0${i + 1}`}</span>
                     <h3 className="font-display fade-up text-3xl md:text-5xl mb-6 tracking-tight">{cap.title}</h3>
                     <p className="font-sans font-light fade-up text-lg md:text-xl text-black/70 leading-relaxed max-w-lg">
                       {cap.description}
                     </p>
                   </div>
                 ))}
              </div>

           </div>
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
            <h3 className="font-display fade-up text-3xl md:text-4xl mb-8 leading-tight italic text-[var(--color-pale-warm)]">
              "Every frame is an opportunity to build trust."
            </h3>
            <p className="font-sans font-light fade-up text-lg text-white/50 leading-relaxed">
              We utilize high-end cinematic equipment and advanced post-production techniques to ensure your visual assets are of the highest caliber.
            </p>
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
                src="/Solutions/Videography/aesth_projector.png"
                alt="Start the Conversation"
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
                 Let's Talk
               </span>
               <h2 className="font-display fade-up text-4xl md:text-7xl lg:text-8xl mb-12 leading-[1.05] tracking-tight max-w-4xl text-white drop-shadow-2xl">
                 Cinematic <br/><em className="italic font-light">Authority.</em>
               </h2>
               <Button href="/contact" variant="primary" className="scale-110 md:scale-125 hover:scale-125 transition-transform duration-300">
                 Start the Conversation
               </Button>
            </div>
         </div>
      </section>
    </div>
    </PageWrapper>
  );
}
