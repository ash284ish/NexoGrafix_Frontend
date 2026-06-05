"use client";

import React, { useEffect, useMemo, useState } from "react";
import { FiAlertTriangle, FiImage, FiFileText } from "react-icons/fi";
import SectionHeader from "@/components/dashboard/assets/SectionHeader";
import ToastTopRight from "@/components/ui/Toast";
import { buildApiUrl } from "@/lib/apiUrl";
import EditableSectionCard from "@/components/cms/EditableSectionCard";
import EditModal from "@/components/cms/EditModal";

function toStr(v: any) {
  return v === null || v === undefined ? "" : String(v);
}

type ImageSectionKey = "fallback" | "covers" | "gallery";

type ActiveSection = {
  key: ImageSectionKey;
  title: string;
};

export default function BlogDetailsImageAdminPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const CONTENT_PATH = "/api/v1/content/blog-details";
  const UPLOAD_PATH = "/api/v1/content/blog-details/upload-image";

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
    tone: "success" | "error";
    title: string;
    message?: string;
  }>({ open: false, tone: "success", title: "" });

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
        if (alive) setErr(e?.message || "Failed to load blog details");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [endpoint]);

  useEffect(() => {
    document.body.style.overflow = activeSection ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeSection]);

  const [fallbackCover, setFallbackCover] = useState("");

  const [postCovers, setPostCovers] = useState<
    { id: string; title: string; cover: string }[]
  >([]);

  const [postGalleries, setPostGalleries] = useState<
    { id: string; title: string; images: string[] }[]
  >([]);

  useEffect(() => {
    if (!activeSection || !pageJson) return;
    const posts = Array.isArray(pageJson?.posts) ? pageJson.posts : [];

    if (activeSection.key === "fallback") {
      setFallbackCover(toStr(pageJson?.assets?.fallback_cover));
    }

    if (activeSection.key === "covers") {
      setPostCovers(
        posts.map((p: any) => ({
          id: p.id,
          title: toStr(p.title),
          cover: toStr(p.cover),
        }))
      );
    }

    if (activeSection.key === "gallery") {
      setPostGalleries(
        posts.map((p: any) => ({
          id: p.id,
          title: toStr(p.title),
          images: Array.isArray(p.images) ? [...p.images] : [],
        }))
      );
    }
  }, [activeSection, pageJson]);

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
      setToast({ open: true, tone: "success", title: "Image uploaded" });
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

  async function saveChanges() {
    if (!activeSection || !pageJson) return;

    try {
      setSaving(true);
      const updated = structuredClone(pageJson);

      if (activeSection.key === "fallback") {
        updated.assets.fallback_cover = fallbackCover;
      }

      if (activeSection.key === "covers") {
        updated.posts = updated.posts.map((p: any) => {
          const found = postCovers.find((c) => c.id === p.id);
          return found ? { ...p, cover: found.cover } : p;
        });
      }

      if (activeSection.key === "gallery") {
        updated.posts = updated.posts.map((p: any) => {
          const found = postGalleries.find((g) => g.id === p.id);
          return found ? { ...p, images: found.images } : p;
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
        title: "Blog detail images updated",
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
        title="Blog Details – Images"
        subtitle="Upload and manage fallback, covers, and galleries"
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
            title="Post Cover Images"
            subtitle={`${postCount} posts`}
            onEdit={() =>
              setActiveSection({ key: "covers", title: "Post Covers" })
            }
          />

          <EditableSectionCard
            title="Post Gallery Images"
            subtitle={`${postCount} posts`}
            onEdit={() =>
              setActiveSection({ key: "gallery", title: "Post Galleries" })
            }
          />
        </div>
      )}

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

        {activeSection?.key === "covers" &&
          postCovers.map((p, i) => (
            <div key={p.id} className="mb-4 rounded-md border p-4">
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
                  copy[i].cover = url;
                  setPostCovers(copy);
                }}
              />
              <textarea
                className="mt-2 w-full rounded border p-2 text-sm"
                value={p.cover}
                readOnly
              />
            </div>
          ))}

        {activeSection?.key === "gallery" &&
          postGalleries.map((p, i) => (
            <div key={p.id} className="mb-6 rounded-md border p-4">
              <div className="font-semibold mb-2">{p.title}</div>
              {p.images.map((img, idx) => (
                <div key={idx} className="mb-2">
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploading}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const url = await uploadImage(
                        file,
                        `posts.${i}.images.${idx}`
                      );
                      const copy = [...postGalleries];
                      copy[i].images[idx] = url;
                      setPostGalleries(copy);
                    }}
                  />
                  <textarea
                    className="mt-1 w-full rounded border p-2 text-sm"
                    value={img}
                    readOnly
                  />
                </div>
              ))}
            </div>
          ))}
      </EditModal>
    </div>
  );
}
