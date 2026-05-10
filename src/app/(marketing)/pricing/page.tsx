import { Pricing } from "@/components/landing/Pricing";
import { CTA } from "@/components/landing/CTA";

export const metadata = { title: "Pricing" };

export default function PricingPage() {
  return (
    <div className="pt-20">
      <section className="relative mx-auto max-w-4xl px-4 pb-8 pt-20 text-center md:px-8">
        <span className="inline-block rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-primary-muted">
          Two orbits
        </span>
        <h1 className="mt-6 font-display text-display-lg font-medium tracking-tight text-grad">
          Pricing, quiet and clear.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-primary/60">
          Start with Orbit. Graduate to Supernova when your workflow demands more. No hidden tiers.
          No surprise invoices.
        </p>
      </section>

      <Pricing />
      <CTA />
    </div>
  );
}
