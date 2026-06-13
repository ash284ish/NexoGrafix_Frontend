"use client";

import React, { useEffect, useState } from "react";
import { 
  FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiAlertTriangle, FiUpload, 
  FiEye, FiDownload, FiCheck, FiFolder, FiLock, FiGlobe, FiPlusCircle, FiMinusCircle 
} from "react-icons/fi";
import SectionHeader from "@/components/dashboard/assets/SectionHeader";
import ToastTopRight from "@/components/ui/Toast";

type Category = { id: number; name: string; slug: string };
type Industry = { id: number; name: string; slug: string };

type SampleRow = {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  detailed_description: string;
  featured_image: string | null;
  video_url: string | null;
  status: string;
  visibility: string;
  password?: string | null;
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
  seo_og_image: string | null;
  seo_canonical_url: string | null;
  views: number;
  downloads: number;
  categories: Category[];
  industries: Industry[];
  created_at: string;
};

type StatsSummary = {
  total_samples: number;
  total_views: number;
  total_downloads: number;
  total_leads: number;
};

function cx(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
}

function Button({
  children,
  onClick,
  tone = "slate",
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  tone?: "slate" | "orange" | "red";
  disabled?: boolean;
}) {
  const cls =
    tone === "orange"
      ? "bg-orange-500 text-white hover:bg-orange-600 disabled:bg-orange-400"
      : tone === "red"
      ? "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400"
      : "bg-white text-slate-900 hover:bg-slate-50 disabled:bg-slate-100";
  const ring = tone === "slate" ? "border border-slate-200/70" : "border border-transparent";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cx(
        "inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold shadow-sm transition disabled:cursor-not-allowed",
        cls,
        ring
      )}
    >
      {children}
    </button>
  );
}

export default function SamplesManagementPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

  const [samples, setSamples] = useState<SampleRow[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [stats, setStats] = useState<StatsSummary | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  
  const [editing, setEditing] = useState<SampleRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [autoSlug, setAutoSlug] = useState(true);
  const [shortDesc, setShortDesc] = useState("");
  const [detailedDesc, setDetailedDesc] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [statusVal, setStatusVal] = useState("published");
  const [visibilityVal, setVisibilityVal] = useState("public");
  const [passwordVal, setPasswordVal] = useState("");
  
  const [techInput, setTechInput] = useState("");
  const [techs, setTechs] = useState<string[]>([]);
  
  const [highlightInput, setHighlightInput] = useState("");
  const [highlights, setHighlights] = useState<string[]>([]);
  
  const [clientOutcome, setClientOutcome] = useState("");
  
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [beforeImage, setBeforeImage] = useState("");
  const [afterImage, setAfterImage] = useState("");
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [downloadFiles, setDownloadFiles] = useState<{ name: string; url: string }[]>([]);
  
  const [selectedCatIds, setSelectedCatIds] = useState<number[]>([]);
  const [selectedIndIds, setSelectedIndIds] = useState<number[]>([]);
  
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDesc, setSeoDesc] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");
  const [seoOgImage, setSeoOgImage] = useState("");
  const [seoCanonical, setSeoCanonical] = useState("");

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      
      const [samplesRes, catsRes, indsRes, statsRes] = await Promise.all([
        fetch(`${API_BASE}/api/v1/samples?include_private=true`, { headers: { "Authorization": `Bearer ${token}` } }),
        fetch(`${API_BASE}/api/v1/samples/categories`),
        fetch(`${API_BASE}/api/v1/samples/industries`),
        fetch(`${API_BASE}/api/v1/samples/stats/summary`, { headers: { "Authorization": `Bearer ${token}` } })
      ]);

      if (!samplesRes.ok || !catsRes.ok || !indsRes.ok) throw new Error("Failed to load sample library data");
      
      const samplesData = await samplesRes.json();
      const catsData = await catsRes.json();
      const indsData = await indsRes.json();
      
      setSamples(samplesData);
      setCategories(catsData);
      setIndustries(indsData);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (e: any) {
      setErr(e.message || "Failed to load samples");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (autoSlug) {
      setSlug(val.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, setter: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${API_BASE}/api/v1/samples/upload`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setter(data.url);
      showToast("success", "File uploaded successfully");
    } catch (err: any) {
      showToast("error", err.message || "File upload failed");
    }
  };

  const openCreate = () => {
    setCreating(true);
    setEditing(null);
    setTitle("");
    setSlug("");
    setAutoSlug(true);
    setShortDesc("");
    setDetailedDesc("");
    setFeaturedImage("");
    setVideoUrl("");
    setStatusVal("published");
    setVisibilityVal("public");
    setPasswordVal("");
    setTechs([]);
    setHighlights([]);
    setClientOutcome("");
    setTags([]);
    setGalleryImages([]);
    setBeforeImage("");
    setAfterImage("");
    setScreenshots([]);
    setDownloadFiles([]);
    setSelectedCatIds([]);
    setSelectedIndIds([]);
    setSeoTitle("");
    setSeoDesc("");
    setSeoKeywords("");
    setSeoOgImage("");
    setSeoCanonical("");
  };

  const openEdit = (s: SampleRow) => {
    setCreating(false);
    setEditing(s);
    setTitle(s.title);
    setSlug(s.slug);
    setAutoSlug(false);
    setShortDesc(s.short_description);
    setDetailedDesc(s.detailed_description);
    setFeaturedImage(s.featured_image || "");
    setVideoUrl(s.video_url || "");
    setStatusVal(s.status);
    setVisibilityVal(s.visibility);
    setPasswordVal(s.password || "");
    setTechs(s.technologies || []);
    setHighlights(s.project_highlights || []);
    setClientOutcome(s.client_outcome || "");
    setTags(s.tags || []);
    setGalleryImages(s.gallery_images || []);
    setBeforeImage(s.before_after_images?.before || "");
    setAfterImage(s.before_after_images?.after || "");
    setScreenshots(s.screenshots || []);
    setDownloadFiles(s.download_files || []);
    setSelectedCatIds(s.categories.map((c) => c.id));
    setSelectedIndIds(s.industries.map((ind) => ind.id));
    setSeoTitle(s.seo_title || "");
    setSeoDesc(s.seo_meta_description || "");
    setSeoKeywords(s.seo_meta_keywords || "");
    setSeoOgImage(s.seo_og_image || "");
    setSeoCanonical(s.seo_canonical_url || "");
  };

  const handleSave = async () => {
    if (!title.trim() || !slug.trim()) {
      showToast("error", "Title and slug are required");
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("access_token");
      
      const payload = {
        title: title.trim(),
        slug: slug.trim(),
        short_description: shortDesc.trim(),
        detailed_description: detailedDesc.trim(),
        featured_image: featuredImage || null,
        video_url: videoUrl || null,
        status: statusVal,
        visibility: visibilityVal,
        password: visibilityVal === "password_protected" ? passwordVal : null,
        technologies: techs.length ? techs : null,
        project_highlights: highlights.length ? highlights : null,
        client_outcome: clientOutcome.trim() || null,
        tags: tags.length ? tags : null,
        gallery_images: galleryImages.length ? galleryImages : null,
        before_after_images: (beforeImage || afterImage) ? { before: beforeImage, after: afterImage } : null,
        screenshots: screenshots.length ? screenshots : null,
        download_files: downloadFiles.length ? downloadFiles : null,
        category_ids: selectedCatIds,
        industry_ids: selectedIndIds,
        seo_title: seoTitle || null,
        seo_meta_description: seoDesc || null,
        seo_meta_keywords: seoKeywords || null,
        seo_og_image: seoOgImage || null,
        seo_canonical_url: seoCanonical || null
      };

      const url = creating 
        ? `${API_BASE}/api/v1/samples`
        : `${API_BASE}/api/v1/samples/${editing?.id}`;
      const method = creating ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed to save sample");
      }

      showToast("success", creating ? "Sample created successfully" : "Sample updated successfully");
      setCreating(false);
      setEditing(null);
      loadData();
    } catch (e: any) {
      showToast("error", e.message || "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (s: SampleRow) => {
    if (!window.confirm(`Are you sure you want to delete work sample "${s.title}"?`)) return;

    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${API_BASE}/api/v1/samples/${s.id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!res.ok) throw new Error("Failed to delete sample");
      showToast("success", "Sample deleted successfully");
      loadData();
    } catch (e: any) {
      showToast("error", e.message || "An error occurred");
    }
  };

  const toggleCategory = (id: number) => {
    setSelectedCatIds((prev) => 
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleIndustry = (id: number) => {
    setSelectedIndIds((prev) => 
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-6">
      <ToastTopRight
        toast={toast ? { type: toast.type, msg: toast.msg } : null}
        onClose={() => setToast(null)}
        duration={4000}
      />

      <SectionHeader
        title="Work Samples Management"
        subtitle="Manage client case studies, before/after images, and downloadable deliverables."
        right={
          <Button tone="orange" onClick={openCreate}>
            <FiPlus /> Create Sample
          </Button>
        }
      />

      {/* Stats Cards */}
      {stats && (
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-md bg-white p-4 shadow-sm ring-1 ring-slate-200/60">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Work Samples</div>
            <div className="mt-1.5 text-2xl font-bold text-slate-900">{stats.total_samples}</div>
          </div>
          <div className="rounded-md bg-white p-4 shadow-sm ring-1 ring-slate-200/60">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Views</div>
            <div className="mt-1.5 text-2xl font-bold text-slate-900">{stats.total_views}</div>
          </div>
          <div className="rounded-md bg-white p-4 shadow-sm ring-1 ring-slate-200/60">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total File Downloads</div>
            <div className="mt-1.5 text-2xl font-bold text-slate-900">{stats.total_downloads}</div>
          </div>
          <div className="rounded-md bg-white p-4 shadow-sm ring-1 ring-slate-200/60">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Service Leads</div>
            <div className="mt-1.5 text-2xl font-bold text-slate-900">{stats.total_leads}</div>
          </div>
        </div>
      )}

      {err && (
        <div className="mt-5 rounded-md bg-red-50 p-4 ring-1 ring-red-200 flex gap-3">
          <FiAlertTriangle className="mt-0.5 text-red-600" />
          <div>
            <div className="text-sm font-semibold text-red-800">Error loading data</div>
            <div className="text-sm text-red-700 mt-0.5">{err}</div>
          </div>
        </div>
      )}

      {/* Samples Table */}
      <div className="mt-6 overflow-x-auto rounded-md border border-slate-200 bg-white shadow-sm">
        <table className="w-full border-collapse text-left text-sm text-slate-700">
          <thead className="bg-slate-50 text-xs font-extrabold uppercase text-slate-600 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Categories</th>
              <th className="px-6 py-4">Industries</th>
              <th className="px-6 py-4">Status / Visibility</th>
              <th className="px-6 py-4 text-center">Views</th>
              <th className="px-6 py-4 text-center">Downloads</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-slate-400">Loading samples...</td>
              </tr>
            ) : samples.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-slate-400">No samples found. Click &quot;Create Sample&quot; to add your first work sample.</td>
              </tr>
            ) : (
              samples.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 font-bold text-slate-900">
                    <div>{s.title}</div>
                    <div className="mt-1 font-mono text-[10px] text-slate-400">/{s.slug}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {s.categories.map((c) => (
                        <span key={c.id} className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold text-slate-600">{c.name}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {s.industries.map((ind) => (
                        <span key={ind.id} className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold text-slate-600">{ind.name}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <span className={cx(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                        s.status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
                      )}>
                        {s.status}
                      </span>
                      <span className={cx(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                        s.visibility === "public" ? "bg-sky-50 text-sky-700" : s.visibility === "private" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"
                      )}>
                        {s.visibility}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center font-semibold text-slate-800">{s.views}</td>
                  <td className="px-6 py-4 text-center font-semibold text-slate-800">{s.downloads}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button onClick={() => openEdit(s)} className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900">
                        <FiEdit2 className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => handleDelete(s)} className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-red-600 hover:bg-red-50 hover:text-red-700">
                        <FiTrash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create / Edit Modal (Full screen slide-over scroll) */}
      {(creating || !!editing) && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => !submitting && (setCreating(false), setEditing(null))} />
          
          <div className="relative h-screen w-full max-w-4xl bg-white shadow-2xl flex flex-col z-10 animate-slide-in">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 shrink-0">
              <h3 className="text-lg font-bold text-slate-900">
                {creating ? "Create Work Sample" : `Edit Work Sample: ${title}`}
              </h3>
              <button 
                onClick={() => !submitting && (setCreating(false), setEditing(null))}
                className="h-9 w-9 border border-slate-200 rounded-md bg-white text-slate-600 hover:bg-slate-50 flex items-center justify-center"
              >
                <FiX />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Basic Details */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Sample Title</label>
                  <input
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. PDF Accessibility Remediation Case Study"
                    className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-300"
                  />
                </div>
                <div className="grid gap-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">URL Slug</label>
                  <input
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/ /g, "-"))}
                    placeholder="e.g. pdf-accessibility-remediation"
                    className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 font-mono outline-none focus:border-slate-300"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="grid gap-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Status</label>
                  <select
                    value={statusVal}
                    onChange={(e) => setStatusVal(e.target.value)}
                    className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-300 bg-white"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
                <div className="grid gap-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Visibility</label>
                  <select
                    value={visibilityVal}
                    onChange={(e) => setVisibilityVal(e.target.value)}
                    className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-300 bg-white"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                    <option value="password_protected">Password Protected</option>
                  </select>
                </div>
                {visibilityVal === "password_protected" && (
                  <div className="grid gap-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
                    <input
                      value={passwordVal}
                      onChange={(e) => setPasswordVal(e.target.value)}
                      placeholder="Enter password"
                      className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-300"
                    />
                  </div>
                )}
              </div>

              <div className="grid gap-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Short Description (Cards view)</label>
                <textarea
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  rows={2}
                  placeholder="Enter a brief description for cards grid view"
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-300"
                />
              </div>

              <div className="grid gap-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Detailed Description (Rich text editor format)</label>
                <textarea
                  value={detailedDesc}
                  onChange={(e) => setDetailedDesc(e.target.value)}
                  rows={6}
                  placeholder="<h3>Project Overview</h3><p>Describe project details here...</p>"
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 font-mono outline-none focus:border-slate-300"
                />
              </div>

              {/* Taxonomy (Categories & Industries) */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-md border border-slate-200 p-4">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Assign Categories</div>
                  <div className="max-h-40 overflow-y-auto space-y-1.5">
                    {categories.map((c) => {
                      const checked = selectedCatIds.includes(c.id);
                      return (
                        <button
                          type="button"
                          key={c.id}
                          onClick={() => toggleCategory(c.id)}
                          className={cx(
                            "flex w-full items-center justify-between rounded px-2.5 py-1.5 text-left text-xs font-semibold border transition",
                            checked ? "bg-orange-500/10 text-orange-700 border-orange-200" : "bg-white text-slate-700 border-slate-100 hover:bg-slate-50"
                          )}
                        >
                          {c.name}
                          {checked && <FiCheck className="h-3.5 w-3.5" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-md border border-slate-200 p-4">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Assign Industries</div>
                  <div className="max-h-40 overflow-y-auto space-y-1.5">
                    {industries.map((ind) => {
                      const checked = selectedIndIds.includes(ind.id);
                      return (
                        <button
                          type="button"
                          key={ind.id}
                          onClick={() => toggleIndustry(ind.id)}
                          className={cx(
                            "flex w-full items-center justify-between rounded px-2.5 py-1.5 text-left text-xs font-semibold border transition",
                            checked ? "bg-orange-500/10 text-orange-700 border-orange-200" : "bg-white text-slate-700 border-slate-100 hover:bg-slate-50"
                          )}
                        >
                          {ind.name}
                          {checked && <FiCheck className="h-3.5 w-3.5" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Assets & Files */}
              <div className="border-t border-slate-200 pt-6 space-y-4">
                <h4 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">File & Asset Management</h4>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Featured Image (URL)</label>
                    <div className="flex gap-2">
                      <input
                        value={featuredImage}
                        onChange={(e) => setFeaturedImage(e.target.value)}
                        placeholder="Image URL"
                        className="flex-1 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none"
                      />
                      <label className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer">
                        <FiUpload /> Upload
                        <input type="file" onChange={(e) => handleFileUpload(e, setFeaturedImage)} className="hidden" accept="image/*" />
                      </label>
                    </div>
                  </div>

                  <div className="grid gap-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Video URL (Embed or Direct)</label>
                    <input
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="e.g. YouTube embed link or direct URL"
                      className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none"
                    />
                  </div>
                </div>

                {/* Before / After */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Before Image (URL)</label>
                    <div className="flex gap-2">
                      <input
                        value={beforeImage}
                        onChange={(e) => setBeforeImage(e.target.value)}
                        placeholder="Before comparison image"
                        className="flex-1 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none"
                      />
                      <label className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer">
                        <FiUpload /> Upload
                        <input type="file" onChange={(e) => handleFileUpload(e, setBeforeImage)} className="hidden" accept="image/*" />
                      </label>
                    </div>
                  </div>
                  <div className="grid gap-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">After Image (URL)</label>
                    <div className="flex gap-2">
                      <input
                        value={afterImage}
                        onChange={(e) => setAfterImage(e.target.value)}
                        placeholder="After comparison image"
                        className="flex-1 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none"
                      />
                      <label className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer">
                        <FiUpload /> Upload
                        <input type="file" onChange={(e) => handleFileUpload(e, setAfterImage)} className="hidden" accept="image/*" />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Download Files List */}
                <div className="rounded-md border border-slate-200 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Downloadable Deliverables (PDF, EPUB, etc.)</label>
                    <label className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer">
                      <FiPlus /> Add & Upload File
                      <input 
                        type="file" 
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          await handleFileUpload(e, (url) => {
                            setDownloadFiles((prev) => [...prev, { name: file.name, url }]);
                          });
                        }} 
                        className="hidden" 
                      />
                    </label>
                  </div>
                  <div className="space-y-2">
                    {downloadFiles.map((file, idx) => (
                      <div key={idx} className="flex items-center gap-2 rounded bg-slate-50 p-2 text-xs font-semibold text-slate-700 border border-slate-100">
                        <span className="truncate flex-1">{file.name}</span>
                        <code className="text-slate-400 max-w-xs truncate">{file.url}</code>
                        <button 
                          type="button"
                          onClick={() => setDownloadFiles((prev) => prev.filter((_, i) => i !== idx))} 
                          className="text-red-500 hover:text-red-700"
                        >
                          <FiMinusCircle />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Technologies & Highlights & Outcome */}
              <div className="border-t border-slate-200 pt-6 space-y-4">
                <h4 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Technologies, Outcomes & Highlights</h4>

                {/* Techs */}
                <div className="grid gap-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Technologies Used</label>
                  <div className="flex gap-2">
                    <input
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      placeholder="e.g. Ace by DAISY (Press enter or click add)"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && techInput.trim()) {
                          e.preventDefault();
                          setTechs((prev) => [...prev, techInput.trim()]);
                          setTechInput("");
                        }
                      }}
                      className="flex-1 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (techInput.trim()) {
                          setTechs((prev) => [...prev, techInput.trim()]);
                          setTechInput("");
                        }
                      }}
                      className="rounded-md bg-slate-900 px-4 text-xs font-bold text-white hover:bg-slate-800"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {techs.map((t, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-800">
                        {t}
                        <button type="button" onClick={() => setTechs(prev => prev.filter((_, i) => i !== idx))} className="text-slate-400 hover:text-slate-600">
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Highlights */}
                <div className="grid gap-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Project Highlights (Key Bullet Points)</label>
                  <div className="flex gap-2">
                    <input
                      value={highlightInput}
                      onChange={(e) => setHighlightInput(e.target.value)}
                      placeholder="e.g. Achieved 100% compliance score on Ace checker"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && highlightInput.trim()) {
                          e.preventDefault();
                          setHighlights((prev) => [...prev, highlightInput.trim()]);
                          setHighlightInput("");
                        }
                      }}
                      className="flex-1 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (highlightInput.trim()) {
                          setHighlights((prev) => [...prev, highlightInput.trim()]);
                          setHighlightInput("");
                        }
                      }}
                      className="rounded-md bg-slate-900 px-4 text-xs font-bold text-white hover:bg-slate-800"
                    >
                      Add
                    </button>
                  </div>
                  <div className="space-y-1.5 mt-2">
                    {highlights.map((h, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-orange-500 shrink-0" />
                        <span className="flex-1">{h}</span>
                        <button type="button" onClick={() => setHighlights(prev => prev.filter((_, i) => i !== idx))} className="text-red-500 hover:text-red-700">
                          <FiMinusCircle />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Outcome */}
                <div className="grid gap-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Client Outcome / Benefits</label>
                  <textarea
                    value={clientOutcome}
                    onChange={(e) => setClientOutcome(e.target.value)}
                    rows={2}
                    placeholder="Describe direct outcome/benefit to client"
                    className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-300"
                  />
                </div>

                {/* Tags */}
                <div className="grid gap-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Tags</label>
                  <div className="flex gap-2">
                    <input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="e.g. Accessibility (Press enter or click add)"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && tagInput.trim()) {
                          e.preventDefault();
                          setTags((prev) => [...prev, tagInput.trim()]);
                          setTagInput("");
                        }
                      }}
                      className="flex-1 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (tagInput.trim()) {
                          setTags((prev) => [...prev, tagInput.trim()]);
                          setTagInput("");
                        }
                      }}
                      className="rounded-md bg-slate-900 px-4 text-xs font-bold text-white hover:bg-slate-800"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {tags.map((t, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-800">
                        {t}
                        <button type="button" onClick={() => setTags(prev => prev.filter((_, i) => i !== idx))} className="text-slate-400 hover:text-slate-600">
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* SEO Features */}
              <div className="border-t border-slate-200 pt-6 space-y-4">
                <h4 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">SEO Management</h4>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">SEO Title</label>
                    <input
                      value={seoTitle}
                      onChange={(e) => setSeoTitle(e.target.value)}
                      placeholder="SEO optimized title"
                      className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none"
                    />
                  </div>

                  <div className="grid gap-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">SEO Meta Keywords</label>
                    <input
                      value={seoKeywords}
                      onChange={(e) => setSeoKeywords(e.target.value)}
                      placeholder="e.g. pdf accessibility, pdf remediation"
                      className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none"
                    />
                  </div>
                </div>

                <div className="grid gap-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">SEO Meta Description</label>
                  <textarea
                    value={seoDesc}
                    onChange={(e) => setSeoDesc(e.target.value)}
                    rows={2}
                    placeholder="Short SEO meta description"
                    className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Open Graph Image (URL)</label>
                    <div className="flex gap-2">
                      <input
                        value={seoOgImage}
                        onChange={(e) => setSeoOgImage(e.target.value)}
                        placeholder="OG Image URL"
                        className="flex-1 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none"
                      />
                      <label className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer">
                        <FiUpload /> Upload
                        <input type="file" onChange={(e) => handleFileUpload(e, setSeoOgImage)} className="hidden" accept="image/*" />
                      </label>
                    </div>
                  </div>

                  <div className="grid gap-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Canonical URL</label>
                    <input
                      value={seoCanonical}
                      onChange={(e) => setSeoCanonical(e.target.value)}
                      placeholder="https://nexografix.com/samples/..."
                      className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4 shrink-0 bg-slate-50">
              <Button onClick={() => (setCreating(false), setEditing(null))} disabled={submitting}>
                Cancel
              </Button>
              <Button tone="orange" onClick={handleSave} disabled={submitting}>
                <FiSave /> {submitting ? "Saving..." : "Save Work Sample"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
