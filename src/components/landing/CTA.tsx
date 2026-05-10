"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function CTA() {
  return (
    <section className="relative mx-auto max-w-6xl px-4 pb-28 pt-0 md:px-8 md:pb-40">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
        className="relative overflow-hidden rounded-[32px] border border-white/[0.08] p-10 md:p-16"
        style={{
          background:
            "radial-gradient(80% 120% at 50% 0%, rgba(124,140,255,0.18), transparent 60%), linear-gradient(180deg, rgba(17,24,39,0.6), rgba(11,16,32,0.9))"
        }}
      >
        {/* Orbit rings */}
        <svg className="absolute -right-24 -top-24 h-[440px] w-[440px] opacity-40" viewBox="0 0 400 400" fill="none" aria-hidden>
          <circle cx="200" cy="200" r="180" stroke="rgba(124,140,255,0.4)" />
          <circle cx="200" cy="200" r="120" stroke="rgba(92,225,230,0.35)" />
          <circle cx="200" cy="200" r="60" stroke="rgba(255,255,255,0.2)" />
          <circle cx="380" cy="200" r="4" fill="#7C8CFF" />
          <circle cx="320" cy="200" r="3" fill="#5CE1E6" />
        </svg>

        <div className="relative max-w-xl">
          <span className="inline-block rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-primary-muted">
            The new Iraqi digital era
          </span>
          <h2 className="mt-5 font-display text-display-md font-medium text-grad">
            Ambition deserves better tools.
          </h2>
          <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-primary/65">
            Join the platform built for the studios, founders, and operators shaping what comes next.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button href="/sign-up" size="lg" trailing={<ArrowRight className="h-4 w-4" />}>
              Create an account
            </Button>
            <Button href="/library" variant="secondary" size="lg">
              Tour the library
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
