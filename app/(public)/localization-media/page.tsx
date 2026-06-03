"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, type Variants } from "framer-motion";
import {
  FiFilm,
  FiMessageSquare,
  FiFileText,
  FiPlayCircle,
  FiImage,
  FiBookOpen,
  FiGlobe,
  FiCheckCircle,
  FiShield,
  FiBarChart2,
  FiZap,
} from "react-icons/fi";

import ProofStatsSection, { defaultIcons, type StatItem } from "@/components/sections/ProofStatsSection";
import ContactCTASection from "@/components/sections/ContactCTASection";
import ServicesCarouselSection from "@/components/sections/ServicesCarouselSection";
import ServiceHeroSection from "@/components/sections/ServiceHeroSection";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  film: FiFilm,
  messagesquare: FiMessageSquare,
  filetext: FiFileText,
  playcircle: FiPlayCircle,
  image: FiImage,
  bookopen: FiBookOpen,
  globe: FiGlobe,
  checkcircle: FiCheckCircle,
  shield: FiShield,
  barchart2: FiBarChart2,
  zap: FiZap,
};

type ServiceItem = {
  id: string;
  title: string;
  desc: string;
  iconKey: string;
  image: { src: string; alt: string };
  bullets?: string[];
};

type ProofStatJson = Omit<StatItem, "icon"> & { iconKey: keyof typeof defaultIcons | string };

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
    stats: ProofStatJson[];
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

export default function LocalizationMediaAccessibilityPage() {
  const [data, setData] = useState<PageData | null>(null);

  useEffect(() => {
    const baseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000").replace(/\/$/, "");
    fetch(`${baseUrl}/api/v1/content/localization`)
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  const services = useMemo(() => {
    if (!data) return [];
    return data.services_carousel.slides.map((s) => ({
      ...s,
      Icon: ICON_MAP[s.iconKey] || FiShield,
    }));
  }, [data]);

  const proofStats: StatItem[] = useMemo(() => {
    if (!data) return [];
    return data.trust_metrics.stats.map((s) => ({
      ...s,
      icon: (defaultIcons as any)[s.iconKey] || defaultIcons.projects,
    }));
  }, [data]);

  if (!data) return null;

  return (
    <motion.section variants={pageWrap} initial="hidden" animate="show" className="relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-64 left-[-280px] h-[720px] w-[720px] rounded-full bg-orange-300/14 blur-3xl" />
        <div className="absolute top-[140px] right-[-320px] h-[760px] w-[760px] rounded-full bg-orange-400/10 blur-3xl" />
        <div className="absolute bottom-[-320px] left-[20%] h-[720px] w-[720px] rounded-full bg-orange-200/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(0,0,0,0.03)_100%)]" />
      </div>

      <div className="relative mx-auto max-w-[80rem] px-7 py-14 sm:px-8 sm:py-20">
        <ServiceHeroSection
          eyebrow={data.hero.eyebrow}
          title={data.hero.title}
          subtitle={data.hero.subtitle}
          heroImage={data.hero.hero_image}
          pills={data.hero.pills}
          chips={data.hero.chips.map((c) => ({
            icon: React.createElement(ICON_MAP[c.iconKey] || FiShield, {
              className: "text-[var(--color-brand-dark)]",
            }),
            text: c.text,
          }))}
          badges={data.hero.badges.map((b) => (
            <>
              {React.createElement(ICON_MAP[b.iconKey] || FiCheckCircle)} {b.text}
            </>
          ))}
          primaryCta={data.hero.primary_cta}
          noteText={data.hero.note_text}
        />

        <div className="mx-auto mt-16 max-w-7xl">
          <ProofStatsSection
            eyebrow={data.trust_metrics.eyebrow}
            heading={data.trust_metrics.heading}
            subheading={data.trust_metrics.subheading}
            stats={proofStats}
            columns={3}
            centered
          />
        </div>

        <div className="mx-auto mt-12 max-w-7xl">
          <ServicesCarouselSection
            slides={services}
            eyebrow={data.services_carousel.eyebrow}
            heading={data.services_carousel.heading}
            subheading={data.services_carousel.subheading}
            autoRotateMs={data.services_carousel.auto_rotate_ms}
            pauseOnHover={data.services_carousel.pause_on_hover}
            showTabs={data.services_carousel.show_tabs}
          />
        </div>

        <div className="mx-auto max-w-7xl">
          <ContactCTASection
            eyebrow={data.contact_cta.eyebrow}
            heading={data.contact_cta.heading}
            subheading={data.contact_cta.subheading}
            primaryCta={data.contact_cta.primary_cta}
            bullets={data.contact_cta.bullets}
            noteText={data.contact_cta.note_text}
          />
        </div>
      </div>
    </motion.section>
  );
}
