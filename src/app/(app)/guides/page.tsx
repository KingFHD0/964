"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Compass } from "lucide-react";
import { useContentStore } from "@/lib/store/content-store";
import { Badge } from "@/components/ui/Badge";

export default function GuidesPage() {
  const GUIDES = useContentStore((s) => s.guides);
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-8 md:py-12">
      <div className="text-[11px] uppercase tracking-[0.22em] text-primary-muted/80">Guides</div>
      <h1 className="mt-3 font-display text-display-md font-medium tracking-tight text-grad">
        Runways from zero to shipped.
      </h1>
      <p className="mt-3 max-w-2xl text-[14.5px] leading-relaxed text-primary/60">
        Weekend-sized playbooks for the work that moves the needle.
      </p>

      <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2">
        {GUIDES.map((g, i) => (
          <motion.article
            id={g.id}
            key={g.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.55,
              delay: Math.min(i, 8) * 0.04,
              ease: [0.2, 0.8, 0.2, 1]
            }}
            className="card-premium group relative overflow-hidden p-6 lift ring-accent-hover"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-60 blur-2xl"
              style={{
                background: `radial-gradient(circle at center, ${g.gradient[0]}4A, transparent 60%)`
              }}
            />
            <div className="relative flex items-center gap-2.5">
              <div
                className="grid h-9 w-9 place-items-center rounded-xl border border-white/[0.08]"
                style={{
                  background: `linear-gradient(135deg, ${g.gradient[0]}33, ${g.gradient[1]}22)`
                }}
              >
                <Compass className="h-4 w-4 text-accent" />
              </div>
              <Badge tone="mute">{g.duration}</Badge>
            </div>
            <h3 className="relative mt-5 font-display text-[20px] font-medium leading-snug tracking-tight text-primary">
              {g.title}
            </h3>
            <p className="relative mt-2 text-[14px] leading-relaxed text-primary/65">{g.body}</p>
            <div className="relative mt-5 flex items-center justify-between">
              <span className="text-[12px] text-primary-muted">{g.steps} steps</span>
              <span className="inline-flex items-center gap-1.5 text-[12.5px] text-accent transition-colors group-hover:text-accent-secondary">
                Start guide
                <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
