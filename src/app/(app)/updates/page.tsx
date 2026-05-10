"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";

type Update = {
  id: string;
  kind: "release" | "drop" | "announcement";
  title: string;
  date: string;
  body: string;
  highlights?: string[];
};

const UPDATES: Update[] = [
  {
    id: "u-007",
    kind: "drop",
    title: "Iraqi Dialect Caption Pack v2",
    date: "May 9, 2026",
    body:
      "A second wave of 48 captions tuned for modern Iraqi dialect, optimized for Reels and TikTok. Includes voice pillars and three tone registers.",
    highlights: ["48 new captions", "3 tone registers", "Reels + TikTok tested"]
  },
  {
    id: "u-006",
    kind: "release",
    title: "Supernova plan — Team seats",
    date: "May 6, 2026",
    body:
      "Bring your studio into a shared orbit. Team seats let up to 5 members sync favorites, comments, and drops in real time.",
    highlights: ["Up to 5 seats", "Shared favorites", "Comment threads"]
  },
  {
    id: "u-005",
    kind: "announcement",
    title: "Aether Community opens doors",
    date: "May 1, 2026",
    body:
      "A quiet place for operators to exchange prompts, critique workflows, and drop wins. Invite-only during beta."
  },
  {
    id: "u-004",
    kind: "drop",
    title: "Cinematic Portrait briefs",
    date: "April 24, 2026",
    body:
      "A new series of photography-forward briefs in the language of Deakins, Khondji, and Doyle. Paired with palette and lens specs.",
    highlights: ["12 briefs", "Lens + palette", "Mood board refs"]
  },
  {
    id: "u-003",
    kind: "release",
    title: "Offline mode (PWA)",
    date: "April 18, 2026",
    body:
      "Install Aether to your home screen and keep your full library within reach, even on a shaky connection."
  }
];

const kindTone: Record<Update["kind"], "default" | "accent" | "secondary"> = {
  release: "accent",
  drop: "secondary",
  announcement: "default"
};

export default function UpdatesPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:px-8 md:py-12">
      <div className="text-[11px] uppercase tracking-[0.22em] text-primary-muted/80">Updates</div>
      <h1 className="mt-3 font-display text-display-md font-medium tracking-tight text-grad">
        What landed this week.
      </h1>
      <p className="mt-3 max-w-2xl text-[14.5px] leading-relaxed text-primary/60">
        New drops, releases, and announcements — delivered with the cadence of a weekly digest.
        No noise. Only signal.
      </p>

      <div className="relative mt-12">
        {/* Vertical rail */}
        <div className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-white/10 via-white/5 to-transparent md:left-4" aria-hidden />

        <ul className="space-y-8">
          {UPDATES.map((u, i) => (
            <motion.li
              key={u.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.05, ease: [0.2, 0.8, 0.2, 1] }}
              className="relative pl-10 md:pl-14"
            >
              {/* Node */}
              <span
                className="absolute left-[7px] top-1.5 grid h-3 w-3 place-items-center rounded-full bg-ink-900 ring-1 ring-white/10 md:left-[9px]"
                aria-hidden
              >
                <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_10px_rgba(124,140,255,0.8)]" />
              </span>

              <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-ink-800/40 p-5 md:p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={kindTone[u.kind]}>{u.kind}</Badge>
                  <span className="text-[12px] text-primary-muted">{u.date}</span>
                </div>
                <h3 className="mt-4 font-display text-[20px] font-medium tracking-tight text-primary md:text-[22px]">
                  {u.title}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-primary/65">{u.body}</p>
                {u.highlights ? (
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {u.highlights.map((h) => (
                      <li
                        key={h}
                        className="rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1 text-[12px] text-primary/80"
                      >
                        {h}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </motion.li>
          ))}
        </ul>
      </div>

      <div className="mt-16 rounded-3xl border border-white/[0.06] bg-ink-800/40 p-6 text-center md:p-10">
        <div className="font-display text-[20px] font-medium tracking-tight text-primary">
          Never miss a drop.
        </div>
        <p className="mx-auto mt-1.5 max-w-md text-[13.5px] text-primary/60">
          Enable push notifications in settings to hear about releases the moment they land.
        </p>
        <Link
          href="/settings"
          className="mt-5 inline-flex h-10 items-center rounded-full border border-white/[0.08] bg-white/[0.03] px-4 text-[13px] text-primary/90 hover:border-white/[0.15] hover:text-primary"
        >
          Open notification settings
        </Link>
      </div>
    </div>
  );
}
