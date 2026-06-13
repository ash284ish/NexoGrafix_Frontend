"use client";

import React, { useEffect, useState } from "react";
import { FiMail, FiPhone, FiBriefcase, FiCalendar, FiAlertTriangle, FiUser, FiInfo } from "react-icons/fi";
import SectionHeader from "@/components/dashboard/assets/SectionHeader";

type LeadRow = {
  id: number;
  sample_id: number | null;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  service_required: string | null;
  message: string;
  created_at: string;
};

type SampleRow = {
  id: number;
  title: string;
};

export default function SampleLeadsPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [samples, setSamples] = useState<SampleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setErr(null);
      const token = localStorage.getItem("access_token");

      // Load leads
      const leadsRes = await fetch(`${API_BASE}/api/v1/samples/leads`, {
        headers: { "Authorization": `Bearer ${token}` },
        cache: "no-store",
      });
      if (!leadsRes.ok) throw new Error("Failed to load leads");
      const leadsData = await leadsRes.json();
      setLeads(leadsData);

      // Load samples for mapping titles
      const samplesRes = await fetch(`${API_BASE}/api/v1/samples?include_private=true`, {
        headers: { "Authorization": `Bearer ${token}` },
        cache: "no-store",
      });
      if (samplesRes.ok) {
        const samplesData = await samplesRes.json();
        setSamples(samplesData);
      }
    } catch (e: any) {
      setErr(e.message || "An error occurred while loading data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getSampleTitle = (id: number | null) => {
    if (!id) return "General Inquiry / Direct";
    const found = samples.find((s) => s.id === id);
    return found ? found.title : `Sample #${id}`;
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="p-6">
      <SectionHeader
        title="Service Requests & Leads"
        subtitle="View client request submissions from work sample landing pages."
      />

      {err && (
        <div className="mt-5 rounded-md bg-red-50 p-4 ring-1 ring-red-200">
          <div className="flex gap-3">
            <FiAlertTriangle className="mt-0.5 text-red-600" />
            <div>
              <div className="text-sm font-semibold text-red-800">Error loading data</div>
              <div className="mt-1 text-sm text-red-700">{err}</div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-5 space-y-4">
        {loading ? (
          <div className="rounded-md bg-white p-6 shadow-sm ring-1 ring-slate-200/60 animate-pulse space-y-4">
            <div className="h-4 w-48 rounded bg-slate-200" />
            <div className="h-4 w-120 rounded bg-slate-200" />
            <div className="h-20 w-full rounded bg-slate-200" />
          </div>
        ) : leads.length === 0 ? (
          <div className="rounded-md bg-white p-8 text-center text-slate-500 shadow-sm ring-1 ring-slate-200/60">
            No leads or service requests found yet.
          </div>
        ) : (
          leads.map((l) => (
            <div key={l.id} className="rounded-md bg-white p-6 shadow-sm ring-1 ring-slate-200/60 transition hover:shadow-md">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-base font-bold text-slate-900">
                      <FiUser className="text-slate-400" /> {l.name}
                    </span>
                    {l.company && (
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                        {l.company}
                      </span>
                    )}
                    <span className="ml-auto text-xs font-semibold text-slate-500 flex items-center gap-1">
                      <FiCalendar /> {formatDate(l.created_at)}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600 font-medium">
                    <span className="flex items-center gap-1.5">
                      <FiMail className="text-slate-400" /> <a href={`mailto:${l.email}`} className="hover:underline text-orange-600">{l.email}</a>
                    </span>
                    {l.phone && (
                      <span className="flex items-center gap-1.5">
                        <FiPhone className="text-slate-400" /> <a href={`tel:${l.phone}`} className="hover:underline">{l.phone}</a>
                      </span>
                    )}
                  </div>

                  <div className="mt-2 rounded-md bg-slate-50 border border-slate-100 p-3 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                    <div className="text-xs font-extrabold text-slate-400 tracking-wider mb-1 uppercase">Message</div>
                    {l.message}
                  </div>
                </div>

                <div className="shrink-0 border-t border-slate-100 pt-4 md:border-t-0 md:pt-0 md:pl-6 text-xs text-slate-500 font-semibold space-y-1.5 md:w-64">
                  <div className="flex items-start gap-1">
                    <FiBriefcase className="mt-0.5 text-slate-400" />
                    <div>
                      <div className="text-[10px] text-slate-400 tracking-wider uppercase font-bold">Source Sample</div>
                      <div className="text-slate-800 mt-0.5 truncate">{getSampleTitle(l.sample_id)}</div>
                    </div>
                  </div>
                  {l.service_required && (
                    <div className="flex items-start gap-1 pt-1">
                      <FiInfo className="mt-0.5 text-slate-400" />
                      <div>
                        <div className="text-[10px] text-slate-400 tracking-wider uppercase font-bold">Service Required</div>
                        <div className="text-slate-800 mt-0.5">{l.service_required}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
