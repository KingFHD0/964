"use client";

import * as React from "react";
import Link from "next/link";
import { ExternalLink, Pencil, Plus, Trash2 } from "lucide-react";
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
import { ARTICLE_CATEGORIES, type Article, type ArticleCategory } from "@/lib/ecosystem";
import { sanitizeText } from "@/lib/security/sanitize";

const slugify = (t: string) =>
  t.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").slice(0, 80);

export default function AdminEncyclopediaPage() {
  const articles = useContentStore((s) => s.articles);
  const upsert = useContentStore((s) => s.upsertArticle);
  const remove = useContentStore((s) => s.removeArticle);
  const logEvent = useContentStore((s) => s.logEvent);
  const actor = useAdminAuth((s) => s.session?.name ?? "system");

  const [query, setQuery] = React.useState("");
  const [cat, setCat] = React.useState<string>("All");
  const [editing, setEditing] = React.useState<Article | null>(null);
  const [creating, setCreating] = React.useState(false);
  const [confirming, setConfirming] = React.useState<Article | null>(null);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter((a) => {
      if (cat !== "All" && a.category !== cat) return false;
      if (!q) return true;
      return [a.title, a.subtitle, a.author].some((v) => v.toLowerCase().includes(q));
    });
  }, [articles, query, cat]);

  const columns: Column<Article>[] = [
    {
      key: "title",
      label: "Article",
      render: (a) => (
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="truncate font-medium text-primary">{a.title}</span>
            {a.featured ? <Badge tone="accent">Featured</Badge> : null}
          </div>
          <div className="mt-0.5 line-clamp-1 text-[12px] text-primary/60">{a.subtitle}</div>
        </div>
      )
    },
    { key: "category", label: "Category", render: (a) => <Badge tone="mute">{a.category}</Badge> },
    { key: "author", label: "Author", render: (a) => <span className="text-primary/80">{a.author}</span> },
    {
      key: "readTime",
      label: "Meta",
      render: (a) => (
        <span className="text-[12px] text-primary-muted">
          {a.readTime} · {a.date}
        </span>
      )
    },
    {
      key: "actions",
      label: "",
      align: "right",
      render: (a) => (
        <div className="flex items-center justify-end gap-1">
          <Link
            href={`/encyclopedia/${a.slug}`}
            target="_blank"
            onClick={(e) => e.stopPropagation()}
            title="View live"
            className="focus-ring grid h-8 w-8 place-items-center rounded-full border border-white/[0.06] bg-white/[0.02] text-primary/80 hover:border-white/[0.14] hover:text-primary"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
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
        eyebrow="Content · Encyclopedia"
        title="Knowledge base"
        description="Write, edit, and publish articles with a Notion-grade authoring flow."
        actions={
          <button
            onClick={() => setCreating(true)}
            className="focus-ring inline-flex h-10 items-center gap-2 rounded-full bg-grad-cta px-4 text-[13px] font-medium text-white shadow-[0_8px_24px_-10px_rgba(124,140,255,0.6)] hover:brightness-110"
          >
            <Plus className="h-3.5 w-3.5" />
            New article
          </button>
        }
      />

      <Section title="All articles">
        <Toolbar search={query} onSearch={setQuery} placeholder="Search title, subtitle, author…">
          <Select value={cat} onChange={(e) => setCat(e.target.value)}>
            <option value="All">All categories</option>
            {ARTICLE_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </Toolbar>
        <div className="mt-5">
          <DataTable columns={columns} rows={filtered} onRowClick={(a) => setEditing(a)} />
        </div>
      </Section>

      <ArticleEditor
        open={creating || !!editing}
        mode={creating ? "create" : "edit"}
        initial={editing ?? undefined}
        onClose={() => {
          setCreating(false);
          setEditing(null);
        }}
        onSubmit={(v) => {
          const clean: Article = {
            ...v,
            title: sanitizeText(v.title, 140),
            subtitle: sanitizeText(v.subtitle, 280),
            author: sanitizeText(v.author, 80),
            body: sanitizeText(v.body, 40_000),
            slug: slugify(v.slug || v.title)
          };
          upsert(clean);
          logEvent({
            actor,
            action: `${creating ? "Published" : "Updated"} article: ${clean.title}`,
            severity: "info"
          });
          toast({ title: creating ? "Article published" : "Article updated", tone: "success" });
          setCreating(false);
          setEditing(null);
        }}
      />

      <Modal
        open={!!confirming}
        onClose={() => setConfirming(null)}
        title="Delete this article?"
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
                  action: `Deleted article: ${confirming.title}`,
                  severity: "warn"
                });
                toast({ title: "Article deleted", tone: "warn" });
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

function ArticleEditor({
  open,
  mode,
  initial,
  onClose,
  onSubmit
}: {
  open: boolean;
  mode: "create" | "edit";
  initial?: Article;
  onClose: () => void;
  onSubmit: (a: Article) => void;
}) {
  const empty: Article = {
    id: `a-${Date.now().toString(36)}`,
    slug: "",
    title: "",
    subtitle: "",
    category: "Fundamentals",
    readTime: "5 min read",
    date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    author: "Aether Research",
    toc: [],
    body: "",
    gradient: ["#7C8CFF", "#5CE1E6"],
    featured: false
  };
  const [a, setA] = React.useState<Article>(empty);
  React.useEffect(() => {
    if (!open) return;
    setA(initial ? { ...initial } : { ...empty, id: `a-${Date.now().toString(36)}` });
  }, [open, initial]); // eslint-disable-line react-hooks/exhaustive-deps

  function patch<K extends keyof Article>(k: K, v: Article[K]) {
    setA((prev) => ({ ...prev, [k]: v }));
  }

  const canSave = a.title.length >= 4 && a.subtitle.length >= 8 && a.body.length >= 40;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === "create" ? "New article" : "Edit article"}
      description="Headings (## / ###) become anchors for the floating TOC."
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
            onClick={() => {
              const toc = extractToc(a.body);
              onSubmit({ ...a, toc });
            }}
            className={
              "h-10 rounded-full px-5 text-[13px] font-medium " +
              (canSave
                ? "bg-grad-cta text-white shadow-[0_8px_24px_-10px_rgba(124,140,255,0.6)] hover:brightness-110"
                : "cursor-not-allowed bg-white/[0.05] text-primary-muted")
            }
          >
            {mode === "create" ? "Publish" : "Save changes"}
          </button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_200px]">
        <Field label="Title">
          <TextInput value={a.title} onChange={(e) => patch("title", e.target.value)} />
        </Field>
        <Field label="Category">
          <Select
            value={a.category}
            onChange={(e) => patch("category", e.target.value as ArticleCategory)}
          >
            {ARTICLE_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      <div className="mt-4">
        <Field label="Subtitle">
          <TextArea rows={2} value={a.subtitle} onChange={(e) => patch("subtitle", e.target.value)} />
        </Field>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Field label="Slug" hint="Auto-derived">
          <TextInput value={a.slug || slugify(a.title)} onChange={(e) => patch("slug", e.target.value)} />
        </Field>
        <Field label="Author">
          <TextInput value={a.author} onChange={(e) => patch("author", e.target.value)} />
        </Field>
        <Field label="Read time">
          <TextInput value={a.readTime} onChange={(e) => patch("readTime", e.target.value)} />
        </Field>
      </div>
      <div className="mt-4">
        <Field label="Body (markdown-lite)" hint="## H2 · ### H3 · - list · > quote · **bold**">
          <TextArea
            rows={14}
            value={a.body}
            onChange={(e) => patch("body", e.target.value)}
            className="font-mono text-[13px]"
            placeholder={"## Definition\nA **Large Language Model** (LLM) is a neural network…"}
          />
        </Field>
      </div>
    </Modal>
  );
}

function extractToc(body: string) {
  const lines = body.split("\n");
  const toc: { id: string; label: string }[] = [];
  for (const line of lines) {
    const m = line.match(/^##\s+(.*)/);
    if (m) {
      const label = m[1].trim();
      toc.push({ label, id: slugify(label) });
    }
  }
  return toc;
}
