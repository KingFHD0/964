"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Bell, Globe, Moon, Shield, User } from "lucide-react";
import { cn } from "@/lib/cn";

type TabId = "profile" | "notifications" | "appearance" | "language" | "privacy";

const TABS: { id: TabId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Moon },
  { id: "language", label: "Language", icon: Globe },
  { id: "privacy", label: "Privacy", icon: Shield }
];

export default function SettingsPage() {
  const [tab, setTab] = React.useState<TabId>("profile");

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-8 md:py-12">
      <div className="text-[11px] uppercase tracking-[0.22em] text-primary-muted/80">Settings</div>
      <h1 className="mt-3 font-display text-display-md font-medium tracking-tight text-grad">
        Preferences
      </h1>
      <p className="mt-2 max-w-2xl text-[14.5px] leading-relaxed text-primary/60">
        Tune your experience. Everything is saved automatically.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-[240px_1fr]">
        {/* Tab rail */}
        <nav className="md:sticky md:top-24 md:self-start">
          <ul className="flex gap-2 overflow-x-auto pb-1 no-scrollbar md:flex-col md:overflow-visible">
            {TABS.map((t) => {
              const active = tab === t.id;
              return (
                <li key={t.id} className="shrink-0">
                  <button
                    onClick={() => setTab(t.id)}
                    className={cn(
                      "focus-ring relative flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-[13.5px] transition-colors",
                      active
                        ? "bg-white/[0.05] text-primary"
                        : "text-primary/70 hover:bg-white/[0.03] hover:text-primary"
                    )}
                  >
                    <t.icon className={cn("h-4 w-4", active ? "text-accent" : "text-primary/50")} />
                    <span className="whitespace-nowrap">{t.label}</span>
                    {active ? (
                      <motion.span
                        layoutId="settings-active"
                        className="absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-r-full"
                        style={{ background: "linear-gradient(180deg, #7C8CFF, #5CE1E6)" }}
                      />
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Panel */}
        <div className="min-w-0">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
            className="space-y-4"
          >
            {tab === "profile" ? <ProfilePanel /> : null}
            {tab === "notifications" ? <NotificationsPanel /> : null}
            {tab === "appearance" ? <AppearancePanel /> : null}
            {tab === "language" ? <LanguagePanel /> : null}
            {tab === "privacy" ? <PrivacyPanel /> : null}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-white/[0.06] bg-ink-800/40 p-6 md:p-7">
      <div>
        <div className="font-display text-[16px] font-medium tracking-tight text-primary">{title}</div>
        {description ? <div className="mt-1 text-[13px] text-primary/60">{description}</div> : null}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="text-[11px] uppercase tracking-[0.18em] text-primary-muted/80">{label}</span>
        {hint ? <span className="text-[11px] text-primary-muted/70">{hint}</span> : null}
      </div>
      {children}
    </label>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="h-11 w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 text-[14px] text-primary outline-none transition-colors placeholder:text-primary-muted/60 focus:border-accent/40 focus:bg-white/[0.05]"
    />
  );
}

function Toggle({ checked, onChange, label, description }: { checked: boolean; onChange: (v: boolean) => void; label: string; description?: string }) {
  return (
    <div className="flex items-start justify-between gap-6 py-3">
      <div>
        <div className="text-[14px] text-primary">{label}</div>
        {description ? <div className="mt-0.5 text-[12.5px] text-primary/60">{description}</div> : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "focus-ring relative h-6 w-11 shrink-0 rounded-full transition-colors",
          checked ? "bg-grad-cta" : "bg-white/10"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
            checked ? "left-[22px] shadow-[0_0_12px_rgba(124,140,255,0.6)]" : "left-0.5"
          )}
        />
      </button>
    </div>
  );
}

function ProfilePanel() {
  return (
    <>
      <Section title="Account" description="How you appear in community threads and shared libraries.">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-full border border-white/[0.08] bg-gradient-to-br from-accent/40 to-accent-secondary/40 text-[16px] font-medium text-white">
            AM
          </div>
          <div className="flex flex-col gap-2">
            <button className="focus-ring inline-flex h-9 items-center rounded-full border border-white/[0.08] bg-white/[0.03] px-4 text-[12.5px] text-primary/85 hover:border-white/[0.15]">
              Change avatar
            </button>
            <button className="focus-ring inline-flex h-9 items-center rounded-full border border-white/[0.08] bg-transparent px-4 text-[12.5px] text-primary-muted hover:text-primary">
              Remove
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Full name">
            <TextInput defaultValue="Ahmed M." />
          </Field>
          <Field label="Username" hint="aether.964/@you">
            <TextInput defaultValue="ahmed" />
          </Field>
          <Field label="Email">
            <TextInput type="email" defaultValue="ahmed@aether964.com" />
          </Field>
          <Field label="Phone">
            <TextInput type="tel" placeholder="+964" />
          </Field>
        </div>
      </Section>

      <div className="flex justify-end gap-2">
        <button className="focus-ring inline-flex h-10 items-center rounded-full border border-white/[0.08] bg-transparent px-5 text-[13px] text-primary-muted hover:text-primary">
          Discard
        </button>
        <button className="focus-ring inline-flex h-10 items-center rounded-full bg-grad-cta px-5 text-[13px] font-medium text-white shadow-[0_8px_24px_-10px_rgba(124,140,255,0.55)] hover:brightness-110">
          Save changes
        </button>
      </div>
    </>
  );
}

function NotificationsPanel() {
  const [push, setPush] = React.useState(true);
  const [email, setEmail] = React.useState(true);
  const [drops, setDrops] = React.useState(true);
  const [billing, setBilling] = React.useState(true);
  const [community, setCommunity] = React.useState(false);
  return (
    <Section
      title="Notifications"
      description="Choose how Aether reaches you. We send rarely, and only when it matters."
    >
      <div className="divide-y divide-white/[0.04]">
        <Toggle checked={push} onChange={setPush} label="Push notifications" description="Enable native push to your device." />
        <Toggle checked={email} onChange={setEmail} label="Email digest" description="A weekly summary of new drops and community highlights." />
        <Toggle checked={drops} onChange={setDrops} label="New prompt drops" description="Be notified the moment new prompts land." />
        <Toggle checked={billing} onChange={setBilling} label="Billing reminders" description="Receipts, renewals, and payment alerts." />
        <Toggle checked={community} onChange={setCommunity} label="Community replies" description="When someone replies to your thread." />
      </div>
      <div className="mt-5 text-[12.5px] text-primary/60">
        Push not working?{" "}
        <Link href="/support" className="text-accent hover:text-accent-secondary">
          Contact support
        </Link>
      </div>
    </Section>
  );
}

function AppearancePanel() {
  const [theme, setTheme] = React.useState<"dark" | "midnight">("dark");
  const [motion, setMotion] = React.useState(true);
  const themes = [
    { id: "dark" as const, name: "Aether Dark", desc: "The default quiet cosmos." },
    { id: "midnight" as const, name: "Midnight Ink", desc: "Slightly deeper blacks for OLED." }
  ];
  return (
    <>
      <Section title="Theme" description="Choose your atmosphere.">
        <div className="grid gap-3 sm:grid-cols-2">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={cn(
                "focus-ring relative overflow-hidden rounded-2xl border p-5 text-left transition-all",
                theme === t.id
                  ? "border-accent/40 bg-white/[0.04]"
                  : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]"
              )}
            >
              <div
                className="mb-4 h-24 rounded-xl border border-white/[0.06]"
                style={{
                  background:
                    t.id === "dark"
                      ? "radial-gradient(80% 120% at 0% 0%, rgba(124,140,255,0.2), transparent 60%), #0B1020"
                      : "radial-gradient(80% 120% at 100% 100%, rgba(92,225,230,0.15), transparent 60%), #050816"
                }}
              />
              <div className="text-[14px] font-medium text-primary">{t.name}</div>
              <div className="mt-1 text-[12.5px] text-primary/60">{t.desc}</div>
            </button>
          ))}
        </div>
      </Section>

      <Section title="Motion" description="Tune the animation layer.">
        <Toggle
          checked={motion}
          onChange={setMotion}
          label="Enable motion"
          description="Subtle transitions, starfield, and micro-animations."
        />
      </Section>
    </>
  );
}

function LanguagePanel() {
  const [lang, setLang] = React.useState("en");
  const opts = [
    { id: "en", label: "English", helper: "Default" },
    { id: "ar", label: "العربية", helper: "Iraqi dialect available" }
  ];
  return (
    <Section title="Language" description="Pick the language of the interface.">
      <div className="grid gap-3 sm:grid-cols-2">
        {opts.map((o) => (
          <button
            key={o.id}
            onClick={() => setLang(o.id)}
            className={cn(
              "focus-ring rounded-2xl border px-5 py-4 text-left transition-all",
              lang === o.id
                ? "border-accent/40 bg-white/[0.04]"
                : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]"
            )}
          >
            <div className={cn("text-[15px] font-medium text-primary", o.id === "ar" && "font-arabic")}>{o.label}</div>
            <div className="mt-0.5 text-[12.5px] text-primary/60">{o.helper}</div>
          </button>
        ))}
      </div>
    </Section>
  );
}

function PrivacyPanel() {
  const [analytics, setAnalytics] = React.useState(true);
  const [profileSearch, setProfileSearch] = React.useState(false);
  return (
    <>
      <Section title="Privacy" description="Control your visibility and what we can learn.">
        <Toggle
          checked={analytics}
          onChange={setAnalytics}
          label="Anonymous product analytics"
          description="Help us improve Aether. We never sell or share your data."
        />
        <Toggle
          checked={profileSearch}
          onChange={setProfileSearch}
          label="Discoverable profile"
          description="Allow other members to find you by username."
        />
      </Section>
      <Section title="Danger zone" description="Irreversible actions for your account.">
        <button className="focus-ring inline-flex h-10 items-center rounded-full border border-red-500/30 bg-red-500/10 px-5 text-[13px] font-medium text-red-300 transition-colors hover:bg-red-500/15">
          Delete account
        </button>
      </Section>
    </>
  );
}
