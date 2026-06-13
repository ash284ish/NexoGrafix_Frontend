"use client";

import React, { useEffect, useMemo, useState } from "react";
import { FiEdit2, FiPlus, FiSave, FiTrash2, FiX, FiAlertTriangle } from "react-icons/fi";
import SectionHeader from "@/components/dashboard/assets/SectionHeader";
import ToastTopRight from "@/components/ui/Toast";

type CategoryRow = {
  id: number;
  name: string;
  slug: string;
  created_at: string;
};

function cx(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
}

function Button({
  children,
  onClick,
  tone = "slate",
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  tone?: "slate" | "orange" | "red";
  disabled?: boolean;
}) {
  const cls =
    tone === "orange"
      ? "bg-orange-500 text-white hover:bg-orange-600 disabled:bg-orange-400"
      : tone === "red"
      ? "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400"
      : "bg-white text-slate-900 hover:bg-slate-50 disabled:bg-slate-100";
  const ring = tone === "slate" ? "border border-slate-200/70" : "border border-transparent";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cx(
        "inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold shadow-sm transition disabled:cursor-not-allowed",
        cls,
        ring
      )}
    >
      {children}
    </button>
  );
}

function Modal({
  open,
  title,
  onClose,
  children,
  footer,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition"
        onMouseDown={onClose}
      />
      <div
        className="fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-md bg-white shadow-2xl ring-1 ring-slate-200/70 transition"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between gap-3 border-b border-slate-200/60 px-6 py-5">
          <div className="min-w-0">
            <div className="text-base font-semibold text-slate-900">{title}</div>
          </div>
          <button
            onClick={onClose}
            className="rounded-md border border-slate-200/70 bg-white p-2 text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
          >
            <FiX />
          </button>
        </div>

        <div className="px-6 py-5">{children}</div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-200/60 px-6 py-5">{footer}</div>
      </div>
    </>
  );
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function SampleCategoriesPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<CategoryRow | null>(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [autoSlug, setAutoSlug] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [toast, setToast] = useState<{ open: boolean; type: "success" | "error"; msg: string } | null>(null);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ open: true, type, msg });
  };

  const loadCategories = async () => {
    try {
      setLoading(true);
      setErr(null);
      const res = await fetch(`${API_BASE}/api/v1/samples/categories`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to load categories");
      const data = await res.json();
      setCategories(data);
    } catch (e: any) {
      setErr(e.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleNameChange = (val: string) => {
    setName(val);
    if (autoSlug) {
      setSlug(slugify(val));
    }
  };

  const handleSlugChange = (val: string) => {
    setSlug(val);
    setAutoSlug(false);
  };

  const openCreate = () => {
    setCreating(true);
    setEditing(null);
    setName("");
    setSlug("");
    setAutoSlug(true);
  };

  const openEdit = (c: CategoryRow) => {
    setCreating(false);
    setEditing(c);
    setName(c.name);
    setSlug(c.slug);
    setAutoSlug(false);
  };

  const close = () => {
    setCreating(false);
    setEditing(null);
    setName("");
    setSlug("");
    setAutoSlug(true);
  };

  const handleSave = async () => {
    const n = name.trim();
    const s = slug.trim() || slugify(n);
    if (!n || !s) return;

    try {
      setSubmitting(true);
      const token = localStorage.getItem("access_token");
      const url = creating 
        ? `${API_BASE}/api/v1/samples/categories` 
        : `${API_BASE}/api/v1/samples/categories/${editing?.id}`;
      const method = creating ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ name: n, slug: s }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed to save category");
      }

      showToast("success", creating ? "Category created successfully" : "Category updated successfully");
      close();
      loadCategories();
    } catch (e: any) {
      showToast("error", e.message || "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (c: CategoryRow) => {
    const ok = window.confirm(`Are you sure you want to delete category "${c.name}"?`);
    if (!ok) return;

    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${API_BASE}/api/v1/samples/categories/${c.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed to delete category");
      }

      showToast("success", "Category deleted successfully");
      loadCategories();
    } catch (e: any) {
      showToast("error", e.message || "An error occurred");
    }
  };

  return (
    <div className="p-6">
      <ToastTopRight
        toast={toast ? { type: toast.type, msg: toast.msg } : null}
        onClose={() => setToast(null)}
        duration={4000}
      />

      <SectionHeader
        title="Sample Categories"
        subtitle="Manage dynamic categories assigned to work samples."
        right={
          <Button tone="orange" onClick={openCreate}>
            <FiPlus /> Add Category
          </Button>
        }
      />

      {err && (
        <div className="mt-5 rounded-md bg-red-50 p-4 ring-1 ring-red-200">
          <div className="flex gap-3">
            <FiAlertTriangle className="mt-0.5 text-red-600" />
            <div>
              <div className="text-sm font-semibold text-red-800">Error loading categories</div>
              <div className="mt-1 text-sm text-red-700">{err}</div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-5 space-y-3">
        {loading ? (
          <div className="rounded-md bg-white p-5 shadow-sm ring-1 ring-slate-200/60 animate-pulse space-y-3">
            <div className="h-4 w-48 rounded bg-slate-200" />
            <div className="h-4 w-96 rounded bg-slate-200" />
          </div>
        ) : categories.length === 0 ? (
          <div className="rounded-md bg-white p-6 text-center text-slate-500 shadow-sm ring-1 ring-slate-200/60">
            No categories found. Create a category to get started.
          </div>
        ) : (
          categories.map((c) => (
            <div key={c.id} className="rounded-md bg-white p-5 shadow-sm ring-1 ring-slate-200/60">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-lg font-semibold text-slate-900">{c.name}</div>
                  <div className="mt-1 text-sm text-slate-500">Slug: <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs">{c.slug}</code></div>
                </div>

                <div className="flex items-center gap-2">
                  <Button tone="slate" onClick={() => openEdit(c)}>
                    <FiEdit2 /> Edit
                  </Button>
                  <Button tone="red" onClick={() => handleDelete(c)}>
                    <FiTrash2 /> Delete
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal
        open={creating || !!editing}
        title={creating ? "Add Category" : `Edit Category: ${editing?.name}`}
        onClose={close}
        footer={
          <>
            <Button onClick={close} disabled={submitting}>
              <FiX /> Cancel
            </Button>
            <Button tone="orange" onClick={handleSave} disabled={submitting}>
              <FiSave /> {submitting ? "Saving..." : "Save Category"}
            </Button>
          </>
        }
      >
        <div className="grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-semibold text-slate-800">Category Name</label>
            <input
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. PDF Accessibility"
              className="w-full rounded-md border border-slate-200/70 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-semibold text-slate-800">Slug URL</label>
            <input
              value={slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              placeholder="e.g. pdf-accessibility"
              className="w-full rounded-md border border-slate-200/70 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-300 focus:ring-4 focus:ring-slate-100 font-mono"
            />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="autoSlug"
                checked={autoSlug}
                onChange={(e) => setAutoSlug(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
              />
              <label htmlFor="autoSlug" className="text-xs font-semibold text-slate-600 cursor-pointer">
                Automatically generate slug from name
              </label>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
