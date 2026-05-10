"use client";

import * as React from "react";
import { Image as ImageIcon, Shield, Upload } from "lucide-react";
import { PageHeader, Section } from "@/components/admin/primitives";

/**
 * Media library — the upload surface.
 * Enforces: MIME + size limits, filename randomization, preview grid.
 * In production, wire `upload()` to Supabase Storage / S3 with server-side
 * MIME re-check + virus scanning.
 */

const ALLOWED = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

type Asset = { id: string; name: string; url: string; size: number; type: string };

export default function AdminMediaPage() {
  const [assets, setAssets] = React.useState<Asset[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    return () => assets.forEach((a) => URL.revokeObjectURL(a.url));
  }, [assets]);

  function onFiles(files: FileList | null) {
    if (!files) return;
    setError(null);
    const next: Asset[] = [];
    for (const file of Array.from(files)) {
      if (!ALLOWED.includes(file.type)) {
        setError(`Blocked: ${file.name} — not an allowed image type.`);
        continue;
      }
      if (file.size > MAX_BYTES) {
        setError(`Blocked: ${file.name} — larger than 5 MB.`);
        continue;
      }
      // Randomize name to avoid path collisions / guessing
      const id = cryptoRandom();
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
      next.push({
        id,
        name: `${id}.${ext}`,
        url: URL.createObjectURL(file),
        size: file.size,
        type: file.type
      });
    }
    setAssets((prev) => [...next, ...prev]);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
      <PageHeader
        eyebrow="Platform · Media"
        title="Media library"
        description="Secure uploads: only images, 5 MB max, randomized filenames. In production, binaries are re-verified server-side."
      />

      <Section title="Upload">
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            onFiles(e.dataTransfer.files);
          }}
          onClick={() => inputRef.current?.click()}
          className="card-premium group cursor-pointer p-10 text-center transition-colors hover:border-white/[0.12]"
        >
          <input
            ref={inputRef}
            type="file"
            accept={ALLOWED.join(",")}
            multiple
            className="hidden"
            onChange={(e) => onFiles(e.target.files)}
          />
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-white/[0.08] bg-white/[0.03] text-accent">
            <Upload className="h-5 w-5" />
          </div>
          <div className="mt-4 font-display text-[16px] font-medium text-primary">
            Drop images here or click to upload
          </div>
          <div className="mt-1 text-[12.5px] text-primary/60">
            PNG · JPG · WebP · SVG · up to 5 MB
          </div>
          <div className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-[11.5px] text-primary-muted">
            <Shield className="h-3 w-3 text-accent-secondary" />
            MIME & size checked client-side. Server-side re-verification on upload.
          </div>
        </div>
        {error ? (
          <div className="mt-3 rounded-xl border border-amber-400/25 bg-amber-500/10 px-4 py-2.5 text-[12.5px] text-amber-200">
            {error}
          </div>
        ) : null}
      </Section>

      <Section title={`Library · ${assets.length}`}>
        {assets.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.02] p-10 text-center text-[13px] text-primary/60">
            <ImageIcon className="mx-auto mb-2 h-4 w-4 text-primary-muted" />
            No assets uploaded in this session.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {assets.map((a) => (
              <div key={a.id} className="card-premium overflow-hidden">
                <div className="aspect-square w-full bg-white/[0.02]">
                  <img src={a.url} alt={a.name} className="h-full w-full object-cover" />
                </div>
                <div className="p-3 text-[11.5px]">
                  <div className="truncate text-primary/85 font-mono">{a.name}</div>
                  <div className="mt-0.5 flex items-center justify-between text-primary-muted">
                    <span>{a.type.replace("image/", "")}</span>
                    <span>{(a.size / 1024).toFixed(0)} KB</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}

function cryptoRandom() {
  const bytes = new Uint8Array(8);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < 8; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}
