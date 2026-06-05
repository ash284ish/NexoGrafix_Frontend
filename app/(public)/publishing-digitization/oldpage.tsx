"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
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

function cx(...classes: Array<string | false | undefined | null>) {
    return classes.filter(Boolean).join(" ");
}

const R_CARD = "rounded-md";
const R_CARD_INNER = "rounded-md";

const pageWrap: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

const heroStagger: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.06 } },
};

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const popIn: Variants = {
    hidden: { opacity: 0, y: 10, scale: 0.99 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

function SmartImage({
    src,
    alt,
    priority,
    aspect = "aspect-[16/9]",
}: {
    src: string;
    alt: string;
    priority?: boolean;
    aspect?: string;
}) {
    const [loaded, setLoaded] = useState(false);
    const [err, setErr] = useState(false);

    return (
        <div className={cx("relative w-full overflow-hidden", R_CARD_INNER, aspect)}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(249,115,22,0.14),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(15,23,42,0.08),transparent_55%),linear-gradient(180deg,rgba(255,255,255,0.96),rgba(249,250,251,0.98))]" />
            <Image
                src={err ? "/images/blog_fallback.jpg" : src}
                alt={alt}
                fill
                unoptimized
                priority={!!priority}
                sizes="(max-width: 1024px) 100vw, 720px"
                className={cx("object-contain transition-opacity duration-500", loaded ? "opacity-100" : "opacity-0")}
                onLoad={() => setLoaded(true)}
                onError={() => {
                    setErr(true);
                    setLoaded(true);
                }}
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(15,23,42,0.22),transparent_62%)]" />
            {!loaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div
                        className={cx(
                            "border border-white/30 bg-black/20 px-3 py-2 text-[11px] font-extrabold tracking-[0.16em] text-white backdrop-blur",
                            R_CARD_INNER
                        )}
                    >
                        LOADING
                    </div>
                </div>
            )}
        </div>
    );
}

function Pill({ children }: { children: React.ReactNode }) {
    return (
        <span
            className={cx(
                "inline-flex items-center gap-2 border border-black/10 bg-white px-3 py-2 text-xs font-extrabold text-(--color-text-main) shadow-sm",
                R_CARD_INNER
            )}
        >
            {children}
        </span>
    );
}

function PrimaryCTA({
    href,
    children,
    iconRight,
}: {
    href: string;
    children: React.ReactNode;
    iconRight?: React.ReactNode;
}) {
    return (
        <Link
            href={href}
            className={cx(
                "inline-flex items-center justify-center gap-2 bg-(--color-brand) px-6 py-3 text-sm font-extrabold text-white shadow-[0_18px_50px_rgba(249,115,22,0.22)] transition hover:-translate-y-0.5 hover:bg-(--color-brand-dark)",
                R_CARD_INNER
            )}
        >
            {children}
            {iconRight}
        </Link>
    );
}

function MiniChip({ icon, text }: { icon: React.ReactNode; text: string }) {
    return (
        <div className={cx("flex items-center gap-2 border border-black/10 bg-white px-4 py-3 shadow-sm", R_CARD_INNER)}>
            <span className={cx("inline-flex h-9 w-9 items-center justify-center border border-black/10 bg-white", "rounded-md")}>
                {icon}
            </span>
            <span className="text-sm font-semibold text-(--color-text-muted)">{text}</span>
        </div>
    );
}


export default function BookPublishingServicePage() {
    const pageTitle = "Book Publishing";
    
    const pageSubtitle =
        "End-to-end publishing production services, from digitization to interactive eBooks, delivered with speed, quality, and clean structured outputs.";

    const heroImage = "https://images.unsplash.com/photo-1457694587812-e8bf29a43845?auto=format&fit=crop&w=2000&q=80";

    const pills = ["Digitization", "Editing", "eBook", "XML/HTML5", "Typesetting", "POD", "Interactive"];

    const proofStats: StatItem[] = useMemo(
        () => [
            {
                id: "projects",
                icon: defaultIcons.projects,
                value: 1200,
                suffix: "+",
                label: "Projects delivered",
                hint: "Digitization, conversion, layout and interactive builds — end-to-end delivery.",
            },
            {
                id: "qa",
                icon: defaultIcons.qa,
                value: 98,
                suffix: "%",
                label: "QA pass rate",
                hint: "Multi-stage checks and validation so output is clean and platform-ready.",
                highlight: true,
            },
            {
                id: "partners",
                icon: defaultIcons.partners,
                value: 250,
                suffix: "+",
                label: "Publishing partners",
                hint: "Publishers, institutes and content teams with recurring production needs.",
            },
        ],
        []
    );

    const services: ServiceItem[] = useMemo(
        () => [
            {
                id: "digitization",
                title: "Document Digitization & Scanning",
                desc: "We convert printed books, journals, and archives into high-quality digital formats that are searchable, clean, and production-ready.",
                Icon: FiArchive,
                image: {
                    src: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1600&q=80",
                    alt: "Document digitization and scanning",
                },
                bullets: ["High-quality capture", "OCR-ready outputs", "Cleanup & consistency", "Batch processing"],
            },
            {
                id: "copyediting",
                title: "Copyediting & Proofreading",
                desc: "We refine language, clarity, and consistency to ensure your content is accurate, polished, and ready for publication.",
                Icon: FiEdit3,
                image: {
                    src: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80",
                    alt: "Copyediting and proofreading",
                },
                bullets: ["Grammar & style corrections", "Consistency checks", "Error reduction", "Readability improvements"],
            },
            {
                id: "ebook",
                title: "eBook Conversion",
                desc: "We convert print content into EPUB, Kindle, and fixed-layout formats with full device compatibility and validation.",
                Icon: FiBookOpen,
                image: {
                    src: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=1600&q=80",
                    alt: "eBook conversion",
                },
                bullets: ["EPUB / Kindle formats", "Fixed-layout support", "Device validation", "Clean structure"],
            },
            {
                id: "xml-html",
                title: "XML/HTML Conversion",
                desc: "We transform content into structured XML and HTML5 formats for web publishing and multi-platform distribution.",
                Icon: FiCode,
                image: {
                    src: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&q=80",
                    alt: "XML and HTML conversion",
                },
                bullets: ["Structured XML outputs", "HTML5-ready builds", "Future-proof formatting", "Platform compatibility"],
            },
            {
                id: "typesetting",
                title: "Typesetting & Layout Design",
                desc: "We design professional interiors with clear hierarchy, precise layouts, and production-ready formatting for both print and digital.",
                Icon: FiGrid,
                image: {
                    src: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1600&q=80",
                    alt: "Typesetting and layout design",
                },
                bullets: ["Clean visual hierarchy", "Equation/diagram handling", "Consistent styling", "Production-ready layout"],
            },
            {
                id: "metadata",
                title: "Metadata Creation & Tagging",
                desc: "We create accurate metadata to improve discoverability, search visibility, and platform-ready cataloging.",
                Icon: FiTag,
                image: {
                    src: "https://images.unsplash.com/photo-1556155092-8707de31f9c4?auto=format&fit=crop&w=1600&q=80",
                    alt: "Metadata tagging",
                },
                bullets: ["Taxonomy & tags", "Better discoverability", "Catalog-ready fields", "Consistent labeling"],
            },
            {
                id: "multimedia",
                title: "Multimedia Integration",
                desc: "We integrate audio, video, and animations to make learning content more engaging and platform-ready.",
                Icon: FiPlayCircle,
                image: {
                    src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80",
                    alt: "Multimedia integration",
                },
                bullets: ["Audio/video embeds", "Animations & simulations", "Interactive elements", "Platform-ready packaging"],
            },
            {
                id: "interactive-ebook",
                title: "Interactive eBook Development",
                desc: "We build fixed-layout interactive eBooks with read-aloud features, quizzes, and engaging user interactions.",
                Icon: FiZap,
                image: {
                    src: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=1600&q=80",
                    alt: "Interactive ebook development",
                },
                bullets: ["Read-aloud support", "Quizzes & interactions", "Animation-ready layout", "User-friendly flow"],
            },
            {
                id: "pod",
                title: "Print-on-Demand (POD) Preparation",
                desc: "We validate layouts for print compliance, ensuring correct margins, trim, bleed, and print-ready output.",
                Icon: FiPrinter,
                image: {
                    src: "https://images.unsplash.com/photo-1522252234503-e356532cafd5?auto=format&fit=crop&w=1600&q=80",
                    alt: "Print on demand preparation",
                },
                bullets: ["Print-ready checks", "Trim/bleed alignment", "Layout validation", "Production compliance"],
            },
            {
                id: "news-mag",
                title: "Magazine & Newspaper Digitization",
                desc: "We convert legacy magazine and newspaper archives into searchable digital collections for long-term preservation and access.",
                Icon: FiFileText,
                image: {
                    src: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1600&q=80",
                    alt: "Magazine and newspaper digitization",
                },
                bullets: ["Archive preservation", "Searchable formats", "Indexing support", "Long-term accessibility"],
            },
        ],
        []
    );

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
                    eyebrow="BOOK PUBLISHING"
                    title={pageTitle}
                    subtitle={pageSubtitle}
                    heroImage={{ src: heroImage, alt: pageTitle }}
                    chips={[
                        { icon: <FiLayers className="text-(--color-brand-dark)" />, text: "Clear workflow . QA checkpoints" },
                        { icon: <FiBarChart2 className="text-(--color-brand-dark)" />, text: "Progress visibility & reporting" },
                    ]}
                    pills={pills}
                    badges={[
                        <>
                            <FiCheckCircle /> Multi-stage QA
                        </>,
                        <>
                            <FiFileText /> Structured outputs
                        </>,
                        <>
                            <FiZap /> Automation-friendly
                        </>,
                    ]}
                    primaryCta={{ href: "/contact", label: "Request a Quote" }}
                    noteText="Enterprise delivery standards"
                />

                <div className="mx-auto mt-16 max-w-7xl">
                    <ProofStatsSection
                        eyebrow="TRUST METRICS"
                        heading="Publishing teams choose us for speed + reliability"
                        subheading="Real publishing outcomes that help you deliver faster, maintain quality, and scale with confidence."
                        stats={proofStats}
                        columns={3}
                        centered
                    />


                </div>

                <div className="mx-auto mt-12 max-w-7xl">
                    <ServicesCarouselSection
                        slides={services}
                        eyebrow="SERVICES"
                        heading="Services & capabilities"
                        subheading="Explore our services through a guided carousel — each capability clearly highlights deliverables, quality standards, and turnaround timelines."
                        autoRotateMs={6500}
                        pauseOnHover
                        showTabs
                    />


                </div>

                <div className="mx-auto max-w-7xl">
                    <ContactCTASection
                        eyebrow="NEXT STEP"
                        heading="Ready to discuss your publishing workflow?"
                        subheading="Share your volume, formats (EPUB/XML/HTML5/PDF), and timelines, and we’ll recommend a clear delivery plan with defined quality checkpoints."
                        primaryCta={{ href: "/contact", label: "Request a Quote" }}
                        bullets={[
                            "Content type (books / journals / newspapers)",
                            "Target outputs (EPUB / XML / HTML5 / PDF)",
                            "Estimated volume and schedule",
                            "Special requirements (accessibility, tagging, validation)",
                            "Sample files (optional)",
                        ]}
                        noteText="Usually respond within 24 hours (business days)"
                    />


                </div>
            </div>
        </motion.section>
    );
}
