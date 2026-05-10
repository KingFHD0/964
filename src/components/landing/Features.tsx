"use client";

import { motion } from "framer-motion";
import { Bolt, Globe2, Layers, ShieldCheck, Sparkles, Wand2 } from "lucide-react";
import { Card } from "@/components/ui/Card";

const FEATURES = [
  {
    icon: Bolt,
    title: "Instant copy",
    body: "One tap, zero friction. Prompts land in your clipboard with a soft pulse and a haptic beat.",
    accent: "#7C8CFF"
  },
  {
    icon: Globe2,
    title: "Arabic native",
    body: "Built for Iraqi dialect and modern Arabic. Typography, spacing, and voice — all tuned.",
    accent: "#5CE1E6"
  },
  {
    icon: Layers,
    title: "Cinematic library",
    body: "Curated categories. Editorial presentation. Every card feels like a boutique magazine spread.",
    accent: "#7C8CFF"
  },
  {
    icon: Wand2,
    title: "Crafted prompts",
    body: "Not listicles. Each prompt is engineered by operators who ship. Specific, constrained, reusable.",
    accent: "#5CE1E6"
  },
  {
    icon: ShieldCheck,
    title: "Quiet reliability",
    body: "Offline-ready PWA. Service worker caching. Your workflows don’t wait for the network.",
    accent: "#7C8CFF"
  },
  {
    icon: Sparkles,
    title: "Weekly drops",
    body: "New prompts every Thursday. Push notifications for premium members. Never spammy.",
    accent: "#5CE1E6"
  }
];

export function Features() {
  return (
    <section id="features" className="relative mx-auto max-w-7xl px-4 py-28 md:px-8 md:py-40">
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-block rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-primary-muted">
          Why Aether
        </span>
        <h2 className="mt-6 font-display text-display-lg font-medium text-grad">
          A calm layer between you and the machine.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-primary/60">
          Aether 964 replaces scattered prompt hunting with a single, elegant surface. Quiet
          technology, engineered to disappear.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: i * 0.05, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <Card className="group h-full lift hover:border-white/[0.12] hover:shadow-elev-2">
              <div className="p-7">
                <div
                  className="relative grid h-10 w-10 place-items-center rounded-xl border border-white/[0.08]"
                  style={{ background: `linear-gradient(135deg, ${f.accent}18, transparent)` }}
                >
                  <f.icon className="h-4 w-4" style={{ color: f.accent }} />
                  <div
                    className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{ boxShadow: `0 0 24px ${f.accent}55` }}
                  />
                </div>
                <h3 className="mt-6 font-display text-[20px] font-medium tracking-tight text-primary">
                  {f.title}
                </h3>
                <p className="mt-2.5 text-[14.5px] leading-relaxed text-primary/60">{f.body}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
