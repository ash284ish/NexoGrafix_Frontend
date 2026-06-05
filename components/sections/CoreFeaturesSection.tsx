"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { Layers, Sparkles, ShieldCheck, Workflow, FileText, Accessibility } from "lucide-react";

const ICONS = { Layers, Sparkles, ShieldCheck, Workflow, FileText, Accessibility } as const;
type IconKey = keyof typeof ICONS;

type CoreFeature = { title: string; desc: string; icon: IconKey };

type HomeContent = {
    coreFeatures?: {
        pill: string;
        title: string;
        subtitle: string;
        features: CoreFeature[];
    };
};

const container: Variants = {
    hidden: { opacity: 1 },
    show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.15 } },
};

const item: Variants = {
    hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

export default function CoreFeaturesSection() {
    const [data, setData] = useState<HomeContent | null>(null);

    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/content/home`, { cache: "no-store" });
                if (!res.ok) throw new Error("Failed to load home content");
                const json = (await res.json()) as HomeContent;
                if (alive) setData(json);
            } catch (e) {
                console.error(e);
            }
        })();
        return () => { alive = false; };
    }, []);

    const c = data?.coreFeatures;

    const features = useMemo(() => c?.features ?? [], [c?.features]);

    return (
        <section className="relative bg-white py-16 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <div className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-xs font-semibold tracking-wide text-orange-700">
                        {c?.pill ?? "OUR FEATURES"}
                    </div>

                    <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                        {c?.title ?? "What’s Included in Nexografix Delivery"}
                    </h2>

                    <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
                        {c?.subtitle ?? ""}
                    </p>
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.25 }}
                    className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                >
                    {features.map((f, idx) => {
                        const Icon = ICONS[f.icon] ?? ShieldCheck;

                        return (
                            <motion.div
                                key={idx}
                                variants={item}
                                className="
                  group relative h-full rounded-md border border-slate-200
                  bg-white p-6
                  shadow-[0_18px_55px_rgba(15,23,42,0.06)]
                  transition-shadow duration-300
                  hover:shadow-[0_28px_90px_rgba(15,23,42,0.10)]
                "
                            >
                                <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-orange-200/40 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                                <div className="flex h-12 w-12 items-center justify-center rounded-md border border-orange-200 bg-orange-50 text-orange-700 shadow-sm">
                                    <Icon className="h-6 w-6" />
                                </div>

                                <h3 className="mt-5 text-lg font-bold text-slate-900">{f.title}</h3>
                                <p className="mt-3 text-sm leading-relaxed text-slate-600">{f.desc}</p>

                                <div className="pointer-events-none absolute inset-x-6 bottom-0 h-0.5 bg-linear-to-r from-transparent via-orange-300/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
