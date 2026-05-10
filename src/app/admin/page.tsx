"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  CreditCard,
  DollarSign,
  Eye,
  FileText,
  Flame,
  Heart,
  MousePointerClick,
  Sparkles,
  Users,
  Wrench
} from "lucide-react";
import {
  DataTable,
  KpiCard,
  PageHeader,
  Section,
  StatusDot,
  type Column
} from "@/components/admin/primitives";
import { AreaChart, BarChart, Donut, Sparkline } from "@/components/admin/charts";
import { useContentStore } from "@/lib/store/content-store";
import { Badge } from "@/components/ui/Badge";

/**
 * Mission Control — the admin home.
 * Executive KPIs, revenue trend, category breakdown, top tools, and live signal.
 */
export default function AdminOverviewPage() {
  const store = useContentStore();
  const users = store.users.length;
  const active = store.users.filter((u) => u.status === "active").length;
  const mrr = store.users.reduce((s, u) => s + (u.status === "active" ? u.mrrContribution : 0), 0);
  const supernova = store.users.filter((u) => u.plan === "Supernova" && u.status === "active").length;
  const promptsCount = store.prompts.length;
  const toolsCount = store.tools.length;
  const articlesCount = store.articles.length;

  // Deterministic pseudo-data for the demo charts
  const revenueTrend = React.useMemo(
    () => Array.from({ length: 28 }, (_, i) => 800 + Math.round(Math.sin(i / 3) * 120 + i * 14)),
    []
  );
  const copiesTrend = React.useMemo(
    () => Array.from({ length: 28 }, (_, i) => 1200 + Math.round(Math.cos(i / 4) * 180 + i * 22)),
    []
  );

  const categoryTotals = React.useMemo(() => {
    const map = new Map<string, number>();
    for (const p of store.prompts) map.set(p.category, (map.get(p.category) ?? 0) + 1);
    const entries = Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
    return {
      labels: entries.map((e) => e[0].slice(0, 6)),
      values: entries.map((e) => e[1])
    };
  }, [store.prompts]);

  const topTools = React.useMemo(
    () =>
      [...store.tools]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 5)
        .map((t) => ({
          id: t.id,
          name: t.name,
          category: t.category,
          rating: t.rating,
          trend: Array.from({ length: 14 }, (_, i) => 40 + Math.round(Math.sin(i + t.rating) * 18 + i * 1.4))
        })),
    [store.tools]
  );

  const recentUsers = [...store.users].slice(0, 5);
  const recentLogs = store.logs.slice(0, 6);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
      <PageHeader
        eyebrow="Mission Control"
        title="Good evening, Ahmed."
        description="Everything you ship lives here. Every number you need, one glance away."
        actions={
          <>
            <Link
              href="/admin/homepage"
              className="focus-ring inline-flex h-10 items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 text-[12.5px] text-primary/85 hover:border-white/[0.14]"
            >
              Edit homepage
              <ArrowUpRight className="h-3 w-3" />
            </Link>
            <Link
              href="/admin/notifications"
              className="focus-ring inline-flex h-10 items-center gap-2 rounded-full bg-grad-cta px-4 text-[13px] font-medium text-white shadow-[0_8px_24px_-10px_rgba(124,140,255,0.6)] hover:brightness-110"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Send announcement
            </Link>
          </>
        }
      />

      {/* KPIs */}
      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard
          icon={Users}
          label="Users"
          value={users.toLocaleString()}
          delta={{ value: "+12%", positive: true, caption: "last 30d" }}
        />
        <KpiCard
          icon={CreditCard}
          label="Supernova"
          value={supernova.toLocaleString()}
          delta={{ value: "+6%", positive: true, caption: "MoM" }}
          tone="secondary"
        />
        <KpiCard
          icon={DollarSign}
          label="MRR"
          value={`$${mrr.toLocaleString()}`}
          delta={{ value: "+$1.2k", positive: true, caption: "vs last mo." }}
        />
        <KpiCard
          icon={Flame}
          label="Active today"
          value={active.toLocaleString()}
          delta={{ value: "+3.4%", positive: true }}
          tone="secondary"
        />
      </div>

      {/* Revenue + copies charts */}
      <Section
        title="Growth"
        description="Executive view of revenue and engagement signals."
        actions={
          <Link
            href="/admin/analytics"
            className="focus-ring inline-flex h-9 items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 text-[12.5px] text-primary/85 hover:border-white/[0.14]"
          >
            Open analytics
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        }
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="card-premium p-5 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.2em] text-primary-muted">Revenue</div>
                <div className="mt-1 font-display text-[24px] font-medium tracking-tight text-primary">
                  $
                  {revenueTrend[revenueTrend.length - 1].toLocaleString()}
                  <span className="ml-2 text-[12px] text-accent-secondary">+18.4%</span>
                </div>
              </div>
              <StatusDot tone="ok">Live</StatusDot>
            </div>
            <div className="mt-4 h-[220px] w-full">
              <AreaChart data={revenueTrend} ariaLabel="Monthly revenue" />
            </div>
          </div>
          <div className="card-premium flex flex-col gap-6 p-5">
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-primary-muted">
                Prompt copies
              </div>
              <div className="mt-1 font-display text-[22px] font-medium tracking-tight text-primary">
                {copiesTrend[copiesTrend.length - 1].toLocaleString()}
              </div>
              <div className="mt-3">
                <Sparkline data={copiesTrend} width={260} height={48} color="#5CE1E6" />
              </div>
            </div>
            <Donut value={72} label="Retention (7d)" sub="Rolling cohort" />
          </div>
        </div>
      </Section>

      {/* Library + Tools */}
      <Section title="Library & tools" description="Content health at a glance.">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="card-premium p-5 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.2em] text-primary-muted">
                  Prompt categories
                </div>
                <div className="mt-1 font-display text-[18px] font-medium tracking-tight text-primary">
                  {promptsCount} total prompts
                </div>
              </div>
              <Link
                href="/admin/prompts"
                className="focus-ring inline-flex h-8 items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 text-[12px] text-primary/85 hover:border-white/[0.14]"
              >
                Manage
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="mt-4">
              <BarChart labels={categoryTotals.labels} values={categoryTotals.values} height={220} />
            </div>
          </div>

          <div className="card-premium p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.2em] text-primary-muted">
                  Top AI tools
                </div>
                <div className="mt-1 font-display text-[18px] font-medium tracking-tight text-primary">
                  {toolsCount} curated
                </div>
              </div>
              <Link
                href="/admin/tools"
                className="focus-ring inline-flex h-8 items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 text-[12px] text-primary/85 hover:border-white/[0.14]"
              >
                Manage
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
            <ul className="mt-4 space-y-3">
              {topTools.map((t) => (
                <li key={t.id} className="flex items-center gap-3">
                  <div className="grid h-8 w-8 place-items-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-accent">
                    <Wrench className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] text-primary">{t.name}</div>
                    <div className="truncate text-[11.5px] text-primary-muted">{t.category}</div>
                  </div>
                  <Sparkline data={t.trend} width={80} height={28} color="#5CE1E6" />
                  <span className="w-10 text-right text-[12px] text-primary/80">
                    {t.rating.toFixed(1)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Activity + recent users */}
      <Section title="Live operations">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="card-premium p-5 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div className="text-[11px] uppercase tracking-[0.2em] text-primary-muted">
                Admin activity
              </div>
              <Link
                href="/admin/logs"
                className="focus-ring inline-flex h-8 items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 text-[12px] text-primary/85 hover:border-white/[0.14]"
              >
                Open logs
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
            <ul className="mt-4 divide-y divide-white/[0.04]">
              {recentLogs.map((l) => (
                <li key={l.id} className="flex items-start gap-3 py-3">
                  <StatusDot
                    tone={l.severity === "critical" ? "danger" : l.severity === "warn" ? "warn" : "ok"}
                  >
                    {""}
                  </StatusDot>
                  <div className="flex-1">
                    <div className="text-[13px] text-primary/90">{l.action}</div>
                    <div className="mt-0.5 text-[11.5px] text-primary-muted">
                      {l.actor} · {l.ts}
                      {l.ip ? <> · <span className="font-mono">{l.ip}</span></> : null}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="card-premium p-5">
            <div className="flex items-center justify-between">
              <div className="text-[11px] uppercase tracking-[0.2em] text-primary-muted">
                Recent users
              </div>
              <Link
                href="/admin/users"
                className="focus-ring inline-flex h-8 items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 text-[12px] text-primary/85 hover:border-white/[0.14]"
              >
                Manage
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
            <ul className="mt-4 space-y-3">
              {recentUsers.map((u) => (
                <li key={u.id} className="flex items-center gap-3">
                  <span className="grid h-8 w-8 place-items-center rounded-full border border-white/[0.08] bg-gradient-to-br from-accent/40 to-accent-secondary/40 text-[11px] font-medium text-white">
                    {u.name.split(" ").map((x) => x[0]).slice(0, 2).join("")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] text-primary">{u.name}</div>
                    <div className="truncate text-[11.5px] text-primary-muted">{u.email}</div>
                  </div>
                  <Badge
                    tone={u.plan === "Supernova" ? "accent" : u.plan === "Orbit" ? "secondary" : "mute"}
                  >
                    {u.plan}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Quick links */}
      <Section title="Shortcuts">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Shortcut href="/admin/prompts" icon={Sparkles} label="Manage prompts" sub={`${promptsCount}`} />
          <Shortcut href="/admin/tools" icon={Wrench} label="AI tools" sub={`${toolsCount}`} />
          <Shortcut href="/admin/encyclopedia" icon={BookOpen} label="Articles" sub={`${articlesCount}`} />
          <Shortcut href="/admin/ads" icon={MousePointerClick} label="Advertisements" sub={`${store.ads.length}`} />
        </div>
      </Section>
    </div>
  );
}

function Shortcut({
  href,
  icon: Icon,
  label,
  sub
}: {
  href: string;
  icon: any;
  label: string;
  sub: string;
}) {
  return (
    <Link
      href={href}
      className="card-premium group flex items-center justify-between gap-4 p-4 lift ring-accent-hover"
    >
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-accent">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <div className="text-[13px] text-primary">{label}</div>
          <div className="text-[11.5px] text-primary-muted">{sub}</div>
        </div>
      </div>
      <ArrowUpRight className="h-3.5 w-3.5 text-primary-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </Link>
  );
}
