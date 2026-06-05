"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { FiMessageSquare, FiPhoneCall, FiMail } from "react-icons/fi";
import { companyInfo } from "@/data/companyInfo";
import ToastTopRight from "@/components/ui/Toast";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

function splitLines(value?: string) {
  if (!value) return [];
  return value
    .split(/[\n,]+/g)
    .map((s) => s.trim())
    .filter(Boolean);
}

function normalizePhoneForLink(p: string) {
  return p.replace(/[^\d+]/g, "");
}

function getWhatsappLink(phone?: string, text?: string) {
  const clean = phone ? normalizePhoneForLink(phone) : "";
  if (!clean) return "/contact";
  const number = clean.startsWith("+") ? clean.slice(1) : clean;
  const msg = encodeURIComponent(text || "Hi Nexografix, I’d like to discuss a project / demo. Please connect.");
  return `https://wa.me/${number}?text=${msg}`;
}

async function readJsonSafe(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

type ContactContent = {
  meta?: { title?: string };
  company?: {
    name?: string;
    emails?: string[];
    phones?: string[];
    whatsapp?: string;
  };
  hero?: {
    badge?: string;
    title_lines?: string[];
    subtitle_prefix?: string;
    subtitle_suffix?: string;
  };
  cards?: {
    text_us?: { title?: string; desc?: string; button?: string; whatsapp_text?: string };
    call_us?: { title?: string; desc?: string };
    email_us?: { title?: string; desc?: string };
  };
  location?: {
    badge?: string;
    title?: string;
    subtitle?: string;
    map_query?: string;
    map_embed_url?: string;
    maps_url?: string;
    maps_button?: string;
  };
  form?: {
    badge?: string;
    title?: string;
    subtitle?: string;
    placeholders?: {
      first_name?: string;
      last_name?: string;
      email?: string;
      phone?: string;
      message?: string;
      service_default?: string;
    };
    services?: string[];
    button?: { idle?: string; loading?: string };
    hint_prefix?: string;
    hint_text?: string;
    hint_middle?: string;
    hint_call?: string;
    hint_suffix?: string;
  };
  toast?: {
    required_error?: string;
    success?: string;
    network_error?: string;
    submit_failed?: string;
  };
};

type FormState = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
};

type Toast = { type: "success" | "error"; msg: string } | null;

const pageWrap: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] } },
};

const stagger: Variants = {
  hidden: { opacity: 1 },
  show: { opacity: 1, transition: { staggerChildren: 0.18, delayChildren: 0.18 } },
};

const cardIn: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
};

const sectionStagger: Variants = {
  hidden: { opacity: 1 },
  show: { opacity: 1, transition: { staggerChildren: 0.16, delayChildren: 0.08 } },
};

const mapIn: Variants = {
  hidden: { opacity: 0, y: 22, scale: 0.992 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};

const formIn: Variants = {
  hidden: { opacity: 0, y: 22, x: 10 },
  show: { opacity: 1, y: 0, x: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};

export default function ContactPage() {
  const [content, setContent] = useState<ContactContent | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/v1/content/contact`, { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as ContactContent;
        if (alive) setContent(data || null);
      } catch {
        if (alive) setContent(null);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const cName = content?.company?.name || companyInfo.name;

  const emails = useMemo(() => {
    const arr = content?.company?.emails;
    if (arr?.length) return arr.map((s) => String(s).trim()).filter(Boolean);
    return splitLines(companyInfo.email);
  }, [content?.company?.emails]);

  const phones = useMemo(() => {
    const arr = content?.company?.phones;
    if (arr?.length) return arr.map((s) => String(s).trim()).filter(Boolean);
    return splitLines(companyInfo.phone);
  }, [content?.company?.phones]);

  const primaryPhone = phones?.[0] || "";

  const whatsappPhone =
    content?.company?.whatsapp ||
    companyInfo.whatsapp ||
    companyInfo.textNumber ||
    primaryPhone;

  const whatsappText =
    content?.cards?.text_us?.whatsapp_text ||
    "Hi Nexografix, I’d like to discuss a project / demo. Please connect.";

  const whatsappHref = getWhatsappLink(whatsappPhone, whatsappText);

  const mapQueryRaw = content?.location?.map_query || "Shishra Manpur, Sirsa, Bihar, India";
  const mapQuery = encodeURIComponent(mapQueryRaw);
  const mapSrc = content?.location?.map_embed_url?.trim() || `https://www.google.com/maps?q=${mapQuery}&output=embed`;

  const mapsHref =
    content?.location?.maps_url?.trim() || `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

  const heroBadge = content?.hero?.badge || "LET'S TALK";
  const heroTitle = content?.hero?.title_lines?.length ? content.hero.title_lines.join("\n") : "Engage in conversation \nwith skilled engineers.";
  const heroSubtitle =
    content?.hero?.subtitle_prefix && content?.hero?.subtitle_suffix
      ? `${content.hero.subtitle_prefix} ${cName} ${content.hero.subtitle_suffix}`
      : `Reach ${cName} for demos, partnerships, delivery discussions, or support.`;

  const cardTextTitle = content?.cards?.text_us?.title || "Text us";
  const cardTextDesc =
    content?.cards?.text_us?.desc || "Share requirements, timeline, and attachments — we’ll reply with the next steps.";
  const cardTextBtn = content?.cards?.text_us?.button || "Send a Message";

  const cardCallTitle = content?.cards?.call_us?.title || "Give us a call";
  const cardCallDesc =
    content?.cards?.call_us?.desc || "Best for quick scoping, delivery timelines, and priority support discussions.";

  const cardEmailTitle = content?.cards?.email_us?.title || "Email us";
  const cardEmailDesc =
    content?.cards?.email_us?.desc || "Best for proposals, SOW, documents, and partnership conversations.";

  const locBadge = content?.location?.badge || "LOCATION";
  const locTitle = content?.location?.title || "Shishra Manpur, Sirsa (Bihar)";
  const locSubtitle = content?.location?.subtitle || "Visit us for delivery discussions & onboarding meets.";
  const openMapsLabel = content?.location?.maps_button || "Open in Maps";

  const formBadge = content?.form?.badge || "GET IN TOUCH";
  const formTitle = content?.form?.title || "Fill up the form";
  const formSubtitle = content?.form?.subtitle || "Share a few details — we’ll respond with next steps.";

  const phFirst = content?.form?.placeholders?.first_name || "First name";
  const phLast = content?.form?.placeholders?.last_name || "Last name";
  const phEmail = content?.form?.placeholders?.email || "Your email";
  const phPhone = content?.form?.placeholders?.phone || "Phone number";
  const phMessage = content?.form?.placeholders?.message || "Type your message";

  const servicePlaceholder = content?.form?.placeholders?.service_default || "Select service";
  const serviceOptions =
    content?.form?.services?.length
      ? content.form.services
      : [
        "AI-enabled Publishing Services",
        "Content Production / Conversion",
        "Assessment / Question Bank Solutions",
        "AI Automation / Workflow Setup",
        "Website / Product Engineering",
        "Support / Maintenance",
      ];

  const submitIdle = content?.form?.button?.idle || "Get In Touch";
  const submitLoading = content?.form?.button?.loading || "Submitting...";

  const footerNote = `${content?.form?.hint_prefix || "Prefer quick response? Use"} ${content?.form?.hint_text || "Text us"} ${content?.form?.hint_middle || "or"} ${content?.form?.hint_call || "Give us a call"} ${content?.form?.hint_suffix || "above."}`;

  const validationError =
    content?.toast?.required_error || "Please fill First name, Last name, Email and Message.";

  const toastSuccess = content?.toast?.success || "Thanks! We received your message.";
  const toastFail = content?.toast?.submit_failed || "Submission failed.";
  const toastNetwork = content?.toast?.network_error || "Network error. Submission failed.";

  const [form, setForm] = useState<FormState>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<Toast>(null);

  const setField = (k: keyof FormState, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const reset = () =>
    setForm({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      service: "",
      message: "",
    });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    const payload = {
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      service: form.service.trim() || null,
      message: form.message.trim(),
    };

    if (!payload.first_name || !payload.last_name || !payload.email || !payload.message) {
      setToast({ type: "error", msg: validationError });
      return;
    }

    setLoading(true);
    setToast(null);

    try {
      const res = await fetch(`${API_BASE}/api/v1/contact-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await readJsonSafe(res);
        setToast({ type: "error", msg: data?.detail || data?.message || toastFail });
        return;
      }

      setToast({ type: "success", msg: toastSuccess });
      reset();
    } catch {
      setToast({ type: "error", msg: toastNetwork });
    } finally {
      setLoading(false);
      window.setTimeout(() => setToast(null), 3500);
    }
  };

  return (
    <motion.section variants={pageWrap} initial="hidden" animate="show" className="relative overflow-hidden bg-[var(--color-bg)]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-36 left-1/2 h-[520px] w-[980px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.14),transparent_62%)] blur-2xl" />
        <div className="absolute -bottom-40 right-[-220px] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.10),transparent_66%)] blur-2xl" />
        <div className="absolute -bottom-44 left-[-220px] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.08),transparent_66%)] blur-2xl" />
      </div>

      <div className="relative mx-auto max-w-[1280px] px-6 py-16">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.7 }} className="text-center">
          <motion.div variants={fadeUp} className="flex justify-center">
            <span className="inline-flex items-center rounded-full border border-orange-200/70 bg-white/70 px-4 py-2 text-xs font-extrabold tracking-[0.26em] text-[var(--color-brand)] shadow-sm backdrop-blur">
              {heroBadge}
            </span>
          </motion.div>

          <motion.h1 variants={fadeUp} className="mx-auto mt-5 max-w-4xl whitespace-pre-line text-4xl font-extrabold leading-[1.08] text-[var(--color-text-main)] sm:text-5xl">
            {heroTitle}
          </motion.h1>

          <motion.p variants={fadeUp} className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[var(--color-text-muted)]">
            {heroSubtitle}
          </motion.p>
        </motion.div>

        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.35 }} variants={stagger} className="mt-12 grid gap-8 md:grid-cols-3">
          <motion.div variants={cardIn} whileHover={{ y: -5 }} transition={{ duration: 0.28, ease: "easeOut" }} className="group flex h-full flex-col rounded-md border border-[rgba(24,24,27,0.07)] bg-white/80 p-8 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-50 text-[var(--color-brand)] ring-1 ring-orange-200/50">
                <FiMessageSquare size={22} />
              </div>
              <div className="flex-1">
                <div className="text-xl font-extrabold text-[var(--color-text-main)]">{cardTextTitle}</div>
                <div className="mt-1 text-sm font-semibold leading-relaxed text-[var(--color-text-muted)]">{cardTextDesc}</div>
              </div>
            </div>

            <div className="mt-auto pt-6">
              <a
                href={whatsappHref}
                target={whatsappHref.startsWith("http") ? "_blank" : undefined}
                rel={whatsappHref.startsWith("http") ? "noreferrer" : undefined}
                className="inline-flex w-full items-center justify-center rounded-lg bg-[var(--color-brand)] px-5 py-3 text-sm font-extrabold text-white shadow-[0_14px_34px_rgba(249,115,22,0.22)] transition hover:-translate-y-0.5 hover:bg-[var(--color-brand-dark)] hover:text-white hover:shadow-[0_18px_44px_rgba(249,115,22,0.28)] active:translate-y-0"
              >
                {cardTextBtn}
              </a>
            </div>
          </motion.div>

          <motion.div variants={cardIn} whileHover={{ y: -5 }} transition={{ duration: 0.28, ease: "easeOut" }} className="group flex h-full flex-col rounded-md border border-[rgba(24,24,27,0.07)] bg-white/80 p-8 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-50 text-[var(--color-brand)] ring-1 ring-orange-200/50">
                <FiPhoneCall size={22} />
              </div>
              <div className="flex-1">
                <div className="text-xl font-extrabold text-[var(--color-text-main)]">{cardCallTitle}</div>
                <div className="mt-1 text-sm font-semibold leading-relaxed text-[var(--color-text-muted)]">{cardCallDesc}</div>
              </div>
            </div>

            <div className="mt-auto pt-6">
              {phones.length ? (
                <div className="space-y-2">
                  {phones.slice(0, 2).map((p) => (
                    <a
                      key={p}
                      href={p}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-lg border border-[rgba(24,24,27,0.06)] bg-white/70 px-4 py-3 text-sm font-extrabold text-[var(--color-text-main)] transition hover:border-[rgba(249,115,22,0.22)] hover:bg-orange-50/60 hover:text-[var(--color-brand-dark)]"
                    >
                      Schedule Meet
                    </a>
                  ))}

                </div>
              ) : (
                <div className="rounded-lg border border-[rgba(24,24,27,0.06)] bg-white/70 px-4 py-3 text-sm font-semibold text-[var(--color-text-muted)]">
                  Phone details will be updated.
                </div>
              )}
            </div>
          </motion.div>

          <motion.div variants={cardIn} whileHover={{ y: -5 }} transition={{ duration: 0.28, ease: "easeOut" }} className="group flex h-full flex-col rounded-md border border-[rgba(24,24,27,0.07)] bg-white/80 p-8 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-50 text-[var(--color-brand)] ring-1 ring-orange-200/50">
                <FiMail size={22} />
              </div>
              <div className="flex-1">
                <div className="text-xl font-extrabold text-[var(--color-text-main)]">{cardEmailTitle}</div>
                <div className="mt-1 text-sm font-semibold leading-relaxed text-[var(--color-text-muted)]">{cardEmailDesc}</div>
              </div>
            </div>

            <div className="mt-auto pt-6">
              {emails.length ? (
                <div className="space-y-2">
                  {emails.slice(0, 2).map((e) => (
                    <a
                      key={e}
                      href={`mailto:${e}`}
                      className="block rounded-lg border border-[rgba(24,24,27,0.06)] bg-white/70 px-4 py-3 text-sm font-extrabold text-[var(--color-text-main)] transition hover:border-[rgba(249,115,22,0.22)] hover:bg-orange-50/60 hover:text-[var(--color-brand-dark)]"
                    >
                      {e}
                    </a>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-[rgba(24,24,27,0.06)] bg-white/70 px-4 py-3 text-sm font-semibold text-[var(--color-text-muted)]">
                  Email details will be updated.
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          variants={sectionStagger}
          className="mt-24 grid items-stretch gap-10 lg:grid-cols-[1.35fr_0.85fr] lg:items-stretch"
        >
          <motion.div variants={mapIn} className="relative h-full">
            <div className="flex h-full flex-col overflow-hidden rounded-md border border-[rgba(24,24,27,0.07)] bg-white/70 shadow-[0_30px_95px_rgba(15,23,42,0.10)] backdrop-blur ring-1 ring-orange-200/40">
              <div className="flex items-center justify-between gap-4 border-b border-[rgba(24,24,27,0.06)] bg-[linear-gradient(180deg,rgba(249,115,22,0.10),rgba(255,255,255,0.0))] px-6 py-4">
                <div>
                  <div className="text-xs font-extrabold tracking-[0.22em] text-[var(--color-brand)]">{locBadge}</div>
                  <div className="mt-1 text-lg font-extrabold text-[var(--color-text-main)]">{locTitle}</div>
                  <div className="mt-1 text-sm font-semibold text-[var(--color-text-muted)]">{locSubtitle}</div>
                </div>

                <a
                  href={mapsHref}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 rounded-lg border border-[rgba(249,115,22,0.22)] bg-white/70 px-4 py-2 text-sm font-extrabold text-[var(--color-brand-dark)] shadow-sm transition hover:-translate-y-0.5 hover:bg-orange-50"
                >
                  {openMapsLabel}
                </a>
              </div>

              <div className="flex-1">
                <iframe title="Nexografix location" src={mapSrc} className="h-full w-full grayscale-[0.10]" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              </div>
            </div>
            <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[28px] bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.16),transparent_60%)] blur-2xl" />
          </motion.div>

          <motion.div variants={formIn} className="h-full rounded-md border border-[rgba(24,24,27,0.07)] bg-white/80 p-8 shadow-[0_24px_76px_rgba(15,23,42,0.08)] backdrop-blur ring-1 ring-orange-200/35">
            <div className="mb-6">
              <div className="text-xs font-extrabold tracking-[0.22em] text-[var(--color-brand)]">{formBadge}</div>
              <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[var(--color-text-main)]">{formTitle}</h2>
              <p className="mt-2 text-sm font-semibold text-[var(--color-text-muted)]">{formSubtitle}</p>
            </div>

            <form onSubmit={submit} className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  value={form.first_name}
                  onChange={(e) => setField("first_name", e.target.value)}
                  type="text"
                  placeholder={phFirst}
                  className="w-full rounded-lg border border-[rgba(24,24,27,0.08)] bg-white/70 px-4 py-3 text-sm font-semibold text-[var(--color-text-main)] outline-none transition focus:border-orange-400"
                />
                <input
                  value={form.last_name}
                  onChange={(e) => setField("last_name", e.target.value)}
                  type="text"
                  placeholder={phLast}
                  className="w-full rounded-lg border border-[rgba(24,24,27,0.08)] bg-white/70 px-4 py-3 text-sm font-semibold text-[var(--color-text-main)] outline-none transition focus:border-orange-400"
                />
              </div>

              <input
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                type="email"
                placeholder={phEmail}
                className="w-full rounded-lg border border-[rgba(24,24,27,0.08)] bg-white/70 px-4 py-3 text-sm font-semibold text-[var(--color-text-main)] outline-none transition focus:border-orange-400"
              />

              <input
                value={form.phone}
                onChange={(e) => setField("phone", e.target.value)}
                type="tel"
                placeholder={phPhone}
                className="w-full rounded-lg border border-[rgba(24,24,27,0.08)] bg-white/70 px-4 py-3 text-sm font-semibold text-[var(--color-text-main)] outline-none transition focus:border-orange-400"
              />

              <select
                value={form.service}
                onChange={(e) => setField("service", e.target.value)}
                className="w-full appearance-none rounded-lg border border-[rgba(24,24,27,0.08)] bg-white/70 px-4 py-3 text-sm font-semibold text-[var(--color-text-main)] outline-none transition focus:border-orange-400"
              >
                <option value="" disabled>
                  {servicePlaceholder}
                </option>
                {serviceOptions.map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>

              <textarea
                value={form.message}
                onChange={(e) => setField("message", e.target.value)}
                rows={5}
                placeholder={phMessage}
                className="w-full resize-none rounded-lg border border-[rgba(24,24,27,0.08)] bg-white/70 px-4 py-3 text-sm font-semibold text-[var(--color-text-main)] outline-none transition focus:border-orange-400"
              />

              <button
                type="submit"
                disabled={loading}
                className="mt-2 inline-flex items-center justify-center rounded-lg bg-[var(--color-brand)] px-6 py-3 text-sm font-extrabold text-white shadow-[0_14px_36px_rgba(249,115,22,0.28)] transition hover:-translate-y-0.5 hover:bg-[var(--color-brand-dark)] hover:shadow-[0_18px_46px_rgba(249,115,22,0.34)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? submitLoading : submitIdle}
              </button>

              <div className="pt-3 text-xs font-semibold text-[var(--color-text-muted)]">{footerNote}</div>
            </form>
          </motion.div>
        </motion.div>
      </div>

      <ToastTopRight toast={toast} onClose={() => setToast(null)} duration={4000} />
    </motion.section>
  );
}
