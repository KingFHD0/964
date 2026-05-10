"use client";

import { motion } from "framer-motion";
import { BarChart3, Briefcase } from "lucide-react";
import { BUSINESS_SYSTEMS } from "@/lib/ecosystem";
import { Badge } from "@/components/ui/Badge";

export default function BusinessPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12">
      <div className="text-[11px] uppercase tracking-[0.22em] text-primary-muted/80">Business Systems</div>
      <h1 className="mt-3 font-display text-display-md font-medium tracking-tight text-grad">
        AI, ready to work in your studio.
      </h1>
      <p className="mt-3 max-w-2xl text-[14.5px] leading-relaxed text-primary/60">
        Pre-assembled systems for sales, support, content, and operations — tuned for the region.
      </p>

      <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2">
        {BUSINESS_SYSTEMS.map((b, i) => (
          <motion.article
            id={b.id}
            key={b.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.55,
              delay: Math.min(i, 6) * 0.06,
              ease: [0.2, 0.8, 0.2, 1]
            }}
            className="card-premium group relative overflow-hidden p-6 md:p-7 lift ring-accent-hover"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -right-10 -top-10 h-52 w-52 rounded-full opacity-45 blur-3xl"
              style={{
                background: `radial-gradient(circle at center, ${b.gradient[0]}4A, transparent 60%)`
              }}
            />
            <div className="relative flex items-center gap-3">
              <div
                className="grid h-10 w-10 place-items-center rounded-xl border border-white/[0.08]"
                style={{
                  background: `linear-gradient(135deg, ${b.gradient[0]}33, ${b.gradient[1]}22)`
                }}
              >
                <Briefcase className="h-4 w-4 text-accent" />
              </div>
              <Badge tone="accent">Enterprise-ready</Badge>
            </div>

            <h3 className="relative mt-5 font-display text-[22px] font-medium leading-snug tracking-tight text-primary">
              {b.title}
            </h3>
            <p className="relative mt-2 text-[14.5px] leading-relaxed text-primary/65">{b.body}</p>

            <div className="relative mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3">
              {b.metrics.map((m) => (
                <div
                  key={m}
                  className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-center"
                >
                  <BarChart3 className="mx-auto mb-1 h-3 w-3 text-accent-secondary" />
                  <div className="text-[11.5px] text-primary/80">{m}</div>
                </div>
              ))}
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
