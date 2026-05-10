"use client";

import { motion } from "framer-motion";

/**
 * EarthOrb — slow-rotating, semi-transparent globe for the admin backdrop.
 *
 * Pure SVG (no textures, no WebGL) so it stays <5kb on the wire, zero GPU
 * pressure, and never feels gamey. Toggleable from Theme settings
 * (data-earth="on|off" on <html>).
 */
export function EarthOrb({
  className = "",
  size = 520
}: {
  className?: string;
  size?: number;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Outer halo */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 32% 28%, rgba(124,140,255,0.28), rgba(92,225,230,0.06) 45%, transparent 70%)",
          filter: "blur(28px)"
        }}
      />
      {/* Rim light */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          boxShadow:
            "inset 18px 0 60px rgba(124,140,255,0.14), inset -18px 0 60px rgba(92,225,230,0.08)"
        }}
      />
      {/* Globe body */}
      <motion.svg
        viewBox="0 0 600 600"
        className="relative h-full w-full"
        initial={false}
        animate={{ rotate: 360 }}
        transition={{ duration: 220, ease: "linear", repeat: Infinity }}
        style={{ opacity: 0.55 }}
      >
        <defs>
          <radialGradient id="earth-fill" cx="38%" cy="32%" r="75%">
            <stop offset="0%" stopColor="#0E1834" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#0B1020" stopOpacity="0.92" />
            <stop offset="100%" stopColor="#050816" stopOpacity="0.98" />
          </radialGradient>
          <linearGradient id="earth-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7C8CFF" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#5CE1E6" stopOpacity="0.15" />
          </linearGradient>
          <clipPath id="earth-clip">
            <circle cx="300" cy="300" r="240" />
          </clipPath>
        </defs>

        <circle cx="300" cy="300" r="240" fill="url(#earth-fill)" />

        {/* Meridians / parallels, clipped to sphere */}
        <g clipPath="url(#earth-clip)" stroke="url(#earth-ring)" fill="none" strokeWidth="0.8">
          {[-60, -40, -20, 0, 20, 40, 60].map((deg) => (
            <ellipse key={`p-${deg}`} cx="300" cy={300 + deg * 2.6} rx="240" ry={Math.max(6, 240 - Math.abs(deg) * 3.2)} />
          ))}
          {Array.from({ length: 12 }).map((_, i) => (
            <ellipse
              key={`m-${i}`}
              cx="300"
              cy="300"
              rx={Math.max(6, 240 - Math.abs(6 - i) * 36)}
              ry="240"
              transform={`rotate(${i * 15} 300 300)`}
            />
          ))}
        </g>

        {/* Continent specks — purely decorative blobs */}
        <g clipPath="url(#earth-clip)" fill="#7C8CFF" opacity="0.18">
          <ellipse cx="210" cy="220" rx="38" ry="18" transform="rotate(-14 210 220)" />
          <ellipse cx="305" cy="210" rx="46" ry="16" transform="rotate(8 305 210)" />
          <ellipse cx="260" cy="320" rx="56" ry="20" transform="rotate(-6 260 320)" />
          <ellipse cx="360" cy="340" rx="26" ry="14" transform="rotate(24 360 340)" />
          <ellipse cx="400" cy="230" rx="24" ry="10" />
          <ellipse cx="230" cy="400" rx="34" ry="12" />
        </g>

        {/* Outer ring */}
        <circle
          cx="300"
          cy="300"
          r="252"
          fill="none"
          stroke="url(#earth-ring)"
          strokeWidth="1"
          opacity="0.7"
        />
      </motion.svg>

      {/* Foreground specular */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 34% 28%, rgba(255,255,255,0.08), transparent 40%)"
        }}
      />
    </div>
  );
}
