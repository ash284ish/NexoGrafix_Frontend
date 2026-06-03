import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF & Document Accessibility Compliance Services — WCAG 2.1, Section 508, PDF/UA | Nexografix",
  description:
    "Professional book publishing, digitization, EPUB, XML, HTML5, typesetting, and interactive eBook services.",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}