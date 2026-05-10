import { cn } from "@/lib/cn";

export function Logo({ className, showText = true }: { className?: string; showText?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="relative h-8 w-8">
        <svg viewBox="0 0 40 40" className="h-8 w-8" fill="none" aria-hidden>
          <defs>
            <linearGradient id="aether-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#7C8CFF" />
              <stop offset="100%" stopColor="#5CE1E6" />
            </linearGradient>
            <radialGradient id="aether-core" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F5F7FF" stopOpacity="1" />
              <stop offset="100%" stopColor="#F5F7FF" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="20" cy="20" r="18" stroke="url(#aether-grad)" strokeWidth="1.2" opacity="0.55" />
          <circle cx="20" cy="20" r="12" stroke="url(#aether-grad)" strokeWidth="1" opacity="0.75" />
          <circle cx="20" cy="20" r="3.2" fill="url(#aether-core)" />
          <circle cx="20" cy="20" r="6" fill="url(#aether-core)" opacity="0.25" />
        </svg>
      </div>
      {showText ? (
        <div className="flex items-baseline gap-1.5 font-display">
          <span className="text-[15px] font-medium tracking-tight text-primary">Aether</span>
          <span className="text-[13px] font-medium tracking-[0.18em] text-primary-muted">964</span>
        </div>
      ) : null}
    </div>
  );
}
