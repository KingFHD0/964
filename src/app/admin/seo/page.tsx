"use client";

import * as React from "react";
import { Globe2, Plus, Save, Share2, X } from "lucide-react";
import {
  Field,
  PageHeader,
  Section,
  TextArea,
  TextInput
} from "@/components/admin/primitives";
import { useContentStore } from "@/lib/store/content-store";
import { useAdminAuth } from "@/lib/store/admin-auth";
import { toast } from "@/components/ui/Toaster";
import { sanitizeText, sanitizeUrl } from "@/lib/security/sanitize";

/**
 * SEO — edit the metadata the public surface uses in its <head>.
 */
export default function AdminSeoPage() {
  const seo = useContentStore((s) => s.seo);
  const setSeo = useContentStore((s) => s.setSeo);
  const logEvent = useContentStore((s) => s.logEvent);
  const actor = useAdminAuth((s) => s.session?.name ?? "system");

  const [title, setTitle] = React.useState(seo.title);
  const [description, setDescription] = React.useState(seo.description);
  const [twitter, setTwitter] = React.useState(seo.twitter);
  const [ogImage, setOgImage] = React.useState(seo.ogImage ?? "");
  const [keywords, setKeywords] = React.useState(seo.keywords.join(", "));

  React.useEffect(() => {
    setTitle(seo.title);
    setDescription(seo.description);
    setTwitter(seo.twitter);
    setOgImage(seo.ogImage ?? "");
    setKeywords(seo.keywords.join(", "));
  }, [seo]);

  const dirty =
    title !== seo.title ||
    description !== seo.description ||
    twitter !== seo.twitter ||
    (ogImage || "") !== (seo.ogImage ?? "") ||
    keywords !== seo.keywords.join(", ");

  function save() {
    setSeo({
      title: sanitizeText(title, 120),
      description: sanitizeText(description, 320),
      twitter: sanitizeText(twitter, 40),
      ogImage: ogImage ? sanitizeUrl(ogImage) || undefined : undefined,
      keywords: keywords
        .split(",")
        .map((x) => sanitizeText(x, 30))
        .filter(Boolean)
    });
    logEvent({ actor, action: "Updated SEO metadata", severity: "info" });
    toast({ title: "SEO updated", tone: "success" });
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-8">
      <PageHeader
        eyebrow="Growth · SEO"
        title="Search & social metadata"
        description="The metadata that shows in Google, X, and link unfurls."
      />

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          <Section title="Basics">
            <div className="card-premium p-5">
              <Field label="Title" hint={`${title.length}/60 optimal`}>
                <TextInput value={title} onChange={(e) => setTitle(e.target.value)} />
              </Field>
              <div className="mt-4">
                <Field label="Description" hint={`${description.length}/155 optimal`}>
                  <TextArea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
                </Field>
              </div>
            </div>
          </Section>

          <Section title="Social">
            <div className="card-premium p-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="X / Twitter handle">
                  <TextInput value={twitter} onChange={(e) => setTwitter(e.target.value)} />
                </Field>
                <Field label="OG / Twitter image URL">
                  <TextInput value={ogImage} onChange={(e) => setOgImage(e.target.value)} />
                </Field>
              </div>
            </div>
          </Section>

          <Section title="Keywords">
            <div className="card-premium p-5">
              <Field label="Comma-separated">
                <TextInput value={keywords} onChange={(e) => setKeywords(e.target.value)} />
              </Field>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {keywords
                  .split(",")
                  .map((x) => x.trim())
                  .filter(Boolean)
                  .map((k) => (
                    <span
                      key={k}
                      className="inline-flex items-center gap-1 rounded-full border border-white/[0.06] bg-white/[0.02] px-2.5 py-0.5 text-[11.5px] text-primary/80"
                    >
                      {k}
                      <button
                        aria-label={`Remove ${k}`}
                        onClick={() => {
                          setKeywords(
                            keywords
                              .split(",")
                              .map((x) => x.trim())
                              .filter((x) => x !== k)
                              .join(", ")
                          );
                        }}
                        className="text-primary-muted hover:text-primary"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
              </div>
            </div>
          </Section>

          <div className="flex justify-end">
            <button
              disabled={!dirty}
              onClick={save}
              className={
                "inline-flex h-10 items-center gap-2 rounded-full px-5 text-[13px] font-medium " +
                (dirty
                  ? "bg-grad-cta text-white shadow-[0_8px_24px_-10px_rgba(124,140,255,0.6)] hover:brightness-110"
                  : "cursor-not-allowed bg-white/[0.05] text-primary-muted")
              }
            >
              <Save className="h-3.5 w-3.5" />
              Save metadata
            </button>
          </div>
        </div>

        {/* Social preview */}
        <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="card-premium p-5">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-primary-muted">
              <Share2 className="h-3 w-3 text-accent-secondary" />
              Social preview
            </div>
            <div className="mt-4 overflow-hidden rounded-2xl border border-white/[0.08]">
              <div
                className="h-36 w-full"
                style={{
                  background: ogImage
                    ? `url(${ogImage}) center/cover`
                    : "linear-gradient(135deg, rgba(124,140,255,0.35), rgba(92,225,230,0.18) 60%, #0B1020)"
                }}
              />
              <div className="p-4">
                <div className="line-clamp-2 font-display text-[14.5px] font-medium leading-snug tracking-tight text-primary">
                  {title || "Title preview"}
                </div>
                <div className="mt-1 line-clamp-2 text-[12px] text-primary/65">
                  {description || "Description preview."}
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-[11px] text-primary-muted">
                  <Globe2 className="h-3 w-3" />
                  aether964.com · {twitter || "@aether964"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
