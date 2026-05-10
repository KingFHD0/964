import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { HorizonBeam } from "@/components/cosmic/HorizonBeam";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <HorizonBeam className="top-[28%]" />
      <header className="fixed inset-x-0 top-0 z-10">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-8">
          <Link href="/" className="focus-ring rounded-full">
            <Logo />
          </Link>
          <Link
            href="/"
            className="text-[13px] text-primary/70 transition-colors hover:text-primary"
          >
            Back to home
          </Link>
        </div>
      </header>
      <main id="main" className="flex min-h-screen items-center justify-center px-4 py-24">
        {children}
      </main>
    </div>
  );
}
