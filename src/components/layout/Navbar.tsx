"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import TransitionLink from "./TransitionLink";

const ACCENT = "#6B7F62";

type DropItem = { label: string; desc: string; href?: string };

const SERVICES: (DropItem & { href: string })[] = [
  { label: "Web Development", desc: "Scalable, secure platforms", href: "/services/web-development" },
  { label: "Videography", desc: "Cinematic brand narratives", href: "/services/videography" },
];

const PROJECTS: (DropItem & { href: string })[] = [
  { label: "Web Development Projects", desc: "Digital Architecture Archive", href: "/projects/web-development" },
  { label: "Videography Projects", desc: "Visual Storytelling Portfolio", href: "/projects/videography" },
];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const NAV_TRANSITION = { duration: 0.9, ease: EASE };

function DropdownItem({ item, index }: { item: DropItem & { href: string }; index: number }) {
  const [hover, setHover] = useState(false);
  return (
    <TransitionLink
      href={item.href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="flex items-center gap-[0.9rem] px-4 py-[0.8rem] no-underline rounded-[10px] transition-[background] duration-300 relative"
      style={{
        background: hover ? "rgba(107,127,98,0.08)" : "transparent",
      }}
    >
      {/* Number */}
      <span
        style={{
          fontFamily: "var(--font-inter), sans-serif",
          fontWeight: 200,
          fontSize: "0.7rem",
          letterSpacing: "0.12em",
          color: hover ? ACCENT : "rgba(240,237,232,0.28)",
          transition: "color 0.3s ease",
          flexShrink: 0,
          width: 18,
        }}
      >
        0{index + 1}
      </span>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: "0.83rem",
            fontWeight: 500,
            color: "#f0ede8",
            fontFamily: "var(--font-jakarta), sans-serif",
            letterSpacing: "0.005em",
            lineHeight: 1.3,
            marginBottom: "0.18rem",
          }}
        >
          {item.label}
        </div>
        <div
          style={{
            fontSize: "0.68rem",
            fontWeight: 300,
            color: "rgba(240,237,232,0.4)",
            fontFamily: "var(--font-jakarta), sans-serif",
            lineHeight: 1.4,
          }}
        >
          {item.desc}
        </div>
      </div>

      {/* Arrow */}
      <motion.span
        animate={{ opacity: hover ? 1 : 0, x: hover ? 0 : -6 }}
        transition={{ duration: 0.25, ease: EASE }}
        style={{
          color: ACCENT,
          fontSize: "0.9rem",
          flexShrink: 0,
          lineHeight: 1,
        }}
      >
        →
      </motion.span>
    </TransitionLink>
  );
}

function Dropdown({
  items,
  cols = 1,
  header,
  footerText,
  footerHref = "/services"
}: {
  items: (DropItem & { href: string })[];
  cols?: number;
  header: string;
  footerText?: string;
  footerHref?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.98 }}
      transition={{ duration: 0.28, ease: EASE }}
      style={{
        position: "absolute",
        top: "100%",
        left: 0,
        paddingTop: 18,
        zIndex: 200,
        minWidth: cols === 2 ? 440 : 300,
      }}
    >
    <div
      style={{
        position: "relative",
        background: "rgba(10,10,14,0.88)",
        backdropFilter: "blur(50px)",
        WebkitBackdropFilter: "blur(50px)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 20,
        padding: "0.55rem",
        boxShadow:
          "0 30px 70px -15px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.03)",
        overflow: "hidden",
      }}
    >
      {/* Accent glow orb */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: -50,
          left: "50%",
          transform: "translateX(-50%)",
          width: 260,
          height: 100,
          background: "rgba(107,127,98,0.18)",
          filter: "blur(50px)",
          pointerEvents: "none",
        }}
      />
      {/* Top sheen */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 20,
          background:
            "linear-gradient(160deg, rgba(255,255,255,0.05) 0%, transparent 45%)",
          pointerEvents: "none",
        }}
      />

      {/* Header row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.8rem",
          padding: "0.7rem 1rem 0.9rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        <span
          style={{
            width: 18,
            height: 1,
            background: ACCENT,
            opacity: 0.6,
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontSize: "0.56rem",
            fontWeight: 500,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: ACCENT,
            fontFamily: "var(--font-jakarta), sans-serif",
          }}
        >
          {header}
        </span>
      </div>

      {/* Items */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: cols === 2 ? "1fr 1fr" : "1fr",
          gap: "2px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {items.map((item, i) => (
          <DropdownItem key={item.label} item={item} index={i} />
        ))}
      </div>

      {/* Footer */}
      {footerText && (
        <div
          style={{
            marginTop: "0.35rem",
            padding: "0.75rem 1rem 0.6rem",
            borderTop: "1px solid rgba(255,255,255,0.05)",
            position: "relative",
            zIndex: 1,
          }}
        >
          <TransitionLink
            href={footerHref}
            className="inline-flex items-center gap-2 text-[0.68rem] font-medium tracking-[0.18em] uppercase text-[rgba(240,237,232,0.65)] no-underline font-sans transition-colors duration-300"
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = ACCENT;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = "rgba(240,237,232,0.65)";
            }}
          >
            {footerText}
            <span style={{ fontSize: "0.85rem", lineHeight: 1 }}>→</span>
          </TransitionLink>
        </div>
      )}
    </div>
    </motion.div>
  );
}

function NavItem({
  label,
  dropdown,
  dropdownCols,
  dropdownHeader,
  dropdownFooter,
  dropdownFooterHref,
  href = "#",
}: {
  label: string;
  dropdown?: (DropItem & { href: string })[];
  dropdownCols?: number;
  dropdownHeader?: string;
  dropdownFooter?: string;
  dropdownFooterHref?: string;
  href?: string;
}) {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const active = hover || open;

  return (
    <div
      ref={ref}
      style={{ position: "relative" }}
      onMouseEnter={() => {
        setHover(true);
        if (dropdown) setOpen(true);
      }}
      onMouseLeave={() => {
        setHover(false);
        if (dropdown) setOpen(false);
      }}
    >
      <TransitionLink
        href={href || "#"}
        className="inline-flex items-center gap-[0.35rem] text-[0.72rem] font-normal tracking-[0.08em] uppercase no-underline font-sans transition-colors duration-300 py-1.5 relative"
        style={{
          color: active ? "#f0ede8" : "rgba(240,237,232,0.62)",
        }}
      >
        {label}
        {dropdown && (
          <motion.svg
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            width={9}
            height={9}
            viewBox="0 0 10 10"
            fill="none"
            style={{ opacity: 0.6, flexShrink: 0 }}
          >
            <path
              d="M2 3.5L5 6.5L8 3.5"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        )}
        {/* Animated underline */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            bottom: 2,
            left: 0,
            right: 0,
            height: 1,
            background: ACCENT,
            transform: active ? "scaleX(1)" : "scaleX(0)",
            transformOrigin: active ? "left" : "right",
            transition:
              "transform 0.45s cubic-bezier(0.25,1,0.32,1), transform-origin 0s",
            boxShadow: active ? "0 0 8px rgba(107,127,98,0.5)" : "none",
          }}
        />
      </TransitionLink>
      <AnimatePresence>
        {open && dropdown && (
          <Dropdown
            items={dropdown}
            cols={dropdownCols}
            header={dropdownHeader ?? label}
            footerText={dropdownFooter}
            footerHref={dropdownFooterHref}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileNavItem({ 
  label, 
  dropdown, 
  itemVariants,
  href,
  onClose
}: { 
  label: string; 
  dropdown?: (DropItem & { href: string })[]; 
  itemVariants?: any;
  href?: string;
  onClose?: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div variants={itemVariants} className="flex flex-col border-b border-white/5 pb-4">
      {dropdown ? (
        <button 
          onClick={() => setOpen(!open)}
          className="flex items-center justify-between w-full text-left outline-none group"
        >
          <span 
            className="text-4xl font-light tracking-wide transition-colors duration-500" 
            style={{ 
              fontFamily: "var(--font-display-serif)",
              color: open ? ACCENT : "#f0ede8"
            }}
          >
            {label}
          </span>
          <motion.svg
            animate={{ rotate: open ? 180 : 0 }}
            width={16}
            height={16}
            viewBox="0 0 10 10"
            fill="none"
            className="transition-colors duration-500"
            style={{ color: open ? ACCENT : "rgba(255,255,255,0.4)" }}
          >
            <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>
        </button>
      ) : (
        <TransitionLink 
          href={href || "#"}
          onClick={onClose}
          className="flex items-center justify-between w-full text-left outline-none group no-underline"
        >
          <span 
            className="text-4xl font-light tracking-wide transition-colors duration-500 hover:text-[var(--color-sage)]" 
            style={{ 
              fontFamily: "var(--font-display-serif)",
              color: "#f0ede8"
            }}
          >
            {label}
          </span>
        </TransitionLink>
      )}

      <AnimatePresence>
        {open && dropdown && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-5 pt-5">
              {dropdown.map((item: any, i) => (
                <TransitionLink 
                  key={item.label} 
                  href={item.href} 
                  onClick={onClose}
                  className="flex flex-col gap-1 opacity-80 hover:opacity-100 transition-opacity no-underline"
                >
                  <span className="text-base font-medium text-[#f0ede8]" style={{ fontFamily: "var(--font-jakarta), sans-serif" }}>{item.label}</span>
                  <span className="text-sm text-white/40" style={{ fontFamily: "var(--font-jakarta), sans-serif" }}>{item.desc}</span>
                </TransitionLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <div
      id="global-navbar"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 90,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <motion.nav
        animate={{
          maxWidth: scrolled ? 920 : 1180,
          marginTop: scrolled ? 24 : 15,
          paddingLeft: scrolled ? 16 : 22,
          paddingRight: scrolled ? 8 : 10,
          borderRadius: scrolled ? 34 : 28,
          backgroundColor: scrolled
            ? "rgba(8,8,10,0.82)"
            : "rgba(8,8,10,0.12)",
          boxShadow: scrolled
            ? "0 12px 40px -10px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)"
            : "0 4px 24px -8px rgba(0,0,0,0.3)",
        }}
        transition={NAV_TRANSITION}
        style={{
          width: "calc(100vw - 40px)",
          paddingTop: 11,
          paddingBottom: 11,
          backdropFilter: "blur(40px)",
          WebkitBackdropFilter: "blur(40px)",
          border: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pointerEvents: "auto",
          position: "relative",
          overflow: "visible",
          zIndex: 50,
        }}
      >
        {/* Top sheen */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            background:
              "linear-gradient(160deg, rgba(255,255,255,0.06) 0%, transparent 50%)",
            pointerEvents: "none",
          }}
        />

        {/* Logo */}
        <TransitionLink
          href="/"
          className="inline-flex items-center no-underline shrink-0 relative z-10"
        >
          <div
            style={{ position: "relative", flexShrink: 0, width: 44, height: 44 }}
          >
            <Image
              src="/About/Logo 21.png"
              alt="Konaverse"
              fill
              className="object-contain"
              sizes="44px"
              priority
            />
          </div>
        </TransitionLink>

        {/* Links */}
        <div
          className="hidden md:flex"
          style={{
            alignItems: "center",
            gap: "2.2rem",
            position: "relative",
            zIndex: 1,
          }}
        >
          <NavItem
            label="Services"
            dropdown={SERVICES}
            dropdownCols={1}
            dropdownHeader="Our Services"
            dropdownFooter="View All Services"
            dropdownFooterHref="/services"
            href="/services"
          />
          <NavItem
            label="Projects"
            dropdown={PROJECTS}
            dropdownHeader="Selected Work"
            dropdownFooter="View All Projects"
            dropdownFooterHref="/projects"
            href="/projects"
          />
          <NavItem label="About" href="/about" />
          <NavItem label="Pricing" href="/pricing" />
        </div>

        {/* CTA */}
        <Button
          href="/contact"
          variant="primary"
          className="hidden md:inline-flex py-[9px] px-5 text-[0.7rem] tracking-[0.11em] shrink-0 relative z-[1]"
        >
          Get in Touch
        </Button>

        {/* Mobile Hamburger Icon */}
        <button
          className="md:hidden flex flex-col justify-center items-center gap-[6px] w-10 h-10 relative z-[100] text-white pointer-events-auto"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <motion.span
            animate={{ rotate: mobileOpen ? 45 : 0, y: mobileOpen ? 7.5 : 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="w-6 h-[1.5px] bg-[#f0ede8] block origin-center"
          />
          <motion.span
            animate={{ opacity: mobileOpen ? 0 : 1 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="w-6 h-[1.5px] bg-[#f0ede8] block"
          />
          <motion.span
            animate={{ rotate: mobileOpen ? -45 : 0, y: mobileOpen ? -7.5 : 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="w-6 h-[1.5px] bg-[#f0ede8] block origin-center"
          />
        </button>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.8, ease: EASE }}
            className="fixed inset-0 z-[40] flex flex-col pt-32 px-8 pb-10 bg-[#08080a] pointer-events-auto md:hidden overflow-hidden"
            style={{ paddingBottom: "env(safe-area-inset-bottom, 40px)" }}
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-0 right-0 h-full w-full overflow-hidden pointer-events-none z-0">
               <div className="absolute top-[-10%] right-[-20%] w-[80vw] h-[80vw] rounded-full" style={{ background: ACCENT, opacity: 0.18, filter: "blur(90px)" }} />
               <div className="absolute bottom-[-10%] left-[-20%] w-[70vw] h-[70vw] rounded-full" style={{ background: ACCENT, opacity: 0.12, filter: "blur(90px)" }} />
            </div>

            {/* Typography Watermark */}
            <div className="absolute left-[-5%] bottom-[12%] opacity-[0.03] pointer-events-none select-none z-0">
              <span style={{ fontFamily: "var(--font-monument), sans-serif", fontSize: "32vw", lineHeight: 0.8, letterSpacing: "0.02em", color: "#ffffff", whiteSpace: "nowrap", textTransform: "uppercase" }}>
                KONA<br/>VERSE
              </span>
            </div>

            <motion.div 
              initial="initial"
              animate="animate"
              exit="exit"
              variants={{
                animate: { transition: { staggerChildren: 0.1, delayChildren: 0.4 } },
                exit: { transition: { staggerChildren: 0.05, staggerDirection: -1 } }
              }}
              className="flex flex-col gap-6 overflow-y-auto mt-4 relative z-10" 
              style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
            >
              <MobileNavItem label="Services" dropdown={SERVICES} href="/services" onClose={() => setMobileOpen(false)} itemVariants={{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } }, exit: { opacity: 0, y: 10 } }} />
              <MobileNavItem label="Projects" dropdown={PROJECTS} href="/projects" onClose={() => setMobileOpen(false)} itemVariants={{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } }, exit: { opacity: 0, y: 10 } }} />
              <MobileNavItem label="About" href="/about" onClose={() => setMobileOpen(false)} itemVariants={{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } }, exit: { opacity: 0, y: 10 } }} />
              <MobileNavItem label="Pricing" href="/pricing" onClose={() => setMobileOpen(false)} itemVariants={{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } }, exit: { opacity: 0, y: 10 } }} />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.7 }}
              className="mt-auto pt-8 relative z-10"
            >
               <TransitionLink
                  href="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex items-center justify-center w-full gap-2 text-sm font-semibold tracking-widest uppercase rounded-[40px] py-[18px] transition-all active:scale-95 no-underline"
                  style={{ fontFamily: "var(--font-jakarta), sans-serif", background: ACCENT, color: "#fff", boxShadow: "0 8px 30px -10px rgba(107,127,98,0.5)" }}
                >
                  Get in Touch
               </TransitionLink>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
