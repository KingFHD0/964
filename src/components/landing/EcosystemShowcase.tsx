"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BookMarked,
  BookOpen,
  Briefcase,
  Cpu,
  GraduationCap,
  Rocket,
  Sparkles,
  Wrench,
  Zap
} from "lucide-react";

const PILLARS = [
  {
    href: "/library",
    label: "Prompt Library",
    body: "Curated, cinematic prompts across marketing, branding, dialect, and video.",
    icon: BookMarked,
    grad: ["#7C8CFF", "#5CE1E6"] as const
  },
  {
    href: "/encyclopedia",
    label: "AI Encyclopedia",
    body: "A calm library of AI concepts, workflows, and case studies — readable by operators.",
    icon: BookOpen,
    grad: ["#5CE1E6", "#7C8CFF"] as const
  },
  {
    href: "/tools",
    label: "AI Tools",
    body: "A vetted directory of tools that actually ship — Midjourney, Runway, Cursor, and more.",
    icon: Wrench,
    grad: ["#EC4899", "#7C8CFF"] as const
  },
  {
    href: "/models",
    label: "AI Models Hub",
    body: "Frontier, open, multimodal. Plain-spoken guidance on when to reach for each.",
    icon: Cpu,
    grad: ["#F59E0B", "#7C8CFF"] as const
  },
  {
    href: "/workflows",
    label: "Workflows",
    body: "Repeatable loops — weekly content engine, launch film, identity sprint, internal wiki.",
    icon: Rocket,
    grad: ["#7C8CFF", "#F59E0B"] as const
  },
  {
    href: "/courses",
    label: "Courses",
    body: "From prompt craft to production agents, paced for the studio that ships.",
    icon: GraduationCap,
    grad: ["#5CE1E6", "#EC4899"] as const
  },
  {
    href: "/business",
    label: "Business Systems",
    body: "Sales, support, content, and ops — tuned for the Gulf and Levant markets.",
    icon: Briefcase,
    grad: ["#111827", "#7C8CFF"] as const
  },
  {
    href: "/automation",
    label: "Automation Hub",
    body: "Drop-in loops that reclaim hours. Wire them to your existing stack.",
    icon: Zap,
    grad: ["#EC4899", "#5CE1E6"] as const
  }
];

export function EcosystemShowcase() {
  return (
    <section id="ecosystem" className="relative mx-auto max-w-7xl px-4 py-28 md:px-8 md:py-40">
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-block rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-primary-muted">
          The Ecosystem
        </span>
        <h2 className="mt-6 font-display text-display-lg font-medium text-grad">
          One platform. Every layer of your AI work.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-primary/60">
          Aether is the quiet command center between you and the machine — from prompts to models,
          workflows to business systems.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PILLARS.map((p, i) => (
          <motion.div
            key={p.href}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: (i % 4) * 0.06, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <Link
              href={p.href}
              className="card-premium group relative flex h-full flex-col overflow-hidden p-5 lift ring-accent-hover"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-50 blur-2xl"
                style={{
                  background: `radial-gradient(circle at center, ${p.grad[0]}4A, transparent 60%)`
                }}
              />
              <div
                className="relative grid h-10 w-10 place-items-center rounded-xl border border-white/[0.08]"
                style={{
                  background: `linear-gradient(135deg, ${p.grad[0]}30, ${p.grad[1]}18)`
                }}
              >
                <p.icon className="h-4 w-4 text-accent" />
              </div>
              <h3 className="relative mt-5 font-display text-[17px] font-medium leading-snug tracking-tight text-primary">
                {p.label}
              </h3>
              <p className="relative mt-2 flex-1 text-[13px] leading-relaxed text-primary/60">
                {p.body}
              </p>
              <div className="relative mt-5 inline-flex items-center gap-1.5 text-[12px] text-accent transition-colors group-hover:text-accent-secondary">
                Open
                <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="mx-auto mt-14 inline-flex w-full items-center justify-center">
        <Link
          href="/dashboard"
          className="focus-ring inline-flex h-11 items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-5 text-[13px] text-primary/90 transition-all duration-300 hover:border-accent/30 hover:text-primary"
        >
          <Sparkles className="h-3.5 w-3.5 text-accent-secondary" />
          See the full product
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
    </section>
  );
}
