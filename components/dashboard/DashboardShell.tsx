"use client";

import React, { useEffect, useState } from "react";
import DashboardSidebar from "./DashboardSidebar";
import DashboardTopbar from "./DashboardTopbar";
import ToastTopRight from "@/components/ui/Toast";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";

type ToastTone = "success" | "error";
type ToastState = { open: boolean; tone: ToastTone; title: string; message?: string };

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastState>({
    open: false,
    tone: "success",
    title: "",
    message: "",
  });

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("dashboard_toast");
      if (!raw) return;
      sessionStorage.removeItem("dashboard_toast");
      const t = JSON.parse(raw) as { tone?: ToastTone; title?: string; message?: string };
      setToast({
        open: true,
        tone: t.tone === "error" ? "error" : "success",
        title: t.title || "",
        message: t.message || "",
      });
    } catch {
      sessionStorage.removeItem("dashboard_toast");
    }
  }, []);

  return (
    <div className="h-screen overflow-hidden bg-[#fbf7f2]">
      <ToastTopRight
  toast={
    toast.open
      ? {
          type: toast.tone === "success" ? "success" : "error",
          msg: toast.message ? `${toast.title}: ${toast.message}` : toast.title,
        }
      : null
  }
  onClose={() => setToast((p) => ({ ...p, open: false }))}
  duration={4000}
/>


      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-24 left-1/2 h-130 w-130 -translate-x-1/2 rounded-full bg-[#ff7a1a]/10 blur-3xl" />
        <div className="absolute -bottom-28 -left-28 h-130 w-130 rounded-full bg-[#ffb37a]/10 blur-3xl" />
      </div>

      <div className="relative flex h-full">
        <aside className="h-full shrink-0">
          <DashboardSidebar />
        </aside>

        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="sticky top-0 z-30">
            <DashboardTopbar />
          </div>

          <main className="h-[calc(100vh-64px)] overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
