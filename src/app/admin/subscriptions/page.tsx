"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, DollarSign, Sparkles, TrendingUp, Users } from "lucide-react";
import { AreaChart, Donut, Sparkline } from "@/components/admin/charts";
import { KpiCard, PageHeader, Section, StatusDot } from "@/components/admin/primitives";
import { Badge } from "@/components/ui/Badge";
import { useContentStore } from "@/lib/store/content-store";

/**
 * Subscriptions overview.
 * Source of truth: the admin user table (plan + mrrContribution).
 * For a live production system, wire to Stripe / Paddle webhooks.
 */
export default function AdminSubscriptionsPage() {
  const users = useContentStore((s) => s.users);

  const active = users.filter((u) => u.status === "active");
  const supernova = active.filter((u) => u.plan === "Supernova").length;
  const orbit = active.filter((u) => u.plan === "Orbit").length;
  const free = users.filter((u) => u.plan === "Free").length;
  const mrr = active.reduce((s, u) => s + u.mrrContribution, 0);
  const arr = mrr * 12;

  const trend = React.useMemo(
    () => Array.from({ length: 24 }, (_, i) => 780 + Math.round(Math.sin(i / 2.6) * 140 + i * 20)),
    []
  );

  const churn = 3.2;
  const retention = 96.8;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
      <PageHeader
        eyebrow="Platform · Subscriptions"
        title="Subscription health"
        description="MRR, plan mix, churn, and the 24-month trajectory."
      />

      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard
          icon={DollarSign}
          label="MRR"
          value={`$${mrr.toLocaleString()}`}
          delta={{ value: "+18.4%", positive: true, caption: "vs last mo." }}
        />
        <KpiCard
          icon={TrendingUp}
          label="ARR (projected)"
          value={`$${arr.toLocaleString()}`}
          delta={{ value: "+21%", positive: true }}
          tone="secondary"
        />
        <KpiCard
          icon={Sparkles}
          label="Supernova"
          value={supernova.toLocaleString()}
          delta={{ value: "+4", positive: true, caption: "this week" }}
        />
        <KpiCard
          icon={Users}
          label="Orbit"
          value={orbit.toLocaleString()}
          delta={{ value: "+11", positive: true, caption: "this week" }}
          tone="secondary"
        />
      </div>

      <Section title="Revenue trajectory">
        <div className="card-premium p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-primary-muted">MRR · 24 months</div>
              <div className="mt-1 font-display text-[22px] font-medium tracking-tight text-primary">
                ${trend[trend.length - 1].toLocaleString()}
              </div>
            </div>
            <StatusDot tone="ok">Healthy</StatusDot>
          </div>
          <div className="mt-4 h-[220px]">
            <AreaChart data={trend} />
          </div>
        </div>
      </Section>

      <Section title="Plan mix & retention">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="card-premium p-5">
            <div className="text-[11px] uppercase tracking-[0.2em] text-primary-muted">Plan mix</div>
            <ul className="mt-4 space-y-3">
              {[
                { label: "Supernova", value: supernova, tone: "accent" as const },
                { label: "Orbit", value: orbit, tone: "secondary" as const },
                { label: "Free", value: free, tone: "mute" as const }
              ].map((r) => {
                const total = supernova + orbit + free;
                const pct = total === 0 ? 0 : Math.round((r.value / total) * 100);
                return (
                  <li key={r.label} className="flex items-center gap-3 text-[12.5px]">
                    <span className="w-24 text-primary/80">{r.label}</span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.05]">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${pct}%`,
                          background:
                            r.tone === "accent"
                              ? "linear-gradient(90deg,#7C8CFF,#5CE1E6)"
                              : r.tone === "secondary"
                              ? "rgba(92,225,230,0.6)"
                              : "rgba(255,255,255,0.15)"
                        }}
                      />
                    </div>
                    <span className="w-10 text-right text-primary/85">{pct}%</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="card-premium p-5">
            <Donut value={retention} max={100} label="Retention (90d)" sub="Rolling cohort" />
            <div className="mt-5 flex items-center gap-3 text-[12.5px]">
              <StatusDot tone="warn">Churn</StatusDot>
              <span className="ml-auto font-mono text-primary/80">{churn}%</span>
            </div>
          </div>

          <div className="card-premium p-5">
            <div className="text-[11px] uppercase tracking-[0.2em] text-primary-muted">Trials ending</div>
            <ul className="mt-4 space-y-2.5 text-[13px]">
              <li className="flex items-center justify-between">
                <span className="text-primary/85">This week</span>
                <span className="font-mono text-primary">12</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-primary/85">Next 7–14 days</span>
                <span className="font-mono text-primary">31</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-primary/85">Expired (no action)</span>
                <span className="font-mono text-primary-muted">4</span>
              </li>
            </ul>
            <Link
              href="/admin/users"
              className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] text-accent hover:text-accent-secondary"
            >
              View users
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </Section>

      <Section title="Top paying members">
        <div className="card-premium overflow-hidden">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-white/[0.04] text-[10.5px] uppercase tracking-[0.18em] text-primary-muted">
                <th className="px-5 py-3 font-normal">Member</th>
                <th className="px-5 py-3 font-normal">Plan</th>
                <th className="px-5 py-3 font-normal">Last 30d</th>
                <th className="px-5 py-3 text-right font-normal">MRR</th>
              </tr>
            </thead>
            <tbody>
              {active
                .sort((a, b) => b.mrrContribution - a.mrrContribution)
                .slice(0, 6)
                .map((u, i) => (
                  <tr key={u.id} className="border-b border-white/[0.04] last:border-b-0 hover:bg-white/[0.02]">
                    <td className="px-5 py-3.5 text-primary">
                      <div className="flex items-center gap-2">
                        <span className="grid h-7 w-7 place-items-center rounded-full border border-white/[0.08] bg-gradient-to-br from-accent/40 to-accent-secondary/40 text-[10px] font-medium text-white">
                          {u.name.split(" ").map((x) => x[0]).slice(0, 2).join("")}
                        </span>
                        <div className="min-w-0">
                          <div className="truncate">{u.name}</div>
                          <div className="truncate text-[11.5px] text-primary-muted">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge tone={u.plan === "Supernova" ? "accent" : u.plan === "Orbit" ? "secondary" : "mute"}>
                        {u.plan}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      <Sparkline
                        data={Array.from({ length: 14 }, (_, j) => 40 + Math.round(Math.sin(j + i) * 16 + j))}
                        width={160}
                        height={30}
                        color="#5CE1E6"
                      />
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono text-primary/85">
                      ${u.mrrContribution}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}
