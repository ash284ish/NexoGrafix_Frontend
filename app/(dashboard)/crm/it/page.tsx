"use client";

import React, { useEffect, useMemo, useState } from "react";
import { FiAlertTriangle, FiEdit3, FiTag, FiX } from "react-icons/fi";
import SectionHeader from "@/components/dashboard/assets/SectionHeader";
import ToastTopRight from "@/components/ui/Toast";

type SectionType = "META" | "HERO" | "TRUST" | "CAROUSEL" | "CTA" | "UNKNOWN";

type CmsSection = {
  id: string;
  section_key: string;
  section_type: SectionType;
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
    <span className={cx("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1", styles)}>
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

function asNumber(v: any, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function toLines(arr: any): string {
  if (!Array.isArray(arr)) return "";
  return arr.map((x) => toStr(x)).filter(Boolean).join("\n");
}

function fromLines(text: string): string[] {
  return (text || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function safeJsonStringify(v: any): string {
  try {
    return JSON.stringify(v ?? null, null, 2);
  } catch {
    return "";
  }
}

function safeJsonParse(text: string) {
  const t = (text || "").trim();
  if (!t) return null;
  return JSON.parse(t);
}

function buildSections(json: any): CmsSection[] {
  const sections: CmsSection[] = [];

  const status = String(json?.meta?.status || "").toLowerCase();
  const defaultEnabled = status === "published" || status === "live" || status === "active" || !status;

  if (json?.meta) {
    sections.push({
      id: "meta",
      section_key: "meta",
      section_type: "META",
      title: toStr(json?.meta?.title || "Meta"),
      subtitle: toStr(json?.meta?.route || "Page metadata"),
      order_index: 1,
      is_enabled: defaultEnabled,
      meta: { badge: "META", alignment: "left" },
      raw: json.meta,
    });
  }

  if (json?.hero) {
    const h = json.hero;
    sections.push({
      id: "hero",
      section_key: "hero",
      section_type: "HERO",
      title: toStr(h?.title || h?.eyebrow || "Hero"),
      subtitle: toStr(h?.subtitle || "—"),
      order_index: 2,
      is_enabled: defaultEnabled,
      meta: { badge: "HERO", alignment: "left" },
      raw: h,
    });
  }

  const trustKey = json?.trust_metrics ? "trust_metrics" : json?.proof_stats ? "proof_stats" : null;
  if (trustKey) {
    const t = json[trustKey];
    sections.push({
      id: trustKey,
      section_key: trustKey,
      section_type: "TRUST",
      title: toStr(t?.heading || "Trust metrics"),
      subtitle: toStr(t?.subheading || "—"),
      order_index: 3,
      is_enabled: defaultEnabled,
      meta: { badge: trustKey === "trust_metrics" ? "TRUST" : "PROOF", alignment: "left" },
      raw: t,
    });
  }

  if (json?.services_carousel) {
    const sc = json.services_carousel;
    sections.push({
      id: "services_carousel",
      section_key: "services_carousel",
      section_type: "CAROUSEL",
      title: toStr(sc?.heading || "Services carousel"),
      subtitle: toStr(sc?.subheading || "—"),
      order_index: 4,
      is_enabled: defaultEnabled,
      meta: { badge: "CAROUSEL", alignment: "left" },
      raw: sc,
    });
  }

  if (json?.contact_cta) {
    const cta = json.contact_cta;
    sections.push({
      id: "contact_cta",
      section_key: "contact_cta",
      section_type: "CTA",
      title: toStr(cta?.heading || "Contact CTA"),
      subtitle: toStr(cta?.subheading || "—"),
      order_index: 5,
      is_enabled: defaultEnabled,
      meta: { badge: "CTA", alignment: "left" },
      raw: cta,
    });
  }

  const knownKeys = new Set(["meta", "hero", "trust_metrics", "proof_stats", "services_carousel", "contact_cta"]);
  Object.keys(json || {}).forEach((k) => {
    if (knownKeys.has(k)) return;
    const v = json?.[k];
    if (!v || typeof v !== "object") return;
    const title = v?.title || v?.heading || v?.name || k;
    const subtitle = v?.subtitle || v?.subheading || v?.description || "—";
    sections.push({
      id: k,
      section_key: k,
      section_type: "UNKNOWN",
      title: toStr(title),
      subtitle: toStr(subtitle),
      order_index: 999,
      is_enabled: defaultEnabled,
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
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <label className="grid gap-1.5">
      <div className="text-xs font-semibold text-slate-600">{label}</div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={cx(
          "w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none",
          "focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
        )}
      />
    </label>
  );
}

function NumberField({
  label,
  value,
  onChange,
  placeholder,
  disabled,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <label className="grid gap-1.5">
      <div className="text-xs font-semibold text-slate-600">{label}</div>
      <input
        value={Number.isFinite(value) ? String(value) : ""}
        onChange={(e) => onChange(asNumber(e.target.value, 0))}
        placeholder={placeholder}
        inputMode="numeric"
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
    <div className="fixed inset-0 z-[80]">
      <div className="absolute inset-0 cursor-pointer bg-slate-950/40 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-3xl overflow-hidden rounded-md bg-white shadow-xl ring-1 ring-slate-200">
          <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
            <div className="min-w-0">
              <div className="text-base font-bold text-slate-900">{title}</div>
              {subtitle ? <div className="mt-0.5 text-sm text-slate-600">{subtitle}</div> : null}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            >
              <FiX />
            </button>
          </div>

          <div className="max-h-[70vh] overflow-auto px-5 py-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

type ToastTone = "success" | "error";
type ToastState = { open: boolean; tone: ToastTone; title: string; message?: string };

export default function ITServicesAdminPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const routePath = "/api/v1/content/it-developement";
  const endpoint = useMemo(() => joinApiUrl(API_BASE, routePath), [API_BASE]);

  const [sections, setSections] = useState<CmsSection[]>([]);
  const [rawDoc, setRawDoc] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveErr, setSaveErr] = useState<string | null>(null);

  const [toast, setToast] = useState<ToastState>({ open: false, tone: "success", title: "", message: "" });

  function persistToast(next: { tone: ToastTone; title: string; message?: string }) {
    try {
      sessionStorage.setItem("it_services_admin_toast", JSON.stringify(next));
    } catch {}
  }

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("it_services_admin_toast");
      if (!raw) return;
      sessionStorage.removeItem("it_services_admin_toast");
      const parsed = JSON.parse(raw) as { tone?: ToastTone; title?: string; message?: string };
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
        if (!res.ok) throw new Error(`Failed to load IT services content (${res.status})`);

        const json = await res.json();
        const built = buildSections(json);

        if (alive) {
          setRawDoc(json);
          setSections(built);
        }
      } catch (e: any) {
        if (alive) setErr(e?.message || "Failed to load IT services content");
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

  const [metaForm, setMetaForm] = useState({ title: "", route: "" });

  const [heroForm, setHeroForm] = useState({
    eyebrow: "",
    title: "",
    subtitle: "",
    noteText: "",
    heroImageSrc: "",
    heroImageAlt: "",
    pillsText: "",
    chipsJson: "[]",
    badgesJson: "[]",
    primaryHref: "",
    primaryLabel: "",
  });

  const [trustForm, setTrustForm] = useState({
    eyebrow: "",
    heading: "",
    subheading: "",
    columns: 3,
    centered: true,
    statsJson: "[]",
    keyName: "trust_metrics",
  });

  const [carouselForm, setCarouselForm] = useState({
    eyebrow: "",
    heading: "",
    subheading: "",
    autoRotateMs: 6500,
    pauseOnHover: true,
    showTabs: true,
    slidesJson: "[]",
  });

  const [ctaForm, setCtaForm] = useState({
    eyebrow: "",
    heading: "",
    subheading: "",
    primaryHref: "",
    primaryLabel: "",
    bulletsText: "",
    noteText: "",
  });

  useEffect(() => {
    if (!activeSection) return;

    setSaveErr(null);

    if (activeSection.section_key === "meta") {
      const m = activeSection.raw || {};
      setMetaForm({
        title: toStr(m?.title),
        route: toStr(m?.route),
      });
    }

    if (activeSection.section_key === "hero") {
      const h = activeSection.raw || {};
      setHeroForm({
        eyebrow: toStr(h?.eyebrow),
        title: toStr(h?.title),
        subtitle: toStr(h?.subtitle),
        noteText: toStr(h?.note_text),
        heroImageSrc: toStr(h?.hero_image?.src),
        heroImageAlt: toStr(h?.hero_image?.alt),
        pillsText: toLines(h?.pills),
        chipsJson: safeJsonStringify(h?.chips ?? []),
        badgesJson: safeJsonStringify(h?.badges ?? []),
        primaryHref: toStr(h?.primary_cta?.href),
        primaryLabel: toStr(h?.primary_cta?.label),
      });
    }

    if (activeSection.section_type === "TRUST") {
      const t = activeSection.raw || {};
      setTrustForm({
        eyebrow: toStr(t?.eyebrow),
        heading: toStr(t?.heading),
        subheading: toStr(t?.subheading),
        columns: asNumber(t?.columns, 3),
        centered: Boolean(t?.centered),
        statsJson: safeJsonStringify(t?.stats ?? []),
        keyName: activeSection.section_key,
      });
    }

    if (activeSection.section_key === "services_carousel") {
      const sc = activeSection.raw || {};
      setCarouselForm({
        eyebrow: toStr(sc?.eyebrow),
        heading: toStr(sc?.heading),
        subheading: toStr(sc?.subheading),
        autoRotateMs: asNumber(sc?.auto_rotate_ms, 6500),
        pauseOnHover: Boolean(sc?.pause_on_hover),
        showTabs: Boolean(sc?.show_tabs),
        slidesJson: safeJsonStringify(sc?.slides ?? []),
      });
    }

    if (activeSection.section_key === "contact_cta") {
      const c = activeSection.raw || {};
      setCtaForm({
        eyebrow: toStr(c?.eyebrow),
        heading: toStr(c?.heading),
        subheading: toStr(c?.subheading),
        primaryHref: toStr(c?.primary_cta?.href),
        primaryLabel: toStr(c?.primary_cta?.label),
        bulletsText: toLines(c?.bullets),
        noteText: toStr(c?.note_text),
      });
    }
  }, [activeSection]);

  async function saveActiveSection() {
    if (!rawDoc || !activeSection) return;

    try {
      setSaving(true);
      setSaveErr(null);

      const updated = structuredClone(rawDoc);

      if (activeSection.section_key === "meta") {
        updated.meta = updated.meta || {};
        updated.meta.title = metaForm.title;
        if (metaForm.route) updated.meta.route = metaForm.route;
        else if ("route" in (updated.meta || {})) delete updated.meta.route;
      }

      if (activeSection.section_key === "hero") {
        updated.hero = updated.hero || {};
        updated.hero.eyebrow = heroForm.eyebrow;
        updated.hero.title = heroForm.title;
        updated.hero.subtitle = heroForm.subtitle;
        updated.hero.note_text = heroForm.noteText;

        updated.hero.hero_image = updated.hero.hero_image || {};
        updated.hero.hero_image.src = heroForm.heroImageSrc;
        updated.hero.hero_image.alt = heroForm.heroImageAlt;

        updated.hero.pills = fromLines(heroForm.pillsText);

        updated.hero.chips = safeJsonParse(heroForm.chipsJson) ?? [];
        updated.hero.badges = safeJsonParse(heroForm.badgesJson) ?? [];

        updated.hero.primary_cta = updated.hero.primary_cta || {};
        updated.hero.primary_cta.href = heroForm.primaryHref;
        updated.hero.primary_cta.label = heroForm.primaryLabel;
      }

      if (activeSection.section_type === "TRUST") {
        const key = trustForm.keyName;
        updated[key] = updated[key] || {};
        updated[key].eyebrow = trustForm.eyebrow;
        updated[key].heading = trustForm.heading;
        updated[key].subheading = trustForm.subheading;
        updated[key].columns = trustForm.columns;
        updated[key].centered = Boolean(trustForm.centered);
        updated[key].stats = safeJsonParse(trustForm.statsJson) ?? [];
      }

      if (activeSection.section_key === "services_carousel") {
        updated.services_carousel = updated.services_carousel || {};
        updated.services_carousel.eyebrow = carouselForm.eyebrow;
        updated.services_carousel.heading = carouselForm.heading;
        updated.services_carousel.subheading = carouselForm.subheading;
        updated.services_carousel.auto_rotate_ms = carouselForm.autoRotateMs;
        updated.services_carousel.pause_on_hover = Boolean(carouselForm.pauseOnHover);
        updated.services_carousel.show_tabs = Boolean(carouselForm.showTabs);
        updated.services_carousel.slides = safeJsonParse(carouselForm.slidesJson) ?? [];
      }

      if (activeSection.section_key === "contact_cta") {
        updated.contact_cta = updated.contact_cta || {};
        updated.contact_cta.eyebrow = ctaForm.eyebrow;
        updated.contact_cta.heading = ctaForm.heading;
        updated.contact_cta.subheading = ctaForm.subheading;

        updated.contact_cta.primary_cta = updated.contact_cta.primary_cta || {};
        updated.contact_cta.primary_cta.href = ctaForm.primaryHref;
        updated.contact_cta.primary_cta.label = ctaForm.primaryLabel;

        updated.contact_cta.bullets = fromLines(ctaForm.bulletsText);
        updated.contact_cta.note_text = ctaForm.noteText;
      }

      if (activeSection.section_type === "UNKNOWN") {
        throw new Error("Is unknown section ke liye form mapping set nahi hai.");
      }

      const saveUrl = joinApiUrl(API_BASE, routePath);
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
            ? { type: toast.tone === "success" ? "success" : "error", msg: toast.message ? `${toast.title}: ${toast.message}` : toast.title }
            : null
        }
        onClose={() => setToast((p) => ({ ...p, open: false }))}
        duration={4000}
      />

      <SectionHeader
        title="IT Services Page Management"
        subtitle="IT services content loaded from CMS JSON."
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
            <div key={s.id} className="rounded-md bg-white p-5 shadow-sm ring-1 ring-slate-200/60">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="text-sm font-semibold text-slate-900">
                      {s.section_key}
                      <span className="ml-2 text-xs font-semibold text-slate-400">({s.section_type})</span>
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
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 font-semibold">Order: {s.order_index}</span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 font-semibold">Route: {routePath}</span>
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
              <div className="h-4 w-[520px] rounded bg-slate-200" />
              <div className="h-4 w-[420px] rounded bg-slate-200" />
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
        subtitle={activeSection ? `Update fields and save to ${routePath}` : ""}
        onClose={() => (saving ? null : setActiveKey(null))}
      >
        {activeSection?.section_key === "meta" ? (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Section Key" value="meta" onChange={() => null} disabled />
              <TextField label="Type" value="META" onChange={() => null} disabled />
            </div>
            <TextField label="Title" value={metaForm.title} onChange={(v) => setMetaForm((p) => ({ ...p, title: v }))} />
            <TextField label="Route" value={metaForm.route} onChange={(v) => setMetaForm((p) => ({ ...p, route: v }))} placeholder="/it-services" />
          </div>
        ) : null}

        {activeSection?.section_key === "hero" ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Section Key" value="hero" onChange={() => null} disabled />
              <TextField label="Type" value="HERO" onChange={() => null} disabled />
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Eyebrow" value={heroForm.eyebrow} onChange={(v) => setHeroForm((p) => ({ ...p, eyebrow: v }))} />
              <TextField label="Title" value={heroForm.title} onChange={(v) => setHeroForm((p) => ({ ...p, title: v }))} />
            </div>

            <TextAreaField label="Subtitle" value={heroForm.subtitle} onChange={(v) => setHeroForm((p) => ({ ...p, subtitle: v }))} rows={3} />

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Hero Image Src" value={heroForm.heroImageSrc} onChange={(v) => setHeroForm((p) => ({ ...p, heroImageSrc: v }))} />
              <TextField label="Hero Image Alt" value={heroForm.heroImageAlt} onChange={(v) => setHeroForm((p) => ({ ...p, heroImageAlt: v }))} />
            </div>

            <TextAreaField label="Pills (one per line)" value={heroForm.pillsText} onChange={(v) => setHeroForm((p) => ({ ...p, pillsText: v }))} rows={5} />

            <TextAreaField
              label="Chips (JSON array)"
              value={heroForm.chipsJson}
              onChange={(v) => setHeroForm((p) => ({ ...p, chipsJson: v }))}
              rows={6}
            />

            <TextAreaField
              label="Badges (JSON array)"
              value={heroForm.badgesJson}
              onChange={(v) => setHeroForm((p) => ({ ...p, badgesJson: v }))}
              rows={6}
            />

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Primary CTA Href" value={heroForm.primaryHref} onChange={(v) => setHeroForm((p) => ({ ...p, primaryHref: v }))} />
              <TextField label="Primary CTA Label" value={heroForm.primaryLabel} onChange={(v) => setHeroForm((p) => ({ ...p, primaryLabel: v }))} />
            </div>

            <TextField label="Note Text" value={heroForm.noteText} onChange={(v) => setHeroForm((p) => ({ ...p, noteText: v }))} />
          </div>
        ) : null}

        {activeSection?.section_type === "TRUST" ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Section Key" value={trustForm.keyName} onChange={() => null} disabled />
              <TextField label="Type" value="TRUST" onChange={() => null} disabled />
            </div>

            <TextField label="Eyebrow" value={trustForm.eyebrow} onChange={(v) => setTrustForm((p) => ({ ...p, eyebrow: v }))} />
            <TextField label="Heading" value={trustForm.heading} onChange={(v) => setTrustForm((p) => ({ ...p, heading: v }))} />
            <TextAreaField label="Subheading" value={trustForm.subheading} onChange={(v) => setTrustForm((p) => ({ ...p, subheading: v }))} rows={3} />

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <NumberField label="Columns" value={trustForm.columns} onChange={(v) => setTrustForm((p) => ({ ...p, columns: v }))} />
              <TextField
                label="Centered (true/false)"
                value={String(trustForm.centered)}
                onChange={(v) => setTrustForm((p) => ({ ...p, centered: v.trim().toLowerCase() === "true" }))}
              />
              <TextField label="Key Name" value={trustForm.keyName} onChange={() => null} disabled />
            </div>

            <TextAreaField
              label="Stats (JSON array)"
              value={trustForm.statsJson}
              onChange={(v) => setTrustForm((p) => ({ ...p, statsJson: v }))}
              rows={10}
            />
          </div>
        ) : null}

        {activeSection?.section_key === "services_carousel" ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Section Key" value="services_carousel" onChange={() => null} disabled />
              <TextField label="Type" value="CAROUSEL" onChange={() => null} disabled />
            </div>

            <TextField label="Eyebrow" value={carouselForm.eyebrow} onChange={(v) => setCarouselForm((p) => ({ ...p, eyebrow: v }))} />
            <TextField label="Heading" value={carouselForm.heading} onChange={(v) => setCarouselForm((p) => ({ ...p, heading: v }))} />
            <TextAreaField label="Subheading" value={carouselForm.subheading} onChange={(v) => setCarouselForm((p) => ({ ...p, subheading: v }))} rows={3} />

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <NumberField label="Auto Rotate (ms)" value={carouselForm.autoRotateMs} onChange={(v) => setCarouselForm((p) => ({ ...p, autoRotateMs: v }))} />
              <TextField
                label="Pause On Hover (true/false)"
                value={String(carouselForm.pauseOnHover)}
                onChange={(v) => setCarouselForm((p) => ({ ...p, pauseOnHover: v.trim().toLowerCase() === "true" }))}
              />
              <TextField
                label="Show Tabs (true/false)"
                value={String(carouselForm.showTabs)}
                onChange={(v) => setCarouselForm((p) => ({ ...p, showTabs: v.trim().toLowerCase() === "true" }))}
              />
            </div>

            <TextAreaField
              label="Slides (JSON array)"
              value={carouselForm.slidesJson}
              onChange={(v) => setCarouselForm((p) => ({ ...p, slidesJson: v }))}
              rows={14}
            />
          </div>
        ) : null}

        {activeSection?.section_key === "contact_cta" ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Section Key" value="contact_cta" onChange={() => null} disabled />
              <TextField label="Type" value="CTA" onChange={() => null} disabled />
            </div>

            <TextField label="Eyebrow" value={ctaForm.eyebrow} onChange={(v) => setCtaForm((p) => ({ ...p, eyebrow: v }))} />
            <TextField label="Heading" value={ctaForm.heading} onChange={(v) => setCtaForm((p) => ({ ...p, heading: v }))} />
            <TextAreaField label="Subheading" value={ctaForm.subheading} onChange={(v) => setCtaForm((p) => ({ ...p, subheading: v }))} rows={3} />

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Primary CTA Href" value={ctaForm.primaryHref} onChange={(v) => setCtaForm((p) => ({ ...p, primaryHref: v }))} />
              <TextField label="Primary CTA Label" value={ctaForm.primaryLabel} onChange={(v) => setCtaForm((p) => ({ ...p, primaryLabel: v }))} />
            </div>

            <TextAreaField label="Bullets (one per line)" value={ctaForm.bulletsText} onChange={(v) => setCtaForm((p) => ({ ...p, bulletsText: v }))} rows={7} />
            <TextField label="Note Text" value={ctaForm.noteText} onChange={(v) => setCtaForm((p) => ({ ...p, noteText: v }))} />
          </div>
        ) : null}

        {activeSection?.section_type === "UNKNOWN" ? (
          <div className="space-y-4">
            <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Ye section unknown structure ka hai. Abhi form mapping iske liye set nahi ki.
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Section Key" value={activeSection.section_key} onChange={() => null} disabled />
              <TextField label="Type" value="UNKNOWN" onChange={() => null} disabled />
            </div>
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap items-center justify-end gap-2 border-t border-slate-200 pt-4">
          {saveErr ? <div className="mr-auto text-sm font-semibold text-rose-700">{saveErr}</div> : null}

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
            disabled={saving || !activeSection || !rawDoc}
            className={cx(
              "inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white",
              saving || !activeSection || !rawDoc ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:bg-slate-800"
            )}
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </EditModal>
    </div>
  );
}
