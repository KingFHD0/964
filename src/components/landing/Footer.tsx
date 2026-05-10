import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

const COLS = [
  {
    title: "Platform",
    items: [
      { href: "/library", label: "Prompt Library" },
      { href: "/dashboard", label: "Dashboard" },
      { href: "/pricing", label: "Pricing" },
      { href: "/updates", label: "Updates" }
    ]
  },
  {
    title: "Company",
    items: [
      { href: "#", label: "About" },
      { href: "#", label: "Manifesto" },
      { href: "#", label: "Careers" },
      { href: "#", label: "Contact" }
    ]
  },
  {
    title: "Legal",
    items: [
      { href: "#", label: "Terms" },
      { href: "#", label: "Privacy" },
      { href: "#", label: "Cookies" },
      { href: "#", label: "Licenses" }
    ]
  }
];

export function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] bg-ink-950/60 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2 md:col-span-2">
            <Logo />
            <p className="mt-6 max-w-xs text-[13px] leading-relaxed text-primary/55">
              Aether 964 is a premium prompt-as-a-service platform built in Baghdad, for the Middle
              East and beyond.
            </p>
          </div>
          {COLS.map((c) => (
            <div key={c.title}>
              <div className="text-[11px] uppercase tracking-[0.22em] text-primary-muted">{c.title}</div>
              <ul className="mt-4 space-y-2.5">
                {c.items.map((i) => (
                  <li key={i.label}>
                    <Link
                      href={i.href}
                      className="text-[13.5px] text-primary/70 transition-colors hover:text-primary"
                    >
                      {i.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/[0.06] pt-6 text-[12px] text-primary-muted/80 md:flex-row md:items-center">
          <div>© {new Date().getFullYear()} Aether 964. All quiet things reserved.</div>
          <div className="flex items-center gap-5">
            <span>Made in Baghdad</span>
            <span aria-hidden className="h-1 w-1 rounded-full bg-white/20" />
            <span>Built for the Middle East</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
