"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";

const LINKS = [
  { href: "#features", label: "Features" },
  { href: "#categories", label: "Library" },
  { href: "#pricing", label: "Pricing" },
  { href: "/updates", label: "Updates" }
];

export function TopNav() {
  const { scrollY } = useScroll();
  const bg = useTransform(scrollY, [0, 80], ["rgba(5,8,22,0)", "rgba(5,8,22,0.75)"]);
  const border = useTransform(scrollY, [0, 80], ["rgba(255,255,255,0)", "rgba(255,255,255,0.06)"]);
  const [open, setOpen] = React.useState(false);

  return (
    <motion.header
      style={{ backgroundColor: bg, borderColor: border }}
      className="fixed inset-x-0 top-0 z-50 border-b backdrop-blur-xl backdrop-saturate-150"
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        <Link href="/" className="focus-ring rounded-full">
          <Logo />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="focus-ring rounded-full px-3.5 py-2 text-[13px] text-primary/70 transition-colors hover:text-primary"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Button href="/sign-in" variant="ghost" size="sm">
            Sign in
          </Button>
          <Button href="/sign-up" variant="primary" size="sm">
            Get Aether
          </Button>
        </div>

        <button
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="focus-ring grid h-10 w-10 place-items-center rounded-full border border-white/[0.08] bg-white/[0.03] md:hidden"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
        className="overflow-hidden md:hidden"
      >
        <div className="mx-4 mb-3 rounded-2xl glass-strong p-2">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block rounded-xl px-4 py-3 text-[15px] text-primary/85 hover:bg-white/[0.04]"
            >
              {l.label}
            </Link>
          ))}
          <div className="my-1 hairline" />
          <div className="flex gap-2 p-2">
            <Button href="/sign-in" variant="secondary" size="sm" className="flex-1">
              Sign in
            </Button>
            <Button href="/sign-up" variant="primary" size="sm" className="flex-1">
              Get Aether
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.header>
  );
}
