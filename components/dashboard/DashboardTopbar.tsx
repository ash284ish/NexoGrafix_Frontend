"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

import { AnimatePresence, motion } from "framer-motion";
import {
    FiChevronDown,
    FiFileText,
    FiFolder,
    FiGrid,
    FiLogOut,
    FiMail,
    FiMessageSquare,
    FiPhoneCall,
    FiSettings,
    FiUser,
    FiX,
    FiLock,
    FiCheckCircle,
    FiAlertTriangle,
    FiMenu,
    FiLayers,
    FiShield,
    FiSidebar,
    FiLayout,
    FiHelpCircle,
    FiInfo,
    FiHome,
    FiBookOpen,
    FiCode,
    FiHeadphones,
    FiDatabase,
    FiGlobe,
    FiImage,
    FiUploadCloud,
    FiEye,
    FiActivity,
} from "react-icons/fi";

type NavChild = { label: string; href: string; icon: React.ReactNode };
type NavItem =
    | { type: "link"; label: string; href: string; icon: React.ReactNode; }
    | { type: "group"; label: string; icon: React.ReactNode; children: NavChild[] };

function cx(...c: Array<string | false | null | undefined>) {
    return c.filter(Boolean).join(" ");
}

type ToastTone = "success" | "error" | "info";
type ToastState =
    | { open: false }
    | { open: true; tone: ToastTone; title: string; message?: string };

function safeJsonParse(s: string | null) {
    if (!s) return {};
    try {
        return JSON.parse(s);
    } catch {
        return {};
    }
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

export default function DashboardTopbar() {
    const router = useRouter();
    const pathname = usePathname();
    const [userOpen, setUserOpen] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [changePwd, setChangePwd] = useState(false);
    const [savingPwd, setSavingPwd] = useState(false);
    const [toast, setToast] = useState<ToastState>({ open: false });
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

    const userRef = useRef<HTMLDivElement | null>(null);
    const toastTimer = useRef<number | null>(null);

    const user =
        typeof window !== "undefined" ? safeJsonParse(localStorage.getItem("user")) : {};
    const isActive = (href: string) =>
        pathname === href || pathname.startsWith(href + "/");

    const nav = useMemo<NavItem[]>(
        () => [
            {
                type: "link",
                label: "Dashboard",
                href: "/dashboard",
                icon: <FiGrid className="h-4.5 w-4.5" />,
            },

            {
                type: "link",
                label: "Newsletter Subscribers",
                href: "/newsletter-users",
                icon: <FiMail className="h-4.5 w-4.5" />,
            },

            {
                type: "link",
                label: "Contact Submissions",
                href: "/contact-users",
                icon: <FiMessageSquare className="h-4.5 w-4.5" />,
            },

            {
                type: "link",
                label: "Feedback",
                href: "/feedback-page",
                icon: <FiMessageSquare className="h-4.5 w-4.5" />,
            },

            {
                type: "group",
                label: "Pages (CMS)",
                icon: <FiFolder className="h-4.5 w-4.5" />,
                children: [
                    { label: "Home", href: "/crm/home", icon: <FiHome className="h-4.5 w-4.5" /> },
                    { label: "ArohioPreview", href: "/crm/dashboard-preview", icon: <FiLayers className="h-4.5 w-4.5" /> },
                    { label: "About Us", href: "/crm/about", icon: <FiInfo className="h-4.5 w-4.5" /> },
                    { label: "Contact Us", href: "/crm/contact-us", icon: <FiPhoneCall className="h-4.5 w-4.5" /> },
                    { label: "Feedback", href: "/crm/feedback", icon: <FiMessageSquare className="h-4.5 w-4.5" /> },
                    { label: "FAQs", href: "/crm/faqs", icon: <FiHelpCircle className="h-4.5 w-4.5" /> },
                    { label: "Blog", href: "/crm/blog", icon: <FiFileText className="h-4.5 w-4.5" /> },
                    { label: "Blog Details", href: "/crm/blog-details", icon: <FiFileText className="h-4.5 w-4.5" /> },
                ],
            },

            {
                type: "group",
                label: "Layout (CMS)",
                icon: <FiLayout className="h-4.5 w-4.5" />,
                children: [
                    { label: "Header", href: "/crm/header", icon: <FiLayout className="h-4.5 w-4.5" /> },
                    { label: "Footer", href: "/crm/footer", icon: <FiSidebar className="h-4.5 w-4.5" /> },
                ],
            },

            {
                type: "group",
                label: "Legal (CMS)",
                icon: <FiShield className="h-4.5 w-4.5" />,
                children: [
                    { label: "Terms & Conditions", href: "/crm/terms", icon: <FiFileText className="h-4.5 w-4.5" /> },
                    { label: "Privacy Policy", href: "/crm/privacy-policy", icon: <FiFileText className="h-4.5 w-4.5" /> },
                    { label: "Refund Policy", href: "/crm/refund-policy", icon: <FiFileText className="h-4.5 w-4.5" /> },
                ],
            },

            {
                type: "group",
                label: "Products",
                icon: <FiLayers className="h-4.5 w-4.5" />,
                children: [
                    { label: "Arohio", href: "/crm/arohio", icon: <FiLayers className="h-4.5 w-4.5" /> },
                ],
            },

            {
                type: "group",
                label: "Solutions (CMS)",
                icon: <FiLayers className="h-4.5 w-4.5" />,
                children: [
                    { label: "Publishing & Digitization", href: "/crm/publishingneww", icon: <FiBookOpen className="h-4.5 w-4.5" /> },
                    { label: "Accessibility & Compliance", href: "/crm/accessibility", icon: <FiHelpCircle className="h-4.5 w-4.5" /> },
                    { label: "IT & Digital Platforms", href: "/crm/it", icon: <FiCode className="h-4.5 w-4.5" /> },
                    { label: "Data Labeling & Annotation", href: "/crm/data-labeling", icon: <FiLayers className="h-4.5 w-4.5" /> },
                    { label: "Localization & Media Accessibility", href: "/crm/localization", icon: <FiHeadphones className="h-4.5 w-4.5" /> },
                    { label: "Content, eLearning & EdTech", href: "/crm/elearning", icon: <FiBookOpen className="h-4.5 w-4.5" /> },
                ],
            },

            {
                type: "group",
                label: "Image Uploader",
                icon: <FiImage className="h-4.5 w-4.5" />,
                children: [
                    {
                        type: "link",
                        label: "Publishing & Digitization",
                        href: "/crm/image-uploader/publishing",
                        icon: <FiUploadCloud className="h-4.5 w-4.5" />,
                    },

                    {
                        type: "link",
                        label: "Accessibility & Compliance",
                        href: "/crm/image-uploader/accessibility",
                        icon: <FiEye className="h-4.5 w-4.5" />,
                    },

                    {
                        type: "link",
                        label: "IT & Digital Platforms",
                        href: "/crm/image-uploader/it-digital",
                        icon: <FiCode className="h-4.5 w-4.5" />,
                    },

                    {
                        type: "link",
                        label: "Data Labeling & Annotation",
                        href: "/crm/image-uploader/data-labelling",
                        icon: <FiDatabase className="h-4.5 w-4.5" />,
                    },

                    {
                        type: "link",
                        label: "Localization & Media Accessibility",
                        href: "/crm/image-uploader/localization-media-accessibility",
                        icon: <FiGlobe className="h-4.5 w-4.5" />,
                    },

                    {
                        type: "link",
                        label: "Content, eLearning & EdTech",
                        href: "/crm/image-uploader/content-edtech",
                        icon: <FiBookOpen className="h-4.5 w-4.5" />,
                    },
                    {
                        type: "link",
                        label: "Home Page",
                        href: "/crm/image-uploader/home",
                        icon: <FiHome className="h-4.5 w-4.5" />,
                    },
                    {
                        type: "link",
                        label: "About Us",
                        href: "/crm/image-uploader/about-us",
                        icon: <FiInfo className="h-4.5 w-4.5" />,
                    },
                    {
                        type: "link",
                        label: "Feedback",
                        href: "/crm/image-uploader/feedback",
                        icon: <FiMessageSquare className="h-4.5 w-4.5" />,
                    },
                    {
                        type: "link",
                        label: "Blogs",
                        href: "/crm/image-uploader/blogs",
                        icon: <FiBookOpen className="h-4.5 w-4.5" />,
                    },
                    {
                        type: "link",
                        label: "Blog Detail Feedback",
                        href: "/crm/image-uploader/blog-detail",
                        icon: <FiFileText className="h-4.5 w-4.5" />,
                    },
                    {
                        type: "link",
                        label: "Arohio",
                        href: "/crm/image-uploader/arohio",
                        icon: <FiActivity className="h-4.5 w-4.5" />,
                    },
                    {
                        type: "link",
                        label: "Footer – Certifications",
                        href: "/crm/image-uploader/footer-certifications",
                        icon: <FiShield className="h-4.5 w-4.5" />,
                    },
                ],
            },
        ],
        []
    );


    useEffect(() => {
        const onDown = (e: MouseEvent) => {
            const t = e.target as Node;
            if (userRef.current && !userRef.current.contains(t)) setUserOpen(false);
        };
        document.addEventListener("mousedown", onDown);
        return () => document.removeEventListener("mousedown", onDown);
    }, []);

    useEffect(() => {
        return () => {
            if (toastTimer.current) window.clearTimeout(toastTimer.current);
        };
    }, []);
    useEffect(() => {
        const next: Record<string, boolean> = {};

        nav.forEach((item) => {
            if (item.type === "group") {
                next[item.label] = item.children.some((c) => isActive(c.href));
            }
        });

        setOpenGroups((prev) => ({ ...prev, ...next }));
    }, [pathname]);

    const showToast = (next: Omit<Extract<ToastState, { open: true }>, "open">, autoMs = 3800) => {
        if (toastTimer.current) window.clearTimeout(toastTimer.current);
        setToast({ open: true, ...next });
        toastTimer.current = window.setTimeout(() => setToast({ open: false }), autoMs);
    };

    const closeProfile = () => {
        setShowProfile(false);
        setChangePwd(false);
        setSavingPwd(false);
    };

    const doClientLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
    };

    const handleLogout = async () => {
        setUserOpen(false);
        setLoggingOut(true);

        try {
            await fetch(`${API_BASE}/api/v1/users/logout`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
                },
            });
        } catch { }

        doClientLogout();

        setTimeout(() => router.push("/login"), 1600);
    };

    const handlePasswordUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (savingPwd) return;

        const token = localStorage.getItem("access_token") || "";
        if (!token) {
            showToast(
                {
                    tone: "error",
                    title: "Unauthorized",
                    message: "Session missing. Please login again.",
                },
                4500
            );
            return;
        }

        const fd = new FormData(e.currentTarget);
        const old_password = String(fd.get("old_password") || "");
        const new_password = String(fd.get("new_password") || "");

        if (!old_password || !new_password) {
            showToast({ tone: "error", title: "Missing fields", message: "Please fill both passwords." });
            return;
        }
        if (new_password.length < 6) {
            showToast({ tone: "error", title: "Weak password", message: "New password should be at least 6 characters." });
            return;
        }
        if (old_password === new_password) {
            showToast({ tone: "error", title: "Invalid password", message: "New password must be different from old password." });
            return;
        }

        setSavingPwd(true);

        try {
            const res = await fetch(`${API_BASE}/api/v1/users/change-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ old_password, new_password }),
            });

            let data: any = null;
            try {
                data = await res.json();
            } catch { }

            if (res.status === 401 || res.status === 403) {
                showToast(
                    {
                        tone: "error",
                        title: "Unauthorized",
                        message: "Current password is incorrect or your session has expired. Please log out and log in again."
                    },
                    4500
                );
                setSavingPwd(false);
                return;
            }

            if (!res.ok) {
                const msg =
                    (data && (data.detail || data.message)) ||
                    "Please enter current password correctly and try again.";
                showToast({ tone: "error", title: "Password not changed", message: String(msg) }, 4500);
                setSavingPwd(false);
                return;
            }

            showToast(
                { tone: "success", title: "Password reset successfully", message: "You will be redirected to login in 5 seconds." },
                5000
            );

            setTimeout(() => {
                setLoggingOut(true);
                closeProfile();
                doClientLogout();
                setTimeout(() => router.push("/login"), 800);
            }, 5000);
        } catch {
            showToast({ tone: "error", title: "Network error", message: "Unable to update password right now." }, 4500);
            setSavingPwd(false);
        }
    };
    function renderMobileNavItem(item: NavItem) {
        if (item.type === "link") {
            return (
                <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileNavOpen(false)}
                    className={cx(
                        "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold",
                        isActive(item.href)
                            ? "bg-[#ff7a1a]/10 text-[#ff7a1a]"
                            : "text-slate-700 hover:bg-black/5"
                    )}

                >
                    <span className="grid h-8 w-8 place-items-center text-slate-600">
                        {item.icon}
                    </span>
                    <span className="flex-1 truncate">{item.label}</span>
                </Link>
            );
        }

        const isOpen = openGroups[item.label];

        return (
            <div key={item.label} className="space-y-1">

                <button
                    type="button"
                    onClick={() =>
                        setOpenGroups((prev) => ({
                            ...prev,
                            [item.label]: !prev[item.label],
                        }))
                    }
                    className="flex w-full items-center justify-between px-3 pt-3 text-xs font-extrabold uppercase tracking-wide text-slate-400 hover:text-slate-600"
                >
                    <span>{item.label}</span>
                    <FiChevronDown
                        className={cx(
                            "h-4 w-4 transition-transform duration-200",
                            isOpen && "rotate-180"
                        )}
                    />
                </button>


                <AnimatePresence initial={false}>
                    {isOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="overflow-hidden"
                        >
                            {item.children.map((child) => (
                                <Link
                                    key={child.href}
                                    href={child.href}
                                    onClick={() => setMobileNavOpen(false)}
                                    className={cx(
                                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold",
                                        isActive(child.href)
                                            ? "bg-[#ff7a1a]/10 text-[#ff7a1a]"
                                            : "text-slate-700 hover:bg-black/5"
                                    )}
                                >
                                    <span className="grid h-7 w-7 place-items-center text-slate-500">
                                        {child.icon}
                                    </span>
                                    <span className="truncate">{child.label}</span>
                                </Link>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );

    }

    return (
        <>
            <div className="sticky top-0 z-20 border-b border-black/10 bg-white/70 backdrop-blur">
                <div className="flex items-center justify-between gap-3 px-4 py-4 lg:px-6">
                    <Link href="/dashboard" className="flex items-center gap-2 lg:hidden">
                        <span className="grid h-9 w-9 place-items-center rounded-sm bg-[#ff7a1a] text-white font-black">N</span>
                        <span className="text-sm font-extrabold tracking-tight text-slate-900">Nexografix</span>
                    </Link>
                    <button
                        type="button"
                        onClick={() => setMobileNavOpen(true)}
                        className="lg:hidden grid h-10 w-10 place-items-center rounded-md border border-black/10 bg-white text-slate-700 hover:bg-black/5"
                    >
                        <FiMenu className="h-5 w-5" />
                    </button>

                    <div className="flex flex-1 items-center justify-end gap-3">
                        <div ref={userRef} className="relative">
                            <button
                                type="button"
                                onClick={() => setUserOpen((v) => !v)}
                                className="inline-flex items-center gap-2 rounded-md bg-white/60 px-2.5 py-2.5 text-sm font-bold text-slate-800 shadow-sm ring-1 ring-black/5 hover:bg-black/5"
                            >
                                <span className="grid h-8 w-8 place-items-center rounded-md bg-[#ff7a1a]/15 text-[#ff7a1a]">
                                    <FiUser className="h-4.5 w-4.5" />
                                </span>
                                <FiChevronDown className="h-4 w-4 text-slate-500" />
                            </button>

                            <AnimatePresence>
                                {userOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute right-0 mt-2 w-60 overflow-hidden rounded-md border border-black/10 bg-white shadow-[0_18px_50px_-30px_rgba(0,0,0,0.45)]"
                                    >
                                        <div className="px-3 py-3">
                                            <div className="flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-2">
                                                <div className="grid h-9 w-9 place-items-center rounded-lg bg-[#ff7a1a]/15 text-[#ff7a1a]">
                                                    <FiUser />
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="truncate text-sm font-extrabold text-slate-900">
                                                        {(user?.first_name || "User") + " " + (user?.last_name || "")}
                                                    </div>
                                                    <div className="truncate text-xs font-semibold text-slate-500">{user?.email || "—"}</div>
                                                </div>
                                            </div>

                                            <div className="mt-2 space-y-1">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setUserOpen(false);
                                                        setShowProfile(true);
                                                        setChangePwd(false);
                                                    }}
                                                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-black/5"
                                                >
                                                    <FiUser />
                                                    Profile
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={handleLogout}
                                                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50"
                                                >
                                                    <FiLogOut />
                                                    Logout
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showProfile && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 grid place-items-center bg-black/35 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.97, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.98, opacity: 0, y: 6 }}
                            className="w-[94vw] max-w-105 overflow-hidden rounded-md border border-white/20 bg-white shadow-[0_30px_70px_-35px_rgba(0,0,0,0.55)]"
                        >
                            <div className="relative border-b border-black/5 bg-linear-to-b from-slate-50 to-white px-6 py-5">
                                <button
                                    type="button"
                                    onClick={closeProfile}
                                    className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-md text-slate-600 hover:bg-black/5"
                                >
                                    <FiX className="h-4.5 w-4.5" />
                                </button>

                                <div className="flex items-center gap-3">
                                    <div className="grid h-11 w-11 place-items-center rounded-md bg-[#ff7a1a]/15 text-[#ff7a1a]">
                                        <FiUser className="h-4.5 w-4.5" />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="truncate text-base font-extrabold tracking-tight text-slate-900">
                                            {(user?.first_name || "User") + " " + (user?.last_name || "")}
                                        </div>
                                        <div className="truncate text-sm font-semibold text-slate-500">{user?.email || "—"}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="px-6 py-5">
                                {!changePwd ? (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 gap-3">
                                            <div className="rounded-md border border-black/10 bg-white px-4 py-3">
                                                <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">First Name</div>
                                                <div className="mt-1 text-sm font-bold text-slate-800">{user?.first_name || "—"}</div>
                                            </div>

                                            <div className="rounded-md border border-black/10 bg-white px-4 py-3">
                                                <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Last Name</div>
                                                <div className="mt-1 text-sm font-bold text-slate-800">{user?.last_name || "—"}</div>
                                            </div>

                                            <div className="rounded-md border border-black/10 bg-white px-4 py-3">
                                                <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Email</div>
                                                <div className="mt-1 text-sm font-bold text-slate-800">{user?.email || "—"}</div>
                                            </div>

                                            <div className="rounded-md border border-black/10 bg-white px-4 py-3">
                                                <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Phone</div>
                                                <div className="mt-1 text-sm font-bold text-slate-800">{user?.phone || "—"}</div>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setChangePwd(true)}
                                                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#ff7a1a] py-2.5 text-sm font-extrabold text-white shadow-[0_12px_30px_-18px_rgba(255,122,26,0.9)] hover:brightness-[0.98]"
                                            >
                                                <FiLock />
                                                Change Password
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="rounded-md border border-black/10 bg-slate-50 px-4 py-3">
                                            <div className="text-sm font-extrabold text-slate-900">Update password</div>
                                            <div className="mt-1 text-xs font-semibold text-slate-500">
                                                Correct current password required. On success you’ll be redirected to login.
                                            </div>
                                        </div>

                                        <form onSubmit={handlePasswordUpdate} className="space-y-3">
                                            <div className="space-y-2">
                                                <label className="text-xs font-extrabold text-slate-700">Current password</label>
                                                <input
                                                    name="old_password"
                                                    type="password"
                                                    required
                                                    disabled={savingPwd}
                                                    className="w-full rounded-md border border-black/10 bg-white px-3 py-2.5 text-sm font-semibold text-slate-800 outline-none ring-0 placeholder:text-slate-400 focus:border-[#ff7a1a]/40 focus:ring-4 focus:ring-[#ff7a1a]/15"
                                                    placeholder="Enter current password"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-extrabold text-slate-700">New password</label>
                                                <input
                                                    name="new_password"
                                                    type="password"
                                                    required
                                                    disabled={savingPwd}
                                                    className="w-full rounded-md border border-black/10 bg-white px-3 py-2.5 text-sm font-semibold text-slate-800 outline-none ring-0 placeholder:text-slate-400 focus:border-[#ff7a1a]/40 focus:ring-4 focus:ring-[#ff7a1a]/15"
                                                    placeholder="Enter new password"
                                                />
                                            </div>

                                            <div className="flex gap-2 pt-1">
                                                <button
                                                    type="button"
                                                    onClick={() => setChangePwd(false)}
                                                    disabled={savingPwd}
                                                    className="w-full rounded-md border border-black/10 bg-white py-2.5 text-sm font-extrabold text-slate-700 hover:bg-black/5 disabled:opacity-60"
                                                >
                                                    Back
                                                </button>

                                                <button
                                                    type="submit"
                                                    disabled={savingPwd}
                                                    className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#ff7a1a] py-2.5 text-sm font-extrabold text-white shadow-[0_12px_30px_-18px_rgba(255,122,26,0.9)] hover:brightness-[0.98] disabled:opacity-70"
                                                >
                                                    {savingPwd ? "Updating..." : "Update Password"}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {toast.open && (
                    <motion.div
                        initial={{ opacity: 0, y: 14, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        className="fixed right-4 top-4 z-60 w-[92vw] max-w-90"
                    >
                        <div
                            className={cx(
                                "overflow-hidden rounded-md border bg-white shadow-[0_18px_50px_-30px_rgba(0,0,0,0.5)]",
                                toast.tone === "success" && "border-emerald-200",
                                toast.tone === "error" && "border-rose-200",
                                toast.tone === "info" && "border-slate-200"
                            )}
                        >
                            <div className="flex items-start gap-3 px-4 py-4">
                                <div
                                    className={cx(
                                        "mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-md",
                                        toast.tone === "success" && "bg-emerald-50 text-emerald-700",
                                        toast.tone === "error" && "bg-rose-50 text-rose-700",
                                        toast.tone === "info" && "bg-slate-50 text-slate-700"
                                    )}
                                >
                                    {toast.tone === "success" ? (
                                        <FiCheckCircle className="h-4.5 w-4.5" />
                                    ) : toast.tone === "error" ? (
                                        <FiAlertTriangle className="h-4.5 w-4.5" />
                                    ) : (
                                        <FiUser className="h-4.5 w-4.5" />
                                    )}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="text-sm font-extrabold text-slate-900">{toast.title}</div>
                                    {toast.message ? (
                                        <div className="mt-0.5 text-xs font-semibold leading-relaxed text-slate-600">{toast.message}</div>
                                    ) : null}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setToast({ open: false })}
                                    className="grid h-9 w-9 place-items-center rounded-md text-slate-600 hover:bg-black/5"
                                >
                                    <FiX className="h-4.5 w-4.5" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {loggingOut && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 grid place-items-center bg-black/30 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ y: 6, opacity: 0, scale: 0.98 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                            className="w-70 rounded-md border border-white/20 bg-white px-6 py-4 shadow-[0_20px_60px_-25px_rgba(0,0,0,0.45)]"
                        >
                            <div className="flex items-center justify-between">
                                <div className="text-sm font-extrabold tracking-wide text-slate-800">Logging out</div>
                                <div className="text-[11px] font-extrabold text-slate-400">Please wait</div>
                            </div>
                            <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-slate-200">
                                <motion.div
                                    initial={{ x: "-100%" }}
                                    animate={{ x: "0%" }}
                                    transition={{ duration: 1.4, ease: "easeInOut" }}
                                    className="h-full w-full bg-[#ff7a1a]"
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {mobileNavOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-55 bg-black/40 backdrop-blur-sm lg:hidden"
                        onClick={() => setMobileNavOpen(false)}
                    >
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                            onClick={(e) => e.stopPropagation()}
                            className="h-full w-65 bg-white shadow-xl flex flex-col"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between border-b px-4 py-4">
                                <div className="flex items-center gap-2">
                                    <span className="grid h-9 w-9 place-items-center rounded-sm bg-[#ff7a1a] text-white font-black">
                                        N
                                    </span>
                                    <span className="text-sm font-extrabold text-slate-900">
                                        Nexografix
                                    </span>
                                </div>

                                <button
                                    onClick={() => setMobileNavOpen(false)}
                                    className="grid h-9 w-9 place-items-center rounded-md hover:bg-black/5"
                                >
                                    <FiX className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="flex-1 px-2 py-4 overflow-y-auto space-y-2">
                                {nav.map((item) => renderMobileNavItem(item))}
                            </div>

                        </motion.aside>
                    </motion.div>
                )}
            </AnimatePresence>

        </>
    );
}
