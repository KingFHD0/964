import type { SearchResult } from "@/lib/ecosystem";
import { PROMPTS } from "@/lib/prompts";
import {
  TOOLS,
  MODELS,
  ARTICLES,
  COURSES,
  WORKFLOWS,
  GUIDES,
  NEWS
} from "@/lib/ecosystem";

/**
 * buildSearchIndex — flattens the ecosystem into a single searchable list.
 * The palette runs a tiny fuzzy match against this list.
 */
export function buildSearchIndex(): SearchResult[] {
  const items: SearchResult[] = [];

  for (const p of PROMPTS) {
    items.push({
      id: `prompt:${p.id}`,
      kind: "prompt",
      title: p.title,
      description: p.description,
      href: `/library?open=${p.id}`,
      meta: p.category
    });
  }

  for (const t of TOOLS) {
    items.push({
      id: `tool:${t.id}`,
      kind: "tool",
      title: t.name,
      description: t.tagline,
      href: `/tools#${t.id}`,
      meta: t.category
    });
  }

  for (const m of MODELS) {
    items.push({
      id: `model:${m.id}`,
      kind: "model",
      title: m.name,
      description: m.useWhen,
      href: `/models#${m.id}`,
      meta: `${m.org} · ${m.kind}`
    });
  }

  for (const a of ARTICLES) {
    items.push({
      id: `article:${a.id}`,
      kind: "article",
      title: a.title,
      description: a.subtitle,
      href: `/encyclopedia/${a.slug}`,
      meta: a.category
    });
  }

  for (const c of COURSES) {
    items.push({
      id: `course:${c.id}`,
      kind: "course",
      title: c.title,
      description: c.subtitle,
      href: `/courses#${c.id}`,
      meta: `${c.level} · ${c.duration}`
    });
  }

  for (const w of WORKFLOWS) {
    items.push({
      id: `workflow:${w.id}`,
      kind: "workflow",
      title: w.title,
      description: w.body,
      href: `/workflows#${w.id}`,
      meta: w.duration
    });
  }

  for (const g of GUIDES) {
    items.push({
      id: `guide:${g.id}`,
      kind: "guide",
      title: g.title,
      description: g.body,
      href: `/guides#${g.id}`,
      meta: `${g.steps} steps`
    });
  }

  for (const n of NEWS) {
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
    // prefer title matches
    if (r.title.toLowerCase().includes(q)) return q.length / r.title.length;
    return 1 + q.length / haystack.length;
  }
  // token scoring
  const tokens = q.split(/\s+/);
  let allFound = true;
  let total = 0;
  for (const t of tokens) {
    if (!haystack.includes(t)) {
      allFound = false;
      break;
    }
    total += t.length;
  }
  if (allFound) return 2 + tokens.length;
  return Infinity;
}
