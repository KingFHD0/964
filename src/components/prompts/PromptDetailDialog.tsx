"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, Heart, X, Sparkles } from "lucide-react";
import type { Prompt } from "@/lib/prompts";
import { Badge } from "@/components/ui/Badge";
import { useFavorites } from "@/lib/favorites";
import { useHapticFeedback } from "@/lib/hooks";
import { toast } from "@/components/ui/Toaster";
import { cn } from "@/lib/cn";

export function PromptDetailDialog({
  prompt,
  onClose
}: {
  prompt: Prompt | null;
  onClose: () => void;
}) {
  const fav = useFavorites();
  const haptic = useHapticFeedback();
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (!prompt) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [prompt, onClose]);

  async function copy() {
    if (!prompt) return;
    try {
      await navigator.clipboard.writeText(prompt.body);
    } catch {
      /* ignore */
    }
    setCopied(true);
    haptic([8, 20, 10]);
    toast({ title: "Prompt copied", tone: "success" });
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <AnimatePresence>
      {prompt ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[70] flex items-end justify-center bg-ink-950/70 p-0 backdrop-blur-md md:items-center md:p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 32, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl overflow-hidden rounded-t-[28px] border border-white/[0.08] bg-ink-900/90 shadow-elev-2 md:rounded-[28px]"
            style={{
              background:
                "radial-gradient(80% 100% at 50% 0%, rgba(124,140,255,0.12), transparent 60%), rgba(11,16,32,0.92)"
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="prompt-title"
          >
            {/* Drag indicator on mobile */}
            <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-white/10 md:hidden" />

            <div className="flex items-start justify-between gap-4 p-6 pb-4 md:p-8 md:pb-5">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Badge tone="default">{prompt.category}</Badge>
                  {prompt.isNew ? <Badge tone="secondary">New</Badge> : null}
                  {prompt.isPro ? (
                    <Badge tone="accent">
                      <Sparkles className="h-2.5 w-2.5" /> Pro
                    </Badge>
                  ) : null}
                </div>
                <h2
                  id="prompt-title"
                  className="mt-4 font-display text-[26px] font-medium leading-tight tracking-tight text-grad md:text-[32px]"
                >
                  {prompt.title}
                </h2>
                <p className="mt-2 text-[14px] leading-relaxed text-primary/65">{prompt.description}</p>
              </div>
              <button
                aria-label="Close"
                onClick={onClose}
                className="focus-ring grid h-9 w-9 place-items-center rounded-full border border-white/[0.08] bg-white/[0.03] text-primary/80 hover:border-white/[0.15] hover:text-primary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-6 md:px-8">
              <pre className="whitespace-pre-wrap break-words rounded-2xl border border-white/[0.06] bg-black/30 p-5 font-mono text-[13px] leading-relaxed text-primary/85">
                {prompt.body}
              </pre>
            </div>

            <div className="flex flex-col-reverse items-stretch gap-3 p-6 md:flex-row md:items-center md:justify-between md:p-8">
              <button
                onClick={() => {
                  fav.toggle(prompt.id);
                  haptic(8);
                }}
                className={cn(
                  "focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-full border px-5 text-[13px] font-medium transition-colors",
                  fav.has(prompt.id)
                    ? "border-accent/30 bg-accent/10 text-accent"
                    : "border-white/[0.08] bg-white/[0.03] text-primary/85 hover:border-white/[0.15] hover:text-primary"
                )}
              >
                <Heart className={cn("h-4 w-4", fav.has(prompt.id) && "fill-accent")} />
                {fav.has(prompt.id) ? "Saved" : "Save"}
              </button>

              <button
                onClick={copy}
                className={cn(
                  "focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-full px-6 text-[13.5px] font-medium transition-all",
                  "bg-[linear-gradient(135deg,#7C8CFF_0%,#5CE1E6_100%)] text-white",
                  "shadow-[0_0_0_1px_rgba(255,255,255,0.08)_inset,0_12px_40px_-10px_rgba(124,140,255,0.55)]",
                  "hover:brightness-110"
                )}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied" : "Copy prompt"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
