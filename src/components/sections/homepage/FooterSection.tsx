"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/utils/gsap";
import { Button } from "@/components/ui/button";

const ACCENT = "#6B7F62";

const SERVICES = [
  { label: "Web Design", href: "/services/web-design" },
  { label: "Web Development", href: "/services/web-development" },
  { label: "Videography", href: "/services/videography" },
  { label: "Video Editing", href: "/services/video-editing" },
  { label: "SEO & Strategy", href: "/services/seo" },
];

const PROJECTS = [
  { label: "All Work", href: "/work" },
  { label: "Web Projects", href: "/work?filter=web" },
  { label: "Film Projects", href: "/work?filter=film" },
  { label: "Branding", href: "/work?filter=brand" },
];

const STUDIO = [
  { label: "About", href: "/about" },
  { label: "Process", href: "/process" },
  { label: "Contact", href: "/contact" },
];

const LEGAL = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Use", href: "/terms" },
];

const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Vimeo", href: "https://vimeo.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "X / Twitter", href: "https://x.com" },
];

// Reusable column component
function FooterCol({ heading, links, accentHover = false }: { heading: string; links: { label: string; href: string }[]; accentHover?: boolean }) {
  return (
    <div className="flex flex-col space-y-6">
      <h4 className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/30">
        {heading}
      </h4>
      <ul className="flex flex-col space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="font-sans text-sm font-light text-white/60 hover:text-white transition-colors duration-300"
              style={accentHover ? { transition: "color 0.3s" } : {}}
              onMouseEnter={(e) => accentHover && (e.currentTarget.style.color = ACCENT)}
              onMouseLeave={(e) => accentHover && (e.currentTarget.style.color = "")}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function FooterSection() {
  const footerRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  // GSAP Reveal Animation (stuck behind previous content)
  useEffect(() => {
    if (!footerRef.current || !innerRef.current) return;

    const ctx = gsap.context(() => {
      // True faux-sticky parallax reveal effect using exact element percentages
      gsap.fromTo(
        innerRef.current,
        { yPercent: -100 }, 
        {
          yPercent: 0,
          ease: "none",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top bottom",
            end: "bottom bottom",
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );

      // Hide the global navbar using fixed pixels.
      // Must use document.querySelector because the context is scoped to footerRef
      const navbar = document.querySelector("#global-navbar");
      if (navbar) {
        ScrollTrigger.create({
          trigger: footerRef.current,
          start: "top 80%",
          onEnter: () => gsap.to(navbar, { y: -150, duration: 0.5, ease: "power3.inOut" }),
          onLeaveBack: () => gsap.to(navbar, { y: 0, duration: 0.5, ease: "power3.inOut" }),
        });
      }
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative w-full h-[100dvh] bg-[#050505] overflow-hidden flex flex-col"
      style={{ 
        marginTop: "-1px", 
        // ── This shadow prevents the subpixel "white line/beige line" rounding error gap from the previous section
        boxShadow: "0 -2px 0 0 #050505" 
      }}
    >
      {/* ── Ambient Glows ── */}
      <div className="absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-[#6B7F62]/10 blur-[120px] rounded-full pointer-events-none" />

      {/* ── Inner Parallax Wrapper ── */}
      <div 
        ref={innerRef} 
        className="absolute inset-0 w-full h-[100dvh] flex flex-col justify-between pt-16 md:pt-24 pb-8 px-6 md:px-12 lg:px-24 will-change-transform z-10"
      >
        {/* ── Top Half: Master Layout ── */}
        <div className="flex flex-col lg:flex-row justify-between w-full h-full pb-10">
          
          {/* ── Left Column: Brand, Desc, Contacts & CTA ── */}
          <div className="flex flex-col max-w-sm shrink-0">
            {/* Logo */}
            <div className="relative w-40 h-10 mb-8">
              <Image
                src="/About/KonaLogoNoBg.png"
                alt="Konaverse"
                fill
                className="object-contain object-left opacity-90"
              />
            </div>

            {/* Description */}
            <p className="font-sans text-sm text-white/50 leading-relaxed font-light mb-12">
              We are a creative studio based in Cyprus, specializing in bringing ambitious ideas to the digital space through structural code and cinematic visuals. 
            </p>
            
            {/* Action Block: CTA */}
            <div className="flex flex-col gap-10">
                <div>
                  <Button href="/contact" variant="primary">
                    START A PROJECT
                  </Button>
                </div>
            </div>
          </div>

          {/* ── Right Column: Links Grid ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-8 lg:gap-x-16 mt-16 lg:mt-0 lg:ml-12 w-full lg:max-w-3xl">
            <FooterCol heading="Services" links={SERVICES} />
            <FooterCol heading="Projects" links={PROJECTS} />
            <FooterCol heading="Studio" links={STUDIO} />
            <div className="flex flex-col gap-12">
              <FooterCol heading="Follow" links={SOCIALS} accentHover />
              <FooterCol heading="Legal" links={LEGAL} />
            </div>
          </div>

        </div>

        {/* ── Bottom Half: Tagline & Legal Info ── */}
        <div className="flex flex-col w-full mt-auto">
          {/* Tagline (Left) & Email (Right) */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 lg:mb-12 gap-10">
            <h2 className="font-display font-light text-[8vw] md:text-[3.5vw] uppercase leading-[0.9] tracking-[-0.02em] text-[#f0ede8] opacity-90 max-w-3xl">
              With Konaverse,<br/>
              There is no limitation.
            </h2>

            {/* Action Block: Email moved to bottom right */}
            <div className="flex flex-col md:items-end">
               <h4 className="font-mono text-xs tracking-[0.2em] uppercase text-white/30 mb-3">General Inquiries</h4>
               <a
                 href="mailto:info@kona-verse.com"
                 className="font-mono text-xl md:text-2xl tracking-widest text-[#6B7F62] hover:text-white transition-colors duration-300 inline-block border-b-2 border-transparent hover:border-[#6B7F62]/50 pb-2 w-max"
               >
                 INFO@KONA-VERSE.COM
               </a>
            </div>
          </div>
          
          {/* Bottom Info Footer */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pt-6 border-t border-white/10 w-full text-white/30 font-mono text-[10px] tracking-[0.15em] uppercase">
            <p className="order-2 md:order-1">© {new Date().getFullYear()} KONAVERSE. ALL RIGHTS RESERVED.</p>
            <div className="flex items-center gap-8 order-1 md:order-2">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#6B7F62] animate-pulse" />
                AVAILABLE FOR NEW PROJECTS
              </span>
              <span className="hidden md:inline">CYPRUS</span>
            </div>
          </div>
        </div>

      </div>
      
      {/* Background Architectural Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
         {/* Vertical lines */}
         <div className="absolute left-[16.666%] top-0 bottom-0 w-px bg-white" />
         <div className="absolute left-[33.333%] top-0 bottom-0 w-px bg-white" />
         <div className="absolute left-[50%] top-0 bottom-0 w-px bg-white" />
         <div className="absolute left-[66.666%] top-0 bottom-0 w-px bg-white" />
         <div className="absolute left-[83.333%] top-0 bottom-0 w-px bg-white" />
      </div>

    </footer>
  );
}
