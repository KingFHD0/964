"use client";

import * as React from "react";
import { ExternalLink, Pencil, Plus, Star, Trash2 } from "lucide-react";
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
  ToggleRow,
  type Column
} from "@/components/admin/primitives";
import { Badge } from "@/components/ui/Badge";
import { useContentStore } from "@/lib/store/content-store";
import { useAdminAuth } from "@/lib/store/admin-auth";
import { toast } from "@/components/ui/Toaster";
import {
  TOOL_CATEGORIES,
  type AiTool,
  type ToolCategory
} from "@/lib/ecosystem";
import { sanitizeText, sanitizeUrl } from "@/lib/security/sanitize";

export default function AdminToolsPage() {
  const tools = useContentStore((s) => s.tools);
  const upsert = useContentStore((s) => s.upsertTool);
  const remove = useContentStore((s) => s.removeTool);
  const logEvent = useContentStore((s) => s.logEvent);
  const actor = useAdminAuth((s) => s.session?.name ?? "system");

  const [query, setQuery] = React.useState("");
  const [cat, setCat] = React.useState<string>("All");
  const [editing, setEditing] = React.useState<AiTool | null>(null);
  const [creating, setCreating] = React.useState(false);
  const [confirming, setConfirming] = React.useState<AiTool | null>(null);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return tools.filter((t) => {
      if (cat !== "All" && t.category !== cat) return false;
      if (!q) return true;
      return [t.name, t.tagline, t.description, t.category].some((v) =>
        v.toLowerCase().includes(q)
      );
    });
  }, [tools, query, cat]);

  const columns: Column<AiTool>[] = [
    {
      key: "name",
      label: "Tool",
      render: (t) => (
        <div className="flex items-center gap-3">
          <div
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-[10px] font-medium"
            style={{
              background: `linear-gradient(135deg, ${t.gradient[0]}55, ${t.gradient[1]}33)`,
              color: "#fff"
            }}
          >
            {t.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="truncate font-medium text-primary">{t.name}</span>
              {t.featured ? <Badge tone="accent">Featured</Badge> : null}
            </div>
            <div className="mt-0.5 line-clamp-1 text-[12px] text-primary/60">{t.tagline}</div>
          </div>
        </div>
      )
    },
    { key: "category", label: "Category", render: (t) => <Badge tone="mute">{t.category}</Badge> },
    {
      key: "rating",
      label: "Rating",
      render: (t) => (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 text-[11.5px] text-primary/85">
          <Star className="h-3 w-3 fill-accent-secondary text-accent-secondary" />
          {t.rating.toFixed(1)}
        </span>
      )
    },
    { key: "price", label: "Price", render: (t) => <Badge tone={t.price === "Paid" ? "accent" : t.price === "Freemium" ? "secondary" : "mute"}>{t.price}</Badge> },
    {
      key: "actions",
      label: "",
      align: "right",
      render: (t) => (
        <div className="flex items-center justify-end gap-1">
          <a
            href={t.url}
            target="_blank"
            rel="noopener noreferrer"
            title="Open"
            onClick={(e) => e.stopPropagation()}
            className="focus-ring grid h-8 w-8 place-items-center rounded-full border border-white/[0.06] bg-white/[0.02] text-primary/80 hover:border-white/[0.14] hover:text-primary"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditing(t);
            }}
            title="Edit"
            className="focus-ring grid h-8 w-8 place-items-center rounded-full border border-white/[0.06] bg-white/[0.02] text-primary/80 hover:border-white/[0.14] hover:text-primary"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setConfirming(t);
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
        eyebrow="Content · AI tools"
        title="AI tools directory"
        description="Curate the tools your studios reach for. Edits appear live on /tools."
        actions={
          <button
            onClick={() => setCreating(true)}
            className="focus-ring inline-flex h-10 items-center gap-2 rounded-full bg-grad-cta px-4 text-[13px] font-medium text-white shadow-[0_8px_24px_-10px_rgba(124,140,255,0.6)] hover:brightness-110"
          >
            <Plus className="h-3.5 w-3.5" />
            New tool
          </button>
        }
      />

      <Section title="All tools">
        <Toolbar search={query} onSearch={setQuery} placeholder="Search by name, tagline, or category…">
          <Select value={cat} onChange={(e) => setCat(e.target.value)}>
            <option value="All">All categories</option>
            {TOOL_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </Toolbar>

        <div className="mt-5">
          <DataTable columns={columns} rows={filtered} onRowClick={(t) => setEditing(t)} />
        </div>
      </Section>

      <ToolEditor
        open={creating || !!editing}
        mode={creating ? "create" : "edit"}
        initial={editing ?? undefined}
        onClose={() => {
          setCreating(false);
          setEditing(null);
        }}
        onSubmit={(v) => {
          const clean: AiTool = {
            ...v,
            name: sanitizeText(v.name, 80),
            tagline: sanitizeText(v.tagline, 120),
            description: sanitizeText(v.description, 600),
            url: sanitizeUrl(v.url) || "#",
            useCases: v.useCases.map((x) => sanitizeText(x, 60)).filter(Boolean),
            alternatives: v.alternatives.map((x) => sanitizeText(x, 60)).filter(Boolean)
          };
          upsert(clean);
          logEvent({
            actor,
            action: `${creating ? "Added" : "Updated"} tool: ${clean.name}`,
            severity: "info"
          });
          toast({ title: creating ? "Tool added" : "Tool updated", tone: "success" });
          setCreating(false);
          setEditing(null);
        }}
      />

      <Modal
        open={!!confirming}
        onClose={() => setConfirming(null)}
        title="Delete this tool?"
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
                  action: `Deleted tool: ${confirming.name}`,
                  severity: "warn"
                });
                toast({ title: "Tool deleted", tone: "warn" });
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
          <span className="font-medium text-primary">{confirming?.name}</span>
        </div>
      </Modal>
    </div>
  );
}

function ToolEditor({
  open,
  mode,
  initial,
  onClose,
  onSubmit
}: {
  open: boolean;
  mode: "create" | "edit";
  initial?: AiTool;
  onClose: () => void;
  onSubmit: (t: AiTool) => void;
}) {
  const empty: AiTool = {
    id: `t-${Date.now().toString(36)}`,
    name: "",
    category: "Writing AI",
    tagline: "",
    description: "",
    rating: 4.5,
    price: "Freemium",
    useCases: [],
    alternatives: [],
    url: "https://",
    gradient: ["#7C8CFF", "#5CE1E6"],
    featured: false
  };
  const [t, setT] = React.useState<AiTool>(empty);
  React.useEffect(() => {
    if (!open) return;
    setT(initial ? { ...initial } : { ...empty, id: `t-${Date.now().toString(36)}` });
  }, [open, initial]); // eslint-disable-line react-hooks/exhaustive-deps

  function patch<K extends keyof AiTool>(k: K, v: AiTool[K]) {
    setT((prev) => ({ ...prev, [k]: v }));
  }

  const canSave = t.name.trim().length >= 2 && t.tagline.trim().length >= 4;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === "create" ? "Add a tool" : "Edit tool"}
      description="Only list tools you would actually ship with."
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
            onClick={() => onSubmit(t)}
            className={
              "h-10 rounded-full px-5 text-[13px] font-medium " +
              (canSave
                ? "bg-grad-cta text-white shadow-[0_8px_24px_-10px_rgba(124,140,255,0.6)] hover:brightness-110"
                : "cursor-not-allowed bg-white/[0.05] text-primary-muted")
            }
          >
            {mode === "create" ? "Add tool" : "Save changes"}
          </button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Name">
          <TextInput value={t.name} onChange={(e) => patch("name", e.target.value)} />
        </Field>
        <Field label="Category">
          <Select
            value={t.category}
            onChange={(e) => patch("category", e.target.value as ToolCategory)}
          >
            {TOOL_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <div className="mt-4">
        <Field label="Tagline" hint="Max 120">
          <TextInput value={t.tagline} onChange={(e) => patch("tagline", e.target.value)} />
        </Field>
      </div>

      <div className="mt-4">
        <Field label="Description" hint="Max 600">
          <TextArea rows={4} value={t.description} onChange={(e) => patch("description", e.target.value)} />
        </Field>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Field label="URL">
          <TextInput value={t.url} onChange={(e) => patch("url", e.target.value)} />
        </Field>
        <Field label="Price">
          <Select value={t.price} onChange={(e) => patch("price", e.target.value as AiTool["price"])}>
            <option>Free</option>
            <option>Freemium</option>
            <option>Paid</option>
          </Select>
        </Field>
        <Field label="Rating">
          <TextInput
            type="number"
            step={0.1}
            min={0}
            max={5}
            value={t.rating}
            onChange={(e) => patch("rating", Number(e.target.value))}
          />
        </Field>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Use cases" hint="Comma separated">
          <TextInput
            value={t.useCases.join(", ")}
            onChange={(e) => patch("useCases", e.target.value.split(",").map((x) => x.trim()).filter(Boolean))}
          />
        </Field>
        <Field label="Alternatives" hint="Comma separated">
          <TextInput
            value={t.alternatives.join(", ")}
            onChange={(e) =>
              patch("alternatives", e.target.value.split(",").map((x) => x.trim()).filter(Boolean))
            }
          />
        </Field>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Gradient — start">
          <div className="flex h-11 items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-3">
            <input
              type="color"
              value={t.gradient[0]}
              onChange={(e) =>
                patch("gradient", [e.target.value, t.gradient[1]] as [string, string])
              }
              className="h-7 w-12 cursor-pointer rounded-md border border-white/[0.1] bg-transparent"
            />
            <span className="font-mono text-[12.5px] text-primary/80">{t.gradient[0]}</span>
          </div>
        </Field>
        <Field label="Gradient — end">
          <div className="flex h-11 items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-3">
            <input
              type="color"
              value={t.gradient[1]}
              onChange={(e) =>
                patch("gradient", [t.gradient[0], e.target.value] as [string, string])
              }
              className="h-7 w-12 cursor-pointer rounded-md border border-white/[0.1] bg-transparent"
            />
            <span className="font-mono text-[12.5px] text-primary/80">{t.gradient[1]}</span>
          </div>
        </Field>
      </div>

      <div className="mt-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-5">
        <ToggleRow
          label="Featured on the directory"
          description="Appears first on /tools."
          checked={!!t.featured}
          onChange={(v) => patch("featured", v)}
        />
      </div>
    </Modal>
  );
}
