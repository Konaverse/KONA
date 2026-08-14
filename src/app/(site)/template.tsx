"use client";

import { motion } from "framer-motion";

const transition = { 
  duration: 0.6, 
  ease: [0.33, 1, 0.68, 1] as [number, number, number, number] 
};

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {/* 10-Stripe Premium Shutter */}
      <div className="fixed inset-0 z-[9999] pointer-events-none flex overflow-hidden">
        {/* Single Grain Overlay for all stripes to reduce repaints */}
        <div 
          className="absolute inset-0 opacity-[0.03] z-10 pointer-events-none bg-repeat" 
          style={{ 
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23noise)'/%3E%3C/svg%3E\")",
            backgroundSize: "150px 150px"
          }} 
        />
        
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="h-full flex-1 bg-[#08080a] origin-bottom will-change-transform"
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 0 }}
            transition={{ ...transition, delay: 0.02 * i }}
          />
        ))}
      </div>

      {/* Atmospheric Page Content Reveal */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number], delay: 0.2 }}
      >
        {children}
      </motion.div>
    </div>
  );
}
