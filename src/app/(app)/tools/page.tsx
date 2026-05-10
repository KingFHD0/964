"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, ExternalLink, Search, Star } from "lucide-react";
import { TOOL_CATEGORIES, type AiTool } from "@/lib/ecosystem";
import { useContentStore } from "@/lib/store/content-store";
import { Badge } from "@/components/ui/Badge";
import { CategoryPills } from "@/components/prompts/CategoryPills";
import { AdSlot } from "@/components/ads/AdSlot";

export default function ToolsPage() {
  const TOOLS = useContentStore((s) => s.tools);
  const [query, setQuery] = React.useState("");
  const [cat, setCat] = React.useState<string>("All");

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return TOOLS.filter((t) => {
      const matchesCat = cat === "All" ? true : t.category === cat;
      const matchesQ = q
        ? [t.name, t.tagline, t.description, t.category].some((v) => v.toLowerCase().includes(q))
        : true;
      return matchesCat && matchesQ;
    });
  }, [TOOLS, query, cat]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
      <div className="text-[11px] uppercase tracking-[0.22em] text-primary-muted/80">AI Tools</div>
      <h1 className="mt-3 font-display text-display-md font-medium tracking-tight text-grad">
        A directory of tools worth using.
      </h1>
      <p className="mt-3 max-w-2xl text-[14.5px] leading-relaxed text-primary/60">
        Hand-picked by operators. Every tool on this list has been shipped with, at least once.
      </p>

      <div className="mt-8">
        <div className="flex h-12 items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 transition-all duration-300 focus-within:border-accent/40 focus-within:bg-white/[0.05] focus-within:shadow-glow-xs">
          <Search className="h-4 w-4 text-primary-muted/80" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools (e.g. Midjourney, voice, coding)…"
            className="h-full w-full bg-transparent text-[14px] text-primary outline-none placeholder:text-primary-muted/60"
          />
        </div>
      </div>

      <div className="mt-5">
        <CategoryPills categories={TOOL_CATEGORIES} active={cat} onChange={setCat} />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((t, i) => (
          <ToolCard key={t.id} tool={t} delay={Math.min(i, 8) * 0.04} />
        ))}
      </div>

      {/* Sponsored — blends naturally after the grid */}
      <div className="mt-10">
        <AdSlot placement="tools-inline" variant="inline" />
      </div>
    </div>
  );
}

function ToolCard({ tool, delay }: { tool: AiTool; delay: number }) {
  return (
    <motion.article
      id={tool.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: [0.2, 0.8, 0.2, 1] }}
      className="card-premium group relative flex h-full flex-col overflow-hidden lift ring-accent-hover"
    >
      {/* gradient strip */}
      <div className="relative h-24 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${tool.gradient[0]}44 0%, ${tool.gradient[1]}22 60%, #0B1020 100%)`
          }}
        />
        <svg
          className="absolute -right-10 -top-10 h-[200px] w-[200px] opacity-45 transition-opacity duration-700 group-hover:opacity-80"
          viewBox="0 0 400 400"
          fill="none"
          aria-hidden
        >
          <circle cx="200" cy="200" r="150" stroke={tool.gradient[0]} strokeOpacity="0.45" />
          <circle cx="200" cy="200" r="95" stroke={tool.gradient[1]} strokeOpacity="0.4" />
          <circle cx="350" cy="200" r="3" fill={tool.gradient[1]} />
        </svg>
      </div>

      <div className="relative flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-[18px] font-medium tracking-tight text-primary">
                {tool.name}
              </h3>
              {tool.featured ? <Badge tone="accent">Featured</Badge> : null}
            </div>
            <div className="mt-0.5 text-[12px] text-primary-muted">{tool.category}</div>
          </div>
          <div className="flex shrink-0 items-center gap-1 rounded-full border border-white/[0.08] bg-white/[0.03] px-2 py-1 text-[11.5px] text-primary/85">
            <Star className="h-3 w-3 fill-accent-secondary text-accent-secondary" />
            {tool.rating.toFixed(1)}
          </div>
        </div>

        <p className="mt-3 text-[14px] leading-relaxed text-primary/75">{tool.tagline}</p>
        <p className="mt-1.5 line-clamp-3 text-[13px] leading-relaxed text-primary/55">
          {tool.description}
        </p>

        <div className="mt-4">
          <div className="text-[10.5px] uppercase tracking-[0.2em] text-primary-muted/70">Use for</div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {tool.useCases.slice(0, 3).map((u) => (
              <span
                key={u}
                className="rounded-full border border-white/[0.06] bg-white/[0.02] px-2.5 py-0.5 text-[11.5px] text-primary/70"
              >
                {u}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <div className="flex items-center gap-1.5 text-[11.5px] text-primary-muted">
            <span>Alt:</span>
            <span className="text-primary/75">{tool.alternatives.slice(0, 2).join(", ")}</span>
          </div>
          <Link
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring inline-flex h-8 items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 text-[12px] text-primary/85 transition-all duration-300 hover:border-accent/30 hover:text-primary"
          >
            Visit
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
