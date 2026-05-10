"use client";

import * as React from "react";
import {
  DollarSign,
  MousePointerClick,
  Share2,
  Sparkles,
  TrendingUp,
  Users
} from "lucide-react";
import { KpiCard, PageHeader, Section } from "@/components/admin/primitives";
import { AreaChart, BarChart, Donut, Sparkline } from "@/components/admin/charts";
import { useContentStore } from "@/lib/store/content-store";

export default function AnalyticsPage() {
  const store = useContentStore();
  const revenue = React.useMemo(
    () => Array.from({ length: 30 }, (_, i) => 900 + Math.round(Math.sin(i / 3) * 160 + i * 22)),
    []
  );
  const traffic = React.useMemo(
    () => Array.from({ length: 30 }, (_, i) => 2400 + Math.round(Math.cos(i / 2.5) * 360 + i * 36)),
    []
  );
  const conversions = React.useMemo(
    () => Array.from({ length: 12 }, (_, i) => Math.round(30 + Math.sin(i) * 8 + i)),
    []
  );
  const retention = [92, 84, 76, 71, 66, 62, 58, 55];

  const top = React.useMemo(() => {
    return [...store.prompts]
      .slice(0, 6)
      .map((p, i) => ({
        id: p.id,
        title: p.title,
        copies: 900 - i * 120 + Math.round(Math.random() * 60),
        sparkline: Array.from({ length: 14 }, (_, i2) => 40 + Math.round(Math.sin(i2 + i) * 18 + i2))
      }));
  }, [store.prompts]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
      <PageHeader
        eyebrow="Analytics"
        title="Executive view"
        description="Revenue, traffic, engagement, and retention — a clean read across the platform."
      />

      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard icon={DollarSign} label="MRR" value="$24,802" delta={{ value: "+18.4%", positive: true, caption: "vs last mo." }} />
        <KpiCard icon={Users} label="Weekly active" value="12,408" delta={{ value: "+6.2%", positive: true }} tone="secondary" />
        <KpiCard icon={MousePointerClick} label="CTR" value="5.8%" delta={{ value: "+0.4pp", positive: true }} />
        <KpiCard icon={Share2} label="Share of Arabic" value="41%" delta={{ value: "+3pp", positive: true }} tone="secondary" />
      </div>

      <Section title="Revenue & traffic">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="card-premium p-5">
            <div className="text-[11px] uppercase tracking-[0.2em] text-primary-muted">Revenue (30d)</div>
            <div className="mt-1 font-display text-[22px] font-medium tracking-tight text-primary">
              ${revenue[revenue.length - 1].toLocaleString()}
            </div>
            <div className="mt-4 h-[220px]"><AreaChart data={revenue} /></div>
          </div>
          <div className="card-premium p-5">
            <div className="text-[11px] uppercase tracking-[0.2em] text-primary-muted">Traffic (30d)</div>
            <div className="mt-1 font-display text-[22px] font-medium tracking-tight text-primary">
              {traffic[traffic.length - 1].toLocaleString()}
            </div>
            <div className="mt-4 h-[220px]"><AreaChart data={traffic} color="#5CE1E6" secondary="#7C8CFF" /></div>
          </div>
        </div>
      </Section>

      <Section title="Conversion funnel & retention">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="card-premium p-5 lg:col-span-2">
            <div className="text-[11px] uppercase tracking-[0.2em] text-primary-muted">Monthly conversions</div>
            <div className="mt-4">
              <BarChart labels={["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]} values={conversions} height={220} />
            </div>
          </div>
          <div className="card-premium p-5">
            <div className="text-[11px] uppercase tracking-[0.2em] text-primary-muted">Retention cohort (D+)</div>
            <ul className="mt-4 space-y-2.5">
              {retention.map((r, i) => (
                <li key={i} className="flex items-center gap-3 text-[12px]">
                  <span className="w-12 text-primary-muted">D{i * 7}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.05]">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${r}%`,
                        background: "linear-gradient(90deg,#7C8CFF,#5CE1E6)"
                      }}
                    />
                  </div>
                  <span className="w-10 text-right text-primary/80">{r}%</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section title="Top prompts by copies">
        <div className="card-premium overflow-hidden">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-white/[0.04] text-[10.5px] uppercase tracking-[0.18em] text-primary-muted">
                <th className="px-5 py-3 font-normal">Prompt</th>
                <th className="px-5 py-3 font-normal">14d trend</th>
                <th className="px-5 py-3 text-right font-normal">Copies</th>
              </tr>
            </thead>
            <tbody>
              {top.map((t) => (
                <tr key={t.id} className="border-b border-white/[0.04] last:border-b-0 hover:bg-white/[0.02]">
                  <td className="px-5 py-3.5 text-primary">{t.title}</td>
                  <td className="px-5 py-3.5">
                    <Sparkline data={t.sparkline} width={180} height={32} color="#5CE1E6" />
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono text-primary/85">
                    {t.copies.toLocaleString()}
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
