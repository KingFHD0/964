"use client";

import { motion } from "framer-motion";
import { MessageCircle, Sparkles, TrendingUp, Users } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { AdSlot } from "@/components/ads/AdSlot";

const THREADS = [
  {
    id: "t-001",
    author: "Layla H.",
    initials: "LH",
    role: "Creative Director",
    title: "How I compress a brand manifesto into 120 words",
    excerpt:
      "Three constraints, one heuristic, and a final two-word line. Sharing the prompt stack I land on 8/10 times.",
    replies: 24,
    likes: 148,
    tag: "Branding",
    gradient: ["#7C8CFF", "#5CE1E6"] as const
  },
  {
    id: "t-002",
    author: "Omar J.",
    initials: "OJ",
    role: "Founder, Baghdad",
    title: "Iraqi dialect — what works for Reels vs. TikTok",
    excerpt:
      "A tone register breakdown after shipping 40+ short form posts this month. Includes examples and counter-examples.",
    replies: 41,
    likes: 302,
    tag: "Iraqi Dialect",
    gradient: ["#F59E0B", "#7C8CFF"] as const
  },
  {
    id: "t-003",
    author: "Nadia R.",
    initials: "NR",
    role: "Brand Designer",
    title: "Replacing photoshoot briefs with a single Aether prompt",
    excerpt:
      "I replaced a 4-page brief with one prompt + three variables. Here is how the photographer responded.",
    replies: 18,
    likes: 96,
    tag: "Photography",
    gradient: ["#5CE1E6", "#EC4899"] as const
  },
  {
    id: "t-004",
    author: "Karim S.",
    initials: "KS",
    role: "Restaurant Operator",
    title: "Grand opening runway — 14 days, one prompt system",
    excerpt:
      "From menu signature stories to opening night captions. Sharing the full calendar and the prompt mapping.",
    replies: 32,
    likes: 211,
    tag: "Restaurants",
    gradient: ["#EC4899", "#7C8CFF"] as const
  }
];

const LEADERBOARD = [
  { name: "Layla H.", score: 1282, initials: "LH" },
  { name: "Omar J.", score: 1140, initials: "OJ" },
  { name: "Nadia R.", score: 945, initials: "NR" },
  { name: "Karim S.", score: 870, initials: "KS" },
  { name: "Sara T.", score: 720, initials: "ST" }
];

export default function CommunityPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
      <div className="flex flex-col gap-3">
        <div className="text-[11px] uppercase tracking-[0.22em] text-primary-muted/80">Community</div>
        <h1 className="font-display text-display-md font-medium tracking-tight text-grad">
          A quiet room for operators.
        </h1>
        <p className="max-w-2xl text-[14.5px] leading-relaxed text-primary/60">
          Share prompts, critique workflows, post wins. No algorithm. No noise. Just signal from the
          people actually shipping.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        {/* Threads */}
        <div>
          <div className="mb-4 flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-primary-muted">
            <MessageCircle className="h-3.5 w-3.5" />
            Latest threads
          </div>

          <ul className="space-y-3">
            {THREADS.map((t, i) => (
              <motion.li
                key={t.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: i * 0.04, ease: [0.2, 0.8, 0.2, 1] }}
              >
                <article className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-ink-800/40 p-5 transition-all duration-500 hover:-translate-y-0.5 hover:border-white/[0.12] hover:shadow-elev-2">
                  <div className="flex items-start gap-4">
                    <div
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-[12px] font-medium text-white"
                      style={{
                        background: `linear-gradient(135deg, ${t.gradient[0]}, ${t.gradient[1]})`
                      }}
                    >
                      {t.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-primary-muted">
                        <span className="text-primary/90">{t.author}</span>
                        <span>·</span>
                        <span>{t.role}</span>
                      </div>
                      <h3 className="mt-1.5 font-display text-[17px] font-medium leading-snug tracking-tight text-primary">
                        {t.title}
                      </h3>
                      <p className="mt-1.5 line-clamp-2 text-[13.5px] leading-relaxed text-primary/65">
                        {t.excerpt}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-[12px] text-primary-muted">
                        <Badge tone="mute">{t.tag}</Badge>
                        <span>{t.replies} replies</span>
                        <span>·</span>
                        <span>{t.likes} likes</span>
                      </div>
                    </div>
                  </div>
                </article>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] p-6"
            style={{
              background:
                "radial-gradient(80% 120% at 0% 0%, rgba(124,140,255,0.12), transparent 60%), rgba(17,24,39,0.6)"
            }}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-accent-secondary" />
              <span className="text-[11px] uppercase tracking-[0.22em] text-primary-muted">You</span>
            </div>
            <div className="mt-3 font-display text-[18px] font-medium tracking-tight text-primary">
              Post your first thread
            </div>
            <p className="mt-1.5 text-[13px] leading-relaxed text-primary/60">
              Share a prompt, a lesson, or a quiet win. The room is listening.
            </p>
            <button className="mt-5 inline-flex h-9 items-center rounded-full bg-grad-cta px-4 text-[12.5px] font-medium text-white shadow-[0_8px_24px_-10px_rgba(124,140,255,0.55)] transition-all hover:brightness-110">
              Start a thread
            </button>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-ink-800/40 p-5">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-primary-muted">
              <TrendingUp className="h-3.5 w-3.5" />
              This week
            </div>
            <ul className="mt-4 space-y-3">
              {LEADERBOARD.map((u, i) => (
                <li key={u.name} className="flex items-center gap-3">
                  <span className="w-5 text-[11px] font-medium text-primary-muted">#{i + 1}</span>
                  <span className="grid h-8 w-8 place-items-center rounded-full border border-white/[0.06] bg-white/[0.03] text-[11px] font-medium text-primary/90">
                    {u.initials}
                  </span>
                  <span className="flex-1 text-[13px] text-primary/90">{u.name}</span>
                  <span className="text-[12px] text-primary-muted">{u.score.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-ink-800/40 p-5">
            <Users className="h-4 w-4 text-accent" />
            <div className="flex-1 text-[13px] text-primary/85">4,212 operators in the room</div>
          </div>

          <AdSlot placement="community-aside" variant="aside" />
        </aside>
      </div>
    </div>
  );
}
