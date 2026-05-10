/**
 * Tiny validator — Zod-less, zero-deps, strict-by-default.
 *
 * Intentionally small. Extend with full Zod in production.
 */

export type Validator<T> = (input: unknown) => { ok: true; value: T } | { ok: false; error: string };

export const v = {
  string(opts: { min?: number; max?: number; pattern?: RegExp } = {}): Validator<string> {
    return (input) => {
      if (typeof input !== "string") return { ok: false, error: "Expected string" };
      if (opts.min != null && input.length < opts.min)
        return { ok: false, error: `Must be at least ${opts.min} chars` };
      if (opts.max != null && input.length > opts.max)
        return { ok: false, error: `Must be at most ${opts.max} chars` };
      if (opts.pattern && !opts.pattern.test(input))
        return { ok: false, error: "Invalid format" };
      return { ok: true, value: input };
    };
  },
  email(): Validator<string> {
    return v.string({ max: 254, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ });
  },
  url(): Validator<string> {
    return v.string({ max: 2048, pattern: /^(https?:\/\/|\/|#)/ });
  },
  enum<T extends string>(values: readonly T[]): Validator<T> {
    return (input) => {
      if (typeof input !== "string" || !(values as readonly string[]).includes(input))
        return { ok: false, error: `Must be one of ${values.join(", ")}` };
      return { ok: true, value: input as T };
    };
  },
  number(opts: { min?: number; max?: number; int?: boolean } = {}): Validator<number> {
    return (input) => {
      const n = typeof input === "number" ? input : Number(input);
      if (!Number.isFinite(n)) return { ok: false, error: "Expected number" };
      if (opts.int && !Number.isInteger(n)) return { ok: false, error: "Expected integer" };
      if (opts.min != null && n < opts.min) return { ok: false, error: `Min ${opts.min}` };
      if (opts.max != null && n > opts.max) return { ok: false, error: `Max ${opts.max}` };
      return { ok: true, value: n };
    };
  },
  object<S extends Record<string, Validator<any>>>(
    shape: S
  ): Validator<{ [K in keyof S]: S[K] extends Validator<infer U> ? U : never }> {
    return (input) => {
      if (!input || typeof input !== "object")
        return { ok: false, error: "Expected object" };
      const out: any = {};
      for (const key of Object.keys(shape)) {
        const r = shape[key]((input as any)[key]);
        if (!r.ok) return { ok: false, error: `${key}: ${r.error}` };
        out[key] = r.value;
      }
      return { ok: true, value: out };
    };
  }
};
