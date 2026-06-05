import "./globals.css";
import type { Metadata } from "next";
import ClientGuards from "@/components/ClientGuards";
import CustomCursor from "@/components/CustomCursor";

export const metadata: Metadata = {
    title: "Nexografix — PDF & Document Accessibility Compliance | WCAG · Section 508 · EPUB",
    description:
        "Nexografix remediates PDFs, EPUBs and documents to WCAG 2.1 AA, Section 508 and EU EAA standards — 72-hour turnaround, guaranteed compliance.",
    icons: {
        icon: "/images/nexoofrafixfavicon.png",
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="font-sans" suppressHydrationWarning>
                <ClientGuards />
                <CustomCursor />
                {children}
            </body>
        </html>
    );
}
