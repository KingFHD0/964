"use client";

import * as React from "react";
import { Cpu } from "lucide-react";
import { PageHeader, Section } from "@/components/admin/primitives";
import { useContentStore } from "@/lib/store/content-store";
import { Badge } from "@/components/ui/Badge";

/**
 * Models — for now, a read-only view since frontier model metadata
 * is rarely author-edited. Admins can still redirect users to any model via ads.
 */
export default function AdminModelsPage() {
  const models = useContentStore((s) => s.models);
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
      <PageHeader
        eyebrow="Content · Models"
        title="AI models hub"
        description="The frontier/open models you surface to users. Edit the blurbs in /lib/ecosystem for now — CRUD UI ships next."
      />

      <Section title="Catalogue">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {models.map((m) => (
            <div key={m.id} className="card-premium p-5">
              <div className="flex items-center gap-3">
                <div
                  className="grid h-10 w-10 place-items-center rounded-xl border border-white/[0.08]"
                  style={{
                    background: `linear-gradient(135deg, ${m.gradient[0]}33, ${m.gradient[1]}22)`
                  }}
                >
                  <Cpu className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <div className="font-display text-[15px] font-medium tracking-tight text-primary">
                    {m.name}
                  </div>
                  <div className="text-[11.5px] text-primary-muted">
                    {m.org} · {m.family}
                  </div>
                </div>
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-primary/70">{m.useWhen}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                <Badge tone="mute">{m.kind}</Badge>
                {m.contextWindow ? <Badge tone="secondary">{m.contextWindow}</Badge> : null}
                <Badge tone="mute">{m.released}</Badge>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
