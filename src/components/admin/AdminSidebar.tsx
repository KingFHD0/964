"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BarChart3,
  BookOpen,
  Boxes,
  ChevronRight,
  Cpu,
  Database,
  Gauge,
  GraduationCap,
  Image as ImageIcon,
  Layout,
  Megaphone,
  Newspaper,
  Palette,
  ScrollText,
  Shield,
  Sliders,
  Sparkles,
  Tag,
  Users,
  Wrench,
  Zap,
  Bell,
  Globe as GlobeIcon
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/cn";

type Item = { href: string; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string };

const GROUPS: { title: string; items: Item[] }[] = [
  {
    title: "Overview",
    items: [
      { href: "/admin", label: "Mission Control", icon: Gauge },
      { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
      { href: "/admin/activity", label: "Live Activity", icon: Activity }
    ]
  },
  {
    title: "Content",
    items: [
      { href: "/admin/prompts", label: "Prompts", icon: Sparkles },
      { href: "/admin/tools", label: "AI Tools", icon: Wrench },
      { href: "/admin/models", label: "AI Models", icon: Cpu },
      { href: "/admin/encyclopedia", label: "Encyclopedia", icon: BookOpen },
      { href: "/admin/courses", label: "Courses", icon: GraduationCap },
      { href: "/admin/news", label: "News", icon: Newspaper },
      { href: "/admin/categories", label: "Categories", icon: Tag },
      { href: "/admin/media", label: "Media", icon: ImageIcon }
    ]
  },
  {
    title: "Growth",
    items: [
      { href: "/admin/ads", label: "Advertisements", icon: Megaphone, badge: "New" },
      { href: "/admin/notifications", label: "Notifications", icon: Bell },
      { href: "/admin/homepage", label: "Homepage Editor", icon: Layout },
      { href: "/admin/seo", label: "SEO", icon: GlobeIcon }
    ]
  },
  {
    title: "Platform",
    items: [
      { href: "/admin/users", label: "Users", icon: Users },
      { href: "/admin/subscriptions", label: "Subscriptions", icon: Boxes },
      { href: "/admin/roles", label: "Roles & RBAC", icon: Shield },
      { href: "/admin/database", label: "Database", icon: Database },
      { href: "/admin/logs", label: "Activity Logs", icon: ScrollText },
      { href: "/admin/security", label: "Security", icon: Shield }
    ]
  },
  {
    title: "Customization",
    items: [
      { href: "/admin/theme", label: "Theme", icon: Palette },
      { href: "/admin/settings", label: "System Settings", icon: Sliders },
      { href: "/admin/automations", label: "Automations", icon: Zap }
    ]
  }
];

export const ADMIN_NAV = GROUPS.flatMap((g) => g.items);

export function AdminSidebar({
  open,
  onClose
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile backdrop */}
      <div
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-40 bg-ink-950/60 backdrop-blur-sm transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        aria-hidden
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-screen w-72 shrink-0 flex-col border-r border-white/[0.06] bg-ink-950/65 backdrop-blur-2xl transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] lg:sticky lg:top-0 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <Link href="/admin" className="focus-ring rounded-full">
            <Logo />
          </Link>
          <span className="chip hidden lg:inline-flex">Admin</span>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-4 no-scrollbar">
          {GROUPS.map((group) => (
            <div key={group.title} className="mt-4 first:mt-1">
              <div className="mb-2 px-3 text-[10.5px] uppercase tracking-[0.22em] text-primary-muted/65">
                {group.title}
              </div>
              <nav className="flex flex-col gap-0.5">
                {group.items.map((item) => {
                  const active =
                    pathname === item.href ||
                    (item.href !== "/admin" && pathname.startsWith(`${item.href}/`));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
                        "focus-ring",
                        active
                          ? "bg-white/[0.05] text-primary"
                          : "text-primary/65 hover:bg-white/[0.03] hover:text-primary"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-4 w-4 transition-colors duration-300",
                          active ? "text-accent" : "text-primary/50 group-hover:text-primary/85"
                        )}
                      />
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.badge ? (
                        <span className="rounded-full border border-accent-secondary/25 bg-accent-secondary/10 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-[0.16em] text-accent-secondary">
                          {item.badge}
                        </span>
                      ) : null}
                      <ChevronRight
                        className={cn(
                          "h-3 w-3 opacity-0 transition-all duration-300 group-hover:opacity-100",
                          active ? "opacity-40 text-accent" : "text-primary/40"
                        )}
                      />
                      {active ? (
                        <>
                          <span
                            aria-hidden
                            className="absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-r-full"
                            style={{ background: "linear-gradient(180deg, #7C8CFF, #5CE1E6)" }}
                          />
                          <span
                            aria-hidden
                            className="absolute left-0 top-1/2 h-7 w-5 -translate-y-1/2 -translate-x-1 rounded-r-full opacity-60 blur-md"
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

        <div className="m-3 rounded-2xl border border-white/[0.06] p-4 text-[12px] text-primary/70" style={{
          background:
            "radial-gradient(110% 110% at 0% 0%, rgba(124,140,255,0.12), transparent 60%), linear-gradient(180deg, rgba(17,24,39,0.6), rgba(11,16,32,0.6))"
        }}>
          <div className="flex items-center gap-2 text-[10.5px] uppercase tracking-[0.22em] text-primary-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-secondary shadow-[0_0_8px_rgba(92,225,230,0.9)]" />
            System nominal
          </div>
          <div className="mt-2 leading-relaxed">All services up. Last deploy 2h ago.</div>
          <Link
            href="/admin/security"
            className="mt-3 inline-flex items-center gap-1.5 text-[12px] text-accent hover:text-accent-secondary"
          >
            View security posture
          </Link>
        </div>
      </aside>
    </>
  );
}
