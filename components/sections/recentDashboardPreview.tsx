"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    Folder,
    CreditCard,
    User,
    HelpCircle,
    LogOut,
    Search,
    Bell,
    MessageCircle,
    Upload,
    FolderOpen,
    CheckCircle,
    MessageSquare,
    Timer,
    Download,
    Trash2,
    MoreHorizontal,
    ArrowUpDown,
    Filter,
    Plus,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const DASHBOARD_PREVIEW_URL = `${API_BASE}/api/v1/content/dashboard-preview`;

type Page =
    | "dashboard"
    | "projects"
    | "billing"
    | "settings"
    | "privacy"
    | "security"
    | "profile"
    | "preferences"
    | "support"
    | "upload"
    | "review-images"
    | "generate-alt"
    | "review-approve"
    | "export";

type IconType = React.ComponentType<{ className?: string }>;

type DashboardPreviewJson = Record<string, unknown>;

function pick<T>(obj: unknown, path: string, fallback: T): T {
    if (!obj || typeof obj !== "object") return fallback;
    const parts = path.split(".").filter(Boolean);
    let cur: unknown = obj;
    for (const p of parts) {
        if (cur && typeof cur === "object" && p in (cur as Record<string, unknown>)) {
            cur = (cur as Record<string, unknown>)[p];
        } else {
            return fallback;
        }
    }
    return (cur as T) ?? fallback;
}

function asArray<T>(v: unknown, fallback: T[]): T[] {
    return Array.isArray(v) ? (v as T[]) : fallback;
}

export default function DashboardRemoteStyle() {
    const [page, setPage] = useState<Page>("dashboard");
    const [altFlowOpen, setAltFlowOpen] = useState(true);
    const [onboardingStep, setOnboardingStep] = useState<number | null>(0);

    const [cms, setCms] = useState<DashboardPreviewJson | null>(null);
    const [cmsLoading, setCmsLoading] = useState(true);
    const [cmsError, setCmsError] = useState("");

    const onboardingFlow: Page[] = [
        "dashboard",
        "projects",
        "upload",
        "review-images",
        "generate-alt",
        "review-approve",
        "export",
    ];

    const goToPage = (p: Page) => {
        setPage(p);
        if (
            p === "upload" ||
            p === "review-images" ||
            p === "generate-alt" ||
            p === "review-approve" ||
            p === "export"
        ) {
            setAltFlowOpen(true);
        }
    };

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setCmsLoading(true);
                setCmsError("");
                const res = await fetch(DASHBOARD_PREVIEW_URL, {
                    method: "GET",
                    headers: { Accept: "application/json" },
                    cache: "no-store",
                });
                if (!res.ok) {
                    const t = await res.text().catch(() => "");
                    throw new Error(t || `Request failed (${res.status})`);
                }
                const data = (await res.json()) as DashboardPreviewJson;
                if (!mounted) return;
                setCms(data);
            } catch (e: unknown) {
                if (!mounted) return;
                setCmsError(String(e instanceof Error ? e.message : "Failed to load content"));
            } finally {
                if (!mounted) return;
                setCmsLoading(false);
            }
        })();
        return () => {
            mounted = false;
        };
    }, []);

    return (
        <div className="relative flex h-screen w-full overflow-hidden bg-slate-100">
            <Sidebar
                page={page}
                setPage={goToPage}
                altFlowOpen={altFlowOpen}
                setAltFlowOpen={setAltFlowOpen}
            />

            <div className="flex min-w-0 flex-1 flex-col">
                <TopBar cms={cms} />

                <main className="min-w-0 flex-1 overflow-y-auto px-6 py-6">
                    {onboardingStep !== null && page === onboardingFlow[onboardingStep] && (
                        <OnboardingPopup
                            cms={cms}
                            step={onboardingStep}
                            onNext={() => {
                                if (onboardingStep === null) return;

                                const nextStep = onboardingStep + 1;

                                if (nextStep >= onboardingFlow.length) {
                                    setOnboardingStep(null);
                                    return;
                                }

                                const nextPage = onboardingFlow[nextStep];
                                goToPage(nextPage);
                                setOnboardingStep(nextStep);
                            }}
                        />
                    )}

                    {cmsLoading ? (
                        <div className="rounded-md border border-slate-200 bg-white p-6 text-sm text-slate-600">
                            Loading content...
                        </div>
                    ) : cmsError ? (
                        <div className="rounded-md border border-rose-200 bg-white p-6 text-sm text-rose-700">
                            Failed to load content. Showing fallback content.
                        </div>
                    ) : null}

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={page}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.22 }}
                            className="min-w-0"
                        >
                            {renderPage(page, goToPage, cms)}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}

function renderPage(page: Page, setPage: (p: Page) => void, cms: DashboardPreviewJson | null) {
    switch (page) {
        case "dashboard":
            return <PayrollPage cms={cms} onUploadClick={() => setPage("upload")} />;

        case "projects":
            return <ProjectsPage cms={cms} />;

        case "upload":
            return <UploadPdfPage cms={cms} />;

        case "review-images":
            return <ExtractedImagesPage cms={cms} />;

        case "generate-alt":
            return <AltTextEditorPage cms={cms} />;

        case "review-approve":
            return <ReviewApprovalPage cms={cms} />;

        case "export":
            return <ExportResultsPage cms={cms} />;

        default:
            return (
                <div className="rounded-md border border-slate-200 bg-white p-6 text-sm text-slate-600">
                    This section is not available yet.
                </div>
            );
    }
}
function Sidebar({
    page,
    setPage,
    altFlowOpen,
    setAltFlowOpen,
}: {
    page: Page;
    setPage: (p: Page) => void;
    altFlowOpen: boolean;
    setAltFlowOpen: (v: boolean) => void;
}) {
    return (
        <aside className="flex w-50 shrink-0 flex-col bg-linear-to-b from-[#0B1A2E] to-[#081425] px-4 py-5 text-white">
            <div className="mb-6 flex items-center gap-2 px-1">
                <img src="/images/logo.png" alt="Arohio" className="h-10 w-auto" />
            </div>

            <nav className="space-y-1 text-sm">
                <NavItem
                    icon={LayoutDashboard}
                    label="Dashboard"
                    active={page === "dashboard"}
                    onClick={() => setPage("dashboard")}
                />

                <div className="mt-2">
                    <NavItem
                        icon={MessageCircle}
                        label="Alt Text Flow"
                        active={
                            page === "upload" ||
                            page === "review-images" ||
                            page === "generate-alt" ||
                            page === "review-approve" ||
                            page === "export"
                        }
                        onClick={() => setAltFlowOpen(!altFlowOpen)}
                        right={
                            <span
                                className={`ml-auto text-white/70 transition ${altFlowOpen ? "rotate-180" : ""}`}
                            >
                                ▾
                            </span>
                        }
                    />

                    <AnimatePresence initial={false}>
                        {altFlowOpen ? (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                            >
                                <div className="ml-7 mt-1 space-y-1">
                                    <NavSubItem
                                        icon={Upload}
                                        label="Upload PDF"
                                        active={page === "upload"}
                                        onClick={() => setPage("upload")}
                                    />
                                    <NavSubItem
                                        icon={FolderOpen}
                                        label="Review Images"
                                        active={page === "review-images"}
                                        onClick={() => setPage("review-images")}
                                    />
                                    <NavSubItem
                                        icon={MessageSquare}
                                        label="Generate Alt Text"
                                        active={page === "generate-alt"}
                                        onClick={() => setPage("generate-alt")}
                                    />
                                    <NavSubItem
                                        icon={CheckCircle}
                                        label="Review & Approve"
                                        active={page === "review-approve"}
                                        onClick={() => setPage("review-approve")}
                                    />
                                    <NavSubItem
                                        icon={Download}
                                        label="Export Results"
                                        active={page === "export"}
                                        onClick={() => setPage("export")}
                                    />
                                </div>
                            </motion.div>
                        ) : null}
                    </AnimatePresence>
                </div>

                <NavItem
                    icon={Folder}
                    label="Projects"
                    active={page === "projects"}
                    onClick={() => setPage("projects")}
                />

                <NavItem icon={CreditCard} label="Billing & Subscription" />

                <NavItem icon={User} label="My Profile" />

                <NavItem icon={HelpCircle} label="Help / Support" />
            </nav>

            <div className="mt-auto pt-4">
                <NavItem icon={LogOut} label="Logout" active={false} danger />
            </div>
        </aside>
    );
}

function NavItem({
    label,
    active,
    icon: Icon,
    onClick,
    right,
    danger,
}: {
    label: string;
    active?: boolean;
    icon?: IconType;
    onClick?: () => void;
    right?: React.ReactNode;
    danger?: boolean;
}) {
    const base = "flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition";
    const activeCls = "bg-white/12 text-white shadow-[0_10px_28px_rgba(0,0,0,0.20)]";
    const idleCls = "text-white/80 hover:bg-white/8";
    const dangerCls = "text-rose-200 hover:text-rose-100 hover:bg-rose-500/10";

    return (
        <button
            onClick={onClick}
            className={[base, active ? activeCls : idleCls, danger ? dangerCls : ""].join(" ")}
        >
            {Icon ? <Icon className="h-4 w-4 opacity-90" /> : null}
            <span className="font-medium">{label}</span>
            {right}
        </button>
    );
}

function NavSubItem({
    label,
    icon: Icon,
    active,
    onClick,
}: {
    label: string;
    icon?: IconType;
    active?: boolean;
    onClick?: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-[13px] transition ${active ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/6 hover:text-white/85"
                }`}
        >
            {Icon ? <Icon className="h-4 w-4 opacity-90" /> : null}
            <span className="font-medium">{label}</span>
        </button>
    );
}

function TopBar({ cms }: { cms: DashboardPreviewJson | null }) {
    const navItems = asArray<{ label: string }>(pick(cms, "topbar.nav", []), [
        { label: "Home" },
        { label: "Features" },
        { label: "Blog" },
        { label: "About Us" },
    ]);

    const avatarSrc = pick(
        cms,
        "topbar.avatar_src",
        "https://www.gstatic.com/images/branding/product/1x/avatar_circle_blue_512dp.png"
    );

    return (
        <header className="relative flex h-14 items-center justify-end border-b border-slate-200 bg-white px-6">
            <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-6 text-sm font-medium text-slate-700">
                {navItems.map((it) => (
                    <span key={it.label} className="cursor-pointer hover:text-slate-900">
                        {it.label}
                    </span>
                ))}
            </nav>

            <div className="flex items-center gap-3">
                <button className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100">
                    <Search className="h-4 w-4" />
                </button>

                <button className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100">
                    <Bell className="h-4 w-4" />
                </button>

                <button className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100">
                    <MessageCircle className="h-4 w-4" />
                </button>

                <div className="h-9 w-9 overflow-hidden rounded-full border border-slate-200">
                    <Image src={avatarSrc} alt="User avatar" width={36} height={36} />
                </div>

                <button className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100">
                    <LogOut className="h-4 w-4" />
                </button>
            </div>
        </header>
    );
}

function PayrollPage({ onUploadClick, cms }: { onUploadClick: () => void; cms: DashboardPreviewJson | null }) {
    const fallbackNotices = [
        { title: "Your PDF extraction is complete.", time: "2 min ago" },
        { title: "New SEO alt text feature released.", time: "1 day ago" },
        { title: "Subscription renewal due in 5 days.", time: "3 days ago" },
    ];

    const notices = asArray<{ title: string; time: string }>(
        pick(cms, "dashboard.notifications.items", []),
        fallbackNotices
    );

    const welcomeTitle = pick(cms, "dashboard.hero.title", "Welcome back,");
    const welcomeName = pick(cms, "dashboard.hero.name", "Sarah K");
    const welcomeSubtitle = pick(cms, "dashboard.hero.subtitle", "Here’s your accessibility progress today.");
    const uploadCta = pick(cms, "dashboard.hero.upload_cta", "Upload PDF");

    const creditsTitle = pick(cms, "dashboard.credits.title", "Credits Overview");
    const creditsSubtitle = pick(cms, "dashboard.credits.subtitle", "Remaining Credits");
    const creditsCta = pick(cms, "dashboard.credits.cta", "Buy More");
    const creditsUsed = Number(pick(cms, "dashboard.credits.used", 120));
    const creditsTotal = Number(pick(cms, "dashboard.credits.total", 200));
    const creditsPct =
        creditsTotal > 0 ? Math.max(0, Math.min(100, Math.round((creditsUsed / creditsTotal) * 100))) : 60;

    const analyticsTitle = pick(cms, "dashboard.analytics.title", "Analytics Snapshot");
    const analyticsSubtitle = pick(cms, "dashboard.analytics.subtitle", "Last 5 days");
    const analyticsLabels = asArray<string>(pick(cms, "dashboard.analytics.labels", []), [
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
    ]);
    const analyticsPoints = asArray<number>(pick(cms, "dashboard.analytics.points", []), [110, 90, 40, 70, 50]);

    const polylinePoints = useMemo(() => {
        const n = analyticsPoints.length || 5;
        const step = n > 1 ? 400 / (n - 1) : 0;
        return analyticsPoints.map((y, i) => `${i * step},${y}`).join(" ");
    }, [analyticsPoints]);

    const quickActions = asArray<{ label: string; icon?: string }>(
        pick(cms, "dashboard.quick_actions.items", []),
        [
            { label: "View All Projects", icon: "FolderOpen" },
            { label: "Check SEO Alt Text", icon: "CheckCircle" },
            { label: "Upload New PDF", icon: "Upload" },
            { label: "Open Chatbot", icon: "MessageSquare" },
        ]
    );

    const productivityLabel = pick(cms, "dashboard.productivity.label", "Productivity gain");
    const productivityValue = pick(cms, "dashboard.productivity.value", "10 hours saved");
    const productivitySub = pick(
        cms,
        "dashboard.productivity.subtitle",
        "this month through automated accessibility workflows"
    );

    const iconMap: Record<string, IconType> = {
        FolderOpen,
        CheckCircle,
        Upload,
        MessageSquare,
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h1 className="text-3xl font-semibold text-slate-900">
                        {welcomeTitle} <span className="text-teal-600">{welcomeName} </span>
                    </h1>
                    <p className="mt-1 text-sm text-slate-600">{welcomeSubtitle}</p>
                </div>

                <button
                    onClick={onUploadClick}
                    className="inline-flex items-center gap-2 rounded-md bg-teal-500 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-teal-600"
                >
                    <Upload className="h-4 w-4" />
                    {uploadCta}
                </button>
            </div>

            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 space-y-6 lg:col-span-8">
                    <div className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="text-md font-semibold text-slate-900">{creditsTitle}</div>
                                <div className="mt-1 text-sm text-slate-500">{creditsSubtitle}</div>
                            </div>
                            <button className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
                                {creditsCta}
                            </button>
                        </div>

                        <div className="mt-6 flex items-end gap-2">
                            <div className="text-3xl font-semibold text-slate-900">{creditsUsed}</div>
                            <div className="pb-1 text-sm text-slate-500">/ {creditsTotal} left</div>
                        </div>

                        <div className="mt-4 h-3 w-full rounded-md bg-teal-50">
                            <div className="h-3 rounded-md bg-teal-500" style={{ width: `${creditsPct}%` }} />
                        </div>
                    </div>

                    <div className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
                        <div>
                            <div className="text-md font-semibold text-slate-900">{analyticsTitle}</div>
                            <div className="mt-1 text-sm text-slate-500">{analyticsSubtitle}</div>
                        </div>

                        <div className="mt-6 rounded-md bg-slate-50 p-4">
                            <svg viewBox="0 0 500 160" className="h-45 w-full">
                                {[0, 1, 2, 3].map((i) => (
                                    <line
                                        key={i}
                                        x1="0"
                                        y1={30 + i * 35}
                                        x2="500"
                                        y2={30 + i * 35}
                                        stroke="#e5e7eb"
                                        strokeDasharray="4 4"
                                    />
                                ))}

                                <polyline points={polylinePoints || "0,110 100,90 200,40 300,70 400,50"} fill="none" stroke="#14b8a6" strokeWidth="3" />

                                {(analyticsPoints.length ? analyticsPoints : [110, 90, 40, 70, 50]).map((y, i) => {
                                    const n = (analyticsPoints.length ? analyticsPoints : [110, 90, 40, 70, 50]).length;
                                    const step = n > 1 ? 400 / (n - 1) : 0;
                                    return <circle key={i} cx={i * step} cy={y} r="4" fill="#14b8a6" />;
                                })}
                            </svg>

                            <div className="mt-4 flex justify-between text-sm font-medium text-slate-600">
                                {(analyticsLabels.length ? analyticsLabels : ["Mon", "Tue", "Wed", "Thu", "Fri"]).map((d) => (
                                    <span key={d}>{d}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-span-12 space-y-6 lg:col-span-4">
                    <div className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="text-md font-semibold text-slate-900">
                            {pick(cms, "dashboard.notifications.title", "Notifications")}
                        </div>

                        <div className="mt-5 space-y-5">
                            {notices.map((n) => (
                                <div key={n.title} className="flex gap-4">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-md bg-teal-50 text-teal-600">
                                        <Bell className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-900">{n.title}</div>
                                        <div className="mt-1 text-xs text-slate-500">{n.time}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="text-md font-semibold text-slate-900">
                            {pick(cms, "dashboard.quick_actions.title", "Quick Actions")}
                        </div>

                        <div className="mt-5 grid grid-cols-2 gap-4">
                            {quickActions.map((a) => {
                                const Icon = a.icon && iconMap[a.icon] ? iconMap[a.icon] : FolderOpen;
                                return (
                                    <button
                                        key={a.label}
                                        aria-label={a.label}
                                        className="group flex h-16 items-center justify-center rounded-md border border-dashed border-slate-200 bg-white transition hover:bg-slate-50 hover:border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-200"
                                    >
                                        <Icon className="h-6 w-6 text-teal-600 transition group-hover:scale-105" />
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <div className="rounded-md border border-emerald-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-md bg-emerald-100 text-emerald-600">
                        <Timer className="h-6 w-6" />
                    </div>

                    <div className="flex-1">
                        <div className="text-sm font-medium text-slate-600">{productivityLabel}</div>
                        <div className="mt-1 text-3xl font-semibold text-slate-900">{productivityValue}</div>
                        <div className="mt-1 text-sm text-slate-500">{productivitySub}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function UploadPdfPage({ cms }: { cms: DashboardPreviewJson | null }) {
    const [files, setFiles] = React.useState<File[]>([]);
    const [dragOver, setDragOver] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    const pickFiles = () => inputRef.current?.click();

    const addFiles = (incoming: FileList | null) => {
        if (!incoming) return;
        const pdfs = Array.from(incoming).filter(
            (f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf")
        );
        setFiles((prev) => {
            const map = new Map<string, File>();
            [...prev, ...pdfs].forEach((f) => map.set(`${f.name}_${f.size}`, f));
            return Array.from(map.values());
        });
    };

    const onDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
        e.preventDefault();
        setDragOver(false);
        addFiles(e.dataTransfer.files);
    };

    const removeFile = (key: string) => {
        setFiles((prev) => prev.filter((f) => `${f.name}_${f.size}` !== key));
    };

    const clearAll = () => setFiles([]);

    const totalSizeMB =
        Math.round((files.reduce((s, f) => s + f.size, 0) / (1024 * 1024)) * 10) / 10;

    const title = pick(cms, "upload.title", "Upload PDFs for Image Extraction");
    const subtitle = pick(
        cms,
        "upload.subtitle",
        "Upload your PDFs. Arohio will extract images and prepare them for alt-text generation."
    );

    return (
        <div className="min-w-0 space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                    <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
                    <p className="mt-1 text-sm text-slate-600">{subtitle}</p>

                    <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700">
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-teal-50 text-teal-700">
                            1
                        </span>
                        <span>Upload</span>
                        <span className="text-slate-300">›</span>
                        <span className="text-slate-500">Review Images</span>
                        <span className="text-slate-300">›</span>
                        <span className="text-slate-500">Generate</span>
                        <span className="text-slate-300">›</span>
                        <span className="text-slate-500">Approve</span>
                        <span className="text-slate-300">›</span>
                        <span className="text-slate-500">Export</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={pickFiles}
                        className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                    >
                        <Upload className="h-4 w-4" />
                        Add PDFs
                    </button>

                    <button
                        disabled={files.length === 0}
                        className="inline-flex items-center gap-2 rounded-md bg-teal-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        Upload All
                    </button>
                </div>
            </div>

            <input
                ref={inputRef}
                type="file"
                accept="application/pdf,.pdf"
                multiple
                className="hidden"
                onChange={(e) => addFiles(e.target.files)}
            />

            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 space-y-6 lg:col-span-8">
                    <div
                        onDragEnter={(e) => {
                            e.preventDefault();
                            setDragOver(true);
                        }}
                        onDragOver={(e) => {
                            e.preventDefault();
                            setDragOver(true);
                        }}
                        onDragLeave={(e) => {
                            e.preventDefault();
                            setDragOver(false);
                        }}
                        onDrop={onDrop}
                        className={[
                            "relative flex flex-col items-center justify-center rounded-md border-2 border-dashed bg-white p-10 text-center transition",
                            dragOver ? "border-teal-400 bg-teal-50/40" : "border-slate-200 hover:border-teal-300",
                        ].join(" ")}
                    >
                        <div className="flex h-14 w-14 items-center justify-center rounded-md bg-teal-50 text-teal-600">
                            <Upload className="h-7 w-7" />
                        </div>

                        <p className="mt-4 text-sm font-semibold text-slate-900">Drag &amp; drop PDFs here</p>

                        <p className="mt-1 text-sm text-slate-600">
                            or{" "}
                            <button
                                type="button"
                                onClick={pickFiles}
                                className="font-semibold text-teal-600 underline underline-offset-2 hover:text-teal-700"
                            >
                                click to browse
                            </button>
                        </p>

                        <div className="mt-3 text-xs text-slate-500">PDF only • Max 25MB each • Multiple files supported</div>
                    </div>

                    <div className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                                <div className="text-sm font-semibold text-slate-900">Selected files</div>
                                <div className="mt-1 text-xs text-slate-500">
                                    {files.length === 0 ? "No files selected yet." : `${files.length} file(s) • ${totalSizeMB} MB total`}
                                </div>
                            </div>

                            <button
                                onClick={clearAll}
                                disabled={files.length === 0}
                                className="rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                Clear All
                            </button>
                        </div>

                        <div className="mt-4 space-y-3">
                            {files.length === 0 ? (
                                <div className="rounded-md border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
                                    Tip: Upload one PDF first to validate extraction quality, then batch upload.
                                </div>
                            ) : (
                                files.map((f) => {
                                    const key = `${f.name}_${f.size}`;
                                    const sizeMB = Math.round((f.size / (1024 * 1024)) * 10) / 10;
                                    const tooBig = f.size > 25 * 1024 * 1024;

                                    return (
                                        <div key={key} className="flex items-center justify-between gap-4 rounded-md border border-slate-100 p-4">
                                            <div className="min-w-0">
                                                <div className="truncate text-sm font-semibold text-slate-900">{f.name}</div>
                                                <div className="mt-1 text-xs text-slate-500">
                                                    {sizeMB} MB • PDF
                                                    {tooBig ? (
                                                        <span className="ml-2 rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-700">
                                                            Exceeds 25MB
                                                        </span>
                                                    ) : null}
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => removeFile(key)}
                                                className="rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        <div className="mt-5 flex flex-wrap items-center gap-3">
                            <button
                                onClick={pickFiles}
                                className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                            >
                                Add more
                            </button>

                            <button
                                disabled={files.length === 0}
                                className="rounded-md bg-teal-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                Upload All
                            </button>

                            <div className="ml-auto text-xs text-slate-500">After upload: you’ll review extracted images per page.</div>
                        </div>
                    </div>
                </div>

                <aside className="col-span-12 space-y-6 lg:col-span-4">
                    <div className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
                        <h3 className="text-sm font-semibold text-slate-900">
                            {pick(cms, "upload.tips.title", "Tips for better extraction")}
                        </h3>
                        <ul className="mt-4 space-y-2 text-sm text-slate-600">
                            {asArray<string>(pick(cms, "upload.tips.items", []), [
                                "Keep PDFs under 25MB (compress if needed).",
                                "Prefer vector or high-res images for best results.",
                                "Avoid scanned PDFs if possible (quality varies).",
                            ]).map((t) => (
                                <li key={t} className="flex gap-2">
                                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
                                    {t}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="rounded-md border border-emerald-200 bg-white p-6 shadow-sm">
                        <div className="text-sm font-semibold text-slate-900">
                            {pick(cms, "upload.next.title", "What happens next?")}
                        </div>
                        <div className="mt-2 text-sm text-slate-600">
                            {pick(
                                cms,
                                "upload.next.subtitle",
                                "You’ll see extracted images grouped by PDF pages. Select only meaningful images for alt-text generation."
                            )}
                        </div>
                        <div className="mt-4 rounded-md bg-emerald-50 p-3 text-xs text-emerald-800">
                            {pick(cms, "upload.next.note", "Recommended: skip decorative icons and repeated logos.")}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}

export function ExtractedImagesPage({ cms }: { cms: DashboardPreviewJson | null }) {
    const fallbackPages = [
        { id: "p1", label: "Page 1", count: 4 },
        { id: "p2", label: "Page 2", count: 3 },
        { id: "p3", label: "Page 3", count: 2 },
        { id: "p4", label: "Page 4", count: 2 },
        { id: "p5", label: "Page 5", count: 1 },
    ];

    const pages = asArray<{ id: string; label: string; count: number }>(pick(cms, "review_images.pages", []), fallbackPages);

    const fallbackImages = Array.from({ length: 8 }).map((_, idx) => ({
        id: `img_${idx + 1}`,
        title: `Image ${idx + 1}`,
        src: `https://picsum.photos/seed/altflow_${idx + 7}/900/600`,
        size: ["180 KB", "240 KB", "320 KB", "410 KB"][idx % 4],
        type: ["PNG", "JPG", "SVG"][idx % 3],
    }));

    const images = asArray<{ id: string; title: string; src: string; size: string; type: string }>(
        pick(cms, "review_images.images", []),
        fallbackImages
    );

    const [activePage, setActivePage] = React.useState(pages[0]?.id || "p1");

    // Adjust activePage when pages change
    const [prevPages, setPrevPages] = React.useState(pages);
    if (pages !== prevPages) {
        setPrevPages(pages);
        if (!pages.some((p) => p.id === activePage)) {
            setActivePage(pages[0]?.id || "p1");
        }
    }

    const [selected, setSelected] = React.useState<Record<string, boolean>>(() => {
        const init: Record<string, boolean> = {};
        images.forEach((im, i) => (init[im.id] = i < 4));
        return init;
    });

    // Sync selected state with images prop changes
    const [prevImages, setPrevImages] = React.useState(images);
    if (images !== prevImages) {
        setPrevImages(images);
        setSelected((prev) => {
            const next: Record<string, boolean> = {};
            images.forEach((im, i) => {
                next[im.id] = im.id in prev ? !!prev[im.id] : i < 4;
            });
            return next;
        });
    }

    const selectedCount = Object.values(selected).filter(Boolean).length;

    const toggle = (id: string) => setSelected((p) => ({ ...p, [id]: !p[id] }));
    const selectAll = () =>
        setSelected(() => {
            const next: Record<string, boolean> = {};
            images.forEach((im) => (next[im.id] = true));
            return next;
        });
    const clearAll = () =>
        setSelected(() => {
            const next: Record<string, boolean> = {};
            images.forEach((im) => (next[im.id] = false));
            return next;
        });

    return (
        <div className="min-w-0 space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                    <h1 className="text-2xl font-semibold text-slate-900">
                        {pick(cms, "review_images.title", "Review extracted images")}
                    </h1>
                    <p className="mt-1 text-sm text-slate-600">
                        {pick(
                            cms,
                            "review_images.subtitle",
                            "Select only meaningful images. Decorative icons and repeated logos usually don’t need alt text."
                        )}
                    </p>

                    <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                        <span className="rounded-full bg-white/15 px-2 py-0.5">Step 2</span>
                        <span>{selectedCount} selected</span>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <button
                        onClick={selectAll}
                        className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"
                    >
                        Select all
                    </button>
                    <button
                        onClick={clearAll}
                        className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"
                    >
                        Clear
                    </button>
                    <button className="rounded-md bg-teal-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-600">
                        Generate Alt Text
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
                <aside className="col-span-12 lg:col-span-3">
                    <div className="rounded-md bg-white p-5 shadow-sm ring-1 ring-slate-200">
                        <div className="text-sm font-semibold text-slate-900">
                            {pick(cms, "review_images.pages_title", "PDF pages")}
                        </div>

                        <div className="mt-4 space-y-2">
                            {pages.map((p) => {
                                const active = activePage === p.id;
                                return (
                                    <button
                                        key={p.id}
                                        onClick={() => setActivePage(p.id)}
                                        className={[
                                            "flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm font-medium transition",
                                            active
                                                ? "bg-teal-50 text-teal-800 ring-1 ring-teal-200"
                                                : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50",
                                        ].join(" ")}
                                    >
                                        <span>{p.label}</span>
                                        <span
                                            className={[
                                                "rounded-full px-2 py-0.5 text-xs font-semibold",
                                                active ? "bg-teal-100 text-teal-800" : "bg-slate-100 text-slate-700",
                                            ].join(" ")}
                                        >
                                            {p.count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="mt-5 rounded-md bg-slate-50 p-3 text-xs text-slate-600">
                            {pick(
                                cms,
                                "review_images.pages_tip",
                                "Tip: Focus on charts, product images, UI screenshots, diagrams, and photos with meaning."
                            )}
                        </div>
                    </div>
                </aside>

                <main className="col-span-12 space-y-4 lg:col-span-6">
                    <div className="rounded-md bg-white p-5 shadow-sm ring-1 ring-slate-200">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <div className="text-sm font-semibold text-slate-900">
                                    {pick(cms, "review_images.summary_title", "Selection summary")}
                                </div>
                                <div className="mt-1 text-sm text-slate-600">
                                    You have selected{" "}
                                    <span className="font-semibold text-slate-900">{selectedCount}</span> image(s) for alt-text generation.
                                </div>
                            </div>

                            <div className="rounded-md bg-teal-50 px-3 py-2 text-xs font-semibold text-teal-800 ring-1 ring-teal-200">
                                Ready for Step 3
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {images.map((im) => {
                            const checked = !!selected[im.id];
                            return (
                                <div
                                    key={im.id}
                                    className={[
                                        "group overflow-hidden rounded-md bg-white shadow-sm ring-1 transition",
                                        checked ? "ring-teal-200" : "ring-slate-200 hover:ring-slate-300",
                                    ].join(" ")}
                                >
                                    <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100">
                                        <img
                                            src={im.src}
                                            alt={im.title}
                                            className="h-full w-full object-contain transition duration-300 group-hover:scale-[1.02]"
                                            loading="lazy"
                                        />
                                    </div>

                                    <div className="flex items-center justify-between gap-3 p-4">
                                        <div className="min-w-0">
                                            <div className="truncate text-sm font-semibold text-slate-900">{im.title}</div>
                                            <div className="mt-1 text-xs text-slate-500">
                                                {im.type} • {im.size}
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => toggle(im.id)}
                                            className={[
                                                "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition",
                                                checked
                                                    ? "bg-teal-500 text-white hover:bg-teal-600"
                                                    : "bg-white text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50",
                                            ].join(" ")}
                                        >
                                            <span
                                                className={[
                                                    "h-4 w-4 rounded-sm ring-1 ring-inset",
                                                    checked ? "bg-white/25 ring-white/40" : "bg-white ring-slate-300",
                                                ].join(" ")}
                                            />
                                            {checked ? "Included" : "Include"}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <button className="rounded-md bg-teal-500 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-600">
                            Generate Alt Text
                        </button>
                        <button className="rounded-md bg-white px-5 py-2 text-sm font-semibold text-slate-800 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50">
                            Discard unselected
                        </button>

                        <div className="ml-auto text-xs text-slate-500">Next: Alt text editor (tone, length, language)</div>
                    </div>
                </main>

                <aside className="col-span-12 lg:col-span-3">
                    <div className="space-y-6">
                        <div className="rounded-md bg-white p-5 shadow-sm ring-1 ring-slate-200">
                            <div className="text-sm font-semibold text-slate-900">
                                {pick(cms, "review_images.best_practices.title", "Best practices")}
                            </div>
                            <ul className="mt-4 space-y-2 text-sm text-slate-600">
                                {asArray<string>(pick(cms, "review_images.best_practices.items", []), [
                                    "Skip purely decorative elements.",
                                    "For charts, mention the key takeaway, not every detail.",
                                    "If text is already near the image, keep alt text shorter.",
                                ]).map((t) => (
                                    <li key={t} className="flex gap-2">
                                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
                                        {t}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="rounded-md bg-white p-5 shadow-sm ring-1 ring-slate-200">
                            <div className="text-sm font-semibold text-slate-900">
                                {pick(cms, "review_images.quality_checks.title", "Quality checks")}
                            </div>
                            <div className="mt-3 space-y-2 text-sm text-slate-600">
                                <div className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2">
                                    <span>Selected images</span>
                                    <span className="font-semibold text-slate-900">{selectedCount}</span>
                                </div>
                                <div className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2">
                                    <span>Current page</span>
                                    <span className="font-semibold text-slate-900">{pages.find((p) => p.id === activePage)?.label}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}

export function AltTextEditorPage({ cms }: { cms: DashboardPreviewJson | null }) {
    const [tone, setTone] = React.useState(pick(cms, "alt_editor.default_tone", "Friendly"));
    const [limit, setLimit] = React.useState(String(pick(cms, "alt_editor.default_limit", "125")));
    const [lang, setLang] = React.useState(pick(cms, "alt_editor.default_language", "English"));

    const [text, setText] = React.useState(
        pick(cms, "alt_editor.default_text", "A close-up of a laptop screen showing analytics dashboards.")
    );

    const previewSrc = pick(cms, "alt_editor.preview_src", "https://picsum.photos/seed/alt_editor/900/600");
    const previewMeta = pick(cms, "alt_editor.preview_meta", "PNG • 240 KB");

    const regenSamples = asArray<string>(pick(cms, "alt_editor.regenerate_samples", []), [
        "Laptop screen displaying an analytics dashboard with charts and metrics.",
        "Analytics dashboard visible on a laptop, showing trends and performance indicators.",
        "A laptop showing a dashboard interface with graphs and key KPIs.",
    ]);

    const charCount = text.length;
    const maxChars = Number(limit) || 125;
    const isOver = charCount > maxChars;

    const onCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
        } catch { }
    };

    const onRegenerate = () => {
        const list = regenSamples.length ? regenSamples : ["", "", ""];
        setText(list[Math.floor(Math.random() * list.length)]);
    };

    const onDiscard = () => setText("");

    return (
        <div className="min-w-0 space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">{pick(cms, "alt_editor.title", "Alt text editor")}</h1>
                    <p className="mt-1 text-sm text-slate-600">
                        {pick(
                            cms,
                            "alt_editor.subtitle",
                            "Review AI suggestions, keep it concise, and focus on the meaning of the image."
                        )}
                    </p>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                    <span className="rounded-full bg-white/15 px-2 py-0.5">Step 3</span>
                    <span>Editing</span>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 lg:col-span-4">
                    <div className="overflow-hidden rounded-md bg-white shadow-sm ring-1 ring-slate-200">
                        <div className="aspect-16/10 w-full bg-slate-100">
                            <img src={previewSrc} alt="Preview" className="h-full w-full object-contain" loading="lazy" />
                        </div>

                        <div className="p-4">
                            <div className="text-sm font-semibold text-slate-900">{pick(cms, "alt_editor.preview_title", "Image preview")}</div>
                            <div className="mt-1 text-xs text-slate-500">{previewMeta}</div>

                            <div className="mt-4 rounded-md bg-slate-50 p-3 text-xs text-slate-600">
                                {pick(
                                    cms,
                                    "alt_editor.preview_tip",
                                    "Tip: If the image is decorative, leave alt text empty or mark it as decorative in your export."
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-span-12 lg:col-span-8">
                    <div className="rounded-md bg-white p-6 shadow-sm ring-1 ring-slate-200">
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex flex-wrap items-center gap-2">
                                    <select
                                        value={tone}
                                        onChange={(e) => setTone(e.target.value)}
                                        className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-teal-200"
                                    >
                                        {asArray<string>(pick(cms, "alt_editor.tones", []), [
                                            "Friendly",
                                            "Professional",
                                            "Neutral",
                                            "Technical",
                                        ]).map((t) => (
                                            <option key={t}>{t}</option>
                                        ))}
                                    </select>

                                    <select
                                        value={limit}
                                        onChange={(e) => setLimit(e.target.value)}
                                        className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-teal-200"
                                    >
                                        {asArray<{ value: string; label: string }>(pick(cms, "alt_editor.limits", []), [
                                            { value: "80", label: "80 chars" },
                                            { value: "125", label: "125 chars" },
                                            { value: "160", label: "160 chars" },
                                        ]).map((o) => (
                                            <option key={o.value} value={o.value}>
                                                {o.label}
                                            </option>
                                        ))}
                                    </select>

                                    <select
                                        value={lang}
                                        onChange={(e) => setLang(e.target.value)}
                                        className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-teal-200"
                                    >
                                        {asArray<string>(pick(cms, "alt_editor.languages", []), ["English", "Hindi", "Punjabi"]).map((l) => (
                                            <option key={l}>{l}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span
                                        className={[
                                            "rounded-full px-3 py-1 text-xs font-semibold ring-1",
                                            isOver
                                                ? "bg-amber-50 text-amber-800 ring-amber-200"
                                                : "bg-emerald-50 text-emerald-800 ring-emerald-200",
                                        ].join(" ")}
                                    >
                                        {charCount}/{maxChars}
                                    </span>

                                    <span className="text-xs text-slate-500">
                                        Tone: <span className="font-semibold text-slate-800">{tone}</span> •{" "}
                                        <span className="font-semibold text-slate-800">{lang}</span>
                                    </span>
                                </div>
                            </div>

                            {isOver ? (
                                <div className="rounded-md bg-amber-50 px-4 py-3 text-sm text-amber-900 ring-1 ring-amber-200">
                                    {pick(
                                        cms,
                                        "alt_editor.over_limit_message",
                                        "Length is over the selected limit. Try removing extra detail and keep the main takeaway."
                                    )}
                                </div>
                            ) : null}

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-900">{pick(cms, "alt_editor.text_label", "Alt text")}</label>
                                <textarea
                                    className="w-full resize-none rounded-md bg-white p-4 text-sm text-slate-900 shadow-sm ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-teal-200"
                                    rows={5}
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    placeholder={pick(cms, "alt_editor.placeholder", "Describe the image meaningfully…")}
                                />
                                <div className="flex items-center justify-between text-xs text-slate-500">
                                    <span>{pick(cms, "alt_editor.helper_text", "Keep it meaningful. Avoid “image of”, “picture of”.")}</span>
                                    <button
                                        type="button"
                                        onClick={() => setText(text.trim())}
                                        className="font-semibold text-teal-700 hover:text-teal-800"
                                    >
                                        Trim spaces
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                <button
                                    onClick={onRegenerate}
                                    className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"
                                >
                                    Regenerate
                                </button>

                                <button
                                    onClick={onCopy}
                                    className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"
                                >
                                    Copy
                                </button>

                                <button
                                    onClick={onDiscard}
                                    className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-rose-600 shadow-sm ring-1 ring-slate-200 hover:bg-rose-50"
                                >
                                    Discard
                                </button>

                                <div className="ml-auto flex items-center gap-2">
                                    <button className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50">
                                        Previous
                                    </button>
                                    <button className="rounded-md bg-teal-500 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-600">
                                        Save & Continue
                                    </button>
                                </div>
                            </div>

                            <div className="rounded-md bg-slate-50 p-4 text-sm text-slate-600">
                                <div className="font-semibold text-slate-800">
                                    {pick(cms, "alt_editor.good_alt_title", "Good alt text usually includes:")}
                                </div>
                                <ul className="mt-2 space-y-1">
                                    {asArray<string>(pick(cms, "alt_editor.good_alt_items", []), [
                                        "What it is (object/scene)",
                                        "Why it matters (key info / takeaway)",
                                        "Keep it short and avoid repetition",
                                    ]).map((t) => (
                                        <li key={t} className="flex gap-2">
                                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
                                            {t}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end gap-2">
                <button className="rounded-md bg-white px-5 py-2 text-sm font-semibold text-slate-800 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50">
                    Save draft
                </button>
                <button className="rounded-md bg-teal-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-teal-600">
                    Save All & Continue
                </button>
            </div>
        </div>
    );
}

export function ReviewApprovalPage({ cms }: { cms: DashboardPreviewJson | null }) {
    const roles = asArray(
        pick(cms, "review_approve.roles", []),
        [
            {
                key: "creator",
                title: "Creator",
                subtitle: "Prepare and submit the final alt text set.",
                status: "In progress",
                statusClass: "bg-slate-50 text-slate-700 ring-slate-200",
                primary: "Submit for review",
            },
            {
                key: "reviewer",
                title: "Reviewer",
                subtitle: "Review items and request changes or approve.",
                status: "Changes requested",
                statusClass: "bg-amber-50 text-amber-800 ring-amber-200",
                primary: "Send feedback",
            },
            {
                key: "approver",
                title: "Approver",
                subtitle: "Final sign-off before export.",
                status: "Approved",
                statusClass: "bg-emerald-50 text-emerald-800 ring-emerald-200",
                primary: "Finalize approval",
            },
        ]
    );
    const progressPct = pick(cms, "review_approve.progress_pct", "88%");
    const itemsReady = pick(cms, "review_approve.items_ready", 24);
    const needsChanges = pick(cms, "review_approve.needs_changes", 3);
    const approved = pick(cms, "review_approve.approved", 21);

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">{pick(cms, "review_approve.title", "Review & approval")}</h1>
                    <p className="mt-1 text-sm text-slate-600">
                        {pick(cms, "review_approve.subtitle", "Collaborate with your team to finalize accessibility-ready alt text.")}
                    </p>
                </div>

                <div className="rounded-full bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white">
                    Step 4 · Workflow
                </div>
            </div>

            <div className="rounded-md bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <div className="text-sm font-semibold text-slate-900">{pick(cms, "review_approve.summary_title", "Workflow summary")}</div>
                        <div className="mt-1 text-xs text-slate-500">{pick(cms, "review_approve.summary_subtitle", "Progress based on approved alt text items")}</div>
                    </div>

                    <div className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 ring-1 ring-teal-100">
                        {progressPct} complete
                    </div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-6 text-sm">
                    <div>
                        <div className="text-slate-500">Items ready</div>
                        <div className="mt-1 text-lg font-semibold text-slate-900">{itemsReady}</div>
                    </div>
                    <div>
                        <div className="text-slate-500">Needs changes</div>
                        <div className="mt-1 text-lg font-semibold text-amber-700">{needsChanges}</div>
                    </div>
                    <div>
                        <div className="text-slate-500">Approved</div>
                        <div className="mt-1 text-lg font-semibold text-emerald-700">{approved}</div>
                    </div>
                </div>

                <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div className="h-2 rounded-full bg-teal-500" style={{ width: String(progressPct) }} />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {roles.map((r: any) => (
                    <div key={r.key} className="flex h-full flex-col rounded-md bg-white p-6 shadow-sm ring-1 ring-slate-200">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <div className="text-base font-semibold text-slate-900">{r.title}</div>
                                <div className="mt-1 text-xs text-slate-500">{r.subtitle}</div>
                            </div>

                            <span className={["rounded-full px-3 py-1 text-xs font-semibold ring-1", r.statusClass].join(" ")}>
                                {r.status}
                            </span>
                        </div>

                        <div className="mt-5 space-y-2">
                            <label className="text-xs font-semibold text-slate-700">Comment</label>
                            <textarea
                                rows={5}
                                placeholder="Add a note for your team…"
                                className="w-full resize-none rounded-md p-3 text-sm ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-teal-200"
                            />
                        </div>

                        <div className="mt-auto flex gap-2 pt-5">
                            <button className="flex-1 rounded-md bg-teal-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-600">
                                {r.primary}
                            </button>
                            <button className="rounded-md px-4 py-2.5 text-sm font-semibold ring-1 ring-slate-200 hover:bg-slate-50">
                                View
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function ExportResultsPage({ cms }: { cms: DashboardPreviewJson | null }) {
    const formats = asArray<{ type: string; desc: string }>(pick(cms, "export.formats", []), [
        { type: "PDF", desc: "Accessible PDF with embedded alt text" },
        { type: "Word", desc: "Editable document for further review" },
        { type: "CSV", desc: "Structured data for audits and reports" },
        { type: "JSON", desc: "Developer-ready export for integrations" },
    ]);

    return (
        <div className="space-y-8">
            <div className="space-y-2 text-center">
                <h1 className="text-2xl font-semibold text-slate-900">{pick(cms, "export.title", "Export results")}</h1>
                <p className="text-sm text-slate-600">
                    {pick(cms, "export.subtitle", "Download your accessibility-ready content in the format you need.")}
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {formats.map((f) => (
                    <div key={f.type} className="flex flex-col rounded-md bg-white p-6 shadow-sm ring-1 ring-slate-200">
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-slate-900">{f.type}</h3>
                            <p className="mt-1 text-sm text-slate-500">{f.desc}</p>
                        </div>

                        <button className="mt-6 rounded-md bg-teal-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-600">
                            Download
                        </button>
                    </div>
                ))}
            </div>

            <div className="rounded-md bg-emerald-50 p-4 text-sm text-emerald-900 ring-1 ring-emerald-200">
                {pick(cms, "export.ready_note", "Your export files are ready and available for download.")}
            </div>

            <div className="flex flex-col gap-4 rounded-md bg-slate-900 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-white">
                    <div className="text-sm font-medium">{pick(cms, "export.done_title", "All done")}</div>
                    <div className="text-xs text-white/70">{pick(cms, "export.done_subtitle", "Your content is now fully accessible and export-ready.")}</div>
                </div>

                <button className="rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-100">
                    Go to dashboard →
                </button>
            </div>
        </div>
    );
}

function OnboardingPopup({ step, onNext, cms }: { step: number; onNext: () => void; cms: DashboardPreviewJson | null }) {
    const fallback = [
        { title: "This is your dashboard", desc: "Track progress, credits, analytics, and quick actions from one place." },
        { title: "Manage your projects", desc: "Organize PDFs into projects so accessibility workflows stay clean and structured." },
        { title: "Upload your PDFs", desc: "Upload PDFs to extract images and start generating alt text automatically." },
        { title: "Review extracted images", desc: "Select only meaningful images that require alt text. Skip decorative elements." },
        { title: "Generate alt text", desc: "Edit AI-generated alt text for tone, length, and clarity." },
        { title: "Review & approve", desc: "Collaborate with reviewers and approvers before final export." },
        { title: "Export results", desc: "Download accessibility-ready files in your preferred format." },
    ];

    const content = asArray<{ title: string; desc: string }>(pick(cms, "onboarding.steps", []), fallback);
    const c = content[step] || fallback[0];

    return (
        <div className="absolute inset-0 z-40 flex items-start justify-center pt-40">
            <div className="absolute inset-0 bg-black/10" />

            <div className="relative w-full max-w-lg rounded-md bg-white p-6 shadow-xl">
                <div className="text-sm font-semibold text-slate-500">
                    Step {step + 1} of {content.length}
                </div>

                <h2 className="mt-1 text-xl font-semibold text-slate-900">{c.title}</h2>

                <p className="mt-2 text-sm text-slate-600">{c.desc}</p>

                <div className="mt-6 flex justify-end">
                    <button onClick={onNext} className="rounded-md bg-teal-500 px-5 py-2 text-sm font-semibold text-white hover:bg-teal-600">
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}

function ProjectsPage({ cms }: { cms: DashboardPreviewJson | null }) {
    const fallbackProjects = [
        { title: "Marketing Campaign 2024", files: 12, updated: "Sep 13, 2025", active: true },
        { title: "Product Launch Q3", files: 8, updated: "Aug 22, 2025", badge: "Planning" },
        { title: "Client Onboarding", files: 5, updated: "Jul 15, 2025", badges: ["Active", "New"] },
        { title: "Internal Training Materials", files: 15, updated: "Jun 30, 2025" },
    ];

    const fallbackFiles = [
        {
            name: "Campaign_Brief_v3.pdf",
            size: "1.2 MB",
            by: "Jane Doe",
            status: "Approved",
            statusClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
        },
        {
            name: "Social_Media_Assets.pdf",
            size: "5.8 MB",
            by: "John Smith",
            status: "Reviewed",
            statusClass: "bg-amber-50 text-amber-700 border-amber-200",
        },
        {
            name: "Ad_Copy_Final.pdf",
            size: "450 KB",
            by: "Jane Doe",
            status: "Processing",
            statusClass: "bg-sky-50 text-sky-700 border-sky-200",
        },
    ];

    const projects = asArray<any>(pick(cms, "projects.projects", []), fallbackProjects);
    const files = asArray<any>(pick(cms, "projects.files", []), fallbackFiles);

    const breadcrumb = pick(cms, "projects.breadcrumb_active", "Marketing Campaign 2024");

    const folderInfoDescription = pick(cms, "projects.folder_info.description", "All assets for the 2024 marketing campaign.");
    const folderInfoCreated = pick(cms, "projects.folder_info.created_date", "January 15, 2024");
    const folderInfoTags = asArray<string>(pick(cms, "projects.folder_info.tags", []), ["campaign", "2024", "social"]);

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">{pick(cms, "projects.title", "Projects & Folders")}</h1>
                    <p className="mt-1 text-sm text-slate-600">
                        {pick(cms, "projects.subtitle", "Keep your PDFs organized with folders, tags, and quick filters.")}
                    </p>
                </div>

                <button className="inline-flex items-center gap-2 rounded-md bg-teal-500 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-600">
                    <Plus className="h-4 w-4" />
                    {pick(cms, "projects.new_project_cta", "New Project")}
                </button>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <div className="relative min-w-65 flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        placeholder={pick(cms, "projects.search_placeholder", "Search projects or files...")}
                        className="w-full rounded-md border border-slate-200 bg-white py-2 pl-10 pr-3 text-sm outline-none focus:border-teal-400"
                    />
                </div>

                <button className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50">
                    <Filter className="h-4 w-4" />
                    {pick(cms, "projects.filter_label", "Filter")}
                </button>

                <button className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50">
                    <ArrowUpDown className="h-4 w-4" />
                    {pick(cms, "projects.sort_label", "Sort: Name")}
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {projects.map((p: any) => (
                    <div key={p.title} className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="flex items-start justify-between">
                            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-teal-50 text-teal-600">
                                <Folder className="h-5 w-5" />
                            </div>
                            <button className="rounded-md p-1 hover:bg-slate-100">
                                <MoreHorizontal className="h-4 w-4 text-slate-500" />
                            </button>
                        </div>

                        <div className="mt-4 font-semibold text-slate-900">{p.title}</div>

                        <div className="mt-2 flex flex-wrap gap-2">
                            {p.badge && (
                                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">{p.badge}</span>
                            )}
                            {p.badges?.map((b: string) => (
                                <span key={b} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                                    {b}
                                </span>
                            ))}
                        </div>

                        <div className="mt-3 text-xs text-slate-500">
                            Files: {p.files} &nbsp;|&nbsp; Last Updated: {p.updated}
                        </div>
                    </div>
                ))}
            </div>

            <div className="text-sm text-slate-500">
                Projects &nbsp;›&nbsp; <span className="font-medium text-slate-900">{breadcrumb}</span>
            </div>

            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 rounded-md border border-slate-200 bg-white p-6 shadow-sm lg:col-span-8">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="text-lg font-semibold text-slate-900">{pick(cms, "projects.files_title", "Files")}</div>

                        <div className="flex items-center gap-2">
                            <button className="rounded-md border border-slate-200 px-3 py-2 text-sm font-medium hover:bg-slate-50">
                                Export
                            </button>
                            <button className="rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50">
                                Delete
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {files.map((f: any) => (
                            <div key={f.name} className="flex items-center justify-between rounded-md border border-slate-100 p-4">
                                <div>
                                    <div className="font-medium text-slate-900">{f.name}</div>
                                    <div className="mt-1 text-xs text-slate-500">
                                        {f.size} | Uploaded by {f.by}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className={`rounded-full border px-3 py-1 text-xs font-medium ${f.statusClass}`}>{f.status}</span>

                                    <button className="rounded-md border border-slate-200 p-2 hover:bg-slate-50">
                                        <Download className="h-4 w-4" />
                                    </button>
                                    <button className="rounded-md border border-slate-200 p-2 hover:bg-slate-50">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="col-span-12 rounded-md border border-slate-200 bg-white p-6 shadow-sm lg:col-span-4">
                    <div className="text-lg font-semibold text-slate-900">{pick(cms, "projects.folder_info_title", "Folder Info")}</div>

                    <div className="mt-4 space-y-4 text-sm">
                        <div>
                            <div className="font-medium text-slate-600">Description</div>
                            <div className="mt-1 rounded-md border border-slate-100 p-3">{folderInfoDescription}</div>
                        </div>

                        <div>
                            <div className="font-medium text-slate-600">Created Date</div>
                            <div className="mt-1 rounded-md border border-slate-100 p-3">{folderInfoCreated}</div>
                        </div>

                        <div>
                            <div className="font-medium text-slate-600">Tags</div>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {folderInfoTags.map((t) => (
                                    <span key={t} className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium">
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

