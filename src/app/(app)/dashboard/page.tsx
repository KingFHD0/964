"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, BookMarked, Flame, Heart, Rocket, Sparkles, TrendingUp } from "lucide-react";
import { PROMPTS } from "@/lib/prompts";
import { PromptCard } from "@/components/prompts/PromptCard";
import { PromptDetailDialog } from "@/components/prompts/PromptDetailDialog";
import * as React from "react";
import type { Prompt } from "@/lib/prompts";

const STATS = [
  { label: "Prompts in your library", value: "12,408", delta: "+124 this week", icon: BookMarked },
  { label: "Weekly drops", value: "Thu 20:00", delta: "Next: New Iraqi pack", icon: Rocket },
  { label: "Favorites", value: "18", delta: "3 recently saved", icon: Heart },
  { label: "Streak", value: "24 days", delta: "Longest yet", icon: Flame }
];

export default function DashboardPage() {
  const [active, setActive] = React.useState<Prompt | null>(null);
  const featured = PROMPTS.slice(0, 3);
  const trending = PROMPTS.slice(3, 9);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
      {/* Greeting */}
      <div className="relative overflow-hidden rounded-3xl border border-white/[0.06] p-7 md:p-10"
        style={{
          background:
            "radial-gradient(80% 120% at 0% 0%, rgba(124,140,255,0.18), transparent 60%), linear-gradient(180deg, rgba(17,24,39,0.6), rgba(11,16,32,0.8))"
        }}
      >
        <svg className="pointer-events-none absolute -right-16 -top-16 h-[400px] w-[400px] opacity-40" viewBox="0 0 400 400" fill="none" aria-hidden>
          <circle cx="200" cy="200" r="160" stroke="rgba(124,140,255,0.35)" />
          <circle cx="200" cy="200" r="100" stroke="rgba(92,225,230,0.35)" />
          <circle cx="370" cy="200" r="4" fill="#7C8CFF" />
          <circle cx="300" cy="200" r="3" fill="#5CE1E6" />
        </svg>
        <div className="relative max-w-xl">
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-accent-secondary" />
            <span className="text-[11px] uppercase tracking-[0.22em] text-primary-muted">Good evening, Ahmed</span>
          </div>
          <h1 className="mt-4 font-display text-display-md font-medium tracking-tight text-grad">
            Your creative orbit, calibrated.
          </h1>
          <p className="mt-3 text-[14.5px] leading-relaxed text-primary/65">
            Three new prompts were added to your categories this week. A trending Iraqi dialect pack
            just dropped in the library.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link
              href="/library"
              className="focus-ring inline-flex h-10 items-center gap-2 rounded-full bg-grad-cta px-4 text-[13px] font-medium text-white shadow-[0_10px_30px_-10px_rgba(124,140,255,0.6)] hover:brightness-110"
            >
              Explore the library
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/updates"
              className="focus-ring inline-flex h-10 items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 text-[13px] text-primary/90 hover:border-white/[0.15] hover:text-primary"
            >
              See latest drops
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
            className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-ink-800/40 p-5"
          >
            <div className="flex items-center justify-between">
              <div className="text-[11px] uppercase tracking-[0.2em] text-primary-muted">{s.label}</div>
              <s.icon className="h-3.5 w-3.5 text-primary/60" />
            </div>
            <div className="mt-4 font-display text-[26px] font-medium tracking-tight text-primary">{s.value}</div>
            <div className="mt-1 text-[12px] text-primary/55">{s.delta}</div>
          </motion.div>
        ))}
      </div>

      {/* Featured */}
      <Section title="Featured for you" subtitle="Hand-picked by the Aether curation team." href="/library" hrefLabel="Open library">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <PromptCard key={p.id} prompt={p} onOpen={() => setActive(p)} />
          ))}
        </div>
      </Section>

      {/* Trending */}
      <Section
        title="Trending this week"
        subtitle="What creators in the network are copying most."
        icon={<TrendingUp className="h-3.5 w-3.5" />}
        href="/library"
        hrefLabel="Browse all"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {trending.map((p) => (
            <PromptCard key={p.id} prompt={p} onOpen={() => setActive(p)} />
          ))}
        </div>
      </Section>

      <PromptDetailDialog prompt={active} onClose={() => setActive(null)} />
    </div>
  );
}

function Section({
  title,
  subtitle,
  icon,
  href,
  hrefLabel,
  children
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  href?: string;
  hrefLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-14">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-primary-muted">
            {icon}
            <span>Section</span>
          </div>
          <h2 className="mt-2 font-display text-[24px] font-medium tracking-tight text-primary">{title}</h2>
          {subtitle ? <p className="mt-1 text-[13.5px] text-primary/60">{subtitle}</p> : null}
        </div>
        {href ? (
          <Link
            href={href}
            className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[12.5px] text-primary/85 hover:border-white/[0.15] hover:text-primary"
          >
            {hrefLabel ?? "See all"}
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        ) : null}
      </div>
      {children}
    </section>
  );
}
