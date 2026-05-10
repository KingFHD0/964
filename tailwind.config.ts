import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#050816",
          900: "#0B1020",
          850: "#0E1428",
          800: "#111827",
          700: "#1A1F2E"
        },
        primary: {
          DEFAULT: "#F5F7FF",
          muted: "#9CA3AF"
        },
        accent: {
          DEFAULT: "#7C8CFF",
          secondary: "#5CE1E6"
        }
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "Inter", "system-ui", "sans-serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        arabic: ["var(--font-ibm-plex-arabic)", "Cairo", "system-ui", "sans-serif"],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace']
      },
      fontSize: {
        "display-xl": ["clamp(3rem, 8vw, 7rem)", { lineHeight: "0.95", letterSpacing: "-0.045em" }],
        "display-lg": ["clamp(2.25rem, 5vw, 4.5rem)", { lineHeight: "1.02", letterSpacing: "-0.035em" }],
        "display-md": ["clamp(1.75rem, 3vw, 2.75rem)", { lineHeight: "1.08", letterSpacing: "-0.03em" }],
        "display-sm": ["clamp(1.375rem, 2vw, 1.75rem)", { lineHeight: "1.15", letterSpacing: "-0.02em" }]
      },
      boxShadow: {
        "glow-xs": "0 0 12px rgba(124, 140, 255, 0.12)",
        "glow-sm": "0 0 24px rgba(124, 140, 255, 0.18)",
        "glow-md": "0 0 48px rgba(124, 140, 255, 0.22)",
        "glow-lg": "0 0 96px rgba(124, 140, 255, 0.28)",
        "glow-teal": "0 0 40px rgba(92, 225, 230, 0.22)",
        "elev-1":
          "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 8px 24px -12px rgba(0,0,0,0.6)",
        "elev-2":
          "0 1px 0 0 rgba(255,255,255,0.05) inset, 0 16px 48px -16px rgba(0,0,0,0.7)",
        "elev-3":
          "0 1px 0 0 rgba(255,255,255,0.06) inset, 0 1px 0 0 rgba(255,255,255,0.02), 0 24px 80px -24px rgba(0,0,0,0.85)",
        "ring-accent":
          "0 0 0 1px rgba(124,140,255,0.35), 0 8px 32px -8px rgba(124,140,255,0.4)",
        "inset-border": "inset 0 0 0 1px rgba(255,255,255,0.06)"
      },
      backgroundImage: {
        "grad-hero":
          "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(124,140,255,0.18), transparent 60%), radial-gradient(ellipse 60% 40% at 80% 20%, rgba(92,225,230,0.08), transparent 60%)",
        "grad-cta": "linear-gradient(135deg, #7C8CFF 0%, #5CE1E6 100%)",
        "grad-surface":
          "linear-gradient(180deg, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.01) 100%)",
        "grad-surface-strong":
          "linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.015) 100%)",
        "grad-card-sheen":
          "radial-gradient(120% 80% at 0% 0%, rgba(124,140,255,0.1), transparent 50%)",
        "grad-accent-soft":
          "linear-gradient(135deg, rgba(124,140,255,0.15), rgba(92,225,230,0.08))"
      },
      animation: {
        "fade-in": "fade-in 0.6s cubic-bezier(0.2,0.8,0.2,1)",
        "fade-in-up": "fade-in-up 0.8s cubic-bezier(0.2,0.8,0.2,1)",
        "float": "float 6s ease-in-out infinite",
        "float-slow": "float 9s ease-in-out infinite",
        "pulse-soft": "pulse-soft 3s ease-in-out infinite",
        "shimmer": "shimmer 2.5s ease-in-out infinite",
        "drift": "drift 30s linear infinite",
        "drift-slow": "drift 60s linear infinite",
        "sheen": "sheen 2.4s cubic-bezier(0.2,0.8,0.2,1) infinite",
        "breathe": "breathe 6s ease-in-out infinite",
        "aurora": "aurora 14s ease-in-out infinite"
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" }
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" }
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        },
        "drift": {
          "0%": { transform: "translate(0,0)" },
          "100%": { transform: "translate(-40px,-20px)" }
        },
        "sheen": {
          "0%": { transform: "translateX(-120%)" },
          "100%": { transform: "translateX(220%)" }
        },
        "breathe": {
          "0%, 100%": { opacity: "0.55", transform: "scale(1)" },
          "50%": { opacity: "0.95", transform: "scale(1.04)" }
        },
        "aurora": {
          "0%, 100%": { transform: "translate3d(0,0,0) rotate(0deg)", opacity: "0.55" },
          "50%": { transform: "translate3d(3%, -2%, 0) rotate(6deg)", opacity: "0.85" }
        }
      },
      backdropBlur: { xs: "2px" },
      transitionTimingFunction: {
        "premium": "cubic-bezier(0.2, 0.8, 0.2, 1)",
        "smooth-out": "cubic-bezier(0.16, 1, 0.3, 1)"
      }
    }
  },
  plugins: []
};

export default config;
