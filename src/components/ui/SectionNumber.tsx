import { cn } from "@/lib/cn";

interface Props {
  value: string | number;
  className?: string;
  tone?: "dark" | "light";
}

export default function SectionNumber({ value, className, tone = "dark" }: Props) {
  const color =
    tone === "light" ? "rgba(20,20,20,0.04)" : "rgba(255,255,255,0.025)";
  return (
    <span
      className={cn("pointer-events-none select-none leading-none", className)}
      style={{
        fontFamily: "var(--font-monument), sans-serif",
        fontWeight: 800,
        color,
        fontSize: "clamp(140px, 20vw, 320px)",
      }}
    >
      {typeof value === "number" ? String(value).padStart(2, "0") : value}
    </span>
  );
}
