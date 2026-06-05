"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { FiImage, FiAlertTriangle, FiUpload } from "react-icons/fi";
import SectionHeader from "@/components/dashboard/assets/SectionHeader";
import ToastTopRight from "@/components/ui/Toast";
import { buildApiUrl } from "@/lib/apiUrl";
import EditableSectionCard from "@/components/cms/EditableSectionCard";
import EditModal from "@/components/cms/EditModal";

function toStr(v: any) {
  return v === null || v === undefined ? "" : String(v);
}

type ActiveSection = {
  key: "hero";
  title: string;
};

type ToastTone = "success" | "error";

export default function ArohioImageAdminPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const CONTENT_PATH = "/api/v1/content/arohio/main-feature";

  const endpoint = useMemo(
    () => buildApiUrl(API_BASE, CONTENT_PATH),
    [API_BASE]
  );

  const uploadEndpoint = useMemo(
    () => buildApiUrl(API_BASE, `${CONTENT_PATH}/upload-image`),
    [API_BASE]
  );

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [uploading, setUploading] = useState(false);

  const [pageJson, setPageJson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [activeSection, setActiveSection] =
    useState<ActiveSection | null>(null);

  const [saving, setSaving] = useState(false);

  const [toast, setToast] = useState<{
    open: boolean;
    tone: ToastTone;
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
        if (alive) setErr(e?.message || "Failed to load Arohio content");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [endpoint]);

  useEffect(() => {
    if (activeSection) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeSection]);

  const [heroImage, setHeroImage] = useState({
    src: "",
    alt: "",
  });

  useEffect(() => {
    if (!activeSection || !pageJson) return;

    setHeroImage({
      src: toStr(pageJson?.hero?.heroImage?.src),
      alt: toStr(pageJson?.hero?.heroImage?.alt),
    });
  }, [activeSection, pageJson]);

  async function uploadImage(file: File) {
    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("json_path", "hero.heroImage.src");

      const res = await fetch(uploadEndpoint, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      const url = data?.url;
      if (!url) throw new Error("Invalid upload response");

      setHeroImage((p) => ({ ...p, src: url }));

      setToast({
        open: true,
        tone: "success",
        title: "Image uploaded successfully",
      });
    } catch (e: any) {
      setToast({
        open: true,
        tone: "error",
        title: "Upload failed",
        message: e?.message,
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function saveChanges() {
    if (!pageJson) return;

    try {
      setSaving(true);

      const updated = structuredClone(pageJson);

      updated.hero = updated.hero || {};
      updated.hero.heroImage = {
        src: heroImage.src,
        alt: heroImage.alt,
      };

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
        title: "Hero image updated successfully",
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
        title="Arohio Page – Images"
        subtitle="Manage hero image only (image source & alt text)."
      />

      {err && (
        <div className="mt-4 rounded-md bg-white p-4 ring-1 ring-rose-200">
          <FiAlertTriangle className="inline mr-2 text-rose-600" />
          {err}
        </div>
      )}

      {!loading && pageJson && (
        <div className="mt-6">
          <EditableSectionCard
            title="Hero Image"
            subtitle={toStr(pageJson?.hero?.title)}
            onEdit={() =>
              setActiveSection({
                key: "hero",
                title: "Hero Image",
              })
            }
          />
        </div>
      )}

      <EditModal
        open={!!activeSection}
        title={
          <>
            <FiImage /> Hero Image
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
              disabled={saving || uploading}
              onClick={saveChanges}
              className="rounded-md bg-slate-900 px-4 py-2 text-white"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        }
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) uploadImage(file);
          }}
        />

        <div className="space-y-4">
          <button
            type="button"
            className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <FiUpload /> Upload Image
          </button>

          <label className="block">
            <div className="text-xs font-semibold">Image SRC</div>
            <textarea
              className="w-full rounded border p-2 text-sm"
              value={heroImage.src}
              onChange={(e) =>
                setHeroImage((p) => ({ ...p, src: e.target.value }))
              }
            />
          </label>

          <label className="block">
            <div className="text-xs font-semibold">Image ALT</div>
            <input
              className="w-full rounded border p-2 text-sm"
              value={heroImage.alt}
              onChange={(e) =>
                setHeroImage((p) => ({ ...p, alt: e.target.value }))
              }
            />
          </label>
        </div>
      </EditModal>
    </div>
  );
}
