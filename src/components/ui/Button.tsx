"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

interface BaseProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
}

interface ButtonAsButton extends BaseProps, Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> {
  href?: undefined;
}
interface ButtonAsLink extends BaseProps {
  href: string;
  target?: string;
  rel?: string;
}

type Props = ButtonAsButton | ButtonAsLink;

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm rounded-full",
  md: "h-11 px-5 text-sm rounded-full",
  lg: "h-14 px-7 text-base rounded-full"
};

const variants: Record<Variant, string> = {
  primary:
    "relative text-white bg-[linear-gradient(135deg,#7C8CFF_0%,#5CE1E6_100%)] shadow-[0_0_0_1px_rgba(255,255,255,0.08)_inset,0_8px_30px_-8px_rgba(124,140,255,0.5)] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.12)_inset,0_14px_44px_-8px_rgba(124,140,255,0.65)] hover:brightness-110",
  secondary:
    "text-primary bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] hover:border-white/20 backdrop-blur-xl",
  ghost:
    "text-primary/90 hover:text-primary hover:bg-white/[0.04]",
  outline:
    "text-primary border border-white/15 hover:border-accent/60 hover:text-white hover:shadow-glow-sm"
};

export function Button(props: Props) {
  const { variant = "primary", size = "md", className, children, leading, trailing } = props;
  const classes = cn(
    "inline-flex items-center justify-center gap-2 font-medium tracking-tight",
    "transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
    "focus-ring select-none whitespace-nowrap",
    "active:scale-[0.98]",
    sizes[size],
    variants[variant],
    className
  );
  const content = (
    <>
      {leading ? <span className="-ml-0.5 inline-flex">{leading}</span> : null}
      <span>{children}</span>
      {trailing ? <span className="-mr-0.5 inline-flex">{trailing}</span> : null}
    </>
  );
  if ("href" in props && props.href) {
    return (
      <Link href={props.href} target={props.target} rel={props.rel} className={classes}>
        {content}
      </Link>
    );
  }
  const { href: _h, variant: _v, size: _s, leading: _l, trailing: _t, ...btn } = props as any;
  return (
    <button className={classes} {...btn}>
      {content}
    </button>
  );
}
