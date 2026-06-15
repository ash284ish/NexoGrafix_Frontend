"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Space_Grotesk, Source_Serif_4 } from "next/font/google";
import { FiArrowLeft, FiLock, FiSend, FiPlay, FiCheckCircle, FiFileText } from "react-icons/fi";
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
  samples: {
    items: {
      id: string;
      eyebrow: string;
      title: string;
      meta: string;
      tags: string[];
      showGrid?: { title: string; desc: string }[];
    }[];
  };
  privateSamples: {
    card: {
      password?: string;
      desc: string;
      btnLabel: string;
      note: string;
      items: { title: string; desc: string }[];
    };
  };
};

const FALLBACK_DATA: CmsData = {
  samples: {
    items: [
      {
        id: "pdf-accessibility",
        eyebrow: "Accessibility Showcase",
        title: "PDF Accessibility Sample",
        meta: "Client Industry: Higher Education",
        tags: ["Tagged PDF", "Reading Order", "Alt Text", "Table Accessibility", "Screen Reader Testing"],
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
      }
    ]
  },
  privateSamples: {
    card: {
      password: "NexoPrivate2026",
      desc: "Password-protected area containing Microsoft-related samples, publisher samples, and client-specific demonstrations.",
      btnLabel: "Open Private Area",
      note: "Only share the password with serious prospects.",
      items: [
        { title: "Microsoft-related samples", desc: "Accessibility remediation, publishing workflows, and enterprise-ready content operations." },
        { title: "Publisher samples", desc: "EPUB accessibility, copy editing comparisons, multilingual deliverables, and production QA." },
        { title: "Client-specific demonstrations", desc: "Custom showcases prepared for individual prospects, industries, or procurement reviews." }
      ]
    }
  }
};

export default function SampleDetailPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [data, setData] = useState<CmsData>(FALLBACK_DATA);
  const [loadingCms, setLoadingCms] = useState(true);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // Password gate state
  const [password, setPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordErr, setPasswordErr] = useState("");

  // Form states
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [projectType, setProjectType] = useState("");
  const [volume, setVolume] = useState("");
  const [timeline, setTimeline] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Check session storage for private samples unlock state
    if (typeof window !== "undefined") {
      const isGranted = sessionStorage.getItem("nexografix-private") === "granted";
      setIsUnlocked(isGranted);
    }

    // Set default project type from slug
    if (slug === "pdf-accessibility") {
      setProjectType("PDF Accessibility");
    } else if (slug === "epub-accessibility") {
      setProjectType("EPUB Accessibility");
    }

    fetch(`${API_BASE}/api/v1/content/samples`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load CMS content");
        return res.json();
      })
      .then((json) => {
        if (json && !json.error) setData(json as CmsData);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoadingCms(false));
  }, [API_BASE, slug]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = data.privateSamples?.card?.password || "NexoPrivate2026";
    if (password === correctPassword) {
      sessionStorage.setItem("nexografix-private", "granted");
      setIsUnlocked(true);
      setPasswordErr("");
      setToast({ type: "success", msg: "Access granted!" });
    } else {
      setPasswordErr("Incorrect password. Share access only with serious prospects.");
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
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

      setToast({ type: "success", msg: "Request submitted successfully!" });
      setName("");
      setCompany("");
      setEmail("");
      setVolume("");
      setTimeline("");

      setTimeout(() => {
        router.push("/samples/thank-you");
      }, 1500);

    } catch (err) {
      console.error(err);
      setToast({ type: "error", msg: "Failed to submit request. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingCms) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF7ED] text-[#18181B]">
        <div className="animate-pulse font-serif text-2xl font-bold text-orange-600">Loading...</div>
      </div>
    );
  }

  // --- RENDER PRIVATE SAMPLES PASSWORD GATE ---
  if (slug === "private") {
    return (
      <div
        className={`${spaceGrotesk.variable} ${sourceSerif.variable} font-sans min-h-screen py-16 flex items-center justify-center px-4`}
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

        {!isUnlocked ? (
          <section className="w-full max-w-[700px] p-8 md:p-10 border border-orange-200/50 rounded-[30px] bg-white/84 backdrop-blur-md shadow-xl text-center">
            <p className="text-[var(--color-brand-dark)] font-bold text-xs uppercase tracking-widest mb-2">Restricted Access</p>
            <h1 className="font-serif font-black text-3xl sm:text-5xl leading-tight mb-4 text-[var(--color-text-main)]">Private Client Samples</h1>
            <p className="text-[var(--color-text-muted)] text-sm sm:text-base leading-relaxed max-w-lg mx-auto mb-8">
              {data.privateSamples?.card?.desc || "This area is intended for serious prospects reviewing NDA-protected work, including Microsoft-related samples, publisher samples, and client-specific demonstrations."}
            </p>

            <form onSubmit={handlePasswordSubmit} className="max-w-md mx-auto space-y-4">
              <label className="block text-left font-bold text-sm text-[var(--color-text-main)] mb-1">
                Password
                <div className="flex gap-2 mt-1.5">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="flex-1 min-h-[48px] px-4 py-2 border border-orange-200 rounded-xl bg-[#FFFDF9] outline-none focus:border-[var(--color-brand)] font-normal text-slate-900"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] text-white font-bold py-3 px-6 rounded-xl transition"
                  >
                    Enter
                  </button>
                </div>
              </label>
              {passwordErr && <p className="text-red-600 text-xs font-semibold text-left">{passwordErr}</p>}
              <p className="text-[var(--color-text-muted,#71717A)] text-xs text-left leading-relaxed">
                Only share the password with serious prospects.
              </p>
            </form>
          </section>
        ) : (
          <section className="w-full max-w-[700px] p-8 md:p-10 border border-orange-200/50 rounded-[30px] bg-white/84 backdrop-blur-md shadow-xl">
            <p className="text-[var(--color-brand-dark)] font-bold text-xs uppercase tracking-widest mb-2">Approved Prospect View</p>
            <h2 className="font-serif font-black text-3xl sm:text-5xl leading-tight mb-3 text-[var(--color-text-main)]">Confidential sample library</h2>
            <p className="text-[var(--color-text-muted)] text-sm leading-relaxed mb-6">
              Share this access only during qualified sales conversations and tailor walkthroughs to the prospect’s industry.
            </p>

            <div className="grid gap-4 sm:grid-cols-3 mb-8">
              {data.privateSamples.card.items.map((item, idx) => (
                <article key={idx} className="p-5 border border-orange-200/40 rounded-2xl bg-[#FFFDF9]">
                  <h3 className="font-bold text-base text-[var(--color-text-main)] mb-2">{item.title}</h3>
                  <p className="text-[var(--color-text-muted)] text-xs leading-relaxed">{item.desc}</p>
                </article>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/samples#lead-form"
                className="inline-flex items-center justify-center bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] text-white font-bold py-3 px-6 rounded-full transition shadow-md"
              >
                Request Similar Service
              </Link>
              <Link
                href="/samples"
                className="inline-flex items-center justify-center border border-orange-200 hover:bg-orange-50/50 text-[var(--color-text-main)] font-bold py-3 px-6 rounded-full transition"
              >
                Back to Public Samples
              </Link>
            </div>
          </section>
        )}
      </div>
    );
  }

  // --- RENDER PDF ACCESSIBILITY REPORT ---
  if (slug === "pdf-accessibility-report") {
    return (
      <div
        className={`${spaceGrotesk.variable} ${sourceSerif.variable} font-sans min-h-screen py-16`}
        style={{
          color: "var(--color-text-main)",
          background: `
            radial-gradient(circle at top left, rgba(249, 115, 22, 0.15), transparent 28%),
            radial-gradient(circle at top right, rgba(234, 88, 12, 0.12), transparent 32%),
            linear-gradient(180deg, #FFFFFF 0%, var(--color-bg) 45%, #FFEDD5 100%)
          `,
        }}
      >
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8">
          <section className="max-w-3xl mb-8">
            <p className="text-[var(--color-brand-dark)] font-bold text-xs uppercase tracking-widest mb-3">Sample Report</p>
            <h1 className="font-serif font-black text-4xl sm:text-6xl leading-[1.05] tracking-tight text-[var(--color-text-main)]">PDF Accessibility Report</h1>
            <p className="text-[var(--color-text-muted)] text-base sm:text-lg mt-4 leading-relaxed">
              Example summary for a higher education document remediated to PDF-UA expectations.
            </p>
          </section>

          <section className="p-6 md:p-10 border border-orange-200/50 rounded-[30px] bg-white/84 backdrop-blur-md shadow-xl mb-8">
            <div className="max-w-3xl mb-6">
              <h2 className="font-serif font-black text-2xl sm:text-3xl leading-tight text-[var(--color-text-main)]">Audit summary</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              <article className="p-5 border border-orange-200/40 rounded-2xl bg-[#FFFDF9]">
                <h3 className="font-bold text-base mb-2 text-[var(--color-text-main)]">Structure</h3>
                <p className="text-[var(--color-text-muted)] text-xs leading-relaxed">Heading levels normalized, tag tree rebuilt, reading order verified across assistive technology.</p>
              </article>
              <article className="p-5 border border-orange-200/40 rounded-2xl bg-[#FFFDF9]">
                <h3 className="font-bold text-base mb-2 text-[var(--color-text-main)]">Tables</h3>
                <p className="text-[var(--color-text-muted)] text-xs leading-relaxed">Header associations corrected, merged cells reviewed, and summary context preserved for screen readers.</p>
              </article>
              <article className="p-5 border border-orange-200/40 rounded-2xl bg-[#FFFDF9]">
                <h3 className="font-bold text-base mb-2 text-[var(--color-text-main)]">Images</h3>
                <p className="text-[var(--color-text-muted,#71717A)] text-xs leading-relaxed">Decorative images marked appropriately and meaningful visuals provided with concise, reviewed descriptions.</p>
              </article>
            </div>
          </section>

          <section className="p-6 md:p-10 border border-orange-200/50 rounded-[30px] bg-white/84 backdrop-blur-md shadow-xl">
            <div className="max-w-3xl mb-6">
              <h2 className="font-serif font-black text-2xl sm:text-3xl leading-tight text-[var(--color-text-main)]">Testing checklist</h2>
            </div>
            <div className="border border-orange-200/50 rounded-2xl bg-[#FFFDF9] overflow-hidden mb-8">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-orange-200/50">
                      <th scope="col" className="p-4 text-xs font-bold uppercase tracking-wider text-[var(--color-brand-dark)]">Checkpoint</th>
                      <th scope="col" className="p-4 text-xs font-bold uppercase tracking-wider text-[var(--color-brand-dark)]">Status</th>
                      <th scope="col" className="p-4 text-xs font-bold uppercase tracking-wider text-[var(--color-brand-dark)]">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-orange-200/30">
                      <td className="p-4 font-bold text-sm text-[var(--color-text-main)]">Tags and semantics</td>
                      <td className="p-4 text-sm text-emerald-600 font-bold">Pass</td>
                      <td className="p-4 text-sm text-[var(--color-text-muted)] leading-relaxed">Document contains semantic headings, lists, tables, and artifact handling.</td>
                    </tr>
                    <tr className="border-b border-orange-200/30">
                      <td className="p-4 font-bold text-sm text-[var(--color-text-main)]">Reading order</td>
                      <td className="p-4 text-sm text-emerald-600 font-bold">Pass</td>
                      <td className="p-4 text-sm text-[var(--color-text-muted)] leading-relaxed">Manual and screen reader verification completed.</td>
                    </tr>
                    <tr className="last:border-0 hover:bg-orange-50/10">
                      <td className="p-4 font-bold text-sm text-[var(--color-text-main)]">Color contrast review</td>
                      <td className="p-4 text-sm text-[var(--color-brand)] font-bold">Advisory</td>
                      <td className="p-4 text-sm text-[var(--color-text-muted)] leading-relaxed">Flagged for source redesign when possible; content remains readable in current version.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/samples#lead-form"
                className="inline-flex items-center justify-center bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] text-white font-bold py-3 px-6 rounded-full transition shadow-md"
              >
                Request Similar Service
              </Link>
              <Link
                href="/samples"
                className="inline-flex items-center justify-center border border-orange-200 hover:bg-orange-50/50 text-[var(--color-text-main)] font-bold py-3 px-6 rounded-full transition"
              >
                Back to Sample Work
              </Link>
            </div>
          </section>
        </div>
      </div>
    );
  }

  // --- RENDER THANK YOU PAGE ---
  if (slug === "thank-you") {
    return (
      <div
        className={`${spaceGrotesk.variable} ${sourceSerif.variable} font-sans min-h-screen py-16 flex items-center justify-center px-4`}
        style={{
          color: "var(--color-text-main)",
          background: `
            radial-gradient(circle at top left, rgba(249, 115, 22, 0.15), transparent 28%),
            radial-gradient(circle at top right, rgba(234, 88, 12, 0.12), transparent 32%),
            linear-gradient(180deg, #FFFFFF 0%, var(--color-bg) 45%, #FFEDD5 100%)
          `,
        }}
      >
        <section className="w-full max-w-[600px] p-8 md:p-10 border border-orange-200/50 rounded-[30px] bg-white/84 backdrop-blur-md shadow-xl text-center space-y-6">
          <div className="flex justify-center text-[var(--color-brand)]">
            <FiCheckCircle className="w-16 h-16 animate-bounce" />
          </div>
          <h1 className="font-serif font-black text-3xl sm:text-5xl leading-tight text-[var(--color-text-main)]">Thank You!</h1>
          <p className="text-[var(--color-text-muted)] text-sm sm:text-base leading-relaxed max-w-md mx-auto">
            We have received your project assessment details and will review them shortly. A team member will reach out to you within 24 business hours.
          </p>
          <div className="pt-4">
            <Link
              href="/samples"
              className="inline-flex items-center justify-center bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] text-white font-bold py-3 px-6 rounded-full transition shadow-md"
            >
              Back to Samples
            </Link>
          </div>
        </section>
      </div>
    );
  }

  // --- FIND DYNAMIC SAMPLE INFO FROM CMS ---
  const sample = data.samples.items.find((item) => item.id === slug);

  if (!sample) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF7ED] text-[#18181B] space-y-4">
        <h1 className="font-serif text-3xl font-bold text-orange-600">Sample Not Found</h1>
        <p className="text-sm text-[var(--color-text-muted)]">The sample case study you requested could not be found.</p>
        <Link href="/samples" className="text-[var(--color-brand-dark)] hover:underline font-bold text-sm">
          Back to Samples Directory
        </Link>
      </div>
    );
  }

  // --- RENDER DYNAMIC SAMPLES (PDF or EPUB Accessibility) ---
  const isPdf = sample.id === "pdf-accessibility";

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
        {/* Header Block */}
        <section className="py-16 md:py-20 max-w-3xl">
          <p className="text-[var(--color-brand-dark)] font-bold text-xs uppercase tracking-widest mb-3">Sample Page</p>
          <h1 className="font-serif font-black text-4xl sm:text-6xl leading-[1.05] tracking-tight text-[var(--color-text-main)]">{sample.title}</h1>
          <p className="text-[var(--color-text-muted)] text-base sm:text-lg mt-4 leading-relaxed">
            {isPdf ? (
              `Client Industry: Higher Education. This page demonstrates how Nexografix presents a remediated document workflow to qualified prospects.`
            ) : (
              `A publishing-focused sample page presenting EPUB 3 accessibility work with automated and manual quality checks.`
            )}
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            {isPdf ? (
              <>
                <a href="#lead-form" className="inline-flex items-center justify-center bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] text-white font-bold py-3 px-6 rounded-full transition shadow-md">
                  Download Original PDF
                </a>
                <a href="#lead-form" className="inline-flex items-center justify-center bg-[var(--color-text-main)] hover:bg-black text-white font-bold py-3 px-6 rounded-full transition shadow-md">
                  Download Accessible PDF
                </a>
                <Link href="/samples/pdf-accessibility-report" className="inline-flex items-center justify-center border border-orange-200 hover:bg-orange-50/50 text-[var(--color-text-main)] font-bold py-3 px-6 rounded-full transition">
                  View Accessibility Report
                </Link>
              </>
            ) : (
              <>
                <a href="#lead-form" className="inline-flex items-center justify-center bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] text-white font-bold py-3 px-6 rounded-full transition shadow-md">
                  Request Similar Service
                </a>
                <Link href="/samples" className="inline-flex items-center justify-center border border-orange-200 hover:bg-orange-50/50 text-[var(--color-text-main)] font-bold py-3 px-6 rounded-full transition">
                  Back to Public Samples
                </Link>
              </>
            )}
          </div>
        </section>

        {/* Showcase / Grid Details */}
        <section className="p-6 md:p-10 border border-orange-200/50 rounded-[30px] bg-white/84 backdrop-blur-md shadow-xl mb-8">
          <div className="max-w-3xl mb-6">
            <h2 className="font-serif font-black text-2xl sm:text-3xl leading-tight text-[var(--color-text-main)]">
              {isPdf ? "Sample includes" : "Showcase contents"}
            </h2>
          </div>

          {isPdf ? (
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                {sample.tags.map((tag, idx) => (
                  <span key={idx} className="px-3.5 py-1.5 rounded-full bg-orange-100 text-[var(--color-brand-dark)] text-xs font-semibold">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                <article className="p-5 border border-orange-200/40 rounded-2xl bg-[#FFFDF9]">
                  <h3 className="font-bold text-base mb-2 text-[var(--color-text-main)]">Original condition</h3>
                  <p className="text-[var(--color-text-muted)] text-xs leading-relaxed">Unclear reading order, missing tags, inaccessible tables, and figure descriptions requiring review.</p>
                </article>
                <article className="p-5 border border-orange-200/40 rounded-2xl bg-[#FFFDF9]">
                  <h3 className="font-bold text-base mb-2 text-[var(--color-text-main)]">Remediation work</h3>
                  <p className="text-[var(--color-text-muted)] text-xs leading-relaxed">Tag tree rebuild, heading normalization, table header repair, artifact cleanup, and alt text authoring.</p>
                </article>
                <article className="p-5 border border-orange-200/40 rounded-2xl bg-[#FFFDF9]">
                  <h3 className="font-bold text-base mb-2 text-[var(--color-text-main)]">Final outcome</h3>
                  <p className="text-[var(--color-text-muted)] text-xs leading-relaxed">Validated structure, assistive technology checks, and a client-ready report documenting compliance progress.</p>
                </article>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {sample.showGrid?.map((gridItem, idx) => (
                <div key={idx} className="p-5 border border-orange-200/40 rounded-2xl bg-[#FFFDF9]">
                  <h4 className="font-bold text-base text-[var(--color-brand-dark)] mb-1">{gridItem.title}</h4>
                  <p className="text-[var(--color-text-muted)] text-xs leading-relaxed">{gridItem.desc}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Request Assessment Form */}
        <section className="p-6 md:p-10 border border-orange-200/50 rounded-[30px] bg-white/84 backdrop-blur-md shadow-xl" id="lead-form">
          <div className="max-w-3xl mb-8">
            <p className="text-[var(--color-brand-dark)] font-bold text-xs uppercase tracking-widest mb-2">Lead Generation</p>
            <h2 className="font-serif font-black text-2xl sm:text-4xl leading-tight text-[var(--color-text-main)]">Request Similar Service</h2>
          </div>

          <form onSubmit={handleLeadSubmit} className="grid gap-4 sm:grid-cols-2 border border-orange-200/40 rounded-2xl bg-[#FFFDF9] p-6">
            <label className="flex flex-col gap-2 font-bold text-sm text-[var(--color-text-main)]">
              Name
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full min-h-[48px] px-4 py-2 border border-orange-200 rounded-xl bg-[#FFFDF9] outline-none focus:border-[var(--color-brand)] font-normal"
              />
            </label>
            <label className="flex flex-col gap-2 font-bold text-sm text-[var(--color-text-main)]">
              Company
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
                className="w-full min-h-[48px] px-4 py-2 border border-orange-200 rounded-xl bg-[#FFFDF9] outline-none focus:border-[var(--color-brand)] font-normal"
              />
            </label>
            <label className="flex flex-col gap-2 font-bold text-sm text-[var(--color-text-main)]">
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full min-h-[48px] px-4 py-2 border border-orange-200 rounded-xl bg-[#FFFDF9] outline-none focus:border-[var(--color-brand)] font-normal"
              />
            </label>
            <label className="flex flex-col gap-2 font-bold text-sm text-[var(--color-text-main)]">
              Project Type
              <select
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                required
                className="w-full min-h-[48px] px-4 py-2 border border-orange-200 rounded-xl bg-[#FFFDF9] outline-none focus:border-[var(--color-brand)] font-normal"
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
                className="w-full min-h-[48px] px-4 py-2 border border-orange-200 rounded-xl bg-[#FFFDF9] outline-none focus:border-[var(--color-brand)] font-normal"
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
                className="w-full min-h-[48px] px-4 py-2 border border-orange-200 rounded-xl bg-[#FFFDF9] outline-none focus:border-[var(--color-brand)] font-normal"
              />
            </label>
            <button
              type="submit"
              disabled={submitting}
              className="sm:col-span-2 inline-flex items-center justify-center bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] text-white font-bold py-3.5 px-6 rounded-full shadow-lg transition duration-150 disabled:opacity-50 disabled:cursor-wait mt-4"
            >
              Submit request
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
