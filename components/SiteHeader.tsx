"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaGoogle } from "react-icons/fa";
import {
  FiHome,
  FiLayers,
  FiBox,
  FiBookOpen,
  FiChevronDown,
  FiUser,
  FiMail,
  FiCpu,
  FiBook,
  FiEdit3,
  FiHeadphones,
  FiZap,
  FiFileText,
  FiPenTool,
  FiHelpCircle,
  FiMenu,
  FiX,
  FiMessageSquare,
  FiSmartphone,
  FiCode,
  FiArrowRight,
} from "react-icons/fi";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

type NavItem = { title: string; href: string; icon?: string };

type HeaderData = {
  brand: { name: string; href: string };
  topbar: {
    text: string;
    socials: Array<{ key: string; label: string; href: string; icon: string }>;
  };
  cta: { label: string; href: string };
  nav: {
    home: { label: string; icon: string; items: NavItem[] };
    solutions: {
      label: string;
      icon: string;
      defaultActiveKey?: string;
      categories: Array<{
        key: string;
        title: string;
        icon: string;
        href?: string;
        items: NavItem[];
      }>;
    };
    products: { label: string; icon: string; items: NavItem[] };
    resources: { label: string; icon: string; items: NavItem[] };
  };
};

type HeaderResponse = { header: HeaderData };

const FALLBACK: HeaderData = {
  brand: { name: "Nexografix", href: "/" },
  topbar: {
    text: "Nexografix — PDF & Document Accessibility Compliance | WCAG · Section 508 · EPUB",
    socials: [
      { key: "facebook", label: "Facebook", href: "#", icon: "FaFacebookF" },
      { key: "twitter", label: "Twitter", href: "#", icon: "FaTwitter" },
      { key: "linkedin", label: "LinkedIn", href: "#", icon: "FaLinkedinIn" },
      { key: "google", label: "Google", href: "#", icon: "FaGoogle" },
    ],
  },
  cta: { label: "Book an Appointment", href: "/contact" },
  nav: {
    home: {
      label: "Home",
      icon: "FiHome",
      items: [
        { title: "Homepage", href: "/", icon: "FiHome" },
        { title: "Case Studies", href: "/case-studies", icon: "FiBox" },
        { title: "About Us", href: "/about", icon: "FiUser" },
        { title: "Contact Us", href: "/contact", icon: "FiMail" },
      ],
    },
    solutions: {
      label: "Solutions",
      icon: "FiLayers",
      defaultActiveKey: "publishing",
      categories: [
        {
          key: "publishing",
          title: "Publishing & Digitization",
          icon: "FiBook",
          href: "/publishing-digitization",
          items: [
            { title: "Document Digitization & Scanning", href: "/publishing-digitization#digitization", icon: "FiFileText" },
            { title: "Copyediting & Proofreading", href: "/publishing-digitization#editing", icon: "FiEdit3" },
            { title: "eBook Conversion (EPUB/Kindle)", href: "/publishing-digitization#ebook-conversion", icon: "FiBookOpen" },
            { title: "XML / HTML Conversion", href: "/publishing-digitization#xml-html", icon: "FiCode" },
            { title: "Typesetting & Layout Design", href: "/publishing-digitization#typesetting", icon: "FiPenTool" },
            { title: "Metadata Creation & Tagging", href: "/publishing-digitization#metadata", icon: "FiLayers" },
            { title: "Multimedia Integration", href: "/publishing-digitization#multimedia", icon: "FiHeadphones" },
            { title: "Interactive eBook Development", href: "/publishing-digitization#interactive-ebooks", icon: "FiZap" },
            { title: "Print-on-Demand (POD) Prep", href: "/publishing-digitization#pod", icon: "FiFileText" },
            { title: "Magazine / Newspaper Digitization", href: "/publishing-digitization#news-mag-digitization", icon: "FiFileText" },
          ],
        },
        {
          key: "accessibility",
          title: "Accessibility & Compliance",
          icon: "FiHelpCircle",
          href: "/accessibility-compliance",
          items: [
            { title: "PDF Accessibility & Remediation", href: "/accessibility-compliance#pdf", icon: "FiFileText" },
            { title: "eBook Accessibility (EPUB)", href: "/accessibility-compliance#epub", icon: "FiBookOpen" },
            { title: "Educational Content Accessibility", href: "/accessibility-compliance#education", icon: "FiBook" },
            { title: "Website / HTML Accessibility", href: "/accessibility-compliance#web", icon: "FiCode" },
            { title: "DOCX / PPTX / Excel Accessibility", href: "/accessibility-compliance#documents", icon: "FiLayers" },
            { title: "Audio/Video Accessibility", href: "/accessibility-compliance#media", icon: "FiHeadphones" },
            { title: "Audits & Compliance Reporting", href: "/accessibility-compliance#audits", icon: "FiFileText" },
            { title: "Assistive Tech Testing", href: "/accessibility-compliance#testing", icon: "FiCpu" },
            { title: "Govt / Institutional Compliance", href: "/accessibility-compliance#institutional", icon: "FiUser" },
            { title: "Consulting & Training", href: "/accessibility-compliance#training", icon: "FiEdit3" },
          ],
        },
        {
          key: "it",
          title: "IT & Digital Platforms",
          icon: "FiCpu",
          href: "/digital-platforms",
          items: [
            { title: "Web Development", href: "/digital-platforms/web-development", icon: "FiCode" },
            { title: "UI / UX Design", href: "/digital-platforms/ui-ux", icon: "FiPenTool" },
            { title: "Mobile App Development", href: "/digital-platforms/mobile-development", icon: "FiSmartphone" },
            { title: "E-commerce Development", href: "/digital-platforms/ecommerce", icon: "FiBox" },
            { title: "Custom Software Development", href: "/digital-platforms/custom-software", icon: "FiZap" },
            { title: "EdTech / LMS Development", href: "/digital-platforms/edtech-lms", icon: "FiBookOpen" },
            { title: "AI & Automation", href: "/digital-platforms/ai-automation", icon: "FiZap" },
            { title: "CMS / DAM / Content Systems", href: "/digital-platforms/cms-dam", icon: "FiLayers" },
            { title: "API & Integrations", href: "/digital-platforms/integrations", icon: "FiCode" },
          ],
        },
        {
          key: "labeling",
          title: "Data Labeling & Annotation",
          icon: "FiLayers",
          href: "/data-labeling",
          items: [
            { title: "Image Annotation", href: "/data-labeling#data-labeling/image", icon: "FiFileText" },
            { title: "Video Annotation", href: "/data-labeling#data-labeling/video", icon: "FiFileText" },
            { title: "LiDAR / 3D Annotation", href: "/data-labeling#data-labeling/lidar", icon: "FiFileText" },
            { title: "Text Data Annotation (NLP)", href: "/data-labeling#data-labeling/text", icon: "FiFileText" },
            { title: "Audio / Speech Annotation", href: "/data-labeling#data-labeling/audio", icon: "FiHeadphones" },
            { title: "Dataset Creation & Management", href: "/data-labeling#data-labeling/datasets", icon: "FiLayers" },
            { title: "QA & Validation", href: "/data-labeling#data-labeling/qa", icon: "FiHelpCircle" },
          ],
        },
        {
          key: "localization",
          title: "Localization & Media Accessibility",
          icon: "FiHeadphones",
          href: "/localization-media",
          items: [
            { title: "Audio Description", href: "/localization-media#localization/audio-description", icon: "FiHeadphones" },
            { title: "Subtitles / Captions", href: "/localization-media#localization/captions", icon: "FiFileText" },
            { title: "Transcription", href: "/localization-media#localization/transcription", icon: "FiFileText" },
            { title: "Video Accessibility", href: "/localization-media#localization/video-accessibility", icon: "FiCode" },
            { title: "Image Description", href: "/localization-media#localization/image-description", icon: "FiFileText" },
            { title: "Video Visual Narration", href: "/localization-media#localization/visual-narration", icon: "FiPenTool" },
            { title: "Translation (Text & Media)", href: "/localization-media#localization/translation", icon: "FiGlobeIcon" },
          ],
        },
        {
          key: "elearning",
          title: "Content, eLearning & EdTech",
          icon: "FiBookOpen",
          href: "/elearning-edtech",
          items: [
            { title: "Educational Content Development", href: "/elearning-edtech#elearning/educational-content", icon: "FiBook" },
            { title: "eLearning Content Development", href: "/elearning-edtech#elearning/elearning-content", icon: "FiBookOpen" },
            { title: "EdTech Content Services", href: "/elearning-edtech#elearning/edtech-content", icon: "FiCpu" },
            { title: "K-12 Content Development", href: "/elearning-edtech#elearning/k12", icon: "FiBook" },
            { title: "Assessments / Question Banks", href: "/elearning-edtech#elearning/assessments", icon: "FiFileText" },
            { title: "Curriculum / Instructional Design", href: "/elearning-edtech#elearning/curriculum", icon: "FiPenTool" },
            { title: "Video Learning Content", href: "/elearning-edtech#elearning/video-learning", icon: "FiHeadphones" },
          ],
        },
      ],
    },
    products: { label: "Products", icon: "FiBox", items: [{ title: "Arohio.ai", href: "/arohio", icon: "FiZap" }] },
    resources: {
      label: "Resources",
      icon: "FiBookOpen",
      items: [
        { title: "Case Studies", href: "/case-studies", icon: "FiBox" },
        { title: "Work Samples", href: "/samples", icon: "FiLayers" },
        { title: "Feedback", href: "/feedback", icon: "FiMessageSquare" },
        { title: "Insights / Blog", href: "/blog", icon: "FiPenTool" },
        { title: "FAQs", href: "/faqs", icon: "FiHelpCircle" },
      ],
    },
  },
};


function FiGlobeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 22a10 10 0 1 0-10-10 10 10 0 0 0 10 10Zm0 0c2.5 0 4.5-4.5 4.5-10S14.5 2 12 2 7.5 6.5 7.5 12 9.5 22 12 22Zm-9-10h18M4.5 7h15M4.5 17h15"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

const iconLinkStyle = {
  color: "#ffffff",
  textDecoration: "none",
  paddingRight: "12px",
  marginLeft: "12px",
  borderRight: "1px solid rgba(255,255,255,0.6)",
  display: "flex",
  alignItems: "center",
};

const iconLinkStyleNoBorder = {
  color: "#ffffff",
  textDecoration: "none",
  paddingRight: "0px",
  marginLeft: "12px",
  borderRight: "0px",
  display: "flex",
  alignItems: "center",
};

export default function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<null | "home" | "solutions" | "products" | "resources">(null);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [mobileSolutionOpenKey, setMobileSolutionOpenKey] = useState<string | null>(null);

  const [data, setData] = useState<HeaderData | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`/api/v1/content/header`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load header");
        const json = (await res.json()) as HeaderResponse;
        if (alive) setData(json?.header ?? null);
      } catch (e) {
        console.error(e);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const h = useMemo(() => {
    const base = data ?? FALLBACK;
    const homeItems = [...base.nav.home.items];
    if (!homeItems.some((it) => it.href === "/case-studies")) {
      homeItems.splice(1, 0, { title: "Case Studies", href: "/case-studies", icon: "FiBox" });
    }
    const resItems = [...base.nav.resources.items];
    if (!resItems.some((it) => it.href === "/case-studies")) {
      resItems.unshift({ title: "Case Studies", href: "/case-studies", icon: "FiBox" });
    }
    if (!resItems.some((it) => it.href === "/samples")) {
      resItems.splice(1, 0, { title: "Work Samples", href: "/samples", icon: "FiLayers" });
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


  const iconMap: Record<string, ReactNode> = useMemo(() => ({
    FaFacebookF: <FaFacebookF size={16} />,
    FaTwitter: <FaTwitter size={16} />,
    FaLinkedinIn: <FaLinkedinIn size={16} />,
    FaGoogle: <FaGoogle size={16} />,

    FiHome: <FiHome />,
    FiLayers: <FiLayers />,
    FiBox: <FiBox />,
    FiBookOpen: <FiBookOpen />,
    FiUser: <FiUser />,
    FiMail: <FiMail />,
    FiCpu: <FiCpu />,
    FiBook: <FiBook />,
    FiEdit3: <FiEdit3 />,
    FiHeadphones: <FiHeadphones />,
    FiZap: <FiZap />,
    FiFileText: <FiFileText />,
    FiPenTool: <FiPenTool />,
    FiHelpCircle: <FiHelpCircle />,
    FiMessageSquare: <FiMessageSquare />,
    FiSmartphone: <FiSmartphone />,
    FiCode: <FiCode />,
    FiArrowRight: <FiArrowRight />,
    FiGlobeIcon: <FiGlobeIcon />,
  }), []);

  const renderIcon = (key?: string) => (key && iconMap[key] ? iconMap[key] : <FiFileText />);

  const SOLUTION_CATEGORIES = useMemo(() => h?.nav?.solutions?.categories ?? [], [h]);

  const [activeSolutionKey, setActiveSolutionKey] = useState<string>("publishing");

  useEffect(() => {
    const next =
      h?.nav?.solutions?.defaultActiveKey ||
      SOLUTION_CATEGORIES[0]?.key ||
      "publishing";
    setActiveSolutionKey((prev) => prev || next);
  }, [SOLUTION_CATEGORIES, h]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [mobileOpen]);

  const toggleGroup = (key: typeof openGroup) => {
    setOpenGroup((prev) => (prev === key ? null : key));
  };

  const normalizePath = (p: string) => {
    if (!p) return "/";
    if (p.length > 1 && p.endsWith("/")) return p.slice(0, -1);
    return p;
  };

  const currentPath = useMemo(() => normalizePath(pathname || "/"), [pathname]);

  const isActive = (href: string) => {
    const target = normalizePath(href);
    if (target === "/") return currentPath === "/";
    return currentPath === target || currentPath.startsWith(`${target}/`);
  };

  const isGroupActive = (prefixes: string[]) => prefixes.some((p) => isActive(p));

  const homeActive = isGroupActive(["/", "/about", "/contact"]);
  const solutionPaths = useMemo(() => SOLUTION_CATEGORIES.map(c => c.href).filter(Boolean) as string[], [SOLUTION_CATEGORIES]);
  const solutionsActive = isGroupActive(["/solutions", ...solutionPaths]);
  const productsActive = isGroupActive(["/products", "/arohio"]);
  const resourcesActive = isGroupActive(["/feedback", "/blog", "/faqs", "/case-studies"]);

  const closeSolutionsTimer = useRef<number | null>(null);

  const openSolutions = () => {
    if (closeSolutionsTimer.current) window.clearTimeout(closeSolutionsTimer.current);
    setSolutionsOpen(true);
  };

  const scheduleCloseSolutions = () => {
    if (closeSolutionsTimer.current) window.clearTimeout(closeSolutionsTimer.current);
    closeSolutionsTimer.current = window.setTimeout(() => {
      setSolutionsOpen(false);
    }, 220);
  };

  useEffect(() => {
    if (!mobileOpen) return;
    if (homeActive) setOpenGroup("home");
    else if (solutionsActive) setOpenGroup("solutions");
    else if (productsActive) setOpenGroup("products");
    else if (resourcesActive) setOpenGroup("resources");
  }, [mobileOpen, homeActive, solutionsActive, productsActive, resourcesActive]);

  const activeSolution = useMemo(
    () => SOLUTION_CATEGORIES.find((c) => c.key === activeSolutionKey) || SOLUTION_CATEGORIES[0],
    [SOLUTION_CATEGORIES, activeSolutionKey]
  );

  return (
    <header>
      <div className="nx-topbar">
        <div className="nx-topbar-inner">
          <span>{h.topbar.text}</span>

          <div className="nx-topbar-icons">
            {h.topbar.socials
              .filter((s) => s.href && s.href !== "#")
              .map((s, idx, filtered) => (
                <a
                  key={s.key}
                  href={s.href}
                  style={idx === filtered.length - 1 ? iconLinkStyleNoBorder : iconLinkStyle}
                >
                  {renderIcon(s.icon)}
                </a>
              ))}
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: "var(--color-bg)" }}>
        <div className="nx-mainbar">
          <Link
            href={h.brand.href}
            className="nx-logo"
            style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "12px", 
              transform: "translateY(-2px)",
              transition: "transform 0.3s ease"
            }}
          >
            <motion.div
              initial={{ rotate: -10, scale: 0.8, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              whileHover={{ rotate: 5, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              style={{ display: "flex", alignItems: "center" }}
            >
              <img
                src="/images/nexografix_logo.png"
                alt="NG Logo"
                style={{ 
                  height: "52px", 
                  width: "auto",
                  filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.05))"
                }}
              />
            </motion.div>
            <motion.span 
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              style={{ 
                background: "linear-gradient(135deg, #0f172a 0%, #ea580c 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: "900",
                fontSize: "26px",
                letterSpacing: "-0.02em"
              }}
            >
              {h.brand.name}
            </motion.span>
          </Link>


          <nav className="nx-desktop-nav">
            <div className={`nx-menu ${homeActive ? "nx-menu-active" : ""}`}>
              <span className="nx-menu-title">
                <span className="nx-menu-icon">{renderIcon(h.nav.home.icon)}</span>
                <span>{h.nav.home.label}</span>
                <FiChevronDown className="nx-chevron" />
              </span>
              <div className="nx-dropdown">
                {h.nav.home.items.map((it) => (
                  <Link key={it.href} href={it.href} className={`nx-dd-item ${isActive(it.href) ? "nx-active" : ""}`}>
                    {renderIcon(it.icon)}
                    {it.title}
                  </Link>
                ))}
              </div>
            </div>

            <div className={`nx-menu ${solutionsActive ? "nx-menu-active" : ""}`} onMouseEnter={openSolutions} onMouseLeave={scheduleCloseSolutions}>
              <span className="nx-menu-title">
                <span className="nx-menu-icon">{renderIcon(h.nav.solutions.icon)}</span>
                <span>{h.nav.solutions.label}</span>
                <FiChevronDown className="nx-chevron" />
              </span>

              {solutionsOpen && SOLUTION_CATEGORIES.length > 0 && (
                <div className="nx-dropdown nx-mega" onMouseEnter={openSolutions} onMouseLeave={scheduleCloseSolutions}>
                  <div className="nx-mega-left">
                    {SOLUTION_CATEGORIES.map((cat) => {
                      const isCatActive = cat.key === activeSolutionKey;
                      const targetHref = cat.items?.[0]?.href || cat.href || "#";
                      return (
                        <Link
                          key={cat.key}
                          href={targetHref}
                          className={`nx-dd-item nx-mega-cat ${isCatActive ? "nx-active" : ""}`}
                          onMouseEnter={() => setActiveSolutionKey(cat.key)}
                          onFocus={() => setActiveSolutionKey(cat.key)}
                          onClick={() => setSolutionsOpen(false)}
                        >
                          <span className="nx-mega-cat-left">
                            {renderIcon(cat.icon)}
                            <span className="nx-mega-cat-title">{cat.title}</span>
                          </span>
                          <FiArrowRight className="nx-mega-arrow" />
                        </Link>
                      );
                    })}
                  </div>

                  <div className="nx-mega-right">
                    <div className="nx-mega-grid">
                      {activeSolution?.items?.map((it) => (
                        <Link key={it.href} href={it.href} className={`nx-dd-item nx-mega-item ${isActive(it.href) ? "nx-active" : ""}`}>
                          {renderIcon(it.icon)}
                          <span>{it.title}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className={`nx-menu ${productsActive ? "nx-menu-active" : ""}`}>
              <span className="nx-menu-title">
                <span className="nx-menu-icon">{renderIcon(h.nav.products.icon)}</span>
                <span>{h.nav.products.label}</span>
                <FiChevronDown className="nx-chevron" />
              </span>
              <div className="nx-dropdown">
                {h.nav.products.items.map((it) => (
                  <Link key={it.href} href={it.href} className={`nx-dd-item ${isActive(it.href) ? "nx-active" : ""}`}>
                    {renderIcon(it.icon)}
                    {it.title}
                  </Link>
                ))}
              </div>
            </div>

            <div className={`nx-menu ${resourcesActive ? "nx-menu-active" : ""}`}>
              <span className="nx-menu-title">
                <span className="nx-menu-icon">{renderIcon(h.nav.resources.icon)}</span>
                <span>{h.nav.resources.label}</span>
                <FiChevronDown className="nx-chevron" />
              </span>
              <div className="nx-dropdown">
                {h.nav.resources.items.map((it) => (
                  <Link key={it.href} href={it.href} className={`nx-dd-item ${isActive(it.href) ? "nx-active" : ""}`}>
                    {renderIcon(it.icon)}
                    {it.title}
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          <div className="nx-desktop-cta">
            <Link href={h.cta.href} className={`demo-btn ${isActive(h.cta.href) ? "nx-active" : ""}`}>
              {h.cta.label}
            </Link>
          </div>

          <button
            className="nx-mobile-btn"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((v) => !v)}
            type="button"
          >
            {mobileOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="nx-mobile-overlay" onClick={() => setMobileOpen(false)}>
          <div className="nx-mobile-panel" onClick={(e) => e.stopPropagation()}>
            <div className="nx-mobile-panel-head">
              <Link
                href="/"
                className="nx-mobile-logo"
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "10px",
                  transform: "translateY(-1px)" 
                }}
                onClick={() => setMobileOpen(false)}
              >
                <motion.img
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  src="/images/nexografix_logo.png"
                  alt="NG Logo"
                  style={{ height: "48px", width: "auto" }}
                />
                <motion.span
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  style={{ 
                    fontWeight: "900", 
                    fontSize: "22px",
                    background: "linear-gradient(135deg, #0f172a 0%, #ea580c 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent"
                  }}
                >
                  {h.brand.name}
                </motion.span>
              </Link>

              <button className="nx-mobile-close" onClick={() => setMobileOpen(false)} aria-label="Close" type="button">
                <FiX />
              </button>
            </div>

            <div className="nx-mobile-links">
              <button className={`nx-acc-btn ${homeActive ? "nx-menu-active" : ""}`} onClick={() => toggleGroup("home")} type="button">
                <span className="nx-acc-left">
                  {renderIcon(h.nav.home.icon)} {h.nav.home.label}
                </span>
                <FiChevronDown className={`nx-acc-chevron ${openGroup === "home" ? "open" : ""}`} />
              </button>
              {openGroup === "home" && (
                <div className="nx-acc-panel">
                  {h.nav.home.items.map((it) => (
                    <Link key={it.href} href={it.href} className={`nx-m-item ${isActive(it.href) ? "nx-active" : ""}`} onClick={() => setMobileOpen(false)}>
                      {renderIcon(it.icon)} {it.title}
                    </Link>
                  ))}
                </div>
              )}

              <button className={`nx-acc-btn ${solutionsActive ? "nx-menu-active" : ""}`} onClick={() => toggleGroup("solutions")} type="button">
                <span className="nx-acc-left">
                  {renderIcon(h.nav.solutions.icon)} {h.nav.solutions.label}
                </span>
                <FiChevronDown className={`nx-acc-chevron ${openGroup === "solutions" ? "open" : ""}`} />
              </button>

              {openGroup === "solutions" && (
                <div className="nx-acc-panel">
                  {SOLUTION_CATEGORIES.map((cat) => {
                    const isOpen = mobileSolutionOpenKey === cat.key;
                    return (
                      <div key={cat.key}>
                        <button type="button" className="nx-m-item nx-m-item-btn" onClick={() => setMobileSolutionOpenKey((prev) => (prev === cat.key ? null : cat.key))}>
                          <span className="nx-m-left">
                            {renderIcon(cat.icon)} {cat.title}
                          </span>
                          <FiChevronDown className={`nx-m-arrow ${isOpen ? "open" : ""}`} />
                        </button>

                        {isOpen && (
                          <div className="nx-m-subpanel">
                            {cat.items.map((it) => (
                              <Link key={it.href} href={it.href} className={`nx-m-subitem ${isActive(it.href) ? "nx-active" : ""}`} onClick={() => setMobileOpen(false)}>
                                {renderIcon(it.icon)} {it.title}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              <button className={`nx-acc-btn ${productsActive ? "nx-menu-active" : ""}`} onClick={() => toggleGroup("products")} type="button">
                <span className="nx-acc-left">
                  {renderIcon(h.nav.products.icon)} {h.nav.products.label}
                </span>
                <FiChevronDown className={`nx-acc-chevron ${openGroup === "products" ? "open" : ""}`} />
              </button>
              {openGroup === "products" && (
                <div className="nx-acc-panel">
                  {h.nav.products.items.map((it) => (
                    <Link key={it.href} href={it.href} className={`nx-m-item ${isActive(it.href) ? "nx-active" : ""}`} onClick={() => setMobileOpen(false)}>
                      {renderIcon(it.icon)} {it.title}
                    </Link>
                  ))}
                </div>
              )}

              <button className={`nx-acc-btn ${resourcesActive ? "nx-menu-active" : ""}`} onClick={() => toggleGroup("resources")} type="button">
                <span className="nx-acc-left">
                  {renderIcon(h.nav.resources.icon)} {h.nav.resources.label}
                </span>
                <FiChevronDown className={`nx-acc-chevron ${openGroup === "resources" ? "open" : ""}`} />
              </button>
              {openGroup === "resources" && (
                <div className="nx-acc-panel">
                  {h.nav.resources.items.map((it) => (
                    <Link key={it.href} href={it.href} className={`nx-m-item ${isActive(it.href) ? "nx-active" : ""}`} onClick={() => setMobileOpen(false)}>
                      {renderIcon(it.icon)} {it.title}
                    </Link>
                  ))}
                </div>
              )}

              <Link href={h.cta.href} className={`nx-mobile-cta ${isActive(h.cta.href) ? "nx-active" : ""}`} onClick={() => setMobileOpen(false)}>
                {h.cta.label}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
