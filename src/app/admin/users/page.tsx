"use client";

import * as React from "react";
import { Ban, MailCheck, Pencil, Plus, ShieldCheck, Sparkles, Trash2, UserCog } from "lucide-react";
import {
  DataTable,
  Field,
  Modal,
  PageHeader,
  Section,
  Select,
  StatusDot,
  TextInput,
  Toolbar,
  type Column
} from "@/components/admin/primitives";
import { Badge } from "@/components/ui/Badge";
import { useContentStore, type User } from "@/lib/store/content-store";
import { useAdminAuth } from "@/lib/store/admin-auth";
import { toast } from "@/components/ui/Toaster";
import { sanitizeText } from "@/lib/security/sanitize";

const ROLES: User["role"][] = [
  "super_admin",
  "admin",
  "moderator",
  "premium_user",
  "standard_user"
];
const PLANS: User["plan"][] = ["Free", "Orbit", "Supernova"];

export default function AdminUsersPage() {
  const users = useContentStore((s) => s.users);
  const upsert = useContentStore((s) => s.upsertUser);
  const remove = useContentStore((s) => s.removeUser);
  const suspend = useContentStore((s) => s.suspendUser);
  const logEvent = useContentStore((s) => s.logEvent);
  const actor = useAdminAuth((s) => s.session?.name ?? "system");

  const [query, setQuery] = React.useState("");
  const [role, setRole] = React.useState<string>("All");
  const [status, setStatus] = React.useState<string>("All");
  const [editing, setEditing] = React.useState<User | null>(null);
  const [creating, setCreating] = React.useState(false);
  const [confirming, setConfirming] = React.useState<User | null>(null);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((u) => {
      if (role !== "All" && u.role !== role) return false;
      if (status !== "All" && u.status !== status) return false;
      if (!q) return true;
      return [u.name, u.email, u.role].some((v) => v.toLowerCase().includes(q));
    });
  }, [users, query, role, status]);

  const columns: Column<User>[] = [
    {
      key: "name",
      label: "Member",
      render: (u) => (
        <div className="flex items-center gap-3">
          <span className="grid h-8 w-8 place-items-center rounded-full border border-white/[0.08] bg-gradient-to-br from-accent/40 to-accent-secondary/40 text-[11px] font-medium text-white">
            {u.name.split(" ").map((x) => x[0]).slice(0, 2).join("")}
          </span>
          <div className="min-w-0">
            <div className="truncate text-[13.5px] text-primary">{u.name}</div>
            <div className="truncate text-[11.5px] text-primary-muted">{u.email}</div>
          </div>
        </div>
      )
    },
    {
      key: "plan",
      label: "Plan",
      render: (u) => (
        <Badge tone={u.plan === "Supernova" ? "accent" : u.plan === "Orbit" ? "secondary" : "mute"}>
          {u.plan}
        </Badge>
      )
    },
    {
      key: "role",
      label: "Role",
      render: (u) => <span className="text-primary/80 font-mono text-[12px]">{u.role}</span>
    },
    {
      key: "status",
      label: "Status",
      render: (u) => (
        <StatusDot
          tone={u.status === "active" ? "ok" : u.status === "suspended" ? "danger" : "warn"}
        >
          {u.status}
        </StatusDot>
      )
    },
    {
      key: "mrrContribution",
      label: "MRR",
      align: "right",
      render: (u) => (
        <span className="font-mono text-primary/85">${u.mrrContribution}</span>
      )
    },
    {
      key: "actions",
      label: "",
      align: "right",
      render: (u) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              suspend(u.id);
              logEvent({
                actor,
                action: `${u.status === "suspended" ? "Reactivated" : "Suspended"} user: ${u.email}`,
                severity: "warn"
              });
              toast({ title: u.status === "suspended" ? "User reactivated" : "User suspended", tone: "warn" });
            }}
            title={u.status === "suspended" ? "Reactivate" : "Suspend"}
            className="focus-ring grid h-8 w-8 place-items-center rounded-full border border-white/[0.06] bg-white/[0.02] text-primary/80 hover:border-white/[0.14] hover:text-primary"
          >
            <Ban className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toast({ title: "Password reset link sent", description: u.email, tone: "success" });
              logEvent({ actor, action: `Sent password reset to ${u.email}`, severity: "info" });
            }}
            title="Send password reset"
            className="focus-ring grid h-8 w-8 place-items-center rounded-full border border-white/[0.06] bg-white/[0.02] text-primary/80 hover:border-white/[0.14] hover:text-primary"
          >
            <MailCheck className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditing(u);
            }}
            title="Edit"
            className="focus-ring grid h-8 w-8 place-items-center rounded-full border border-white/[0.06] bg-white/[0.02] text-primary/80 hover:border-white/[0.14] hover:text-primary"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setConfirming(u);
            }}
            title="Delete"
            className="focus-ring grid h-8 w-8 place-items-center rounded-full border border-white/[0.06] bg-white/[0.02] text-primary/80 hover:border-red-400/30 hover:text-red-300"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
      <PageHeader
        eyebrow="Platform · Users"
        title="User management"
        description="View, promote, suspend, and investigate individual accounts."
        actions={
          <button
            onClick={() => setCreating(true)}
            className="focus-ring inline-flex h-10 items-center gap-2 rounded-full bg-grad-cta px-4 text-[13px] font-medium text-white shadow-[0_8px_24px_-10px_rgba(124,140,255,0.6)] hover:brightness-110"
          >
            <Plus className="h-3.5 w-3.5" />
            New user
          </button>
        }
      />

      <Section title="All members">
        <Toolbar search={query} onSearch={setQuery} placeholder="Search by name, email, or role…">
          <Select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="All">All roles</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </Select>
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="All">Any status</option>
            <option value="active">active</option>
            <option value="suspended">suspended</option>
            <option value="pending">pending</option>
          </Select>
        </Toolbar>
        <div className="mt-5">
          <DataTable columns={columns} rows={filtered} onRowClick={(u) => setEditing(u)} />
        </div>
      </Section>

      <UserEditor
        open={creating || !!editing}
        mode={creating ? "create" : "edit"}
        initial={editing ?? undefined}
        onClose={() => {
          setCreating(false);
          setEditing(null);
        }}
        onSubmit={(u) => {
          const clean: User = {
            ...u,
            name: sanitizeText(u.name, 80),
            email: sanitizeText(u.email, 180)
          };
          upsert(clean);
          logEvent({
            actor,
            action: `${creating ? "Created" : "Updated"} user: ${clean.email}`,
            severity: "info"
          });
          toast({ title: creating ? "User created" : "User updated", tone: "success" });
          setCreating(false);
          setEditing(null);
        }}
      />

      <Modal
        open={!!confirming}
        onClose={() => setConfirming(null)}
        title="Delete this account?"
        description="Deletion is permanent and removes analytics history. Suspending preserves data."
        footer={
          <>
            <button
              onClick={() => setConfirming(null)}
              className="h-10 rounded-full border border-white/[0.08] bg-transparent px-5 text-[13px] text-primary-muted hover:text-primary"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (!confirming) return;
                remove(confirming.id);
                logEvent({ actor, action: `Deleted user: ${confirming.email}`, severity: "critical" });
                toast({ title: "User deleted", tone: "warn" });
                setConfirming(null);
              }}
              className="h-10 rounded-full bg-red-500/15 px-5 text-[13px] font-medium text-red-200 hover:bg-red-500/25"
            >
              Delete
            </button>
          </>
        }
      >
        <div className="text-[13px] text-primary/70">
          <span className="font-medium text-primary">{confirming?.email}</span>
        </div>
      </Modal>
    </div>
  );
}

function UserEditor({
  open,
  mode,
  initial,
  onClose,
  onSubmit
}: {
  open: boolean;
  mode: "create" | "edit";
  initial?: User;
  onClose: () => void;
  onSubmit: (u: User) => void;
}) {
  const empty: User = {
    id: `u-${Date.now().toString(36)}`,
    name: "",
    email: "",
    plan: "Orbit",
    role: "standard_user",
    status: "active",
    createdAt: new Date().toISOString().slice(0, 10),
    lastActive: new Date().toISOString().slice(0, 10),
    mrrContribution: 9
  };
  const [u, setU] = React.useState<User>(empty);
  React.useEffect(() => {
    if (!open) return;
    setU(initial ? { ...initial } : { ...empty, id: `u-${Date.now().toString(36)}` });
  }, [open, initial]); // eslint-disable-line react-hooks/exhaustive-deps

  function patch<K extends keyof User>(k: K, v: User[K]) {
    setU((prev) => ({ ...prev, [k]: v }));
  }

  const canSave = u.name.length >= 2 && /@/.test(u.email);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === "create" ? "New user" : "Edit user"}
      size="md"
      footer={
        <>
          <button
            onClick={onClose}
            className="h-10 rounded-full border border-white/[0.08] bg-transparent px-5 text-[13px] text-primary-muted hover:text-primary"
          >
            Cancel
          </button>
          <button
            disabled={!canSave}
            onClick={() => onSubmit(u)}
            className={
              "h-10 rounded-full px-5 text-[13px] font-medium " +
              (canSave
                ? "bg-grad-cta text-white shadow-[0_8px_24px_-10px_rgba(124,140,255,0.6)] hover:brightness-110"
                : "cursor-not-allowed bg-white/[0.05] text-primary-muted")
            }
          >
            {mode === "create" ? "Create" : "Save"}
          </button>
        </>
      }
    >
      <Field label="Full name">
        <TextInput value={u.name} onChange={(e) => patch("name", e.target.value)} />
      </Field>
      <div className="mt-4">
        <Field label="Email">
          <TextInput type="email" value={u.email} onChange={(e) => patch("email", e.target.value)} />
        </Field>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Field label="Plan">
          <Select value={u.plan} onChange={(e) => patch("plan", e.target.value as User["plan"])}>
            {PLANS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Role">
          <Select value={u.role} onChange={(e) => patch("role", e.target.value as User["role"])}>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Status">
          <Select value={u.status} onChange={(e) => patch("status", e.target.value as User["status"])}>
            <option value="active">active</option>
            <option value="suspended">suspended</option>
            <option value="pending">pending</option>
          </Select>
        </Field>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Created">
          <TextInput value={u.createdAt} onChange={(e) => patch("createdAt", e.target.value)} />
        </Field>
        <Field label="MRR contribution">
          <TextInput
            type="number"
            value={u.mrrContribution}
            onChange={(e) => patch("mrrContribution", Number(e.target.value))}
          />
        </Field>
      </div>
    </Modal>
  );
}
