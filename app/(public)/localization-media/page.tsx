"use client";

import Link from "next/link";
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
  const fallback: PageData = useMemo(() => ({
    hero: {
      eyebrow: "LOCALIZATION & MEDIA",
      title: "Localization & Media Accessibility",
      subtitle: "Expand your global reach with accessible multimedia content. We provide high-quality localization, subtitling, and audio description services designed for inclusivity.",
      hero_image: {
        src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80",
        alt: "Localization & Media Services",
      },
      pills: ["Subtitling", "Audio Description", "SDH", "Dubbing", "Multilingual Transcripts"],
      chips: [
        { iconKey: "globe", text: "Global delivery standards" },
        { iconKey: "shield", text: "Quality-first localization" },
      ],
      badges: [
        { iconKey: "checkcircle", text: "WCAG-aligned media" },
        { iconKey: "zap", text: "Fast-turnaround delivery" },
      ],
      primary_cta: { href: "/contact", label: "Request a Quote" },
      note_text: "Inclusive media, built for global audiences",
    },
    trust_metrics: {
      eyebrow: "TRUST METRICS",
      heading: "Media accessibility you can rely on",
      subheading: "Accurate transcripts, perfectly synced subtitles, and professional audio descriptions for all your digital media needs.",
      stats: [
        { id: "projects", iconKey: "projects", value: 500, suffix: "+", label: "Media hours processed", hint: "Accurate subtitling and audio descriptions across various platforms." },
        { id: "qa", iconKey: "qa", value: 99, suffix: "%", label: "Accuracy rate", hint: "Rigorous quality control for every localized asset.", highlight: true },
        { id: "partners", iconKey: "partners", value: 120, suffix: "+", label: "Global brands supported", hint: "Trusted by publishers, EdTechs, and media houses worldwide." },
      ],
    },
    services_carousel: {
      eyebrow: "SERVICES",
      heading: "Media accessibility & localization services",
      subheading: "From closed captions to professional dubbing, we make your media content accessible to everyone, everywhere.",
      auto_rotate_ms: 6500,
      pause_on_hover: true,
      show_tabs: true,
      slides: [
        {
          id: "subtitling",
          title: "Closed Captioning & Subtitling",
          desc: "Professional subtitling and SDH (Subtitles for the Deaf and Hard of Hearing) for educational videos, corporate training, and broadcast media.",
          iconKey: "messagesquare",
          image: { src: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80", alt: "Subtitling services" },
          bullets: ["Sync-perfect subtitles", "SDH / Closed captions", "Multiple format support (SRT, VTT)", "WCAG 2.1 media compliance"],
        },
        {
          id: "audio-description",
          title: "Professional Audio Descriptions",
          desc: "Narrated descriptions of visual content for blind and low-vision audiences, ensuring your videos are truly inclusive.",
          iconKey: "playcircle",
          image: { src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80", alt: "Audio description services" },
          bullets: ["Clear, concise narration", "Seamless integration", "Broadcast-quality delivery", "Standards-compliant"],
        },
        {
          id: "transcription",
          title: "Multilingual Transcription",
          desc: "Accurate, human-verified transcripts for interviews, lectures, and digital media in over 50 languages.",
          iconKey: "filetext",
          image: { src: "https://images.unsplash.com/photo-1556155092-8707de31f9c4?auto=format&fit=crop&w=1600&q=80", alt: "Transcription services" },
          bullets: ["Human-verified accuracy", "Time-stamped transcripts", "Domain-specific expertise", "Multilingual support"],
        },
      ],
    },
    contact_cta: {
      eyebrow: "NEXT STEP",
      heading: "Ready to make your media global and accessible?",
      subheading: "Tell us about your project volume and deadlines. We'll provide a tailored localization and accessibility plan.",
      primary_cta: { href: "/contact", label: "Request a Quote" },
      bullets: ["Video/Audio file types", "Target languages", "Compliance needs (FCC, WCAG, etc.)", "Turnaround requirements"],
      note_text: "Response within 24 hours (business days)",
    },
  }), []);

  const [data, setData] = useState<PageData>(fallback);

  useEffect(() => {
    let alive = true;
    const baseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");
    fetch(`${baseUrl}/api/v1/content/localization`)
      .then((res) => {
        if (!res.ok) throw new Error("API fail");
        return res.json();
      })
      .then((json) => {
        if (alive) {
          setData((prev) => ({
            ...prev,
            ...json,
            hero: json.hero ? { ...prev.hero, ...json.hero } : prev.hero,
            trust_metrics: json.trust_metrics ? { ...prev.trust_metrics, ...json.trust_metrics } : prev.trust_metrics,
            services_carousel: json.services_carousel ? { ...prev.services_carousel, ...json.services_carousel } : prev.services_carousel,
            contact_cta: json.contact_cta ? { ...prev.contact_cta, ...json.contact_cta } : prev.contact_cta,
          }));
        }
      })
      .catch(() => {
        // Keep fallback on error
      });
    return () => { alive = false; };
  }, [fallback]);

  const services = useMemo(() => {
    return data.services_carousel.slides.map((s) => ({
      ...s,
      Icon: ICON_MAP[s.iconKey] || FiShield,
    }));
  }, [data]);

  const proofStats: StatItem[] = useMemo(() => {
    return data.trust_metrics.stats.map((s) => ({
      ...s,
      icon: (defaultIcons as any)[s.iconKey] || defaultIcons.projects,
    }));
  }, [data]);

  return (
    <motion.section variants={pageWrap} initial="hidden" animate="show" className="relative overflow-hidden bg-white">
      {/* Regulatory Urgency Banner */}
      <div className="relative bg-orange-600 px-4 py-3 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-2 text-center sm:flex-row sm:gap-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-100 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white"></span>
            </span>
            <p className="text-xs font-black uppercase tracking-widest sm:text-sm">
              Regulatory Urgency
            </p>
          </div>
          <p className="text-xs font-extrabold sm:text-sm">
            EU Accessibility Act deadline: June 2025. Is your media content compliant?
          </p>
          <Link href="/contact" className="hidden rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-wider text-orange-600 transition hover:bg-orange-50 sm:block">
            Audit Media
          </Link>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-64 -left-70 h-180 w-180 rounded-full bg-orange-300/14 blur-3xl" />
        <div className="absolute top-35 -right-80 h-190 w-190 rounded-full bg-orange-400/10 blur-3xl" />
        <div className="absolute -bottom-80 left-[20%] h-180 w-180 rounded-full bg-orange-200/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(0,0,0,0.03)_100%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-7 py-14 sm:px-8 sm:py-20">
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
          timelineItems={[
            { label: "Standard Delivery", time: "3-5 Business Days" },
            { label: "Urgent Media", time: "Available" },
            { label: "Compliance Check", time: "24h Response" },
          ]}
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

        {/* Compliance Guarantee Box */}
        <div className="mx-auto mt-16 max-w-7xl">
          <div className="group relative overflow-hidden rounded-2xl border-2 border-orange-500/20 bg-white p-8 shadow-[0_20px_50px_rgba(234,88,12,0.08)] transition-all hover:border-orange-500/40 hover:shadow-[0_20px_60px_rgba(234,88,12,0.12)]">
            <div className="absolute top-0 right-0 -mt-6 -mr-6 h-32 w-32 rounded-full bg-orange-500/5 blur-3xl transition-all group-hover:bg-orange-500/10" />
            <div className="absolute bottom-0 left-0 -mb-6 -ml-6 h-32 w-32 rounded-full bg-orange-500/5 blur-3xl transition-all group-hover:bg-orange-500/10" />
            
            <div className="relative flex flex-col items-center gap-8 md:flex-row md:text-left text-center">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 shadow-inner group-hover:scale-105 transition-transform">
                <FiShield className="h-10 w-10" />
              </div>
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-orange-700">
                  Media Quality Guarantee
                </div>
                <h3 className="mt-3 text-2xl font-extrabold text-slate-900 md:text-3xl">Accuracy Guarantee</h3>
                <p className="mt-3 text-base font-semibold leading-relaxed text-slate-600 md:text-lg">
                  If your media accessibility assets (subtitles, SDH, or audio descriptions) fail to meet specified accuracy standards, we will re-process them at <span className="text-orange-600 font-extrabold">zero cost</span>.
                </p>
              </div>
            </div>
          </div>
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
