"use client";

/**
 * Admin auth — demo RBAC gate.
 *
 * Security posture:
 *  - Client-only for this preview. In production, every admin action must
 *    re-verify the session on the server via a signed JWT / Supabase JWT
 *    with RLS, and all admin APIs must check role server-side.
 *  - The login credentials below are DEMO-ONLY. Never deploy this file
 *    unchanged; swap `verifyCredentials` for your real provider.
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type AdminRole = "super_admin" | "admin" | "moderator";

export type AdminSession = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  loggedInAt: string;
  lastSeenAt: string;
  mfa: boolean;
};

type AdminAuthStore = {
  session: AdminSession | null;
  loginAttempts: { ts: number; ok: boolean }[];
  login: (email: string, password: string, otp?: string) => { ok: true } | { ok: false; reason: string };
  logout: () => void;
  bump: () => void;
  hasRole: (min: AdminRole) => boolean;
};

const ROLE_RANK: Record<AdminRole, number> = {
  super_admin: 3,
  admin: 2,
  moderator: 1
};

/**
 * Demo credentials. Replace with real server auth.
 *  email: admin@aether964.com      password: aether-admin       role: super_admin
 *  email: moderator@aether964.com  password: aether-mod         role: moderator
 *
 * An `otp` of "000000" satisfies the demo MFA. In production, use TOTP (e.g., otplib).
 */
const DEMO_ACCOUNTS: Array<{
  id: string;
  name: string;
  email: string;
  password: string;
  role: AdminRole;
  mfa: boolean;
}> = [
  {
    id: "admin-1",
    name: "Ahmed M.",
    email: "admin@aether964.com",
    password: "aether-admin",
    role: "super_admin",
    mfa: true
  },
  {
    id: "admin-2",
    name: "Layla H.",
    email: "moderator@aether964.com",
    password: "aether-mod",
    role: "moderator",
    mfa: false
  }
];

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 60_000; // 60s rolling window

export const useAdminAuth = create<AdminAuthStore>()(
  persist(
    (set, get) => ({
      session: null,
      loginAttempts: [],

      login: (email, password, otp) => {
        const now = Date.now();
        // Rolling-window rate limit
        const recent = get().loginAttempts.filter((a) => now - a.ts < LOCKOUT_MS);
        const recentFails = recent.filter((a) => !a.ok).length;
        if (recentFails >= MAX_ATTEMPTS) {
          return {
            ok: false,
            reason: "Too many attempts. Wait a minute and try again."
          };
        }

        const acct = DEMO_ACCOUNTS.find(
          (a) => a.email.toLowerCase() === email.trim().toLowerCase()
        );
        const ok =
          !!acct &&
          acct.password === password &&
          (!acct.mfa || otp === "000000");

        set({
          loginAttempts: [...recent, { ts: now, ok }].slice(-20)
        });

        if (!ok || !acct) {
          return { ok: false, reason: "Invalid credentials." };
        }

        const session: AdminSession = {
          id: acct.id,
          name: acct.name,
          email: acct.email,
          role: acct.role,
          loggedInAt: new Date().toISOString(),
          lastSeenAt: new Date().toISOString(),
          mfa: acct.mfa
        };
        set({ session });
        return { ok: true };
      },

      logout: () => set({ session: null }),

      bump: () => {
        const s = get().session;
        if (!s) return;
        set({ session: { ...s, lastSeenAt: new Date().toISOString() } });
      },

      hasRole: (min) => {
        const s = get().session;
        if (!s) return false;
        return ROLE_RANK[s.role] >= ROLE_RANK[min];
      }
    }),
    {
      name: "aether.admin.session.v1",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? window.localStorage : (undefined as any)
      ),
      partialize: (s) => ({ session: s.session, loginAttempts: s.loginAttempts })
    }
  )
);
