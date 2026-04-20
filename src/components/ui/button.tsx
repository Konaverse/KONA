"use client";

import Link from "next/link";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary";
type Tone = "dark" | "light";

type CommonProps = {
  variant?: ButtonVariant;
  tone?: Tone;
  className?: string;
  children: ReactNode;
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

const baseCls =
  "relative inline-flex items-center gap-3 px-7 py-3.5 text-[11px] tracking-[0.24em] uppercase transition-all duration-[450ms] ease-[cubic-bezier(0.16,1,0.3,1)] select-none";

const primaryDark =
  "bg-[var(--color-black)] text-[var(--color-text-primary-dark)] border border-[var(--color-border-dark)] hover:border-[var(--color-green-neon)] hover:shadow-[0_0_30px_rgba(0,255,136,0.12)]";

const primaryLight =
  "bg-[var(--color-off-white)] text-[var(--color-text-primary-light)] border border-[var(--color-border-light)] hover:border-[var(--color-green-deep)]";

const secondaryBase =
  "px-0 py-1 border-0 bg-transparent group relative inline-flex items-center gap-2 text-[11px] tracking-[0.24em] uppercase";

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, Props>(
  function Button(props, ref) {
    const { variant = "primary", tone = "dark", className, children, ...rest } = props as CommonProps &
      Record<string, unknown>;

    if (variant === "secondary") {
      const color = tone === "light" ? "var(--color-green-deep)" : "var(--color-green-neon)";
      const textColor =
        tone === "light" ? "text-[var(--color-text-primary-light)]" : "text-[var(--color-text-primary-dark)]";
      const content = (
        <>
          <span className={cn(textColor, "transition-colors duration-300 group-hover:text-[var(--color-green-neon)]")}>
            {children}
          </span>
          <span
            aria-hidden
            className="pointer-events-none absolute left-0 -bottom-0.5 h-px w-full origin-left scale-x-0 transition-transform duration-[450ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
            style={{ background: color }}
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

    const fontFamily = { fontFamily: "var(--font-geist-mono), monospace" };
    const toneCls = tone === "light" ? primaryLight : primaryDark;

    if ("href" in props && props.href) {
      const external = "external" in props && props.external;
      return (
        <Link
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={props.href}
          data-cursor="hover"
          className={cn(baseCls, toneCls, className)}
          style={fontFamily}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
        >
          {children}
        </Link>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        data-cursor="hover"
        className={cn(baseCls, toneCls, className)}
        style={fontFamily}
        {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {children}
      </button>
    );
  }
);

export default Button;
