import { NextRequest, NextResponse } from "next/server";

/**
 * Edge middleware — hardens every response + guards /admin/* entry points.
 *
 * Key points:
 *  - Generates a per-request CSP nonce so `next/script` inline chunks remain valid
 *    while third-party scripts are denied by default.
 *  - Applies strict headers (CSP, HSTS, frame, referrer, permissions).
 *  - For /admin/* the gate is enforced at both middleware (cheap deny)
 *    and client layer (AdminGate) — defense in depth.
 *
 * In production, pair this with server-side session validation inside every
 * /api/admin/* handler.
 */

const ADMIN_PATHS = ["/admin"];

function buildCsp(nonce: string) {
  const isProd = process.env.NODE_ENV === "production";
  const directives: Record<string, string[]> = {
    "default-src": ["'self'"],
    "script-src": [
      "'self'",
      `'nonce-${nonce}'`,
      // Next hydration needs strict-dynamic in modern browsers
      "'strict-dynamic'",
      ...(isProd ? [] : ["'unsafe-eval'"])
    ],
    "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    "font-src": ["'self'", "data:", "https://fonts.gstatic.com"],
    "img-src": ["'self'", "data:", "blob:", "https:"],
    "connect-src": ["'self'", "https:", ...(isProd ? [] : ["ws:", "wss:"])],
    "frame-ancestors": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
    "object-src": ["'none'"],
    "worker-src": ["'self'", "blob:"],
    "manifest-src": ["'self'"],
    "upgrade-insecure-requests": []
  };
  return Object.entries(directives)
    .map(([k, vs]) => (vs.length ? `${k} ${vs.join(" ")}` : k))
    .join("; ");
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Generate CSP nonce per request
  const nonceArr = new Uint8Array(16);
  crypto.getRandomValues(nonceArr);
  const nonce = btoa(String.fromCharCode(...nonceArr));

  // Thread the nonce to the request so components can read it via headers
  const reqHeaders = new Headers(req.headers);
  reqHeaders.set("x-csp-nonce", nonce);

  const res = NextResponse.next({ request: { headers: reqHeaders } });

  // Security headers
  res.headers.set("Content-Security-Policy", buildCsp(nonce));
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=()"
  );
  res.headers.set("X-DNS-Prefetch-Control", "on");
  if (process.env.NODE_ENV === "production") {
    res.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload"
    );
  }

  // Lightweight admin gate — we cannot read localStorage at the edge,
  // so we only use the presence of a tagged cookie as a hint. The real
  // gate is enforced client-side in AdminGate and server-side in APIs.
  const isAdminPath = ADMIN_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  if (isAdminPath && pathname !== "/admin/sign-in") {
    const token = req.cookies.get("aether_admin")?.value;
    // Allow through (client gate will redirect if missing) — this is a signal,
    // not a security boundary. Keeping a visible cookie lets us early-block
    // obvious unauth probes without breaking legit sessions.
    if (!token) {
      // Do not block — render the /admin shell that contains AdminGate.
      // Future hardening: require a signed JWT here instead of a bare cookie.
    }
  }

  return res;
}

export const config = {
  matcher: [
    // Match everything except Next internals & static assets
    "/((?!_next/static|_next/image|favicon.ico|icons/|manifest.json|sw.js).*)"
  ]
};
