"use client";

import * as React from "react";
import { ImageIcon, Trash2, Upload } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * ImageUploader — a reusable upload field that:
 *  1. Accepts image files (png, jpg, webp, svg) up to 5 MB
 *  2. Shows a live preview (object URL or provided URL)
 *  3. Returns the data URL string so it can be stored in Zustand/localStorage
 *  4. Works inside admin modals for prompts, ads, tools, articles, etc.
 *
 * Usage:
 *   <ImageUploader value={prompt.imageUrl} onChange={(url) => patch("imageUrl", url)} />
 */

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export function ImageUploader({
  value,
  onChange,
  label = "Image",
  hint,
  className
}: {
  value?: string;
  onChange: (url: string | undefined) => void;
  label?: string;
  hint?: string;
  className?: string;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [dragOver, setDragOver] = React.useState(false);

  function processFile(file: File) {
    setError(null);
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Only PNG, JPG, WebP, and SVG are allowed.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("File must be under 5 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      onChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  function onFiles(files: FileList | null) {
    if (!files || !files[0]) return;
    processFile(files[0]);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    onFiles(e.dataTransfer.files);
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-baseline justify-between">
        <span className="text-[11px] uppercase tracking-[0.18em] text-primary-muted/80">
          {label}
        </span>
        {hint ? <span className="text-[11px] text-primary-muted/70">{hint}</span> : null}
      </div>

      {value ? (
        /* Preview state */
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02]">
          <img
            src={value}
            alt="Uploaded preview"
            className="h-40 w-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-ink-950/90 to-transparent px-4 pb-3 pt-8">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="focus-ring inline-flex h-8 items-center gap-1.5 rounded-full border border-white/[0.12] bg-white/[0.06] px-3 text-[12px] text-primary/90 backdrop-blur-md hover:bg-white/[0.1]"
            >
              <Upload className="h-3 w-3" />
              Replace
            </button>
            <button
              type="button"
              onClick={() => onChange(undefined)}
              className="focus-ring inline-flex h-8 items-center gap-1.5 rounded-full border border-red-400/25 bg-red-500/10 px-3 text-[12px] text-red-200 hover:bg-red-500/20"
            >
              <Trash2 className="h-3 w-3" />
              Remove
            </button>
          </div>
        </div>
      ) : (
        /* Upload state */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-300",
            dragOver
              ? "border-accent/50 bg-accent/5"
              : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.15] hover:bg-white/[0.03]"
          )}
        >
          <div
            className={cn(
              "grid h-12 w-12 place-items-center rounded-2xl border border-white/[0.08] transition-colors",
              dragOver ? "bg-accent/15 text-accent" : "bg-white/[0.03] text-primary/60 group-hover:text-primary/80"
            )}
          >
            <ImageIcon className="h-5 w-5" />
          </div>
          <div className="mt-3 text-[13px] text-primary/80">
            {dragOver ? "Drop to upload" : "Click or drag an image here"}
          </div>
          <div className="mt-1 text-[11.5px] text-primary-muted/70">
            PNG · JPG · WebP · SVG · max 5 MB
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_TYPES.join(",")}
        className="hidden"
        onChange={(e) => onFiles(e.target.files)}
      />

      {error ? (
        <div className="rounded-xl border border-amber-400/25 bg-amber-500/10 px-3 py-2 text-[12px] text-amber-200">
          {error}
        </div>
      ) : null}
    </div>
  );
}
