"use client";

import React, { useEffect, useMemo, useState } from "react";
import { FiAlertTriangle, FiEdit3, FiX, FiTag, FiCheckCircle, FiXCircle } from "react-icons/fi";
import SectionHeader from "@/components/dashboard/assets/SectionHeader";
import ToastTopRight from "@/components/ui/Toast";

type JsonObject = Record<string, unknown>;

type FeedbackContent = {
  meta?: JsonObject;
  filters?: unknown[];
  hero?: JsonObject;
  stats?: JsonObject;
  empty_state?: JsonObject;
  bottom_section?: JsonObject;
  testimonials?: unknown[];
} & JsonObject;

type FeedbackSectionType =
  | "META"
  | "FILTERS"
  | "HERO"
  | "STATS"
  | "EMPTY_STATE"
  | "BOTTOM_LEFT"
  | "BOTTOM_RIGHT"
  | "TESTIMONIALS"
  | "UNKNOWN";

type FeedbackSection = {
  id: string;
  section_key: string;
  section_type: FeedbackSectionType;
  title: string;
  subtitle: string;
  order_index: number;
  is_enabled: boolean;
  meta?: { badge?: string; alignment?: "left" | "center" | "right" };
  raw: unknown;
};

function asRecord(value: unknown): JsonObject {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as JsonObject)
    : {};
}

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

function safeClone<T>(v: T): T {
  return typeof structuredClone === "function" ? structuredClone(v) : JSON.parse(JSON.stringify(v));
}

function buildFeedbackSections(json: Record<string, unknown>): FeedbackSection[] {
  const sections: FeedbackSection[] = [];
  const meta = json?.meta as Record<string, unknown> | undefined;
  const status = String(meta?.status || "").toLowerCase();
  const defaultEnabled = status === "published" || status === "live" || status === "active" || !status;

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

  if (Array.isArray(json?.filters)) {
    sections.push({
      id: "filters",
      section_key: "filters",
      section_type: "FILTERS",
      title: `Filters (${json.filters.length})`,
      subtitle: json.filters.slice(0, 6).join(", ") + (json.filters.length > 6 ? "…" : ""),
      order_index: 2,
      is_enabled: defaultEnabled,
      meta: { badge: "FILTERS", alignment: "left" },
      raw: json.filters,
    });
  }

  const hero = json?.hero as Record<string, unknown> | undefined;
  if (hero) {
    sections.push({
      id: "hero",
      section_key: "hero",
      section_type: "HERO",
      title: toStr(hero?.title || "Hero"),
      subtitle: toStr(hero?.subtitle || "—"),
      order_index: 3,
      is_enabled: defaultEnabled,
      meta: { badge: "HERO", alignment: "left" },
      raw: hero,
    });
  }

  const stats = json?.stats as Record<string, unknown> | undefined;
  if (stats?.items) {
    const items = Array.isArray(stats.items) ? stats.items : [];
    sections.push({
      id: "stats",
      section_key: "stats",
      section_type: "STATS",
      title: `Stats (${items.length})`,
      subtitle:
        items
          .map((x) => {
            const item = asRecord(x);
            return toStr(item.label || item.key);
          })
          .filter(Boolean)
          .slice(0, 4)
          .join(", ") || "—",
      order_index: 4,
      is_enabled: defaultEnabled,
      meta: { badge: "STATS", alignment: "left" },
      raw: stats,
    });
  }

  const empty_state = json?.empty_state as Record<string, unknown> | undefined;
  if (empty_state) {
    sections.push({
      id: "empty_state",
      section_key: "empty_state",
      section_type: "EMPTY_STATE",
      title: toStr(empty_state?.title || "Empty state"),
      subtitle: toStr(empty_state?.subtitle || "—"),
      order_index: 5,
      is_enabled: defaultEnabled,
      meta: { badge: "EMPTY", alignment: "left" },
      raw: empty_state,
    });
  }

  const bottom_section = json?.bottom_section as Record<string, unknown> | undefined;
  const bottom_left = bottom_section?.left as Record<string, unknown> | undefined;
  if (bottom_left) {
    sections.push({
      id: "bottom_left",
      section_key: "bottom_section.left",
      section_type: "BOTTOM_LEFT",
      title: toStr(bottom_left?.title || "Bottom Left"),
      subtitle: toStr(bottom_left?.subtitle || "—"),
      order_index: 6,
      is_enabled: defaultEnabled,
      meta: { badge: "BOTTOM LEFT", alignment: "left" },
      raw: bottom_left,
    });
  }

  const bottom_right = bottom_section?.right as Record<string, unknown> | undefined;
  if (bottom_right) {
    const fields = Array.isArray(bottom_right?.fields) ? bottom_right.fields : [];
    sections.push({
      id: "bottom_right",
      section_key: "bottom_section.right",
      section_type: "BOTTOM_RIGHT",
      title: toStr(bottom_right?.badge || "Bottom Right"),
      subtitle: `Fields: ${fields.length} • Submit: ${toStr(bottom_right?.submit_label)}`,
      order_index: 7,
      is_enabled: defaultEnabled,
      meta: { badge: "BOTTOM RIGHT", alignment: "left" },
      raw: bottom_right,
    });
  }

  const testimonials = json?.testimonials as Array<Record<string, unknown>> | undefined;
  if (Array.isArray(testimonials)) {
    sections.push({
      id: "testimonials",
      section_key: "testimonials",
      section_type: "TESTIMONIALS",
      title: `Testimonials (${testimonials.length})`,
      subtitle: testimonials.slice(0, 3).map((t) => `${toStr(t?.first_name)} ${toStr(t?.last_name)}`.trim()).filter(Boolean).join(", ") || "—",
      order_index: 8,
      is_enabled: defaultEnabled,
      meta: { badge: "TESTIMONIALS", alignment: "left" },
      raw: testimonials,
    });
  }

  const knownTop = new Set(["meta", "filters", "hero", "stats", "empty_state", "bottom_section", "testimonials"]);
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
          <div className="max-h-[72vh] overflow-auto px-5 py-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

type ToastTone = "success" | "error";
type ToastState = { open: boolean; tone: ToastTone; title: string; message?: string };

export default function FeedbackAdminPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const endpoint = useMemo(() => joinApiUrl(API_BASE, "/api/v1/content/feedback"), [API_BASE]);

  const [sections, setSections] = useState<FeedbackSection[]>([]);
  const [rawFeedback, setRawFeedback] = useState<Record<string, unknown> | null>(null);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveErr, setSaveErr] = useState<string | null>(null);
  const [addTestimonialOpen, setAddTestimonialOpen] = useState(false);
  const [addTestimonialForm, setAddTestimonialForm] = useState({
    first_name: "",
    last_name: "",
    designation: "",
    company: "",
    message: "",
    rating: 5,
  });

  const [toast, setToast] = useState<ToastState>({
    open: false,
    tone: "success",
    title: "",
    message: "",
  });

  function persistToast(next: { tone: ToastTone; title: string; message?: string }) {
    try {
      sessionStorage.setItem("feedback_admin_toast", JSON.stringify(next));
    } catch { }
  }
  function isAddTestimonialValid() {
    return (
      addTestimonialForm.first_name.trim() !== "" &&
      addTestimonialForm.last_name.trim() !== "" &&
      addTestimonialForm.message.trim() !== "" &&
      addTestimonialForm.rating >= 1 &&
      addTestimonialForm.rating <= 5
    );
  }
  function handleAddTestimonial() {
    if (!rawFeedback) return;

    const newTestimonial = {
      first_name: addTestimonialForm.first_name.trim(),
      last_name: addTestimonialForm.last_name.trim(),
      designation: addTestimonialForm.designation.trim(),
      company: addTestimonialForm.company.trim(),
      message: addTestimonialForm.message.trim(),
      rating: addTestimonialForm.rating,
    };

    const updated = safeClone(rawFeedback) as FeedbackContent;
    updated.testimonials = Array.isArray(updated.testimonials)
      ? [...updated.testimonials, newTestimonial]
      : [newTestimonial];

    const rebuiltSections = buildFeedbackSections(updated);

    setRawFeedback(updated);
    setSections(rebuiltSections);

    resetAddTestimonialForm();
    setAddTestimonialOpen(false);
  }

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("feedback_admin_toast");
      if (!raw) return;
      sessionStorage.removeItem("feedback_admin_toast");
      const parsed = JSON.parse(raw) as { tone?: ToastTone; title?: string; message?: string };
      if (!parsed?.title) return;
      setToast({
        open: true,
        tone: parsed.tone === "error" ? "error" : "success",
        title: parsed.title,
        message: parsed.message || "",
      });
    } catch { }
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);

        const res = await fetch(endpoint, { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to load feedback content (${res.status})`);

        const json = await res.json() as Record<string, unknown>;
        const built = buildFeedbackSections(json);

        if (alive) {
          setRawFeedback(json);
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

  const [metaForm, setMetaForm] = useState({ title: "" });

  const [filtersForm, setFiltersForm] = useState({ filtersText: "" });

  const [heroForm, setHeroForm] = useState({ badge: "", title: "", subtitle: "" });

  const [statsForm, setStatsForm] = useState({
    itemsText: "",
  });

  const [emptyStateForm, setEmptyStateForm] = useState({ title: "", subtitle: "" });

  const [bottomLeftForm, setBottomLeftForm] = useState({
    badge: "",
    title: "",
    subtitle: "",
    highlightsText: "",
  });

  const [bottomRightForm, setBottomRightForm] = useState({
    badge: "",
    subtitle: "",
    submitLabel: "",
    thanksNote: "",
    fieldsText: "",
  });

  const [testimonialsForm, setTestimonialsForm] = useState({
    testimonialsText: "",
  });

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
  function resetAddTestimonialForm() {
    setAddTestimonialForm({
      first_name: "",
      last_name: "",
      designation: "",
      company: "",
      message: "",
      rating: 5,
    });
  }

  useEffect(() => {
    if (!activeSection) return;

    setSaveErr(null);

    if (activeSection.section_key === "meta") {
      const m = asRecord(activeSection.raw);
      setMetaForm({ title: toStr(m.title) });
    }

    if (activeSection.section_key === "filters") {
      setFiltersForm({ filtersText: toLines(activeSection.raw) });
    }

    if (activeSection.section_key === "hero") {
      const h = asRecord(activeSection.raw);
      setHeroForm({
        badge: toStr(h.badge),
        title: toStr(h.title),
        subtitle: toStr(h.subtitle),
      });
    }

    if (activeSection.section_key === "stats") {
      const s = asRecord(activeSection.raw);
      setStatsForm({ itemsText: stringifyPretty(s.items || []) });
    }

    if (activeSection.section_key === "empty_state") {
      const e = asRecord(activeSection.raw);
      setEmptyStateForm({ title: toStr(e.title), subtitle: toStr(e.subtitle) });
    }

    if (activeSection.section_key === "bottom_section.left") {
      const l = asRecord(activeSection.raw);
      setBottomLeftForm({
        badge: toStr(l.badge),
        title: toStr(l.title),
        subtitle: toStr(l.subtitle),
        highlightsText: toLines(l.highlights),
      });
    }

    if (activeSection.section_key === "bottom_section.right") {
      const r = asRecord(activeSection.raw);
      setBottomRightForm({
        badge: toStr(r.badge),
        subtitle: toStr(r.subtitle),
        submitLabel: toStr(r.submit_label),
        thanksNote: toStr(r.thanks_note),
        fieldsText: stringifyPretty(r.fields || []),
      });
    }

    if (activeSection.section_key === "testimonials") {
      setTestimonialsForm({ testimonialsText: stringifyPretty(activeSection.raw || []) });
    }
  }, [activeSection]);

  async function saveActiveSection() {
    if (!rawFeedback || !activeSection) return;

    try {
      setSaving(true);
      setSaveErr(null);

      const updated = safeClone(rawFeedback) as FeedbackContent;

      if (activeSection.section_key === "meta") {
        updated.meta = asRecord(updated.meta);
        updated.meta.title = metaForm.title;
      }

      if (activeSection.section_key === "filters") {
        updated.filters = fromLines(filtersForm.filtersText);
      }

      if (activeSection.section_key === "hero") {
        updated.hero = asRecord(updated.hero);
        updated.hero.badge = heroForm.badge;
        updated.hero.title = heroForm.title;
        updated.hero.subtitle = heroForm.subtitle;
      }

      if (activeSection.section_key === "stats") {
        updated.stats = asRecord(updated.stats);
        const parsed = parseJsonSafe(statsForm.itemsText);
        if (!Array.isArray(parsed)) throw new Error("Stats items must be a JSON array");
        updated.stats.items = parsed;
      }

      if (activeSection.section_key === "empty_state") {
        updated.empty_state = asRecord(updated.empty_state);
        updated.empty_state.title = emptyStateForm.title;
        updated.empty_state.subtitle = emptyStateForm.subtitle;
      }

      if (activeSection.section_key === "bottom_section.left") {
        updated.bottom_section = asRecord(updated.bottom_section);
        const left = asRecord(updated.bottom_section.left);
        left.badge = bottomLeftForm.badge;
        left.title = bottomLeftForm.title;
        left.subtitle = bottomLeftForm.subtitle;
        left.highlights = fromLines(bottomLeftForm.highlightsText);
        updated.bottom_section.left = left;
      }

      if (activeSection.section_key === "bottom_section.right") {
        updated.bottom_section = asRecord(updated.bottom_section);
        const right = asRecord(updated.bottom_section.right);
        right.badge = bottomRightForm.badge;
        right.subtitle = bottomRightForm.subtitle;
        right.submit_label = bottomRightForm.submitLabel;
        right.thanks_note = bottomRightForm.thanksNote;

        const parsed = parseJsonSafe(bottomRightForm.fieldsText);
        if (!Array.isArray(parsed)) throw new Error("Bottom right fields must be a JSON array");
        right.fields = parsed;
        updated.bottom_section.right = right;
      }

      if (activeSection.section_key === "testimonials") {
        const parsed = parseJsonSafe(testimonialsForm.testimonialsText);
        if (!Array.isArray(parsed)) throw new Error("Testimonials must be a JSON array");
        updated.testimonials = parsed;
      }

      const saveUrl = joinApiUrl(API_BASE, "/api/v1/content/feedback");
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
      const msg = e instanceof Error ? e.message : "Failed to save changes";
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
        title="Feedback Page Management"
        subtitle="Feedback page content loaded from CMS JSON."
        right={
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-500">
              {loading ? "Loading…" : `${totalSections} sections`}
            </span>

            {/* <button
              type="button"
              onClick={() => setAddTestimonialOpen(true)}
              className="inline-flex items-center rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              + Add Testimonial
            </button> */}
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
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 font-semibold">Route: /api/v1/content/feedback</span>
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
        subtitle={activeSection ? `Update fields and save to /api/v1/content/feedback` : ""}
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

        {activeSection?.section_key === "filters" ? (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Section Key" value="filters" onChange={() => null} disabled />
              <TextField label="Type" value="FILTERS" onChange={() => null} disabled />
            </div>
            <TextAreaField label="Filters (one per line)" value={filtersForm.filtersText} onChange={(v) => setFiltersForm({ filtersText: v })} rows={10} />
          </div>
        ) : null}

        {activeSection?.section_key === "hero" ? (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Section Key" value="hero" onChange={() => null} disabled />
              <TextField label="Type" value="HERO" onChange={() => null} disabled />
            </div>
            <TextField label="Badge" value={heroForm.badge} onChange={(v) => setHeroForm((p) => ({ ...p, badge: v }))} />
            <TextField label="Title" value={heroForm.title} onChange={(v) => setHeroForm((p) => ({ ...p, title: v }))} />
            <TextAreaField label="Subtitle" value={heroForm.subtitle} onChange={(v) => setHeroForm((p) => ({ ...p, subtitle: v }))} rows={4} />
          </div>
        ) : null}

        {activeSection?.section_key === "stats" ? (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Section Key" value="stats" onChange={() => null} disabled />
              <TextField label="Type" value="STATS" onChange={() => null} disabled />
            </div>
            <TextAreaField label="Stats Items (JSON array)" value={statsForm.itemsText} onChange={(v) => setStatsForm({ itemsText: v })} rows={14} />
          </div>
        ) : null}

        {activeSection?.section_key === "empty_state" ? (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Section Key" value="empty_state" onChange={() => null} disabled />
              <TextField label="Type" value="EMPTY_STATE" onChange={() => null} disabled />
            </div>
            <TextField label="Title" value={emptyStateForm.title} onChange={(v) => setEmptyStateForm((p) => ({ ...p, title: v }))} />
            <TextAreaField label="Subtitle" value={emptyStateForm.subtitle} onChange={(v) => setEmptyStateForm((p) => ({ ...p, subtitle: v }))} rows={4} />
          </div>
        ) : null}

        {activeSection?.section_key === "bottom_section.left" ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Section Key" value="bottom_section.left" onChange={() => null} disabled />
              <TextField label="Type" value="BOTTOM_LEFT" onChange={() => null} disabled />
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Badge" value={bottomLeftForm.badge} onChange={(v) => setBottomLeftForm((p) => ({ ...p, badge: v }))} />
              <TextField label="Title" value={bottomLeftForm.title} onChange={(v) => setBottomLeftForm((p) => ({ ...p, title: v }))} />
            </div>

            <TextAreaField label="Subtitle" value={bottomLeftForm.subtitle} onChange={(v) => setBottomLeftForm((p) => ({ ...p, subtitle: v }))} rows={4} />
            <TextAreaField label="Highlights (one per line)" value={bottomLeftForm.highlightsText} onChange={(v) => setBottomLeftForm((p) => ({ ...p, highlightsText: v }))} rows={8} />
          </div>
        ) : null}

        {activeSection?.section_key === "bottom_section.right" ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Section Key" value="bottom_section.right" onChange={() => null} disabled />
              <TextField label="Type" value="BOTTOM_RIGHT" onChange={() => null} disabled />
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Badge" value={bottomRightForm.badge} onChange={(v) => setBottomRightForm((p) => ({ ...p, badge: v }))} />
              <TextField label="Submit Label" value={bottomRightForm.submitLabel} onChange={(v) => setBottomRightForm((p) => ({ ...p, submitLabel: v }))} />
            </div>

            <TextAreaField label="Subtitle" value={bottomRightForm.subtitle} onChange={(v) => setBottomRightForm((p) => ({ ...p, subtitle: v }))} rows={3} />
            <TextAreaField label="Thanks Note" value={bottomRightForm.thanksNote} onChange={(v) => setBottomRightForm((p) => ({ ...p, thanksNote: v }))} rows={3} />
            <TextAreaField label="Fields (JSON array)" value={bottomRightForm.fieldsText} onChange={(v) => setBottomRightForm((p) => ({ ...p, fieldsText: v }))} rows={16} />
          </div>
        ) : null}

        {activeSection?.section_key === "testimonials" ? (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Section Key" value="testimonials" onChange={() => null} disabled />
              <TextField label="Type" value="TESTIMONIALS" onChange={() => null} disabled />
            </div>

            <TextAreaField
              label="Testimonials (JSON array)"
              value={testimonialsForm.testimonialsText}
              onChange={(v) => setTestimonialsForm({ testimonialsText: v })}
              rows={20}
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
            disabled={saving || !activeSection || !rawFeedback}
            className={cx(
              "inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white",
              saving || !activeSection || !rawFeedback ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:bg-slate-800"
            )}
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </EditModal>
      <EditModal
        open={addTestimonialOpen}
        title="Add Testimonial"
        subtitle="Create a new testimonial"
        onClose={() => {
          resetAddTestimonialForm();
          setAddTestimonialOpen(false);
        }}
      >
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              label="First Name"
              value={addTestimonialForm.first_name}
              onChange={(v) => setAddTestimonialForm(p => ({ ...p, first_name: v }))}
            />

            <TextField
              label="Last Name"
              value={addTestimonialForm.last_name}
              onChange={(v) => setAddTestimonialForm(p => ({ ...p, last_name: v }))}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              label="Designation"
              value={addTestimonialForm.designation}
              onChange={(v) => setAddTestimonialForm(p => ({ ...p, designation: v }))}
            />

            <TextField
              label="Company"
              value={addTestimonialForm.company}
              onChange={(v) => setAddTestimonialForm(p => ({ ...p, company: v }))}
            />
          </div>

          <TextAreaField
            label="Testimonial Message"
            rows={5}
            value={addTestimonialForm.message}
            onChange={(v) => setAddTestimonialForm(p => ({ ...p, message: v }))}
          />

          <NumberField
            label="Rating (1–5)"
            value={addTestimonialForm.rating}
            onChange={(v) =>
              setAddTestimonialForm(p => ({
                ...p,
                rating: Math.min(5, Math.max(1, v)),
              }))
            }
          />

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => {
                resetAddTestimonialForm();
                setAddTestimonialOpen(false);
              }}
              className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleAddTestimonial}
              disabled={!isAddTestimonialValid()}
              className={cx(
                "rounded-md px-4 py-2 text-sm font-semibold text-white",
                isAddTestimonialValid()
                  ? "bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
                  : "bg-emerald-600 opacity-60 cursor-not-allowed"
              )}
            >
              Save Testimonial
            </button>


          </div>
        </div>
      </EditModal>
    </div>
  );
}
