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

type FooterSectionType =
  | "FOOTER_BRAND"
  | "FOOTER_HIGHLIGHTS"
  | "FOOTER_CTA"
  | "FOOTER_NEWSLETTER"
  | "FOOTER_NAV"
  | "FOOTER_CONTACT"
  | "FOOTER_SOCIALS"
  | "FOOTER_CERTIFICATIONS"
  | "FOOTER_LEGAL"
  | "FOOTER_COPYRIGHT"
  | "UNKNOWN";

type FooterSection = {
  id: string;
  section_key: string;
  section_type: FooterSectionType;
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

function toStr(v: any) {
  if (v === null || v === undefined) return "";
  return String(v);
}

function safeClone<T>(v: T): T {
  return typeof structuredClone === "function"
    ? structuredClone(v)
    : JSON.parse(JSON.stringify(v));
}

function stringifyPretty(v: any) {
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

function buildFooterSections(json: any): FooterSection[] {
  const sections: FooterSection[] = [];
  const footer = json?.footer || {};
  const defaultEnabled = true;

  if (footer?.brand) {
    sections.push({
      id: "brand",
      section_key: "brand",
      section_type: "FOOTER_BRAND",
      title: toStr(footer?.brand?.name || "Brand"),
      subtitle: toStr(footer?.brand?.tagline || "—"),
      order_index: 1,
      is_enabled: defaultEnabled,
      meta: { badge: "BRAND", alignment: "left" },
      raw: footer.brand,
    });
  }

  if (Array.isArray(footer?.highlights)) {
    sections.push({
      id: "highlights",
      section_key: "highlights",
      section_type: "FOOTER_HIGHLIGHTS",
      title: `Highlights (${footer.highlights.length})`,
      subtitle: footer.highlights.slice(0, 3).map((x: any) => toStr(x?.key)).filter(Boolean).join(", "),
      order_index: 2,
      is_enabled: defaultEnabled,
      meta: { badge: "HIGHLIGHTS", alignment: "left" },
      raw: footer.highlights,
    });
  }

  if (Array.isArray(footer?.cta)) {
    sections.push({
      id: "cta",
      section_key: "cta",
      section_type: "FOOTER_CTA",
      title: `CTA (${footer.cta.length})`,
      subtitle: footer.cta.slice(0, 2).map((x: any) => toStr(x?.label)).filter(Boolean).join(" • "),
      order_index: 3,
      is_enabled: defaultEnabled,
      meta: { badge: "CTA", alignment: "left" },
      raw: footer.cta,
    });
  }

  if (footer?.newsletter) {
    sections.push({
      id: "newsletter",
      section_key: "newsletter",
      section_type: "FOOTER_NEWSLETTER",
      title: toStr(footer?.newsletter?.title || "Newsletter"),
      subtitle: `Method: ${toStr(footer?.newsletter?.method || "POST")}`,
      order_index: 4,
      is_enabled: defaultEnabled,
      meta: { badge: "NEWSLETTER", alignment: "left" },
      raw: footer.newsletter,
    });
  }

  if (footer?.nav) {
    const keys = Object.keys(footer.nav || {});
    sections.push({
      id: "nav",
      section_key: "nav",
      section_type: "FOOTER_NAV",
      title: `Nav (${keys.length})`,
      subtitle: keys.slice(0, 6).join(", ") + (keys.length > 6 ? "…" : ""),
      order_index: 5,
      is_enabled: defaultEnabled,
      meta: { badge: "NAV", alignment: "left" },
      raw: footer.nav,
    });
  }

  if (footer?.contact) {
    sections.push({
      id: "contact",
      section_key: "contact",
      section_type: "FOOTER_CONTACT",
      title: toStr(footer?.contact?.label || "Contact"),
      subtitle: toStr(footer?.contact?.email?.label || "—"),
      order_index: 6,
      is_enabled: defaultEnabled,
      meta: { badge: "CONTACT", alignment: "left" },
      raw: footer.contact,
    });
  }

  if (Array.isArray(footer?.socials)) {
    sections.push({
      id: "socials",
      section_key: "socials",
      section_type: "FOOTER_SOCIALS",
      title: `Socials (${footer.socials.length})`,
      subtitle: footer.socials.slice(0, 3).map((x: any) => toStr(x?.label)).filter(Boolean).join(", "),
      order_index: 7,
      is_enabled: defaultEnabled,
      meta: { badge: "SOCIALS", alignment: "left" },
      raw: footer.socials,
    });
  }
  if (footer?.certificates && Array.isArray(footer.certificates.items)) {
    sections.push({
      id: "certificates",
      section_key: "certificates",
      section_type: "FOOTER_CERTIFICATIONS",
      title: footer.certificates.label || "Certifications",
      subtitle: `${footer.certificates.items.length} items`,
      order_index: 7.5,
      is_enabled: defaultEnabled,
      meta: { badge: "CERTS", alignment: "center" },
      raw: footer.certificates,
    });
  }

  if (Array.isArray(footer?.legal)) {
    sections.push({
      id: "legal",
      section_key: "legal",
      section_type: "FOOTER_LEGAL",
      title: `Legal (${footer.legal.length})`,
      subtitle: footer.legal.slice(0, 3).map((x: any) => toStr(x?.label)).filter(Boolean).join(" • "),
      order_index: 8,
      is_enabled: defaultEnabled,
      meta: { badge: "LEGAL", alignment: "left" },
      raw: footer.legal,
    });
  }

  if (footer?.copyright) {
    sections.push({
      id: "copyright",
      section_key: "copyright",
      section_type: "FOOTER_COPYRIGHT",
      title: "Copyright",
      subtitle: toStr(footer?.copyright?.textTemplate || "—"),
      order_index: 9,
      is_enabled: defaultEnabled,
      meta: { badge: "COPYRIGHT", alignment: "left" },
      raw: footer.copyright,
    });
  }

  const known = new Set(["footer"]);
  Object.keys(json || {}).forEach((k) => {
    if (known.has(k)) return;
    const v = json?.[k];
    if (!v || typeof v !== "object") return;
    sections.push({
      id: k,
      section_key: k,
      section_type: "UNKNOWN",
      title: toStr(v?.title || v?.name || k),
      subtitle: toStr(v?.subtitle || v?.description || "—"),
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

export default function FooterAdminPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const endpoint = useMemo(
    () => joinApiUrl(API_BASE, "/api/v1/content/footer"),
    [API_BASE]
  );

  const [sections, setSections] = useState<FooterSection[]>([]);
  const [raw, setRaw] = useState<any>(null);

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
      sessionStorage.setItem("footer_admin_toast", JSON.stringify(next));
    } catch { }
  }

  useEffect(() => {
    try {
      const rawT = sessionStorage.getItem("footer_admin_toast");
      if (!rawT) return;
      sessionStorage.removeItem("footer_admin_toast");
      const parsed = JSON.parse(rawT) as { tone?: ToastTone; title?: string; message?: string };
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
        if (!res.ok) throw new Error(`Failed to load footer content (${res.status})`);

        const json = await res.json();
        const built = buildFooterSections(json);

        if (alive) {
          setRaw(json);
          setSections(built);
        }
      } catch (e: any) {
        if (alive) setErr(e?.message || "Failed to load footer content");
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

  const [brandForm, setBrandForm] = useState({
    name: "",
    tagline: "",
    description: "",
    badgeText: "",
  });

  const [highlightsForm, setHighlightsForm] = useState({ json: "[]" });
  const [ctaForm, setCtaForm] = useState({ json: "[]" });

  const [newsletterForm, setNewsletterForm] = useState({
    title: "",
    description: "",
    endpoint: "",
    method: "",
    payloadJson: "{}",
    privacyLabel: "",
    privacyHref: "",
  });

  const [navForm, setNavForm] = useState({ json: "{}" });

  const [contactForm, setContactForm] = useState({
    label: "",
    emailLabel: "",
    emailHref: "",
    phoneLabel: "",
    phoneHref: "",
    locationLabel: "",
  });

  const [socialsForm, setSocialsForm] = useState({ json: "[]" });
  const [legalForm, setLegalForm] = useState({ json: "[]" });
  const [copyrightForm, setCopyrightForm] = useState({ textTemplate: "" });
  const [certificatesForm, setCertificatesForm] = useState({ json: "{}" });

  useEffect(() => {
    if (!activeSection) return;
    setSaveErr(null);

    const footer = raw?.footer || {};

    if (activeSection.section_key === "brand") {
      const b = footer?.brand || activeSection.raw || {};
      setBrandForm({
        name: toStr(b?.name),
        tagline: toStr(b?.tagline),
        description: toStr(b?.description),
        badgeText: toStr(b?.badgeText),
      });
    }

    if (activeSection.section_key === "highlights") {
      setHighlightsForm({ json: stringifyPretty(activeSection.raw || []) });
    }

    if (activeSection.section_key === "cta") {
      setCtaForm({ json: stringifyPretty(activeSection.raw || []) });
    }

    if (activeSection.section_key === "newsletter") {
      const n = footer?.newsletter || activeSection.raw || {};
      setNewsletterForm({
        title: toStr(n?.title),
        description: toStr(n?.description),
        endpoint: toStr(n?.endpoint),
        method: toStr(n?.method || "POST"),
        payloadJson: stringifyPretty(n?.payload || {}),
        privacyLabel: toStr(n?.privacy?.label),
        privacyHref: toStr(n?.privacy?.href),
      });
    }

    if (activeSection.section_key === "nav") {
      setNavForm({ json: stringifyPretty(activeSection.raw || {}) });
    }

    if (activeSection.section_key === "contact") {
      const c = footer?.contact || activeSection.raw || {};
      setContactForm({
        label: toStr(c?.label),
        emailLabel: toStr(c?.email?.label),
        emailHref: toStr(c?.email?.href),
        phoneLabel: toStr(c?.phone?.label),
        phoneHref: toStr(c?.phone?.href),
        locationLabel: toStr(c?.location?.label),
      });
    }

    if (activeSection.section_key === "socials") {
      setSocialsForm({ json: stringifyPretty(activeSection.raw || []) });
    }
    if (activeSection.section_key === "certificates") {
      setCertificatesForm({
        json: stringifyPretty(activeSection.raw || {}),
      });
    }
    if (activeSection.section_key === "legal") {
      setLegalForm({ json: stringifyPretty(activeSection.raw || []) });
    }

    if (activeSection.section_key === "copyright") {
      const c = footer?.copyright || activeSection.raw || {};
      setCopyrightForm({ textTemplate: toStr(c?.textTemplate) });
    }
  }, [activeSection, raw]);

  async function saveActiveSection() {
    if (!raw || !activeSection) return;

    try {
      setSaving(true);
      setSaveErr(null);

      const updated = safeClone(raw);
      updated.footer = updated.footer || {};

      if (activeSection.section_key === "brand") {
        updated.footer.brand = updated.footer.brand || {};
        updated.footer.brand.name = brandForm.name;
        updated.footer.brand.tagline = brandForm.tagline;
        updated.footer.brand.description = brandForm.description;
        updated.footer.brand.badgeText = brandForm.badgeText;
      }

      if (activeSection.section_key === "highlights") {
        const parsed = parseJsonSafe(highlightsForm.json);
        if (!Array.isArray(parsed)) throw new Error("Highlights must be a JSON array");
        updated.footer.highlights = parsed;
      }

      if (activeSection.section_key === "cta") {
        const parsed = parseJsonSafe(ctaForm.json);
        if (!Array.isArray(parsed)) throw new Error("CTA must be a JSON array");
        updated.footer.cta = parsed;
      }

      if (activeSection.section_key === "newsletter") {
        updated.footer.newsletter = updated.footer.newsletter || {};
        updated.footer.newsletter.title = newsletterForm.title;
        updated.footer.newsletter.description = newsletterForm.description;
        updated.footer.newsletter.endpoint = newsletterForm.endpoint;
        updated.footer.newsletter.method = newsletterForm.method || "POST";

        const payloadParsed = parseJsonSafe(newsletterForm.payloadJson);
        if (!payloadParsed || typeof payloadParsed !== "object")
          throw new Error("Newsletter payload must be a JSON object");
        updated.footer.newsletter.payload = payloadParsed;

        updated.footer.newsletter.privacy = updated.footer.newsletter.privacy || {};
        updated.footer.newsletter.privacy.label = newsletterForm.privacyLabel;
        updated.footer.newsletter.privacy.href = newsletterForm.privacyHref;
      }

      if (activeSection.section_key === "nav") {
        const parsed = parseJsonSafe(navForm.json);
        if (!parsed || typeof parsed !== "object") throw new Error("Nav must be a JSON object");
        updated.footer.nav = parsed;
      }

      if (activeSection.section_key === "contact") {
        updated.footer.contact = updated.footer.contact || {};
        updated.footer.contact.label = contactForm.label;

        updated.footer.contact.email = updated.footer.contact.email || {};
        updated.footer.contact.email.label = contactForm.emailLabel;
        updated.footer.contact.email.href = contactForm.emailHref;

        updated.footer.contact.phone = updated.footer.contact.phone || {};
        updated.footer.contact.phone.label = contactForm.phoneLabel;
        updated.footer.contact.phone.href = contactForm.phoneHref;

        updated.footer.contact.location = updated.footer.contact.location || {};
        updated.footer.contact.location.label = contactForm.locationLabel;
      }

      if (activeSection.section_key === "socials") {
        const parsed = parseJsonSafe(socialsForm.json);
        if (!Array.isArray(parsed)) throw new Error("Socials must be a JSON array");
        updated.footer.socials = parsed;
      }

      if (activeSection.section_key === "legal") {
        const parsed = parseJsonSafe(legalForm.json);
        if (!Array.isArray(parsed)) throw new Error("Legal must be a JSON array");
        updated.footer.legal = parsed;
      }
      if (activeSection.section_key === "certificates") {
        const parsed = parseJsonSafe(certificatesForm.json);
        if (!parsed || typeof parsed !== "object") {
          throw new Error("Certificates must be a JSON object");
        }
        updated.footer.certificates = parsed;
      }

      if (activeSection.section_key === "copyright") {
        updated.footer.copyright = updated.footer.copyright || {};
        updated.footer.copyright.textTemplate = copyrightForm.textTemplate;
      }

      const saveUrl = joinApiUrl(API_BASE, "/api/v1/content/footer");
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
        title="Footer Management"
        subtitle="Footer content loaded from CMS JSON."
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
                      Route: /api/v1/content/footer
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
        subtitle={activeSection ? `Update fields and save to /api/v1/content/footer` : ""}
        onClose={() => (saving ? null : setActiveKey(null))}
      >
        {activeSection?.section_key === "brand" ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Section Key" value="brand" onChange={() => null} disabled />
              <TextField label="Type" value="FOOTER_BRAND" onChange={() => null} disabled />
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Name" value={brandForm.name} onChange={(v) => setBrandForm((p) => ({ ...p, name: v }))} />
              <TextField label="Badge Text" value={brandForm.badgeText} onChange={(v) => setBrandForm((p) => ({ ...p, badgeText: v }))} />
            </div>
            <TextField label="Tagline" value={brandForm.tagline} onChange={(v) => setBrandForm((p) => ({ ...p, tagline: v }))} />
            <TextAreaField label="Description" value={brandForm.description} onChange={(v) => setBrandForm((p) => ({ ...p, description: v }))} rows={5} />
          </div>
        ) : null}

        {activeSection?.section_key === "highlights" ? (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Section Key" value="highlights" onChange={() => null} disabled />
              <TextField label="Type" value="FOOTER_HIGHLIGHTS" onChange={() => null} disabled />
            </div>
            <TextAreaField label="Highlights (JSON array)" value={highlightsForm.json} onChange={(v) => setHighlightsForm({ json: v })} rows={18} />
          </div>
        ) : null}

        {activeSection?.section_key === "cta" ? (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Section Key" value="cta" onChange={() => null} disabled />
              <TextField label="Type" value="FOOTER_CTA" onChange={() => null} disabled />
            </div>
            <TextAreaField label="CTA (JSON array)" value={ctaForm.json} onChange={(v) => setCtaForm({ json: v })} rows={14} />
          </div>
        ) : null}

        {activeSection?.section_key === "newsletter" ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Section Key" value="newsletter" onChange={() => null} disabled />
              <TextField label="Type" value="FOOTER_NEWSLETTER" onChange={() => null} disabled />
            </div>

            <TextField label="Title" value={newsletterForm.title} onChange={(v) => setNewsletterForm((p) => ({ ...p, title: v }))} />
            <TextAreaField label="Description" value={newsletterForm.description} onChange={(v) => setNewsletterForm((p) => ({ ...p, description: v }))} rows={4} />

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Endpoint" value={newsletterForm.endpoint} onChange={(v) => setNewsletterForm((p) => ({ ...p, endpoint: v }))} />
              <TextField label="Method" value={newsletterForm.method} onChange={(v) => setNewsletterForm((p) => ({ ...p, method: v }))} />
            </div>

            <TextAreaField label="Payload (JSON object)" value={newsletterForm.payloadJson} onChange={(v) => setNewsletterForm((p) => ({ ...p, payloadJson: v }))} rows={14} />

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Privacy Label" value={newsletterForm.privacyLabel} onChange={(v) => setNewsletterForm((p) => ({ ...p, privacyLabel: v }))} />
              <TextField label="Privacy Href" value={newsletterForm.privacyHref} onChange={(v) => setNewsletterForm((p) => ({ ...p, privacyHref: v }))} />
            </div>
          </div>
        ) : null}

        {activeSection?.section_key === "nav" ? (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Section Key" value="nav" onChange={() => null} disabled />
              <TextField label="Type" value="FOOTER_NAV" onChange={() => null} disabled />
            </div>
            <TextAreaField label="Nav (JSON object)" value={navForm.json} onChange={(v) => setNavForm({ json: v })} rows={26} />
          </div>
        ) : null}

        {activeSection?.section_key === "contact" ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Section Key" value="contact" onChange={() => null} disabled />
              <TextField label="Type" value="FOOTER_CONTACT" onChange={() => null} disabled />
            </div>

            <TextField label="Label" value={contactForm.label} onChange={(v) => setContactForm((p) => ({ ...p, label: v }))} />

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Email Label" value={contactForm.emailLabel} onChange={(v) => setContactForm((p) => ({ ...p, emailLabel: v }))} />
              <TextField label="Email Href" value={contactForm.emailHref} onChange={(v) => setContactForm((p) => ({ ...p, emailHref: v }))} />
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Phone Label" value={contactForm.phoneLabel} onChange={(v) => setContactForm((p) => ({ ...p, phoneLabel: v }))} />
              <TextField label="Phone Href" value={contactForm.phoneHref} onChange={(v) => setContactForm((p) => ({ ...p, phoneHref: v }))} />
            </div>

            <TextField label="Location" value={contactForm.locationLabel} onChange={(v) => setContactForm((p) => ({ ...p, locationLabel: v }))} />
          </div>
        ) : null}

        {activeSection?.section_key === "socials" ? (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Section Key" value="socials" onChange={() => null} disabled />
              <TextField label="Type" value="FOOTER_SOCIALS" onChange={() => null} disabled />
            </div>
            <TextAreaField label="Socials (JSON array)" value={socialsForm.json} onChange={(v) => setSocialsForm({ json: v })} rows={20} />
          </div>
        ) : null}

        {activeSection?.section_key === "legal" ? (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Section Key" value="legal" onChange={() => null} disabled />
              <TextField label="Type" value="FOOTER_LEGAL" onChange={() => null} disabled />
            </div>
            <TextAreaField label="Legal (JSON array)" value={legalForm.json} onChange={(v) => setLegalForm({ json: v })} rows={16} />
          </div>
        ) : null}
        {activeSection?.section_key === "certificates" ? (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField
                label="Section Key"
                value="certificates"
                onChange={() => null}
                disabled
              />
              <TextField
                label="Type"
                value="FOOTER_CERTIFICATIONS"
                onChange={() => null}
                disabled
              />
            </div>

            <TextAreaField
              label="Certificates (JSON object)"
              value={certificatesForm.json}
              onChange={(v) => setCertificatesForm({ json: v })}
              rows={18}
            />
          </div>
        ) : null}

        {activeSection?.section_key === "copyright" ? (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Section Key" value="copyright" onChange={() => null} disabled />
              <TextField label="Type" value="FOOTER_COPYRIGHT" onChange={() => null} disabled />
            </div>
            <TextAreaField label="Text Template" value={copyrightForm.textTemplate} onChange={(v) => setCopyrightForm({ textTemplate: v })} rows={4} />
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
            disabled={saving || !activeSection || !raw}
            className={cx(
              "inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white",
              saving || !activeSection || !raw
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
