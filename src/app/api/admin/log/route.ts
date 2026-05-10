import { NextResponse } from "next/server";
import { guardRoute } from "@/lib/security/api-guard";
import { v } from "@/lib/security/validate";
import { sanitizeText } from "@/lib/security/sanitize";

/**
 * POST /api/admin/log
 *
 * An example end-to-end secured admin API. Demonstrates the full pipeline:
 *  - method restricted to POST
 *  - rate-limited (6 writes / minute per IP, 60s cool-off)
 *  - CSRF token required
 *  - Origin must be same-host
 *  - Zod-style body validation via `v`
 *  - Every field is sanitized before use
 *
 * In production, replace the in-memory accept with a Supabase write against an
 * `audit_logs` table guarded by RLS (`role = 'service_role'` only).
 */
export const dynamic = "force-dynamic";

const bodySchema = v.object({
  actor: v.string({ min: 1, max: 120 }),
  action: v.string({ min: 3, max: 400 }),
  severity: v.enum(["info", "warn", "critical"] as const),
  target: v.string({ max: 200 })
});

export async function POST(request: Request) {
  const blocked = await guardRoute(request, {
    scope: "admin.log",
    allowMethods: ["POST"],
    rate: { max: 6, windowMs: 60_000, cooloffMs: 60_000 }
  });
  if (blocked) return blocked;

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema(payload);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 422 });
  }

  const clean = {
    actor: sanitizeText(parsed.value.actor, 120),
    action: sanitizeText(parsed.value.action, 400),
    severity: parsed.value.severity,
    target: sanitizeText(parsed.value.target, 200)
  };

  // TODO: persist to your real store. Returning success for the demo.
  return NextResponse.json(
    { ok: true, accepted: clean },
    { headers: { "Cache-Control": "no-store" } }
  );
}
