"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const ACCENT = "#6B7F62";

type DropItem = { label: string; desc: string };

const SERVICES: DropItem[] = [
  { label: "Web Design", desc: "Pixel-perfect interfaces" },
  { label: "Web Development", desc: "Scalable, secure platforms" },
  { label: "Videography", desc: "Cinematic brand narratives" },
  { label: "Video Editing", desc: "Precision post-production" },
  { label: "SEO & Strategy", desc: "Data-driven growth" },
  { label: "Brand Identity", desc: "Visual systems that endure" },
];

const PROJECTS: DropItem[] = [
  { label: "Meridian Studios", desc: "Web Design · 2026" },
  { label: "Onda Collective", desc: "Videography · 2025" },
  { label: "Noctis Finance", desc: "Web Development · 2025" },
  { label: "Forma Athletics", desc: "Video Editing · 2026" },
];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const NAV_TRANSITION = { duration: 0.9, ease: EASE };

function DropdownItem({ item, index }: { item: DropItem; index: number }) {
  const [hover, setHover] = useState(false);
  return (
    <a
      href="#"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.9rem",
        padding: "0.8rem 1rem",
        textDecoration: "none",
        background: hover ? "rgba(107,127,98,0.08)" : "transparent",
        transition: "background 0.25s ease",
        position: "relative",
        borderRadius: 10,
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
    </a>
  );
}

function Dropdown({
  items,
  cols = 1,
  header,
  footerText,
}: {
  items: DropItem[];
  cols?: number;
  header: string;
  footerText?: string;
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
          <a
            href="#"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.68rem",
              fontWeight: 500,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(240,237,232,0.65)",
              textDecoration: "none",
              fontFamily: "var(--font-jakarta), sans-serif",
              transition: "color 0.25s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = ACCENT;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = "rgba(240,237,232,0.65)";
            }}
          >
            {footerText}
            <span style={{ fontSize: "0.85rem", lineHeight: 1 }}>→</span>
          </a>
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
}: {
  label: string;
  dropdown?: DropItem[];
  dropdownCols?: number;
  dropdownHeader?: string;
  dropdownFooter?: string;
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
      <a
        href="#"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.35rem",
          fontSize: "0.72rem",
          fontWeight: 400,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: active ? "#f0ede8" : "rgba(240,237,232,0.62)",
          textDecoration: "none",
          fontFamily: "var(--font-jakarta), sans-serif",
          transition: "color 0.3s ease",
          padding: "0.4rem 0",
          whiteSpace: "nowrap",
          position: "relative",
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
      </a>
      <AnimatePresence>
        {open && dropdown && (
          <Dropdown
            items={dropdown}
            cols={dropdownCols}
            header={dropdownHeader ?? label}
            footerText={dropdownFooter}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileNavItem({ label, dropdown, itemVariants }: { label: string, dropdown?: DropItem[], itemVariants?: any }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div variants={itemVariants} className="flex flex-col border-b border-white/5 pb-4">
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
        {dropdown && (
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
        )}
      </button>

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
              {dropdown.map((item, i) => (
                <a key={item.label} href="#" className="flex flex-col gap-1 opacity-80 hover:opacity-100 transition-opacity">
                  <span className="text-base font-medium text-[#f0ede8]" style={{ fontFamily: "var(--font-jakarta), sans-serif" }}>{item.label}</span>
                  <span className="text-sm text-white/40" style={{ fontFamily: "var(--font-jakarta), sans-serif" }}>{item.desc}</span>
                </a>
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
        <a
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.6rem",
            textDecoration: "none",
            flexShrink: 0,
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{ position: "relative", flexShrink: 0, width: 32, height: 32 }}
          >
            <Image
              src="/About/KonaLogoNoBg.png"
              alt="Konaverse"
              fill
              className="object-contain"
              sizes="32px"
              priority
            />
          </div>
          <span
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontWeight: 200,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#f0ede8",
              display: "block",
              fontSize: "0.85rem",
            }}
          >
            Konaverse
          </span>
        </a>

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
            dropdownCols={2}
            dropdownHeader="Our Services"
            dropdownFooter="View all services"
          />
          <NavItem
            label="Projects"
            dropdown={PROJECTS}
            dropdownHeader="Selected Work"
            dropdownFooter="View full archive"
          />
          <NavItem label="About" />
          <NavItem label="Pricing" />
        </div>

        {/* CTA */}
        <a
          href="#"
          className="hidden md:inline-flex"
          style={{
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.7rem",
            fontWeight: 500,
            letterSpacing: "0.11em",
            textTransform: "uppercase",
            color: "#0a0a0c",
            background: "#f0ede8",
            borderRadius: 40,
            textDecoration: "none",
            fontFamily: "var(--font-jakarta), sans-serif",
            transition: "opacity 0.25s, box-shadow 0.25s",
            position: "relative",
            zIndex: 1,
            flexShrink: 0,
            whiteSpace: "nowrap",
            padding: "9px 20px",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow =
              "0 8px 24px -4px rgba(240,237,232,0.25)";
            (e.currentTarget as HTMLElement).style.opacity = "0.92";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow = "none";
            (e.currentTarget as HTMLElement).style.opacity = "1";
          }}
        >
          Get in Touch
          <svg width={11} height={11} viewBox="0 0 12 12" fill="none">
            <path
              d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>

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
              <MobileNavItem label="Services" dropdown={SERVICES} itemVariants={{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } }, exit: { opacity: 0, y: 10 } }} />
              <MobileNavItem label="Projects" dropdown={PROJECTS} itemVariants={{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } }, exit: { opacity: 0, y: 10 } }} />
              <MobileNavItem label="About" itemVariants={{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } }, exit: { opacity: 0, y: 10 } }} />
              <MobileNavItem label="Pricing" itemVariants={{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } }, exit: { opacity: 0, y: 10 } }} />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.7 }}
              className="mt-auto pt-8 relative z-10"
            >
               <a
                  href="#"
                  className="inline-flex items-center justify-center w-full gap-2 text-sm font-semibold tracking-widest uppercase rounded-[40px] py-[18px] transition-all active:scale-95"
                  style={{ fontFamily: "var(--font-jakarta), sans-serif", background: ACCENT, color: "#fff", boxShadow: "0 8px 30px -10px rgba(107,127,98,0.5)" }}
                >
                  Get in Touch
               </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
