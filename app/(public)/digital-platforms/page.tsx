"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { useSearchParams } from "next/navigation";
import {
  FiCode,
  FiLayers,
  FiSmartphone,
  FiShoppingCart,
  FiSettings,
  FiBookOpen,
  FiZap,
  FiDatabase,
  FiLink2,
  FiShield,
  FiBarChart2,
  FiCheckCircle,
  FiFileText,
  FiPenTool,
  FiCpu,
  FiGlobe,
} from "react-icons/fi";

import ProofStatsSection, { defaultIcons, type StatItem } from "@/components/sections/ProofStatsSection";
import ContactCTASection from "@/components/sections/ContactCTASection";
import ServicesCarouselSection from "@/components/sections/ServicesCarouselSection";
import ServiceHeroSection from "@/components/sections/ServiceHeroSection";

import { itServices } from "@/data/itServices";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  code: FiCode,
  layers: FiLayers,
  smartphone: FiSmartphone,
  shoppingcart: FiShoppingCart,
  settings: FiSettings,
  bookopen: FiBookOpen,
  zap: FiZap,
  database: FiDatabase,
  link2: FiLink2,
  shield: FiShield,
  barchart2: FiBarChart2,
  checkcircle: FiCheckCircle,
  filetext: FiFileText,
  pentool: FiPenTool,
  cpu: FiCpu,
  globe: FiGlobe,
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

function getApiBaseUrl() {
  const base =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    "http://localhost:8000";
  return base.replace(/\/+$/, "");
}

/** Fallback Content */
const FALLBACK_DATA: PageData = {
  hero: {
    eyebrow: "IT & DIGITAL PLATFORMS",
    title: "Future-Ready Digital Infrastructure",
    subtitle: "We build scalable, high-performance digital solutions that power modern enterprises, from custom web applications to AI-enabled automation workflows.",
    hero_image: { 
      src: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=2000&q=80", 
      alt: "Digital transformation and IT services" 
    },
    pills: ["Next.js", "AI Integration", "SaaS", "Cloud Native", "UI/UX", "Mobile"],
    chips: [
      { iconKey: "cpu", text: "Advanced Tech Stack" },
      { iconKey: "shield", text: "Secure & Scalable" },
    ],
    badges: [
      { iconKey: "checkcircle", text: "Clean Code" },
      { iconKey: "zap", text: "Fast Delivery" },
    ],
    primary_cta: { href: "/contact", label: "Discuss Your Project" },
    note_text: "Clean architecture. Clear milestones. Scalable results.",
  },
  trust_metrics: {
    eyebrow: "TRUSTED BY ENTERPRISES",
    heading: "Engineered for Reliability",
    subheading: "Performance metrics that define our commitment to engineering excellence.",
    stats: [
      { id: "uptime", icon: defaultIcons.qa, value: 99.9, suffix: "%", label: "Uptime guarantee", hint: "Ensuring your digital platforms are always accessible." },
      { id: "projects", icon: defaultIcons.projects, value: 500, suffix: "+", label: "Apps deployed", hint: "From startups to enterprise-grade SaaS platforms." },
      { id: "security", icon: defaultIcons.partners, value: 100, suffix: "%", label: "Security compliance", hint: "Adhering to global security and data privacy standards." },
    ],
  },
  services_carousel: {
    eyebrow: "CAPABILITIES",
    heading: "Comprehensive Digital Services",
    subheading: "We handle the entire lifecycle of your digital product, from ideation and design to development and cloud deployment.",
    auto_rotate_ms: 8000,
    pause_on_hover: true,
    show_tabs: true,
    slides: itServices.map(s => ({
      id: s.id,
      title: s.title,
      desc: s.desc,
      iconKey: s.iconKey,
      image: s.image,
      bullets: s.bullets
    })),
  },
  contact_cta: {
    eyebrow: "GET IN TOUCH",
    heading: "Have a digital project in mind?",
    subheading: "Let's discuss how we can build a scalable, high-performance solution for your business. Our team of experts is ready to help.",
    primary_cta: { href: "/contact", label: "Book a Consultation" },
    bullets: [
      "Technical architecture review",
      "Stack recommendation",
      "Scalability planning",
      "Cost & timeline estimate",
    ],
    note_text: "We usually respond within 24 business hours.",
  },
};

export default function ITDevelopmentPage() {
  const [data, setData] = useState<PageData | null>(null);
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const baseUrl = getApiBaseUrl();
    const url = `${baseUrl}/api/v1/content/it-developement`;

    fetch(url, { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
        return res.json();
      })
      .then((json) => setData(json as PageData))
      .catch((err) => {
        if (err?.name !== "AbortError") {
          console.error("IT Page API Error:", err);
          setData(FALLBACK_DATA);
        }
      });

    return () => controller.abort();
  }, []);

  // Fragment Handling: Sync carousel with URL hash
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (!hash || !data) return;

      const idx = data.services_carousel.slides.findIndex((s) => s.id === hash);
      if (idx !== -1) {
        setStartIndex(idx);
      }
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, [data]);

  const services = useMemo(() => {
    const sData = data?.services_carousel?.slides ?? FALLBACK_DATA.services_carousel.slides;
    return sData.map((s) => ({
      ...s,
      Icon: ICON_MAP[s.iconKey] || FiCode,
    }));
  }, [data]);

  const pageData = data || FALLBACK_DATA;

  return (
    <motion.section variants={pageWrap} initial="hidden" animate="show" className="relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-64 -left-70 h-180 w-180 rounded-full bg-orange-300/14 blur-3xl" />
        <div className="absolute top-35 -right-80 h-190 w-190 rounded-full bg-orange-400/10 blur-3xl" />
        <div className="absolute -bottom-80 left-[20%] h-180 w-180 rounded-full bg-orange-200/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(0,0,0,0.03)_100%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-7 py-14 sm:px-8 sm:py-20">
        <ServiceHeroSection
          eyebrow={pageData.hero.eyebrow}
          title={pageData.hero.title}
          subtitle={pageData.hero.subtitle}
          heroImage={pageData.hero.hero_image}
          pills={pageData.hero.pills}
          chips={pageData.hero.chips.map((c) => ({
            icon: React.createElement(ICON_MAP[c.iconKey] || FiShield, {
              className: "text-(--color-brand-dark)",
            }),
            text: c.text,
          }))}
          badges={pageData.hero.badges.map((b, idx) =>
            React.createElement(
              React.Fragment,
              { key: `${b.iconKey}-${idx}` },
              React.createElement(ICON_MAP[b.iconKey] || FiCheckCircle),
              " ",
              b.text
            )
          )}
          primaryCta={pageData.hero.primary_cta}
          noteText={pageData.hero.note_text}
        />

        <div className="mx-auto mt-16 max-w-7xl">
          <ProofStatsSection
            eyebrow={pageData.trust_metrics.eyebrow}
            heading={pageData.trust_metrics.heading}
            subheading={pageData.trust_metrics.subheading}
            stats={pageData.trust_metrics.stats}
            columns={3}
            centered
          />
        </div>

        <div className="mx-auto mt-12 max-w-7xl">
          <ServicesCarouselSection
            slides={services}
            eyebrow={pageData.services_carousel.eyebrow}
            heading={pageData.services_carousel.heading}
            subheading={pageData.services_carousel.subheading}
            autoRotateMs={pageData.services_carousel.auto_rotate_ms}
            pauseOnHover={pageData.services_carousel.pause_on_hover}
            showTabs={pageData.services_carousel.show_tabs}
            startIndex={startIndex}
          />
        </div>

        <div className="mx-auto max-w-7xl">
          <ContactCTASection
            eyebrow={pageData.contact_cta.eyebrow}
            heading={pageData.contact_cta.heading}
            subheading={pageData.contact_cta.subheading}
            primaryCta={pageData.contact_cta.primary_cta}
            bullets={pageData.contact_cta.bullets}
            noteText={pageData.contact_cta.note_text}
          />
        </div>
      </div>
    </motion.section>
  );
}
