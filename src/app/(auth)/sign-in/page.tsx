"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function SignInPage() {
  const [show, setShow] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
      className="relative w-full max-w-md"
    >
      <div className="text-center">
        <div className="text-[11px] uppercase tracking-[0.22em] text-primary-muted/80">Sign in</div>
        <h1 className="mt-3 font-display text-[36px] font-medium leading-tight tracking-tight text-grad">
          Welcome back.
        </h1>
        <p className="mt-2 text-[13.5px] text-primary/60">
          Return to your quiet orbit. Pick up where you left off.
        </p>
      </div>

      <div className="mt-10 rounded-3xl border border-white/[0.06] bg-ink-800/40 p-6 md:p-8 backdrop-blur-xl">
        <div className="grid gap-3">
          <SocialButton provider="Google" />
          <SocialButton provider="Apple" />
        </div>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/[0.06]" />
          <span className="text-[11px] uppercase tracking-[0.2em] text-primary-muted/80">or</span>
          <div className="h-px flex-1 bg-white/[0.06]" />
        </div>

        <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
          <Field label="Email" icon={<Mail className="h-4 w-4" />} type="email" placeholder="you@aether964.com" />
          <div>
            <Field
              label="Password"
              icon={<Lock className="h-4 w-4" />}
              type={show ? "text" : "password"}
              placeholder="••••••••"
              trailing={
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  className="text-primary-muted hover:text-primary"
                  aria-label={show ? "Hide password" : "Show password"}
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
            />
            <div className="mt-2 flex justify-end">
              <Link href="#" className="text-[12.5px] text-primary-muted hover:text-primary">
                Forgot password?
              </Link>
            </div>
          </div>

          <Button type="submit" size="lg" className="mt-3 w-full justify-center" trailing={<ArrowRight className="h-4 w-4" />}>
            Continue
          </Button>
        </form>
      </div>

      <p className="mt-6 text-center text-[13px] text-primary/60">
        Don’t have an account?{" "}
        <Link href="/sign-up" className="text-accent hover:text-accent-secondary">
          Create one
        </Link>
      </p>
    </motion.div>
  );
}

function SocialButton({ provider }: { provider: "Google" | "Apple" }) {
  return (
    <button
      type="button"
      className="focus-ring flex h-11 items-center justify-center gap-2.5 rounded-full border border-white/[0.08] bg-white/[0.03] text-[13.5px] text-primary/90 transition-colors hover:border-white/[0.15] hover:bg-white/[0.05]"
    >
      <ProviderGlyph provider={provider} />
      Continue with {provider}
    </button>
  );
}

function ProviderGlyph({ provider }: { provider: "Google" | "Apple" }) {
  if (provider === "Google") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
        <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.5-1.7 4.4-5.5 4.4-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.9 3.9 14.7 3 12 3 6.9 3 2.7 7.1 2.7 12.3c0 5.1 4.2 9.3 9.3 9.3 5.4 0 9-3.8 9-9.2 0-.6-.1-1.1-.2-1.6H12z" />
      </svg>
    );
  }
  return (
    <svg width="14" height="16" viewBox="0 0 14 16" fill="currentColor" aria-hidden>
      <path d="M11.2 8.5c0-2 1.6-3 1.7-3-0.9-1.4-2.4-1.6-2.9-1.6-1.2-.1-2.4.7-3 .7-.6 0-1.6-.7-2.6-.7-1.3.1-2.6.8-3.3 2-.3.6-1 2.3-.4 4.5.5 1.8 1.9 3.9 3.1 3.9 1 0 1.4-.7 2.6-.7 1.2 0 1.5.7 2.6.7 1.3 0 2.2-1.8 2.7-2.9-1.7-.6-2.5-2.5-2.5-2.9zM8.8 2.9c.6-.7.9-1.6.8-2.4-.7.1-1.6.5-2.2 1.2-.5.6-1 1.5-.8 2.4.8.1 1.6-.4 2.2-1.2z" />
    </svg>
  );
}

function Field({
  label,
  icon,
  type = "text",
  placeholder,
  trailing
}: {
  label: string;
  icon: React.ReactNode;
  type?: string;
  placeholder?: string;
  trailing?: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] uppercase tracking-[0.18em] text-primary-muted/80">
        {label}
      </span>
      <div className="flex h-12 items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 transition-colors focus-within:border-accent/40 focus-within:bg-white/[0.05]">
        <span className="text-primary-muted/80">{icon}</span>
        <input
          type={type}
          placeholder={placeholder}
          className="h-full w-full bg-transparent text-[14px] text-primary outline-none placeholder:text-primary-muted/60"
        />
        {trailing ? <span>{trailing}</span> : null}
      </div>
    </label>
  );
}
