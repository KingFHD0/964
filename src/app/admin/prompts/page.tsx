"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Copy,
  Pencil,
  Plus,
  Sparkles,
  Star,
  Trash2,
  Wand2
} from "lucide-react";
import {
  DataTable,
  Field,
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
import { useContentStore } from "@/lib/store/content-store";
import { useAdminAuth } from "@/lib/store/admin-auth";
import { toast } from "@/components/ui/Toaster";
import { CATEGORIES, type Prompt, type PromptCategory } from "@/lib/prompts";
import { sanitizePrompt, sanitizeText } from "@/lib/security/sanitize";

/**
 * Prompts admin — CRUD + featured/pro toggles + category filter.
 * All mutations go through the content store; every write is logged.
 */
export default function AdminPromptsPage() {
  const prompts = useContentStore((s) => s.prompts);
  const upsert = useContentStore((s) => s.upsertPrompt);
  const remove = useContentStore((s) => s.removePrompt);
  const logEvent = useContentStore((s) => s.logEvent);
  const actor = useAdminAuth((s) => s.session?.name ?? "system");

  const [query, setQuery] = React.useState("");
  const [cat, setCat] = React.useState<string>("All");
  const [editing, setEditing] = React.useState<Prompt | null>(null);
  const [creating, setCreating] = React.useState(false);
  const [confirming, setConfirming] = React.useState<Prompt | null>(null);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return prompts.filter((p) => {
      if (cat !== "All" && p.category !== cat) return false;
      if (!q) return true;
      return [p.title, p.description, p.category, p.body].some((v) =>
        v.toLowerCase().includes(q)
      );
    });
  }, [prompts, query, cat]);

  const columns: Column<Prompt>[] = [
    {
      key: "title",
      label: "Prompt",
      render: (p) => (
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="truncate font-medium text-primary">{p.title}</span>
            {p.isNew ? <Badge tone="secondary">New</Badge> : null}
            {p.isPro ? <Badge tone="accent">Pro</Badge> : null}
          </div>
          <div className="mt-0.5 line-clamp-1 text-[12px] text-primary/60">{p.description}</div>
        </div>
      )
    },
    {
      key: "category",
      label: "Category",
      render: (p) => <Badge tone="mute">{p.category}</Badge>
    },
    {
      key: "readTime",
      label: "Read",
      render: (p) => <span className="text-primary-muted">{p.readTime ?? "—"}</span>
    },
    {
      key: "actions",
      label: "",
      align: "right",
      render: (p) => (
        <div className="flex items-center justify-end gap-1">
          <IconButton
            title="Edit"
            onClick={(e) => {
              e.stopPropagation();
              setEditing(p);
            }}
          >
            <Pencil className="h-3.5 w-3.5" />
          </IconButton>
          <IconButton
            title="Duplicate"
            onClick={(e) => {
              e.stopPropagation();
              const copy: Prompt = { ...p, id: `p-${Date.now().toString(36)}`, title: `${p.title} (copy)` };
              upsert(copy);
              logEvent({ actor, action: `Duplicated prompt: ${p.title}`, severity: "info" });
              toast({ title: "Prompt duplicated", tone: "success" });
            }}
          >
            <Copy className="h-3.5 w-3.5" />
          </IconButton>
          <IconButton
            tone="danger"
            title="Delete"
            onClick={(e) => {
              e.stopPropagation();
              setConfirming(p);
            }}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </IconButton>
        </div>
      )
    }
  ];

  const pro = prompts.filter((p) => p.isPro).length;
  const fresh = prompts.filter((p) => p.isNew).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
      <PageHeader
        eyebrow="Content · Prompts"
        title="Prompt library"
        description="Create, edit, and schedule prompts. Changes appear in the public library instantly."
        actions={
          <button
            onClick={() => setCreating(true)}
            className="focus-ring inline-flex h-10 items-center gap-2 rounded-full bg-grad-cta px-4 text-[13px] font-medium text-white shadow-[0_8px_24px_-10px_rgba(124,140,255,0.6)] hover:brightness-110"
          >
            <Plus className="h-3.5 w-3.5" />
            New prompt
          </button>
        }
      />

      <div className="mt-8 grid grid-cols-3 gap-3">
        <MiniStat label="Total" value={prompts.length} />
        <MiniStat label="Pro" value={pro} tone="accent" />
        <MiniStat label="New" value={fresh} tone="secondary" />
      </div>

      <Section title="All prompts">
        <Toolbar search={query} onSearch={setQuery} placeholder="Search prompts by title, body, or category…">
          <Select value={cat} onChange={(e) => setCat(e.target.value)}>
            <option value="All">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </Toolbar>

        <div className="mt-5">
          <DataTable
            columns={columns}
            rows={filtered}
            onRowClick={(p) => setEditing(p)}
            empty="No prompts match those filters."
          />
        </div>
      </Section>

      <PromptEditor
        open={creating || !!editing}
        mode={creating ? "create" : "edit"}
        initial={editing ?? undefined}
        onClose={() => {
          setCreating(false);
          setEditing(null);
        }}
        onSubmit={(value) => {
          const sanitized: Prompt = {
            ...value,
            title: sanitizeText(value.title, 140),
            description: sanitizeText(value.description, 280),
            body: sanitizePrompt(value.body, 4000)
          };
          upsert(sanitized);
          logEvent({
            actor,
            action: `${creating ? "Created" : "Updated"} prompt: ${sanitized.title}`,
            severity: "info"
          });
          toast({ title: creating ? "Prompt created" : "Prompt updated", tone: "success" });
          setCreating(false);
          setEditing(null);
        }}
      />

      <Modal
        open={!!confirming}
        onClose={() => setConfirming(null)}
        title="Delete this prompt?"
        description="This removes it from the public library immediately. You can re-create it, but analytics history is kept."
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
                  action: `Deleted prompt: ${confirming.title}`,
                  severity: "warn"
                });
                toast({ title: "Prompt deleted", tone: "warn" });
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

/* ─────────────── helpers ─────────────── */

function MiniStat({
  label,
  value,
  tone = "default"
}: {
  label: string;
  value: number;
  tone?: "default" | "accent" | "secondary";
}) {
  const color =
    tone === "accent" ? "text-accent" : tone === "secondary" ? "text-accent-secondary" : "text-primary";
  return (
    <div className="card-premium px-5 py-4">
      <div className="text-[10.5px] uppercase tracking-[0.2em] text-primary-muted">{label}</div>
      <div className={`mt-2 font-display text-[22px] font-medium tracking-tight ${color}`}>
        {value.toLocaleString()}
      </div>
    </div>
  );
}

function IconButton({
  title,
  onClick,
  tone,
  children
}: {
  title: string;
  onClick: (e: React.MouseEvent) => void;
  tone?: "danger";
  children: React.ReactNode;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={
        "focus-ring grid h-8 w-8 place-items-center rounded-full border border-white/[0.06] bg-white/[0.02] text-primary/80 transition-colors hover:border-white/[0.14] hover:text-primary " +
        (tone === "danger" ? "hover:border-red-400/30 hover:text-red-300" : "")
      }
    >
      {children}
    </button>
  );
}

/* ─────────────── Editor ─────────────── */

function PromptEditor({
  open,
  mode,
  initial,
  onClose,
  onSubmit
}: {
  open: boolean;
  mode: "create" | "edit";
  initial?: Prompt;
  onClose: () => void;
  onSubmit: (p: Prompt) => void;
}) {
  const emptyPrompt: Prompt = {
    id: `p-${Date.now().toString(36)}`,
    title: "",
    description: "",
    category: "Marketing",
    body: "",
    isNew: true,
    isPro: false,
    readTime: "1 min",
    gradient: ["#7C8CFF", "#5CE1E6"]
  };
  const [p, setP] = React.useState<Prompt>(emptyPrompt);
  React.useEffect(() => {
    if (!open) return;
    setP(initial ? { ...initial } : { ...emptyPrompt, id: `p-${Date.now().toString(36)}` });
  }, [open, initial]); // eslint-disable-line react-hooks/exhaustive-deps

  function update<K extends keyof Prompt>(k: K, v: Prompt[K]) {
    setP((prev) => ({ ...prev, [k]: v }));
  }

  const canSave = p.title.trim().length >= 4 && p.description.trim().length >= 8 && p.body.trim().length >= 20;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === "create" ? "New prompt" : "Edit prompt"}
      description="Specific, constrained, reusable. Variables wrapped in {curlies}."
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
            onClick={() => onSubmit(p)}
            className={
              "h-10 rounded-full px-5 text-[13px] font-medium transition-all " +
              (canSave
                ? "bg-grad-cta text-white shadow-[0_8px_24px_-10px_rgba(124,140,255,0.6)] hover:brightness-110"
                : "cursor-not-allowed bg-white/[0.05] text-primary-muted")
            }
          >
            {mode === "create" ? "Create prompt" : "Save changes"}
          </button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Title" hint={`${p.title.length}/140`}>
          <TextInput
            value={p.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder="e.g. Cinematic Portrait Brief"
          />
        </Field>
        <Field label="Category">
          <Select
            value={p.category}
            onChange={(e) => update("category", e.target.value as PromptCategory)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <div className="mt-4">
        <Field label="Description" hint="Shown on the card · 280 chars max">
          <TextArea
            rows={2}
            value={p.description}
            onChange={(e) => update("description", e.target.value)}
            placeholder="A single elegant line that sells the craft of this prompt."
          />
        </Field>
      </div>

      <div className="mt-4">
        <Field label="Prompt body" hint="Use {variable} placeholders.">
          <TextArea
            rows={8}
            value={p.body}
            onChange={(e) => update("body", e.target.value)}
            className="font-mono text-[13px]"
            placeholder="You are a senior art director…"
          />
        </Field>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Field label="Read time">
          <Select value={p.readTime} onChange={(e) => update("readTime", e.target.value)}>
            {["1 min", "2 min", "3 min", "4 min"].map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Gradient — start">
          <div className="flex h-11 items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-3">
            <input
              type="color"
              value={p.gradient[0]}
              onChange={(e) => update("gradient", [e.target.value, p.gradient[1]] as [string, string])}
              className="h-7 w-12 cursor-pointer rounded-md border border-white/[0.1] bg-transparent"
              aria-label="Gradient start"
            />
            <span className="font-mono text-[12.5px] text-primary/80">{p.gradient[0]}</span>
          </div>
        </Field>
        <Field label="Gradient — end">
          <div className="flex h-11 items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-3">
            <input
              type="color"
              value={p.gradient[1]}
              onChange={(e) => update("gradient", [p.gradient[0], e.target.value] as [string, string])}
              className="h-7 w-12 cursor-pointer rounded-md border border-white/[0.1] bg-transparent"
              aria-label="Gradient end"
            />
            <span className="font-mono text-[12.5px] text-primary/80">{p.gradient[1]}</span>
          </div>
        </Field>
      </div>

      <div className="mt-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-5">
        <ToggleRow
          label="Featured (New)"
          description="Shows a New badge on the card for 14 days."
          checked={!!p.isNew}
          onChange={(v) => update("isNew", v)}
        />
        <div className="hairline" />
        <ToggleRow
          label="Pro only"
          description="Locked to Supernova members."
          checked={!!p.isPro}
          onChange={(v) => update("isPro", v)}
        />
      </div>

      {/* Live preview */}
      <div className="mt-5">
        <div className="mb-2 text-[10.5px] uppercase tracking-[0.22em] text-primary-muted/80">
          Preview
        </div>
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.06]">
          <div
            className="h-24"
            style={{
              background: `linear-gradient(135deg, ${p.gradient[0]}44 0%, ${p.gradient[1]}22 60%, #0B1020 100%)`
            }}
          />
          <div className="p-4">
            <div className="flex items-center gap-2">
              <Badge tone="mute">{p.category}</Badge>
              {p.isNew ? <Badge tone="secondary">New</Badge> : null}
              {p.isPro ? <Badge tone="accent">Pro</Badge> : null}
            </div>
            <div className="mt-2 font-display text-[16px] font-medium tracking-tight text-primary">
              {p.title || "Untitled prompt"}
            </div>
            <div className="mt-1 line-clamp-2 text-[12.5px] text-primary/60">
              {p.description || "Describe the value of this prompt in one line."}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-[11.5px] text-primary-muted/80">
        <Wand2 className="h-3 w-3 text-accent-secondary" />
        <span>Input is sanitized against known prompt-injection sentinels before it ships.</span>
      </div>
    </Modal>
  );
}
