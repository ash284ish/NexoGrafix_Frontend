"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, type TargetAndTransition } from "framer-motion";

type AboutContent = {
  hero: {
    badge: { dot: boolean; text: string };
    headline: { line1: string; line2?: string };
    description: string;
    tags: { order: number; label: string; variant: "neutral" | "accent" }[];
    cta: {
      primary: { label: string; href: string };
      secondary: { label: string; href: string };
    };
    stats: { order: number; value: string; title: string; subtitle: string }[];
    trustNote: string;
    preview?: {
      brandLine?: string;
      badgeRight?: string;
      image?: {
        src?: string;
        alt?: string;
      };
      floatingCard?: {
        enabled: boolean;
        title: string;
        chip: string;
      };
    };
  };
};

const floatA: TargetAndTransition = {
  y: [0, -12, 0],
  x: [0, 6, 0],
  rotate: [0, 2, 0],
  transition: { duration: 7, repeat: Infinity, ease: "easeInOut" },
};

const floatB: TargetAndTransition = {
  y: [0, 14, 0],
  x: [0, -8, 0],
  rotate: [0, -2, 0],
  transition: { duration: 9, repeat: Infinity, ease: "easeInOut" },
};

const fadeUp = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export default function WhoWeAreSectionHeroStyle() {
  const [data, setData] = useState<AboutContent | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/content/about`,
          { cache: "no-store" }
        );
        if (!res.ok) throw new Error("Failed to load about content");
        const json = (await res.json()) as AboutContent;
        if (alive) setData(json);
      } catch (e) {
        console.error(e);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const c = data?.hero;
  const tags = (c?.tags ?? []).slice().sort((a, b) => a.order - b.order);
  const stats = (c?.stats ?? []).slice().sort((a, b) => a.order - b.order);

  return (
    <section className="relative overflow-hidden bg-[#FFF7ED] py-16 sm:py-20">
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[44%] bg-white/55 sm:block" />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-orange-50/20 to-transparent" />
        <motion.div
          animate={floatA}
          className="absolute -left-24 -top-28 h-80 w-80 rounded-full bg-orange-200/35 blur-3xl"
        />
        <motion.div
          animate={floatB}
          className="absolute -right-24 top-16 h-80 w-80 rounded-full bg-orange-300/18 blur-3xl"
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.55 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-300/60 bg-white/75 px-4 py-2 text-xs font-semibold text-slate-900 shadow-sm">
              {c?.badge?.dot && (
                <span className="h-2 w-2 rounded-full bg-orange-600" />
              )}
              {c?.badge?.text}
            </div>

            <h2 className="mt-6 text-4xl font-extrabold text-slate-900 sm:text-5xl">
              {c?.headline?.line1}
              {c?.headline?.line2 && (
                <span className="block">{c.headline.line2}</span>
              )}
            </h2>

            <p className="mt-5 max-w-xl text-slate-700">{c?.description}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              {tags.map((t) => (
                <span
                  key={t.label}
                  className={
                    t.variant === "accent"
                      ? "rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700 ring-1 ring-orange-200"
                      : "rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-900 ring-1 ring-slate-200"
                  }
                >
                  {t.label}
                </span>
              ))}
            </div>

            <div className="mt-10 flex gap-4">
              <Link
                href={c?.cta.primary.href ?? "/contact"}
                className="rounded-lg bg-orange-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-600"
              >
                {c?.cta.primary.label}
              </Link>
              <Link
                href={c?.cta.secondary.href ?? "/solutions"}
                className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-slate-900 ring-1 ring-slate-200"
              >
                {c?.cta.secondary.label}
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {stats.map((s) => (
                <div
                  key={s.title}
                  className="rounded-md border border-orange-200 bg-white p-5 shadow-sm"
                >
                  <div className="text-2xl font-extrabold text-orange-600">
                    {s.value}
                  </div>
                  <div className="mt-2 text-sm font-bold text-slate-900">
                    {s.title}
                  </div>
                  <div className="text-xs text-slate-600">
                    {s.subtitle}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.55 }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-md border border-orange-200 bg-white shadow-[0_22px_70px_rgba(0,0,0,0.12)]">
              <div className="relative p-6 sm:p-8">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-900">
                    {c?.preview?.brandLine}
                  </span>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-orange-700 ring-1 ring-orange-200">
                    {c?.preview?.badgeRight}
                  </span>
                </div>

                <div className="relative mx-auto aspect-16/10 w-full overflow-hidden rounded-lg bg-slate-900">
                  <img
                    src={c?.preview?.image?.src}
                    alt={c?.preview?.image?.alt}
                    className="h-full w-full object-contain bg-white"
                  />
                </div>

                {c?.preview?.floatingCard?.enabled && (
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 4.8, repeat: Infinity }}
                    className="absolute -left-2 bottom-6 hidden w-52.5 rounded-md border border-orange-200 bg-white shadow-lg sm:block"
                  >
                    <div className="h-10 bg-orange-600" />
                    <div className="p-4">
                      <div className="text-xs font-semibold text-slate-900">
                        {c.preview.floatingCard.title}
                      </div>
                      <div className="mt-3 rounded bg-orange-50 px-3 py-2 text-xs font-semibold text-orange-700 ring-1 ring-orange-200">
                        {c.preview.floatingCard.chip}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
