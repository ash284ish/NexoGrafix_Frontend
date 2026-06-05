"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  FiLock,
  FiTag,
  FiAlertTriangle,
  FiEdit3,
  FiX,
  FiCheckCircle,
  FiXCircle,
  FiCode,
} from "react-icons/fi";
import SectionHeader from "@/components/dashboard/assets/SectionHeader";
import ToastTopRight from "@/components/ui/Toast";

type HomeSectionType =
  | "HERO"
  | "WHY_CHOOSE"
  | "CLIENTS"
  | "SERVICES_OVERVIEW"
  | "CORE_FEATURES"
  | "TESTIMONIALS"
  | "UNKNOWN";

type HomeSection = {
  id: string;
  section_key: string;
  section_type: HomeSectionType;
  title: string;
  subtitle: string;
  order_index: number;
  is_enabled: boolean;
  meta?: {
    badge?: string;
    alignment?: "left" | "center" | "right";
  };
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

function asNumber(v: any, fallback = 999) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function buildHomeSections(json: any): HomeSection[] {
  const sections: HomeSection[] = [];

  const meta = json?.meta || {};
  const status = String(meta?.status || "").toLowerCase();
  const defaultEnabled = status === "published" || status === "live" || status === "active" || !status;

  const hero = json?.hero;
  if (hero) {
    sections.push({
      id: "hero",
      section_key: "hero",
      section_type: "HERO",
      title: hero?.headline?.line2 ? `${hero?.headline?.line1 || "Hero"} ${hero?.headline?.line2}` : hero?.headline?.line1 || "Hero",
      subtitle: hero?.description || "—",
      order_index: asNumber(hero?.order, 1),
      is_enabled: defaultEnabled,
      meta: { badge: "HERO", alignment: "left" },
      raw: hero,
    });
  }

  const whychoose = json?.whychoose;
  if (whychoose) {
    sections.push({
      id: "whychoose",
      section_key: "whychoose",
      section_type: "WHY_CHOOSE",
      title: whychoose?.title || "Why Choose Us",
      subtitle: whychoose?.subtitle || "—",
      order_index: asNumber(whychoose?.order, 2),
      is_enabled: defaultEnabled,
      meta: { badge: whychoose?.pill || "WHY", alignment: "left" },
      raw: whychoose,
    });
  }

  const clients = json?.clients;
  if (clients) {
    sections.push({
      id: "clients",
      section_key: "clients",
      section_type: "CLIENTS",
      title: clients?.title || "Clients",
      subtitle: clients?.subtitle || "—",
      order_index: asNumber(clients?.order, 3),
      is_enabled: defaultEnabled,
      meta: { badge: clients?.pill || "CLIENTS", alignment: "center" },
      raw: clients,
    });
  }

  const servicesOverview = json?.servicesOverview;
  if (servicesOverview) {
    sections.push({
      id: "servicesOverview",
      section_key: "servicesOverview",
      section_type: "SERVICES_OVERVIEW",
      title: servicesOverview?.heading || "Service Overview",
      subtitle: servicesOverview?.subheading || "—",
      order_index: asNumber(servicesOverview?.order, 4),
      is_enabled: defaultEnabled,
      meta: { badge: "OVERVIEW", alignment: "left" },
      raw: servicesOverview,
    });
  }

  const coreFeatures = json?.coreFeatures;
  if (coreFeatures) {
    sections.push({
      id: "coreFeatures",
      section_key: "coreFeatures",
      section_type: "CORE_FEATURES",
      title: coreFeatures?.title || "Core Features",
      subtitle: coreFeatures?.subtitle || "—",
      order_index: asNumber(coreFeatures?.order, 5),
      is_enabled: defaultEnabled,
      meta: { badge: coreFeatures?.pill || "FEATURES", alignment: "left" },
      raw: coreFeatures,
    });
  }

  const testimonials = json?.testimonials;
  if (testimonials) {
    sections.push({
      id: "testimonials",
      section_key: "testimonials",
      section_type: "TESTIMONIALS",
      title: testimonials?.title || "Testimonials",
      subtitle: testimonials?.subtitle || "—",
      order_index: asNumber(testimonials?.order, 6),
      is_enabled: defaultEnabled,
      meta: { badge: testimonials?.pill || "TESTIMONIALS", alignment: "left" },
      raw: testimonials,
    });
  }

  const knownKeys = new Set(["meta", "hero", "whychoose", "clients", "servicesOverview", "coreFeatures", "testimonials"]);
  Object.keys(json || {}).forEach((k) => {
    if (knownKeys.has(k)) return;
    const v = json?.[k];
    if (!v || typeof v !== "object") return;
    const maybeOrder = asNumber(v?.order, 999);
    const title = v?.title || v?.heading || v?.name || k;
    const subtitle = v?.subtitle || v?.subheading || v?.description || "—";
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

          <div className="max-h-[75vh] overflow-auto px-5 py-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

type ToastTone = "success" | "error";
type ToastState = { open: boolean; tone: ToastTone; title: string; message?: string };

export default function HomePage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const endpoint = useMemo(() => joinApiUrl(API_BASE, "/api/v1/content/home"), [API_BASE]);

  const [sections, setSections] = useState<HomeSection[]>([]);
  const [rawHome, setRawHome] = useState<any>(null);

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

  const [rawEditor, setRawEditor] = useState("");
  const [rawEditorErr, setRawEditorErr] = useState<string | null>(null);

  const fixedKeys = new Set<string>(["hero"]);

  function persistToast(next: { tone: ToastTone; title: string; message?: string }) {
    try {
      sessionStorage.setItem("home_admin_toast", JSON.stringify(next));
    } catch {}
  }

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("home_admin_toast");
      if (!raw) return;
      sessionStorage.removeItem("home_admin_toast");
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
        if (!res.ok) throw new Error(`Failed to load home content (${res.status})`);

        const json = await res.json();
        const built = buildHomeSections(json);

        if (alive) {
          setRawHome(json);
          setSections(built);
        }
      } catch (e: any) {
        if (alive) setErr(e?.message || "Failed to load home content");
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

  useEffect(() => {
    if (!activeSection) return;
    setSaveErr(null);
    setRawEditorErr(null);

    const payload = rawHome?.[activeSection.section_key] ?? activeSection.raw ?? {};
    try {
      setRawEditor(JSON.stringify(payload, null, 2));
    } catch {
      setRawEditor(String(payload ?? ""));
    }
  }, [activeSection, rawHome]);

  async function saveActiveSection() {
    if (!rawHome || !activeSection) return;

    try {
      setSaving(true);
      setSaveErr(null);
      setRawEditorErr(null);

      let parsed: any;
      try {
        parsed = JSON.parse(rawEditor);
      } catch {
        throw new Error("Invalid JSON. Please fix the JSON structure before saving.");
      }

      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        throw new Error("Root JSON must be an object (not array / null).");
      }

      const updated = structuredClone(rawHome);
      updated[activeSection.section_key] = parsed;

      const saveUrl = joinApiUrl(API_BASE, "/api/v1/content/home");
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
      setToast({
        open: true,
        tone: "error",
        title: "Save failed",
        message: msg,
      });
      if (String(msg).toLowerCase().includes("json")) setRawEditorErr(msg);
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
        title="Home Page Management"
        subtitle="Home page sections loaded from CMS content."
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
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 font-semibold">Route: /api/v1/content/home</span>
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
        subtitle={activeSection ? `Full JSON editor (everything in JSON will be editable).` : ""}
        onClose={() => (saving ? null : setActiveKey(null))}
      >
        {activeSection ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="flex flex-wrap items-center gap-2">
                <Pill tone="blue">
                  <FiTag />
                  {activeSection.section_type}
                </Pill>
                {fixedKeys.has(activeSection.section_key) ? (
                  <Pill tone="amber">
                    <FiLock />
                    Fixed key
                  </Pill>
                ) : null}
                <Pill>
                  <FiCode />
                  Raw JSON
                </Pill>
              </div>
              <div className="text-xs font-semibold text-slate-500">Key: {activeSection.section_key}</div>
            </div>

            {rawEditorErr ? (
              <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                {rawEditorErr}
              </div>
            ) : null}

            <textarea
              value={rawEditor}
              onChange={(e) => {
                setRawEditor(e.target.value);
                setRawEditorErr(null);
              }}
              spellCheck={false}
              className={cx(
                "w-full rounded-md border border-slate-200 bg-white px-3 py-2 font-mono text-xs text-slate-900 outline-none",
                "focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
              )}
              rows={22}
            />

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
                disabled={saving || !activeSection || !rawHome}
                className={cx(
                  "inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white",
                  saving || !activeSection || !rawHome ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:bg-slate-800"
                )}
              >
                {saving ? "Saving…" : "Save changes"}
              </button>
            </div>
          </div>
        ) : null}
      </EditModal>
    </div>
  );
}
