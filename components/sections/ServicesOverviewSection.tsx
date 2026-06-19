"use client";

import React, { useEffect, useMemo, useState } from "react";
import ServiceShowcaseSection from "./ServiceShowcaseSection";
import {
  FiLayers,
  FiCpu,
  FiCheckCircle,
  FiActivity,
  FiBookOpen,
  FiFileText,
  FiHeadphones,
  FiZap,
  FiPenTool,
  FiBox,
} from "react-icons/fi";

type ServicesOverview = {
  heading: string;
  subheading: string;
  badgeRight: string;
  autoRotateMs: number;
  startIndex: number;
  pauseOnHover: boolean;
  slides: Array<{
    id: string;
    title: string;
    subtitle: string;
    image: { src: string; alt: string };
    miniStats: Array<{ label: string; value: string }>;
    cards: Array<{ icon: string; title: string; desc: string }>;
    cta: { label: string; href: string };
  }>;
};

type HomeContent = {
  servicesOverview: ServicesOverview;
};

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  FiLayers,
  FiCpu,
  FiCheckCircle,
  FiActivity,
  FiBookOpen,
  FiFileText,
  FiHeadphones,
  FiZap,
  FiPenTool,
  FiBox,
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=80";

export default function ServicesOverviewSection() {
  const [data, setData] = useState<HomeContent | null>(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL || ""}/api/v1/content/home`,
          { cache: "no-store" }
        );
        if (!res.ok) throw new Error("Failed to load home content");
        const json = (await res.json()) as HomeContent;
        if (alive) setData(json);
      } catch (e) {
        console.error(e);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const cfg = data?.servicesOverview;

  const slides = useMemo(() => {
    if (!cfg?.slides) return [];

    return cfg.slides.map((s) => {
      const src = (s.image?.src ?? "").trim() || FALLBACK_IMAGE;
      const alt = (s.image?.alt ?? "").trim() || s.title || "Service image";

      return {
        ...s,
        image: { src, alt },
        cards: (s.cards ?? []).map((c) => ({
          Icon: ICON_MAP[c.icon] ?? FiCheckCircle,
          title: c.title,
          desc: c.desc,
        })),
      };
    });
  }, [cfg]);

  return (
    <ServiceShowcaseSection
      heading={cfg?.heading ?? "Service Overview"}
      subheading={
        cfg?.subheading ??
        "Enterprise-grade solutions across content, accessibility, AI data, and digital platforms."
      }
      badgeRight={cfg?.badgeRight ?? "Visual Preview"}
      slides={slides}
      autoRotateMs={cfg?.autoRotateMs ?? 6000}
      startIndex={cfg?.startIndex ?? 0}
      pauseOnHover={cfg?.pauseOnHover ?? true}
    />
  );
}
