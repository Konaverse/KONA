"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { NavDropdown } from "./nav-dropdown";
import { NavHamburger } from "./nav-hamburger";
import { MobileMenu } from "./mobile-menu";
import { useNavCollapse } from "@/lib/hooks/use-nav-collapse";
import { Button } from "../ui/button";

const colors = {
    deepForest: "#1a1d18",
    midnight: "#2a2e26",
    oak: "#6b5545",
    sand: "#c8b4a0",
    parchment: "#f8f7f5",
};

const solutionsItems = [
    { label: "Web Development", href: "/solutions/web-development" },
    { label: "Web Applications", href: "/solutions/web-applications" },
    { label: "Digital Advertising", href: "/solutions/digital-advertising" },
    { label: "Social Media", href: "/solutions/social-media" },
    { label: "Videography", href: "/solutions/videography" },
];

const projectsItems = [
    { label: "Website Projects", href: "/projects/website-projects" },
    { label: "Web App Projects", href: "/projects/web-apps" },
    { label: "Social Media Projects", href: "/projects/social-media" },
];

const navItems = [
    { label: "ABOUT", href: "/about" },
    { label: "CONTACT", href: "/contact" },
    { label: "PRICING", href: "/pricing" },
];

/**
 * Global Navigation - "The Orientation Layer"
 * 
 * A transcendent sticky navbar that floats above content without a background.
 * Serves as the architectural datum line of the entire site.
 */
export function GlobalNav() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [hamburgerPosition, setHamburgerPosition] = useState({ x: 0, y: 0 });
    const [activeRoute, setActiveRoute] = useState("");
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);

    const navContainerRef = useRef<HTMLElement>(null);
    const hamburgerRef = useRef<HTMLDivElement>(null);

    const { shouldCollapse, isCalculating } = useNavCollapse({
        navContainerRef,
        logoWidth: 80,
        ctaWidth: 120,
        minItemSpacing: 16,
        bufferWidth: 64,
    });

    // Handle scroll state
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Update hamburger position for radial expansion
    useEffect(() => {
        const updateHamburgerPosition = () => {
            if (hamburgerRef.current) {
                const rect = hamburgerRef.current.getBoundingClientRect();
                setHamburgerPosition({
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2,
                });
            }
        };

        updateHamburgerPosition();
        window.addEventListener("resize", updateHamburgerPosition);
        return () => window.removeEventListener("resize", updateHamburgerPosition);
    }, [shouldCollapse]);

    // Get current route for active state (defer to avoid sync setState in effect)
    useEffect(() => {
        const update = () => setActiveRoute(window.location.hash || "");
        queueMicrotask(update);
        window.addEventListener("hashchange", update);
        return () => window.removeEventListener("hashchange", update);
    }, []);

    const isActiveRoute = (href: string) => activeRoute === href;

    return (
        <>
            {/* Skip to content link for accessibility */}
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:text-sm"
                style={{
                    backgroundColor: colors.parchment,
                    color: colors.deepForest,
                }}
            >
                Skip to content
            </a>

            <motion.nav
                ref={navContainerRef}
                className="fixed top-0 left-0 right-0 z-[100]"
                style={{ pointerEvents: "auto" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                {/* Datum line - appears on scroll */}
                <motion.div
                    className="absolute bottom-0 left-0 right-0 h-px"
                    style={{ backgroundColor: colors.oak }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isScrolled ? 0.08 : 0 }}
                    transition={{ duration: 0.4 }}
                />

                {/* Inner container with edge padding */}
                <div
                    className="relative mx-auto h-16 md:h-20 flex items-center justify-between"
                    style={{
                        padding: "0 clamp(1.5rem, 4vw, 4rem)",
                        textShadow: isScrolled ? "0 1px 2px rgba(26, 29, 24, 0.3)" : "none",
                    }}
                >
                    {/* Corner anchor - top left */}
                    <motion.div
                        className="absolute top-3 left-[clamp(1.5rem,4vw,4rem)]"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 0.2, scale: 1 }}
                        transition={{ delay: 0.5, duration: 0.3 }}
                    >
                        <div
                            className="w-2 h-px"
                            style={{ backgroundColor: colors.sand }}
                        />
                        <div
                            className="w-px h-2"
                            style={{ backgroundColor: colors.sand }}
                        />
                    </motion.div>

                    {/* Logo - Left anchor */}
                    <motion.div
                        className="relative z-20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Link
                            href="/"
                            className="flex flex-col items-center"
                        >
                            <Image
                                src="/KonaLogoNoBg.png"
                                alt="Konaverse Logo"
                                width={180}
                                height={60}
                                className="h-12 w-auto brightness-200"
                                priority
                            />
                            <span className="text-[10px] font-mono tracking-[0.3em] uppercase mt-1 opacity-80" style={{ color: colors.parchment }}>
                                KONAVERSE
                            </span>
                        </Link>
                    </motion.div>

                    {/* Desktop Navigation - Center constellation */}
                    {!shouldCollapse && !isCalculating && (
                        <div
                            className="absolute left-1/2 -translate-x-[calc(50%-4px)] flex items-center"
                            style={{ gap: "clamp(1.5rem, 3vw, 2.5rem)" }}
                        >
                            {/* Solutions dropdown */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.1, duration: 0.3 }}
                            >
                                <NavDropdown
                                    trigger={
                                        <span
                                            className="text-[13px] font-light uppercase transition-colors duration-200"
                                            style={{
                                                color: hoveredItem === "solutions" ? colors.parchment : colors.sand,
                                                letterSpacing: "0.08em",
                                            }}
                                            data-nav-item="true"
                                            onMouseEnter={() => setHoveredItem("solutions")}
                                            onMouseLeave={() => setHoveredItem(null)}
                                        >
                                            SOLUTIONS
                                        </span>
                                    }
                                    items={solutionsItems}
                                    footerLink={{ label: "Explore all solutions", href: "/solutions" }}
                                />
                            </motion.div>

                            {/* Projects dropdown */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.15, duration: 0.3 }}
                            >
                                <NavDropdown
                                    trigger={
                                        <span
                                            className="text-[13px] font-light uppercase transition-colors duration-200"
                                            style={{
                                                color: hoveredItem === "projects" ? colors.parchment : colors.sand,
                                                letterSpacing: "0.08em",
                                            }}
                                            data-nav-item="true"
                                            onMouseEnter={() => setHoveredItem("projects")}
                                            onMouseLeave={() => setHoveredItem(null)}
                                        >
                                            PROJECTS
                                        </span>
                                    }
                                    items={projectsItems}
                                    footerLink={{ label: "View all projects", href: "/projects" }}
                                    title="Projects"
                                />
                            </motion.div>

                            {/* Regular nav items */}
                            {navItems.map((item, index) => (
                                <motion.div
                                    key={item.href}
                                    className="relative"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.1 + (index + 1) * 0.05, duration: 0.3 }}
                                >
                                    <Link
                                        href={item.href}
                                        className="relative block"
                                        data-nav-item="true"
                                        onMouseEnter={() => setHoveredItem(item.href)}
                                        onMouseLeave={() => setHoveredItem(null)}
                                    >
                                        <span
                                            className="text-[13px] font-light transition-colors duration-200"
                                            style={{
                                                color:
                                                    hoveredItem === item.href || isActiveRoute(item.href)
                                                        ? colors.parchment
                                                        : colors.sand,
                                                letterSpacing: "0.08em",
                                            }}
                                        >
                                            {item.label}
                                        </span>

                                        {/* Hover dot */}
                                        <motion.span
                                            className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0.5 h-0.5 rounded-full"
                                            style={{ backgroundColor: colors.oak }}
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={{
                                                opacity: hoveredItem === item.href ? 1 : 0,
                                                scale: hoveredItem === item.href ? 1 : 0,
                                            }}
                                            transition={{ duration: 0.15, delay: 0.05 }}
                                        />

                                        {/* Active underline */}
                                        {isActiveRoute(item.href) && (
                                            <motion.span
                                                className="absolute -bottom-1 left-0 right-0 h-px"
                                                style={{ backgroundColor: colors.parchment }}
                                                layoutId="activeNav"
                                                transition={{ duration: 0.2 }}
                                            />
                                        )}
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* CTA - Right anchor (desktop) */}
                    {!shouldCollapse && !isCalculating && (
                        <motion.div
                            className="relative z-20"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.3 }}
                        >
                            <Button
                                href="/contact"
                                size="sm"
                            >
                                Get a Quote
                            </Button>

                            {/* Corner anchor - bottom right of CTA */}
                            <motion.div
                                className="absolute -bottom-1 -right-1"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 0.2, scale: 1 }}
                                transition={{ delay: 0.5, duration: 0.3 }}
                            >
                                <div
                                    className="absolute bottom-0 right-0 w-2 h-px"
                                    style={{ backgroundColor: colors.sand }}
                                />
                                <div
                                    className="absolute bottom-0 right-0 w-px h-2"
                                    style={{ backgroundColor: colors.sand }}
                                />
                            </motion.div>
                        </motion.div>
                    )}

                    {/* Hamburger placeholder - actual hamburger moved outside nav */}
                    {(shouldCollapse || isCalculating) && (
                        <div className="w-10 h-10" />
                    )}
                </div>
            </motion.nav>

            {/* Mobile hamburger - Fixed position outside nav to stay above mobile menu */}
            {(shouldCollapse || isCalculating) && (
                <div
                    ref={hamburgerRef}
                    className="fixed top-0 right-0 z-[1001] h-16 md:h-20 flex items-center"
                    style={{ paddingRight: "clamp(1.5rem, 4vw, 4rem)" }}
                >
                    <NavHamburger
                        isOpen={isMobileMenuOpen}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    />
                </div>
            )}

            {/* Mobile menu overlay */}
            <MobileMenu
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                originX={hamburgerPosition.x}
                originY={hamburgerPosition.y}
            />
        </>
    );
}

export default GlobalNav;
