"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useContentStore } from "@/lib/store/content-store";
import { Badge } from "@/components/ui/Badge";

/**
 * CategoryShowcase — four cards from the library, sized like a Notion-style grid.
 * Picks the first featured-ish prompts and falls back to the first four.
 */
export function CategoryShowcase() {
  const prompts = useContentStore((s) => s.prompts);

  const picks = React.useMemo(() => {
    const ordered = [
      ...prompts.filter((p) => p.isNew || p.isPro),
      ...prompts.filter((p) => !p.isNew && !p.isPro)
    ];
    const take = ordered.slice(0, 4);
    return take.map((p, i) => ({
      ...p,
      span: i === 0 || i === 3 ? "lg:col-span-2" : ""
    }));
  }, [prompts]);

  return (
    <section id="categories" className="relative mx-auto max-w-7xl px-4 py-28 md:px-8 md:py-40">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div className="max-w-xl">
          <span className="inline-block rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-primary-muted">
            Library
          </span>
          <h2 className="mt-6 font-display text-display-lg font-medium text-grad">
            Ten categories. One aesthetic.
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-primary/60">
            From restaurants in Baghdad to luxury brands in Dubai — prompts tuned for the market
            that moves fastest.
          </p>
        </div>
        <Link
          href="/library"
          className="focus-ring inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-[13px] text-primary/85 transition-colors hover:border-white/[0.15] hover:text-primary"
        >
          Browse the full library
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {picks.map((p, i) => (
          <motion.article
            key={p.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: i * 0.06, ease: [0.2, 0.8, 0.2, 1] }}
            className={`group relative overflow-hidden rounded-3xl border border-white/[0.06] lift ${p.span}`}
          >
            {/* Gradient canvas */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, ${p.gradient[0]}33, ${p.gradient[1]}11 60%, #0B1020 100%)`
              }}
            />
            {/* Orbital lines */}
            <svg
              className="absolute -right-20 -top-20 h-[380px] w-[380px] opacity-30 transition-opacity duration-700 group-hover:opacity-50"
              viewBox="0 0 400 400"
              fill="none"
              aria-hidden
            >
              <circle cx="200" cy="200" r="160" stroke={p.gradient[0]} strokeOpacity="0.4" />
              <circle cx="200" cy="200" r="110" stroke={p.gradient[1]} strokeOpacity="0.35" />
              <circle cx="200" cy="200" r="60" stroke="white" strokeOpacity="0.2" />
              <circle cx="360" cy="200" r="3" fill={p.gradient[1]} />
              <circle cx="200" cy="40" r="2" fill={p.gradient[0]} />
            </svg>

            <div className="relative flex h-full min-h-[260px] flex-col justify-between p-7 lg:min-h-[320px]">
              <div className="flex items-center gap-2">
                <Badge tone="default">{p.category}</Badge>
                {p.isNew ? <Badge tone="secondary">New</Badge> : null}
                {p.isPro ? <Badge tone="accent">Pro</Badge> : null}
              </div>
              <div>
                <h3 className="font-display text-[26px] font-medium leading-tight tracking-tight text-primary">
                  {p.title}
                </h3>
                <p className="mt-3 max-w-md text-[14.5px] leading-relaxed text-primary/60">
                  {p.description}
                </p>
                <Link
                  href={`/library?open=${p.id}`}
                  className="focus-ring mt-6 inline-flex items-center gap-1.5 text-[13px] text-accent transition-colors hover:text-accent-secondary"
                >
                  Open prompt
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
