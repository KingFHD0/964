/**
 * csrf — double-submit cookie helper.
 *
 * Usage pattern (for server-handled forms / mutations):
 *  1. On first render, server issues a cryptographically random `csrfToken`
 *     via a cookie (`Path=/; SameSite=Lax; Secure; HttpOnly=false`) AND also
 *     exposes it to the page as a hidden form field / fetch header.
 *  2. Any mutation request must include the token in a header (`x-csrf-token`)
 *     and it must match the cookie value.
 *  3. Server verifies with `verifyCsrf(request)`.
 *
 * SameSite=Lax alone defeats most classic CSRF, but double-submit + a
 * per-form token is the belt-and-suspenders default for admin APIs.
 */

const COOKIE_NAME = "aether_csrf";
const HEADER_NAME = "x-csrf-token";

function randomToken(bytes = 24): string {
  const arr = new Uint8Array(bytes);
  // @ts-ignore crypto exists in edge + node 19+
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function issueCsrf(): { token: string; cookie: string } {
  const token = randomToken();
  const cookie = `${COOKIE_NAME}=${token}; Path=/; Max-Age=3600; SameSite=Lax; Secure`;
  return { token, cookie };
}

export function readCsrfCookie(request: Request): string | null {
  const raw = request.headers.get("cookie") ?? "";
  const match = raw.match(new RegExp(`${COOKIE_NAME}=([a-f0-9]+)`));
  return match?.[1] ?? null;
}

export function verifyCsrf(request: Request): boolean {
  if (request.method === "GET" || request.method === "HEAD") return true;
  const cookie = readCsrfCookie(request);
  const header = request.headers.get(HEADER_NAME);
  if (!cookie || !header) return false;
  // Constant-time comparison
  if (cookie.length !== header.length) return false;
  let ok = 0;
  for (let i = 0; i < cookie.length; i++) {
    ok |= cookie.charCodeAt(i) ^ header.charCodeAt(i);
  }
  return ok === 0;
}

export const CSRF = { COOKIE_NAME, HEADER_NAME };
