import { cn } from "@/lib/cn";

interface Props {
  ref?: string;
  className?: string;
  tone?: "dark" | "light";
}

export default function ArchiveLabel({ ref: refValue = "01", className, tone = "dark" }: Props) {
  const color = tone === "light" ? "var(--color-text-muted-light)" : "var(--color-text-muted-dark)";
  return (
    <span
      className={cn("inline-flex items-center gap-2 text-[10px] tracking-[0.32em] uppercase", className)}
      style={{ fontFamily: "var(--font-geist-mono), monospace", color }}
    >
      <span aria-hidden style={{ opacity: 0.5 }}>Archive_Ref:</span>
      <span>{refValue}</span>
    </span>
  );
}
