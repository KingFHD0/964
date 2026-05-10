"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, BookOpen, LifeBuoy, MessageSquare, Zap } from "lucide-react";
import { cn } from "@/lib/cn";

const FAQS = [
  {
    q: "How do I copy a prompt?",
    a: "Tap the copy button on any card. The prompt lands in your clipboard with a soft pulse and haptic tap on supported devices. You can paste it into ChatGPT, Claude, Gemini, or any AI tool you use."
  },
  {
    q: "Can I use prompts in Arabic or Iraqi dialect?",
    a: "Yes. The library has a dedicated 'Iraqi Dialect' category, and many prompts include Arabic variables. Typography, spacing, and voice are tuned for Arabic natively."
  },
  {
    q: "What is the difference between Orbit and Supernova?",
    a: "Orbit is the starting plan with access to the core prompt library and weekly drops. Supernova unlocks the full premium catalog, pro briefs, Iraqi dialect expansions, push notifications, and team seats."
  },
  {
    q: "Do you offer team accounts?",
    a: "Supernova includes up to 5 team seats. Members share favorites, threads, and drop notifications in a synced workspace."
  },
  {
    q: "Does Aether work offline?",
    a: "Yes. Install Aether to your home screen. The service worker caches the library so you can browse and copy prompts even on a shaky connection."
  },
  {
    q: "How do I cancel my subscription?",
    a: "Settings → Billing → Manage subscription. Cancellation takes effect at the end of the current billing period. You keep access until then."
  }
];

const RESOURCES = [
  { icon: BookOpen, title: "Getting started", body: "A 5-minute walkthrough of the library, favorites, and copy system." },
  { icon: Zap, title: "Prompt craft", body: "How we design prompts — constraints, variables, and voice." },
  { icon: MessageSquare, title: "Community guidelines", body: "What good threads look like. How we keep the room quiet." }
];

export default function SupportPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:px-8 md:py-12">
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-primary-muted/80">
        <LifeBuoy className="h-3.5 w-3.5" />
        Support
      </div>
      <h1 className="mt-3 font-display text-display-md font-medium tracking-tight text-grad">
        Quiet help, when you need it.
      </h1>
      <p className="mt-3 max-w-2xl text-[14.5px] leading-relaxed text-primary/60">
        Browse the most common questions, or open a conversation with our team. We answer in hours,
        not days.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-3 md:grid-cols-3">
        {RESOURCES.map((r) => (
          <motion.div
            key={r.title}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl border border-white/[0.06] bg-ink-800/40 p-5 transition-colors hover:border-white/[0.12]"
          >
            <div className="grid h-9 w-9 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.03]">
              <r.icon className="h-4 w-4 text-accent" />
            </div>
            <div className="mt-4 font-display text-[15px] font-medium tracking-tight text-primary">
              {r.title}
            </div>
            <p className="mt-1 text-[13px] leading-relaxed text-primary/60">{r.body}</p>
          </motion.div>
        ))}
      </div>

      <section className="mt-14">
        <div className="text-[11px] uppercase tracking-[0.22em] text-primary-muted">FAQ</div>
        <h2 className="mt-3 font-display text-[24px] font-medium tracking-tight text-primary">
          Answers to the common ones.
        </h2>
        <ul className="mt-6 overflow-hidden rounded-2xl border border-white/[0.06] bg-ink-800/40">
          {FAQS.map((f, i) => (
            <Faq key={f.q} {...f} index={i} last={i === FAQS.length - 1} />
          ))}
        </ul>
      </section>

      <section className="mt-14 overflow-hidden rounded-3xl border border-white/[0.06] p-8 md:p-10"
        style={{
          background:
            "radial-gradient(80% 120% at 0% 0%, rgba(124,140,255,0.12), transparent 60%), rgba(17,24,39,0.6)"
        }}
      >
        <div className="font-display text-[20px] font-medium tracking-tight text-primary">Still need us?</div>
        <p className="mt-2 max-w-md text-[13.5px] text-primary/60">
          Send a note. We read every message, and reply in business hours (Baghdad time).
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href="mailto:hello@aether964.com"
            className="focus-ring inline-flex h-10 items-center rounded-full bg-grad-cta px-4 text-[12.5px] font-medium text-white shadow-[0_8px_24px_-10px_rgba(124,140,255,0.55)] transition-all hover:brightness-110"
          >
            Email support
          </a>
          <a
            href="#"
            className="focus-ring inline-flex h-10 items-center rounded-full border border-white/[0.08] bg-white/[0.03] px-4 text-[12.5px] text-primary/90 hover:border-white/[0.15] hover:text-primary"
          >
            Open a ticket
          </a>
        </div>
      </section>
    </div>
  );
}

function Faq({ q, a, index, last }: { q: string; a: string; index: number; last: boolean }) {
  const [open, setOpen] = React.useState(index === 0);
  return (
    <li className={cn(!last && "border-b border-white/[0.04]")}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="focus-ring flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
        aria-expanded={open}
      >
        <span className="text-[14.5px] font-medium text-primary">{q}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-primary-muted transition-transform duration-300",
            open && "rotate-180"
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 text-[13.5px] leading-relaxed text-primary/65">{a}</div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </li>
  );
}
