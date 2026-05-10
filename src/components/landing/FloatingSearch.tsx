"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Command, CornerDownLeft, Search } from "lucide-react";

const SUGGESTIONS = [
  "Iraqi dialect captions",
  "Luxury brand manifesto",
  "Cinematic product ad",
  "Viral hooks",
  "Restaurant signature story"
];

export function FloatingSearch() {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [focused, setFocused] = React.useState(false);
  const ref = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        ref.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  function submit(q: string) {
    const target = q.trim();
    if (!target) return router.push("/library");
    router.push(`/library?q=${encodeURIComponent(target)}`);
  }

  return (
    <div className="relative mx-auto w-full max-w-2xl">
      {/* Outer glow halo */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-6 -z-10 rounded-[40px] opacity-60 blur-2xl"
        style={{
          background:
            "radial-gradient(60% 100% at 50% 50%, rgba(124,140,255,0.25) 0%, rgba(92,225,230,0.10) 40%, transparent 70%)"
        }}
      />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(query);
        }}
        className="glass-strong flex h-16 items-center gap-3 rounded-2xl px-4 shadow-[0_20px_80px_-20px_rgba(0,0,0,0.9)] transition-colors focus-within:border-accent/40"
      >
        <Search className="h-5 w-5 text-primary/60" />
        <input
          ref={ref}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => window.setTimeout(() => setFocused(false), 120)}
          placeholder="Search prompts, workflows, or categories…"
          className="h-full w-full bg-transparent text-[15px] text-primary outline-none placeholder:text-primary-muted/70"
          aria-label="Search Aether"
        />
        <div className="hidden items-center gap-1 rounded-md border border-white/[0.08] bg-white/[0.03] px-1.5 py-1 text-[11px] text-primary-muted sm:flex">
          <Command className="h-3 w-3" />
          <span>K</span>
        </div>
      </form>

      <AnimatePresence>
        {focused && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute inset-x-0 top-[calc(100%+10px)] z-20 rounded-2xl glass-strong p-2 shadow-elev-2"
          >
            <div className="px-3 py-2 text-[11px] uppercase tracking-[0.22em] text-primary-muted/80">
              Trending
            </div>
            <ul className="flex flex-col">
              {SUGGESTIONS.map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => submit(s)}
                    className="group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-[14px] text-primary/85 transition-colors hover:bg-white/[0.04] hover:text-primary"
                  >
                    <span className="flex items-center gap-3">
                      <Search className="h-3.5 w-3.5 text-primary-muted/70" />
                      {s}
                    </span>
                    <CornerDownLeft className="h-3.5 w-3.5 text-primary-muted/50 opacity-0 transition-opacity group-hover:opacity-100" />
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
