import { Starfield } from "./Starfield";

/**
 * Global ambient background — calm, infinite, premium.
 *
 * Layers (bottom to top):
 *  1. Deep ink canvas (#050816)
 *  2. Top horizon glow (accent haze)
 *  3. Slow-drifting aurora (very subtle indigo/teal wash)
 *  4. Orthographic grid (depth reference, masked)
 *  5. Sparse twinkling starfield
 *  6. Cosmic dust (tiny particles, slow drift)
 *  7. Bottom vignette
 *  8. Film grain
 *
 * Every layer is engineered to stay whisper-quiet.
 */
export function CosmicBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink-950">
      {/* 2. Top horizon glow */}
      <div
        className="absolute left-1/2 top-[-22%] h-[86vh] w-[140vw] -translate-x-1/2"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(124,140,255,0.16) 0%, rgba(92,225,230,0.05) 32%, transparent 70%)",
          filter: "blur(44px)"
        }}
        aria-hidden
      />

      {/* 3. Aurora wash — slow breathing */}
      <div className="absolute inset-0 animate-aurora opacity-70" aria-hidden>
        <div
          className="absolute left-[-10%] top-[10%] h-[60vh] w-[70vw] rounded-full"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(124,140,255,0.10), transparent 60%)",
            filter: "blur(80px)"
          }}
        />
        <div
          className="absolute right-[-15%] top-[30%] h-[50vh] w-[60vw] rounded-full"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(92,225,230,0.07), transparent 60%)",
            filter: "blur(80px)"
          }}
        />
      </div>

      {/* 4. Faint orthographic grid */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage:
            "radial-gradient(ellipse at 50% 30%, rgba(0,0,0,0.9) 0%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 50% 30%, rgba(0,0,0,0.9) 0%, transparent 75%)"
        }}
        aria-hidden
      />

      {/* 5. Stars */}
      <Starfield />

      {/* 6. Dust drift */}
      <div
        className="absolute inset-0 animate-drift-slow opacity-[0.09] mix-blend-screen"
        style={{
          backgroundImage:
            "radial-gradient(1px 1px at 10% 20%, rgba(245,247,255,0.8), transparent 50%), radial-gradient(1px 1px at 70% 60%, rgba(245,247,255,0.7), transparent 50%), radial-gradient(1.2px 1.2px at 40% 80%, rgba(124,140,255,0.9), transparent 50%), radial-gradient(1px 1px at 85% 30%, rgba(92,225,230,0.85), transparent 50%), radial-gradient(1px 1px at 25% 55%, rgba(245,247,255,0.6), transparent 50%)",
          backgroundSize: "600px 600px, 500px 500px, 700px 700px, 550px 550px, 480px 480px"
        }}
        aria-hidden
      />

      {/* 7. Bottom vignette */}
      <div
        className="absolute inset-x-0 bottom-[-30%] h-[70vh]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(5,8,22,0.95) 0%, transparent 70%)"
        }}
        aria-hidden
      />

      {/* 8. Film grain */}
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"
        }}
        aria-hidden
      />
    </div>
  );
}
