"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, type Variants, useInView, useReducedMotion } from "framer-motion";
import { FiTrendingUp, FiStar, FiUsers } from "react-icons/fi";

function cx(...classes: Array<string | false | undefined | null>) {
    return classes.filter(Boolean).join(" ");
}

const R_CARD = "rounded-md";
const R_CARD_INNER = "rounded-md";

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const popIn: Variants = {
    hidden: { opacity: 0, y: 10, scale: 0.99 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

const heroStagger: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.06 } },
};

export type StatItem = {
    id: string;
    icon: React.ReactNode;
    value: number;
    suffix?: string;
    label: string;
    hint: string;
    highlight?: boolean;
};

export type ProofStatsSectionProps = {
    eyebrow?: string;
    heading: string;
    subheading?: string;
    stats: StatItem[];
    columns?: 1 | 2 | 3 | 4;
    centered?: boolean;
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
                    <div className="text-[12px] font-extrabold tracking-[0.14em] text-[var(--color-brand-dark)]">
                        {label.toUpperCase()}
                    </div>

                    <div className="mt-2 flex items-end gap-2">
                        <div className={cx("text-4xl font-extrabold leading-none text-[var(--color-text-main)]", highlight && "text-[var(--color-brand-dark)]")}>
                            {reduced ? value : num}
                            {suffix ? <span className="text-2xl font-extrabold">{suffix}</span> : null}
                        </div>
                    </div>

                    <div className="mt-2 text-sm font-semibold leading-relaxed text-[var(--color-text-muted)]">{hint}</div>
                </div>
            </div>
        </motion.div>
    );
}

export default function ProofStatsSection({
    eyebrow = "TRUST METRICS",
    heading,
    subheading,
    stats,
    columns = 3,
    centered = false,
}: ProofStatsSectionProps) {
    const gridCols =
        columns === 1
            ? "lg:grid-cols-1"
            : columns === 2
                ? "lg:grid-cols-2"
                : columns === 4
                    ? "lg:grid-cols-4"
                    : "lg:grid-cols-3";

    return (
        <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }}>
            <div className={cx("mb-6", centered && "text-center")}>
                <div className="text-[12px] font-extrabold tracking-[0.14em] text-[var(--color-brand-dark)]">{eyebrow}</div>
                <h2 className="mt-2 text-2xl font-extrabold text-[var(--color-text-main)] sm:text-3xl">{heading}</h2>

                {subheading ? (
                    <p
                        className={cx(
                            "mt-2 text-sm font-semibold leading-relaxed text-[var(--color-text-muted)] sm:text-base",
                            centered ? "mx-auto max-w-3xl" : "max-w-3xl"
                        )}
                    >
                        {subheading}
                    </p>
                ) : null}
            </div>

            <motion.div
                variants={heroStagger}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                className={cx("grid gap-4", gridCols)}
            >
                {stats.map((s) => (
                    <StatCard
                        key={s.id}
                        icon={s.icon}
                        value={s.value}
                        suffix={s.suffix}
                        label={s.label}
                        hint={s.hint}
                        highlight={s.highlight}
                    />
                ))}
            </motion.div>
        </motion.section>
    );
}

export const defaultIcons = {
    projects: <FiTrendingUp className="text-[var(--color-brand-dark)]" />,
    qa: <FiStar className="text-[var(--color-brand-dark)]" />,
    partners: <FiUsers className="text-[var(--color-brand-dark)]" />,
};
