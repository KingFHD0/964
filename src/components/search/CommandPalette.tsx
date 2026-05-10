"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  BookMarked,
  Cpu,
  Globe,
  GraduationCap,
  Rocket,
  Search,
  Sparkles,
  Wrench,
  Zap
} from "lucide-react";
import { buildSearchIndex, rankResults } from "@/lib/search-index";
import type { SearchResult, SearchResultKind } from "@/lib/ecosystem";
import { useContentStore } from "@/lib/store/content-store";
import { cn } from "@/lib/cn";

/**
 * Universal Cmd+K palette — searches prompts, tools, models, articles,
 * courses, workflows, guides, and news.
 *
 * Keyboard:
 *  - Cmd/Ctrl + K → open
 *  - Esc → close
 *  - ↑ / ↓ → navigate
 *  - Enter → open
 */
const ICON_BY_KIND: Record<SearchResultKind, React.ComponentType<{ className?: string }>> = {
  prompt: BookMarked,
  tool: Wrench,
  model: Cpu,
  article: BookOpen,
  course: GraduationCap,
  workflow: Rocket,
  guide: Sparkles,
  news: Globe
};

const LABEL_BY_KIND: Record<SearchResultKind, string> = {
  prompt: "Prompt",
  tool: "Tool",
  model: "Model",
  article: "Article",
  course: "Course",
  workflow: "Workflow",
  guide: "Guide",
  news: "News"
};

const QUICK_LINKS: { label: string; href: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { label: "Prompt Library", href: "/library", icon: BookMarked },
  { label: "AI Tools", href: "/tools", icon: Wrench },
  { label: "AI Models", href: "/models", icon: Cpu },
  { label: "Encyclopedia", href: "/encyclopedia", icon: BookOpen },
  { label: "Workflows", href: "/workflows", icon: Rocket },
  { label: "Courses", href: "/courses", icon: GraduationCap },
  { label: "News", href: "/news", icon: Globe },
  { label: "Automations", href: "/automation", icon: Zap }
];

export function CommandPalette({
  open,
  onOpenChange
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [active, setActive] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);

  // Pull live arrays from the content store individually (stable references).
  const prompts = useContentStore((s) => s.prompts);
  const tools = useContentStore((s) => s.tools);
  const models = useContentStore((s) => s.models);
  const articles = useContentStore((s) => s.articles);
  const courses = useContentStore((s) => s.courses);
  const workflows = useContentStore((s) => s.workflows);
  const guides = useContentStore((s) => s.guides);
  const news = useContentStore((s) => s.news);

  const index = React.useMemo(
    () => buildSearchIndex({ prompts, tools, models, articles, courses, workflows, guides, news }),
    [prompts, tools, models, articles, courses, workflows, guides, news]
  );
  const results = React.useMemo(() => rankResults(query, index), [query, index]);

  React.useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      window.setTimeout(() => inputRef.current?.focus(), 10);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  React.useEffect(() => {
    setActive(0);
  }, [query]);

  const onSelect = React.useCallback(
    (r: SearchResult) => {
      onOpenChange(false);
      router.push(r.href);
    },
    [onOpenChange, router]
  );

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Escape") {
      onOpenChange(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const r = results[active];
      if (r) onSelect(r);
    }
  }

  React.useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${active}"]`);
    if (el) el.scrollIntoView({ block: "nearest" });
  }, [active]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={() => onOpenChange(false)}
          onKeyDown={onKeyDown}
          className="fixed inset-0 z-[80] flex items-start justify-center bg-ink-950/70 px-4 pt-[12vh] backdrop-blur-[10px]"
        >
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.985 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-white/[0.08] bg-[linear-gradient(180deg,rgba(17,24,39,0.92),rgba(11,16,32,0.95))] shadow-elev-3 backdrop-blur-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
          >
            {/* Ambient sheen */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-70"
              style={{
                background:
                  "radial-gradient(100% 60% at 50% 0%, rgba(124,140,255,0.14), transparent 60%)"
              }}
            />

            <div className="relative flex items-center gap-3 px-5 pt-4">
              <Search className="h-4 w-4 text-primary-muted" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search prompts, tools, models, articles, news…"
                className="h-11 w-full bg-transparent text-[15px] text-primary outline-none placeholder:text-primary-muted/60"
                aria-label="Search Aether"
              />
              <button
                onClick={() => onOpenChange(false)}
                className="rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-1 text-[10.5px] text-primary-muted hover:text-primary"
              >
                Esc
              </button>
            </div>

            <div className="relative mt-2 hairline" />

            {/* Quick links when no query */}
            {!query ? (
              <div className="relative px-3 py-3">
                <div className="px-2 py-1 text-[10.5px] uppercase tracking-[0.22em] text-primary-muted/80">
                  Quick access
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {QUICK_LINKS.map((q) => (
                    <button
                      key={q.href}
                      onClick={() => {
                        onOpenChange(false);
                        router.push(q.href);
                      }}
                      className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13.5px] text-primary/85 transition-colors hover:bg-white/[0.04] hover:text-primary"
                    >
                      <span className="grid h-7 w-7 place-items-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-accent">
                        <q.icon className="h-3.5 w-3.5" />
                      </span>
                      <span className="flex-1 truncate">{q.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <ul
                ref={listRef}
                className="relative max-h-[52vh] overflow-y-auto p-2 no-scrollbar"
                role="listbox"
              >
                {results.length === 0 ? (
                  <li className="px-4 py-10 text-center text-[13px] text-primary-muted">
                    No results for "{query}"
                  </li>
                ) : (
                  results.map((r, i) => {
                    const Icon = ICON_BY_KIND[r.kind];
                    const isActive = i === active;
                    return (
                      <li key={r.id} data-idx={i} role="option" aria-selected={isActive}>
                        <button
                          onMouseEnter={() => setActive(i)}
                          onClick={() => onSelect(r)}
                          className={cn(
                            "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                            isActive
                              ? "bg-white/[0.05] text-primary"
                              : "text-primary/85 hover:bg-white/[0.03]"
                          )}
                        >
                          <span
                            className={cn(
                              "grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-white/[0.08] transition-colors",
                              isActive ? "bg-accent/12 text-accent" : "bg-white/[0.03] text-primary/70"
                            )}
                          >
                            <Icon className="h-3.5 w-3.5" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="truncate text-[13.5px] font-medium">{r.title}</span>
                            </div>
                            <div className="mt-0.5 line-clamp-1 text-[12px] text-primary/55">
                              {r.description}
                            </div>
                          </div>
                          <span className="hidden shrink-0 items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 text-[10.5px] uppercase tracking-[0.16em] text-primary-muted sm:inline-flex">
                            {LABEL_BY_KIND[r.kind]}
                          </span>
                        </button>
                      </li>
                    );
                  })
                )}
              </ul>
            )}

            <div className="relative hairline" />
            <div className="relative flex items-center justify-between px-4 py-2.5 text-[11px] text-primary-muted">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1">
                  <kbd className="rounded border border-white/[0.08] bg-white/[0.03] px-1.5 py-0.5 font-mono text-[10px]">↑↓</kbd>
                  navigate
                </span>
                <span className="inline-flex items-center gap-1">
                  <kbd className="rounded border border-white/[0.08] bg-white/[0.03] px-1.5 py-0.5 font-mono text-[10px]">↵</kbd>
                  open
                </span>
              </div>
              <span className="hidden items-center gap-1 sm:inline-flex">
                <Sparkles className="h-3 w-3 text-accent-secondary" />
                Aether search
              </span>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/**
 * CommandPaletteProvider — mounts the palette globally and captures ⌘K/Ctrl+K.
 * Also exposes a helper via `window.__aetherOpenPalette()` for other components.
 */
declare global {
  interface Window {
    __aetherOpenPalette?: () => void;
  }
}

export function CommandPaletteProvider() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    window.__aetherOpenPalette = () => setOpen(true);
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      delete window.__aetherOpenPalette;
    };
  }, []);

  return <CommandPalette open={open} onOpenChange={setOpen} />;
}
