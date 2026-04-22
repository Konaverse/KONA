"use client";

import Link from "next/link";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary";

type CommonProps = {
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
  showArrow?: boolean;
  tone?: "light" | "dark";
};

type AsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & {
    href?: undefined;
  };

type AsLink = CommonProps & {
  href: string;
  external?: boolean;
};

type Props = AsButton | AsLink;

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, Props>(
  function Button(props, ref) {
    const { 
      variant = "primary", 
      className, 
      children, 
      showArrow = true,
      ...rest 
    } = props as CommonProps & Record<string, unknown>;

    // ─── Primary Variant: Editorial Pill Button ────────────────────────
    if (variant === "primary") {
      const primaryBase =
        "relative overflow-hidden group inline-flex items-center justify-center gap-3 px-8 py-4 bg-[var(--color-off-white)] text-[var(--color-obsidian)] rounded-full font-sans text-xs font-bold tracking-widest uppercase transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_10px_40px_-10px_rgba(107,127,98,0.55)] select-none";

      const content = (
        <>
          <span className="relative z-10 flex items-center gap-2 transition-colors duration-300 delay-[60ms] group-hover:text-white">
            {children}
            {showArrow && (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </span>
          {/* Sweeping Sage Fill */}
          <div className="absolute inset-0 bg-[var(--color-sage)] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] rounded-full" />
          {/* Shimmer sweep */}
          <span
            aria-hidden
            className="pointer-events-none absolute top-0 left-0 h-full w-[60%] -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.18] to-transparent -translate-x-full group-hover:translate-x-[167%] transition-transform duration-700 delay-100 ease-[cubic-bezier(0.22,1,0.36,1)]"
          />
        </>
      );

      if ("href" in props && props.href) {
        const external = "external" in props && props.external;
        return (
          <Link
            ref={ref as React.Ref<HTMLAnchorElement>}
            href={props.href}
            data-cursor="hover"
            className={cn(primaryBase, className)}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
          >
            {content}
          </Link>
        );
      }

      return (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          data-cursor="hover"
          className={cn(primaryBase, className)}
          {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
        >
          {content}
        </button>
      );
    }

    // ─── Secondary Variant: Clean Text Link ────────────────────────
    const secondaryBase =
      "group inline-flex items-center gap-2 text-xs font-sans tracking-widest uppercase transition-colors duration-300 select-none text-[var(--color-off-white)] hover:text-white";

    const content = (
      <>
        <span className="relative">
          {children}
          <span 
             aria-hidden 
             className="absolute left-0 -bottom-1 h-[1px] w-full origin-left scale-x-0 bg-[var(--color-sage)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" 
          />
        </span>
        {showArrow && (
          <svg className="transition-transform duration-500 ease-out group-hover:translate-x-1 opacity-70 group-hover:opacity-100 group-hover:text-[var(--color-sage)]" width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </>
    );

    if ("href" in props && props.href) {
      const external = "external" in props && props.external;
      return (
        <Link
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={props.href}
          data-cursor="hover"
          className={cn(secondaryBase, className)}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        data-cursor="hover"
        className={cn(secondaryBase, className)}
        {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {content}
      </button>
    );
  }
);

export default Button;
