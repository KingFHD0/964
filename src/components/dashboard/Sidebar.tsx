"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookMarked,
  BookOpen,
  Cpu,
  Globe,
  GraduationCap,
  Heart,
  LifeBuoy,
  Rocket,
  Sparkles,
  Users,
  Wrench,
  Zap,
  Briefcase
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/cn";

type Item = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  match?: string; // prefix for active state
  badge?: string;
};

const GROUPS: { title: string; items: Item[] }[] = [
  {
    title: "Workspace",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/library", label: "Prompt Library", icon: BookMarked },
      { href: "/favorites", label: "Favorites", icon: Heart }
    ]
  },
  {
    title: "AI Ecosystem",
    items: [
      { href: "/encyclopedia", label: "Encyclopedia", icon: BookOpen, badge: "New" },
      { href: "/tools", label: "AI Tools", icon: Wrench },
      { href: "/models", label: "AI Models", icon: Cpu },
      { href: "/news", label: "News", icon: Globe },
      { href: "/workflows", label: "Workflows", icon: Rocket }
    ]
  },
  {
    title: "Learn & operate",
    items: [
      { href: "/courses", label: "Courses", icon: GraduationCap },
      { href: "/guides", label: "Guides", icon: Sparkles },
      { href: "/business", label: "Business Systems", icon: Briefcase },
      { href: "/automation", label: "Automations", icon: Zap }
    ]
  },
  {
    title: "Community",
    items: [
      { href: "/community", label: "Community", icon: Users },
      { href: "/support", label: "Support", icon: LifeBuoy }
    ]
  }
];

/** Flat export retained for any consumer that imported NAV_ITEMS from here. */
export const NAV_ITEMS = GROUPS.flatMap((g) => g.items);

export function Sidebar() {
  const pathname = usePathname();

  function isActive(item: Item) {
    if (item.href === "/dashboard") return pathname === "/dashboard";
    const base = (item.match ?? item.href).split("?")[0];
    return pathname === base || pathname.startsWith(base + "/");
  }

  return (
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-r border-white/[0.06] bg-ink-950/45 backdrop-blur-2xl lg:flex">
      <div className="flex h-16 items-center px-6">
        <Link href="/" className="focus-ring rounded-full">
          <Logo />
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-4 no-scrollbar">
        {GROUPS.map((group) => (
          <div key={group.title} className="mt-4 first:mt-1">
            <div className="mb-2 px-3 text-[10.5px] uppercase tracking-[0.22em] text-primary-muted/65">
              {group.title}
            </div>
            <nav className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const active = isActive(item);
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
                      "focus-ring",
                      active
                        ? "bg-white/[0.05] text-primary shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]"
                        : "text-primary/62 hover:bg-white/[0.03] hover:text-primary"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-4 w-4 transition-colors duration-300",
                        active
                          ? "text-accent"
                          : "text-primary/50 group-hover:text-primary/85"
                      )}
                    />
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge ? (
                      <span className="rounded-full border border-accent-secondary/25 bg-accent-secondary/10 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-[0.16em] text-accent-secondary">
                        {item.badge}
                      </span>
                    ) : null}
                    {active ? (
                      <>
                        <span
                          aria-hidden
                          className="absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-r-full"
                          style={{ background: "linear-gradient(180deg, #7C8CFF, #5CE1E6)" }}
                        />
                        <span
                          aria-hidden
                          className="absolute left-0 top-1/2 h-8 w-6 -translate-y-1/2 -translate-x-1 rounded-r-full opacity-60 blur-md"
                          style={{ background: "linear-gradient(180deg, rgba(124,140,255,0.6), rgba(92,225,230,0.4))" }}
                        />
                      </>
                    ) : null}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Upgrade card */}
      <div
        className="m-3 rounded-2xl border border-white/[0.06] p-4 transition-all duration-500 hover:border-accent/20"
        style={{
          background:
            "radial-gradient(110% 110% at 0% 0%, rgba(124,140,255,0.14), transparent 60%), linear-gradient(180deg, rgba(17,24,39,0.6), rgba(11,16,32,0.6))"
        }}
      >
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-accent-secondary" />
          <div className="text-[11px] uppercase tracking-[0.2em] text-primary-muted">Supernova</div>
        </div>
        <div className="mt-2 font-display text-[16px] font-medium tracking-tight text-primary">
          Unlock the full ecosystem
        </div>
        <p className="mt-1 text-[12.5px] leading-relaxed text-primary/60">
          Pro briefs, models hub, and weekly intelligence drops.
        </p>
        <Link
          href="/pricing"
          className="sheen mt-4 inline-flex h-8 items-center rounded-full bg-grad-cta px-3 text-[12px] font-medium text-white shadow-[0_8px_24px_-10px_rgba(124,140,255,0.6)] transition-all duration-300 hover:brightness-110"
        >
          See plans
        </Link>
      </div>
    </aside>
  );
}
