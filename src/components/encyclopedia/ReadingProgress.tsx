"use client";

import * as React from "react";

/**
 * A whisper-thin reading progress bar pinned to the top of the viewport.
 * Uses a single rAF loop — does not re-render React on every frame.
 */
export function ReadingProgress() {
  const barRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    let rafId = 0;
    const update = () => {
      const el = barRef.current;
      if (!el) {
        rafId = requestAnimationFrame(update);
        return;
      }
      const scrolled = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const pct = Math.min(1, Math.max(0, scrolled / Math.max(1, height)));
      el.style.transform = `scaleX(${pct})`;
      rafId = requestAnimationFrame(update);
    };
    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-40 h-[2px]"
    >
      <div
        ref={barRef}
        className="origin-left h-full w-full bg-[linear-gradient(90deg,#7C8CFF,#5CE1E6)] shadow-[0_0_10px_rgba(124,140,255,0.6)]"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
