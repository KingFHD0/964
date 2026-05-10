"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info, AlertTriangle } from "lucide-react";

type Tone = "success" | "info" | "warn";
type Toast = { id: number; title: string; description?: string; tone: Tone };

type ToastFn = (t: Omit<Toast, "id">) => void;

declare global {
  interface Window {
    __aetherToast?: ToastFn;
  }
}

export function toast(t: Omit<Toast, "id"> | string) {
  if (typeof window === "undefined" || !window.__aetherToast) return;
  if (typeof t === "string") return window.__aetherToast({ title: t, tone: "success" });
  window.__aetherToast(t);
}

export function Toaster() {
  const [items, setItems] = React.useState<Toast[]>([]);
  React.useEffect(() => {
    window.__aetherToast = (t) => {
      const id = Date.now() + Math.random();
      setItems((prev) => [...prev, { id, ...t }]);
      window.setTimeout(() => {
        setItems((prev) => prev.filter((x) => x.id !== id));
      }, 3200);
    };
    return () => {
      delete window.__aetherToast;
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-20 z-[80] flex flex-col items-center gap-2 px-4 md:bottom-8">
      <AnimatePresence initial={false}>
        {items.map((t) => {
          const Icon = t.tone === "success" ? CheckCircle2 : t.tone === "warn" ? AlertTriangle : Info;
          const color =
            t.tone === "success"
              ? "text-accent-secondary"
              : t.tone === "warn"
              ? "text-amber-300"
              : "text-accent";
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 420, damping: 32 }}
              className="pointer-events-auto flex min-w-[240px] max-w-[92vw] items-start gap-3 rounded-2xl glass-strong px-4 py-3 shadow-elev-2"
            >
              <Icon className={`mt-0.5 h-4 w-4 ${color}`} />
              <div className="flex-1">
                <div className="text-sm font-medium text-primary">{t.title}</div>
                {t.description ? (
                  <div className="mt-0.5 text-xs text-primary-muted">{t.description}</div>
                ) : null}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
