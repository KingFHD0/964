import { Hero } from "@/components/landing/Hero";
import { EcosystemShowcase } from "@/components/landing/EcosystemShowcase";
import { Features } from "@/components/landing/Features";
import { CategoryShowcase } from "@/components/landing/CategoryShowcase";
import { Pricing } from "@/components/landing/Pricing";
import { CTA } from "@/components/landing/CTA";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <EcosystemShowcase />
      <Features />
      <CategoryShowcase />
      <Pricing />
      <CTA />
    </>
  );
}
