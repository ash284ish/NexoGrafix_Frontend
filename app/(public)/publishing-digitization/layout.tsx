import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book Publishing & Digitization Services | Nexografix",
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