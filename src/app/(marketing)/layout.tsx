import { TopNav } from "@/components/landing/TopNav";
import { Footer } from "@/components/landing/Footer";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopNav />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
