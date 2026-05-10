"use client";

/**
 * Content Store — single source of truth for all user-editable content on Aether 964.
 *
 * - Zustand with localStorage persistence (no backend required for the demo).
 * - Seeds from the curated ecosystem data on first load so the site isn't empty.
 * - Admin pages write here; public pages read from here.
 * - All mutations go through narrow setters for type safety + future auditability.
 *
 * Security note:
 *  - This store is client-side only. In production, every mutation must also hit
 *    a server API with strict RBAC and Zod validation (see /api/admin/*).
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { PROMPTS as SEED_PROMPTS, type Prompt } from "@/lib/prompts";
import {
  TOOLS as SEED_TOOLS,
  MODELS as SEED_MODELS,
  ARTICLES as SEED_ARTICLES,
  COURSES as SEED_COURSES,
  WORKFLOWS as SEED_WORKFLOWS,
  GUIDES as SEED_GUIDES,
  NEWS as SEED_NEWS,
  BUSINESS_SYSTEMS as SEED_BUSINESS,
  AUTOMATIONS as SEED_AUTOMATIONS,
  type AiTool,
  type AiModel,
  type Article,
  type Course,
  type Workflow,
  type Guide,
  type NewsItem,
  type BusinessSystem,
  type Automation
} from "@/lib/ecosystem";

/* ─────────────────────────────── Visual + Homepage + Ads types ─────────────── */

export type ThemeSettings = {
  accent: string;           // hex
  accentSecondary: string;  // hex
  blurIntensity: number;    // 0-40 px
  glowIntensity: number;    // 0-1
  particles: boolean;
  earth: boolean;
  motion: boolean;
  grainOpacity: number;     // 0-0.1
};

export type HomepageBlockKind =
  | "hero"
  | "ecosystem"
  | "features"
  | "categories"
  | "pricing"
  | "cta"
  | "sponsor";

export type HomepageBlock = {
  id: string;
  kind: HomepageBlockKind;
  enabled: boolean;
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export type HomepageContent = {
  heroLabel: string;
  heroTitleA: string;
  heroTitleB: string;
  heroSubtitle: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  stats: string[]; // ticker strip
  blocks: HomepageBlock[];
};

export type SeoSettings = {
  title: string;
  description: string;
  ogImage?: string;
  twitter: string;
  keywords: string[];
};

export type AdPlacement =
  | "landing-hero"
  | "landing-mid"
  | "dashboard-top"
  | "tools-inline"
  | "encyclopedia-aside"
  | "news-inline"
  | "community-aside";

export type AdKind = "sponsor-card" | "banner" | "native-article" | "featured";

export type Ad = {
  id: string;
  kind: AdKind;
  placement: AdPlacement;
  title: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  sponsor: string;
  imageUrl?: string;
  accent: [string, string];
  enabled: boolean;
  impressions: number;
  clicks: number;
  startDate?: string;
  endDate?: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  plan: "Orbit" | "Supernova" | "Free";
  role: "super_admin" | "admin" | "moderator" | "premium_user" | "standard_user";
  status: "active" | "suspended" | "pending";
  createdAt: string;
  lastActive: string;
  mrrContribution: number;
};

export type AdminLog = {
  id: string;
  actor: string;
  action: string;
  target?: string;
  ts: string;
  severity: "info" | "warn" | "critical";
  ip?: string;
};

export type NotificationTemplate = {
  id: string;
  title: string;
  body: string;
  audience: "all" | "supernova" | "orbit" | "admins";
  scheduled?: string;
  status: "draft" | "scheduled" | "sent";
  sentCount?: number;
};

/* ─────────────────────────────── Default content ──────────────────────────── */

const DEFAULT_THEME: ThemeSettings = {
  accent: "#7C8CFF",
  accentSecondary: "#5CE1E6",
  blurIntensity: 22,
  glowIntensity: 0.6,
  particles: true,
  earth: false,
  motion: true,
  grainOpacity: 0.04
};

const DEFAULT_HOMEPAGE: HomepageContent = {
  heroLabel: "The AI operating system for the Middle East",
  heroTitleA: "Create at the",
  heroTitleB: "speed of light.",
  heroSubtitle:
    "Prompts, tools, models, workflows, and knowledge — one premium surface, calibrated for founders, creators, and studios who move at cinematic pace.",
  primaryCta: { label: "Enter Aether", href: "/dashboard" },
  secondaryCta: { label: "Explore the ecosystem", href: "#ecosystem" },
  stats: ["Built in Baghdad", "12,000+ prompts", "Arabic native", "Offline-ready"],
  blocks: [
    { id: "b-hero", kind: "hero", enabled: true },
    { id: "b-eco", kind: "ecosystem", enabled: true },
    { id: "b-sponsor-1", kind: "sponsor", enabled: true, title: "Featured AI partner" },
    { id: "b-features", kind: "features", enabled: true },
    { id: "b-categories", kind: "categories", enabled: true },
    { id: "b-pricing", kind: "pricing", enabled: true },
    { id: "b-cta", kind: "cta", enabled: true }
  ]
};

const DEFAULT_SEO: SeoSettings = {
  title: "Aether 964 — Create at the speed of light",
  description:
    "The AI operating system for the Middle East. Prompts, tools, models, and workflows on one premium surface.",
  twitter: "@aether964",
  keywords: [
    "AI",
    "prompt library",
    "Iraqi AI",
    "Arabic AI",
    "AI tools",
    "AI models"
  ]
};

const DEFAULT_ADS: Ad[] = [
  {
    id: "ad-1",
    kind: "sponsor-card",
    placement: "landing-mid",
    title: "Midjourney for studios",
    body:
      "The cinematic image generator used by art directors from Baghdad to Tokyo. Start with a 30-day studio trial.",
    ctaLabel: "Start trial",
    ctaHref: "https://midjourney.com",
    sponsor: "Midjourney",
    accent: ["#7C8CFF", "#EC4899"],
    enabled: true,
    impressions: 12408,
    clicks: 612
  },
  {
    id: "ad-2",
    kind: "sponsor-card",
    placement: "tools-inline",
    title: "Runway — cinematic video AI",
    body: "Text-to-video and camera-controlled generation. Built for filmmakers, not hobbyists.",
    ctaLabel: "Try Runway",
    ctaHref: "https://runwayml.com",
    sponsor: "Runway",
    accent: ["#5CE1E6", "#7C8CFF"],
    enabled: true,
    impressions: 8021,
    clicks: 344
  },
  {
    id: "ad-3",
    kind: "native-article",
    placement: "encyclopedia-aside",
    title: "Claude for editorial teams",
    body:
      "How five magazines in the Gulf replaced their drafting stack with Claude — a case study.",
    ctaLabel: "Read case study",
    ctaHref: "#",
    sponsor: "Anthropic",
    accent: ["#F59E0B", "#7C8CFF"],
    enabled: true,
    impressions: 4412,
    clicks: 218
  },
  {
    id: "ad-4",
    kind: "featured",
    placement: "news-inline",
    title: "ElevenLabs — Arabic in beta",
    body: "Cinematic Arabic and Iraqi-dialect voices, now in invite-only studio beta.",
    ctaLabel: "Request access",
    ctaHref: "https://elevenlabs.io",
    sponsor: "ElevenLabs",
    accent: ["#EC4899", "#5CE1E6"],
    enabled: true,
    impressions: 2204,
    clicks: 155
  }
];

const SEED_USERS: User[] = [
  {
    id: "u-001",
    name: "Ahmed M.",
    email: "ahmed@aether964.com",
    plan: "Supernova",
    role: "super_admin",
    status: "active",
    createdAt: "2025-11-02",
    lastActive: "2026-05-10",
    mrrContribution: 29
  },
  {
    id: "u-002",
    name: "Layla H.",
    email: "layla@studio.iq",
    plan: "Supernova",
    role: "moderator",
    status: "active",
    createdAt: "2026-01-14",
    lastActive: "2026-05-10",
    mrrContribution: 29
  },
  {
    id: "u-003",
    name: "Omar J.",
    email: "omar@baghdad.dev",
    plan: "Orbit",
    role: "premium_user",
    status: "active",
    createdAt: "2026-02-18",
    lastActive: "2026-05-09",
    mrrContribution: 9
  },
  {
    id: "u-004",
    name: "Nadia R.",
    email: "nadia.r@gmail.com",
    plan: "Free",
    role: "standard_user",
    status: "active",
    createdAt: "2026-03-22",
    lastActive: "2026-05-07",
    mrrContribution: 0
  },
  {
    id: "u-005",
    name: "Karim S.",
    email: "karim@restaurant.iq",
    plan: "Orbit",
    role: "premium_user",
    status: "suspended",
    createdAt: "2026-01-30",
    lastActive: "2026-04-14",
    mrrContribution: 0
  },
  {
    id: "u-006",
    name: "Sara T.",
    email: "sara.t@brand.ae",
    plan: "Supernova",
    role: "admin",
    status: "active",
    createdAt: "2025-12-09",
    lastActive: "2026-05-10",
    mrrContribution: 29
  }
];

const SEED_LOGS: AdminLog[] = [
  { id: "l-1", actor: "Ahmed M.", action: "Updated homepage hero subtitle", ts: "2026-05-10 11:22", severity: "info", ip: "185.48.22.11" },
  { id: "l-2", actor: "Ahmed M.", action: "Published news: GPT-5 ships with 1M-token context", ts: "2026-05-10 10:58", severity: "info", ip: "185.48.22.11" },
  { id: "l-3", actor: "system", action: "Rate-limit triggered on /api/prompts/copy (client 41.x.x.x)", ts: "2026-05-10 10:31", severity: "warn" },
  { id: "l-4", actor: "Sara T.", action: "Promoted user u-003 to premium_user", ts: "2026-05-10 09:12", severity: "info", ip: "94.187.9.3" },
  { id: "l-5", actor: "system", action: "Failed admin login attempt (IP 41.208.71.9)", ts: "2026-05-10 08:02", severity: "critical", ip: "41.208.71.9" },
  { id: "l-6", actor: "Ahmed M.", action: "Enabled ad placement tools-inline (Runway)", ts: "2026-05-09 22:17", severity: "info", ip: "185.48.22.11" },
  { id: "l-7", actor: "Layla H.", action: "Edited article: prompt-engineering-principles", ts: "2026-05-09 18:40", severity: "info", ip: "185.48.22.31" }
];

const SEED_NOTIFS: NotificationTemplate[] = [
  {
    id: "n-tmpl-1",
    title: "New drop: Iraqi dialect pack v2",
    body: "48 cinematic captions, now in the library. Tap to explore.",
    audience: "all",
    status: "sent",
    sentCount: 4214
  },
  {
    id: "n-tmpl-2",
    title: "Supernova — team seats are here",
    body: "Invite up to 5 collaborators with shared favorites and drops.",
    audience: "supernova",
    status: "sent",
    sentCount: 812
  },
  {
    id: "n-tmpl-3",
    title: "Weekly digest · May 10",
    body: "5 new prompts, 2 new tools, 1 new article waiting for you.",
    audience: "all",
    status: "scheduled",
    scheduled: "2026-05-17 09:00"
  }
];

/* ─────────────────────────────── Store shape ──────────────────────────────── */

export type ContentStore = {
  /* content */
  prompts: Prompt[];
  tools: AiTool[];
  models: AiModel[];
  articles: Article[];
  courses: Course[];
  workflows: Workflow[];
  guides: Guide[];
  news: NewsItem[];
  businessSystems: BusinessSystem[];
  automations: Automation[];

  /* visual + homepage + seo */
  theme: ThemeSettings;
  homepage: HomepageContent;
  seo: SeoSettings;

  /* admin-only */
  ads: Ad[];
  users: User[];
  logs: AdminLog[];
  notifications: NotificationTemplate[];

  /* setters */
  setPrompts: (next: Prompt[]) => void;
  upsertPrompt: (p: Prompt) => void;
  removePrompt: (id: string) => void;

  setTools: (next: AiTool[]) => void;
  upsertTool: (t: AiTool) => void;
  removeTool: (id: string) => void;

  setArticles: (next: Article[]) => void;
  upsertArticle: (a: Article) => void;
  removeArticle: (id: string) => void;

  setNews: (next: NewsItem[]) => void;
  upsertNews: (n: NewsItem) => void;
  removeNews: (id: string) => void;

  setCourses: (next: Course[]) => void;
  upsertCourse: (c: Course) => void;
  removeCourse: (id: string) => void;

  setTheme: (next: Partial<ThemeSettings>) => void;
  setHomepage: (next: Partial<HomepageContent>) => void;
  setHomepageBlocks: (blocks: HomepageBlock[]) => void;
  setSeo: (next: Partial<SeoSettings>) => void;

  setAds: (next: Ad[]) => void;
  upsertAd: (a: Ad) => void;
  removeAd: (id: string) => void;
  trackAdImpression: (id: string) => void;
  trackAdClick: (id: string) => void;

  setUsers: (next: User[]) => void;
  upsertUser: (u: User) => void;
  removeUser: (id: string) => void;
  suspendUser: (id: string) => void;

  logEvent: (entry: Omit<AdminLog, "id" | "ts">) => void;

  upsertNotification: (n: NotificationTemplate) => void;
  removeNotification: (id: string) => void;

  resetToDefaults: () => void;
};

const initial = () => ({
  prompts: [...SEED_PROMPTS],
  tools: [...SEED_TOOLS],
  models: [...SEED_MODELS],
  articles: [...SEED_ARTICLES],
  courses: [...SEED_COURSES],
  workflows: [...SEED_WORKFLOWS],
  guides: [...SEED_GUIDES],
  news: [...SEED_NEWS],
  businessSystems: [...SEED_BUSINESS],
  automations: [...SEED_AUTOMATIONS],
  theme: { ...DEFAULT_THEME },
  homepage: { ...DEFAULT_HOMEPAGE, blocks: [...DEFAULT_HOMEPAGE.blocks] },
  seo: { ...DEFAULT_SEO, keywords: [...DEFAULT_SEO.keywords] },
  ads: [...DEFAULT_ADS],
  users: [...SEED_USERS],
  logs: [...SEED_LOGS],
  notifications: [...SEED_NOTIFS]
});

export const useContentStore = create<ContentStore>()(
  persist(
    (set, get) => ({
      ...initial(),

      setPrompts: (next) => set({ prompts: next }),
      upsertPrompt: (p) =>
        set({
          prompts: upsert(get().prompts, p, (x) => x.id)
        }),
      removePrompt: (id) => set({ prompts: get().prompts.filter((x) => x.id !== id) }),

      setTools: (next) => set({ tools: next }),
      upsertTool: (t) => set({ tools: upsert(get().tools, t, (x) => x.id) }),
      removeTool: (id) => set({ tools: get().tools.filter((x) => x.id !== id) }),

      setArticles: (next) => set({ articles: next }),
      upsertArticle: (a) => set({ articles: upsert(get().articles, a, (x) => x.id) }),
      removeArticle: (id) => set({ articles: get().articles.filter((x) => x.id !== id) }),

      setNews: (next) => set({ news: next }),
      upsertNews: (n) => set({ news: upsert(get().news, n, (x) => x.id) }),
      removeNews: (id) => set({ news: get().news.filter((x) => x.id !== id) }),

      setCourses: (next) => set({ courses: next }),
      upsertCourse: (c) => set({ courses: upsert(get().courses, c, (x) => x.id) }),
      removeCourse: (id) => set({ courses: get().courses.filter((x) => x.id !== id) }),

      setTheme: (next) => set({ theme: { ...get().theme, ...next } }),
      setHomepage: (next) => set({ homepage: { ...get().homepage, ...next } }),
      setHomepageBlocks: (blocks) => set({ homepage: { ...get().homepage, blocks } }),
      setSeo: (next) => set({ seo: { ...get().seo, ...next } }),

      setAds: (next) => set({ ads: next }),
      upsertAd: (a) => set({ ads: upsert(get().ads, a, (x) => x.id) }),
      removeAd: (id) => set({ ads: get().ads.filter((x) => x.id !== id) }),
      trackAdImpression: (id) =>
        set({
          ads: get().ads.map((a) =>
            a.id === id ? { ...a, impressions: a.impressions + 1 } : a
          )
        }),
      trackAdClick: (id) =>
        set({
          ads: get().ads.map((a) => (a.id === id ? { ...a, clicks: a.clicks + 1 } : a))
        }),

      setUsers: (next) => set({ users: next }),
      upsertUser: (u) => set({ users: upsert(get().users, u, (x) => x.id) }),
      removeUser: (id) => set({ users: get().users.filter((x) => x.id !== id) }),
      suspendUser: (id) =>
        set({
          users: get().users.map((u) =>
            u.id === id
              ? { ...u, status: u.status === "suspended" ? "active" : "suspended" }
              : u
          )
        }),

      logEvent: (entry) =>
        set({
          logs: [
            {
              id: `l-${Date.now()}`,
              ts: new Date().toISOString().replace("T", " ").slice(0, 16),
              ...entry
            },
            ...get().logs
          ].slice(0, 120)
        }),

      upsertNotification: (n) =>
        set({ notifications: upsert(get().notifications, n, (x) => x.id) }),
      removeNotification: (id) =>
        set({ notifications: get().notifications.filter((x) => x.id !== id) }),

      resetToDefaults: () => set(initial())
    }),
    {
      name: "aether.content.v1",
      version: 2,
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? window.localStorage : (undefined as any)
      ),
      // Only persist what should survive reloads on a demo — skip transient.
      partialize: (s) => ({
        prompts: s.prompts,
        tools: s.tools,
        models: s.models,
        articles: s.articles,
        courses: s.courses,
        workflows: s.workflows,
        guides: s.guides,
        news: s.news,
        businessSystems: s.businessSystems,
        automations: s.automations,
        theme: s.theme,
        homepage: s.homepage,
        seo: s.seo,
        ads: s.ads,
        users: s.users,
        logs: s.logs,
        notifications: s.notifications
      })
    }
  )
);

/* Helpers */
function upsert<T>(arr: T[], next: T, key: (x: T) => string): T[] {
  const k = key(next);
  const idx = arr.findIndex((x) => key(x) === k);
  if (idx === -1) return [next, ...arr];
  const copy = arr.slice();
  copy[idx] = next;
  return copy;
}
