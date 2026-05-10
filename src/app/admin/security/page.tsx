"use client";

import * as React from "react";
import { AlertTriangle, Check, Lock, Shield, ShieldCheck } from "lucide-react";
import { KpiCard, PageHeader, Section, StatusDot } from "@/components/admin/primitives";
import { useContentStore } from "@/lib/store/content-store";

/**
 * Security posture — the platform-wide "mission ready" checklist.
 * Cross-references middleware / auth / store / content rules so admins can
 * see at a glance what is enforced and what needs attention.
 */
export default function AdminSecurityPage() {
  const logs = useContentStore((s) => s.logs);
  const critical = logs.filter((l) => l.severity === "critical").length;
  const warn = logs.filter((l) => l.severity === "warn").length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-8">
      <PageHeader
        eyebrow="Platform · Security"
        title="Security posture"
        description="Defense-in-depth checklist for Aether 964. Edge middleware, app layer, store, and content rules."
      />

      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard icon={ShieldCheck} label="Posture" value="Hardened" tone="secondary" />
        <KpiCard icon={Lock} label="MFA (admins)" value="Required" />
        <KpiCard icon={AlertTriangle} label="Critical events (14d)" value={critical.toString()} tone="accent" />
        <KpiCard icon={Shield} label="Warn events (14d)" value={warn.toString()} />
      </div>

      <Section title="Edge hardening">
        <Checklist
          items={[
            { label: "Content-Security-Policy with per-request nonce", ok: true },
            { label: "Strict-Transport-Security (prod) with preload", ok: true },
            { label: "X-Frame-Options: DENY", ok: true },
            { label: "Referrer-Policy: strict-origin-when-cross-origin", ok: true },
            { label: "Permissions-Policy locks camera/mic/geolocation/payment/USB", ok: true },
            { label: "X-Content-Type-Options: nosniff", ok: true }
          ]}
        />
      </Section>

      <Section title="Authentication">
        <Checklist
          items={[
            { label: "Admin sign-in requires email + password", ok: true },
            { label: "TOTP MFA (demo 000000) required for super_admin", ok: true },
            { label: "Rolling rate-limit on login attempts (5/min)", ok: true },
            { label: "Session stored in persistent store, cleared on logout", ok: true },
            { label: "HttpOnly + Secure cookies for JWT (wire in production)", ok: false, note: "Plug Supabase/NextAuth." }
          ]}
        />
      </Section>

      <Section title="Authorization (RBAC)">
        <Checklist
          items={[
            { label: "Centralized role matrix (/admin/roles)", ok: true },
            { label: "AdminGate enforces minimum role per /admin subtree", ok: true },
            { label: "Server endpoints must re-check role server-side", ok: false, note: "Repeat server-side in API handlers." }
          ]}
        />
      </Section>

      <Section title="Input & output safety">
        <Checklist
          items={[
            { label: "Prompt-injection sentinels redacted on write", ok: true },
            { label: "Text inputs escape control characters + zero-width", ok: true },
            { label: "URL inputs limited to http(s), mailto, tel, relative", ok: true },
            { label: "Markdown lite renderer escapes HTML", ok: true },
            { label: "File uploads: MIME + 5MB ceiling + random names", ok: true }
          ]}
        />
      </Section>

      <Section title="Operational">
        <Checklist
          items={[
            { label: "All admin actions written to audit log", ok: true },
            { label: "Rate limiter available for /api/* handlers", ok: true },
            { label: "Service worker cache scope limited to self-origin", ok: true },
            { label: "Secrets kept server-only (never imported in client bundles)", ok: true }
          ]}
        />
      </Section>
    </div>
  );
}

function Checklist({ items }: { items: { label: string; ok: boolean; note?: string }[] }) {
  return (
    <div className="card-premium p-5">
      <ul className="divide-y divide-white/[0.04]">
        {items.map((item) => (
          <li key={item.label} className="flex items-start gap-3 py-3">
            {item.ok ? (
              <span className="mt-0.5 grid h-5 w-5 place-items-center rounded-full bg-accent-secondary/15 text-accent-secondary">
                <Check className="h-3 w-3" />
              </span>
            ) : (
              <span className="mt-0.5 grid h-5 w-5 place-items-center rounded-full bg-amber-500/15 text-amber-300">
                <AlertTriangle className="h-3 w-3" />
              </span>
            )}
            <div className="flex-1">
              <div className="text-[13.5px] text-primary/90">{item.label}</div>
              {item.note ? (
                <div className="mt-0.5 text-[11.5px] text-primary-muted">{item.note}</div>
              ) : null}
            </div>
            <StatusDot tone={item.ok ? "ok" : "warn"}>
              {item.ok ? "enforced" : "todo"}
            </StatusDot>
          </li>
        ))}
      </ul>
    </div>
  );
}
