"use client";

import Link from "next/link";
import Container from "../ui/Container";
import { motion, type Variants } from "framer-motion";
import { useEffect, useState } from "react";

type BlogPost = {
  id: string;
  title: string;
  category: string;
  dateISO: string;
  cover: string;
  href: string;
};

const parent: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.22,
      delayChildren: 0.12,
    },
  },
};

const card: Variants = {
  hidden: { opacity: 0, x: 40, y: 10 },
  show: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
};

function formatDate(dateISO: string) {
  if (!dateISO) return "";
  const d = new Date(dateISO);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export default function LatestBlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function loadLatestBlogs() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const res = await fetch(
          `${baseUrl}/api/v1/content/blog/latest?limit=3`,
          { signal: controller.signal }
        );

        if (!res.ok) throw new Error("Failed to load blogs");

        const data = await res.json();
        setPosts(data.items || []);
      } catch (err) {
        // Ignore abort errors (e.g. React Strict Mode double-run in dev)
        if ((err as any)?.name === "AbortError") return;
        console.error("Latest blog fetch failed", err);
      } finally {
        setLoading(false);
      }
    }

    loadLatestBlogs();
    return () => controller.abort();
  }, []);

  if (loading || posts.length === 0) return null;

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
              key={p.id}
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
                  src={p.cover}
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
                    {p.category}
                  </span>

                  <span className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500">
                    {formatDate(p.dateISO)}
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
              transition-all duration-300
              hover:-translate-y-0.5
              hover:scale-[1.015]
              hover:bg-gray-600
            "
          >
            View All Articles
          </Link>
        </div>
      </Container>
    </section>
  );
}
