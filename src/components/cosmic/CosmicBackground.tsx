import { Starfield } from "./Starfield";

/**
 * Global ambient background.
 * - Deep ink canvas (#050816)
 * - Soft radial gradients (horizon, subtle accent haze)
 * - Sparse twinkling starfield
 * - Faint grid for depth
 * - Noise overlay for film-grade texture
 * Very subtle by design.
 */
export function CosmicBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink-950">
      {/* Top horizon glow */}
      <div
        className="absolute left-1/2 top-[-20%] h-[80vh] w-[140vw] -translate-x-1/2"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(124,140,255,0.14) 0%, rgba(92,225,230,0.05) 30%, transparent 65%)",
          filter: "blur(40px)"
        }}
        aria-hidden
      />
      {/* Bottom atmosphere */}
      <div
        className="absolute inset-x-0 bottom-[-30%] h-[70vh]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(17,24,39,0.9) 0%, transparent 70%)"
        }}
        aria-hidden
      />
      {/* Faint orthographic grid */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage:
            "radial-gradient(ellipse at 50% 30%, rgba(0,0,0,0.9) 0%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 50% 30%, rgba(0,0,0,0.9) 0%, transparent 70%)"
        }}
        aria-hidden
      />
      {/* Stars */}
      <Starfield />
      {/* Dust drift */}
      <div
        className="absolute inset-0 animate-drift opacity-[0.08] mix-blend-screen"
        style={{
          backgroundImage:
            "radial-gradient(1px 1px at 10% 20%, rgba(245,247,255,0.8), transparent 50%), radial-gradient(1px 1px at 70% 60%, rgba(245,247,255,0.7), transparent 50%), radial-gradient(1px 1px at 40% 80%, rgba(124,140,255,0.9), transparent 50%), radial-gradient(1px 1px at 85% 30%, rgba(92,225,230,0.8), transparent 50%)",
          backgroundSize: "600px 600px, 500px 500px, 700px 700px, 550px 550px"
        }}
        aria-hidden
      />
      {/* Film grain */}
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
