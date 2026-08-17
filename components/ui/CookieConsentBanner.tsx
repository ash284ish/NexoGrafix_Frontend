"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiShield, FiCheck, FiX, FiSliders, FiLock, FiInfo, FiChevronDown, FiChevronUp, FiExternalLink } from "react-icons/fi";
import { buildApiUrl, getApiBaseUrl } from "@/lib/apiUrl";

type CategoryState = {
  necessary: boolean; // Always true
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
};

type StoredConsent = {
  status: "accepted_all" | "rejected_optional" | "customized";
  categories: CategoryState;
  timestamp: string;
  version: string;
};

const STORAGE_KEY = "nexografix_cookie_consent_session";

export default function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showPolicyText, setShowPolicyText] = useState(false);

  const [categories, setCategories] = useState<CategoryState>({
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // 1. General visitor traffic telemetry for CRM
    try {
      const url = buildApiUrl(getApiBaseUrl(), "/api/v1/cookie-consent");
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "visitor_pageview",
          page_path: typeof window !== "undefined" ? window.location.pathname : "/",
        }),
      }).catch(() => null);
    } catch {}

    // 2. Session Banner Check
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (!stored) {
        const timer = setTimeout(() => setShowBanner(true), 400);
        return () => clearTimeout(timer);
      } else {
        const parsed: StoredConsent = JSON.parse(stored);
        if (parsed?.categories) {
          setCategories(parsed.categories);
        }
      }
    } catch {
      setShowBanner(true);
    }
  }, []);

  async function postConsentToCrm(
    status: "accepted_all" | "rejected_optional" | "customized",
    cat: CategoryState
  ) {
    try {
      const url = buildApiUrl(getApiBaseUrl(), "/api/v1/cookie-consent");
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          categories: cat,
          page_path: typeof window !== "undefined" ? window.location.pathname : "/",
        }),
      });
    } catch (err) {
      console.warn("Failed to log cookie consent to server", err);
    }
  }

  function savePreferences(
    status: "accepted_all" | "rejected_optional" | "customized",
    cat: CategoryState
  ) {
    const payload: StoredConsent = {
      status,
      categories: cat,
      timestamp: new Date().toISOString(),
      version: "2.0",
    };

    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {}

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("cookieConsentChanged", { detail: payload })
      );
    }

    postConsentToCrm(status, cat);

    setShowBanner(false);
    setShowModal(false);
  }

  function handleAcceptAll() {
    const allOn: CategoryState = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    };
    setCategories(allOn);
    savePreferences("accepted_all", allOn);
  }

  function handleRejectOptional() {
    const essentialOnly: CategoryState = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    };
    setCategories(essentialOnly);
    savePreferences("rejected_optional", essentialOnly);
  }

  function handleSaveCustom() {
    savePreferences("customized", categories);
  }

  return (
    <>
      {/* 1. Full-Width Bottom Cookie Bar with Generous Height & Direct Privacy Link */}
      <AnimatePresence>
        {showBanner && !showModal && (
          <motion.div
            initial={{ y: 90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 90, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-0 inset-x-0 z-50 w-full border-t-2 border-orange-300/90 bg-white/98 text-slate-900 shadow-2xl backdrop-blur-lg pointer-events-auto"
            aria-label="Cookie Consent Banner"
          >
            <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-5 py-4 sm:px-8 sm:py-5 md:flex-row md:items-center">
              {/* Left: Icon + Bold Title + Detailed Info & Privacy Policy Link */}
              <div className="flex items-start gap-3.5 min-w-0 flex-1">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600 border border-orange-200 shadow-xs">
                  <FiShield className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
                      We Value Your Privacy
                    </h3>
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                      GDPR Compliant
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                    Nexografix Private Limited uses cookies to secure services, enable core functionality, and optimize performance. No optional tracking occurs without explicit permission. Learn more in our{" "}
                    <Link
                      href="/privacy-policy"
                      className="font-bold text-orange-600 underline underline-offset-2 hover:text-orange-700 transition-colors inline-flex items-center gap-0.5"
                    >
                      Privacy Policy
                      <FiExternalLink className="h-3 w-3 inline" />
                    </Link>.
                  </p>
                </div>
              </div>

              {/* Right: Action Buttons */}
              <div className="flex shrink-0 items-center justify-end gap-2.5 w-full md:w-auto pt-1 md:pt-0">
                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition"
                >
                  <FiSliders className="h-3.5 w-3.5 text-slate-500" />
                  Customize
                </button>

                <button
                  type="button"
                  onClick={handleRejectOptional}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition"
                >
                  Reject Optional
                </button>

                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-orange-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-orange-700 transition"
                >
                  <FiCheck className="h-3.5 w-3.5" />
                  Accept All
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Cookie Customization & Policy Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 10 }}
              className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-white text-slate-900 shadow-2xl ring-1 ring-slate-200 max-h-[85vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-orange-100/80 px-5 py-3.5 bg-[#FFF7ED]/60">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                    <FiShield className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-extrabold text-slate-900">Cookie Preferences & Governance</h2>
                    <p className="text-[11px] text-slate-500">Nexografix Private Limited • Privacy Notice v2.0</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                >
                  <FiX className="h-4 w-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="overflow-y-auto px-5 py-4 space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  We respect your right to privacy. Select which categories of cookies you permit us to use. Strictly necessary cookies are mandatory for security and session operation. Read our full{" "}
                  <Link href="/privacy-policy" target="_blank" className="font-bold text-orange-600 underline">
                    Privacy Policy
                  </Link>{" "}
                  for details.
                </p>

                {/* Collapsible Cookie Policy Details */}
                <div className="rounded-xl border border-orange-200/80 bg-orange-50/50 p-3">
                  <button
                    type="button"
                    onClick={() => setShowPolicyText((v) => !v)}
                    className="flex w-full items-center justify-between text-xs font-semibold text-orange-950"
                  >
                    <span className="flex items-center gap-2">
                      <FiInfo className="h-4 w-4 text-orange-600" />
                      Read Full Cookie & Privacy Policy Summary
                    </span>
                    {showPolicyText ? <FiChevronUp /> : <FiChevronDown />}
                  </button>

                  {showPolicyText && (
                    <div className="mt-2.5 border-t border-orange-200/60 pt-2.5 text-[11px] text-slate-700 space-y-2 leading-relaxed max-h-44 overflow-y-auto pr-1">
                      <p>
                        <strong>Nexografix Privacy & Cookie Governance:</strong> In compliance with UK GDPR, EU ePrivacy Directive, and Digital Personal Data Protection Act (India), Nexografix Private Limited operates with complete transparency.
                      </p>
                      <ul className="list-disc pl-4 space-y-1">
                        <li><strong>Strictly Necessary:</strong> Mandatory for security, session authentication, rate limiting, and page functions.</li>
                        <li><strong>Performance & Analytics:</strong> Aggregated, anonymized statistics measuring load speeds and visitor flow without tracking individuals.</li>
                        <li><strong>Functional:</strong> Stores preferences such as regional settings and form inputs.</li>
                        <li><strong>No Unauthorized Data Capture:</strong> No personal data is sold or processed without consent. Customer data is NEVER used to train public AI models.</li>
                      </ul>
                      <p>
                        For full details, visit our{" "}
                        <Link href="/privacy-policy" target="_blank" className="font-bold text-orange-600 underline">
                          Privacy Policy Page
                        </Link>.
                      </p>
                    </div>
                  )}
                </div>

                {/* Toggles */}
                <div className="space-y-2.5">
                  {/* Necessary */}
                  <div className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">Strictly Necessary</span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                          <FiLock className="h-3 w-3" /> Always Active
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Essential for security, authentication, and core page operations.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={true}
                      disabled={true}
                      className="mt-1 h-4 w-4 rounded text-orange-600 focus:ring-orange-500 cursor-not-allowed opacity-60"
                    />
                  </div>

                  {/* Functional */}
                  <div className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 p-3 hover:border-slate-300">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-900">Functional Cookies</span>
                      <p className="text-[11px] text-slate-500">
                        Saves personal preferences and site customizations.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={categories.functional}
                      onChange={(e) =>
                        setCategories((prev) => ({
                          ...prev,
                          functional: e.target.checked,
                        }))
                      }
                      className="mt-1 h-4 w-4 cursor-pointer rounded text-orange-600 focus:ring-orange-500"
                    />
                  </div>

                  {/* Analytics */}
                  <div className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 p-3 hover:border-slate-300">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-900">Performance & Analytics</span>
                      <p className="text-[11px] text-slate-500">
                        Aggregated metrics to help us optimize site performance.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={categories.analytics}
                      onChange={(e) =>
                        setCategories((prev) => ({
                          ...prev,
                          analytics: e.target.checked,
                        }))
                      }
                      className="mt-1 h-4 w-4 cursor-pointer rounded text-orange-600 focus:ring-orange-500"
                    />
                  </div>

                  {/* Marketing */}
                  <div className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 p-3 hover:border-slate-300">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-900">Marketing & Outreach</span>
                      <p className="text-[11px] text-slate-500">
                        Tailored announcements regarding Nexografix services.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={categories.marketing}
                      onChange={(e) =>
                        setCategories((prev) => ({
                          ...prev,
                          marketing: e.target.checked,
                        }))
                      }
                      className="mt-1 h-4 w-4 cursor-pointer rounded text-orange-600 focus:ring-orange-500"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-5 py-3.5 bg-slate-50/50">
                <button
                  type="button"
                  onClick={handleRejectOptional}
                  className="rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Reject Optional
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSaveCustom}
                    className="rounded-lg border border-slate-800 bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
                  >
                    Save Preferences
                  </button>
                  <button
                    type="button"
                    onClick={handleAcceptAll}
                    className="rounded-lg bg-orange-600 px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-orange-700"
                  >
                    Accept All
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
