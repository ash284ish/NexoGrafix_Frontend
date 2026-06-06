"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, type Variants } from "framer-motion";
import {
  FiBookOpen,
  FiPlayCircle,
  FiLayers,
  FiUsers,
  FiClipboard,
  FiTarget,
  FiVideo,
  FiShield,
  FiBarChart2,
  FiCheckCircle,
  FiFileText,
  FiZap,
  FiGlobe,
} from "react-icons/fi";
import Link from "next/link";

import ProofStatsSection, { type StatItem } from "@/components/sections/ProofStatsSection";
import ContactCTASection from "@/components/sections/ContactCTASection";
import ServicesCarouselSection from "@/components/sections/ServicesCarouselSection";
import ServiceHeroSection from "@/components/sections/ServiceHeroSection";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  bookopen: FiBookOpen,
  playcircle: FiPlayCircle,
  layers: FiLayers,
  users: FiUsers,
  clipboard: FiClipboard,
  target: FiTarget,
  video: FiVideo,
  shield: FiShield,
  barchart2: FiBarChart2,
  checkcircle: FiCheckCircle,
  filetext: FiFileText,
  zap: FiZap,
  globe: FiGlobe,

  projects: FiLayers,
  qa: FiCheckCircle,
  partners: FiUsers,
};

type StatItemJson = Omit<StatItem, "icon"> & { iconKey: string };

type ServiceItemJson = {
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
    stats: StatItemJson[];
  };
  services_carousel: {
    eyebrow: string;
    heading: string;
    subheading: string;
    auto_rotate_ms: number;
    pause_on_hover: boolean;
    show_tabs: boolean;
    slides: ServiceItemJson[];
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

export default function ContentELearningEdTechServicesPage() {
  const fallback: PageData = useMemo(() => ({
    hero: {
      eyebrow: "E-LEARNING & EDTECH",
      title: "eLearning Content & EdTech Solutions",
      subtitle: "Empower your digital learning ecosystem with high-fidelity content development and accessible EdTech services. We bridge the gap between educational goals and inclusive technology.",
      hero_image: {
        src: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=1600&q=80",
        alt: "eLearning and EdTech Services",
      },
      pills: ["K-12 Content", "Higher Ed", "Corporate L&D", "Accessible LMS", "Interactive Modules"],
      chips: [
        { iconKey: "bookopen", text: "Pedagogy-led design" },
        { iconKey: "zap", text: "Interactive learning paths" },
      ],
      badges: [
        { iconKey: "checkcircle", text: "WCAG 2.1 Compliant" },
        { iconKey: "shield", text: "Quality Assured" },
      ],
      primary_cta: { href: "/contact", label: "Request a Quote" },
      note_text: "Scalable EdTech content, built for the future",
    },
    trust_metrics: {
      eyebrow: "TRUST METRICS",
      heading: "Educational excellence, delivered at scale",
      subheading: "Trusted by top educational institutions and corporate trainers for delivering high-impact, inclusive digital learning content.",
      stats: [
        { id: "projects", iconKey: "projects", value: 1200, suffix: "+", label: "Learning modules created", hint: "From SCORM-compliant courses to custom LMS assets." },
        { id: "qa", iconKey: "qa", value: 99.8, suffix: "%", label: "Accuracy rate", hint: "Rigorous academic and technical validation.", highlight: true },
        { id: "partners", iconKey: "partners", value: 85, suffix: "+", label: "Educational partners", hint: "Long-term collaborations with schools, colleges, and EdTech firms." },
      ],
    },
    services_carousel: {
      eyebrow: "SERVICES",
      heading: "Curriculum development & EdTech services",
      subheading: "Comprehensive solutions for instructional design, content authoring, and accessible EdTech platform management.",
      auto_rotate_ms: 6500,
      pause_on_hover: true,
      show_tabs: true,
      slides: [
        {
          id: "instructional-design",
          title: "Instructional Design & Curriculum",
          desc: "Expertly crafted K-12 and Higher Ed curriculum development aligned with global standards like Common Core and IB.",
          iconKey: "target",
          image: { src: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1600&q=80", alt: "Instructional design services" },
          bullets: ["Learning objectives mapping", "Interactive storyboarding", "Assessment & Quiz design", "Blended learning strategies"],
        },
        {
          id: "elearning-authoring",
          title: "eLearning Content Authoring",
          desc: "High-engagement interactive modules using tools like Articulate Storyline, Adobe Captivate, and custom HTML5/React frameworks.",
          iconKey: "zap",
          image: { src: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80", alt: "eLearning content authoring" },
          bullets: ["SCORM / xAPI compliant", "Mobile-first responsive design", "Gamification elements", "Rich media integration"],
        },
        {
          id: "accessible-edtech",
          title: "Accessible EdTech Platforms",
          desc: "We ensure your LMS (Canvas, Moodle, Blackboard) and digital learning assets are fully accessible to students with disabilities.",
          iconKey: "shield",
          image: { src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80", alt: "Accessible EdTech services" },
          bullets: ["WCAG 2.1 Level AA audits", "Section 508 VPAT reporting", "ALT text for STEM/Complex graphics", "Keyboard-only navigation prep"],
        },
      ],
    },
    contact_cta: {
      eyebrow: "NEXT STEP",
      heading: "Ready to scale your digital learning reach?",
      subheading: "Share your learning objectives and platform requirements—we'll help you build an inclusive, high-impact EdTech ecosystem.",
      primary_cta: { href: "/contact", label: "Request a Quote" },
      bullets: ["Curriculum standards (K-12, HE, Corporate)", "Target platform (LMS type)", "Accessibility compliance needs", "Production volume & timeline"],
      note_text: "Response within 24 hours (business days)",
    },
  }), []);

  const [data, setData] = useState<PageData>(fallback);

  useEffect(() => {
    let alive = true;
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
    fetch(`${base.replace(/\/$/, "")}/api/v1/content/elearning`)
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
        // keep fallback
      });
    return () => { alive = false; };
  }, [fallback]);

  const proofStats: StatItem[] = useMemo(() => {
    return (data.trust_metrics.stats || []).map((s) => ({
      ...s,
      icon: React.createElement(ICON_MAP[s.iconKey] || FiCheckCircle),
    }));
  }, [data]);

  const services = useMemo(() => {
    return (data.services_carousel.slides || []).map((s) => ({
      ...s,
      Icon: ICON_MAP[s.iconKey] || FiLayers,
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
            <p className="text-xs font-black uppercase tracking-[0.1em] sm:text-sm">
              Regulatory Urgency
            </p>
          </div>
          <p className="text-xs font-extrabold sm:text-sm">
            Public institutions and EdTech providers must meet EU Accessibility Act & ADA standards by June 2025.
          </p>
          <Link href="/contact" className="hidden rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-wider text-orange-600 transition hover:bg-orange-50 sm:block">
            Get Compliant
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
          chips={(data.hero.chips || []).map((c) => ({
            icon: React.createElement(ICON_MAP[c.iconKey] || FiShield, {
              className: "text-[var(--color-brand-dark)]",
            }),
            text: c.text,
          }))}
          badges={(data.hero.badges || []).map((b) => (
            <>
              {React.createElement(ICON_MAP[b.iconKey] || FiCheckCircle)} {b.text}
            </>
          ))}
          primaryCta={data.hero.primary_cta}
          noteText={data.hero.note_text}
          timelineItems={[
            { label: "Course Launch", time: "Rapid Prototyping" },
            { label: "Content Sync", time: "SCORM / xAPI" },
            { label: "Compliance", time: "WCAG Certified" },
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
                  Academic Compliance
                </div>
                <h3 className="mt-3 text-2xl font-extrabold text-slate-900 md:text-3xl">Accessibility Guarantee</h3>
                <p className="mt-3 text-base font-semibold leading-relaxed text-slate-600 md:text-lg">
                  Every piece of learning content is guaranteed to meet <span className="text-slate-900 font-extrabold">WCAG 2.1 Level AA</span> standards. If an audit identifies any non-compliant EdTech assets, we will remediate them at <span className="text-orange-600 font-extrabold">zero cost</span>.
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
