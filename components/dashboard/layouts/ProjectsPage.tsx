"use client";

import React from "react";
import {
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Folder,
  MoreHorizontal,
  Download,
  Trash2,
} from "lucide-react";

export default function ProjectsPage() {
  const projects = [
    { title: "Marketing Campaign 2024", files: 12, updated: "Sep 13, 2025", active: true },
    { title: "Product Launch Q3", files: 8, updated: "Aug 22, 2025", badge: "Planning" },
    { title: "Client Onboarding", files: 5, updated: "Jul 15, 2025", badges: ["Active", "New"] },
    { title: "Internal Training Materials", files: 15, updated: "Jun 30, 2025" },
  ];

  const files = [
    {
      name: "Campaign_Brief_v3.pdf",
      size: "1.2 MB",
      by: "Jane Doe",
      status: "Approved",
      statusClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      name: "Social_Media_Assets.pdf",
      size: "5.8 MB",
      by: "John Smith",
      status: "Reviewed",
      statusClass: "bg-amber-50 text-amber-700 border-amber-200",
    },
    {
      name: "Ad_Copy_Final.pdf",
      size: "450 KB",
      by: "Jane Doe",
      status: "Processing",
      statusClass: "bg-sky-50 text-sky-700 border-sky-200",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Projects &amp; Folders
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Keep your PDFs organized with folders, tags, and quick filters.
          </p>
        </div>

        <button className="inline-flex items-center gap-2 rounded-md bg-teal-500 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-600">
          <Plus className="h-4 w-4" />
          New Project
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-65 flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            placeholder="Search projects or files..."
            className="w-full rounded-md border border-slate-200 bg-white py-2 pl-10 pr-3 text-sm outline-none focus:border-teal-400"
          />
        </div>

        <button className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50">
          <Filter className="h-4 w-4" />
          Filter
        </button>

        <button className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50">
          <ArrowUpDown className="h-4 w-4" />
          Sort: Name
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {projects.map((p) => (
          <div
            key={p.title}
            className="rounded-md border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-teal-50 text-teal-600">
                <Folder className="h-5 w-5" />
              </div>
              <button className="rounded-md p-1 hover:bg-slate-100">
                <MoreHorizontal className="h-4 w-4 text-slate-500" />
              </button>
            </div>

            <div className="mt-4 font-semibold text-slate-900">{p.title}</div>

            <div className="mt-2 flex flex-wrap gap-2">
              {p.badge && (
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                  {p.badge}
                </span>
              )}
              {p.badges?.map((b) => (
                <span
                  key={b}
                  className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700"
                >
                  {b}
                </span>
              ))}
            </div>

            <div className="mt-3 text-xs text-slate-500">
              Files: {p.files} &nbsp;|&nbsp; Last Updated: {p.updated}
            </div>
          </div>
        ))}
      </div>

      <div className="text-sm text-slate-500">
        Projects &nbsp;›&nbsp;{" "}
        <span className="font-medium text-slate-900">
          Marketing Campaign 2024
        </span>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 rounded-md border border-slate-200 bg-white p-6 shadow-sm lg:col-span-8">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-lg font-semibold text-slate-900">Files</div>

            <div className="flex items-center gap-2">
              <button className="rounded-md border border-slate-200 px-3 py-2 text-sm font-medium hover:bg-slate-50">
                Export
              </button>
              <button className="rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50">
                Delete
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {files.map((f) => (
              <div
                key={f.name}
                className="flex items-center justify-between rounded-md border border-slate-100 p-4"
              >
                <div>
                  <div className="font-medium text-slate-900">{f.name}</div>
                  <div className="mt-1 text-xs text-slate-500">
                    {f.size} | Uploaded by {f.by}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-medium ${f.statusClass}`}
                  >
                    {f.status}
                  </span>

                  <button className="rounded-md border border-slate-200 p-2 hover:bg-slate-50">
                    <Download className="h-4 w-4" />
                  </button>
                  <button className="rounded-md border border-slate-200 p-2 hover:bg-slate-50">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-12 rounded-md border border-slate-200 bg-white p-6 shadow-sm lg:col-span-4">
          <div className="text-lg font-semibold text-slate-900">
            Folder Info
          </div>

          <div className="mt-4 space-y-4 text-sm">
            <div>
              <div className="font-medium text-slate-600">Description</div>
              <div className="mt-1 rounded-md border border-slate-100 p-3">
                All assets for the 2024 marketing campaign.
              </div>
            </div>

            <div>
              <div className="font-medium text-slate-600">Created Date</div>
              <div className="mt-1 rounded-md border border-slate-100 p-3">
                January 15, 2024
              </div>
            </div>

            <div>
              <div className="font-medium text-slate-600">Tags</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {["campaign", "2024", "social"].map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
