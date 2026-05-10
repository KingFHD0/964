"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Check, CreditCard, Download, Sparkles } from "lucide-react";
import Link from "next/link";

const INVOICES = [
  { id: "INV-2026-0005", date: "May 6, 2026", amount: "$29.00", status: "Paid" },
  { id: "INV-2026-0004", date: "April 6, 2026", amount: "$29.00", status: "Paid" },
  { id: "INV-2026-0003", date: "March 6, 2026", amount: "$29.00", status: "Paid" },
  { id: "INV-2026-0002", date: "February 6, 2026", amount: "$29.00", status: "Paid" },
  { id: "INV-2026-0001", date: "January 6, 2026", amount: "$29.00", status: "Paid" }
];

const BENEFITS = [
  "Unlimited prompt access",
  "Pro-only cinematic briefs",
  "Iraqi dialect expansions",
  "Push notifications",
  "Team seats (up to 5)"
];

export default function BillingPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-8 md:py-12">
      <div className="text-[11px] uppercase tracking-[0.22em] text-primary-muted/80">Billing</div>
      <h1 className="mt-3 font-display text-display-md font-medium tracking-tight text-grad">
        Subscription & invoices.
      </h1>
      <p className="mt-2 max-w-2xl text-[14.5px] leading-relaxed text-primary/60">
        Manage your plan, payment method, and download receipts.
      </p>

      {/* Plan card */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
        className="relative mt-10 overflow-hidden rounded-3xl border border-accent/25 p-7 md:p-9"
        style={{
          background:
            "radial-gradient(80% 120% at 0% 0%, rgba(124,140,255,0.18), transparent 60%), linear-gradient(180deg, rgba(17,24,39,0.7), rgba(11,16,32,0.9))"
        }}
      >
        <svg className="pointer-events-none absolute -right-20 -top-20 h-[400px] w-[400px] opacity-40" viewBox="0 0 400 400" fill="none" aria-hidden>
          <circle cx="200" cy="200" r="160" stroke="rgba(124,140,255,0.35)" />
          <circle cx="200" cy="200" r="100" stroke="rgba(92,225,230,0.35)" />
        </svg>
        <div className="relative grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <span className="text-[11px] uppercase tracking-[0.22em] text-accent">Current plan</span>
            </div>
            <div className="mt-3 flex items-baseline gap-3">
              <span className="font-display text-[34px] font-medium tracking-tight text-primary">
                Supernova
              </span>
              <span className="text-[14px] text-primary/60">$29 / month</span>
            </div>
            <p className="mt-2 text-[13.5px] text-primary/65">
              Renews on <span className="text-primary">May 18, 2026</span>. Cancel any time.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                href="/pricing"
                className="focus-ring inline-flex h-9 items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 text-[12.5px] text-primary/85 hover:border-white/[0.15]"
              >
                Compare plans
                <ArrowUpRight className="h-3 w-3" />
              </Link>
              <button className="focus-ring inline-flex h-9 items-center gap-2 rounded-full border border-white/[0.08] bg-transparent px-4 text-[12.5px] text-primary-muted hover:text-primary">
                Cancel subscription
              </button>
            </div>
          </div>

          <ul className="grid grid-cols-1 gap-2 rounded-2xl border border-white/[0.06] bg-ink-900/50 p-5">
            {BENEFITS.map((b) => (
              <li key={b} className="flex items-center gap-2.5 text-[13.5px] text-primary/85">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-accent/15 text-accent">
                  <Check className="h-3 w-3" />
                </span>
                {b}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* Payment method */}
      <section className="mt-10 rounded-3xl border border-white/[0.06] bg-ink-800/40 p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-primary-muted">Payment method</div>
            <div className="mt-3 flex items-center gap-3">
              <div className="grid h-10 w-14 place-items-center rounded-lg border border-white/[0.08] bg-white/[0.03]">
                <CreditCard className="h-4 w-4 text-primary/80" />
              </div>
              <div>
                <div className="text-[14px] text-primary">Visa ending in 4242</div>
                <div className="text-[12.5px] text-primary-muted">Expires 08 / 2028</div>
              </div>
            </div>
          </div>
          <button className="focus-ring inline-flex h-9 items-center rounded-full border border-white/[0.08] bg-white/[0.03] px-4 text-[12.5px] text-primary/85 hover:border-white/[0.15]">
            Update
          </button>
        </div>
      </section>

      {/* Invoices */}
      <section className="mt-10">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-primary-muted">Invoices</div>
            <h2 className="mt-2 font-display text-[20px] font-medium tracking-tight text-primary">
              Recent receipts
            </h2>
          </div>
          <button className="focus-ring inline-flex h-9 items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 text-[12.5px] text-primary/85 hover:border-white/[0.15]">
            <Download className="h-3.5 w-3.5" />
            Download all
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-ink-800/40">
          <table className="w-full text-left text-[13.5px]">
            <thead>
              <tr className="border-b border-white/[0.04] text-[11px] uppercase tracking-[0.18em] text-primary-muted">
                <th className="px-5 py-3 font-normal">Invoice</th>
                <th className="px-5 py-3 font-normal">Date</th>
                <th className="px-5 py-3 font-normal">Amount</th>
                <th className="px-5 py-3 font-normal">Status</th>
                <th className="px-5 py-3 font-normal text-right">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {INVOICES.map((inv) => (
                <tr key={inv.id} className="border-b border-white/[0.04] last:border-b-0 transition-colors hover:bg-white/[0.02]">
                  <td className="px-5 py-3.5 font-mono text-[12.5px] text-primary/85">{inv.id}</td>
                  <td className="px-5 py-3.5 text-primary/80">{inv.date}</td>
                  <td className="px-5 py-3.5 text-primary">{inv.amount}</td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-secondary/25 bg-accent-secondary/10 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.1em] text-accent-secondary">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent-secondary" />
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button className="text-[12.5px] text-primary-muted hover:text-primary">
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
