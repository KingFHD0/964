"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { CATEGORIES, PROMPTS, type Prompt } from "@/lib/prompts";
import { PromptCard } from "@/components/prompts/PromptCard";
import { CategoryPills } from "@/components/prompts/CategoryPills";
import { PromptDetailDialog } from "@/components/prompts/PromptDetailDialog";

export default function LibraryPage() {
  return (
    <React.Suspense fallback={<LibrarySkeleton />}>
      <LibraryView />
    </React.Suspense>
  );
}

function LibraryView() {
  const search = useSearchParams();
  const initialQuery = search.get("q") ?? "";
  const initialOpen = search.get("open") ?? "";

  const [query, setQuery] = React.useState(initialQuery);
  const [activeCat, setActiveCat] = React.useState<string>("All");
  const [active, setActive] = React.useState<Prompt | null>(null);

  React.useEffect(() => {
    if (initialOpen) {
      const p = PROMPTS.find((x) => x.id === initialOpen);
      if (p) setActive(p);
    }
  }, [initialOpen]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return PROMPTS.filter((p) => {
      const matchesCat = activeCat === "All" ? true : p.category === activeCat;
      const matchesQ = q
        ? [p.title, p.description, p.category, p.body].some((v) => v.toLowerCase().includes(q))
        : true;
      return matchesCat && matchesQ;
    });
  }, [query, activeCat]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
      <div className="flex flex-col gap-3">
        <div className="text-[11px] uppercase tracking-[0.22em] text-primary-muted/80">Library</div>
        <h1 className="font-display text-display-md font-medium tracking-tight text-grad">
          A curated library of premium prompts.
        </h1>
        <p className="max-w-2xl text-[14.5px] leading-relaxed text-primary/60">
          Search by category, workflow, or keyword. Tap any card to preview and copy in one motion.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex h-12 flex-1 items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 transition-colors focus-within:border-accent/40">
          <Search className="h-4 w-4 text-primary-muted/80" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search prompts…"
            className="h-full w-full bg-transparent text-[14px] text-primary outline-none placeholder:text-primary-muted/60"
            aria-label="Search"
          />
        </div>
        <button className="focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 text-[13px] text-primary/85 hover:border-white/[0.12]">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </button>
      </div>

      <div className="mt-5">
        <CategoryPills categories={CATEGORIES} active={activeCat} onChange={setActiveCat} />
      </div>

      <div className="mt-8 flex items-baseline justify-between">
        <div className="text-[13px] text-primary-muted">
          {filtered.length} prompt{filtered.length === 1 ? "" : "s"}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <motion.div layout className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: Math.min(i, 8) * 0.04, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <PromptCard prompt={p} onOpen={() => setActive(p)} />
            </motion.div>
          ))}
        </motion.div>
      )}

      <PromptDetailDialog prompt={active} onClose={() => setActive(null)} />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mt-10 rounded-3xl border border-dashed border-white/[0.08] bg-white/[0.02] p-12 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-white/[0.06] bg-white/[0.03]">
        <Search className="h-5 w-5 text-primary/70" />
      </div>
      <div className="mt-5 font-display text-[18px] font-medium text-primary">No matches yet</div>
      <p className="mx-auto mt-1.5 max-w-sm text-[13.5px] text-primary/60">
        Try a broader keyword, or pick a different category above.
      </p>
    </div>
  );
}

function LibrarySkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
      <div className="h-5 w-24 rounded-md bg-white/[0.05]" />
      <div className="mt-4 h-10 w-80 rounded-md bg-white/[0.04]" />
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-72 animate-pulse rounded-3xl bg-white/[0.03]" />
        ))}
      </div>
    </div>
  );
}
