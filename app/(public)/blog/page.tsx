"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { resolveImageUrl } from "@/lib/apiUrl";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { FiArrowLeft, FiArrowRight, FiSearch, FiTag, FiSliders } from "react-icons/fi";

type BlogPost = {
  id: string;
  title: string;
  category: string;
  dateISO: string;
  readTime: string;
  cover: string;
  excerpt: string;
  slug: string;
};

type BlogMeta = {
  title?: string;
};

type BlogHero = {
  badge?: string;
  title?: string;
  subtitle?: string;
};

type BlogFilters = {
  search_placeholder?: string;
  default_category?: string;
  default_sort?: "newest" | "oldest" | "title";
  sort_options?: Array<{ value: "newest" | "oldest" | "title"; label: string }>;
  sidebar_title?: string;
  reset_label?: string;
  labels?: {
    search?: string;
    category?: string;
    sort?: string;
  };
};

type BlogPagination = {
  page_size?: number;
  empty_text?: string;
  page_label_prefix?: string;
  page_label_middle?: string;
};

type BlogCTA = {
  read_article_label?: string;
  read_article_suffix?: string;
  read_article_base_href?: string;
};

type BlogAssets = {
  fallback_cover?: string;
};

type BlogContent = {
  meta?: BlogMeta;
  hero?: BlogHero;
  filters?: BlogFilters;
  pagination?: BlogPagination;
  cta?: BlogCTA;
  assets?: BlogAssets;
  posts: BlogPost[];
};

function cx(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" });
}

const pageWrap: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

const cardWave = {
  hidden: { opacity: 0, y: 18, scale: 0.985, filter: "blur(2px)" },
  show: (custom: { i: number; cols: number }) => {
    const row = Math.floor(custom.i / custom.cols);
    const col = custom.i % custom.cols;
    const delay = (row + col) * 0.06;
    return {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay },
    };
  },
  exit: { opacity: 0, y: 10, scale: 0.98, transition: { duration: 0.2, ease: "easeOut" } },
} satisfies Variants;

function BlogCover({
  src,
  alt,
  priority,
  fallbackSrc,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  fallbackSrc?: string;
}) {
  const [err, setErr] = useState(false);
  const safeSrc = !src || err ? resolveImageUrl(fallbackSrc) || "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1000&q=80" : resolveImageUrl(src);

  const [prevSrc, setPrevSrc] = useState(src);
  if (src !== prevSrc) {
    setPrevSrc(src);
    setErr(false);
  }

  return (
    <div className="relative aspect-16/10 overflow-hidden rounded-md border border-[rgba(24,24,27,0.12)] bg-white">
      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/15 via-transparent to-transparent" />

      <Image
        src={safeSrc}
        alt={alt}
        fill
        priority={!!priority}
        className={cx("object-contain transition-transform duration-500", "group-hover:scale-[1.03]")}
        onError={() => setErr(true)}
      />
    </div>
  );
}

export default function BlogPage() {
  const [data, setData] = useState<BlogContent | null>(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/content/blog`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to load blog content");
        const json = (await res.json()) as BlogContent;
        if (alive) setData(json);
      } catch (e) {
        console.error(e);
        if (alive) setData({ posts: [] });
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  // Optional: meta title from JSON (safe)
  useEffect(() => {
    const t = data?.meta?.title;
    if (t) document.title = t;
  }, [data]);

  const POSTS = data?.posts ?? [];

  // Page size from JSON (fallback to 9)
  const PAGE_SIZE = data?.pagination?.page_size && data.pagination.page_size > 0 ? data.pagination.page_size : 9;

  const categories = useMemo(() => {
    const set = new Set(POSTS.map((p) => (p.category || "").trim()).filter(Boolean));
    const defaultCat = (data?.filters?.default_category || "All").trim();
    return [defaultCat || "All", ...Array.from(set).filter((x) => x.toLowerCase() !== (defaultCat || "all").toLowerCase())];
  }, [POSTS, data]);

  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [sort, setSort] = useState<"newest" | "oldest" | "title">("newest");
  const [page, setPage] = useState(1);

  // Apply defaults from JSON once data loads (without breaking existing behavior)
  useEffect(() => {
    if (!data) return;

    const defaultCat = (data.filters?.default_category || "All").trim() || "All";
    const defaultSort = data.filters?.default_sort || "newest";

    setCat(defaultCat);
    setSort(defaultSort);
    setPage(1);
  }, [data]);

  const filtered = useMemo(() => {
    let items = [...POSTS];

    const catNorm = (cat || "").trim().toLowerCase();
    const allNorm = (data?.filters?.default_category || "All").trim().toLowerCase() || "all";

    if (catNorm !== allNorm) {
      items = items.filter((p) => (p.category || "").trim().toLowerCase() === catNorm);
    }

    const query = q.trim().toLowerCase();
    if (query) {
      items = items.filter((p) => {
        const t = (p.title || "").toLowerCase();
        const e = (p.excerpt || "").toLowerCase();
        const c = (p.category || "").toLowerCase();
        return t.includes(query) || e.includes(query) || c.includes(query);
      });
    }

    if (sort === "newest") items.sort((a, b) => +new Date(b.dateISO) - +new Date(a.dateISO));
    if (sort === "oldest") items.sort((a, b) => +new Date(a.dateISO) - +new Date(b.dateISO));
    if (sort === "title") items.sort((a, b) => (a.title || "").localeCompare(b.title || ""));

    return items;
  }, [POSTS, q, cat, sort, data]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  useEffect(() => {
    setPage((p) => Math.min(Math.max(1, p), totalPages));
  }, [totalPages]);

  useEffect(() => {
    setPage(1);
  }, [q, cat, sort]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page, PAGE_SIZE]);

  const pageNumbers = useMemo(() => {
    const max = 5;
    if (totalPages <= max) return Array.from({ length: totalPages }, (_, i) => i + 1);

    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, start + 4);
    const adjustedStart = Math.max(1, end - 4);
    return Array.from({ length: end - adjustedStart + 1 }, (_, i) => adjustedStart + i);
  }, [page, totalPages]);

  const showPagination = pageItems.length > 0;
  const cols = 3;

  // JSON-driven texts with safe fallbacks (no UI change)
  const heroBadge = data?.hero?.badge ?? "BLOG";
  const heroTitle = data?.hero?.title ?? "Insights that improve delivery.";
  const heroSubtitle =
    data?.hero?.subtitle ??
    "Actionable reads on AI-enabled publishing, content workflows, automation, and product engineering.";

  const sidebarTitle = data?.filters?.sidebar_title ?? "Filters";
  const resetLabel = data?.filters?.reset_label ?? "Reset";

  const labelSearch = data?.filters?.labels?.search ?? "SEARCH";
  const labelCategory = data?.filters?.labels?.category ?? "CATEGORY";
  const labelSort = data?.filters?.labels?.sort ?? "SORT";

  const searchPlaceholder = data?.filters?.search_placeholder ?? "Search posts...";

  const emptyText = data?.pagination?.empty_text ?? "No posts found for current filters.";

  const sortOptions =
    data?.filters?.sort_options?.length
      ? data.filters.sort_options
      : [
          { value: "newest", label: "Newest first" },
          { value: "oldest", label: "Oldest first" },
          { value: "title", label: "Title (A–Z)" },
        ];

  const readLabel = data?.cta?.read_article_label ?? "Read Article";
  const readSuffix = data?.cta?.read_article_suffix ?? "→";

  const fallbackCover = data?.assets?.fallback_cover;

  const pageLabelPrefix = data?.pagination?.page_label_prefix ?? "Page";
  const pageLabelMiddle = data?.pagination?.page_label_middle ?? "of";

  const allLabel = (data?.filters?.default_category || "All").trim() || "All";

  return (
    <motion.section variants={pageWrap} initial="hidden" animate="show" className="relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-28 -left-30 h-105 w-105 rounded-full bg-orange-300/20 blur-3xl" />
        <div className="absolute top-35 -right-40 h-130 w-130 rounded-full bg-orange-400/15 blur-3xl" />
        <div className="absolute -bottom-45 left-[20%] h-130 w-130 rounded-full bg-orange-200/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-16">
        <motion.div initial="hidden" animate="show" variants={fadeUp} className="text-center">
          <div className="flex justify-center">
            <span className="inline-flex items-center rounded-full border border-orange-200/70 bg-white px-4 py-2 text-xs font-extrabold tracking-[0.26em] text-(--color-brand) shadow-sm">
              {heroBadge}
            </span>
          </div>

          <h1 className="mx-auto mt-5 max-w-4xl text-4xl font-extrabold leading-[1.08] text-(--color-text-main) sm:text-6xl">
            {heroTitle}
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base font-semibold leading-relaxed text-(--color-text-main)/70">
            {heroSubtitle}
          </p>
        </motion.div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_340px] lg:items-start">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {data === null ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="rounded-md border border-[rgba(24,24,27,0.12)] bg-white p-8 text-sm font-semibold text-(--color-text-muted) sm:col-span-2 lg:col-span-3"
                >
                  Loading posts...
                </motion.div>
              ) : pageItems.length ? (
                pageItems.map((post, idx) => (
                  <motion.article
                    key={post.id}
                    layout
                    variants={cardWave}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    custom={{ i: idx, cols }}
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="group flex h-full flex-col overflow-hidden rounded-md border border-[rgba(24,24,27,0.12)] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)]"
                  >
                    <div className="p-4">
                      <BlogCover
                        src={post.cover}
                        alt={post.title}
                        priority={page === 1 && idx < 3}
                        fallbackSrc={fallbackCover}
                      />
                    </div>

                    <div className="flex flex-1 flex-col px-6 pb-6">
                      <div className="mt-1 flex min-h-4.5 flex-wrap items-center gap-x-2 gap-y-1 text-xs font-extrabold tracking-widest">
                        <span className="text-(--color-brand)">{post.category}</span>
                        <span className="text-(--color-text-muted)">•</span>
                        <span className="text-(--color-text-muted)">{formatDate(post.dateISO)}</span>
                        <span className="text-(--color-text-muted)">•</span>
                        <span className="text-(--color-text-muted)">{post.readTime}</span>
                      </div>

                      <h3 className="mt-3 line-clamp-2 text-lg font-extrabold leading-snug text-(--color-text-main)">
                        {post.title}
                      </h3>

                      <p className="mt-2 line-clamp-3 text-sm font-semibold leading-relaxed text-(--color-text-muted)">
                        {post.excerpt}
                      </p>

                      <div className="mt-auto pt-5">
                        <Link
                          href={{
                            pathname: `/blog/${post.slug}`,
                            query: { blog_id: post.id },
                          }}
                          className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-[rgba(249,115,22,0.22)] bg-orange-50/50 px-4 py-3 text-sm font-extrabold text-(--color-brand-dark) transition hover:-translate-y-0.5 hover:bg-orange-100/60"
                        >
                          {readLabel} <span aria-hidden>{readSuffix}</span>
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                ))
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="rounded-md border border-[rgba(24,24,27,0.12)] bg-white p-8 text-sm font-semibold text-(--color-text-muted) sm:col-span-2 lg:col-span-3"
                >
                  {emptyText}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.aside
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="rounded-md border border-[rgba(24,24,27,0.12)] bg-white p-6 shadow-[0_22px_70px_rgba(15,23,42,0.08)] lg:sticky lg:top-24"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-extrabold text-(--color-text-main)">
                <FiSliders />
                {sidebarTitle}
              </div>
              <button
                type="button"
                onClick={() => {
                  setQ("");
                  setCat(allLabel);
                  setSort(data?.filters?.default_sort ?? "newest");
                  setPage(1);
                }}
                className="cursor-pointer text-xs font-extrabold text-(--color-brand-dark) hover:underline"
              >
                {resetLabel}
              </button>
            </div>

            <div className="mt-4">
              <label className="mb-2 flex items-center gap-2 text-xs font-extrabold tracking-[0.12em] text-(--color-text-muted)">
                <FiSearch />
                {labelSearch}
              </label>
              <input
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setPage(1);
                }}
                placeholder={searchPlaceholder}
                className="w-full rounded-md border border-[rgba(24,24,27,0.12)] bg-white px-4 py-3 text-sm font-semibold text-(--color-text-main) outline-none transition focus:border-orange-400"
              />
            </div>

            <div className="mt-5">
              <label className="mb-2 flex items-center gap-2 text-xs font-extrabold tracking-[0.12em] text-(--color-text-muted)">
                <FiTag />
                {labelCategory}
              </label>

              <div className="flex flex-wrap gap-2">
                {categories.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setCat(c);
                      setPage(1);
                    }}
                    className={cx(
                      "cursor-pointer rounded-md border px-3 py-2 text-xs font-extrabold transition",
                      (c || "").trim().toLowerCase() === (cat || "").trim().toLowerCase()
                        ? "border-[rgba(249,115,22,0.30)] bg-orange-50/70 text-(--color-brand-dark)"
                        : "border-[rgba(24,24,27,0.12)] bg-white text-(--color-text-muted) hover:border-[rgba(249,115,22,0.22)] hover:bg-orange-50/40"
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <label className="mb-2 text-xs font-extrabold tracking-[0.12em] text-(--color-text-muted)">{labelSort}</label>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value as "newest" | "oldest" | "title");
                  setPage(1);
                }}
                className="w-full cursor-pointer appearance-none rounded-md border border-[rgba(24,24,27,0.12)] bg-white px-4 py-3 text-sm font-semibold text-(--color-text-main) outline-none transition focus:border-orange-400"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-6 rounded-md border border-[rgba(24,24,27,0.10)] bg-white p-4 text-xs font-semibold text-(--color-text-muted)">
              Showing{" "}
              <span className="font-extrabold text-(--color-text-main)">{pageItems.length}</span> of{" "}
              <span className="font-extrabold text-(--color-text-main)">{filtered.length}</span> posts
            </div>
          </motion.aside>
        </div>

        {showPagination && (
          <div className="mt-10 flex items-center justify-between gap-4">
            <div className="text-sm font-semibold text-(--color-text-muted)">
              {pageLabelPrefix} <span className="font-extrabold text-(--color-text-main)">{page}</span>{" "}
              {pageLabelMiddle} <span className="font-extrabold text-(--color-text-main)">{totalPages}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className={cx(
                  "inline-flex h-10 w-10 items-center justify-center rounded-md border transition",
                  page === 1
                    ? "cursor-not-allowed border-[rgba(24,24,27,0.10)] bg-white text-(--color-text-muted) opacity-60"
                    : "border-[rgba(24,24,27,0.12)] bg-white text-(--color-text-main) hover:-translate-y-0.5 hover:border-[rgba(249,115,22,0.22)] hover:bg-orange-50/40"
                )}
                aria-label="Previous page"
              >
                <FiArrowLeft />
              </button>

              {pageNumbers.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPage(n)}
                  className={cx(
                    "h-10 min-w-10 rounded-md border px-3 text-sm font-extrabold transition",
                    n === page
                      ? "border-[rgba(249,115,22,0.30)] bg-orange-50/70 text-(--color-brand-dark)"
                      : "border-[rgba(24,24,27,0.12)] bg-white text-(--color-text-main) hover:-translate-y-0.5 hover:border-[rgba(249,115,22,0.22)] hover:bg-orange-50/40"
                  )}
                >
                  {n}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className={cx(
                  "inline-flex h-10 w-10 items-center justify-center rounded-md border transition",
                  page === totalPages
                    ? "cursor-not-allowed border-[rgba(24,24,27,0.10)] bg-white text-(--color-text-muted) opacity-60"
                    : "border-[rgba(24,24,27,0.12)] bg-white text-(--color-text-main) hover:-translate-y-0.5 hover:border-[rgba(249,115,22,0.22)] hover:bg-orange-50/40"
                )}
                aria-label="Next page"
              >
                <FiArrowRight />
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.section>
  );
}
