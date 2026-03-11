"use client";

import Link from "next/link";

const SERVICES = [
    {
        title: "Web Development",
        desc: "Websites that don't just look premium — they perform, convert, and position you in a different league.",
        image: "/assets/services/web-development.png",
        href: "/solutions/web-development",
    },
    {
        title: "Web Applications",
        desc: "Custom web applications built for scale — engineered with precision so your business runs without friction.",
        image: "/assets/services/web-applications.png",
        href: "/solutions/web-applications",
    },
    {
        title: "Videography",
        desc: "Cinematic content that makes people stop. We capture your brand the way it deserves to be seen.",
        image: "/assets/services/videography.png",
        href: "/solutions/videography",
    },
    {
        title: "Digital Advertising",
        desc: "Campaigns built around conversion, not vanity metrics. Turn attention into revenue.",
        image: "/assets/services/digital-advertising.png",
        href: "/solutions/digital-advertising",
    },
    {
        title: "Social Media",
        desc: "Consistent, creative, always on-brand — your audience grows while you focus on your business.",
        image: "/assets/services/social-media.png",
        href: "/solutions/social-media",
    },
];

export function MobileFallback() {
    return (
        <section className="bg-[#0a0b09] text-[#faf7f2]">
            {/* Hero */}
            <div className="relative h-screen flex items-center justify-center overflow-hidden">
                <img
                    src="/assets/atmosphere/atmosphere-bg.png"
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <img
                    src="/assets/rift/rift-glow.png"
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ mixBlendMode: "screen", opacity: 0.7 }}
                />
                <div className="relative z-10 text-center px-6">
                    <h1
                        style={{
                            fontFamily: "var(--font-monument, 'Monument Extended', sans-serif)",
                            fontWeight: 800,
                            fontSize: "clamp(2rem, 8vw, 3.5rem)",
                            color: "#b6a492",
                            textTransform: "uppercase",
                            letterSpacing: "-0.02em",
                            lineHeight: 1.1,
                            textShadow: "0 2px 20px rgba(0,0,0,0.8)",
                        }}
                    >
                        EXPERIENCE<br />DIGITAL<br />INNOVATION
                    </h1>
                    <p
                        className="mt-4"
                        style={{
                            fontFamily: "var(--font-geist-mono, 'Geist Mono', monospace)",
                            fontWeight: 300,
                            fontSize: "0.75rem",
                            color: "rgba(250, 247, 242, 0.6)",
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            lineHeight: 2,
                        }}
                    >
                        Konaverse provides you with the tools<br />to build your own digital realm.
                    </p>
                </div>
            </div>

            {/* Service cards */}
            <div className="px-5 py-12 space-y-8">
                {SERVICES.map((s) => (
                    <Link
                        key={s.title}
                        href={s.href}
                        className="block relative overflow-hidden rounded-2xl"
                        style={{ aspectRatio: "16/10" }}
                    >
                        <img
                            src={s.image}
                            alt={s.title}
                            loading="lazy"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div
                            className="absolute inset-0"
                            style={{
                                background: "linear-gradient(to top, rgba(10,11,9,0.9) 0%, rgba(10,11,9,0.3) 50%, transparent 100%)",
                            }}
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-5">
                            <h2
                                style={{
                                    fontFamily: "var(--font-monument, 'Monument Extended', sans-serif)",
                                    fontWeight: 800,
                                    fontSize: "1.25rem",
                                    color: "#b6a492",
                                    textTransform: "uppercase",
                                    letterSpacing: "-0.02em",
                                }}
                            >
                                {s.title}
                            </h2>
                            <p
                                className="mt-2"
                                style={{
                                    fontFamily: "var(--font-geist-sans, 'Geist', sans-serif)",
                                    fontWeight: 300,
                                    fontSize: "0.85rem",
                                    color: "rgba(250, 247, 242, 0.7)",
                                    lineHeight: 1.6,
                                }}
                            >
                                {s.desc}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>

            {/* CTA */}
            <div className="px-5 py-16 text-center">
                <h2
                    style={{
                        fontFamily: "var(--font-monument, 'Monument Extended', sans-serif)",
                        fontWeight: 800,
                        fontSize: "clamp(1.8rem, 6vw, 2.5rem)",
                        color: "#b6a492",
                        textTransform: "uppercase",
                        letterSpacing: "-0.02em",
                        lineHeight: 1.1,
                    }}
                >
                    ENGAGE WITH.<br />KONAVERSE.
                </h2>
                <p
                    className="mt-4"
                    style={{
                        fontFamily: "var(--font-geist-sans, 'Geist', sans-serif)",
                        fontWeight: 300,
                        fontSize: "0.9rem",
                        color: "rgba(250, 247, 242, 0.7)",
                    }}
                >
                    Your digital presence, perfected. Your time, protected.
                </p>
                <Link
                    href="/contact"
                    className="inline-block mt-8 hover:border-[#6b7f62] hover:text-[#6b7f62]"
                    style={{
                        border: "1px solid rgba(250, 247, 242, 0.3)",
                        padding: "0.75rem 2rem",
                        fontFamily: "var(--font-geist-mono, 'Geist Mono', monospace)",
                        fontSize: "0.8rem",
                        fontWeight: 300,
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: "#faf7f2",
                        transition: "border-color 0.4s ease, color 0.4s ease",
                    }}
                >
                    Start Your Project
                </Link>
            </div>
        </section>
    );
}
