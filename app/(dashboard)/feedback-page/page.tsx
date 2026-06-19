"use client";

import React, { useEffect, useMemo, useState } from "react";
import DataTable, { Pill, TableActions, type DataTableColumn } from "@/components/ui/DataTable";
import ToastTopRight, { type ToastState } from "@/components/ui/Toast";
import SectionHeader from "@/components/dashboard/assets/SectionHeader";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

/* ================= TYPES ================= */

type FeedbackRow = {
  id: number;
  name: string;
  service: string;
  rating: number;
  ratingLabel: string;
  message: string;
  note?: string;
  isFeatured: boolean;
  createdAt: string;
};

type ApiFeedback = {
  id: number;
  first_name: string;
  last_name: string;
  service: string;
  rating: number;
  rating_label: string;
  message: string;
  note?: string;
  is_featured: boolean;
  created_at: string;
};

/* ================= HELPERS ================= */

function mapApiToRow(f: ApiFeedback): FeedbackRow {
  return {
    id: f.id,
    name: `${f.first_name} ${f.last_name}`,
    service: f.service,
    rating: f.rating,
    ratingLabel: f.rating_label,
    message: f.message,
    note: f.note || "",
    isFeatured: f.is_featured,
    createdAt: f.created_at,
  };
}

function toDisplay(v: string) {
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? v : d.toLocaleString();
}

async function readJsonSafe(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

/* ================= PAGE ================= */

export default function FeedbackAdminPage() {
  const [rows, setRows] = useState<FeedbackRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<ToastState>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [activeRow, setActiveRow] = useState<FeedbackRow | null>(null);
  const [note, setNote] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);

  const pushToast = (t: Exclude<ToastState, null>, ttl = 4000) => {
    setToast(t);
    window.setTimeout(() => setToast(null), ttl);
  };

  /* ================= FETCH ================= */

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/feedback`, { cache: "no-store" });
      if (!res.ok) throw new Error();
      const data: ApiFeedback[] = await res.json();
      setRows(data.map(mapApiToRow));
    } catch {
      pushToast({ type: "error", msg: "Failed to load feedbacks." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  /* ================= COLUMNS ================= */

  const columns = useMemo<DataTableColumn<FeedbackRow>[]>(() => [
    {
      key: "user",
      header: "User",
      className: "min-w-[220px]",
      render: (r) => (
        <div>
          <div className="font-extrabold text-slate-900">{r.name}</div>
          <div className="text-xs font-semibold text-slate-500">{r.service}</div>
        </div>
      ),
    },
    {
      key: "rating",
      header: "Rating",
      render: (r) => (
        <div className="text-sm font-bold">
          {r.ratingLabel} <span className="text-slate-500">({r.rating})</span>
        </div>
      ),
    },
    {
      key: "featured",
      header: "Featured",
      render: (r) => <Pill tone={r.isFeatured ? "orange" : "slate"}>{r.isFeatured ? "Yes" : "No"}</Pill>,
    },
    {
      key: "created",
      header: "Submitted At",
      render: (r) => <span className="text-sm text-slate-600">{toDisplay(r.createdAt)}</span>,
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (r) => (
        <TableActions
          onEdit={() => {
            setActiveRow(r);
            setNote(r.note || "");
            setIsFeatured(r.isFeatured);
            setEditOpen(true);
          }}
        />
      ),
    },
  ], []);

  /* ================= SAVE ================= */

  const saveEdit = async () => {
    if (!activeRow) return;

    try {
      const res = await fetch(`/api/v1/feedback/${activeRow.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          note,
          is_featured: isFeatured,
        }),
      });

      if (!res.ok) throw new Error();

      setRows((p) =>
        p.map((r) =>
          r.id === activeRow.id ? { ...r, note, isFeatured } : r
        )
      );

      setEditOpen(false);
      setActiveRow(null);
      pushToast({ type: "success", msg: "Feedback updated." });
    } catch {
      pushToast({ type: "error", msg: "Update failed." });
    }
  };

  /* ================= UI ================= */

  return (
    <div className="p-6">
      <ToastTopRight toast={toast} onClose={() => setToast(null)} />

      <SectionHeader
        title="Feedback"
        subtitle="Manage user feedback, notes and featured status."
        right={<div className="text-sm text-slate-500">{loading ? "Loading..." : `${rows.length} total`}</div>}
      />

      <DataTable
        data={rows}
        rowKey={(r) => String(r.id)}
        columns={columns}
        searchPlaceholder="Search by name or service..."
      />


      {/* EDIT MODAL */}
      {/* EDIT MODAL */}
      {editOpen && activeRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="w-full max-w-md rounded-md bg-white p-5 shadow-xl">
            <h3 className="mb-4 text-sm font-extrabold">Edit Feedback</h3>

            {/* USER INFO */}
            <div className="mb-3">
              <div className="text-sm font-extrabold text-slate-900">
                {activeRow.name}
              </div>
              <div className="text-xs font-semibold text-slate-500">
                {activeRow.service}
              </div>
            </div>

            {/* RATING */}
            <div className="mb-3 text-sm font-semibold">
              Rating:&nbsp;
              <span className="text-orange-600">
                {activeRow.ratingLabel} ({activeRow.rating})
              </span>
            </div>

            {/* USER MESSAGE / DESCRIPTION */}
            <div className="mb-3">
              <label className="text-xs font-semibold">User Message</label>
              <div className="mt-1 rounded-md border bg-slate-50 p-2 text-sm text-slate-700">
                {activeRow.message}
              </div>
            </div>

            {/* SUBMITTED DATE */}
            <div className="mb-3 text-xs text-slate-500">
              Submitted at: {toDisplay(activeRow.createdAt)}
            </div>

            {/* ADMIN NOTE (EDITABLE) */}
            <div className="mb-3">
              <label className="text-xs font-semibold">Admin Note</label>
              <textarea
                className="mt-1 w-full rounded-md border p-2 text-sm"
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            {/* FEATURED */}
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
              />
              Mark as Featured
            </label>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setEditOpen(false)}
                className="px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="rounded-md bg-orange-500 px-4 py-2 text-sm font-bold text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
