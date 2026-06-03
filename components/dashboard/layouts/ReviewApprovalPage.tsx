"use client";

import React from "react";

export default function ReviewApprovalPage() {
  const roles = [
    {
      key: "creator",
      title: "Creator",
      subtitle: "Prepare and submit the final alt text set.",
      status: "In progress",
      statusClass: "bg-slate-50 text-slate-700 ring-slate-200",
      primary: "Submit for review",
    },
    {
      key: "reviewer",
      title: "Reviewer",
      subtitle: "Review items and request changes or approve.",
      status: "Changes requested",
      statusClass: "bg-amber-50 text-amber-800 ring-amber-200",
      primary: "Send feedback",
    },
    {
      key: "approver",
      title: "Approver",
      subtitle: "Final sign-off before export.",
      status: "Approved",
      statusClass: "bg-emerald-50 text-emerald-800 ring-emerald-200",
      primary: "Finalize approval",
    },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Review & approval
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Collaborate with your team to finalize accessibility-ready alt text.
          </p>
        </div>

        <div className="rounded-full bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white">
          Step 4 · Workflow
        </div>
      </div>

      <div className="rounded-md bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-slate-900">
              Workflow summary
            </div>
            <div className="mt-1 text-xs text-slate-500">
              Progress based on approved alt text items
            </div>
          </div>

          <div className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 ring-1 ring-teal-100">
            88% complete
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-6 text-sm">
          <div>
            <div className="text-slate-500">Items ready</div>
            <div className="mt-1 text-lg font-semibold text-slate-900">
              24
            </div>
          </div>
          <div>
            <div className="text-slate-500">Needs changes</div>
            <div className="mt-1 text-lg font-semibold text-amber-700">
              3
            </div>
          </div>
          <div>
            <div className="text-slate-500">Approved</div>
            <div className="mt-1 text-lg font-semibold text-emerald-700">
              21
            </div>
          </div>
        </div>

        <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div className="h-2 w-[88%] rounded-full bg-teal-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {roles.map((r) => (
          <div
            key={r.key}
            className="flex h-full flex-col rounded-md bg-white p-6 shadow-sm ring-1 ring-slate-200"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-base font-semibold text-slate-900">
                  {r.title}
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  {r.subtitle}
                </div>
              </div>

              <span
                className={[
                  "rounded-full px-3 py-1 text-xs font-semibold ring-1",
                  r.statusClass,
                ].join(" ")}
              >
                {r.status}
              </span>
            </div>

            <div className="mt-5 space-y-2">
              <label className="text-xs font-semibold text-slate-700">
                Comment
              </label>
              <textarea
                rows={5}
                placeholder="Add a note for your team…"
                className="w-full resize-none rounded-md p-3 text-sm ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-teal-200"
              />
            </div>

            <div className="mt-auto flex gap-2 pt-5">
              <button className="flex-1 rounded-md bg-teal-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-600">
                {r.primary}
              </button>
              <button className="rounded-md px-4 py-2.5 text-sm font-semibold ring-1 ring-slate-200 hover:bg-slate-50">
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
