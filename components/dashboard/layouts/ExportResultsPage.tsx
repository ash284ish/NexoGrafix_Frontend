"use client";

import React from "react";

export default function ExportResultsPage() {
  const formats = [
    { type: "PDF", desc: "Accessible PDF with embedded alt text" },
    { type: "Word", desc: "Editable document for further review" },
    { type: "CSV", desc: "Structured data for audits and reports" },
    { type: "JSON", desc: "Developer-ready export for integrations" },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">
          Export results
        </h1>
        <p className="text-sm text-slate-600">
          Download your accessibility-ready content in the format you need.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {formats.map((f) => (
          <div
            key={f.type}
            className="flex flex-col rounded-md bg-white p-6 shadow-sm ring-1 ring-slate-200"
          >
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-900">
                {f.type}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                {f.desc}
              </p>
            </div>

            <button className="mt-6 rounded-md bg-teal-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-600">
              Download
            </button>
          </div>
        ))}
      </div>

      <div className="rounded-md bg-emerald-50 p-4 text-sm text-emerald-900 ring-1 ring-emerald-200">
        Your export files are ready and available for download.
      </div>

      <div className="flex flex-col gap-4 rounded-md bg-slate-900 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-white">
          <div className="text-sm font-medium">All done</div>
          <div className="text-xs text-white/70">
            Your content is now fully accessible and export-ready.
          </div>
        </div>

        <button className="rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-100">
          Go to dashboard →
        </button>
      </div>
    </div>
  );
}
