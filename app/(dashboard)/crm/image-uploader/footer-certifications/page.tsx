"use client";

import React, { useEffect, useMemo, useState } from "react";
import { FiAlertTriangle, FiImage } from "react-icons/fi";
import SectionHeader from "@/components/dashboard/assets/SectionHeader";
import ToastTopRight from "@/components/ui/Toast";
import { buildApiUrl, resolveImageUrl } from "@/lib/apiUrl";
import EditableSectionCard from "@/components/cms/EditableSectionCard";
import EditModal from "@/components/cms/EditModal";

function toStr(v: any) {
  return v === null || v === undefined ? "" : String(v);
}

type CertificateItem = {
  key: string;
  src: string;
  alt: string;
};

type ToastTone = "success" | "error";

export default function FooterCertificatesImageAdminPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const CONTENT_PATH = "/api/v1/content/footer";

  const endpoint = useMemo(
    () => buildApiUrl(API_BASE, CONTENT_PATH),
    [API_BASE]
  );

  const uploadEndpoint = useMemo(
    () =>
      buildApiUrl(
        API_BASE,
        "/api/v1/content/footer/upload-certificate"
      ),
    [API_BASE]
  );

  const [footerJson, setFooterJson] = useState<any>(null);
  const [certificates, setCertificates] = useState<CertificateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [toast, setToast] = useState<{
    open: boolean;
    tone: ToastTone;
    title: string;
    message?: string;
  }>({ open: false, tone: "success", title: "" });

  // Load footer
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(endpoint, { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed (${res.status})`);
        const json = await res.json();
        if (!alive) return;

        setFooterJson(json);
        setCertificates(
          json?.footer?.certificates?.items || []
        );
      } catch (e: any) {
        if (alive) setErr(e?.message || "Failed to load footer");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [endpoint]);

  async function uploadCertificateImage(
    file: File,
    certKey: string
  ) {
    const fd = new FormData();
    fd.append("file", file);
    fd.append(
      "json_path",
      `footer.certificates.items.${activeIndex}.src`
    );

    setUploading(true);
    try {
      const res = await fetch(uploadEndpoint, {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Upload failed");
      }

      const json = await res.json();

      setToast({
        open: true,
        tone: "success",
        title: "Certificate image updated successfully",
      });

      return json.url;
    } catch (e: any) {
      setToast({
        open: true,
        tone: "error",
        title: "Image upload failed",
        message: e?.message,
      });
      throw e;
    } finally {
      setUploading(false);
    }
  }


  async function saveChanges() {
    if (!footerJson) return;

    try {
      setSaving(true);
      const updated = structuredClone(footerJson);

      updated.footer = updated.footer || {};
      updated.footer.certificates =
        updated.footer.certificates || {};
      updated.footer.certificates.items = certificates;

      const res = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });

      if (!res.ok) throw new Error("Save failed");

      setToast({
        open: true,
        tone: "success",
        title: "Certificates updated successfully",
      });

      setFooterJson(updated);
      setActiveIndex(null);
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

  const activeCert =
    activeIndex !== null ? certificates[activeIndex] : null;

  return (
    <div className="p-6">
      <ToastTopRight
        toast={
          toast.open
            ? {
              type:
                toast.tone === "success"
                  ? "success"
                  : "error",
              msg: toast.message
                ? `${toast.title}: ${toast.message}`
                : toast.title,
            }
            : null
        }
        onClose={() =>
          setToast((p) => ({ ...p, open: false }))
        }
      />

      <SectionHeader
        title="Footer – Certifications Images"
        subtitle="Manage certification logos shown in footer."
      />

      {err && (
        <div className="mt-4 rounded-md bg-white p-4 ring-1 ring-rose-200">
          <FiAlertTriangle className="inline mr-2 text-rose-600" />
          {err}
        </div>
      )}

      {!loading && certificates.length > 0 && (
        <div className="mt-6 space-y-4">
          {certificates.map((c, idx) => (
            <EditableSectionCard
              key={c.key}
              title={`Certificate – ${c.key}`}
              onEdit={() => setActiveIndex(idx)}
            />
          ))}
        </div>
      )}

      <EditModal
        open={activeIndex !== null}
        title={
          <>
            <FiImage /> Certificate Image
          </>
        }
        onClose={() => setActiveIndex(null)}
        footer={
          <div className="flex justify-end gap-2">
            {/* <button
              className="rounded-md border px-4 py-2"
              onClick={() => setActiveIndex(null)}
            >
              Cancel
            </button> */}
            {/* <button
              disabled={saving || uploading}
              onClick={saveChanges}
              className="rounded-md bg-slate-900 px-4 py-2 text-white"
            >
              {saving ? "Saving…" : "Save"}
            </button> */}
          </div>
        }
      >
        {activeCert && (
          <div className="space-y-4">
            {activeCert.src && (
              <img
                src={resolveImageUrl(activeCert.src)}
                alt={activeCert.alt}
                className="h-20 rounded border"
              />
            )}

            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                const url = await uploadCertificateImage(
                  file,
                  activeCert.key
                );

                setCertificates((prev) => {
                  const copy = structuredClone(prev);
                  copy[activeIndex!].src = url;
                  return copy;
                });
              }}
            />

            <input
              className="w-full rounded border px-3 py-2 text-sm"
              placeholder="Alt text"
              value={activeCert.alt}
              onChange={(e) => {
                const v = e.target.value;
                setCertificates((prev) => {
                  const copy = structuredClone(prev);
                  copy[activeIndex!].alt = v;
                  return copy;
                });
              }}
            />
          </div>
        )}
      </EditModal>
    </div>
  );
}
