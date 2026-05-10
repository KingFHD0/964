"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

/* ───────────── PageHeader ───────────── */

export function PageHeader({
  eyebrow,
  title,
  description,
  actions
}: {
  eyebrow: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="flex flex-col gap-5 border-b border-white/[0.05] pb-8 md:flex-row md:items-end md:justify-between">
      <div>
        <div className="text-[11px] uppercase tracking-[0.22em] text-primary-muted/80">{eyebrow}</div>
        <h1 className="mt-3 font-display text-display-sm font-medium tracking-tight text-grad">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-primary/60">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}

/* ───────────── KpiCard ───────────── */

export function KpiCard({
  label,
  value,
  delta,
  icon: Icon,
  tone = "accent"
}: {
  label: string;
  value: string;
  delta?: { value: string; positive?: boolean; caption?: string };
  icon?: LucideIcon;
  tone?: "accent" | "secondary" | "mute";
}) {
  const toneColor =
    tone === "accent"
      ? "text-accent"
      : tone === "secondary"
      ? "text-accent-secondary"
      : "text-primary-muted";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
      className="card-premium relative p-5"
    >
      <div className="flex items-center justify-between">
        <div className="text-[11px] uppercase tracking-[0.2em] text-primary-muted">{label}</div>
        {Icon ? <Icon className={cn("h-3.5 w-3.5", toneColor)} /> : null}
      </div>
      <div className="mt-4 font-display text-[28px] font-medium tracking-tight text-primary">
        {value}
      </div>
      {delta ? (
        <div className="mt-1 flex items-center gap-1.5 text-[12px]">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10.5px] font-medium",
              delta.positive
                ? "border-accent-secondary/25 bg-accent-secondary/10 text-accent-secondary"
                : "border-amber-400/25 bg-amber-500/10 text-amber-300"
            )}
          >
            {delta.positive ? (
              <ArrowUpRight className="h-2.5 w-2.5" />
            ) : (
              <ArrowDownRight className="h-2.5 w-2.5" />
            )}
            {delta.value}
          </span>
          {delta.caption ? (
            <span className="text-primary/55">{delta.caption}</span>
          ) : null}
        </div>
      ) : null}
    </motion.div>
  );
}

/* ───────────── Section ───────────── */

export function Section({
  title,
  description,
  actions,
  className,
  children
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("mt-12", className)}>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-[18px] font-medium tracking-tight text-primary">
            {title}
          </h2>
          {description ? (
            <p className="mt-1 text-[13px] text-primary/60">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
      {children}
    </section>
  );
}

/* ───────────── Toolbar ───────────── */

export function Toolbar({
  search,
  onSearch,
  placeholder = "Search…",
  children
}: {
  search: string;
  onSearch: (v: string) => void;
  placeholder?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="flex h-11 flex-1 items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 transition-colors focus-within:border-accent/40 focus-within:bg-white/[0.05] focus-within:shadow-glow-xs">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-primary-muted/80">
          <path
            d="M21 21l-4.3-4.3m2.3-5.2a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={placeholder}
          className="h-full w-full bg-transparent text-[13.5px] text-primary outline-none placeholder:text-primary-muted/60"
        />
      </div>
      {children ? <div className="flex flex-wrap items-center gap-2">{children}</div> : null}
    </div>
  );
}

/* ───────────── StatusDot ───────────── */

export function StatusDot({
  tone,
  children
}: {
  tone: "ok" | "warn" | "danger" | "info";
  children: React.ReactNode;
}) {
  const [bg, glow, color] =
    tone === "ok"
      ? ["bg-accent-secondary", "rgba(92,225,230,0.6)", "text-accent-secondary"]
      : tone === "warn"
      ? ["bg-amber-300", "rgba(252,211,77,0.5)", "text-amber-300"]
      : tone === "danger"
      ? ["bg-red-400", "rgba(248,113,113,0.5)", "text-red-300"]
      : ["bg-accent", "rgba(124,140,255,0.55)", "text-accent"];
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[11.5px]", color)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", bg)} style={{ boxShadow: `0 0 8px ${glow}` }} />
      {children}
    </span>
  );
}

/* ───────────── DataTable (tiny, headless) ───────────── */

export type Column<T> = {
  key: keyof T | string;
  label: string;
  className?: string;
  render?: (row: T) => React.ReactNode;
  align?: "left" | "right" | "center";
};

export function DataTable<T extends { id: string }>({
  columns,
  rows,
  empty,
  onRowClick
}: {
  columns: Column<T>[];
  rows: T[];
  empty?: React.ReactNode;
  onRowClick?: (row: T) => void;
}) {
  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.02] p-10 text-center text-[13px] text-primary/60">
        {empty ?? "Nothing here yet."}
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-ink-800/40">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-white/[0.04] text-[10.5px] uppercase tracking-[0.18em] text-primary-muted">
              {columns.map((c) => (
                <th
                  key={String(c.key)}
                  className={cn(
                    "px-4 py-3 font-normal",
                    c.align === "right" && "text-right",
                    c.align === "center" && "text-center",
                    c.className
                  )}
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  "border-b border-white/[0.04] last:border-b-0 transition-colors",
                  onRowClick && "cursor-pointer",
                  "hover:bg-white/[0.025]"
                )}
              >
                {columns.map((c) => (
                  <td
                    key={String(c.key)}
                    className={cn(
                      "px-4 py-3 text-primary/85",
                      c.align === "right" && "text-right",
                      c.align === "center" && "text-center",
                      c.className
                    )}
                  >
                    {c.render ? c.render(row) : String((row as any)[c.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ───────────── Modal ───────────── */

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md"
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const width = size === "sm" ? "max-w-md" : size === "lg" ? "max-w-3xl" : "max-w-xl";

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-ink-950/70 p-4 backdrop-blur-[6px]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 360, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "w-full overflow-hidden rounded-[28px] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(17,24,39,0.92),rgba(11,16,32,0.95))] shadow-elev-3 backdrop-blur-2xl",
          width
        )}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(100% 60% at 50% 0%, rgba(124,140,255,0.14), transparent 60%)"
          }}
        />
        <div className="relative flex items-start justify-between gap-4 px-6 pt-6">
          <div>
            <h3 className="font-display text-[18px] font-medium tracking-tight text-primary">
              {title}
            </h3>
            {description ? (
              <p className="mt-1 text-[13px] text-primary/60">{description}</p>
            ) : null}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="focus-ring grid h-8 w-8 place-items-center rounded-full text-primary-muted hover:bg-white/[0.05] hover:text-primary"
          >
            ×
          </button>
        </div>
        <div className="relative hairline mt-5" />
        <div className="relative px-6 py-5">{children}</div>
        {footer ? (
          <>
            <div className="relative hairline" />
            <div className="relative flex items-center justify-end gap-2 px-6 py-4">{footer}</div>
          </>
        ) : null}
      </motion.div>
    </div>
  );
}

/* ───────────── Labelled field ───────────── */

export function Field({
  label,
  hint,
  children
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="text-[11px] uppercase tracking-[0.18em] text-primary-muted/80">
          {label}
        </span>
        {hint ? <span className="text-[11px] text-primary-muted/70">{hint}</span> : null}
      </div>
      {children}
    </label>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "h-11 w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 text-[14px] text-primary outline-none transition-colors placeholder:text-primary-muted/60 focus:border-accent/40 focus:bg-white/[0.05]",
        props.className
      )}
    />
  );
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-[14px] text-primary outline-none transition-colors placeholder:text-primary-muted/60 focus:border-accent/40 focus:bg-white/[0.05]",
        props.className
      )}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "h-11 w-full rounded-2xl border border-white/[0.08] bg-ink-900 px-4 text-[14px] text-primary outline-none transition-colors focus:border-accent/40",
        props.className
      )}
    />
  );
}

export function ToggleRow({
  label,
  description,
  checked,
  onChange
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-6 py-3">
      <div>
        <div className="text-[14px] text-primary">{label}</div>
        {description ? <div className="mt-0.5 text-[12.5px] text-primary/60">{description}</div> : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "focus-ring relative h-6 w-11 shrink-0 rounded-full transition-colors",
          checked ? "bg-grad-cta" : "bg-white/10"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
            checked ? "left-[22px] shadow-[0_0_12px_rgba(124,140,255,0.6)]" : "left-0.5"
          )}
        />
      </button>
    </div>
  );
}
