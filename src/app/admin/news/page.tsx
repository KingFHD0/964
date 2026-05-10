"use client";

import * as React from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  DataTable,
  Field,
  Modal,
  PageHeader,
  Section,
  Select,
  TextArea,
  TextInput,
  Toolbar,
  type Column
} from "@/components/admin/primitives";
import { Badge } from "@/components/ui/Badge";
import { useContentStore } from "@/lib/store/content-store";
import { useAdminAuth } from "@/lib/store/admin-auth";
import { toast } from "@/components/ui/Toaster";
import type { NewsItem, NewsKind } from "@/lib/ecosystem";
import { sanitizeText } from "@/lib/security/sanitize";

const KINDS: NewsKind[] = ["Release", "Research", "Industry", "Region"];

export default function AdminNewsPage() {
  const news = useContentStore((s) => s.news);
  const upsert = useContentStore((s) => s.upsertNews);
  const remove = useContentStore((s) => s.removeNews);
  const logEvent = useContentStore((s) => s.logEvent);
  const actor = useAdminAuth((s) => s.session?.name ?? "system");

  const [query, setQuery] = React.useState("");
  const [kind, setKind] = React.useState<string>("All");
  const [editing, setEditing] = React.useState<NewsItem | null>(null);
  const [creating, setCreating] = React.useState(false);
  const [confirming, setConfirming] = React.useState<NewsItem | null>(null);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return news.filter((n) => {
      if (kind !== "All" && n.kind !== kind) return false;
      if (!q) return true;
      return [n.title, n.body, n.source].some((v) => v.toLowerCase().includes(q));
    });
  }, [news, query, kind]);

  const columns: Column<NewsItem>[] = [
    {
      key: "title",
      label: "Story",
      render: (n) => (
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="truncate font-medium text-primary">{n.title}</span>
            {n.unread ? <Badge tone="secondary">Unread</Badge> : null}
          </div>
          <div className="mt-0.5 line-clamp-1 text-[12px] text-primary/60">{n.body}</div>
        </div>
      )
    },
    { key: "kind", label: "Kind", render: (n) => <Badge tone="mute">{n.kind}</Badge> },
    { key: "source", label: "Source", render: (n) => <span className="text-primary/80">{n.source}</span> },
    { key: "date", label: "Date", render: (n) => <span className="text-primary-muted">{n.date}</span> },
    {
      key: "actions",
      label: "",
      align: "right",
      render: (n) => (
        <div className="flex items-center justify-end gap-1">
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
        eyebrow="Content · News"
        title="News feed"
        description="Publish the signal you want in your community's orbit."
        actions={
          <button
            onClick={() => setCreating(true)}
            className="focus-ring inline-flex h-10 items-center gap-2 rounded-full bg-grad-cta px-4 text-[13px] font-medium text-white shadow-[0_8px_24px_-10px_rgba(124,140,255,0.6)] hover:brightness-110"
          >
            <Plus className="h-3.5 w-3.5" />
            New story
          </button>
        }
      />

      <Section title="All stories">
        <Toolbar search={query} onSearch={setQuery} placeholder="Search stories…">
          <Select value={kind} onChange={(e) => setKind(e.target.value)}>
            <option value="All">All kinds</option>
            {KINDS.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </Select>
        </Toolbar>
        <div className="mt-5">
          <DataTable columns={columns} rows={filtered} onRowClick={(n) => setEditing(n)} />
        </div>
      </Section>

      <NewsEditor
        open={creating || !!editing}
        mode={creating ? "create" : "edit"}
        initial={editing ?? undefined}
        onClose={() => {
          setCreating(false);
          setEditing(null);
        }}
        onSubmit={(n) => {
          const clean: NewsItem = {
            ...n,
            title: sanitizeText(n.title, 140),
            body: sanitizeText(n.body, 400),
            source: sanitizeText(n.source, 80)
          };
          upsert(clean);
          logEvent({
            actor,
            action: `${creating ? "Published" : "Updated"} news: ${clean.title}`,
            severity: "info"
          });
          toast({ title: creating ? "Story published" : "Story updated", tone: "success" });
          setCreating(false);
          setEditing(null);
        }}
      />

      <Modal
        open={!!confirming}
        onClose={() => setConfirming(null)}
        title="Delete this story?"
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
                logEvent({ actor, action: `Deleted news: ${confirming.title}`, severity: "warn" });
                toast({ title: "Story deleted", tone: "warn" });
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

function NewsEditor({
  open,
  mode,
  initial,
  onClose,
  onSubmit
}: {
  open: boolean;
  mode: "create" | "edit";
  initial?: NewsItem;
  onClose: () => void;
  onSubmit: (n: NewsItem) => void;
}) {
  const empty: NewsItem = {
    id: `n-${Date.now().toString(36)}`,
    kind: "Release",
    title: "",
    body: "",
    source: "",
    date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    unread: true
  };
  const [n, setN] = React.useState<NewsItem>(empty);
  React.useEffect(() => {
    if (!open) return;
    setN(initial ? { ...initial } : { ...empty, id: `n-${Date.now().toString(36)}` });
  }, [open, initial]); // eslint-disable-line react-hooks/exhaustive-deps

  function patch<K extends keyof NewsItem>(k: K, v: NewsItem[K]) {
    setN((prev) => ({ ...prev, [k]: v }));
  }

  const canSave = n.title.length >= 4 && n.body.length >= 8;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === "create" ? "New story" : "Edit story"}
      size="md"
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
            onClick={() => onSubmit(n)}
            className={
              "h-10 rounded-full px-5 text-[13px] font-medium " +
              (canSave
                ? "bg-grad-cta text-white shadow-[0_8px_24px_-10px_rgba(124,140,255,0.6)] hover:brightness-110"
                : "cursor-not-allowed bg-white/[0.05] text-primary-muted")
            }
          >
            {mode === "create" ? "Publish" : "Save"}
          </button>
        </>
      }
    >
      <Field label="Title">
        <TextInput value={n.title} onChange={(e) => patch("title", e.target.value)} />
      </Field>
      <div className="mt-4">
        <Field label="Body">
          <TextArea rows={4} value={n.body} onChange={(e) => patch("body", e.target.value)} />
        </Field>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Field label="Kind">
          <Select value={n.kind} onChange={(e) => patch("kind", e.target.value as NewsKind)}>
            {KINDS.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Source">
          <TextInput value={n.source} onChange={(e) => patch("source", e.target.value)} />
        </Field>
        <Field label="Date">
          <TextInput value={n.date} onChange={(e) => patch("date", e.target.value)} />
        </Field>
      </div>
    </Modal>
  );
}
