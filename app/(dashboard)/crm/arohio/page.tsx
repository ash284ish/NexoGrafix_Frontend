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

type ArohioSectionType =
  | "HERO"
  | "FEATURE_TOOLS"
  | "PROOF_STATS"
  | "CONTACT_CTA"
  | "UNKNOWN";

type ArohioSection = {
  id: string;
  section_key: string;
  section_type: ArohioSectionType;
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

function buildArohioSections(json: Record<string, any>): ArohioSection[] {
  const sections: ArohioSection[] = [];
  const defaultEnabled = true;

  if (json?.hero) {
    const hero = json.hero as Record<string, any>;
    const chipsCount = Array.isArray(hero?.chips) ? hero.chips.length : 0;
    const badgesCount = Array.isArray(hero?.badges) ? hero.badges.length : 0;

    sections.push({
      id: "hero",
      section_key: "hero",
      section_type: "HERO",
      title: toStr(hero?.title || "Hero"),
      subtitle: `Eyebrow: ${toStr(hero?.eyebrow)} • Chips: ${chipsCount} • Badges: ${badgesCount}`,
      order_index: 1,
      is_enabled: defaultEnabled,
      meta: { badge: "HERO", alignment: "left" },
      raw: hero as Record<string, unknown>,
    });
  }

  if (json?.featureTools) {
    const ft = json.featureTools as Record<string, any>;
    const cardsCount = Array.isArray(ft?.cards)
      ? ft.cards.length
      : 0;

    sections.push({
      id: "featureTools",
      section_key: "featureTools",
      section_type: "FEATURE_TOOLS",
      title: toStr(ft?.heading || "Feature Tools"),
      subtitle: `Eyebrow: ${toStr(ft?.eyebrow)} • Cards: ${cardsCount}`,
      order_index: 2,
      is_enabled: defaultEnabled,
      meta: { badge: "FEATURE TOOLS", alignment: "left" },
      raw: ft as Record<string, unknown>,
    });
  }

  if (json?.proofStats) {
    const ps = json.proofStats as Record<string, any>;
    const statsCount = Array.isArray(ps?.stats) ? ps.stats.length : 0;
    sections.push({
      id: "proofStats",
      section_key: "proofStats",
      section_type: "PROOF_STATS",
      title: toStr(ps?.heading || "Proof Stats"),
      subtitle: `Eyebrow: ${toStr(ps?.eyebrow)} • Stats: ${statsCount} • Columns: ${toStr(
        ps?.columns
      )}`,
      order_index: 3,
      is_enabled: defaultEnabled,
      meta: { badge: "PROOF STATS", alignment: "left" },
      raw: ps as Record<string, unknown>,
    });
  }

  if (json?.contactCta) {
    const cc = json.contactCta as Record<string, any>;
    const bulletsCount = Array.isArray(cc?.bullets)
      ? cc.bullets.length
      : 0;

    sections.push({
      id: "contactCta",
      section_key: "contactCta",
      section_type: "CONTACT_CTA",
      title: toStr(cc?.heading || "Contact CTA"),
      subtitle: `Eyebrow: ${toStr(cc?.eyebrow)} • Bullets: ${bulletsCount}`,
      order_index: 4,
      is_enabled: defaultEnabled,
      meta: { badge: "CONTACT CTA", alignment: "left" },
      raw: cc as Record<string, unknown>,
    });
  }

  const knownTop = new Set(["hero", "featureTools", "proofStats", "contactCta"]);
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
type ToastState = { open: boolean; tone: ToastTone; title: string; message?: string };

export default function Arohio() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  // CHANGE ONLY IF YOUR BACKEND ROUTE IS DIFFERENT
  const endpoint = useMemo(
    () => joinApiUrl(API_BASE, "/api/v1/content/arohio/main-feature"),
    [API_BASE]
  );

  const [sections, setSections] = useState<ArohioSection[]>([]);
  const [rawDoc, setRawDoc] = useState<Record<string, any> | null>(null);

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
      sessionStorage.setItem("arohio_admin_toast", JSON.stringify(next));
    } catch { 
      // ignore
    }
  }

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("arohio_admin_toast");
      if (!raw) return;
      sessionStorage.removeItem("arohio_admin_toast");
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
        if (!res.ok) throw new Error(`Failed to load Arohio content (${res.status})`);

        const json = (await res.json()) as Record<string, any>;
        const built = buildArohioSections(json);

        if (alive) {
          setRawDoc(json);
          setSections(built);
        }
      } catch (e) {
        if (alive) setErr(e instanceof Error ? e.message : "Failed to load Arohio content");
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
  const [heroForm, setHeroForm] = useState({
    eyebrow: "",
    title: "",
    subtitle: "",
    heroImage_src: "",
    heroImage_alt: "",
    chipsText: "[]",
    badgesText: "[]",
    inr_label: "",
    inr_value: "",
    usd_label: "",
    usd_value: "",
    primary_href: "",
    primary_label: "",
    secondary_href: "",
    secondary_label: "",
  });

  const [featureToolsForm, setFeatureToolsForm] = useState({
    eyebrow: "",
    heading: "",
    subheading: "",
    cardsText: "[]",
  });

  const [proofStatsForm, setProofStatsForm] = useState({
    eyebrow: "",
    heading: "",
    subheading: "",
    columns: "3",
    statsText: "[]",
  });

  const [contactCtaForm, setContactCtaForm] = useState({
    eyebrow: "",
    heading: "",
    subheading: "",
    primary_href: "",
    primary_label: "",
    bulletsText: "",
    noteText: "",
  });

  useEffect(() => {
    if (!activeSection) return;
    setSaveErr(null);

    if (activeSection.section_key === "hero") {
      const h = (activeSection.raw || {}) as Record<string, any>;
      setHeroForm({
        eyebrow: toStr(h?.eyebrow),
        title: toStr(h?.title),
        subtitle: toStr(h?.subtitle),
        heroImage_src: toStr(h?.heroImage?.src),
        heroImage_alt: toStr(h?.heroImage?.alt),
        chipsText: stringifyPretty(h?.chips || []),
        badgesText: stringifyPretty(h?.badges || []),
        inr_label: toStr(h?.pricing?.inr?.label),
        inr_value: toStr(h?.pricing?.inr?.value),
        usd_label: toStr(h?.pricing?.usd?.label),
        usd_value: toStr(h?.pricing?.usd?.value),
        primary_href: toStr(h?.primaryCta?.href),
        primary_label: toStr(h?.primaryCta?.label),
        secondary_href: toStr(h?.secondaryCta?.href),
        secondary_label: toStr(h?.secondaryCta?.label),
      });
    }

    if (activeSection.section_key === "featureTools") {
      const ft = (activeSection.raw || {}) as Record<string, any>;
      setFeatureToolsForm({
        eyebrow: toStr(ft?.eyebrow),
        heading: toStr(ft?.heading),
        subheading: toStr(ft?.subheading),
        cardsText: stringifyPretty(ft?.cards || []),
      });
    }

    if (activeSection.section_key === "proofStats") {
      const ps = (activeSection.raw || {}) as Record<string, any>;
      setProofStatsForm({
        eyebrow: toStr(ps?.eyebrow),
        heading: toStr(ps?.heading),
        subheading: toStr(ps?.subheading),
        columns: toStr(ps?.columns ?? 3),
        statsText: stringifyPretty(ps?.stats || []),
      });
    }

    if (activeSection.section_key === "contactCta") {
      const c = (activeSection.raw || {}) as Record<string, any>;
      setContactCtaForm({
        eyebrow: toStr(c?.eyebrow),
        heading: toStr(c?.heading),
        subheading: toStr(c?.subheading),
        primary_href: toStr(c?.primaryCta?.href),
        primary_label: toStr(c?.primaryCta?.label),
        bulletsText: toLines(c?.bullets),
        noteText: toStr(c?.noteText),
      });
    }
  }, [activeSection]);

  function validateArrayJson(text: string, label: string) {
    const parsed = parseJsonSafe(text);
    if (!Array.isArray(parsed)) throw new Error(`${label} must be a JSON array`);
    return parsed;
  }

  async function saveActiveSection() {
    if (!rawDoc || !activeSection) return;

    try {
      setSaving(true);
      setSaveErr(null);

      const updated = safeClone(rawDoc);

      if (activeSection.section_key === "hero") {
        updated.hero = updated.hero || {};
        updated.hero.eyebrow = heroForm.eyebrow;
        updated.hero.title = heroForm.title;
        updated.hero.subtitle = heroForm.subtitle;

        updated.hero.heroImage = updated.hero.heroImage || {};
        updated.hero.heroImage.src = heroForm.heroImage_src;
        updated.hero.heroImage.alt = heroForm.heroImage_alt;

        updated.hero.chips = validateArrayJson(heroForm.chipsText, "Hero chips");
        updated.hero.badges = validateArrayJson(heroForm.badgesText, "Hero badges");

        updated.hero.pricing = updated.hero.pricing || {};
        updated.hero.pricing.inr = updated.hero.pricing.inr || {};
        updated.hero.pricing.inr.label = heroForm.inr_label;
        updated.hero.pricing.inr.value = heroForm.inr_value;

        updated.hero.pricing.usd = updated.hero.pricing.usd || {};
        updated.hero.pricing.usd.label = heroForm.usd_label;
        updated.hero.pricing.usd.value = heroForm.usd_value;

        updated.hero.primaryCta = updated.hero.primaryCta || {};
        updated.hero.primaryCta.href = heroForm.primary_href;
        updated.hero.primaryCta.label = heroForm.primary_label;

        updated.hero.secondaryCta = updated.hero.secondaryCta || {};
        updated.hero.secondaryCta.href = heroForm.secondary_href;
        updated.hero.secondaryCta.label = heroForm.secondary_label;
      }

      if (activeSection.section_key === "featureTools") {
        updated.featureTools = updated.featureTools || {};
        updated.featureTools.eyebrow = featureToolsForm.eyebrow;
        updated.featureTools.heading = featureToolsForm.heading;
        updated.featureTools.subheading = featureToolsForm.subheading;

        const cards = validateArrayJson(featureToolsForm.cardsText, "FeatureTools cards");
        // light sanity check
        for (const c of cards) {
          if (!c || typeof c !== "object") throw new Error("Each featureTools.cards item must be an object");
          if (!toStr(c.id) || !toStr(c.title) || !toStr(c.desc)) {
            throw new Error("Each featureTools.cards item must have id, title, desc");
          }
        }
        updated.featureTools.cards = cards;
      }

      if (activeSection.section_key === "proofStats") {
        updated.proofStats = updated.proofStats || {};
        updated.proofStats.eyebrow = proofStatsForm.eyebrow;
        updated.proofStats.heading = proofStatsForm.heading;
        updated.proofStats.subheading = proofStatsForm.subheading;

        const colsNum = Number(proofStatsForm.columns);
        if (!Number.isFinite(colsNum) || colsNum <= 0) throw new Error("ProofStats columns must be a valid number");
        updated.proofStats.columns = colsNum;

        const stats = validateArrayJson(proofStatsForm.statsText, "ProofStats stats");
        for (const s of stats) {
          if (!s || typeof s !== "object") throw new Error("Each proofStats.stats item must be an object");
          if (!toStr(s.id) || !toStr(s.icon) || !toStr(s.label)) {
            throw new Error("Each proofStats.stats item must have id, icon, label");
          }
        }
        updated.proofStats.stats = stats;
      }

      if (activeSection.section_key === "contactCta") {
        updated.contactCta = updated.contactCta || {};
        updated.contactCta.eyebrow = contactCtaForm.eyebrow;
        updated.contactCta.heading = contactCtaForm.heading;
        updated.contactCta.subheading = contactCtaForm.subheading;

        updated.contactCta.primaryCta = updated.contactCta.primaryCta || {};
        updated.contactCta.primaryCta.href = contactCtaForm.primary_href;
        updated.contactCta.primaryCta.label = contactCtaForm.primary_label;

        updated.contactCta.bullets = fromLines(contactCtaForm.bulletsText);
        updated.contactCta.noteText = contactCtaForm.noteText;
      }

      const res = await fetch(endpoint, {
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
        title="Arohio Page Management"
        subtitle="Arohio page content loaded from CMS JSON."
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
                      Route: /api/v1/content/arohio
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
        subtitle={activeSection ? `Update fields and save to /api/v1/content/arohio` : ""}
        onClose={() => (saving ? null : setActiveKey(null))}
      >
        {activeSection?.section_key === "hero" ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Section Key" value="hero" onChange={() => null} disabled />
              <TextField label="Type" value="HERO" onChange={() => null} disabled />
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField
                label="Eyebrow"
                value={heroForm.eyebrow}
                onChange={(v) => setHeroForm((p) => ({ ...p, eyebrow: v }))}
              />
              <div />
            </div>

            <TextField
              label="Title"
              value={heroForm.title}
              onChange={(v) => setHeroForm((p) => ({ ...p, title: v }))}
            />
            <TextAreaField
              label="Subtitle"
              value={heroForm.subtitle}
              onChange={(v) => setHeroForm((p) => ({ ...p, subtitle: v }))}
              rows={4}
            />

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField
                label="Hero Image Src"
                value={heroForm.heroImage_src}
                onChange={(v) => setHeroForm((p) => ({ ...p, heroImage_src: v }))}
              />
              <TextField
                label="Hero Image Alt"
                value={heroForm.heroImage_alt}
                onChange={(v) => setHeroForm((p) => ({ ...p, heroImage_alt: v }))}
              />
            </div>

            <TextAreaField
              label='Chips (JSON array) — e.g. [{ "icon":"fileText", "text":"..." }]'
              value={heroForm.chipsText}
              onChange={(v) => setHeroForm((p) => ({ ...p, chipsText: v }))}
              rows={12}
            />

            <TextAreaField
              label='Badges (JSON array) — e.g. [{ "icon":"checkCircle", "text":"..." }]'
              value={heroForm.badgesText}
              onChange={(v) => setHeroForm((p) => ({ ...p, badgesText: v }))}
              rows={10}
            />

            <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="text-xs font-bold text-slate-700">Pricing</div>
              <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                <TextField
                  label="INR Label"
                  value={heroForm.inr_label}
                  onChange={(v) => setHeroForm((p) => ({ ...p, inr_label: v }))}
                />
                <TextField
                  label="INR Value"
                  value={heroForm.inr_value}
                  onChange={(v) => setHeroForm((p) => ({ ...p, inr_value: v }))}
                />
                <TextField
                  label="USD Label"
                  value={heroForm.usd_label}
                  onChange={(v) => setHeroForm((p) => ({ ...p, usd_label: v }))}
                />
                <TextField
                  label="USD Value"
                  value={heroForm.usd_value}
                  onChange={(v) => setHeroForm((p) => ({ ...p, usd_value: v }))}
                />
              </div>
            </div>

            <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="text-xs font-bold text-slate-700">CTAs</div>
              <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                <TextField
                  label="Primary CTA Label"
                  value={heroForm.primary_label}
                  onChange={(v) => setHeroForm((p) => ({ ...p, primary_label: v }))}
                />
                <TextField
                  label="Primary CTA Href"
                  value={heroForm.primary_href}
                  onChange={(v) => setHeroForm((p) => ({ ...p, primary_href: v }))}
                />

                <TextField
                  label="Secondary CTA Label"
                  value={heroForm.secondary_label}
                  onChange={(v) => setHeroForm((p) => ({ ...p, secondary_label: v }))}
                />
                <TextField
                  label="Secondary CTA Href"
                  value={heroForm.secondary_href}
                  onChange={(v) => setHeroForm((p) => ({ ...p, secondary_href: v }))}
                />
              </div>
            </div>
          </div>
        ) : null}

        {activeSection?.section_key === "featureTools" ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Section Key" value="featureTools" onChange={() => null} disabled />
              <TextField label="Type" value="FEATURE_TOOLS" onChange={() => null} disabled />
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField
                label="Eyebrow"
                value={featureToolsForm.eyebrow}
                onChange={(v) => setFeatureToolsForm((p) => ({ ...p, eyebrow: v }))}
              />
              <div />
            </div>

            <TextField
              label="Heading"
              value={featureToolsForm.heading}
              onChange={(v) => setFeatureToolsForm((p) => ({ ...p, heading: v }))}
            />
            <TextAreaField
              label="Subheading"
              value={featureToolsForm.subheading}
              onChange={(v) => setFeatureToolsForm((p) => ({ ...p, subheading: v }))}
              rows={4}
            />

            <TextAreaField
              label='Cards (JSON array) — each item: { "id","tier","title","desc","bullets":[...], "cta": { "href","label" } }'
              value={featureToolsForm.cardsText}
              onChange={(v) => setFeatureToolsForm((p) => ({ ...p, cardsText: v }))}
              rows={20}
            />
          </div>
        ) : null}

        {activeSection?.section_key === "proofStats" ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Section Key" value="proofStats" onChange={() => null} disabled />
              <TextField label="Type" value="PROOF_STATS" onChange={() => null} disabled />
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField
                label="Eyebrow"
                value={proofStatsForm.eyebrow}
                onChange={(v) => setProofStatsForm((p) => ({ ...p, eyebrow: v }))}
              />
              <TextField
                label="Columns"
                value={proofStatsForm.columns}
                onChange={(v) => setProofStatsForm((p) => ({ ...p, columns: v }))}
              />
            </div>

            <TextField
              label="Heading"
              value={proofStatsForm.heading}
              onChange={(v) => setProofStatsForm((p) => ({ ...p, heading: v }))}
            />
            <TextAreaField
              label="Subheading"
              value={proofStatsForm.subheading}
              onChange={(v) => setProofStatsForm((p) => ({ ...p, subheading: v }))}
              rows={4}
            />

            <TextAreaField
              label='Stats (JSON array) — each item: { "id","icon","value","suffix","label","hint","highlight?" }'
              value={proofStatsForm.statsText}
              onChange={(v) => setProofStatsForm((p) => ({ ...p, statsText: v }))}
              rows={18}
            />
          </div>
        ) : null}

        {activeSection?.section_key === "contactCta" ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Section Key" value="contactCta" onChange={() => null} disabled />
              <TextField label="Type" value="CONTACT_CTA" onChange={() => null} disabled />
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField
                label="Eyebrow"
                value={contactCtaForm.eyebrow}
                onChange={(v) => setContactCtaForm((p) => ({ ...p, eyebrow: v }))}
              />
              <div />
            </div>

            <TextField
              label="Heading"
              value={contactCtaForm.heading}
              onChange={(v) => setContactCtaForm((p) => ({ ...p, heading: v }))}
            />
            <TextAreaField
              label="Subheading"
              value={contactCtaForm.subheading}
              onChange={(v) => setContactCtaForm((p) => ({ ...p, subheading: v }))}
              rows={4}
            />

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField
                label="Primary CTA Label"
                value={contactCtaForm.primary_label}
                onChange={(v) => setContactCtaForm((p) => ({ ...p, primary_label: v }))}
              />
              <TextField
                label="Primary CTA Href"
                value={contactCtaForm.primary_href}
                onChange={(v) => setContactCtaForm((p) => ({ ...p, primary_href: v }))}
              />
            </div>

            <TextAreaField
              label="Bullets (one per line)"
              value={contactCtaForm.bulletsText}
              onChange={(v) => setContactCtaForm((p) => ({ ...p, bulletsText: v }))}
              rows={10}
            />

            <TextAreaField
              label="Note Text"
              value={contactCtaForm.noteText}
              onChange={(v) => setContactCtaForm((p) => ({ ...p, noteText: v }))}
              rows={3}
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
              saving || !activeSection || !rawDoc
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
