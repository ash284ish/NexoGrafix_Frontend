"use client";

import React, { useEffect, useMemo, useState } from "react";
import { FiAlertTriangle, FiEdit3, FiX, FiTag } from "react-icons/fi";
import SectionHeader from "@/components/dashboard/assets/SectionHeader";
import ToastTopRight from "@/components/ui/Toast";

type SectionType =
  | "META"
  | "HERO"
  | "TRUST_METRICS"
  | "SERVICES_CAROUSEL"
  | "CONTACT_CTA"
  | "UNKNOWN";

type CmsSection = {
  id: string;
  section_key: string;
  section_type: SectionType;
  title: string;
  subtitle: string;
  order_index: number;
  is_enabled: boolean;
  meta?: { badge?: string; alignment?: "left" | "center" | "right" };
  raw: Record<string, unknown>;
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

function asNumber(v: unknown, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function toStr(v: unknown) {
  if (v === null || v === undefined) return "";
  return String(v);
}

function toLines(arr: unknown): string {
  if (!Array.isArray(arr)) return "";
  return arr.map((x) => toStr(x)).filter(Boolean).join("\n");
}

function fromLines(text: string): string[] {
  return (text || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function toJsonText(v: unknown): string {
  try {
    return JSON.stringify(v ?? null, null, 2);
  } catch {
    return "";
  }
}

function parseJsonText(text: string): unknown {
  const t = (text || "").trim();
  if (!t) return null;
  return JSON.parse(t);
}

function buildSections(json: Record<string, any>): CmsSection[] {
  const sections: CmsSection[] = [];

  const meta = (json?.meta || {}) as Record<string, any>;
  const status = String(json?.meta?.status || "").toLowerCase();
  const defaultEnabled =
    status === "published" ||
    status === "live" ||
    status === "active" ||
    !status;

  if (json?.meta) {
    sections.push({
      id: "meta",
      section_key: "meta",
      section_type: "META",
      title: toStr(meta?.title || "Meta"),
      subtitle: toStr(meta?.route || "Page metadata"),
      order_index: 1,
      is_enabled: defaultEnabled,
      meta: { badge: "META", alignment: "left" },
      raw: json.meta as Record<string, unknown>,
    });
  }

  if (json?.hero) {
    const h = json.hero as Record<string, any>;
    sections.push({
      id: "hero",
      section_key: "hero",
      section_type: "HERO",
      title: toStr(h?.title || h?.eyebrow || "Hero"),
      subtitle: toStr(h?.subtitle || "—"),
      order_index: 2,
      is_enabled: defaultEnabled,
      meta: { badge: "HERO", alignment: "left" },
      raw: h as Record<string, unknown>,
    });
  }

  if (json?.trust_metrics) {
    const t = json.trust_metrics as Record<string, any>;
    sections.push({
      id: "trust_metrics",
      section_key: "trust_metrics",
      section_type: "TRUST_METRICS",
      title: toStr(t?.heading || "Trust metrics"),
      subtitle: toStr(t?.subheading || "—"),
      order_index: 3,
      is_enabled: defaultEnabled,
      meta: { badge: "METRICS", alignment: "left" },
      raw: t as Record<string, unknown>,
    });
  }

  if (json?.services_carousel) {
    const s = json.services_carousel as Record<string, any>;
    const slidesCount = Array.isArray(s?.slides) ? s.slides.length : 0;
    sections.push({
      id: "services_carousel",
      section_key: "services_carousel",
      section_type: "SERVICES_CAROUSEL",
      title: toStr(s?.heading || "Services carousel"),
      subtitle: `${slidesCount} slides • ${toStr(s?.subheading || "—")}`.trim(),
      order_index: 4,
      is_enabled: defaultEnabled,
      meta: { badge: "CAROUSEL", alignment: "left" },
      raw: s as Record<string, unknown>,
    });
  }

  if (json?.contact_cta) {
    const c = json.contact_cta as Record<string, any>;
    sections.push({
      id: "contact_cta",
      section_key: "contact_cta",
      section_type: "CONTACT_CTA",
      title: toStr(c?.heading || "Contact CTA"),
      subtitle: toStr(c?.subheading || "—"),
      order_index: 5,
      is_enabled: defaultEnabled,
      meta: { badge: "CTA", alignment: "left" },
      raw: c as Record<string, unknown>,
    });
  }

  const knownKeys = new Set([
    "meta",
    "hero",
    "trust_metrics",
    "services_carousel",
    "contact_cta",
  ]);

  Object.keys(json || {}).forEach((k) => {
    if (knownKeys.has(k)) return;
    const v = json?.[k] as Record<string, any>;
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
      raw: v as Record<string, unknown>,
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

function ToggleField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-md border border-slate-200 bg-white px-3 py-2">
      <div className="text-sm font-semibold text-slate-700">{label}</div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={cx(
          "relative inline-flex h-7 w-12 items-center rounded-full border transition",
          checked ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-slate-100"
        )}
      >
        <span
          className={cx(
            "inline-block h-5 w-5 translate-x-1 rounded-full bg-white shadow transition",
            checked ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
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

export default function AccessibilityAdminPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const endpoint = useMemo(
    () => joinApiUrl(API_BASE, "/api/v1/content/accessibilty-feature"),
    [API_BASE]
  );

  const [sections, setSections] = useState<CmsSection[]>([]);
  const [rawPage, setRawPage] = useState<Record<string, any> | null>(null);

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

  function persistToast(next: { tone: ToastTone; title: string; message?: string }) {
    try {
      sessionStorage.setItem("accessibility_admin_toast", JSON.stringify(next));
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("accessibility_admin_toast");
      if (!raw) return;
      sessionStorage.removeItem("accessibility_admin_toast");
      const parsed = JSON.parse(raw) as { tone?: ToastTone; title?: string; message?: string };
      if (!parsed?.title) return;
      setToast({
        open: true,
        tone: parsed.tone === "error" ? "error" : "success",
        title: parsed.title,
        message: parsed.message || "",
      });
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setErr(null);

        const res = await fetch(endpoint, { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to load accessibility content (${res.status})`);

        const json = (await res.json()) as Record<string, any>;
        const built = buildSections(json);

        if (alive) {
          setRawPage(json);
          setSections(built);
        }
      } catch (e) {
        if (alive) setErr(e instanceof Error ? e.message : "Failed to load accessibility content");
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
    heroImageSrc: "",
    heroImageAlt: "",
    chipsText: "",
    pillsText: "",
    badgesText: "",
    primaryHref: "",
    primaryLabel: "",
    noteText: "",
  });

  const [trustForm, setTrustForm] = useState({
    eyebrow: "",
    heading: "",
    subheading: "",
    columns: 3,
    centered: true,
    statsJson: "[]",
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
      const m = (activeSection.raw || {}) as Record<string, any>;
      setMetaForm({ title: toStr(m?.title), route: toStr(m?.route) });
    }

    if (activeSection.section_key === "hero") {
      const h = (activeSection.raw || {}) as Record<string, any>;
      const chips = Array.isArray(h?.chips) ? h.chips : [];
      const badges = Array.isArray(h?.badges) ? h.badges : [];
      setHeroForm({
        eyebrow: toStr(h?.eyebrow),
        title: toStr(h?.title),
        subtitle: toStr(h?.subtitle),
        heroImageSrc: toStr(h?.hero_image?.src),
        heroImageAlt: toStr(h?.hero_image?.alt),
        chipsText: chips
          .map((c: unknown) => {
            const item = c as Record<string, unknown>;
            return `${toStr(item?.iconKey)} | ${toStr(item?.text)}`.trim();
          })
          .filter(Boolean)
          .join("\n"),
        pillsText: toLines(h?.pills),
        badgesText: badges
          .map((b: unknown) => {
            const item = b as Record<string, unknown>;
            return `${toStr(item?.iconKey)} | ${toStr(item?.text)}`.trim();
          })
          .filter(Boolean)
          .join("\n"),
        primaryHref: toStr(h?.primary_cta?.href),
        primaryLabel: toStr(h?.primary_cta?.label),
        noteText: toStr(h?.note_text),
      });
    }

    if (activeSection.section_key === "trust_metrics") {
      const t = (activeSection.raw || {}) as Record<string, any>;
      setTrustForm({
        eyebrow: toStr(t?.eyebrow),
        heading: toStr(t?.heading),
        subheading: toStr(t?.subheading),
        columns: asNumber(t?.columns, 3),
        centered: Boolean(t?.centered),
        statsJson: toJsonText(t?.stats ?? []),
      });
    }

    if (activeSection.section_key === "services_carousel") {
      const s = (activeSection.raw || {}) as Record<string, any>;
      setCarouselForm({
        eyebrow: toStr(s?.eyebrow),
        heading: toStr(s?.heading),
        subheading: toStr(s?.subheading),
        autoRotateMs: asNumber(s?.auto_rotate_ms, 6500),
        pauseOnHover: Boolean(s?.pause_on_hover),
        showTabs: Boolean(s?.show_tabs),
        slidesJson: toJsonText(s?.slides ?? []),
      });
    }

    if (activeSection.section_key === "contact_cta") {
      const c = (activeSection.raw || {}) as Record<string, any>;
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

  function parsePairs(text: string): Array<{ iconKey: string; text: string }> {
    return (text || "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const parts = line.split("|");
        const iconKey = toStr(parts[0]).trim();
        const rest = parts.slice(1).join("|").trim();
        return { iconKey, text: rest };
      })
      .filter((x) => x.iconKey || x.text)
      .map((x) => ({ iconKey: x.iconKey, text: x.text }));
  }

  async function saveActiveSection() {
    if (!rawPage || !activeSection) return;

    try {
      setSaving(true);
      setSaveErr(null);

      const updated = structuredClone(rawPage);

      if (activeSection.section_key === "meta") {
        updated.meta = updated.meta || {};
        updated.meta.title = metaForm.title;
        updated.meta.route = metaForm.route;
      }

      if (activeSection.section_key === "hero") {
        updated.hero = updated.hero || {};
        updated.hero.eyebrow = heroForm.eyebrow;
        updated.hero.title = heroForm.title;
        updated.hero.subtitle = heroForm.subtitle;

        updated.hero.hero_image = updated.hero.hero_image || {};
        updated.hero.hero_image.src = heroForm.heroImageSrc;
        updated.hero.hero_image.alt = heroForm.heroImageAlt;

        updated.hero.chips = parsePairs(heroForm.chipsText);
        updated.hero.pills = fromLines(heroForm.pillsText);
        updated.hero.badges = parsePairs(heroForm.badgesText);

        updated.hero.primary_cta = updated.hero.primary_cta || {};
        updated.hero.primary_cta.href = heroForm.primaryHref;
        updated.hero.primary_cta.label = heroForm.primaryLabel;

        updated.hero.note_text = heroForm.noteText;
      }

      if (activeSection.section_key === "trust_metrics") {
        updated.trust_metrics = updated.trust_metrics || {};
        updated.trust_metrics.eyebrow = trustForm.eyebrow;
        updated.trust_metrics.heading = trustForm.heading;
        updated.trust_metrics.subheading = trustForm.subheading;
        updated.trust_metrics.columns = asNumber(trustForm.columns, 3);
        updated.trust_metrics.centered = Boolean(trustForm.centered);

        let stats: unknown = [];
        try {
          stats = parseJsonText(trustForm.statsJson);
        } catch {
          throw new Error("Invalid JSON in stats");
        }
        if (!Array.isArray(stats)) throw new Error("Stats must be a JSON array");
        updated.trust_metrics.stats = stats;
      }

      if (activeSection.section_key === "services_carousel") {
        updated.services_carousel = updated.services_carousel || {};
        updated.services_carousel.eyebrow = carouselForm.eyebrow;
        updated.services_carousel.heading = carouselForm.heading;
        updated.services_carousel.subheading = carouselForm.subheading;
        updated.services_carousel.auto_rotate_ms = asNumber(carouselForm.autoRotateMs, 6500);
        updated.services_carousel.pause_on_hover = Boolean(carouselForm.pauseOnHover);
        updated.services_carousel.show_tabs = Boolean(carouselForm.showTabs);

        let slides: unknown = [];
        try {
          slides = parseJsonText(carouselForm.slidesJson);
        } catch {
          throw new Error("Invalid JSON in slides");
        }
        if (!Array.isArray(slides)) throw new Error("Slides must be a JSON array");
        updated.services_carousel.slides = slides;
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

      const saveUrl = joinApiUrl(API_BASE, "/api/v1/content/accessibilty-feature");
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
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to save changes";
      setSaveErr(msg);
      setToast({
        open: true,
        tone: "error",
        title: "Save failed",
        message: msg,
      });
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
        title="Accessibility Page Management"
        subtitle="Accessibility page content loaded from CMS JSON."
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
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 font-semibold">
                      Route: /api/v1/content/accessibilty-feature
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
        subtitle={activeSection ? `Update fields and save to /api/v1/content/accessibilty-feature` : ""}
        onClose={() => (saving ? null : setActiveKey(null))}
      >
        {activeSection?.section_key === "meta" ? (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Section Key" value="meta" onChange={() => null} disabled />
              <TextField label="Type" value="META" onChange={() => null} disabled />
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Title" value={metaForm.title} onChange={(v) => setMetaForm((p) => ({ ...p, title: v }))} />
              <TextField label="Route" value={metaForm.route} onChange={(v) => setMetaForm((p) => ({ ...p, route: v }))} />
            </div>
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

            <TextAreaField
              label="Subtitle"
              value={heroForm.subtitle}
              onChange={(v) => setHeroForm((p) => ({ ...p, subtitle: v }))}
              rows={3}
            />

            <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
              Hero Image
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField
                label="Image Src"
                value={heroForm.heroImageSrc}
                onChange={(v) => setHeroForm((p) => ({ ...p, heroImageSrc: v }))}
              />
              <TextField
                label="Image Alt"
                value={heroForm.heroImageAlt}
                onChange={(v) => setHeroForm((p) => ({ ...p, heroImageAlt: v }))}
              />
            </div>

            <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
              Chips (one per line: iconKey | text)
            </div>
            <TextAreaField
              label="Chips"
              value={heroForm.chipsText}
              onChange={(v) => setHeroForm((p) => ({ ...p, chipsText: v }))}
              rows={6}
            />

            <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
              Pills (one per line)
            </div>
            <TextAreaField
              label="Pills"
              value={heroForm.pillsText}
              onChange={(v) => setHeroForm((p) => ({ ...p, pillsText: v }))}
              rows={6}
            />

            <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
              Badges (one per line: iconKey | text)
            </div>
            <TextAreaField
              label="Badges"
              value={heroForm.badgesText}
              onChange={(v) => setHeroForm((p) => ({ ...p, badgesText: v }))}
              rows={6}
            />

            <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
              Primary CTA
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField
                label="Href"
                value={heroForm.primaryHref}
                onChange={(v) => setHeroForm((p) => ({ ...p, primaryHref: v }))}
              />
              <TextField
                label="Label"
                value={heroForm.primaryLabel}
                onChange={(v) => setHeroForm((p) => ({ ...p, primaryLabel: v }))}
              />
            </div>

            <TextField
              label="Note Text"
              value={heroForm.noteText}
              onChange={(v) => setHeroForm((p) => ({ ...p, noteText: v }))}
            />
          </div>
        ) : null}

        {activeSection?.section_key === "trust_metrics" ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Section Key" value="trust_metrics" onChange={() => null} disabled />
              <TextField label="Type" value="TRUST_METRICS" onChange={() => null} disabled />
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Eyebrow" value={trustForm.eyebrow} onChange={(v) => setTrustForm((p) => ({ ...p, eyebrow: v }))} />
              <NumberField label="Columns" value={trustForm.columns} onChange={(v) => setTrustForm((p) => ({ ...p, columns: v }))} />
            </div>

            <TextField label="Heading" value={trustForm.heading} onChange={(v) => setTrustForm((p) => ({ ...p, heading: v }))} />

            <TextAreaField
              label="Subheading"
              value={trustForm.subheading}
              onChange={(v) => setTrustForm((p) => ({ ...p, subheading: v }))}
              rows={3}
            />

            <ToggleField
              label="Centered"
              checked={trustForm.centered}
              onChange={(v) => setTrustForm((p) => ({ ...p, centered: v }))}
            />

            <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
              Stats (JSON array)
            </div>
            <TextAreaField
              label="Stats JSON"
              value={trustForm.statsJson}
              onChange={(v) => setTrustForm((p) => ({ ...p, statsJson: v }))}
              rows={14}
            />
          </div>
        ) : null}

        {activeSection?.section_key === "services_carousel" ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Section Key" value="services_carousel" onChange={() => null} disabled />
              <TextField label="Type" value="SERVICES_CAROUSEL" onChange={() => null} disabled />
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField
                label="Eyebrow"
                value={carouselForm.eyebrow}
                onChange={(v) => setCarouselForm((p) => ({ ...p, eyebrow: v }))}
              />
              <NumberField
                label="Auto Rotate (ms)"
                value={carouselForm.autoRotateMs}
                onChange={(v) => setCarouselForm((p) => ({ ...p, autoRotateMs: v }))}
              />
            </div>

            <TextField
              label="Heading"
              value={carouselForm.heading}
              onChange={(v) => setCarouselForm((p) => ({ ...p, heading: v }))}
            />

            <TextAreaField
              label="Subheading"
              value={carouselForm.subheading}
              onChange={(v) => setCarouselForm((p) => ({ ...p, subheading: v }))}
              rows={3}
            />

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <ToggleField
                label="Pause on hover"
                checked={carouselForm.pauseOnHover}
                onChange={(v) => setCarouselForm((p) => ({ ...p, pauseOnHover: v }))}
              />
              <ToggleField
                label="Show tabs"
                checked={carouselForm.showTabs}
                onChange={(v) => setCarouselForm((p) => ({ ...p, showTabs: v }))}
              />
            </div>

            <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
              Slides (JSON array)
            </div>
            <TextAreaField
              label="Slides JSON"
              value={carouselForm.slidesJson}
              onChange={(v) => setCarouselForm((p) => ({ ...p, slidesJson: v }))}
              rows={16}
            />
          </div>
        ) : null}

        {activeSection?.section_key === "contact_cta" ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Section Key" value="contact_cta" onChange={() => null} disabled />
              <TextField label="Type" value="CONTACT_CTA" onChange={() => null} disabled />
            </div>

            <TextField label="Eyebrow" value={ctaForm.eyebrow} onChange={(v) => setCtaForm((p) => ({ ...p, eyebrow: v }))} />
            <TextField label="Heading" value={ctaForm.heading} onChange={(v) => setCtaForm((p) => ({ ...p, heading: v }))} />

            <TextAreaField
              label="Subheading"
              value={ctaForm.subheading}
              onChange={(v) => setCtaForm((p) => ({ ...p, subheading: v }))}
              rows={3}
            />

            <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
              Primary CTA
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField
                label="Href"
                value={ctaForm.primaryHref}
                onChange={(v) => setCtaForm((p) => ({ ...p, primaryHref: v }))}
              />
              <TextField
                label="Label"
                value={ctaForm.primaryLabel}
                onChange={(v) => setCtaForm((p) => ({ ...p, primaryLabel: v }))}
              />
            </div>

            <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
              Bullets (one per line)
            </div>
            <TextAreaField
              label="Bullets"
              value={ctaForm.bulletsText}
              onChange={(v) => setCtaForm((p) => ({ ...p, bulletsText: v }))}
              rows={8}
            />

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
            disabled={saving || !activeSection || !rawPage}
            className={cx(
              "inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white",
              saving || !activeSection || !rawPage ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:bg-slate-800"
            )}
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </EditModal>
    </div>
  );
}
