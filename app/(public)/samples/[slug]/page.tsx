"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { 
  FiArrowLeft, FiTag, FiGlobe, FiCpu, FiCheckCircle, FiDownload, 
  FiPlay, FiSend, FiLock, FiAlertTriangle, FiBookOpen, FiExternalLink 
} from "react-icons/fi";
import ToastTopRight from "@/components/ui/Toast";

type Category = { id: number; name: string; slug: string };
type Industry = { id: number; name: string; slug: string };

type Sample = {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  detailed_description: string;
  featured_image: string | null;
  video_url: string | null;
  status: string;
  visibility: string;
  technologies: string[] | null;
  project_highlights: string[] | null;
  client_outcome: string | null;
  tags: string[] | null;
  gallery_images: string[] | null;
  before_after_images: { before?: string; after?: string } | null;
  screenshots: string[] | null;
  download_files: { name: string; url: string }[] | null;
  seo_title: string | null;
  seo_meta_description: string | null;
  seo_meta_keywords: string | null;
  views: number;
  downloads: number;
  categories: Category[];
  industries: Industry[];
};

export default function PublicSampleDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const slug = String(params?.slug || "");

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

  const [sample, setSample] = useState<Sample | null>(null);
  const [related, setRelated] = useState<Sample[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // Password Protection Gate
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordErr, setPasswordErr] = useState<string | null>(null);

  // Lead Form State
  const [leadName, setLeadName] = useState("");
  const [leadCompany, setLeadCompany] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadService, setLeadService] = useState("");
  const [leadMessage, setLeadMessage] = useState("");
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
  };

  const fetchSample = async (pw?: string) => {
    try {
      setLoading(true);
      setErr(null);
      setPasswordErr(null);

      const url = pw 
        ? `${API_BASE}/api/v1/samples/${slug}?password=${encodeURIComponent(pw)}`
        : `${API_BASE}/api/v1/samples/${slug}`;

      const res = await fetch(url);
      
      if (res.status === 403) {
        const data = await res.json();
        if (data.detail === "password_required") {
          setPasswordRequired(true);
          setLoading(false);
          return;
        }
      }

      if (!res.ok) {
        throw new Error("Failed to load sample. It may not exist or requires authentication.");
      }

      const data = await res.json();
      setSample(data);
      setPasswordRequired(false);

      // Increment views count on load
      fetch(`${API_BASE}/api/v1/samples/${data.id}/view`, { method: "POST" }).catch(() => {});

      // Fetch related samples
      const listRes = await fetch(`${API_BASE}/api/v1/samples`);
      if (listRes.ok) {
        const allSamples: Sample[] = await listRes.json();
        const relatedList = allSamples
          .filter((item) => item.id !== data.id && item.categories.some((c) => data.categories.map(dc => dc.id).includes(c.id)))
          .slice(0, 3);
        setRelated(relatedList);
      }
    } catch (e: any) {
      setErr(e.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchSample();
    }
  }, [slug]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim()) return;
    fetchSample(passwordInput);
  };

  const handleDownloadClick = async (fileId: number, fileUrl: string) => {
    if (!sample) return;
    
    // Increment download count in background
    fetch(`${API_BASE}/api/v1/samples/${sample.id}/download`, { method: "POST" }).catch(() => {});
    
    // Trigger download
    window.open(fileUrl, "_blank");
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName.trim() || !leadEmail.trim() || !leadMessage.trim()) {
      showToast("error", "Name, Email, and Message are required");
      return;
    }

    try {
      setLeadSubmitting(true);
      const res = await fetch(`${API_BASE}/api/v1/samples/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sample_id: sample?.id || null,
          name: leadName.trim(),
          company: leadCompany.trim() || null,
          email: leadEmail.trim(),
          phone: leadPhone.trim() || null,
          service_required: leadService.trim() || null,
          message: leadMessage.trim(),
        }),
      });

      if (!res.ok) throw new Error("Failed to submit inquiry");

      showToast("success", "Your inquiry was submitted successfully! We will get in touch shortly.");
      setLeadName("");
      setLeadCompany("");
      setLeadEmail("");
      setLeadPhone("");
      setLeadService("");
      setLeadMessage("");
    } catch (err: any) {
      showToast("error", err.message || "Failed to submit request");
    } finally {
      setLeadSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-24 text-center text-slate-500 animate-pulse">
        <div className="h-8 w-64 bg-slate-200 rounded mx-auto mb-4" />
        <div className="h-4 w-96 bg-slate-200 rounded mx-auto mb-8" />
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2 h-96 bg-slate-200 rounded" />
          <div className="h-96 bg-slate-200 rounded" />
        </div>
      </div>
    );
  }

  // Password Lock Gate
  if (passwordRequired) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-md space-y-6">
          <div className="mx-auto w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
            <FiLock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Password Protected Case Study</h2>
            <p className="text-xs font-semibold text-slate-500 mt-1.5 leading-relaxed">
              This work sample contains private client deliverables. Enter the access password to view.
            </p>
          </div>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Enter Access Password"
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-center outline-none focus:border-orange-500"
            />
            {passwordErr && <div className="text-xs text-red-600 font-semibold">{passwordErr}</div>}
            <button
              type="submit"
              className="w-full rounded-md bg-slate-900 py-2.5 text-sm font-bold text-white hover:bg-slate-800 transition"
            >
              Verify & Unlock
            </button>
          </form>
          <div className="text-xs font-semibold">
            <Link href="/samples" className="text-orange-600 hover:underline">
              &larr; Back to Sample Directory
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (err || !sample) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <div className="rounded-xl border border-red-200 bg-red-50 p-8 shadow-sm space-y-4">
          <FiAlertTriangle className="mx-auto w-12 h-12 text-red-600" />
          <h2 className="text-xl font-bold text-red-800">Sample Not Found</h2>
          <p className="text-sm text-red-700">{err || "The requested work sample could not be found."}</p>
          <Link href="/samples" className="inline-block rounded-md bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800">
            Back to Directory
          </Link>
        </div>
      </div>
    );
  }

  const featuredImgUrl = sample.featured_image || "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1000&q=80";

  return (
    <div className="relative overflow-hidden bg-white py-12 lg:py-20">
      <ToastTopRight
        toast={toast ? { type: toast.type, msg: toast.msg } : null}
        onClose={() => setToast(null)}
        duration={4000}
      />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-0 h-130 w-130 rounded-full bg-orange-500/5 blur-3xl" />
        <div className="absolute bottom-20 right-0 h-150 w-150 rounded-full bg-orange-300/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Breadcrumb & Navigation */}
        <div className="mb-6">
          <Link href="/samples" className="inline-flex items-center gap-1.5 text-xs font-extrabold text-orange-600 hover:text-orange-700 hover:underline">
            <FiArrowLeft /> Back to Directory
          </Link>
        </div>

        {/* Title Block */}
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 text-xs font-extrabold uppercase tracking-wider text-orange-600">
            {sample.categories.map((c) => (
              <span key={c.id} className="inline-flex items-center gap-1 bg-orange-500/10 px-2.5 py-1 rounded-full"><FiTag /> {c.name}</span>
            ))}
            {sample.industries.map((ind) => (
              <span key={ind.id} className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full"><FiGlobe /> {ind.name}</span>
            ))}
          </div>
          <h1 className="text-3xl font-black text-slate-900 leading-tight sm:text-4xl md:text-5xl max-w-4xl">
            {sample.title}
          </h1>
          <p className="text-base font-semibold text-slate-500 max-w-2xl leading-relaxed">
            {sample.short_description}
          </p>
        </div>

        {/* Layout Grid split */}
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
          {/* Main Column */}
          <div className="space-y-8 min-w-0">
            {/* Featured Image card */}
            <div className="relative aspect-16/9 w-full overflow-hidden rounded-xl border border-slate-200/80 bg-slate-50 shadow-sm">
              <Image
                src={featuredImgUrl}
                alt={sample.title}
                fill
                unoptimized
                className="object-contain"
              />
            </div>

            {/* Detailed description */}
            <div className="prose prose-slate max-w-none">
              <div 
                dangerouslySetInnerHTML={{ __html: sample.detailed_description }} 
                className="text-slate-700 font-medium leading-relaxed space-y-4 text-sm"
              />
            </div>

            {/* Before / After Section */}
            {sample.before_after_images && (sample.before_after_images.before || sample.before_after_images.after) && (
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                <h3 className="text-base font-extrabold text-slate-900 uppercase tracking-wider">Before / After Comparison</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {sample.before_after_images.before && (
                    <div className="space-y-1.5">
                      <div className="text-xs font-bold text-slate-500 uppercase">Original Format / Before</div>
                      <div className="relative aspect-4/3 overflow-hidden rounded-md border border-slate-100">
                        <Image src={sample.before_after_images.before} alt="Before deliverable" fill unoptimized className="object-contain" />
                      </div>
                    </div>
                  )}
                  {sample.before_after_images.after && (
                    <div className="space-y-1.5">
                      <div className="text-xs font-bold text-orange-600 uppercase">Accessible output / After</div>
                      <div className="relative aspect-4/3 overflow-hidden rounded-md border border-orange-100">
                        <Image src={sample.before_after_images.after} alt="After deliverable" fill unoptimized className="object-contain" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Video Demonstration */}
            {sample.video_url && (
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                <h3 className="text-base font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <FiPlay className="text-orange-500" /> Video Demonstration
                </h3>
                <div className="aspect-video w-full rounded-md bg-slate-950 overflow-hidden relative">
                  {sample.video_url.includes("youtube.com") || sample.video_url.includes("youtu.be") ? (
                    <iframe
                      src={sample.video_url}
                      className="absolute inset-0 w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video src={sample.video_url} controls className="absolute inset-0 w-full h-full object-contain" />
                  )}
                </div>
              </div>
            )}

            {/* Screenshots Gallery */}
            {sample.screenshots && sample.screenshots.length > 0 && (
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                <h3 className="text-base font-extrabold text-slate-900 uppercase tracking-wider">Project Screenshots</h3>
                <div className="grid gap-4 grid-cols-2 sm:grid-cols-3">
                  {sample.screenshots.map((s, idx) => (
                    <div key={idx} className="relative aspect-4/3 overflow-hidden rounded-md border border-slate-100 bg-slate-50 group cursor-pointer">
                      <Image src={s} alt={`Screenshot ${idx + 1}`} fill unoptimized className="object-contain transition hover:scale-[1.04]" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Client Outcomes / Benefits */}
            {sample.client_outcome && (
              <div className="rounded-xl border border-orange-200 bg-orange-50/20 p-6 shadow-sm space-y-3">
                <h3 className="text-sm font-black text-orange-600 uppercase tracking-wider">Client Outcomes & Benefits</h3>
                <p className="text-sm font-semibold text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {sample.client_outcome}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            {/* Download Deliverables */}
            {sample.download_files && sample.download_files.length > 0 && (
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Download Files</h3>
                <div className="space-y-2.5">
                  {sample.download_files.map((file, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleDownloadClick(idx, file.url)}
                      className="w-full flex items-center justify-between rounded-md border border-slate-200 hover:border-orange-500 hover:bg-orange-50/10 px-4 py-3 text-left text-xs font-extrabold text-slate-700 transition"
                    >
                      <span className="truncate flex-1 pr-4">{file.name}</span>
                      <FiDownload className="text-orange-500 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Technologies pills */}
            {sample.technologies && sample.technologies.length > 0 && (
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <FiCpu className="text-slate-400" /> Technologies Used
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {sample.technologies.map((tech) => (
                    <span key={tech} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Project Highlights list */}
            {sample.project_highlights && sample.project_highlights.length > 0 && (
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Project Highlights</h3>
                <ul className="space-y-3">
                  {sample.project_highlights.map((h, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs font-semibold text-slate-700 leading-relaxed">
                      <FiCheckCircle className="mt-0.5 text-orange-500 shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Lead generation request form */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Request Similar Service</h3>
                <p className="text-[11px] font-semibold text-slate-500 mt-1 leading-relaxed">
                  Interested in dynamic accessibility, digitization or localization services? Submit below.
                </p>
              </div>

              <form onSubmit={handleLeadSubmit} className="space-y-3">
                <input
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  placeholder="Your Name *"
                  required
                  className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-900 outline-none focus:border-orange-500"
                />
                <input
                  value={leadCompany}
                  onChange={(e) => setLeadCompany(e.target.value)}
                  placeholder="Company Name"
                  className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-900 outline-none focus:border-orange-500"
                />
                <input
                  type="email"
                  value={leadEmail}
                  onChange={(e) => setLeadEmail(e.target.value)}
                  placeholder="Email Address *"
                  required
                  className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-900 outline-none focus:border-orange-500"
                />
                <input
                  value={leadPhone}
                  onChange={(e) => setLeadPhone(e.target.value)}
                  placeholder="Phone Number"
                  className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-900 outline-none focus:border-orange-500"
                />
                <input
                  value={leadService}
                  onChange={(e) => setLeadService(e.target.value)}
                  placeholder="Service Required"
                  className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-900 outline-none focus:border-orange-500"
                />
                <textarea
                  value={leadMessage}
                  onChange={(e) => setLeadMessage(e.target.value)}
                  placeholder="Enter message details... *"
                  required
                  rows={4}
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-orange-500"
                />
                <button
                  type="submit"
                  disabled={leadSubmitting}
                  className="w-full flex items-center justify-center gap-2 rounded-md bg-orange-500 py-2.5 text-xs font-extrabold text-white hover:bg-orange-600 transition disabled:opacity-60"
                >
                  <FiSend /> {leadSubmitting ? "Submitting..." : "Send Request"}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Related Samples section */}
        {related.length > 0 && (
          <div className="mt-16 border-t border-slate-200 pt-16">
            <h2 className="text-2xl font-black text-slate-900">Related Case Studies</h2>
            <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => {
                const img = item.featured_image || "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=500&q=80";
                return (
                  <div key={item.id} className="group rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition">
                    <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-50">
                      <Image src={img} alt={item.title} fill unoptimized className="object-contain transition duration-500 group-hover:scale-[1.03]" />
                    </div>
                    <div className="p-5 space-y-3">
                      <div className="text-[10px] font-extrabold tracking-wider text-orange-600 uppercase flex items-center gap-1">
                        <FiTag /> {item.categories[0]?.name || "Case Study"}
                      </div>
                      <h3 className="font-extrabold text-slate-900 leading-snug group-hover:text-orange-600 transition">
                        <Link href={`/samples/${item.slug}`}>{item.title}</Link>
                      </h3>
                      <p className="text-xs font-semibold text-slate-500 line-clamp-2 leading-relaxed">{item.short_description}</p>
                      <Link href={`/samples/${item.slug}`} className="inline-flex items-center gap-1 text-xs font-extrabold text-orange-600 hover:text-orange-700 mt-2 hover:underline">
                        Read Case Study &rarr;
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
