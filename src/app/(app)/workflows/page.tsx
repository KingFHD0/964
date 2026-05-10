"use client";

import { motion } from "framer-motion";
import { ArrowRight, Rocket } from "lucide-react";
import { useContentStore } from "@/lib/store/content-store";
import { Badge } from "@/components/ui/Badge";

export default function WorkflowsPage() {
  const WORKFLOWS = useContentStore((s) => s.workflows);
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12">
      <div className="text-[11px] uppercase tracking-[0.22em] text-primary-muted/80">Workflows</div>
      <h1 className="mt-3 font-display text-display-md font-medium tracking-tight text-grad">
        Calm, repeatable AI loops.
      </h1>
      <p className="mt-3 max-w-2xl text-[14.5px] leading-relaxed text-primary/60">
        Opinionated recipes for content, identity, launch films, and internal knowledge. Steal any.
      </p>

      <div className="mt-12 space-y-5">
        {WORKFLOWS.map((w, i) => (
          <motion.article
            id={w.id}
            key={w.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.55,
              delay: Math.min(i, 5) * 0.06,
              ease: [0.2, 0.8, 0.2, 1]
            }}
            className="card-premium relative overflow-hidden lift ring-accent-hover"
          >
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr]">
              <div className="relative p-6 md:p-8">
                <div className="flex items-center gap-2">
                  <div
                    className="grid h-8 w-8 place-items-center rounded-lg border border-white/[0.08]"
                    style={{
                      background: `linear-gradient(135deg, ${w.gradient[0]}33, ${w.gradient[1]}22)`
                    }}
                  >
                    <Rocket className="h-3.5 w-3.5 text-accent" />
                  </div>
                  <Badge tone="mute">{w.duration}</Badge>
                </div>
                <h3 className="mt-5 font-display text-[22px] font-medium leading-snug tracking-tight text-primary">
                  {w.title}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-primary/65">{w.body}</p>

                <div className="mt-5">
                  <div className="text-[10.5px] uppercase tracking-[0.2em] text-primary-muted/70">
                    Tools
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {w.tools.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-white/[0.06] bg-white/[0.02] px-2.5 py-0.5 text-[11.5px] text-primary/75"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="relative border-t border-white/[0.04] p-6 md:border-l md:border-t-0 md:p-8">
                <div className="text-[10.5px] uppercase tracking-[0.2em] text-primary-muted/70">
                  Steps
                </div>
                <ol className="mt-3 space-y-2.5">
                  {w.steps.map((s, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-white/[0.08] bg-white/[0.03] text-[11px] font-medium text-primary/80">
                        {idx + 1}
                      </span>
                      <span className="text-[13.5px] leading-relaxed text-primary/80">{s}</span>
                    </li>
                  ))}
                </ol>
                <button className="mt-6 inline-flex items-center gap-1.5 text-[12.5px] text-accent transition-colors hover:text-accent-secondary">
                  Use this workflow
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
