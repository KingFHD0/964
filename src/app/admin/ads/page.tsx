"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BarChart3,
  ExternalLink,
  Eye,
  MousePointerClick,
  Pause,
  Pencil,
  Play,
  Plus,
  Trash2
} from "lucide-react";
import {
  DataTable,
  Field,
  KpiCard,
  Modal,
  PageHeader,
  Section,
  Select,
  StatusDot,
  TextArea,
  TextInput,
  Toolbar,
  ToggleRow,
  type Column
} from "@/components/admin/primitives";
import { Badge } from "@/components/ui/Badge";
import {
  useContentStore,
  type Ad,
  type AdKind,
  type AdPlacement
} from "@/lib/store/content-store";
import { useAdminAuth } from "@/lib/store/admin-auth";
import { toast } from "@/components/ui/Toaster";
import { sanitizeText, sanitizeUrl } from "@/lib/security/sanitize";
import { ImageUploader } from "@/components/admin/ImageUploader";

/**
 * Advertisements admin — premium sponsorship management.
 * Edits flow through the content store; /admin/ads is the only mutation surface.
 */
const PLACEMENTS: { id: AdPlacement; label: string; description: string }[] = [
  { id: "landing-hero", label: "Landing — hero", description: "Just below the hero search." },
  { id: "landing-mid", label: "Landing — mid", description: "Between Ecosystem and Features." },
  { id: "dashboard-top", label: "Dashboard — top", description: "Above featured prompts." },
  { id: "tools-inline", label: "Tools — inline", description: "In the tools directory grid." },
  { id: "encyclopedia-aside", label: "Encyclopedia — aside", description: "Below the TOC." },
  { id: "news-inline", label: "News — inline", description: "Between stories." },
  { id: "community-aside", label: "Community — aside", description: "Right rail on /community." }
];

const KINDS: { id: AdKind; label: string }[] = [
  { id: "sponsor-card", label: "Sponsor card" },
  { id: "banner", label: "Banner" },
  { id: "native-article", label: "Native article" },
  { id: "featured", label: "Featured" }
];

export default function AdminAdsPage() {
  const ads = useContentStore((s) => s.ads);
  const upsert = useContentStore((s) => s.upsertAd);
  const remove = useContentStore((s) => s.removeAd);
  const logEvent = useContentStore((s) => s.logEvent);
  const actor = useAdminAuth((s) => s.session?.name ?? "system");

  const [query, setQuery] = React.useState("");
  const [placement, setPlacement] = React.useState<string>("All");
  const [editing, setEditing] = React.useState<Ad | null>(null);
  const [creating, setCreating] = React.useState(false);
  const [confirming, setConfirming] = React.useState<Ad | null>(null);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return ads.filter((a) => {
      if (placement !== "All" && a.placement !== placement) return false;
      if (!q) return true;
      return [a.title, a.body, a.sponsor, a.placement].some((v) => v.toLowerCase().includes(q));
    });
  }, [ads, query, placement]);

  const impressions = ads.reduce((s, a) => s + a.impressions, 0);
  const clicks = ads.reduce((s, a) => s + a.clicks, 0);
  const ctr = impressions === 0 ? 0 : (clicks / impressions) * 100;
  const active = ads.filter((a) => a.enabled).length;

  const columns: Column<Ad>[] = [
    {
      key: "title",
      label: "Ad",
      render: (a) => (
        <div className="flex items-center gap-3">
          <div
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-[10px] font-medium text-white"
            style={{
              background: `linear-gradient(135deg, ${a.accent[0]}, ${a.accent[1]})`
            }}
          >
            {a.sponsor.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="truncate font-medium text-primary">{a.title}</span>
              <Badge tone="mute">{a.kind}</Badge>
            </div>
            <div className="mt-0.5 truncate text-[12px] text-primary/60">{a.sponsor}</div>
          </div>
        </div>
      )
    },
    { key: "placement", label: "Placement", render: (a) => <Badge tone="secondary">{a.placement}</Badge> },
    {
      key: "impressions",
      label: "Imp",
      align: "right",
      render: (a) => <span className="font-mono text-primary/85">{a.impressions.toLocaleString()}</span>
    },
    {
      key: "clicks",
      label: "Clicks",
      align: "right",
      render: (a) => <span className="font-mono text-primary/85">{a.clicks.toLocaleString()}</span>
    },
    {
      key: "ctr",
      label: "CTR",
      align: "right",
      render: (a) => (
        <span className="font-mono text-accent-secondary">
          {a.impressions === 0 ? "—" : ((a.clicks / a.impressions) * 100).toFixed(2) + "%"}
        </span>
      )
    },
    {
      key: "enabled",
      label: "Status",
      render: (a) => (
        <StatusDot tone={a.enabled ? "ok" : "warn"}>{a.enabled ? "live" : "paused"}</StatusDot>
      )
    },
    {
      key: "actions",
      label: "",
      align: "right",
      render: (a) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              upsert({ ...a, enabled: !a.enabled });
              logEvent({
                actor,
                action: `${a.enabled ? "Paused" : "Resumed"} ad: ${a.title}`,
                severity: "info"
              });
              toast({ title: a.enabled ? "Ad paused" : "Ad resumed", tone: "success" });
            }}
            title={a.enabled ? "Pause" : "Resume"}
            className="focus-ring grid h-8 w-8 place-items-center rounded-full border border-white/[0.06] bg-white/[0.02] text-primary/80 hover:border-white/[0.14] hover:text-primary"
          >
            {a.enabled ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          </button>
          <a
            href={a.ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            title="Open destination"
            onClick={(e) => e.stopPropagation()}
            className="focus-ring grid h-8 w-8 place-items-center rounded-full border border-white/[0.06] bg-white/[0.02] text-primary/80 hover:border-white/[0.14] hover:text-primary"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditing(a);
            }}
            title="Edit"
            className="focus-ring grid h-8 w-8 place-items-center rounded-full border border-white/[0.06] bg-white/[0.02] text-primary/80 hover:border-white/[0.14] hover:text-primary"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setConfirming(a);
            }}
            title="Delete"
            className="focus-ring grid h-8 w-8 place-items-center rounded-full border border-white/[0.06] bg-white/[0.02] text-primary/80 hover:border-red-400/30 hover:text-red-300"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
      <PageHeader
        eyebrow="Growth · Advertising"
        title="Advertisements"
        description="A premium sponsorship layer — placed, measured, and controlled from one calm surface."
        actions={
          <>
            <Link
              href="/"
              target="_blank"
              className="focus-ring inline-flex h-10 items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 text-[12.5px] text-primary/85 hover:border-white/[0.14]"
            >
              <Eye className="h-3.5 w-3.5" />
              View placements
              <ArrowUpRight className="h-3 w-3" />
            </Link>
            <button
              onClick={() => setCreating(true)}
              className="focus-ring inline-flex h-10 items-center gap-2 rounded-full bg-grad-cta px-4 text-[13px] font-medium text-white shadow-[0_8px_24px_-10px_rgba(124,140,255,0.6)] hover:brightness-110"
            >
              <Plus className="h-3.5 w-3.5" />
              New ad
            </button>
          </>
        }
      />

      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard icon={Eye} label="Impressions" value={impressions.toLocaleString()} delta={{ value: "+12%", positive: true }} />
        <KpiCard icon={MousePointerClick} label="Clicks" value={clicks.toLocaleString()} tone="secondary" />
        <KpiCard icon={BarChart3} label="CTR" value={`${ctr.toFixed(2)}%`} delta={{ value: "+0.3pp", positive: true }} />
        <KpiCard icon={Play} label="Active" value={`${active}/${ads.length}`} tone="mute" />
      </div>

      <Section title="Campaigns">
        <Toolbar search={query} onSearch={setQuery} placeholder="Search by title, sponsor, or placement…">
          <Select value={placement} onChange={(e) => setPlacement(e.target.value)}>
            <option value="All">All placements</option>
            {PLACEMENTS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </Select>
        </Toolbar>
        <div className="mt-5">
          <DataTable columns={columns} rows={filtered} onRowClick={(a) => setEditing(a)} />
        </div>
      </Section>

      <AdEditor
        open={creating || !!editing}
        mode={creating ? "create" : "edit"}
        initial={editing ?? undefined}
        onClose={() => {
          setCreating(false);
          setEditing(null);
        }}
        onSubmit={(a) => {
          const clean: Ad = {
            ...a,
            title: sanitizeText(a.title, 120),
            body: sanitizeText(a.body, 320),
            sponsor: sanitizeText(a.sponsor, 60),
            ctaLabel: sanitizeText(a.ctaLabel, 40),
            ctaHref: sanitizeUrl(a.ctaHref) || "#"
          };
          upsert(clean);
          logEvent({
            actor,
            action: `${creating ? "Created" : "Updated"} ad: ${clean.title}`,
            severity: "info"
          });
          toast({ title: creating ? "Ad created" : "Ad updated", tone: "success" });
          setCreating(false);
          setEditing(null);
        }}
      />

      <Modal
        open={!!confirming}
        onClose={() => setConfirming(null)}
        title="Delete this ad?"
        footer={
          <>
            <button
              onClick={() => setConfirming(null)}
              className="h-10 rounded-full border border-white/[0.08] bg-transparent px-5 text-[13px] text-primary-muted hover:text-primary"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (!confirming) return;
                remove(confirming.id);
                logEvent({ actor, action: `Deleted ad: ${confirming.title}`, severity: "warn" });
                toast({ title: "Ad deleted", tone: "warn" });
                setConfirming(null);
              }}
              className="h-10 rounded-full bg-red-500/15 px-5 text-[13px] font-medium text-red-200 hover:bg-red-500/25"
            >
              Delete
            </button>
          </>
        }
      >
        <div className="text-[13px] text-primary/70">
          <span className="font-medium text-primary">{confirming?.title}</span>
        </div>
      </Modal>
    </div>
  );
}

function AdEditor({
  open,
  mode,
  initial,
  onClose,
  onSubmit
}: {
  open: boolean;
  mode: "create" | "edit";
  initial?: Ad;
  onClose: () => void;
  onSubmit: (a: Ad) => void;
}) {
  const empty: Ad = {
    id: `ad-${Date.now().toString(36)}`,
    kind: "sponsor-card",
    placement: "landing-mid",
    title: "",
    body: "",
    ctaLabel: "Learn more",
    ctaHref: "https://",
    sponsor: "",
    accent: ["#7C8CFF", "#5CE1E6"],
    enabled: true,
    impressions: 0,
    clicks: 0
  };
  const [a, setA] = React.useState<Ad>(empty);
  React.useEffect(() => {
    if (!open) return;
    setA(initial ? { ...initial } : { ...empty, id: `ad-${Date.now().toString(36)}` });
  }, [open, initial]); // eslint-disable-line react-hooks/exhaustive-deps

  function patch<K extends keyof Ad>(k: K, v: Ad[K]) {
    setA((prev) => ({ ...prev, [k]: v }));
  }

  const canSave =
    a.title.length >= 4 && a.body.length >= 10 && a.sponsor.length >= 2;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === "create" ? "New advertisement" : "Edit advertisement"}
      description="Sponsorship that respects the platform's calm."
      size="lg"
      footer={
        <>
          <button
            onClick={onClose}
            className="h-10 rounded-full border border-white/[0.08] bg-transparent px-5 text-[13px] text-primary-muted hover:text-primary"
          >
            Cancel
          </button>
          <button
            disabled={!canSave}
            onClick={() => onSubmit(a)}
            className={
              "h-10 rounded-full px-5 text-[13px] font-medium " +
              (canSave
                ? "bg-grad-cta text-white shadow-[0_8px_24px_-10px_rgba(124,140,255,0.6)] hover:brightness-110"
                : "cursor-not-allowed bg-white/[0.05] text-primary-muted")
            }
          >
            {mode === "create" ? "Create" : "Save"}
          </button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_300px]">
        <div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Sponsor">
              <TextInput value={a.sponsor} onChange={(e) => patch("sponsor", e.target.value)} />
            </Field>
            <Field label="Kind">
              <Select value={a.kind} onChange={(e) => patch("kind", e.target.value as AdKind)}>
                {KINDS.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.label}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <div className="mt-4">
            <Field label="Title" hint={`${a.title.length}/120`}>
              <TextInput value={a.title} onChange={(e) => patch("title", e.target.value)} />
            </Field>
          </div>

          <div className="mt-4">
            <Field label="Body" hint={`${a.body.length}/320`}>
              <TextArea rows={4} value={a.body} onChange={(e) => patch("body", e.target.value)} />
            </Field>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="CTA label">
              <TextInput value={a.ctaLabel} onChange={(e) => patch("ctaLabel", e.target.value)} />
            </Field>
            <Field label="CTA URL">
              <TextInput value={a.ctaHref} onChange={(e) => patch("ctaHref", e.target.value)} />
            </Field>
          </div>

          <div className="mt-4">
            <Field label="Placement">
              <Select
                value={a.placement}
                onChange={(e) => patch("placement", e.target.value as AdPlacement)}
              >
                {PLACEMENTS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </Select>
            </Field>
            <div className="mt-2 text-[11.5px] text-primary-muted">
              {PLACEMENTS.find((p) => p.id === a.placement)?.description}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Accent — start">
              <div className="flex h-11 items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-3">
                <input
                  type="color"
                  value={a.accent[0]}
                  onChange={(e) =>
                    patch("accent", [e.target.value, a.accent[1]] as [string, string])
                  }
                  className="h-7 w-12 cursor-pointer rounded-md border border-white/[0.1] bg-transparent"
                />
                <span className="font-mono text-[12.5px] text-primary/80">{a.accent[0]}</span>
              </div>
            </Field>
            <Field label="Accent — end">
              <div className="flex h-11 items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-3">
                <input
                  type="color"
                  value={a.accent[1]}
                  onChange={(e) =>
                    patch("accent", [a.accent[0], e.target.value] as [string, string])
                  }
                  className="h-7 w-12 cursor-pointer rounded-md border border-white/[0.1] bg-transparent"
                />
                <span className="font-mono text-[12.5px] text-primary/80">{a.accent[1]}</span>
              </div>
            </Field>
          </div>

          {/* Ad image */}
          <div className="mt-4">
            <ImageUploader
              value={a.imageUrl}
              onChange={(url) => patch("imageUrl", url)}
              label="Ad image / banner"
              hint="Optional — shown above the ad title"
            />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Start date (optional)">
              <TextInput
                placeholder="2026-05-10"
                value={a.startDate ?? ""}
                onChange={(e) => patch("startDate", e.target.value || undefined)}
              />
            </Field>
            <Field label="End date (optional)">
              <TextInput
                placeholder="2026-06-10"
                value={a.endDate ?? ""}
                onChange={(e) => patch("endDate", e.target.value || undefined)}
              />
            </Field>
          </div>

          <div className="mt-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-5">
            <ToggleRow
              label="Enabled"
              description="When off, the ad is never rendered on the public site."
              checked={a.enabled}
              onChange={(v) => patch("enabled", v)}
            />
          </div>
        </div>

        {/* Live preview */}
        <div>
          <div className="text-[10.5px] uppercase tracking-[0.2em] text-primary-muted/80">Preview</div>
          <div className="mt-3 card-premium overflow-hidden p-5">
            <div
              aria-hidden
              className="pointer-events-none -mx-5 -mt-5 h-16"
              style={{
                background: `linear-gradient(135deg, ${a.accent[0]}44, ${a.accent[1]}22 60%, transparent)`
              }}
            />
            <div className="flex items-center gap-2 text-[10.5px] uppercase tracking-[0.22em] text-primary-muted">
              <Sparkle /> Sponsored · {a.sponsor || "Partner"}
            </div>
            <div className="mt-3 font-display text-[16px] font-medium tracking-tight text-primary">
              {a.title || "Ad title"}
            </div>
            <div className="mt-1 line-clamp-3 text-[12.5px] leading-relaxed text-primary/65">
              {a.body || "The body preview shows here — keep it calm and specific."}
            </div>
            <div
              className="mt-4 inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-[12.5px] font-medium text-white"
              style={{
                background: `linear-gradient(135deg, ${a.accent[0]}, ${a.accent[1]})`,
                boxShadow: `0 8px 24px -10px ${a.accent[0]}80`
              }}
            >
              {a.ctaLabel || "Learn more"}
            </div>
          </div>
          <div className="mt-3 text-[11.5px] text-primary-muted">
            Placement · <span className="text-primary/85">{a.placement}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
}

function Sparkle() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden className="text-accent-secondary">
      <path
        d="M12 2l2.5 6.5L21 11l-6.5 2.5L12 20l-2.5-6.5L3 11l6.5-2.5L12 2z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}
