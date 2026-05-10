/**
 * Edge-compatible in-memory rate limiter (sliding window).
 *
 * For single-node use or preview environments. In production, swap to
 * Upstash Redis or Cloudflare KV for horizontal correctness.
 */

type Bucket = { hits: number[]; blockedUntil: number };

const BUCKETS = new Map<string, Bucket>();

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  retryAfter: number; // seconds
};

export function rateLimit(
  key: string,
  opts: { max: number; windowMs: number; cooloffMs?: number } = {
    max: 30,
    windowMs: 60_000,
    cooloffMs: 60_000
  }
): RateLimitResult {
  const now = Date.now();
  const b = BUCKETS.get(key) ?? { hits: [], blockedUntil: 0 };

  if (b.blockedUntil > now) {
    return { ok: false, remaining: 0, retryAfter: Math.ceil((b.blockedUntil - now) / 1000) };
  }

  const cutoff = now - opts.windowMs;
  b.hits = b.hits.filter((t) => t > cutoff);

  if (b.hits.length >= opts.max) {
    b.blockedUntil = now + (opts.cooloffMs ?? opts.windowMs);
    BUCKETS.set(key, b);
    return { ok: false, remaining: 0, retryAfter: Math.ceil((opts.cooloffMs ?? opts.windowMs) / 1000) };
  }

  b.hits.push(now);
  BUCKETS.set(key, b);
  return { ok: true, remaining: opts.max - b.hits.length, retryAfter: 0 };
}

/**
 * Derive a stable key for a rate-limit bucket from a Request.
 * Prefers Forwarded / X-Forwarded-For over connection IP when present.
 */
export function keyFromRequest(req: Request, scope: string): string {
  const fwd = req.headers.get("x-forwarded-for");
  const ip = fwd ? fwd.split(",")[0]?.trim() : "unknown";
  return `${scope}:${ip}`;
}
