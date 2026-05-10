"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookMarked,
  ImageIcon,
  Type,
  Briefcase,
  Heart,
  Bell,
  Users,
  LifeBuoy,
  Sparkles
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/cn";

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/library", label: "Prompt Library", icon: BookMarked },
  { href: "/library?type=image", label: "Image Prompts", icon: ImageIcon, matchHref: "/library?type=image" },
  { href: "/library?type=text", label: "Text Prompts", icon: Type, matchHref: "/library?type=text" },
  { href: "/library?type=business", label: "Business Modules", icon: Briefcase, matchHref: "/library?type=business" },
  { href: "/favorites", label: "Favorites", icon: Heart },
  { href: "/updates", label: "Updates", icon: Bell },
  { href: "/community", label: "Community", icon: Users },
  { href: "/support", label: "Support", icon: LifeBuoy }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex h-screen w-72 shrink-0 flex-col border-r border-white/[0.06] bg-ink-950/40 backdrop-blur-xl sticky top-0">
      <div className="flex h-16 items-center px-6">
        <Link href="/" className="focus-ring rounded-full">
          <Logo />
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-6 no-scrollbar">
        <div className="mb-3 px-3 text-[11px] uppercase tracking-[0.22em] text-primary-muted/70">
          Workspace
        </div>
        <nav className="flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href.split("?")[0]));
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] transition-all",
                  "focus-ring",
                  active
                    ? "bg-white/[0.05] text-primary shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]"
                    : "text-primary/65 hover:bg-white/[0.03] hover:text-primary"
                )}
              >
                <item.icon className={cn("h-4 w-4 transition-colors", active ? "text-accent" : "text-primary/50 group-hover:text-primary/80")} />
                <span className="flex-1">{item.label}</span>
                {active ? (
                  <span
                    className="absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-r-full"
                    style={{ background: "linear-gradient(180deg, #7C8CFF, #5CE1E6)" }}
                  />
                ) : null}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="m-3 rounded-2xl border border-white/[0.06] p-4"
        style={{
          background:
            "radial-gradient(100% 100% at 0% 0%, rgba(124,140,255,0.12), transparent 60%), linear-gradient(180deg, rgba(17,24,39,0.6), rgba(11,16,32,0.6))"
        }}
      >
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-accent-secondary" />
          <div className="text-[11px] uppercase tracking-[0.2em] text-primary-muted">Supernova</div>
        </div>
        <div className="mt-2 font-display text-[16px] font-medium tracking-tight text-primary">Upgrade your orbit</div>
        <p className="mt-1 text-[12.5px] leading-relaxed text-primary/60">Unlock pro briefs, weekly drops, and team seats.</p>
        <Link
          href="/pricing"
          className="mt-4 inline-flex h-8 items-center rounded-full bg-grad-cta px-3 text-[12px] font-medium text-white shadow-[0_8px_24px_-10px_rgba(124,140,255,0.6)] transition-all hover:brightness-110"
        >
          See plans
        </Link>
      </div>
    </aside>
  );
}
