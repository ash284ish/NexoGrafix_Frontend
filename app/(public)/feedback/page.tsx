"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { motion, type Variants, useInView } from "framer-motion";
import { FiSend, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { BsStarFill } from "react-icons/bs";
import { BsFillChatQuoteFill } from "react-icons/bs";
import { companyInfo } from "@/data/companyInfo";
import toast, { Toaster } from "react-hot-toast";
import { resolveImageUrl } from "@/lib/apiUrl";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const pageWrap: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.8, ease: EASE } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(12px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)" },
};

const listWrap: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.14,
    },
  },
};

const cardIn: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(12px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)" },
};

const softBg =
  "bg-[radial-gradient(1200px_720px_at_12%_-10%,rgba(255,237,213,0.60),transparent_60%),radial-gradient(980px_560px_at_92%_16%,rgba(254,215,170,0.42),transparent_58%),linear-gradient(180deg,#FFFEFD_0%,#FFFDF8_55%,#FFFEFD_100%)]";

const panelGlass =
  "bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(255,255,255,0.86))] backdrop-blur";

const cardGlass =
  "bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(255,255,255,0.84))] backdrop-blur";

type Service =
  | "Publishing"
  | "Content"
  | "Assessments"
  | "Automation"
  | "Accessibility"
  | "Engineering";

type Feedback = {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  service: Service;
  rating: 1 | 2 | 3 | 4 | 5;
  message: string;
  avatarUrl?: string;
};

type FeedbackContent = {
  meta?: { title?: string };
  filters: Array<"All" | Service>;
  hero: {
    badge: string;
    title: string;
    subtitle: string;
  };
  stats: {
    workflows: number;
    teams: number;
    on_time_percent: number;
  };
  empty_state: {
    title: string;
    subtitle: string;
  };
  form: {
    badge: string;
    title: string;
    subtitle: string;
    points: string[];
    fields: {
      first_name_placeholder: string;
      last_name_placeholder: string;
      role_placeholder: string;
      company_placeholder: string;
      service_placeholder: string;
      rating_placeholder: string;
      message_placeholder: string;
      consent_label: string;
      submit_label: string;
      thank_you_note: string;
    };
    services: Service[];
    ratings: Array<{ value: 1 | 2 | 3 | 4 | 5; label: string }>;
  };
  testimonials: Feedback[];
};

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <BsStarFill
          key={i}
          size={16}
          className={i < rating ? "text-orange-500" : "text-orange-200"}
        />
      ))}
    </div>
  );
}


function InitialsAvatar({ first, last }: { first: string; last: string }) {
  const initials = `${first?.[0] || ""}${last?.[0] || ""}`.toUpperCase();
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-orange-200/55 bg-white/80 text-sm font-extrabold text-slate-700 shadow-sm">
      {initials || "N"}
    </div>
  );
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function getPageNumbers(current: number, total: number) {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: Array<number | "..."> = [1];
  const left = clamp(current - 1, 2, total - 1);
  const right = clamp(current + 1, 2, total - 1);
  if (left > 2) pages.push("...");
  for (let p = left; p <= right; p++) pages.push(p);
  if (right < total - 1) pages.push("...");
  pages.push(total);
  return pages;
}

function useCountUp(target: number, start: boolean, durationMs = 1500) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!start) return;
    let raf = 0;
    const t0 = performance.now();

    const tick = (now: number) => {
      const p = clamp((now - t0) / durationMs, 0, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, start, durationMs]);

  return val;
}

function deriveSentiment(rating: number): "good" | "average" | "bad" {
  if (rating >= 4) return "good";
  if (rating === 3) return "average";
  return "bad";
}

export default function FeedbackPage() {
  const [content, setContent] = useState<FeedbackContent | null>(null);
  const [filter, setFilter] = useState<"All" | Service>("All");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState(""); // user ke liye normal text (optional)
  const [company, setCompany] = useState("");
  const [service, setService] = useState<Service | "">("");
  const [rating, setRating] = useState<1 | 2 | 3 | 4 | 5 | "">("");
  const [message, setMessage] = useState("");
  const [consentPublish, setConsentPublish] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const loadContent = async () => {
    const res = await fetch(`/api/v1/content/feedback`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load feedback content");
    return (await res.json()) as FeedbackContent;
  };

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const json = await loadContent();

        const normalized = {
          ...json,
          testimonials: json.testimonials.map((t: any) => ({
            ...t,
            avatarUrl: t.avatar_url,
          })),
        };

        if (alive) setContent(normalized);

      } catch (e) {
        console.error(e);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const filters = content?.filters?.length
    ? content.filters
    : (["All", "Publishing", "Content", "Assessments", "Automation", "Accessibility", "Engineering"] as const);

  const allTestimonials = content?.testimonials ?? [];

  const PAGE_SIZE = 8;
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (filter === "All") return allTestimonials;
    return allTestimonials.filter((f) => f.service === filter);
  }, [filter, allTestimonials]);

  useEffect(() => setPage(1), [filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = clamp(page, 1, totalPages);

  const pageItems = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, safePage]);

  const pageNumbers = useMemo(() => getPageNumbers(safePage, totalPages), [safePage, totalPages]);

  const statsRef = useRef<HTMLDivElement | null>(null);
  const statsInView = useInView(statsRef, { once: true, amount: 0.35 });

  const workflows = useCountUp(content?.stats?.workflows ?? 120, statsInView, 1600);
  const teams = useCountUp(content?.stats?.teams ?? 48, statsInView, 1600);
  const onTime = useCountUp(content?.stats?.on_time_percent ?? 98, statsInView, 1600);

  const headerRef = useRef<HTMLDivElement | null>(null);
  const headerInView = useInView(headerRef, { once: true, amount: 0.5 });

  const listRef = useRef<HTMLDivElement | null>(null);
  const listInView = useInView(listRef, { once: true, amount: 0.2 });

  const formRef = useRef<HTMLDivElement | null>(null);
  const formInView = useInView(formRef, { once: true, amount: 0.2 });

  const hero = content?.hero;
  const empty = content?.empty_state;
  const form = content?.form;

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setRole("");
    setCompany("");
    setService("");
    setRating("");
    setMessage("");
    setConsentPublish(false);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim() || !service || !rating || !message.trim()) {
      toast.error("Please fill all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      const ratingLabelMap: Record<1 | 2 | 3 | 4 | 5, string> = {
        5: "★★★★★ (5)",
        4: "★★★★☆ (4)",
        3: "★★★☆☆ (3)",
        2: "★★☆☆☆ (2)",
        1: "★☆☆☆☆ (1)",
      };

      const ratingNum = Number(rating) as 1 | 2 | 3 | 4 | 5;

      const payload = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        // role id UI se nahi — sirf text bhejo (optional)
        role: role.trim() || null,
        company: company.trim() || null,
        service,
        rating: ratingNum,
        rating_label: ratingLabelMap[ratingNum],
        message: message.trim(),
        consent_publish: consentPublish,
        sentiment: deriveSentiment(ratingNum),
      };

      const res = await fetch(`/api/v1/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const raw = await res.text();
        console.error("FEEDBACK SUBMIT FAILED:", res.status, raw);

        let msg = `Failed (${res.status})`;
        try {
          const j = JSON.parse(raw);
          if (Array.isArray(j?.detail)) {
            msg = j.detail.map((d: any) => d?.msg).filter(Boolean).join(", ");
          } else if (typeof j?.detail === "string") {
            msg = j.detail;
          } else {
            msg = j?.message || msg;
          }
        } catch {
          msg = raw || msg;
        }
        throw new Error(msg);
      }

      toast.success("Feedback submitted successfully!");
      resetForm();

      try {
        const updated = await loadContent();
        setContent(updated);
      } catch {
        // ignore silently
      }
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.section variants={pageWrap} initial="hidden" animate="show" className={`relative overflow-hidden ${softBg}`}>
      {/* If Toaster already exists in root layout, remove this */}
      <Toaster position="top-right" />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-44 -left-60 h-140 w-140 rounded-full bg-orange-200/16 blur-3xl" />
        <div className="absolute top-35 -right-65 h-160 w-160 rounded-full bg-orange-300/12 blur-3xl" />
        <div className="absolute -bottom-65 left-[12%] h-140 w-140 rounded-full bg-orange-200/14 blur-3xl" />
        <div className="absolute bottom-40 right-[8%] h-80 w-[320px] rounded-full bg-orange-300/10 blur-3xl" />

        <motion.div
          animate={{ y: [0, -10, 0], x: [0, 6, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[7%] top-[12%] h-16 w-16 rounded-full border border-orange-300/30"
        />
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[12%] top-[18%] h-9 w-24 rounded-full bg-orange-200/14"
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
          className="absolute left-[13%] top-[34%] h-12 w-12 rounded-full border border-orange-300/25"
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-16">
        <motion.div
          ref={headerRef}
          variants={listWrap}
          initial="hidden"
          animate={headerInView ? "show" : "hidden"}
          className="text-center"
        >
          <motion.div variants={fadeUp} transition={{ duration: 0.9, ease: EASE }} className="flex justify-center">
            <span className="inline-flex items-center rounded-full border border-orange-200/70 bg-white/80 px-4 py-2 text-xs font-extrabold tracking-[0.22em] text-(--color-brand) shadow-sm backdrop-blur">
              {hero?.badge ?? "TESTIMONIALS"}
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.95, ease: EASE }}
            className="mx-auto mt-5 max-w-4xl text-4xl font-extrabold leading-[1.1] text-(--color-text-main) sm:text-5xl"
          >
            {hero?.title ?? "Trusted by delivery teams worldwide"}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.95, ease: EASE }}
            className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-(--color-text-muted)"
          >
            {hero?.subtitle ?? "Real feedback from publishing, content, assessments, automation, and accessibility workflows."}
          </motion.p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.95, ease: EASE }}
          className={`mt-10 rounded-md border border-orange-200/40 ${panelGlass} px-5 py-5 shadow-[0_18px_80px_rgba(234,88,12,0.10)]`}
        >
          <div className="flex flex-wrap justify-center gap-2">
            {filters.map((f) => {
              const active = filter === f;
              return (
                <motion.button
                  key={f}
                  type="button"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  onClick={() => setFilter(f)}
                  className={[
                    "cursor-pointer rounded-full px-4 py-2 text-xs font-extrabold ring-1 transition",
                    active
                      ? "bg-(--color-brand) text-white ring-orange-600/30 shadow-[0_12px_30px_rgba(249,115,22,0.22)]"
                      : "bg-white/75 text-(--color-text-main) ring-orange-200/45 hover:bg-white",
                  ].join(" ")}
                >
                  {f}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        <div ref={listRef} />

        {pageItems.length > 0 ? (
          <>
            <motion.div
              key={`${filter}-${safePage}`}
              variants={listWrap}
              initial="hidden"
              animate={listInView ? "show" : "hidden"}
              className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-4"
            >
              {pageItems.map((t) => (
                <motion.div
                  key={t.id}
                  variants={cardIn}
                  transition={{ duration: 0.95, ease: EASE }}
                  whileHover={{ y: -6 }}
                  className={[
                    "group relative flex h-full flex-col overflow-hidden rounded-md border",
                    "border-orange-200/40",
                    cardGlass,
                    "p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)]",
                    "hover:shadow-[0_30px_120px_rgba(234,88,12,0.14)] transition-shadow",
                  ].join(" ")}
                >
                  <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <div className="absolute -right-10 -top-12 h-44 w-44 rounded-full bg-orange-200/30 blur-3xl" />
                    <div className="absolute -left-12 -bottom-14 h-52 w-52 rounded-full bg-orange-300/20 blur-3xl" />
                  </div>

                  <div className="absolute right-5 top-5 text-orange-200/70">
                    <BsFillChatQuoteFill size={20} />
                  </div>

                  <div className="relative flex items-center gap-3">
                    {t.avatarUrl ? (
                      <>
                        <img
                          src={encodeURI(resolveImageUrl(t.avatarUrl))}
                          alt={`${t.firstName} ${t.lastName}`}
                          className="h-10 w-10 rounded-full border border-orange-200/55 object-contain"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            const fallback = e.currentTarget.nextElementSibling as HTMLElement | null;
                            if (fallback) fallback.style.display = "flex";
                          }}
                        />
                        <div style={{ display: "none" }}>
                          <InitialsAvatar first={t.firstName} last={t.lastName} />
                        </div>
                      </>
                    ) : (
                      <InitialsAvatar first={t.firstName} last={t.lastName} />
                    )}

                    <div className="min-w-0">
                      {`${t.firstName || ""} ${t.lastName || ""}`.trim() && (
                        <div className="truncate text-sm font-extrabold text-(--color-text-main)">
                          {t.firstName} {t.lastName}
                        </div>
                      )}
                      <div className="truncate text-xs font-semibold text-(--color-text-muted)">{t.role}</div>
                    </div>
                  </div>

                  <div className="relative mt-4">
                    <Stars rating={t.rating} />
                  </div>

                  <p className="relative mt-4 text-sm font-semibold leading-relaxed text-slate-700 whitespace-pre-wrap">{t.message}</p>

                  <div className="relative mt-auto pt-5">
                    <span className="inline-flex items-center rounded-full border border-orange-200/70 bg-white/75 px-3 py-1 text-xs font-extrabold text-(--color-brand-dark)">
                      {t.service}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {totalPages > 1 && (
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.95, ease: EASE }}
                className="mt-10 flex items-center justify-end gap-2"
              >
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                  className={[
                    "inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm font-extrabold transition",
                    safePage === 1
                      ? "cursor-not-allowed border-orange-100 bg-white/40 text-slate-300"
                      : "cursor-pointer border-orange-200/50 bg-white/75 text-(--color-text-main) hover:bg-white",
                  ].join(" ")}
                  aria-label="Previous page"
                >
                  <FiChevronLeft />
                </button>

                {pageNumbers.map((p, idx) =>
                  p === "..." ? (
                    <span key={`dots-${idx}`} className="px-2 text-sm font-extrabold text-slate-400">
                      ...
                    </span>
                  ) : (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPage(p)}
                      className={[
                        "min-w-10 rounded-md border px-3 py-2 text-sm font-extrabold transition",
                        safePage === p
                          ? "cursor-pointer border-orange-200 bg-orange-50/90 text-(--color-brand-dark)"
                          : "cursor-pointer border-orange-200/50 bg-white/75 text-(--color-text-main) hover:bg-white",
                      ].join(" ")}
                    >
                      {p}
                    </button>
                  )
                )}

                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage === totalPages}
                  className={[
                    "inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm font-extrabold transition",
                    safePage === totalPages
                      ? "cursor-not-allowed border-orange-100 bg-white/40 text-slate-300"
                      : "cursor-pointer border-orange-200/50 bg-white/75 text-(--color-text-main) hover:bg-white",
                  ].join(" ")}
                  aria-label="Next page"
                >
                  <FiChevronRight />
                </button>
              </motion.div>
            )}
          </>
        ) : (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.95, ease: EASE }}
            className={`mt-10 rounded-md border border-orange-200/40 ${panelGlass} p-8 text-center shadow-[0_16px_70px_rgba(234,88,12,0.10)]`}
          >
            <div className="text-sm font-extrabold text-(--color-text-main)">
              {empty?.title ?? "No testimonials found"}
            </div>
            <div className="mt-2 text-sm font-semibold text-(--color-text-muted)">
              {empty?.subtitle ?? (
                <>
                  Try selecting another category or switch back to <span className="font-extrabold">All</span>.
                </>
              )}
            </div>
          </motion.div>
        )}

        <div ref={formRef} />

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={formInView ? "show" : "hidden"}
          transition={{ duration: 1.0, ease: EASE }}
          className="mt-20"
        >
          <motion.div
            variants={listWrap}
            initial="hidden"
            animate={formInView ? "show" : "hidden"}
            className={[
              "grid gap-10 rounded-md border border-orange-200/40",
              panelGlass,
              "p-8 shadow-[0_26px_90px_rgba(234,88,12,0.12)]",
              "lg:grid-cols-[1.05fr_0.95fr]",
            ].join(" ")}
          >
            <motion.div variants={cardIn} transition={{ duration: 1.0, ease: EASE }} ref={statsRef}>
              <div className="inline-flex items-center rounded-full border border-orange-200/70 bg-white/75 px-4 py-2 text-xs font-extrabold tracking-[0.22em] text-(--color-brand-dark) shadow-sm">
                {form?.badge ?? "SHARE FEEDBACK"}
              </div>

              <h2 className="mt-4 text-3xl font-extrabold text-(--color-text-main)">
                {form?.title ?? "Help others make confident decisions"}
              </h2>

              <p className="mt-3 text-sm font-semibold leading-relaxed text-(--color-text-muted)">
                {form?.subtitle ??
                  `If you’ve worked with ${companyInfo.name}, we’d appreciate your honest feedback. Your input helps teams evaluate quality, reliability, and delivery standards.`}
              </p>

              <motion.div
                variants={listWrap}
                initial="hidden"
                animate={statsInView ? "show" : "hidden"}
                className="mt-7 grid gap-4 sm:grid-cols-3"
              >
                <motion.div
                  variants={cardIn}
                  transition={{ duration: 0.95, ease: EASE }}
                  className={`rounded-md border border-orange-200/40 ${cardGlass} px-5 py-4 shadow-sm`}
                >
                  <div className="text-3xl font-extrabold text-(--color-text-main)">{workflows}+</div>
                  <div className="mt-1 text-xs font-bold tracking-wide text-(--color-text-muted)">WORKFLOWS DELIVERED</div>
                </motion.div>

                <motion.div
                  variants={cardIn}
                  transition={{ duration: 0.95, ease: EASE }}
                  className={`rounded-md border border-orange-200/40 ${cardGlass} px-5 py-4 shadow-sm`}
                >
                  <div className="text-3xl font-extrabold text-(--color-text-main)">{teams}+</div>
                  <div className="mt-1 text-xs font-bold tracking-wide text-(--color-text-muted)">TEAMS SUPPORTED</div>
                </motion.div>

                <motion.div
                  variants={cardIn}
                  transition={{ duration: 0.95, ease: EASE }}
                  className={`rounded-md border border-orange-200/40 ${cardGlass} px-5 py-4 shadow-sm`}
                >
                  <div className="text-3xl font-extrabold text-(--color-text-main)">{onTime}%</div>
                  <div className="mt-1 text-xs font-bold tracking-wide text-(--color-text-muted)">ON-TIME DELIVERY</div>
                </motion.div>
              </motion.div>

              <motion.div
                variants={listWrap}
                initial="hidden"
                animate={formInView ? "show" : "hidden"}
                className="mt-6 space-y-3"
              >
                {(form?.points?.length
                  ? form.points
                  : [
                    "Short, clean form — no unnecessary fields",
                    "Optional publish permission — you stay in control",
                    "Helps future teams evaluate faster and more confidently",
                    "We may reach out if we need clarification (optional)",
                  ]
                ).map((s) => (
                  <motion.div
                    key={s}
                    variants={cardIn}
                    transition={{ duration: 0.95, ease: EASE }}
                    className={`rounded-md border border-orange-200/40 ${cardGlass} px-4 py-3 text-sm font-semibold text-(--color-text-main) shadow-sm`}
                  >
                    {s}
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div variants={cardIn} transition={{ duration: 1.0, ease: EASE }}>
              <div className="text-xs font-extrabold tracking-[0.22em] text-(--color-brand)">FEEDBACK FORM</div>
              <p className="mt-2 text-sm font-semibold text-(--color-text-muted)">Quick to fill. Professional format.</p>

              <form id="feedback-form" className="mt-5 grid gap-4" onSubmit={onSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder={form?.fields?.first_name_placeholder ?? "First name"}
                    className="w-full rounded-md border border-orange-200/55 bg-white/80 px-4 py-3 text-sm font-semibold text-(--color-text-main) outline-none transition focus:border-orange-400"
                    required
                  />
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder={form?.fields?.last_name_placeholder ?? "Last name"}
                    className="w-full rounded-md border border-orange-200/55 bg-white/80 px-4 py-3 text-sm font-semibold text-(--color-text-main) outline-none transition focus:border-orange-400"
                    required
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {/* <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder={form?.fields?.role_placeholder ?? "Role (optional)"}
                    className="w-full rounded-md border border-orange-200/55 bg-white/80 px-4 py-3 text-sm font-semibold text-[var(--color-text-main)] outline-none transition focus:border-orange-400"
                  /> */}
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder={form?.fields?.company_placeholder ?? "Company (optional)"}
                    className="w-full rounded-md border border-orange-200/55 bg-white/80 px-4 py-3 text-sm font-semibold text-(--color-text-main) outline-none transition focus:border-orange-400"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value as Service)}
                    className="cursor-pointer w-full appearance-none rounded-md border border-orange-200/55 bg-white/80 px-4 py-3 text-sm font-semibold text-(--color-text-main) outline-none transition focus:border-orange-400"
                    required
                  >
                    <option value="" disabled>
                      {form?.fields?.service_placeholder ?? "Select service"}
                    </option>
                    {(form?.services?.length
                      ? form.services
                      : (["Publishing", "Content", "Assessments", "Automation", "Accessibility", "Engineering"] as Service[])
                    ).map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>

                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value) as 1 | 2 | 3 | 4 | 5)}
                    className="cursor-pointer w-full appearance-none rounded-md border border-orange-200/55 bg-white/80 px-4 py-3 text-sm font-semibold text-(--color-text-main) outline-none transition focus:border-orange-400"
                    required
                  >
                    <option value="" disabled>
                      {form?.fields?.rating_placeholder ?? "Rating"}
                    </option>
                    {(form?.ratings?.length
                      ? form.ratings
                      : [
                        { value: 5 as const, label: "★★★★★ (5)" },
                        { value: 4 as const, label: "★★★★☆ (4)" },
                        { value: 3 as const, label: "★★★☆☆ (3)" },
                        { value: 2 as const, label: "★★☆☆☆ (2)" },
                        { value: 1 as const, label: "★☆☆☆☆ (1)" },
                      ]
                    ).map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>

                <textarea
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={form?.fields?.message_placeholder ?? "Write your feedback..."}
                  className="w-full resize-none rounded-md border border-orange-200/55 bg-white/80 px-4 py-3 text-sm font-semibold text-(--color-text-main) outline-none transition focus:border-orange-400"
                  required
                />

                <label className={`flex cursor-pointer items-start gap-3 rounded-md border border-orange-200/40 ${cardGlass} px-4 py-3 shadow-sm`}>
                  <input
                    type="checkbox"
                    checked={consentPublish}
                    onChange={(e) => setConsentPublish(e.target.checked)}
                    className="mt-0.5 cursor-pointer"
                  />
                  <span className="text-xs font-semibold leading-relaxed text-(--color-text-muted)">
                    {form?.fields?.consent_label ??
                      `You may allow us to publish this feedback on ${companyInfo.name}'s website (optional).`}
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={submitting}
                  className={[
                    "cursor-pointer mt-1 inline-flex items-center justify-center gap-2 rounded-md bg-(--color-brand) px-6 py-3 text-sm font-extrabold text-white shadow-[0_14px_34px_rgba(249,115,22,0.22)] transition hover:-translate-y-0.5 hover:bg-gray-600 hover:shadow-[0_18px_44px_rgba(249,115,22,0.28)]",
                    submitting ? "opacity-70 pointer-events-none" : "",
                  ].join(" ")}
                >
                  <FiSend /> {submitting ? "Submitting..." : form?.fields?.submit_label ?? "Submit Feedback"}
                </button>

                {/* NOTE: no bottom success/error text anymore (toast handles it) */}
                <div className="pt-1 text-center text-xs font-semibold text-(--color-text-muted)">
                  {form?.fields?.thank_you_note ?? "Thank you — we appreciate your time."}
                </div>
              </form>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
