"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { FiArrowLeft } from "react-icons/fi";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const BLOG_PATH = "/api/v1/content/blog";
const BLOG_DETAILS_PATH = "/api/v1/content/blog-details";
const BLOG_MAP_PATH = "/api/v1/content/blog-post-map";

type BlogPost = {
  id: string;
  title: string;
  excerpt?: string;
  cover?: string;
  slug: string;
  category?: string;
};


function normalizeBaseUrl(base: string) {
  return (base || "").trim().replace(/\/+$/, "");
}

function joinApiUrl(base: string, path: string) {
  const b = normalizeBaseUrl(base);
  const p = (path || "").trim().replace(/^\//, "");
  return `${b}/${p}`;
}

function safeStringify(v: unknown) {
  try {
    return JSON.stringify(v, null, 2);
  } catch {
    return "";
  }
}

function safeParse(text: string) {
  try {
    return { ok: true as const, value: JSON.parse(text) };
  } catch (e: unknown) {
    return { ok: false as const, error: e instanceof Error ? e.message : "Invalid JSON" };
  }
}

export default function BlogCRMPage() {
  const blogEndpoint = useMemo(() => joinApiUrl(API_BASE, BLOG_PATH), []);
  const blogDetailsEndpoint = useMemo(() => joinApiUrl(API_BASE, BLOG_DETAILS_PATH), []);
  const blogMapEndpoint = useMemo(() => joinApiUrl(API_BASE, BLOG_MAP_PATH), []);

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [showEditor, setShowEditor] = useState(false);
  const [detailsDoc, setDetailsDoc] = useState<Record<string, unknown> | null>(null);
  const [detailsJson, setDetailsJson] = useState<Record<string, unknown> | null>(null);

  const [editorText, setEditorText] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveErr, setSaveErr] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  const [isNewEntry, setIsNewEntry] = useState(false);
  const [pendingMapping, setPendingMapping] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(blogEndpoint, { cache: "no-store" })
      .then((r) => r.json())
      .then((json) => setPosts(json.posts || []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [blogEndpoint]);

  const detail = useMemo(() => {
    if (!selectedSlug) return null;
    return posts.find((p) => p.slug === selectedSlug) || null;
  }, [selectedSlug, posts]);

  async function openEditBlog(post: BlogPost) {
    setLoading(true);
    setSaveErr(null);
    setInfoMsg(null);
    setIsNewEntry(false);
    setPendingMapping(null);

    try {
      const mapRes = await fetch(blogMapEndpoint, { cache: "no-store" });
      const mapJson = await mapRes.json();

      const mapping = (mapJson.mappings as Array<{ blog_id: string | number; post_id: string | number }>)?.find(
        (m) => String(m.blog_id) === String(post.id)
      );

      const detailsRes = await fetch(blogDetailsEndpoint, { cache: "no-store" });
      const detailsJsonData = await detailsRes.json();
      const allPosts = Array.isArray(detailsJsonData?.posts) ? detailsJsonData.posts : [];

      if (mapping) {
        const matched = allPosts.find(
          (p: { id: string | number }) => String(p.id) === String(mapping.post_id)
        );
        if (!matched) throw new Error("Mapped post missing");

        setDetailsDoc(detailsJsonData);
        setDetailsJson(matched);
        setEditorText(safeStringify(matched));
        setInfoMsg(`Resolved via mapping: blog_id=${post.id} → post_id=${mapping.post_id}`);
        setShowEditor(true);
        return;
      }

      const maxId = allPosts.reduce(
        (m: number, p: { id: string | number }) => Math.max(m, Number(p.id) || 0),
        0
      );
      const nextId = String(maxId + 1);

      const skeleton = {
        id: nextId,
        title: post.title,
        slug: post.slug,
        category: post.category || "",
        dateISO: new Date().toISOString().slice(0, 10),
        readTime: "",
        excerpt: "",
        cover: "",
        content: {
          intro: [],
          sections: []
        }
      };

      setDetailsDoc(detailsJsonData);
      setDetailsJson(skeleton);
      setEditorText(safeStringify(skeleton));
      setIsNewEntry(true);
      setPendingMapping({ blog_id: post.id, post_id: nextId });

      setInfoMsg(
        `No blog details found. Draft created with ID=${nextId}. ID is fixed. Edit content and save to create entry.`
      );
      setShowEditor(true);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setDetailsJson({ error: msg });
      setEditorText(safeStringify({ error: msg }));
      setInfoMsg("Failed to resolve blog details");
      setShowEditor(true);
    } finally {
      setLoading(false);
    }
  }

  async function saveChanges() {
    setSaveErr(null);
    setInfoMsg(null);

    const parsed = safeParse(editorText);
    if (!parsed.ok) {
      setSaveErr(parsed.error);
      return;
    }

    setSaving(true);
    try {
      const nextDoc = structuredClone(detailsDoc) as { posts: Array<Record<string, unknown>> };
      nextDoc.posts = Array.isArray(nextDoc.posts) ? nextDoc.posts : [];

      const idx = nextDoc.posts.findIndex(
        (p: Record<string, unknown>) => String(p.id) === String((parsed.value as Record<string, unknown>).id)
      );

      if (idx === -1) {
        nextDoc.posts.push(parsed.value as Record<string, unknown>);
      } else {
        nextDoc.posts[idx] = parsed.value as Record<string, unknown>;
      }

      const res = await fetch(blogDetailsEndpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextDoc),
      });
      if (!res.ok) throw new Error("Blog details save failed");

      if (isNewEntry && pendingMapping) {
        const mapRes = await fetch(blogMapEndpoint, { cache: "no-store" });
        const mapJson = await mapRes.json();

        const updatedMap = {
          ...mapJson,
          mappings: [...(mapJson.mappings || []), pendingMapping],
        };

        const mapSave = await fetch(blogMapEndpoint, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedMap),
        });

        if (!mapSave.ok) throw new Error("Mapping save failed");
      }

      setDetailsDoc(nextDoc as unknown as Record<string, unknown>);
      setDetailsJson(parsed.value as Record<string, unknown>);
      setEditorText(safeStringify(parsed.value));
      setIsNewEntry(false);
      setPendingMapping(null);
      setInfoMsg("Saved successfully");
    } catch (e: unknown) {
      setSaveErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  function closeEditor() {
    if (saving) return;
    setShowEditor(false);
    setDetailsJson(null);
    setDetailsDoc(null);
    setEditorText("");
    setSaveErr(null);
    setInfoMsg(null);
    setIsNewEntry(false);
    setPendingMapping(null);
  }

  if (selectedSlug && detail) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <button
          onClick={() => setSelectedSlug(null)}
          className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-700"
        >
          <FiArrowLeft /> Back to Blogs
        </button>
        <h1 className="mt-6 text-3xl font-extrabold">{detail.title}</h1>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-extrabold mb-6">Blogs</h1>

      {loading && <div className="text-slate-500">Loading…</div>}

      <div className="grid md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="rounded-md border hover:shadow cursor-pointer overflow-hidden"
            onClick={() => setSelectedSlug(post.slug)}
          >
            <div className="h-44 bg-slate-100 relative">
              <Image
                src={post.cover || "/images/blog_fallback.jpg"}
                alt={post.title}
                fill
                className="object-contain"
              />
            </div>

            <div className="p-4">
              <h3 className="font-bold">{post.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{post.excerpt}</p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openEditBlog(post);
                }}
                className="mt-3 w-full rounded-md bg-slate-900 px-3 py-2 text-xs font-semibold text-white"
              >
                Edit Blog Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {showEditor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-4xl rounded-md bg-white max-h-[88vh] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <div className="text-xl font-bold truncate">
                {detailsJson?.title || "Blog Details"}
              </div>
              <button
                onClick={closeEditor}
                className="text-sm font-semibold text-slate-600"
                disabled={saving}
              >
                Close
              </button>
            </div>

            <div className="p-4 overflow-y-auto">
              {infoMsg && (
                <div className="mb-3 rounded bg-slate-50 px-3 py-2 text-xs font-semibold">
                  {infoMsg}
                </div>
              )}
              {saveErr && (
                <div className="mb-3 rounded bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
                  {saveErr}
                </div>
              )}
              <textarea
                value={editorText}
                onChange={(e) => setEditorText(e.target.value)}
                className="w-full min-h-[52vh] rounded-md border p-3 font-mono text-xs"
                spellCheck={false}
              />
            </div>

            <div className="flex justify-end gap-2 p-4 border-t">
              <button
                onClick={closeEditor}
                disabled={saving}
                className="rounded border px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={saveChanges}
                disabled={saving}
                className="rounded bg-slate-900 px-4 py-2 text-sm text-white"
              >
                {saving ? "Saving…" : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
