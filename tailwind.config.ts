import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#050816",
          900: "#0B1020",
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
        arabic: ["var(--font-ibm-plex-arabic)", "Cairo", "system-ui", "sans-serif"]
      },
      fontSize: {
        "display-xl": ["clamp(3rem, 8vw, 7rem)", { lineHeight: "0.95", letterSpacing: "-0.04em" }],
        "display-lg": ["clamp(2.25rem, 5vw, 4.5rem)", { lineHeight: "1", letterSpacing: "-0.035em" }],
        "display-md": ["clamp(1.75rem, 3vw, 2.75rem)", { lineHeight: "1.05", letterSpacing: "-0.03em" }]
      },
      boxShadow: {
        "glow-sm": "0 0 20px rgba(124, 140, 255, 0.15)",
        "glow-md": "0 0 40px rgba(124, 140, 255, 0.2)",
        "glow-lg": "0 0 80px rgba(124, 140, 255, 0.25)",
        "elev-1": "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 8px 24px -12px rgba(0,0,0,0.6)",
        "elev-2": "0 1px 0 0 rgba(255,255,255,0.05) inset, 0 16px 48px -16px rgba(0,0,0,0.7)"
      },
      backgroundImage: {
        "grad-hero": "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(124,140,255,0.18), transparent 60%), radial-gradient(ellipse 60% 40% at 80% 20%, rgba(92,225,230,0.08), transparent 60%)",
        "grad-cta": "linear-gradient(135deg, #7C8CFF 0%, #5CE1E6 100%)",
        "grad-surface": "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)"
      },
      animation: {
        "fade-in": "fade-in 0.6s ease-out",
        "float": "float 6s ease-in-out infinite",
        "pulse-soft": "pulse-soft 3s ease-in-out infinite",
        "shimmer": "shimmer 2.5s ease-in-out infinite",
        "drift": "drift 30s linear infinite"
      },
      keyframes: {
        "fade-in": { "0%": { opacity: "0", transform: "translateY(8px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        "float": { "0%, 100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-6px)" } },
        "pulse-soft": { "0%, 100%": { opacity: "0.6" }, "50%": { opacity: "1" } },
        "shimmer": { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
        "drift": { "0%": { transform: "translate(0,0)" }, "100%": { transform: "translate(-40px,-20px)" } }
      },
      backdropBlur: { xs: "2px" }
    }
  },
  plugins: []
};

export default config;
