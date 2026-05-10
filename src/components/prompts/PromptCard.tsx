"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Copy, Heart, Sparkles } from "lucide-react";
import type { Prompt } from "@/lib/prompts";
import { Badge } from "@/components/ui/Badge";
import { useFavorites } from "@/lib/favorites";
import { useHapticFeedback } from "@/lib/hooks";
import { toast } from "@/components/ui/Toaster";
import { cn } from "@/lib/cn";

/**
 * Magical copy interaction:
 * - instant clipboard write
 * - soft radial pulse from button
 * - micro-particle burst
 * - haptic feedback on supported devices
 * - success toast
 */
export function PromptCard({ prompt, onOpen }: { prompt: Prompt; onOpen?: () => void }) {
  const fav = useFavorites();
  const haptic = useHapticFeedback();
  const [copied, setCopied] = React.useState(false);
  const [pulseKey, setPulseKey] = React.useState(0);

  async function handleCopy(e: React.MouseEvent) {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(prompt.body);
    } catch {
      /* still show feedback */
    }
    setCopied(true);
    setPulseKey((k) => k + 1);
    haptic([8, 20, 10]);
    toast({ title: "Prompt copied", description: prompt.title, tone: "success" });
    window.setTimeout(() => setCopied(false), 1600);
  }

  function handleFavorite(e: React.MouseEvent) {
    e.stopPropagation();
    fav.toggle(prompt.id);
    haptic(8);
  }

  const isFav = fav.has(prompt.id);

  return (
    <motion.article
      layout
      onClick={onOpen}
      className={cn(
        "group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl border border-white/[0.06] bg-ink-800/40",
        "transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
        "hover:-translate-y-0.5 hover:border-white/[0.12] hover:shadow-elev-2"
      )}
    >
      {/* Gradient header canvas */}
      <div className="relative h-40 shrink-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${prompt.gradient[0]}44 0%, ${prompt.gradient[1]}22 60%, #0B1020 100%)`
          }}
        />
        <svg
          className="absolute -right-10 -top-10 h-[280px] w-[280px] opacity-45 transition-all duration-700 group-hover:opacity-70"
          viewBox="0 0 400 400"
          fill="none"
          aria-hidden
        >
          <circle cx="200" cy="200" r="160" stroke={prompt.gradient[0]} strokeOpacity="0.45" />
          <circle cx="200" cy="200" r="110" stroke={prompt.gradient[1]} strokeOpacity="0.4" />
          <circle cx="200" cy="200" r="60" stroke="white" strokeOpacity="0.2" />
          <circle cx="360" cy="200" r="3" fill={prompt.gradient[1]} />
          <circle cx="200" cy="40" r="2.5" fill={prompt.gradient[0]} />
        </svg>
        {/* top-right badges */}
        <div className="absolute right-4 top-4 flex gap-1.5">
          {prompt.isNew ? <Badge tone="secondary">New</Badge> : null}
          {prompt.isPro ? (
            <Badge tone="accent">
              <Sparkles className="h-2.5 w-2.5" />
              Pro
            </Badge>
          ) : null}
        </div>
        {/* fav button */}
        <button
          onClick={handleFavorite}
          aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
          className={cn(
            "focus-ring absolute left-4 top-4 grid h-9 w-9 place-items-center rounded-full border transition-all duration-300",
            isFav
              ? "border-accent/30 bg-accent/15 text-accent shadow-[0_0_18px_rgba(124,140,255,0.4)]"
              : "border-white/[0.1] bg-black/20 text-white/80 hover:border-white/20 hover:text-white backdrop-blur"
          )}
        >
          <Heart className={cn("h-4 w-4", isFav && "fill-accent")} />
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2">
          <Badge tone="mute">{prompt.category}</Badge>
          {prompt.readTime ? (
            <span className="text-[11px] text-primary-muted/70">{prompt.readTime} read</span>
          ) : null}
        </div>
        <h3 className="mt-3 line-clamp-2 font-display text-[18px] font-medium leading-snug tracking-tight text-primary">
          {prompt.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-[13.5px] leading-relaxed text-primary/60">
          {prompt.description}
        </p>

        <div className="mt-auto pt-5">
          <button
            onClick={handleCopy}
            aria-label="Copy prompt"
            className={cn(
              "focus-ring relative inline-flex h-10 w-full items-center justify-center gap-2 overflow-hidden rounded-full text-[13px] font-medium transition-all",
              copied
                ? "bg-accent-secondary/15 text-accent-secondary shadow-[inset_0_0_0_1px_rgba(92,225,230,0.3)]"
                : "bg-white/[0.04] text-primary/90 hover:bg-white/[0.08] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
            )}
          >
            <AnimatePresence mode="wait" initial={false}>
              {copied ? (
                <motion.span
                  key="copied"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
                  className="inline-flex items-center gap-2"
                >
                  <Check className="h-4 w-4" />
                  Copied to clipboard
                </motion.span>
              ) : (
                <motion.span
                  key="copy"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
                  className="inline-flex items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Copy prompt
                </motion.span>
              )}
            </AnimatePresence>

            {/* Soft pulse */}
            <AnimatePresence>
              {pulseKey > 0 ? (
                <motion.span
                  key={pulseKey}
                  initial={{ opacity: 0.6, scale: 0.3 }}
                  animate={{ opacity: 0, scale: 2.2 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                  className="pointer-events-none absolute inset-0 rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle at center, rgba(92,225,230,0.45), rgba(124,140,255,0.15) 40%, transparent 70%)"
                  }}
                />
              ) : null}
            </AnimatePresence>

            {/* Particle burst */}
            <AnimatePresence>
              {pulseKey > 0 ? (
                <span key={`p-${pulseKey}`} aria-hidden className="pointer-events-none absolute inset-0">
                  {PARTICLES.map((p, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, x: 0, y: 0, scale: 0.4 }}
                      animate={{ opacity: [0, 1, 0], x: p.x, y: p.y, scale: 1 }}
                      transition={{ duration: 0.75, ease: "easeOut", delay: i * 0.015 }}
                      className="absolute left-1/2 top-1/2 h-1 w-1 rounded-full"
                      style={{ background: i % 2 ? "#5CE1E6" : "#7C8CFF", boxShadow: "0 0 6px currentColor" }}
                    />
                  ))}
                </span>
              ) : null}
            </AnimatePresence>
          </button>
        </div>
      </div>
    </motion.article>
  );
}

const PARTICLES = Array.from({ length: 10 }).map((_, i) => {
  const angle = (i / 10) * Math.PI * 2;
  const dist = 34 + Math.random() * 14;
  return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist };
});
