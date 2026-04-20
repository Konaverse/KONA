import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface Props extends HTMLAttributes<HTMLDivElement> {
  tone?: "dark" | "light";
}

const Card = forwardRef<HTMLDivElement, Props>(function Card(
  { tone = "dark", className, style, children, ...rest },
  ref
) {
  const isDark = tone === "dark";
  return (
    <div
      ref={ref}
      className={cn("relative overflow-hidden", className)}
      style={{
        background: isDark ? "rgba(255,255,255,0.03)" : "var(--color-surface-light)",
        backdropFilter: isDark ? "blur(12px)" : undefined,
        WebkitBackdropFilter: isDark ? "blur(12px)" : undefined,
        border: `1px solid ${isDark ? "var(--color-border-dark)" : "var(--color-border-light)"}`,
        borderRadius: "var(--radius-card)",
        boxShadow: isDark
          ? "inset 0 1px 0 rgba(255,255,255,0.04), 0 30px 60px -30px rgba(0,0,0,0.6)"
          : "inset 0 1px 0 rgba(255,255,255,0.6), 0 30px 60px -30px rgba(0,0,0,0.15)",
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
});

export default Card;
