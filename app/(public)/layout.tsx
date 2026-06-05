// import SiteHeader from "@/components/SiteHeader";
// import SiteFooter from "@/components/SiteFooter";

// export default function PublicLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         display: "flex",
//         flexDirection: "column",
//       }}
//     >
//       <SiteHeader />
//       <main style={{ flex: 1 }}>{children}</main>
//       <SiteFooter />
//     </div>
//   );
// }
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import WhatsAppFloatingButton from "@/components/WhatsAppFloatingButton";

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
      <SiteFooter />
    </div>
  );
}
