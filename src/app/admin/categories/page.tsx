"use client";

import * as React from "react";
import { Tag } from "lucide-react";
import { PageHeader, Section } from "@/components/admin/primitives";
import { useContentStore } from "@/lib/store/content-store";
import { Badge } from "@/components/ui/Badge";

/**
 * Categories — derived live from content.
 *
 * Shows every distinct category across prompts, tools, articles, news, models.
 * Admins can rename or delete a category by editing individual items; this page
 * is the calm bird's-eye view.
 */
export default function AdminCategoriesPage() {
  const prompts = useContentStore((s) => s.prompts);
  const tools = useContentStore((s) => s.tools);
  const articles = useContentStore((s) => s.articles);

  const buckets = React.useMemo(() => {
    function group<T>(items: T[], key: (t: T) => string) {
      const m = new Map<string, number>();
      for (const it of items) m.set(key(it), (m.get(key(it)) ?? 0) + 1);
      return [...m.entries()].sort((a, b) => b[1] - a[1]);
    }
    return {
      prompts: group(prompts, (p: any) => p.category),
      tools: group(tools, (t: any) => t.category),
      articles: group(articles, (a: any) => a.category)
    };
  }, [prompts, tools, articles]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
      <PageHeader
        eyebrow="Content · Categories"
        title="Categories"
        description="A live cross-section of every category in use on the platform."
      />

      <Section title="Prompt categories">
        <Group entries={buckets.prompts} />
      </Section>
      <Section title="Tool categories">
        <Group entries={buckets.tools} />
      </Section>
      <Section title="Article categories">
        <Group entries={buckets.articles} />
      </Section>
    </div>
  );
}

function Group({ entries }: { entries: [string, number][] }) {
  if (entries.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.02] p-8 text-center text-[13px] text-primary/60">
        No categories yet.
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {entries.map(([name, count]) => (
        <div
          key={name}
          className="card-premium flex items-center justify-between gap-3 px-5 py-4"
        >
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-accent">
              <Tag className="h-4 w-4" />
            </div>
            <div>
              <div className="text-[13.5px] text-primary">{name}</div>
              <div className="text-[11.5px] text-primary-muted">{count} item{count === 1 ? "" : "s"}</div>
            </div>
          </div>
          <Badge tone="mute">{count}</Badge>
        </div>
      ))}
    </div>
  );
}
