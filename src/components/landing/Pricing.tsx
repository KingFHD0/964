"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const PLANS = [
  {
    id: "orbit",
    name: "Orbit",
    tagline: "For creators starting the journey.",
    price: "$9",
    period: "/month",
    features: [
      "500+ curated prompts",
      "Arabic + English library",
      "Weekly drops",
      "Copy-to-clipboard system",
      "Community access"
    ],
    cta: "Start Orbit",
    href: "/sign-up?plan=orbit",
    accent: false
  },
  {
    id: "supernova",
    name: "Supernova",
    tagline: "For studios and operators at scale.",
    price: "$29",
    period: "/month",
    features: [
      "Unlimited prompt access",
      "Pro-only cinematic briefs",
      "Priority weekly drops",
      "Iraqi dialect expansions",
      "Push notifications",
      "Team seats (up to 5)"
    ],
    cta: "Upgrade to Supernova",
    href: "/sign-up?plan=supernova",
    accent: true
  }
];

export function Pricing() {
  return (
    <section id="pricing" className="relative mx-auto max-w-6xl px-4 py-28 md:px-8 md:py-40">
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-block rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-primary-muted">
          Pricing
        </span>
        <h2 className="mt-6 font-display text-display-lg font-medium text-grad">
          Two orbits. One constellation.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-primary/60">
          Start simple. Graduate when your work demands more. Cancel any time.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-2">
        {PLANS.map((plan, i) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: [0.2, 0.8, 0.2, 1] }}
            className={`relative rounded-3xl border p-8 md:p-10 ${
              plan.accent
                ? "border-accent/30 bg-[linear-gradient(180deg,rgba(124,140,255,0.06),rgba(11,16,32,0.6))] shadow-glow-md"
                : "border-white/[0.06] bg-ink-800/40"
            }`}
          >
            {plan.accent ? (
              <div className="absolute -top-3 left-8 flex items-center gap-1.5 rounded-full border border-accent/30 bg-ink-900 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-accent">
                <Sparkles className="h-3 w-3" />
                Recommended
              </div>
            ) : null}

            <div className="flex items-baseline justify-between">
              <h3 className="font-display text-[28px] font-medium tracking-tight text-primary">
                {plan.name}
              </h3>
              <div className="text-right">
                <div className="font-display text-[34px] font-medium tracking-tight text-primary">
                  {plan.price}
                  <span className="text-[14px] font-normal text-primary-muted">{plan.period}</span>
                </div>
              </div>
            </div>
            <p className="mt-2 text-[14px] text-primary/60">{plan.tagline}</p>

            <div className="my-7 hairline" />

            <ul className="space-y-3">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-[14px] text-primary/80">
                  <span className={`mt-0.5 grid h-5 w-5 place-items-center rounded-full ${
                    plan.accent ? "bg-accent/15 text-accent" : "bg-white/[0.05] text-primary/70"
                  }`}>
                    <Check className="h-3 w-3" />
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            <div className="mt-10">
              <Button href={plan.href} variant={plan.accent ? "primary" : "secondary"} size="lg" className="w-full justify-center">
                {plan.cta}
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
