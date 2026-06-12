"use client";

import React from "react";
import { motion } from "framer-motion";
import { FiExternalLink } from "react-icons/fi";

const complianceBadges = [
  {
    name: "ISO 9001:2015",
    label: "Quality Management",
    src: "/images/iso_9001.png",
    href: "https://www.iso.org/iso-9001-quality-management.html",
  },
];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function ComplianceStrip() {
  return (
    <section className="relative overflow-hidden border-y border-orange-100 bg-white py-12 md:py-16">
      <div className="pointer-events-none absolute inset-0 opacity-50">
        <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-orange-50/50 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-orange-50/50 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_2.5fr]">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="text-center lg:text-left"
          >
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
              Quality & <span className="text-orange-600">Compliance</span>
            </h2>
            <p className="mt-3 text-sm font-semibold leading-relaxed text-slate-600">
              Adhering to global standards for quality management.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            className="flex flex-wrap items-center justify-center gap-x-10 gap-y-12 md:gap-x-16 lg:justify-end"
          >
            {complianceBadges.map((badge, idx) => (
              <motion.a
                key={badge.name}
                href={badge.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 + idx * 0.1, ease: EASE }}
                className="group flex flex-col items-center gap-4 text-center transition-transform duration-300 hover:-translate-y-1 focus:outline-none"
              >
                <div className="relative flex h-20 items-center justify-center">
                  <img
                    src={badge.src}
                    alt={`${badge.name} - ${badge.label}`}
                    referrerPolicy="no-referrer"
                    className="h-14 w-auto object-contain transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute -right-2 -top-2 rounded-full bg-white p-1 text-orange-600 opacity-0 shadow-sm ring-1 ring-orange-100 transition-opacity group-hover:opacity-100">
                    <FiExternalLink size={12} />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-[12px] font-extrabold uppercase tracking-widest text-slate-900 transition-colors group-hover:text-orange-600">
                    {badge.name}
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {badge.label}
                  </div>
                </div>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
