"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { FiArrowRight, FiCheckSquare } from "react-icons/fi";

function cx(...classes: Array<string | false | undefined | null>) {
    return classes.filter(Boolean).join(" ");
}

const R_CARD = "rounded-md";
const R_CARD_INNER = "rounded-md";

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
        <div className={cx("relative w-full overflow-hidden bg-white", R_CARD_INNER, aspect)}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(249,115,22,0.14),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(15,23,42,0.08),transparent_55%)]" />
            <Image
                src={err ? "/images/blog_fallback.jpg" : src}
                alt={alt}
                fill
                unoptimized
                priority={!!priority}
                sizes="(max-width: 1024px) 100vw, 720px"
                className={cx(
                    "object-contain transition-opacity duration-500",
                    loaded ? "opacity-100" : "opacity-0"
                )}
                onLoad={() => setLoaded(true)}
                onError={() => {
                    setErr(true);
                    setLoaded(true);
                }}
            />
        </div>
    );
}

function PrimaryCTA({ href, label }: { href: string; label: string }) {
    return (
        <Link
            href={href}
            className={cx(
                "inline-flex items-center justify-center gap-2 bg-(--color-brand) px-6 py-3 text-sm font-extrabold text-white shadow-[0_18px_50px_rgba(249,115,22,0.22)] transform transition-transform duration-150 ease-out hover:-translate-y-1 hover:bg-(--color-brand-dark)",
                R_CARD_INNER
            )}
        >
            {label}
            <FiArrowRight />
        </Link>
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

function MiniChip({ icon, text }: { icon: React.ReactNode; text: string }) {
    return (
        <div className={cx("flex items-center gap-2 border border-black/10 bg-white px-4 py-3 shadow-sm", R_CARD_INNER)}>
            <span className="inline-flex h-9 w-9 items-center justify-center border border-black/10 bg-white rounded-md">
                {icon}
            </span>
            <span className="text-sm font-semibold text-(--color-text-muted)">{text}</span>
        </div>
    );
}

export type ServiceHeroProps = {
    eyebrow: string;
    title: string;
    subtitle: string;
    heroImage: { src: string; alt: string };
    pills?: string[];
    badges?: React.ReactNode[];
    chips?: { icon: React.ReactNode; text: string }[];
    primaryCta?: { href: string; label: string };
    secondaryCta?: { href: string; label: string };
    pricingText?: string;
    noteText?: string;
    noteIcon?: React.ReactNode;
    imageAspect?: string;
};

export default function ServiceHeroSection({
    eyebrow,
    title,
    subtitle,
    heroImage,
    pills = [],
    badges = [],
    chips = [],
    primaryCta,
    secondaryCta,
    pricingText,
    noteText = "Enterprise delivery standards",
    noteIcon = <FiCheckSquare className="opacity-70" />,
    imageAspect = "aspect-[16/9]",
}: ServiceHeroProps) {
    return (
        <motion.section variants={heroStagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }}>
            <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
                <motion.div variants={heroStagger} className="max-w-2xl">
                    <motion.div
                        variants={popIn}
                        className={cx(
                            "inline-flex items-center gap-2 border border-black/10 bg-white px-4 py-2 text-xs font-extrabold tracking-[0.14em] text-(--color-brand-dark) shadow-sm",
                            R_CARD_INNER
                        )}
                    >
                        {eyebrow}
                    </motion.div>

                    <motion.h1 variants={popIn} className="mt-5 text-4xl font-extrabold leading-tight text-(--color-text-main) sm:text-5xl">
                        {title}
                    </motion.h1>

                    <motion.p variants={fadeUp} className="mt-4 text-base font-semibold leading-relaxed text-(--color-text-muted) sm:text-lg">
                        {subtitle}
                    </motion.p>

                    {chips.length ? (
                        <motion.div variants={fadeUp} className="mt-6 grid gap-3 sm:grid-cols-2">
                            {chips.slice(0, 2).map((c, i) => (
                                <MiniChip key={i} icon={c.icon} text={c.text} />
                            ))}
                        </motion.div>
                    ) : null}

                    {pills.length ? (
                        <motion.div variants={fadeUp} className="mt-6 flex flex-wrap gap-2">
                            {pills.map((t) => (
                                <span
                                    key={t}
                                    className={cx(
                                        "border border-black/10 bg-white px-3 py-2 text-xs font-extrabold text-(--color-text-main) shadow-sm",
                                        R_CARD_INNER
                                    )}
                                >
                                    {t}
                                </span>
                            ))}
                        </motion.div>
                    ) : null}

                    {badges.length ? (
                        <motion.div variants={fadeUp} className="mt-6 flex flex-wrap gap-2">
                            {badges.map((b, i) => (
                                <Pill key={i}>{b}</Pill>
                            ))}
                        </motion.div>
                    ) : null}

                    {pricingText ? (
                        <motion.div variants={fadeUp} className="mt-4 text-sm font-extrabold text-(--color-brand-dark)">
                            {pricingText}
                        </motion.div>
                    ) : null}

                    {(primaryCta || secondaryCta) ? (
                        <motion.div variants={popIn} className="mt-8 flex flex-wrap gap-3">
                            {primaryCta ? <PrimaryCTA href={primaryCta.href} label={primaryCta.label} /> : null}
                            {secondaryCta ? (
                                <Link
                                    href={secondaryCta.href}
                                    className={cx(
                                        "inline-flex items-center justify-center gap-2 border border-black/10 bg-white px-6 py-3 text-sm font-extrabold text-(--color-text-main) shadow-sm transition hover:bg-black/5",
                                        R_CARD_INNER
                                    )}
                                >
                                    {secondaryCta.label}
                                    <FiArrowRight className="opacity-70" />
                                </Link>
                            ) : null}
                        </motion.div>
                    ) : null}

                    <motion.div variants={fadeUp} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-(--color-text-muted)">
                        <span className="inline-flex h-9 w-9 items-center justify-center border border-black/10 bg-white shadow-sm rounded-md">
                            {noteIcon}
                        </span>
                        {noteText}
                    </motion.div>
                </motion.div>

                <motion.div variants={fadeUp}>
                    <div className={cx("border border-black/10 bg-white p-3 shadow-[0_26px_90px_rgba(15,23,42,0.10)]", R_CARD)}>
                        <SmartImage src={heroImage.src} alt={heroImage.alt} priority aspect={imageAspect} />
                    </div>
                </motion.div>
            </div>
        </motion.section>
    );
}
