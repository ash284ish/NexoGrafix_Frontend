"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FiAlertTriangle, FiTrendingDown, FiShield, FiEye } from "react-icons/fi";

type AboutProblems = {
    problems: {
        pill: string;
        title: string;
        subtitle: string;
        items: {
            order: number;
            no: string;
            icon: "FiTrendingDown" | "FiAlertTriangle" | "FiShield" | "FiEye";
            title: string;
            desc: string;
            chip: string;
        }[];
        footerNote: string;
    };
};

const fadeUp = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0 },
};

const iconMap = {
    FiTrendingDown,
    FiAlertTriangle,
    FiShield,
    FiEye,
} as const;

export default function WhatProblemsWeSolve() {
    const [data, setData] = useState<AboutProblems | null>(null);

    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/content/about`, { cache: "no-store" });
                if (!res.ok) throw new Error("Failed to load about content");
                const json = (await res.json()) as AboutProblems;
                if (alive) setData(json);
            } catch (e) {
                console.error(e);
            }
        })();
        return () => {
            alive = false;
        };
    }, []);

    const c = data?.problems;

    const items = useMemo(() => {
        const fallback = [
            {
                order: 1,
                no: "01",
                icon: "FiTrendingDown" as const,
                title: "Scaling without Breakdown",
                desc: "High-volume publishing and assessment workflows collapse without clear ownership, repeatable playbooks, and delivery discipline.",
                chip: "Scale-ready ops",
            },
            {
                order: 2,
                no: "02",
                icon: "FiAlertTriangle" as const,
                title: "Quality Drift & Rework",
                desc: "Fragmented reviews and inconsistent checkpoints trigger recurring corrections, delays, and avoidable cost.",
                chip: "Fewer loops",
            },
            {
                order: 3,
                no: "03",
                icon: "FiShield" as const,
                title: "AI Without Reliability",
                desc: "AI speeds up output—but without governance and oversight, accuracy, compliance, and trust degrade quickly.",
                chip: "Safe adoption",
            },
            {
                order: 4,
                no: "04",
                icon: "FiShield" as const,
                title: "Compliance Without Expertise",
                desc: "Meeting WCAG, Section 508 and PDF/UA standards requires specialist knowledge most teams don't have in-house.",
                chip: "Accessible compliance",
            },
        ];
        const list = c?.items?.length ? [...c.items].sort((a, b) => a.order - b.order) : fallback;
        return list.map((it) => ({ ...it, Icon: iconMap[it.icon] ?? FiAlertTriangle }));
    }, [c?.items]);

    return (
        <section className="relative overflow-hidden bg-white py-16 sm:py-20">
            <div className="relative mx-auto max-w-7xl px-6">
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.55, ease: "easeOut" }}
                    className="max-w-3xl"
                >
                    <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-extrabold tracking-[0.14em] text-(--color-brand-dark) shadow-sm">
                        {c?.pill ?? "WHAT PROBLEMS WE SOLVE"}
                    </div>

                    <h2 className="mt-6 text-4xl font-extrabold leading-tight text-(--color-text-main) sm:text-5xl">
                        {c?.title ?? "Execution breaks when scale, quality, and speed collide."}
                    </h2>

                    <p className="mt-5 text-base leading-relaxed text-(--color-text-muted) sm:text-lg">
                        {c?.subtitle ??
                            "Content-driven organizations struggle to deliver consistently as volume increases, timelines tighten, and quality expectations rise. AI adoption adds speed—yet can introduce operational risk without control."}
                    </p>
                </motion.div>

                <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {items.map((it, idx) => (
                        <motion.div
                            key={it.no}
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, amount: 0.25 }}
                            transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 + idx * 0.05 }}
                            className="group relative flex min-h-82.5 flex-col overflow-hidden rounded-md border border-black/10 bg-white p-6 shadow-[0_14px_40px_rgba(15,23,42,0.06)] transition-all duration-200 hover:-translate-y-1 hover:border-orange-200/60 hover:shadow-[0_26px_80px_rgba(15,23,42,0.10)]"
                        >
                            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-orange-200/25 blur-3xl" />
                                <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-orange-300/15 blur-3xl" />
                            </div>

                            <div className="pointer-events-none absolute right-5 top-4 select-none text-[52px] font-extrabold tracking-tight text-black/10 transition-colors duration-200 group-hover:text-orange-400/20">
                                {it.no}
                            </div>

                            <div className="relative">
                                <div className="inline-flex h-12 w-12 items-center justify-center rounded-md border border-black/10 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.08)] transition-transform duration-200 group-hover:-translate-y-0.5">
                                    <it.Icon className="h-6 w-6 text-(--color-brand-dark)" />
                                </div>

                                <h3 className="mt-5 text-lg font-extrabold leading-snug text-(--color-text-main)">{it.title}</h3>

                                <p
                                    className="mt-2 text-sm font-semibold leading-relaxed text-(--color-text-muted)"
                                    style={{
                                        display: "-webkit-box",
                                        WebkitLineClamp: 4,
                                        WebkitBoxOrient: "vertical",
                                        overflow: "hidden",
                                    }}
                                >
                                    {it.desc}
                                </p>
                            </div>

                            <div className="relative mt-auto pt-6">
                                <span className="inline-flex items-center rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-extrabold text-(--color-brand-dark) shadow-[0_10px_24px_rgba(15,23,42,0.06)] transition-colors duration-200 group-hover:border-orange-200/70 group-hover:bg-orange-50/60">
                                    {it.chip}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.55, ease: "easeOut", delay: 0.1 }}
                    className="mt-10 max-w-3xl rounded-md border border-black/10 bg-white p-6 text-sm font-semibold leading-relaxed text-(--color-text-muted) shadow-[0_14px_40px_rgba(15,23,42,0.06)]"
                >
                    {c?.footerNote ??
                        "Nexografix brings structure, clarity, and delivery discipline to complex content and assessment operations—combining AI systems with enterprise-grade execution standards."}
                </motion.div>
            </div>
        </section>
    );
}
