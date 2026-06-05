"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { FiEdit2, FiPlus, FiSave, FiTrash2, FiX } from "react-icons/fi";
import SectionHeader from "@/components/dashboard/assets/SectionHeader";

type AssetType = "HERO" | "INLINE_1" | "INLINE_2";

type BlogPostLite = { id: number; title: string };

type BlogAsset = {
  id: number;
  blog_id: number;
  asset_type: AssetType;
  url: string;
  alt: string;
};

function cx(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
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
  footer?: React.ReactNode;
}) {
  return (
    <>
      <div
        className={cx("fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition", open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none")}
        onMouseDown={onClose}
      />
      <div
        className={cx(
          "fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-md bg-white shadow-2xl ring-1 ring-slate-200/70 transition",
          open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        )}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between gap-3 border-b border-slate-200/60 px-6 py-5">
          <div className="text-base font-semibold text-slate-900">{title}</div>
          <button
            onClick={onClose}
            className="rounded-md border border-slate-200/70 bg-white p-2 text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
            aria-label="Close"
          >
            <FiX />
          </button>
        </div>

        <div className="px-6 py-5">{children}</div>

        {footer ? <div className="flex items-center justify-end gap-3 border-t border-slate-200/60 px-6 py-5">{footer}</div> : null}
      </div>
    </>
  );
}

function assetLabel(t: AssetType) {
  if (t === "HERO") return "Hero image";
  if (t === "INLINE_1") return "Inline image 1";
  return "Inline image 2";
}

export default function BlogAssetsPage() {
  const blogs = useMemo<BlogPostLite[]>(
    () => [
      { id: 1, title: "Delivery playbook: quality gates & automation (18)" },
      { id: 2, title: "Building scalable QA workflows for publishing teams" },
      { id: 3, title: "Why automation is critical in modern content delivery" },
    ],
    []
  );

  const [selectedBlogId, setSelectedBlogId] = useState<number>(blogs[0]?.id || 0);

  const [assets, setAssets] = useState<BlogAsset[]>(() => [
    {
      id: 1,
      blog_id: 1,
      asset_type: "HERO",
      url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&auto=format&fit=crop",
      alt: "Hero",
    },
    {
      id: 2,
      blog_id: 1,
      asset_type: "INLINE_1",
      url: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&auto=format&fit=crop",
      alt: "Inline 1",
    },
    {
      id: 3,
      blog_id: 1,
      asset_type: "INLINE_2",
      url: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&auto=format&fit=crop",
      alt: "Inline 2",
    },
  ]);

  const rows = assets
    .filter((a) => a.blog_id === selectedBlogId)
    .slice()
    .sort((a, b) => a.asset_type.localeCompare(b.asset_type));

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<BlogAsset | null>(null);

  const [type, setType] = useState<AssetType>("HERO");
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");

  const openAdd = () => {
    setEditing(null);
    setType("HERO");
    setUrl("");
    setAlt("");
    setOpen(true);
  };

  const openEdit = (a: BlogAsset) => {
    setEditing(a);
    setType(a.asset_type);
    setUrl(a.url);
    setAlt(a.alt);
    setOpen(true);
  };

  const save = () => {
    const u = url.trim();
    if (!u) return;

    if (editing) {
      setAssets((prev) =>
        prev.map((x) =>
          x.id === editing.id
            ? {
                ...x,
                asset_type: type,
                url: u,
                alt: alt.trim(),
              }
            : x
        )
      );
      setOpen(false);
      return;
    }

    const nextId = Math.max(0, ...assets.map((x) => x.id)) + 1;
    setAssets((prev) => [
      {
        id: nextId,
        blog_id: selectedBlogId,
        asset_type: type,
        url: u,
        alt: alt.trim(),
      },
      ...prev,
    ]);
    setOpen(false);
  };

  const remove = (id: number) => {
    setAssets((prev) => prev.filter((x) => x.id !== id));
  };

  const selectedTitle = blogs.find((b) => b.id === selectedBlogId)?.title || "Select blog";

  return (
    <div className="p-6">
      <SectionHeader
        title="Blog Assets"
        subtitle="Manage 3 images per blog (hero + 2 inline). Add/Edit/Delete from one place."
        right={
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 rounded-md bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
          >
            <FiPlus />
            Add image
          </button>
        }
      />

      <div className="mt-5 rounded-md bg-white p-4 shadow-sm ring-1 ring-slate-200/60">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-slate-900">Selected blog</div>
            <div className="mt-1 text-sm text-slate-600">{selectedTitle}</div>
          </div>

          <select
            value={selectedBlogId}
            onChange={(e) => setSelectedBlogId(Number(e.target.value))}
            className="rounded-md border border-slate-200/70 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm outline-none"
          >
            {blogs.map((b) => (
              <option key={b.id} value={b.id}>
                {b.title}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4 grid gap-3">
          {rows.map((a) => (
            <div key={a.id} className="flex flex-wrap items-start justify-between gap-4 rounded-md border border-slate-200/70 bg-white p-4">
              <div className="flex items-start gap-4">
                <div className="h-20 w-28 overflow-hidden rounded-md bg-slate-100 ring-1 ring-slate-200/70">
                  <Image
                    src={a.url}
                    alt={a.alt || assetLabel(a.asset_type)}
                    width={112}
                    height={80}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-slate-900">{assetLabel(a.asset_type)}</div>
                  <div className="mt-1 break-all text-xs text-slate-600">{a.url}</div>
                  <div className="mt-1 text-xs text-slate-500">{a.alt}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEdit(a)}
                  className="inline-flex items-center gap-2 rounded-md border border-slate-200/70 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
                >
                  <FiEdit2 />
                  Edit
                </button>
                <button
                  onClick={() => remove(a.id)}
                  className="inline-flex items-center gap-2 rounded-md border border-rose-200/70 bg-white px-4 py-2 text-sm font-semibold text-rose-700 shadow-sm transition hover:bg-rose-50"
                >
                  <FiTrash2 />
                  Delete
                </button>
              </div>
            </div>
          ))}

          {rows.length === 0 ? <div className="text-sm text-slate-600">No images added for this blog.</div> : null}
        </div>
      </div>

      <Modal
        open={open}
        title={editing ? "Edit blog image" : "Add blog image"}
        onClose={() => setOpen(false)}
        footer={
          <>
            <button
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center rounded-md border border-slate-200/70 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={save}
              className="inline-flex items-center justify-center rounded-md bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
            >
              <FiSave />
              Save
            </button>
          </>
        }
      >
        <div className="grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-semibold text-slate-800">Image type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as AssetType)}
              className="rounded-md border border-slate-200/70 bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm outline-none"
            >
              <option value="HERO">Hero</option>
              <option value="INLINE_1">Inline 1</option>
              <option value="INLINE_2">Inline 2</option>
            </select>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-semibold text-slate-800">Image URL</label>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full rounded-md border border-slate-200/70 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-semibold text-slate-800">Alt text</label>
            <input
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              className="w-full rounded-md border border-slate-200/70 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
