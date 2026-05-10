import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, IBM_Plex_Sans_Arabic } from "next/font/google";
import { CosmicBackground } from "@/components/cosmic/CosmicBackground";
import { Toaster } from "@/components/ui/Toaster";
import { ServiceWorkerRegister } from "@/components/pwa/ServiceWorkerRegister";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import { CommandPaletteProvider } from "@/components/search/CommandPalette";
import { ThemeSync } from "@/lib/store/theme-sync";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap"
});

const ibmArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex-arabic",
  display: "swap"
});

export const metadata: Metadata = {
  title: {
    default: "Aether 964 — Create at the speed of light",
    template: "%s · Aether 964"
  },
  description:
    "AI infrastructure for the new Iraqi digital era. A premium prompt-as-a-service platform built for creators, operators, and studios.",
  applicationName: "Aether 964",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "Aether 964",
    statusBarStyle: "black-translucent"
  },
  icons: {
    icon: [
      { url: "/icons/icon.svg", type: "image/svg+xml" }
    ],
    apple: [
      { url: "/icons/icon.svg", type: "image/svg+xml" }
    ]
  },
  openGraph: {
    title: "Aether 964",
    description: "AI infrastructure for the new Iraqi digital era.",
    type: "website"
  }
};

export const viewport: Viewport = {
  themeColor: "#050816",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${ibmArabic.variable}`}>
      <body className="min-h-screen bg-ink-950 text-primary antialiased">
        <ThemeSync />
        <CosmicBackground />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-ink-800 focus:px-4 focus:py-2"
        >
          Skip to content
        </a>
        {children}
        <Toaster />
        <InstallPrompt />
        <CommandPaletteProvider />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
