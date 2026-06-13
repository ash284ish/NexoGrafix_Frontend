"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiSearch, FiSliders, FiCalendar, FiBriefcase, FiTag, FiBookOpen } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";

type Category = { id: number; name: string; slug: string };
type Industry = { id: number; name: string; slug: string };

type Sample = {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  featured_image: string | null;
  status: string;
  visibility: string;
  tags: string[] | null;
  views: number;
  downloads: number;
  categories: Category[];
  industries: Industry[];
  created_at: string;
};

const pageWrap = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.45, ease: "easeOut" } },
};

const cardWave = {
  hidden: { opacity: 0, y: 15, scale: 0.98 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut", delay: i * 0.05 },
  }),
  exit: { opacity: 0, scale: 0.97, transition: { duration: 0.2 } },
};

export default function PublicSamplesListingPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

  const [samples, setSamples] = useState<Sample[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState("");
  const [selCategory, setSelCategory] = useState("");
  const [selIndustry, setSelIndustry] = useState("");
  const [sort, setSort] = useState("newest"); // newest, oldest, alphabetical

  const loadListingData = async () => {
    try {
      setLoading(true);
      const [samplesRes, catsRes, indsRes] = await Promise.all([
        fetch(`${API_BASE}/api/v1/samples`),
        fetch(`${API_BASE}/api/v1/samples/categories`),
        fetch(`${API_BASE}/api/v1/samples/industries`),
      ]);

      if (samplesRes.ok) {
        const data = await samplesRes.json();
        setSamples(data);
      }
      if (catsRes.ok) {
        const data = await catsRes.json();
        setCategories(data);
      }
      if (indsRes.ok) {
        const data = await indsRes.json();
        setIndustries(data);
      }
    } catch (e) {
      console.error("Error loading samples directory:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadListingData();
  }, []);

  // Filter and sort clientside for super fast real-time feedback
  const filteredSamples = useMemo(() => {
    let out = [...samples];

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      out = out.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.short_description.toLowerCase().includes(q) ||
          s.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (selCategory) {
      out = out.filter((s) => s.categories.some((c) => c.slug === selCategory));
    }

    if (selIndustry) {
      out = out.filter((s) => s.industries.some((ind) => ind.slug === selIndustry));
    }

    if (sort === "oldest") {
      out.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    } else if (sort === "alphabetical") {
      out.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      out.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return out;
  }, [samples, search, selCategory, selIndustry, sort]);

  return (
    <motion.section
      variants={pageWrap}
      initial="hidden"
      animate="show"
      className="relative overflow-hidden bg-slate-50/50 py-16 lg:py-24"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 h-130 w-130 rounded-full bg-orange-500/5 blur-3xl" />
        <div className="absolute top-20 right-0 h-150 w-150 rounded-full bg-orange-300/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-orange-600">
            <FiBookOpen /> Sample Library
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
            Explore Our Work Samples
          </h1>
          <p className="text-base text-slate-600 leading-relaxed font-medium">
            Browse our case studies and work deliverables to see how Nexografix provides best-in-class content, localization, and accessibility services.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="mt-12 rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-4">
            {/* Search Input */}
            <div className="relative md:col-span-2">
              <FiSearch className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by keywords or tags..."
                className="w-full rounded-md border border-slate-200 pl-10 pr-4 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200/50"
              />
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selCategory}
                onChange={(e) => setSelCategory(e.target.value)}
                className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-orange-500 bg-white"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Industry Filter */}
            <div>
              <select
                value={selIndustry}
                onChange={(e) => setSelIndustry(e.target.value)}
                className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-orange-500 bg-white"
              >
                <option value="">All Industries</option>
                {industries.map((ind) => (
                  <option key={ind.id} value={ind.slug}>
                    {ind.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between border-t border-slate-100 pt-4 gap-4">
            {/* Results Count */}
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Showing {filteredSamples.length} work samples
            </div>

            {/* Sorting */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Sort By:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-md border border-slate-200 px-2 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-orange-500 bg-white"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="alphabetical">Alphabetical</option>
              </select>
            </div>
          </div>
        </div>

        {/* Samples Grid */}
        <div className="mt-10">
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-lg border border-slate-200 bg-white p-5 animate-pulse space-y-4">
                  <div className="aspect-16/10 rounded bg-slate-200" />
                  <div className="h-4 w-24 rounded bg-slate-200" />
                  <div className="h-6 w-48 rounded bg-slate-200" />
                  <div className="h-4 w-full rounded bg-slate-200" />
                </div>
              ))}
            </div>
          ) : filteredSamples.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-16 text-center text-slate-500">
              No samples matched your filters. Try clearing your filters or changing search keywords.
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence>
                {filteredSamples.map((s, idx) => {
                  const imageSrc = s.featured_image || "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=500&q=80";
                  return (
                    <motion.div
                      key={s.id}
                      custom={idx}
                      variants={cardWave}
                      initial="hidden"
                      animate="show"
                      exit="exit"
                      className="group flex flex-col rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition duration-300"
                    >
                      {/* Image Thumbnail */}
                      <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100">
                        <Image
                          src={imageSrc}
                          alt={s.title}
                          fill
                          unoptimized
                          className="object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      </div>

                      {/* Content Card Body */}
                      <div className="p-6 flex flex-col flex-1">
                        {/* Primary Category Tag */}
                        <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-extrabold tracking-wider text-orange-600 uppercase">
                          <FiTag /> {s.categories[0]?.name || "Case Study"}
                        </div>

                        {/* Title */}
                        <h3 className="mt-3 text-lg font-extrabold text-slate-900 leading-snug group-hover:text-orange-600 transition">
                          <Link href={`/samples/${s.slug}`}>{s.title}</Link>
                        </h3>

                        {/* Short Description */}
                        <p className="mt-2.5 text-sm font-semibold text-slate-600 leading-relaxed flex-1 line-clamp-3">
                          {s.short_description}
                        </p>

                        {/* Tags */}
                        {s.tags && s.tags.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-1.5">
                            {s.tags.slice(0, 3).map((t) => (
                              <span key={t} className="rounded bg-slate-50 border border-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">
                                #{t}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Footer Action */}
                        <div className="mt-6 border-t border-slate-100 pt-4 flex items-center justify-between">
                          <div className="flex gap-3 text-[11px] font-bold text-slate-400">
                            <span className="flex items-center gap-1"><FiSearch /> {s.views} views</span>
                          </div>
                          <Link
                            href={`/samples/${s.slug}`}
                            className="inline-flex items-center gap-1 text-xs font-extrabold text-orange-600 hover:text-orange-700 hover:underline"
                          >
                            View Details &rarr;
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
}
