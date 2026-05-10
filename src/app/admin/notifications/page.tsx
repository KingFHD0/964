"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bell,
  BookOpen,
  Calendar,
  ChevronRight,
  Pencil,
  Plus,
  Send,
  Sparkles,
  Trash2,
  Users,
  Wand2
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
  type Column
} from "@/components/admin/primitives";
import { Badge } from "@/components/ui/Badge";
import { useContentStore, type NotificationTemplate } from "@/lib/store/content-store";
import { useAdminAuth } from "@/lib/store/admin-auth";
import { toast } from "@/components/ui/Toaster";
import { sanitizeText } from "@/lib/security/sanitize";

/**
 * Notification center — the push / digest composer.
 * Audience targeting, scheduling, and a live phone-shape preview.
 */
const AUDIENCES: NotificationTemplate["audience"][] = ["all", "supernova", "orbit", "admins"];

const TEMPLATES: { label: string; title: string; body: string; tag: "drop" | "news" | "care" }[] = [
  {
    label: "New prompt drop",
    title: "New drop — {name}",
    body: "A curated pack just landed in your library. Tap to explore.",
    tag: "drop"
  },
  {
    label: "Weekly digest",
    title: "Your weekly Aether digest",
    body: "5 new prompts, 2 new tools, and 1 article curated for your workflow.",
    tag: "news"
  },
  {
    label: "Reactivation nudge",
    title: "We saved your orbit",
    body: "Your favorites are waiting — a quiet nudge from the Aether team.",
    tag: "care"
  },
  {
    label: "Plan milestone",
    title: "Supernova renewed",
    body: "Team seats and pro briefs are ready for the next 30 days.",
    tag: "care"
  }
];

export default function AdminNotificationsPage() {
  const notifications = useContentStore((s) => s.notifications);
  const upsert = useContentStore((s) => s.upsertNotification);
  const remove = useContentStore((s) => s.removeNotification);
  const logEvent = useContentStore((s) => s.logEvent);
  const actor = useAdminAuth((s) => s.session?.name ?? "system");

  const [query, setQuery] = React.useState("");
  const [audience, setAudience] = React.useState<string>("All");
  const [editing, setEditing] = React.useState<NotificationTemplate | null>(null);
  const [creating, setCreating] = React.useState(false);
  const [confirming, setConfirming] = React.useState<NotificationTemplate | null>(null);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return notifications.filter((n) => {
      if (audience !== "All" && n.audience !== audience) return false;
      if (!q) return true;
      return [n.title, n.body, n.audience].some((v) => v.toLowerCase().includes(q));
    });
  }, [notifications, query, audience]);

  const sent = notifications.filter((n) => n.status === "sent").length;
  const scheduled = notifications.filter((n) => n.status === "scheduled").length;
  const drafts = notifications.filter((n) => n.status === "draft").length;
  const totalReach = notifications.reduce((s, n) => s + (n.sentCount ?? 0), 0);

  const columns: Column<NotificationTemplate>[] = [
    {
      key: "title",
      label: "Notification",
      render: (n) => (
        <div className="min-w-0">
          <div className="truncate font-medium text-primary">{n.title}</div>
          <div className="mt-0.5 line-clamp-1 text-[12px] text-primary/60">{n.body}</div>
        </div>
      )
    },
    {
      key: "audience",
      label: "Audience",
      render: (n) => <Badge tone="mute">{n.audience}</Badge>
    },
    {
      key: "status",
      label: "Status",
      render: (n) => (
        <StatusDot
          tone={n.status === "sent" ? "ok" : n.status === "scheduled" ? "info" : "warn"}
        >
          {n.status}
        </StatusDot>
      )
    },
    {
      key: "scheduled",
      label: "When",
      render: (n) => (
        <span className="text-[12px] text-primary-muted">
          {n.scheduled ?? (n.status === "sent" ? "—" : "Not set")}
        </span>
      )
    },
    {
      key: "sentCount",
      label: "Reach",
      align: "right",
      render: (n) => (
        <span className="font-mono text-primary/85">
          {n.sentCount ? n.sentCount.toLocaleString() : "—"}
        </span>
      )
    },
    {
      key: "actions",
      label: "",
      align: "right",
      render: (n) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              const sent: NotificationTemplate = {
                ...n,
                status: "sent",
                sentCount: (n.sentCount ?? 0) + audienceSize(n.audience),
                scheduled: undefined
              };
              upsert(sent);
              logEvent({
                actor,
                action: `Sent notification: ${n.title}`,
                severity: "info"
              });
              toast({ title: "Notification sent", description: n.title, tone: "success" });
            }}
            title="Send now"
            className="focus-ring grid h-8 w-8 place-items-center rounded-full border border-white/[0.06] bg-white/[0.02] text-primary/80 hover:border-accent-secondary/30 hover:text-accent-secondary"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditing(n);
            }}
            title="Edit"
            className="focus-ring grid h-8 w-8 place-items-center rounded-full border border-white/[0.06] bg-white/[0.02] text-primary/80 hover:border-white/[0.14] hover:text-primary"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setConfirming(n);
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
        eyebrow="Growth · Notifications"
        title="Notification center"
        description="Compose, schedule, and dispatch push + email campaigns to the audiences that matter."
        actions={
          <button
            onClick={() => setCreating(true)}
            className="focus-ring inline-flex h-10 items-center gap-2 rounded-full bg-grad-cta px-4 text-[13px] font-medium text-white shadow-[0_8px_24px_-10px_rgba(124,140,255,0.6)] hover:brightness-110"
          >
            <Plus className="h-3.5 w-3.5" />
            New notification
          </button>
        }
      />

      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard icon={Send} label="Sent" value={sent.toString()} />
        <KpiCard icon={Calendar} label="Scheduled" value={scheduled.toString()} tone="secondary" />
        <KpiCard icon={Pencil} label="Drafts" value={drafts.toString()} tone="mute" />
        <KpiCard
          icon={Users}
          label="Total reach"
          value={totalReach.toLocaleString()}
          delta={{ value: "+8%", positive: true, caption: "last 30d" }}
        />
      </div>

      <Section title="Quick templates" description="Start from a curated message. You can edit anything before sending.">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
          {TEMPLATES.map((t) => (
            <button
              key={t.label}
              onClick={() => {
                const draft: NotificationTemplate = {
                  id: `n-tmpl-${Date.now().toString(36)}`,
                  title: t.title,
                  body: t.body,
                  audience: "all",
                  status: "draft"
                };
                setEditing(draft);
              }}
              className="card-premium group p-4 text-left lift ring-accent-hover"
            >
              <div className="flex items-center gap-2 text-[10.5px] uppercase tracking-[0.2em] text-primary-muted">
                <Sparkles className="h-3 w-3 text-accent-secondary" />
                {t.label}
              </div>
              <div className="mt-2 line-clamp-1 font-display text-[14px] font-medium tracking-tight text-primary">
                {t.title}
              </div>
              <div className="mt-1 line-clamp-2 text-[12px] text-primary/60">{t.body}</div>
              <div className="mt-3 inline-flex items-center gap-1 text-[11.5px] text-accent">
                Use template
                <ChevronRight className="h-3 w-3" />
              </div>
            </button>
          ))}
        </div>
      </Section>

      <Section title="All notifications">
        <Toolbar
          search={query}
          onSearch={setQuery}
          placeholder="Search title, body, audience…"
        >
          <Select value={audience} onChange={(e) => setAudience(e.target.value)}>
            <option value="All">All audiences</option>
            {AUDIENCES.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </Select>
        </Toolbar>

        <div className="mt-5">
          <DataTable columns={columns} rows={filtered} onRowClick={(n) => setEditing(n)} />
        </div>
      </Section>

      <NotificationEditor
        open={creating || !!editing}
        mode={creating ? "create" : "edit"}
        initial={editing ?? undefined}
        onClose={() => {
          setCreating(false);
          setEditing(null);
        }}
        onSubmit={(n, action) => {
          const clean: NotificationTemplate = {
            ...n,
            title: sanitizeText(n.title, 120),
            body: sanitizeText(n.body, 360)
          };
          if (action === "send") {
            clean.status = "sent";
            clean.sentCount = (clean.sentCount ?? 0) + audienceSize(clean.audience);
            clean.scheduled = undefined;
          }
          upsert(clean);
          logEvent({
            actor,
            action: `${creating ? "Created" : "Updated"} notification: ${clean.title}${action === "send" ? " (sent)" : ""}`,
            severity: "info"
          });
          toast({
            title:
              action === "send" ? "Notification sent" : creating ? "Draft saved" : "Notification updated",
            tone: "success"
          });
          setCreating(false);
          setEditing(null);
        }}
      />

      <Modal
        open={!!confirming}
        onClose={() => setConfirming(null)}
        title="Delete this notification?"
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
                logEvent({
                  actor,
                  action: `Deleted notification: ${confirming.title}`,
                  severity: "warn"
                });
                toast({ title: "Notification deleted", tone: "warn" });
                setConfirming(null);
              }}
              className="h-10 rounded-full bg-red-500/15 px-5 text-[13px] font-medium text-red-200 hover:bg-red-500/25"
            >
              Delete
            </button>
          </>
        }
      >
        <div className="text-[13px] text-primary/70">{confirming?.title}</div>
      </Modal>
    </div>
  );
}

function audienceSize(a: NotificationTemplate["audience"]) {
  switch (a) {
    case "all":
      return 4214;
    case "supernova":
      return 812;
    case "orbit":
      return 1890;
    case "admins":
      return 6;
  }
}

function NotificationEditor({
  open,
  mode,
  initial,
  onClose,
  onSubmit
}: {
  open: boolean;
  mode: "create" | "edit";
  initial?: NotificationTemplate;
  onClose: () => void;
  onSubmit: (n: NotificationTemplate, action: "save" | "send") => void;
}) {
  const empty: NotificationTemplate = {
    id: `n-tmpl-${Date.now().toString(36)}`,
    title: "",
    body: "",
    audience: "all",
    status: "draft"
  };
  const [n, setN] = React.useState<NotificationTemplate>(empty);
  React.useEffect(() => {
    if (!open) return;
    setN(initial ? { ...initial } : { ...empty, id: `n-tmpl-${Date.now().toString(36)}` });
  }, [open, initial]); // eslint-disable-line react-hooks/exhaustive-deps

  function patch<K extends keyof NotificationTemplate>(k: K, v: NotificationTemplate[K]) {
    setN((prev) => ({ ...prev, [k]: v }));
  }

  const canSend = n.title.length >= 3 && n.body.length >= 5;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === "create" ? "New notification" : "Edit notification"}
      description="Compose once, deliver calmly."
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
            disabled={!canSend}
            onClick={() => onSubmit(n, "save")}
            className={
              "h-10 rounded-full border border-white/[0.08] px-5 text-[13px] " +
              (canSend ? "bg-white/[0.05] text-primary hover:bg-white/[0.08]" : "cursor-not-allowed text-primary-muted/50")
            }
          >
            Save draft
          </button>
          <button
            disabled={!canSend}
            onClick={() => onSubmit(n, "send")}
            className={
              "h-10 rounded-full px-5 text-[13px] font-medium " +
              (canSend
                ? "bg-grad-cta text-white shadow-[0_8px_24px_-10px_rgba(124,140,255,0.6)] hover:brightness-110"
                : "cursor-not-allowed bg-white/[0.05] text-primary-muted")
            }
          >
            Send now
          </button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_320px]">
        <div>
          <Field label="Title" hint={`${n.title.length}/120`}>
            <TextInput value={n.title} onChange={(e) => patch("title", e.target.value)} />
          </Field>
          <div className="mt-4">
            <Field label="Body" hint={`${n.body.length}/360`}>
              <TextArea rows={4} value={n.body} onChange={(e) => patch("body", e.target.value)} />
            </Field>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Audience">
              <Select
                value={n.audience}
                onChange={(e) => patch("audience", e.target.value as NotificationTemplate["audience"])}
              >
                {AUDIENCES.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Schedule (optional)" hint="YYYY-MM-DD HH:mm">
              <TextInput
                value={n.scheduled ?? ""}
                onChange={(e) => patch("scheduled", e.target.value || undefined)}
                placeholder="2026-05-17 09:00"
              />
            </Field>
          </div>

          <div className="mt-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-[12.5px] text-primary/65">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-primary-muted">
              <Wand2 className="h-3 w-3 text-accent-secondary" />
              Safety
            </div>
            <p className="mt-1.5">
              Content is sanitized against HTML injection before dispatch. Push payloads include the
              VAPID signature expected by our service worker.
            </p>
          </div>
        </div>

        {/* Phone preview */}
        <div>
          <div className="text-[10.5px] uppercase tracking-[0.2em] text-primary-muted/80">Preview</div>
          <div className="mt-3 rounded-[36px] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))] p-5 shadow-elev-3">
            <div className="mx-auto h-1 w-12 rounded-full bg-white/10" />
            <div className="mt-5 rounded-2xl border border-white/[0.06] bg-[linear-gradient(180deg,rgba(17,24,39,0.9),rgba(11,16,32,0.95))] p-4">
              <div className="flex items-center gap-2">
                <div className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-accent/50 to-accent-secondary/50 text-white">
                  <Bell className="h-3.5 w-3.5" />
                </div>
                <div className="text-[11.5px] text-primary-muted">Aether 964 · now</div>
              </div>
              <div className="mt-3 text-[13.5px] font-medium text-primary">
                {n.title || "Notification title"}
              </div>
              <div className="mt-1 text-[12.5px] leading-relaxed text-primary/70">
                {n.body || "Notification body will appear here."}
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-[11px] text-primary-muted">
                <BookOpen className="h-3 w-3" />
                Audience: {n.audience} ({audienceSize(n.audience).toLocaleString()})
              </div>
            </div>
          </div>
          <div className="mt-4 text-center text-[11px] text-primary-muted/80">
            Estimated reach ·{" "}
            <span className="text-primary/90">{audienceSize(n.audience).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
