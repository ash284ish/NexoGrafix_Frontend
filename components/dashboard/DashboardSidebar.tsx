"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiGrid,
  FiMail,
  FiMessageSquare,
  FiPhoneCall,
  FiFileText,
  FiChevronDown,
  FiHome,
  FiInfo,
  FiHelpCircle,
  FiLayout,
  FiSidebar,
  FiFolder,
  FiShield,
  FiLayers,
  FiEdit3,
  FiBookOpen,
  FiCode,
  FiPenTool,
  FiHeadphones,
  FiZap,
  FiMessageCircle,
  FiImage,
  FiUploadCloud,
  FiEye,
  FiGlobe,
  FiDatabase,
  FiActivity,
  FiBriefcase,
  FiTag,
} from "react-icons/fi";

type Stats = {
  total_newsletters: number;
  total_new_requests: number;
  total_in_progress: number;
  total_resolved: number;
};

type NavNode =
  | {
    type: "link";
    label: string;
    href: string;
    icon: React.ReactNode;
    badge?: number | string;
  }
  | { type: "group"; label: string; icon: React.ReactNode; children: NavNode[] };

function cx(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
}

function formatNum(n: number) {
  return new Intl.NumberFormat("en-IN").format(n);
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

export default function DashboardSidebar() {
  const pathname = usePathname();

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    "Pages (CMS)": false,
    "Samples (CMS)": false,
    "Layout (CMS)": false,
    "Legal (CMS)": false,
    products: false,
    "Solutions (CMS)": false,
    "Image Uploader": false,
  });

  const toggleGroup = (label: string) => {
    setOpenGroups((s) => ({ ...s, [label]: !s[label] }));
  };

  const [stats, setStats] = useState<Stats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setLoadingStats(true);

        const res = await fetch(`${API_BASE}/api/v1/stats`, {
          method: "GET",
          cache: "no-store",
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });

        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(`Stats fetch failed: ${res.status} ${res.statusText} :: ${txt}`);
        }

        const data = (await res.json()) as Stats;
        setStats(data);
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return;
        console.error("Stats API error:", e);
        setStats(null);
      } finally {
        setLoadingStats(false);
      }
    }

    load();
    return () => controller.abort();
  }, []);

  const newsletterBadge = loadingStats ? "—" : stats ? formatNum(stats.total_newsletters) : "—";
  const contactBadge = loadingStats ? "—" : stats ? formatNum(stats.total_new_requests) : "—";

  const nav = useMemo<NavNode[]>(
    () => [
      { type: "link", label: "Dashboard", href: "/dashboard", icon: <FiGrid className="h-4.5 w-4.5" /> },
      {
        type: "link",
        label: "Newsletter Subscribers",
        href: "/newsletter-users",
        icon: <FiMail className="h-4.5 w-4.5" />,
        badge: newsletterBadge,
      },
      {
        type: "link",
        label: "Contact Submissions",
        href: "/contact-users",
        icon: <FiMessageSquare className="h-4.5 w-4.5" />,
        badge: contactBadge,
      },
      {
        type: "link",
        label: "Feedback",
        href: "/feedback-page",
        icon: <FiMessageCircle className="h-4.5 w-4.5" />,
      },
      {
        type: "group",
        label: "Pages (CMS)",
        icon: <FiFolder className="h-4.5 w-4.5" />,
        children: [
          { type: "link", label: "Home", href: "/crm/home", icon: <FiHome className="h-4.5 w-4.5" /> },
          {
            type: "link",
            label: "ArohioPreview",
            href: "/crm/dashboard-preview",
            icon: <FiLayers className="h-4.5 w-4.5" />,
          },
          { type: "link", label: "About Us", href: "/crm/about", icon: <FiInfo className="h-4.5 w-4.5" /> },
          {
            type: "link",
            label: "Contact Us",
            href: "/crm/contact-us",
            icon: <FiPhoneCall className="h-4.5 w-4.5" />,
          },
          { type: "link", label: "Feedback", href: "/crm/feedback", icon: <FiMessageSquare className="h-4.5 w-4.5" /> },
          { type: "link", label: "FAQs", href: "/crm/faqs", icon: <FiHelpCircle className="h-4.5 w-4.5" /> },
          { type: "link", label: "Blog", href: "/crm/blog", icon: <FiFileText className="h-4.5 w-4.5" /> },
          { type: "link", label: "Blog Details", href: "/crm/blog-details", icon: <FiFileText className="h-4.5 w-4.5" /> },
        ],
      },

      {
        type: "group",
        label: "Samples (CMS)",
        icon: <FiBriefcase className="h-4.5 w-4.5" />,
        children: [
          { type: "link", label: "Samples Page", href: "/crm/samples", icon: <FiBriefcase className="h-4.5 w-4.5" /> },
        ],
      },


      {
        type: "group",
        label: "Layout (CMS)",
        icon: <FiLayout className="h-4.5 w-4.5" />,
        children: [
          { type: "link", label: "Header", href: "/crm/header", icon: <FiLayout className="h-4.5 w-4.5" /> },
          { type: "link", label: "Footer", href: "/crm/footer", icon: <FiSidebar className="h-4.5 w-4.5" /> },
        ],
      },

      {
        type: "group",
        label: "Legal (CMS)",
        icon: <FiShield className="h-4.5 w-4.5" />,
        children: [
          { type: "link", label: "Terms & Conditions", href: "/crm/terms", icon: <FiFileText className="h-4.5 w-4.5" /> },
          {
            type: "link",
            label: "Privacy Policy",
            href: "/crm/privacy-policy",
            icon: <FiFileText className="h-4.5 w-4.5" />,
          },
          { type: "link", label: "Refund Policy", href: "/crm/refund-policy", icon: <FiFileText className="h-4.5 w-4.5" /> },
        ],
      },

      {
        type: "group",
        label: "products",
        icon: <FiLayers className="h-4.5 w-4.5" />,
        children: [{ type: "link", label: "Arohio", href: "/crm/arohio", icon: <FiLayers className="h-4.5 w-4.5" /> }],
      },

      {
        type: "group",
        label: "Solutions (CMS)",
        icon: <FiLayers className="h-4.5 w-4.5" />,
        children: [
          {
            type: "link",
            label: "Publishing & Digitization",
            href: "/crm/publishingneww",
            icon: <FiBookOpen className="h-4.5 w-4.5" />,
          },
          {
            type: "link",
            label: "Accessibility & Compliance",
            href: "/crm/accessibility",
            icon: <FiHelpCircle className="h-4.5 w-4.5" />,
          },
          {
            type: "link",
            label: "IT & Digital Platforms",
            href: "/crm/it",
            icon: <FiCode className="h-4.5 w-4.5" />,
          },
          {
            type: "link",
            label: "Data Labeling & Annotation",
            href: "/crm/data-labeling",
            icon: <FiLayers className="h-4.5 w-4.5" />,
          },
          {
            type: "link",
            label: "Localization & Media Accessibility",
            href: "/crm/localization",
            icon: <FiHeadphones className="h-4.5 w-4.5" />,
          },
          {
            type: "link",
            label: "Content, eLearning & EdTech",
            href: "/crm/elearning",
            icon: <FiBookOpen className="h-4.5 w-4.5" />,
          },
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
    [newsletterBadge, contactBadge]
  );

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href);

  const groupActive = (children: NavNode[]): boolean =>
    children.some((n) => (n.type === "link" ? isActive(n.href) : groupActive(n.children)));

  const nodeKey = (n: NavNode) => (n.type === "link" ? `link:${n.href}` : `group:${n.label}`);

  function renderNode(node: NavNode, depth = 0) {
    if (node.type === "link") {
      const active = isActive(node.href);

      return (
        <Link
          key={nodeKey(node)}
          href={node.href}
          className={cx(
            "flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-semibold transition",
            "min-w-0",
            depth > 0 && "py-2 text-[13px]",
            active ? "bg-[#ff7a1a]/10 text-slate-900" : "text-slate-700 hover:bg-black/5"
          )}
        >
          <span className={cx("grid h-9 w-9 shrink-0 place-items-center rounded-sm", active ? "text-[#ff7a1a]" : "text-slate-700")}>
            {node.icon}
          </span>

          <span className="truncate">{node.label}</span>

          {node.badge !== undefined ? (
            <span className={cx("ml-auto shrink-0 text-[11px] font-extrabold", active ? "text-[#ff7a1a]" : "text-slate-600")}>
              {node.badge}
            </span>
          ) : null}
        </Link>
      );
    }

    const active = groupActive(node.children);
    const isOpen = !!openGroups[node.label];

    return (
      <div key={nodeKey(node)} className="space-y-1 min-w-0">
        <button
          type="button"
          onClick={() => toggleGroup(node.label)}
          className={cx(
            "flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-semibold transition",
            "min-w-0",
            active ? "bg-[#ff7a1a]/10 text-slate-900" : "text-slate-700 hover:bg-black/5"
          )}
        >
          <span className={cx("grid h-9 w-9 shrink-0 place-items-center rounded-sm", active ? "text-[#ff7a1a]" : "text-slate-700")}>
            {node.icon}
          </span>

          <span className="truncate">{node.label}</span>

          <span className="ml-auto shrink-0 text-slate-500">
            <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.18 }}>
              <FiChevronDown className="h-4 w-4" />
            </motion.span>
          </span>
        </button>

        <AnimatePresence initial={false}>
          {isOpen ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className={cx("space-y-1 pb-2 pr-2 min-w-0", depth === 0 ? "pl-12" : "pl-10")}>
                {node.children.map((child) => renderNode(child, depth + 1))}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <aside className="relative hidden h-screen w-55 shrink-0 bg-white/55 backdrop-blur lg:flex lg:flex-col">
      <div className="px-4 pt-8 pb-4 shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-sm bg-[#ff7a1a] text-white font-black">N</span>
          <span className="text-sm font-extrabold tracking-tight text-slate-900">Nexografix</span>
        </Link>
      </div>

      <div className="px-2 pt-6 flex-1 min-h-0 overflow-y-auto overflow-x-auto">
        <nav className="space-y-1 min-w-55">{nav.map((n) => renderNode(n, 0))}</nav>
      </div>
    </aside>
  );
}
