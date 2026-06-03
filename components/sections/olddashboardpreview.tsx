"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    Folder,
    CreditCard,
    Settings,
    Shield,
    Lock,
    User,
    SlidersHorizontal,
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
    | "export"
    ;

type IconType = React.ComponentType<{ className?: string }>;

export default function DashboardRemoteStyle() {
    const [page, setPage] = useState<Page>("dashboard");
    const [settingsOpen, setSettingsOpen] = useState(true);
    const [altFlowOpen, setAltFlowOpen] = useState(true);
    const [onboardingStep, setOnboardingStep] = useState<number | null>(0);

    const [activePage, setActivePage] = useState<"projects" | "upload">("projects");
    const onboardingFlow: Page[] = [
        "dashboard",
        "projects",
        "upload",
        "review-images",
        "generate-alt",
        "review-approve",
        "export",
    ];

    return (
        <div className="flex h-screen w-full overflow-hidden bg-slate-100 relative">
            <Sidebar
                page={page}
                setPage={setPage}
                settingsOpen={settingsOpen}
                setSettingsOpen={setSettingsOpen}
                altFlowOpen={altFlowOpen}
                setAltFlowOpen={setAltFlowOpen}
            />


            <div className="flex min-w-0 flex-1 flex-col">

                <TopBar />

                <main className="min-w-0 flex-1 overflow-y-auto px-6 py-6">
                    {onboardingStep !== null &&
                        page === onboardingFlow[onboardingStep] && (
                            <OnboardingPopup
                                step={onboardingStep}
                                onNext={() => {
                                    if (onboardingStep === null) return;

                                    const nextStep = onboardingStep + 1;

                                    if (nextStep >= onboardingFlow.length) {
                                        setOnboardingStep(null);
                                        return;
                                    }

                                    const nextPage = onboardingFlow[nextStep];

                                    setPage(nextPage);
                                    setOnboardingStep(nextStep);

                                    if (
                                        nextPage === "upload" ||
                                        nextPage === "review-images" ||
                                        nextPage === "generate-alt" ||
                                        nextPage === "review-approve" ||
                                        nextPage === "export"
                                    ) {
                                        setAltFlowOpen(true);
                                    }
                                }}
                            />
                        )}

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={page}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.22 }}
                            className="min-w-0"
                        >
                            {renderPage(page, activePage, setActivePage)}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}

function renderPage(
    page: Page,
    activePage: "projects" | "upload",
    setActivePage: React.Dispatch<React.SetStateAction<"projects" | "upload">>
) {
    switch (page) {
        case "dashboard":
            return <PayrollPage onUploadClick={() => setActivePage("upload")} />;

        case "projects":
            return <ProjectsPage />;

        case "upload":
            return <UploadPdfPage />;

        case "review-images":
            return <ExtractedImagesPage />;

        case "generate-alt":
            return <AltTextEditorPage />;

        case "review-approve":
            return <ReviewApprovalPage />;

        case "export":
            return <ExportResultsPage />;

        default:
            return (
                <div className="rounded-md border border-slate-200 bg-white p-6 text-sm text-slate-600">
                    This section is not available yet.
                </div>
            );
    }
}

function SimpleSection({ title, subtitle }: { title: string; subtitle: string }) {
    return (
        <div className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-2xl font-semibold text-slate-900">{title}</div>
            <div className="mt-1 text-sm text-slate-600">{subtitle}</div>
        </div>
    );
}

function Sidebar({
    page,
    setPage,
    settingsOpen,
    setSettingsOpen,
    altFlowOpen,
    setAltFlowOpen,
}: {
    page: Page;
    setPage: (p: Page) => void;
    settingsOpen: boolean;
    setSettingsOpen: (v: boolean) => void;
    altFlowOpen: boolean;
    setAltFlowOpen: (v: boolean) => void;
}) {

    return (
        <aside className="flex w-[200px] shrink-0 flex-col bg-gradient-to-b from-[#0B1A2E] to-[#081425] px-4 py-5 text-white">
            <div className="mb-6 flex items-center gap-2 px-1">
                <img
                    src="/images/logo.png"
                    alt="Arohio"
                    className="h-10 w-auto"
                />
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
                                className={`ml-auto text-white/70 transition ${altFlowOpen ? "rotate-180" : ""
                                    }`}
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
                <NavItem
                    icon={CreditCard}
                    label="Billing & Subscription"
                />

                <div className="mt-2">
                    <NavItem
                        icon={Settings}
                        label="Settings"
                    />
                </div>

                <NavItem
                    icon={User}
                    label="My Profile"
                />
                <NavItem
                    icon={HelpCircle}
                    label="Help / Support"
                />
            </nav>



            <div className="mt-auto pt-4">
                <NavItem
                    icon={LogOut}
                    label="Logout"
                    active={false}
                    danger
                />
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
    const base =
        "flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition";
    const activeCls = "bg-white/12 text-white shadow-[0_10px_28px_rgba(0,0,0,0.20)]";
    const idleCls = "text-white/80 hover:bg-white/8";
    const dangerCls = "text-rose-200 hover:text-rose-100 hover:bg-rose-500/10";

    return (
        <button
            onClick={onClick}
            className={[
                base,
                active ? activeCls : idleCls,
                danger ? dangerCls : "",
            ].join(" ")}
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

function TopBar() {
    return (
        <header className="relative flex h-14 items-center justify-end border-b border-slate-200 bg-white px-6">
            <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-6 text-sm font-medium text-slate-700">
                <span className="cursor-pointer hover:text-slate-900">Home</span>
                <span className="cursor-pointer hover:text-slate-900">Features</span>
                <span className="cursor-pointer hover:text-slate-900">Blog</span>
                <span className="cursor-pointer hover:text-slate-900">About Us</span>
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
                    <Image
                        src="https://www.gstatic.com/images/branding/product/1x/avatar_circle_blue_512dp.png"
                        alt="User avatar"
                        width={36}
                        height={36}
                    />
                </div>

                <button className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100">
                    <LogOut className="h-4 w-4" />
                </button>
            </div>
        </header>

    );
}
function PayrollPage({ onUploadClick }: { onUploadClick: () => void }) {
    const uploads = [
        {
            filename: "Annual_Report_2023.pdf",
            date: "2024-09-05",
            status: "Completed",
            alt: "124",
            statusClass: "bg-emerald-50 text-emerald-700 border-emerald-100",
        },
        {
            filename: "Marketing_Sheet.xlsx",
            date: "2024-09-03",
            status: "Processing",
            alt: "—",
            statusClass: "bg-amber-50 text-amber-700 border-amber-100",
        },
        {
            filename: "Design_Mockups_v1.pdf",
            date: "2024-09-01",
            status: "Failed",
            alt: "0",
            statusClass: "bg-rose-50 text-rose-700 border-rose-100",
        },
        {
            filename: "Product_Catalogue.pdf",
            date: "2024-08-28",
            status: "Completed",
            alt: "89",
            statusClass: "bg-emerald-50 text-emerald-700 border-emerald-100",
        },
    ];

    const notices = [
        { title: "Your PDF extraction is complete.", time: "2 min ago" },
        { title: "New SEO alt text feature released.", time: "1 day ago" },
        { title: "Subscription renewal due in 5 days.", time: "3 days ago" },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h1 className="text-3xl font-semibold text-slate-900">
                        Welcome back, <span className="text-teal-600">Saran K</span>
                    </h1>
                    <p className="mt-1 text-sm text-slate-600">
                        Here’s your accessibility progress today.
                    </p>
                </div>

                <button
                    onClick={onUploadClick}

                    className="inline-flex items-center gap-2 rounded-md bg-teal-500 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-teal-600"
                >
                    <Upload className="h-4 w-4" />
                    Upload
                </button>

            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* LEFT */}
                <div className="col-span-12 space-y-6 lg:col-span-8">
                    {/* Credits */}
                    <div className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="text-md font-semibold text-slate-900">
                                    Credits Overview
                                </div>
                                <div className="mt-1 text-sm text-slate-500">
                                    Remaining Credits
                                </div>
                            </div>
                            <button className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
                                Buy More
                            </button>
                        </div>

                        <div className="mt-6 flex items-end gap-2">
                            <div className="text-3xl font-semibold text-slate-900">120</div>
                            <div className="pb-1 text-sm text-slate-500">/ 200 left</div>
                        </div>

                        <div className="mt-4 h-3 w-full rounded-md bg-teal-50">
                            <div className="h-3 w-[60%] rounded-md bg-teal-500" />
                        </div>
                    </div>

                    {/* Analytics Snapshot – LINE GRAPH */}
                    <div className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
                        <div>
                            <div className="text-md font-semibold text-slate-900">
                                Analytics Snapshot
                            </div>
                            <div className="mt-1 text-sm text-slate-500">
                                Last 5 days
                            </div>
                        </div>

                        <div className="mt-6 rounded-md bg-slate-50 p-4">
                            <svg viewBox="0 0 500 160" className="h-[180px] w-full">
                                {/* grid */}
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

                                {/* line */}
                                <polyline
                                    points="0,110 100,90 200,40 300,70 400,50"
                                    fill="none"
                                    stroke="#14b8a6"
                                    strokeWidth="3"
                                />

                                {/* dots */}
                                {[110, 90, 40, 70, 50].map((y, i) => (
                                    <circle
                                        key={i}
                                        cx={i * 100}
                                        cy={y}
                                        r="4"
                                        fill="#14b8a6"
                                    />
                                ))}
                            </svg>

                            <div className="mt-4 flex justify-between text-sm font-medium text-slate-600">
                                <span>Mon</span>
                                <span>Tue</span>
                                <span>Wed</span>
                                <span>Thu</span>
                                <span>Fri</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT */}
                <div className="col-span-12 space-y-6 lg:col-span-4">
                    {/* Notifications */}
                    <div className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="text-md font-semibold text-slate-900">
                            Notifications
                        </div>

                        <div className="mt-5 space-y-5">
                            {notices.map((n) => (
                                <div key={n.title} className="flex gap-4">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-md bg-teal-50 text-teal-600">
                                        <Bell className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-900">
                                            {n.title}
                                        </div>
                                        <div className="mt-1 text-xs text-slate-500">
                                            {n.time}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>


                    <div className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="text-md font-semibold text-slate-900">
                            Quick Actions
                        </div>

                        <div className="mt-5 grid grid-cols-2 gap-4">
                            {[
                                { icon: FolderOpen, label: "View All Projects" },
                                { icon: CheckCircle, label: "Check SEO Alt Text" },
                                { icon: Upload, label: "Upload New PDF" },
                                { icon: MessageSquare, label: "Open Chatbot" },
                            ].map((a) => (
                                <button
                                    key={a.label}
                                    aria-label={a.label}
                                    className="group flex h-16 items-center justify-center rounded-md border border-dashed border-slate-200 bg-white transition
                   hover:bg-slate-50 hover:border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-200"
                                >
                                    <a.icon className="h-6 w-6 text-teal-600 transition group-hover:scale-105" />
                                </button>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            {/* PRODUCTIVITY GAIN – FULL WIDTH */}
            <div className="rounded-md border border-emerald-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-md bg-emerald-100 text-emerald-600">
                        <Timer className="h-6 w-6" />
                    </div>

                    <div className="flex-1">
                        <div className="text-sm font-medium text-slate-600">
                            Productivity gain
                        </div>
                        <div className="mt-1 text-3xl font-semibold text-slate-900">
                            10 hours saved
                        </div>
                        <div className="mt-1 text-sm text-slate-500">
                            this month through automated accessibility workflows
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function UploadPdfPage() {
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

    const totalSizeMB = Math.round(
        (files.reduce((s, f) => s + f.size, 0) / (1024 * 1024)) * 10
    ) / 10;

    return (
        <div className="min-w-0 space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                    <h1 className="text-2xl font-semibold text-slate-900">
                        Upload PDFs for Image Extraction
                    </h1>
                    <p className="mt-1 text-sm text-slate-600">
                        Upload your PDFs. Arohio will extract images and prepare them for alt-text generation.
                    </p>

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

                        <p className="mt-4 text-sm font-semibold text-slate-900">
                            Drag &amp; drop PDFs here
                        </p>

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

                        <div className="mt-3 text-xs text-slate-500">
                            PDF only • Max 25MB each • Multiple files supported
                        </div>
                    </div>

                    <div className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                                <div className="text-sm font-semibold text-slate-900">Selected files</div>
                                <div className="mt-1 text-xs text-slate-500">
                                    {files.length === 0
                                        ? "No files selected yet."
                                        : `${files.length} file(s) • ${totalSizeMB} MB total`}
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
                                        <div
                                            key={key}
                                            className="flex items-center justify-between gap-4 rounded-md border border-slate-100 p-4"
                                        >
                                            <div className="min-w-0">
                                                <div className="truncate text-sm font-semibold text-slate-900">
                                                    {f.name}
                                                </div>
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

                            <div className="ml-auto text-xs text-slate-500">
                                After upload: you’ll review extracted images per page.
                            </div>
                        </div>
                    </div>
                </div>

                <aside className="col-span-12 space-y-6 lg:col-span-4">
                    <div className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
                        <h3 className="text-sm font-semibold text-slate-900">Tips for better extraction</h3>
                        <ul className="mt-4 space-y-2 text-sm text-slate-600">
                            <li className="flex gap-2">
                                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
                                Keep PDFs under 25MB (compress if needed).
                            </li>
                            <li className="flex gap-2">
                                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
                                Prefer vector or high-res images for best results.
                            </li>
                            <li className="flex gap-2">
                                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
                                Avoid scanned PDFs if possible (quality varies).
                            </li>
                        </ul>
                    </div>

                    <div className="rounded-md border border-emerald-200 bg-white p-6 shadow-sm">
                        <div className="text-sm font-semibold text-slate-900">What happens next?</div>
                        <div className="mt-2 text-sm text-slate-600">
                            You’ll see extracted images grouped by PDF pages. Select only meaningful images for
                            alt-text generation.
                        </div>
                        <div className="mt-4 rounded-md bg-emerald-50 p-3 text-xs text-emerald-800">
                            Recommended: skip decorative icons and repeated logos.
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}

export function ExtractedImagesPage() {
    const pages = [
        { id: "p1", label: "Page 1", count: 4 },
        { id: "p2", label: "Page 2", count: 3 },
        { id: "p3", label: "Page 3", count: 2 },
        { id: "p4", label: "Page 4", count: 2 },
        { id: "p5", label: "Page 5", count: 1 },
    ];

    const images = Array.from({ length: 8 }).map((_, idx) => ({
        id: `img_${idx + 1}`,
        title: `Image ${idx + 1}`,
        src: `https://picsum.photos/seed/altflow_${idx + 7}/900/600`,
        size: ["180 KB", "240 KB", "320 KB", "410 KB"][idx % 4],
        type: ["PNG", "JPG", "SVG"][idx % 3],
    }));

    const [activePage, setActivePage] = React.useState(pages[0].id);
    const [selected, setSelected] = React.useState<Record<string, boolean>>(() => {
        const init: Record<string, boolean> = {};
        images.forEach((im, i) => (init[im.id] = i < 4));
        return init;
    });

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
                    <h1 className="text-2xl font-semibold text-slate-900">Review extracted images</h1>
                    <p className="mt-1 text-sm text-slate-600">
                        Select only meaningful images. Decorative icons and repeated logos usually don’t need alt text.
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
                        <div className="text-sm font-semibold text-slate-900">PDF pages</div>

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
                            Tip: Focus on charts, product images, UI screenshots, diagrams, and photos with meaning.
                        </div>
                    </div>
                </aside>

                <main className="col-span-12 lg:col-span-6 space-y-4">
                    <div className="rounded-md bg-white p-5 shadow-sm ring-1 ring-slate-200">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <div className="text-sm font-semibold text-slate-900">Selection summary</div>
                                <div className="mt-1 text-sm text-slate-600">
                                    You have selected <span className="font-semibold text-slate-900">{selectedCount}</span>{" "}
                                    image(s) for alt-text generation.
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
                                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
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
                                                    "h-4 w-4 rounded-[4px] ring-1 ring-inset",
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

                        <div className="ml-auto text-xs text-slate-500">
                            Next: Alt text editor (tone, length, language)
                        </div>
                    </div>
                </main>

                <aside className="col-span-12 lg:col-span-3">
                    <div className="space-y-6">
                        <div className="rounded-md bg-white p-5 shadow-sm ring-1 ring-slate-200">
                            <div className="text-sm font-semibold text-slate-900">Best practices</div>
                            <ul className="mt-4 space-y-2 text-sm text-slate-600">
                                <li className="flex gap-2">
                                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
                                    Skip purely decorative elements.
                                </li>
                                <li className="flex gap-2">
                                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
                                    For charts, mention the key takeaway, not every detail.
                                </li>
                                <li className="flex gap-2">
                                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
                                    If text is already near the image, keep alt text shorter.
                                </li>
                            </ul>
                        </div>

                        <div className="rounded-md bg-white p-5 shadow-sm ring-1 ring-slate-200">
                            <div className="text-sm font-semibold text-slate-900">Quality checks</div>
                            <div className="mt-3 space-y-2 text-sm text-slate-600">
                                <div className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2">
                                    <span>Selected images</span>
                                    <span className="font-semibold text-slate-900">{selectedCount}</span>
                                </div>
                                <div className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2">
                                    <span>Current page</span>
                                    <span className="font-semibold text-slate-900">
                                        {pages.find((p) => p.id === activePage)?.label}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}

export function AltTextEditorPage() {
    const [tone, setTone] = React.useState("Friendly");
    const [limit, setLimit] = React.useState("125");
    const [lang, setLang] = React.useState("English");

    const [text, setText] = React.useState(
        "A close-up of a laptop screen showing analytics dashboards."
    );

    const charCount = text.length;
    const maxChars = Number(limit) || 125;
    const isOver = charCount > maxChars;

    const onCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
        } catch { }
    };

    const onRegenerate = () => {
        // placeholder (wire to API later)
        const samples = [
            "Laptop screen displaying an analytics dashboard with charts and metrics.",
            "Analytics dashboard visible on a laptop, showing trends and performance indicators.",
            "A laptop showing a dashboard interface with graphs and key KPIs.",
        ];
        setText(samples[Math.floor(Math.random() * samples.length)]);
    };

    const onDiscard = () => setText("");

    return (
        <div className="min-w-0 space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">Alt text editor</h1>
                    <p className="mt-1 text-sm text-slate-600">
                        Review AI suggestions, keep it concise, and focus on the meaning of the image.
                    </p>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                    <span className="rounded-full bg-white/15 px-2 py-0.5">Step 3</span>
                    <span>Editing</span>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* Preview */}
                <div className="col-span-12 lg:col-span-4">
                    <div className="overflow-hidden rounded-md bg-white shadow-sm ring-1 ring-slate-200">
                        <div className="aspect-[16/10] w-full bg-slate-100">
                            <img
                                src="https://picsum.photos/seed/alt_editor/900/600"
                                alt="Preview"
                                className="h-full w-full object-contain"
                                loading="lazy"
                            />
                        </div>

                        <div className="p-4">
                            <div className="text-sm font-semibold text-slate-900">Image preview</div>
                            <div className="mt-1 text-xs text-slate-500">PNG • 240 KB</div>

                            <div className="mt-4 rounded-md bg-slate-50 p-3 text-xs text-slate-600">
                                Tip: If the image is decorative, leave alt text empty or mark it as decorative in your export.
                            </div>
                        </div>
                    </div>
                </div>

                {/* Editor */}
                <div className="col-span-12 lg:col-span-8">
                    <div className="rounded-md bg-white p-6 shadow-sm ring-1 ring-slate-200">
                        <div className="flex flex-col gap-4">
                            {/* Controls */}
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex flex-wrap items-center gap-2">
                                    <select
                                        value={tone}
                                        onChange={(e) => setTone(e.target.value)}
                                        className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-teal-200"
                                    >
                                        <option>Friendly</option>
                                        <option>Professional</option>
                                        <option>Neutral</option>
                                        <option>Technical</option>
                                    </select>

                                    <select
                                        value={limit}
                                        onChange={(e) => setLimit(e.target.value)}
                                        className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-teal-200"
                                    >
                                        <option value="80">80 chars</option>
                                        <option value="125">125 chars</option>
                                        <option value="160">160 chars</option>
                                    </select>

                                    <select
                                        value={lang}
                                        onChange={(e) => setLang(e.target.value)}
                                        className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-teal-200"
                                    >
                                        <option>English</option>
                                        <option>Hindi</option>
                                        <option>Punjabi</option>
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

                            {/* Warning */}
                            {isOver ? (
                                <div className="rounded-md bg-amber-50 px-4 py-3 text-sm text-amber-900 ring-1 ring-amber-200">
                                    Length is over the selected limit. Try removing extra detail and keep the main takeaway.
                                </div>
                            ) : null}

                            {/* Textarea */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-900">Alt text</label>
                                <textarea
                                    className="w-full resize-none rounded-md bg-white p-4 text-sm text-slate-900 shadow-sm ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-teal-200"
                                    rows={5}
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    placeholder="Describe the image meaningfully…"
                                />
                                <div className="flex items-center justify-between text-xs text-slate-500">
                                    <span>Keep it meaningful. Avoid “image of”, “picture of”.</span>
                                    <button
                                        type="button"
                                        onClick={() => setText(text.trim())}
                                        className="font-semibold text-teal-700 hover:text-teal-800"
                                    >
                                        Trim spaces
                                    </button>
                                </div>
                            </div>

                            {/* Actions */}
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

                            {/* Mini guidance */}
                            <div className="rounded-md bg-slate-50 p-4 text-sm text-slate-600">
                                <div className="font-semibold text-slate-800">Good alt text usually includes:</div>
                                <ul className="mt-2 space-y-1">
                                    <li className="flex gap-2">
                                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
                                        What it is (object/scene)
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
                                        Why it matters (key info / takeaway)
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
                                        Keep it short and avoid repetition
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom CTA */}
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

export function ReviewApprovalPage() {
    const roles = [
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
    ] as const;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">
                        Review & approval
                    </h1>
                    <p className="mt-1 text-sm text-slate-600">
                        Collaborate with your team to finalize accessibility-ready alt text.
                    </p>
                </div>

                <div className="rounded-full bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white">
                    Step 4 · Workflow
                </div>
            </div>

            {/* ROW 1 — SUMMARY (FULL WIDTH) */}
            <div className="rounded-md bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <div className="text-sm font-semibold text-slate-900">
                            Workflow summary
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                            Progress based on approved alt text items
                        </div>
                    </div>

                    <div className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 ring-1 ring-teal-100">
                        88% complete
                    </div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-6 text-sm">
                    <div>
                        <div className="text-slate-500">Items ready</div>
                        <div className="mt-1 text-lg font-semibold text-slate-900">24</div>
                    </div>
                    <div>
                        <div className="text-slate-500">Needs changes</div>
                        <div className="mt-1 text-lg font-semibold text-amber-700">3</div>
                    </div>
                    <div>
                        <div className="text-slate-500">Approved</div>
                        <div className="mt-1 text-lg font-semibold text-emerald-700">
                            21
                        </div>
                    </div>
                </div>

                <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div className="h-2 w-[88%] rounded-full bg-teal-500" />
                </div>
            </div>

            {/* ROW 2 — CREATOR / REVIEWER / APPROVER */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {roles.map((r) => (
                    <div
                        key={r.key}
                        className="flex h-full flex-col rounded-md bg-white p-6 shadow-sm ring-1 ring-slate-200"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <div className="text-base font-semibold text-slate-900">
                                    {r.title}
                                </div>
                                <div className="mt-1 text-xs text-slate-500">
                                    {r.subtitle}
                                </div>
                            </div>

                            <span
                                className={[
                                    "rounded-full px-3 py-1 text-xs font-semibold ring-1",
                                    r.statusClass,
                                ].join(" ")}
                            >
                                {r.status}
                            </span>
                        </div>

                        <div className="mt-5 space-y-2">
                            <label className="text-xs font-semibold text-slate-700">
                                Comment
                            </label>
                            <textarea
                                rows={5}
                                placeholder="Add a note for your team…"
                                className="w-full resize-none rounded-md p-3 text-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-teal-200 outline-none"
                            />
                        </div>

                        <div className="mt-auto pt-5 flex gap-2">
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

export function ExportResultsPage() {
    const formats = [
        {
            type: "PDF",
            desc: "Accessible PDF with embedded alt text",
        },
        {
            type: "Word",
            desc: "Editable document for further review",
        },
        {
            type: "CSV",
            desc: "Structured data for audits and reports",
        },
        {
            type: "JSON",
            desc: "Developer-ready export for integrations",
        },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-2xl font-semibold text-slate-900">
                    Export results
                </h1>
                <p className="text-sm text-slate-600">
                    Download your accessibility-ready content in the format you need.
                </p>
            </div>

            {/* Export cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {formats.map((f) => (
                    <div
                        key={f.type}
                        className="flex flex-col rounded-md bg-white p-6 shadow-sm ring-1 ring-slate-200"
                    >
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-slate-900">
                                {f.type}
                            </h3>
                            <p className="mt-1 text-sm text-slate-500">
                                {f.desc}
                            </p>
                        </div>

                        <button className="mt-6 rounded-md bg-teal-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-600">
                            Download
                        </button>
                    </div>
                ))}
            </div>

            {/* Status */}
            <div className="rounded-md bg-emerald-50 p-4 text-sm text-emerald-900 ring-1 ring-emerald-200">
                Your export files are ready and available for download.
            </div>

            {/* Final CTA */}
            <div className="flex flex-col gap-4 rounded-md bg-slate-900 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-white">
                    <div className="text-sm font-medium">
                        All done
                    </div>
                    <div className="text-xs text-white/70">
                        Your content is now fully accessible and export-ready.
                    </div>
                </div>

                <button className="rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-100">
                    Go to dashboard →
                </button>
            </div>
        </div>
    );
}
function OnboardingPopup({
    step,
    onNext,
}: {
    step: number;
    onNext: () => void;
}) {
    const content = [
        {
            title: "This is your dashboard",
            desc: "Track progress, credits, analytics, and quick actions from one place.",
        },
        {
            title: "Manage your projects",
            desc: "Organize PDFs into projects so accessibility workflows stay clean and structured.",
        },
        {
            title: "Upload your PDFs",
            desc: "Upload PDFs to extract images and start generating alt text automatically.",
        },
        {
            title: "Review extracted images",
            desc: "Select only meaningful images that require alt text. Skip decorative elements.",
        },
        {
            title: "Generate alt text",
            desc: "Edit AI-generated alt text for tone, length, and clarity.",
        },
        {
            title: "Review & approve",
            desc: "Collaborate with reviewers and approvers before final export.",
        },
        {
            title: "Export results",
            desc: "Download accessibility-ready files in your preferred format.",
        },
    ];


    const c = content[step];

    return (
        <div className="absolute inset-0 z-40 flex items-start justify-center pt-40">
            <div className="absolute inset-0 bg-black/10" />

            <div className="relative w-full max-w-lg rounded-md bg-white p-6 shadow-xl">
                <div className="text-sm font-semibold text-slate-500">
                    Step {step + 1} of {content.length}
                </div>

                <h2 className="mt-1 text-xl font-semibold text-slate-900">
                    {c.title}
                </h2>

                <p className="mt-2 text-sm text-slate-600">
                    {c.desc}
                </p>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onNext}
                        className="rounded-md bg-teal-500 px-5 py-2 text-sm font-semibold text-white hover:bg-teal-600"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}

function ProjectsPage() {
    const projects = [
        {
            title: "Marketing Campaign 2024",
            files: 12,
            updated: "Sep 13, 2025",
            active: true,
        },
        {
            title: "Product Launch Q3",
            files: 8,
            updated: "Aug 22, 2025",
            badge: "Planning",
        },
        {
            title: "Client Onboarding",
            files: 5,
            updated: "Jul 15, 2025",
            badges: ["Active", "New"],
        },
        {
            title: "Internal Training Materials",
            files: 15,
            updated: "Jun 30, 2025",
        },
    ];

    const files = [
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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">
                        Projects &amp; Folders
                    </h1>
                    <p className="mt-1 text-sm text-slate-600">
                        Keep your PDFs organized with folders, tags, and quick filters.
                    </p>
                </div>

                <button className="inline-flex items-center gap-2 rounded-md bg-teal-500 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-600">
                    <Plus className="h-4 w-4" />
                    New Project
                </button>
            </div>

            {/* Search + Actions */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[260px]">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        placeholder="Search projects or files..."
                        className="w-full rounded-md border border-slate-200 bg-white py-2 pl-10 pr-3 text-sm outline-none focus:border-teal-400"
                    />
                </div>

                <button className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50">
                    <Filter className="h-4 w-4" />
                    Filter
                </button>

                <button className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50">
                    <ArrowUpDown className="h-4 w-4" />
                    Sort: Name
                </button>
            </div>

            {/* Project Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {projects.map((p) => (
                    <div
                        key={p.title}
                        className="rounded-md border border-slate-200 bg-white p-4 shadow-sm"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-teal-50 text-teal-600">
                                <Folder className="h-5 w-5" />
                            </div>
                            <button className="rounded-md p-1 hover:bg-slate-100">
                                <MoreHorizontal className="h-4 w-4 text-slate-500" />
                            </button>
                        </div>

                        <div className="mt-4 font-semibold text-slate-900">
                            {p.title}
                        </div>

                        <div className="mt-2 flex flex-wrap gap-2">
                            {p.badge && (
                                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                                    {p.badge}
                                </span>
                            )}
                            {p.badges?.map((b) => (
                                <span
                                    key={b}
                                    className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700"
                                >
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

            {/* Breadcrumb */}
            <div className="text-sm text-slate-500">
                Projects &nbsp;›&nbsp;
                <span className="font-medium text-slate-900">
                    Marketing Campaign 2024
                </span>
            </div>

            {/* Files + Info */}
            <div className="grid grid-cols-12 gap-6">
                {/* Files */}
                <div className="col-span-12 lg:col-span-8 rounded-md border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="text-lg font-semibold text-slate-900">
                            Files
                        </div>

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
                        {files.map((f) => (
                            <div
                                key={f.name}
                                className="flex items-center justify-between rounded-md border border-slate-100 p-4"
                            >
                                <div>
                                    <div className="font-medium text-slate-900">
                                        {f.name}
                                    </div>
                                    <div className="mt-1 text-xs text-slate-500">
                                        {f.size} | Uploaded by {f.by}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span
                                        className={`rounded-full border px-3 py-1 text-xs font-medium ${f.statusClass}`}
                                    >
                                        {f.status}
                                    </span>

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

                {/* Folder Info */}
                <div className="col-span-12 lg:col-span-4 rounded-md border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="text-lg font-semibold text-slate-900">
                        Folder Info
                    </div>

                    <div className="mt-4 space-y-4 text-sm">
                        <div>
                            <div className="font-medium text-slate-600">Description</div>
                            <div className="mt-1 rounded-md border border-slate-100 p-3">
                                All assets for the 2024 marketing campaign.
                            </div>
                        </div>

                        <div>
                            <div className="font-medium text-slate-600">Created Date</div>
                            <div className="mt-1 rounded-md border border-slate-100 p-3">
                                January 15, 2024
                            </div>
                        </div>

                        <div>
                            <div className="font-medium text-slate-600">Tags</div>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {["campaign", "2024", "social"].map((t) => (
                                    <span
                                        key={t}
                                        className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium"
                                    >
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

function Timeline({
    label,
    value,
    active = false,
}: {
    label: string;
    value: string;
    active?: boolean;
}) {
    return (
        <div className="flex flex-col items-center text-xs">
            <div className={`mb-1 h-2 w-2 rounded-full ${active ? "bg-green-500" : "bg-slate-300"}`} />
            <div className="font-medium text-slate-700">{value}</div>
            <div className="text-slate-400">{label}</div>
        </div>
    );
}

function Line({ active = false }: { active?: boolean }) {
    return <div className={`h-[2px] w-24 ${active ? "bg-green-500" : "bg-slate-300"}`} />;
}
