"use client";

import React, { useEffect, useMemo, useState } from "react";
import { FiAlertTriangle, FiImage } from "react-icons/fi";
import SectionHeader from "@/components/dashboard/assets/SectionHeader";
import ToastTopRight from "@/components/ui/Toast";
import { buildApiUrl } from "@/lib/apiUrl";
import EditableSectionCard from "@/components/cms/EditableSectionCard";
import EditModal from "@/components/cms/EditModal";

function toStr(v: any) {
  return v === null || v === undefined ? "" : String(v);
}

type ImageSectionKey =
  | "hero"
  | "services_overview"
  | "clients";

type ActiveSection = {
  key: ImageSectionKey;
  title: string;
};

type ToastTone = "success" | "error";

export default function HomeImageAdminPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const CONTENT_PATH = "/api/v1/content/home";

  const endpoint = useMemo(
    () => buildApiUrl(API_BASE, CONTENT_PATH),
    [API_BASE]
  );

  const uploadEndpoint = useMemo(
    () => buildApiUrl(API_BASE, "/api/v1/content/home/upload-image"),
    [API_BASE]
  );

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
        if (alive) setErr(e?.message || "Failed to load Home content");
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

  const [heroForm, setHeroForm] = useState({ src: "", alt: "" });

  const [serviceSlides, setServiceSlides] = useState<
    { id: string; title: string; src: string; alt: string }[]
  >([]);

  const [clientLogos, setClientLogos] = useState<
    { id: string; name: string; src: string }[]
  >([]);

  const [testimonialAvatars, setTestimonialAvatars] = useState<
    { id: string; name: string; src: string }[]
  >([]);

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!activeSection || !pageJson) return;

    if (activeSection.key === "hero") {
      setHeroForm({
        src: toStr(pageJson?.hero?.heroImage?.src),
        alt: toStr(pageJson?.hero?.heroImage?.alt),
      });
    }

    if (activeSection.key === "services_overview") {
      const slides = pageJson?.servicesOverview?.slides || [];
      setServiceSlides(
        slides.map((s: any, i: number) => ({
          id: s?.id || String(i),
          title: toStr(s?.title || `Slide ${i + 1}`),
          src: toStr(s?.image?.src),
          alt: toStr(s?.image?.alt),
        }))
      );
    }

    if (activeSection.key === "clients") {
      const items = pageJson?.clients?.items || [];
      setClientLogos(
        items.map((c: any, i: number) => ({
          id: String(i),
          name: toStr(c?.name),
          src: toStr(c?.imageUrl),
        }))
      );
    }
  }, [activeSection, pageJson]);

  async function uploadImage(file: File, jsonPath: string) {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("json_path", jsonPath);

    const res = await fetch(uploadEndpoint, {
      method: "POST",
      body: fd,
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(txt || "Upload failed");
    }

    const json = await res.json();
    if (!json?.url) throw new Error("Upload failed");
    return String(json.url);
  }

  async function handleUpload(
    file: File | null,
    jsonPath: string,
    applyUrl: (url: string) => void
  ) {
    if (!file) return;

    try {
      setUploading(true);
      const url = await uploadImage(file, jsonPath);
      applyUrl(url);
      setToast({
        open: true,
        tone: "success",
        title: "Image uploaded",
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
    }
  }

  async function saveChanges() {
    if (!activeSection || !pageJson) return;

    try {
      setSaving(true);
      const updated = structuredClone(pageJson);

      if (activeSection.key === "hero") {
        updated.hero = updated.hero || {};
        updated.hero.heroImage = updated.hero.heroImage || {};
        updated.hero.heroImage.src = heroForm.src;
        updated.hero.heroImage.alt = heroForm.alt;
      }

      if (activeSection.key === "services_overview") {
        updated.servicesOverview = updated.servicesOverview || {};
        updated.servicesOverview.slides =
          (updated.servicesOverview.slides || []).map((s: any, i: number) => ({
            ...s,
            image: {
              ...(s?.image || {}),
              src: serviceSlides[i]?.src,
              alt: serviceSlides[i]?.alt,
            },
          }));
      }

      if (activeSection.key === "clients") {
        updated.clients = updated.clients || {};
        updated.clients.items = (updated.clients.items || []).map(
          (c: any, i: number) => ({
            ...c,
            imageUrl: clientLogos[i]?.src,
          })
        );
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

  const slidesCount = pageJson?.servicesOverview?.slides?.length || 0;
  const logosCount = pageJson?.clients?.items?.length || 0;
  const profilesCount = pageJson?.testimonials?.items?.length || 0;

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
        onClose={() => setToast((p: any) => ({ ...p, open: false }))}
      />

      <SectionHeader
        title="Home Page – Images"
        subtitle="Manage hero, services, client logos, and testimonial avatars."
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
            onEdit={() => setActiveSection({ key: "hero", title: "Hero Image" })}
          />

          <EditableSectionCard
            title="Services Overview Images"
            subtitle={`${slidesCount} slides`}
            onEdit={() =>
              setActiveSection({
                key: "services_overview",
                title: "Services Overview",
              })
            }
          />

          <EditableSectionCard
            title="Client Logos"
            subtitle={`${logosCount} logos`}
            onEdit={() =>
              setActiveSection({ key: "clients", title: "Client Logos" })
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
        {activeSection?.key === "hero" ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="text-xs font-semibold">Upload Image</div>
              <input
                type="file"
                accept="image/*"
                disabled={uploading}
                onChange={(e) =>
                  handleUpload(
                    e.target.files?.[0] || null,
                    "hero.heroImage.src",
                    (url) => setHeroForm((p) => ({ ...p, src: url }))
                  )
                }
              />
            </div>

            <label className="block">
              <div className="text-xs font-semibold">Image SRC</div>
              <textarea
                className="w-full rounded border p-2 text-sm"
                value={heroForm.src}
                onChange={(e) =>
                  setHeroForm((p) => ({ ...p, src: e.target.value }))
                }
              />
            </label>

            <label className="block">
              <div className="text-xs font-semibold">Image ALT</div>
              <input
                className="w-full rounded border p-2 text-sm"
                value={heroForm.alt}
                onChange={(e) =>
                  setHeroForm((p) => ({ ...p, alt: e.target.value }))
                }
              />
            </label>
          </div>
        ) : null}

        {activeSection?.key === "services_overview" ? (
          <div className="space-y-5">
            {serviceSlides.map((img, i) => (
              <div key={img.id} className="rounded-md border p-4 space-y-2">
                <div className="font-semibold">{img.title}</div>

                <div className="space-y-2">
                  <div className="text-xs font-semibold">Upload Image</div>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploading}
                    onChange={(e) =>
                      handleUpload(
                        e.target.files?.[0] || null,
                        `servicesOverview.slides.${i}.image.src`,
                        (url) => {
                          const copy = [...serviceSlides];
                          copy[i] = { ...copy[i], src: url };
                          setServiceSlides(copy);
                        }
                      )
                    }
                  />
                </div>

                <textarea
                  className="w-full rounded border p-2 text-sm"
                  value={img.src}
                  onChange={(e) => {
                    const copy = [...serviceSlides];
                    copy[i] = { ...copy[i], src: e.target.value };
                    setServiceSlides(copy);
                  }}
                />

                <input
                  className="w-full rounded border p-2 text-sm"
                  value={img.alt}
                  onChange={(e) => {
                    const copy = [...serviceSlides];
                    copy[i] = { ...copy[i], alt: e.target.value };
                    setServiceSlides(copy);
                  }}
                />
              </div>
            ))}
          </div>
        ) : null}

        {activeSection?.key === "clients" ? (
          <div className="space-y-5">
            {clientLogos.map((item, i) => (
              <div key={item.id} className="rounded-md border p-4 space-y-2">
                <div className="font-semibold">{item.name}</div>

                <div className="space-y-2">
                  <div className="text-xs font-semibold">Upload Image</div>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploading}
                    onChange={(e) =>
                      handleUpload(
                        e.target.files?.[0] || null,
                        `clients.items.${i}.imageUrl`,
                        (url) => {
                          const copy = [...clientLogos];
                          copy[i] = { ...copy[i], src: url };
                          setClientLogos(copy);
                        }
                      )
                    }
                  />
                </div>

                <textarea
                  className="w-full rounded border p-2 text-sm"
                  value={item.src}
                  onChange={(e) => {
                    const copy = [...clientLogos];
                    copy[i] = { ...copy[i], src: e.target.value };
                    setClientLogos(copy);
                  }}
                />
              </div>
            ))}
          </div>
        ) : null}
      </EditModal>
    </div>
  );
}
