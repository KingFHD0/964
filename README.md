# Aether 964

Premium AI Prompt-as-a-Service platform for the Middle East.

> "Quiet technology from the future."

A funded-startup-grade frontend experience, designed and engineered end to end: cinematic landing, dashboard, curated prompt library, favorites, community, billing, settings, auth, and full PWA (installable, offline, push-ready).

## Design philosophy

- Apple × OpenAI × Linear × SpaceX × Arc × Raycast × Interstellar
- Luxury minimalism, atmospheric depth, quiet motion
- Accents used sparingly; accent colors reserved for active states, CTAs, and micro-glow
- Dark-first (`#050816` canvas) with soft horizon gradients and a subtle starfield

## Stack

- Next.js 15 (App Router) + React 18
- TypeScript
- TailwindCSS with custom tokens (`ink.950/900/800/700`, `accent`, `accent.secondary`)
- Framer Motion for cinematic transitions
- PWA (web app manifest + service worker + offline route + install prompt)
- Web Push ready (`push` + `notificationclick` handlers in `sw.js`)

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Routes

| Path | Description |
|---|---|
| `/` | Landing — hero, features, library showcase, pricing, CTA |
| `/pricing` | Full pricing page |
| `/sign-in` / `/sign-up` | Auth |
| `/dashboard` | Dashboard home with greeting, stats, featured, trending |
| `/library` | Prompt library — categories, search, cards, detail dialog |
| `/favorites` | Saved prompts (localStorage-backed) |
| `/updates` | Release / drop / announcement timeline |
| `/community` | Threads + leaderboard |
| `/notifications` | Inbox with grouped unread notifications |
| `/support` | FAQ + contact |
| `/settings` | Profile, notifications, appearance, language, privacy |
| `/billing` | Plan, payment method, invoices |
| `/offline` | PWA offline fallback |

## Architecture

```
src/
  app/
    (marketing)/         # Landing + pricing
    (auth)/              # Sign in / sign up
    (app)/               # Authenticated surface
    offline/             # PWA offline page
    layout.tsx           # Root: fonts, CosmicBackground, Toaster, InstallPrompt, SW
  components/
    ui/                  # Button, Input, Card, Badge, Logo, Toaster
    cosmic/              # CosmicBackground, Starfield, HorizonBeam
    landing/             # Hero, FloatingSearch, Features, CategoryShowcase, Pricing, CTA, TopNav, Footer
    dashboard/           # Sidebar, Topbar, MobileNav
    prompts/             # PromptCard (magical copy), CategoryPills, PromptDetailDialog
    pwa/                 # ServiceWorkerRegister, InstallPrompt
  lib/                   # cn, hooks, prompts (data), favorites
public/
  manifest.json
  sw.js
  icons/
```

## Design tokens

| Token | Value |
|---|---|
| `ink.950` | `#050816` — canvas |
| `ink.900` | `#0B1020` — surface |
| `ink.800` | `#111827` — elevated card |
| `accent.DEFAULT` | `#7C8CFF` — primary accent |
| `accent.secondary` | `#5CE1E6` — secondary accent |
| `primary` | `#F5F7FF` — body text |
| `primary.muted` | `#9CA3AF` — secondary text |

## Interaction highlights

- **Magical copy.** Every prompt card's copy button fires: clipboard write → radial pulse → 10-particle burst → haptic `[8, 20, 10]` → success toast. All calm, all instant.
- **Floating search.** Glassmorphism hero search with ⌘K focus, drop-down trending suggestions.
- **Category pills.** Shared `layoutId` active indicator glides between pills with a spring curve.
- **Mobile-first.** Floating glass bottom nav with safe-area padding. Detail dialogs become bottom sheets on mobile.
- **Quiet motion.** Respects `prefers-reduced-motion` across starfield, transitions, and particles.

## PWA

- `public/manifest.json` — installable with shortcuts to Library, Favorites, Updates
- `public/sw.js` — app-shell precache, network-first nav, stale-while-revalidate statics, cache-first cross-origin, offline fallback
- `ServiceWorkerRegister` — registers in production
- `InstallPrompt` — captures `beforeinstallprompt`, offers a native-feel install sheet
- Web Push — `push` + `notificationclick` wired; connect to FCM or OneSignal on the server side

## Future (hooks already in place)

- Supabase auth and Postgres for real users, subscriptions, and favorites sync
- Real push pipeline (OneSignal or FCM server endpoint)
- Admin panel (exists as a design target — easy to add under `/admin`)
```
