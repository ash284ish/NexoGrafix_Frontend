"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  FiShield,
  FiCheckCircle,
  FiXCircle,
  FiSliders,
  FiRefreshCw,
  FiTrash2,
  FiLock,
  FiEye,
  FiGlobe,
} from "react-icons/fi";
import SectionHeader from "@/components/dashboard/assets/SectionHeader";
import ToastTopRight from "@/components/ui/Toast";
import { buildApiUrl, getApiBaseUrl } from "@/lib/apiUrl";

type ConsentRecord = {
  id: string;
  status: "visitor_pageview" | "accepted_all" | "rejected_optional" | "customized";
  page_path?: string;
  categories: {
    necessary: boolean;
    functional: boolean;
    analytics: boolean;
    marketing: boolean;
  };
  ip_address?: string;
  anonymized_ip?: string;
  proof_of_consent?: string;
  legal_framework: string;
  created_at: string;
  policy_version: string;
};

type ConsentsJson = {
  total_pageviews: number;
  total_consents: number;
  accepted_all_count: number;
  rejected_count: number;
  customized_count: number;
  updated_at: string;
  consents: ConsentRecord[];
};

function cx(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
}

function Pill({
  children,
  tone = "slate",
}: {
  children: React.ReactNode;
  tone?: "slate" | "emerald" | "amber" | "blue" | "rose";
}) {
  const styles =
    tone === "emerald"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : tone === "amber"
      ? "bg-amber-50 text-amber-700 ring-amber-200"
      : tone === "blue"
      ? "bg-sky-50 text-sky-700 ring-sky-200"
      : tone === "rose"
      ? "bg-rose-50 text-rose-700 ring-rose-200"
      : "bg-slate-100 text-slate-700 ring-slate-200";

  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
        styles
      )}
    >
      {children}
    </span>
  );
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

export default function CookieConsentAdminPage() {
  const [data, setData] = useState<ConsentsJson | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [clearing, setClearing] = useState(false);

  const [toast, setToast] = useState<{
    open: boolean;
    tone: "success" | "error";
    title: string;
    message?: string;
  }>({
    open: false,
    tone: "success",
    title: "",
    message: "",
  });

  async function loadConsents() {
    try {
      setLoading(true);
      setErr(null);
      const url = buildApiUrl(getApiBaseUrl(), "/api/v1/cookie-consent");
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`Failed to fetch logs (${res.status})`);
      const json = await res.json();
      setData(json);
    } catch (e: any) {
      setErr(e?.message || "Failed to load cookie consent records");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadConsents();
  }, []);

  async function handleResetLogs() {
    if (!confirm("Are you sure you want to clear all website traffic and consent audit logs?")) return;

    try {
      setClearing(true);
      const url = buildApiUrl(getApiBaseUrl(), "/api/v1/cookie-consent");
      const res = await fetch(url, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to reset logs");
      setToast({
        open: true,
        tone: "success",
        title: "Logs Cleared",
        message: "Traffic and DPDP consent history reset successfully",
      });
      loadConsents();
    } catch (e: any) {
      setToast({
        open: true,
        tone: "error",
        title: "Reset Failed",
        message: e?.message || "Failed to clear logs",
      });
    } finally {
      setClearing(false);
    }
  }

  const filteredConsents = useMemo(() => {
    const list = data?.consents || [];
    if (statusFilter === "ALL") return list;
    return list.filter((c) => c.status === statusFilter);
  }, [data, statusFilter]);

  return (
    <div className="p-3 sm:p-6 md:p-8 space-y-4 sm:space-y-6 max-w-full overflow-x-hidden">
      <ToastTopRight
        toast={
          toast.open
            ? {
                type: toast.tone,
                msg: toast.message ? `${toast.title}: ${toast.message}` : toast.title,
              }
            : null
        }
        onClose={() => setToast((p) => ({ ...p, open: false }))}
        duration={4000}
      />

      <SectionHeader
        title="Visitor Traffic & Indian DPDP Act 2023 Consent CRM"
        subtitle="Automated visitor IP address & telemetry logging + Lawful Consent Proof records compliant with the Digital Personal Data Protection Act (DPDP Act, India) and Indian IT Act 2000."
        right={
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
            <button
              type="button"
              onClick={loadConsents}
              disabled={loading}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition w-full sm:w-auto"
            >
              <FiRefreshCw className={loading ? "animate-spin" : ""} />
              Refresh Data
            </button>
            <button
              type="button"
              onClick={handleResetLogs}
              disabled={clearing || !data?.consents.length}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-50 transition w-full sm:w-auto"
            >
              <FiTrash2 />
              Reset Logs
            </button>
          </div>
        }
      />

      {/* Compliance Guarantee Banner */}
      <div className="rounded-xl border border-orange-200 bg-orange-50/80 p-3.5 sm:p-4 text-orange-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-700">
            <FiGlobe className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div className="space-y-0.5">
            <h4 className="text-xs sm:text-sm font-extrabold tracking-tight text-orange-900">
              Visitor IP Address & Legal Compliance Database
            </h4>
            <p className="text-[11px] sm:text-xs text-orange-800 leading-relaxed">
              Every website visitor's IP address and page route is logged directly in the database. When a visitor accepts, an official <strong>Proof of Consent Record (DPDP Sec 6)</strong> is bound to the visitor IP.
            </p>
          </div>
        </div>
        <div className="shrink-0 self-end md:self-auto">
          <Pill tone="emerald">Visitor IP Captured</Pill>
        </div>
      </div>

      {/* Metric Cards - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs transition hover:border-slate-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Pageview Sessions</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
              <FiEye className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900">
            {loading ? "—" : data?.total_pageviews || 0}
          </div>
          <div className="mt-1 text-[11px] sm:text-xs text-slate-500">General Visitor Telemetry</div>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 sm:p-5 shadow-xs transition hover:border-emerald-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-800">Accepted All Consents</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
              <FiCheckCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-extrabold text-emerald-900">
            {loading ? "—" : data?.accepted_all_count || 0}
          </div>
          <div className="mt-1 text-[11px] sm:text-xs text-emerald-700">DPDP Consent Proof Generated</div>
        </div>

        <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-4 sm:p-5 shadow-xs transition hover:border-rose-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-800">Rejected Optional</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100 text-rose-700">
              <FiXCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-extrabold text-rose-900">
            {loading ? "—" : data?.rejected_count || 0}
          </div>
          <div className="mt-1 text-[11px] sm:text-xs text-rose-700">Strictly necessary only</div>
        </div>

        <div className="rounded-xl border border-sky-200 bg-sky-50/50 p-4 sm:p-5 shadow-xs transition hover:border-sky-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-sky-800">Custom Category Consents</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100 text-sky-700">
              <FiSliders className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-extrabold text-sky-900">
            {loading ? "—" : data?.customized_count || 0}
          </div>
          <div className="mt-1 text-[11px] sm:text-xs text-sky-700">Custom categories permitted</div>
        </div>
      </div>

      {/* Filter Tabs - Fully Responsive Scrollable Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { label: "All Records", key: "ALL" },
            { label: "Pageviews", key: "visitor_pageview" },
            { label: "Accepted All", key: "accepted_all" },
            { label: "Rejected Optional", key: "rejected_optional" },
            { label: "Customized", key: "customized" },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setStatusFilter(tab.key)}
              className={cx(
                "whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition shrink-0",
                statusFilter === tab.key
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500 shrink-0 self-end sm:self-auto">
          Showing <strong>{filteredConsents.length}</strong> of {data?.consents.length || 0} records
        </div>
      </div>

      {/* Mobile Card List View (Visible on small screens < md) */}
      <div className="block md:hidden space-y-3">
        {loading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-xs text-slate-400">
            Loading CRM traffic & DPDP consent records...
          </div>
        ) : filteredConsents.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-xs text-slate-400">
            No records found for selected filter.
          </div>
        ) : (
          filteredConsents.map((item) => (
            <div key={item.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
                <span className="font-mono text-xs font-bold text-slate-900">{item.id}</span>
                <span className="text-[10px] text-slate-400">{formatDate(item.created_at)}</span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-500">Visitor IP Address:</span>
                <span className="font-mono text-xs font-bold text-slate-900 bg-orange-50 text-orange-950 px-2 py-0.5 rounded border border-orange-200">
                  {item.ip_address || "127.0.0.1"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-500">Status:</span>
                <div>
                  {item.status === "visitor_pageview" && (
                    <Pill tone="slate"><FiEye /> Visitor Session</Pill>
                  )}
                  {item.status === "accepted_all" && (
                    <Pill tone="emerald"><FiCheckCircle /> Accepted All</Pill>
                  )}
                  {item.status === "rejected_optional" && (
                    <Pill tone="rose"><FiXCircle /> Rejected Optional</Pill>
                  )}
                  {item.status === "customized" && (
                    <Pill tone="blue"><FiSliders /> Customized</Pill>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-500">Route / Categories:</span>
                {item.status === "visitor_pageview" ? (
                  <span className="font-mono text-xs text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                    {item.page_path || "/"}
                  </span>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700">
                      Necessary
                    </span>
                    {item.categories.functional && (
                      <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-800">
                        Functional
                      </span>
                    )}
                    {item.categories.analytics && (
                      <span className="rounded bg-sky-100 px-1.5 py-0.5 text-[10px] font-semibold text-sky-800">
                        Analytics
                      </span>
                    )}
                    {item.categories.marketing && (
                      <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800">
                        Marketing
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1 pt-1 border-t border-slate-50">
                <span className="text-[10px] font-semibold text-slate-400 uppercase">Proof of Consent Token:</span>
                <span className="font-mono text-[11px] text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded break-all">
                  {item.proof_of_consent || "Visitor Telemetry"}
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5">{item.legal_framework}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Audit Table View (Visible on screens >= md) */}
      <div className="hidden md:block overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 min-w-[800px]">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Record ID & Date</th>
                <th className="px-5 py-3.5">Visitor IP Address</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Route / Categories</th>
                <th className="px-5 py-3.5">Proof of Consent (Sec. 6 DPDP)</th>
                <th className="px-5 py-3.5">Governing Legal Basis</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                    Loading CRM traffic & DPDP consent records...
                  </td>
                </tr>
              ) : filteredConsents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                    No records found for selected filter.
                  </td>
                </tr>
              ) : (
                filteredConsents.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-5 py-4">
                      <div className="font-mono text-xs font-bold text-slate-900">{item.id}</div>
                      <div className="text-[11px] text-slate-400">{formatDate(item.created_at)}</div>
                    </td>
                    <td className="px-5 py-4 font-mono text-xs">
                      <span className="font-bold text-slate-900 bg-orange-50 border border-orange-200 text-orange-950 px-2 py-0.5 rounded">
                        {item.ip_address || "127.0.0.1"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {item.status === "visitor_pageview" && (
                        <Pill tone="slate"><FiEye /> Visitor Session</Pill>
                      )}
                      {item.status === "accepted_all" && (
                        <Pill tone="emerald"><FiCheckCircle /> Accepted All</Pill>
                      )}
                      {item.status === "rejected_optional" && (
                        <Pill tone="rose"><FiXCircle /> Rejected Optional</Pill>
                      )}
                      {item.status === "customized" && (
                        <Pill tone="blue"><FiSliders /> Customized</Pill>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {item.status === "visitor_pageview" ? (
                        <span className="font-mono text-xs text-slate-800 bg-slate-100 px-2 py-1 rounded">
                          {item.page_path || "/"}
                        </span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700">
                            Necessary
                          </span>
                          {item.categories.functional && (
                            <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-800">
                              Functional
                            </span>
                          )}
                          {item.categories.analytics && (
                            <span className="rounded bg-sky-100 px-1.5 py-0.5 text-[10px] font-semibold text-sky-800">
                              Analytics
                            </span>
                          )}
                          {item.categories.marketing && (
                            <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800">
                              Marketing
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4 font-mono text-xs">
                      {item.proof_of_consent ? (
                        <span className="text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                          {item.proof_of_consent}
                        </span>
                      ) : (
                        <span className="text-slate-400">Visitor Telemetry</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-xs font-medium text-slate-600">
                      {item.legal_framework}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
