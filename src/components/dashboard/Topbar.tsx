"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, Search, Settings, Sparkles, LogOut, User, CreditCard } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/cn";

export function Topbar() {
  const [notifOpen, setNotifOpen] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-ink-950/60 backdrop-blur-xl backdrop-saturate-150">
      <div className="flex h-16 items-center gap-3 px-4 md:px-8">
        {/* Mobile logo */}
        <Link href="/dashboard" className="lg:hidden">
          <Logo />
        </Link>

        {/* Search */}
        <div className="relative ml-auto w-full max-w-xl lg:ml-0 lg:mr-auto">
          <div className="group flex h-10 items-center gap-2.5 rounded-full border border-white/[0.06] bg-white/[0.03] px-4 transition-colors focus-within:border-accent/40 focus-within:bg-white/[0.05]">
            <Search className="h-4 w-4 text-primary-muted/80" />
            <input
              type="search"
              placeholder="Search prompts, categories…"
              className="h-full w-full bg-transparent text-[13.5px] text-primary outline-none placeholder:text-primary-muted/60"
              aria-label="Search"
            />
            <kbd className="hidden rounded-md border border-white/[0.08] bg-white/[0.03] px-1.5 py-0.5 text-[10px] text-primary-muted sm:inline-block">
              ⌘ K
            </kbd>
          </div>
        </div>

        {/* Plan badge */}
        <Link
          href="/billing"
          className="hidden items-center gap-1.5 rounded-full border border-accent/25 bg-accent/10 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-accent transition-colors hover:bg-accent/15 sm:inline-flex"
        >
          <Sparkles className="h-3 w-3" />
          Supernova
        </Link>

        {/* Notifications */}
        <div className="relative">
          <button
            aria-label="Notifications"
            onClick={() => {
              setNotifOpen((v) => !v);
              setMenuOpen(false);
            }}
            className="focus-ring relative grid h-10 w-10 place-items-center rounded-full border border-white/[0.06] bg-white/[0.03] text-primary/80 transition-colors hover:border-white/[0.12] hover:text-primary"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-accent-secondary shadow-[0_0_8px_rgba(92,225,230,0.9)]" />
          </button>
          <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
        </div>

        {/* Settings */}
        <Link
          href="/settings"
          className="focus-ring hidden h-10 w-10 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.03] text-primary/80 transition-colors hover:border-white/[0.12] hover:text-primary sm:grid"
          aria-label="Settings"
        >
          <Settings className="h-4 w-4" />
        </Link>

        {/* Avatar menu */}
        <div className="relative">
          <button
            aria-label="Account"
            onClick={() => {
              setMenuOpen((v) => !v);
              setNotifOpen(false);
            }}
            className="focus-ring grid h-10 w-10 place-items-center overflow-hidden rounded-full border border-white/[0.08] bg-gradient-to-br from-accent/40 to-accent-secondary/40 text-[12px] font-medium text-white"
          >
            AM
          </button>
          <AccountMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
        </div>
      </div>
    </header>
  );
}

function NotificationPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 4, scale: 0.98 }}
          transition={{ duration: 0.18, ease: [0.2, 0.8, 0.2, 1] }}
          className="absolute right-0 top-[calc(100%+10px)] z-50 w-[360px] overflow-hidden rounded-2xl glass-strong shadow-elev-2"
        >
          <div className="flex items-center justify-between px-5 py-4">
            <div className="font-display text-[15px] font-medium tracking-tight text-primary">Notifications</div>
            <Link
              href="/updates"
              onClick={onClose}
              className="text-[12px] text-accent transition-colors hover:text-accent-secondary"
            >
              View all
            </Link>
          </div>
          <div className="hairline" />
          <ul className="max-h-80 overflow-y-auto no-scrollbar">
            {NOTIFS.map((n) => (
              <li key={n.id} className="group flex items-start gap-3 px-5 py-3.5 transition-colors hover:bg-white/[0.03]">
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ background: n.unread ? "#5CE1E6" : "rgba(255,255,255,0.15)" }}
                />
                <div className="flex-1">
                  <div className="text-[13.5px] text-primary/90">{n.title}</div>
                  <div className="mt-0.5 text-[12px] text-primary-muted">{n.time}</div>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

const NOTIFS = [
  { id: 1, title: "New drop: Iraqi dialect caption pack v2", time: "2h ago", unread: true },
  { id: 2, title: "Your weekly digest is ready", time: "Yesterday", unread: true },
  { id: 3, title: "Supernova plan renewed successfully", time: "3 days ago", unread: false },
  { id: 4, title: "New community thread: Ramadan campaigns", time: "5 days ago", unread: false }
];

function AccountMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const items = [
    { label: "Profile", href: "/settings", icon: User },
    { label: "Billing", href: "/billing", icon: CreditCard },
    { label: "Preferences", href: "/settings", icon: Settings }
  ];
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 4, scale: 0.98 }}
          transition={{ duration: 0.18, ease: [0.2, 0.8, 0.2, 1] }}
          className="absolute right-0 top-[calc(100%+10px)] z-50 w-[260px] overflow-hidden rounded-2xl glass-strong shadow-elev-2"
        >
          <div className="p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full border border-white/[0.08] bg-gradient-to-br from-accent/40 to-accent-secondary/40 text-[12px] font-medium">
                AM
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13.5px] font-medium text-primary">Ahmed M.</div>
                <div className="truncate text-[12px] text-primary-muted">ahmed@aether964.com</div>
              </div>
            </div>
          </div>
          <div className="hairline" />
          <ul className="p-1.5">
            {items.map((i) => (
              <li key={i.label}>
                <Link
                  href={i.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] text-primary/85 transition-colors hover:bg-white/[0.05] hover:text-primary"
                  )}
                >
                  <i.icon className="h-3.5 w-3.5" />
                  {i.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="hairline" />
          <div className="p-1.5">
            <Link
              href="/sign-in"
              onClick={onClose}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] text-primary/85 transition-colors hover:bg-white/[0.05] hover:text-primary"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </Link>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
