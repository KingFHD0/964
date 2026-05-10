"use client";

import { useEffect, useMemo, useRef } from "react";

/**
 * Starfield — subtle, calm, cinematic.
 * Draws tiny twinkling stars with slow parallax drift.
 * Respects prefers-reduced-motion.
 */
export function Starfield({
  density = 0.00022,
  className = ""
}: {
  density?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const reducedMotion = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let stars: Array<{ x: number; y: number; r: number; a: number; tw: number; vx: number; vy: number }> = [];

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.floor(w * h * density);
      stars = new Array(count).fill(0).map(() => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.2 + 0.2,
        a: Math.random() * 0.6 + 0.2,
        tw: Math.random() * 0.008 + 0.002,
        vx: (Math.random() - 0.5) * 0.02,
        vy: (Math.random() - 0.5) * 0.02
      }));
    }

    function draw(t: number) {
      ctx!.clearRect(0, 0, w, h);
      for (const s of stars) {
        const flicker = Math.sin(t * s.tw) * 0.25 + 0.75;
        const alpha = Math.max(0, Math.min(1, s.a * flicker));
        ctx!.beginPath();
        ctx!.fillStyle = `rgba(245, 247, 255, ${alpha})`;
        ctx!.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx!.fill();
        if (!reducedMotion) {
          s.x += s.vx;
          s.y += s.vy;
          if (s.x < 0) s.x = w;
          if (s.x > w) s.x = 0;
          if (s.y < 0) s.y = h;
          if (s.y > h) s.y = 0;
        }
      }
      rafRef.current = requestAnimationFrame(draw);
    }

    resize();
    draw(0);
    const onResize = () => resize();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [density, reducedMotion]);

  return <canvas ref={canvasRef} className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden />;
}
