"use client";

import React, { useRef, useState } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import {
  SiMailchimp,
  SiFigma,
  SiAdobecreativecloud,
  SiLighthouse,
  SiGooglechrome,
  SiPagespeedinsights,
  SiGooglesearchconsole,
  SiSemrush,
  SiTestinglibrary,
  SiGooglecloud,
  SiAmazon,
  SiDocker,
  SiKubernetes,
  SiGraphql,
  SiSocketdotio,
  SiCanva,
  SiAdobephotoshop,
  SiAdobeillustrator,
  SiAdobelightroom,
  SiMeta,
  SiGoogleads,
  SiGoogleanalytics,
  SiHubspot,
  SiSalesforce,
  SiHotjar,
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiNodedotjs,
  SiPostgresql,
  SiMongodb,
  SiPrisma,
  SiVercel,
  SiInstagram,
  SiFacebook,
  SiTiktok,
  SiYoutube,
  SiAdobepremierepro,
  SiAdobeaftereffects,
  SiDavinciresolve,
  SiAdobeaudition,
} from "react-icons/si";
import { TbDeviceMobile, TbDeviceTablet, TbDeviceDesktop } from "react-icons/tb";

// --- ScrambleText Component ---
const ScrambleText = ({ text }: { text: string }) => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
  const [displayText, setDisplayText] = useState(text);

  React.useEffect(() => {
    let frame = 0;
    const duration = 15; // frames
    const interval = setInterval(() => {
      if (frame >= duration) {
        setDisplayText(text);
        clearInterval(interval);
        return;
      }

      setDisplayText(() => {
        return text.split('').map((char, i) => {
          if (char === ' ') return ' ';
          if (i < (frame / duration) * text.length) return text[i];
          return characters[Math.floor(Math.random() * characters.length)];
        }).join('');
      });
      frame++;
    }, 40);

    return () => clearInterval(interval);
  }, [text]);

  return <>{displayText}</>;
};

const colors = {
  50: "#f8f7f5",
  100: "#e6e1d7",
  200: "#c8b4a0",
  300: "#a89080",
  400: "#8a7060",
  500: "#6b5545",
  600: "#544237",
  700: "#3c4237",
  800: "#2a2e26",
  900: "#1a1d18",
};

const serviceData = {
  "01": {
    accent: "#4a6670",
    gradient: "radial-gradient(circle at 70% 30%, rgba(74, 102, 112, 0.15) 0%, transparent 60%)",
    cards: [
      {
        shortTitle: "Web Development",
        fullTitle: "Web Development",
        description: "We build fast, scalable, and beautifully crafted websites that perform across all dimensions of the modern web.",
        icons: [
          { icon: SiReact, name: "React", color: "#61DAFB" },
          { icon: SiNextdotjs, name: "Next.js", color: "#ffffff" },
          { icon: SiTypescript, name: "TypeScript", color: "#3178C6" },
          { icon: SiTailwindcss, name: "Tailwind", color: "#06B6D4" },
        ]
      },
      {
        shortTitle: "SEO",
        fullTitle: "Search Engine Optimization",
        description: "Strategic positioning to dominate search results and drive high-intent organic traffic to your platform.",
        icons: [
          { icon: SiGooglesearchconsole, name: "Console", color: "#4285F4" },
          { icon: SiSemrush, name: "Semrush", color: "#FF6203" },
          { icon: SiGoogleanalytics, name: "Analytics", color: "#E37400" },
        ]
      },
      {
        shortTitle: "Custom Design",
        fullTitle: "Architectural UI/UX Design",
        description: "Bespoke digital experiences tailored to your brand's unique DNA, merging aesthetics with conversion-led strategy.",
        icons: [
          { icon: SiFigma, name: "Figma", color: "#F24E1E" },
          { icon: SiAdobecreativecloud, name: "Creative Cloud", color: "#DA1F26" },
          { icon: SiAdobephotoshop, name: "Photoshop", color: "#31A8FF" },
          { icon: SiAdobeillustrator, name: "Illustrator", color: "#FF9A00" },
        ]
      },
      {
        shortTitle: "Responsiveness",
        fullTitle: "Cross-Device Fluidity",
        description: "Seamless transitions between mobile, tablet, and desktop viewports, ensuring a premium experience on every screen.",
        icons: [
          { icon: TbDeviceMobile, name: "Mobile", color: "#ffffff" },
          { icon: TbDeviceTablet, name: "Tablet", color: "#ffffff" },
          { icon: TbDeviceDesktop, name: "Desktop", color: "#ffffff" },
        ]
      },
      {
        shortTitle: "Performance",
        fullTitle: "Precision Engineering",
        description: "Optimization for maximum speed, hitting the core web vitals and ensuring lightning-fast load times.",
        icons: [
          { icon: SiLighthouse, name: "Lighthouse", color: "#F44B21" },
          { icon: SiPagespeedinsights, name: "Insights", color: "#4285F4" },
          { icon: SiGooglechrome, name: "Chrome", color: "#4285F4" },
          { icon: SiTestinglibrary, name: "Testing", color: "#E33332" },
        ]
      }
    ]
  },
  "02": {
    accent: "#4a6a5a",
    gradient: "radial-gradient(circle at 30% 70%, rgba(74, 106, 90, 0.15) 0%, transparent 60%)",
    cards: [
      {
        shortTitle: "Web Applications",
        fullTitle: "Web Applications",
        description: "Complex, data-driven platforms engineered for reliability, security, and effortless user scaling.",
        icons: [
          { icon: SiNextdotjs, name: "Next.js", color: "#ffffff" },
          { icon: SiNodedotjs, name: "Node.js", color: "#339933" },
          { icon: SiPostgresql, name: "PostgreSQL", color: "#4169E1" },
          { icon: SiPrisma, name: "Prisma", color: "#ffffff" },
        ]
      },
      {
        shortTitle: "Dashboards",
        fullTitle: "Intuitive Admin Hubs",
        description: "Visualizing complex data through clean, actionable dashboards that empower decision-making.",
        icons: [
          { icon: SiGraphql, name: "GraphQL", color: "#E10098" },
          { icon: SiSocketdotio, name: "Socket.io", color: "#ffffff" },
          { icon: SiGoogleanalytics, name: "Analytics", color: "#E37400" },
          { icon: SiHotjar, name: "Hotjar", color: "#FF2C00" },
        ]
      },
      {
        shortTitle: "SaaS Products",
        fullTitle: "Scalable SaaS Architecture",
        description: "From MVP to enterprise-grade solutions, we build the engine that drives your recurring revenue.",
        icons: [
          { icon: SiVercel, name: "Vercel", color: "#ffffff" },
          { icon: SiDocker, name: "Docker", color: "#2496ED" },
          { icon: SiKubernetes, name: "Kubernetes", color: "#326CE5" },
          { icon: SiGooglecloud, name: "Google Cloud", color: "#4285F4" },
        ]
      },
      {
        shortTitle: "Automations",
        fullTitle: "Workflow Orchestration",
        description: "Reducing manual overhead through intelligent API integrations and background processing.",
        icons: [
          { icon: SiGooglecloud, name: "Cloud", color: "#0078D4" },
          { icon: SiAmazon, name: "AWS", color: "#FF9900" },
          { icon: SiSocketdotio, name: "Realtime", color: "#ffffff" },
        ]
      },
      {
        shortTitle: "Databases",
        fullTitle: "Robust Data Sovereignty",
        description: "Secure, high-performance database management ensuring data integrity and rapid access.",
        icons: [
          { icon: SiPostgresql, name: "PostgreSQL", color: "#4169E1" },
          { icon: SiMongodb, name: "MongoDB", color: "#47A248" },
          { icon: SiPrisma, name: "Prisma", color: "#ffffff" },
        ]
      }
    ]
  },
  "03": {
    accent: "#7a5a4a",
    gradient: "radial-gradient(circle at 70% 70%, rgba(122, 90, 74, 0.15) 0%, transparent 60%)",
    cards: [
      {
        shortTitle: "Social Media",
        fullTitle: "Social Media",
        description: "Cultivating digital communities and capturing market attention through cohesive brand narrative.",
        icons: [
          { icon: SiInstagram, name: "Instagram", color: "#E4405F" },
          { icon: SiFacebook, name: "Facebook", color: "#1877F2" },
          { icon: SiTiktok, name: "TikTok", color: "#ffffff" },
          { icon: SiYoutube, name: "YouTube", color: "#FF0000" },
        ]
      },
      {
        shortTitle: "Visual Content",
        fullTitle: "High-Immersive Visuals",
        description: "Stunning photography and design that stops the scroll and initiates brand connection.",
        icons: [
          { icon: SiCanva, name: "Canva", color: "#00C4CC" },
          { icon: SiAdobephotoshop, name: "Photoshop", color: "#31A8FF" },
          { icon: SiAdobelightroom, name: "Lightroom", color: "#31A8FF" },
        ]
      },
      {
        shortTitle: "Post Strategy",
        fullTitle: "Strategic Content Planning",
        description: "Algorithmic-led strategy to maximize reach and foster authentic audience engagement.",
        icons: [
          { icon: SiMeta, name: "Meta", color: "#0081FB" },
          { icon: SiGoogleanalytics, name: "Analytics", color: "#E37400" },
          { icon: SiMailchimp, name: "Mailchimp", color: "#FFE01B" },
        ]
      },
      {
        shortTitle: "Videography",
        fullTitle: "Professional Videography",
        description: "Cinematic drone shots and professional editing that bring your business story to life.",
        icons: [
          { icon: SiAdobecreativecloud, name: "Creative Cloud", color: "#ffffff" },
          { icon: SiYoutube, name: "YouTube", color: "#FF0000" },
          { icon: SiAdobephotoshop, name: "Photoshop", color: "#31A8FF" },
        ]
      },
      {
        shortTitle: "Storytelling",
        fullTitle: "Cohesive Brand Narrative",
        description: "Defining your voice across all channels to build a legacy brand that resonates deeply.",
        icons: [
          { icon: SiInstagram, name: "Instagram", color: "#E4405F" },
          { icon: SiFacebook, name: "Facebook", color: "#1877F2" },
        ]
      }
    ]
  },
  "04": {
    accent: "#5a4a6a",
    gradient: "radial-gradient(circle at 30% 30%, rgba(90, 74, 106, 0.15) 0%, transparent 60%)",
    cards: [
      {
        shortTitle: "Digital Advertising",
        fullTitle: "Digital Advertising",
        description: "Precision-targeted campaigns that convert casual interest into sustainable business growth.",
        icons: [
          { icon: SiGoogleads, name: "Google Ads", color: "#4285F4" },
          { icon: SiMeta, name: "Meta Ads", color: "#0081FB" },
          { icon: SiGoogleanalytics, name: "Analytics", color: "#E37400" },
          { icon: SiMailchimp, name: "Email", color: "#FFE01B" },
        ]
      },
      {
        shortTitle: "Paid Social",
        fullTitle: "Paid Social Activation",
        description: "Aggressive market reach through strategically managed ad spends on major social platforms.",
        icons: [
          { icon: SiMeta, name: "Meta", color: "#0081FB" },
          { icon: SiTiktok, name: "TikTok", color: "#ffffff" },
          { icon: SiInstagram, name: "Instagram", color: "#E4405F" },
        ]
      },
      {
        shortTitle: "Google Ads",
        fullTitle: "Search Engine Advertising",
        description: "Capturing search intent at the exact moment your customers are looking for you.",
        icons: [
          { icon: SiGoogleads, name: "Google Ads", color: "#4285F4" },
          { icon: SiGooglesearchconsole, name: "Console", color: "#4285F4" },
        ]
      },
      {
        shortTitle: "Analytics",
        fullTitle: "Conversion intelligence",
        description: "Deep-dive data analysis to track the customer journey and optimize for ROI.",
        icons: [
          { icon: SiGoogleanalytics, name: "Analytics", color: "#E37400" },
          { icon: SiHotjar, name: "Hotjar", color: "#FF2C00" },
          { icon: SiHubspot, name: "Hubspot", color: "#FF7A59" },
        ]
      },
      {
        shortTitle: "Optimization",
        fullTitle: "A/B Growth Testing",
        description: "Continuous performance iteration to squeeze maximum value from every advertising dollar.",
        icons: [
          { icon: SiSalesforce, name: "Salesforce", color: "#00A1E0" },
          { icon: SiTestinglibrary, name: "A/B Testing", color: "#E33332" },
          { icon: SiHubspot, name: "Marketing", color: "#FF7A59" },
        ]
      }
    ]
  },
  "05": {
    accent: "#c27c3a",
    gradient: "radial-gradient(circle at 60% 40%, rgba(194, 124, 58, 0.15) 0%, transparent 60%)",
    cards: [
      {
        shortTitle: "Video Production",
        fullTitle: "Cinematic Video Production",
        description: "From concept to final cut — we craft visually compelling video content that tells your brand story with cinematic precision and intentional storytelling.",
        icons: [
          { icon: SiAdobepremierepro, name: "Premiere Pro", color: "#9999FF" },
          { icon: SiDavinciresolve, name: "DaVinci Resolve", color: "#FF6B35" },
          { icon: SiYoutube, name: "YouTube", color: "#FF0000" },
        ]
      },
      {
        shortTitle: "Photography",
        fullTitle: "Professional Photography",
        description: "High-impact brand and product photography that elevates your visual identity across every touchpoint — from campaigns to social media.",
        icons: [
          { icon: SiAdobelightroom, name: "Lightroom", color: "#31A8FF" },
          { icon: SiAdobephotoshop, name: "Photoshop", color: "#31A8FF" },
          { icon: SiAdobecreativecloud, name: "Creative Cloud", color: "#DA1F26" },
        ]
      },
      {
        shortTitle: "Video Editing",
        fullTitle: "Precision Post-Production",
        description: "Expert editing that transforms raw footage into polished, audience-ready content — colour grading, pacing, sound design, and seamless visual flow.",
        icons: [
          { icon: SiAdobepremierepro, name: "Premiere Pro", color: "#9999FF" },
          { icon: SiDavinciresolve, name: "DaVinci", color: "#FF6B35" },
          { icon: SiAdobeaudition, name: "Audition", color: "#9999FF" },
        ]
      },
      {
        shortTitle: "Motion Graphics",
        fullTitle: "Dynamic Motion Graphics",
        description: "Animated visuals, kinetic typography, and fluid transitions that add dimension and energy to your brand narrative across every screen.",
        icons: [
          { icon: SiAdobeaftereffects, name: "After Effects", color: "#9999FF" },
          { icon: SiAdobepremierepro, name: "Premiere Pro", color: "#9999FF" },
          { icon: SiAdobecreativecloud, name: "Creative Cloud", color: "#DA1F26" },
        ]
      },
      {
        shortTitle: "Aerial & Drone",
        fullTitle: "Aerial & Drone Cinematography",
        description: "Breathtaking aerial perspectives and drone footage that give your content a world-class cinematic edge and an unforgettable sense of scale.",
        icons: [
          { icon: SiAdobepremierepro, name: "Premiere Pro", color: "#9999FF" },
          { icon: SiDavinciresolve, name: "DaVinci", color: "#FF6B35" },
          { icon: SiYoutube, name: "YouTube", color: "#FF0000" },
        ]
      }
    ]
  }
};

const serviceImages = {
  "01": [
    "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&q=80",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&q=80",
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
    "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80",
  ],
  "02": [
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    "https://images.unsplash.com/photo-1504868584819-f8e90526354a?w=800&q=80",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
  ],
  "03": [
    "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=800&q=80",
    "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80",
    "https://images.unsplash.com/photo-1492724441997-5dc865305da7?w=800&q=80",
    "https://images.unsplash.com/photo-1557838923-2985c318be48?w=800&q=80",
    "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&q=80",
  ],
  "04": [
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    "https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=800&q=80",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    "https://images.unsplash.com/photo-1533750516457-a7f992034fce?w=800&q=80",
  ],
  "05": [
    "https://images.unsplash.com/photo-1579767684-28f27a64f1e0?w=800&q=80",
    "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&q=80",
    "https://images.unsplash.com/photo-1536240478700-b869ad10e2b5?w=800&q=80",
    "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=80",
    "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80",
  ],
};

// --- Accordion Item Internal Component ---
const AccordionItem = ({ title, imageUrl, isActive, onMouseEnter, accentColor }: {
  title: string;
  imageUrl: string;
  isActive: boolean;
  onMouseEnter: () => void;
  accentColor: string;
}) => {
  return (
    <div
      className={`
        relative h-[300px] md:h-[450px] rounded-xl overflow-hidden cursor-pointer
        transition-all duration-700 ease-in-out border border-white/5
        ${isActive ? 'w-[200px] md:w-[350px]' : 'w-[50px] md:w-[70px]'}
      `}
      onMouseEnter={onMouseEnter}
    >
      <img
        src={imageUrl}
        alt={title}
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${isActive ? 'scale-110 opacity-100 grayscale-0' : 'opacity-40 grayscale'}`}
      />
      <div className={`absolute inset-0 bg-black/50 transition-opacity duration-700 ${isActive ? 'opacity-30' : 'opacity-70'}`}></div>

      {/* Bottom Gradient for Text Legibility */}
      <div className={`absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-700 ${isActive ? 'opacity-100' : 'opacity-0'}`} />

      {/* Accent Glow on Hover */}
      <div
        className={`absolute inset-0 opacity-0 transition-opacity duration-700 pointer-events-none`}
        style={{
          background: isActive ? `radial-gradient(circle at center, ${accentColor}10 0%, transparent 70%)` : '',
          opacity: isActive ? 1 : 0
        }}
      />

      <span
        className={`
          absolute text-white text-xs md:text-sm font-medium uppercase tracking-[0.2em]
          transition-all duration-500 ease-in-out px-6 text-center
          ${isActive
            ? 'bottom-8 left-0 right-0 rotate-0 whitespace-normal opacity-100'
            : 'bottom-32 left-1/2 -translate-x-1/2 -rotate-90 whitespace-nowrap opacity-70'
          }
        `}
        style={{
          textShadow: '0 2px 4px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.4)'
        }}
      >
        {title}
      </span>
    </div>
  );
};

// --- Mobile Feature Accordion ---
interface ServiceCardItem {
  shortTitle: string;
  description: string;
  icons: Array<{ icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>; name: string; color: string }>;
}

const MobileFeatureAccordion = ({
  cards,
  activeIndex,
  onSelect
}: {
  cards: ServiceCardItem[];
  activeIndex: number;
  onSelect: (index: number) => void;
}) => {
  return (
    <div className="flex flex-col gap-1.5 w-full mt-2">
      {cards.map((card, index) => {
        const isActive = activeIndex === index;
        return (
          <div
            key={index}
            className={`
              border rounded-lg overflow-hidden transition-all duration-500
              ${isActive ? 'border-white/20 bg-white/5' : 'border-white/5 bg-transparent'}
            `}
            onClick={() => onSelect(index)}
          >
            {/* Tab Header */}
            <div className="px-3 py-2 flex items-center justify-between cursor-pointer">
              <span className={`text-[10px] font-mono uppercase tracking-widest ${isActive ? 'text-white' : 'text-white/40'}`}>
                {index === 0 ? "Entry" : `0${index}`}
              </span>
              <span className={`text-xs font-medium uppercase tracking-[0.1em] ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                {isActive ? <ScrambleText text={card.shortTitle} /> : card.shortTitle}
              </span>
            </div>

            {/* Expanded Content */}
            <motion.div
              initial={false}
              animate={{ height: isActive ? 'auto' : 0, opacity: isActive ? 1 : 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="px-3 pb-3 space-y-2">
                <p className="text-white/50 text-[10px] leading-relaxed">
                  {card.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {card.icons.map((item, i: number) => {
                    const IconComponent = item.icon;
                    return (
                      <div
                        key={i}
                        className="flex items-center gap-1.5 px-1.5 py-1 rounded bg-white/5 border border-white/10"
                      >
                        <IconComponent className="w-3 h-3" style={{ color: item.color }} />
                        <span className="text-[9px] font-mono text-white/40">{item.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
};

function ServiceCard({ number, zIndex }: { number: "01" | "02" | "03" | "04" | "05"; zIndex: number }) {
  const service = serviceData[number];
  const cardRef = useRef(null);
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);

  const activeCard = service.cards[activeAccordionIndex];

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <div
      ref={cardRef}
      className="sticky top-0 min-h-screen w-full flex items-center justify-center overflow-hidden py-16 md:py-0 isolation-isolate"
      style={{
        zIndex,
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden"
      }}
    >
      {/* Background Layer - Who We Are Style */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Base Gradient - Dark to darker */}
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, 
              ${colors[900]} 0%, 
              #0a0b09 30%,
              #0a0b09 70%,
              ${colors[900]} 100%
            )`
          }}
        />

        {/* Dynamic Service Accent Gradient */}
        <motion.div
          className="absolute inset-[-20%] opacity-30"
          style={{
            background: service.gradient,
            y: backgroundY
          }}
        />

        {/* Floating accent elements */}
        <div
          className="absolute top-1/4 left-[5%] w-1 h-1 rounded-full"
          style={{
            background: service.accent,
            opacity: 0.4,
            boxShadow: `0 0 20px ${service.accent}40`
          }}
        />
        <div
          className="absolute top-1/2 right-[8%] w-1.5 h-1.5 rounded-full"
          style={{
            background: colors[300],
            opacity: 0.3,
            boxShadow: `0 0 30px ${colors[300]}30`
          }}
        />
        <div
          className="absolute top-3/4 left-[12%] w-1 h-1 rounded-full"
          style={{
            background: service.accent,
            opacity: 0.5,
            boxShadow: `0 0 15px ${service.accent}50`
          }}
        />
      </div>

      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40vw] md:text-[30vw] font-bold leading-none pointer-events-none select-none"
        style={{
          color: colors[200],
          opacity: 0.03,
          fontFamily: 'monospace'
        }}
      >
        {number}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-16 w-full pt-16 pb-8 md:py-20">
        <div className="grid grid-cols-12 gap-4 md:gap-16 items-start md:items-center">

          <div className="col-span-12 lg:col-span-4 mt-4 md:mt-0">
            <div
              className="text-[10px] md:text-sm font-mono uppercase tracking-[0.2em] md:tracking-[0.3em] mb-1 md:mb-4"
              style={{ color: service.accent }}
            >
              <ScrambleText text={activeAccordionIndex === 0 ? `Service ${number}` : "INCLUDES"} />
            </div>

            {/* Dynamic Scrambled Title */}
            <h2
              className="text-2xl md:text-4xl lg:text-5xl font-extralight leading-tight drop-shadow-2xl mb-2 md:mb-6 min-h-[1.5em] md:min-h-[2.5em] lg:min-h-[2em]"
              style={{ color: colors[50] }}
            >
              <ScrambleText text={activeCard.fullTitle} />
            </h2>

            <div
              className="w-10 md:w-20 h-px mb-3 md:mb-8"
              style={{ background: `linear-gradient(to right, ${service.accent}, transparent)` }}
            />

            {/* Dynamic Sub-Description */}
            <motion.p
              key={activeAccordionIndex}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-white/60 text-[11px] md:text-base mb-4 md:mb-8 w-[85vw] md:max-w-sm font-light leading-relaxed"
            >
              {activeCard.description}
            </motion.p>

            {/* Mobile Tech Accordion (Visible on SM/MD) */}
            <div className="lg:hidden w-full">
              <MobileFeatureAccordion
                cards={service.cards}
                activeIndex={activeAccordionIndex}
                onSelect={setActiveAccordionIndex}
              />
            </div>

            {/* Dynamic Tech/Platform Icons (Desktop Only) */}
            <div className="hidden lg:flex flex-wrap gap-3">
              {activeCard.icons.map((item, index: number) => {
                const IconComponent = item.icon;
                return (
                  <motion.div
                    key={`${activeAccordionIndex}-${index}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-lg transition-all duration-300 hover:scale-110 backdrop-blur-sm"
                    style={{
                      background: `${service.accent}20`,
                      border: `1px solid ${service.accent}40`
                    }}
                  >
                    <IconComponent
                      className="w-5 h-5 md:w-6 md:h-6 transition-colors duration-300 drop-shadow-lg"
                      style={{ color: item.color }}
                    />
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none"
                      style={{ background: colors[800], color: colors[100] }}
                    >
                      {item.name}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right Side: Interactive Image Accordion (Desktop Only) */}
          <div className="hidden lg:flex col-span-12 lg:col-span-8 justify-center lg:justify-end">
            <div
              className="flex flex-row items-center gap-2 md:gap-4 p-2 overflow-hidden"
              onMouseLeave={() => setActiveAccordionIndex(0)}
            >
              {service.cards.map((card, index: number) => (
                <AccordionItem
                  key={index}
                  title={card.shortTitle}
                  imageUrl={serviceImages[number][index] || serviceImages["01"][0]}
                  isActive={index === activeAccordionIndex}
                  onMouseEnter={() => setActiveAccordionIndex(index)}
                  accentColor={service.accent}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-4 left-4 md:top-8 md:left-8 w-6 md:w-8 h-px" style={{ background: `linear-gradient(to right, ${service.accent}60, transparent)` }} />
      <div className="absolute top-4 left-4 md:top-8 md:left-8 w-px h-6 md:h-8" style={{ background: `linear-gradient(to bottom, ${service.accent}60, transparent)` }} />
      <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 w-6 md:w-8 h-px" style={{ background: `linear-gradient(to left, ${service.accent}60, transparent)` }} />
      <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 w-px h-6 md:h-8" style={{ background: `linear-gradient(to top, ${service.accent}60, transparent)` }} />

      {
        number === "01" && (
          <div className="hidden md:flex absolute bottom-12 left-1/2 -translate-x-1/2 flex-col items-center gap-2">
            <div className="text-xs font-mono uppercase tracking-widest" style={{ color: colors[400] }}>Scroll</div>
            <div className="w-px h-8 scroll-indicator" style={{ background: `linear-gradient(to bottom, ${colors[400]}, transparent)` }} />
          </div>
        )
      }
    </div >
  );
}

const services: ("01" | "02" | "03" | "04" | "05")[] = ["01", "02", "03", "04", "05"];

export function ServicesSection() {
  return (
    <section className="relative">
      {services.map((number, index) => (
        <ServiceCard
          key={number}
          number={number}
          zIndex={index + 1}
        />
      ))}
    </section>
  );
}

export default ServicesSection;
