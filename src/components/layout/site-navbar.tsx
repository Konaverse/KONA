"use client";

import {
  Navbar,
  NavBody,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { useState } from "react";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const serviceLinks = [
  { name: "Web Development", link: "#services" },
  { name: "Web Applications", link: "#services" },
  { name: "Social Media", link: "#services" },
  { name: "Digital Advertising", link: "#services" },
  { name: "Videography", link: "#services" },
];

function ServicesDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="relative px-4 py-2 text-white/70 hover:text-white transition-colors flex items-center gap-1 text-sm font-medium">
        Services
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-1/2 -translate-x-1/2 pt-2"
          >
            <div className="bg-[#030014]/95 border border-white/10 rounded-xl backdrop-blur-md overflow-hidden min-w-[200px]">
              {serviceLinks.map((service, idx) => (
                <a
                  key={idx}
                  href={service.link}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors font-mono group"
                >
                  <span className="text-white/20 group-hover:text-white/40 transition-colors">{'>'}</span>
                  {service.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function SiteNavbar() {
  const flatNavItems = [
    { name: "Work", link: "#projects-showcase" },
    { name: "About", link: "#about" },
    { name: "Contact", link: "#contact" },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  return (
    <Navbar>
      {/* Desktop Navigation */}
      <NavBody>
        <NavbarLogo />

        {/* Centered nav items */}
        <div className="absolute inset-0 hidden flex-1 flex-row items-center justify-center space-x-2 text-sm font-medium lg:flex lg:space-x-2">
          <a href="#projects-showcase" className="relative px-4 py-2 text-white/70 hover:text-white transition-colors">
            Work
          </a>
          <ServicesDropdown />
          <a href="#about" className="relative px-4 py-2 text-white/70 hover:text-white transition-colors">
            About
          </a>
          <a href="#contact" className="relative px-4 py-2 text-white/70 hover:text-white transition-colors">
            Contact
          </a>
        </div>

        <div className="flex items-center gap-4">
          <a href="#contact">
            <HoverBorderGradient
              containerClassName="rounded-full"
              className="bg-[#030014] text-white flex items-center gap-2 px-4 py-2 text-sm font-medium"
            >
              Book a Call
            </HoverBorderGradient>
          </a>
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </MobileNavHeader>

        <MobileNavMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        >
          <a
            href="#projects-showcase"
            onClick={() => setIsMobileMenuOpen(false)}
            className="relative text-white/70 hover:text-white transition-colors text-lg"
          >
            <span className="block">Work</span>
          </a>

          {/* Mobile Services accordion */}
          <div className="w-full">
            <button
              onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
              className="flex items-center justify-between w-full text-white/70 hover:text-white transition-colors text-lg"
            >
              <span>Services</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${mobileServicesOpen ? "rotate-180" : ""}`}
              />
            </button>
            <AnimatePresence>
              {mobileServicesOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="mt-2 pl-4 flex flex-col gap-2 border-l border-white/10">
                    {serviceLinks.map((service, idx) => (
                      <a
                        key={idx}
                        href={service.link}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-white/50 hover:text-white transition-colors text-sm font-mono"
                      >
                        {service.name}
                      </a>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {flatNavItems.slice(1).map((item, idx) => (
            <a
              key={`mobile-link-${idx}`}
              href={item.link}
              onClick={() => setIsMobileMenuOpen(false)}
              className="relative text-white/70 hover:text-white transition-colors text-lg"
            >
              <span className="block">{item.name}</span>
            </a>
          ))}

          <div className="flex w-full flex-col gap-4 mt-4">
            <NavbarButton
              onClick={() => setIsMobileMenuOpen(false)}
              variant="primary"
              className="w-full"
              href="#contact"
            >
              Book a Call
            </NavbarButton>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}

