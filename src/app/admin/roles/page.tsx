"use client";

import { Shield, Users } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { PageHeader, Section, StatusDot } from "@/components/admin/primitives";
import { useContentStore } from "@/lib/store/content-store";

/**
 * Roles & RBAC matrix — the permissions truth table for Aether.
 * Read-only on purpose (changing the matrix changes real auth policy, so it
 * should be a code-reviewed pull request, not a point-and-click toggle).
 */
type Permission = {
  key: string;
  label: string;
  description: string;
  roles: Record<string, boolean>;
};

const MATRIX: Permission[] = [
  {
    key: "content.prompts.write",
    label: "Edit prompts",
    description: "Create, update, and delete prompts in the library.",
    roles: { super_admin: true, admin: true, moderator: true, premium_user: false, standard_user: false }
  },
  {
    key: "content.encyclopedia.publish",
    label: "Publish encyclopedia articles",
    description: "Ship new articles live to readers.",
    roles: { super_admin: true, admin: true, moderator: true, premium_user: false, standard_user: false }
  },
  {
    key: "platform.users.suspend",
    label: "Suspend users",
    description: "Prevent an account from signing in.",
    roles: { super_admin: true, admin: true, moderator: false, premium_user: false, standard_user: false }
  },
  {
    key: "platform.users.delete",
    label: "Delete users",
    description: "Permanent deletion. Destructive — super_admin only.",
    roles: { super_admin: true, admin: false, moderator: false, premium_user: false, standard_user: false }
  },
  {
    key: "growth.notifications.send",
    label: "Send notifications",
    description: "Dispatch push / email campaigns to segments.",
    roles: { super_admin: true, admin: true, moderator: false, premium_user: false, standard_user: false }
  },
  {
    key: "growth.ads.manage",
    label: "Manage advertisements",
    description: "Create, edit, and schedule sponsor placements.",
    roles: { super_admin: true, admin: true, moderator: false, premium_user: false, standard_user: false }
  },
  {
    key: "platform.billing.read",
    label: "View billing & MRR",
    description: "See revenue dashboards and invoices.",
    roles: { super_admin: true, admin: true, moderator: false, premium_user: false, standard_user: false }
  },
  {
    key: "platform.security.rotate",
    label: "Rotate admin secrets",
    description: "Invalidate sessions, rotate keys, re-issue admin tokens.",
    roles: { super_admin: true, admin: false, moderator: false, premium_user: false, standard_user: false }
  },
  {
    key: "app.library.read",
    label: "Read library",
    description: "Access the public prompt library.",
    roles: { super_admin: true, admin: true, moderator: true, premium_user: true, standard_user: true }
  },
  {
    key: "app.pro.read",
    label: "Read pro content",
    description: "Access Supernova-only prompts and articles.",
    roles: { super_admin: true, admin: true, moderator: true, premium_user: true, standard_user: false }
  }
];

const ROLE_COLS = [
  { id: "super_admin", label: "Super" },
  { id: "admin", label: "Admin" },
  { id: "moderator", label: "Mod" },
  { id: "premium_user", label: "Premium" },
  { id: "standard_user", label: "User" }
];

export default function AdminRolesPage() {
  const users = useContentStore((s) => s.users);
  const counts = Object.fromEntries(
    ROLE_COLS.map((r) => [r.id, users.filter((u) => u.role === r.id).length])
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
      <PageHeader
        eyebrow="Platform · RBAC"
        title="Roles & permissions"
        description="The permission matrix that governs every server action. Source-controlled."
      />

      <Section title="Role headcount">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {ROLE_COLS.map((r) => (
            <div key={r.id} className="card-premium px-5 py-4">
              <div className="flex items-center gap-2 text-[10.5px] uppercase tracking-[0.2em] text-primary-muted">
                <Shield className="h-3 w-3 text-accent" />
                {r.label}
              </div>
              <div className="mt-2 font-display text-[22px] font-medium tracking-tight text-primary">
                {(counts as any)[r.id] ?? 0}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Permission matrix" description="A row is an allow-listed capability; a dot means the role may perform it.">
        <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-ink-800/40">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-white/[0.04] text-[10.5px] uppercase tracking-[0.18em] text-primary-muted">
                  <th className="px-4 py-3 font-normal">Capability</th>
                  {ROLE_COLS.map((r) => (
                    <th key={r.id} className="px-4 py-3 text-center font-normal">
                      {r.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MATRIX.map((p) => (
                  <tr key={p.key} className="border-b border-white/[0.04] last:border-b-0 hover:bg-white/[0.02]">
                    <td className="px-4 py-3.5">
                      <div className="flex flex-col">
                        <span className="font-mono text-[12px] text-primary/85">{p.key}</span>
                        <span className="mt-0.5 text-[12px] text-primary-muted">{p.description}</span>
                      </div>
                    </td>
                    {ROLE_COLS.map((r) => (
                      <td key={r.id} className="px-4 py-3.5 text-center">
                        {p.roles[r.id] ? (
                          <span className="inline-block h-2 w-2 rounded-full bg-accent-secondary shadow-[0_0_8px_rgba(92,225,230,0.8)]" />
                        ) : (
                          <span className="inline-block h-2 w-2 rounded-full bg-white/15" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      <Section title="Security policy">
        <div className="card-premium p-5">
          <ul className="space-y-2.5 text-[13px] text-primary/80">
            <li className="flex items-start gap-2">
              <StatusDot tone="ok">ok</StatusDot>
              Every permission is enforced server-side before any mutation.
            </li>
            <li className="flex items-start gap-2">
              <StatusDot tone="ok">ok</StatusDot>
              Super-admin capabilities require MFA re-confirmation.
            </li>
            <li className="flex items-start gap-2">
              <StatusDot tone="ok">ok</StatusDot>
              All privileged actions are written to the audit log with IP + user agent.
            </li>
            <li className="flex items-start gap-2">
              <StatusDot tone="info">info</StatusDot>
              Client-side role checks are UI-only; never a security boundary.
            </li>
          </ul>
        </div>
      </Section>
    </div>
  );
}
