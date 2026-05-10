"use client";

import * as React from "react";
import { Database, HardDrive, Lock, Server } from "lucide-react";
import { AreaChart } from "@/components/admin/charts";
import { KpiCard, PageHeader, Section, StatusDot } from "@/components/admin/primitives";
import { useContentStore } from "@/lib/store/content-store";

/**
 * Database monitoring — a calm control surface for the DB tier.
 * Cards, capacity, RLS posture, and the 24h query trend.
 *
 * Metrics below are illustrative; wire to Supabase /admin RPCs
 * in production.
 */
export default function AdminDatabasePage() {
  const users = useContentStore((s) => s.users.length);
  const prompts = useContentStore((s) => s.prompts.length);
  const tools = useContentStore((s) => s.tools.length);
  const articles = useContentStore((s) => s.articles.length);

  const rows = [
    { name: "public.users", kind: "table", rows: users, rls: true, grants: "read:auth,write:service" },
    { name: "public.prompts", kind: "table", rows: prompts, rls: true, grants: "read:authenticated,write:service" },
    { name: "public.tools", kind: "table", rows: tools, rls: true, grants: "read:anon,write:service" },
    { name: "public.articles", kind: "table", rows: articles, rls: true, grants: "read:anon,write:service" },
    { name: "public.ads", kind: "table", rows: 4, rls: true, grants: "read:anon,write:service" },
    { name: "public.audit_logs", kind: "table", rows: 120, rls: true, grants: "read:service,write:service" }
  ];

  const queries = React.useMemo(
    () => Array.from({ length: 48 }, (_, i) => 120 + Math.round(Math.sin(i / 3) * 40 + Math.random() * 12)),
    []
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
      <PageHeader
        eyebrow="Platform · Database"
        title="Database monitoring"
        description="Capacity, row counts, RLS policies, and live query throughput."
      />

      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard icon={Server} label="Region" value="eu-central-1" />
        <KpiCard icon={HardDrive} label="Storage" value="12.4 GB" delta={{ value: "+4%", positive: true, caption: "7d" }} />
        <KpiCard icon={Database} label="Connections" value="38 / 200" tone="secondary" />
        <KpiCard icon={Lock} label="RLS" value="Enforced" tone="secondary" />
      </div>

      <Section title="24h query throughput">
        <div className="card-premium p-5">
          <div className="flex items-center justify-between">
            <div className="text-[11px] uppercase tracking-[0.2em] text-primary-muted">Queries / min</div>
            <StatusDot tone="ok">Nominal</StatusDot>
          </div>
          <div className="mt-4 h-[200px]">
            <AreaChart data={queries} />
          </div>
        </div>
      </Section>

      <Section title="Tables & policies">
        <div className="card-premium overflow-hidden">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-white/[0.04] text-[10.5px] uppercase tracking-[0.18em] text-primary-muted">
                <th className="px-5 py-3 font-normal">Relation</th>
                <th className="px-5 py-3 font-normal">Kind</th>
                <th className="px-5 py-3 font-normal">Rows</th>
                <th className="px-5 py-3 font-normal">RLS</th>
                <th className="px-5 py-3 font-normal">Grants</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.name} className="border-b border-white/[0.04] last:border-b-0 hover:bg-white/[0.02]">
                  <td className="px-5 py-3.5 font-mono text-[12.5px] text-primary">{r.name}</td>
                  <td className="px-5 py-3.5 text-primary-muted">{r.kind}</td>
                  <td className="px-5 py-3.5 font-mono text-primary/85">{r.rows.toLocaleString()}</td>
                  <td className="px-5 py-3.5">
                    <StatusDot tone={r.rls ? "ok" : "danger"}>{r.rls ? "on" : "off"}</StatusDot>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-[12px] text-primary-muted">{r.grants}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Backups">
        <div className="card-premium p-5">
          <ul className="divide-y divide-white/[0.04]">
            <li className="flex items-center justify-between py-3">
              <div>
                <div className="text-[13px] text-primary/90">Daily snapshot</div>
                <div className="text-[11.5px] text-primary-muted">Retained 14 days · last: 02:00 UTC</div>
              </div>
              <StatusDot tone="ok">healthy</StatusDot>
            </li>
            <li className="flex items-center justify-between py-3">
              <div>
                <div className="text-[13px] text-primary/90">Point-in-time recovery</div>
                <div className="text-[11.5px] text-primary-muted">Enabled · 7-day window</div>
              </div>
              <StatusDot tone="ok">healthy</StatusDot>
            </li>
            <li className="flex items-center justify-between py-3">
              <div>
                <div className="text-[13px] text-primary/90">Replica</div>
                <div className="text-[11.5px] text-primary-muted">eu-west-1 · lag &lt; 1s</div>
              </div>
              <StatusDot tone="ok">healthy</StatusDot>
            </li>
          </ul>
        </div>
      </Section>
    </div>
  );
}
