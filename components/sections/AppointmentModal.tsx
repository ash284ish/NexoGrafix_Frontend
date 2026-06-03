"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type AppointmentFormValues = {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  service: string;
  timeline: string;
  message: string;
};

const overlayV = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalV = {
  hidden: { opacity: 0, y: 18, scale: 0.98, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, y: 10, scale: 0.98, filter: "blur(6px)" },
};

export default function AppointmentModal() {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const initialValues = useMemo<AppointmentFormValues>(
    () => ({
      fullName: "",
      email: "",
      phone: "",
      company: "",
      role: "",
      service: "AI Platforms (Arohio.ai)",
      timeline: "Within 2 weeks",
      message: "",
    }),
    []
  );

  const [values, setValues] = useState<AppointmentFormValues>(initialValues);
  const firstFieldRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const t = setTimeout(() => firstFieldRef.current?.focus(), 50);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      setSubmitting(false);
      setSuccess(false);
      setValues(initialValues);
    }
  }, [open, initialValues]);

  const onChange = (k: keyof AppointmentFormValues) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setValues((p) => ({ ...p, [k]: e.target.value }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);

    try {
      await new Promise((r) => setTimeout(r, 900));
      setSuccess(true);
      setTimeout(() => setOpen(false), 1100);

      // TODO: Replace with your API call
      // await fetch("/api/appointments", { method: "POST", body: JSON.stringify(values) })
    } catch {
      setSubmitting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center gap-2 rounded-md bg-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(234,88,12,0.22)] ring-1 ring-orange-600/30 transition hover:-translate-y-0.5 hover:bg-orange-700 hover:shadow-[0_16px_44px_rgba(234,88,12,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50"
      >
        Make an Appointment <span aria-hidden>→</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial="hidden"
            animate="show"
            exit="exit"
            variants={overlayV}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="fixed inset-0 z-[80]"
            aria-modal="true"
            role="dialog"
          >
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-md"
              onClick={() => setOpen(false)}
            />

            <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6">
              <motion.div
                variants={modalV}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="relative w-full max-w-2xl overflow-hidden rounded-md bg-white shadow-[0_30px_90px_rgba(0,0,0,0.22)] ring-1 ring-orange-200/70"
              >
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-orange-200/40 blur-3xl" />
                  <div className="absolute -right-20 top-10 h-64 w-64 rounded-full bg-orange-300/25 blur-3xl" />
                </div>

                <div className="relative flex items-center justify-between border-b border-orange-100 px-5 py-4 sm:px-6">
                  <div className="min-w-0">
                    <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-[11px] font-semibold tracking-wide text-orange-700 ring-1 ring-orange-200">
                      BOOK A DEMO
                    </div>
                    <h3 className="mt-2 text-lg font-bold text-slate-900 sm:text-xl">
                      Let’s plan your appointment
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      Share basic details — we’ll reach out with the next steps.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="ml-4 inline-flex h-10 w-10 items-center justify-center rounded-md bg-white text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50"
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={onSubmit} className="relative px-5 py-5 sm:px-6 sm:py-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                      <label className="text-xs font-semibold text-slate-900">Full name</label>
                      <input
                        ref={firstFieldRef}
                        value={values.fullName}
                        onChange={onChange("fullName")}
                        required
                        className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none ring-orange-200 transition focus:border-orange-300 focus:ring-4"
                        placeholder="Your name"
                      />
                    </div>

                    <div className="sm:col-span-1">
                      <label className="text-xs font-semibold text-slate-900">Work email</label>
                      <input
                        value={values.email}
                        onChange={onChange("email")}
                        required
                        type="email"
                        className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none ring-orange-200 transition focus:border-orange-300 focus:ring-4"
                        placeholder="name@company.com"
                      />
                    </div>

                    <div className="sm:col-span-1">
                      <label className="text-xs font-semibold text-slate-900">Phone</label>
                      <input
                        value={values.phone}
                        onChange={onChange("phone")}
                        required
                        className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none ring-orange-200 transition focus:border-orange-300 focus:ring-4"
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>

                    <div className="sm:col-span-1">
                      <label className="text-xs font-semibold text-slate-900">Company</label>
                      <input
                        value={values.company}
                        onChange={onChange("company")}
                        className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none ring-orange-200 transition focus:border-orange-300 focus:ring-4"
                        placeholder="Organization name"
                      />
                    </div>

                    <div className="sm:col-span-1">
                      <label className="text-xs font-semibold text-slate-900">Role</label>
                      <input
                        value={values.role}
                        onChange={onChange("role")}
                        className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none ring-orange-200 transition focus:border-orange-300 focus:ring-4"
                        placeholder="e.g. Product / Ops / CTO"
                      />
                    </div>

                    <div className="sm:col-span-1">
                      <label className="text-xs font-semibold text-slate-900">Service</label>
                      <select
                        value={values.service}
                        onChange={onChange("service")}
                        className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none ring-orange-200 transition focus:border-orange-300 focus:ring-4"
                      >
                        <option>AI Platforms (Arohio.ai)</option>
                        <option>Publishing & Content Workflows</option>
                        <option>Assessments & Evaluation Systems</option>
                        <option>Web Development</option>
                        <option>Mobile App Development</option>
                        <option>Enterprise Automation</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-slate-900">Preferred timeline</label>
                      <select
                        value={values.timeline}
                        onChange={onChange("timeline")}
                        className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none ring-orange-200 transition focus:border-orange-300 focus:ring-4"
                      >
                        <option>Within 2 weeks</option>
                        <option>Within 1 month</option>
                        <option>1–3 months</option>
                        <option>Just exploring</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-slate-900">Message</label>
                      <textarea
                        value={values.message}
                        onChange={onChange("message")}
                        rows={4}
                        className="mt-2 w-full resize-none rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none ring-orange-200 transition focus:border-orange-300 focus:ring-4"
                        placeholder="Tell us what you’re building / what outcome you want…"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-slate-600">
                      By submitting, you agree to be contacted regarding your request.
                    </p>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="inline-flex items-center justify-center rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 transition hover:bg-slate-50"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex items-center justify-center gap-2 rounded-md bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(234,88,12,0.20)] ring-1 ring-orange-600/30 transition hover:-translate-y-0.5 hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {success ? "Submitted ✓" : submitting ? "Submitting..." : "Submit"}
                      </button>
                    </div>
                  </div>
                </form>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
