"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/utils/gsap";
import { Button } from "@/components/ui/button";
import TransitionLink from "@/components/layout/TransitionLink";

const ACCENT = "#6B7F62";

const SERVICES = [
  { label: "Web Development", href: "/services/web-development" },
  { label: "Videography", href: "/services/videography" },
];

const PROJECTS = [
  { label: "Web Development Projects", href: "/projects/web-development" },
  { label: "Videography Projects", href: "/projects/videography" },
];

const STUDIO = [
  { label: "About", href: "/about" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

const LEGAL = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Use", href: "/terms" },
  { label: "Cookie Policy", href: "/cookies" },
];

const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/konaverse.cy/" },
  { label: "Facebook", href: "https://www.facebook.com/konaverse" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/konaverse" },
];

function FooterCol({
  heading,
  links,
  accentHover = false,
}: {
  heading: string;
  links: { label: string; href: string }[];
  accentHover?: boolean;
}) {
  return (
    <div className="footer-link-col flex flex-col space-y-4 md:space-y-6">
      <h4 className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] uppercase text-white/30">
        <span className="inline-block w-3 h-px shrink-0" style={{ background: ACCENT, opacity: 0.55 }} />
        {heading}
      </h4>
      <ul className="flex flex-col space-y-2 md:space-y-3">
        {links.map((link) => {
          const isExternal = link.href.startsWith("http");
          const LinkComponent = isExternal ? "a" : TransitionLink;
          
          return (
            <li key={link.label}>
              <LinkComponent
                href={link.href}
                className="group/link relative inline-block font-sans text-sm font-light text-white/60 transition-colors duration-300"
                onMouseEnter={(e: React.MouseEvent) => {
                  (e.currentTarget as HTMLElement).style.color = accentHover ? ACCENT : "rgba(255,255,255,0.9)";
                }}
                onMouseLeave={(e: React.MouseEvent) => {
                  (e.currentTarget as HTMLElement).style.color = "";
                }}
                {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {link.label}
                <span
                  className="absolute bottom-[-2px] left-0 h-px w-0 group-hover/link:w-full transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{ background: accentHover ? ACCENT : "rgba(255,255,255,0.2)" }}
                />
              </LinkComponent>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function FooterSection() {
  const footerRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!footerRef.current || !innerRef.current) return;

    // Refresh ScrollTrigger after a short delay to ensure page height is settled
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Desktop: full-range parallax reveal with smoothing
      mm.add("(min-width: 768px)", () => {
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
              scrub: 1.5,
              invalidateOnRefresh: true,
            },
          }
        );
      });

      // Mobile: subtle lift-in instead of full parallax to avoid jank
      mm.add("(max-width: 767px)", () => {
        gsap.fromTo(
          innerRef.current,
          { yPercent: -12 },
          {
            yPercent: 0,
            ease: "none",
            scrollTrigger: {
              trigger: footerRef.current,
              start: "top bottom",
              end: "bottom bottom",
              scrub: 1,
              invalidateOnRefresh: true,
            },
          }
        );
      });

      // Hide navbar when footer becomes prominent
      const navbar = document.querySelector("#global-navbar");
      if (navbar) {
        ScrollTrigger.create({
          trigger: footerRef.current,
          start: "top 80%",
          onEnter: () => gsap.to(navbar, { y: -150, duration: 0.5, ease: "power3.inOut" }),
          onLeaveBack: () => gsap.to(navbar, { y: 0, duration: 0.5, ease: "power3.inOut" }),
        });
      }

      const once = { toggleActions: "play none none none" as const };

      gsap.fromTo(
        ".footer-brand",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: footerRef.current, start: "top 45%", ...once } }
      );

      gsap.fromTo(
        ".footer-link-col",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", stagger: 0.1, scrollTrigger: { trigger: footerRef.current, start: "top 42%", ...once } }
      );

      gsap.fromTo(
        ".footer-tagline",
        { y: 55, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.4, ease: "power4.out", scrollTrigger: { trigger: footerRef.current, start: "top 35%", ...once } }
      );

      gsap.fromTo(
        ".footer-email-block",
        { x: 30, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.15, scrollTrigger: { trigger: footerRef.current, start: "top 35%", ...once } }
      );

      gsap.fromTo(
        ".footer-bottom-bar",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: 0.25, scrollTrigger: { trigger: footerRef.current, start: "top 28%", ...once } }
      );
    }, footerRef);

    return () => {
      ctx.revert();
      clearTimeout(timer);
    };
  }, [pathname]);

  return (
    <footer
      ref={footerRef}
      className="relative w-full h-[100dvh] bg-[#050505] overflow-hidden flex flex-col"
      style={{
        marginTop: "-1px",
        boxShadow: "0 -2px 0 0 #050505",
      }}
    >
      {/* Ambient glows */}
      <div className="absolute bottom-[-20%] left-[-10%] w-[55vw] h-[55vw] bg-[#6B7F62]/12 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-[-15%] right-[-8%] w-[40vw] h-[40vw] bg-[#6B7F62]/7 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(107,127,98,0.04)_0%,transparent_70%)] pointer-events-none" />

      {/* Inner Parallax Wrapper */}
      <div
        ref={innerRef}
        className="absolute inset-0 w-full h-full flex flex-col justify-between pt-12 md:pt-24 pb-5 md:pb-8 px-5 sm:px-8 md:px-12 lg:px-24 will-change-transform z-10"
      >
        {/* Top section: brand + links */}
        <div className="flex flex-col lg:flex-row justify-between w-full gap-7 md:gap-10 lg:gap-0 lg:pb-10">

          {/* Brand */}
          <div className="footer-brand flex flex-col shrink-0 lg:max-w-sm">
            <div className="relative w-32 md:w-40 h-12 md:h-16 mb-5 md:mb-8">
              <Image
                src="/About/Logo 21.png"
                alt="Konaverse"
                fill
                className="object-contain object-left opacity-90"
              />
            </div>

            <p className="font-sans text-sm text-white/45 leading-relaxed font-light mb-5 md:mb-10 max-w-xs lg:max-w-none">
              We are a creative studio based in Cyprus, specializing in bringing ambitious ideas to the digital space through structural code and cinematic visuals.
            </p>

            <div>
              <Button href="/contact" variant="primary">
                Get in touch
              </Button>
            </div>
          </div>

          {/* Links grid — 2 cols on mobile, 4 on md+ */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-7 md:gap-y-12 gap-x-5 sm:gap-x-8 lg:gap-x-16 lg:ml-12 w-full lg:max-w-3xl">
            <FooterCol heading="Services" links={SERVICES} />
            <FooterCol heading="Projects" links={PROJECTS} />
            <FooterCol heading="Studio" links={STUDIO} />
            <div className="flex flex-col gap-7 md:gap-12">
              <FooterCol heading="Follow" links={SOCIALS} accentHover />
              <FooterCol heading="Legal" links={LEGAL} />
            </div>
          </div>
        </div>

        {/* Bottom section: tagline + email + copyright */}
        <div className="flex flex-col w-full mt-auto">
          {/* Tagline + Email */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-5 md:mb-10 lg:mb-14 gap-4 md:gap-10">
            <h2 className="footer-tagline font-display font-light text-[6vw] sm:text-[5.5vw] md:text-[3.5vw] uppercase leading-[0.9] tracking-[-0.02em] text-[#f0ede8] opacity-90">
              With Konaverse,<br />
              There is no limitation.
            </h2>

            <div className="footer-email-block flex flex-col sm:items-end shrink-0">
              <h4 className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/30 mb-2 md:mb-3">
                General Inquiries
              </h4>
              <a
                href="mailto:info@kona-verse.com"
                className="group/email relative font-mono text-xs sm:text-base md:text-2xl tracking-wider md:tracking-widest text-[#6B7F62] hover:text-white transition-colors duration-400 inline-block pb-1 md:pb-2 w-max"
              >
                INFO@KONA-VERSE.COM
                <span className="absolute bottom-0 left-0 h-[1.5px] w-0 group-hover/email:w-full transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] bg-white/35" />
              </a>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="footer-bottom-bar flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-6 pt-4 md:pt-6 border-t border-white/[0.07] w-full text-white/25 font-mono text-[9px] md:text-[10px] tracking-[0.12em] md:tracking-[0.15em] uppercase">
            <p className="order-2 sm:order-1">© {new Date().getFullYear()} KONAVERSE. ALL RIGHTS RESERVED.</p>
            <div className="flex items-center gap-5 md:gap-8 order-1 sm:order-2">
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
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]">
        <div className="absolute left-[16.666%] top-0 bottom-0 w-px bg-white" />
        <div className="absolute left-[33.333%] top-0 bottom-0 w-px bg-white" />
        <div className="absolute left-[50%] top-0 bottom-0 w-px bg-white" />
        <div className="absolute left-[66.666%] top-0 bottom-0 w-px bg-white" />
        <div className="absolute left-[83.333%] top-0 bottom-0 w-px bg-white" />
      </div>
    </footer>
  );
}
