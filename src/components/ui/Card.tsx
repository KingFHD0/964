import * as React from "react";
import { cn } from "@/lib/cn";

/**
 * Premium card — layered glass with soft depth.
 *
 * Structure (bottom to top):
 *  - Rounded container with glass base
 *  - Top highlight sheen (inner top-edge)
 *  - Soft radial sheen from top-left (card-sheen)
 *  - Content
 *
 * Feels: floating, cinematic, elevated.
 */
export function Card({
  className,
  children,
  interactive = false,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { interactive?: boolean }) {
  return (
    <div
      className={cn(
        "group/card relative rounded-3xl border border-white/[0.06]",
        "bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.012))]",
        "shadow-elev-2 overflow-hidden",
        "backdrop-blur-[14px] backdrop-saturate-150",
        interactive && "lift ring-accent-hover cursor-pointer",
        className
      )}
      {...props}
    >
      {/* soft radial sheen from top-left */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60 transition-opacity duration-700 group-hover/card:opacity-90"
        style={{
          background:
            "radial-gradient(120% 80% at 0% 0%, rgba(124,140,255,0.08), transparent 55%)"
        }}
        aria-hidden
      />
      {/* top inner highlight */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)"
        }}
        aria-hidden
      />
      <div className="relative">{children}</div>
    </div>
  );
}

export function CardHeader({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-6 pt-6", className)} {...p} />;
}
export function CardBody({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-6 py-5", className)} {...p} />;
}
export function CardFooter({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-6 pb-6", className)} {...p} />;
}
