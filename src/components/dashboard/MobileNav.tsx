"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Home, Search, Sparkles, Wrench } from "lucide-react";
import { cn } from "@/lib/cn";

type Item =
  | { kind: "link"; href: string; label: string; icon: React.ComponentType<{ className?: string }> }
  | { kind: "search"; label: string; icon: React.ComponentType<{ className?: string }> };

const ITEMS: Item[] = [
  { kind: "link", href: "/dashboard", label: "Home", icon: Home },
  { kind: "link", href: "/library", label: "Prompts", icon: Sparkles },
  { kind: "search", label: "Search", icon: Search },
  { kind: "link", href: "/encyclopedia", label: "Learn", icon: BookOpen },
  { kind: "link", href: "/tools", label: "Tools", icon: Wrench }
];

export function MobileNav() {
  const pathname = usePathname();

  function openPalette() {
    if (typeof window !== "undefined" && window.__aetherOpenPalette) {
      window.__aetherOpenPalette();
    }
  }

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 pb-[max(env(safe-area-inset-bottom),8px)] lg:hidden"
    >
      <div className="mx-3 mb-3 overflow-hidden rounded-[22px] glass-strong shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)]">
        <ul className="grid grid-cols-5">
          {ITEMS.map((it, idx) => {
            if (it.kind === "search") {
              return (
                <li key="search">
                  <button
                    onClick={openPalette}
                    className="group relative flex w-full flex-col items-center justify-center gap-1 py-3 text-[11px] text-primary transition-colors"
                    aria-label="Open search"
                  >
                    <div className="relative grid h-10 w-10 -translate-y-1 place-items-center rounded-2xl bg-[linear-gradient(135deg,#7C8CFF_0%,#5CE1E6_100%)] shadow-[0_10px_28px_-8px_rgba(124,140,255,0.55)]">
                      <Search className="h-[17px] w-[17px] text-white" />
                    </div>
                    <span className="text-primary/90">{it.label}</span>
                  </button>
                </li>
              );
            }
            const active =
              pathname === it.href ||
              (it.href !== "/dashboard" && pathname.startsWith(it.href));
            return (
              <li key={it.href + idx}>
                <Link
                  href={it.href}
                  className={cn(
                    "group relative flex flex-col items-center justify-center gap-1 py-3 text-[11px] transition-colors",
                    active ? "text-primary" : "text-primary-muted/70 hover:text-primary/90"
                  )}
                >
                  <div className="relative grid h-9 w-9 place-items-center">
                    {active ? (
                      <span
                        aria-hidden
                        className="absolute inset-0 rounded-2xl"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(124,140,255,0.22), rgba(92,225,230,0.15))",
                          boxShadow: "inset 0 0 0 1px rgba(124,140,255,0.3)"
                        }}
                      />
                    ) : null}
                    <it.icon
                      className={cn("relative h-[18px] w-[18px]", active && "text-accent")}
                    />
                  </div>
                  <span className={cn(active && "text-primary")}>{it.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
