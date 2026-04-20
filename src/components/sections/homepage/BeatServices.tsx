"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import ArchiveLabel from "@/components/ui/ArchiveLabel";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { EASE_OUT_EXPO } from "@/lib/motion";

type Service = {
  ref: string;
  title: string;
  summary: string;
  image: string;
  href: string;
};

const SERVICES: Service[] = [
  {
    ref: "04_01",
    title: "Web Development",
    summary: "Marketing sites that convert, not brochures that decorate.",
    image: "/Solutions/web-development.jpg",
    href: "/solutions/web-development",
  },
  {
    ref: "04_02",
    title: "Web Applications",
    summary: "Operator tools, dashboards, and custom systems built in-house.",
    image: "/Solutions/web-applications.jpg",
    href: "/solutions/web-applications",
  },
  {
    ref: "04_03",
    title: "Videography",
    summary: "Cinematic brand films and short-form that carries frame-by-frame.",
    image: "/Solutions/videography.jpg",
    href: "/solutions/videography",
  },
  {
    ref: "04_04",
    title: "Digital Advertising",
    summary: "Paid campaigns engineered for attention, not vanity metrics.",
    image: "/Solutions/digital-advertising.jpg",
    href: "/solutions/digital-advertising",
  },
  {
    ref: "04_05",
    title: "Social Media",
    summary: "A feed with a point of view. Content that earns the scroll.",
    image: "/Solutions/social-media.jpg",
    href: "/solutions/social-media",
  },
];

function ServiceCard({ service, index, cardClass }: { service: Service; index: number; cardClass?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.9, ease: EASE_OUT_EXPO, delay: (index % 3) * 0.1 }}
      className="group relative"
    >
      <Link
        href={service.href}
        data-cursor="hover"
        className="block focus:outline-none"
      >
        <div
          className={`relative overflow-hidden transition-colors duration-500 aspect-[3/4] md:aspect-auto ${cardClass ?? ""}`}
          style={{
            borderRadius: "var(--radius-card)",
            border: "1px solid var(--color-border-dark)",
            background: "var(--color-surface)",
          }}
        >
          <Image
            src={service.image}
            alt=""
            fill
            className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 90vw"
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.85) 100%)",
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(ellipse at 50% 100%, rgba(0,255,136,0.16) 0%, transparent 60%)",
            }}
          />

          <div className="absolute top-5 left-5 right-5 flex items-start justify-between">
            <span
              className="text-[10px] tracking-[0.32em] uppercase"
              style={{
                fontFamily: "var(--font-geist-mono), monospace",
                color: "rgba(255,255,255,0.55)",
              }}
            >
              {service.ref}
            </span>
            <span
              aria-hidden
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-border-dark)] transition-colors duration-500 group-hover:border-[var(--color-green-neon)]"
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                className="transition-transform duration-500 group-hover:translate-x-[2px] group-hover:-translate-y-[2px]"
              >
                <path
                  d="M1 9L9 1M9 1H3M9 1V7"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ color: "var(--color-text-primary-dark)" }}
                />
              </svg>
            </span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-7">
            <div
              className="h-px w-10 mb-4 origin-left scale-x-100 transition-all duration-500 group-hover:w-20"
              style={{ background: "var(--color-green-neon)", opacity: 0.7 }}
            />
            <h3
              className="leading-[1.0]"
              style={{
                fontFamily: "var(--font-display-serif), serif",
                fontWeight: 300,
                fontSize: "clamp(26px, 2.4vw, 38px)",
                letterSpacing: "-0.02em",
                color: "var(--color-text-primary-dark)",
              }}
            >
              {service.title}
            </h3>
            <p
              className="mt-2 text-sm max-w-sm leading-relaxed"
              style={{
                fontFamily: "var(--font-geist-sans), sans-serif",
                fontWeight: 300,
                color: "rgba(255,255,255,0.68)",
              }}
            >
              {service.summary}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function BeatServices() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        background: "var(--color-black)",
        paddingTop: "14vh",
        paddingBottom: "14vh",
      }}
    >
      <div className="relative z-[2] mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16 md:mb-24">
          <div>
            <ArchiveLabel ref="04 / WORK" />
            <ScrollReveal>
              <h2
                className="mt-6 leading-[0.95]"
                style={{
                  fontFamily: "var(--font-display-serif), serif",
                  fontWeight: 200,
                  fontSize: "clamp(40px, 5.6vw, 92px)",
                  letterSpacing: "-0.025em",
                  color: "var(--color-text-primary-dark)",
                }}
              >
                What we make.
              </h2>
            </ScrollReveal>
          </div>
          <ScrollReveal>
            <p
              className="max-w-md text-sm md:text-base leading-relaxed"
              style={{
                fontFamily: "var(--font-geist-sans), sans-serif",
                fontWeight: 300,
                color: "var(--color-text-muted-dark)",
              }}
            >
              Five disciplines, one studio. Every deliverable passes through both
              of us before it leaves the building.
            </p>
          </ScrollReveal>
        </div>

        {/* Row 1: 3 equal portrait cards — Row 2: 2 landscape cards */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          <div className="md:col-span-4">
            <ServiceCard service={SERVICES[0]} index={0} cardClass="md:h-[480px]" />
          </div>
          <div className="md:col-span-4">
            <ServiceCard service={SERVICES[1]} index={1} cardClass="md:h-[480px]" />
          </div>
          <div className="md:col-span-4">
            <ServiceCard service={SERVICES[2]} index={2} cardClass="md:h-[480px]" />
          </div>
          <div className="md:col-span-6">
            <ServiceCard service={SERVICES[3]} index={3} cardClass="md:h-[360px]" />
          </div>
          <div className="md:col-span-6">
            <ServiceCard service={SERVICES[4]} index={4} cardClass="md:h-[360px]" />
          </div>
        </div>
      </div>
    </section>
  );
}
