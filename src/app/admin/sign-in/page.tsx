"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Lock, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useAdminAuth } from "@/lib/store/admin-auth";
import { Button } from "@/components/ui/Button";

/**
 * Admin sign-in.
 *  - Demo MFA: the `000000` code satisfies the check for super_admin.
 *  - After sign-in, redirects to `from` (the requested admin page) or /admin.
 */
export default function AdminSignInPage() {
  return (
    <React.Suspense fallback={null}>
      <AdminSignInView />
    </React.Suspense>
  );
}

function AdminSignInView() {
  const router = useRouter();
  const params = useSearchParams();
  const login = useAdminAuth((s) => s.login);
  const session = useAdminAuth((s) => s.session);

  const [email, setEmail] = React.useState("admin@aether964.com");
  const [password, setPassword] = React.useState("aether-admin");
  const [otp, setOtp] = React.useState("000000");
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  const reason = params.get("reason");
  const from = params.get("from") ?? "/admin";

  React.useEffect(() => {
    if (session) router.replace(from);
  }, [session, router, from]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const r = login(email, password, otp);
    setBusy(false);
    if (!r.ok) {
      setError(r.reason);
      return;
    }
    router.replace(from);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
      className="relative mx-auto flex min-h-screen items-center justify-center px-4"
    >
      <div className="relative w-full max-w-md">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/" className="focus-ring rounded-full">
            <Logo />
          </Link>
          <span className="chip inline-flex items-center gap-1.5">
            <ShieldCheck className="h-3 w-3 text-accent-secondary" />
            Admin
          </span>
        </div>

        <div className="rounded-3xl border border-white/[0.07] bg-[linear-gradient(180deg,rgba(17,24,39,0.7),rgba(11,16,32,0.85))] p-7 backdrop-blur-2xl shadow-elev-3 md:p-9">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-primary-muted/80">
            <Sparkles className="h-3 w-3 text-accent-secondary" />
            Mission Control
          </div>
          <h1 className="mt-3 font-display text-[28px] font-medium leading-tight tracking-tight text-grad">
            Admin sign-in
          </h1>
          <p className="mt-2 text-[13.5px] text-primary/60">
            Authorized personnel only. All sessions are audited.
          </p>

          {reason === "forbidden" ? (
            <div className="mt-5 rounded-xl border border-amber-400/25 bg-amber-500/10 px-4 py-2.5 text-[12.5px] text-amber-200">
              Your role does not have access to that page.
            </div>
          ) : null}

          <form onSubmit={onSubmit} className="mt-6 space-y-3">
            <Field label="Email" icon={<Mail className="h-4 w-4" />}>
              <input
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-full w-full bg-transparent text-[14px] text-primary outline-none placeholder:text-primary-muted/60"
              />
            </Field>
            <Field label="Password" icon={<Lock className="h-4 w-4" />}>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-full w-full bg-transparent text-[14px] text-primary outline-none placeholder:text-primary-muted/60"
              />
            </Field>
            <Field label="Two-factor code" icon={<ShieldCheck className="h-4 w-4" />} hint="Demo: 000000">
              <input
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                className="h-full w-full bg-transparent text-[14px] tracking-[0.4em] text-primary outline-none placeholder:text-primary-muted/60"
              />
            </Field>

            {error ? (
              <div className="rounded-xl border border-red-400/25 bg-red-500/10 px-4 py-2.5 text-[12.5px] text-red-200">
                {error}
              </div>
            ) : null}

            <Button type="submit" size="lg" className="mt-3 w-full justify-center" disabled={busy}>
              {busy ? "Verifying…" : "Enter Mission Control"}
            </Button>
          </form>

          <div className="mt-6 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-[12px] text-primary/60">
            <div className="text-[10.5px] uppercase tracking-[0.2em] text-primary-muted/80">
              Demo credentials
            </div>
            <ul className="mt-2 space-y-1">
              <li>
                <span className="text-primary/80">admin@aether964.com</span> ·{" "}
                <code className="font-mono text-primary/80">aether-admin</code> · code{" "}
                <code className="font-mono text-primary/80">000000</code>
              </li>
              <li>
                <span className="text-primary/80">moderator@aether964.com</span> ·{" "}
                <code className="font-mono text-primary/80">aether-mod</code>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-6 text-center text-[12px] text-primary-muted/80">
          Return to{" "}
          <Link href="/" className="text-accent hover:text-accent-secondary">
            Aether 964
          </Link>
        </p>
      </div>
    </motion.div>
  );
}

function Field({
  label,
  icon,
  hint,
  children
}: {
  label: string;
  icon: React.ReactNode;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="text-[11px] uppercase tracking-[0.18em] text-primary-muted/80">
          {label}
        </span>
        {hint ? <span className="text-[11px] text-primary-muted/70">{hint}</span> : null}
      </div>
      <div className="flex h-12 items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 transition-colors focus-within:border-accent/40 focus-within:bg-white/[0.05]">
        <span className="text-primary-muted/80">{icon}</span>
        {children}
      </div>
    </label>
  );
}
