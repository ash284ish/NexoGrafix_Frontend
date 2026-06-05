"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { FiAlertTriangle, FiImage, FiUpload } from "react-icons/fi";
import SectionHeader from "@/components/dashboard/assets/SectionHeader";
import ToastTopRight from "@/components/ui/Toast";
import { buildApiUrl } from "@/lib/apiUrl";
import EditableSectionCard from "@/components/cms/EditableSectionCard";
import EditModal from "@/components/cms/EditModal";

function toStr(v: any) {
  return v === null || v === undefined ? "" : String(v);
}

type ImageSectionKey = "hero" | "services_carousel";

type ActiveSection = {
  key: ImageSectionKey;
  title: string;
};

type ToastTone = "success" | "error";

export default function DataLabelingImageAdminPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const CONTENT_PATH = "/api/v1/content/data-labelling";

  const endpoint = useMemo(
    () => buildApiUrl(API_BASE, CONTENT_PATH),
    [API_BASE]
  );

  const uploadEndpoint = useMemo(
    () => buildApiUrl(API_BASE, `${CONTENT_PATH}/upload-image`),
    [API_BASE]
  );

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [uploadTarget, setUploadTarget] = useState<
    | { type: "hero" }
    | { type: "carousel"; index: number }
    | null
  >(null);

  const [uploading, setUploading] = useState(false);

  const [pageJson, setPageJson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [activeSection, setActiveSection] = useState<ActiveSection | null>(null);
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
        if (alive)
          setErr(e?.message || "Failed to load data labeling content");
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

  const [heroForm, setHeroForm] = useState({ src: "", alt: "" });

  const [carouselImages, setCarouselImages] = useState<
    { id: string; title: string; src: string; alt: string }[]
  >([]);

  useEffect(() => {
    if (!activeSection || !pageJson) return;

    if (activeSection.key === "hero") {
      setHeroForm({
        src: toStr(pageJson?.hero?.hero_image?.src),
        alt: toStr(pageJson?.hero?.hero_image?.alt),
      });
    }

    if (activeSection.key === "services_carousel") {
      const slides = Array.isArray(pageJson?.services_carousel?.slides)
        ? pageJson.services_carousel.slides
        : [];

      setCarouselImages(
        slides.map((s: any, i: number) => ({
          id: s?.id || String(i),
          title: toStr(s?.title || `Slide ${i + 1}`),
          src: toStr(s?.image?.src),
          alt: toStr(s?.image?.alt),
        }))
      );
    }
  }, [activeSection, pageJson]);

  async function uploadImage(file: File) {
    if (!uploadTarget) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      if (uploadTarget.type === "hero") {
        formData.append("json_path", "hero.hero_image.src");
      }

      if (uploadTarget.type === "carousel") {
        formData.append(
          "json_path",
          `services_carousel.slides.${uploadTarget.index}.image.src`
        );
      }

      const res = await fetch(uploadEndpoint, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      const url = data?.url;
      if (!url) throw new Error("Invalid upload response");

      if (uploadTarget.type === "hero") {
        setHeroForm((p) => ({ ...p, src: url }));
      }

      if (uploadTarget.type === "carousel") {
        setCarouselImages((prev) => {
          const copy = [...prev];
          copy[uploadTarget.index] = {
            ...copy[uploadTarget.index],
            src: url,
          };
          return copy;
        });
      }

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
      setUploadTarget(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function saveChanges() {
    if (!activeSection || !pageJson) return;

    try {
      setSaving(true);
      const updated = structuredClone(pageJson);

      if (activeSection.key === "hero") {
        updated.hero.hero_image.src = heroForm.src;
        updated.hero.hero_image.alt = heroForm.alt;
      }

      if (activeSection.key === "services_carousel") {
        updated.services_carousel.slides =
          updated.services_carousel.slides.map((s: any, i: number) => ({
            ...s,
            image: {
              ...s.image,
              src: carouselImages[i]?.src,
              alt: carouselImages[i]?.alt,
            },
          }));
      }

      const res = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });

      if (!res.ok) throw new Error("Save failed");

      setToast({
        open: true,
        tone: "success",
        title: "Images updated successfully",
      });

      setActiveSection(null);
      setPageJson(updated);
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

  const heroSubtitle = toStr(pageJson?.hero?.title);
  const slideCount = pageJson?.services_carousel?.slides?.length || 0;

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
        title="Data Labeling Page – Images"
        subtitle="Manage only image sources (absolute or relative URLs)."
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
            title="Hero Image"
            subtitle={heroSubtitle}
            onEdit={() =>
              setActiveSection({ key: "hero", title: "Hero Image" })
            }
          />

          <EditableSectionCard
            title="Services Carousel Images"
            subtitle={`${slideCount} slides`}
            onEdit={() =>
              setActiveSection({
                key: "services_carousel",
                title: "Services Carousel",
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

        {activeSection?.key === "hero" && (
          <div className="space-y-4">
            <button
              type="button"
              className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm"
              onClick={() => {
                setUploadTarget({ type: "hero" });
                fileInputRef.current?.click();
              }}
            >
              <FiUpload /> Upload Image
            </button>

            <textarea
              className="w-full rounded border p-2 text-sm"
              value={heroForm.src}
              onChange={(e) =>
                setHeroForm((p) => ({ ...p, src: e.target.value }))
              }
            />

            <input
              className="w-full rounded border p-2 text-sm"
              value={heroForm.alt}
              onChange={(e) =>
                setHeroForm((p) => ({ ...p, alt: e.target.value }))
              }
            />
          </div>
        )}

        {activeSection?.key === "services_carousel" && (
          <div className="space-y-5">
            {carouselImages.map((img, i) => (
              <div key={img.id} className="rounded-md border p-4 space-y-2">
                <div className="font-semibold">{img.title}</div>

                <button
                  type="button"
                  className="flex items-center gap-2 rounded-md border px-3 py-1 text-sm"
                  onClick={() => {
                    setUploadTarget({ type: "carousel", index: i });
                    fileInputRef.current?.click();
                  }}
                >
                  <FiUpload /> Upload Image
                </button>

                <textarea
                  className="w-full rounded border p-2 text-sm"
                  value={img.src}
                  onChange={(e) => {
                    const copy = [...carouselImages];
                    copy[i] = { ...copy[i], src: e.target.value };
                    setCarouselImages(copy);
                  }}
                />

                <input
                  className="w-full rounded border p-2 text-sm"
                  value={img.alt}
                  onChange={(e) => {
                    const copy = [...carouselImages];
                    copy[i] = { ...copy[i], alt: e.target.value };
                    setCarouselImages(copy);
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </EditModal>
    </div>
  );
}
