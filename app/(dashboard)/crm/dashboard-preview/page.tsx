"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const ENDPOINT_PATH = "/api/v1/content/dashboard-preview";

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

function cx(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
}

function toStr(v: any) {
  if (v === null || v === undefined) return "";
  return String(v);
}

function safeJsonParse<T = any>(text: string): { ok: boolean; value?: T; error?: string } {
  try {
    const v = JSON.parse(text);
    return { ok: true, value: v };
  } catch (e: any) {
    return { ok: false, error: e?.message || "Invalid JSON" };
  }
}

function pick<T = any>(obj: any, path: string, fallback: T): T {
  if (!obj || !path) return fallback;
  const parts = path.split(".").filter(Boolean);
  let cur: any = obj;
  for (const k of parts) {
    if (cur && typeof cur === "object" && k in cur) cur = cur[k];
    else return fallback;
  }
  return (cur as T) ?? fallback;
}

function setAtPath(obj: any, path: string, value: any) {
  const parts = path.split(".").filter(Boolean);
  if (!parts.length) return obj;

  const root = Array.isArray(obj) ? [...obj] : { ...(obj || {}) };
  let cur: any = root;

  for (let i = 0; i < parts.length; i++) {
    const key = parts[i];
    const isLast = i === parts.length - 1;

    if (isLast) {
      cur[key] = value;
      break;
    }

    const next = cur[key];
    const nextObj =
      Array.isArray(next) ? [...next] : next && typeof next === "object" ? { ...next } : {};
    cur[key] = nextObj;
    cur = nextObj;
  }

  return root;
}

function normalizeApiError(raw: any) {
  const t = String(raw || "").trim();
  if (!t) return "";
  try {
    const j = JSON.parse(t);
    if (typeof j?.detail === "string") return j.detail;
    if (Array.isArray(j?.detail)) {
      return j.detail.map((d: any) => d?.msg || d?.message || "").filter(Boolean).join(", ");
    }
    return t;
  } catch {
    return t;
  }
}

function isEmptyObject(v: any) {
  return v && typeof v === "object" && !Array.isArray(v) && Object.keys(v).length === 0;
}

type SectionDef = {
  key: string;
  title: string;
  path: string;
  kind: "json";
};

const SECTIONS: SectionDef[] = [
  { key: "state", title: "State (defaults + flow)", path: "state", kind: "json" },
  { key: "layout", title: "Layout (app/sidebar/topbar/main)", path: "layout", kind: "json" },
  { key: "navigation", title: "Navigation (top + sidebar)", path: "navigation", kind: "json" },
  { key: "topbar", title: "Topbar actions", path: "topbar", kind: "json" },

  { key: "page_dashboard", title: "Page: Dashboard", path: "pages.dashboard", kind: "json" },
  { key: "page_upload", title: "Page: Upload PDF", path: "pages.upload", kind: "json" },
  { key: "page_review_images", title: "Page: Review Images", path: "pages.review-images", kind: "json" },
  { key: "page_generate_alt", title: "Page: Generate Alt", path: "pages.generate-alt", kind: "json" },
  { key: "page_review_approve", title: "Page: Review & Approve", path: "pages.review-approve", kind: "json" },
  { key: "page_export", title: "Page: Export", path: "pages.export", kind: "json" },
  { key: "page_projects", title: "Page: Projects", path: "pages.projects", kind: "json" },

  { key: "onboarding", title: "Onboarding", path: "onboarding", kind: "json" },
  { key: "misc", title: "Misc", path: "misc", kind: "json" },
];

function Input({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <div className="text-xs font-bold tracking-wide text-slate-600">{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-900/10"
      />
    </label>
  );
}

function Textarea({
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
    <label className="block">
      <div className="text-xs font-bold tracking-wide text-slate-600">{label}</div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="mt-1 w-full resize-none rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-900/10"
      />
    </label>
  );
}

function ListEditor({
  label,
  items,
  onChange,
  itemLabel = "Item",
}: {
  label: string;
  items: string[];
  onChange: (next: string[]) => void;
  itemLabel?: string;
}) {
  const add = () => onChange([...(items || []), ""]);
  const remove = (idx: number) => onChange((items || []).filter((_, i) => i !== idx));
  const update = (idx: number, v: string) => onChange((items || []).map((x, i) => (i === idx ? v : x)));

  return (
    <div className="rounded-md border border-slate-200 bg-white p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs font-extrabold text-slate-900">{label}</div>
        <button
          type="button"
          onClick={add}
          className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-800 hover:bg-slate-50"
        >
          Add
        </button>
      </div>

      <div className="mt-3 space-y-2">
        {(items || []).length ? (
          (items || []).map((v, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                value={v}
                onChange={(e) => update(idx, e.target.value)}
                placeholder={`${itemLabel} ${idx + 1}`}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-900/10"
              />
              <button
                type="button"
                onClick={() => remove(idx)}
                className="rounded-md border border-slate-200 bg-white px-2.5 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50"
              >
                Remove
              </button>
            </div>
          ))
        ) : (
          <div className="text-sm text-slate-600">No items</div>
        )}
      </div>
    </div>
  );
}

export default function DashboardCmsEditorPage() {
  const endpoint = useMemo(() => joinApiUrl(API_BASE, ENDPOINT_PATH), []);

  const [cms, setCms] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [activeKey, setActiveKey] = useState(SECTIONS[0]?.key || "state");
  const active = useMemo(() => SECTIONS.find((s) => s.key === activeKey) || SECTIONS[0], [activeKey]);

  const [mode, setMode] = useState<"form" | "json">("form");

  const activeValue = useMemo(() => {
    if (!active) return null;
    return pick<any>(cms, active.path, null);
  }, [cms, active]);

  const [draft, setDraft] = useState<string>("");
  const [draftErr, setDraftErr] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [banner, setBanner] = useState<{ tone: "success" | "error" | "info"; msg: string } | null>(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setErr(null);
        setBanner(null);

        const res = await fetch(endpoint, { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to load (${res.status})`);
        const json = await res.json();

        if (!alive) return;
        setCms(json);
      } catch (e: any) {
        if (!alive) return;
        setErr(e?.message || "Failed to load");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [endpoint]);

  useEffect(() => {
    setDraftErr(null);
    if (!active) {
      setDraft("");
      return;
    }
    setDraft(JSON.stringify(activeValue ?? {}, null, 2));
  }, [active, activeValue]);

  useEffect(() => {
    if (!banner) return;
    const t = setTimeout(() => setBanner(null), 2500);
    return () => clearTimeout(t);
  }, [banner]);

  const applyFormPatch = useCallback(
    (patch: any) => {
      if (!cms || !active) return;
      const cur = pick<any>(cms, active.path, {});
      const nextSection =
        cur && typeof cur === "object" && !Array.isArray(cur) ? { ...cur, ...patch } : patch;
      const nextCms = setAtPath(cms, active.path, nextSection);
      setCms(nextCms);
      setDraft(JSON.stringify(nextSection ?? {}, null, 2));
    },
    [cms, active]
  );

  const applyFormNestedPatch = useCallback(
    (subPath: string, value: any) => {
      if (!cms || !active) return;
      const sectionPath = active.path;
      const fullPath = `${sectionPath}.${subPath}`;
      const nextCms = setAtPath(cms, fullPath, value);
      setCms(nextCms);
      const sectionNow = pick<any>(nextCms, sectionPath, {});
      setDraft(JSON.stringify(sectionNow ?? {}, null, 2));
    },
    [cms, active]
  );

  const onSave = useCallback(async () => {
    if (!active) return;
    if (!cms) return;

    const r = safeJsonParse(draft);
    if (!r.ok) {
      setDraftErr(r.error || "Invalid JSON");
      return;
    }

    setDraftErr(null);

    const nextCms = setAtPath(cms, active.path, r.value);

    setSaving(true);
    setErr(null);
    setBanner({ tone: "info", msg: "Saving..." });
    setCms(nextCms);

    try {
      const res = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextCms),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        const msg = normalizeApiError(txt) || `Update failed (${res.status})`;
        setErr(msg);
        setBanner({ tone: "error", msg });
        setSaving(false);
        return;
      }

      let returned: any = null;
      const txt = await res.text().catch(() => "");
      if (txt && txt.trim()) {
        const parsed = safeJsonParse(txt);
        if (parsed.ok) returned = parsed.value;
      }

      const shouldUseReturned =
        returned &&
        typeof returned === "object" &&
        !Array.isArray(returned) &&
        !isEmptyObject(returned);

      const finalCms = shouldUseReturned ? returned : nextCms;

      setCms(finalCms);
      const sectionNow = pick<any>(finalCms, active.path, {});
      setDraft(JSON.stringify(sectionNow ?? {}, null, 2));

      setBanner({ tone: "success", msg: "Saved successfully" });
      setSaving(false);
    } catch (e: any) {
      const msg = e?.message || "Network error";
      setErr(msg);
      setBanner({ tone: "error", msg });
      setSaving(false);
    }
  }, [active, cms, draft, endpoint]);

  const onReload = useCallback(async () => {
    try {
      setLoading(true);
      setErr(null);
      setBanner({ tone: "info", msg: "Reloading..." });

      const res = await fetch(endpoint, { cache: "no-store" });
      if (!res.ok) throw new Error(`Failed to reload (${res.status})`);
      const json = await res.json();
      setCms(json);

      const sectionNow = active ? pick<any>(json, active.path, {}) : {};
      setDraft(JSON.stringify(sectionNow ?? {}, null, 2));
      setBanner({ tone: "success", msg: "Reloaded" });
    } catch (e: any) {
      const msg = e?.message || "Failed to reload";
      setErr(msg);
      setBanner({ tone: "error", msg });
    } finally {
      setLoading(false);
    }
  }, [endpoint, active]);

  const onDownload = useCallback(() => {
    const obj = cms ?? {};
    const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dashboard-preview.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, [cms]);

  const section = useMemo(() => {
    if (!cms || !active) return {};
    const v = pick<any>(cms, active.path, {});
    return v && typeof v === "object" && !Array.isArray(v) ? v : {};
  }, [cms, active]);

  const header = useMemo(() => (section as any)?.header || (section as any)?.hero || null, [section]);

  const formSupported = useMemo(() => {
    const p = active?.path || "";
    return /^pages\./.test(p) || p === "topbar" || p === "navigation";
  }, [active]);

  const renderForm = () => {
    if (!active) return null;

    const p = active.path;

    if (p === "topbar") {
      const actions = (section as any)?.actions;
      const list = Array.isArray(actions) ? actions : [];
      const labels = list.map((x: any) => toStr(x?.key || x?.type || x?.icon || "")).filter(Boolean);
      return (
        <div className="space-y-4">
          <Textarea
            label="Topbar JSON (for exact control)"
            value={draft}
            onChange={setDraft}
            rows={14}
          />
          <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
            Actions found: <span className="font-semibold">{labels.length ? labels.join(", ") : "None"}</span>
          </div>
        </div>
      );
    }

    if (p === "navigation") {
      const topItems = (section as any)?.topNav?.items;
      const sideItems = (section as any)?.sidebarNav?.items;

      const topLabels = (Array.isArray(topItems) ? topItems : []).map((x: any) => toStr(x?.label)).filter(Boolean);
      const sideLabels = (Array.isArray(sideItems) ? sideItems : []).map((x: any) => toStr(x?.label)).filter(Boolean);

      return (
        <div className="space-y-4">
          <ListEditor
            label="Top Nav Labels"
            items={topLabels}
            onChange={(next) => {
              const items = next.map((label) => ({ label }));
              applyFormNestedPatch("topNav.items", items);
            }}
            itemLabel="Label"
          />
          <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
            Sidebar items (read-only here): <span className="font-semibold">{sideLabels.length ? sideLabels.join(", ") : "None"}</span>
          </div>
          <Textarea
            label="Navigation JSON (advanced)"
            value={draft}
            onChange={setDraft}
            rows={14}
          />
        </div>
      );
    }

    if (/^pages\./.test(p)) {
      const title =
        toStr((section as any)?.header?.title) ||
        toStr((section as any)?.hero?.title) ||
        toStr((section as any)?.name) ||
        "";
      const subtitle =
        toStr((section as any)?.header?.subtitle) ||
        toStr((section as any)?.hero?.subtitle) ||
        "";
      const badge = toStr((section as any)?.header?.badge) || toStr((section as any)?.badge) || "";

      const hasHeader = Boolean((section as any)?.header);
      const hasHero = Boolean((section as any)?.hero);

      const pathPrefix = hasHeader ? "header" : hasHero ? "hero" : "";

      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Input
              label="Title"
              value={title}
              onChange={(v) => {
                if (pathPrefix) applyFormNestedPatch(`${pathPrefix}.title`, v);
                else applyFormPatch({ title: v });
              }}
              placeholder="Section title"
            />
            <Input
              label="Badge (if any)"
              value={badge}
              onChange={(v) => {
                if ((section as any)?.header?.badge !== undefined) applyFormNestedPatch("header.badge", v);
                else applyFormPatch({ badge: v });
              }}
              placeholder="e.g., Step 4 · Workflow"
            />
          </div>

          <Textarea
            label="Subtitle"
            value={subtitle}
            onChange={(v) => {
              if (pathPrefix) applyFormNestedPatch(`${pathPrefix}.subtitle`, v);
              else applyFormPatch({ subtitle: v });
            }}
            rows={3}
            placeholder="Short subtitle"
          />

          {p === "pages.review-images" ? (
            <ListEditor
              label="Best practices"
              items={Array.isArray((section as any)?.rightRail?.bestPractices?.items) ? (section as any).rightRail.bestPractices.items : []}
              onChange={(next) => applyFormNestedPatch("rightRail.bestPractices.items", next)}
              itemLabel="Practice"
            />
          ) : null}

          {p === "pages.generate-alt" ? (
            <ListEditor
              label="Regenerate samples"
              items={Array.isArray((section as any)?.regenerateSamples) ? (section as any).regenerateSamples : []}
              onChange={(next) => applyFormNestedPatch("regenerateSamples", next)}
              itemLabel="Sample"
            />
          ) : null}

          {p === "pages.export" ? (
            <div className="rounded-md border border-slate-200 bg-white p-3">
              <div className="text-xs font-extrabold text-slate-900">Ready note</div>
              <div className="mt-2">
                <Textarea
                  label="Text"
                  value={toStr((section as any)?.readyNote)}
                  onChange={(v) => applyFormNestedPatch("readyNote", v)}
                  rows={2}
                />
              </div>
            </div>
          ) : null}

          <Textarea
            label="Section JSON (advanced)"
            value={draft}
            onChange={setDraft}
            rows={16}
          />
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <Textarea label="Section JSON" value={draft} onChange={setDraft} rows={18} />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-lg font-extrabold text-slate-900 md:text-2xl">Dashboard CMS Editor</div>
            <div className="mt-1 text-sm text-slate-600">
              Endpoint: <span className="font-semibold">{endpoint}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setMode(mode === "form" ? "json" : "form")}
              className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
              disabled={!formSupported}
              title={!formSupported ? "Form mode not available for this section" : ""}
            >
              {mode === "form" ? "Switch to JSON" : "Switch to Form"}
            </button>

            <button
              onClick={onReload}
              className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
              disabled={loading || saving}
            >
              Reload
            </button>

            <button
              onClick={onDownload}
              className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
              disabled={!cms}
            >
              Download JSON
            </button>

            <button
              onClick={onSave}
              className={cx(
                "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold text-white",
                saving ? "bg-slate-400" : "bg-slate-900 hover:bg-slate-800"
              )}
              disabled={!cms || loading || saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

        {banner ? (
          <div
            className={cx(
              "mb-4 rounded-md p-3 text-sm font-semibold ring-1",
              banner.tone === "success"
                ? "bg-emerald-50 text-emerald-800 ring-emerald-200"
                : banner.tone === "error"
                ? "bg-rose-50 text-rose-800 ring-rose-200"
                : "bg-sky-50 text-sky-800 ring-sky-200"
            )}
          >
            {banner.msg}
          </div>
        ) : null}

        {err ? (
          <div className="mb-5 rounded-md bg-white p-4 ring-1 ring-rose-200">
            <div className="text-sm font-semibold text-rose-700">Error</div>
            <div className="mt-1 text-sm text-slate-700">{err}</div>
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="rounded-md bg-white shadow-sm ring-1 ring-slate-200/60">
              <div className="border-b border-slate-200 px-4 py-3">
                <div className="text-sm font-extrabold text-slate-900">Sections</div>
                <div className="mt-1 text-xs text-slate-500">Admin-friendly form + optional JSON editor.</div>
              </div>

              <div className="p-2">
                {SECTIONS.map((s) => {
                  const isActive = s.key === activeKey;
                  return (
                    <button
                      key={s.key}
                      onClick={() => setActiveKey(s.key)}
                      className={cx(
                        "mb-1 w-full rounded-md px-3 py-2 text-left text-sm font-semibold",
                        isActive ? "bg-slate-900 text-white" : "bg-white text-slate-900 hover:bg-slate-50"
                      )}
                      disabled={loading || !cms}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="truncate">{s.title}</span>
                        <span
                          className={cx(
                            "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ring-1",
                            isActive ? "bg-white/10 text-white ring-white/20" : "bg-slate-100 text-slate-700 ring-slate-200"
                          )}
                        >
                          JSON
                        </span>
                      </div>
                      <div className={cx("mt-1 truncate text-xs", isActive ? "text-white/70" : "text-slate-500")}>
                        {s.path}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 rounded-md bg-white p-4 shadow-sm ring-1 ring-slate-200/60">
              <div className="text-sm font-extrabold text-slate-900">Quick health</div>
              <div className="mt-2 space-y-2 text-sm text-slate-700">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Loaded</span>
                  <span className="font-semibold">{loading ? "No" : cms ? "Yes" : "No"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Saving</span>
                  <span className="font-semibold">{saving ? "Yes" : "No"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Mode</span>
                  <span className="font-semibold">{formSupported ? mode : "JSON"}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-8">
            <div className="rounded-md bg-white shadow-sm ring-1 ring-slate-200/60">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-extrabold text-slate-900">{active?.title || "Editor"}</div>
                  <div className="mt-1 truncate text-xs text-slate-500">{active?.path || ""}</div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-700 ring-1 ring-slate-200">
                    {formSupported ? mode.toUpperCase() : "JSON"}
                  </span>
                </div>
              </div>

              <div className="p-4">
                {loading ? (
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 w-40 rounded bg-slate-200" />
                    <div className="h-40 w-full rounded bg-slate-200" />
                    <div className="h-10 w-32 rounded bg-slate-200" />
                  </div>
                ) : !cms ? (
                  <div className="text-sm font-semibold text-slate-700">CMS not loaded.</div>
                ) : (
                  <>
                    {draftErr ? (
                      <div className="mb-3 rounded-md bg-rose-50 p-3 text-sm font-semibold text-rose-800 ring-1 ring-rose-200">
                        {draftErr}
                      </div>
                    ) : null}

                    {formSupported && mode === "form" ? (
                      renderForm()
                    ) : (
                      <textarea
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        className="h-140 w-full resize-none rounded-md border border-slate-200 bg-white p-3 font-mono text-xs text-slate-900 outline-none focus:ring-2 focus:ring-slate-900/10"
                        spellCheck={false}
                      />
                    )}

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <div className="text-xs text-slate-500">
                        Save always updates full JSON on backend. Form mode only helps editing common fields.
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => {
                            const sectionNow = pick<any>(cms, active?.path || "", {});
                            setDraft(JSON.stringify(sectionNow ?? {}, null, 2));
                            setDraftErr(null);
                            setBanner({ tone: "success", msg: "Reset done" });
                          }}
                          className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                          disabled={saving}
                        >
                          Reset
                        </button>
                        <button
                          onClick={onSave}
                          className={cx(
                            "rounded-md px-4 py-2 text-sm font-semibold text-white",
                            saving ? "bg-slate-400" : "bg-slate-900 hover:bg-slate-800"
                          )}
                          disabled={saving}
                        >
                          {saving ? "Saving..." : "Save changes"}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="mt-4 rounded-md bg-white p-4 shadow-sm ring-1 ring-slate-200/60">
              <div className="text-sm font-extrabold text-slate-900">Preview (read-only)</div>
              <div className="mt-2 max-h-65 overflow-auto rounded-md bg-slate-50 p-3 font-mono text-xs text-slate-800 ring-1 ring-slate-200">
                {cms && active?.path ? JSON.stringify(pick(cms, active.path, {}), null, 2) : "{}"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
