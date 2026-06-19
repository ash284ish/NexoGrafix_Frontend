"use client";

import { motion, type Variants } from "framer-motion";
import React, { useEffect, useMemo, useState } from "react";
import { FiLayers, FiCpu, FiCheckCircle, FiActivity } from "react-icons/fi";
import { resolveImageUrl } from "../../lib/apiUrl";

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

type AboutContent = {
  howWeSolveIt?: {
    order?: number;
    left?: {
      pill?: string;
      badgeRight?: string;
      image?: { src?: string; alt?: string };
      stats?: { order?: number; label: string; value: string }[];
      statusCard?: { title?: string; chip?: string };
    };
    right?: {
      pill?: string;
      title?: string;
      subtitle?: string;
      cards?: { order?: number; icon?: string; title: string; desc: string; chip?: string }[];
      footerNote?: string;
    };
  };
};

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  FiLayers,
  FiCpu,
  FiCheckCircle,
  FiActivity,
};

export default function HowWeSolveIt() {
  const [data, setData] = useState<AboutContent | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL || ""}/api/v1/content/about`,
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

  const c = data?.howWeSolveIt;

  const leftPill = c?.left?.pill ?? "DELIVERY MODEL";
  const leftBadgeRight = c?.left?.badgeRight ?? "Visual Preview";
  const leftImageSrc = resolveImageUrl(c?.left?.image?.src ?? "");
  const leftImageAlt = c?.left?.image?.alt ?? "Workflow preview";

  const stats = useMemo(
    () =>
      (c?.left?.stats?.length
        ? c.left.stats
        : [
            { label: "QA Gates", value: "Multi-stage reviews" },
            { label: "SLA Focus", value: "Predictable delivery" },
            { label: "Oversight", value: "Human-in-the-loop" },
            { label: "Visibility", value: "Progress clarity" },
          ]
      ).slice(0, 4),
    [c?.left?.stats]
  );

  const statusTitle = c?.left?.statusCard?.title ?? "Status Update";
  const statusChip = c?.left?.statusCard?.chip ?? "Clear checkpoints";

  const rightPill = c?.right?.pill ?? "HOW WE SOLVE IT";
  const rightTitle =
    c?.right?.title ?? "A delivery model built for scale and reliability.";
  const rightSubtitle =
    c?.right?.subtitle ??
    "AI + disciplined execution + QA, so outcomes stay predictable as volume grows.";
  const footerNote =
    c?.right?.footerNote ??
    "Scale content, assessments, and automation without compromising accuracy, compliance, or timelines.";

  const cards = useMemo(
    () =>
      (c?.right?.cards?.length
        ? c.right.cards
        : [
            {
              icon: "FiLayers",
              title: "Process-First Execution",
              desc: "Defined workflows, clear ownership, and checkpoints that prevent drift at scale.",
              chip: "Enterprise-ready",
            },
            {
              icon: "FiCpu",
              title: "AI with Human Oversight",
              desc: "AI boosts speed while teams validate accuracy, compliance, and context.",
              chip: "Enterprise-ready",
            },
            {
              icon: "FiCheckCircle",
              title: "Built-in Quality Gates",
              desc: "Multi-stage QA and review layers ensure consistent output before delivery.",
              chip: "Enterprise-ready",
            },
            {
              icon: "FiActivity",
              title: "Delivery Visibility & Control",
              desc: "Clear progress signals, quality checkpoints, and readiness throughout execution.",
              chip: "Enterprise-ready",
            },
          ]
      ).slice(0, 4),
    [c?.right?.cards]
  );

  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-44 left-1/2 h-130 w-245 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.08),transparent_62%)] blur-2xl" />
        <div className="absolute -bottom-56 -right-55 h-130 w-130 rounded-full bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.07),transparent_66%)] blur-2xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="relative"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.985 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="relative overflow-hidden rounded-md border border-black/10 bg-white shadow-[0_22px_70px_rgba(15,23,42,0.10)]"
            >
              <div className="relative p-5 sm:p-6">
                <motion.div
                  variants={container}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.35 }}
                >
                  <motion.div
                    variants={popIn}
                    className="flex items-center justify-between"
                  >
                    <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-2 text-xs font-extrabold tracking-[0.14em] text-(--color-brand-dark) shadow-sm">
                      {leftPill}
                    </div>
                    <div className="rounded-full border border-orange-200/70 bg-orange-50/60 px-3 py-2 text-[11px] font-extrabold text-(--color-brand-dark)">
                      {leftBadgeRight}
                    </div>
                  </motion.div>

                  <motion.div
                    variants={popIn}
                    className="mt-5 overflow-hidden rounded-md border border-black/10 bg-white"
                  >
                    <div className="relative aspect-16/10 w-full">
                      {leftImageSrc ? (
                        <img
                          src={leftImageSrc}
                          alt={leftImageAlt}
                          className="absolute inset-0 h-full w-full object-contain"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-slate-100" />
                      )}
                      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(15,23,42,0.32),transparent_55%)]" />
                    </div>
                  </motion.div>

                  <motion.div
                    variants={popIn}
                    className="mt-5 grid gap-3 sm:grid-cols-2"
                  >
                    {stats.map((s) => (
                      <div
                        key={`${s.label}-${s.value}`}
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
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div
              variants={popIn}
              className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-extrabold tracking-[0.14em] text-(--color-brand-dark) shadow-sm"
            >
              {rightPill}
            </motion.div>

            <motion.h2
              variants={popIn}
              className="mt-6 text-4xl font-extrabold leading-tight text-(--color-text-main) sm:text-5xl"
            >
              {rightTitle}
            </motion.h2>

            <motion.p
              variants={popIn}
              className="mt-4 text-base font-semibold leading-relaxed text-(--color-text-muted) sm:text-lg"
            >
              {rightSubtitle}
            </motion.p>

            <motion.div
              variants={container}
              className="mt-9 grid gap-5 sm:grid-cols-2"
            >
              {cards.map((card) => {
                const IconComp =
                  ICON_MAP[card.icon ?? ""] ?? FiLayers;
                const chipText = card.chip ?? "Enterprise-ready";
                return (
                  <motion.div
                    key={card.title}
                    variants={popIn}
                    className="group relative flex min-h-45 flex-col overflow-hidden rounded-md border border-black/10 bg-white p-6 shadow-[0_14px_40px_rgba(15,23,42,0.06)]"
                  >
                    <div className="relative inline-flex h-12 w-12 items-center justify-center rounded-md border border-black/10 bg-white">
                      <IconComp className="h-6 w-6 text-(--color-brand-dark)" />
                    </div>

                    <div className="relative mt-4 text-sm font-extrabold text-(--color-text-main)">
                      {card.title}
                    </div>
                    <div className="relative mt-2 text-sm font-semibold leading-relaxed text-(--color-text-muted)">
                      {card.desc}
                    </div>

                    <div className="relative mt-auto pt-5">
                      <span className="inline-flex items-center rounded-full border border-orange-200/70 bg-orange-50/60 px-3 py-1 text-[11px] font-extrabold text-(--color-brand-dark)">
                        {chipText}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            <motion.div
              variants={popIn}
              className="mt-9 max-w-2xl rounded-md border border-black/10 bg-white p-6 text-sm font-semibold leading-relaxed text-(--color-text-muted) shadow-[0_14px_40px_rgba(15,23,42,0.06)]"
            >
              {footerNote}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
