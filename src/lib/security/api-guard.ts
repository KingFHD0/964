import { NextResponse } from "next/server";
import { rateLimit, keyFromRequest, type RateLimitResult } from "@/lib/security/rate-limit";
import { verifyCsrf } from "@/lib/security/csrf";

/**
 * guardRoute — a composable request pipeline for API handlers.
 *
 * Runs, in order:
 *  1. method check
 *  2. rate limit (per-IP, scoped)
 *  3. CSRF (for mutations)
 *  4. origin allow-list (belt-and-suspenders against CSRF)
 *
 * If any stage fails, returns a NextResponse you can return directly.
 * If all pass, returns null — the handler keeps running.
 *
 * This is the shared hardening contract for every /api/* route.
 */
type GuardOptions = {
  allowMethods?: string[];
  scope: string;
  rate?: { max: number; windowMs: number; cooloffMs?: number };
  csrf?: boolean;
  allowOrigins?: string[];
};

export async function guardRoute(
  request: Request,
  options: GuardOptions
): Promise<NextResponse | null> {
  const methods = options.allowMethods ?? ["GET"];
  if (!methods.includes(request.method)) {
    return NextResponse.json(
      { error: "Method not allowed" },
      { status: 405, headers: { Allow: methods.join(", ") } }
    );
  }

  const rl = rateLimit(
    keyFromRequest(request, options.scope),
    options.rate ?? { max: 30, windowMs: 60_000, cooloffMs: 60_000 }
  );
  if (!rl.ok) return rateResponse(rl);

  const isMutation = request.method !== "GET" && request.method !== "HEAD";

  if (isMutation) {
    // Origin allow-list
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");
    const sameHost =
      !!origin && !!host && origin.replace(/^https?:\/\//, "").split(":")[0] === host.split(":")[0];
    const allowed = options.allowOrigins?.includes(origin ?? "");
    if (!sameHost && !allowed) {
      return NextResponse.json({ error: "Forbidden origin" }, { status: 403 });
    }

    // CSRF (default ON for mutations)
    if (options.csrf !== false) {
      const ok = verifyCsrf(request);
      if (!ok) return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
    }
  }

  return null;
}

function rateResponse(r: RateLimitResult) {
  return NextResponse.json(
    { error: "Too many requests. Please retry later." },
    {
      status: 429,
      headers: {
        "Retry-After": String(r.retryAfter),
        "X-RateLimit-Remaining": String(Math.max(0, r.remaining))
      }
    }
  );
}
