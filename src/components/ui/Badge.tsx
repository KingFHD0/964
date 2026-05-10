import * as React from "react";
import { cn } from "@/lib/cn";

type Tone = "default" | "accent" | "secondary" | "mute";

export function Badge({
  tone = "default",
  className,
  children
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  const tones: Record<Tone, string> = {
    default: "bg-white/[0.05] text-primary/80 border-white/[0.08]",
    accent: "bg-accent/10 text-accent border-accent/20",
    secondary: "bg-accent-secondary/10 text-accent-secondary border-accent-secondary/20",
    mute: "bg-white/[0.03] text-primary-muted border-white/[0.06]"
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium tracking-wide uppercase",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
