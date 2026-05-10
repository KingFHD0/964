"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Bell, CheckCheck } from "lucide-react";
import { cn } from "@/lib/cn";

type Notif = {
  id: string;
  title: string;
  body: string;
  time: string;
  group: "Today" | "This week" | "Earlier";
  unread: boolean;
  tag: "drop" | "billing" | "community" | "system";
};

const INITIAL: Notif[] = [
  { id: "n-1", title: "New drop: Iraqi dialect pack v2", body: "48 new captions now live in the library.", time: "2h", group: "Today", unread: true, tag: "drop" },
  { id: "n-2", title: "Your weekly digest is ready", body: "12 prompts you saved last week, re-ranked for this week.", time: "6h", group: "Today", unread: true, tag: "community" },
  { id: "n-3", title: "Billing reminder", body: "Supernova renews on May 18. Nothing needed from you.", time: "Yesterday", group: "This week", unread: false, tag: "billing" },
  { id: "n-4", title: "Layla H. replied to your thread", body: "\"Try narrowing the 2nd constraint — it tightens the voice.\"", time: "2d", group: "This week", unread: false, tag: "community" },
  { id: "n-5", title: "Push notifications enabled", body: "You will now receive drops the moment they land.", time: "5d", group: "Earlier", unread: false, tag: "system" }
];

const tagStyles: Record<Notif["tag"], string> = {
  drop: "text-accent-secondary",
  billing: "text-amber-300",
  community: "text-accent",
  system: "text-primary-muted"
};

export default function NotificationsPage() {
  const [items, setItems] = React.useState<Notif[]>(INITIAL);
  const unread = items.filter((n) => n.unread).length;

  const groups = React.useMemo(() => {
    const order = ["Today", "This week", "Earlier"] as const;
    return order
      .map((g) => ({ group: g, items: items.filter((n) => n.group === g) }))
      .filter((g) => g.items.length > 0);
  }, [items]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-8 md:py-12">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[11px] uppercase tracking-[0.22em] text-primary-muted/80">Inbox</div>
          <h1 className="mt-3 font-display text-display-md font-medium tracking-tight text-grad">
            Notifications
          </h1>
          <p className="mt-2 text-[14px] text-primary/60">
            {unread > 0 ? `${unread} unread notification${unread === 1 ? "" : "s"}.` : "You are all caught up."}
          </p>
        </div>
        <button
          onClick={() => setItems((prev) => prev.map((n) => ({ ...n, unread: false })))}
          className="focus-ring inline-flex h-10 items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 text-[12.5px] text-primary/85 hover:border-white/[0.15] hover:text-primary"
        >
          <CheckCheck className="h-3.5 w-3.5" />
          Mark all read
        </button>
      </div>

      <div className="mt-10 space-y-10">
        {groups.map((g) => (
          <section key={g.group}>
            <div className="mb-3 text-[11px] uppercase tracking-[0.22em] text-primary-muted">
              {g.group}
            </div>
            <ul className="overflow-hidden rounded-2xl border border-white/[0.06] bg-ink-800/40">
              {g.items.map((n, i) => (
                <motion.li
                  key={n.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.03 }}
                  className={cn(
                    "relative flex items-start gap-4 border-b border-white/[0.04] px-5 py-4 last:border-b-0 transition-colors hover:bg-white/[0.02]",
                    n.unread && "bg-white/[0.015]"
                  )}
                >
                  <span
                    className={cn(
                      "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                      n.unread ? "bg-accent-secondary shadow-[0_0_10px_rgba(92,225,230,0.6)]" : "bg-white/15"
                    )}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Bell className={cn("h-3.5 w-3.5", tagStyles[n.tag])} />
                      <div className="text-[14px] font-medium text-primary">{n.title}</div>
                    </div>
                    <div className="mt-1 text-[13px] leading-relaxed text-primary/65">{n.body}</div>
                  </div>
                  <div className="text-[11px] text-primary-muted">{n.time}</div>
                </motion.li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
