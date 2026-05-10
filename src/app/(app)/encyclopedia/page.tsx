"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { ARTICLE_CATEGORIES } from "@/lib/ecosystem";
import { useContentStore } from "@/lib/store/content-store";
import { ArticleCard } from "@/components/prompts/ArticleCard";
import { CategoryPills } from "@/components/prompts/CategoryPills";

export default function EncyclopediaPage() {
  const ARTICLES = useContentStore((s) => s.articles);
  const [query, setQuery] = React.useState("");
  const [cat, setCat] = React.useState<string>("All");

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return ARTICLES.filter((a) => {
      const matchesCat = cat === "All" ? true : a.category === cat;
      const matchesQ = q
        ? [a.title, a.subtitle, a.category, a.author].some((v) => v.toLowerCase().includes(q))
        : true;
      return matchesCat && matchesQ;
    });
  }, [ARTICLES, query, cat]);

  const featured = ARTICLES.filter((a) => a.featured).slice(0, 2);
  const rest = filtered.filter((a) => !featured.find((f) => f.id === a.id));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
      <div className="text-[11px] uppercase tracking-[0.22em] text-primary-muted/80">Encyclopedia</div>
      <h1 className="mt-3 font-display text-display-md font-medium tracking-tight text-grad">
        A quiet library of AI knowledge.
      </h1>
      <p className="mt-3 max-w-2xl text-[14.5px] leading-relaxed text-primary/60">
        Concepts, workflows, models, and case studies — written the way you would want to read them.
      </p>

      {/* Search */}
      <div className="mt-8">
        <div className="flex h-12 flex-1 items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 transition-all duration-300 focus-within:border-accent/40 focus-within:bg-white/[0.05] focus-within:shadow-glow-xs">
          <Search className="h-4 w-4 text-primary-muted/80" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the encyclopedia…"
            className="h-full w-full bg-transparent text-[14px] text-primary outline-none placeholder:text-primary-muted/60"
          />
        </div>
      </div>

      <div className="mt-5">
        <CategoryPills categories={ARTICLE_CATEGORIES} active={cat} onChange={setCat} />
      </div>

      {/* Featured */}
      {cat === "All" && !query && featured.length > 0 ? (
        <section className="mt-12">
          <div className="mb-4 text-[11px] uppercase tracking-[0.22em] text-primary-muted">Featured</div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {featured.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.06, ease: [0.2, 0.8, 0.2, 1] }}
              >
                <FeaturedArticle article={a} />
              </motion.div>
            ))}
          </div>
        </section>
      ) : null}

      {/* All */}
      <section className="mt-12">
        <div className="mb-4 text-[11px] uppercase tracking-[0.22em] text-primary-muted">All articles</div>
        {rest.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((a, i) => (
              <ArticleCard key={a.id} article={a} delay={Math.min(i, 8) * 0.04} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

import Link from "next/link";
import { ArrowUpRight, BookOpen, Clock } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { Article } from "@/lib/ecosystem";

function FeaturedArticle({ article }: { article: Article }) {
  return (
    <Link
      href={`/encyclopedia/${article.slug}`}
      className="card-premium group relative block overflow-hidden lift ring-accent-hover"
    >
      <div className="relative h-44 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${article.gradient[0]}55 0%, ${article.gradient[1]}22 55%, #0B1020 100%)`
          }}
        />
        <svg
          className="absolute -right-10 -top-10 h-[320px] w-[320px] opacity-40 transition-opacity duration-700 group-hover:opacity-70"
          viewBox="0 0 400 400"
          fill="none"
          aria-hidden
        >
          <circle cx="200" cy="200" r="180" stroke={article.gradient[0]} strokeOpacity="0.45" />
          <circle cx="200" cy="200" r="120" stroke={article.gradient[1]} strokeOpacity="0.4" />
          <circle cx="360" cy="200" r="4" fill={article.gradient[1]} />
          <circle cx="280" cy="200" r="2.5" fill={article.gradient[0]} />
        </svg>
        <div className="absolute left-6 top-6">
          <Badge tone="secondary">Featured · {article.category}</Badge>
        </div>
      </div>

      <div className="px-6 pb-6 pt-5">
        <div className="flex items-center gap-2 text-[11.5px] text-primary-muted/80">
          <Clock className="h-3 w-3" />
          <span>{article.readTime}</span>
          <span className="h-1 w-1 rounded-full bg-white/15" />
          <span>{article.author}</span>
        </div>
        <h3 className="mt-3 font-display text-[22px] font-medium leading-snug tracking-tight text-primary">
          {article.title}
        </h3>
        <p className="mt-2 text-[14px] leading-relaxed text-primary/65">{article.subtitle}</p>
        <div className="mt-5 inline-flex items-center gap-1.5 text-[13px] text-accent transition-colors group-hover:text-accent-secondary">
          <BookOpen className="h-3.5 w-3.5" />
          Read article
          <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="rounded-3xl border border-dashed border-white/[0.08] bg-white/[0.02] p-12 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-white/[0.06] bg-white/[0.03]">
        <Search className="h-5 w-5 text-primary/70" />
      </div>
      <div className="mt-5 font-display text-[18px] font-medium text-primary">No articles found.</div>
      <p className="mx-auto mt-1.5 max-w-sm text-[13.5px] text-primary/60">
        Try a different keyword or pick another category.
      </p>
    </div>
  );
}
