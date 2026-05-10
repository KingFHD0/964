"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookMarked, Heart, Bell, Users } from "lucide-react";
import { cn } from "@/lib/cn";

const ITEMS = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/library", label: "Library", icon: BookMarked },
  { href: "/favorites", label: "Saved", icon: Heart },
  { href: "/updates", label: "Updates", icon: Bell },
  { href: "/community", label: "People", icon: Users }
];

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 pb-[max(env(safe-area-inset-bottom),8px)] lg:hidden"
    >
      <div className="mx-3 mb-3 overflow-hidden rounded-[22px] glass-strong shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)]">
        <ul className="grid grid-cols-5">
          {ITEMS.map((it) => {
            const active = pathname === it.href || (it.href !== "/dashboard" && pathname.startsWith(it.href));
            return (
              <li key={it.href}>
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
                    <it.icon className={cn("relative h-[18px] w-[18px]", active && "text-accent")} />
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
