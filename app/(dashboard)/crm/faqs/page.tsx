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

type FaqSectionType =
  | "META"
  | "CATEGORIES"
  | "HERO"
  | "EMPTY_STATE"
  | "BOTTOM_CTA"
  | "FAQS"
  | "UNKNOWN";

type FaqSection = {
  id: string;
  section_key: string;
  section_type: FaqSectionType;
  title: string;
  subtitle: string;
  order_index: number;
  is_enabled: boolean;
  meta?: { badge?: string; alignment?: "left" | "center" | "right" };
  raw: unknown;
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

function safeClone<T>(v: T): T {
  return typeof structuredClone === "function"
    ? structuredClone(v)
    : JSON.parse(JSON.stringify(v));
}

function stringifyPretty(v: unknown) {
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

function buildFaqSections(json: Record<string, unknown>): FaqSection[] {
  const sections: FaqSection[] = [];
  const meta = json?.meta as Record<string, unknown> | undefined;
  const status = String(meta?.status || "").toLowerCase();
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
      subtitle: "Page metadata",
      order_index: 1,
      is_enabled: defaultEnabled,
      meta: { badge: "META", alignment: "left" },
      raw: json.meta,
    });
  }

  if (Array.isArray(json?.categories)) {
    sections.push({
      id: "categories",
      section_key: "categories",
      section_type: "CATEGORIES",
      title: `Categories (${json.categories.length})`,
      subtitle:
        json.categories.slice(0, 6).join(", ") +
        (json.categories.length > 6 ? "…" : ""),
      order_index: 2,
      is_enabled: defaultEnabled,
      meta: { badge: "CATEGORIES", alignment: "left" },
      raw: json.categories,
    });
  }

  const hero = json?.hero as Record<string, unknown> | undefined;
  if (hero) {
    const bulletsCount = Array.isArray(hero?.bullets)
      ? hero.bullets.length
      : 0;

    sections.push({
      id: "hero",
      section_key: "hero",
      section_type: "HERO",
      title: toStr(hero?.title || "Hero"),
      subtitle: `Badge: ${toStr(hero?.badge)} • Bullets: ${bulletsCount}`,
      order_index: 3,
      is_enabled: defaultEnabled,
      meta: { badge: "HERO", alignment: "left" },
      raw: hero,
    });
  }

  const empty_state = json?.empty_state as Record<string, unknown> | undefined;
  if (empty_state) {
    sections.push({
      id: "empty_state",
      section_key: "empty_state",
      section_type: "EMPTY_STATE",
      title: toStr(empty_state?.text || "Empty state"),
      subtitle: "No results copy",
      order_index: 4,
      is_enabled: defaultEnabled,
      meta: { badge: "EMPTY", alignment: "left" },
      raw: empty_state,
    });
  }

  const bottom_cta = json?.bottom_cta as Record<string, unknown> | undefined;
  if (bottom_cta) {
    sections.push({
      id: "bottom_cta",
      section_key: "bottom_cta",
      section_type: "BOTTOM_CTA",
      title: toStr(bottom_cta?.title || "Bottom CTA"),
      subtitle: toStr(bottom_cta?.subtitle || "—"),
      order_index: 5,
      is_enabled: defaultEnabled,
      meta: { badge: "BOTTOM CTA", alignment: "left" },
      raw: bottom_cta,
    });
  }

  const faqs = json?.faqs as Array<Record<string, unknown>> | undefined;
  if (Array.isArray(faqs)) {
    const cats = new Set<string>();
    faqs.forEach((f) => {
      const c = toStr(f?.category);
      if (c) cats.add(c);
    });

    sections.push({
      id: "faqs",
      section_key: "faqs",
      section_type: "FAQS",
      title: `FAQs (${faqs.length})`,
      subtitle: `Categories used: ${cats.size}`,
      order_index: 6,
      is_enabled: defaultEnabled,
      meta: { badge: "FAQS", alignment: "left" },
      raw: faqs,
    });
  }

  const knownTop = new Set(["meta", "categories", "hero", "empty_state", "bottom_cta", "faqs"]);
  Object.keys(json || {}).forEach((k) => {
    if (knownTop.has(k)) return;
    const v = json?.[k] as Record<string, unknown> | undefined;
    if (!v || typeof v !== "object") return;
    sections.push({
      id: k,
      section_key: k,
      section_type: "UNKNOWN",
      title: toStr(v?.title || v?.heading || v?.name || k),
      subtitle: toStr(v?.subtitle || v?.subheading || v?.description || "—"),
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
type ToastState = { open: boolean; tone: ToastTone; title: string; message?: string };

export default function FaqAdminPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const endpoint = useMemo(
    () => joinApiUrl(API_BASE, "/api/v1/content/faqs"),
    [API_BASE]
  );

  const [sections, setSections] = useState<FaqSection[]>([]);
  const [rawFaqs, setRawFaqs] = useState<Record<string, unknown> | null>(null);

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
      sessionStorage.setItem("faqs_admin_toast", JSON.stringify(next));
    } catch {}
  }

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("faqs_admin_toast");
      if (!raw) return;
      sessionStorage.removeItem("faqs_admin_toast");
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
        if (!res.ok) throw new Error(`Failed to load FAQs content (${res.status})`);

        const json = await res.json() as Record<string, unknown>;
        const built = buildFaqSections(json);

        if (alive) {
          setRawFaqs(json);
          setSections(built);
        }
      } catch (e: unknown) {
        if (alive) setErr(e instanceof Error ? e.message : String(e));
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

  // forms
  const [metaForm, setMetaForm] = useState({ title: "" });

  const [categoriesForm, setCategoriesForm] = useState({ categoriesText: "" });

  const [heroForm, setHeroForm] = useState({
    badge: "",
    title: "",
    subtitle: "",
    primary_cta_label: "",
    primary_cta_href: "",
    secondary_cta_label: "",
    secondary_cta_href: "",
    bulletsText: "",
    search_placeholder: "",
    tip_label: "",
    tip_items_text: "",
  });

  const [emptyStateForm, setEmptyStateForm] = useState({ text: "" });

  const [bottomCtaForm, setBottomCtaForm] = useState({
    title: "",
    subtitle: "",
    primary_label: "",
    primary_href: "",
    secondary_label: "",
    secondary_href: "",
  });

  const [faqsForm, setFaqsForm] = useState({
    faqsText: "",
  });

  useEffect(() => {
    if (!activeSection) return;
    setSaveErr(null);

    if (activeSection.section_key === "meta") {
      const m = activeSection.raw as Record<string, unknown> || {};
      setMetaForm({ title: toStr(m?.title) });
    }

    if (activeSection.section_key === "categories") {
      setCategoriesForm({ categoriesText: toLines(activeSection.raw) });
    }

    if (activeSection.section_key === "hero") {
      const h = activeSection.raw as Record<string, unknown> || {};
      setHeroForm({
        badge: toStr(h?.badge),
        title: toStr(h?.title),
        subtitle: toStr(h?.subtitle),
        primary_cta_label: toStr(h?.primary_cta_label),
        primary_cta_href: toStr(h?.primary_cta_href),
        secondary_cta_label: toStr(h?.secondary_cta_label),
        secondary_cta_href: toStr(h?.secondary_cta_href),
        bulletsText: stringifyPretty(h?.bullets || []),
        search_placeholder: toStr(h?.search_placeholder),
        tip_label: toStr(h?.tip_label),
        tip_items_text: toLines(h?.tip_items),
      });
    }

    if (activeSection.section_key === "empty_state") {
      const e = activeSection.raw as Record<string, unknown> || {};
      setEmptyStateForm({ text: toStr(e?.text) });
    }

    if (activeSection.section_key === "bottom_cta") {
      const b = activeSection.raw as Record<string, unknown> || {};
      setBottomCtaForm({
        title: toStr(b?.title),
        subtitle: toStr(b?.subtitle),
        primary_label: toStr(b?.primary_label),
        primary_href: toStr(b?.primary_href),
        secondary_label: toStr(b?.secondary_label),
        secondary_href: toStr(b?.secondary_href),
      });
    }

    if (activeSection.section_key === "faqs") {
      setFaqsForm({ faqsText: stringifyPretty(activeSection.raw || []) });
    }
  }, [activeSection]);

  async function saveActiveSection() {
    if (!rawFaqs || !activeSection) return;

    try {
      setSaving(true);
      setSaveErr(null);

      const updated = safeClone(rawFaqs) as Record<string, any>;

      if (activeSection.section_key === "meta") {
        updated.meta = (updated.meta as Record<string, unknown>) || {};
        (updated.meta as Record<string, unknown>).title = metaForm.title;
      }

      if (activeSection.section_key === "categories") {
        updated.categories = fromLines(categoriesForm.categoriesText);
      }

      if (activeSection.section_key === "hero") {
        updated.hero = (updated.hero as Record<string, unknown>) || {};
        const h = updated.hero as Record<string, unknown>;
        h.badge = heroForm.badge;
        h.title = heroForm.title;
        h.subtitle = heroForm.subtitle;
        h.primary_cta_label = heroForm.primary_cta_label;
        h.primary_cta_href = heroForm.primary_cta_href;
        h.secondary_cta_label = heroForm.secondary_cta_label;
        h.secondary_cta_href = heroForm.secondary_cta_href;

        const bulletsParsed = parseJsonSafe(heroForm.bulletsText);
        if (!Array.isArray(bulletsParsed)) throw new Error("Hero bullets must be a JSON array");
        h.bullets = bulletsParsed;

        h.search_placeholder = heroForm.search_placeholder;
        h.tip_label = heroForm.tip_label;
        h.tip_items = fromLines(heroForm.tip_items_text);
      }

      if (activeSection.section_key === "empty_state") {
        updated.empty_state = (updated.empty_state as Record<string, unknown>) || {};
        (updated.empty_state as Record<string, unknown>).text = emptyStateForm.text;
      }

      if (activeSection.section_key === "bottom_cta") {
        updated.bottom_cta = (updated.bottom_cta as Record<string, unknown>) || {};
        const b = updated.bottom_cta as Record<string, unknown>;
        b.title = bottomCtaForm.title;
        b.subtitle = bottomCtaForm.subtitle;
        b.primary_label = bottomCtaForm.primary_label;
        b.primary_href = bottomCtaForm.primary_href;
        b.secondary_label = bottomCtaForm.secondary_label;
        b.secondary_href = bottomCtaForm.secondary_href;
      }

      if (activeSection.section_key === "faqs") {
        const parsed = parseJsonSafe(faqsForm.faqsText);
        if (!Array.isArray(parsed)) throw new Error("FAQs must be a JSON array");
        // optional basic validation
        for (const item of parsed) {
          if (!item || typeof item !== "object") throw new Error("Each FAQ item must be an object");
          const faq = item as Record<string, unknown>;
          if (!toStr(faq.id) || !toStr(faq.category) || !toStr(faq.q) || !toStr(faq.a)) {
            throw new Error("Each FAQ must have id, category, q, a");
          }
        }
        updated.faqs = parsed;
      }

      const saveUrl = joinApiUrl(API_BASE, "/api/v1/content/faqs");
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
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
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
        title="FAQs Page Management"
        subtitle="FAQs page content loaded from CMS JSON."
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
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 font-semibold">
                      Order: {s.order_index}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 font-semibold">
                      Route: /api/v1/content/faqs
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
        subtitle={activeSection ? `Update fields and save to /api/v1/content/faqs` : ""}
        onClose={() => (saving ? null : setActiveKey(null))}
      >
        {activeSection?.section_key === "meta" ? (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Section Key" value="meta" onChange={() => null} disabled />
              <TextField label="Type" value="META" onChange={() => null} disabled />
            </div>
            <TextField label="Title" value={metaForm.title} onChange={(v) => setMetaForm({ title: v })} />
          </div>
        ) : null}

        {activeSection?.section_key === "categories" ? (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Section Key" value="categories" onChange={() => null} disabled />
              <TextField label="Type" value="CATEGORIES" onChange={() => null} disabled />
            </div>
            <TextAreaField
              label="Categories (one per line)"
              value={categoriesForm.categoriesText}
              onChange={(v) => setCategoriesForm({ categoriesText: v })}
              rows={12}
            />
          </div>
        ) : null}

        {activeSection?.section_key === "hero" ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Section Key" value="hero" onChange={() => null} disabled />
              <TextField label="Type" value="HERO" onChange={() => null} disabled />
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Badge" value={heroForm.badge} onChange={(v) => setHeroForm((p) => ({ ...p, badge: v }))} />
              <TextField label="Search Placeholder" value={heroForm.search_placeholder} onChange={(v) => setHeroForm((p) => ({ ...p, search_placeholder: v }))} />
            </div>

            <TextField label="Title" value={heroForm.title} onChange={(v) => setHeroForm((p) => ({ ...p, title: v }))} />
            <TextAreaField label="Subtitle" value={heroForm.subtitle} onChange={(v) => setHeroForm((p) => ({ ...p, subtitle: v }))} rows={4} />

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField
                label="Primary CTA Label"
                value={heroForm.primary_cta_label}
                onChange={(v) => setHeroForm((p) => ({ ...p, primary_cta_label: v }))}
              />
              <TextField
                label="Primary CTA Href"
                value={heroForm.primary_cta_href}
                onChange={(v) => setHeroForm((p) => ({ ...p, primary_cta_href: v }))}
              />
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField
                label="Secondary CTA Label"
                value={heroForm.secondary_cta_label}
                onChange={(v) => setHeroForm((p) => ({ ...p, secondary_cta_label: v }))}
              />
              <TextField
                label="Secondary CTA Href"
                value={heroForm.secondary_cta_href}
                onChange={(v) => setHeroForm((p) => ({ ...p, secondary_cta_href: v }))}
              />
            </div>

            <TextAreaField
              label="Bullets (JSON array)"
              value={heroForm.bulletsText}
              onChange={(v) => setHeroForm((p) => ({ ...p, bulletsText: v }))}
              rows={14}
            />

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Tip Label" value={heroForm.tip_label} onChange={(v) => setHeroForm((p) => ({ ...p, tip_label: v }))} />
              <div />
            </div>

            <TextAreaField
              label="Tip Items (one per line)"
              value={heroForm.tip_items_text}
              onChange={(v) => setHeroForm((p) => ({ ...p, tip_items_text: v }))}
              rows={8}
            />
          </div>
        ) : null}

        {activeSection?.section_key === "empty_state" ? (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Section Key" value="empty_state" onChange={() => null} disabled />
              <TextField label="Type" value="EMPTY_STATE" onChange={() => null} disabled />
            </div>
            <TextAreaField
              label="Text"
              value={emptyStateForm.text}
              onChange={(v) => setEmptyStateForm({ text: v })}
              rows={6}
            />
          </div>
        ) : null}

        {activeSection?.section_key === "bottom_cta" ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Section Key" value="bottom_cta" onChange={() => null} disabled />
              <TextField label="Type" value="BOTTOM_CTA" onChange={() => null} disabled />
            </div>

            <TextField label="Title" value={bottomCtaForm.title} onChange={(v) => setBottomCtaForm((p) => ({ ...p, title: v }))} />
            <TextAreaField
              label="Subtitle"
              value={bottomCtaForm.subtitle}
              onChange={(v) => setBottomCtaForm((p) => ({ ...p, subtitle: v }))}
              rows={4}
            />

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField
                label="Primary Label"
                value={bottomCtaForm.primary_label}
                onChange={(v) => setBottomCtaForm((p) => ({ ...p, primary_label: v }))}
              />
              <TextField
                label="Primary Href"
                value={bottomCtaForm.primary_href}
                onChange={(v) => setBottomCtaForm((p) => ({ ...p, primary_href: v }))}
              />
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField
                label="Secondary Label"
                value={bottomCtaForm.secondary_label}
                onChange={(v) => setBottomCtaForm((p) => ({ ...p, secondary_label: v }))}
              />
              <TextField
                label="Secondary Href"
                value={bottomCtaForm.secondary_href}
                onChange={(v) => setBottomCtaForm((p) => ({ ...p, secondary_href: v }))}
              />
            </div>
          </div>
        ) : null}

        {activeSection?.section_key === "faqs" ? (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Section Key" value="faqs" onChange={() => null} disabled />
              <TextField label="Type" value="FAQS" onChange={() => null} disabled />
            </div>

            <TextAreaField
              label='FAQs (JSON array) — each item must have: { "id", "category", "q", "a" }'
              value={faqsForm.faqsText}
              onChange={(v) => setFaqsForm({ faqsText: v })}
              rows={24}
            />
          </div>
        ) : null}

        {activeSection?.section_type === "UNKNOWN" ? (
          <div className="space-y-4">
            <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Ye section unknown structure ka hai. Abhi mapping set nahi ki.
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
            disabled={saving || !activeSection || !rawFaqs}
            className={cx(
              "inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white",
              saving || !activeSection || !rawFaqs
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
