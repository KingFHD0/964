"use client";

import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import { AUTOMATIONS } from "@/lib/ecosystem";
import { Badge } from "@/components/ui/Badge";

export default function AutomationPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-8 md:py-12">
      <div className="text-[11px] uppercase tracking-[0.22em] text-primary-muted/80">Automations</div>
      <h1 className="mt-3 font-display text-display-md font-medium tracking-tight text-grad">
        Small loops, compounding returns.
      </h1>
      <p className="mt-3 max-w-2xl text-[14.5px] leading-relaxed text-primary/60">
        Drop-in automations that reclaim hours every week. Wire them to your existing tools.
      </p>

      <div className="mt-12 space-y-4">
        {AUTOMATIONS.map((a, i) => (
          <motion.article
            id={a.id}
            key={a.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: Math.min(i, 8) * 0.04,
              ease: [0.2, 0.8, 0.2, 1]
            }}
            className="card-premium group relative overflow-hidden p-5 md:p-6 lift ring-accent-hover"
          >
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:gap-6">
              <div className="flex items-center gap-3 md:w-64">
                <div
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/[0.08]"
                  style={{
                    background: `linear-gradient(135deg, ${a.gradient[0]}33, ${a.gradient[1]}22)`
                  }}
                >
                  <Zap className="h-4 w-4 text-accent" />
                </div>
                <h3 className="font-display text-[17px] font-medium leading-snug tracking-tight text-primary">
                  {a.title}
                </h3>
              </div>

              <div className="flex-1 border-t border-white/[0.04] pt-4 md:border-l md:border-t-0 md:pl-6 md:pt-0">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto_1fr]">
                  <div>
                    <div className="text-[10.5px] uppercase tracking-[0.2em] text-primary-muted/70">
                      Trigger
                    </div>
                    <div className="mt-1 text-[13px] text-primary/85">{a.trigger}</div>
                  </div>
                  <div className="hidden items-center justify-center sm:flex">
                    <ArrowRight className="h-4 w-4 text-accent/70" />
                  </div>
                  <div>
                    <div className="text-[10.5px] uppercase tracking-[0.2em] text-primary-muted/70">
                      Action
                    </div>
                    <div className="mt-1 text-[13px] text-primary/85">{a.action}</div>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {a.tools.map((t) => (
                    <Badge key={t} tone="mute">
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
