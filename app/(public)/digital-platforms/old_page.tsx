"use client";

import React, { useMemo } from "react";
import { motion, type Variants } from "framer-motion";
import {
  FiCode,
  FiLayers,
  FiSmartphone,
  FiShoppingCart,
  FiSettings,
  FiBookOpen,
  FiZap,
  FiDatabase,
  FiLink2,
  FiShield,
  FiBarChart2,
  FiCheckCircle,
  FiFileText,
} from "react-icons/fi";

import ProofStatsSection, { defaultIcons, type StatItem } from "@/components/sections/ProofStatsSection";
import ContactCTASection from "@/components/sections/ContactCTASection";
import ServicesCarouselSection from "@/components/sections/ServicesCarouselSection";
import ServiceHeroSection from "@/components/sections/ServiceHeroSection";

type ServiceItem = {
  id: string;
  title: string;
  desc: string;
  Icon: React.ComponentType<{ className?: string }>;
  image: { src: string; alt: string };
  bullets?: string[];
};

const pageWrap: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

export default function ITServicesPage() {
  const pageTitle = "IT Services";
  const pageSubtitle =
    "Scalable, secure, and product-grade technology services—from websites and mobile apps to custom platforms, EdTech systems, and AI automation.";

  const heroImage =
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=2000&q=80";

  const pills = ["Web & Mobile", "UI/UX", "E-commerce", "Custom Software", "EdTech/LMS", "AI & Automation", "APIs & Integrations"];

  const proofStats: StatItem[] = useMemo(
    () => [
      {
        id: "projects",
        icon: defaultIcons.projects,
        value: 500,
        suffix: "+",
        label: "Projects shipped",
        hint: "Web, mobile, portals, and internal tools delivered with production-ready standards.",
      },
      {
        id: "qa",
        icon: defaultIcons.qa,
        value: 99,
        suffix: "%",
        label: "Delivery reliability",
        hint: "Clean builds, structured QA, and stable releases—so your team can scale confidently.",
        highlight: true,
      },
      {
        id: "partners",
        icon: defaultIcons.partners,
        value: 120,
        suffix: "+",
        label: "Teams supported",
        hint: "Publishers, EdTechs, SMEs, and growing product teams across multiple domains.",
      },
    ],
    []
  );

  const services: ServiceItem[] = useMemo(
    () => [
      {
        id: "web-platforms",
        title: "Web Development & Digital Platforms",
        desc: "Scalable and secure web solutions built for content-heavy businesses and modern digital operations.",
        Icon: FiCode,
        image: {
          src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80",
          alt: "Web development and digital platforms",
        },
        bullets: [
          "Corporate & business websites",
          "Publisher & EdTech portals",
          "CMS (WordPress / Headless)",
          "SEO, multilingual & performance focused",
        ],
      },
      {
        id: "ui-ux",
        title: "UI / UX Design Services",
        desc: "User-centric design focused on usability, accessibility, and conversion—so the product feels premium and easy to use.",
        Icon: FiLayers,
        image: {
          src: "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=1600&q=80",
          alt: "UI UX design services",
        },
        bullets: [
          "UI design (web & mobile)",
          "UX research & journey mapping",
          "Figma wireframes & prototypes",
          "Design systems & accessibility-first UI",
        ],
      },
      {
        id: "mobile-apps",
        title: "Mobile App Development (Native & Hybrid)",
        desc: "High-performance Android, iOS, and cross-platform apps built for real users, real scale, and clean store-ready launches.",
        Icon: FiSmartphone,
        image: {
          src: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1600&q=80",
          alt: "Mobile app development",
        },
        bullets: [
          "Native Android & iOS apps",
          "Flutter / React Native hybrid apps",
          "EdTech & learning apps",
          "Performance + store optimization",
        ],
      },
      {
        id: "ecommerce",
        title: "E-commerce Website & App Development",
        desc: "End-to-end e-commerce platforms with reliable payments, catalog workflows, and mobile-first experiences.",
        Icon: FiShoppingCart,
        image: {
          src: "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=1600&q=80",
          alt: "E-commerce development",
        },
        bullets: [
          "Custom e-commerce builds",
          "Shopify / WooCommerce / Magento",
          "Payments + shipping + tax automation",
          "Mobile-first e-commerce apps",
        ],
      },
      {
        id: "custom-software",
        title: "Custom Software Development",
        desc: "Tailor-made software for publishing and business workflows—automation, dashboards, portals, and internal tools that fit your process.",
        Icon: FiSettings,
        image: {
          src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80",
          alt: "Custom software development",
        },
        bullets: [
          "Custom web applications",
          "Workflow & process automation",
          "Content/manuscript tracking systems",
          "Admin dashboards & API-driven platforms",
        ],
      },
      {
        id: "edtech-lms",
        title: "EdTech & LMS Development",
        desc: "Learning platforms and assessment systems built for growth—course delivery, quizzes, analytics, and scalable dashboards.",
        Icon: FiBookOpen,
        image: {
          src: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=1600&q=80",
          alt: "EdTech and LMS development",
        },
        bullets: [
          "LMS & course platforms",
          "Quiz/test/assessment engines",
          "SCORM / xAPI integration",
          "Student/teacher dashboards + analytics",
        ],
      },
      {
        id: "ai-automation",
        title: "AI & Automation Solutions",
        desc: "Smart systems to reduce manual work—AI-based processing, automation, and integrations that save time and cost.",
        Icon: FiZap,
        image: {
          src: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=1600&q=80",
          alt: "AI and automation solutions",
        },
        bullets: [
          "AI-based content processing",
          "Auto-tagging & metadata generation",
          "Chatbots & virtual assistants",
          "Automated QA, validation & workflow automation",
        ],
      },
      {
        id: "cms-dam",
        title: "CMS, DAM & Content Systems",
        desc: "Content management at scale—structured workflows, headless architecture, versioning, and single-source publishing systems.",
        Icon: FiDatabase,
        image: {
          src: "https://images.unsplash.com/photo-1556155092-8707de31f9c4?auto=format&fit=crop&w=1600&q=80",
          alt: "CMS and DAM systems",
        },
        bullets: [
          "CMS setup & customization",
          "Digital Asset Management (DAM)",
          "XML-based content systems",
          "Headless CMS + content reuse/versioning",
        ],
      },
      {
        id: "api-integrations",
        title: "API Integration & Third-Party Tools",
        desc: "Seamless system connectivity across payments, LMS/ERP/CRM, analytics, email tools, and cloud services.",
        Icon: FiLink2,
        image: {
          src: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=80",
          alt: "API integration services",
        },
        bullets: [
          "Payment gateway integration",
          "LMS / ERP / CRM integrations",
          "Marketing/email + analytics tools",
          "Cloud service integrations & reporting",
        ],
      },
    ],
    []
  );

  return (
    <motion.section variants={pageWrap} initial="hidden" animate="show" className="relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-64 left-[-280px] h-[720px] w-[720px] rounded-full bg-orange-300/14 blur-3xl" />
        <div className="absolute top-[140px] right-[-320px] h-[760px] w-[760px] rounded-full bg-orange-400/10 blur-3xl" />
        <div className="absolute bottom-[-320px] left-[20%] h-[720px] w-[720px] rounded-full bg-orange-200/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(0,0,0,0.03)_100%)]" />
      </div>

      <div className="relative mx-auto max-w-[80rem] px-7 py-14 sm:px-8 sm:py-20">
        <ServiceHeroSection
          eyebrow="IT SERVICES"
          title={pageTitle}
          subtitle={pageSubtitle}
          heroImage={{ src: heroImage, alt: pageTitle }}
          chips={[
            { icon: <FiShield className="text-[var(--color-brand-dark)]" />, text: "Secure, scalable engineering" },
            { icon: <FiBarChart2 className="text-[var(--color-brand-dark)]" />, text: "Performance-first delivery" },
          ]}
          pills={pills}
          badges={[
            <>
              <FiCheckCircle /> Production-ready builds
            </>,
            <>
              <FiFileText /> Clear scope & milestones
            </>,
            <>
              <FiZap /> Automation-friendly systems
            </>,
          ]}
          primaryCta={{ href: "/contact", label: "Request a Quote" }}
          noteText="Built for long-term scalability"
        />

        <div className="mx-auto mt-16 max-w-7xl">
          <ProofStatsSection
            eyebrow="TRUST METRICS"
            heading="Technology delivery you can depend on"
            subheading="From design to deployment, we deliver stable systems with clean engineering practices, measurable performance, and predictable outcomes."
            stats={proofStats}
            columns={3}
            centered
          />
        </div>

        <div className="mx-auto mt-12 max-w-7xl">
          <ServicesCarouselSection
            slides={services}
            eyebrow="SERVICES"
            heading="IT services & capabilities"
            subheading="Browse our IT services through a guided carousel—each capability highlights what we build, how we deliver, and how it supports your growth."
            autoRotateMs={6500}
            pauseOnHover
            showTabs
          />
        </div>

        <div className="mx-auto max-w-7xl">
          <ContactCTASection
            eyebrow="NEXT STEP"
            heading="Want to build or modernize your digital platform?"
            subheading="Share your goals, preferred stack, and timelines—we’ll propose a delivery plan with clear milestones, architecture guidance, and launch-ready execution."
            primaryCta={{ href: "/contact", label: "Request a Quote" }}
            bullets={[
              "Project type (website / app / platform / internal tool)",
              "Key features and target users",
              "Preferred tech stack (optional)",
              "Integrations needed (payments, LMS, CRM, analytics)",
              "Timeline and launch expectations",
            ]}
            noteText="Usually respond within 24 hours (business days)"
          />
        </div>
      </div>
    </motion.section>
  );
}
