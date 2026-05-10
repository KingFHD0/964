"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Cpu, Search, Sparkles } from "lucide-react";
import { useContentStore } from "@/lib/store/content-store";
import { Badge } from "@/components/ui/Badge";
import { CategoryPills } from "@/components/prompts/CategoryPills";

const KINDS = ["Frontier LLM", "Open LLM", "Image", "Video", "Audio", "Embedding"] as const;

export default function ModelsPage() {
  const MODELS = useContentStore((s) => s.models);
  const [cat, setCat] = React.useState<string>("All");
  const [query, setQuery] = React.useState("");

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return MODELS.filter((m) => {
      const matchesCat = cat === "All" ? true : m.kind === cat;
      const matchesQ = q
        ? [m.name, m.org, m.family, m.useWhen].some((v) => v.toLowerCase().includes(q))
        : true;
      return matchesCat && matchesQ;
    });
  }, [MODELS, cat, query]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
      <div className="text-[11px] uppercase tracking-[0.22em] text-primary-muted/80">Models Hub</div>
      <h1 className="mt-3 font-display text-display-md font-medium tracking-tight text-grad">
        Every model worth knowing.
      </h1>
      <p className="mt-3 max-w-2xl text-[14.5px] leading-relaxed text-primary/60">
        Frontier, open, multimodal — with plain-spoken guidance on when to reach for each one.
      </p>

      <div className="mt-8">
        <div className="flex h-12 items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 transition-all duration-300 focus-within:border-accent/40 focus-within:bg-white/[0.05] focus-within:shadow-glow-xs">
          <Search className="h-4 w-4 text-primary-muted/80" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search models (GPT, Claude, Flux, Sora…)"
            className="h-full w-full bg-transparent text-[14px] text-primary outline-none placeholder:text-primary-muted/60"
          />
        </div>
      </div>

      <div className="mt-5">
        <CategoryPills categories={KINDS as readonly string[]} active={cat} onChange={setCat} />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((m, i) => (
          <motion.article
            id={m.id}
            key={m.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.55,
              delay: Math.min(i, 8) * 0.04,
              ease: [0.2, 0.8, 0.2, 1]
            }}
            className="card-premium group relative flex h-full flex-col overflow-hidden p-5 lift ring-accent-hover"
          >
            {/* Top-right orb */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full opacity-50 blur-2xl"
              style={{
                background: `radial-gradient(circle at center, ${m.gradient[0]}55, transparent 60%)`
              }}
            />

            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div
                  className="grid h-9 w-9 place-items-center rounded-xl border border-white/[0.08]"
                  style={{
                    background: `linear-gradient(135deg, ${m.gradient[0]}33, ${m.gradient[1]}22)`
                  }}
                >
                  <Cpu className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <div className="font-display text-[17px] font-medium tracking-tight text-primary">
                    {m.name}
                  </div>
                  <div className="text-[12px] text-primary-muted">
                    {m.org} · {m.family}
                  </div>
                </div>
              </div>
              <Badge tone="mute">{m.kind}</Badge>
            </div>

            <p className="mt-4 text-[13.5px] leading-relaxed text-primary/70">{m.useWhen}</p>

            <div className="mt-4">
              <div className="text-[10.5px] uppercase tracking-[0.2em] text-primary-muted/70">
                Strengths
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {m.strengths.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1 rounded-full border border-white/[0.06] bg-white/[0.02] px-2.5 py-0.5 text-[11.5px] text-primary/75"
                  >
                    <Sparkles className="h-2.5 w-2.5 text-accent-secondary" />
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/[0.04] pt-4 text-[12px] text-primary-muted">
              <div>
                <div className="text-[10px] uppercase tracking-[0.18em]">Context</div>
                <div className="mt-0.5 text-primary/85">{m.contextWindow ?? "—"}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.18em]">Released</div>
                <div className="mt-0.5 text-primary/85">{m.released}</div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
