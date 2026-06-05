"use client";

import React, { useEffect, useMemo, useState } from "react";
import { FiAlertTriangle, FiImage, FiFileText, FiUpload } from "react-icons/fi";
import SectionHeader from "@/components/dashboard/assets/SectionHeader";
import ToastTopRight from "@/components/ui/Toast";
import { buildApiUrl } from "@/lib/apiUrl";
import EditableSectionCard from "@/components/cms/EditableSectionCard";
import EditModal from "@/components/cms/EditModal";

/* -------------------------------- Utils -------------------------------- */

function toStr(v: any) {
  return v === null || v === undefined ? "" : String(v);
}

type ImageSectionKey = "fallback" | "posts";

type ActiveSection = {
  key: ImageSectionKey;
  title: string;
};

type ToastTone = "success" | "error";

/* ------------------------------- Component ------------------------------- */

export default function BlogImageAdminPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const CONTENT_PATH = "/api/v1/content/blog";
  const UPLOAD_PATH = "/api/v1/content/blog/upload-image";

  const endpoint = useMemo(
    () => buildApiUrl(API_BASE, CONTENT_PATH),
    [API_BASE]
  );

  const uploadEndpoint = useMemo(
    () => buildApiUrl(API_BASE, UPLOAD_PATH),
    [API_BASE]
  );

  const [pageJson, setPageJson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [activeSection, setActiveSection] =
    useState<ActiveSection | null>(null);

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [toast, setToast] = useState<{
    open: boolean;
    tone: ToastTone;
    title: string;
    message?: string;
  }>({ open: false, tone: "success", title: "" });

  /* ------------------------------- Fetch JSON ------------------------------ */

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        const res = await fetch(endpoint, { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed (${res.status})`);
        const json = await res.json();
        if (alive) setPageJson(json);
      } catch (e: any) {
        if (alive) setErr(e?.message || "Failed to load blog content");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [endpoint]);

  /* ----------------------------- Lock scroll ----------------------------- */

  useEffect(() => {
    document.body.style.overflow = activeSection ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeSection]);

  /* ------------------------------- Forms ---------------------------------- */

  const [fallbackCover, setFallbackCover] = useState("");

  const [postCovers, setPostCovers] = useState<
    { id: string; title: string; cover: string }[]
  >([]);

  /* --------------------------- Open Edit Modal ----------------------------- */

  useEffect(() => {
    if (!activeSection || !pageJson) return;

    if (activeSection.key === "fallback") {
      setFallbackCover(toStr(pageJson?.assets?.fallback_cover));
    }

    if (activeSection.key === "posts") {
      const posts = Array.isArray(pageJson?.posts) ? pageJson.posts : [];
      setPostCovers(
        posts.map((p: any) => ({
          id: p.id,
          title: toStr(p.title),
          cover: toStr(p.cover),
        }))
      );
    }
  }, [activeSection, pageJson]);

  /* --------------------------- Upload Image --------------------------- */

  async function uploadImage(file: File, jsonPath: string) {
    const form = new FormData();
    form.append("file", file);
    form.append("json_path", jsonPath);

    try {
      setUploading(true);

      const res = await fetch(uploadEndpoint, {
        method: "POST",
        body: form,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();

      setToast({
        open: true,
        tone: "success",
        title: "Image uploaded",
      });

      return data.url;
    } catch (e: any) {
      setToast({
        open: true,
        tone: "error",
        title: "Upload failed",
        message: e?.message,
      });
      throw e;
    } finally {
      setUploading(false);
    }
  }

  /* -------------------------------- Save --------------------------------- */

  async function saveChanges() {
    if (!activeSection || !pageJson) return;

    try {
      setSaving(true);
      const updated = structuredClone(pageJson);

      if (activeSection.key === "fallback") {
        updated.assets.fallback_cover = fallbackCover;
      }

      if (activeSection.key === "posts") {
        updated.posts = updated.posts.map((p: any) => {
          const found = postCovers.find((c) => c.id === p.id);
          return found ? { ...p, cover: found.cover } : p;
        });
      }

      const res = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });

      if (!res.ok) throw new Error("Save failed");

      setPageJson(updated);
      setActiveSection(null);

      setToast({
        open: true,
        tone: "success",
        title: "Blog images saved",
      });
    } catch (e: any) {
      setToast({
        open: true,
        tone: "error",
        title: "Save failed",
        message: e?.message,
      });
    } finally {
      setSaving(false);
    }
  }

  /* -------------------------------- UI ----------------------------------- */

  const postCount = pageJson?.posts?.length || 0;

  return (
    <div className="p-6">
      <ToastTopRight
        toast={
          toast.open
            ? {
                type: toast.tone === "success" ? "success" : "error",
                msg: toast.message
                  ? `${toast.title}: ${toast.message}`
                  : toast.title,
              }
            : null
        }
        onClose={() => setToast((p) => ({ ...p, open: false }))}
      />

      <SectionHeader
        title="Blog Page – Images"
        subtitle="Upload & manage fallback and blog post cover images"
      />

      {err && (
        <div className="mt-4 rounded-md bg-white p-4 ring-1 ring-rose-200">
          <FiAlertTriangle className="inline mr-2 text-rose-600" />
          {err}
        </div>
      )}

      {!loading && pageJson && (
        <div className="mt-6 space-y-4">
          <EditableSectionCard
            title="Fallback Cover Image"
            subtitle="Used when post cover is missing"
            onEdit={() =>
              setActiveSection({ key: "fallback", title: "Fallback Cover" })
            }
          />

          <EditableSectionCard
            title="Blog Post Cover Images"
            subtitle={`${postCount} posts`}
            onEdit={() =>
              setActiveSection({ key: "posts", title: "Post Covers" })
            }
          />
        </div>
      )}

      {/* ------------------------------- MODAL ------------------------------- */}

      <EditModal
        open={!!activeSection}
        title={
          <>
            <FiImage /> {activeSection?.title}
          </>
        }
        onClose={() => setActiveSection(null)}
        footer={
          <div className="flex justify-end gap-2">
            <button
              className="rounded-md border px-4 py-2"
              onClick={() => setActiveSection(null)}
            >
              Cancel
            </button>
            <button
              disabled={saving}
              onClick={saveChanges}
              className="rounded-md bg-slate-900 px-4 py-2 text-white"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        }
      >
        {/* Fallback */}
        {activeSection?.key === "fallback" && (
          <div className="space-y-3">
            <input
              type="file"
              accept="image/*"
              disabled={uploading}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const url = await uploadImage(
                  file,
                  "assets.fallback_cover"
                );
                setFallbackCover(url);
              }}
            />
            <textarea
              className="w-full rounded border p-2 text-sm"
              value={fallbackCover}
              readOnly
            />
          </div>
        )}

        {/* Posts */}
        {activeSection?.key === "posts" && (
          <div className="space-y-4">
            {postCovers.map((p, i) => (
              <div key={p.id} className="rounded-md border p-4 space-y-2">
                <div className="flex items-center gap-2 font-semibold">
                  <FiFileText />
                  {p.title || `Post ${i + 1}`}
                </div>

                <input
                  type="file"
                  accept="image/*"
                  disabled={uploading}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const url = await uploadImage(
                      file,
                      `posts.${i}.cover`
                    );
                    const copy = [...postCovers];
                    copy[i] = { ...copy[i], cover: url };
                    setPostCovers(copy);
                  }}
                />

                <textarea
                  className="w-full rounded border p-2 text-sm"
                  value={p.cover}
                  readOnly
                />
              </div>
            ))}
          </div>
        )}
      </EditModal>
    </div>
  );
}
