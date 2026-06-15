"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Space_Grotesk, Source_Serif_4 } from "next/font/google";
import { FiArrowRight, FiLock, FiSend, FiTag, FiGlobe } from "react-icons/fi";
import ToastTopRight from "@/components/ui/Toast";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-space-grotesk",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-source-serif",
});

type CmsData = {
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    cta: {
      primary: { label: string; href: string };
      secondary: { label: string; href: string };
    };
  };
  capabilities: {
    eyebrow: string;
    title: string;
    items: { title: string; desc: string }[];
  };
  samples: {
    eyebrow: string;
    title: string;
    items: {
      id: string;
      eyebrow: string;
      title: string;
      meta: string;
      tags: string[];
      showGrid?: { title: string; desc: string }[];
      primaryCta: { label: string; href: string };
      secondaryCta: { label: string; href: string };
      reportCta?: { label: string; href: string };
      inlineCta: { text: string; linkText: string; href: string };
    }[];
  };
  altText: {
    eyebrow: string;
    title: string;
    table: { type: string; shortAlt: string; longDesc: string }[];
  };
  beforeAfter: {
    eyebrow: string;
    title: string;
    items: { beforeTitle: string; beforeDesc: string; afterTitle: string; afterDesc: string }[];
  };
  privateSamples: {
    eyebrow: string;
    title: string;
    card: {
      path: string;
      desc: string;
      btnLabel: string;
      note: string;
      password?: string;
      items: { title: string; desc: string }[];
    };
  };
  leadGen: {
    eyebrow: string;
    title: string;
    desc: string;
  };
};

const FALLBACK_DATA: CmsData = {
  hero: {
    eyebrow: "Sample Work Portfolio",
    title: "Explore Nexografix Sample Work",
    subtitle: "Review selected samples from our accessibility, publishing, AI, and content production projects.",
    cta: {
      primary: { label: "Browse Samples", href: "#samples" },
      secondary: { label: "Get Free Project Assessment", href: "#lead-form" }
    }
  },
  capabilities: {
    eyebrow: "Capabilities",
    title: "What prospects can review",
    items: [
      { title: "PDF Accessibility", desc: "Tagged PDFs, WCAG/PDF-UA remediation" },
      { title: "EPUB Accessibility", desc: "Accessible EPUB 3 samples" },
      { title: "Alt Text Authoring", desc: "Figure descriptions and image accessibility" },
      { title: "XML Conversion", desc: "PDF to XML workflows" },
      { title: "Copy Editing", "desc": "Before vs After editing samples" },
      { title: "Translation", desc: "Source vs translated content" },
      { title: "AI Annotation", desc: "Text, image, and data annotation examples" },
      { title: "Dubbing & Localization", desc: "Voice-over and multilingual projects" },
      { title: "Assessment Development", desc: "Questions, solutions, and learning content" }
    ]
  },
  samples: {
    eyebrow: "Sample Layout",
    title: "Show the proof, not just the promise",
    items: [
      {
        id: "pdf-accessibility",
        eyebrow: "Accessibility Showcase",
        title: "PDF Accessibility Sample",
        meta: "Client Industry: Higher Education",
        tags: ["Tagged PDF", "Reading Order", "Alt Text", "Table Accessibility", "Screen Reader Testing"],
        primaryCta: { label: "Open PDF Sample Page", href: "/samples/pdf-accessibility" },
        secondaryCta: { label: "Request Similar Service", href: "/samples/pdf-accessibility#lead-form" },
        reportCta: { label: "View Accessibility Report", href: "/samples/pdf-accessibility-report" },
        inlineCta: {
          text: "Need the same remediation workflow for your documents?",
          linkText: "View Full Sample Page",
          href: "/samples/pdf-accessibility"
        }
      },
      {
        id: "epub-accessibility",
        eyebrow: "Digital Publishing",
        title: "EPUB Accessibility Sample",
        meta: "Publishing-ready EPUB 3 workflow",
        tags: [],
        showGrid: [
          { title: "EPUB File", desc: "Demonstrates navigation landmarks, semantic heading structure, and reflow support." },
          { title: "Accessibility Checklist", desc: "Summarizes keyboard, reading order, navigation, and metadata validation points." },
          { title: "Ace by DAISY Report", desc: "Highlights automated checks alongside manual verification and remediation notes." },
          { title: "Screenshot Gallery", desc: "Captures reading views, landmarks, and responsive behavior across devices." }
        ],
        primaryCta: { label: "Open EPUB Sample Page", href: "/samples/epub-accessibility" },
        secondaryCta: { label: "Request Similar Service", href: "/samples/epub-accessibility#lead-form" },
        inlineCta: {
          text: "Want an EPUB sample package aligned to your titles and platform requirements?",
          linkText: "View Full Sample Page",
          href: "/samples/epub-accessibility"
        }
      }
    ]
  },
  altText: {
    eyebrow: "Alt Text Expertise",
    title: "Show the thinking behind your accessibility work",
    table: [
      {
        type: "Bar Chart",
        shortAlt: "Quarterly sales bar chart comparing four regions.",
        longDesc: "North grows steadily, West leads overall, and South rebounds sharply in Q4 after a flat first half."
      },
      {
        type: "Flowchart",
        shortAlt: "Admissions workflow from application to final enrollment.",
        "longDesc": "The process moves through submission, eligibility review, interview, approval, and student onboarding, with rejection branches after review and interview."
      },
      {
        type: "Diagram",
        shortAlt: "Three-layer cloud security architecture diagram.",
        "longDesc": "The diagram shows user access controls feeding an application layer, which connects to encrypted storage and audit logging systems."
      }
    ]
  },
  beforeAfter: {
    eyebrow: "Before & After",
    title: "Visual proof that remediation and enrichment change outcomes",
    items: [
      {
        beforeTitle: "Untagged PDF",
        beforeDesc: "Manual reading order fixes, missing headings, and inaccessible tables.",
        afterTitle: "PDF-UA Compliant PDF",
        afterDesc: "Semantic tagging, validated structure, and assistive-technology-ready output."
      },
      {
        "beforeTitle": "Poor Alt Text",
        beforeDesc: "Generic descriptions that skip the meaning of the visual.",
        "afterTitle": "Human-reviewed Alt Text",
        "afterDesc": "Context-aware descriptions aligned with learning, compliance, and publishing goals."
      },
      {
        "beforeTitle": "Scanned PDF",
        beforeDesc: "Image-only pages with no structure, OCR cleanup, or navigation.",
        "afterTitle": "Accessible PDF",
        "afterDesc": "Corrected OCR, navigable headings, searchable text, and screen reader support."
      }
    ]
  },
  privateSamples: {
    eyebrow: "NDA-Protected Samples",
    title: "Keep confidential work available only for serious prospects",
    card: {
      path: "sample.nexografix.com/private",
      "desc": "Password-protected area containing Microsoft-related samples, publisher samples, and client-specific demonstrations.",
      "btnLabel": "Open Private Area",
      "note": "Only share the password with serious prospects.",
      items: [
        { title: "Microsoft-related samples", desc: "Accessibility remediation, publishing workflows, and enterprise-ready content operations." },
        { title: "Publisher samples", desc: "EPUB accessibility, copy editing comparisons, multilingual deliverables, and production QA." },
        { title: "Client-specific demonstrations", desc: "Custom showcases prepared for individual prospects, industries, or procurement reviews." }
      ]
    }
  },
  leadGen: {
    eyebrow: "Lead Generation",
    title: "Request Similar Service",
    "desc": "Every sample page should make it easy for prospects to turn interest into a scoped conversation."
  }
};

export default function SamplesPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

  const [data, setData] = useState<CmsData>(FALLBACK_DATA);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [projectType, setProjectType] = useState("");
  const [volume, setVolume] = useState("");
  const [timeline, setTimeline] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/api/v1/content/samples`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load CMS content");
        return res.json();
      })
      .then((json) => {
        if (json && !json.error) setData(json as CmsData);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [API_BASE]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        first_name: name,
        last_name: company,
        email: email,
        service: projectType,
        message: `Volume: ${volume} | Timeline: ${timeline}`,
      };

      const res = await fetch(`${API_BASE}/api/v1/contact-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Submission failed");

      setToast({ type: "success", msg: "Request submitted successfully! We will get back to you shortly." });
      setName("");
      setCompany("");
      setEmail("");
      setProjectType("");
      setVolume("");
      setTimeline("");
      
      setTimeout(() => {
        window.location.href = "/samples/thank-you";
      }, 1500);

    } catch (err) {
      console.error(err);
      setToast({ type: "error", msg: "Failed to submit request. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className={`${spaceGrotesk.variable} ${sourceSerif.variable} font-sans min-h-screen pb-16`}
      style={{
        color: "var(--color-text-main)",
        background: `
          radial-gradient(circle at top left, rgba(249, 115, 22, 0.15), transparent 28%),
          radial-gradient(circle at top right, rgba(234, 88, 12, 0.12), transparent 32%),
          linear-gradient(180deg, #FFFFFF 0%, var(--color-bg) 45%, #FFEDD5 100%)
        `,
      }}
    >
      <ToastTopRight toast={toast} onClose={() => setToast(null)} />

      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <header className="py-16 md:py-24 max-w-3xl">
          <p className="text-[var(--color-brand-dark)] font-bold text-xs uppercase tracking-widest mb-3">
            {data.hero.eyebrow}
          </p>
          <h1 className="font-serif font-black text-4xl sm:text-6xl md:text-[5.2rem] leading-[1.05] tracking-tight text-[var(--color-text-main)]">
            {data.hero.title}
          </h1>
          <p className="text-[var(--color-text-muted)] text-lg sm:text-xl mt-6 leading-relaxed max-w-xl">
            {data.hero.subtitle}
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            <a
              href={data.hero.cta.primary.href}
              className="inline-flex items-center justify-center bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] text-white font-bold py-3.5 px-6 rounded-full shadow-lg shadow-orange-500/20 transition duration-150 ease-out hover:-translate-y-0.5"
            >
              {data.hero.cta.primary.label}
            </a>
            <a
              href={data.hero.cta.secondary.href}
              className="inline-flex items-center justify-center bg-[var(--color-text-main)] hover:bg-black text-white font-bold py-3.5 px-6 rounded-full shadow-lg transition duration-150 ease-out hover:-translate-y-0.5"
            >
              {data.hero.cta.secondary.label}
            </a>
          </div>
        </header>

        {/* Capabilities Section */}
        <section className="mt-8 p-6 md:p-10 border border-orange-200/50 rounded-[30px] bg-white/84 backdrop-blur-md shadow-xl" id="categories">
          <div className="max-w-3xl mb-8">
            <p className="text-[var(--color-brand)] font-bold text-xs uppercase tracking-widest mb-2">
              {data.capabilities.eyebrow}
            </p>
            <h2 className="font-serif font-black text-3xl sm:text-5xl leading-tight text-[var(--color-text-main)]">
              {data.capabilities.title}
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.capabilities.items.map((item, idx) => (
              <article
                key={idx}
                className="p-6 border border-orange-200/40 rounded-2xl bg-[#FFFDF9] flex flex-col justify-between min-h-[160px] hover:border-[var(--color-brand)]/40 transition duration-200"
              >
                <h3 className="font-bold text-lg text-[var(--color-text-main)]">{item.title}</h3>
                <p className="text-[var(--color-text-muted)] text-sm leading-relaxed mt-2">{item.desc}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Samples Layout Section */}
        <section className="mt-12 p-6 md:p-10 border border-orange-200/50 rounded-[30px] bg-white/84 backdrop-blur-md shadow-xl" id="samples">
          <div className="max-w-3xl mb-8">
            <p className="text-[var(--color-brand)] font-bold text-xs uppercase tracking-widest mb-2">
              {data.samples.eyebrow}
            </p>
            <h2 className="font-serif font-black text-3xl sm:text-5xl leading-tight text-[var(--color-text-main)]">
              {data.samples.title}
            </h2>
          </div>
          <div className="space-y-6">
            {data.samples.items.map((item) => (
              <article key={item.id} className="p-6 md:p-8 border border-orange-200/40 rounded-[24px] bg-[#FFFDF9] hover:shadow-md transition">
                <div className="flex flex-col md:flex-row md:justify-between gap-2 md:items-start mb-4">
                  <div>
                    <p className="text-[var(--color-brand)] font-bold text-xs uppercase tracking-widest mb-1">{item.eyebrow}</p>
                    <h3 className="font-bold text-xl sm:text-2xl text-[var(--color-text-main)]">{item.title}</h3>
                  </div>
                  <p className="font-bold text-[var(--color-brand-dark)] text-sm">{item.meta}</p>
                </div>

                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {item.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="px-3.5 py-1.5 rounded-full bg-orange-100 text-[var(--color-brand-dark)] text-xs font-semibold">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {item.showGrid && (
                  <div className="grid gap-4 sm:grid-cols-2 mb-6">
                    {item.showGrid.map((gridItem, gIdx) => (
                      <div key={gIdx} className="p-4 border border-orange-200/30 rounded-2xl bg-white/80">
                        <h4 className="font-bold text-sm text-[var(--color-brand-dark)] mb-1">{gridItem.title}</h4>
                        <p className="text-[var(--color-text-muted)] text-xs leading-relaxed">{gridItem.desc}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap gap-3 mt-6 mb-6">
                  <Link
                    href={item.primaryCta.href}
                    className="inline-flex items-center justify-center bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] text-white text-sm font-bold py-3 px-5 rounded-full shadow-md transition"
                  >
                    {item.primaryCta.label}
                  </Link>
                  <a
                    href={item.secondaryCta.href}
                    className="inline-flex items-center justify-center bg-[var(--color-text-main)] hover:bg-black text-white text-sm font-bold py-3 px-5 rounded-full shadow-md transition"
                  >
                    {item.secondaryCta.label}
                  </a>
                  {item.reportCta && (
                    <Link
                      href={item.reportCta.href}
                      className="inline-flex items-center justify-center border border-orange-200 hover:bg-orange-50/50 text-[var(--color-text-main)] text-sm font-bold py-3 px-5 rounded-full transition"
                    >
                      {item.reportCta.label}
                    </Link>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-t border-orange-200/50 pt-4">
                  <p className="text-[var(--color-text-muted)] text-sm">{item.inlineCta.text}</p>
                  <Link href={item.inlineCta.href} className="text-[var(--color-brand-dark)] hover:text-[var(--color-brand)] font-bold text-sm underline underline-offset-4 decoration-2">
                    {item.inlineCta.linkText}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Alt Text Expertise Section */}
        <section className="mt-12 p-6 md:p-10 border border-orange-200/50 rounded-[30px] bg-white/84 backdrop-blur-md shadow-xl">
          <div className="max-w-3xl mb-8">
            <p className="text-[var(--color-brand)] font-bold text-xs uppercase tracking-widest mb-2">
              {data.altText.eyebrow}
            </p>
            <h2 className="font-serif font-black text-3xl sm:text-5xl leading-tight text-[var(--color-text-main)]">
              {data.altText.title}
            </h2>
          </div>
          <div className="border border-orange-200/50 rounded-2xl bg-[#FFFDF9] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-orange-200/50">
                    <th scope="col" className="p-4 text-xs font-bold uppercase tracking-wider text-[var(--color-brand-dark)]">Image Type</th>
                    <th scope="col" className="p-4 text-xs font-bold uppercase tracking-wider text-[var(--color-brand-dark)]">Short Alt Text</th>
                    <th scope="col" className="p-4 text-xs font-bold uppercase tracking-wider text-[var(--color-brand-dark)]">Long Description</th>
                  </tr>
                </thead>
                <tbody>
                  {data.altText.table.map((row, rIdx) => (
                    <tr key={rIdx} className="border-b border-orange-200/30 last:border-0 hover:bg-orange-50/10">
                      <td className="p-4 font-bold text-sm text-[var(--color-text-main)]">{row.type}</td>
                      <td className="p-4 text-sm text-[var(--color-text-muted)]">{row.shortAlt}</td>
                      <td className="p-4 text-sm text-[var(--color-text-muted)] leading-relaxed">{row.longDesc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Before & After Section */}
        <section className="mt-12 p-6 md:p-10 border border-orange-200/50 rounded-[30px] bg-white/84 backdrop-blur-md shadow-xl">
          <div className="max-w-3xl mb-8">
            <p className="text-[var(--color-brand)] font-bold text-xs uppercase tracking-widest mb-2">
              {data.beforeAfter.eyebrow}
            </p>
            <h2 className="font-serif font-black text-3xl sm:text-5xl leading-tight text-[var(--color-text-main)]">
              {data.beforeAfter.title}
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {data.beforeAfter.items.map((item, idx) => (
              <article key={idx} className="p-6 border border-orange-200/40 rounded-2xl bg-[#FFFDF9] relative hover:border-[var(--color-brand)]/40 transition">
                <div className="space-y-1 mb-4">
                  <h4 className="font-bold text-base text-[var(--color-text-muted)]">{item.beforeTitle}</h4>
                  <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">{item.beforeDesc}</p>
                </div>
                <div className="text-2xl font-serif text-[var(--color-brand)] my-3">↓</div>
                <div className="space-y-1">
                  <h4 className="font-bold text-base text-[var(--color-brand-dark)]">{item.afterTitle}</h4>
                  <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">{item.afterDesc}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* NDA Protected Samples */}
        <section className="mt-12 p-6 md:p-10 border border-orange-200/50 rounded-[30px] bg-white/84 backdrop-blur-md shadow-xl">
          <div className="max-w-3xl mb-8">
            <p className="text-[var(--color-brand)] font-bold text-xs uppercase tracking-widest mb-2">
              {data.privateSamples.eyebrow}
            </p>
            <h2 className="font-serif font-black text-3xl sm:text-5xl leading-tight text-[var(--color-text-main)]">
              {data.privateSamples.title}
            </h2>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 md:p-8 border border-orange-200/40 rounded-2xl bg-[#FFFDF9]">
            <div className="space-y-2 max-w-xl">
              <p className="font-bold text-[var(--color-brand-dark)] text-sm">{data.privateSamples.card.path}</p>
              <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">{data.privateSamples.card.desc}</p>
            </div>
            <div className="flex flex-col gap-2 min-w-[200px]">
              <Link
                href="/samples/private"
                className="inline-flex items-center justify-center bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] text-white font-bold py-3.5 px-6 rounded-full shadow-md text-center transition"
              >
                <FiLock className="mr-1.5" /> {data.privateSamples.card.btnLabel}
              </Link>
              <p className="text-xs text-[var(--color-text-muted,#71717A)] text-center">{data.privateSamples.card.note}</p>
            </div>
          </div>
        </section>

        {/* Lead Gen Form */}
        <section className="mt-12 p-6 md:p-10 border border-orange-200/50 rounded-[30px] bg-white/84 backdrop-blur-md shadow-xl" id="lead-form">
          <div className="max-w-3xl mb-8">
            <p className="text-[var(--color-brand)] font-bold text-xs uppercase tracking-widest mb-2">
              {data.leadGen.eyebrow}
            </p>
            <h2 className="font-serif font-black text-3xl sm:text-5xl leading-tight text-[var(--color-text-main)]">
              {data.leadGen.title}
            </h2>
            <p className="text-[var(--color-text-muted)] text-sm mt-3 leading-relaxed">
              {data.leadGen.desc}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2 border border-orange-200/40 rounded-2xl bg-[#FFFDF9] p-6">
            <label className="flex flex-col gap-2 font-bold text-sm text-[var(--color-text-main)]">
              Name
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full min-h-[48px] px-4 py-2 border border-orange-200 rounded-xl bg-[#FFFDF9] outline-none focus:border-[var(--color-brand)] font-normal transition"
              />
            </label>
            <label className="flex flex-col gap-2 font-bold text-sm text-[var(--color-text-main)]">
              Company
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
                className="w-full min-h-[48px] px-4 py-2 border border-orange-200 rounded-xl bg-[#FFFDF9] outline-none focus:border-[var(--color-brand)] font-normal transition"
              />
            </label>
            <label className="flex flex-col gap-2 font-bold text-sm text-[var(--color-text-main)]">
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full min-h-[48px] px-4 py-2 border border-orange-200 rounded-xl bg-[#FFFDF9] outline-none focus:border-[var(--color-brand)] font-normal transition"
              />
            </label>
            <label className="flex flex-col gap-2 font-bold text-sm text-[var(--color-text-main)]">
              Project Type
              <select
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                required
                className="w-full min-h-[48px] px-4 py-2 border border-orange-200 rounded-xl bg-[#FFFDF9] outline-none focus:border-[var(--color-brand)] font-normal transition"
              >
                <option value="">Select a service</option>
                <option value="PDF Accessibility">PDF Accessibility</option>
                <option value="EPUB Accessibility">EPUB Accessibility</option>
                <option value="Alt Text Authoring">Alt Text Authoring</option>
                <option value="XML Conversion">XML Conversion</option>
                <option value="Copy Editing">Copy Editing</option>
                <option value="Translation">Translation</option>
                <option value="AI Annotation">AI Annotation</option>
                <option value="Dubbing & Localization">Dubbing &amp; Localization</option>
                <option value="Assessment Development">Assessment Development</option>
              </select>
            </label>
            <label className="flex flex-col gap-2 font-bold text-sm text-[var(--color-text-main)]">
              Volume
              <input
                type="text"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                placeholder="Example: 120 PDFs / 8 EPUB titles"
                required
                className="w-full min-h-[48px] px-4 py-2 border border-orange-200 rounded-xl bg-[#FFFDF9] outline-none focus:border-[var(--color-brand)] font-normal transition"
              />
            </label>
            <label className="flex flex-col gap-2 font-bold text-sm text-[var(--color-text-main)]">
              Timeline
              <input
                type="text"
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                placeholder="Example: 4 weeks / Q3 launch"
                required
                className="w-full min-h-[48px] px-4 py-2 border border-orange-200 rounded-xl bg-[#FFFDF9] outline-none focus:border-[var(--color-brand)] font-normal transition"
              />
            </label>
            <button
              type="submit"
              disabled={submitting}
              className="sm:col-span-2 inline-flex items-center justify-center bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] text-white font-bold py-3.5 px-6 rounded-full shadow-lg transition duration-150 disabled:opacity-50 disabled:cursor-wait mt-4"
            >
              <FiSend className="mr-1.5" /> {submitting ? "Submitting..." : "Get Free Project Assessment"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
