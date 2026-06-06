"use client";

import dynamic from "next/dynamic";
import WhatsAppFloatingButton from "@/components/WhatsAppFloatingButton";

const SiteHeader = dynamic(() => import("@/components/SiteHeader"), { ssr: false });
const SiteFooter = dynamic(() => import("@/components/SiteFooter"), { ssr: false });
const ComplianceStrip = dynamic(() => import("@/components/ComplianceStrip"), { ssr: false });

type PublicLayoutProps = {
  children: React.ReactNode;
};

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <SiteHeader />
      <main style={{ flex: 1 }}>
        {children}
      </main>
      <WhatsAppFloatingButton />
      <ComplianceStrip />
      <SiteFooter />
    </div>
  );
}
