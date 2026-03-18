"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";

const NAV_LINKS = [
  { id: "solutions", label: "Solutions", href: "/solutions" },
  { id: "projects", label: "Projects", href: "/projects/website-projects" },
  { id: "about", label: "About", href: "/about" },
  { id: "contact", label: "Contact", href: "/contact" },
  { id: "pricing", label: "Pricing", href: "/pricing" },
] as const;

function getActiveId(pathname: string): string | null {
  for (const link of NAV_LINKS) {
    if (pathname === link.href || pathname.startsWith(link.href + "/")) return link.id;
    // Match sub-routes for solutions/projects
    if (link.id === "solutions" && pathname.startsWith("/solutions")) return link.id;
    if (link.id === "projects" && pathname.startsWith("/projects")) return link.id;
  }
  return null;
}

export default function HeroNav() {
  const pathname = usePathname();
  const activeId = getActiveId(pathname);
  const [hovered, setHovered] = useState<string | null>(null);

  // Hide on /journey
  if (pathname === "/journey") return null;

  return (
    <motion.nav
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between"
      style={{
        padding: "16px clamp(1.5rem, 4vw, 4rem)",
      }}
    >
      {/* Logo */}
      <Link href="/" className="flex-shrink-0 relative z-10">
        <Image
          src="/KonaLogoNoBg.png"
          alt="Konaverse"
          width={120}
          height={40}
          className="h-8 w-auto brightness-200"
          priority
        />
      </Link>

      {/* Center links */}
      <div className="hidden lg:flex items-center gap-1 rounded-2xl px-1.5 py-1.5"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {NAV_LINKS.map((link) => {
          const isActive = activeId === link.id;
          const isHovered = hovered === link.id;

          return (
            <Link
              key={link.id}
              href={link.href}
              className="relative px-4 py-2 rounded-xl"
              onMouseEnter={() => setHovered(link.id)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Active glassmorphism pill — layoutId drives the sliding animation */}
              {isActive && (
                <motion.div
                  layoutId="globalNavActive"
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    boxShadow:
                      "0 2px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.06)",
                  }}
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}

              {/* Hover glow (non-active) */}
              <AnimatePresence>
                {isHovered && !isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.04)" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  />
                )}
              </AnimatePresence>

              <span
                className="relative z-10 font-mono text-[11px] tracking-[0.12em] uppercase transition-colors duration-200 whitespace-nowrap"
                style={{
                  color: isActive
                    ? "#00ff88"
                    : isHovered
                      ? "rgba(255,255,255,0.9)"
                      : "rgba(255,255,255,0.5)",
                }}
              >
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* CTA — matches "Our Services" Button style, smaller */}
      <div className="hidden lg:block flex-shrink-0 relative z-10">
        <Button href="/contact" variant="primary" size="sm">
          <span style={{ color: "#00ff88" }}>Get a Quote</span>
        </Button>
      </div>

      {/* Mobile hamburger placeholder — TODO: wire up mobile menu */}
      <button
        className="lg:hidden relative z-10 flex flex-col gap-1.5 p-2"
        aria-label="Menu"
      >
        <span className="block w-5 h-px bg-white/70" />
        <span className="block w-3.5 h-px bg-white/50 ml-auto" />
        <span className="block w-5 h-px bg-white/70" />
      </button>
    </motion.nav>
  );
}
