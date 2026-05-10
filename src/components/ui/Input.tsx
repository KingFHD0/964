"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  containerClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, containerClassName, leading, trailing, ...props },
  ref
) {
  return (
    <div
      className={cn(
        "group flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4",
        "transition-all duration-300 focus-within:border-accent/40 focus-within:bg-white/[0.05] focus-within:shadow-glow-sm",
        "backdrop-blur-xl",
        containerClassName
      )}
    >
      {leading ? <span className="text-primary-muted/80">{leading}</span> : null}
      <input
        ref={ref}
        className={cn(
          "h-12 w-full bg-transparent text-sm text-primary placeholder:text-primary-muted/60",
          "outline-none focus:outline-none",
          className
        )}
        {...props}
      />
      {trailing ? <span className="text-primary-muted/80">{trailing}</span> : null}
    </div>
  );
});
