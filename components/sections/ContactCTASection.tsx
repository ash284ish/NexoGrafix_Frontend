"use client";

import Link from "next/link";
import React from "react";
import { motion, type Variants } from "framer-motion";
import { FiArrowRight, FiCheckCircle, FiMail } from "react-icons/fi";

function cx(...classes: Array<string | false | undefined | null>) {
    return classes.filter(Boolean).join(" ");
}

const R_CARD = "rounded-md";
const R_CARD_INNER = "rounded-md";

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

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
                "inline-flex items-center justify-center gap-2 bg-(--color-brand) px-6 py-3 text-sm font-extrabold text-white shadow-[0_18px_50px_rgba(249,115,22,0.22)] transform transition duration-150 ease-out hover:-translate-y-1 hover:bg-black hover:text-white",
                R_CARD_INNER
            )}
        >
            {children}
            {iconRight}
        </Link>
    );
}

export type ContactCtaProps = {
    eyebrow?: string;
    heading: string;
    subheading: string;
    primaryCta: { href: string; label: string };
    secondaryCta?: { href: string; label: string };
    bullets: string[];
    noteText?: string;
};

export default function ContactCTASection({
    eyebrow = "NEXT STEP",
    heading,
    subheading,
    primaryCta,
    secondaryCta,
    bullets,
    noteText = "Usually respond within 24 hours (business days)",
}: ContactCtaProps) {
    return (
        <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="mt-12">
            <div className={cx("border border-black/10 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.08)]", R_CARD)}>
                <div className="grid gap-8 p-7 sm:p-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
                    <div>
                        <div className="text-[12px] font-extrabold tracking-[0.14em] text-(--color-brand-dark)">{eyebrow}</div>
                        <h3 className="mt-2 text-2xl font-extrabold text-(--color-text-main) sm:text-3xl">{heading}</h3>
                        <p className="mt-3 max-w-2xl text-sm font-semibold leading-relaxed text-(--color-text-muted) sm:text-base">{subheading}</p>

                        <div className="mt-6 flex flex-wrap gap-3">
                            <PrimaryCTA href={primaryCta.href} iconRight={<FiArrowRight />}>
                                {primaryCta.label}
                            </PrimaryCTA>

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
                        </div>

                        <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-(--color-text-muted)">
                            <span className={cx("inline-flex h-9 w-9 items-center justify-center border border-black/10 bg-white shadow-sm", "rounded-md")}>
                                <FiMail className="opacity-70" />
                            </span>
                            {noteText}
                        </div>
                    </div>

                    <div className={cx("border border-black/10 bg-white p-6 shadow-[0_14px_40px_rgba(15,23,42,0.06)]", R_CARD)}>
                        <div className="text-sm font-extrabold text-(--color-text-main)">What to include</div>
                        <div className="mt-4 space-y-3">
                            {bullets.map((t) => (
                                <div key={t} className="flex items-start gap-2 text-sm font-semibold text-(--color-text-muted)">
                                    <FiCheckCircle className="mt-0.5 shrink-0 text-(--color-brand-dark)" />
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
