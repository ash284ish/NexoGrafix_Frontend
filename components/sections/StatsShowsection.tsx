"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, type Variants } from "framer-motion";
import {
  FiImage,
  FiVideo,
  FiBox,
  FiType,
  FiMic,
  FiDatabase,
  FiCheckCircle,
  FiShield,
  FiBarChart2,
  FiZap,
  FiFileText,
} from "react-icons/fi";

import ProofStatsSection, { defaultIcons, type StatItem } from "@/components/sections/ProofStatsSection";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  image: FiImage,
  video: FiVideo,
  box: FiBox,
  type: FiType,
  mic: FiMic,
  database: FiDatabase,
  checkcircle: FiCheckCircle,
  shield: FiShield,
  barchart2: FiBarChart2,
  zap: FiZap,
  filetext: FiFileText,
};

type ServiceItem = {
  id: string;
  title: string;
  desc: string;
  iconKey: string;
  image: { src: string; alt: string };
  bullets?: string[];
};

type PageData = {
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    hero_image: { src: string; alt: string };
    pills: string[];
    chips: { iconKey: string; text: string }[];
    badges: { iconKey: string; text: string }[];
    primary_cta: { href: string; label: string };
    note_text: string;
  };
  trust_metrics: {
    eyebrow: string;
    heading: string;
    subheading: string;
    stats: StatItem[];
  };
  services_carousel: {
    eyebrow: string;
    heading: string;
    subheading: string;
    auto_rotate_ms: number;
    pause_on_hover: boolean;
    show_tabs: boolean;
    slides: ServiceItem[];
  };
  contact_cta: {
    eyebrow: string;
    heading: string;
    subheading: string;
    primary_cta: { href: string; label: string };
    bullets: string[];
    note_text: string;
  };
};

const pageWrap: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

function getApiBase() {
  const envBase =
    (process.env.NEXT_PUBLIC_API_BASE_URL ||
      process.env.NEXT_PUBLIC_BASE_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "") as string;

  return (envBase || "http://localhost:8000").replace(/\/+$/, "");
}

export default function StatsShowSectionPage() {
  const [data, setData] = useState<PageData | null>(null);

  useEffect(() => {
    const base = getApiBase();
    const url = `${base}/api/v1/content/data-labelling`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load content (${res.status})`);
        return res.json();
      })
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) return null;
  function mapTrustStats(raw: any[]): StatItem[] {
    return raw.map((s) => {
      const key = (s.icon || "").toLowerCase().trim();

      const icon =
        (defaultIcons as any)[key] ||
        ICON_MAP[key] ||
        FiCheckCircle;

      return {
        id: s.id,
        icon,
        value: s.value,
        suffix: s.suffix,
        label: s.label,
        hint: s.hint,
        highlight: s.highlight,
      };
    });
  }
  const trustStats = useMemo(() => {
    if (!data) return [];
    return mapTrustStats(data.trust_metrics.stats);
  }, [data]);

  return (
    <motion.section variants={pageWrap} initial="hidden" animate="show" className="relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-64 left-[-280px] h-[720px] w-[720px] rounded-full bg-orange-300/14 blur-3xl" />
        <div className="absolute top-[140px] right-[-320px] h-[760px] w-[760px] rounded-full bg-orange-400/10 blur-3xl" />
        <div className="absolute bottom-[-320px] left-[20%] h-[720px] w-[720px] rounded-full bg-orange-200/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(0,0,0,0.03)_100%)]" />
      </div>

      <div className="relative mx-auto max-w-[80rem] px-7 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto mt-16 max-w-7xl">
          <ProofStatsSection
            eyebrow={data.trust_metrics.eyebrow}
            heading={data.trust_metrics.heading}
            subheading={data.trust_metrics.subheading}
            stats={trustStats}
            columns={3}
            centered
          />
        </div>
      </div>
    </motion.section>
  );
}
