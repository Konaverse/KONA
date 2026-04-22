"use client";

import PageWrapper from "@/components/layout/PageWrapper";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const CATEGORIES = [
  {
    id: "web-development",
    title: "Web Development",
    count: "06 Engineered Projects",
    image: "/Projects/tdk_macbook.png",
    href: "/projects/web-development",
    description: "Technical precision meets editorial design. A curation of performant, high-end web experiences designed for undeniable market authority."
  },
  {
    id: "videography",
    title: "Videography",
    count: "04 Cinematic Films",
    image: "/General/videography_aesthetic..png",
    href: "/projects/videography",
    description: "Cinematic storytelling and brand narratives. Visual assets that command attention and build trust through atmospheric production."
  }
];

export default function ProjectsPage() {
  return (
    <PageWrapper theme="dark">
      <PageHeader
        subtitle="Work"
        title="Selected Archives"
        description="A curation of our recent work across web engineering and cinematic production. Built with intent, delivered with precision."
      />

      <section className="container-padding pb-40">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
          {CATEGORIES.map((cat) => (
            <Link 
              key={cat.id}
              href={cat.href}
              className="group flex flex-col no-underline text-inherit"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl mb-10 flex items-center justify-center bg-[var(--color-obsidian)] shadow-2xl">
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="object-cover opacity-50 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-x-0 bottom-0 p-12 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end">
                   <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-[var(--color-sage)] mb-4">{cat.count}</span>
                   <h2 className="font-display text-4xl md:text-7xl leading-none">{cat.title}</h2>
                </div>
              </div>
              <div className="max-w-sm">
                <p className="font-sans font-light text-xl text-white/50 leading-relaxed mb-10">
                  {cat.description}
                </p>
                <span className="inline-flex items-center gap-4 font-mono text-[10px] tracking-[0.3em] uppercase text-white/80 group-hover:text-[var(--color-sage)] transition-colors duration-300">
                  Enter Archive
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                    <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section-padding container-padding border-t border-white/5 text-center flex flex-col items-center">
         <h3 className="font-display text-4xl md:text-7xl italic text-[var(--color-pale-warm)] max-w-5xl leading-[1.1] mb-16">
           "We don't just deliver projects; we build the <em className="not-italic text-white">presence</em> your brand deserves."
         </h3>
         <Button href="/contact" variant="primary">
           Start Your Story
         </Button>
      </section>
    </PageWrapper>
  );
}
