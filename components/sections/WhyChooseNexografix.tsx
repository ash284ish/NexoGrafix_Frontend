"use client";

import { motion, type Variants } from "framer-motion";
import { ShieldCheck, Layers, Sparkles, Timer, ArrowRight } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import DashboardPreviewCode from "./Dashboardpreviewcode";

type WhyChooseItem = {
  no: string;
  title: string;
  desc: string;
  icon: "ShieldCheck" | "Layers" | "Sparkles" | "Timer";
  href: string;
};

type HomeContent = {
  whychoose: {
    pill: string;
    title: string;
    subtitle: string;
    items: WhyChooseItem[];
  };
};

const parent: Variants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.19, delayChildren: 0.12 },
  },
};

const card: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function WhyChooseNexografix() {
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
    return () => {
      alive = false;
    };
  }, []);

  const iconMap = useMemo(
    () => ({
      ShieldCheck,
      Layers,
      Sparkles,
      Timer,
    }),
    []
  );

  const c = data?.whychoose;

  return (
    <section className="relative bg-white py-14 sm:py-16">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-10 h-90 w-90 rounded-full bg-orange-100/60 blur-3xl" />
        <div className="absolute -right-32 bottom-10 h-95 w-95 rounded-full bg-orange-200/35 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center">
          <div className="inline-flex items-center justify-center rounded-full border border-orange-200/70 bg-orange-50 px-4 py-1.5 text-xs font-semibold tracking-wide text-orange-700 shadow-sm">
            {c?.pill ?? "WHY CHOOSE US"}
          </div>

          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            {c?.title ?? "Why Choose Nexografix"}
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            {c?.subtitle ??
              "We combine enterprise-grade execution with AI-enabled delivery to support publishing, content production, assessments, and automation workflows."}
          </p>
        </div>

        <motion.div
          variants={parent}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="mt-10 grid gap-6 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4"
        >
          {(c?.items ?? []).map((it) => {
            const Icon = iconMap[it.icon] ?? ShieldCheck;

            return (
              <motion.a
                key={it.no}
                href={it.href}
                variants={card}
                className="
                  group relative h-full overflow-hidden rounded-md
                  border border-slate-200 bg-white p-6
                  shadow-[0_18px_55px_rgba(15,23,42,0.06)]
                  transition-shadow duration-300
                  hover:shadow-[0_26px_80px_rgba(15,23,42,0.10)]
                "
              >
                <div className="flex h-full flex-col">
                  <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-orange-200/50 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-transparent via-orange-300/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="pointer-events-none absolute right-5 top-5 select-none text-5xl font-extrabold tracking-tight text-orange-100/90">
                    {it.no}
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-md border border-orange-200 bg-orange-50 text-orange-700 shadow-sm">
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="mt-5 text-lg font-bold leading-snug text-slate-900">{it.title}</h3>

                  <p className="mt-3 text-sm leading-relaxed text-slate-600 line-clamp-4">{it.desc}</p>

                  <div className="mt-auto pt-6">
                    <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
                      <span className="relative">
                        <span className="transition-colors group-hover:text-orange-700">Learn More</span>
                        <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-orange-300/70 opacity-70 transition group-hover:bg-orange-500/80" />
                      </span>
                      <ArrowRight className="h-4 w-4 text-slate-500 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-orange-700" />
                    </div>
                  </div>

                  <div className="pointer-events-none absolute inset-0 rounded-md ring-1 ring-transparent transition group-hover:ring-orange-300/50" />
                </div>
              </motion.a>
            );
          })}
        </motion.div>
      </div>
      {/* <DashboardPreviewCode /> */}
    </section>
  );
}
