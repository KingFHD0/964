import type { SearchResult } from "@/lib/ecosystem";
import type { ContentStore } from "@/lib/store/content-store";

/**
 * buildSearchIndex — flattens live store content into a single searchable list.
 *
 * Accepts a snapshot of the content store so it stays reactive when the admin
 * edits anything. The palette re-memoizes on every relevant store slice.
 */
export function buildSearchIndex(
  snapshot: Pick<
    ContentStore,
    | "prompts"
    | "tools"
    | "models"
    | "articles"
    | "courses"
    | "workflows"
    | "guides"
    | "news"
  >
): SearchResult[] {
  const items: SearchResult[] = [];

  for (const p of snapshot.prompts) {
    items.push({
      id: `prompt:${p.id}`,
      kind: "prompt",
      title: p.title,
      description: p.description,
      href: `/library?open=${p.id}`,
      meta: p.category
    });
  }

  for (const t of snapshot.tools) {
    items.push({
      id: `tool:${t.id}`,
      kind: "tool",
      title: t.name,
      description: t.tagline,
      href: `/tools#${t.id}`,
      meta: t.category
    });
  }

  for (const m of snapshot.models) {
    items.push({
      id: `model:${m.id}`,
      kind: "model",
      title: m.name,
      description: m.useWhen,
      href: `/models#${m.id}`,
      meta: `${m.org} · ${m.kind}`
    });
  }

  for (const a of snapshot.articles) {
    items.push({
      id: `article:${a.id}`,
      kind: "article",
      title: a.title,
      description: a.subtitle,
      href: `/encyclopedia/${a.slug}`,
      meta: a.category
    });
  }

  for (const c of snapshot.courses) {
    items.push({
      id: `course:${c.id}`,
      kind: "course",
      title: c.title,
      description: c.subtitle,
      href: `/courses#${c.id}`,
      meta: `${c.level} · ${c.duration}`
    });
  }

  for (const w of snapshot.workflows) {
    items.push({
      id: `workflow:${w.id}`,
      kind: "workflow",
      title: w.title,
      description: w.body,
      href: `/workflows#${w.id}`,
      meta: w.duration
    });
  }

  for (const g of snapshot.guides) {
    items.push({
      id: `guide:${g.id}`,
      kind: "guide",
      title: g.title,
      description: g.body,
      href: `/guides#${g.id}`,
      meta: `${g.steps} steps`
    });
  }

  for (const n of snapshot.news) {
    items.push({
      id: `news:${n.id}`,
      kind: "news",
      title: n.title,
      description: n.body,
      href: `/news#${n.id}`,
      meta: n.source
    });
  }

  return items;
}

/**
 * fuzzy — a tiny fuzzy scorer.
 * Returns matches sorted by score (lower = better match, Infinity = no match).
 */
export function rankResults(query: string, index: SearchResult[]) {
  const q = query.trim().toLowerCase();
  if (!q) return index.slice(0, 14);

  const scored = index
    .map((item) => ({ item, score: score(q, item) }))
    .filter((x) => x.score < Infinity)
    .sort((a, b) => a.score - b.score)
    .slice(0, 24)
    .map((x) => x.item);

  return scored;
}

function score(q: string, r: SearchResult): number {
  const haystack = `${r.title} ${r.description} ${r.meta ?? ""}`.toLowerCase();
  if (haystack.includes(q)) {
    if (r.title.toLowerCase().includes(q)) return q.length / r.title.length;
    return 1 + q.length / haystack.length;
  }
  const tokens = q.split(/\s+/);
  let allFound = true;
  for (const t of tokens) {
    if (!haystack.includes(t)) {
      allFound = false;
      break;
    }
  }
  if (allFound) return 2 + tokens.length;
  return Infinity;
}
