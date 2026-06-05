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

type JsonObject = Record<string, unknown>;
type StringList = string[];

type ContactContent = {
  meta?: JsonObject;
  company?: JsonObject;
  hero?: JsonObject;
  cards?: JsonObject;
  location?: JsonObject;
  form?: JsonObject;
  toast?: JsonObject;
} & JsonObject;

type ContactSectionType =
  | "META"
  | "COMPANY"
  | "HERO"
  | "CARDS"
  | "LOCATION"
  | "FORM"
  | "TOAST"
  | "UNKNOWN";

type ContactSection = {
  id: string;
  section_key: string;
  section_type: ContactSectionType;
  title: string;
  subtitle: string;
  order_index: number;
  is_enabled: boolean;
  meta?: { badge?: string; alignment?: "left" | "center" | "right" };
  raw: Record<string, unknown>;
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

function asNumber(v: unknown, fallback = 999) {
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

function buildContactSections(json: Record<string, unknown>): ContactSection[] {
  const sections: ContactSection[] = [];

  const meta = (json?.meta || {}) as Record<string, unknown>;
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
      raw: json.meta as Record<string, unknown>,
    });
  }

  if (json?.company) {
    const c = json.company as Record<string, unknown>;
    sections.push({
      id: "company",
      section_key: "company",
      section_type: "COMPANY",
      title: toStr(c?.name || "Company"),
      subtitle: `Emails: ${Array.isArray(c?.emails) ? c.emails.length : 0} • Phones: ${Array.isArray(c?.phones) ? c.phones.length : 0
        }`,
      order_index: 2,
      is_enabled: defaultEnabled,
      meta: { badge: "COMPANY", alignment: "left" },
      raw: c,
    });
  }

  if (json?.hero) {
    const h = json.hero as Record<string, unknown>;
    const title =
      Array.isArray(h?.title_lines) && h.title_lines.length
        ? h.title_lines.map((x) => toStr(x)).filter(Boolean).join(" / ")
        : toStr(h?.badge || "Hero");
    const subtitle = `${toStr(h?.subtitle_prefix)} ${toStr(h?.subtitle_suffix)}`.trim() || "—";
    sections.push({
      id: "hero",
      section_key: "hero",
      section_type: "HERO",
      title,
      subtitle,
      order_index: 3,
      is_enabled: defaultEnabled,
      meta: { badge: "HERO", alignment: "left" },
      raw: h,
    });
  }

  if (json?.cards) {
    const cards = (json.cards || {}) as Record<string, unknown>;
    const keys = Object.keys(cards || {});
    sections.push({
      id: "cards",
      section_key: "cards",
      section_type: "CARDS",
      title: `Cards (${keys.length})`,
      subtitle: keys.join(", ") || "—",
      order_index: 4,
      is_enabled: defaultEnabled,
      meta: { badge: "CARDS", alignment: "left" },
      raw: cards,
    });
  }

  if (json?.location) {
    const l = json.location as Record<string, unknown>;
    sections.push({
      id: "location",
      section_key: "location",
      section_type: "LOCATION",
      title: toStr(l?.title || "Location"),
      subtitle: toStr(l?.subtitle || "—"),
      order_index: 5,
      is_enabled: defaultEnabled,
      meta: { badge: "LOCATION", alignment: "left" },
      raw: l,
    });
  }

  if (json?.form) {
    const f = json.form as Record<string, unknown>;
    sections.push({
      id: "form",
      section_key: "form",
      section_type: "FORM",
      title: toStr(f?.title || "Form"),
      subtitle: toStr(f?.subtitle || "—"),
      order_index: 6,
      is_enabled: defaultEnabled,
      meta: { badge: "FORM", alignment: "left" },
      raw: f,
    });
  }

  if (json?.toast) {
    sections.push({
      id: "toast",
      section_key: "toast",
      section_type: "TOAST",
      title: "Toast messages",
      subtitle: "Validation + success + error copy",
      order_index: 7,
      is_enabled: defaultEnabled,
      meta: { badge: "TOAST", alignment: "left" },
      raw: json.toast as Record<string, unknown>,
    });
  }

  const knownKeys = new Set(["meta", "company", "hero", "cards", "location", "form", "toast"]);
  Object.keys(json || {}).forEach((k) => {
    if (knownKeys.has(k)) return;
    const v = json?.[k] as Record<string, unknown>;
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
    <div className="fixed inset-0 z-80">
      <div
        className="absolute inset-0 cursor-pointer bg-slate-950/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-3xl overflow-hidden rounded-md bg-white shadow-xl ring-1 ring-slate-200">
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

          <div className="max-h-[70vh] overflow-auto px-5 py-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

type ToastTone = "success" | "error";
type ToastState = { open: boolean; tone: ToastTone; title: string; message?: string };

export default function ContactAdminPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const endpoint = useMemo(() => joinApiUrl(API_BASE, "/api/v1/content/contact"), [API_BASE]);

  const [sections, setSections] = useState<ContactSection[]>([]);
  const [rawContact, setRawContact] = useState<Record<string, unknown> | null>(null);

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
      sessionStorage.setItem("contact_admin_toast", JSON.stringify(next));
    } catch { }
  }

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("contact_admin_toast");
      if (!raw) return;
      sessionStorage.removeItem("contact_admin_toast");
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
        if (!res.ok) throw new Error(`Failed to load contact content (${res.status})`);

        const json = await res.json();
        const built = buildContactSections(json);

        if (alive) {
          setRawContact(json);
          setSections(built);
        }
      } catch (e: unknown) {
        if (alive) setErr(e instanceof Error ? e.message : "Failed to load contact content");
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

  const [companyForm, setCompanyForm] = useState({
    name: "",
    emailsText: "",
    phonesText: "",
    whatsapp: "",
  });

  const [heroForm, setHeroForm] = useState({
    badge: "",
    titleLinesText: "",
    subtitlePrefix: "",
    subtitleSuffix: "",
  });

  const [cardsForm, setCardsForm] = useState({
    textUsTitle: "",
    textUsDesc: "",
    textUsButton: "",
    textUsWhatsappText: "",
    callUsTitle: "",
    callUsDesc: "",
    emailUsTitle: "",
    emailUsDesc: "",
  });

  const [locationForm, setLocationForm] = useState({
    badge: "",
    title: "",
    subtitle: "",
    mapQuery: "",
    mapEmbedUrl: "",
    mapsUrl: "",
    mapsButton: "",
  });

  const [formForm, setFormForm] = useState({
    badge: "",
    title: "",
    subtitle: "",
    phFirstName: "",
    phLastName: "",
    phEmail: "",
    phPhone: "",
    phMessage: "",
    phServiceDefault: "",
    servicesText: "",
    btnIdle: "",
    btnLoading: "",
    hintPrefix: "",
    hintText: "",
    hintMiddle: "",
    hintCall: "",
    hintSuffix: "",
  });

  const [toastForm, setToastForm] = useState({
    requiredError: "",
    success: "",
    networkError: "",
    submitFailed: "",
  });

  useEffect(() => {
    if (!activeSection) return;

    setSaveErr(null);

    if (activeSection.section_key === "meta") {
      const m = asRecord(activeSection.raw);
      setMetaForm({ title: toStr(m.title) });
    }

    if (activeSection.section_key === "company") {
      const c = asRecord(activeSection.raw);
      setCompanyForm({
        name: toStr(c.name),
        emailsText: toLines(c.emails),
        phonesText: toLines(c.phones),
        whatsapp: toStr(c.whatsapp),
      });
    }

    if (activeSection.section_key === "hero") {
      const h = asRecord(activeSection.raw);
      setHeroForm({
        badge: toStr(h.badge),
        titleLinesText: toLines(h.title_lines),
        subtitlePrefix: toStr(h.subtitle_prefix),
        subtitleSuffix: toStr(h.subtitle_suffix),
      });
    }

    if (activeSection.section_key === "cards") {
      const cards = asRecord(activeSection.raw);
      const textUs = asRecord(cards.text_us);
      const callUs = asRecord(cards.call_us);
      const emailUs = asRecord(cards.email_us);
      setCardsForm({
        textUsTitle: toStr(textUs.title),
        textUsDesc: toStr(textUs.desc),
        textUsButton: toStr(textUs.button),
        textUsWhatsappText: toStr(textUs.whatsapp_text),
        callUsTitle: toStr(callUs.title),
        callUsDesc: toStr(callUs.desc),
        emailUsTitle: toStr(emailUs.title),
        emailUsDesc: toStr(emailUs.desc),
      });
    }

    if (activeSection.section_key === "location") {
      const l = asRecord(activeSection.raw);
      setLocationForm({
        badge: toStr(l.badge),
        title: toStr(l.title),
        subtitle: toStr(l.subtitle),
        mapQuery: toStr(l.map_query),
        mapEmbedUrl: toStr(l.map_embed_url),
        mapsUrl: toStr(l.maps_url),
        mapsButton: toStr(l.maps_button),
      });
    }

    if (activeSection.section_key === "form") {
      const f = asRecord(activeSection.raw);
      const p = asRecord(f.placeholders);
      const b = asRecord(f.button);
      setFormForm({
        badge: toStr(f.badge),
        title: toStr(f.title),
        subtitle: toStr(f.subtitle),
        phFirstName: toStr(p.first_name),
        phLastName: toStr(p.last_name),
        phEmail: toStr(p.email),
        phPhone: toStr(p.phone),
        phMessage: toStr(p.message),
        phServiceDefault: toStr(p.service_default),
        servicesText: toLines(f.services),
        btnIdle: toStr(b.idle),
        btnLoading: toStr(b.loading),
        hintPrefix: toStr(f.hint_prefix),
        hintText: toStr(f.hint_text),
        hintMiddle: toStr(f.hint_middle),
        hintCall: toStr(f.hint_call),
        hintSuffix: toStr(f.hint_suffix),
      });
    }

    if (activeSection.section_key === "toast") {
      const t = asRecord(activeSection.raw);
      setToastForm({
        requiredError: toStr(t.required_error),
        success: toStr(t.success),
        networkError: toStr(t.network_error),
        submitFailed: toStr(t.submit_failed),
      });
    }
  }, [activeSection]);

  async function saveActiveSection() {
    if (!rawContact || !activeSection) return;

    try {
      setSaving(true);
      setSaveErr(null);

      const updated = structuredClone(rawContact) as ContactContent;

      if (activeSection.section_key === "meta") {
        updated.meta = asRecord(updated.meta);
        updated.meta.title = metaForm.title;
      }

      if (activeSection.section_key === "company") {
        updated.company = asRecord(updated.company);
        updated.company.name = companyForm.name;
        updated.company.emails = fromLines(companyForm.emailsText);
        updated.company.phones = fromLines(companyForm.phonesText);
        updated.company.whatsapp = companyForm.whatsapp;
      }

      if (activeSection.section_key === "hero") {
        updated.hero = asRecord(updated.hero);
        updated.hero.badge = heroForm.badge;
        updated.hero.title_lines = fromLines(heroForm.titleLinesText);
        updated.hero.subtitle_prefix = heroForm.subtitlePrefix;
        updated.hero.subtitle_suffix = heroForm.subtitleSuffix;
      }

      if (activeSection.section_key === "cards") {
        updated.cards = asRecord(updated.cards);
        const textUs = asRecord(updated.cards.text_us);
        const callUs = asRecord(updated.cards.call_us);
        const emailUs = asRecord(updated.cards.email_us);

        textUs.title = cardsForm.textUsTitle;
        textUs.desc = cardsForm.textUsDesc;
        textUs.button = cardsForm.textUsButton;
        textUs.whatsapp_text = cardsForm.textUsWhatsappText;

        callUs.title = cardsForm.callUsTitle;
        callUs.desc = cardsForm.callUsDesc;

        emailUs.title = cardsForm.emailUsTitle;
        emailUs.desc = cardsForm.emailUsDesc;

        updated.cards.text_us = textUs;
        updated.cards.call_us = callUs;
        updated.cards.email_us = emailUs;
      }

      if (activeSection.section_key === "location") {
        updated.location = asRecord(updated.location);
        updated.location.badge = locationForm.badge;
        updated.location.title = locationForm.title;
        updated.location.subtitle = locationForm.subtitle;
        updated.location.map_query = locationForm.mapQuery;
        updated.location.map_embed_url = locationForm.mapEmbedUrl;
        updated.location.maps_url = locationForm.mapsUrl;
        updated.location.maps_button = locationForm.mapsButton;
      }

      if (activeSection.section_key === "form") {
        updated.form = asRecord(updated.form);
        updated.form.badge = formForm.badge;
        updated.form.title = formForm.title;
        updated.form.subtitle = formForm.subtitle;

        const placeholders = asRecord(updated.form.placeholders);
        placeholders.first_name = formForm.phFirstName;
        placeholders.last_name = formForm.phLastName;
        placeholders.email = formForm.phEmail;
        placeholders.phone = formForm.phPhone;
        placeholders.message = formForm.phMessage;
        placeholders.service_default = formForm.phServiceDefault;
        updated.form.placeholders = placeholders;

        updated.form.services = fromLines(formForm.servicesText);

        const button = asRecord(updated.form.button);
        button.idle = formForm.btnIdle;
        button.loading = formForm.btnLoading;
        updated.form.button = button;

        updated.form.hint_prefix = formForm.hintPrefix;
        updated.form.hint_text = formForm.hintText;
        updated.form.hint_middle = formForm.hintMiddle;
        updated.form.hint_call = formForm.hintCall;
        updated.form.hint_suffix = formForm.hintSuffix;
      }

      if (activeSection.section_key === "toast") {
        updated.toast = asRecord(updated.toast);
        updated.toast.required_error = toastForm.requiredError;
        updated.toast.success = toastForm.success;
        updated.toast.network_error = toastForm.networkError;
        updated.toast.submit_failed = toastForm.submitFailed;
      }

      const saveUrl = joinApiUrl(API_BASE, "/api/v1/content/contact");
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
        title="Contact Page Management"
        subtitle="Contact page content loaded from CMS JSON."
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
                      Route: /api/v1/content/contact
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
        subtitle={activeSection ? `Update fields and save to /api/v1/content/contact` : ""}
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

        {activeSection?.section_key === "company" ? (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Section Key" value="company" onChange={() => null} disabled />
              <TextField label="Type" value="COMPANY" onChange={() => null} disabled />
            </div>

            <TextField label="Company Name" value={companyForm.name} onChange={(v) => setCompanyForm((p) => ({ ...p, name: v }))} />

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextAreaField
                label="Emails (one per line)"
                value={companyForm.emailsText}
                onChange={(v) => setCompanyForm((p) => ({ ...p, emailsText: v }))}
                rows={5}
              />
              <TextAreaField
                label="Phones (one per line)"
                value={companyForm.phonesText}
                onChange={(v) => setCompanyForm((p) => ({ ...p, phonesText: v }))}
                rows={5}
              />
            </div>

            <TextField
              label="WhatsApp"
              value={companyForm.whatsapp}
              onChange={(v) => setCompanyForm((p) => ({ ...p, whatsapp: v }))}
              placeholder="+91 8557967834"
            />
          </div>
        ) : null}

        {activeSection?.section_key === "hero" ? (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Section Key" value="hero" onChange={() => null} disabled />
              <TextField label="Type" value="HERO" onChange={() => null} disabled />
            </div>

            <TextField label="Badge" value={heroForm.badge} onChange={(v) => setHeroForm((p) => ({ ...p, badge: v }))} />

            <TextAreaField
              label="Title Lines (one per line)"
              value={heroForm.titleLinesText}
              onChange={(v) => setHeroForm((p) => ({ ...p, titleLinesText: v }))}
              rows={4}
            />

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField
                label="Subtitle Prefix"
                value={heroForm.subtitlePrefix}
                onChange={(v) => setHeroForm((p) => ({ ...p, subtitlePrefix: v }))}
              />
              <TextField
                label="Subtitle Suffix"
                value={heroForm.subtitleSuffix}
                onChange={(v) => setHeroForm((p) => ({ ...p, subtitleSuffix: v }))}
              />
            </div>
          </div>
        ) : null}

        {activeSection?.section_key === "cards" ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Section Key" value="cards" onChange={() => null} disabled />
              <TextField label="Type" value="CARDS" onChange={() => null} disabled />
            </div>

            <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
              text_us
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField
                label="Title"
                value={cardsForm.textUsTitle}
                onChange={(v) => setCardsForm((p) => ({ ...p, textUsTitle: v }))}
              />
              <TextField
                label="Button"
                value={cardsForm.textUsButton}
                onChange={(v) => setCardsForm((p) => ({ ...p, textUsButton: v }))}
              />
            </div>
            <TextAreaField
              label="Description"
              value={cardsForm.textUsDesc}
              onChange={(v) => setCardsForm((p) => ({ ...p, textUsDesc: v }))}
              rows={4}
            />
            <TextAreaField
              label="WhatsApp Text"
              value={cardsForm.textUsWhatsappText}
              onChange={(v) => setCardsForm((p) => ({ ...p, textUsWhatsappText: v }))}
              rows={3}
            />

            <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
              call_us
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField
                label="Title"
                value={cardsForm.callUsTitle}
                onChange={(v) => setCardsForm((p) => ({ ...p, callUsTitle: v }))}
              />
              <TextAreaField
                label="Description"
                value={cardsForm.callUsDesc}
                onChange={(v) => setCardsForm((p) => ({ ...p, callUsDesc: v }))}
                rows={3}
              />
            </div>

            <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
              email_us
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField
                label="Title"
                value={cardsForm.emailUsTitle}
                onChange={(v) => setCardsForm((p) => ({ ...p, emailUsTitle: v }))}
              />
              <TextAreaField
                label="Description"
                value={cardsForm.emailUsDesc}
                onChange={(v) => setCardsForm((p) => ({ ...p, emailUsDesc: v }))}
                rows={3}
              />
            </div>
          </div>
        ) : null}

        {activeSection?.section_key === "location" ? (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Section Key" value="location" onChange={() => null} disabled />
              <TextField label="Type" value="LOCATION" onChange={() => null} disabled />
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField
                label="Badge"
                value={locationForm.badge}
                onChange={(v) => setLocationForm((p) => ({ ...p, badge: v }))}
              />
              <TextField
                label="Maps Button"
                value={locationForm.mapsButton}
                onChange={(v) => setLocationForm((p) => ({ ...p, mapsButton: v }))}
              />
            </div>

            <TextField
              label="Title"
              value={locationForm.title}
              onChange={(v) => setLocationForm((p) => ({ ...p, title: v }))}
            />
            <TextAreaField
              label="Subtitle"
              value={locationForm.subtitle}
              onChange={(v) => setLocationForm((p) => ({ ...p, subtitle: v }))}
              rows={3}
            />

            <TextField
              label="Map Query"
              value={locationForm.mapQuery}
              onChange={(v) => setLocationForm((p) => ({ ...p, mapQuery: v }))}
            />

            <TextAreaField
              label="Map Embed URL"
              value={locationForm.mapEmbedUrl}
              onChange={(v) => setLocationForm((p) => ({ ...p, mapEmbedUrl: v }))}
              rows={3}
            />

            <TextAreaField
              label="Maps URL"
              value={locationForm.mapsUrl}
              onChange={(v) => setLocationForm((p) => ({ ...p, mapsUrl: v }))}
              rows={3}
            />
          </div>
        ) : null}

        {activeSection?.section_key === "form" ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Section Key" value="form" onChange={() => null} disabled />
              <TextField label="Type" value="FORM" onChange={() => null} disabled />
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Badge" value={formForm.badge} onChange={(v) => setFormForm((p) => ({ ...p, badge: v }))} />
              <TextField label="Title" value={formForm.title} onChange={(v) => setFormForm((p) => ({ ...p, title: v }))} />
            </div>

            <TextAreaField
              label="Subtitle"
              value={formForm.subtitle}
              onChange={(v) => setFormForm((p) => ({ ...p, subtitle: v }))}
              rows={3}
            />

            <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
              Placeholders
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="First Name" value={formForm.phFirstName} onChange={(v) => setFormForm((p) => ({ ...p, phFirstName: v }))} />
              <TextField label="Last Name" value={formForm.phLastName} onChange={(v) => setFormForm((p) => ({ ...p, phLastName: v }))} />
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Email" value={formForm.phEmail} onChange={(v) => setFormForm((p) => ({ ...p, phEmail: v }))} />
              <TextField label="Phone" value={formForm.phPhone} onChange={(v) => setFormForm((p) => ({ ...p, phPhone: v }))} />
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField
                label="Service Default"
                value={formForm.phServiceDefault}
                onChange={(v) => setFormForm((p) => ({ ...p, phServiceDefault: v }))}
              />
              <TextField label="Message" value={formForm.phMessage} onChange={(v) => setFormForm((p) => ({ ...p, phMessage: v }))} />
            </div>

            <TextAreaField
              label="Services (one per line)"
              value={formForm.servicesText}
              onChange={(v) => setFormForm((p) => ({ ...p, servicesText: v }))}
              rows={6}
            />

            <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
              Button
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Idle" value={formForm.btnIdle} onChange={(v) => setFormForm((p) => ({ ...p, btnIdle: v }))} />
              <TextField label="Loading" value={formForm.btnLoading} onChange={(v) => setFormForm((p) => ({ ...p, btnLoading: v }))} />
            </div>

            <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
              Hint Line
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Hint Prefix" value={formForm.hintPrefix} onChange={(v) => setFormForm((p) => ({ ...p, hintPrefix: v }))} />
              <TextField label="Hint Text" value={formForm.hintText} onChange={(v) => setFormForm((p) => ({ ...p, hintText: v }))} />
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <TextField label="Hint Middle" value={formForm.hintMiddle} onChange={(v) => setFormForm((p) => ({ ...p, hintMiddle: v }))} />
              <TextField label="Hint Call" value={formForm.hintCall} onChange={(v) => setFormForm((p) => ({ ...p, hintCall: v }))} />
              <TextField label="Hint Suffix" value={formForm.hintSuffix} onChange={(v) => setFormForm((p) => ({ ...p, hintSuffix: v }))} />
            </div>
          </div>
        ) : null}

        {activeSection?.section_key === "toast" ? (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Section Key" value="toast" onChange={() => null} disabled />
              <TextField label="Type" value="TOAST" onChange={() => null} disabled />
            </div>

            <TextAreaField
              label="Required Error"
              value={toastForm.requiredError}
              onChange={(v) => setToastForm((p) => ({ ...p, requiredError: v }))}
              rows={3}
            />
            <TextAreaField
              label="Success"
              value={toastForm.success}
              onChange={(v) => setToastForm((p) => ({ ...p, success: v }))}
              rows={3}
            />
            <TextAreaField
              label="Network Error"
              value={toastForm.networkError}
              onChange={(v) => setToastForm((p) => ({ ...p, networkError: v }))}
              rows={3}
            />
            <TextAreaField
              label="Submit Failed"
              value={toastForm.submitFailed}
              onChange={(v) => setToastForm((p) => ({ ...p, submitFailed: v }))}
              rows={3}
            />
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
            disabled={saving || !activeSection || !rawContact}
            className={cx(
              "inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white",
              saving || !activeSection || !rawContact ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:bg-slate-800"
            )}
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </EditModal>
    </div>
  );
}
