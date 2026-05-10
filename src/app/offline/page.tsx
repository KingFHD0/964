import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { HorizonBeam } from "@/components/cosmic/HorizonBeam";

export const metadata = { title: "You are offline" };

export default function OfflinePage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center px-6">
      <HorizonBeam />
      <div className="relative mx-auto max-w-lg text-center">
        <div className="flex justify-center">
          <Logo />
        </div>
        <div className="mt-14 inline-block rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-primary-muted">
          Offline
        </div>
        <h1 className="mt-5 font-display text-[40px] font-medium leading-tight tracking-tight text-grad">
          You are between signals.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-[14.5px] leading-relaxed text-primary/60">
          Your connection dropped, but your cached prompts are still yours. We will reconnect the
          moment the network returns.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex h-11 items-center rounded-full bg-grad-cta px-5 text-[13.5px] font-medium text-white shadow-[0_10px_30px_-10px_rgba(124,140,255,0.6)] hover:brightness-110"
          >
            Open dashboard
          </Link>
          <Link
            href="/favorites"
            className="inline-flex h-11 items-center rounded-full border border-white/[0.08] bg-white/[0.03] px-5 text-[13.5px] text-primary/90 hover:border-white/[0.15] hover:text-primary"
          >
            Go to favorites
          </Link>
        </div>
      </div>
    </div>
  );
}
