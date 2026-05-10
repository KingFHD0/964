"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Activity, Copy, Heart, Search, ShieldCheck, Sparkles } from "lucide-react";
import { PageHeader, Section, StatusDot } from "@/components/admin/primitives";

/**
 * Live activity — a gently animated stream of synthetic events so the
 * admin experience feels alive. In production, wire to a server-sent
 * events endpoint.
 */
type Event = {
  id: number;
  kind: "copy" | "signup" | "favorite" | "search" | "admin" | "security";
  text: string;
  at: Date;
};

const SAMPLE_TEMPLATES: Omit<Event, "id" | "at">[] = [
  { kind: "copy", text: "Someone copied \"Launch Film Shot List\" in the library" },
  { kind: "favorite", text: "Nadia R. saved \"Iraqi Dialect Caption Pack\"" },
  { kind: "signup", text: "New sign-up — sara@boutique.ae (Orbit)" },
  { kind: "search", text: "Universal search: \"photoreal product ad\"" },
  { kind: "copy", text: "Someone copied \"Cinematic Portrait Brief\"" },
  { kind: "admin", text: "Layla H. scheduled weekly digest" },
  { kind: "favorite", text: "Omar J. saved \"Viral Hook Generator\"" },
  { kind: "security", text: "Rate-limit triggered on /api/prompts/copy (client 41.x.x.x)" },
  { kind: "signup", text: "New sign-up — karim@studio.iq (Supernova)" },
  { kind: "copy", text: "Someone copied \"Premium Real Estate Listing\"" }
];

const ICON = {
  copy: Copy,
  signup: Sparkles,
  favorite: Heart,
  search: Search,
  admin: Activity,
  security: ShieldCheck
};

export default function ActivityPage() {
  const [events, setEvents] = React.useState<Event[]>(() =>
    SAMPLE_TEMPLATES.slice(0, 6).map((t, i) => ({
      ...t,
      id: i,
      at: new Date(Date.now() - (SAMPLE_TEMPLATES.length - i) * 23_000)
    }))
  );
  const [paused, setPaused] = React.useState(false);
  const counterRef = React.useRef(events.length);

  React.useEffect(() => {
    if (paused) return;
    const interval = window.setInterval(() => {
      counterRef.current += 1;
      const t = SAMPLE_TEMPLATES[Math.floor(Math.random() * SAMPLE_TEMPLATES.length)];
      setEvents((prev) => [{ ...t, id: counterRef.current, at: new Date() }, ...prev].slice(0, 40));
    }, 2200);
    return () => window.clearInterval(interval);
  }, [paused]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 md:px-8">
      <PageHeader
        eyebrow="Live signal"
        title="Real-time activity"
        description="A calm ticker of what's happening across the platform right now."
        actions={
          <button
            onClick={() => setPaused((p) => !p)}
            className="focus-ring inline-flex h-10 items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 text-[12.5px] text-primary/85 hover:border-white/[0.14]"
          >
            <StatusDot tone={paused ? "warn" : "ok"}>{paused ? "Paused" : "Live"}</StatusDot>
          </button>
        }
      />

      <Section title="Stream">
        <ul className="space-y-2">
          {events.map((e) => {
            const Icon = ICON[e.kind];
            const tone =
              e.kind === "security"
                ? "warn"
                : e.kind === "signup"
                ? "info"
                : e.kind === "copy"
                ? "ok"
                : "info";
            return (
              <motion.li
                key={e.id}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="card-premium flex items-center gap-3 px-5 py-3"
              >
                <div className="grid h-8 w-8 place-items-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-accent">
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 text-[13px] text-primary/85">{e.text}</div>
                <StatusDot tone={tone as any}>
                  {relative(e.at)}
                </StatusDot>
              </motion.li>
            );
          })}
        </ul>
      </Section>
    </div>
  );
}

function relative(d: Date) {
  const delta = Math.max(0, Date.now() - d.getTime());
  if (delta < 10_000) return "just now";
  if (delta < 60_000) return `${Math.round(delta / 1000)}s ago`;
  if (delta < 60 * 60_000) return `${Math.round(delta / 60_000)}m ago`;
  return `${Math.round(delta / 3_600_000)}h ago`;
}
