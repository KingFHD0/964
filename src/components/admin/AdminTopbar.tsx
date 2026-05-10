"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Activity, LogOut, Menu, Radio, Search, Shield, Sparkles } from "lucide-react";
import { useAdminAuth } from "@/lib/store/admin-auth";

export function AdminTopbar({ onMenu }: { onMenu: () => void }) {
  const router = useRouter();
  const session = useAdminAuth((s) => s.session);
  const logout = useAdminAuth((s) => s.logout);
  const [menu, setMenu] = React.useState(false);

  function openPalette() {
    if (typeof window !== "undefined" && window.__aetherOpenPalette) {
      window.__aetherOpenPalette();
    }
  }

  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-ink-950/55 backdrop-blur-2xl backdrop-saturate-150">
      <div className="flex h-16 items-center gap-3 px-4 md:px-6">
        <button
          onClick={onMenu}
          aria-label="Open menu"
          className="focus-ring grid h-10 w-10 place-items-center rounded-full border border-white/[0.06] bg-white/[0.03] text-primary/80 hover:border-white/[0.14] hover:text-primary lg:hidden"
        >
          <Menu className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2">
          <span className="chip hidden sm:inline-flex">
            <Radio className="h-3 w-3 text-accent-secondary" />
            <span className="ml-1">Mission Control</span>
          </span>
        </div>

        <button
          onClick={openPalette}
          className="group ml-auto flex h-10 w-full max-w-md items-center gap-2.5 rounded-full border border-white/[0.06] bg-white/[0.03] px-4 text-left transition-all duration-300 hover:border-white/[0.14] hover:bg-white/[0.045] focus-ring"
          aria-label="Open universal search"
        >
          <Search className="h-4 w-4 text-primary-muted/80 transition-colors group-hover:text-primary/80" />
          <span className="flex-1 truncate text-[13.5px] text-primary-muted/70">
            Search the platform…
          </span>
          <kbd className="hidden items-center gap-1 rounded-md border border-white/[0.08] bg-white/[0.03] px-1.5 py-0.5 text-[10px] text-primary-muted sm:inline-flex">
            ⌘K
          </kbd>
        </button>

        <Link
          href="/admin/security"
          className="focus-ring hidden h-10 items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.03] px-3 text-[12px] text-primary/85 transition-all duration-300 hover:border-accent-secondary/30 md:inline-flex"
          title="Security posture"
        >
          <Shield className="h-3.5 w-3.5 text-accent-secondary" />
          Secure
        </Link>
        <Link
          href="/admin/activity"
          className="focus-ring hidden h-10 items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.03] px-3 text-[12px] text-primary/85 transition-all duration-300 hover:border-white/[0.14] md:inline-flex"
        >
          <Activity className="h-3.5 w-3.5 text-accent" />
          Live
        </Link>

        <div className="relative">
          <button
            onClick={() => setMenu((v) => !v)}
            className="focus-ring grid h-10 w-10 place-items-center overflow-hidden rounded-full border border-white/[0.08] bg-gradient-to-br from-accent/40 to-accent-secondary/40 text-[12px] font-medium text-white transition-all duration-300 hover:shadow-glow-xs"
            aria-label="Admin menu"
          >
            {initials(session?.name ?? "AA")}
          </button>
          <AnimatePresence>
            {menu ? (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.98 }}
                transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
                className="absolute right-0 top-[calc(100%+10px)] z-50 w-[260px] overflow-hidden rounded-2xl glass-strong shadow-elev-3"
              >
                <div className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-full border border-white/[0.08] bg-gradient-to-br from-accent/40 to-accent-secondary/40 text-[12px] font-medium">
                      {initials(session?.name ?? "AA")}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[13.5px] font-medium text-primary">
                        {session?.name ?? "Guest"}
                      </div>
                      <div className="truncate text-[11.5px] text-primary-muted">
                        {session?.role ?? "—"}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="hairline" />
                <div className="p-1.5">
                  <Link
                    href="/dashboard"
                    onClick={() => setMenu(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] text-primary/85 transition-colors hover:bg-white/[0.05] hover:text-primary"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-accent-secondary" />
                    Exit to user app
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMenu(false);
                      router.push("/admin/sign-in");
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[13px] text-primary/85 transition-colors hover:bg-white/[0.05] hover:text-primary"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Sign out
                  </button>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

function initials(n: string) {
  return n
    .split(" ")
    .map((x) => x[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
