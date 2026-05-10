import { NextResponse } from "next/server";
import { issueCsrf, CSRF } from "@/lib/security/csrf";

/**
 * GET /api/csrf
 *
 * Issues a double-submit CSRF token cookie and returns the same token in JSON
 * so the client can stash it in memory and replay it via x-csrf-token on mutations.
 *
 * Safe by design: GET only, rate-limited via middleware headers, cacheable not.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const { token, cookie } = issueCsrf();
  const res = NextResponse.json(
    { token, header: CSRF.HEADER_NAME },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
        "Content-Security-Policy": "default-src 'none'"
      }
    }
  );
  res.headers.append("Set-Cookie", cookie);
  return res;
}
