/**
 * HorizonBeam — the "Interstellar" horizon light.
 * Used as a local hero accent layered on top of CosmicBackground.
 */
export function HorizonBeam({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-x-0 top-[40%] h-[1px] ${className}`} aria-hidden>
      <div
        className="absolute left-1/2 top-1/2 h-[2px] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(124,140,255,0.8) 35%, rgba(255,255,255,0.95) 50%, rgba(92,225,230,0.8) 65%, transparent 100%)",
          boxShadow: "0 0 40px rgba(124,140,255,0.6), 0 0 80px rgba(92,225,230,0.3)"
        }}
      />
      <div
        className="absolute left-1/2 top-1/2 h-[240px] w-[80%] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(124,140,255,0.25) 0%, rgba(92,225,230,0.08) 30%, transparent 70%)",
          filter: "blur(40px)"
        }}
      />
    </div>
  );
}
