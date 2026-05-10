"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Command, Search, Sparkles } from "lucide-react";

const SUGGESTIONS = [
  "Iraqi dialect captions",
  "AI tools for video",
  "Claude 4 vs GPT-5",
  "Launch film pipeline",
  "RAG vs fine-tuning"
];

/**
 * FloatingSearch — hero search with glass surface and accent glow.
 * Clicking/focusing opens the universal command palette.
 */
export function FloatingSearch() {
  const [hover, setHover] = React.useState(false);

  function openPalette() {
    if (typeof window !== "undefined" && window.__aetherOpenPalette) {
      window.__aetherOpenPalette();
    }
  }

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        /* palette handles it already */
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-2xl">
      {/* Halo */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-6 -z-10 rounded-[40px] opacity-70 blur-2xl transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(60% 100% at 50% 50%, rgba(124,140,255,0.25) 0%, rgba(92,225,230,0.10) 40%, transparent 70%)",
          opacity: hover ? 1 : 0.7
        }}
      />
      <button
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={openPalette}
        className="glass-strong group flex h-16 w-full items-center gap-3 rounded-2xl px-5 text-left shadow-[0_20px_80px_-20px_rgba(0,0,0,0.9)] transition-all duration-500 hover:border-accent/30 hover:shadow-[0_20px_80px_-16px_rgba(124,140,255,0.28)] focus-ring"
        aria-label="Open Aether search"
      >
        <Search className="h-5 w-5 text-primary/60 transition-colors group-hover:text-primary/85" />
        <span className="flex-1 text-[15px] text-primary-muted/75">
          Search prompts, tools, models, articles…
        </span>
        <span className="hidden items-center gap-1 rounded-md border border-white/[0.08] bg-white/[0.03] px-1.5 py-1 text-[11px] text-primary-muted sm:flex">
          <Command className="h-3 w-3" />
          <span>K</span>
        </span>
      </button>

      {/* Suggestion chips */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <Sparkles className="h-3 w-3 text-accent-secondary/80" aria-hidden />
        <span className="mr-1 text-[11px] uppercase tracking-[0.2em] text-primary-muted/80">Try</span>
        <AnimatePresence>
          {SUGGESTIONS.map((s, i) => (
            <motion.button
              key={s}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.05, duration: 0.5 }}
              onClick={openPalette}
              className="rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1 text-[12px] text-primary/80 transition-all duration-300 hover:border-accent/30 hover:text-primary"
            >
              {s}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
