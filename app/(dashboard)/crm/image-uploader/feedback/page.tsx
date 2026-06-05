"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import { FiAlertTriangle, FiImage, FiUser } from "react-icons/fi";
import SectionHeader from "@/components/dashboard/assets/SectionHeader";
import ToastTopRight from "@/components/ui/Toast";
import { buildApiUrl } from "@/lib/apiUrl";
import EditableSectionCard from "@/components/cms/EditableSectionCard";
import EditModal from "@/components/cms/EditModal";

function toStr(v: any) {
  return v === null || v === undefined ? "" : String(v);
}

type ActiveSection = {
  key: "testimonials";
  title: string;
};

export default function TestimonialsImageAdminPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const CONTENT_PATH = "/api/v1/content/feedback";
  const UPLOAD_PATH = "/api/v1/content/testimonial-avatar";

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
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [uploadTargetId, setUploadTargetId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
        if (alive) setErr(e?.message || "Failed to load testimonials content");
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

  const [avatars, setAvatars] = useState<
    {
      id: string;
      name: string;
      avatar_url: string;
    }[]
  >([]);

  useEffect(() => {
    if (!activeSection || !pageJson) return;

    if (activeSection.key === "testimonials") {
      const list = Array.isArray(pageJson?.testimonials)
        ? pageJson.testimonials
        : [];

      setAvatars(
        list.map((t: any) => ({
          id: t.id,
          name: `${toStr(t.first_name)} ${toStr(t.last_name)}`.trim(),
          avatar_url: toStr(t.avatar_url),
        }))
      );
    }
  }, [activeSection, pageJson]);

  async function uploadAvatar(file: File, testimonialId: string) {
    if (file.type !== "image/png") {
      setToast({
        open: true,
        tone: "error",
        title: "Only PNG images are allowed",
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    try {
      setUploadingId(testimonialId);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("testimonial_id", testimonialId);

      const res = await fetch(uploadEndpoint, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();

      setAvatars((prev) =>
        prev.map((a) =>
          a.id === testimonialId ? { ...a, avatar_url: data.url } : a
        )
      );

      setToast({
        open: true,
        tone: "success",
        title: "PNG image uploaded successfully",
      });
    } catch (e: any) {
      setToast({
        open: true,
        tone: "error",
        title: "Upload failed",
        message: e?.message,
      });
    } finally {
      setUploadingId(null);
      setUploadTargetId(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function saveChanges() {
    if (!activeSection || !pageJson) return;

    try {
      setSaving(true);
      const updated = structuredClone(pageJson);

      updated.testimonials = updated.testimonials.map((t: any) => {
        const found = avatars.find((a) => a.id === t.id);
        return found
          ? {
              ...t,
              avatar_url: found.avatar_url,
            }
          : t;
      });

      const res = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });

      if (!res.ok) throw new Error("Save failed");

      setToast({
        open: true,
        tone: "success",
        title: "Testimonial images updated successfully",
      });

      setPageJson(updated);
      setActiveSection(null);
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

  const testimonialCount = pageJson?.testimonials?.length || 0;

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
        title="Testimonials – Images"
        subtitle="Manage testimonial avatar images only (PNG only)"
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
            title="Testimonial Avatars"
            subtitle={`${testimonialCount} testimonials`}
            onEdit={() =>
              setActiveSection({
                key: "testimonials",
                title: "Testimonial Avatars",
              })
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
              disabled={saving || !!uploadingId}
              onClick={saveChanges}
              className="rounded-md bg-slate-900 px-4 py-2 text-white"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        }
      >
        {activeSection?.key === "testimonials" && (
          <div className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file && uploadTargetId) {
                  uploadAvatar(file, uploadTargetId);
                }
              }}
            />

            {avatars.map((a, i) => (
              <div key={a.id} className="rounded-md border p-4 space-y-2">
                <div className="flex items-center gap-2 font-semibold">
                  <FiUser />
                  {a.name || `Testimonial ${i + 1}`}
                </div>

                <textarea
                  className="w-full rounded border p-2 text-sm"
                  placeholder="Avatar Image URL"
                  value={a.avatar_url}
                  onChange={(e) => {
                    const copy = [...avatars];
                    copy[i] = {
                      ...copy[i],
                      avatar_url: e.target.value,
                    };
                    setAvatars(copy);
                  }}
                />

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={uploadingId === a.id}
                    className="rounded-md border px-3 py-1 text-sm"
                    onClick={() => {
                      setUploadTargetId(a.id);
                      fileInputRef.current?.click();
                    }}
                  >
                    {uploadingId === a.id
                      ? "Uploading..."
                      : "Upload PNG Image"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </EditModal>
    </div>
  );
}
