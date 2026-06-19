"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { FiArrowUpRight, FiMail, FiPhone, FiMapPin, FiLinkedin, FiInstagram, FiFacebook } from "react-icons/fi";
import ToastTopRight from "@/components/ui/Toast";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const wrap: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.08 } },
};

const fade: Variants = {
  hidden: { opacity: 0, y: 14, filter: "blur(10px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.95, ease: EASE } },
};

const navLink =
  "group relative flex w-full items-center gap-2 text-sm font-semibold text-slate-700 transition-all duration-300 ease-out hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/40";
const navUnderline =
  "pointer-events-none absolute -bottom-1 left-0 h-[2px] w-full origin-left scale-x-0 bg-gradient-to-r from-orange-600 to-orange-400 transition-transform duration-300 ease-out group-hover:scale-x-100";
const navDot =
  "shrink-0 h-1.5 w-1.5 rounded-full bg-orange-500/0 transition-all duration-300 ease-out group-hover:bg-orange-500/90 group-hover:shadow-[0_0_0_6px_rgba(249,115,22,0.14)]";

const SOLUTION_CATEGORIES = [
  { title: "Publishing & Digitization", href: "/publishing-digitization#overview" },
  { title: "Accessibility & Compliance", href: "/accessibility-compliance#overview" },
  { title: "IT & Digital Platforms", href: "/digital-platforms#overview" },
  { title: "Data Labeling & Annotation", href: "/data-labeling#overview" },
  { title: "Localization & Media Accessibility", href: "/localization-media#overview" },
  { title: "Content, eLearning & EdTech", href: "/elearning-edtech#overview" },
] as const;

export default function SiteFooter() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [agree, setAgree] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const pushToast = (t: { type: "success" | "error"; msg: string }, ttl = 4000) => {
    setToast(t);
    window.setTimeout(() => setToast(null), ttl);
  };
  return (
    <footer className="relative overflow-hidden bg-[radial-gradient(1200px_720px_at_12%_-10%,rgba(255,237,213,0.60),transparent_60%),radial-gradient(980px_560px_at_92%_18%,rgba(254,215,170,0.42),transparent_58%),linear-gradient(180deg,#FFFEFD_0%,#FFFDF8_55%,#FFFEFD_100%)]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-44 -left-60 h-140 w-140 rounded-full bg-orange-200/14 blur-3xl" />
        <div className="absolute top-35 -right-65 h-160 w-160 rounded-full bg-orange-300/10 blur-3xl" />
        <div className="absolute -bottom-70 left-[14%] h-140 w-140 rounded-full bg-orange-200/12 blur-3xl" />
        <div className="absolute bottom-40 right-[10%] h-80 w-[320px] rounded-full bg-orange-300/10 blur-3xl" />
        <motion.div
          animate={{ y: [0, -10, 0], x: [0, 7, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[7%] top-[18%] h-16 w-16 rounded-full border border-orange-300/25"
        />
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[12%] top-[22%] h-9 w-24 rounded-full bg-orange-200/12"
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
          className="absolute left-[14%] top-[42%] h-12 w-12 rounded-full border border-orange-300/20"
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-14 sm:py-16">
        <div className="hidden md:block">
          <motion.div
            variants={wrap}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid gap-10 lg:grid-cols-[1.2fr_1fr]"
          >
            <motion.div variants={fade}>
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-200/60 bg-white/80 px-4 py-2 text-[11px] font-extrabold tracking-[0.22em] text-orange-700 shadow-sm backdrop-blur">
                NEXOGRAFIX
              </div>

              <div className="mt-5 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                Nexografix — PDF & Document Accessibility Compliance | WCAG · Section 508 · EPUB
              </div>

              <p className="mt-3 max-w-xl text-sm font-semibold leading-relaxed text-slate-600">
                Enterprise delivery standards with clean architecture, clear milestones, and disciplined QA — built to
                scale.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  { k: "Publishing", v: "Workflow platforms" },
                  { k: "Assessments", v: "Delivery + governance" },
                  { k: "Automation", v: "AI-led operations" },
                ].map((x) => (
                  <div
                    key={x.k}
                    className="rounded-md border border-orange-200/40 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(255,255,255,0.84))] p-4 shadow-[0_16px_50px_rgba(15,23,42,0.06)] backdrop-blur"
                  >
                    <div className="text-xs font-extrabold text-slate-900">{x.k}</div>
                    <div className="mt-1 text-xs font-semibold text-slate-600">{x.v}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              variants={fade}
              className="rounded-md border border-orange-200/40 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(255,255,255,0.86))] p-6 shadow-[0_22px_80px_rgba(234,88,12,0.10)] backdrop-blur"
            >
              <div className="text-sm font-extrabold text-slate-900">Newsletter</div>
              <p className="mt-2 text-sm font-semibold text-slate-600">
                Get product updates, delivery insights, and publishing workflow notes.
              </p>

              <form
                className="mt-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (submitting) return;

                  const fn = firstName.trim();
                  const ln = lastName.trim();
                  const em = email.trim();

                  if (!fn || !ln || !em || !agree) return;

                  setSubmitting(true);

                  try {
                    const res = await fetch("/api/v1/newsletter-subscribers", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        first_name: fn,
                        last_name: ln,
                        email: em,
                        status: "active",
                      }),
                    });

                    if (!res.ok) {
                      let msg = "Subscription failed. Please try again.";
                      try {
                        const data = await res.json();
                        msg = data?.detail || data?.message || msg;
                      } catch { }
                      pushToast({ type: "error", msg }, 4500);
                      setSubmitting(false);
                      return;
                    }

                    pushToast({ type: "success", msg: "Subscribed successfully." }, 3500);

                    setFirstName("");
                    setLastName("");
                    setEmail("");
                    setAgree(false);
                  } catch {
                    pushToast({ type: "error", msg: "Network error. Please try again." }, 4500);

                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                <div className="grid gap-2 sm:grid-cols-2">
                  <input
                    className="rounded-md border border-orange-200/55 bg-white/85 px-4 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-orange-400"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                  <input
                    className="rounded-md border border-orange-200/55 bg-white/85 px-4 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-orange-400"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>

                <div className="mt-2 flex items-stretch gap-2">
                  <input
                    className="w-full rounded-md border border-orange-200/55 bg-white/85 px-4 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-orange-400"
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md bg-orange-600 px-4 py-3 text-sm font-extrabold text-white shadow-[0_14px_34px_rgba(234,88,12,0.22)] ring-1 ring-orange-600/30 transition hover:-translate-y-0.5 hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
                  >
                    {submitting ? "Saving..." : "Subscribe"} <FiArrowUpRight />
                  </button>
                </div>

                <label className="mt-3 flex items-start gap-3 rounded-md border border-orange-200/40 bg-white/70 px-4 py-3">
                  <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} required />
                  <span className="text-xs font-semibold text-slate-600">
                    I agree to the{" "}
                    <Link className="font-extrabold text-orange-700" href="/privacy">
                      Privacy Policy
                    </Link>
                  </span>
                </label>

                {/* {toast ? (
                  <div
                    className={`mt-3 rounded-md border px-4 py-3 text-xs font-semibold ${toast.type === "success"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                        : "border-rose-200 bg-rose-50 text-rose-800"
                      }`}
                  >
                    {toast.msg}
                  </div>
                ) : null} */}
              </form>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-md border border-orange-200/50 bg-white/80 px-4 py-3 text-sm font-extrabold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
                >
                  Book an appointment <FiArrowUpRight className="ml-2" />
                </Link>
                <Link
                  href="/solutions"
                  className="inline-flex items-center justify-center rounded-md bg-orange-600 px-4 py-3 text-sm font-extrabold text-white shadow-[0_14px_34px_rgba(234,88,12,0.22)] ring-1 ring-orange-600/30 transition hover:-translate-y-0.5 hover:bg-orange-700"
                >
                  Explore solutions <FiArrowUpRight className="ml-2" />
                </Link>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            variants={wrap}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="mt-12 grid gap-10 rounded-md border border-orange-200/40 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(255,255,255,0.84))] p-7 shadow-[0_22px_80px_rgba(15,23,42,0.06)] backdrop-blur lg:grid-cols-4"
          >
            <motion.div variants={fade}>
              <div className="text-xs font-extrabold tracking-[0.18em] text-slate-900">HOME</div>
              <div className="mt-4 space-y-3">
                <Link href="/" className={navLink}>
                  <span className={navDot} />
                  <span className="relative">
                    Home <span className={navUnderline} />
                  </span>
                </Link>
                <Link href="/about" className={navLink}>
                  <span className={navDot} />
                  <span className="relative">
                    About Us <span className={navUnderline} />
                  </span>
                </Link>
                <Link href="/contact" className={navLink}>
                  <span className={navDot} />
                  <span className="relative">
                    Contact Us <span className={navUnderline} />
                  </span>
                </Link>
                <Link href="/contact" className={navLink}>
                  <span className={navDot} />
                  <span className="relative">
                    Support <span className={navUnderline} />
                  </span>
                </Link>
              </div>
            </motion.div>

            <motion.div variants={fade}>
              <div className="text-xs font-extrabold tracking-[0.18em] text-slate-900">PRODUCT</div>
              <div className="mt-4 space-y-3">
                <Link href="/arohio" className={navLink}>
                  <span className={navDot} />
                  <span className="relative">
                    Arohio.ai <span className={navUnderline} />
                  </span>
                </Link>
              </div>

              <div className="mt-6 text-xs font-extrabold tracking-[0.18em] text-slate-900">RESOURCES</div>
              <div className="mt-4 space-y-3">
                <Link href="/feedback" className={navLink}>
                  <span className={navDot} />
                  <span className="relative">
                    Feedback <span className={navUnderline} />
                  </span>
                </Link>
                <Link href="/blog" className={navLink}>
                  <span className={navDot} />
                  <span className="relative">
                    Blog <span className={navUnderline} />
                  </span>
                </Link>
                <Link href="/faqs" className={navLink}>
                  <span className={navDot} />
                  <span className="relative">
                    FAQs <span className={navUnderline} />
                  </span>
                </Link>
              </div>
            </motion.div>

            <motion.div variants={fade}>
              <div className="text-xs font-extrabold tracking-[0.18em] text-slate-900">SOLUTIONS</div>
              <div className="mt-4 space-y-3">
                {SOLUTION_CATEGORIES.map((c) => (
                  <Link key={c.title} href={c.href} className={navLink}>
                    <span className={navDot} />
                    <span className="relative">
                      {c.title}
                      <span className={navUnderline} />
                    </span>
                  </Link>
                ))}
              </div>
            </motion.div>

            <motion.div variants={fade}>
              <div className="text-xs font-extrabold tracking-[0.18em] text-slate-900">CONTACT</div>

              <div className="mt-4 space-y-3">
                <a
                  className="flex items-center gap-2 text-sm font-semibold text-slate-700 transition-colors duration-300 hover:text-slate-950"
                  href="mailto:info@nexografix.com"
                >
                  <FiMail className="text-orange-700" /> info@nexografix.com
                </a>
                <a
                  className="flex items-center gap-2 text-sm font-semibold text-slate-700 transition-colors duration-300 hover:text-slate-950"
                  href="tel:+919661284439"
                >
                  <FiPhone className="text-orange-700" /> India Office:- +91 9661284439
                </a>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <FiMapPin className="text-orange-700" /> India
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <a
                  href="https://www.linkedin.com/company/nexografix"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-orange-200/50 bg-white/80 text-slate-700 shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-orange-300/70 hover:bg-white hover:text-slate-950 hover:shadow-[0_16px_44px_rgba(234,88,12,0.12)]"
                >
                  <FiLinkedin />
                </a>
                <a
                  href="https://www.instagram.com/nexografix/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-orange-200/50 bg-white/80 text-slate-700 shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-orange-300/70 hover:bg-white hover:text-slate-950 hover:shadow-[0_16px_44px_rgba(234,88,12,0.12)]"
                >
                  <FiInstagram />
                </a>
                <a
                  href="https://www.facebook.com/nexografix/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-orange-200/50 bg-white/80 text-slate-700 shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-orange-300/70 hover:bg-white hover:text-slate-950 hover:shadow-[0_16px_44px_rgba(234,88,12,0.12)]"
                >
                  <FiFacebook />
                </a>
                <a
                  href={`https://wa.me/9661284439?text=${encodeURIComponent(
                    "Hello Nexografix team, I’d like to know more about your AI-enabled publishing and automation services."
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="WhatsApp"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-orange-200/50 bg-white/80 text-slate-700 shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-orange-300/70 hover:bg-white hover:text-slate-950 hover:shadow-[0_16px_44px_rgba(234,88,12,0.12)]"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M12.04 2a9.94 9.94 0 0 0-8.45 15.28L2 22l4.88-1.57A9.95 9.95 0 1 0 12.04 2zm5.78 14.43c-.24.68-1.4 1.3-1.92 1.35-.49.04-1.11.06-1.79-.12-.41-.11-.94-.31-1.63-.6-2.87-1.24-4.74-4.15-4.88-4.34-.13-.19-1.16-1.55-1.16-2.95 0-1.4.74-2.08 1-2.36.26-.28.57-.35.76-.35.19 0 .38 0 .55.01.18.01.42-.07.66.5.24.58.82 2.01.9 2.16.08.15.13.32.02.51-.11.19-.17.32-.33.49-.16.17-.34.38-.49.51-.16.13-.33.27-.14.53.19.26.86 1.42 1.85 2.3 1.27 1.13 2.34 1.48 2.68 1.65.34.17.54.14.74-.09.2-.24.85-.99 1.08-1.33.23-.34.46-.28.77-.17.31.11 1.97.93 2.31 1.1.34.17.57.26.65.41.08.15.08.86-.16 1.54z" />
                  </svg>
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <div className="md:hidden">
          <motion.div
            variants={wrap}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="rounded-md border border-orange-200/40 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(255,255,255,0.84))] p-6 shadow-[0_22px_80px_rgba(15,23,42,0.06)] backdrop-blur"
          >
            <motion.div variants={fade}>
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-200/60 bg-white/80 px-4 py-2 text-[11px] font-extrabold tracking-[0.22em] text-orange-700 shadow-sm backdrop-blur">
                NEXOGRAFIX
              </div>

              <div className="mt-4 text-xl font-extrabold tracking-tight text-slate-900">
                AI-enabled services for publishing, content, assessments & automation.
              </div>

              <p className="mt-2 text-sm font-semibold leading-relaxed text-slate-600">
                Enterprise delivery standards with clean architecture, clear milestones, and disciplined QA — built to
                scale.
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {[
                  { k: "Publishing", v: "Workflow platforms" },
                  { k: "Assessments", v: "Delivery + governance" },
                  { k: "Automation", v: "AI-led operations" },
                ].map((x) => (
                  <div
                    key={x.k}
                    className="rounded-md border border-orange-200/40 bg-white/80 p-4 shadow-[0_16px_50px_rgba(15,23,42,0.06)]"
                  >
                    <div className="text-xs font-extrabold text-slate-900">{x.k}</div>
                    <div className="mt-1 text-xs font-semibold text-slate-600">{x.v}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 h-px w-full bg-linear-to-r from-transparent via-orange-200/70 to-transparent" />

              <div className="mt-6 text-xs font-extrabold tracking-[0.18em] text-slate-900">CONTACT</div>

              <div className="mt-4 space-y-3">
                <a
                  className="flex items-center gap-2 text-sm font-semibold text-slate-700 transition-colors duration-300 hover:text-slate-950"
                  href="mailto:info@nexografix.com"
                >
                  <FiMail className="text-orange-700" /> info@nexografix.com
                </a>
                <a
                  className="flex items-center gap-2 text-sm font-semibold text-slate-700 transition-colors duration-300 hover:text-slate-950"
                  href="tel:+919661284439"
                >
                  <FiPhone className="text-orange-700" /> India Office:- +91 9661284439
                </a>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <FiMapPin className="text-orange-700" /> India
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <a
                  href="https://www.linkedin.com/company/nexografix"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-orange-200/50 bg-white/80 text-slate-700 shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-orange-300/70 hover:bg-white hover:text-slate-950 hover:shadow-[0_16px_44px_rgba(234,88,12,0.12)]"
                >
                  <FiLinkedin />
                </a>
                <a
                  href="https://www.instagram.com/nexografix/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-orange-200/50 bg-white/80 text-slate-700 shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-orange-300/70 hover:bg-white hover:text-slate-950 hover:shadow-[0_16px_44px_rgba(234,88,12,0.12)]"
                >
                  <FiInstagram />
                </a>
                <a
                  href="https://www.facebook.com/nexografix/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-orange-200/50 bg-white/80 text-slate-700 shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-orange-300/70 hover:bg-white hover:text-slate-950 hover:shadow-[0_16px_44px_rgba(234,88,12,0.12)]"
                >
                  <FiFacebook />
                </a>
              </div>

              <div className="mt-6 h-px w-full bg-linear-to-r from-transparent via-orange-200/70 to-transparent" />

              <div className="mt-4 flex flex-col items-start justify-between gap-3 text-sm font-semibold text-slate-600">
                <div>© {new Date().getFullYear()} Nexografix. All rights reserved.</div>

                <div className="flex flex-wrap items-center gap-3">
                  <Link className="group relative font-extrabold text-orange-500 transition-colors hover:text-orange-800" href="/privacy">
                    Privacy Policy
                    <span className="pointer-events-none absolute -bottom-1 left-0 h-0.5 w-full origin-left scale-x-0 bg-linear-to-r from-orange-600 to-orange-400 transition-transform duration-300 ease-out group-hover:scale-x-100" />
                  </Link>
                  <span className="text-orange-200">|</span>
                  <Link className="group relative font-extrabold text-orange-500 transition-colors hover:text-orange-800" href="/terms">
                    Terms of Service
                    <span className="pointer-events-none absolute -bottom-1 left-0 h-0.5 w-full origin-left scale-x-0 bg-linear-to-r from-orange-600 to-orange-400 transition-transform duration-300 ease-out group-hover:scale-x-100" />
                  </Link>
                  <span className="text-orange-200">|</span>
                  <Link className="group relative font-extrabold text-orange-500 transition-colors hover:text-orange-800" href="/refund">
                    Refund Policy
                    <span className="pointer-events-none absolute -bottom-1 left-0 h-0.5 w-full origin-left scale-x-0 bg-linear-to-r from-orange-600 to-orange-400 transition-transform duration-300 ease-out group-hover:scale-x-100" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <div className="hidden md:block">
          <div className="mt-10 h-px w-full bg-linear-to-r from-transparent via-orange-200/70 to-transparent" />
          <motion.div
            variants={wrap}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="mt-6 flex flex-col items-start justify-between gap-4 text-sm font-semibold text-slate-600 sm:flex-row sm:items-center"
          >
            <motion.div variants={fade}>© {new Date().getFullYear()} Nexografix. All rights reserved.</motion.div>

            <motion.div variants={fade} className="flex flex-wrap items-center gap-3">
              <Link className="group relative font-extrabold text-orange-500 transition-colors hover:text-orange-800" href="/privacy">
                Privacy Policy
                <span className="pointer-events-none absolute -bottom-1 left-0 h-0.5 w-full origin-left scale-x-0 bg-linear-to-r from-orange-600 to-orange-400 transition-transform duration-300 ease-out group-hover:scale-x-100" />
              </Link>
              <span className="text-orange-200">|</span>
              <Link className="group relative font-extrabold text-orange-500 transition-colors hover:text-orange-800" href="/terms">
                Terms of Service
                <span className="pointer-events-none absolute -bottom-1 left-0 h-0.5 w-full origin-left scale-x-0 bg-linear-to-r from-orange-600 to-orange-400 transition-transform duration-300 ease-out group-hover:scale-x-100" />
              </Link>
              <span className="text-orange-200">|</span>
              <Link className="group relative font-extrabold text-orange-500 transition-colors hover:text-orange-800" href="/refund">
                Refund Policy
                <span className="pointer-events-none absolute -bottom-1 left-0 h-0.5 w-full origin-left scale-x-0 bg-linear-to-r from-orange-600 to-orange-400 transition-transform duration-300 ease-out group-hover:scale-x-100" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
      <ToastTopRight toast={toast} onClose={() => setToast(null)} duration={4000} />
    </footer>
  );
}
