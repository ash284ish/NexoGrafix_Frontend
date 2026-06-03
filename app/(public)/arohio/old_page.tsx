"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, type Variants, useInView, useReducedMotion } from "framer-motion";
import {
    FiCheckCircle,
    FiArrowRight,
    FiChevronLeft,
    FiChevronRight,
    FiMail,
    FiTrendingUp,
    FiStar,
    FiUsers,
    FiFileText,
    FiImage,
    FiZap,
} from "react-icons/fi";

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
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(16,185,129,0.14),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(15,23,42,0.08),transparent_55%),linear-gradient(180deg,rgba(255,255,255,0.96),rgba(249,250,251,0.98))]" />
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
                "inline-flex items-center justify-center gap-2 bg-orange-500 px-6 py-3 text-sm font-extrabold text-white shadow-[0_18px_50px_rgba(16,185,129,0.22)] transition hover:-translate-y-0.5 hover:bg-orange-600",
                R_CARD_INNER
            )}
        >
            {children}
            {iconRight}
        </Link>
    );
}

function SecondaryCTA({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className={cx(
                "inline-flex items-center justify-center gap-2 border border-black/10 bg-white px-6 py-3 text-sm font-extrabold text-slate-900 shadow-sm transition hover:bg-black/5",
                R_CARD_INNER
            )}
        >
            {children}
        </Link>
    );
}

function Pill({ children }: { children: React.ReactNode }) {
    return (
        <span
            className={cx(
                "inline-flex items-center gap-2 border border-black/10 bg-white px-3 py-2 text-xs font-extrabold text-slate-900 shadow-sm",
                R_CARD_INNER
            )}
        >
            {children}
        </span>
    );
}

function MiniChip({ icon, text }: { icon: React.ReactNode; text: string }) {
    return (
        <div className={cx("flex items-center gap-2 border border-black/10 bg-white px-4 py-3 shadow-sm", R_CARD_INNER)}>
            <span className={cx("inline-flex h-9 w-9 items-center justify-center border border-black/10 bg-white", "rounded-md")}>
                {icon}
            </span>
            <span className="text-sm font-semibold text-slate-600">{text}</span>
        </div>
    );
}

type StatItem = {
    id: string;
    icon: React.ReactNode;
    value: number;
    suffix?: string;
    label: string;
    hint: string;
    highlight?: boolean;
};

function useCountUp(target: number, startWhen: boolean, durationMs = 900) {
    const [value, setValue] = useState(0);
    const raf = useRef<number | null>(null);

    useEffect(() => {
        if (!startWhen) return;

        const start = performance.now();
        const from = 0;

        const tick = (now: number) => {
            const t = Math.min(1, (now - start) / durationMs);
            const eased = 1 - Math.pow(1 - t, 3);
            const next = Math.round(from + (target - from) * eased);
            setValue(next);
            if (t < 1) raf.current = requestAnimationFrame(tick);
        };

        raf.current = requestAnimationFrame(tick);
        return () => {
            if (raf.current) cancelAnimationFrame(raf.current);
            raf.current = null;
        };
    }, [startWhen, target, durationMs]);

    return value;
}

function StatCard({
    icon,
    value,
    suffix,
    label,
    hint,
    highlight,
}: {
    icon: React.ReactNode;
    value: number;
    suffix?: string;
    label: string;
    hint: string;
    highlight?: boolean;
}) {
    const ref = useRef<HTMLDivElement | null>(null);
    const inView = useInView(ref, { amount: 0.35, once: true });
    const reduced = useReducedMotion();
    const num = useCountUp(value, inView && !reduced, 900);

    return (
        <motion.div
            ref={ref}
            variants={popIn}
            className={cx(
                "relative overflow-hidden border border-black/10 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)]",
                R_CARD
            )}
        >
            <div className="absolute inset-0">
                <div className="absolute -top-24 -right-24 h-56 w-56 rounded-full bg-orange-400/10 blur-3xl" />
                <div className="absolute -bottom-28 -left-28 h-64 w-64 rounded-full bg-orange-300/10 blur-3xl" />
            </div>

            <div className="relative flex items-start gap-3">
                <div
                    className={cx(
                        "inline-flex items-center justify-center text-[var(--color-brand-dark)]",
                        "[&_svg]:h-6 [&_svg]:w-6"
                    )}
                >
                    {icon}
                </div>

                <div className="min-w-0">
                    <div className="text-[12px] font-extrabold tracking-[0.14em] text-orange-600">{label.toUpperCase()}</div>

                    <div className="mt-2 flex items-end gap-2">
                        <div className={cx("text-4xl font-extrabold leading-none text-slate-900", highlight && "text-orange-600")}>
                            {reduced ? value : num}
                            {suffix ? <span className="text-2xl font-extrabold">{suffix}</span> : null}
                        </div>
                    </div>

                    <div className="mt-2 text-sm font-semibold leading-relaxed text-slate-600">{hint}</div>
                </div>
            </div>
        </motion.div>
    );
}

function ProofStatsSection({
    eyebrow = "RESULTS",
    heading,
    subheading,
    stats,
    columns = 3,
}: {
    eyebrow?: string;
    heading: string;
    subheading?: string;
    stats: StatItem[];
    columns?: 2 | 3 | 4;
}) {
    const gridCols =
        columns === 2 ? "lg:grid-cols-2" : columns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3";

    return (
        <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }}>
            <div className="mb-6 text-center">
                <div className="text-[12px] font-extrabold tracking-[0.14em] text-orange-600">{eyebrow}</div>
                <h2 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">{heading}</h2>
                {subheading ? (
                    <p className="mx-auto mt-2 max-w-3xl text-sm font-semibold leading-relaxed text-slate-600 sm:text-base">
                        {subheading}
                    </p>
                ) : null}
            </div>

            <motion.div variants={heroStagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className={cx("grid gap-4", gridCols)}>
                {stats.map((s) => (
                    <StatCard key={s.id} icon={s.icon} value={s.value} suffix={s.suffix} label={s.label} hint={s.hint} highlight={s.highlight} />
                ))}
            </motion.div>
        </motion.section>
    );
}

type FeatureCard = {
    id: string;
    tier?: "Core" | "Pro";
    title: string;
    desc: string;
    bullets: string[];
    cta: { href: string; label: string };
};

function FeatureToolsSection({
    eyebrow = "AROHIO TOOLS",
    heading,
    subheading,
    cards,
}: {
    eyebrow?: string;
    heading: string;
    subheading?: string;
    cards: FeatureCard[];
}) {
    return (
        <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
            <div className="mb-10 text-center">
                <div className="text-[12px] font-extrabold tracking-[0.14em] text-orange-600">{eyebrow}</div>
                <h2 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">{heading}</h2>
                {subheading ? (
                    <p className="mx-auto mt-2 max-w-3xl text-sm font-semibold leading-relaxed text-slate-600 sm:text-base">
                        {subheading}
                    </p>
                ) : null}
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {cards.map((c) => {
                    const badge =
                        c.tier === "Pro" ? (
                            <span className={cx("inline-flex items-center border border-black/10 bg-white px-3 py-1 text-xs font-extrabold text-indigo-700 shadow-sm", R_CARD_INNER)}>
                                Pro
                            </span>
                        ) : (
                            <span className={cx("inline-flex items-center border border-black/10 bg-white px-3 py-1 text-xs font-extrabold text-orange-600 shadow-sm", R_CARD_INNER)}>
                                Core
                            </span>
                        );

                    return (
                        <div key={c.id} className={cx("border border-black/10 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)]", R_CARD)}>
                            <div className="flex items-start justify-between gap-3">
                                {badge}
                                <span className="inline-flex h-10 w-10 items-center justify-center border border-black/10 bg-white shadow-sm rounded-md">
                                    <FiZap className="text-orange-600" />
                                </span>
                            </div>

                            <h3 className="mt-4 text-2xl font-extrabold leading-tight text-slate-900">{c.title}</h3>
                            <p className="mt-3 text-sm font-semibold leading-relaxed text-slate-600">{c.desc}</p>

                            <div className="mt-5 space-y-3">
                                {c.bullets.map((b) => (
                                    <div key={b} className="flex items-start gap-2 text-sm font-semibold text-slate-600">
                                        <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-orange-50">
                                            <FiCheckCircle className="text-orange-600" />
                                        </span>
                                        <span>{b}</span>
                                    </div>
                                ))}
                            </div>

                            {/* <div className="mt-6">
                <Link href={c.cta.href} className="text-sm font-extrabold text-orange-600 hover:underline">
                  {c.cta.label}
                </Link>
              </div> */}
                        </div>
                    );
                })}
            </div>
        </motion.section>
    );
}

function ContactCTASection({
    eyebrow = "NEXT STEP",
    heading,
    subheading,
    primaryCta,
    bullets,
    noteText,
}: {
    eyebrow?: string;
    heading: string;
    subheading?: string;
    primaryCta: { href: string; label: string };
    bullets: string[];
    noteText?: string;
}) {
    return (
        <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="mt-12">
            <div className={cx("border border-black/10 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.08)]", R_CARD)}>
                <div className="grid gap-8 p-7 sm:p-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
                    <div>
                        <div className="text-[12px] font-extrabold tracking-[0.14em] text-orange-600">{eyebrow}</div>
                        <h3 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">{heading}</h3>
                        {subheading ? <p className="mt-3 max-w-2xl text-sm font-semibold leading-relaxed text-slate-600 sm:text-base">{subheading}</p> : null}

                        <div className="mt-6 flex flex-wrap gap-3">
                            <PrimaryCTA href={primaryCta.href} iconRight={<FiArrowRight />}>
                                {primaryCta.label}
                            </PrimaryCTA>
                        </div>

                        {noteText ? (
                            <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-600">
                                <span className={cx("inline-flex h-9 w-9 items-center justify-center border border-black/10 bg-white shadow-sm", "rounded-md")}>
                                    <FiMail className="opacity-70" />
                                </span>
                                {noteText}
                            </div>
                        ) : null}
                    </div>

                    <div className={cx("border border-black/10 bg-white p-6 shadow-[0_14px_40px_rgba(15,23,42,0.06)]", R_CARD)}>
                        <div className="text-sm font-extrabold text-slate-900">What to share</div>
                        <div className="mt-4 space-y-3">
                            {bullets.map((t) => (
                                <div key={t} className="flex items-start gap-2 text-sm font-semibold text-slate-600">
                                    <FiCheckCircle className="mt-0.5 shrink-0 text-orange-600" />
                                    <span>{t}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </motion.section>
    );
}

type HeroProps = {
    eyebrow: string;
    title: string;
    subtitle: string;
    heroImage: { src: string; alt: string };
    chips: Array<{ icon: React.ReactNode; text: string }>;
    badges: React.ReactNode[];
    primaryCta: { href: string; label: string };
    secondaryCta?: { href: string; label: string };
    pricing?: {
        inr: { label: string; value: string };
        usd: { label: string; value: string };
    };
};

function ServiceHeroSection({
    eyebrow,
    title,
    subtitle,
    heroImage,
    chips,
    badges,
    primaryCta,
    secondaryCta,
    pricing,
}: HeroProps) {
    return (
        <motion.section variants={heroStagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }}>
            <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
                <motion.div variants={heroStagger} className="max-w-2xl">
                    <motion.div
                        variants={popIn}
                        className={cx(
                            "inline-flex items-center gap-2 border border-black/10 bg-white px-4 py-2 text-xs font-extrabold tracking-[0.14em] text-orange-600 shadow-sm",
                            R_CARD_INNER
                        )}
                    >
                        {eyebrow}
                    </motion.div>

                    <motion.h1 variants={popIn} className="mt-5 text-4xl font-extrabold leading-tight text-slate-900 sm:text-5xl">
                        {title}
                    </motion.h1>

                    <motion.p variants={fadeUp} className="mt-4 text-base font-semibold leading-relaxed text-slate-600 sm:text-lg">
                        {subtitle}
                    </motion.p>

                    <motion.div variants={fadeUp} className="mt-6 grid gap-3 sm:grid-cols-2">
                        {chips.map((c) => (
                            <MiniChip key={c.text} icon={c.icon} text={c.text} />
                        ))}
                    </motion.div>

                    <motion.div variants={fadeUp} className="mt-6 flex flex-wrap items-center gap-2">
                        {badges.map((b, idx) => (
                            <Pill key={idx}>{b}</Pill>
                        ))}
                    </motion.div>

                    {pricing ? (
                        <motion.div variants={fadeUp} className="mt-6 flex flex-wrap items-center gap-2">
                            <span className={cx("border border-black/10 bg-white px-3 py-2 text-xs font-extrabold text-slate-900 shadow-sm", R_CARD_INNER)}>
                                {pricing.inr.label}: <span className="text-orange-600">{pricing.inr.value}</span>
                            </span>
                            <span className={cx("border border-black/10 bg-white px-3 py-2 text-xs font-extrabold text-slate-900 shadow-sm", R_CARD_INNER)}>
                                {pricing.usd.label}: <span className="text-orange-600">{pricing.usd.value}</span>
                            </span>
                        </motion.div>
                    ) : null}

                    <motion.div variants={popIn} className="mt-8 flex flex-wrap gap-3">
                        <PrimaryCTA href={primaryCta.href} iconRight={<FiArrowRight />}>
                            {primaryCta.label}
                        </PrimaryCTA>
                        {secondaryCta ? <SecondaryCTA href={secondaryCta.href}>{secondaryCta.label}</SecondaryCTA> : null}
                    </motion.div>
                </motion.div>

                <motion.div variants={fadeUp} className="relative">
                    <div className={cx("border border-black/10 bg-white p-3 shadow-[0_26px_90px_rgba(15,23,42,0.10)]", R_CARD)}>
                        <SmartImage src={heroImage.src} alt={heroImage.alt} priority aspect="aspect-[16/11]" />
                    </div>
                </motion.div>
            </div>
        </motion.section>
    );
}

export default function ArohioMainFeaturePage() {
    const heroImage = "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=2000&q=80";

    const proofStats: StatItem[] = useMemo(
        () => [
            {
                id: "teams",
                icon: <FiUsers className="text-orange-600" />,
                value: 300,
                suffix: "+",
                label: "Teams onboarded",
                hint: "Publishing, EdTech, and content teams using Arohio for accessibility workflows.",
            },
            {
                id: "quality",
                icon: <FiStar className="text-orange-600" />,
                value: 99,
                suffix: "%",
                label: "Consistency rate",
                hint: "Standardized outputs with review-friendly structure for faster QA cycles.",
                highlight: true,
            },
            {
                id: "time",
                icon: <FiTrendingUp className="text-orange-600" />,
                value: 60,
                suffix: "%",
                label: "Faster turnaround",
                hint: "Reduce manual effort with automation, batch export, and repeatable workflows.",
            },
        ],
        []
    );

    const featureCards: FeatureCard[] = useMemo(
        () => [
            {
                id: "manifest",
                tier: "Core",
                title: "PDF → Image Manifest",
                desc: "Upload a PDF and instantly generate a structured image manifest with page references ready for review and accessibility workflows.",
                bullets: [
                    "Extract all images with metadata",
                    "Page index and bounding boxes included",
                    "Works for scanned and digital PDFs",
                    "Export to review-friendly formats",
                ],
                cta: { href: "/tools/pdf-to-manifest", label: "Use This Tool" },
            },
            {
                id: "manifest-to-alt",
                tier: "Pro",
                title: "Image Manifest → Alt Text",
                desc: "Upload an Excel or CSV manifest and generate short or long alt text at scale with consistent tone and length controls.",
                bullets: [
                    "Short and long alt text generation",
                    "User-defined word or character limits",
                    "Tone presets for different content types",
                    "Batch-ready for large documents",
                ],
                cta: { href: "/tools/manifest-to-alt-text", label: "Use This Tool" },
            },
            {
                id: "pdf-direct-alt",
                tier: "Core",
                title: "PDF → Alt Text (Direct)",
                desc: "Generate alt text directly from a PDF without spreadsheets. Great for quick accessibility passes and rapid exports.",
                bullets: [
                    "Automatic figure and image detection",
                    "Supports scanned and digital PDFs",
                    "Export in multiple formats",
                    "Designed for fast review cycles",
                ],
                cta: { href: "/tools/pdf-to-alt-text", label: "Use This Tool" },
            },
        ],
        []
    );

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
                    eyebrow="AROHIO"
                    title="PDF Accessibility, Automation & Alt Text — All in One Place"
                    subtitle="From extraction to accessibility automation, Arohio helps you generate structured manifests, write alt text at scale, and export compliant outputs in a clean, repeatable workflow."
                    heroImage={{ src: heroImage, alt: "Arohio PDF accessibility tools" }}
                    chips={[
                        { icon: <FiFileText className="text-orange-600" />, text: "Structured exports for QA & delivery" },
                        { icon: <FiImage className="text-orange-600" />, text: "Image detection + metadata manifest" },
                        { icon: <FiZap className="text-orange-600" />, text: "Alt text automation at scale" },
                        { icon: <FiCheckCircle className="text-orange-600" />, text: "Accessibility-first workflow" },
                    ]}
                    badges={[
                        <>
                            <FiCheckCircle /> Batch-ready outputs
                        </>,
                        <>
                            <FiFileText /> Multiple export formats
                        </>,
                        <>
                            <FiZap /> Faster processing cycles
                        </>,
                    ]}
                    pricing={{
                        inr: { label: "Starting", value: "₹999 / month" },
                        usd: { label: "Starting", value: "$19 / month" },
                    }}
                    primaryCta={{ href: "/contact", label: "Request a Demo" }}
                    secondaryCta={{ href: "/pricing", label: "View Pricing" }}
                />

                <div className="mx-auto mt-16 max-w-7xl">
                    <FeatureToolsSection
                        eyebrow="MAIN FEATURE"
                        heading="Every tool you need to make PDFs accessible — in one place"
                        subheading="Upload, extract, generate, and export with a workflow designed for speed, quality, and consistent accessibility outputs."
                        cards={featureCards}
                    />
                </div>

                <div className="mx-auto mt-16 max-w-7xl">
                    <ProofStatsSection
                        eyebrow="RESULTS"
                        heading="Designed to save time, reduce manual effort, and improve quality"
                        subheading="Arohio is built for teams who need reliable accessibility outputs without slowing down production."
                        stats={proofStats}
                        columns={3}
                    />
                </div>

                <div className="mx-auto mt-12 max-w-7xl">
                    <ContactCTASection
                        eyebrow="NEXT STEP"
                        heading="Want to see Arohio on your PDFs?"
                        subheading="Share a sample PDF and your target output format. We’ll recommend the best workflow and a clean delivery plan."
                        primaryCta={{ href: "/contact", label: "Talk to Us" }}
                        bullets={[
                            "PDF type (scanned or digital) and approximate page count",
                            "What you need (image manifest, alt text, or direct export)",
                            "Preferred output formats (XLSX, CSV, JSON, XML, HTML)",
                            "Any accessibility requirements (WCAG / PDF/UA / EPUB)",
                            "Sample files (optional but helpful)",
                        ]}
                        noteText="We usually respond within 24 hours (business days)"
                    />
                </div>
            </div>
        </motion.section>
    );
}
