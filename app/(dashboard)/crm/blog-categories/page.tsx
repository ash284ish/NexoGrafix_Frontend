"use client";

import React, { useMemo, useState } from "react";
import { FiEdit2, FiPlus, FiSave, FiTrash2, FiX } from "react-icons/fi";
import SectionHeader from "@/components/dashboard/assets/SectionHeader";

type BlogRow = { id: number; title: string; slug: string };
type CategoryRow = { id: number; name: string; slug: string; blogIds: number[] };

function cx(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
}

function Button({
  children,
  onClick,
  tone = "slate",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  tone?: "slate" | "orange" | "red";
}) {
  const cls =
    tone === "orange"
      ? "bg-orange-500 text-white hover:bg-orange-600"
      : tone === "red"
      ? "bg-red-600 text-white hover:bg-red-700"
      : "bg-white text-slate-900 hover:bg-slate-50";
  const ring = tone === "slate" ? "border border-slate-200/70" : "border border-transparent";
  return (
    <button
      onClick={onClick}
      className={cx(
        "inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold shadow-sm transition",
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
  return (
    <>
      <div
        className={cx(
          "fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onMouseDown={onClose}
      />
      <div
        className={cx(
          "fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-md bg-white shadow-2xl ring-1 ring-slate-200/70 transition",
          open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        )}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between gap-3 border-b border-slate-200/60 px-6 py-5">
          <div className="min-w-0">
            <div className="text-base font-semibold text-slate-900">{title}</div>
            <div className="mt-1 text-sm text-slate-500">Edit category + map blogs (JSON stays structured)</div>
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

function slugifyLite(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function BlogCategoriesPage() {
  const blogs = useMemo<BlogRow[]>(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        title: `Blog Title ${i + 1}`,
        slug: `blog-title-${i + 1}`,
      })),
    []
  );

  const [categories, setCategories] = useState<CategoryRow[]>([
    { id: 1, name: "Publishing & Digitization", slug: "publishing-digitization", blogIds: [1, 2, 4] },
    { id: 2, name: "IT & Digital Platforms", slug: "it-digital-platforms", blogIds: [3, 9] },
  ]);

  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<CategoryRow | null>(null);

  const [name, setName] = useState("");
  const [selectedBlogIds, setSelectedBlogIds] = useState<number[]>([]);

  const openCreate = () => {
    setCreating(true);
    setEditing(null);
    setName("");
    setSelectedBlogIds([]);
  };

  const openEdit = (c: CategoryRow) => {
    setCreating(false);
    setEditing(c);
    setName(c.name);
    setSelectedBlogIds(c.blogIds);
  };

  const close = () => {
    setCreating(false);
    setEditing(null);
    setName("");
    setSelectedBlogIds([]);
  };

  const toggleBlog = (id: number) => {
    setSelectedBlogIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const save = () => {
    const n = name.trim();
    if (!n) return;

    const slug = slugifyLite(n);

    if (creating) {
      const exists = categories.some((c) => c.slug === slug);
      if (exists) return;

      const nextId = Math.max(0, ...categories.map((c) => c.id)) + 1;
      setCategories((prev) => [...prev, { id: nextId, name: n, slug, blogIds: selectedBlogIds.slice() }]);
      close();
      return;
    }

    if (editing) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editing.id
            ? {
                ...c,
                name: n,
                slug,
                blogIds: selectedBlogIds.slice(),
              }
            : c
        )
      );
      close();
    }
  };

  const remove = (c: CategoryRow) => {
    const ok = window.confirm(`Delete category "${c.name}"?`);
    if (!ok) return;
    setCategories((prev) => prev.filter((x) => x.id !== c.id));
  };

  return (
    <div className="p-6">
      <SectionHeader
        title="Blog Categories"
        subtitle="Create/edit/delete categories and map blogs to categories."
        right={
          <Button tone="orange" onClick={openCreate}>
            <FiPlus /> Add category
          </Button>
        }
      />

      <div className="mt-5 space-y-3">
        {categories.map((c) => (
          <div key={c.id} className="rounded-md bg-white p-5 shadow-sm ring-1 ring-slate-200/60">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="text-lg font-semibold text-slate-900">{c.name}</div>
                <div className="mt-1 text-sm text-slate-600">Slug: {c.slug}</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                    Mapped blogs: {c.blogIds.length}
                  </span>
                  {c.blogIds.slice(0, 4).map((id) => {
                    const b = blogs.find((x) => x.id === id);
                    return b ? (
                      <span key={id} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                        {b.title}
                      </span>
                    ) : null;
                  })}
                  {c.blogIds.length > 4 ? (
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                      +{c.blogIds.length - 4} more
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button tone="orange" onClick={() => openEdit(c)}>
                  <FiEdit2 /> Edit & Map
                </Button>
                <Button tone="red" onClick={() => remove(c)}>
                  <FiTrash2 /> Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={creating || !!editing}
        title={creating ? "Add Category" : editing ? `Edit Category: ${editing.name}` : "Category"}
        onClose={close}
        footer={
          <>
            <Button onClick={close}>
              <FiX /> Cancel
            </Button>
            <Button tone="orange" onClick={save}>
              <FiSave /> Save
            </Button>
          </>
        }
      >
        <div className="grid gap-6">
          <div className="grid gap-2">
            <label className="text-sm font-semibold text-slate-800">Category Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-slate-200/70 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
            />
            <div className="text-xs font-semibold text-slate-500">Slug: {name ? slugifyLite(name) : "-"}</div>
          </div>

          <div>
            <div className="text-sm font-semibold text-slate-800">Map Blogs</div>
            <div className="mt-2 rounded-md border border-slate-200/70 bg-slate-50 p-4">
              <div className="grid gap-2">
                {blogs.map((b) => {
                  const checked = selectedBlogIds.includes(b.id);
                  return (
                    <button
                      key={b.id}
                      onClick={() => toggleBlog(b.id)}
                      className={cx(
                        "flex items-center justify-between rounded-md px-3 py-2 text-left text-sm font-semibold transition",
                        checked ? "bg-slate-900 text-white" : "bg-white text-slate-900 border border-slate-200/70 hover:bg-slate-50"
                      )}
                    >
                      <span className="truncate">{b.title}</span>
                      <span className={cx("rounded-full px-2 py-0.5 text-xs font-semibold", checked ? "bg-white/15 text-white" : "bg-slate-100 text-slate-700")}>
                        {checked ? "Mapped" : "Not mapped"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-2 text-xs font-semibold text-slate-500">
              Selected: {selectedBlogIds.length} blogs
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
