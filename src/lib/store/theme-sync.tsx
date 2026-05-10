"use client";

import { useEffect } from "react";
import { useContentStore } from "./content-store";

/**
 * ThemeSync — bridges the editable theme settings to CSS variables.
 * Mounted near the root so every page reacts instantly to admin changes.
 */
export function ThemeSync() {
  const theme = useContentStore((s) => s.theme);

  useEffect(() => {
    const r = document.documentElement;
    r.style.setProperty("--accent", theme.accent);
    r.style.setProperty("--accent-secondary", theme.accentSecondary);
    r.style.setProperty("--blur-intensity", `${theme.blurIntensity}px`);
    r.style.setProperty("--glow-intensity", `${theme.glowIntensity}`);
    r.style.setProperty("--grain-opacity", `${theme.grainOpacity}`);
    r.setAttribute("data-particles", theme.particles ? "on" : "off");
    r.setAttribute("data-earth", theme.earth ? "on" : "off");
    r.setAttribute("data-motion", theme.motion ? "on" : "off");
  }, [theme]);

  return null;
}
