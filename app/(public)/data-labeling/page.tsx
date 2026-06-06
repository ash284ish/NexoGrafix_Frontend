"use client";

import Link from "next/link";
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
import ContactCTASection from "@/components/sections/ContactCTASection";
import ServicesCarouselSection from "@/components/sections/ServicesCarouselSection";
import ServiceHeroSection from "@/components/sections/ServiceHeroSection";

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
        stats: Array<{
            id: string;
            icon: string;
            value: number;
            suffix?: string;
            label: string;
            hint: string;
            highlight?: boolean;
        }>;
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

function mapTrustStats(raw: Array<{
    id: string;
    icon: string;
    value: number;
    suffix?: string;
    label: string;
    hint: string;
    highlight?: boolean;
}>): StatItem[] {
    return raw.map((s) => {
        const key = (s.icon || "").toLowerCase().trim();

        let icon: React.ReactNode;
        const def = (defaultIcons as Record<string, React.ReactNode>)[key];
        if (def) icon = def;
        else if (ICON_MAP[key]) icon = React.createElement(ICON_MAP[key], { className: "text-(--color-brand-dark)" });
        else icon = <FiCheckCircle />;

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

export default function DataLabelingAnnotationPage() {
    const fallback: PageData = useMemo(() => ({
        hero: {
            eyebrow: "DATA LABELING & ANNOTATION",
            title: "Precision-Engineered Training Data",
            subtitle: "High-quality, human-in-the-loop data labeling services for machine learning and AI. We provide the ground truth data your models need to excel.",
            hero_image: {
                src: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=1600&q=80",
                alt: "Data labeling and annotation services",
            },
            pills: ["Image Annotation", "Video Labeling", "LiDAR / 3D", "NLP / Text", "Audio Analysis"],
            chips: [
                { iconKey: "database", text: "Enterprise-grade datasets" },
                { iconKey: "shield", text: "Secure data handling" },
            ],
            badges: [
                { iconKey: "checkcircle", text: "99.9% QA Accuracy" },
                { iconKey: "zap", text: "Rapid Turnaround" },
            ],
            primary_cta: { href: "/contact", label: "Request a Sample" },
            note_text: "Clean datasets, built for AI scale",
        },
        trust_metrics: {
            eyebrow: "TRUST METRICS",
            heading: "Quality you can measure",
            subheading: "Rigorous quality control workflows ensure your training data is accurate, consistent, and ready for deployment.",
            stats: [
                { id: "projects", icon: "database", value: 10, suffix: "M+", label: "Annotations delivered", hint: "Across computer vision and NLP domains." },
                { id: "qa", icon: "checkcircle", value: 99.9, suffix: "%", label: "QA Pass rate", hint: "Multi-stage verification for every batch.", highlight: true },
                { id: "partners", icon: "shield", value: 50, suffix: "+", label: "AI companies supported", hint: "Trusted by autonomous driving and medical AI firms." },
            ],
        },
        services_carousel: {
            eyebrow: "CAPABILITIES",
            heading: "Specialized annotation services",
            subheading: "From complex pixel-level segmentation to multi-turn conversational NLP, we handle all annotation modalities.",
            auto_rotate_ms: 6500,
            pause_on_hover: true,
            show_tabs: true,
            slides: [
                {
                    id: "cv",
                    title: "Computer Vision Annotation",
                    desc: "Bounding boxes, polygons, and semantic segmentation for autonomous systems, medical imaging, and retail analytics.",
                    iconKey: "image",
                    image: { src: "https://images.unsplash.com/photo-1527430297724-4686a4179bb5?auto=format&fit=crop&w=1600&q=80", alt: "Computer vision annotation" },
                    bullets: ["Semantic segmentation", "Object tracking in video", "Keypoint annotation", "3D Cuboids / LiDAR"],
                },
                {
                    id: "nlp",
                    title: "NLP & Text Labeling",
                    desc: "Named Entity Recognition (NER), sentiment analysis, and intent classification for LLMs and chatbots.",
                    iconKey: "type",
                    image: { src: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1600&q=80", alt: "NLP text labeling" },
                    bullets: ["Entity extraction", "Text categorization", "Multi-lingual support", "RLHF for LLMs"],
                },
                {
                    id: "audio",
                    title: "Audio & Speech Processing",
                    desc: "Phonetic transcription and speaker diarization for speech recognition and acoustic analysis.",
                    iconKey: "mic",
                    image: { src: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1600&q=80", alt: "Audio transcription and labeling" },
                    bullets: ["Speech-to-text", "Emotion detection", "Noise classification", "Diarization"],
                },
            ],
        },
        contact_cta: {
            eyebrow: "NEXT STEP",
            heading: "Need high-quality training data?",
            subheading: "Share your annotation guidelines and volume—we'll provide a free pilot batch to demonstrate our quality standards.",
            primary_cta: { href: "/contact", label: "Request Quote" },
            bullets: ["Annotation modality (Image/Text/Audio)", "Volume & complexity", "Quality benchmarks (IoU, Accuracy)", "Security requirements (SOC 2, ISO)"],
            note_text: "Pilot batches available in 48 hours",
        },
    }), []);

    const [data, setData] = useState<PageData>(fallback);

    useEffect(() => {
        let alive = true;
        const base = getApiBase();
        const url = `${base}/api/v1/content/data-labelling`;

        fetch(url)
            .then((res) => {
                if (!res.ok) throw new Error(`Failed to load content (${res.status})`);
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

    const services = useMemo(() => {
        return data.services_carousel.slides.map((s) => ({
            ...s,
            Icon: ICON_MAP[s.iconKey] || FiImage,
        }));
    }, [data]);

    const trustStats = useMemo(() => {
        return mapTrustStats(data.trust_metrics.stats);
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
                        AI regulatory frameworks are tightening. Ensure your training data is ethically sourced and bias-audited.
                    </p>
                    <Link href="/contact" className="hidden rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-wider text-orange-600 transition hover:bg-orange-50 sm:block">
                        Audit Data
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
                    chips={data.hero.chips.map((c) => ({
                        icon: React.createElement(ICON_MAP[c.iconKey] || FiShield, {
                            className: "text-[var(--color-brand-dark)]",
                        }),
                        text: c.text,
                    }))}
                    pills={data.hero.pills}
                    badges={data.hero.badges.map((b, i) => (
                        <React.Fragment key={i}>
                            {React.createElement(ICON_MAP[b.iconKey] || FiCheckCircle)} {b.text}
                        </React.Fragment>
                    ))}
                    primaryCta={data.hero.primary_cta}
                    noteText={data.hero.note_text}
                    timelineItems={[
                        { label: "Pilot Batch", time: "48-72 Hours" },
                        { label: "Full Delivery", time: "Project Scaled" },
                        { label: "Quality Audit", time: "Zero Error Goal" },
                    ]}
                />

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
                                    Zero Error Commitment
                                </div>
                                <h3 className="mt-3 text-2xl font-extrabold text-slate-900 md:text-3xl">Quality & Bias Guarantee</h3>
                                <p className="mt-3 text-base font-semibold leading-relaxed text-slate-600 md:text-lg">
                                    We guarantee a dataset accuracy rate of at least <span className="text-slate-900 font-extrabold">99.9%</span>. If a random sample audit fails to meet your quality threshold, we will re-annotate the entire batch at <span className="text-orange-600 font-extrabold">zero cost</span>.
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
