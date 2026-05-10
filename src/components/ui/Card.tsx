import * as React from "react";
import { cn } from "@/lib/cn";

export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative rounded-3xl border border-white/[0.06] bg-ink-800/40",
        "shadow-elev-1 overflow-hidden",
        "before:absolute before:inset-0 before:rounded-3xl before:bg-grad-surface before:pointer-events-none",
        className
      )}
      {...props}
    >
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
