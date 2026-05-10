"use client";

import { useEffect, useState } from "react";
import { EarthOrb } from "@/components/cosmic/EarthOrb";
import { useContentStore } from "@/lib/store/content-store";

/**
 * AdminBackdrop — the "mission control" atmosphere.
 * Layers:
 *  - A low-opacity rotating Earth pinned to the bottom-right
 *  - A subtle scan gradient hinting at live data
 *  - Everything else (stars/grain/aurora) comes from global CosmicBackground.
 */
export function AdminBackdrop() {
  const theme = useContentStore((s) => s.theme);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Cool scan wash tied to the accent */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(80% 60% at 15% 0%, rgba(124,140,255,0.10), transparent 60%), radial-gradient(60% 50% at 100% 100%, rgba(92,225,230,0.07), transparent 60%)"
        }}
      />
      {/* Soft grid hinted at the top */}
      <div
        className="absolute inset-x-0 top-0 h-[420px] opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "linear-gradient(180deg, rgba(0,0,0,0.75), transparent)",
          WebkitMaskImage:
            "linear-gradient(180deg, rgba(0,0,0,0.75), transparent)"
        }}
      />
      {/* Earth — bottom right, very subtle */}
      {mounted && theme.earth ? (
        <EarthOrb className="-right-40 top-1/2 -translate-y-1/2 lg:-right-56 xl:-right-40" size={680} />
      ) : null}
      {/* Vignette */}
      <div
        className="absolute inset-x-0 bottom-0 h-48"
        style={{
          background:
            "linear-gradient(180deg, transparent, rgba(5,8,22,0.85))"
        }}
      />
    </div>
  );
}
