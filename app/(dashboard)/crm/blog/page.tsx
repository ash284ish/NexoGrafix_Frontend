"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  FiAlertTriangle,
  FiEdit3,
  FiX,
  FiTag,
} from "react-icons/fi";
import SectionHeader from "@/components/dashboard/assets/SectionHeader";
import ToastTopRight from "@/components/ui/Toast";

type BlogSectionType =
  | "META"
  | "HERO"
  | "FILTERS"
  | "PAGINATION"
  | "CTA"
  | "ASSETS"
  | "POSTS"
  | "UNKNOWN";

type BlogSection = {
  id: string;
  section_key: string;
  section_type: BlogSectionType;
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

function toStr(v: unknown) {
  if (v === null || v === undefined) return "";
  return String(v);
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

function parseJsonSafe(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function buildBlogSections(json: Record<string, any>): BlogSection[] {
  const sections: BlogSection[] = [];
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
      title: toStr(json?.meta?.title || "Meta"),
      subtitle: "Page metadata",
      order_index: 1,
      is_enabled: defaultEnabled,
      meta: { badge: "META", alignment: "left" },
      raw: json.meta as Record<string, unknown>,
    });
  }

  if (json?.hero) {
    const hero = json.hero as Record<string, any>;
    sections.push({
      id: "hero",
      section_key: "hero",
      section_type: "HERO",
      title: toStr(hero?.title || "Hero"),
      subtitle: `Badge: ${toStr(hero?.badge)} • Subtitle: ${toStr(
        hero?.subtitle
      ).slice(0, 72)}${toStr(hero?.subtitle).length > 72 ? "…" : ""}`,
      order_index: 2,
      is_enabled: defaultEnabled,
      meta: { badge: "HERO", alignment: "left" },
      raw: hero as Record<string, unknown>,
    });
  }

  if (json?.filters) {
    const filters = json.filters as Record<string, any>;
    const soCount = Array.isArray(filters?.sort_options)
      ? filters.sort_options.length
      : 0;
    sections.push({
      id: "filters",
      section_key: "filters",
      section_type: "FILTERS",
      title: "Filters",
      subtitle: `Sort options: ${soCount} • Default: ${toStr(
        filters?.default_sort
      )}`,
      order_index: 3,
      is_enabled: defaultEnabled,
      meta: { badge: "FILTERS", alignment: "left" },
      raw: filters as Record<string, unknown>,
    });
  }

  if (json?.pagination) {
    const pagination = json.pagination as Record<string, any>;
    sections.push({
      id: "pagination",
      section_key: "pagination",
      section_type: "PAGINATION",
      title: "Pagination",
      subtitle: `Page size: ${toStr(pagination?.page_size)} • Empty: ${toStr(
        pagination?.empty_text
      ).slice(0, 54)}${toStr(pagination?.empty_text).length > 54 ? "…" : ""}`,
      order_index: 4,
      is_enabled: defaultEnabled,
      meta: { badge: "PAGINATION", alignment: "left" },
      raw: pagination as Record<string, unknown>,
    });
  }

  if (json?.cta) {
    const cta = json.cta as Record<string, any>;
    sections.push({
      id: "cta",
      section_key: "cta",
      section_type: "CTA",
      title: "CTA",
      subtitle: `Base href: ${toStr(cta?.read_article_base_href)}`,
      order_index: 5,
      is_enabled: defaultEnabled,
      meta: { badge: "CTA", alignment: "left" },
      raw: cta as Record<string, unknown>,
    });
  }

  if (json?.assets) {
    const assets = json.assets as Record<string, any>;
    sections.push({
      id: "assets",
      section_key: "assets",
      section_type: "ASSETS",
      title: "Assets",
      subtitle: `Fallback cover: ${toStr(assets?.fallback_cover) || "—"}`,
      order_index: 6,
      is_enabled: defaultEnabled,
      meta: { badge: "ASSETS", alignment: "left" },
      raw: assets as Record<string, unknown>,
    });
  }

  if (Array.isArray(json?.posts)) {
    const posts = json.posts as Array<Record<string, any>>;
    const cats = new Set<string>();
    posts.forEach((p) => {
      const c = toStr(p?.category);
      if (c) cats.add(c);
    });
    sections.push({
      id: "posts",
      section_key: "posts",
      section_type: "POSTS",
      title: `Posts (${posts.length})`,
      subtitle: `Categories used: ${cats.size}`,
      order_index: 7,
      is_enabled: defaultEnabled,
      meta: { badge: "POSTS", alignment: "left" },
      raw: posts as unknown as Record<string, unknown>,
    });
  }

  const knownTop = new Set(["meta", "hero", "filters", "pagination", "cta", "assets", "posts"]);
  Object.keys(json || {}).forEach((k) => {
    if (knownTop.has(k)) return;
    const v = json?.[k] as Record<string, any>;
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

export default function BlogAdminPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const endpoint = useMemo(
    () => joinApiUrl(API_BASE, "/api/v1/content/blog"),
    [API_BASE]
  );

  const [sections, setSections] = useState<BlogSection[]>([]);
  const [rawBlog, setRawBlog] = useState<any>(null);

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
      sessionStorage.setItem("blog_admin_toast", JSON.stringify(next));
    } catch { }
  }

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("blog_admin_toast");
      if (!raw) return;
      sessionStorage.removeItem("blog_admin_toast");
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
        if (!res.ok) throw new Error(`Failed to load Blog content (${res.status})`);

        const json = await res.json();
        const built = buildBlogSections(json);

        if (alive) {
          setRawBlog(json);
          setSections(built);
        }
      } catch (e: any) {
        if (alive) setErr(e?.message || "Failed to load Blog content");
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

  const [heroForm, setHeroForm] = useState({
    badge: "",
    title: "",
    subtitle: "",
  });

  const [filtersForm, setFiltersForm] = useState({
    search_placeholder: "",
    default_category: "",
    default_sort: "",
    sort_options_text: "",
    sidebar_title: "",
    reset_label: "",
    labels_text: "",
  });

  const [paginationForm, setPaginationForm] = useState({
    page_size: "9",
    empty_text: "",
    page_label_prefix: "",
    page_label_middle: "",
  });

  const [ctaForm, setCtaForm] = useState({
    read_article_label: "",
    read_article_suffix: "",
    read_article_base_href: "",
  });

  const [assetsForm, setAssetsForm] = useState({
    fallback_cover: "",
  });

  const [postsForm, setPostsForm] = useState({
    postsText: "",
  });

  useEffect(() => {
    if (!activeSection) return;
    setSaveErr(null);

    if (activeSection.section_key === "meta") {
      const m = activeSection.raw || {};
      setMetaForm({ title: toStr(m?.title) });
    }

    if (activeSection.section_key === "hero") {
      const h = activeSection.raw || {};
      setHeroForm({
        badge: toStr(h?.badge),
        title: toStr(h?.title),
        subtitle: toStr(h?.subtitle),
      });
    }

    if (activeSection.section_key === "filters") {
      const f = activeSection.raw || {};
      setFiltersForm({
        search_placeholder: toStr(f?.search_placeholder),
        default_category: toStr(f?.default_category),
        default_sort: toStr(f?.default_sort),
        sort_options_text: stringifyPretty(f?.sort_options || []),
        sidebar_title: toStr(f?.sidebar_title),
        reset_label: toStr(f?.reset_label),
        labels_text: stringifyPretty(f?.labels || {}),
      });
    }

    if (activeSection.section_key === "pagination") {
      const p = activeSection.raw || {};
      setPaginationForm({
        page_size: toStr(p?.page_size ?? "9"),
        empty_text: toStr(p?.empty_text),
        page_label_prefix: toStr(p?.page_label_prefix),
        page_label_middle: toStr(p?.page_label_middle),
      });
    }

    if (activeSection.section_key === "cta") {
      const c = activeSection.raw || {};
      setCtaForm({
        read_article_label: toStr(c?.read_article_label),
        read_article_suffix: toStr(c?.read_article_suffix),
        read_article_base_href: toStr(c?.read_article_base_href),
      });
    }

    if (activeSection.section_key === "assets") {
      const a = activeSection.raw || {};
      setAssetsForm({
        fallback_cover: toStr(a?.fallback_cover),
      });
    }

    if (activeSection.section_key === "posts") {
      setPostsForm({ postsText: stringifyPretty(activeSection.raw || []) });
    }
  }, [activeSection]);

  async function saveActiveSection() {
    if (!rawBlog || !activeSection) return;

    try {
      setSaving(true);
      setSaveErr(null);

      const updated = safeClone(rawBlog);

      if (activeSection.section_key === "meta") {
        updated.meta = updated.meta || {};
        updated.meta.title = metaForm.title;
      }

      if (activeSection.section_key === "hero") {
        updated.hero = updated.hero || {};
        updated.hero.badge = heroForm.badge;
        updated.hero.title = heroForm.title;
        updated.hero.subtitle = heroForm.subtitle;
      }

      if (activeSection.section_key === "filters") {
        updated.filters = updated.filters || {};
        updated.filters.search_placeholder = filtersForm.search_placeholder;
        updated.filters.default_category = filtersForm.default_category;
        updated.filters.default_sort = filtersForm.default_sort;

        const sortOptionsParsed = parseJsonSafe(filtersForm.sort_options_text);
        if (!Array.isArray(sortOptionsParsed)) throw new Error("filters.sort_options must be a JSON array");
        for (const s of sortOptionsParsed) {
          if (!s || typeof s !== "object") throw new Error("Each sort option must be an object");
          if (!toStr(s.value) || !toStr(s.label)) throw new Error('Each sort option must have "value" and "label"');
        }
        updated.filters.sort_options = sortOptionsParsed;

        updated.filters.sidebar_title = filtersForm.sidebar_title;
        updated.filters.reset_label = filtersForm.reset_label;

        const labelsParsed = parseJsonSafe(filtersForm.labels_text);
        if (!labelsParsed || typeof labelsParsed !== "object" || Array.isArray(labelsParsed)) {
          throw new Error("filters.labels must be a JSON object");
        }
        updated.filters.labels = labelsParsed;
      }

      if (activeSection.section_key === "pagination") {
        updated.pagination = updated.pagination || {};
        const sizeNum = Number(paginationForm.page_size);
        if (!Number.isFinite(sizeNum) || sizeNum <= 0) throw new Error("pagination.page_size must be a positive number");
        updated.pagination.page_size = sizeNum;
        updated.pagination.empty_text = paginationForm.empty_text;
        updated.pagination.page_label_prefix = paginationForm.page_label_prefix;
        updated.pagination.page_label_middle = paginationForm.page_label_middle;
      }

      if (activeSection.section_key === "cta") {
        updated.cta = updated.cta || {};
        updated.cta.read_article_label = ctaForm.read_article_label;
        updated.cta.read_article_suffix = ctaForm.read_article_suffix;
        updated.cta.read_article_base_href = ctaForm.read_article_base_href;
      }

      if (activeSection.section_key === "assets") {
        updated.assets = updated.assets || {};
        updated.assets.fallback_cover = assetsForm.fallback_cover;
      }

      if (activeSection.section_key === "posts") {
        const parsed = parseJsonSafe(postsForm.postsText);
        if (!Array.isArray(parsed)) throw new Error("posts must be a JSON array");
        for (const item of parsed) {
          if (!item || typeof item !== "object") throw new Error("Each post must be an object");
          const required = ["id", "title", "category", "dateISO", "readTime", "cover", "excerpt", "slug"];
          for (const k of required) {
            if (!toStr((item as any)[k])) throw new Error(`Each post must have "${k}"`);
          }
        }
        updated.posts = parsed;
      }

      const saveUrl = joinApiUrl(API_BASE, "/api/v1/content/blog");
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
        title="Blog Page Management"
        subtitle="Blog page content loaded from CMS JSON."
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
                      Route: /api/v1/content/blog
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
        subtitle={activeSection ? `Update fields and save to /api/v1/content/blog` : ""}
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

        {activeSection?.section_key === "hero" ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Section Key" value="hero" onChange={() => null} disabled />
              <TextField label="Type" value="HERO" onChange={() => null} disabled />
            </div>

            <TextField label="Badge" value={heroForm.badge} onChange={(v) => setHeroForm((p) => ({ ...p, badge: v }))} />
            <TextField label="Title" value={heroForm.title} onChange={(v) => setHeroForm((p) => ({ ...p, title: v }))} />
            <TextAreaField
              label="Subtitle"
              value={heroForm.subtitle}
              onChange={(v) => setHeroForm((p) => ({ ...p, subtitle: v }))}
              rows={5}
            />
          </div>
        ) : null}

        {activeSection?.section_key === "filters" ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Section Key" value="filters" onChange={() => null} disabled />
              <TextField label="Type" value="FILTERS" onChange={() => null} disabled />
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField
                label="Search placeholder"
                value={filtersForm.search_placeholder}
                onChange={(v) => setFiltersForm((p) => ({ ...p, search_placeholder: v }))}
              />
              <TextField
                label="Sidebar title"
                value={filtersForm.sidebar_title}
                onChange={(v) => setFiltersForm((p) => ({ ...p, sidebar_title: v }))}
              />
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <TextField
                label="Default category"
                value={filtersForm.default_category}
                onChange={(v) => setFiltersForm((p) => ({ ...p, default_category: v }))}
              />
              <TextField
                label="Default sort"
                value={filtersForm.default_sort}
                onChange={(v) => setFiltersForm((p) => ({ ...p, default_sort: v }))}
              />
              <TextField
                label="Reset label"
                value={filtersForm.reset_label}
                onChange={(v) => setFiltersForm((p) => ({ ...p, reset_label: v }))}
              />
            </div>

            <TextAreaField
              label='Sort options (JSON array) — each item: { "value", "label" }'
              value={filtersForm.sort_options_text}
              onChange={(v) => setFiltersForm((p) => ({ ...p, sort_options_text: v }))}
              rows={10}
            />

            <TextAreaField
              label='Labels (JSON object) — e.g. { "search": "...", "category": "...", "sort": "..." }'
              value={filtersForm.labels_text}
              onChange={(v) => setFiltersForm((p) => ({ ...p, labels_text: v }))}
              rows={8}
            />
          </div>
        ) : null}

        {activeSection?.section_key === "pagination" ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Section Key" value="pagination" onChange={() => null} disabled />
              <TextField label="Type" value="PAGINATION" onChange={() => null} disabled />
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <TextField
                label="Page size"
                value={paginationForm.page_size}
                onChange={(v) => setPaginationForm((p) => ({ ...p, page_size: v }))}
              />
              <TextField
                label="Page label prefix"
                value={paginationForm.page_label_prefix}
                onChange={(v) => setPaginationForm((p) => ({ ...p, page_label_prefix: v }))}
              />
              <TextField
                label="Page label middle"
                value={paginationForm.page_label_middle}
                onChange={(v) => setPaginationForm((p) => ({ ...p, page_label_middle: v }))}
              />
            </div>

            <TextAreaField
              label="Empty text"
              value={paginationForm.empty_text}
              onChange={(v) => setPaginationForm((p) => ({ ...p, empty_text: v }))}
              rows={5}
            />
          </div>
        ) : null}

        {activeSection?.section_key === "cta" ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Section Key" value="cta" onChange={() => null} disabled />
              <TextField label="Type" value="CTA" onChange={() => null} disabled />
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField
                label="Read article label"
                value={ctaForm.read_article_label}
                onChange={(v) => setCtaForm((p) => ({ ...p, read_article_label: v }))}
              />
              <TextField
                label="Read article suffix"
                value={ctaForm.read_article_suffix}
                onChange={(v) => setCtaForm((p) => ({ ...p, read_article_suffix: v }))}
              />
            </div>

            <TextField
              label="Read article base href"
              value={ctaForm.read_article_base_href}
              onChange={(v) => setCtaForm((p) => ({ ...p, read_article_base_href: v }))}
            />
          </div>
        ) : null}

        {activeSection?.section_key === "assets" ? (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Section Key" value="assets" onChange={() => null} disabled />
              <TextField label="Type" value="ASSETS" onChange={() => null} disabled />
            </div>
            <TextField
              label="Fallback cover"
              value={assetsForm.fallback_cover}
              onChange={(v) => setAssetsForm({ fallback_cover: v })}
            />
          </div>
        ) : null}

        {activeSection?.section_key === "posts" ? (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Section Key" value="posts" onChange={() => null} disabled />
              <TextField label="Type" value="POSTS" onChange={() => null} disabled />
            </div>

            <TextAreaField
              label='Posts (JSON array) — each item must have: { "id","title","category","dateISO","readTime","cover","excerpt","slug" }'
              value={postsForm.postsText}
              onChange={(v) => setPostsForm({ postsText: v })}
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
            disabled={saving || !activeSection || !rawBlog}
            className={cx(
              "inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white",
              saving || !activeSection || !rawBlog
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
