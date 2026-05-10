"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Globe, Search } from "lucide-react";
import { useContentStore } from "@/lib/store/content-store";
import { Badge } from "@/components/ui/Badge";
import { CategoryPills } from "@/components/prompts/CategoryPills";
import { AdSlot } from "@/components/ads/AdSlot";

const KINDS = ["Release", "Research", "Industry", "Region"] as const;

export default function NewsPage() {
  const NEWS = useContentStore((s) => s.news);
  const [cat, setCat] = React.useState<string>("All");
  const [query, setQuery] = React.useState("");

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return NEWS.filter((n) => {
      const matchesCat = cat === "All" ? true : n.kind === cat;
      const matchesQ = q
        ? [n.title, n.body, n.source].some((v) => v.toLowerCase().includes(q))
        : true;
      return matchesCat && matchesQ;
    });
  }, [NEWS, cat, query]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:px-8 md:py-12">
      <div className="text-[11px] uppercase tracking-[0.22em] text-primary-muted/80">News</div>
      <h1 className="mt-3 font-display text-display-md font-medium tracking-tight text-grad">
        Signal, not noise.
      </h1>
      <p className="mt-3 max-w-2xl text-[14.5px] leading-relaxed text-primary/60">
        The AI stories that matter this week, selected and summarized with a calm editorial hand.
      </p>

      <div className="mt-8">
        <div className="flex h-12 items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 transition-all duration-300 focus-within:border-accent/40 focus-within:bg-white/[0.05] focus-within:shadow-glow-xs">
          <Search className="h-4 w-4 text-primary-muted/80" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search news…"
            className="h-full w-full bg-transparent text-[14px] text-primary outline-none placeholder:text-primary-muted/60"
          />
        </div>
      </div>

      <div className="mt-5">
        <CategoryPills categories={KINDS as readonly string[]} active={cat} onChange={setCat} />
      </div>

      <div className="mt-10 space-y-3">
        {filtered.map((n, i) => (
          <React.Fragment key={n.id}>
            <motion.article
              id={n.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: Math.min(i, 8) * 0.04,
                ease: [0.2, 0.8, 0.2, 1]
              }}
              className="card-premium group flex items-start gap-4 p-5 lift ring-accent-hover"
            >
              <div
                aria-hidden
                className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                style={{
                  background: n.unread ? "#5CE1E6" : "rgba(255,255,255,0.15)",
                  boxShadow: n.unread ? "0 0 10px rgba(92,225,230,0.6)" : "none"
                }}
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={n.kind === "Region" ? "secondary" : n.kind === "Release" ? "accent" : "mute"}>
                    {n.kind}
                  </Badge>
                  <span className="text-[12px] text-primary-muted">
                    {n.source} · {n.date}
                  </span>
                </div>
                <h3 className="mt-2 font-display text-[17px] font-medium leading-snug tracking-tight text-primary">
                  {n.title}
                </h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-primary/65">{n.body}</p>
              </div>
              <Globe className="mt-1 hidden h-4 w-4 shrink-0 text-primary-muted/60 sm:block" />
            </motion.article>
            {/* Insert sponsored story after the 3rd item to break the rhythm calmly */}
            {i === 2 ? <AdSlot placement="news-inline" variant="inline" /> : null}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
