"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { FiArrowUpRight, FiMail, FiPhone, FiMapPin, FiLinkedin, FiInstagram, FiFacebook } from "react-icons/fi";
import ToastTopRight from "@/components/ui/Toast";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

type FooterJson = {
  brand: { badgeText: string; headline: string; subheadline: string };
  highlights: Array<{ key: string; value: string }>;
  newsletter: { title: string; subtitle: string; endpoint: string; privacyHref: string; consentText: string };
  ctaButtons: Array<{ key: string; label: string; href: string }>;
  nav: {
    home: { label: string; items: Array<{ title: string; href: string }> };
    product: { label: string; items: Array<{ title: string; href: string }> };
    resources: { label: string; items: Array<{ title: string; href: string }> };
    solutions: { label: string; items: Array<{ title: string; href: string }> };
  };
  contact: { label: string; email: string; phone: string; location: string };
  socials: Array<{
    key: string;
    label: string;
    href: string;
    icon: "FiLinkedin" | "FiInstagram" | "FiFacebook" | "WaIcon";
    message?: string;
  }>;
  certifications: Array<{ key: string; src: string; alt: string; href?: string }>;
  legal: { copyrightText: string; links: Array<{ title: string; href: string }> };
};

// ---------------------------------------------------------------------------
// Inline SVG certification badges — no external image dependency
// ---------------------------------------------------------------------------
const CERT_BADGES: Record<string, React.ReactNode> = {
  "iso-9001": (
    <svg viewBox="0 0 120 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-12 w-auto md:h-12 lg:h-14">
      <rect width="120" height="56" rx="7" fill="#1a1a2e" />
      <rect x="1" y="1" width="118" height="54" rx="6.5" stroke="#ea580c" strokeOpacity="0.55" strokeWidth="1.2" />
      {/* shield icon */}
      <path d="M14 14 L20 11 L26 14 L26 22 Q20 26 20 26 Q20 26 14 22 Z" fill="none" stroke="#ea580c" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M17 18.5 L19.2 20.5 L23 16.5" stroke="#ea580c" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <text x="60" y="20" textAnchor="middle" fill="#ea580c" fontSize="8" fontWeight="800" fontFamily="system-ui,sans-serif" letterSpacing="2.5">ISO CERTIFIED</text>
      <text x="60" y="37" textAnchor="middle" fill="#ffffff" fontSize="15" fontWeight="900" fontFamily="system-ui,sans-serif" letterSpacing="0.5">9001:2015</text>
      <text x="60" y="49" textAnchor="middle" fill="#94a3b8" fontSize="6.5" fontFamily="system-ui,sans-serif" letterSpacing="2">QUALITY MANAGEMENT</text>
    </svg>
  ),
  "iso-27001": (
    <svg viewBox="0 0 120 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-12 w-auto md:h-12 lg:h-14">
      <rect width="120" height="56" rx="7" fill="#0f172a" />
      <rect x="1" y="1" width="118" height="54" rx="6.5" stroke="#3b82f6" strokeOpacity="0.55" strokeWidth="1.2" />
      {/* lock icon */}
      <rect x="15" y="18" width="10" height="8" rx="1.5" fill="none" stroke="#3b82f6" strokeWidth="1.2" />
      <path d="M17 18 L17 15.5 Q20 13 23 15.5 L23 18" fill="none" stroke="#3b82f6" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="20" cy="22" r="1.2" fill="#3b82f6" />
      <text x="62" y="20" textAnchor="middle" fill="#3b82f6" fontSize="8" fontWeight="800" fontFamily="system-ui,sans-serif" letterSpacing="2.5">ISO CERTIFIED</text>
      <text x="62" y="37" textAnchor="middle" fill="#ffffff" fontSize="15" fontWeight="900" fontFamily="system-ui,sans-serif" letterSpacing="0.5">27001:2022</text>
      <text x="62" y="49" textAnchor="middle" fill="#94a3b8" fontSize="6.5" fontFamily="system-ui,sans-serif" letterSpacing="2">INFORMATION SECURITY</text>
    </svg>
  ),
  "gdpr": (
    <svg viewBox="0 0 120 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-12 w-auto md:h-12 lg:h-14">
      <rect width="120" height="56" rx="7" fill="#003399" />
      <rect x="1" y="1" width="118" height="54" rx="6.5" stroke="#fbbf24" strokeOpacity="0.5" strokeWidth="1.2" />
      {/* EU circle of stars (12 stars) */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const cx = 20 + 9 * Math.cos(angle);
        const cy = 28 + 9 * Math.sin(angle);
        return <circle key={i} cx={cx} cy={cy} r="1.6" fill="#fbbf24" />;
      })}
      <text x="68" y="22" textAnchor="middle" fill="#fbbf24" fontSize="9" fontWeight="800" fontFamily="system-ui,sans-serif" letterSpacing="1.5">EU GDPR</text>
      <text x="68" y="36" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="900" fontFamily="system-ui,sans-serif" letterSpacing="1">COMPLIANT</text>
      <text x="68" y="49" textAnchor="middle" fill="#93c5fd" fontSize="6.5" fontFamily="system-ui,sans-serif" letterSpacing="2">DATA PROTECTION</text>
    </svg>
  ),
  "soc2": (
    <svg viewBox="0 0 120 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-12 w-auto md:h-12 lg:h-14">
      <rect width="120" height="56" rx="7" fill="#1c1917" />
      <rect x="1" y="1" width="118" height="54" rx="6.5" stroke="#10b981" strokeOpacity="0.55" strokeWidth="1.2" />
      {/* checkmark circle */}
      <circle cx="20" cy="28" r="9" fill="none" stroke="#10b981" strokeWidth="1.3" />
      <path d="M16 28 L19 31 L24 24" stroke="#10b981" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <text x="68" y="20" textAnchor="middle" fill="#10b981" fontSize="7.5" fontWeight="800" fontFamily="system-ui,sans-serif" letterSpacing="2">AICPA · SOC</text>
      <text x="68" y="36" textAnchor="middle" fill="#ffffff" fontSize="15" fontWeight="900" fontFamily="system-ui,sans-serif" letterSpacing="1">SOC 2</text>
      <text x="68" y="49" textAnchor="middle" fill="#94a3b8" fontSize="6.5" fontFamily="system-ui,sans-serif" letterSpacing="2">TYPE II · SECURITY</text>
    </svg>
  ),
};

// Mobile-size version (smaller SVGs)
const CERT_BADGES_SM: Record<string, React.ReactNode> = {
  "iso-9001": (
    <svg viewBox="0 0 120 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8 w-auto">
      <rect width="120" height="56" rx="7" fill="#1a1a2e" />
      <rect x="1" y="1" width="118" height="54" rx="6.5" stroke="#ea580c" strokeOpacity="0.55" strokeWidth="1.2" />
      <path d="M14 14 L20 11 L26 14 L26 22 Q20 26 20 26 Q20 26 14 22 Z" fill="none" stroke="#ea580c" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M17 18.5 L19.2 20.5 L23 16.5" stroke="#ea580c" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <text x="60" y="20" textAnchor="middle" fill="#ea580c" fontSize="8" fontWeight="800" fontFamily="system-ui,sans-serif" letterSpacing="2.5">ISO CERTIFIED</text>
      <text x="60" y="37" textAnchor="middle" fill="#ffffff" fontSize="15" fontWeight="900" fontFamily="system-ui,sans-serif" letterSpacing="0.5">9001:2015</text>
      <text x="60" y="49" textAnchor="middle" fill="#94a3b8" fontSize="6.5" fontFamily="system-ui,sans-serif" letterSpacing="2">QUALITY MANAGEMENT</text>
    </svg>
  ),
  "iso-27001": (
    <svg viewBox="0 0 120 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8 w-auto">
      <rect width="120" height="56" rx="7" fill="#0f172a" />
      <rect x="1" y="1" width="118" height="54" rx="6.5" stroke="#3b82f6" strokeOpacity="0.55" strokeWidth="1.2" />
      <rect x="15" y="18" width="10" height="8" rx="1.5" fill="none" stroke="#3b82f6" strokeWidth="1.2" />
      <path d="M17 18 L17 15.5 Q20 13 23 15.5 L23 18" fill="none" stroke="#3b82f6" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="20" cy="22" r="1.2" fill="#3b82f6" />
      <text x="62" y="20" textAnchor="middle" fill="#3b82f6" fontSize="8" fontWeight="800" fontFamily="system-ui,sans-serif" letterSpacing="2.5">ISO CERTIFIED</text>
      <text x="62" y="37" textAnchor="middle" fill="#ffffff" fontSize="15" fontWeight="900" fontFamily="system-ui,sans-serif" letterSpacing="0.5">27001:2022</text>
      <text x="62" y="49" textAnchor="middle" fill="#94a3b8" fontSize="6.5" fontFamily="system-ui,sans-serif" letterSpacing="2">INFORMATION SECURITY</text>
    </svg>
  ),
  "gdpr": (
    <svg viewBox="0 0 120 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8 w-auto">
      <rect width="120" height="56" rx="7" fill="#003399" />
      <rect x="1" y="1" width="118" height="54" rx="6.5" stroke="#fbbf24" strokeOpacity="0.5" strokeWidth="1.2" />
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const cx = 20 + 9 * Math.cos(angle);
        const cy = 28 + 9 * Math.sin(angle);
        return <circle key={i} cx={cx} cy={cy} r="1.6" fill="#fbbf24" />;
      })}
      <text x="68" y="22" textAnchor="middle" fill="#fbbf24" fontSize="9" fontWeight="800" fontFamily="system-ui,sans-serif" letterSpacing="1.5">EU GDPR</text>
      <text x="68" y="36" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="900" fontFamily="system-ui,sans-serif" letterSpacing="1">COMPLIANT</text>
      <text x="68" y="49" textAnchor="middle" fill="#93c5fd" fontSize="6.5" fontFamily="system-ui,sans-serif" letterSpacing="2">DATA PROTECTION</text>
    </svg>
  ),
  "soc2": (
    <svg viewBox="0 0 120 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8 w-auto">
      <rect width="120" height="56" rx="7" fill="#1c1917" />
      <rect x="1" y="1" width="118" height="54" rx="6.5" stroke="#10b981" strokeOpacity="0.55" strokeWidth="1.2" />
      <circle cx="20" cy="28" r="9" fill="none" stroke="#10b981" strokeWidth="1.3" />
      <path d="M16 28 L19 31 L24 24" stroke="#10b981" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <text x="68" y="20" textAnchor="middle" fill="#10b981" fontSize="7.5" fontWeight="800" fontFamily="system-ui,sans-serif" letterSpacing="2">AICPA · SOC</text>
      <text x="68" y="36" textAnchor="middle" fill="#ffffff" fontSize="15" fontWeight="900" fontFamily="system-ui,sans-serif" letterSpacing="1">SOC 2</text>
      <text x="68" y="49" textAnchor="middle" fill="#94a3b8" fontSize="6.5" fontFamily="system-ui,sans-serif" letterSpacing="2">TYPE II · SECURITY</text>
    </svg>
  ),
};

const FALLBACK: FooterJson = {
  brand: {
    badgeText: "NEXOGRAFIX",
    headline: "AI-enabled services for publishing, content, assessments & automation.",
    subheadline: "Enterprise delivery standards with clean architecture, clear milestones, and disciplined QA — built to scale.",
  },
  highlights: [
    { key: "Publishing", value: "Workflow platforms" },
    { key: "Assessments", value: "Delivery + governance" },
    { key: "Automation", value: "AI-led operations" },
  ],
  newsletter: {
    title: "Newsletter",
    subtitle: "Get product updates, delivery insights, and publishing workflow notes.",
    endpoint: "/api/v1/newsletter-subscribers",
    privacyHref: "/privacy",
    consentText: "I agree to the Privacy Policy",
  },
  ctaButtons: [
    { key: "book", label: "Book an appointment", href: "/contact" },
    { key: "explore", label: "Explore solutions", href: "/services" },
  ],
  nav: {
    home: {
      label: "HOME",
      items: [
        { title: "Home", href: "/" },
        { title: "About Us", href: "/about" },
        { title: "Contact Us", href: "/contact" },
      ],
    },
    product: { label: "PRODUCT", items: [{ title: "Arohio.ai", href: "/arohio" }] },
    resources: {
      label: "RESOURCES",
      items: [
        { title: "Case Studies", href: "/case-studies" },
        { title: "Feedback", href: "/feedback" },
        { title: "Blog", href: "/blog" },
        { title: "FAQs", href: "/faqs" },
      ],
    },
    solutions: {
      label: "SOLUTIONS",
      items: [
        { title: "Publishing & Digitization", href: "/publishing-digitization#overview" },
        { title: "Accessibility & Compliance", href: "/accessibility-compliance#overview" },
        { title: "IT & Digital Platforms", href: "/digital-platforms" },
        { title: "Data Labeling & Annotation", href: "/data-labeling#overview" },
        { title: "Localization & Media Accessibility", href: "/localization-media#overview" },
        { title: "Content, eLearning & EdTech", href: "/elearning-edtech#overview" },
      ],
    },
  },
  contact: { label: "CONTACT", email: "info@nexografix.com", phone: "+919661284439", location: "India" },
  socials: [
    { key: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/company/nexografix", icon: "FiLinkedin" },
    { key: "instagram", label: "Instagram", href: "https://www.instagram.com/nexografix/", icon: "FiInstagram" },
    { key: "facebook", label: "Facebook", href: "https://www.facebook.com/nexografix/", icon: "FiFacebook" },
    {
      key: "whatsapp",
      label: "WhatsApp",
      href: "https://wa.me/9661284439?text={{message}}",
      message: "Hello Nexografix team, I'd like to know more about your AI-enabled publishing and automation services.",
      icon: "WaIcon",
    },
  ],
  // src is intentionally empty — rendering uses CERT_BADGES inline SVGs keyed by `key`
  certifications: [
    { key: "iso-9001",  src: "", alt: "ISO 9001 Certified",  href: "https://www.iso.org/iso-9001-quality-management.html" },
    { key: "iso-27001", src: "", alt: "ISO 27001 Certified", href: "https://www.iso.org/isoiec-27001-information-security.html" },
    { key: "gdpr",      src: "", alt: "GDPR Compliant",      href: "https://gdpr-info.eu/" },
    { key: "soc2",      src: "", alt: "SOC 2 Type II",       href: "https://www.aicpa.org/topic/audit-assurance/audit-and-assurance-service-organization-controls" },
  ],
  legal: {
    copyrightText: "© {{year}} Nexografix. All rights reserved.",
    links: [
      { title: "Privacy Policy", href: "/privacy" },
      { title: "Terms of Service", href: "/terms" },
      { title: "Refund Policy", href: "/refund" },
    ],
  },
};

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const wrap: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.08 } } };
const fade: Variants = {
  hidden: { opacity: 0, y: 14, filter: "blur(10px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.95, ease: EASE } },
};

const navLink =
  "group relative flex w-full items-center gap-2 text-sm font-semibold text-slate-700 transition-all duration-300 ease-out hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/40";
const navUnderline =
  "pointer-events-none absolute -bottom-1 left-0 h-[2px] w-full origin-left scale-x-0 bg-gradient-to-r from-orange-600 to-orange-400 transition-transform duration-300 ease-out group-hover:scale-x-100";
const navDot =
  "shrink-0 h-1.5 w-1.5 rounded-full bg-orange-500/0 transition-all duration-300 ease-out group-hover:bg-orange-500/90 group-hover:shadow-[0_0_0_6px_rgba(249,115,22,0.14)]";

const asText = (v: any, fallback = ""): string => (typeof v === "string" ? v : fallback);

function normalizeFooter(input: any): FooterJson {
  const raw = input?.footer ? input.footer : input;

  const brand = raw?.brand ?? {};
  const newsletter = raw?.newsletter ?? {};
  const nav = raw?.nav ?? {};
  const contact = raw?.contact ?? {};
  const socials = Array.isArray(raw?.socials) ? raw.socials : [];
  const highlights = Array.isArray(raw?.highlights) ? raw.highlights : [];
  const cta = Array.isArray(raw?.ctaButtons) ? raw.ctaButtons : Array.isArray(raw?.cta) ? raw.cta : [];
  const certificationsRaw =
    Array.isArray(raw?.certifications)
      ? raw.certifications
      : Array.isArray(raw?.certificates?.items)
        ? raw.certificates.items
        : Array.isArray(raw?.certs)
          ? raw.certs
          : [];

  const legalObj = raw?.legal;
  const legalArr = Array.isArray(raw?.legal) ? raw.legal : null;
  const copyrightObj = raw?.copyright ?? {};

  const legalLinks =
    Array.isArray(legalObj?.links)
      ? legalObj.links
      : legalArr
        ? legalArr.map((x: any) => ({ title: asText(x?.label, ""), href: asText(x?.href, "#") }))
        : [];

  const copyrightText =
    asText(legalObj?.copyrightText, "") ||
    asText(copyrightObj?.textTemplate, "") ||
    FALLBACK.legal.copyrightText;

  const email =
    typeof contact?.email === "string"
      ? contact.email
      : asText(contact?.email?.label, FALLBACK.contact.email);

  const phone =
    typeof contact?.phone === "string"
      ? contact.phone
      : asText(contact?.phone?.href, "").replace("tel:", "") || asText(contact?.phone?.label, FALLBACK.contact.phone);

  const location =
    typeof contact?.location === "string"
      ? contact.location
      : asText(contact?.location?.label, FALLBACK.contact.location);

  const normalized: FooterJson = {
    brand: {
      badgeText: asText(brand?.badgeText, FALLBACK.brand.badgeText),
      headline: asText(brand?.headline, "") || asText(brand?.tagline, FALLBACK.brand.headline),
      subheadline: asText(brand?.subheadline, "") || asText(brand?.description, FALLBACK.brand.subheadline),
    },
    highlights: highlights
      .map((x: any) => ({ key: asText(x?.key, ""), value: asText(x?.value, "") }))
      .filter((x: any) => x.key && x.value),
    newsletter: {
      title: asText(newsletter?.title, FALLBACK.newsletter.title),
      subtitle: asText(newsletter?.subtitle, "") || asText(newsletter?.description, FALLBACK.newsletter.subtitle),
      endpoint: asText(newsletter?.endpoint, FALLBACK.newsletter.endpoint),
      privacyHref: asText(newsletter?.privacy?.href, "") || asText(newsletter?.privacyHref, FALLBACK.newsletter.privacyHref),
      consentText: asText(newsletter?.consentText, "") || `I agree to the ${asText(newsletter?.privacy?.label, "Privacy Policy")}`,
    },
    ctaButtons: cta
      .map((x: any, idx: number) => ({
        key: asText(x?.key, idx === 0 ? "book" : "explore"),
        label: asText(x?.label, ""),
        href: asText(x?.href, "#"),
      }))
      .filter((x: any) => x.label && x.href && x.href !== "#"),
    nav: {
      home: {
        label: asText(nav?.home?.label, FALLBACK.nav.home.label),
        items: (Array.isArray(nav?.home?.items) ? nav.home.items : FALLBACK.nav.home.items)
          .map((x: any) => ({ title: asText(x?.title, ""), href: asText(x?.href, "#") }))
          .filter((x: any) => x.title && x.href && x.href !== "#"),
      },
      product: {
        label: asText(nav?.product?.label, FALLBACK.nav.product.label),
        items: (Array.isArray(nav?.product?.items) ? nav.product.items : FALLBACK.nav.product.items)
          .map((x: any) => ({ title: asText(x?.title, ""), href: asText(x?.href, "#") }))
          .filter((x: any) => x.title && x.href && x.href !== "#"),
      },
      resources: {
        label: asText(nav?.resources?.label, FALLBACK.nav.resources.label),
        items: (Array.isArray(nav?.resources?.items) ? nav.resources.items : FALLBACK.nav.resources.items)
          .map((x: any) => ({ title: asText(x?.title, ""), href: asText(x?.href, "#") }))
          .filter((x: any) => x.title && x.href && x.href !== "#"),
      },
      solutions: {
        label: asText(nav?.solutions?.label, FALLBACK.nav.solutions.label),
        items: (Array.isArray(nav?.solutions?.items) ? nav.solutions.items : FALLBACK.nav.solutions.items)
          .map((x: any) => ({ title: asText(x?.title, ""), href: asText(x?.href, "#") }))
          .filter((x: any) => x.title && x.href && x.href !== "#"),
      },
    },
    contact: { label: asText(contact?.label, FALLBACK.contact.label), email, phone, location },
    socials: socials
      .map((s: any) => ({
        key: asText(s?.key, ""),
        label: asText(s?.label, ""),
        href: asText(s?.href, ""),
        icon: (s?.icon === "FiLinkedin" || s?.icon === "FiInstagram" || s?.icon === "FiFacebook" ? s.icon : "WaIcon") as any,
        message: asText(s?.message, ""),
      }))
      .filter((x: any) => x.key && x.label && x.href && x.href !== "#"),
    certifications: certificationsRaw
      .map((c: any, idx: number) => ({
        key: asText(c?.key, `cert_${idx}`),
        src: asText(c?.src, ""),
        alt: asText(c?.alt, asText(c?.label, "Certification")),
        href: asText(c?.href, ""),
      }))
      // allow entries with empty src — they will render via CERT_BADGES
      .filter((x: any) => x.key),
    legal: {
      copyrightText,
      links: legalLinks.filter((x: any) => x.title && x.href && x.href !== "#"),
    },
  };

  if (!normalized.ctaButtons.length) normalized.ctaButtons = FALLBACK.ctaButtons;
  if (!normalized.legal.links.length) normalized.legal.links = FALLBACK.legal.links;
  if (!normalized.certifications.length) normalized.certifications = FALLBACK.certifications;

  return normalized;
}

// ---------------------------------------------------------------------------
// CertImage — renders inline SVG badge if available, falls back to <img>
// ---------------------------------------------------------------------------
function CertImage({ c, size }: { c: FooterJson["certifications"][number]; size: "sm" | "lg" }) {
  const badges = size === "sm" ? CERT_BADGES_SM : CERT_BADGES;
  const badge = badges[c.key];

  if (badge) {
    return (
      <div className="opacity-95 transition-transform duration-300 ease-out hover:scale-[1.04]">
        {badge}
      </div>
    );
  }

  // Fallback to <img> when a custom src is provided from the API
  if (c.src) {
    return (
      <img
        src={c.src}
        alt={c.alt}
        loading="lazy"
        referrerPolicy="no-referrer"
        className={
          size === "lg"
            ? "h-12 md:h-12 lg:h-14 opacity-95 transition-transform duration-300 ease-out hover:scale-[1.04]"
            : "h-8 w-auto opacity-95 transition-transform duration-300 ease-out hover:scale-[1.04]"
        }
      />
    );
  }

  // Last-resort text badge
  return (
    <div
      className={`flex items-center justify-center rounded-md border border-slate-600/50 bg-slate-800 text-xs font-bold text-slate-400 ${
        size === "lg" ? "h-12 w-28" : "h-8 w-20"
      }`}
    >
      {c.alt}
    </div>
  );
}

export default function SiteFooter() {
  const [data, setData] = useState<FooterJson | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [agree, setAgree] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/v1/content/footer`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load footer");
        const json = await res.json();
        const normalized = normalizeFooter(json);
        if (alive) setData(normalized);
      } catch (e) {
        console.error(e);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const f = useMemo(() => {
    const base = data ?? FALLBACK;
    const homeItems = [...base.nav.home.items];
    if (!homeItems.some((it) => it.href === "/case-studies")) {
      homeItems.splice(1, 0, { title: "Case Studies", href: "/case-studies" });
    }
    const resItems = [...base.nav.resources.items];
    if (!resItems.some((it) => it.href === "/case-studies")) {
      resItems.unshift({ title: "Case Studies", href: "/case-studies" });
    }
    return {
      ...base,
      nav: {
        ...base.nav,
        home: { ...base.nav.home, items: homeItems },
        resources: { ...base.nav.resources, items: resItems },
      },
    };
  }, [data]);

  const Icon = useMemo(() => {
    const map: Record<string, React.ReactNode> = {
      FiLinkedin: <FiLinkedin />,
      FiInstagram: <FiInstagram />,
      FiFacebook: <FiFacebook />,
      WaIcon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M12.04 2a9.94 9.94 0 0 0-8.45 15.28L2 22l4.88-1.57A9.95 9.95 0 1 0 12.04 2zm5.78 14.43c-.24.68-1.4 1.3-1.92 1.35-.49.04-1.11.06-1.79-.12-.41-.11-.94-.31-1.63-.6-2.87-1.24-4.74-4.15-4.88-4.34-.13-.19-1.16-1.55-1.16-2.95 0-1.4.74-2.08 1-2.36.26-.28.57-.35.76-.35.19 0 .38 0 .55.01.18.01.42-.07.66.5.24.58.82 2.01.9 2.16.08.15.13.32.02.51-.11.19-.17.32-.33.49-.16.17-.34.38-.49.51-.16.13-.33.27-.14.53.19.26.86 1.42 1.85 2.3 1.27 1.13 2.34 1.48 2.68 1.65.34.17.54.14.74-.09.2-.24.85-.99 1.08-1.33.23-.34.46-.28.77-.17.31.11 1.97.93 2.31 1.1.34.17.57.26.65.41.08.15.08.86-.16 1.54z" />
        </svg>
      ),
    };
    return (key?: string) => (key && map[key] ? map[key] : null);
  }, []);

  const pushToast = (t: { type: "success" | "error"; msg: string }, ttl = 4000) => {
    setToast(t);
    window.setTimeout(() => setToast(null), ttl);
  };

  const newsletterUrl = `${API_BASE}/api/v1/newsletter-subscribers`;

  const year = new Date().getFullYear();
  const copyright = (f.legal?.copyrightText || FALLBACK.legal.copyrightText).replace("{{year}}", String(year));

  const whatsappHref = (s: FooterJson["socials"][number]) => {
    if (s.key !== "whatsapp") return s.href;
    const msg = encodeURIComponent(s.message || "");
    return s.href.includes("{{message}}") ? s.href.replace("{{message}}", msg) : s.href;
  };

  const primaryCta = f.ctaButtons.find((x) => x.key === "book") ?? f.ctaButtons[0];
  const secondaryCta = f.ctaButtons.find((x) => x.key === "explore") ?? f.ctaButtons[1] ?? f.ctaButtons[0];

  const k = (href: string, title: string, idx: number) => `${href}__${title}__${idx}`;

  return (
    <footer className="relative overflow-hidden bg-[radial-gradient(1200px_720px_at_12%_-10%,rgba(255,237,213,0.60),transparent_60%),radial-gradient(980px_560px_at_92%_18%,rgba(254,215,170,0.42),transparent_58%),linear-gradient(180deg,#FFFEFD_0%,#FFFDF8_55%,#FFFEFD_100%)]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-44 -left-60 h-140 w-140 rounded-full bg-orange-200/14 blur-3xl" />
        <div className="absolute top-35 -right-65 h-160 w-160 rounded-full bg-orange-300/10 blur-3xl" />
        <div className="absolute -bottom-70 left-[14%] h-140 w-140 rounded-full bg-orange-200/12 blur-3xl" />
        <div className="absolute bottom-40 right-[10%] h-80 w-[320px] rounded-full bg-orange-300/10 blur-3xl" />
        <motion.div animate={{ y: [0, -10, 0], x: [0, 7, 0] }} transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }} className="absolute left-[7%] top-[18%] h-16 w-16 rounded-full border border-orange-300/25" />
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} className="absolute right-[12%] top-[22%] h-9 w-24 rounded-full bg-orange-200/12" />
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 26, repeat: Infinity, ease: "linear" }} className="absolute left-[14%] top-[42%] h-12 w-12 rounded-full border border-orange-300/20" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-14 sm:py-16">

        {/* ------------------------------------------------------------------ */}
        {/* DESKTOP LAYOUT                                                       */}
        {/* ------------------------------------------------------------------ */}
        <div className="hidden md:block">
          <motion.div variants={wrap} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
            <motion.div variants={fade}>
              <Link
                href="/"
                className="inline-flex items-center gap-3 transition-transform duration-300 hover:scale-[1.02]"
              >
                <img
                  src="/images/nexografix_logo.png"
                  alt="Nexografix Logo"
                  className="h-12 w-auto"
                  referrerPolicy="no-referrer"
                />
                <span className="text-xl font-black tracking-tight text-slate-900">
                  {f.brand.badgeText}
                </span>
              </Link>

              <div className="mt-6 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">{f.brand.headline}</div>

              <p className="mt-3 max-w-xl text-sm font-semibold leading-relaxed text-slate-600">{f.brand.subheadline}</p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {f.highlights.map((x, idx) => (
                  <div
                    key={k(x.key, x.value, idx)}
                    className="rounded-md border border-orange-200/40 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(255,255,255,0.84))] p-4 shadow-[0_16px_50px_rgba(15,23,42,0.06)] backdrop-blur"
                  >
                    <div className="text-xs font-extrabold text-slate-900">{x.key}</div>
                    <div className="mt-1 text-xs font-semibold text-slate-600">{x.value}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={fade} className="rounded-md border border-orange-200/40 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(255,255,255,0.86))] p-6 shadow-[0_22px_80px_rgba(234,88,12,0.10)] backdrop-blur">
              <div className="text-sm font-extrabold text-slate-900">{f.newsletter.title}</div>
              <p className="mt-2 text-sm font-semibold text-slate-600">{f.newsletter.subtitle}</p>

              <form
                className="mt-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (submitting) return;

                  const fn = firstName.trim();
                  const ln = lastName.trim();
                  const em = email.trim();

                  if (!fn || !ln || !em || !agree) return;

                  setSubmitting(true);

                  try {
                    const res = await fetch(newsletterUrl, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ first_name: fn, last_name: ln, email: em, status: "active" }),
                    });

                    if (!res.ok) {
                      let msg = "Subscription failed. Please try again.";
                      try {
                        const data = await res.json();
                        msg = data?.detail || data?.message || msg;
                      } catch { }
                      pushToast({ type: "error", msg }, 4500);
                      setSubmitting(false);
                      return;
                    }

                    pushToast({ type: "success", msg: "Subscribed successfully." }, 3500);

                    setFirstName("");
                    setLastName("");
                    setEmail("");
                    setAgree(false);
                  } catch {
                    pushToast({ type: "error", msg: "Network error. Please try again." }, 4500);
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                <div className="grid gap-2 sm:grid-cols-2">
                  <input className="rounded-md border border-orange-200/55 bg-white/85 px-4 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-orange-400" placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                  <input className="rounded-md border border-orange-200/55 bg-white/85 px-4 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-orange-400" placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                </div>

                <div className="mt-2 flex items-stretch gap-2">
                  <input className="w-full rounded-md border border-orange-200/55 bg-white/85 px-4 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-orange-400" type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md bg-orange-600 px-4 py-3 text-sm font-extrabold text-white shadow-[0_14px_34px_rgba(234,88,12,0.22)] ring-1 ring-orange-600/30 transition hover:-translate-y-0.5 hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
                  >
                    {submitting ? "Saving..." : "Subscribe"} <FiArrowUpRight />
                  </button>
                </div>

                <label className="mt-3 flex items-start gap-3 rounded-md border border-orange-200/40 bg-white/70 px-4 py-3">
                  <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} required />
                  <span className="text-xs font-semibold text-slate-600">
                    {f.newsletter.consentText.replace("Privacy Policy", "")}
                    <Link className="font-extrabold text-orange-700" href={f.newsletter.privacyHref}>
                      Privacy Policy
                    </Link>
                  </span>
                </label>
              </form>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {primaryCta ? (
                  <Link href={primaryCta.href} className="inline-flex items-center justify-center rounded-md border border-orange-200/50 bg-white/80 px-4 py-3 text-sm font-extrabold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-white">
                    {primaryCta.label} <FiArrowUpRight className="ml-2" />
                  </Link>
                ) : null}

                {secondaryCta ? (
                  <Link href={secondaryCta.href} className="inline-flex items-center justify-center rounded-md bg-orange-600 px-4 py-3 text-sm font-extrabold text-white shadow-[0_14px_34px_rgba(234,88,12,0.22)] ring-1 ring-orange-600/30 transition hover:-translate-y-0.5 hover:bg-gray-600">
                    {secondaryCta.label} <FiArrowUpRight className="ml-2" />
                  </Link>
                ) : null}
              </div>
            </motion.div>
          </motion.div>

          {/* Nav grid */}
          <motion.div variants={wrap} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="mt-12 grid gap-10 rounded-md border border-orange-200/40 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(255,255,255,0.84))] p-7 shadow-[0_22px_80px_rgba(15,23,42,0.06)] backdrop-blur lg:grid-cols-4">
            <motion.div variants={fade}>
              <div className="text-xs font-extrabold tracking-[0.18em] text-slate-900">{f.nav.home.label}</div>
              <div className="mt-4 space-y-3">
                {f.nav.home.items.map((it, idx) => (
                  <Link key={k(it.href, it.title, idx)} href={it.href} className={navLink}>
                    <span className={navDot} />
                    <span className="relative">
                      {it.title} <span className={navUnderline} />
                    </span>
                  </Link>
                ))}
              </div>
            </motion.div>

            <motion.div variants={fade}>
              <div className="text-xs font-extrabold tracking-[0.18em] text-slate-900">{f.nav.product.label}</div>
              <div className="mt-4 space-y-3">
                {f.nav.product.items.map((it, idx) => (
                  <Link key={k(it.href, it.title, idx)} href={it.href} className={navLink}>
                    <span className={navDot} />
                    <span className="relative">
                      {it.title} <span className={navUnderline} />
                    </span>
                  </Link>
                ))}
              </div>

              <div className="mt-6 text-xs font-extrabold tracking-[0.18em] text-slate-900">{f.nav.resources.label}</div>
              <div className="mt-4 space-y-3">
                {f.nav.resources.items.map((it, idx) => (
                  <Link key={k(it.href, it.title, idx)} href={it.href} className={navLink}>
                    <span className={navDot} />
                    <span className="relative">
                      {it.title} <span className={navUnderline} />
                    </span>
                  </Link>
                ))}
              </div>
            </motion.div>

            <motion.div variants={fade}>
              <div className="text-xs font-extrabold tracking-[0.18em] text-slate-900">{f.nav.solutions.label}</div>
              <div className="mt-4 space-y-3">
                {f.nav.solutions.items.map((c, idx) => (
                  <Link key={k(c.href, c.title, idx)} href={c.href} className={navLink}>
                    <span className={navDot} />
                    <span className="relative">
                      {c.title}
                      <span className={navUnderline} />
                    </span>
                  </Link>
                ))}
              </div>
            </motion.div>

            <motion.div variants={fade}>
              <div className="text-xs font-extrabold tracking-[0.18em] text-slate-900">{f.contact.label}</div>

              <div className="mt-4 space-y-3">
                <a className="flex items-center gap-2 text-sm font-semibold text-slate-700 transition-colors duration-300 hover:text-slate-950" href={`mailto:${f.contact.email}`}>
                  <FiMail className="text-orange-700" /> {f.contact.email}
                </a>
                <a className="flex items-center gap-2 text-sm font-semibold text-slate-700 transition-colors duration-300 hover:text-slate-950" href={`tel:${f.contact.phone}`}>
                  <FiPhone className="text-orange-700" /> {f.contact.phone}
                </a>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <FiMapPin className="text-orange-700" /> {f.contact.location}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {f.socials.map((s, idx) => (
                  <a
                    key={k(s.href, s.key, idx)}
                    href={whatsappHref(s)}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-orange-200/50 bg-white/80 text-slate-700 shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-orange-300/70 hover:bg-white hover:text-slate-950 hover:shadow-[0_16px_44px_rgba(234,88,12,0.12)]"
                  >
                    {Icon(s.icon)}
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Certifications — desktop */}
          <motion.div variants={wrap} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="mt-8">
            <motion.div variants={fade} className="flex flex-wrap items-center justify-center gap-10 md:gap-14 lg:gap-20">
              {f.certifications.map((c, idx) =>
                c.href ? (
                  <a key={k(c.src || c.key, c.key, idx)} href={c.href} target="_blank" rel="noreferrer" aria-label={c.alt} className="inline-flex items-center justify-center">
                    <CertImage c={c} size="lg" />
                  </a>
                ) : (
                  <div key={k(c.src || c.key, c.key, idx)} className="inline-flex items-center justify-center">
                    <CertImage c={c} size="lg" />
                  </div>
                )
              )}
            </motion.div>
          </motion.div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* MOBILE LAYOUT                                                        */}
        {/* ------------------------------------------------------------------ */}
        <div className="md:hidden">
          <motion.div variants={wrap} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} className="rounded-md border border-orange-200/40 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(255,255,255,0.84))] p-6 shadow-[0_22px_80px_rgba(15,23,42,0.06)] backdrop-blur">
            <motion.div variants={fade}>
              <Link
                href="/"
                className="inline-flex items-center gap-3"
              >
                <img
                  src="/images/nexografix_logo.png"
                  alt="Nexografix Logo"
                  className="h-10 w-auto"
                  referrerPolicy="no-referrer"
                />
                <span className="text-lg font-black tracking-tight text-slate-900">
                  {f.brand.badgeText}
                </span>
              </Link>

              <div className="mt-5 text-xl font-extrabold tracking-tight text-slate-900">{f.brand.headline}</div>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-slate-600">{f.brand.subheadline}</p>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {f.highlights.map((x, idx) => (
                  <div key={k(x.key, x.value, idx)} className="rounded-md border border-orange-200/40 bg-white/80 p-4 shadow-[0_16px_50px_rgba(15,23,42,0.06)]">
                    <div className="text-xs font-extrabold text-slate-900">{x.key}</div>
                    <div className="mt-1 text-xs font-semibold text-slate-600">{x.value}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 h-px w-full bg-linear-to-r from-transparent via-orange-200/70 to-transparent" />

              <div className="mt-6 text-xs font-extrabold tracking-[0.18em] text-slate-900">{f.contact.label}</div>

              <div className="mt-4 space-y-3">
                <a className="flex items-center gap-2 text-sm font-semibold text-slate-700 transition-colors duration-300 hover:text-slate-950" href={`mailto:${f.contact.email}`}>
                  <FiMail className="text-orange-700" /> {f.contact.email}
                </a>
                <a className="flex items-center gap-2 text-sm font-semibold text-slate-700 transition-colors duration-300 hover:text-slate-950" href={`tel:${f.contact.phone}`}>
                  <FiPhone className="text-orange-700" /> {f.contact.phone}
                </a>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <FiMapPin className="text-orange-700" /> {f.contact.location}
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {f.socials
                  .filter((s) => s.key !== "whatsapp")
                  .map((s, idx) => (
                    <a
                      key={k(s.href, s.key, idx)}
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={s.label}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-orange-200/50 bg-white/80 text-slate-700 shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-orange-300/70 hover:bg-white hover:text-slate-950 hover:shadow-[0_16px_44px_rgba(234,88,12,0.12)]"
                    >
                      {Icon(s.icon)}
                    </a>
                  ))}
              </div>

              {/* Certifications — mobile */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                {f.certifications.map((c, idx) =>
                  c.href ? (
                    <a key={k(c.src || c.key, c.key, idx)} href={c.href} target="_blank" rel="noreferrer" aria-label={c.alt} className="inline-flex items-center justify-center">
                      <CertImage c={c} size="sm" />
                    </a>
                  ) : (
                    <div key={k(c.src || c.key, c.key, idx)} className="inline-flex items-center justify-center">
                      <CertImage c={c} size="sm" />
                    </div>
                  )
                )}
              </div>

              <div className="mt-6 h-px w-full bg-linear-to-r from-transparent via-orange-200/70 to-transparent" />

              <div className="mt-4 flex flex-col items-start justify-between gap-3 text-sm font-semibold text-slate-600">
                <div>{copyright}</div>

                <div className="flex flex-wrap items-center gap-3">
                  {f.legal.links.map((l, idx) => (
                    <div key={k(l.href, l.title, idx)} className="flex items-center gap-3">
                      <Link className="group relative font-extrabold text-orange-500 transition-colors hover:text-orange-800" href={l.href}>
                        {l.title}
                        <span className="pointer-events-none absolute -bottom-1 left-0 h-0.5 w-full origin-left scale-x-0 bg-linear-to-r from-orange-600 to-orange-400 transition-transform duration-300 ease-out group-hover:scale-x-100" />
                      </Link>
                      {idx !== f.legal.links.length - 1 ? <span className="text-orange-200">|</span> : null}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* BOTTOM BAR — desktop only                                           */}
        {/* ------------------------------------------------------------------ */}
        <div className="hidden md:block">
          <div className="mt-10 h-px w-full bg-linear-to-r from-transparent via-orange-200/70 to-transparent" />
          <motion.div variants={wrap} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="mt-6 flex flex-col items-start justify-between gap-4 text-sm font-semibold text-slate-600 sm:flex-row sm:items-center">
            <motion.div variants={fade}>{copyright}</motion.div>

            <motion.div variants={fade} className="flex flex-wrap items-center gap-3">
              {f.legal.links.map((l, idx) => (
                <div key={k(l.href, l.title, idx)} className="flex items-center gap-3">
                  <Link className="group relative font-extrabold text-orange-500 transition-colors hover:text-orange-800" href={l.href}>
                    {l.title}
                    <span className="pointer-events-none absolute -bottom-1 left-0 h-0.5 w-full origin-left scale-x-0 bg-linear-to-r from-orange-600 to-orange-400 transition-transform duration-300 ease-out group-hover:scale-x-100" />
                  </Link>
                  {idx !== f.legal.links.length - 1 ? <span className="text-orange-200">|</span> : null}
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      <ToastTopRight toast={toast} onClose={() => setToast(null)} duration={4000} />
    </footer>
  );
}