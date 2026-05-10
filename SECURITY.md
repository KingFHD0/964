# Security — Aether 964

This document describes the security posture shipped with Aether 964 and the
production-hardening steps you must complete before opening the admin surface
to real users.

## Contents

- [Threat model](#threat-model)
- [Layered defenses shipped](#layered-defenses-shipped)
- [Production checklist](#production-checklist)
- [Reporting a vulnerability](#reporting-a-vulnerability)

## Threat model

Aether 964 is a premium AI SaaS with public content and an authenticated admin
surface. The primary threats we guard against:

| # | Threat | Mitigation |
|---|---|---|
| 1 | **XSS** via user or sponsor content | Strict CSP with per-request nonce, HTML-escape helpers (`sanitizeText`, `toSafeHtmlPreview`), dependency-free markdown renderer that never emits `innerHTML` |
| 2 | **CSRF** on admin mutations | Double-submit cookie (`aether_csrf`) + origin allow-list in `guardRoute` |
| 3 | **Prompt injection** | `sanitizePrompt` strips sentinels (`ignore previous instructions`, `<|im_start|>`, `[system]`, …) |
| 4 | **Brute-force** admin login | 5-attempt rolling window in `admin-auth`, plus per-IP `rateLimit` on the API |
| 5 | **SSRF / cross-host fetches** | CSP `connect-src` limits + same-host origin check on mutations |
| 6 | **Clickjacking** | `X-Frame-Options: DENY` + CSP `frame-ancestors 'none'` |
| 7 | **Mixed content / stripped TLS** | `Strict-Transport-Security` (prod) + `upgrade-insecure-requests` in CSP |
| 8 | **File upload abuse** | MIME + 5 MB ceiling + randomized filenames in `/admin/media` |
| 9 | **Broken access control** | `AdminGate` + role matrix in `/admin/roles`; repeat server-side in every admin API |
| 10 | **Admin privilege escalation** | Super-admin-only actions require MFA re-confirmation (demo: OTP `000000`) |

## Layered defenses shipped

### Edge (middleware)

`src/middleware.ts` runs on every request and sets:

- `Content-Security-Policy` with a per-request nonce (strict-dynamic)
- `Strict-Transport-Security` (prod only, 2y + preload)
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` locking camera / mic / geolocation / payment / USB / etc.

The middleware also threads the nonce to the request via `x-csp-nonce` so that
Server Components can forward it to `next/script` if needed.

### Next config (`next.config.mjs`)

Second belt-and-suspenders layer that ships the static security headers even if
a route somehow bypasses middleware, plus `poweredByHeader: false`.

### Input validation

`src/lib/security/validate.ts` is a tiny Zod-style validator used on every
admin API body. Each admin CRUD page runs every field through `sanitizeText` /
`sanitizeUrl` / `sanitizePrompt` before persisting.

### Rate limiting

`src/lib/security/rate-limit.ts` is a sliding-window per-key limiter used by:

- `/api/admin/log` (6 writes/min)
- Admin login (5 attempts/min in the auth store)

Swap to Upstash Redis for horizontal correctness in production.

### CSRF

`src/lib/security/csrf.ts` issues a double-submit token at `/api/csrf`. Every
mutating API goes through `guardRoute({ csrf: true })` in
`src/lib/security/api-guard.ts`, which also enforces same-host origin.

### Authentication (demo)

`src/lib/store/admin-auth.ts` is a demo-only credential store. It enforces MFA
for super admins and rolling rate-limit on login attempts. **Replace with
Supabase Auth or NextAuth** before production.

### Authorization (RBAC)

`AdminGate` wraps every `/admin/*` page and redirects to `/admin/sign-in` if
the session's role is below the minimum required. The source-of-truth matrix
lives at `/admin/roles`. Every mutating API **must** re-verify the role server-side.

### Audit logging

Every admin action (CRUD, login, theme change, notification dispatch, ad toggle)
is appended to the content store's `logs[]` with severity + IP. `/admin/logs`
is the UI, and JSON export is one click away. In production, mirror these
events to a write-only log sink (e.g., Supabase append-only table or an
external SIEM).

### Robots

`public/robots.txt` `Disallow`s `/admin` and `/api/` to keep them out of
search indexes.

## Production checklist

Before flipping the switch:

- [ ] Replace demo admin credentials with Supabase Auth (or NextAuth) and wire
      HttpOnly + Secure cookies for JWT storage.
- [ ] Move session validation into each `/api/admin/*` handler (never rely on
      `AdminGate` alone).
- [ ] Turn on RLS for every Postgres table and add append-only policies for
      `audit_logs`.
- [ ] Move the rate limiter to Upstash Redis or Cloudflare KV.
- [ ] Rotate `NEXT_PUBLIC_*` secrets off the client bundle (only public keys).
- [ ] Configure DMARC / SPF / DKIM for outbound email.
- [ ] Configure VAPID keys for Web Push (`sw.js` already handles `push` + `notificationclick`).
- [ ] Enable Supabase / provider's WAF.
- [ ] Schedule quarterly penetration tests.

## Reporting a vulnerability

Please email **security@aether964.com** with a clear reproduction and we will
respond within two business days. Do not disclose publicly before we have a fix.
