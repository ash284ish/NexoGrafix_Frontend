"use client";

import React, { useEffect, useMemo, useState } from "react";
import { FiAlertTriangle, FiEdit3, FiTag, FiX, FiLock } from "react-icons/fi";
import SectionHeader from "@/components/dashboard/assets/SectionHeader";
import ToastTopRight from "@/components/ui/Toast";

type AboutSectionType =
  | "HERO"
  | "WHAT_PROBLEMS_WE_SOLVE"
  | "HOW_WE_SOLVE_IT"
  | "WHAT_MAKES_DIFFERENT"
  | "UNKNOWN";

type AboutSection = {
  id: string;
  section_key: string;
  section_type: AboutSectionType;
  title: string;
  subtitle: string;
  order_index: number;
  is_enabled: boolean;
  meta?: {
    badge?: string;
    alignment?: "left" | "center" | "right";
  };
  raw: unknown;
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

function asNumber(v: unknown, fallback = 999) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function toStr(v: unknown) {
  if (v === null || v === undefined) return "";
  return String(v);
}

interface CMSData {
  meta?: { status?: string };
  hero?: { headline?: string; badge?: { text?: string }; description?: string; order?: number };
  whatProblemsWeSolve?: { title?: string; pill?: string; subtitle?: string; order?: number };
  howWeSolveIt?: { right?: { title?: string; pill?: string; subtitle?: string }; order?: number };
  whatMakesDifferent?: { left?: { title?: string; pill?: string; subtitle?: string }; order?: number };
  [key: string]: unknown;
}

function buildAboutSections(json: unknown): AboutSection[] {
  const sections: AboutSection[] = [];
  const data = json as CMSData;

  const meta = data?.meta || {};
  const status = String(meta?.status || "").toLowerCase();
  const defaultEnabled = status === "published" || status === "live" || status === "active" || !status;

  const hero = data?.hero;
  if (hero) {
    const title = hero?.headline ? toStr(hero.headline) : toStr(hero?.badge?.text || "Hero");
    const subtitle = hero?.description ? toStr(hero.description) : "—";
    sections.push({
      id: "hero",
      section_key: "hero",
      section_type: "HERO",
      title,
      subtitle,
      order_index: asNumber(hero?.order, 1),
      is_enabled: defaultEnabled,
      meta: { badge: toStr(hero?.badge?.text || "HERO"), alignment: "left" },
      raw: hero,
    });
  }

  const whatProblemsWeSolve = data?.whatProblemsWeSolve;
  if (whatProblemsWeSolve) {
    sections.push({
      id: "whatProblemsWeSolve",
      section_key: "whatProblemsWeSolve",
      section_type: "WHAT_PROBLEMS_WE_SOLVE",
      title: toStr(whatProblemsWeSolve?.title || whatProblemsWeSolve?.pill || "What Problems We Solve"),
      subtitle: toStr(whatProblemsWeSolve?.subtitle || "—"),
      order_index: asNumber(whatProblemsWeSolve?.order, 2),
      is_enabled: defaultEnabled,
      meta: { badge: toStr(whatProblemsWeSolve?.pill || "PROBLEMS"), alignment: "left" },
      raw: whatProblemsWeSolve,
    });
  }

  const howWeSolveIt = data?.howWeSolveIt;
  if (howWeSolveIt) {
    const rightTitle = toStr(howWeSolveIt?.right?.title || howWeSolveIt?.right?.pill || "How We Solve It");
    const rightSubtitle = toStr(howWeSolveIt?.right?.subtitle || "—");
    sections.push({
      id: "howWeSolveIt",
      section_key: "howWeSolveIt",
      section_type: "HOW_WE_SOLVE_IT",
      title: rightTitle,
      subtitle: rightSubtitle,
      order_index: asNumber(howWeSolveIt?.order, 3),
      is_enabled: defaultEnabled,
      meta: { badge: toStr(howWeSolveIt?.right?.pill || "MODEL"), alignment: "left" },
      raw: howWeSolveIt,
    });
  }

  const whatMakesDifferent = data?.whatMakesDifferent;
  if (whatMakesDifferent) {
    const leftTitle = toStr(whatMakesDifferent?.left?.title || whatMakesDifferent?.left?.pill || "What Makes Us Different");
    const leftSubtitle = toStr(whatMakesDifferent?.left?.subtitle || "—");
    sections.push({
      id: "whatMakesDifferent",
      section_key: "whatMakesDifferent",
      section_type: "WHAT_MAKES_DIFFERENT",
      title: leftTitle,
      subtitle: leftSubtitle,
      order_index: asNumber(whatMakesDifferent?.order, 4),
      is_enabled: defaultEnabled,
      meta: { badge: toStr(whatMakesDifferent?.left?.pill || "DIFFERENT"), alignment: "left" },
      raw: whatMakesDifferent,
    });
  }

  const knownKeys = new Set(["meta", "hero", "whatProblemsWeSolve", "howWeSolveIt", "whatMakesDifferent"]);
  Object.keys(data || {}).forEach((k) => {
    if (knownKeys.has(k)) return;
    const v = data?.[k];
    if (!v || typeof v !== "object") return;
    const maybeOrder = asNumber((v as Record<string, unknown>)?.order, 999);
    const title = toStr((v as Record<string, unknown>)?.title || (v as Record<string, unknown>)?.heading || (v as Record<string, unknown>)?.name || k);
    const subtitle = toStr((v as Record<string, unknown>)?.subtitle || (v as Record<string, unknown>)?.subheading || (v as Record<string, unknown>)?.description || "—");
    sections.push({
      id: k,
      section_key: k,
      section_type: "UNKNOWN",
      title,
      subtitle,
      order_index: maybeOrder,
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

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="grid gap-1.5">
      <div className="text-xs font-semibold text-slate-600">{label}</div>
      <input
        value={Number.isFinite(value) ? String(value) : ""}
        onChange={(e) => onChange(asNumber(e.target.value, 0))}
        inputMode="numeric"
        className={cx(
          "h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none",
          "focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
        )}
      />
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  rows = 14,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <label className="grid gap-1.5">
      <div className="text-xs font-semibold text-slate-600">{label}</div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className={cx(
          "w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none",
          "focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
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
          <div className="max-h-[75vh] overflow-auto px-5 py-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

type ToastTone = "success" | "error";
type ToastState = { open: boolean; tone: ToastTone; title: string; message?: string };

export default function AboutAdminPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const endpoint = useMemo(() => joinApiUrl(API_BASE, "/api/v1/content/about"), [API_BASE]);

  const [sections, setSections] = useState<AboutSection[]>([]);
  const [rawAbout, setRawAbout] = useState<Record<string, unknown> | null>(null);

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

  const fixedKeys = new Set<string>(["hero"]);

  function persistToast(next: { tone: ToastTone; title: string; message?: string }) {
    try {
      sessionStorage.setItem("about_admin_toast", JSON.stringify(next));
    } catch { }
  }

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("about_admin_toast");
      if (!raw) return;
      sessionStorage.removeItem("about_admin_toast");
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
        if (!res.ok) throw new Error(`Failed to load about content (${res.status})`);

        const json = await res.json();
        const built = buildAboutSections(json);

        if (alive) {
          setRawAbout(json as Record<string, unknown>);
          setSections(built);
        }
      } catch (e: unknown) {
        if (alive) setErr(e instanceof Error ? e.message : "Failed to load about content");
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

  const [editOrder, setEditOrder] = useState<number>(0);
  const [editJson, setEditJson] = useState<string>("");
  const [jsonErr, setJsonErr] = useState<string | null>(null);

  useEffect(() => {
    if (!activeSection) return;
    setSaveErr(null);
    setJsonErr(null);
    setEditOrder(asNumber(activeSection.raw?.order, activeSection.order_index));
    try {
      setEditJson(JSON.stringify(activeSection.raw ?? {}, null, 2));
    } catch {
      setEditJson(toStr(activeSection.raw));
    }
  }, [activeSection]);

  function getSectionValue(root: Record<string, unknown>, key: string) {
    return root?.[key];
  }

  function setSectionValue(root: Record<string, unknown>, key: string, value: unknown) {
    root[key] = value;
  }

  async function saveActiveSection() {
    if (!rawAbout || !activeSection) return;

    let parsed: unknown;
    try {
      setJsonErr(null);
      parsed = JSON.parse(editJson || "{}");
    } catch {
      setJsonErr("JSON invalid. Please fix JSON formatting and try again.");
      return;
    }

    const parsedObj = (parsed && typeof parsed === "object" ? parsed : {}) as Record<string, unknown>;
    parsedObj.order = asNumber(editOrder, asNumber(parsedObj?.order, activeSection.order_index));

    try {
      setSaving(true);
      setSaveErr(null);

      const updated = structuredClone(rawAbout) as Record<string, unknown>;

      const current = getSectionValue(updated, activeSection.section_key);
      if (!current || typeof current !== "object") {
        setSectionValue(updated, activeSection.section_key, parsedObj);
      } else {
        setSectionValue(updated, activeSection.section_key, parsedObj);
      }

      const saveUrl = joinApiUrl(API_BASE, "/api/v1/content/about");
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
  const pageStatus = toStr(rawAbout?.meta?.status || "");
  const updatedAt = toStr(rawAbout?.meta?.updatedAt || "");
  const updatedBy = toStr(rawAbout?.meta?.updatedBy || "");

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
        title="About Page Management"
        subtitle="About page sections loaded from CMS content."
        right={
          <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-500">
            <span>{loading ? "Loading…" : `${totalSections} sections`}</span>
            {pageStatus ? <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">Status: {pageStatus}</span> : null}
            {updatedAt ? <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">Updated: {updatedAt}</span> : null}
            {updatedBy ? <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">By: {updatedBy}</span> : null}
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
          .map((s) => {
            const isFixed = fixedKeys.has(s.section_key);

            return (
              <div key={s.id} className="rounded-md bg-white p-5 shadow-sm ring-1 ring-slate-200/60">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="text-sm font-semibold text-slate-900">
                        {s.section_key}
                        <span className="ml-2 text-xs font-semibold text-slate-400">({s.section_type})</span>
                      </div>

                      {isFixed ? (
                        <Pill tone="amber">
                          <FiLock />
                          Fixed position
                        </Pill>
                      ) : null}

                      {s.is_enabled ? <Pill tone="emerald">Enabled</Pill> : <Pill>Disabled</Pill>}

                      {s.meta?.badge ? (
                        <Pill tone="blue">
                          <FiTag />
                          {s.meta.badge}
                        </Pill>
                      ) : null}

                      {s.meta?.alignment ? <Pill>{s.meta.alignment}</Pill> : null}

                      {s.section_type === "UNKNOWN" ? <Pill tone="rose">Unknown</Pill> : null}
                    </div>

                    <div className="mt-3 grid gap-1">
                      <div className="text-xl font-semibold text-slate-900">{s.title}</div>
                      <div className="text-sm text-slate-600">{s.subtitle}</div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 font-semibold">Order: {s.order_index}</span>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 font-semibold">Key locked: {isFixed ? "Yes" : "No"}</span>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 font-semibold">Route: /api/v1/content/about</span>
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
            );
          })}

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
        subtitle={activeSection ? `Update JSON and save to /api/v1/content/about` : ""}
        onClose={() => (saving ? null : setActiveKey(null))}
      >
        {activeSection ? (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <NumberField label="Order" value={editOrder} onChange={(v) => setEditOrder(v)} />
              <TextField label="Section Key" value={activeSection.section_key} onChange={() => null} disabled />
              <TextField label="Type" value={activeSection.section_type} onChange={() => null} disabled />
            </div>

            <TextAreaField label="Full Section JSON (editable)" value={editJson} onChange={(v) => setEditJson(v)} rows={18} />

            {jsonErr ? <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{jsonErr}</div> : null}
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
            disabled={saving || !activeSection || !rawAbout}
            className={cx(
              "inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white",
              saving || !activeSection || !rawAbout ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:bg-slate-800"
            )}
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </EditModal>
    </div>
  );
}
