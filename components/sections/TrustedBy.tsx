"use client";

import { motion } from "framer-motion";
import React, { useEffect, useMemo, useState } from "react";
import { resolveImageUrl } from "../../lib/apiUrl";

type ClientItem = {
    name: string;
    domain: string;
    imageUrl: string;
    blur?: boolean;
};

type HomeContent = {
    clients: {
        pill: string;
        title: string;
        subtitle: string;
        footerNote: string;
        marqueeSpeed: number;
        items: ClientItem[];
    };
};

export default function OurClientsMarquee() {
    const [data, setData] = useState<HomeContent | null>(null);
    const [paused, setPaused] = useState(false);

    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/content/home`, {
                    cache: "no-store",
                });
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

    const c = data?.clients;
    const items = c?.items ?? [];
    const track = useMemo(() => [...items, ...items], [items]);

    return (
        <section className="relative bg-white py-16 sm:py-20">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <div className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-xs font-semibold tracking-wide text-orange-700">
                        {c?.pill}
                    </div>

                    <h2 className="mt-4 text-3xl font-extrabold text-slate-900 sm:text-4xl">{c?.title}</h2>

                    <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">{c?.subtitle}</p>
                </div>

                <div
                    className="relative mt-10 overflow-hidden"
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                >
                    <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-14 bg-linear-to-r from-white to-transparent" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-14 bg-linear-to-l from-white to-transparent" />

                    <motion.div
                        className="flex w-max items-stretch gap-6 pr-6 py-2"
                        animate={{ x: paused ? undefined : ["0%", "-50%"] }}
                        transition={{
                            duration: c?.marqueeSpeed ?? 28,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    >
                        {track.map((item, idx) => {
                            return (
                                <div
                                    key={`${item.name}-${idx}`}
                                    className="
                                        group relative flex h-26 w-65 shrink-0 items-center gap-4
                                        rounded-md border border-slate-200 bg-white px-6
                                        shadow-[0_14px_40px_rgba(15,23,42,0.02)]
                                        transition-all duration-200
                                        hover:-translate-y-0.5 hover:border-orange-300
                                        hover:shadow-[0_22px_70px_rgba(234,88,12,0.14)]
                                    "
                                >
                                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-50 ring-1 ring-slate-200 transition group-hover:ring-orange-300">
                                        <img
                                            src={resolveImageUrl(item.imageUrl)}
                                            alt={item.name}
                                            loading="lazy"
                                            className="h-9 w-9 object-contain transition blur-[6px] opacity-70 grayscale"
                                        />
                                    </div>

                                    <div className="min-w-0 blur-[3px] select-none">
                                        <div
                                            className="truncate text-base font-extrabold text-slate-500 opacity-70"
                                        >
                                            {item.name}
                                        </div>
                                        <div className="truncate text-sm font-semibold text-slate-500 opacity-70">
                                            {item.domain}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </motion.div>
                </div>

                <p className="mx-auto mt-10 max-w-3xl text-center text-sm text-slate-600">{c?.footerNote}</p>
            </div>
        </section>
    );
}
