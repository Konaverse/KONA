"use client";

import Link, { LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode, forwardRef } from "react";

interface TransitionLinkProps extends LinkProps {
  children: ReactNode;
  className?: string;
  onMouseEnter?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  style?: React.CSSProperties;
}

const STRIPES     = 10;
const BG          = '#08080a';
const CLOSE_DUR   = 0.5;   // s — each stripe close duration
const CLOSE_LAG   = 0.02;  // s — stagger between stripes
const NAV_DELAY   = (CLOSE_DUR + (STRIPES - 1) * CLOSE_LAG) * 1000 + 100; // ms

const TransitionLink = forwardRef<HTMLAnchorElement, TransitionLinkProps>(
  ({ href, children, className, onClick, ...props }, ref) => {
    const router = useRouter();

    const handleTransition = async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      if (onClick) onClick(e);
      if (e.defaultPrevented) return;
      e.preventDefault();

      // Create overlay
      const overlay = document.createElement("div");
      overlay.style.cssText = "position:fixed;inset:0;z-index:10000;pointer-events-none;display:flex;overflow:hidden;";

      // Add grain overlay once
      const grain = document.createElement("div");
      grain.style.cssText = `
        position:absolute;inset:0;opacity:0.03;z-index:11;pointer-events:none;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23noise)'/%3E%3C/svg%3E");
        background-size: 150px 150px;
      `;
      overlay.appendChild(grain);

      const stripes: HTMLDivElement[] = [];
      for (let i = 0; i < STRIPES; i++) {
        const s = document.createElement("div");
        s.style.cssText = `
          height:100%;flex:1;background:${BG};transform-origin:top;transform:scaleY(0);will-change:transform;
          transition:transform ${CLOSE_DUR}s cubic-bezier(0.33, 1, 0.68, 1) ${(i * CLOSE_LAG).toFixed(3)}s;
        `;
        overlay.appendChild(s);
        stripes.push(s);
      }

      document.body.appendChild(overlay);

      // Trigger exit animation
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          stripes.forEach((s) => (s.style.transform = "scaleY(1)"));
        });
      });

      // Navigate after animation is complete
      setTimeout(() => {
        router.push(href.toString());
        
        // Handover: The new page's template.tsx will mount its own shutter at scaleY(1).
        // we keep our overlay for a tiny bit longer to mask the mount, then remove it.
        setTimeout(() => {
          if (document.body.contains(overlay)) {
            // Fade out the old overlay while the new one is already animating
            overlay.style.transition = 'opacity 0.2s ease-out';
            overlay.style.opacity = '0';
            setTimeout(() => {
              if (document.body.contains(overlay)) document.body.removeChild(overlay);
            }, 200);
          }
        }, 150); // Small buffer for the new page to mount
      }, NAV_DELAY);
    };

    return (
      <Link href={href} ref={ref} onClick={handleTransition} className={className} {...props}>
        {children}
      </Link>
    );
  }
);

TransitionLink.displayName = "TransitionLink";
export default TransitionLink;
