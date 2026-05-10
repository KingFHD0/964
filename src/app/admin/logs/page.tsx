"use client";

import * as React from "react";
import { Download } from "lucide-react";
import { PageHeader, Section, Select, StatusDot, Toolbar } from "@/components/admin/primitives";
import { Badge } from "@/components/ui/Badge";
import { useContentStore } from "@/lib/store/content-store";

/**
 * Activity logs — every admin event lives here.
 * Filterable by severity + actor, exportable to JSON for offline review.
 */
export default function AdminLogsPage() {
  const logs = useContentStore((s) => s.logs);
  const [query, setQuery] = React.useState("");
  const [severity, setSeverity] = React.useState<string>("All");

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return logs.filter((l) => {
      if (severity !== "All" && l.severity !== severity) return false;
      if (!q) return true;
      return [l.actor, l.action, l.target ?? "", l.ip ?? ""].some((v) =>
        v.toLowerCase().includes(q)
      );
    });
  }, [logs, query, severity]);

  function exportJson() {
    const blob = new Blob([JSON.stringify(filtered, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `aether-logs-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-8">
      <PageHeader
        eyebrow="Platform · Audit"
        title="Activity logs"
        description="Every admin action, every security event. Exportable on demand."
        actions={
          <button
            onClick={exportJson}
            className="focus-ring inline-flex h-10 items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 text-[12.5px] text-primary/85 hover:border-white/[0.14]"
          >
            <Download className="h-3.5 w-3.5" />
            Export JSON
          </button>
        }
      />

      <Section title="Stream">
        <Toolbar search={query} onSearch={setQuery} placeholder="Search actor, action, IP…">
          <Select value={severity} onChange={(e) => setSeverity(e.target.value)}>
            <option value="All">Any severity</option>
            <option value="info">info</option>
            <option value="warn">warn</option>
            <option value="critical">critical</option>
          </Select>
        </Toolbar>

        <div className="mt-5 overflow-hidden rounded-2xl border border-white/[0.06] bg-ink-800/40">
          <ul className="divide-y divide-white/[0.04]">
            {filtered.map((l) => (
              <li key={l.id} className="flex items-start gap-4 px-5 py-4">
                <StatusDot
                  tone={l.severity === "critical" ? "danger" : l.severity === "warn" ? "warn" : "ok"}
                >
                  {l.severity}
                </StatusDot>
                <div className="min-w-0 flex-1">
                  <div className="text-[13.5px] text-primary/90">{l.action}</div>
                  <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11.5px] text-primary-muted">
                    <span className="text-primary/80">{l.actor}</span>
                    <span className="h-1 w-1 rounded-full bg-white/15" />
                    <span>{l.ts}</span>
                    {l.ip ? (
                      <>
                        <span className="h-1 w-1 rounded-full bg-white/15" />
                        <span className="font-mono">{l.ip}</span>
                      </>
                    ) : null}
                  </div>
                </div>
                <Badge
                  tone={l.severity === "critical" ? "accent" : l.severity === "warn" ? "default" : "mute"}
                >
                  {l.severity}
                </Badge>
              </li>
            ))}
            {filtered.length === 0 ? (
              <li className="px-5 py-10 text-center text-[13px] text-primary/60">
                No entries match those filters.
              </li>
            ) : null}
          </ul>
        </div>
      </Section>
    </div>
  );
}
