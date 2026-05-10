"use client";

import * as React from "react";
import { Bell, Flag, Globe2, RefreshCcw, Shield, Wand2 } from "lucide-react";
import { PageHeader, Section, ToggleRow } from "@/components/admin/primitives";
import { useContentStore } from "@/lib/store/content-store";
import { useAdminAuth } from "@/lib/store/admin-auth";
import { toast } from "@/components/ui/Toaster";

/**
 * System settings — the calm on/off switches that govern the platform.
 */
export default function AdminSettingsPage() {
  const reset = useContentStore((s) => s.resetToDefaults);
  const logEvent = useContentStore((s) => s.logEvent);
  const actor = useAdminAuth((s) => s.session?.name ?? "system");

  const [push, setPush] = React.useState(true);
  const [aiNewsDigest, setAiNewsDigest] = React.useState(true);
  const [betaRollouts, setBetaRollouts] = React.useState(false);
  const [maintenance, setMaintenance] = React.useState(false);
  const [promptGuard, setPromptGuard] = React.useState(true);
  const [ipAllowlist, setIpAllowlist] = React.useState(false);
  const [regionLockIq, setRegionLockIq] = React.useState(false);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-8">
      <PageHeader
        eyebrow="Customization · System"
        title="System settings"
        description="Platform-wide toggles. Maintenance mode is the big red switch."
      />

      <Section title="Notifications">
        <div className="card-premium p-5">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-primary-muted">
            <Bell className="h-3 w-3 text-accent-secondary" />
            Dispatch
          </div>
          <div className="mt-2 divide-y divide-white/[0.04]">
            <ToggleRow
              label="Allow push notifications"
              description="Browser + PWA push. Requires user opt-in."
              checked={push}
              onChange={setPush}
            />
            <ToggleRow
              label="Weekly AI news digest"
              description="Sends on Sunday 09:00 UTC."
              checked={aiNewsDigest}
              onChange={setAiNewsDigest}
            />
          </div>
        </div>
      </Section>

      <Section title="Rollouts & flags">
        <div className="card-premium p-5">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-primary-muted">
            <Flag className="h-3 w-3 text-accent-secondary" />
            Flags
          </div>
          <div className="mt-2 divide-y divide-white/[0.04]">
            <ToggleRow
              label="Beta rollouts"
              description="Exposes new sections to internal members before public."
              checked={betaRollouts}
              onChange={setBetaRollouts}
            />
            <ToggleRow
              label="Maintenance mode"
              description="Shows a maintenance banner on the public app."
              checked={maintenance}
              onChange={(v) => {
                setMaintenance(v);
                logEvent({
                  actor,
                  action: `Maintenance mode ${v ? "enabled" : "disabled"}`,
                  severity: v ? "warn" : "info"
                });
              }}
            />
          </div>
        </div>
      </Section>

      <Section title="Security">
        <div className="card-premium p-5">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-primary-muted">
            <Shield className="h-3 w-3 text-accent-secondary" />
            Guards
          </div>
          <div className="mt-2 divide-y divide-white/[0.04]">
            <ToggleRow
              label="Prompt-injection guard"
              description="Scrubs known sentinels from user-submitted prompts."
              checked={promptGuard}
              onChange={setPromptGuard}
            />
            <ToggleRow
              label="Admin IP allow-list"
              description="Optional. Only allow /admin traffic from approved IPs."
              checked={ipAllowlist}
              onChange={setIpAllowlist}
            />
            <ToggleRow
              label="Region lock — Iraq-first"
              description="Applies geo routing for Iraqi dialect audiences."
              checked={regionLockIq}
              onChange={setRegionLockIq}
            />
          </div>
        </div>
      </Section>

      <Section title="Danger zone">
        <div className="card-premium p-5">
          <div className="flex items-start gap-3">
            <RefreshCcw className="mt-1 h-4 w-4 text-red-300" />
            <div className="flex-1">
              <div className="text-[14px] font-medium text-primary">
                Reset content to seed defaults
              </div>
              <div className="mt-1 text-[12.5px] text-primary/60">
                Restores the bundled sample prompts, tools, articles, ads, and theme tokens. This
                clears any admin edits held in this browser.
              </div>
            </div>
            <button
              onClick={() => {
                reset();
                logEvent({ actor, action: "Reset content to seed defaults", severity: "warn" });
                toast({ title: "Content reset to defaults", tone: "warn" });
              }}
              className="h-10 rounded-full border border-red-400/30 bg-red-500/10 px-4 text-[12.5px] font-medium text-red-200 hover:bg-red-500/15"
            >
              Reset everything
            </button>
          </div>
        </div>
      </Section>
    </div>
  );
}
