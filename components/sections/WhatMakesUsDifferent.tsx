"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { FiShield, FiClock, FiCheckCircle, FiZap } from "react-icons/fi";

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.06 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.55, ease: "easeOut" } },
};

const popIn: Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.98, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", transition: { duration: 0.5, ease: "easeOut" } },
};

type Point = { order: number; icon: string; title: string; desc: string; pill: string };
type MiniStat = { order: number; label: string; value: string };

type AboutContent = {
  whatMakesDifferent?: {
    left?: {
      pill?: string;
      title?: string;
      subtitle?: string;
      points?: Point[];
      footerNote?: string;
    };
    right?: {
      pill?: string;
      badgeRight?: string;
      image?: { src?: string; alt?: string };
      miniStats?: MiniStat[];
    };
  };
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FiShield,
  FiClock,
  FiCheckCircle,
  FiZap,
};

export default function WhatMakesUsDifferent() {
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

  const left = data?.whatMakesDifferent?.left;
  const right = data?.whatMakesDifferent?.right;

  const points = useMemo(() => {
    const list = (left?.points ?? []).slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    if (list.length) return list;
    return [
      {
        order: 1,
        icon: "FiShield",
        title: "Enterprise-Ready Governance",
        desc: "Clear ownership, documentation, and controlled workflows for audit-friendly delivery.",
        pill: "Risk-controlled",
      },
      {
        order: 2,
        icon: "FiCheckCircle",
        title: "QA & Review Gates",
        desc: "Multi-stage validation with measurable checkpoints for consistency and accuracy.",
        pill: "Quality-assured",
      },
      {
        order: 3,
        icon: "FiClock",
        title: "SLA-Driven Execution",
        desc: "Defined timelines with escalation paths and release readiness discipline.",
        pill: "Predictable",
      },
    ];
  }, [left?.points]);

  const miniStats = useMemo(() => {
    const list = (right?.miniStats ?? []).slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    if (list.length) return list;
    return [
      { order: 1, label: "Governance", value: "Owned workflows" },
      { order: 2, label: "Quality Gates", value: "Measured checks" },
      { order: 3, label: "SLA Delivery", value: "On-time discipline" },
      { order: 4, label: "Visibility", value: "Clear status" },
    ];
  }, [right?.miniStats]);

  const imageSrc =
    right?.image?.src ??
    "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1400&q=80";
  const imageAlt = right?.image?.alt ?? "Delivery dashboard preview";

  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-48 left-1/2 h-130 w-245 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.07),transparent_62%)] blur-2xl" />
        <div className="absolute -bottom-60 -right-60 h-140 w-140 rounded-full bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.06),transparent_66%)] blur-2xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.28 }}>
            <motion.div
              variants={popIn}
              className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-extrabold tracking-[0.14em] text-(--color-brand-dark) shadow-sm"
            >
              {left?.pill ?? "WHAT MAKES US DIFFERENT"}
            </motion.div>

            <motion.h2 variants={popIn} className="mt-6 text-4xl font-extrabold leading-tight text-(--color-text-main) sm:text-5xl">
              {left?.title ?? "Delivery standards enterprises can rely on."}
            </motion.h2>

            <motion.p variants={popIn} className="mt-4 max-w-xl text-base font-semibold leading-relaxed text-(--color-text-muted) sm:text-lg">
              {left?.subtitle ??
                "Many teams can build. Fewer teams can deliver repeatedly with quality, visibility, and control. We reduce delivery risk while scaling output."}
            </motion.p>

            <motion.div variants={container} className="mt-9 space-y-4">
              {points.map((p) => {
                const Icon = iconMap[p.icon] ?? FiShield;
                return (
                  <motion.div
                    key={p.title}
                    variants={fadeUp}
                    className="relative overflow-hidden rounded-md border border-black/10 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)]"
                  >
                    <div className="relative flex items-start gap-4">
                      <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-black/10 bg-white">
                        <Icon className="h-6 w-6 text-(--color-brand-dark)" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="text-sm font-extrabold text-(--color-text-main)">
                            {p.title}
                          </div>
                          <span className="inline-flex items-center rounded-full border border-orange-200/70 bg-orange-50/60 px-3 py-1 text-[11px] font-extrabold text-(--color-brand-dark)">
                            {p.pill}
                          </span>
                        </div>
                        <div className="mt-2 text-sm font-semibold leading-relaxed text-(--color-text-muted)">
                          {p.desc}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            <motion.div
              variants={popIn}
              className="mt-10 max-w-xl rounded-md border border-black/10 bg-white p-6 text-sm font-semibold leading-relaxed text-(--color-text-muted) shadow-[0_14px_40px_rgba(15,23,42,0.06)]"
            >
              {left?.footerNote ??
                "Outcome: fewer revisions, clearer timelines, safer AI adoption, and measurable delivery confidence."}
            </motion.div>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.28 }}>
            <div className="relative overflow-hidden rounded-md border border-black/10 bg-white shadow-[0_22px_70px_rgba(15,23,42,0.10)]">
              <div className="relative p-6 sm:p-7">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-2 text-xs font-extrabold tracking-[0.14em] text-(--color-brand-dark) shadow-sm">
                    {right?.pill ?? "DELIVERY PROOF"}
                  </div>
                  <div className="rounded-full border border-orange-200/70 bg-orange-50/60 px-3 py-2 text-[11px] font-extrabold text-(--color-brand-dark)">
                    {right?.badgeRight ?? "Visual Preview"}
                  </div>
                </div>

                <div className="mt-5 overflow-hidden rounded-md border border-black/10 bg-white">
                  <div className="relative aspect-16/10 w-full">
                    <img
                      src={imageSrc}
                      alt={imageAlt}
                      className="absolute inset-0 h-full w-full object-contain"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(15,23,42,0.30),transparent_58%)]" />
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {miniStats.map((s) => (
                    <div
                      key={s.label}
                      className="rounded-md border border-black/10 bg-white px-4 py-3 shadow-[0_12px_30px_rgba(15,23,42,0.06)]"
                    >
                      <div className="text-[11px] font-extrabold tracking-[0.14em] text-black/50">
                        {s.label}
                      </div>
                      <div className="mt-1 text-sm font-extrabold text-(--color-text-main)">
                        {s.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
