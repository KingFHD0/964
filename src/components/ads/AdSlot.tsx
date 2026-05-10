"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight, Sparkle } from "lucide-react";
import { useContentStore, type Ad, type AdPlacement } from "@/lib/store/content-store";
import { cn } from "@/lib/cn";

/**
 * AdSlot — the public surface for advertisements.
 *
 * Responsibilities:
 *  - Read the live ads array from the content store
 *  - Filter by placement + enabled flag + active date window
 *  - Pick ONE ad deterministically per placement to keep the page calm
 *  - Track an impression when the slot enters the viewport (once)
 *  - Track a click when the CTA is used
 *  - Render the native sponsor card (variant by kind)
 *
 * Design rules we hold:
 *  - Every slot carries an explicit "Sponsored · {partner}" label.
 *  - Motion is subtle: fade-in + 2px lift. No flashing, no neon, no chrome.
 *  - Full width on mobile, sits inside the page's natural rhythm on desktop.
 */
export function AdSlot({
  placement,
  variant,
  className,
  maxOne = true
}: {
  placement: AdPlacement;
  variant?: "card" | "inline" | "aside" | "banner";
  className?: string;
  maxOne?: boolean;
}) {
  const ads = useContentStore((s) => s.ads);
  const impress = useContentStore((s) => s.trackAdImpression);
  const click = useContentStore((s) => s.trackAdClick);

  const candidates = React.useMemo(() => {
    const now = new Date().toISOString().slice(0, 10);
    return ads
      .filter((a) => a.placement === placement && a.enabled)
      .filter((a) => !a.startDate || a.startDate <= now)
      .filter((a) => !a.endDate || a.endDate >= now);
  }, [ads, placement]);

  if (candidates.length === 0) return null;

  const list = maxOne ? [candidates[0]] : candidates;

  const chosenVariant: "card" | "inline" | "aside" | "banner" =
    variant ??
    (placement.includes("aside")
      ? "aside"
      : placement.includes("banner") || placement === "landing-hero"
      ? "banner"
      : placement === "tools-inline" || placement === "news-inline"
      ? "inline"
      : "card");

  return (
    <div className={cn("w-full", className)}>
      {list.map((ad) => (
        <AdView
          key={ad.id}
          ad={ad}
          variant={chosenVariant}
          onImpression={() => impress(ad.id)}
          onClick={() => click(ad.id)}
        />
      ))}
    </div>
  );
}

/* ──────────────── Single ad view ──────────────── */

function AdView({
  ad,
  variant,
  onImpression,
  onClick
}: {
  ad: Ad;
  variant: "card" | "inline" | "aside" | "banner";
  onImpression: () => void;
  onClick: () => void;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const tracked = React.useRef(false);

  React.useEffect(() => {
    if (inView && !tracked.current) {
      tracked.current = true;
      onImpression();
    }
  }, [inView, onImpression]);

  if (variant === "banner") return <BannerAd ref={ref} ad={ad} onClick={onClick} />;
  if (variant === "inline") return <InlineAd ref={ref} ad={ad} onClick={onClick} />;
  if (variant === "aside") return <AsideAd ref={ref} ad={ad} onClick={onClick} />;
  return <CardAd ref={ref} ad={ad} onClick={onClick} />;
}

/* ──────────────── Sponsor label ──────────────── */

function SponsoredLabel({ sponsor }: { sponsor: string }) {
  return (
    <div className="flex items-center gap-1.5 text-[10.5px] uppercase tracking-[0.22em] text-primary-muted/80">
      <Sparkle className="h-2.5 w-2.5 text-accent-secondary" aria-hidden />
      <span>Sponsored · {sponsor}</span>
    </div>
  );
}

/* ──────────────── Card (default) ──────────────── */

const CardAd = React.forwardRef<HTMLDivElement, { ad: Ad; onClick: () => void }>(
  function CardAd({ ad, onClick }, ref) {
    return (
      <motion.article
        ref={ref}
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.65, ease: [0.2, 0.8, 0.2, 1] }}
        className="card-premium group relative flex h-full flex-col overflow-hidden p-6 lift ring-accent-hover"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full opacity-55 blur-2xl"
          style={{
            background: `radial-gradient(circle at center, ${ad.accent[0]}5A, transparent 60%)`
          }}
        />
        <SponsoredLabel sponsor={ad.sponsor} />
        <h3 className="relative mt-3 font-display text-[19px] font-medium leading-snug tracking-tight text-primary">
          {ad.title}
        </h3>
        <p className="relative mt-2 text-[13.5px] leading-relaxed text-primary/65">{ad.body}</p>
        <div className="relative mt-5 flex items-center justify-between">
          <Link
            href={ad.ctaHref}
            target="_blank"
            rel="noopener noreferrer sponsored"
            onClick={onClick}
            className="focus-ring inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-[12.5px] font-medium text-white"
            style={{
              background: `linear-gradient(135deg, ${ad.accent[0]}, ${ad.accent[1]})`,
              boxShadow: `0 8px 24px -10px ${ad.accent[0]}80`
            }}
          >
            {ad.ctaLabel}
            <ArrowUpRight className="h-3 w-3" />
          </Link>
          <span className="text-[10.5px] uppercase tracking-[0.18em] text-primary-muted/70">
            {ad.kind.replace("-", " ")}
          </span>
        </div>
      </motion.article>
    );
  }
);

/* ──────────────── Inline (between content rows) ──────────────── */

const InlineAd = React.forwardRef<HTMLDivElement, { ad: Ad; onClick: () => void }>(
  function InlineAd({ ad, onClick }, ref) {
    return (
      <motion.article
        ref={ref}
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
        className="card-premium relative flex flex-col gap-4 overflow-hidden p-5 md:flex-row md:items-center"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-[3px]"
          style={{ background: `linear-gradient(180deg, ${ad.accent[0]}, ${ad.accent[1]})` }}
        />
        <div className="flex-1">
          <SponsoredLabel sponsor={ad.sponsor} />
          <h3 className="mt-2 font-display text-[16.5px] font-medium tracking-tight text-primary">
            {ad.title}
          </h3>
          <p className="mt-1 text-[13px] leading-relaxed text-primary/65">{ad.body}</p>
        </div>
        <Link
          href={ad.ctaHref}
          target="_blank"
          rel="noopener noreferrer sponsored"
          onClick={onClick}
          className="focus-ring inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 text-[12.5px] text-primary/85 transition-colors hover:border-accent/30 hover:text-primary"
        >
          {ad.ctaLabel}
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      </motion.article>
    );
  }
);

/* ──────────────── Aside (narrow right rail) ──────────────── */

const AsideAd = React.forwardRef<HTMLDivElement, { ad: Ad; onClick: () => void }>(
  function AsideAd({ ad, onClick }, ref) {
    return (
      <motion.aside
        ref={ref}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
        className="card-premium relative overflow-hidden p-5"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-50 blur-2xl"
          style={{
            background: `radial-gradient(circle at center, ${ad.accent[0]}55, transparent 60%)`
          }}
        />
        <SponsoredLabel sponsor={ad.sponsor} />
        <div className="mt-3 font-display text-[15px] font-medium leading-snug tracking-tight text-primary">
          {ad.title}
        </div>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-primary/65">{ad.body}</p>
        <Link
          href={ad.ctaHref}
          target="_blank"
          rel="noopener noreferrer sponsored"
          onClick={onClick}
          className="mt-4 inline-flex h-8 items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 text-[11.5px] text-primary/85 hover:border-accent/30 hover:text-primary"
        >
          {ad.ctaLabel}
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      </motion.aside>
    );
  }
);

/* ──────────────── Banner (landing-hero under FloatingSearch) ──────────────── */

const BannerAd = React.forwardRef<HTMLDivElement, { ad: Ad; onClick: () => void }>(
  function BannerAd({ ad, onClick }, ref) {
    return (
      <motion.article
        ref={ref}
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
        className="card-premium relative mx-auto flex w-full max-w-3xl items-center gap-5 overflow-hidden px-6 py-4"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-55"
          style={{
            background: `radial-gradient(120% 100% at 0% 50%, ${ad.accent[0]}25, transparent 60%)`
          }}
        />
        <div
          className="relative grid h-10 w-10 place-items-center rounded-xl text-[11px] font-medium text-white"
          style={{
            background: `linear-gradient(135deg, ${ad.accent[0]}, ${ad.accent[1]})`
          }}
        >
          {ad.sponsor.slice(0, 2).toUpperCase()}
        </div>
        <div className="relative min-w-0 flex-1">
          <SponsoredLabel sponsor={ad.sponsor} />
          <div className="mt-1 truncate text-[14px] text-primary">{ad.title}</div>
          <div className="mt-0.5 truncate text-[12.5px] text-primary/60">{ad.body}</div>
        </div>
        <Link
          href={ad.ctaHref}
          target="_blank"
          rel="noopener noreferrer sponsored"
          onClick={onClick}
          className="relative hidden items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-[12.5px] text-primary/85 hover:border-accent/30 hover:text-primary md:inline-flex"
        >
          {ad.ctaLabel}
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      </motion.article>
    );
  }
);
