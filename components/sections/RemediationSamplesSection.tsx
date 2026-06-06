"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiFileText, FiCheckCircle, FiAlertCircle, FiEye, FiActivity } from "react-icons/fi";

const EASE = [0.22, 1, 0.36, 1];

export default function RemediationSamplesSection() {
    const [activeTab, setActiveTab] = useState<"remediation" | "report">("remediation");

    return (
        <section className="mt-24">
            <div className="text-center mb-12">
                <span className="inline-flex items-center rounded-full bg-orange-50 px-3 py-1 text-xs font-extrabold tracking-widest text-orange-600 ring-1 ring-inset ring-orange-200">
                    QUALITY PROOF
                </span>
                <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                    Proof of Output Quality
                </h2>
                <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto font-medium">
                    See how we transform "flat" non-accessible documents into fully tagged, 
                    standards-compliant assets with clear reading order and semantic structure.
                </p>
            </div>

            <div className="mx-auto max-w-5xl">
                <div className="flex items-center justify-center gap-4 mb-8">
                    <button
                        onClick={() => setActiveTab("remediation")}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-md text-sm font-extrabold transition-all ${
                            activeTab === "remediation"
                                ? "bg-slate-900 text-white shadow-lg"
                                : "bg-white text-slate-600 border border-slate-200 hover:border-orange-300"
                        }`}
                    >
                        <FiEye /> Before / After Remediation
                    </button>
                    <button
                        onClick={() => setActiveTab("report")}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-md text-sm font-extrabold transition-all ${
                            activeTab === "report"
                                ? "bg-slate-900 text-white shadow-lg"
                                : "bg-white text-slate-600 border border-slate-200 hover:border-orange-300"
                        }`}
                    >
                        <FiActivity /> Sample Compliance Report
                    </button>
                </div>

                <div className="relative rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_30px_100px_rgba(15,23,42,0.08)] md:p-8">
                    <AnimatePresence mode="wait">
                        {activeTab === "remediation" ? (
                            <motion.div
                                key="remediation"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.4, ease: EASE }}
                                className="grid gap-8 lg:grid-cols-2"
                            >
                                {/* Before */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="text-xs font-black uppercase tracking-widest text-slate-500">Source (Non-Accessible)</div>
                                        <div className="flex items-center gap-1.5 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-600 ring-1 ring-inset ring-red-200">
                                            <FiAlertCircle /> 0 Tags Found
                                        </div>
                                    </div>
                                    <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-6 opacity-60 grayscale shadow-inner">
                                        <div className="space-y-4">
                                            <div className="h-6 w-3/4 bg-slate-200" />
                                            <div className="h-4 w-full bg-slate-200" />
                                            <div className="h-4 w-full bg-slate-200" />
                                            <div className="h-32 w-full rounded-md bg-slate-200" />
                                            <div className="h-4 w-5/6 bg-slate-200" />
                                            <div className="h-4 w-full bg-slate-200" />
                                        </div>
                                        <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[1px]">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Untagged "Flat" Content</span>
                                        </div>
                                    </div>
                                </div>

                                {/* After */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="text-xs font-black uppercase tracking-widest text-orange-600">Remediated (Accessible)</div>
                                        <div className="flex items-center gap-1.5 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-bold text-green-600 ring-1 ring-inset ring-green-200">
                                            <FiCheckCircle /> PDF/UA Compliant
                                        </div>
                                    </div>
                                    <div className="relative aspect-[3/4] overflow-hidden rounded-xl border-2 border-orange-100 bg-white p-6 shadow-sm">
                                        <div className="space-y-4">
                                            <div className="relative">
                                                <div className="absolute -left-4 -top-1 rounded bg-orange-600 px-1 text-[8px] font-bold text-white">&lt;H1&gt;</div>
                                                <div className="h-6 w-3/4 bg-slate-900/10" />
                                            </div>
                                            <div className="relative">
                                                <div className="absolute -left-4 -top-1 rounded bg-slate-600 px-1 text-[8px] font-bold text-white">&lt;P&gt;</div>
                                                <div className="h-4 w-full bg-slate-400/10" />
                                            </div>
                                            <div className="relative">
                                                <div className="absolute -left-4 -top-1 rounded bg-slate-600 px-1 text-[8px] font-bold text-white">&lt;P&gt;</div>
                                                <div className="h-4 w-full bg-slate-400/10" />
                                            </div>
                                            <div className="relative">
                                                <div className="absolute -left-4 -top-1 rounded bg-blue-600 px-1 text-[8px] font-bold text-white">&lt;Figure&gt;</div>
                                                <div className="absolute right-2 top-2 rounded bg-green-600 px-1 text-[8px] font-bold text-white">Alt: Chart showing...</div>
                                                <div className="h-32 w-full rounded-md bg-slate-200/50 border border-blue-200" />
                                            </div>
                                            <div className="relative">
                                                <div className="absolute -left-4 -top-1 rounded bg-slate-600 px-1 text-[8px] font-bold text-white">&lt;P&gt;</div>
                                                <div className="h-4 w-5/6 bg-slate-400/10" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="report"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.4, ease: EASE }}
                                className="space-y-6"
                            >
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="space-y-1">
                                        <h4 className="text-lg font-extrabold text-slate-900">PAC 2021 Validation Report</h4>
                                        <p className="text-sm font-semibold text-slate-500">Automated accessibility check for PDF/UA (ISO 14289-1)</p>
                                    </div>
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600 ring-4 ring-green-100">
                                        <span className="text-xl font-black">PASS</span>
                                    </div>
                                </div>

                                <div className="divide-y divide-slate-100 rounded-xl border border-slate-100 bg-slate-50/50">
                                    {[
                                        { check: "PDF/UA - Machine-readable", status: "Pass", details: "File structure is valid and navigable." },
                                        { check: "Document Syntax (Tags)", status: "Pass", details: "All content is properly contained within tag structure." },
                                        { check: "Logical Reading Order", status: "Pass", details: "Reading order matches visual flow perfectly." },
                                        { check: "Alternative Text (Images)", status: "Pass", details: "All non-text elements have meaningful descriptions." },
                                        { check: "Table Structure & Scope", status: "Pass", details: "Headers and scopes correctly mapped for assistive tech." },
                                        { check: "Metadata & Language", status: "Pass", details: "Title, Author, and primary language tags correctly set." },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-start justify-between p-4 transition hover:bg-white">
                                            <div className="space-y-0.5">
                                                <div className="text-sm font-extrabold text-slate-900">{item.check}</div>
                                                <div className="text-xs font-semibold text-slate-500">{item.details}</div>
                                            </div>
                                            <div className="flex items-center gap-1 text-[11px] font-black uppercase text-green-600">
                                                <FiCheckCircle /> PASSED
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex items-center gap-2 rounded-lg bg-orange-50 p-4 text-xs font-semibold text-orange-800 border border-orange-100">
                                    <FiActivity className="h-4 w-4 shrink-0" />
                                    <span>
                                        Every project includes a full validation report (PAC 2021, Adobe Acrobat Check, or Matterhorn Protocol) ensuring 100% compliance before delivery.
                                    </span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
