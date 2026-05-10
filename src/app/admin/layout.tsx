"use client";

import * as React from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { AdminBackdrop } from "@/components/admin/AdminBackdrop";
import { AdminGate } from "@/components/admin/AdminGate";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="relative min-h-screen">
      {/* ThemeSync is mounted globally in the root layout; no need to duplicate here. */}
      <AdminBackdrop />
      <AdminGate>
        <div className="flex min-h-screen">
          <AdminSidebar open={open} onClose={() => setOpen(false)} />
          <div className="flex min-w-0 flex-1 flex-col">
            <AdminTopbar onMenu={() => setOpen(true)} />
            <main id="main" className="flex-1 pb-12">
              {children}
            </main>
          </div>
        </div>
      </AdminGate>
    </div>
  );
}
