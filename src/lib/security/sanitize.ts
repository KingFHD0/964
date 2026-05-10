/**
 * sanitize — tiny, dependency-free HTML/text sanitizer.
 *
 * Use for any string that originated from users or sponsors before it is rendered
 * or logged. NEVER use with dangerouslySetInnerHTML unless this has been run first.
 *
 * Defense in depth:
 *  - encodes HTML-dangerous characters
 *  - strips control characters and zero-width chars
 *  - limits length by default
 *  - strips javascript: / data: url schemes from hrefs
 */
const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "/": "&#47;",
  "`": "&#96;"
};

export function escapeHtml(input: string): string {
  return input.replace(/[&<>"'`/]/g, (c) => HTML_ESCAPES[c] ?? c);
}

export function stripControl(input: string): string {
  // Remove C0 controls (except \t \n), C1 controls, and zero-width / BOM.
  return input
    .replace(/[\u0000-\u0008\u000B-\u001F\u007F-\u009F]/g, "")
    .replace(/[\u200B-\u200D\uFEFF]/g, "");
}

export function sanitizeText(input: unknown, maxLen = 5000): string {
  if (typeof input !== "string") return "";
  const clamped = input.slice(0, maxLen);
  return stripControl(clamped).trim();
}

const URL_ALLOWED = /^(https?:|mailto:|tel:|\/|#)/i;

export function sanitizeUrl(input: unknown): string {
  const s = sanitizeText(input, 2048);
  if (!s) return "";
  if (!URL_ALLOWED.test(s)) return "";
  return s;
}

/**
 * Safe-by-default prompt sanitizer.
 * - Strips known injection sentinels and system-role markers.
 * - Kept intentionally conservative; extend per your policy.
 */
const INJECTION_PATTERNS = [
  /ignore (all )?previous instructions/gi,
  /disregard (the )?(above|previous)/gi,
  /you are (now )?a (new )?system/gi,
  /<\|im_start\|>/gi,
  /<\|im_end\|>/gi,
  /\[system\]/gi
];

export function sanitizePrompt(input: unknown, maxLen = 4000): string {
  let s = sanitizeText(input, maxLen);
  for (const pat of INJECTION_PATTERNS) s = s.replace(pat, "[redacted]");
  return s;
}

/** Useful when we want to show a preview of HTML safely. */
export function toSafeHtmlPreview(input: unknown): string {
  return escapeHtml(sanitizeText(input, 2000));
}
