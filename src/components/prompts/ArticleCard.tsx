"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, BookOpen, Clock } from "lucide-react";
import type { Article } from "@/lib/ecosystem";
import { Badge } from "@/components/ui/Badge";

/**
 * Compact, elegant article card for the Encyclopedia grid.
 * Matches the visual language of PromptCard — gradient canvas, orbital rings, clean meta.
 */
export function ArticleCard({ article, delay = 0 }: { article: Article; delay?: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <Link
        href={`/encyclopedia/${article.slug}`}
        className="card-premium group relative block h-full overflow-hidden lift ring-accent-hover"
      >
        {/* Gradient header */}
        <div className="relative h-32 overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${article.gradient[0]}3A 0%, ${article.gradient[1]}1A 60%, #0B1020 100%)`
            }}
          />
          <svg
            className="absolute -right-10 -top-10 h-[220px] w-[220px] opacity-40 transition-opacity duration-700 group-hover:opacity-70"
            viewBox="0 0 400 400"
            fill="none"
            aria-hidden
          >
            <circle cx="200" cy="200" r="160" stroke={article.gradient[0]} strokeOpacity="0.4" />
            <circle cx="200" cy="200" r="100" stroke={article.gradient[1]} strokeOpacity="0.35" />
            <circle cx="360" cy="200" r="3" fill={article.gradient[1]} />
          </svg>
          <div className="absolute left-5 top-5 flex items-center gap-2">
            <Badge tone="default">{article.category}</Badge>
          </div>
        </div>

        <div className="px-5 pb-5 pt-4">
          <div className="flex items-center gap-2 text-[11.5px] text-primary-muted/80">
            <Clock className="h-3 w-3" />
            <span>{article.readTime}</span>
            <span className="h-1 w-1 rounded-full bg-white/15" />
            <span>{article.author}</span>
          </div>
          <h3 className="mt-3 line-clamp-2 font-display text-[18px] font-medium leading-snug tracking-tight text-primary">
            {article.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-[13.5px] leading-relaxed text-primary/60">
            {article.subtitle}
          </p>
          <div className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] text-accent transition-colors group-hover:text-accent-secondary">
            <BookOpen className="h-3.5 w-3.5" />
            Read article
            <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
