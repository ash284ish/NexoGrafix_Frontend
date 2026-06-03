"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState, useRef } from "react";
import type { ReactNode } from "react";
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

type SolutionCategory = {
  key: string;
  title: string;
  icon: ReactNode;
  href?: string;
  items: {
    title: string;
    href: string;
    icon?: ReactNode;
  }[];
};


export default function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<null | "home" | "solutions" | "products" | "resources">(null);
  const [appointmentOpen, setAppointmentOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [mobileSolutionOpenKey, setMobileSolutionOpenKey] = useState<string | null>(null);

  const SOLUTION_CATEGORIES: SolutionCategory[] = useMemo(
    () => [
      {
        key: "publishing",
        title: "Publishing & Digitization",
        icon: <FiBook />,
        href: "/solutions/publishing",
        items: [
          { title: "Document Digitization & Scanning", href: "/publishing-digitization#digitization", icon: <FiFileText /> },
          { title: "Copyediting & Proofreading", href: "/publishing-digitization#editing", icon: <FiEdit3 /> },
          { title: "eBook Conversion (EPUB/Kindle)", href: "/publishing-digitization#ebook-conversion", icon: <FiBookOpen /> },
          { title: "XML / HTML Conversion", href: "/publishing-digitization#xml-html", icon: <FiCode /> },
          { title: "Typesetting & Layout Design", href: "/publishing-digitization#typesetting", icon: <FiPenTool /> },
          { title: "Metadata Creation & Tagging", href: "/publishing-digitization#metadata", icon: <FiLayers /> },
          { title: "Multimedia Integration", href: "/publishing-digitization#multimedia", icon: <FiHeadphones /> },
          { title: "Interactive eBook Development", href: "/publishing-digitization#interactive-ebooks", icon: <FiZap /> },
          { title: "Print-on-Demand (POD) Prep", href: "/publishing-digitization#pod", icon: <FiFileText /> },
          { title: "Magazine / Newspaper Digitization", href: "/publishing-digitization#news-mag-digitization", icon: <FiFileText /> },
        ],
      },
      {
        key: "accessibility",
        title: "Accessibility & Compliance",
        icon: <FiHelpCircle />,
        href: "/solutions/accessibility",
        items: [
          { title: "PDF Accessibility & Remediation", href: "/accessibility-compliance#pdf", icon: <FiFileText /> },
          { title: "eBook Accessibility (EPUB)", href: "/accessibility-compliance#epub", icon: <FiBookOpen /> },
          { title: "Educational Content Accessibility", href: "/accessibility-compliance#education", icon: <FiBook /> },
          { title: "Website / HTML Accessibility", href: "/accessibility-compliance#web", icon: <FiCode /> },
          { title: "DOCX / PPTX / Excel Accessibility", href: "/accessibility-compliance#documents", icon: <FiLayers /> },
          { title: "Audio/Video Accessibility", href: "/accessibility-compliance#media", icon: <FiHeadphones /> },
          { title: "Audits & Compliance Reporting", href: "/accessibility-compliance#audits", icon: <FiFileText /> },
          { title: "Assistive Tech Testing", href: "/accessibility-compliance#testing", icon: <FiCpu /> },
          { title: "Govt / Institutional Compliance", href: "/accessibility-compliance#institutional", icon: <FiUser /> },
          { title: "Consulting & Training", href: "/accessibility-compliance#training", icon: <FiEdit3 /> },
        ],
      },
      {
        key: "it",
        title: "IT & Digital Platforms",
        icon: <FiCpu />,
        href: "/solutions/it",
        items: [
          { title: "Web Development", href: "/digital-platforms#web-development", icon: <FiCode /> },
          { title: "UI / UX Design", href: "/digital-platforms#ui-ux", icon: <FiPenTool /> },
          { title: "Mobile App Development", href: "/digital-platforms#mobile-development", icon: <FiSmartphone /> },
          { title: "E-commerce Development", href: "/digital-platforms#ecommerce", icon: <FiBox /> },
          { title: "Custom Software Development", href: "/digital-platforms#custom-software", icon: <FiZap /> },
          { title: "EdTech / LMS Development", href: "/digital-platforms#edtech-lms", icon: <FiBookOpen /> },
          { title: "AI & Automation", href: "/digital-platforms#ai-automation", icon: <FiZap /> },
          { title: "CMS / DAM / Content Systems", href: "/digital-platforms#cms-dam", icon: <FiLayers /> },
          { title: "API & Integrations", href: "/digital-platforms#integrations", icon: <FiCode /> },
        ],
      },
      {
        key: "labeling",
        title: "Data Labeling & Annotation",
        icon: <FiLayers />,
        href: "/solutions/data-labeling",
        items: [
          { title: "Image Annotation", href: "/data-labeling#data-labeling/image", icon: <FiFileText /> },
          { title: "Video Annotation", href: "/data-labeling#data-labeling/video", icon: <FiFileText /> },
          { title: "LiDAR / 3D Annotation", href: "/data-labeling#data-labeling/lidar", icon: <FiFileText /> },
          { title: "Text Data Annotation (NLP)", href: "/data-labeling#data-labeling/text", icon: <FiFileText /> },
          { title: "Audio / Speech Annotation", href: "/data-labeling#data-labeling/audio", icon: <FiHeadphones /> },
          { title: "Dataset Creation & Management", href: "/data-labeling#data-labeling/datasets", icon: <FiLayers /> },
          { title: "QA & Validation", href: "/data-labeling#data-labeling/qa", icon: <FiHelpCircle /> },
        ],
      },
      {
        key: "localization",
        title: "Localization & Media Accessibility",
        icon: <FiHeadphones />,
        href: "/solutions/localization",
        items: [
          { title: "Audio Description", href: "/localization-media#localization/audio-description", icon: <FiHeadphones /> },
          { title: "Subtitles / Captions", href: "/localization-media#localization/captions", icon: <FiFileText /> },
          { title: "Transcription", href: "/localization-media#localization/transcription", icon: <FiFileText /> },
          { title: "Video Accessibility", href: "/localization-media#localization/video-accessibility", icon: <FiCode /> },
          { title: "Image Description", href: "/localization-media#localization/image-description", icon: <FiFileText /> },
          { title: "Video Visual Narration", href: "/localization-media#localization/visual-narration", icon: <FiPenTool /> },
          { title: "Translation (Text & Media)", href: "/localization-media#localization/translation", icon: <FiGlobeIcon /> as any },
        ],
      },
      {
        key: "elearning",
        title: "Content, eLearning & EdTech",
        icon: <FiBookOpen />,
        href: "/solutions/elearning",
        items: [
          { title: "Educational Content Development", href: "/elearning-edtech#elearning/educational-content", icon: <FiBook /> },
          { title: "eLearning Content Development", href: "/elearning-edtech#elearning/elearning-content", icon: <FiBookOpen /> },
          { title: "EdTech Content Services", href: "/elearning-edtech#elearning/edtech-content", icon: <FiCpu /> },
          { title: "K-12 Content Development", href: "/elearning-edtech#elearning/k12", icon: <FiBook /> },
          { title: "Assessments / Question Banks", href: "/elearning-edtech#elearning/assessments", icon: <FiFileText /> },
          { title: "Curriculum / Instructional Design", href: "/elearning-edtech#elearning/curriculum", icon: <FiPenTool /> },
          { title: "Video Learning Content", href: "/elearning-edtech#elearning/video-learning", icon: <FiHeadphones /> },
        ],
      },
    ],
    []
  );

  const [activeSolutionKey, setActiveSolutionKey] = useState<string>(SOLUTION_CATEGORIES[0]?.key || "publishing");

  useEffect(() => {
    if (!SOLUTION_CATEGORIES?.length) return;
    setActiveSolutionKey((prev) => prev || SOLUTION_CATEGORIES[0].key);
  }, [SOLUTION_CATEGORIES]);

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
  const solutionsActive = isGroupActive(["/solutions"]);
  const productsActive = isGroupActive(["/products"]);
  const resourcesActive = isGroupActive(["/feedback", "/blog", "/faqs"]);
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
          <span>AI-enabled services for Publishing, Content, Assessments & Automation — Enterprise delivery standards.</span>

          <div className="nx-topbar-icons">
            <a href="#" style={iconLinkStyle}>
              <FaFacebookF size={16} />
            </a>
            <a href="#" style={iconLinkStyle}>
              <FaTwitter size={16} />
            </a>
            <a href="#" style={iconLinkStyle}>
              <FaLinkedinIn size={16} />
            </a>
            <a href="#" style={iconLinkStyleNoBorder}>
              <FaGoogle size={16} />
            </a>
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: "var(--color-bg)" }}>
        <div className="nx-mainbar">
          <div className="nx-logo">Nexografix</div>

          <nav className="nx-desktop-nav">
            <div className={`nx-menu ${homeActive ? "nx-menu-active" : ""}`}>
              <span className="nx-menu-title">
                <span className="nx-menu-icon">
                  <FiHome />
                </span>
                <span>Home</span>
                <FiChevronDown className="nx-chevron" />
              </span>
              <div className="nx-dropdown">
                <Link href="/" className={`nx-dd-item ${isActive("/") ? "nx-active" : ""}`}>
                  <FiHome /> Homepage
                </Link>
                <Link href="/about" className={`nx-dd-item ${isActive("/about") ? "nx-active" : ""}`}>
                  <FiUser /> About Us
                </Link>
                <Link href="/contact" className={`nx-dd-item ${isActive("/contact") ? "nx-active" : ""}`}>
                  <FiMail /> Contact Us
                </Link>
              </div>
            </div>

            <div
              className={`nx-menu ${solutionsActive ? "nx-menu-active" : ""}`}
              onMouseEnter={openSolutions}
              onMouseLeave={scheduleCloseSolutions}

            >
              <span className="nx-menu-title">
                <span className="nx-menu-icon">
                  <FiLayers />
                </span>
                <span>Solutions</span>
                <FiChevronDown className="nx-chevron" />
              </span>
              {solutionsOpen && (
                <div
                  className="nx-dropdown nx-mega"
                  onMouseEnter={openSolutions}
                  onMouseLeave={scheduleCloseSolutions}
                >
                  <div className="nx-mega-left">
                    {SOLUTION_CATEGORIES.map((cat) => {
                      const isCatActive = cat.key === activeSolutionKey;
                      return (
                        <button
                          key={cat.key}
                          type="button"
                          className={`nx-dd-item nx-mega-cat ${isCatActive ? "nx-active" : ""}`}
                          onMouseEnter={() => setActiveSolutionKey(cat.key)}
                          onFocus={() => setActiveSolutionKey(cat.key)}
                        >
                          <span className="nx-mega-cat-left">
                            {cat.icon}
                            <span className="nx-mega-cat-title">{cat.title}</span>
                          </span>
                          <FiArrowRight className="nx-mega-arrow" />
                        </button>
                      );
                    })}
                  </div>

                  <div className="nx-mega-right">
                    <div className="nx-mega-grid">
                      {activeSolution?.items?.map((it) => (
                        <Link
                          key={it.href}
                          href={it.href}
                          className={`nx-dd-item nx-mega-item ${isActive(it.href) ? "nx-active" : ""}`}
                        >
                          {it.icon ? it.icon : <FiFileText />}
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
                <span className="nx-menu-icon">
                  <FiBox />
                </span>
                <span>Products</span>
                <FiChevronDown className="nx-chevron" />
              </span>
              <div className="nx-dropdown">
                <Link href="/arohio" className={`nx-dd-item ${isActive("/arohio") ? "nx-active" : ""}`}>
                  <FiZap /> Arohio.ai
                </Link>
              </div>
            </div>

            <div className={`nx-menu ${resourcesActive ? "nx-menu-active" : ""}`}>
              <span className="nx-menu-title">
                <span className="nx-menu-icon">
                  <FiBookOpen />
                </span>
                <span>Resources</span>
                <FiChevronDown className="nx-chevron" />
              </span>
              <div className="nx-dropdown">
                <Link href="/feedback" className={`nx-dd-item ${isActive("/feedback") ? "nx-active" : ""}`}>
                  <FiMessageSquare /> Feedback
                </Link>

                <Link href="/blog" className={`nx-dd-item ${isActive("/blog") ? "nx-active" : ""}`}>
                  <FiPenTool /> Insights / Blog
                </Link>

                <Link href="/faqs" className={`nx-dd-item ${isActive("/faqs") ? "nx-active" : ""}`}>
                  <FiHelpCircle /> FAQs
                </Link>
              </div>
            </div>
          </nav>

          <div className="nx-desktop-cta">
            <Link href="/contact" className={`demo-btn ${isActive("/contact") ? "nx-active" : ""}`}>
              Book an Appointment
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
              <div className="nx-mobile-logo">Nexografix</div>
              <button className="nx-mobile-close" onClick={() => setMobileOpen(false)} aria-label="Close" type="button">
                <FiX />
              </button>
            </div>

            <div className="nx-mobile-links">
              <button className={`nx-acc-btn ${homeActive ? "nx-menu-active" : ""}`} onClick={() => toggleGroup("home")} type="button">
                <span className="nx-acc-left">
                  <FiHome /> Home
                </span>
                <FiChevronDown className={`nx-acc-chevron ${openGroup === "home" ? "open" : ""}`} />
              </button>
              {openGroup === "home" && (
                <div className="nx-acc-panel">
                  <Link href="/" className={`nx-m-item ${isActive("/") ? "nx-active" : ""}`} onClick={() => setMobileOpen(false)}>
                    <FiHome /> Homepage
                  </Link>
                  <Link href="/about" className={`nx-m-item ${isActive("/about") ? "nx-active" : ""}`} onClick={() => setMobileOpen(false)}>
                    <FiUser /> About Us
                  </Link>
                  <Link href="/contact" className={`nx-m-item ${isActive("/contact") ? "nx-active" : ""}`} onClick={() => setMobileOpen(false)}>
                    <FiMail /> Contact Us
                  </Link>
                </div>
              )}

              <button className={`nx-acc-btn ${solutionsActive ? "nx-menu-active" : ""}`} onClick={() => toggleGroup("solutions")} type="button">
                <span className="nx-acc-left">
                  <FiLayers /> Solutions
                </span>
                <FiChevronDown className={`nx-acc-chevron ${openGroup === "solutions" ? "open" : ""}`} />
              </button>

              {openGroup === "solutions" && (
                <div className="nx-acc-panel">
                  {SOLUTION_CATEGORIES.map((cat) => {
                    const isOpen = mobileSolutionOpenKey === cat.key;

                    return (
                      <div key={cat.key}>
                        {/* category row with arrow */}
                        <button
                          type="button"
                          className="nx-m-item nx-m-item-btn"
                          onClick={() =>
                            setMobileSolutionOpenKey((prev) => (prev === cat.key ? null : cat.key))
                          }
                        >
                          <span className="nx-m-left">
                            {cat.icon} {cat.title}
                          </span>

                          <FiChevronDown className={`nx-m-arrow ${isOpen ? "open" : ""}`} />
                        </button>

                        {/* sub items */}
                        {isOpen && (
                          <div className="nx-m-subpanel">
                            {cat.items.map((it) => (
                              <Link
                                key={it.href}
                                href={it.href}
                                className={`nx-m-subitem ${isActive(it.href) ? "nx-active" : ""}`}
                                onClick={() => setMobileOpen(false)}
                              >
                                {it.icon ? it.icon : <FiFileText />} {it.title}
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
                  <FiBox /> Products
                </span>
                <FiChevronDown className={`nx-acc-chevron ${openGroup === "products" ? "open" : ""}`} />
              </button>
              {openGroup === "products" && (
                <div className="nx-acc-panel">
                  <Link
                    href="/arohio"
                    className={`nx-m-item ${isActive("/arohio") ? "nx-active" : ""}`}
                    onClick={() => setMobileOpen(false)}
                  >
                    <FiZap /> Arohio.ai
                  </Link>
                </div>
              )}

              <button className={`nx-acc-btn ${resourcesActive ? "nx-menu-active" : ""}`} onClick={() => toggleGroup("resources")} type="button">
                <span className="nx-acc-left">
                  <FiBookOpen /> Resources
                </span>
                <FiChevronDown className={`nx-acc-chevron ${openGroup === "resources" ? "open" : ""}`} />
              </button>
              {openGroup === "resources" && (
                <div className="nx-acc-panel">
                  <Link href="/feedback" className={`nx-m-item ${isActive("/feedback") ? "nx-active" : ""}`} onClick={() => setMobileOpen(false)}>
                    <FiMessageSquare /> Feedback
                  </Link>
                  <Link href="/blog" className={`nx-m-item ${isActive("/blog") ? "nx-active" : ""}`} onClick={() => setMobileOpen(false)}>
                    <FiPenTool /> Insights / Blog
                  </Link>
                  <Link href="/faqs" className={`nx-m-item ${isActive("/faqs") ? "nx-active" : ""}`} onClick={() => setMobileOpen(false)}>
                    <FiHelpCircle /> FAQs
                  </Link>
                </div>
              )}

              <Link href="/contact" className={`nx-mobile-cta ${isActive("/contact") ? "nx-active" : ""}`} onClick={() => setMobileOpen(false)}>
                Book an Appointment
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
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
