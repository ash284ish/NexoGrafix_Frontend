"use client";

import React, { useMemo } from "react";
import { useParams, notFound } from "next/navigation";
import { motion } from "framer-motion";
import { itServices } from "@/data/itServices";
import ServiceHeroSection from "@/components/sections/ServiceHeroSection";
import ContactCTASection from "@/components/sections/ContactCTASection";
import { FiCheckCircle, FiShield, FiArrowLeft } from "react-icons/fi";
import Link from "next/link";

export default function ITServiceDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const service = useMemo(() => {
    return itServices.find((s) => s.id === slug);
  }, [slug]);

  if (!service) {
    return notFound();
  }

  const Icon = service.Icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white min-h-screen"
    >
      {/* Back button */}
      <div className="max-w-7xl mx-auto px-6 pt-8">
        <Link 
          href="/digital-platforms" 
          className="inline-flex items-center gap-2 text-sm font-bold text-orange-600 hover:text-slate-900 transition-colors"
        >
          <FiArrowLeft /> Back to IT Platforms
        </Link>
      </div>

      <div className="relative mx-auto max-w-7xl px-7 py-10 sm:px-8">
        <ServiceHeroSection
          eyebrow="IT & DIGITAL PLATFORMS"
          title={service.title}
          subtitle={service.desc}
          heroImage={service.image}
          pills={service.bullets}
          chips={[
            { icon: <FiShield className="text-orange-600" />, text: "Enterprise Grade" },
            { icon: <Icon className="text-orange-600" />, text: service.title }
          ]}
          badges={[
            <><FiCheckCircle /> Quality Assured</>,
            <><FiCheckCircle /> Expert Team</>
          ]}
          primaryCta={{ href: "/contact", label: "Get a Quote" }}
          noteText="Clean code. Modern stack. Scalable results."
        />

        <div className="mt-20 max-w-4xl">
          <h2 className="text-3xl font-extrabold text-slate-900">Deep Dive</h2>
          <p className="mt-6 text-lg text-slate-700 leading-relaxed whitespace-pre-line">
            {service.longDesc || service.desc}
          </p>

          <div className="mt-12 grid sm:grid-cols-2 gap-6">
            {service.bullets.map((bullet, idx) => (
              <div key={idx} className="flex items-start gap-4 p-6 rounded-xl border border-orange-100 bg-orange-50/30">
                <FiCheckCircle className="mt-1 text-orange-600 shrink-0" />
                <span className="font-bold text-slate-800">{bullet}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20">
          <ContactCTASection
            eyebrow="READY TO BUILD?"
            heading={`Start your ${service.title} project today`}
            subheading="Our engineers and designers are ready to help you bring your vision to life with modern technology and proven workflows."
            primaryCta={{ href: "/contact", label: "Book a Strategy Call" }}
            bullets={[
              "Free technical consultation",
              "Detailed project roadmap",
              "Resource & budget planning",
              "Security & compliance review"
            ]}
            noteText="We usually respond within 24 business hours."
          />
        </div>
      </div>
    </motion.div>
  );
}
