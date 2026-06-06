"use client";

import Image from "next/image";
import Link from "next/link";
import Container from "../ui/Container";
import { motion, type Variants } from "framer-motion";
import React, { useEffect, useState } from "react";

type HomeContent = {
    hero: {
        badge: { dot: boolean; text: string };
        headline: { line1: string; line2: string };
        description: string;
        cta: {
            primary: { label: string; href: string };
            secondary: { label: string; href: string };
        };
        trustNote: string;
        heroImage: { src: string; alt: string };
    };
};

export default function HeroSection() {
    const [data, setData] = useState<HomeContent | null>(null);

    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/content/home`,
                    { cache: "no-store" }
                );
                if (!res.ok) throw new Error("Failed to load home content");
                const json = (await res.json()) as HomeContent;
                if (alive) setData(json);
            } catch (e) {
                console.error(e);
            }
        })();
        return () => {
            alive = false;
        };
    }, []);

    const parent: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.18, delayChildren: 0.16 },
        },
    };

    const itemUp: Variants = {
        hidden: { opacity: 0, y: 18, filter: "blur(8px)" },
        show: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
        },
    };

    const float1: Variants = {
        animate: {
            y: [0, -10, 0],
            transition: { duration: 4.2, repeat: Infinity, ease: "easeInOut" },
        },
    };

    const float2: Variants = {
        animate: {
            y: [0, 12, 0],
            transition: { duration: 5.2, repeat: Infinity, ease: "easeInOut" },
        },
    };

    const float3: Variants = {
        animate: {
            y: [0, -8, 0],
            transition: { duration: 3.8, repeat: Infinity, ease: "easeInOut" },
        },
    };

    const c = data?.hero;
    const isLoading = !c;

    const skeletonBlock = "animate-pulse rounded-md bg-slate-200/80";

    return (
        <section className="relative overflow-hidden bg-[#FFF7ED]">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-24 top-10 h-90 w-90 rounded-full bg-orange-200/50 blur-3xl" />
                <div className="absolute -right-28 top-24 h-105 w-105 rounded-full bg-orange-300/35 blur-3xl" />
                <div className="absolute left-[35%] top-[60%] h-130 w-130 -translate-x-1/2 rounded-full bg-white/40 blur-3xl" />

                <motion.div
                    className="absolute left-[52%] top-10 hidden lg:flex"
                    variants={float1}
                    animate="animate"
                >
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M9 7.8v8.4c0 .8.9 1.3 1.6.9l7.2-4.2c.7-.4.7-1.4 0-1.8L10.6 6.9C9.9 6.5 9 7 9 7.8Z"
                            fill="#F97316"
                        />
                    </svg>
                </motion.div>

                <motion.div
                    className="absolute bottom-16 left-[54%] hidden lg:flex"
                    variants={float2}
                    animate="animate"
                >
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M7.2 18.2 4.9 19a.9.9 0 0 1-1.2-1.1l.7-2.1A8 8 0 1 1 20 12a8 8 0 0 1-12.8 6.2Z"
                            fill="#FDBA74"
                        />
                        <circle cx="9" cy="12" r="1.2" fill="#EA580C" />
                        <circle cx="12" cy="12" r="1.2" fill="#EA580C" />
                        <circle cx="15" cy="12" r="1.2" fill="#EA580C" />
                    </svg>
                </motion.div>

                <motion.div
                    className="absolute right-28 top-40 hidden h-12 w-12 rounded-full bg-orange-400/70 lg:block"
                    variants={float3}
                    animate="animate"
                />

                <motion.div
                    className="absolute left-10 top-8 hidden rotate-12 lg:block"
                    variants={float2}
                    animate="animate"
                >
                    <svg viewBox="0 0 64 64" className="h-14 w-14" fill="none">
                        <path
                            d="M12 46c10-18 30-26 40-10"
                            stroke="#F97316"
                            strokeWidth="6"
                            strokeLinecap="round"
                            opacity="0.55"
                        />
                    </svg>
                </motion.div>
            </div>

            <Container>
                <motion.div
                    className="grid items-center gap-12 py-14 lg:grid-cols-[1.02fr_0.98fr] lg:py-20"
                    variants={parent}
                    initial="hidden"
                    animate="show"
                >
                    <div className="text-left">
                        <motion.div variants={itemUp}>
                            <div className="inline-flex items-center gap-2 rounded-full border border-orange-300 bg-white/70 px-4 py-2 text-xs font-semibold tracking-wide text-slate-900">
                                {c?.badge?.dot ? (
                                    <span className="h-2 w-2 rounded-full bg-orange-600" />
                                ) : null}
                                {c?.badge?.text ?? "EXECUTION-FIRST AI PLATFORMS"}
                            </div>
                        </motion.div>

                        <motion.h1
                            variants={itemUp}
                            className="mt-6 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl lg:text-4xl"
                        >
                            {c?.headline?.line1 ?? "We design and deliver"}
                            <br className="hidden sm:block" />
                            {c?.headline?.line2 ??
                                "intelligent systems for publishing & assessments."}
                        </motion.h1>

                        <motion.p
                            variants={itemUp}
                            className="mt-5 max-w-2xl text-base leading-relaxed text-slate-700 sm:text-lg"
                        >
                            {c?.description ?? "Loading..."}
                        </motion.p>

                        <motion.div
                            variants={itemUp}
                            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
                        >
                            <Link
                                href={c?.cta?.primary?.href ?? "/contact"}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-orange-600 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-600 sm:w-auto"
                            >
                                {c?.cta?.primary?.label ?? "Book Demo"}
                            </Link>

                            <Link
                                href={c?.cta?.secondary?.href ?? "/services"}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-md border px-7 py-3 text-sm font-semibold sm:w-auto"
                            >
                                {c?.cta?.secondary?.label ?? "Explore Solutions"}
                            </Link>
                        </motion.div>

                        <motion.div
                            variants={itemUp}
                            className="mt-4 flex items-center gap-2 text-sm text-slate-700"
                        >
                            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-orange-100 text-orange-700">
                                ✓
                            </span>
                            {c?.trustNote ?? "Enterprise delivery standards"}
                        </motion.div>
                    </div>

                    <motion.div
                        variants={float1}
                        animate="animate"
                        className="relative mx-auto w-full max-w-225 lg:max-w-270"
                    >
                        <div className="relative h-80 w-full sm:h-105 lg:h-130">
                            <Image
                                src={c?.heroImage?.src ?? "/images/home_assets.png"}
                                alt={c?.heroImage?.alt ?? "Nexografix preview"}
                                fill
                                className="h-full w-full object-contain"
                                priority
                                loading="eager"
                                unoptimized
                                sizes="(max-width: 1024px) 100vw, 720px"
                            />
                        </div>
                    </motion.div>
                </motion.div>
            </Container>
        </section>
    );
}
