"use client";

import React, { useEffect, useState } from "react";
import { FiSave, FiAlertTriangle, FiEdit, FiLayers, FiBriefcase, FiList, FiDatabase, FiLock } from "react-icons/fi";
import SectionHeader from "@/components/dashboard/assets/SectionHeader";
import ToastTopRight from "@/components/ui/Toast";

type CmsData = {
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    cta: {
      primary: { label: string; href: string };
      secondary: { label: string; href: string };
    };
  };
  capabilities: {
    eyebrow: string;
    title: string;
    items: { title: string; desc: string }[];
  };
  samples: {
    eyebrow: string;
    title: string;
    items: {
      id: string;
      eyebrow: string;
      title: string;
      meta: string;
      tags: string[];
      showGrid?: { title: string; desc: string }[];
      primaryCta: { label: string; href: string };
      secondaryCta: { label: string; href: string };
      reportCta?: { label: string; href: string };
      inlineCta: { text: string; linkText: string; href: string };
    }[];
  };
  altText: {
    eyebrow: string;
    title: string;
    table: { type: string; shortAlt: string; longDesc: string }[];
  };
  beforeAfter: {
    eyebrow: string;
    title: string;
    items: { beforeTitle: string; beforeDesc: string; afterTitle: string; afterDesc: string }[];
  };
  privateSamples: {
    eyebrow: string;
    title: string;
    card: {
      path: string;
      desc: string;
      btnLabel: string;
      note: string;
      password?: string;
      items: { title: string; desc: string }[];
    };
  };
  leadGen: {
    eyebrow: string;
    title: string;
    desc: string;
  };
};

export default function SamplesCmsPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

  const [data, setData] = useState<CmsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"visual" | "raw">("visual");
  const [rawJson, setRawJson] = useState("");
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
  };

  useEffect(() => {
    fetch(`${API_BASE}/api/v1/content/samples`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load CMS content");
        return res.json();
      })
      .then((json) => {
        if (json && !json.error) {
          setData(json as CmsData);
          setRawJson(JSON.stringify(json, null, 2));
        }
      })
      .catch((err) => {
        console.error(err);
        showToast("error", "Failed to load samples CMS content.");
      })
      .finally(() => setLoading(false));
  }, [API_BASE]);

  const handleRawChange = (val: string) => {
    setRawJson(val);
    try {
      const parsed = JSON.parse(val);
      setData(parsed);
      setJsonError(null);
    } catch (err: any) {
      setJsonError(err.message || "Invalid JSON syntax");
    }
  };

  const handleSave = async () => {
    if (jsonError) {
      showToast("error", "Cannot save. Please fix the JSON syntax errors first.");
      return;
    }
    if (!data) return;

    setSubmitting(true);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${API_BASE}/api/v1/content/samples`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Save request failed");

      showToast("success", "Samples portfolio page updated successfully!");
      setRawJson(JSON.stringify(data, null, 2));
    } catch (err) {
      console.error(err);
      showToast("error", "Failed to save content updates.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleHeroChange = (field: string, val: string) => {
    if (!data) return;
    const cloned = { ...data };
    if (field === "title") cloned.hero.title = val;
    if (field === "subtitle") cloned.hero.subtitle = val;
    if (field === "eyebrow") cloned.hero.eyebrow = val;
    setData(cloned);
    setRawJson(JSON.stringify(cloned, null, 2));
  };

  const handlePrivatePasswordChange = (val: string) => {
    if (!data) return;
    const cloned = { ...data };
    cloned.privateSamples.card.password = val;
    setData(cloned);
    setRawJson(JSON.stringify(cloned, null, 2));
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-lg font-bold text-slate-600">Loading samples configuration...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <ToastTopRight toast={toast} onClose={() => setToast(null)} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SectionHeader
          title="Samples Portfolio Page (CMS)"
          subtitle="Configure the public sample directory, lead form, alt-text table, and password-protected client portal."
        />
        <button
          onClick={handleSave}
          disabled={submitting || !!jsonError}
          className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-orange-600/20 hover:bg-orange-700 disabled:opacity-50 transition"
        >
          <FiSave /> {submitting ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab("visual")}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 text-sm font-bold transition ${
            activeTab === "visual"
              ? "border-orange-600 text-orange-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <FiEdit /> Editor Form
        </button>
        <button
          onClick={() => setActiveTab("raw")}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 text-sm font-bold transition ${
            activeTab === "raw"
              ? "border-orange-600 text-orange-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <FiDatabase /> Raw JSON Config
        </button>
      </div>

      {activeTab === "raw" ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Edit the samples structure configuration directly below.</span>
            {jsonError && (
              <span className="flex items-center gap-1 text-red-600 font-semibold">
                <FiAlertTriangle /> {jsonError}
              </span>
            )}
          </div>
          <textarea
            value={rawJson}
            onChange={(e) => handleRawChange(e.target.value)}
            rows={25}
            className="w-full font-mono text-sm p-4 border rounded-xl bg-slate-900 text-slate-100 outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Hero Section */}
          <div className="p-6 border border-slate-200 rounded-2xl bg-white space-y-4">
            <h3 className="flex items-center gap-2 font-bold text-slate-900 border-b pb-2">
              <FiLayers className="text-orange-600" /> Hero & Introduction
            </h3>
            <label className="flex flex-col gap-1.5 text-sm font-semibold text-slate-700">
              Hero Eyebrow
              <input
                type="text"
                value={data?.hero?.eyebrow || ""}
                onChange={(e) => handleHeroChange("eyebrow", e.target.value)}
                className="w-full px-3 py-2 border rounded-lg outline-none focus:border-orange-500 font-normal text-slate-900"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-semibold text-slate-700">
              Hero Headline
              <input
                type="text"
                value={data?.hero?.title || ""}
                onChange={(e) => handleHeroChange("title", e.target.value)}
                className="w-full px-3 py-2 border rounded-lg outline-none focus:border-orange-500 font-normal text-slate-900"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-semibold text-slate-700">
              Hero Description Subtitle
              <textarea
                value={data?.hero?.subtitle || ""}
                onChange={(e) => handleHeroChange("subtitle", e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg outline-none focus:border-orange-500 font-normal text-slate-900"
              />
            </label>
          </div>

          {/* Security Gate settings */}
          <div className="p-6 border border-slate-200 rounded-2xl bg-white space-y-4">
            <h3 className="flex items-center gap-2 font-bold text-slate-900 border-b pb-2">
              <FiLock className="text-orange-600" /> NDA Private Gate Security
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Configure access credentials for prospective clients reviewing confidential sample work.
            </p>
            <label className="flex flex-col gap-1.5 text-sm font-semibold text-slate-700">
              Client Portal Password
              <input
                type="text"
                value={data?.privateSamples?.card?.password || ""}
                onChange={(e) => handlePrivatePasswordChange(e.target.value)}
                placeholder="NexoPrivate2026"
                className="w-full px-3 py-2 border rounded-lg outline-none focus:border-orange-500 font-normal text-slate-900"
              />
            </label>
            <div className="p-4 rounded-lg bg-orange-50 border border-orange-200/50 text-xs text-orange-800 leading-relaxed">
              <strong className="block mb-1">How it works:</strong>
              When users visit the <code>/samples/private</code> subroute, they will be prompted to enter this password. 
              Upon success, the browser unlocks the Microsoft and publisher confidential portfolio views.
            </div>
          </div>

          {/* Quick Info card */}
          <div className="lg:col-span-2 p-6 border border-slate-200 rounded-2xl bg-slate-50 flex items-start gap-4">
            <div className="p-3 bg-orange-100 rounded-xl text-orange-600">
              <FiBriefcase className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900">Want to customize Capabilities, Alt-Text, or Case Studies list?</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Click on the <strong>Raw JSON Config</strong> tab above to directly add, remove, or modify capabilities grid cards, alt-text table rows, and the case studies structure. Raw JSON config gives you complete flexibility to adapt the page layout to any custom client request.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
