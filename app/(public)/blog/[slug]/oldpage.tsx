"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { FiSearch, FiShare2, FiHeart, FiMessageCircle } from "react-icons/fi";

type BlogDetailsPayload = {
  meta?: { title?: string };
  assets?: { fallback_cover?: string };
  posts: BlogPost[];
};

type BlogPost = {
  id: string;
  title: string;
  category: string;
  dateISO: string;
  readTime: string;
  cover: string;
  excerpt: string;
  slug: string;
  images: string[];
  tags: string[];
  author?: string;
  stats?: { comments?: number; likes?: number; shares?: number };
  content?: {
    intro?: string[];
    quote?: { text?: string; author?: string };
    sections?: Array<{ heading?: string; bullets?: string[] }>;
  };
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" });
}
function cx(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

const glassCard =
  "bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(255,255,255,0.92))] backdrop-blur";
const glassSoft =
  "bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(249,250,251,0.92))] backdrop-blur";
const glassPill = "bg-white/90";

const pageWrap: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const stagger: Variants = {
  hidden: { opacity: 1 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.06 } },
};

const itemUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const cardIn: Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.99 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

function CardShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.div
      variants={cardIn}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.18 }}
      className={cx("rounded-md border border-black/10 p-6", glassCard, "shadow-[0_18px_60px_rgba(15,23,42,0.08)]")}
    >
      <div className="text-base font-extrabold text-[var(--color-text-main)]">{title}</div>
      <div className="mt-3 h-px w-full bg-black/10" />
      <div className="mt-4">{children}</div>
    </motion.div>
  );
}

function SmartHeroImage({
  src,
  alt,
  priority,
  fallbackSrc,
}: {
  src?: string;
  alt: string;
  priority?: boolean;
  fallbackSrc: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [err, setErr] = useState(false);

  const safeSrc = err ? fallbackSrc : src || fallbackSrc;

  return (
    <div className="relative aspect-[16/8] w-full overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(249,115,22,0.14),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(15,23,42,0.08),transparent_55%),linear-gradient(180deg,rgba(255,255,255,0.9),rgba(249,250,251,0.95))]" />

      <Image
        src={safeSrc}
        alt={alt}
        fill
        unoptimized
        priority={!!priority}
        sizes="(max-width: 1024px) 100vw, 860px"
        className={cx("object-contain transition-opacity duration-500", loaded ? "opacity-100" : "opacity-0")}
        onLoad={() => setLoaded(true)}
        onError={() => {
          setErr(true);
          setLoaded(true);
        }}
      />

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(15,23,42,0.52),transparent_58%)]" />

      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-md border border-white/30 bg-black/20 px-3 py-2 text-[11px] font-extrabold tracking-[0.16em] text-white backdrop-blur">
            LOADING
          </div>
        </div>
      )}
    </div>
  );
}

export default function BlogDetailsPage() {
  const params = useParams();
  const slug = String(params?.slug || "");

  const [payload, setPayload] = useState<BlogDetailsPayload | null>(null);
  const [loadErr, setLoadErr] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoadErr(false);
        const res = await fetch(`${API_BASE}/api/v1/content/blog-details`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load blog details");
        const json = (await res.json()) as BlogDetailsPayload;
        if (alive) setPayload(json);
      } catch (e) {
        console.error(e);
        if (alive) setLoadErr(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const POSTS = payload?.posts ?? [];
  const fallbackCover = payload?.assets?.fallback_cover || "/images/blog_fallback.jpg";

  const post = useMemo(() => POSTS.find((p) => p.slug === slug), [POSTS, slug]);
  if (payload && !post) notFound();

  const recentPosts = useMemo(() => POSTS.filter((p) => p.slug !== slug).slice(0, 5), [POSTS, slug]);

  const categories = useMemo(() => {
    const map = new Map<string, number>();
    POSTS.forEach((p) => map.set(p.category, (map.get(p.category) || 0) + 1));
    return Array.from(map.entries());
  }, [POSTS]);

  const [search, setSearch] = useState("");

  const filteredRecent = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return recentPosts;
    return recentPosts.filter((r) => (r.title || "").toLowerCase().includes(q));
  }, [recentPosts, search]);

  const hero = post?.images?.[0] || post?.cover;
  const img2 = post?.images?.[1];
  const img3 = post?.images?.[2];

  const statPill = cx(
    "inline-flex items-center gap-2 rounded-md border border-black/10 px-3 py-2",
    glassPill,
    "text-xs font-extrabold text-[var(--color-text-main)] shadow-sm"
  );

  const inputBase =
    "w-full rounded-md border border-black/10 bg-white/90 px-4 py-3 text-sm font-semibold text-[var(--color-text-main)] outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200/50 placeholder:text-[var(--color-text-muted)]";

  const inViewOnce = { initial: "hidden" as const, whileInView: "show" as const, viewport: { once: true, amount: 0.18 } };

  if (!payload && !loadErr) {
    return (
      <motion.section variants={pageWrap} initial="hidden" animate="show" className="relative overflow-hidden bg-white">
        <div className="relative mx-auto max-w-7xl px-6 py-14">
          <div className={cx("rounded-md border border-black/10 p-8", glassCard, "shadow-[0_18px_60px_rgba(15,23,42,0.08)]")}>
            <div className="text-sm font-extrabold tracking-[0.16em] text-[var(--color-text-main)]">LOADING BLOG…</div>
            <div className="mt-3 text-sm font-semibold text-[var(--color-text-muted)]">Fetching blog details content.</div>
          </div>
        </div>
      </motion.section>
    );
  }

  if (loadErr) {
    return (
      <motion.section variants={pageWrap} initial="hidden" animate="show" className="relative overflow-hidden bg-white">
        <div className="relative mx-auto max-w-7xl px-6 py-14">
          <div className={cx("rounded-md border border-black/10 p-8", glassCard, "shadow-[0_18px_60px_rgba(15,23,42,0.08)]")}>
            <div className="text-sm font-extrabold tracking-[0.16em] text-[var(--color-text-main)]">FAILED TO LOAD</div>
            <div className="mt-3 text-sm font-semibold text-[var(--color-text-muted)]">
              Please check <span className="font-extrabold">{API_BASE}</span> and the route{" "}
              <span className="font-extrabold">/content/blog-details</span>.
            </div>
            <div className="mt-6">
              <Link href="/blog" className="font-extrabold text-[var(--color-brand-dark)] hover:underline">
                ← Back to Blog
              </Link>
            </div>
          </div>
        </div>
      </motion.section>
    );
  }

  if (!post) return null;

  const author = post.author || "admin";
  const comments = post.stats?.comments ?? 0;
  const likes = post.stats?.likes ?? 0;
  const shares = post.stats?.shares ?? 0;

  return (
    <motion.section variants={pageWrap} initial="hidden" animate="show" className="relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-56 left-[-260px] h-[620px] w-[620px] rounded-full bg-orange-300/12 blur-3xl" />
        <div className="absolute top-[120px] right-[-280px] h-[680px] w-[680px] rounded-full bg-orange-400/10 blur-3xl" />
        <div className="absolute bottom-[-280px] left-[22%] h-[640px] w-[640px] rounded-full bg-orange-200/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.03)_100%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-14">
        <motion.div variants={itemUp} {...inViewOnce} className="mb-6">
          <nav className="flex flex-wrap items-center gap-2 text-sm font-semibold text-[var(--color-text-muted)]">
            <Link href="/" className="rounded-md px-2 py-1.5 transition hover:bg-black/5 hover:text-[var(--color-text-main)]">
              Home
            </Link>
            <span className="text-black/30">/</span>
            <Link href="/blog" className="rounded-md px-2 py-1.5 transition hover:bg-black/5 hover:text-[var(--color-text-main)]">
              Blogs
            </Link>
            <span className="text-black/30">/</span>
            <span className={cx("max-w-[70ch] truncate rounded-md border border-black/10 px-2 py-1.5", glassPill, "text-[var(--color-text-main)]")}>
              {post.title}
            </span>
          </nav>
        </motion.div>

        <motion.div variants={stagger} initial="hidden" animate="show" className="grid gap-10 lg:grid-cols-[1fr_360px]">
          <div className="min-w-0">
            <motion.div
              variants={itemUp}
              {...inViewOnce}
              className={cx("relative overflow-hidden rounded-md border border-black/10", glassSoft, "shadow-[0_26px_90px_rgba(15,23,42,0.10)]")}
            >
              <SmartHeroImage src={hero} alt={post.title} priority fallbackSrc={fallbackCover} />

              <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-md border border-white/25 bg-black/25 px-3 py-2 text-xs font-extrabold tracking-[0.12em] text-white backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-[var(--color-brand)]" />
                {post.category}
              </div>

              <div className={cx("border-t border-black/10 px-6 py-5", glassCard)}>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                  <div className="min-w-0">
                    <motion.h1 variants={itemUp} {...inViewOnce} className="text-3xl font-extrabold leading-tight text-[var(--color-text-main)] sm:text-4xl">
                      {post.title}
                    </motion.h1>

                    <motion.p variants={itemUp} {...inViewOnce} className="mt-3 max-w-2xl text-sm font-semibold leading-relaxed text-[var(--color-text-muted)]">
                      {post.excerpt}
                    </motion.p>

                    <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-semibold text-[var(--color-text-muted)]">
                      <span className={cx("rounded-md border border-black/10 px-3 py-1.5 font-extrabold text-[var(--color-text-main)]", glassPill)}>
                        by {author}
                      </span>
                      <span className="text-black/20">•</span>
                      <span>{formatDate(post.dateISO)}</span>
                      <span className="text-black/20">•</span>
                      <span className="font-extrabold">{post.readTime}</span>
                    </div>
                  </div>

                  <motion.div variants={itemUp} {...inViewOnce} className="flex flex-wrap items-center gap-2">
                    <span className={statPill}>
                      <FiMessageCircle /> {comments}
                    </span>
                    <span className={statPill}>
                      <FiHeart /> {likes}
                    </span>
                    <span className={statPill}>
                      <FiShare2 /> {shares}
                    </span>
                  </motion.div>
                </div>
              </div>

              <div className={cx("px-6 pb-8 pt-7", glassSoft)}>
                <motion.div variants={itemUp} {...inViewOnce} className="space-y-5 text-[15px] font-semibold leading-relaxed text-[var(--color-text-muted)]">
                  {(post.content?.intro ?? []).map((p, idx) => (
                    <p key={`intro-${idx}`}>{p}</p>
                  ))}
                </motion.div>

                {(post.content?.quote?.text || "").trim() ? (
                  <motion.blockquote
                    variants={itemUp}
                    {...inViewOnce}
                    className={cx("mt-8 rounded-md border border-black/10 p-6 shadow-[0_18px_55px_rgba(15,23,42,0.08)]", glassCard)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-5xl font-extrabold leading-none text-[var(--color-brand)]">“</div>
                      <div className="min-w-0">
                        <div className="text-[15px] font-extrabold leading-relaxed text-[var(--color-text-main)]">
                          {post.content?.quote?.text}
                        </div>
                        <div className="mt-4 flex items-center gap-3">
                          <div className="h-[2px] w-10 bg-[var(--color-brand)]" />
                          <div className="text-sm font-extrabold text-[var(--color-brand-dark)]">
                            {post.content?.quote?.author || "Nexografix"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.blockquote>
                ) : null}

                {img2 ? (
                  <motion.div variants={itemUp} {...inViewOnce} className="mt-10 grid gap-7 lg:grid-cols-[360px_1fr] lg:items-start">
                    <div className={cx("overflow-hidden rounded-md border border-black/10 shadow-[0_18px_55px_rgba(15,23,42,0.08)]", glassCard)}>
                      <div className="relative aspect-[16/12] w-full">
                        <Image
                          src={img2}
                          alt="Blog image 2"
                          fill
                          unoptimized
                          className="object-contain"
                          sizes="360px"
                          onError={(e) => {
                            const t = e.currentTarget as unknown as HTMLImageElement;
                            if (t?.src && !t.src.includes(fallbackCover)) t.src = fallbackCover;
                          }}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      {(post.content?.sections ?? []).slice(0, 1).map((s, idx) => (
                        <div key={`s1-${idx}`}>
                          {s.heading ? (
                            <div className="text-[15px] font-extrabold text-[var(--color-text-main)]">{s.heading}</div>
                          ) : null}
                          <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px] font-semibold leading-relaxed text-[var(--color-text-muted)]">
                            {(s.bullets ?? []).map((b, bi) => (
                              <li key={`b1-${bi}`}>{b}</li>
                            ))}
                          </ul>
                        </div>
                      ))}

                      <div className="mt-4 flex flex-wrap gap-2">
                        {(post.tags ?? []).slice(0, 6).map((t) => (
                          <span key={t} className={cx("rounded-md border border-black/10 px-3 py-1.5 text-xs font-extrabold text-[var(--color-text-main)]", glassPill)}>
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ) : null}

                {img3 ? (
                  <motion.div variants={itemUp} {...inViewOnce} className={cx("mt-10 overflow-hidden rounded-md border border-black/10 shadow-[0_18px_55px_rgba(15,23,42,0.08)]", glassCard)}>
                    <div className="relative aspect-[16/7] w-full">
                      <Image
                        src={img3}
                        alt="Blog image 3"
                        fill
                        unoptimized
                        className="object-contain"
                        sizes="(max-width: 1024px) 100vw, 860px"
                        onError={(e) => {
                          const t = e.currentTarget as unknown as HTMLImageElement;
                          if (t?.src && !t.src.includes(fallbackCover)) t.src = fallbackCover;
                        }}
                      />
                    </div>
                  </motion.div>
                ) : null}

                <motion.div variants={itemUp} {...inViewOnce} className="mt-10 space-y-8">
                  {(post.content?.sections ?? []).slice(img2 ? 1 : 0).map((s, idx) => (
                    <div key={`sec-${idx}`} className={cx("rounded-md border border-black/10 p-6 shadow-[0_18px_55px_rgba(15,23,42,0.06)]", glassCard)}>
                      {s.heading ? (
                        <div className="text-[15px] font-extrabold text-[var(--color-text-main)]">{s.heading}</div>
                      ) : null}
                      <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px] font-semibold leading-relaxed text-[var(--color-text-muted)]">
                        {(s.bullets ?? []).map((b, bi) => (
                          <li key={`b-${idx}-${bi}`}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </motion.div>

                <motion.div variants={itemUp} {...inViewOnce} className="mt-10 flex flex-col gap-4 border-t border-black/10 pt-6 sm:flex-row sm:items-center">
                  <div className="text-xs font-extrabold tracking-[0.18em] text-[var(--color-text-main)]">TAGS</div>
                  <div className="flex flex-wrap gap-2">
                    {(post.tags ?? []).map((t) => (
                      <span key={t} className={cx("rounded-md border border-black/10 px-3 py-1.5 text-xs font-extrabold text-[var(--color-text-main)]", glassPill)}>
                        {t}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>

            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 text-sm font-semibold text-[var(--color-text-muted)]">
              <Link href="/blog" className="font-extrabold text-[var(--color-brand-dark)] hover:underline">
                ← Back to Blog
              </Link>
              <div className="font-extrabold">{post.readTime}</div>
            </div>
          </div>

          <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
            <CardShell title="Search">
              <div className="flex items-center gap-3">
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search here..." className={inputBase} />
                <button className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-[var(--color-brand)] text-white shadow-sm transition hover:bg-[var(--color-brand-dark)]">
                  <FiSearch />
                </button>
              </div>
            </CardShell>

            <CardShell title="Category">
              <div className="space-y-2">
                {categories.map(([name, count]) => (
                  <div
                    key={name}
                    className="flex items-center justify-between rounded-md border border-transparent px-1.5 py-2 text-sm font-semibold text-[var(--color-text-muted)] transition hover:border-black/10 hover:bg-black/5"
                  >
                    <span className="inline-flex items-center gap-2">
                      <span className="text-black/40">›</span> {name}
                    </span>
                    <span className="font-extrabold text-[var(--color-text-main)]">({count})</span>
                  </div>
                ))}
              </div>
            </CardShell>

            <CardShell title="Recent Posts">
              <div className="space-y-2">
                <AnimatePresence mode="popLayout">
                  {filteredRecent.map((r, i) => (
                    <motion.div
                      key={r.slug}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
                      viewport={{ once: true, amount: 0.2 }}
                      exit={{ opacity: 0 }}
                    >
                      <Link
                        href={`/blog/${r.slug}`}
                        className="block rounded-md border border-transparent px-2 py-2 text-sm font-semibold text-[var(--color-text-muted)] transition hover:border-black/10 hover:bg-black/5 hover:text-[var(--color-text-main)]"
                      >
                        <span className="mr-2 text-black/40">›</span>
                        {r.title}
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </CardShell>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
