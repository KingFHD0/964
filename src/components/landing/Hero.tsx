"use client";

import { motion } from "framer-motion";
import { ArrowRight, PlayCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FloatingSearch } from "./FloatingSearch";
import { HorizonBeam } from "@/components/cosmic/HorizonBeam";
import { useContentStore } from "@/lib/store/content-store";

const ease = [0.2, 0.8, 0.2, 1] as const;

export function Hero() {
  // Read the editable hero copy live from the content store.
  const homepage = useContentStore((s) => s.homepage);

  return (
    <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden pt-20">
      <HorizonBeam />

      <div className="relative mx-auto w-full max-w-6xl px-4 text-center md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
          className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 backdrop-blur-xl"
        >
          <Sparkles className="h-3.5 w-3.5 text-accent-secondary" />
          <span className="text-[11px] uppercase tracking-[0.2em] text-primary/70">
            {homepage.heroLabel}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease, delay: 0.08 }}
          className="mt-8 font-display text-display-xl font-medium tracking-tight"
        >
          <span className="text-grad">{homepage.heroTitleA}</span>
          <br />
          <span className="text-grad-accent">{homepage.heroTitleB}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.18 }}
          className="mx-auto mt-6 max-w-2xl text-balance text-base leading-relaxed text-primary/65 md:text-lg"
        >
          {homepage.heroSubtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.26 }}
          className="mx-auto mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Button
            href={homepage.primaryCta.href}
            size="lg"
            trailing={<ArrowRight className="h-4 w-4" />}
          >
            {homepage.primaryCta.label}
          </Button>
          <Button
            href={homepage.secondaryCta.href}
            variant="secondary"
            size="lg"
            leading={<PlayCircle className="h-4 w-4" />}
          >
            {homepage.secondaryCta.label}
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease, delay: 0.38 }}
          className="mt-14"
        >
          <FloatingSearch />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, ease, delay: 0.7 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-[11px] uppercase tracking-[0.22em] text-primary-muted/60"
        >
          {homepage.stats.map((label, i, arr) => (
            <span key={label + i} className="flex items-center gap-x-10">
              <span>{label}</span>
              {i < arr.length - 1 ? (
                <span className="hidden h-1 w-1 rounded-full bg-white/20 sm:block" />
              ) : null}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Bottom vignette */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-ink-950" />
    </section>
  );
}
