import { Hero } from "@/components/landing/Hero";
import { EcosystemShowcase } from "@/components/landing/EcosystemShowcase";
import { Features } from "@/components/landing/Features";
import { CategoryShowcase } from "@/components/landing/CategoryShowcase";
import { Pricing } from "@/components/landing/Pricing";
import { CTA } from "@/components/landing/CTA";
import { AdSlot } from "@/components/ads/AdSlot";

export default function LandingPage() {
  return (
    <>
      <Hero />
      {/* Subtle sponsor ribbon just under the hero search */}
      <section className="relative mx-auto max-w-6xl px-4 -mt-10 md:px-8">
        <AdSlot placement="landing-hero" variant="banner" />
      </section>

      <EcosystemShowcase />

      {/* Featured AI partner between ecosystem and features */}
      <section className="relative mx-auto max-w-6xl px-4 md:px-8">
        <AdSlot placement="landing-mid" variant="card" />
      </section>

      <Features />
      <CategoryShowcase />
      <Pricing />
      <CTA />
    </>
  );
}
