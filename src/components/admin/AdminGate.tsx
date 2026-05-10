"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAdminAuth, type AdminRole } from "@/lib/store/admin-auth";

/**
 * AdminGate — wraps all /admin/* content and redirects to /admin/sign-in
 * if there is no active session OR the role is below the minimum required.
 *
 * This is only the first line of defense. APIs must re-verify server-side.
 */
export function AdminGate({
  children,
  minRole = "moderator"
}: {
  children: React.ReactNode;
  minRole?: AdminRole;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const session = useAdminAuth((s) => s.session);
  const hasRole = useAdminAuth((s) => s.hasRole);
  const bump = useAdminAuth((s) => s.bump);

  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    // Hydration barrier: zustand/persist rehydrates after first paint.
    const t = window.setTimeout(() => setReady(true), 0);
    return () => window.clearTimeout(t);
  }, []);

  React.useEffect(() => {
    if (!ready) return;
    if (pathname === "/admin/sign-in") return;
    if (!session) {
      router.replace(`/admin/sign-in?from=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!hasRole(minRole)) {
      router.replace("/admin/sign-in?reason=forbidden");
      return;
    }
    bump();
  }, [ready, session, pathname, router, hasRole, bump, minRole]);

  if (pathname === "/admin/sign-in") return <>{children}</>;
  if (!ready) return <AdminLoading />;
  if (!session) return <AdminLoading />;
  if (!hasRole(minRole)) return <AdminLoading />;
  return <>{children}</>;
}

function AdminLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] px-5 py-3 text-[12.5px] text-primary/80 backdrop-blur-xl">
        <span className="h-2 w-2 animate-pulse-soft rounded-full bg-accent shadow-[0_0_10px_rgba(124,140,255,0.8)]" />
        Verifying admin session…
      </div>
    </div>
  );
}
