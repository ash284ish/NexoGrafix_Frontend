"use client";

import { useMemo, useState, useEffect } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import Link from "next/link";
import { FiChevronDown, FiSearch, FiShield, FiZap, FiClock, FiCheckCircle, FiMessageSquare, FiLayers } from "react-icons/fi";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

type Cat = string;

type FAQ = {
  id: string;
  category: Cat;
  q: string;
  a: string;
};

type FAQContent = {
  meta?: { title?: string };
  categories?: Cat[];
  hero?: {
    badge?: string;
    title?: string;
    subtitle?: string;
    primary_cta_label?: string;
    primary_cta_href?: string;
    secondary_cta_label?: string;
    secondary_cta_href?: string;
    bullets?: { title?: string; desc?: string }[];
    search_placeholder?: string;
    tip_label?: string;
    tip_items?: string[];
  };
  empty_state?: { text?: string };
  bottom_cta?: {
    title?: string;
    subtitle?: string;
    primary_label?: string;
    primary_href?: string;
    secondary_label?: string;
    secondary_href?: string;
  };
  faqs?: FAQ[];
};

const defaultCats = ["All", "Company", "Services", "Process", "Security", "Pricing", "Arohio.ai"] as const;

const defaultFaqs: FAQ[] = [
  { id: "1", category: "Company", q: "What is Nexografix?", a: "Nexografix is an enterprise-focused technology and AI services company. We build scalable platforms for publishing workflows, content operations, assessments, automation, and modern web/mobile products." },
  { id: "2", category: "Company", q: "Who do you work with?", a: "We work with enterprises, agencies, and fast-growing teams who need reliable delivery, clean architecture, and measurable outcomes—especially in content-heavy and workflow-driven domains." },
  { id: "3", category: "Services", q: "What services do you provide?", a: "AI-enabled workflow automation, publishing/content systems, assessment platforms, custom web apps, and mobile app development—built for performance, security, and long-term scalability." },
  { id: "4", category: "Services", q: "Do you build both web and mobile apps?", a: "Yes. We deliver modern web applications and mobile apps (Android/iOS-ready) using scalable architectures and production-grade engineering practices." },
  { id: "5", category: "Services", q: "Can you handle enterprise integrations (SSO, APIs, CRMs, LMS)?", a: "Yes. We can integrate with internal systems and third-party tools via APIs, SSO, and standard enterprise patterns—depending on your stack and compliance needs." },
  { id: "6", category: "Process", q: "What is your typical delivery process?", a: "We start with discovery → solution blueprint → milestones → iterative delivery. You get weekly progress visibility, clear scope boundaries, and structured QA before handover." },
  { id: "7", category: "Process", q: "How do you define project scope clearly?", a: "We document modules, user flows, deliverables, timelines, and acceptance criteria. This avoids scope creep and ensures both sides are aligned before development starts." },
  { id: "8", category: "Process", q: "Do you provide UI/UX design as well?", a: "Yes. We can deliver UI/UX design aligned with your brand system and modern usability standards. If you already have designs, we can develop directly from them." },
  { id: "9", category: "Process", q: "How fast can you deliver an MVP?", a: "It depends on complexity, but for a focused MVP we typically deliver through clear milestones. When scope is clean, early versions move fast without sacrificing quality." },
  { id: "10", category: "Process", q: "Do you offer post-launch support?", a: "Yes. We support bug fixes, performance tuning, monitoring, and feature enhancements. Support can be milestone-based or monthly, depending on your needs." },
  { id: "11", category: "Security", q: "How do you handle security and data privacy?", a: "We follow secure coding practices, role-based access control, least-privilege design, and safe API handling. If needed, we align with your internal compliance requirements." },
  { id: "12", category: "Security", q: "Do you sign NDA and contracts?", a: "Yes. We can sign an NDA and provide a service agreement covering IP ownership, delivery terms, milestones, and confidentiality." },
  { id: "13", category: "Security", q: "Do you support audit logs and access controls?", a: "Yes. For enterprise platforms, we implement audit trails, activity logs, RBAC/permissions, and admin governance based on your requirements." },
  { id: "14", category: "Pricing", q: "How do you price projects?", a: "We typically use milestone-based pricing based on scope, timeline, complexity, and integrations. For ongoing work, monthly retainers are also available." },
  { id: "15", category: "Pricing", q: "Do you offer fixed-price or hourly?", a: "Both. Fixed-price works best with clear scope. Hourly/retainer works best when your roadmap evolves and you want rapid iterations." },
  { id: "16", category: "Pricing", q: "Can you propose a cost range before starting?", a: "Yes. After a quick discovery call and scope clarity, we share a structured estimate with options (basic, standard, premium) aligned to outcomes." },
  { id: "17", category: "Arohio.ai", q: "What is Arohio.ai?", a: "Arohio.ai is one of our AI platforms focused on enabling AI-driven workflows. Modules are tailored based on your organization’s needs." },
  { id: "18", category: "Arohio.ai", q: "Can Arohio.ai be customized for our workflows?", a: "Yes. We tailor AI-powered workflows, automation steps, and integrations depending on your content, publishing, or assessment operations." },
  { id: "19", category: "Services", q: "Do you work with publishing and assessment platforms specifically?", a: "Yes. We specialize in workflow-heavy systems—publishing pipelines, content operations, academic content, assessments, and automation-heavy enterprise use cases." },
  { id: "20", category: "Company", q: "How do we start working with Nexografix?", a: "Use the appointment form or contact page. Share your scope, timeline, and goals. We’ll propose a structured plan with milestones and next steps." }
];

const fadeUp: Variants = { hidden: { opacity: 0, y: 18, filter: "blur(10px)" }, show: { opacity: 1, y: 0, filter: "blur(0px)" } };
const listWrap: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.075, delayChildren: 0.05 } } };
const itemIn: Variants = { hidden: { opacity: 0, y: 14, filter: "blur(8px)" }, show: { opacity: 1, y: 0, filter: "blur(0px)" } };

const cardGlass = "bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(255,255,255,0.92))] backdrop-blur";
const panelGlass = "bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(255,255,255,0.90))] backdrop-blur";

function CatIcon({ cat }: { cat: Cat }) {
  if (cat === "Security") return <FiShield />;
  if (cat === "Pricing") return <FiLayers />;
  if (cat === "Process") return <FiClock />;
  if (cat === "Arohio.ai") return <FiZap />;
  if (cat === "Services") return <FiCheckCircle />;
  return <FiMessageSquare />;
}

function FAQItem({ item, open, onToggle }: { item: FAQ; open: boolean; onToggle: () => void }) {
  return (
    <motion.div
      layout="position"
      whileHover={{ y: -3 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className={[
        "group relative overflow-hidden rounded-md border",
        "border-orange-200/40",
        cardGlass,
        "shadow-[0_18px_60px_rgba(15,23,42,0.06)]",
        "hover:shadow-[0_30px_120px_rgba(234,88,12,0.12)] transition-shadow",
      ].join(" ")}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <div className="absolute -right-10 -top-12 h-44 w-44 rounded-full bg-orange-200/35 blur-3xl" />
        <div className="absolute -left-12 -bottom-14 h-52 w-52 rounded-full bg-orange-300/25 blur-3xl" />
      </div>

      <button type="button" onClick={onToggle} className="relative flex w-full items-start justify-between gap-4 px-6 py-5 text-left" aria-expanded={open}>
        <div className="min-w-0">
          <div className="text-[15px] font-extrabold leading-snug text-slate-900 sm:text-base">{item.q}</div>
          <div className="mt-2 inline-flex items-center gap-2 text-[12px] font-semibold text-orange-700">
            <span className="inline-flex h-6 items-center rounded-md bg-white/90 px-2.5 ring-1 ring-orange-200/70 shadow-sm">{item.category}</span>
          </div>
        </div>

        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.18 }}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white/90 text-slate-700 ring-1 ring-orange-200/45 shadow-sm"
        >
          <FiChevronDown />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div key="content" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22, ease: "easeOut" }} className="relative overflow-hidden">
            <div className="px-6 pb-6 text-[15px] leading-relaxed text-slate-700 sm:text-base">{item.a}</div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQPagePremium() {
  const [content, setContent] = useState<FAQContent | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/v1/content/faqs`, { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as FAQContent;
        if (alive) setContent(data || null);
      } catch {
        if (alive) setContent(null);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const cats = useMemo(() => {
    const raw = content?.categories?.length ? content.categories : [...defaultCats];
    return raw.includes("All") ? raw : ["All", ...raw];
  }, [content]);

  const faqs = useMemo(() => (content?.faqs?.length ? content.faqs : defaultFaqs), [content]);

  const [activeCat, setActiveCat] = useState<Cat>("All");

  // Adjust activeCat when cats change during render
  const [prevCats, setPrevCats] = useState(cats);
  if (cats !== prevCats) {
    setPrevCats(cats);
    if (!cats.includes(activeCat)) setActiveCat("All");
  }

  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return faqs.filter((f) => {
      const inCat = activeCat === "All" ? true : f.category === activeCat;
      const inQ = q ? f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q) : true;
      return inCat && inQ;
    });
  }, [activeCat, query, faqs]);

  // Adjust openId when filtered list changes during render
  const [prevFiltered, setPrevFiltered] = useState(filtered);
  if (filtered !== prevFiltered) {
    setPrevFiltered(filtered);
    if (filtered.length === 0) {
      setOpenId(null);
    } else {
      const stillExists = openId ? filtered.some((x) => x.id === openId) : false;
      if (!stillExists) setOpenId(filtered[0].id);
    }
  }

  const heroBadge = content?.hero?.badge || "Help Center";
  const heroTitle = content?.hero?.title || "Clear answers. Faster decisions.";
  const heroSubtitle =
    content?.hero?.subtitle ||
    "Understand delivery standards, security posture, enterprise readiness, and pricing—without unnecessary back-and-forth.";

  const primaryCtaLabel = content?.hero?.primary_cta_label || "Book an Appointment →";
  const primaryCtaHref = content?.hero?.primary_cta_href || "/contact";
  const secondaryCtaLabel = content?.hero?.secondary_cta_label || "Explore Solutions →";
  const secondaryCtaHref = content?.hero?.secondary_cta_href || "/solutions";

  const bullets = content?.hero?.bullets?.length
    ? content.hero.bullets
    : [
        { title: "Enterprise-ready delivery", desc: "Secure builds, clean architecture, and release discipline—built for long-term scale." },
        { title: "Less back-and-forth", desc: "Filter by category, search instantly, and get clarity in minutes." }
      ];

  const searchPlaceholder = content?.hero?.search_placeholder || "Search security, pricing, integrations, mobile, SSO...";
  const tipLabel = content?.hero?.tip_label || "Helpful tip";
  const tipItems = content?.hero?.tip_items?.length ? content.hero.tip_items : ["SSO", "audit logs", "retainer", "LMS"];

  const emptyText = content?.empty_state?.text || "No results found. Try a different keyword or switch the category.";

  const bottomTitle = content?.bottom_cta?.title || "Still need clarity?";
  const bottomSubtitle =
    content?.bottom_cta?.subtitle ||
    "If your question involves integrations, internal approvals, or enterprise requirements, book an appointment. We’ll share a clear plan with milestones, timelines, and ownership.";

  const bottomPrimaryLabel = content?.bottom_cta?.primary_label || "Book an Appointment →";
  const bottomPrimaryHref = content?.bottom_cta?.primary_href || "/contact";
  const bottomSecondaryLabel = content?.bottom_cta?.secondary_label || "Learn about Nexografix →";
  const bottomSecondaryHref = content?.bottom_cta?.secondary_href || "/about";

  return (
    <main
      className={[
        "relative overflow-hidden",
        "bg-[radial-gradient(1200px_700px_at_12%_-10%,rgba(255,237,213,0.55),transparent_60%),radial-gradient(900px_520px_at_90%_18%,rgba(254,215,170,0.40),transparent_58%),linear-gradient(180deg,#FFFEFD_0%,#FFFDF9_55%,#FFFEFD_100%)]",
      ].join(" ")}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-44 -left-55 h-140 w-140 rounded-full bg-orange-200/16 blur-3xl" />
        <div className="absolute top-30 -right-60 h-155 w-155 rounded-full bg-orange-300/12 blur-3xl" />
        <div className="absolute -bottom-65 left-[14%] h-140 w-140 rounded-full bg-orange-200/14 blur-3xl" />
        <div className="absolute bottom-35 right-[8%] h-80 w-[320px] rounded-full bg-orange-300/10 blur-3xl" />
        <div className="absolute bottom-130 left-[62%] h-65 w-65 rounded-full bg-orange-200/10 blur-3xl" />

        <motion.div animate={{ y: [0, -10, 0], x: [0, 6, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} className="absolute left-[6%] top-[12%] h-16 w-16 rounded-full border border-orange-300/30" />
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute right-[12%] top-[18%] h-9 w-24 rounded-full bg-orange-200/14" />
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }} className="absolute left-[12%] top-[34%] h-12 w-12 rounded-full border border-orange-300/25" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-14 sm:py-16">
        <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }} className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <div className="inline-flex items-center gap-2 rounded-md border border-orange-200/50 bg-white/80 px-4 py-2 text-xs font-extrabold tracking-wide text-slate-900 shadow-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-orange-600" />
              {heroBadge}
            </div>

            <h1 className="mt-6 text-4xl font-extrabold leading-tight text-slate-900 sm:text-5xl">{heroTitle}</h1>

            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-700 sm:text-lg">{heroSubtitle}</p>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <Link href={primaryCtaHref} className="cursor-pointer inline-flex items-center justify-center rounded-md bg-orange-600 px-6 py-3 text-sm font-extrabold text-white shadow-[0_14px_40px_rgba(234,88,12,0.22)] ring-1 ring-orange-600/30 transition hover:-translate-y-0.5 hover:bg-gray-600">
                {primaryCtaLabel}
              </Link>

              <Link href={secondaryCtaHref} className="cursor-pointer inline-flex items-center justify-center rounded-md bg-white/85 px-6 py-3 text-sm font-extrabold text-slate-900 ring-1 ring-orange-200/45 shadow-sm transition hover:-translate-y-0.5 hover:bg-white">
                {secondaryCtaLabel}
              </Link>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {bullets.slice(0, 2).map((b, idx) => (
                <div key={`${b.title}-${idx}`} className="flex items-start gap-3 rounded-md border border-orange-200/35 bg-white/85 p-4 shadow-sm backdrop-blur">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-orange-100 text-orange-700">✓</span>
                  <div className="pt-0.5">
                    <div className="text-sm font-extrabold text-slate-900">{b.title}</div>
                    <div className="mt-1 text-sm text-slate-700">{b.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`rounded-md border border-orange-200/40 ${panelGlass} p-6 shadow-[0_18px_90px_rgba(234,88,12,0.10)]`}>
            <div className="text-sm font-extrabold text-slate-900">Search FAQs</div>

            <div className="mt-3 rounded-md border border-orange-200/45 bg-white/90 shadow-sm ring-orange-200/70 focus-within:ring-2">
              <div className="flex items-center gap-3 px-4 py-3.5">
                <FiSearch className="text-slate-500" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full bg-transparent text-base font-semibold text-slate-900 outline-none placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="mt-6 text-xs font-extrabold tracking-wide text-slate-700">Quick filters</div>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {cats.map((c) => {
                const active = activeCat === c;
                return (
                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.16, ease: "easeOut" }}
                    key={c}
                    type="button"
                    onClick={() => setActiveCat(c)}
                    className={[
                      "cursor-pointer inline-flex items-center gap-2 rounded-md px-3.5 py-2.5 text-[12px] font-extrabold ring-1 transition",
                      active ? "bg-orange-600 text-white ring-orange-600/30 shadow-sm" : "bg-white/90 text-slate-900 ring-orange-200/45 hover:bg-white",
                    ].join(" ")}
                  >
                    <CatIcon cat={c} />
                    {c}
                  </motion.button>
                );
              })}
            </div>

            <div className="mt-6 rounded-md border border-orange-200/40 bg-white/90 px-5 py-4 shadow-sm">
              <div className="text-xs font-extrabold tracking-wide text-orange-700">{tipLabel}</div>
              <div className="mt-1.5 text-sm text-slate-700">
                Try{" "}
                {tipItems.slice(0, 4).map((t, i) => (
                  <span key={`${t}-${i}`}>
                    <span className="font-extrabold">{t}</span>
                    {i < Math.min(3, tipItems.length - 1) ? ", " : "."}
                    {t === "retainer" ? " " : ""}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section key={`${activeCat}-${query}`} variants={listWrap} initial="hidden" animate="show" transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }} className="mt-12">
          <motion.div className="grid gap-4 lg:grid-cols-2">
            {filtered.length === 0 ? (
              <motion.div variants={itemIn} className={`lg:col-span-2 rounded-md border border-orange-200/40 ${panelGlass} p-7 text-base text-slate-700 shadow-[0_18px_60px_rgba(234,88,12,0.08)]`}>
                {emptyText}
              </motion.div>
            ) : (
              filtered.map((item) => (
                <motion.div key={item.id} variants={itemIn}>
                  <FAQItem item={item} open={openId === item.id} onToggle={() => setOpenId((prev) => (prev === item.id ? null : item.id))} />
                </motion.div>
              ))
            )}
          </motion.div>
        </motion.section>

        <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }} className={`mt-12 rounded-md border border-orange-200/40 ${panelGlass} p-7 shadow-[0_18px_90px_rgba(234,88,12,0.10)]`}>
          <div className="text-sm font-extrabold text-slate-900">{bottomTitle}</div>
          <p className="mt-2 text-sm text-slate-700">{bottomSubtitle}</p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link href={bottomPrimaryHref} className="cursor-pointer inline-flex items-center justify-center rounded-md bg-orange-600 px-6 py-3 text-sm font-extrabold text-white shadow-[0_14px_40px_rgba(234,88,12,0.22)] ring-1 ring-orange-600/30 transition hover:-translate-y-0.5 hover:bg-gray-600">
              {bottomPrimaryLabel}
            </Link>

            <Link href={bottomSecondaryHref} className="cursor-pointer inline-flex items-center justify-center rounded-md bg-white/90 px-6 py-3 text-sm font-extrabold text-slate-900 ring-1 ring-orange-200/45 shadow-sm transition hover:-translate-y-0.5 hover:bg-white">
              {bottomSecondaryLabel}
            </Link>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
