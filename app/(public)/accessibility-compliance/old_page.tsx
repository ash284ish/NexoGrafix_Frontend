"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import { motion, type Variants } from "framer-motion";
import {
  FiCheckCircle,
  FiArchive,
  FiEdit3,
  FiBookOpen,
  FiCode,
  FiGrid,
  FiTag,
  FiPlayCircle,
  FiZap,
  FiPrinter,
  FiFileText,
  FiArrowRight,
  FiCheckSquare,
  FiShield,
  FiLayers,
  FiClock,
  FiBarChart2,
  FiChevronLeft,
  FiChevronRight,
  FiMail,
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

function cx(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

const pageWrap: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

export default function AccessibilityServicesPage() {
  const pageTitle = "Accessibility Services";
  const pageSubtitle =
    "Make your PDFs, eBooks, websites, and learning content accessible and compliant—built for real users, assistive technology support, and global standards.";

  const heroImage =
    "https://images.unsplash.com/photo-1520975869018-1c0afc4db1b0?auto=format&fit=crop&w=2000&q=80";

  const pills = ["WCAG 2.1/2.2", "PDF/UA", "EPUB 3", "VPAT/ACR", "Screen Readers", "Education & LMS"];

  const proofStats: StatItem[] = useMemo(
    () => [
      {
        id: "projects",
        icon: defaultIcons.projects,
        value: 900,
        suffix: "+",
        label: "Documents remediated",
        hint: "PDFs, EPUBs, reports, and learning material—remediated for accessibility and real-world usability.",
      },
      {
        id: "qa",
        icon: defaultIcons.qa,
        value: 98,
        suffix: "%",
        label: "Compliance success rate",
        hint: "Rigorous validation, structured remediation, and assistive-tech checks before delivery.",
        highlight: true,
      },
      {
        id: "partners",
        icon: defaultIcons.partners,
        value: 180,
        suffix: "+",
        label: "Teams supported",
        hint: "Publishers, EdTechs, institutions, and public-sector teams with recurring accessibility needs.",
      },
    ],
    []
  );

  const services: ServiceItem[] = useMemo(
    () => [
      {
        id: "pdf-accessibility",
        title: "PDF Accessibility & Remediation",
        desc: "Make PDFs fully compliant for screen readers and assistive technologies with clean tagging, proper reading order, and accessible structure.",
        Icon: FiFileText,
        image: {
          src: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1600&q=80",
          alt: "PDF accessibility remediation",
        },
        bullets: ["Tagged PDF remediation", "Reading order + headings", "Alt text + table tagging", "WCAG + PDF/UA aligned"],
      },
      {
        id: "ebook-accessibility",
        title: "eBook Accessibility (EPUB & Digital)",
        desc: "Accessible EPUB 3 builds for global distribution with semantic structure, navigation landmarks, and read-aloud support where needed.",
        Icon: FiBookOpen,
        image: {
          src: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1600&q=80",
          alt: "Accessible EPUB development",
        },
        bullets: ["Accessible EPUB 3 conversion", "Landmarks + TOC navigation", "Semantic HTML + ARIA roles", "EPUB Accessibility 1.1 aligned"],
      },
      {
        id: "education-accessibility",
        title: "Educational Content Accessibility",
        desc: "Accessibility for textbooks, assessments, and learning materials—built for classroom, LMS, and high-volume education workflows.",
        Icon: FiLayers,
        image: {
          src: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80",
          alt: "Accessible educational content",
        },
        bullets: ["Accessible textbooks + workbooks", "Question banks + assessments", "MathML + accessible equations", "LMS-ready packaging"],
      },
      {
        id: "web-accessibility",
        title: "Website & HTML Accessibility",
        desc: "Improve accessibility across publishing platforms and content websites with audits, remediation, and user-first fixes that meet WCAG requirements.",
        Icon: FiCode,
        image: {
          src: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&q=80",
          alt: "Website accessibility services",
        },
        bullets: ["WCAG audits (manual + automated)", "ARIA labels + landmarks", "Keyboard navigation fixes", "Contrast + form accessibility"],
      },
      {
        id: "non-pdf-accessibility",
        title: "Document Accessibility (Non-PDF)",
        desc: "Accessible formats beyond PDFs—Word, PowerPoint, Excel, InDesign outputs, and structured reports designed for inclusive consumption.",
        Icon: FiGrid,
        image: {
          src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80",
          alt: "Accessible office documents",
        },
        bullets: ["Accessible DOCX", "Accessible PPTX", "Accessible Excel files", "InDesign to accessible output"],
      },
      {
        id: "multimedia-accessibility",
        title: "Audio, Video & Multimedia Accessibility",
        desc: "Make rich media accessible with captions, subtitles, transcripts, and audio descriptions—ideal for education and content distribution.",
        Icon: FiPlayCircle,
        image: {
          src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80",
          alt: "Multimedia accessibility",
        },
        bullets: ["Closed captions + subtitles", "Transcripts (multilingual)", "Audio descriptions", "Accessible player guidance"],
      },
      {
        id: "auditing-reporting",
        title: "Accessibility Auditing & Compliance Reporting",
        desc: "Formal testing and documentation to support legal, institutional, and procurement requirements—clear evidence, clear outcomes.",
        Icon: FiShield,
        image: {
          src: "https://images.unsplash.com/photo-1556155092-8707de31f9c4?auto=format&fit=crop&w=1600&q=80",
          alt: "Accessibility compliance reporting",
        },
        bullets: ["WCAG audit reports", "ACR / VPAT documentation", "PDF/UA validation", "Platform + content testing"],
      },
      {
        id: "assistive-tech-testing",
        title: "Assistive Technology Testing",
        desc: "Real-world testing using major screen readers and devices to ensure the experience works for actual users—not just checklists.",
        Icon: FiCheckSquare,
        image: {
          src: "https://images.unsplash.com/photo-1587614203976-365c74645e83?auto=format&fit=crop&w=1600&q=80",
          alt: "Assistive technology testing",
        },
        bullets: ["NVDA / JAWS / VoiceOver", "TalkBack checks", "Keyboard-only navigation", "Usability-focused verification"],
      },
      {
        id: "gov-institutional",
        title: "Government & Institutional Accessibility",
        desc: "Specialized accessibility remediation for regulated environments—public sector documents, university compliance, tenders, and legal submissions.",
        Icon: FiArchive,
        image: {
          src: "https://images.unsplash.com/photo-1454165205744-3b78555e5572?auto=format&fit=crop&w=1600&q=80",
          alt: "Government accessibility services",
        },
        bullets: ["Public sector remediation", "University compliance support", "Tender + legal submissions", "Standards-aligned delivery"],
      },
      {
        id: "consulting-training",
        title: "Accessibility Consulting & Training",
        desc: "Enable your team to create accessible content from day one with practical guidelines, training, and workflow setup tailored to your production process.",
        Icon: FiZap,
        image: {
          src: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=80",
          alt: "Accessibility consulting and training",
        },
        bullets: ["Author + designer guidelines", "Training for content teams", "Workflow setup assistance", "Checklists + templates"],
      },
    ],
    []
  );

  return (
    <motion.section variants={pageWrap} initial="hidden" animate="show" className="relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-64 -left-70 h-180 w-180 rounded-full bg-orange-300/14 blur-3xl" />
        <div className="absolute top-35 -right-80 h-190 w-190 rounded-full bg-orange-400/10 blur-3xl" />
        <div className="absolute -bottom-80 left-[20%] h-180 w-180 rounded-full bg-orange-200/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(0,0,0,0.03)_100%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-7 py-14 sm:px-8 sm:py-20">
        <ServiceHeroSection
          eyebrow="ACCESSIBILITY"
          title={pageTitle}
          subtitle={pageSubtitle}
          heroImage={{ src: heroImage, alt: pageTitle }}
          chips={[
            { icon: <FiShield className="text-(--color-brand-dark)" />, text: "Standards-led compliance delivery" },
            { icon: <FiBarChart2 className="text-(--color-brand-dark)" />, text: "Clear reporting & validation" },
          ]}
          pills={pills}
          badges={[
            <>
              <FiCheckCircle /> WCAG-aligned outputs
            </>,
            <>
              <FiFileText /> PDF/UA + EPUB support
            </>,
            <>
              <FiZap /> Assistive-tech tested
            </>,
          ]}
          primaryCta={{ href: "/contact", label: "Request a Quote" }}
          noteText="Inclusive content, built for real users"
        />

        <div className="mx-auto mt-16 max-w-7xl">
          <ProofStatsSection
            eyebrow="TRUST METRICS"
            heading="Accessibility outcomes you can rely on"
            subheading="Consistent remediation, rigorous validation, and real assistive-technology checks—so your content is compliant and usable."
            stats={proofStats}
            columns={3}
            centered
          />
        </div>

        <div className="mx-auto mt-12 max-w-7xl">
          <ServicesCarouselSection
            slides={services}
            eyebrow="SERVICES"
            heading="Accessibility services & capabilities"
            subheading="Explore our accessibility services through a guided carousel—each service highlights what we deliver, how we validate, and which standards we support."
            autoRotateMs={6500}
            pauseOnHover
            showTabs
          />
        </div>

        <div className="mx-auto max-w-7xl">
          <ContactCTASection
            eyebrow="NEXT STEP"
            heading="Want to make your content accessible and compliant?"
            subheading="Share your file types, platforms, and deadlines—we’ll recommend the best remediation plan with clear validation steps and delivery timelines."
            primaryCta={{ href: "/contact", label: "Request a Quote" }}
            bullets={[
              "Content type (PDF / EPUB / Web / Office files)",
              "Target standards (WCAG, PDF/UA, EPUB Accessibility, Section 508)",
              "Estimated volume and schedule",
              "Platform requirements (LMS, Apple Books, Kindle, web portals)",
              "Sample files (optional)",
            ]}
            noteText="Usually respond within 24 hours (business days)"
          />
        </div>
      </div>
    </motion.section>
  );
}
