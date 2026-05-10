"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export function CategoryPills({
  categories,
  active,
  onChange,
  className
}: {
  categories: readonly string[];
  active: string;
  onChange: (c: string) => void;
  className?: string;
}) {
  const items = ["All", ...categories];
  return (
    <div className={cn("relative -mx-4 px-4 md:mx-0 md:px-0", className)}>
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar md:flex-wrap md:overflow-visible">
        {items.map((c) => {
          const isActive = active === c;
          return (
            <button
              key={c}
              onClick={() => onChange(c)}
              className={cn(
                "focus-ring relative shrink-0 rounded-full px-4 py-2 text-[13px] font-medium transition-all duration-300",
                isActive
                  ? "text-white"
                  : "text-primary/70 hover:text-primary bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12]"
              )}
            >
              {isActive ? (
                <motion.span
                  layoutId="active-pill"
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "linear-gradient(135deg, rgba(124,140,255,0.35), rgba(92,225,230,0.25))",
                    boxShadow: "inset 0 0 0 1px rgba(124,140,255,0.4), 0 8px 24px -10px rgba(124,140,255,0.5)"
                  }}
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              ) : null}
              <span className="relative">{c}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
