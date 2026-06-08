"use client";

import React, { useEffect, useMemo, useState } from "react";
import { resolveImageUrl } from "../../lib/apiUrl";

/* ===================== TYPES ===================== */

type TestimonialItem = {
    name: string;
    role: string;
    rating: number;
    text: string;
    avatar: string;
};

type HomeContent = {
    testimonials: {
        pill: string;
        title: string;
        subtitle: string;
        rows: Array<{
            direction: "left" | "right";
            speedSeconds: number;
        }>;
        items: TestimonialItem[];
    };
};

/* ===================== COMPONENTS ===================== */

function Stars({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
                <svg
                    key={i}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    className={i < rating ? "text-orange-500" : "text-orange-200"}
                    fill="currentColor"
                >
                    <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
            ))}
        </div>
    );
}

function Card({ t }: { t: TestimonialItem }) {
    return (
        <div className="w-85 sm:w-95 rounded-md border border-slate-200 bg-white p-6">
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="h-11 w-11 overflow-hidden rounded-full ring-1 ring-slate-200">
                        <img
                            src={t.avatar}
                            alt={t.name}
                            className="h-11 w-11 rounded-full object-contain"
                            loading="lazy"
                            onError={(e) => {
                                e.currentTarget.src = "/avatar-placeholder.png";
                            }}
                        />
                    </div>

                    <div>
                        <div className="text-sm font-bold text-slate-900">{t.name}</div>
                        <div className="text-xs font-medium text-slate-500">{t.role}</div>
                    </div>
                </div>

                <div className="text-slate-200">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7.17 6A5.99 5.99 0 0 0 2 12v6h6v-6H5.5A3.5 3.5 0 0 1 9 8.5V6H7.17ZM19.17 6A5.99 5.99 0 0 0 14 12v6h6v-6h-2.5A3.5 3.5 0 0 1 21 8.5V6h-1.83Z" />
                    </svg>
                </div>
            </div>

            <div className="mt-4">
                <Stars rating={t.rating} />
            </div>

            <p className="mt-4 text-sm leading-relaxed text-slate-600">{t.text}</p>
        </div>
    );
}

function Track({
    items,
    direction,
    speedSeconds,
}: {
    items: TestimonialItem[];
    direction: "left" | "right";
    speedSeconds: number;
}) {
    const list = useMemo(() => [...items, ...items], [items]);

    return (
        <div className="relative overflow-hidden">
            <div
                className={`flex w-max gap-6 py-2 ${direction === "left" ? "nx-marquee-left" : "nx-marquee-right"
                    }`}
                style={{ ["--nx-duration" as any]: `${speedSeconds}s` }}
            >
                {list.map((t, i) => (
                    <Card key={`${t.name}-${i}`} t={t} />
                ))}
            </div>
        </div>
    );
}

/* ===================== MAIN ===================== */

export default function TestimonialsMarquee() {
    const [data, setData] = useState<HomeContent | null>(null);

    useEffect(() => {
        let alive = true;

        (async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/content/feedback`, {
                    cache: "no-store",
                });

                if (!res.ok) throw new Error("Failed to load testimonials");

                const json = await res.json();

                const mapped: HomeContent = {
                    testimonials: {
                        pill: "TESTIMONIALS",
                        title: json.hero?.title ?? "Trusted by teams worldwide",
                        subtitle: json.hero?.subtitle ?? "",
                        rows: [
                            { direction: "left", speedSeconds: 40 },
                            { direction: "right", speedSeconds: 45 },
                        ],
                        items: (json.testimonials || []).map((t: any) => {
                            const first = t.first_name || "";
                            const last = t.last_name || "";

                            return {
                                name: `${first} ${last}`.trim() || "Anonymous",
                                role: t.role || "",
                                rating: Number(t.rating) || 0,
                                text: t.message || "",
                                avatar:
                                    t.avatar_url && t.avatar_url.trim() !== "" ? encodeURI(resolveImageUrl(t.avatar_url)) : "/avatar-placeholder.png",
                            };
                        }),
                    },
                };

                if (alive) setData(mapped);
            } catch (err) {
                console.error(err);
            }
        })();

        return () => {
            alive = false;
        };
    }, []);

    const c = data?.testimonials;
    if (!c || !c.items.length) return null;

    return (
        <section className="relative overflow-hidden bg-[#FFF7ED] py-16 sm:py-20">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-24 top-10 h-80 w-[320px] rounded-full bg-orange-200/45 blur-3xl" />
                <div className="absolute -right-28 bottom-12 h-90 w-90 rounded-full bg-orange-300/30 blur-3xl" />
            </div>

            <div className="relative mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <div className="inline-flex items-center rounded-full border border-orange-200 bg-white/70 px-4 py-1.5 text-xs font-semibold tracking-wide text-orange-700">
                        {c.pill}
                    </div>

                    <h2 className="mt-5 text-3xl font-extrabold text-slate-900 sm:text-4xl">{c.title}</h2>

                    <p className="mx-auto mt-4 max-w-3xl text-sm text-slate-600 sm:text-base">{c.subtitle}</p>
                </div>

                <div className="mt-12 space-y-8">
                    <Track {...c.rows[0]} items={c.items} />
                    <Track {...c.rows[1]} items={c.items} />
                </div>
            </div>

            <style jsx global>{`
        .nx-marquee-left {
          animation: nxMarqueeLeft var(--nx-duration) linear infinite;
        }
        .nx-marquee-right {
          animation: nxMarqueeRight var(--nx-duration) linear infinite;
        }
        @keyframes nxMarqueeLeft {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes nxMarqueeRight {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
      `}</style>
        </section>
    );
}
