"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

/**
 * Floating TOC — tracks the currently-visible heading via IntersectionObserver
 * and renders a subtle accent indicator next to it.
 */
export function ArticleToc({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = React.useState<string>(items[0]?.id ?? "");

  React.useEffect(() => {
    if (!items.length) return;
    const elements = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => !!el);
    if (!elements.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 1] }
    );
    elements.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [items]);

  return (
    <nav aria-label="On this page">
      <div className="text-[10.5px] uppercase tracking-[0.22em] text-primary-muted/70">
        On this page
      </div>
      <ul className="mt-4 space-y-1.5">
        {items.map((i) => {
          const isActive = i.id === active;
          return (
            <li key={i.id}>
              <a
                href={`#${i.id}`}
                className={cn(
                  "relative block rounded-md pl-3 py-1 text-[13px] transition-colors duration-300",
                  isActive
                    ? "text-primary"
                    : "text-primary-muted/80 hover:text-primary/90"
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "absolute left-0 top-1/2 h-[60%] w-[2px] -translate-y-1/2 rounded-full transition-all duration-300",
                    isActive
                      ? "bg-gradient-to-b from-accent to-accent-secondary shadow-[0_0_10px_rgba(124,140,255,0.6)]"
                      : "bg-white/[0.08]"
                  )}
                />
                {i.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
