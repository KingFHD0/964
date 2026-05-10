"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Lock, Mail, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function SignUpPage() {
  return (
    <React.Suspense fallback={null}>
      <SignUpView />
    </React.Suspense>
  );
}

function SignUpView() {
  const params = useSearchParams();
  const plan = (params.get("plan") ?? "orbit").toLowerCase();
  const isSupernova = plan === "supernova";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
      className="w-full max-w-md"
    >
      <div className="text-center">
        <div className="text-[11px] uppercase tracking-[0.22em] text-primary-muted/80">Create an account</div>
        <h1 className="mt-3 font-display text-[36px] font-medium leading-tight tracking-tight text-grad">
          Enter the orbit.
        </h1>
        <p className="mt-2 text-[13.5px] text-primary/60">
          Two minutes. Zero friction. Your library is waiting.
        </p>
      </div>

      <div className="mt-8 rounded-3xl border border-white/[0.06] bg-ink-800/40 p-6 md:p-8 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
          <div className="flex items-center gap-2">
            <Sparkles className={`h-3.5 w-3.5 ${isSupernova ? "text-accent" : "text-accent-secondary"}`} />
            <span className="text-[11px] uppercase tracking-[0.2em] text-primary-muted">Plan</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge tone={isSupernova ? "accent" : "default"}>{isSupernova ? "Supernova" : "Orbit"}</Badge>
            <Link href="/pricing" className="text-[12px] text-primary-muted hover:text-primary">
              Change
            </Link>
          </div>
        </div>

        <form className="mt-5 space-y-3" onSubmit={(e) => e.preventDefault()}>
          <Field label="Full name" icon={<User className="h-4 w-4" />} placeholder="Your name" />
          <Field label="Email" icon={<Mail className="h-4 w-4" />} type="email" placeholder="you@aether964.com" />
          <Field label="Password" icon={<Lock className="h-4 w-4" />} type="password" placeholder="At least 8 characters" />

          <Button type="submit" size="lg" className="mt-3 w-full justify-center" trailing={<ArrowRight className="h-4 w-4" />}>
            Create account
          </Button>
        </form>

        <p className="mt-5 text-center text-[12px] text-primary-muted/80">
          By continuing, you agree to our{" "}
          <Link href="#" className="text-primary/80 hover:text-primary">Terms</Link> and{" "}
          <Link href="#" className="text-primary/80 hover:text-primary">Privacy</Link>.
        </p>
      </div>

      <p className="mt-6 text-center text-[13px] text-primary/60">
        Already with us?{" "}
        <Link href="/sign-in" className="text-accent hover:text-accent-secondary">
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}

function Field({ label, icon, type = "text", placeholder }: { label: string; icon: React.ReactNode; type?: string; placeholder?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] uppercase tracking-[0.18em] text-primary-muted/80">{label}</span>
      <div className="flex h-12 items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 transition-colors focus-within:border-accent/40 focus-within:bg-white/[0.05]">
        <span className="text-primary-muted/80">{icon}</span>
        <input
          type={type}
          placeholder={placeholder}
          className="h-full w-full bg-transparent text-[14px] text-primary outline-none placeholder:text-primary-muted/60"
        />
      </div>
    </label>
  );
}
