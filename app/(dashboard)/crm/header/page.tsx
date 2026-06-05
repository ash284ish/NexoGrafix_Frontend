"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  FiAlertTriangle,
  FiEdit3,
  FiX,
  FiTag,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import SectionHeader from "@/components/dashboard/assets/SectionHeader";
import ToastTopRight from "@/components/ui/Toast";

type HeaderSectionType = "BRAND" | "TOPBAR" | "CTA" | "NAV" | "UNKNOWN";

type HeaderSection = {
  id: string;
  section_key: string;
  section_type: HeaderSectionType;
  title: string;
  subtitle: string;
  order_index: number;
  is_enabled: boolean;
  meta?: { badge?: string; alignment?: "left" | "center" | "right" };
  raw: any;
};

function cx(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
}

function Pill({
  children,
  tone = "slate",
}: {
  children: React.ReactNode;
  tone?: "slate" | "emerald" | "amber" | "blue" | "rose";
}) {
  const styles =
    tone === "emerald"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : tone === "amber"
      ? "bg-amber-50 text-amber-700 ring-amber-200"
      : tone === "blue"
      ? "bg-sky-50 text-sky-700 ring-sky-200"
      : tone === "rose"
      ? "bg-rose-50 text-rose-700 ring-rose-200"
      : "bg-slate-100 text-slate-700 ring-slate-200";

  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
        styles
      )}
    >
      {children}
    </span>
  );
}

function normalizeBaseUrl(base: string) {
  return (base || "").trim().replace(/\/+$/, "");
}

function joinApiUrl(base: string, path: string) {
  const b = normalizeBaseUrl(base);
  const p = (path || "").trim();
  if (!b) return p;

  const bHasApi = /\/api\/v1$/.test(b);
  const pHasApi = /^\/?api\/v1\//.test(p);

  if (bHasApi && pHasApi) return `${b}/${p.replace(/^\/?api\/v1\//, "")}`;
  if (!bHasApi && !pHasApi) return `${b}/${p.replace(/^\//, "")}`;
  return `${b}/${p.replace(/^\//, "")}`;
}

function toStr(v: any) {
  if (v === null || v === undefined) return "";
  return String(v);
}

function safeClone<T>(v: T): T {
  return typeof structuredClone === "function"
    ? structuredClone(v)
    : JSON.parse(JSON.stringify(v));
}

function stringifyPretty(v: any) {
  try {
    return JSON.stringify(v, null, 2);
  } catch {
    return "";
  }
}

function parseJsonSafe(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function buildHeaderSections(json: any): HeaderSection[] {
  const sections: HeaderSection[] = [];
  const enabled = true;

  const header = json?.header ?? json;
  if (!header || typeof header !== "object") return sections;

  if (header?.brand) {
    sections.push({
      id: "brand",
      section_key: "brand",
      section_type: "BRAND",
      title: toStr(header?.brand?.name || "Brand"),
      subtitle: `href: ${toStr(header?.brand?.href || "/")}`,
      order_index: 1,
      is_enabled: enabled,
      meta: { badge: "BRAND", alignment: "left" },
      raw: header.brand,
    });
  }

  if (header?.topbar) {
    const socialsCount = Array.isArray(header?.topbar?.socials)
      ? header.topbar.socials.length
      : 0;

    sections.push({
      id: "topbar",
      section_key: "topbar",
      section_type: "TOPBAR",
      title: "Topbar",
      subtitle: `Socials: ${socialsCount}`,
      order_index: 2,
      is_enabled: enabled,
      meta: { badge: "TOPBAR", alignment: "left" },
      raw: header.topbar,
    });
  }

  if (header?.cta) {
    sections.push({
      id: "cta",
      section_key: "cta",
      section_type: "CTA",
      title: toStr(header?.cta?.label || "CTA"),
      subtitle: `href: ${toStr(header?.cta?.href || "/contact")}`,
      order_index: 3,
      is_enabled: enabled,
      meta: { badge: "CTA", alignment: "left" },
      raw: header.cta,
    });
  }

  if (header?.nav) {
    const navKeys = header?.nav ? Object.keys(header.nav) : [];
    sections.push({
      id: "nav",
      section_key: "nav",
      section_type: "NAV",
      title: `Nav (${navKeys.length})`,
      subtitle: navKeys.slice(0, 8).join(", ") + (navKeys.length > 8 ? "…" : ""),
      order_index: 4,
      is_enabled: enabled,
      meta: { badge: "NAV", alignment: "left" },
      raw: header.nav,
    });
  }

  const known = new Set(["brand", "topbar", "cta", "nav"]);
  Object.keys(header || {}).forEach((k) => {
    if (known.has(k)) return;
    const v = header?.[k];
    if (!v || typeof v !== "object") return;
    sections.push({
      id: k,
      section_key: k,
      section_type: "UNKNOWN",
      title: toStr(v?.title || v?.name || k),
      subtitle: toStr(v?.subtitle || v?.description || "—"),
      order_index: 999,
      is_enabled: enabled,
      meta: { badge: "EXTRA", alignment: "left" },
      raw: v,
    });
  });

  return sections;
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <label className="grid gap-1.5">
      <div className="text-xs font-semibold text-slate-600">{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={cx(
          "h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none",
          "focus:border-slate-300 focus:ring-2 focus:ring-slate-200",
          disabled ? "cursor-not-allowed bg-slate-50 text-slate-500" : ""
        )}
      />
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
}) {
  return (
    <label className="grid gap-1.5">
      <div className="text-xs font-semibold text-slate-600">{label}</div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className={cx(
          "w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none",
          "focus:border-slate-300 focus:ring-2 focus:ring-slate-200",
          disabled ? "cursor-not-allowed bg-slate-50 text-slate-500" : ""
        )}
      />
    </label>
  );
}

function EditModal({
  open,
  title,
  subtitle,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-80">
      <div
        className="absolute inset-0 cursor-pointer bg-slate-950/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl overflow-hidden rounded-md bg-white shadow-xl ring-1 ring-slate-200">
          <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
            <div className="min-w-0">
              <div className="text-base font-bold text-slate-900">{title}</div>
              {subtitle ? (
                <div className="mt-0.5 text-sm text-slate-600">{subtitle}</div>
              ) : null}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            >
              <FiX />
            </button>
          </div>
          <div className="max-h-[72vh] overflow-auto px-5 py-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

type ToastTone = "success" | "error";
type ToastState = {
  open: boolean;
  tone: ToastTone;
  title: string;
  message?: string;
};

export default function HeaderAdminPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const endpoint = useMemo(
    () => joinApiUrl(API_BASE, "/api/v1/content/header"),
    [API_BASE]
  );

  const [sections, setSections] = useState<HeaderSection[]>([]);
  const [rawHeader, setRawHeader] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveErr, setSaveErr] = useState<string | null>(null);

  const [toast, setToast] = useState<ToastState>({
    open: false,
    tone: "success",
    title: "",
    message: "",
  });

  function persistToast(next: {
    tone: ToastTone;
    title: string;
    message?: string;
  }) {
    try {
      sessionStorage.setItem("header_admin_toast", JSON.stringify(next));
    } catch {}
  }

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("header_admin_toast");
      if (!raw) return;
      sessionStorage.removeItem("header_admin_toast");
      const parsed = JSON.parse(raw) as {
        tone?: ToastTone;
        title?: string;
        message?: string;
      };
      if (!parsed?.title) return;
      setToast({
        open: true,
        tone: parsed.tone === "error" ? "error" : "success",
        title: parsed.title,
        message: parsed.message || "",
      });
    } catch {}
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);

        const res = await fetch(endpoint, { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to load header content (${res.status})`);

        const json = await res.json();
        const built = buildHeaderSections(json);

        if (alive) {
          setRawHeader(json);
          setSections(built);
        }
      } catch (e: any) {
        if (alive) setErr(e?.message || "Failed to load header content");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [endpoint]);

  const activeSection = useMemo(() => {
    if (!activeKey) return null;
    return sections.find((s) => s.section_key === activeKey) || null;
  }, [activeKey, sections]);

  const [brandForm, setBrandForm] = useState({ name: "", href: "" });

  const [topbarForm, setTopbarForm] = useState({
    text: "",
    socialsText: "[]",
  });

  const [ctaForm, setCtaForm] = useState({ label: "", href: "" });

  const [navForm, setNavForm] = useState({ navText: "{}" });

  useEffect(() => {
    if (!activeSection) return;
    setSaveErr(null);

    if (activeSection.section_key === "brand") {
      const b = activeSection.raw || {};
      setBrandForm({ name: toStr(b?.name), href: toStr(b?.href) });
    }

    if (activeSection.section_key === "topbar") {
      const t = activeSection.raw || {};
      setTopbarForm({
        text: toStr(t?.text),
        socialsText: stringifyPretty(Array.isArray(t?.socials) ? t.socials : []),
      });
    }

    if (activeSection.section_key === "cta") {
      const c = activeSection.raw || {};
      setCtaForm({ label: toStr(c?.label), href: toStr(c?.href) });
    }

    if (activeSection.section_key === "nav") {
      setNavForm({ navText: stringifyPretty(activeSection.raw || {}) });
    }
  }, [activeSection]);

  async function saveActiveSection() {
    if (!rawHeader || !activeSection) return;

    try {
      setSaving(true);
      setSaveErr(null);

      const updated = safeClone(rawHeader);
      const headerObj = updated?.header && typeof updated.header === "object" ? updated.header : updated;

      if (activeSection.section_key === "brand") {
        headerObj.brand = headerObj.brand || {};
        headerObj.brand.name = brandForm.name;
        headerObj.brand.href = brandForm.href;
      }

      if (activeSection.section_key === "topbar") {
        headerObj.topbar = headerObj.topbar || {};
        headerObj.topbar.text = topbarForm.text;

        const parsedSocials = parseJsonSafe(topbarForm.socialsText);
        if (!Array.isArray(parsedSocials)) throw new Error("Topbar socials must be a JSON array");

        for (const s of parsedSocials) {
          if (!s || typeof s !== "object") throw new Error("Each social must be an object");
          if (!toStr(s.key) || !toStr(s.label) || !toStr(s.href) || !toStr(s.icon)) {
            throw new Error('Each social must have: "key", "label", "href", "icon"');
          }
        }

        headerObj.topbar.socials = parsedSocials;
      }

      if (activeSection.section_key === "cta") {
        headerObj.cta = headerObj.cta || {};
        headerObj.cta.label = ctaForm.label;
        headerObj.cta.href = ctaForm.href;
      }

      if (activeSection.section_key === "nav") {
        const parsedNav = parseJsonSafe(navForm.navText);
        if (!parsedNav || typeof parsedNav !== "object" || Array.isArray(parsedNav)) {
          throw new Error("Nav must be a JSON object");
        }
        headerObj.nav = parsedNav;
      }

      const saveUrl = joinApiUrl(API_BASE, "/api/v1/content/header");
      const res = await fetch(saveUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });

      if (!res.ok) throw new Error(`Update failed (${res.status})`);

      persistToast({
        tone: "success",
        title: "Changes saved",
        message: `${activeSection.section_key} updated successfully`,
      });

      window.location.reload();
    } catch (e: any) {
      const msg = e?.message || "Failed to save changes";
      setSaveErr(msg);
      setToast({ open: true, tone: "error", title: "Save failed", message: msg });
    } finally {
      setSaving(false);
    }
  }

  const totalSections = sections.length;

  return (
    <div className="p-6">
      <ToastTopRight
  toast={
    toast.open
      ? {
          type: toast.tone === "success" ? "success" : "error",
          msg: toast.message ? `${toast.title}: ${toast.message}` : toast.title,
        }
      : null
  }
  onClose={() => setToast((p) => ({ ...p, open: false }))}
  duration={4000}
/>


      <SectionHeader
        title="Header Management"
        subtitle="Header JSON content loaded from CMS."
        right={
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
            <span>{loading ? "Loading…" : `${totalSections} sections`}</span>
          </div>
        }
      />

      {err ? (
        <div className="mt-5 rounded-md bg-white p-5 shadow-sm ring-1 ring-rose-200">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 text-rose-600">
              <FiAlertTriangle />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-rose-700">Failed to load</div>
              <div className="mt-1 text-sm text-slate-600">{err}</div>
              <div className="mt-3 text-xs font-semibold text-slate-500">Endpoint: {endpoint}</div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mt-5 space-y-4">
        {(loading ? [] : sections)
          .slice()
          .sort((a, b) => a.order_index - b.order_index)
          .map((s) => (
            <div
              key={s.id}
              className="rounded-md bg-white p-5 shadow-sm ring-1 ring-slate-200/60"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="text-sm font-semibold text-slate-900">
                      {s.section_key}
                      <span className="ml-2 text-xs font-semibold text-slate-400">
                        ({s.section_type})
                      </span>
                    </div>

                    {s.is_enabled ? <Pill tone="emerald">Enabled</Pill> : <Pill>Disabled</Pill>}

                    {s.meta?.badge ? (
                      <Pill tone="blue">
                        <FiTag />
                        {s.meta.badge}
                      </Pill>
                    ) : null}

                    {s.section_type === "UNKNOWN" ? <Pill tone="rose">Unknown</Pill> : null}
                  </div>

                  <div className="mt-3 grid gap-1">
                    <div className="text-xl font-semibold text-slate-900">{s.title}</div>
                    <div className="text-sm text-slate-600">{s.subtitle}</div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 font-semibold">
                      Order: {s.order_index}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 font-semibold">
                      Route: /api/v1/content/header
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveKey(s.section_key)}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                  >
                    <FiEdit3 />
                    Edit content
                  </button>
                </div>
              </div>
            </div>
          ))}

        {loading ? (
          <div className="rounded-md bg-white p-5 shadow-sm ring-1 ring-slate-200/60">
            <div className="animate-pulse space-y-3">
              <div className="h-4 w-48 rounded bg-slate-200" />
              <div className="h-7 w-96 rounded bg-slate-200" />
              <div className="h-4 w-130 rounded bg-slate-200" />
              <div className="h-4 w-105 rounded bg-slate-200" />
            </div>
          </div>
        ) : null}

        {!loading && !err && sections.length === 0 ? (
          <div className="rounded-md bg-white p-5 shadow-sm ring-1 ring-slate-200/60">
            <div className="text-sm font-semibold text-slate-900">No sections found</div>
            <div className="mt-1 text-sm text-slate-600">API returned empty content.</div>
          </div>
        ) : null}
      </div>

      <EditModal
        open={Boolean(activeSection)}
        title={activeSection ? `Edit: ${activeSection.section_key}` : "Edit"}
        subtitle={activeSection ? `Update fields and save to /api/v1/content/header` : ""}
        onClose={() => (saving ? null : setActiveKey(null))}
      >
        {activeSection?.section_key === "brand" ? (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Section Key" value="brand" onChange={() => null} disabled />
              <TextField label="Type" value="BRAND" onChange={() => null} disabled />
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField
                label="Brand Name"
                value={brandForm.name}
                onChange={(v) => setBrandForm((p) => ({ ...p, name: v }))}
              />
              <TextField
                label="Brand Href"
                value={brandForm.href}
                onChange={(v) => setBrandForm((p) => ({ ...p, href: v }))}
              />
            </div>
          </div>
        ) : null}

        {activeSection?.section_key === "topbar" ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Section Key" value="topbar" onChange={() => null} disabled />
              <TextField label="Type" value="TOPBAR" onChange={() => null} disabled />
            </div>

            <TextAreaField
              label="Topbar Text"
              value={topbarForm.text}
              onChange={(v) => setTopbarForm((p) => ({ ...p, text: v }))}
              rows={4}
            />

            <TextAreaField
              label='Socials (JSON array) — each item must have: { "key", "label", "href", "icon" }'
              value={topbarForm.socialsText}
              onChange={(v) => setTopbarForm((p) => ({ ...p, socialsText: v }))}
              rows={14}
            />
          </div>
        ) : null}

        {activeSection?.section_key === "cta" ? (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Section Key" value="cta" onChange={() => null} disabled />
              <TextField label="Type" value="CTA" onChange={() => null} disabled />
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField
                label="CTA Label"
                value={ctaForm.label}
                onChange={(v) => setCtaForm((p) => ({ ...p, label: v }))}
              />
              <TextField
                label="CTA Href"
                value={ctaForm.href}
                onChange={(v) => setCtaForm((p) => ({ ...p, href: v }))}
              />
            </div>
          </div>
        ) : null}

        {activeSection?.section_key === "nav" ? (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Section Key" value="nav" onChange={() => null} disabled />
              <TextField label="Type" value="NAV" onChange={() => null} disabled />
            </div>

            <TextAreaField
              label="Nav (JSON object)"
              value={navForm.navText}
              onChange={(v) => setNavForm({ navText: v })}
              rows={26}
            />
          </div>
        ) : null}

        {activeSection?.section_type === "UNKNOWN" ? (
          <div className="space-y-4">
            <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Ye section unknown structure ka hai. Abhi mapping set nahi ki.
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField
                label="Section Key"
                value={activeSection.section_key}
                onChange={() => null}
                disabled
              />
              <TextField label="Type" value="UNKNOWN" onChange={() => null} disabled />
            </div>
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap items-center justify-end gap-2 border-t border-slate-200 pt-4">
          {saveErr ? (
            <div className="mr-auto text-sm font-semibold text-rose-700">{saveErr}</div>
          ) : null}

          <button
            type="button"
            onClick={() => setActiveKey(null)}
            disabled={saving}
            className={cx(
              "inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800",
              saving ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:bg-slate-50"
            )}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={saveActiveSection}
            disabled={saving || !activeSection || !rawHeader}
            className={cx(
              "inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white",
              saving || !activeSection || !rawHeader
                ? "cursor-not-allowed opacity-60"
                : "cursor-pointer hover:bg-slate-800"
            )}
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </EditModal>
    </div>
  );
}
