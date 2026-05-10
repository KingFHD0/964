"use client";

import * as React from "react";
import {
  Check,
  Globe2,
  Palette,
  Play,
  RotateCcw,
  Sparkles,
  Wand2
} from "lucide-react";
import {
  Field,
  PageHeader,
  Section,
  ToggleRow
} from "@/components/admin/primitives";
import { useContentStore, type ThemeSettings } from "@/lib/store/content-store";
import { useAdminAuth } from "@/lib/store/admin-auth";
import { toast } from "@/components/ui/Toaster";

/**
 * Theme / visual customization — live.
 * Every change writes to the store; ThemeSync reflects CSS vars immediately.
 */
export default function AdminThemePage() {
  const theme = useContentStore((s) => s.theme);
  const setTheme = useContentStore((s) => s.setTheme);
  const logEvent = useContentStore((s) => s.logEvent);
  const actor = useAdminAuth((s) => s.session?.name ?? "system");

  function patch<K extends keyof ThemeSettings>(k: K, v: ThemeSettings[K]) {
    setTheme({ [k]: v } as any);
    logEvent({ actor, action: `Theme · ${String(k)} → ${String(v)}`, severity: "info" });
  }

  const palettes: [string, string, string][] = [
    ["Aether default", "#7C8CFF", "#5CE1E6"],
    ["Coral dawn", "#FF6B8A", "#7C8CFF"],
    ["Solar dust", "#F59E0B", "#7C8CFF"],
    ["Deep teal", "#3BC9D5", "#7C8CFF"],
    ["Neon lavender", "#B388FF", "#5CE1E6"],
    ["Ember", "#F97316", "#EC4899"]
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
      <PageHeader
        eyebrow="Customization · Theme"
        title="Theme"
        description="Live visual customization. Every change ripples through the platform instantly."
        actions={
          <button
            onClick={() => {
              setTheme({
                accent: "#7C8CFF",
                accentSecondary: "#5CE1E6",
                blurIntensity: 22,
                glowIntensity: 0.6,
                particles: true,
                earth: false,
                motion: true,
                grainOpacity: 0.04
              });
              logEvent({ actor, action: "Reset theme to defaults", severity: "info" });
              toast({ title: "Theme reset", tone: "success" });
            }}
            className="focus-ring inline-flex h-10 items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 text-[12.5px] text-primary/85 hover:border-white/[0.14]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        }
      />

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          {/* Palette */}
          <Section title="Accent palette">
            <div className="card-premium p-5">
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {palettes.map((p) => {
                  const active = theme.accent === p[1] && theme.accentSecondary === p[2];
                  return (
                    <button
                      key={p[0]}
                      onClick={() => {
                        setTheme({ accent: p[1], accentSecondary: p[2] });
                        logEvent({ actor, action: `Set palette: ${p[0]}`, severity: "info" });
                      }}
                      className={
                        "group relative flex items-center gap-3 rounded-2xl border p-3 text-left transition-all " +
                        (active
                          ? "border-accent/40 bg-white/[0.05]"
                          : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]")
                      }
                    >
                      <div
                        className="h-10 w-10 shrink-0 rounded-xl"
                        style={{ background: `linear-gradient(135deg, ${p[1]}, ${p[2]})` }}
                      />
                      <div className="min-w-0">
                        <div className="text-[13px] text-primary">{p[0]}</div>
                        <div className="mt-0.5 flex items-center gap-2 font-mono text-[11px] text-primary-muted">
                          {p[1]} · {p[2]}
                        </div>
                      </div>
                      {active ? (
                        <Check className="absolute right-3 top-3 h-3.5 w-3.5 text-accent" />
                      ) : null}
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Accent" hint="Primary">
                  <ColorInput
                    value={theme.accent}
                    onChange={(v) => patch("accent", v)}
                  />
                </Field>
                <Field label="Accent · secondary">
                  <ColorInput
                    value={theme.accentSecondary}
                    onChange={(v) => patch("accentSecondary", v)}
                  />
                </Field>
              </div>
            </div>
          </Section>

          {/* Effects */}
          <Section title="Atmosphere">
            <div className="card-premium p-5">
              <RangeRow
                label="Blur intensity"
                description="Controls glass surfaces."
                min={6}
                max={40}
                value={theme.blurIntensity}
                suffix="px"
                onChange={(v) => patch("blurIntensity", v)}
              />
              <div className="hairline" />
              <RangeRow
                label="Glow intensity"
                description="Strength of accent halos."
                min={0}
                max={1}
                step={0.05}
                value={theme.glowIntensity}
                onChange={(v) => patch("glowIntensity", v)}
              />
              <div className="hairline" />
              <RangeRow
                label="Film grain"
                description="Very light film texture on backgrounds."
                min={0}
                max={0.1}
                step={0.005}
                value={theme.grainOpacity}
                onChange={(v) => patch("grainOpacity", v)}
              />
              <div className="hairline" />
              <ToggleRow
                label="Particles"
                description="Tiny animated dust drift."
                checked={theme.particles}
                onChange={(v) => patch("particles", v)}
              />
              <div className="hairline" />
              <ToggleRow
                label="Earth visualization"
                description="Subtle rotating globe in the admin backdrop."
                checked={theme.earth}
                onChange={(v) => patch("earth", v)}
              />
              <div className="hairline" />
              <ToggleRow
                label="Motion"
                description="Enables transitions and animated gradients globally."
                checked={theme.motion}
                onChange={(v) => patch("motion", v)}
              />
            </div>
          </Section>
        </div>

        {/* Preview rail */}
        <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="card-premium relative overflow-hidden p-5">
            <div className="text-[11px] uppercase tracking-[0.2em] text-primary-muted">Preview</div>
            <div className="mt-4 space-y-4">
              <div
                className="overflow-hidden rounded-2xl border border-white/[0.08]"
                style={{
                  background: `linear-gradient(135deg, ${theme.accent}30, ${theme.accentSecondary}10 60%, #0B1020 100%)`,
                  boxShadow: `0 0 ${Math.round(40 * theme.glowIntensity)}px ${theme.accent}40`
                }}
              >
                <div className="p-5">
                  <span className="chip inline-flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3 text-accent-secondary" />
                    Aether 964
                  </span>
                  <div className="mt-3 font-display text-[18px] font-medium tracking-tight text-grad">
                    Create at the speed of light.
                  </div>
                  <div
                    className="mt-4 inline-flex h-9 items-center gap-2 rounded-full px-4 text-[12.5px] font-medium text-white"
                    style={{
                      background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentSecondary})`,
                      boxShadow: `0 8px 24px -10px ${theme.accent}80`
                    }}
                  >
                    <Play className="h-3 w-3" />
                    Primary CTA
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                <div className="text-[10.5px] uppercase tracking-[0.2em] text-primary-muted">
                  Tokens
                </div>
                <dl className="mt-3 grid grid-cols-2 gap-y-1.5 font-mono text-[11.5px]">
                  <dt className="text-primary-muted">accent</dt>
                  <dd className="text-primary">{theme.accent}</dd>
                  <dt className="text-primary-muted">secondary</dt>
                  <dd className="text-primary">{theme.accentSecondary}</dd>
                  <dt className="text-primary-muted">blur</dt>
                  <dd className="text-primary">{theme.blurIntensity}px</dd>
                  <dt className="text-primary-muted">glow</dt>
                  <dd className="text-primary">{theme.glowIntensity.toFixed(2)}</dd>
                </dl>
              </div>

              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 text-[12px] text-primary/70">
                <Wand2 className="mr-1 inline h-3 w-3 text-accent-secondary" />
                Changes apply instantly across the platform and are persisted in your browser. Wire
                the store to your backend to ship globally.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ColorInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex h-11 items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-3">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-7 w-12 cursor-pointer rounded-md border border-white/[0.1] bg-transparent"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-full flex-1 bg-transparent font-mono text-[13px] text-primary outline-none"
      />
    </div>
  );
}

function RangeRow({
  label,
  description,
  value,
  min,
  max,
  step = 1,
  suffix,
  onChange
}: {
  label: string;
  description?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="py-3">
      <div className="flex items-baseline justify-between">
        <div>
          <div className="text-[14px] text-primary">{label}</div>
          {description ? (
            <div className="text-[12px] text-primary/60">{description}</div>
          ) : null}
        </div>
        <span className="font-mono text-[12.5px] text-primary/80">
          {Number.isInteger(step) ? value : value.toFixed(2)}
          {suffix ?? ""}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 w-full accent-[var(--accent)]"
      />
    </div>
  );
}
