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
  | "hero_preview"
  | "how_we_solve_it"
  | "what_makes_different";

type ActiveSection = {
  key: ImageSectionKey;
  title: string;
};

type ToastTone = "success" | "error";

export default function AboutImageAdminPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const CONTENT_PATH = "/api/v1/content/about";

  const endpoint = useMemo(
    () => buildApiUrl(API_BASE, CONTENT_PATH),
    [API_BASE]
  );

  const uploadEndpoint = useMemo(
    () => buildApiUrl(API_BASE, "/api/v1/content/about/upload-image"),
    [API_BASE]
  );

  const [pageJson, setPageJson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [activeSection, setActiveSection] = useState<ActiveSection | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

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
        if (alive) setErr(e?.message || "Failed to load About content");
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

  const [heroPreviewForm, setHeroPreviewForm] = useState({ src: "", alt: "" });
  const [howWeSolveItForm, setHowWeSolveItForm] = useState({ src: "", alt: "" });
  const [whatMakesDifferentForm, setWhatMakesDifferentForm] = useState({
    src: "",
    alt: "",
  });

  useEffect(() => {
    if (!activeSection || !pageJson) return;

    if (activeSection.key === "hero_preview") {
      setHeroPreviewForm({
        src: toStr(pageJson?.hero?.preview?.image?.src),
        alt: toStr(pageJson?.hero?.preview?.image?.alt),
      });
    }

    if (activeSection.key === "how_we_solve_it") {
      setHowWeSolveItForm({
        src: toStr(pageJson?.howWeSolveIt?.left?.image?.src),
        alt: toStr(pageJson?.howWeSolveIt?.left?.image?.alt),
      });
    }

    if (activeSection.key === "what_makes_different") {
      setWhatMakesDifferentForm({
        src: toStr(pageJson?.whatMakesDifferent?.right?.image?.src),
        alt: toStr(pageJson?.whatMakesDifferent?.right?.image?.alt),
      });
    }
  }, [activeSection, pageJson]);

  async function uploadAboutImage(file: File, jsonPath: string) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("json_path", jsonPath);

    setUploading(true);
    try {
      const res = await fetch(uploadEndpoint, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Upload failed");
      }
      const json = await res.json();
      return json.url;
    } finally {
      setUploading(false);
    }
  }

  async function saveChanges() {
    if (!activeSection || !pageJson) return;

    try {
      setSaving(true);
      const updated = structuredClone(pageJson);

      if (activeSection.key === "hero_preview") {
        updated.hero.preview.image.src = heroPreviewForm.src;
        updated.hero.preview.image.alt = heroPreviewForm.alt;
      }

      if (activeSection.key === "how_we_solve_it") {
        updated.howWeSolveIt.left.image.src = howWeSolveItForm.src;
        updated.howWeSolveIt.left.image.alt = howWeSolveItForm.alt;
      }

      if (activeSection.key === "what_makes_different") {
        updated.whatMakesDifferent.right.image.src =
          whatMakesDifferentForm.src;
        updated.whatMakesDifferent.right.image.alt =
          whatMakesDifferentForm.alt;
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
        title="About Page – Images"
        subtitle="Manage About page preview and section images."
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
            title="Hero Section – Preview Image"
            onEdit={() =>
              setActiveSection({
                key: "hero_preview",
                title: "Hero Section – Preview Image",
              })
            }
          />

          <EditableSectionCard
            title="How We Solve It – Left Image"
            onEdit={() =>
              setActiveSection({
                key: "how_we_solve_it",
                title: "How We Solve It – Left Image",
              })
            }
          />

          <EditableSectionCard
            title="What Makes Us Different – Right Image"
            onEdit={() =>
              setActiveSection({
                key: "what_makes_different",
                title: "What Makes Us Different – Right Image",
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
        {activeSection && (
          <div className="space-y-4">
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const pathMap: any = {
                  hero_preview: "hero.preview.image.src",
                  how_we_solve_it: "howWeSolveIt.left.image.src",
                  what_makes_different:
                    "whatMakesDifferent.right.image.src",
                };
                const url = await uploadAboutImage(
                  file,
                  pathMap[activeSection.key]
                );
                if (activeSection.key === "hero_preview")
                  setHeroPreviewForm((p) => ({ ...p, src: url }));
                if (activeSection.key === "how_we_solve_it")
                  setHowWeSolveItForm((p) => ({ ...p, src: url }));
                if (activeSection.key === "what_makes_different")
                  setWhatMakesDifferentForm((p) => ({ ...p, src: url }));
              }}
            />

            <textarea
              className="w-full rounded border p-2 text-sm"
              value={
                activeSection.key === "hero_preview"
                  ? heroPreviewForm.src
                  : activeSection.key === "how_we_solve_it"
                  ? howWeSolveItForm.src
                  : whatMakesDifferentForm.src
              }
              onChange={(e) => {
                const v = e.target.value;
                if (activeSection.key === "hero_preview")
                  setHeroPreviewForm((p) => ({ ...p, src: v }));
                if (activeSection.key === "how_we_solve_it")
                  setHowWeSolveItForm((p) => ({ ...p, src: v }));
                if (activeSection.key === "what_makes_different")
                  setWhatMakesDifferentForm((p) => ({ ...p, src: v }));
              }}
            />
          </div>
        )}
      </EditModal>
    </div>
  );
}
