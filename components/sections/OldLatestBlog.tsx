"use client";

import Link from "next/link";
import Container from "../ui/Container";
import { motion, type Variants } from "framer-motion";

const posts = [
    {
        title: "AI-assisted Publishing Workflows: Faster, Cleaner, More Consistent",
        tag: "PUBLISHING",
        date: "Dec 12, 2025",
        href: "/blog/ai-assisted-publishing-workflows",
        image:
            "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1400&q=80",
    },
    {
        title: "Accessibility First: Practical WCAG Steps for Content Teams",
        tag: "ACCESSIBILITY",
        date: "Dec 08, 2025",
        href: "/blog/accessibility-first-wcag-steps",
        image:
            "https://images.unsplash.com/photo-1530103043960-ef38714abb15?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        title: "Automation + QA: Building Reliable Delivery Pipelines at Scale",
        tag: "AUTOMATION",
        date: "Dec 03, 2025",
        href: "/blog/automation-qa-delivery-pipelines",
        image:
            "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1400&q=80",
    },
];

const parent: Variants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.22, // slow stagger (one by one)
            delayChildren: 0.12,
        },
    },
};

const card: Variants = {
    hidden: { opacity: 0, x: 40, y: 10 }, // right se aayega
    show: {
        opacity: 1,
        x: 0,
        y: 0,
        transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
    },
};

export default function LatestBlogSection() {
    return (
        <section className="relative bg-white py-16 sm:py-20">
            {/* subtle accents */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-28 top-10 h-80 w-[320px] rounded-full bg-orange-100/55 blur-3xl" />
                <div className="absolute -right-32 bottom-10 h-95 w-95 rounded-full bg-orange-200/35 blur-3xl" />
            </div>

            <Container>
                {/* Header */}
                <div className="relative text-center">
                    <div className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-xs font-semibold tracking-wide text-orange-700 shadow-sm">
                        OUR BLOG
                    </div>

                    <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                        Watch Our Latest Blog News
                    </h2>

                    <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
                        Publishing, content, assessments, accessibility and automation — practical insights from
                        delivery teams.
                    </p>
                </div>

                {/* Grid */}
                <motion.div
                    variants={parent}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.25 }}
                    className="relative mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                >
                    {posts.map((p) => (
                        <motion.article
                            key={p.href}
                            variants={card}
                            className="
                group overflow-hidden rounded-md border border-slate-200 bg-white
                shadow-[0_18px_55px_rgba(15,23,42,0.06)]
                transition-all duration-300
                hover:-translate-y-1
                hover:border-orange-200
                hover:shadow-[0_26px_85px_rgba(234,88,12,0.14)]
              "
                        >
                            {/* Image */}
                            <div className="relative overflow-hidden">
                                <img
                                    src={p.image}
                                    alt={p.title}
                                    className="
                    h-56 w-full object-contain
                    transition-transform duration-500
                    group-hover:scale-[1.05]
                  "
                                    loading="lazy"
                                />
                                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <div className="flex items-center gap-3 text-sm">
                                    <span className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
                                        {p.tag}
                                    </span>

                                    <span className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                            <path
                                                d="M8 2v3M16 2v3M3.5 9h17M6 6.5h12A2.5 2.5 0 0 1 20.5 9v10A2.5 2.5 0 0 1 18 21.5H6A2.5 2.5 0 0 1 3.5 19V9A2.5 2.5 0 0 1 6 6.5Z"
                                                stroke="currentColor"
                                                strokeWidth="1.8"
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        {p.date}
                                    </span>
                                </div>

                                <h3 className="mt-4 text-xl font-extrabold leading-snug text-slate-900">
                                    {p.title}
                                </h3>

                                <div className="mt-5">
                                    <Link
                                        href={p.href}
                                        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900"
                                    >
                                        <span className="relative">
                                            <span className="transition-colors group-hover:text-orange-700">
                                                Learn More
                                            </span>
                                            <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-orange-300/70 opacity-70 transition group-hover:bg-orange-500/80" />
                                        </span>

                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                            <path
                                                d="M5 12h12M13 6l6 6-6 6"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="transition-transform duration-200 group-hover:translate-x-0.5"
                                            />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </motion.div>

                {/* CTA */}
                <div className="relative mt-10 flex justify-center">
                    <Link
                        href="/blog"
                        className="
    group relative inline-flex items-center justify-center gap-2
    rounded-md bg-orange-600 px-7 py-3
    text-sm font-semibold text-white
    shadow-[0_10px_28px_rgba(234,88,12,0.25)]
    ring-1 ring-orange-600/30
    overflow-hidden
    transition-all duration-300 ease-out

    hover:-translate-y-0.5
    hover:scale-[1.015]
    hover:shadow-[0_18px_48px_rgba(234,88,12,0.32)]
    hover:ring-orange-500/50
  "
                    >
                        {/* Shine overlay — BEHIND text */}
                        <span
                            className="
      absolute inset-0 z-0
      translate-x-[-120%]
      bg-linear-to-r from-transparent via-white/20 to-transparent
      transition-transform duration-700 ease-out
      group-hover:translate-x-[120%]
    "
                        />

                        {/* Content — ALWAYS on top */}
                        <span className="relative z-10">View All Articles</span>

                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            className="relative z-10 transition-transform duration-300 group-hover:translate-x-0.5"
                        >
                            <path
                                d="M5 12h12M13 6l6 6-6 6"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </Link>
                </div>
            </Container>
        </section>
    );
}
