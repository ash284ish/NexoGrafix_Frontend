"use client";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { motion, type Variants } from "framer-motion";
import {
    FiCheckCircle,
    FiArchive,
    FiEdit3,
    FiBookOpen,
    FiCode,
    FiGrid,
    FiTag,
    FiPlayCircle,
    FiZap,
    FiPrinter,
    FiFileText,
    FiArrowRight,
    FiCheckSquare,
    FiShield,
    FiLayers,
    FiClock,
    FiBarChart2,
    FiChevronLeft,
    FiChevronRight,
    FiMail,
} from "react-icons/fi";

import ProofStatsSection, { defaultIcons, type StatItem } from "@/components/sections/ProofStatsSection";
import ContactCTASection from "@/components/sections/ContactCTASection";
import ServicesCarouselSection from "@/components/sections/ServicesCarouselSection";
import ServiceHeroSection from "@/components/sections/ServiceHeroSection";

type ServiceItem = {
    id: string;
    title: string;
    desc: string;
    Icon: React.ComponentType<{ className?: string }>;
    image: { src: string; alt: string };
    bullets?: string[];
};

type ContentJSON = {
    meta?: { title?: string; route?: string };
    hero?: {
        eyebrow?: string;
        title?: string;
        subtitle?: string;
        hero_image?: { src: string; alt: string };
        chips?: Array<{ iconKey?: string; text: string }>;
        pills?: string[];
        badges?: Array<{ iconKey?: string; text: string }>;
        primary_cta?: { href: string; label: string };
        secondary_cta?: { href: string; label: string };
        note_text?: string;
    };
    trust_metrics?: {
        eyebrow?: string;
        heading?: string;
        subheading?: string;
        columns?: number;
        centered?: boolean;
        stats?: Array<{
            id: string;
            iconKey?: string;
            value: number;
            suffix?: string;
            label: string;
            hint?: string;
            highlight?: boolean;
        }>;
    };
    services_carousel?: {
        eyebrow?: string;
        heading?: string;
        subheading?: string;
        auto_rotate_ms?: number;
        pause_on_hover?: boolean;
        show_tabs?: boolean;
        slides?: Array<{
            id: string;
            title: string;
            desc: string;
            iconKey?: string;
            image: { src: string; alt: string };
            bullets?: string[];
        }>;
    };
    contact_cta?: {
        eyebrow?: string;
        heading?: string;
        subheading?: string;
        primary_cta?: { href: string; label: string };
        secondary_cta?: { href: string; label: string };
        bullets?: string[];
        note_text?: string;
    };
};

function cx(...classes: Array<string | false | undefined | null>) {
    return classes.filter(Boolean).join(" ");
}

const pageWrap: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    // service icons
    archive: FiArchive,
    edit3: FiEdit3,
    bookopen: FiBookOpen,
    code: FiCode,
    grid: FiGrid,
    tag: FiTag,
    playcircle: FiPlayCircle,
    zap: FiZap,
    printer: FiPrinter,
    filetext: FiFileText,
    checksquare: FiCheckSquare,
    shield: FiShield,
    layers: FiLayers,
    barchart2: FiBarChart2,
    // handy extras (if ever used)
    arrowright: FiArrowRight,
    clock: FiClock,
    chevronleft: FiChevronLeft,
    chevronright: FiChevronRight,
    mail: FiMail,
    checkcircle: FiCheckCircle,
};

function getApiBase() {
    // aap apne env ke hisaab se yahan value rakh rahe ho
    const base =
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        process.env.NEXT_PUBLIC_API_HOST ||
        process.env.NEXT_PUBLIC_HOST ||
        "";
    return (base || "").replace(/\/+$/, "");
}

function resolveUrl(path: string) {
    const base = getApiBase();
    if (!base) return path; // relative (same origin)
    return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

function toStatItems(raw?: ContentJSON["trust_metrics"]): StatItem[] {
    const stats = raw?.stats ?? [];
    return stats.map((s) => {
        const iconKey = (s.iconKey || "").toLowerCase().trim();
        const icon =
            // prefer ProofStatsSection default icons keys (projects/qa/partners)
            (defaultIcons as Record<string, React.ReactNode>)[iconKey] ||
            // fallback to known icons
            (iconMap[iconKey] as React.ComponentType<{ className?: string }>) ||
            // final fallback
            defaultIcons.projects;

        return {
            id: s.id,
            icon: typeof icon === "function" ? React.createElement(icon) : icon,
            value: s.value,
            suffix: s.suffix,
            label: s.label,
            hint: s.hint ?? "",
            highlight: s.highlight,
        };
    });
}

function toServiceItems(raw?: ContentJSON["services_carousel"]): ServiceItem[] {
    const slides = raw?.slides ?? [];
    return slides.map((s) => {
        const iconKey = (s.iconKey || "").toLowerCase().trim();
        const Icon = iconMap[iconKey] || FiFileText;

        return {
            id: s.id,
            title: s.title,
            desc: s.desc,
            Icon,
            image: { src: s.image?.src, alt: s.image?.alt },
            bullets: s.bullets,
        };
    });
}

export default function AccessibilityServicesPage() {
    // ✅ Default content (fallback) — UI bilkul same rahegi
    const fallback: ContentJSON = useMemo(
        () => ({
            meta: { title: "Accessibility Services • Nexografix", route: "/accessibilty-feature" },
            hero: {
                eyebrow: "ACCESSIBILITY",
                title: "Accessibility Services",
                subtitle:
                    "Make your PDFs, eBooks, websites, and learning content accessible and compliant—built for real users, assistive technology support, and global standards.",
                hero_image: {
                    src: "https://images.unsplash.com/photo-1520975869018-1c0afc4db1b0?auto=format&fit=crop&w=2000&q=80",
                    alt: "Accessibility Services",
                },
                pills: ["WCAG 2.1/2.2", "PDF/UA", "EPUB 3", "VPAT/ACR", "Screen Readers", "Education & LMS"],
                // chips/badges yahan optional — agar JSON se aaye to replace ho jayenge
                chips: [
                    { iconKey: "shield", text: "Standards-led compliance delivery" },
                    { iconKey: "barchart2", text: "Clear reporting & validation" },
                ],
                badges: [
                    { iconKey: "checkcircle", text: "WCAG-aligned outputs" },
                    { iconKey: "filetext", text: "PDF/UA + EPUB support" },
                    { iconKey: "zap", text: "Assistive-tech tested" },
                ],
                primary_cta: { href: "/contact", label: "Request a Quote" },
                secondary_cta: { href: "/contact?free_check=1", label: "Get a free compliance check on one of your documents — no obligation" },
                note_text: "Inclusive content, built for real users",
            },
            trust_metrics: {
                eyebrow: "TRUST METRICS",
                heading: "Accessibility outcomes you can rely on",
                subheading:
                    "Consistent remediation, rigorous validation, and real assistive-technology checks—so your content is compliant and usable.",
                columns: 3,
                centered: true,
                stats: [
                    {
                        id: "projects",
                        iconKey: "projects",
                        value: 900,
                        suffix: "+",
                        label: "Documents remediated",
                        hint: "PDFs, EPUBs, reports, and learning material—remediated for accessibility and real-world usability.",
                    },
                    {
                        id: "qa",
                        iconKey: "qa",
                        value: 98,
                        suffix: "%",
                        label: "Compliance success rate",
                        hint: "Rigorous validation, structured remediation, and assistive-tech checks before delivery.",
                        highlight: true,
                    },
                    {
                        id: "partners",
                        iconKey: "partners",
                        value: 180,
                        suffix: "+",
                        label: "Teams supported",
                        hint: "Publishers, EdTechs, institutions, and public-sector teams with recurring accessibility needs.",
                    },
                ],
            },
            services_carousel: {
                eyebrow: "SERVICES",
                heading: "Accessibility services & capabilities",
                subheading:
                    "Explore our accessibility services through a guided carousel—each service highlights what we deliver, how we validate, and which standards we support.",
                auto_rotate_ms: 6500,
                pause_on_hover: true,
                show_tabs: true,
                slides: [
                    {
                        id: "pdf-accessibility",
                        title: "PDF Accessibility & Remediation",
                        desc: "Make PDFs fully compliant for screen readers and assistive technologies with clean tagging, proper reading order, and accessible structure.",
                        iconKey: "filetext",
                        image: {
                            src: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1600&q=80",
                            alt: "PDF accessibility remediation",
                        },
                        bullets: ["Tagged PDF remediation", "Reading order + headings", "Alt text + table tagging", "WCAG + PDF/UA aligned"],
                    },
                    {
                        id: "ebook-accessibility",
                        title: "eBook Accessibility (EPUB & Digital)",
                        desc: "Accessible EPUB 3 builds for global distribution with semantic structure, navigation landmarks, and read-aloud support where needed.",
                        iconKey: "bookopen",
                        image: {
                            src: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1600&q=80",
                            alt: "Accessible EPUB development",
                        },
                        bullets: ["Accessible EPUB 3 conversion", "Landmarks + TOC navigation", "Semantic HTML + ARIA roles", "EPUB Accessibility 1.1 aligned"],
                    },
                    {
                        id: "education-accessibility",
                        title: "Educational Content Accessibility",
                        desc: "Accessibility for textbooks, assessments, and learning materials—built for classroom, LMS, and high-volume education workflows.",
                        iconKey: "layers",
                        image: {
                            src: "https://images.unsplash.com/photo-1523240795612-9a054b0db1b0?auto=format&fit=crop&w=1600&q=80",
                            alt: "Accessible educational content",
                        },
                        bullets: ["Accessible textbooks + workbooks", "Question banks + assessments", "MathML + accessible equations", "LMS-ready packaging"],
                    },
                    {
                        id: "web-accessibility",
                        title: "Website & HTML Accessibility",
                        desc: "Improve accessibility across publishing platforms and content websites with audits, remediation, and user-first fixes that meet WCAG requirements.",
                        iconKey: "code",
                        image: {
                            src: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&q=80",
                            alt: "Website accessibility services",
                        },
                        bullets: ["WCAG audits (manual + automated)", "ARIA labels + landmarks", "Keyboard navigation fixes", "Contrast + form accessibility"],
                    },
                    {
                        id: "non-pdf-accessibility",
                        title: "Document Accessibility (Non-PDF)",
                        desc: "Accessible formats beyond PDFs—Word, PowerPoint, Excel, InDesign outputs, and structured reports designed for inclusive consumption.",
                        iconKey: "grid",
                        image: {
                            src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80",
                            alt: "Accessible office documents",
                        },
                        bullets: ["Accessible DOCX", "Accessible PPTX", "Accessible Excel files", "InDesign to accessible output"],
                    },
                    {
                        id: "multimedia-accessibility",
                        title: "Audio, Video & Multimedia Accessibility",
                        desc: "Make rich media accessible with captions, subtitles, transcripts, and audio descriptions—ideal for education and content distribution.",
                        iconKey: "playcircle",
                        image: {
                            src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80",
                            alt: "Multimedia accessibility",
                        },
                        bullets: ["Closed captions + subtitles", "Transcripts (multilingual)", "Audio descriptions", "Accessible player guidance"],
                    },
                    {
                        id: "auditing-reporting",
                        title: "Accessibility Auditing & Compliance Reporting",
                        desc: "Formal testing and documentation to support legal, institutional, and procurement requirements—clear evidence, clear outcomes.",
                        iconKey: "shield",
                        image: {
                            src: "https://images.unsplash.com/photo-1556155092-8707de31f9c4?auto=format&fit=crop&w=1600&q=80",
                            alt: "Accessibility compliance reporting",
                        },
                        bullets: ["WCAG audit reports", "ACR / VPAT documentation", "PDF/UA validation", "Platform + content testing"],
                    },
                    {
                        id: "assistive-tech-testing",
                        title: "Assistive Technology Testing",
                        desc: "Real-world testing using major screen readers and devices to ensure the experience works for actual users—not just checklists.",
                        iconKey: "checksquare",
                        image: {
                            src: "https://images.unsplash.com/photo-1587614203976-365c74645e83?auto=format&fit=crop&w=1600&q=80",
                            alt: "Assistive technology testing",
                        },
                        bullets: ["NVDA / JAWS / VoiceOver", "TalkBack checks", "Keyboard-only navigation", "Usability-focused verification"],
                    },
                    {
                        id: "gov-institutional",
                        title: "Government & Institutional Accessibility",
                        desc: "Specialized accessibility remediation for regulated environments—public sector documents, university compliance, tenders, and legal submissions.",
                        iconKey: "archive",
                        image: {
                            src: "https://images.unsplash.com/photo-1454165205744-3b78555e5572?auto=format&fit=crop&w=1600&q=80",
                            alt: "Government accessibility services",
                        },
                        bullets: ["Public sector remediation", "University compliance support", "Tender + legal submissions", "Standards-aligned delivery"],
                    },
                    {
                        id: "consulting-training",
                        title: "Accessibility Consulting & Training",
                        desc: "Enable your team to create accessible content from day one with practical guidelines, training, and workflow setup tailored to your production process.",
                        iconKey: "zap",
                        image: {
                            src: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=80",
                            alt: "Accessibility consulting and training",
                        },
                        bullets: ["Author + designer guidelines", "Training for content teams", "Workflow setup assistance", "Checklists + templates"],
                    },
                ],
            },
            contact_cta: {
                eyebrow: "NEXT STEP",
                heading: "Want to make your content accessible and compliant?",
                subheading:
                    "Share your file types, platforms, and deadlines—we’ll recommend the best remediation plan with clear validation steps and delivery timelines.",
                primary_cta: { href: "/contact", label: "Request a Quote" },
                secondary_cta: { href: "/contact?free_check=1", label: "Get a free compliance check on one of your documents — no obligation" },
                bullets: [
                    "Content type (PDF / EPUB / Web / Office files)",
                    "Target standards (WCAG, PDF/UA, EPUB Accessibility, Section 508)",
                    "Estimated volume and schedule",
                    "Platform requirements (LMS, Apple Books, Kindle, web portals)",
                    "Sample files (optional)",
                ],
                note_text: "Usually respond within 24 hours (business days)",
            },
        }),
        []
    );

    const [data, setData] = useState<ContentJSON>(fallback);

    // ✅ Fetch dynamic JSON from: /api/v1/content/accessibilty-feature
    useEffect(() => {
        let alive = true;

        (async () => {
            try {
                const url = resolveUrl("/api/v1/content/accessibilty-feature");
                const res = await fetch(url, { cache: "no-store" });
                if (!res.ok) return;

                const json = (await res.json()) as ContentJSON;
                if (!alive) return;

                setData((prev) => ({
                    ...prev,
                    ...json,

                    hero: {
                        ...prev.hero,
                        ...json.hero,
                        hero_image: json.hero?.hero_image?.src
                            ? json.hero.hero_image
                            : prev.hero?.hero_image,
                    },

                    trust_metrics: { ...prev.trust_metrics, ...json.trust_metrics },
                    services_carousel: { ...prev.services_carousel, ...json.services_carousel },
                    contact_cta: { ...prev.contact_cta, ...json.contact_cta },
                    meta: { ...prev.meta, ...json.meta },
                }));

            } catch {
                // silently keep fallback
            }
        })();

        return () => {
            alive = false;
        };
    }, [fallback]);

    // derived (same UI props, bas data dynamic)
    const hero = data.hero ?? {};
    const trust = data.trust_metrics ?? {};
    const carousel = data.services_carousel ?? {};
    const cta = data.contact_cta ?? {};

    const pills = hero.pills ?? [];
    const proofStats: StatItem[] = useMemo(() => toStatItems(data.trust_metrics), [data.trust_metrics]);
    const safeColumns = useMemo(() => {
        const cols = data.trust_metrics?.columns;
        if (cols === 1 || cols === 2 || cols === 3 || cols === 4) return cols;
        return 3;
    }, [data.trust_metrics?.columns]);

    const services: ServiceItem[] = useMemo(() => toServiceItems(data.services_carousel), [data.services_carousel]);

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
                    eyebrow={hero.eyebrow || "ACCESSIBILITY"}
                    title={hero.title || "Accessibility Services"}
                    subtitle={
                        hero.subtitle ||
                        "Make your PDFs, eBooks, websites, and learning content accessible and compliant—built for real users, assistive technology support, and global standards."
                    }
                    heroImage={
                        hero.hero_image?.src
                            ? hero.hero_image
                            : fallback.hero!.hero_image!
                    }

                    chips={[
                        {
                            icon: <FiShield className="text-[var(--color-brand-dark)]" />,
                            text: hero.chips?.[0]?.text || "Standards-led compliance delivery",
                        },
                        {
                            icon: <FiBarChart2 className="text-[var(--color-brand-dark)]" />,
                            text: hero.chips?.[1]?.text || "Clear reporting & validation",
                        },
                    ]}
                    pills={pills}
                    badges={[
                        <>
                            <FiCheckCircle /> {hero.badges?.[0]?.text || "WCAG-aligned outputs"}
                        </>,
                        <>
                            <FiFileText /> {hero.badges?.[1]?.text || "PDF/UA + EPUB support"}
                        </>,
                        <>
                            <FiZap /> {hero.badges?.[2]?.text || "Assistive-tech tested"}
                        </>,
                    ]}
                    primaryCta={{
                        href: hero.primary_cta?.href || "/contact",
                        label: hero.primary_cta?.label || "Request a Quote",
                    }}
                    secondaryCta={{
                        href: hero.secondary_cta?.href || "/contact?free_check=1",
                        label:
                            hero.secondary_cta?.label ||
                            "Get a free compliance check on one of your documents — no obligation",
                    }}
                    noteText={hero.note_text || "Inclusive content, built for real users"}
                />

                <div className="mx-auto mt-8 max-w-7xl">
                    <div className="rounded-2xl border border-orange-200/70 bg-gradient-to-r from-orange-50 to-amber-50 p-5 shadow-sm sm:p-6">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-800/80">Pricing at a glance</p>
                                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-800 sm:text-base">
                                    <span className="rounded-full border border-orange-300 bg-white px-3 py-1">Remediation from $299/month</span>
                                    <span className="rounded-full border border-orange-300 bg-white px-3 py-1">VPAT from $2,500</span>
                                    <span className="rounded-full border border-orange-300 bg-white px-3 py-1">Enterprise pricing available</span>
                                </div>
                            </div>

                            <Link
                                href={hero.primary_cta?.href || "/contact"}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 lg:w-auto"
                            >
                                {hero.primary_cta?.label || "Request a Quote"}
                                <FiArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mx-auto mt-16 max-w-7xl">
                    <ProofStatsSection
                        eyebrow={trust.eyebrow || "TRUST METRICS"}
                        heading={trust.heading || "Accessibility outcomes you can rely on"}
                        subheading={
                            trust.subheading ||
                            "Consistent remediation, rigorous validation, and real assistive-technology checks—so your content is compliant and usable."
                        }
                        stats={proofStats}
                        columns={safeColumns}
                        centered={trust.centered ?? true}
                    />
                </div>

                <div className="mx-auto mt-12 max-w-7xl">
                    <ServicesCarouselSection
                        slides={services} // ✅ yahan 10 services JSON se aayengi, cursor/tabs/slider same component handle karega
                        eyebrow={carousel.eyebrow || "SERVICES"}
                        heading={carousel.heading || "Accessibility services & capabilities"}
                        subheading={
                            carousel.subheading ||
                            "Explore our accessibility services through a guided carousel—each service highlights what we deliver, how we validate, and which standards we support."
                        }
                        autoRotateMs={carousel.auto_rotate_ms ?? 6500}
                        pauseOnHover={carousel.pause_on_hover ?? true}
                        showTabs={carousel.show_tabs ?? true}
                    />
                </div>

                <div className="mx-auto max-w-7xl">
                    <ContactCTASection
                        eyebrow={cta.eyebrow || "NEXT STEP"}
                        heading={cta.heading || "Want to make your content accessible and compliant?"}
                        subheading={
                            cta.subheading ||
                            "Share your file types, platforms, and deadlines—we’ll recommend the best remediation plan with clear validation steps and delivery timelines."
                        }
                        primaryCta={{
                            href: cta.primary_cta?.href || "/contact",
                            label: cta.primary_cta?.label || "Request a Quote",
                        }}
                        secondaryCta={{
                            href: cta.secondary_cta?.href || "/contact?free_check=1",
                            label:
                                cta.secondary_cta?.label ||
                                "Get a free compliance check on one of your documents — no obligation",
                        }}
                        bullets={
                            cta.bullets || [
                                "Content type (PDF / EPUB / Web / Office files)",
                                "Target standards (WCAG, PDF/UA, EPUB Accessibility, Section 508)",
                                "Estimated volume and schedule",
                                "Platform requirements (LMS, Apple Books, Kindle, web portals)",
                                "Sample files (optional)",
                            ]
                        }
                        noteText={cta.note_text || "Usually respond within 24 hours (business days)"}
                    />
                </div>
            </div>
        </motion.section>
    );
}
