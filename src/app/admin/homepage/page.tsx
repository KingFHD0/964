"use client";

import * as React from "react";
import { ArrowUpRight, ChevronDown, ChevronUp, Eye, Plus, Sparkles, Trash2 } from "lucide-react";
import {
  Field,
  PageHeader,
  Section,
  Select,
  StatusDot,
  TextArea,
  TextInput,
  ToggleRow
} from "@/components/admin/primitives";
import { useContentStore, type HomepageBlock, type HomepageBlockKind } from "@/lib/store/content-store";
import { useAdminAuth } from "@/lib/store/admin-auth";
import { toast } from "@/components/ui/Toaster";
import { sanitizeText, sanitizeUrl } from "@/lib/security/sanitize";
import Link from "next/link";

/**
 * Homepage editor — Framer/Webflow-esque but calmer.
 * Admins can rearrange sections, toggle them, and edit the hero copy live.
 * Changes go straight to the content store → the public Landing reads from it.
 */

const BLOCK_LABELS: Record<HomepageBlockKind, string> = {
  hero: "Hero",
  ecosystem: "Ecosystem showcase",
  features: "Features",
  categories: "Library showcase",
  pricing: "Pricing",
  cta: "Final CTA",
  sponsor: "Sponsor block"
};

export default function AdminHomepagePage() {
  const homepage = useContentStore((s) => s.homepage);
  const setHomepage = useContentStore((s) => s.setHomepage);
  const setBlocks = useContentStore((s) => s.setHomepageBlocks);
  const logEvent = useContentStore((s) => s.logEvent);
  const actor = useAdminAuth((s) => s.session?.name ?? "system");

  function saveHero(patch: Partial<typeof homepage>) {
    setHomepage(patch);
    logEvent({ actor, action: `Updated homepage hero copy`, severity: "info" });
    toast({ title: "Homepage saved", tone: "success" });
  }

  function moveBlock(id: string, direction: -1 | 1) {
    const idx = homepage.blocks.findIndex((b) => b.id === id);
    if (idx === -1) return;
    const nextIdx = idx + direction;
    if (nextIdx < 0 || nextIdx >= homepage.blocks.length) return;
    const copy = homepage.blocks.slice();
    const [m] = copy.splice(idx, 1);
    copy.splice(nextIdx, 0, m);
    setBlocks(copy);
    logEvent({ actor, action: `Reordered homepage block: ${m.kind}`, severity: "info" });
  }

  function toggleBlock(id: string) {
    const copy = homepage.blocks.map((b) => (b.id === id ? { ...b, enabled: !b.enabled } : b));
    setBlocks(copy);
    const b = homepage.blocks.find((x) => x.id === id);
    logEvent({
      actor,
      action: `${b?.enabled ? "Hid" : "Showed"} homepage block: ${b?.kind}`,
      severity: "info"
    });
  }

  function removeBlock(id: string) {
    const copy = homepage.blocks.filter((b) => b.id !== id);
    setBlocks(copy);
    toast({ title: "Block removed", tone: "warn" });
  }

  function addBlock(kind: HomepageBlockKind) {
    const id = `b-${Date.now().toString(36)}`;
    const block: HomepageBlock = {
      id,
      kind,
      enabled: true,
      title: kind === "sponsor" ? "Featured partner" : undefined
    };
    setBlocks([...homepage.blocks, block]);
    logEvent({ actor, action: `Added homepage block: ${kind}`, severity: "info" });
    toast({ title: `Block added · ${BLOCK_LABELS[kind]}`, tone: "success" });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
      <PageHeader
        eyebrow="Growth · Homepage"
        title="Homepage editor"
        description="Rearrange sections, edit the hero, and ship changes instantly."
        actions={
          <>
            <Link
              href="/"
              target="_blank"
              className="focus-ring inline-flex h-10 items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 text-[12.5px] text-primary/85 hover:border-white/[0.14]"
            >
              <Eye className="h-3.5 w-3.5" />
              Preview live
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </>
        }
      />

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
        {/* LEFT: Hero + Stats editor */}
        <div className="space-y-6">
          <HeroEditor homepage={homepage} onSave={saveHero} />

          <StatsEditor
            stats={homepage.stats}
            onChange={(stats) => setHomepage({ stats })}
          />
        </div>

        {/* RIGHT: Sections rail */}
        <div className="space-y-4">
          <div className="card-premium p-5">
            <div className="flex items-center justify-between">
              <div className="text-[11px] uppercase tracking-[0.2em] text-primary-muted">
                Sections
              </div>
              <StatusDot tone="ok">Live</StatusDot>
            </div>
            <p className="mt-2 text-[12.5px] text-primary/60">
              Drag-style ordering with up/down controls. Hidden sections are simply skipped on the
              public site.
            </p>

            <ul className="mt-5 space-y-2">
              {homepage.blocks.map((b, i) => (
                <li
                  key={b.id}
                  className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5"
                >
                  <div className="flex h-7 w-10 shrink-0 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.03] text-[10.5px] font-mono text-primary/70">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-[13px] text-primary/90">
                        {BLOCK_LABELS[b.kind]}
                      </span>
                      {!b.enabled ? (
                        <span className="rounded-full border border-amber-400/25 bg-amber-500/10 px-1.5 py-0.5 text-[9.5px] font-medium uppercase tracking-[0.14em] text-amber-300">
                          hidden
                        </span>
                      ) : null}
                    </div>
                    {b.title ? (
                      <div className="truncate text-[11.5px] text-primary-muted">{b.title}</div>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-0.5">
                    <IconBtn onClick={() => moveBlock(b.id, -1)} title="Move up">
                      <ChevronUp className="h-3.5 w-3.5" />
                    </IconBtn>
                    <IconBtn onClick={() => moveBlock(b.id, 1)} title="Move down">
                      <ChevronDown className="h-3.5 w-3.5" />
                    </IconBtn>
                    <IconBtn
                      onClick={() => toggleBlock(b.id)}
                      title={b.enabled ? "Hide" : "Show"}
                      tone={b.enabled ? undefined : "accent"}
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </IconBtn>
                    <IconBtn onClick={() => removeBlock(b.id)} title="Remove" tone="danger">
                      <Trash2 className="h-3.5 w-3.5" />
                    </IconBtn>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex items-center gap-2">
              <Select id="add-block" defaultValue="sponsor" className="!h-10">
                {(
                  Object.keys(BLOCK_LABELS) as HomepageBlockKind[]
                ).map((k) => (
                  <option key={k} value={k}>
                    {BLOCK_LABELS[k]}
                  </option>
                ))}
              </Select>
              <button
                onClick={() => {
                  const sel = document.getElementById("add-block") as HTMLSelectElement | null;
                  addBlock((sel?.value ?? "sponsor") as HomepageBlockKind);
                }}
                className="focus-ring inline-flex h-10 items-center gap-1.5 rounded-full bg-grad-cta px-4 text-[12.5px] font-medium text-white shadow-[0_8px_24px_-10px_rgba(124,140,255,0.55)] hover:brightness-110"
              >
                <Plus className="h-3.5 w-3.5" />
                Add
              </button>
            </div>
          </div>

          <div className="card-premium p-5">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-primary-muted">
              <Sparkles className="h-3 w-3 text-accent-secondary" />
              CTA buttons
            </div>
            <div className="mt-4 space-y-3">
              <CtaRow
                label="Primary"
                cta={homepage.primaryCta}
                onChange={(v) => setHomepage({ primaryCta: v })}
              />
              <CtaRow
                label="Secondary"
                cta={homepage.secondaryCta}
                onChange={(v) => setHomepage({ secondaryCta: v })}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────── Hero editor ───────── */

function HeroEditor({
  homepage,
  onSave
}: {
  homepage: ReturnType<typeof useContentStore.getState>["homepage"];
  onSave: (patch: Partial<ReturnType<typeof useContentStore.getState>["homepage"]>) => void;
}) {
  const [label, setLabel] = React.useState(homepage.heroLabel);
  const [a, setA] = React.useState(homepage.heroTitleA);
  const [b, setB] = React.useState(homepage.heroTitleB);
  const [sub, setSub] = React.useState(homepage.heroSubtitle);

  const dirty =
    label !== homepage.heroLabel ||
    a !== homepage.heroTitleA ||
    b !== homepage.heroTitleB ||
    sub !== homepage.heroSubtitle;

  return (
    <Section title="Hero" description="The first thing every visitor reads.">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Eyebrow label" hint="Small caps above title">
          <TextInput value={label} onChange={(e) => setLabel(e.target.value)} />
        </Field>
        <Field label="Title — line A">
          <TextInput value={a} onChange={(e) => setA(e.target.value)} />
        </Field>
        <Field label="Title — line B" hint="Accent line">
          <TextInput value={b} onChange={(e) => setB(e.target.value)} />
        </Field>
        <div className="md:col-span-1" />
      </div>
      <div className="mt-4">
        <Field label="Subtitle">
          <TextArea rows={3} value={sub} onChange={(e) => setSub(e.target.value)} />
        </Field>
      </div>

      {/* Preview */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-white/[0.06] bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] p-8 text-center">
        <div className="inline-block rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-[10.5px] uppercase tracking-[0.2em] text-primary/70">
          {label || "Eyebrow"}
        </div>
        <h1 className="mt-4 font-display text-[36px] font-medium leading-[1.05] tracking-tight md:text-[48px]">
          <span className="text-grad">{a || "Line A"}</span>
          <br />
          <span className="text-grad-accent">{b || "Line B"}</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-[14px] leading-relaxed text-primary/65">
          {sub || "Subtitle goes here."}
        </p>
      </div>

      <div className="mt-5 flex justify-end gap-2">
        <button
          disabled={!dirty}
          onClick={() => {
            setLabel(homepage.heroLabel);
            setA(homepage.heroTitleA);
            setB(homepage.heroTitleB);
            setSub(homepage.heroSubtitle);
          }}
          className={
            "h-10 rounded-full border border-white/[0.08] bg-transparent px-5 text-[13px] " +
            (dirty ? "text-primary-muted hover:text-primary" : "cursor-not-allowed text-primary-muted/40")
          }
        >
          Discard
        </button>
        <button
          disabled={!dirty}
          onClick={() =>
            onSave({
              heroLabel: sanitizeText(label, 80),
              heroTitleA: sanitizeText(a, 80),
              heroTitleB: sanitizeText(b, 80),
              heroSubtitle: sanitizeText(sub, 400)
            })
          }
          className={
            "h-10 rounded-full px-5 text-[13px] font-medium " +
            (dirty
              ? "bg-grad-cta text-white shadow-[0_8px_24px_-10px_rgba(124,140,255,0.6)] hover:brightness-110"
              : "cursor-not-allowed bg-white/[0.05] text-primary-muted")
          }
        >
          Save hero
        </button>
      </div>
    </Section>
  );
}

/* ───────── Stats editor ───────── */

function StatsEditor({
  stats,
  onChange
}: {
  stats: string[];
  onChange: (stats: string[]) => void;
}) {
  const [draft, setDraft] = React.useState(stats.join(" · "));
  const dirty = draft !== stats.join(" · ");
  return (
    <Section title="Stats strip" description="Shown at the bottom of the hero.">
      <Field label="Labels · separate with '·'">
        <TextInput value={draft} onChange={(e) => setDraft(e.target.value)} />
      </Field>
      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-5 py-3 text-[11px] uppercase tracking-[0.22em] text-primary-muted/70">
        {draft
          .split("·")
          .map((s) => s.trim())
          .filter(Boolean)
          .map((s, i, arr) => (
            <React.Fragment key={s + i}>
              <span>{s}</span>
              {i < arr.length - 1 ? <span className="h-1 w-1 rounded-full bg-white/20" /> : null}
            </React.Fragment>
          ))}
      </div>
      <div className="mt-4 flex justify-end">
        <button
          disabled={!dirty}
          onClick={() =>
            onChange(
              draft
                .split("·")
                .map((s) => sanitizeText(s, 50))
                .filter(Boolean)
            )
          }
          className={
            "h-10 rounded-full px-5 text-[13px] font-medium " +
            (dirty
              ? "bg-grad-cta text-white shadow-[0_8px_24px_-10px_rgba(124,140,255,0.6)] hover:brightness-110"
              : "cursor-not-allowed bg-white/[0.05] text-primary-muted")
          }
        >
          Save strip
        </button>
      </div>
    </Section>
  );
}

/* ───────── CTA row ───────── */

function CtaRow({
  label,
  cta,
  onChange
}: {
  label: string;
  cta: { label: string; href: string };
  onChange: (v: { label: string; href: string }) => void;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
      <div className="text-[10.5px] uppercase tracking-[0.2em] text-primary-muted">{label}</div>
      <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-[1fr_1fr]">
        <TextInput
          value={cta.label}
          onChange={(e) =>
            onChange({ label: sanitizeText(e.target.value, 60), href: cta.href })
          }
          placeholder="Button label"
          className="!h-10 !text-[13px]"
        />
        <TextInput
          value={cta.href}
          onChange={(e) => onChange({ label: cta.label, href: sanitizeUrl(e.target.value) || cta.href })}
          placeholder="/ or https://"
          className="!h-10 !text-[13px] font-mono"
        />
      </div>
    </div>
  );
}

/* ───────── IconBtn ───────── */

function IconBtn({
  onClick,
  title,
  children,
  tone
}: {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
  tone?: "danger" | "accent";
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={
        "focus-ring grid h-7 w-7 place-items-center rounded-full border border-white/[0.06] bg-white/[0.02] text-primary/80 transition-colors hover:border-white/[0.14] hover:text-primary " +
        (tone === "danger" ? "hover:border-red-400/30 hover:text-red-300 " : "") +
        (tone === "accent" ? "text-accent " : "")
      }
    >
      {children}
    </button>
  );
}
