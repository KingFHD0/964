"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { PROMPTS, type Prompt } from "@/lib/prompts";
import { PromptCard } from "@/components/prompts/PromptCard";
import { PromptDetailDialog } from "@/components/prompts/PromptDetailDialog";
import { useFavorites } from "@/lib/favorites";

export default function FavoritesPage() {
  const fav = useFavorites();
  const [active, setActive] = React.useState<Prompt | null>(null);

  const saved = React.useMemo(
    () => PROMPTS.filter((p) => fav.has(p.id)),
    [fav]
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
      <div className="flex items-start justify-between gap-6">
        <div>
          <div className="text-[11px] uppercase tracking-[0.22em] text-primary-muted/80">Favorites</div>
          <h1 className="mt-3 font-display text-display-md font-medium tracking-tight text-grad">
            Your private constellation.
          </h1>
          <p className="mt-3 max-w-xl text-[14.5px] leading-relaxed text-primary/60">
            Every prompt you save lives here, quietly waiting for its moment.
          </p>
        </div>
        <div className="hidden items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.03] px-4 py-2 text-[12.5px] text-primary/80 sm:inline-flex">
          <Heart className="h-3.5 w-3.5 text-accent" />
          {saved.length} saved
        </div>
      </div>

      {saved.length === 0 ? (
        <EmptyFavorites />
      ) : (
        <motion.div layout className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {saved.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 12 }}
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

function EmptyFavorites() {
  return (
    <div className="mt-12 rounded-3xl border border-dashed border-white/[0.08] bg-white/[0.02] p-12 text-center md:p-16">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-white/[0.06] bg-white/[0.03]">
        <Heart className="h-5 w-5 text-accent" />
      </div>
      <div className="mt-6 font-display text-[22px] font-medium tracking-tight text-primary">
        Nothing saved yet.
      </div>
      <p className="mx-auto mt-2 max-w-md text-[14px] text-primary/60">
        Tap the heart on any prompt. We will collect them here so you can return whenever the work calls.
      </p>
      <Link
        href="/library"
        className="mt-7 inline-flex h-10 items-center rounded-full bg-grad-cta px-5 text-[13px] font-medium text-white shadow-[0_8px_24px_-10px_rgba(124,140,255,0.55)] transition-all hover:brightness-110"
      >
        Browse the library
      </Link>
    </div>
  );
}
