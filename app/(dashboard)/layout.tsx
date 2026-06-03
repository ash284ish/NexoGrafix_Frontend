"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { toast } from "react-hot-toast";

type ToastPayload = { type: "error" | "success"; message: string };

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("toast");
    if (!raw) return;

    try {
      const data = JSON.parse(raw) as ToastPayload;
      if (data?.type === "error") toast.error(data.message);
      else toast.success(data.message);
    } catch {}

    sessionStorage.removeItem("toast");
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      router.replace("/");
      return;
    }

    setAllowed(true);
  }, [router]);

  if (!allowed) return null;

  return <DashboardShell>{children}</DashboardShell>;
}
